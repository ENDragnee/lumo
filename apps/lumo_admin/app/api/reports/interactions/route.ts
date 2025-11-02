import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Types } from "mongoose";
import Interaction from "@/models/Interaction";

import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ============================================================================
// 1. Data Fetching Logic
// ============================================================================
async function fetchInteractionReportData(institutionId: Types.ObjectId) {
  await connectDB();
  
  // This aggregation pipeline gathers a detailed log of all user interactions
  return Interaction.aggregate([
    // Step 1: Join with Content to get institutionId
    { $lookup: { from: 'contents', localField: 'contentId', foreignField: '_id', as: 'contentDoc' } },
    { $unwind: '$contentDoc' },
    
    // Step 2: Security Filter - Only get interactions for content belonging to the admin's institution
    { $match: { 'contentDoc.institutionId': institutionId } },
    
    // Step 3: Join with Users to get user details
    { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userDoc' } },
    { $unwind: '$userDoc' },
    
    // Step 4: Sort by most recent first
    { $sort: { timestamp: -1 } },
    
    // Step 5: Shape the final output for the report
    {
      $project: {
        _id: 0, // Exclude the default _id
        "User Name": '$userDoc.name',
        "User Email": '$userDoc.email',
        "Content Title": '$contentDoc.title',
        "Event Type": '$eventType',
        "Date": { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$timestamp", timezone: "UTC" } },
        "Duration (s)": { $ifNull: ['$durationSeconds', 'N/A'] },
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
  const worksheet = workbook.addWorksheet("Interaction Log");

  worksheet.columns = [
    { header: "User Name", key: "User Name", width: 30 },
    { header: "User Email", key: "User Email", width: 35 },
    { header: "Content Title", key: "Content Title", width: 40 },
    { header: "Event Type", key: "Event Type", width: 15 },
    { header: "Date (UTC)", key: "Date", width: 22 },
    { header: "Duration (s)", key: "Duration (s)", width: 15 },
  ];

  // Style the header row
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF97316' } }; // orange-500
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // Add data rows
  worksheet.addRows(data);
  
  // Center align specific columns
  ['Event Type', 'Duration (s)'].forEach(colName => {
      worksheet.getColumn(colName).alignment = { vertical: 'middle', horizontal: 'center' };
  });

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
    doc.text("User Interaction Log", 14, 22);
    doc.setFontSize(11);
    doc.text(`Institution: ${institutionName}`, 14, 30);
    
    // Define Table Structure
    const tableColumn = ["User", "Content", "Event", "Date (UTC)", "Duration (s)"];
    const tableRows: string[][] = [];

    data.forEach(log => {
        const logRow = [
            `${log["User Name"]}\n${log["User Email"]}`, // Combine user name and email
            log["Content Title"] || 'N/A',
            log["Event Type"] ? log["Event Type"].charAt(0).toUpperCase() + log["Event Type"].slice(1) : 'N/A',
            log["Date"] || 'N/A',
            String(log["Duration (s)"] || 'N/A'),
        ];
        tableRows.push(logRow);
    });

    // Generate the table
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [249, 115, 22] }, // orange-500
        styles: { cellPadding: 2, fontSize: 8 },
        columnStyles: {
            0: { cellWidth: 55 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 20 },
            3: { cellWidth: 35 },
            4: { cellWidth: 25, halign: 'center' },
        }
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

    const reportData = await fetchInteractionReportData(institutionId);

    const dateStr = new Date().toISOString().split('T')[0];

    if (format === "xlsx") {
      const buffer = await generateExcelReport(reportData);
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="interaction_log_${dateStr}.xlsx"`,
        },
      });
    }

    if (format === "pdf") {
      const buffer = await generatePdfReport(reportData, session.institution.name);
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="interaction_log_${dateStr}.pdf"`,
        },
      });
    }

  } catch (error) {
    console.error("Failed to generate interaction report:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
