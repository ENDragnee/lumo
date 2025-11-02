import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { Types } from "mongoose";
import Content from "@/models/Content";

import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ============================================================================
// 1. Data Fetching Logic
// ============================================================================
async function fetchContentReportData(institutionId: Types.ObjectId) {
  await connectDB();
  
  // This aggregation pipeline gathers content, author, and performance metrics
  return Content.aggregate([
    // Step 1: Filter for content belonging to the institution that is not in the trash
    { $match: { institutionId: institutionId, isTrash: false } },
    
    // Step 2: Get the author's information
    { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'authorDoc' } },
    { $unwind: { path: '$authorDoc', preserveNullAndEmptyArrays: true } }, // Keep content even if author is deleted
    
    // Step 3: Get all performance records related to this content
    { $lookup: { from: 'performances', localField: '_id', foreignField: 'contentId', as: 'performances' } },
    
    // Step 4: Shape the final output and calculate metrics
    {
      $project: {
        Title: '$title',
        Status: { $cond: { if: "$isDraft", then: "Draft", else: "Published" } },
        Author: { $ifNull: ['$authorDoc.name', 'N/A'] },
        Views: { $ifNull: ['$userEngagement.views', 0] },
        Completions: { $ifNull: ['$userEngagement.completions', 0] },
        "Enrolled Users": { $size: '$performances' },
        "Avg. Score (%)": { $ifNull: [{ $round: [{ $avg: '$performances.understandingScore' }, 0] }, 0] },
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
  const worksheet = workbook.addWorksheet("Content Engagement Report");

  worksheet.columns = [
    { header: "Title", key: "Title", width: 40 },
    { header: "Status", key: "Status", width: 15 },
    { header: "Author", key: "Author", width: 25 },
    { header: "Views", key: "Views", width: 12 },
    { header: "Completions", key: "Completions", width: 15 },
    { header: "Enrolled Users", key: "Enrolled Users", width: 15 },
    { header: "Avg. Score (%)", key: "Avg. Score (%)", width: 15, style: { numFmt: '#,##0"%"' } },
    { header: "Creation Date", key: "Creation Date", width: 20 },
  ];

  // Style the header row
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF16A34A' } }; // green-600
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // Add data rows
  worksheet.addRows(data);
  
  // Center align numeric and status columns
  ['Status', 'Views', 'Completions', 'Enrolled Users', 'Avg. Score (%)'].forEach(colName => {
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
    doc.text("Content Engagement Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Institution: ${institutionName}`, 14, 30);
    
    // Define Table Structure
    const tableColumn = ["Title", "Status", "Author", "Views", "Completions", "Enrolled", "Avg. Score", "Created On"];
    const tableRows: string[][] = [];

    data.forEach(content => {
        const contentRow = [
            content.Title || 'N/A',
            content.Status || 'N/A',
            content.Author || 'N/A',
            String(content.Views || '0'),
            String(content.Completions || '0'),
            String(content["Enrolled Users"] || '0'),
            `${content["Avg. Score (%)"]}%`,
            content["Creation Date"] || 'N/A'
        ];
        tableRows.push(contentRow);
    });

    // Generate the table
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [22, 163, 74] }, // green-600
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

    const reportData = await fetchContentReportData(institutionId);

    const dateStr = new Date().toISOString().split('T')[0];

    if (format === "xlsx") {
      const buffer = await generateExcelReport(reportData);
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="content_report_${dateStr}.xlsx"`,
        },
      });
    }

    if (format === "pdf") {
      const buffer = await generatePdfReport(reportData, session.institution.name);
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="content_report_${dateStr}.pdf"`,
        },
      });
    }

  } catch (error) {
    console.error("Failed to generate content report:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
