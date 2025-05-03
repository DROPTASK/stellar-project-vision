
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generatePDF = async (elementRef: React.RefObject<HTMLDivElement>, fileName: string = 'projects.pdf') => {
  if (!elementRef.current) return;
  
  try {
    const canvas = await html2canvas(elementRef.current, {
      scale: 2,
      backgroundColor: null,
      logging: false,
      useCORS: true,
      windowWidth: elementRef.current.offsetWidth,
      windowHeight: elementRef.current.scrollHeight,
      y: 0,
      x: 0,
      scrollY: 0,
      scrollX: 0,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
    });
    
    // Calculate dimensions to fit the content properly
    const imgWidth = 190; // A4 width in mm (with margins)
    const pageHeight = 297; // A4 height in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;
    
    // Add padding to ensure content isn't cut off
    let position = 10; // Start with 10mm margin from top
    
    // If the image is taller than a page, split it across multiple pages
    if (imgHeight > pageHeight - 20) {
      let heightLeft = imgHeight;
      let pagePosition = 0;
      
      // First page
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - 20);
      
      // Additional pages if needed
      while (heightLeft > 0) {
        pdf.addPage();
        pagePosition = -pageHeight + 20 + pagePosition;
        pdf.addImage(imgData, 'PNG', 10, pagePosition, imgWidth, imgHeight);
        heightLeft -= (pageHeight - 20);
      }
    } else {
      // If the image fits on one page
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    }
    
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};
