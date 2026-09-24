import { jsPDF } from 'jspdf';
import { BulkItem, QRDesignConfig } from '../types';
import { renderQRToCanvas } from './qrService';

export interface PDFGridConfig {
  columns: number; // e.g. 3 or 4
  rows: number; // e.g. 6 or 8
  pageSize: 'a4';
  showCutBorder: boolean;
  showLabels: boolean;
}

export const DEFAULT_PDF_GRID: PDFGridConfig = {
  columns: 3,
  rows: 6,
  pageSize: 'a4',
  showCutBorder: true,
  showLabels: true,
};

export async function generatePrintablePDF(
  items: BulkItem[],
  config: QRDesignConfig,
  grid: PDFGridConfig = DEFAULT_PDF_GRID,
  pdfFilename: string = 'oloka_tem_nhan_in_an'
): Promise<void> {
  const validItems = items.filter((it) => it.data && it.data.trim().length > 0);
  if (validItems.length === 0) {
    throw new Error('Không có mã QR hợp lệ để xuất PDF');
  }

  // A4 dimensions in mm
  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 10;
  const marginY = 12;

  const usableWidth = pageWidth - marginX * 2;
  const usableHeight = pageHeight - marginY * 2;

  const cellWidth = usableWidth / grid.columns;
  const cellHeight = usableHeight / grid.rows;

  const itemsPerPage = grid.columns * grid.rows;
  const totalPages = Math.ceil(validItems.length / itemsPerPage);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) {
      doc.addPage();
    }

    const pageStartIndex = page * itemsPerPage;
    const pageItems = validItems.slice(pageStartIndex, pageStartIndex + itemsPerPage);

    for (let idx = 0; idx < pageItems.length; idx++) {
      const item = pageItems[idx];
      const col = idx % grid.columns;
      const row = Math.floor(idx / grid.columns);

      const cellX = marginX + col * cellWidth;
      const cellY = marginY + row * cellHeight;

      // Draw light gray dashed or solid cut line around sticker
      if (grid.showCutBorder) {
        doc.setDrawColor(220, 224, 230);
        doc.setLineWidth(0.2);
        doc.rect(cellX, cellY, cellWidth, cellHeight);
      }

      // Render QR code to canvas
      try {
        const canvas = await renderQRToCanvas(item.data, config);
        const imgData = canvas.toDataURL('image/png');

        // Size calculation inside sticker cell
        const padding = 2.5;
        const availableWidth = cellWidth - padding * 2;
        const textReserve = grid.showLabels ? 7 : 0;
        const availableHeight = cellHeight - padding * 2 - textReserve;

        const qrSide = Math.min(availableWidth, availableHeight);
        const qrX = cellX + (cellWidth - qrSide) / 2;
        const qrY = cellY + padding + (availableHeight - qrSide) / 2;

        doc.addImage(imgData, 'PNG', qrX, qrY, qrSide, qrSide);

        // Print label text under QR
        if (grid.showLabels) {
          const textToShow = item.label || item.filename || `#${item.index + 1}`;
          const cleanText = textToShow.substring(0, 32);

          doc.setFontSize(8);
          doc.setTextColor(51, 65, 85);
          doc.text(cleanText, cellX + cellWidth / 2, cellY + cellHeight - 2.5, {
            align: 'center',
            maxWidth: cellWidth - 4,
          });
        }
      } catch (err) {
        console.error(`Error rendering PDF cell ${idx}:`, err);
      }
    }

    // Page footer note
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Trang ${page + 1}/${totalPages} • Tạo bởi Oloka QR Generator (oloka-qr-generator.hf.space)`,
      pageWidth / 2,
      pageHeight - 4,
      { align: 'center' }
    );
  }

  const safeFilename = `${pdfFilename.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'tem_nhan_qr'}.pdf`;
  doc.save(safeFilename);
}
