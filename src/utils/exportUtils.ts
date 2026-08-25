// src/utils/exportUtils.ts
import { jsPDF } from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
import {
  Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun,
  AlignmentType, WidthType
} from 'docx';
import { saveAs } from 'file-saver';
import { MonthlyReport, Service } from '../types';

// Apply the jspdf-autotable plugin to jsPDF
applyPlugin(jsPDF);

/**
 * Native Print: The most reliable way for tables to break across pages.
 * Requires the @media print CSS in your global stylesheet.
 */
export const printReport = () => {
  window.print();
};

/**
 * Exports a report to PDF using jspdf-autotable for proper table pagination.
 * This ensures rows are never split across pages.
 */
export const exportToPDF = async (report: MonthlyReport, filename: string) => {
  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    }) as any; // Cast to any to use autoTable plugin

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;

    // Add church header on first page
    const logoImg = new Image();
    logoImg.src = '/mountain-of-fire-and-miracles-ministry-seeklogo.png';

    // Wait for logo to load
    await new Promise((resolve) => {
      logoImg.onload = resolve;
      logoImg.onerror = () => resolve(null); // Continue even if logo fails
      setTimeout(() => resolve(null), 2000); // Timeout after 2s
    });

    // Add logo if loaded
    if (logoImg.complete && logoImg.naturalHeight !== 0) {
      pdf.addImage(logoImg, 'PNG', margin, margin, 20, 20);
    }

    // Church header text - all using helvetica for consistency
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('MOUNTAIN OF FIRE AND MIRACLES MINISTRIES (MFM)', pageWidth / 2, margin + 8, { align: 'center' });

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('CHAGOUA N\'DJAMENA, CHAD', pageWidth / 2, margin + 14, { align: 'center' });
    pdf.text('Tel: +23565871836', pageWidth / 2, margin + 18, { align: 'center' });

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text(`Monthly Activity Report - ${report.month} ${report.year}`, pageWidth / 2, margin + 24, { align: 'center' });

    // Prepare table data
    const tableHeaders = [
      'Jour', 'Date', 'Preacher', 'Message Theme',
      'M', 'W', 'C', 'Total', 'Tithe', 'Offering', 'Total'
    ];

    const tableData = report.services.map(service => [
      new Date(service.date).toLocaleDateString('en-US', { weekday: 'long' }),
      new Date(service.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      service.preacher,
      service.theme,
      service.menAttendance.toString(),
      service.womenAttendance.toString(),
      service.childrenAttendance.toString(),
      (service.menAttendance + service.womenAttendance + service.childrenAttendance).toString(),
      service.tithes > 0 ? service.tithes.toLocaleString() : '-',
      service.offerings > 0 ? service.offerings.toLocaleString() : '-',
      (service.tithes + service.offerings).toLocaleString()
    ]);

    // Calculate totals
    const totalTithes = report.services.reduce((sum, s) => sum + (s.tithes || 0), 0);
    const totalOfferings = report.services.reduce((sum, s) => sum + (s.offerings || 0), 0);
    const grandTotal = totalTithes + totalOfferings;

    // Add totals row
    tableData.push([
      { content: 'TOTAL:', colSpan: 8, styles: { halign: 'right', fontStyle: 'bold' } } as any,
      { content: `${totalTithes.toLocaleString()} CFA`, styles: { fontStyle: 'bold' } } as any,
      { content: `${totalOfferings.toLocaleString()} CFA`, styles: { fontStyle: 'bold' } } as any,
      { content: `${grandTotal.toLocaleString()} CFA`, styles: { fontStyle: 'bold' } } as any
    ] as any);

    // Generate table with autoTable
    pdf.autoTable({
      startY: margin + 32,
      head: [tableHeaders],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineColor: [68, 68, 68],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [0, 51, 102],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        textColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [249, 249, 249],
      },
      columnStyles: {
        0: { cellWidth: 22 }, // Jour
        1: { cellWidth: 24 }, // Date
        2: { cellWidth: 28 }, // Preacher
        3: { cellWidth: 45, halign: 'left' }, // Theme
        4: { cellWidth: 12, halign: 'right' }, // M
        5: { cellWidth: 12, halign: 'right' }, // W
        6: { cellWidth: 12, halign: 'right' }, // C
        7: { cellWidth: 15, halign: 'right' }, // Total
        8: { cellWidth: 22, halign: 'right' }, // Tithe
        9: { cellWidth: 22, halign: 'right' }, // Offering
        10: { cellWidth: 24, halign: 'right' }, // Total
      },
      // Calculate margins to center the table
      // Total column width is 238mm, page width is 297mm, so (297 - 238) / 2 = 29.5mm margin on each side
      margin: { left: 29.5, right: 29.5 },
      didDrawPage: () => {
        // Add page numbers
        const pageCount = (pdf as any).internal.getNumberOfPages();
        const currentPage = (pdf as any).internal.getCurrentPageInfo().pageNumber;
        pdf.setFontSize(8);
        pdf.text(
          `Page ${currentPage} of ${pageCount}`,
          pageWidth - margin,
          pdf.internal.pageSize.getHeight() - 5,
          { align: 'right' }
        );
      },
    });

    pdf.save(filename);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    alert('Error exporting to PDF. Please try again.');
  }
};

