import { jsPDF } from 'jspdf';
import { BulkItem, QRDesignConfig } from '../types';
import { renderQRToCanvas } from './qrService';

export interface LabelPreset {
  id: string;
  name: string;
  columns: number;
  rows: number;
  labelWidthMm: number;
  labelHeightMm: number;
  marginLeftMm: number;
  marginTopMm: number;
  gapHorizontalMm: number;
  gapVerticalMm: number;
}

export const LABEL_PRESETS: LabelPreset[] = [
  {
    id: 'a4-18',
    name: 'A4 - 18 Tem (63.5 x 46.6 mm - Khuyên Dùng)',
    columns: 3,
    rows: 6,
    labelWidthMm: 63.5,
    labelHeightMm: 46.6,
    marginLeftMm: 7.2,
    marginTopMm: 8.7,
    gapHorizontalMm: 2.5,
    gapVerticalMm: 0,
  },
  {
    id: 'a4-30',
    name: 'A4 - 30 Tem (70.0 x 29.7 mm - Hàng Hóa Vừa)',
    columns: 3,
    rows: 10,
    labelWidthMm: 70.0,
    labelHeightMm: 29.7,
    marginLeftMm: 0,
    marginTopMm: 0,
    gapHorizontalMm: 0,
    gapVerticalMm: 0,
  },
  {
    id: 'a4-8',
    name: 'A4 - 8 Tem Lớn (99.1 x 67.7 mm - Thùng Hàng)',
    columns: 2,
    rows: 4,
    labelWidthMm: 99.1,
    labelHeightMm: 67.7,
    marginLeftMm: 4.5,
    marginTopMm: 13.1,
    gapHorizontalMm: 2.5,
    gapVerticalMm: 0,
  },
];

export interface PDFExportOptions {
  presetId: string;
  showCutBorder: boolean;
  showLabels: boolean;
  showOlokaFooter: boolean;
}

export const DEFAULT_PDF_OPTIONS: PDFExportOptions = {
  presetId: 'a4-18',
  showCutBorder: true,
  showLabels: true,
  showOlokaFooter: false, // Default off to strictly respect "Không Watermark"
};

/**
 * Creates high-resolution sticker cell canvas with UTF-8 Vietnamese text rendered natively
 */
async function renderStickerCanvas(
  item: BulkItem,
  config: QRDesignConfig,
  showLabel: boolean
): Promise<HTMLCanvasElement> {
  const qrCanvas = await renderQRToCanvas(item.data, config);
  const labelText = (item.label || item.filename || '').trim();

  if (!showLabel || !labelText) {
    return qrCanvas;
  }

  // Compose QR with bottom label on a high-res canvas (handles all Vietnamese UTF-8 accents)
  const width = qrCanvas.width;
  const labelH = Math.max(36, Math.round(width * 0.1));
  const totalH = qrCanvas.height + labelH;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = totalH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return qrCanvas;

  if (!config.isTransparentBg) {
    ctx.fillStyle = config.bgColor;
    ctx.fillRect(0, 0, width, totalH);
  }

  ctx.drawImage(qrCanvas, 0, 0);

  ctx.fillStyle = config.fgColorType === 'solid' ? config.fgColor : '#0f172a';
  ctx.font = `600 ${Math.round(labelH * 0.45)}px "Be Vietnam Pro", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(labelText.substring(0, 36), width / 2, qrCanvas.height + labelH / 2);

  return canvas;
}

export async function generatePrintablePDF(
  items: BulkItem[],
  config: QRDesignConfig,
  options: PDFExportOptions = DEFAULT_PDF_OPTIONS,
  pdfFilename: string = 'oloka_tem_nhan_in_an'
): Promise<void> {
  const validItems = items.filter((it) => it.data && it.data.trim().length > 0);
  if (validItems.length === 0) {
    throw new Error('Chưa có mã QR hợp lệ để xuất PDF');
  }

  const preset = LABEL_PRESETS.find((p) => p.id === options.presetId) || LABEL_PRESETS[0];

  const pageWidthMm = 210;
  const pageHeightMm = 297;
  const itemsPerPage = preset.columns * preset.rows;
  const totalPages = Math.ceil(validItems.length / itemsPerPage);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) doc.addPage();

    const pageStartIndex = page * itemsPerPage;
    const pageItems = validItems.slice(pageStartIndex, pageStartIndex + itemsPerPage);

    for (let idx = 0; idx < pageItems.length; idx++) {
      const item = pageItems[idx];
      const col = idx % preset.columns;
      const row = Math.floor(idx / preset.columns);

      const cellX = preset.marginLeftMm + col * (preset.labelWidthMm + preset.gapHorizontalMm);
      const cellY = preset.marginTopMm + row * (preset.labelHeightMm + preset.gapVerticalMm);

      // Draw cut line border
      if (options.showCutBorder) {
        doc.setDrawColor(215, 220, 228);
        doc.setLineWidth(0.15);
        doc.rect(cellX, cellY, preset.labelWidthMm, preset.labelHeightMm);
      }

      try {
        const stickerCanvas = await renderStickerCanvas(item, config, options.showLabels);
        const imgData = stickerCanvas.toDataURL('image/png');

        const padMm = 1.5;
        const availableW = preset.labelWidthMm - padMm * 2;
        const availableH = preset.labelHeightMm - padMm * 2;

        const stickerRatio = stickerCanvas.width / stickerCanvas.height;
        let drawW = availableW;
        let drawH = drawW / stickerRatio;

        if (drawH > availableH) {
          drawH = availableH;
          drawW = drawH * stickerRatio;
        }

        const imgX = cellX + (preset.labelWidthMm - drawW) / 2;
        const imgY = cellY + (preset.labelHeightMm - drawH) / 2;

        doc.addImage(imgData, 'PNG', imgX, imgY, drawW, drawH);
      } catch (err) {
        console.error('Error adding sticker to PDF:', err);
      }
    }

    // Optional footer (only if user explicitly enables it)
    if (options.showOlokaFooter) {
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Trang ${page + 1}/${totalPages} • Oloka QR Generator`,
        pageWidthMm / 2,
        pageHeightMm - 3,
        { align: 'center' }
      );
    }
  }

  const safeName = `${pdfFilename.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'tem_nhan'}.pdf`;
  doc.save(safeName);
}
