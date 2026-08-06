import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate official PDF report for a given CivicFix issue element or data
 * @param {string} elementId - HTML container ID to convert into PDF page
 * @param {object} issue - Issue data object
 */
export const exportIssueToPDF = async (elementId, issue) => {
  const element = document.getElementById(elementId);
  
  if (element) {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`CivicFix-Report-${issue?.id || 'Doc'}.pdf`);
      return true;
    } catch (err) {
      console.warn('Canvas PDF export failed, fallback to text PDF generator:', err);
    }
  }

  // Fallback programmatic jsPDF text generator
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.setTextColor(22, 119, 255);
  doc.text('CivicFix - Official Infrastructure Issue Report', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} | Tracking ID: #${issue?.id}`, 14, 28);
  doc.line(14, 32, 196, 32);

  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text(`Title: ${issue?.title || 'Civic Complaint'}`, 14, 42);

  doc.setFontSize(11);
  doc.text(`Category: ${issue?.category || 'General'}`, 14, 52);
  doc.text(`Status: ${issue?.status || 'PENDING'}`, 14, 60);
  doc.text(`Priority: ${issue?.priority || 'MEDIUM'}`, 14, 68);
  doc.text(`Assigned Dept: ${issue?.assignedDepartment || 'Municipal Office'}`, 14, 76);
  doc.text(`Location: ${issue?.address || 'N/A'}`, 14, 84);

  doc.setFontSize(12);
  doc.text('Description:', 14, 98);
  doc.setFontSize(10);
  const splitDesc = doc.splitTextToSize(issue?.description || '', 180);
  doc.text(splitDesc, 14, 106);

  if (issue?.resolutionNotes) {
    const startY = 110 + (splitDesc.length * 6);
    doc.setFontSize(12);
    doc.setTextColor(82, 196, 26);
    doc.text('Department Resolution Notes:', 14, startY);
    doc.setFontSize(10);
    doc.setTextColor(0);
    const splitNotes = doc.splitTextToSize(issue.resolutionNotes, 180);
    doc.text(splitNotes, 14, startY + 8);
  }

  doc.save(`CivicFix-Issue-#${issue?.id || 'report'}.pdf`);
  return true;
};
