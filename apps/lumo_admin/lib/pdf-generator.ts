import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

// Define the shape of a user for the PDF function
interface UserData {
  name: string;
  email: string;
  status: string;
  registrationDate: string;
  businessName?: string | null;
}

export const generateUserPdf = (users: UserData[], institutionName: string) => {
  const doc = new jsPDF(); 
  
  // 1. Set up the document header
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(`${institutionName} - User Report`, pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${format(new Date(), 'MMMM d, yyyy')}`, pageWidth / 2, 26, { align: 'center' });

  // 2. Define table columns and rows
  const tableColumn = ["Name", "Email", "Business/Org", "Status", "Registration Date"];
  
  // ✨ FIX 1: The type is now string[][], guaranteeing no null/undefined values.
  const tableRows: string[][] = [];

  users.forEach(user => {
    // ✨ FIX 2: Create a robust, safe row where every value is guaranteed to be a string.

    // Handle date formatting defensively
    let registrationDateFormatted = 'N/A';
    if (user.status !== 'invited' && user.registrationDate) {
      try {
        const timestamp = Number(user.registrationDate);
        // Ensure the timestamp is a valid number before formatting
        if (!isNaN(timestamp)) {
          registrationDateFormatted = format(new Date(timestamp), 'yyyy-MM-dd');
        }
      } catch (e) {
        console.error("Could not format date for PDF:", user.registrationDate, e);
        // If formatting fails, it will remain 'N/A'
      }
    }
    
    // Capitalize status safely
    const statusCapitalized = (user.status || '').charAt(0).toUpperCase() + (user.status || '').slice(1);

    const userRow: string[] = [
      user.name || '', // Provide empty string as fallback
      user.email || '', // Provide empty string as fallback
      user.businessName || 'N/A', // Provide 'N/A' as fallback
      statusCapitalized,
      registrationDateFormatted,
    ];
    
    tableRows.push(userRow);
  });

  // 3. Add the table to the PDF
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows, // This now correctly matches the expected type
    startY: 35,
    theme: 'grid',
    headStyles: { fillColor: [22, 160, 133] },
    styles: { fontSize: 8 },
  });
  
  // 4. Add a footer with page numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }

  // 5. Save the PDF
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  doc.save(`user_report_${institutionName.replace(/\s+/g, '_')}_${dateStr}.pdf`);
};
