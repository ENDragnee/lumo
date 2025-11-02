import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import InstitutionMember from "@/models/InstitutionMember";
import { Types } from "mongoose";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Data Fetching Logic ---
async function fetchUserReportData(institutionId: Types.ObjectId) {
  await connectDB();
  const usersData = await InstitutionMember.aggregate([
    { $match: { institutionId } },
    { $sort: { createdAt: -1 } },
    { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userDoc' } },
    { $unwind: '$userDoc' },
    { $lookup: { from: 'performances', localField: 'userId', foreignField: 'userId', as: 'p' } },
    {
      $project: {
        Name: '$userDoc.name',
        Email: '$userDoc.email',
        Status: '$status',
        "Registration Date": { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        "Avg Performance (%)": { $ifNull: [{ $avg: '$p.understandingScore' }, 0] },
      }
    }
  ]);
  return usersData.map(u => ({ ...u, "Avg Performance (%)": Math.round(u["Avg Performance (%)"]) }));
}

// --- Excel Generation ---
async function generateExcelReport(data: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Lumo Admin Portal";
  const worksheet = workbook.addWorksheet("User Performance Report");

  worksheet.columns = [
    { header: "Name", key: "Name", width: 30 },
    { header: "Email", key: "Email", width: 40 },
    { header: "Status", key: "Status", width: 15 },
    { header: "Registration Date", key: "Registration Date", width: 20 },
    { header: "Avg Performance (%)", key: "Avg Performance (%)", width: 20, style: { numFmt: '#,##0"%"' } },
  ];

  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
  worksheet.addRows(data);
  
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

// ✨ --- PDF Generation (FIXED & IMPROVED) --- ✨
async function generatePdfReport(data: any[], institutionName: string): Promise<Buffer> {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("User Performance Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Institution: ${institutionName}`, 14, 30);
    
    const tableColumn = ["Name", "Email", "Status", "Registration Date", "Avg Perf."];
    const tableRows: string[][] = [];

    data.forEach(user => {
        const userRow = [
            user.Name || 'N/A',
            user.Email || 'N/A',
            user.Status ? user.Status.charAt(0).toUpperCase() + user.Status.slice(1) : 'N/A',
            user["Registration Date"] || 'N/A',
            `${user["Avg Performance (%)"]}%`
        ];
        tableRows.push(userRow);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] }, // blue-600
    });

    const buffer = Buffer.from(doc.output('arraybuffer'));
    return buffer;
}


// --- API Route Handler ---
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.institution?.id) return new NextResponse("Unauthorized", { status: 401 });
    
    const institutionId = new Types.ObjectId(session.institution.id);
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");

    if (!format || (format !== "xlsx" && format !== "pdf")) {
      return new NextResponse("Invalid format specified.", { status: 400 });
    }

    const reportData = await fetchUserReportData(institutionId);

    if (format === "xlsx") {
      const buffer = await generateExcelReport(reportData);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="user_report_${new Date().toISOString().split('T')[0]}.xlsx"`,
        },
      });
    }

    if (format === "pdf") {
      // Pass institution name for the PDF header
      const buffer = await generatePdfReport(reportData, session.institution.name);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="user_report_${new Date().toISOString().split('T')[0]}.pdf"`,
        },
      });
    }

  } catch (error) {
    console.error("Failed to generate report:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