/**
 * DOCX HELPER FUNCTIONS
 */
const createBoldTableCell = (text: string) => {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, size: 20 })],
        alignment: AlignmentType.CENTER,
      })
    ],
    verticalAlign: AlignmentType.CENTER,
  });
};

const createTableCell = (text: string | number) => {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text: String(text), size: 18 })],
        alignment: AlignmentType.CENTER,
      })
    ],
    verticalAlign: AlignmentType.CENTER,
  });
};

/**
 * Exports report data to a DOCX file.
 */
export const exportToDocx = async (report: MonthlyReport) => {
  try {
    const { month, year, services } = report;

    const churchName = "MOUNTAIN OF FIRE AND MIRACLES MINISTRIES (MFM)";
    const churchAddress = "CHAGOUA N'DJAMENA, CHAD | Tel: +23565871836";
    const reportTitle = `Monthly Activity Report - ${month} ${year}`;

    // Table Headers
    const tableHeaders = [
      "Jour", "Date", "Preacher", "Theme",
      "M", "W", "C", "Total", "Tithe", "Offering", "Total"
    ].map(createBoldTableCell);

    // Table Data Rows
    const dataRows = services.map((service: Service) =>
      new TableRow({
        children: [
          new Date(service.date).toLocaleDateString('en-US', { weekday: 'short' }),
          new Date(service.date).toLocaleDateString('en-US'),
          service.preacher,
          service.theme,
          service.menAttendance,
          service.womenAttendance,
          service.childrenAttendance,
          service.menAttendance + service.womenAttendance + service.childrenAttendance,
          service.tithes.toLocaleString(),
          service.offerings.toLocaleString(),
          (service.tithes + service.offerings).toLocaleString(),
        ].map(createTableCell),
      })
    );

    // Totals
    const totalTithes = services.reduce((sum, s) => sum + (s.tithes || 0), 0);
    const totalOfferings = services.reduce((sum, s) => sum + (s.offerings || 0), 0);

    const totalsRow = new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "TOTAL", bold: true })] })],
          columnSpan: 8,
        }),
        createBoldTableCell(totalTithes.toLocaleString()),
        createBoldTableCell(totalOfferings.toLocaleString()),
        createBoldTableCell((totalTithes + totalOfferings).toLocaleString()),
      ],
    });

    const doc = new Document({
      sections: [
        {
          properties: { page: { size: { orientation: 'landscape' } } },
          children: [
            new Paragraph({
              children: [new TextRun({ text: churchName, bold: true, size: 32, color: "003366" })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [new TextRun({ text: churchAddress, size: 24 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [new TextRun({ text: reportTitle, bold: true, size: 28 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),

            ...(services.length > 0
              ? [
                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  rows: [
                    new TableRow({ children: tableHeaders }),
                    ...dataRows,
                    totalsRow,
                  ],
                }),
              ]
              : [
                new Paragraph({
                  children: [new TextRun("No services recorded for this month.")],
                }),
              ]
            ),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    saveAs(blob, `${month}_${year}_Report.docx`);

  } catch (error) {
    console.error('Error exporting to DOCX:', error);
    alert("Error exporting to Word. Please try again.");
  }
};