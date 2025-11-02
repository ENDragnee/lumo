import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, formatDistanceToNow } from 'date-fns';

// Re-using the UserDetail type from your page component
interface UserDetail {
  userId: string; name: string; email: string; profileImage: string | null; registrationDate: string; status: string;
  businessName: string | null; tin: string | null; phone: string | null; address: string | null;
  overallAveragePerformance: number;
  totalModulesCount: number; completedModulesCount: number; totalTimeSpentSeconds: number;
  modulePerformance: {
    contentId: string;
    title: string;
    performanceScore: number;
    status: string;
    timeSpentSeconds: number;
  }[];
  activityTimeline: {
    id: string;
    eventType: string;
    timestamp: string;
    content: { title: string };
  }[];
}

const formatAction = (eventType: string, contentTitle: string) => {
    switch(eventType) {
      case 'start': return `Started "${contentTitle}"`;
      case 'end': return `Completed interaction with "${contentTitle}"`;
      case 'update': return `Progressed in "${contentTitle}"`;
      default: return `Interacted with "${contentTitle}"`;
    }
};

export const generateSingleUserPdf = (user: UserDetail, institutionName: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let lastY = 0; // To keep track of the bottom of the last element

  // === HEADER ===
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(user.name, 20, 25);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(user.email, 20, 32);

  doc.setFontSize(12);
  doc.text(institutionName, pageWidth - 20, 25, { align: 'right' });
  doc.setFontSize(9);
  doc.text(`Report Generated: ${format(new Date(), 'MMMM d, yyyy')}`, pageWidth - 20, 32, { align: 'right' });

  lastY = 40;
  doc.line(20, lastY, pageWidth - 20, lastY); // Separator line
  lastY += 15;

  // === PERFORMANCE OVERVIEW TABLE ===
  autoTable(doc, {
    body: [
      [`${user.completedModulesCount} / ${user.totalModulesCount}`, `${(user.totalTimeSpentSeconds / 3600).toFixed(1)}h`, `${user.overallAveragePerformance}%`],
      ['Modules Mastered', 'Total Time Spent', 'Avg. Performance'],
    ],
    startY: lastY,
    theme: 'plain',
    styles: { halign: 'center', fontSize: 12 },
    headStyles: { fontSize: 0 }, // Hide head
    bodyStyles: { cellPadding: 4 },
    rowPageBreak: 'avoid',
  });
  lastY = (doc as any).lastAutoTable.finalY + 15;

  // === MODULE PERFORMANCE TABLE ===
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Module Performance Breakdown', 20, lastY);
  lastY += 8;

  autoTable(doc, {
    head: [['Module Title', 'Status', 'Score', 'Time Spent (min)']],
    body: user.modulePerformance.map(m => [
      m.title,
      m.status.charAt(0).toUpperCase() + m.status.slice(1),
      `${Math.round(m.performanceScore)}%`,
      (m.timeSpentSeconds / 60).toFixed(0)
    ]),
    startY: lastY,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
  });
  lastY = (doc as any).lastAutoTable.finalY + 15;
  
  // === RECENT ACTIVITY TABLE ===
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Recent Activity', 20, lastY);
  lastY += 8;

  autoTable(doc, {
      head: [['Action', 'Date']],
      body: user.activityTimeline.map(a => [
          formatAction(a.eventType, a.content.title),
          formatDistanceToNow(new Date(a.timestamp), { addSuffix: true })
      ]),
      startY: lastY,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
  });

  // === FOOTER WITH PAGE NUMBERS ===
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }

  // === SAVE THE PDF ===
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  doc.save(`report_${user.name.replace(/\s+/g, '_')}_${dateStr}.pdf`);
};
