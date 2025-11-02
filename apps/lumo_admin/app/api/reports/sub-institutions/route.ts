import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Types } from "mongoose";
import Institution from "@/models/Institution";

import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ============================================================================
// 1. Data Fetching Logic
// ============================================================================
async function fetchSubInstitutionReportData(parentId: Types.ObjectId) {
  await connectDB();
  // This aggregation pipeline gathers sub-institutions, their owners, and member counts
  return Institution.aggregate([
    { $match: { parentInstitution: parentId } },
    { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'ownerDoc' } },
    { $unwind: { path: '$ownerDoc', preserveNullAndEmptyArrays: true } }, // preserve if owner is somehow missing
    { $lookup: { from: 'institutionmembers', localField: '_id', foreignField: 'institutionId', as: 'members' } },
    {
      $project: {
        Name: '$name',
        Owner: '$ownerDoc.name',
        "Portal Key": '$portalKey',
        Status: '$subscriptionStatus',
        "Member Count": { $size: '$members' },
        "Creation Date": { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      }
    }
  ]);
}

// ============================================================================
// 2. Excel Report Generator
// ============================================================================
async function generateExcelReport(data: any[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Lumo Admin Portal";
  workbook.created = new Date();
  
  const worksheet = workbook.addWorksheet("Sub-Institution Report");

  worksheet.columns = [
    { header: "Name", key: "Name", width: 35 },
    { header: "Owner", key: "Owner", width: 30 },
    { header: "Portal Key", key: "Portal Key", width: 25 },
    { header: "Status", key: "Status", width: 15 },
    { header: "Member Count", key: "Member Count", width: 15 },
    { header: "Creation Date", key: "Creation Date", width: 20 },
  ];

  // Style the header row
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF8B5CF6' } }; // purple-500
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // Add data rows
  worksheet.addRows(data);
  
  // Center align specific columns
  worksheet.getColumn('Status').alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getColumn('Member Count').alignment = { vertical: 'middle', horizontal: 'center' };

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

// ============================================================================
// 3. PDF Report Generator
// ============================================================================
async function generatePdfReport(data: any[], institutionName: string): Promise<Buffer> {
    const doc = new jsPDF({ orientation: "landscape" });
    
    // Add Header
    doc.setFontSize(18);
    doc.text("Sub-Institution Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Parent Organization: ${institutionName}`, 14, 30);
    
    // Define Table Structure
    const tableColumn = ["Name", "Owner", "Portal Key", "Status", "Members", "Creation Date"];
    const tableRows: string[][] = [];

    data.forEach(inst => {
        const instRow = [
            inst.Name || 'N/A',
            inst.Owner || 'N/A',
            inst["Portal Key"] || 'N/A',
            inst.Status ? inst.Status.charAt(0).toUpperCase() + inst.Status.slice(1) : 'N/A',
            String(inst["Member Count"] || '0'),
            inst["Creation Date"] || 'N/A'
        ];
        tableRows.push(instRow);
    });

    // Generate the table
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [139, 92, 246] }, // purple-500
    });

    // Add Footer with page numbers
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    const buffer = Buffer.from(doc.output('arraybuffer'));
    return buffer;
}


// ============================================================================
// 4. API Route Handler
// ============================================================================
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.institution?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const institutionId = new Types.ObjectId(session.institution.id);

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");

    if (!format || (format !== "xlsx" && format !== "pdf")) {
      return new NextResponse("Invalid format specified. Use 'xlsx' or 'pdf'.", { status: 400 });
    }

    const reportData = await fetchSubInstitutionReportData(institutionId);

    const dateStr = new Date().toISOString().split('T')[0];

    if (format === "xlsx") {
      const buffer = await generateExcelReport(reportData);
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="sub_institutions_report_${dateStr}.xlsx"`,
        },
      });
    }

    if (format === "pdf") {
      const buffer = await generatePdfReport(reportData, session.institution.name);
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="sub_institutions_report_${dateStr}.pdf"`,
        },
      });
    }

  } catch (error) {
    console.error("Failed to generate sub-institution report:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
