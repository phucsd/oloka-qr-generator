import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { BulkItem, QRDesignConfig } from '../types';
import { renderQRToCanvas, renderQRToVectorSVG } from './qrService';
import { verifyQRCanvas } from './qrVerification';

export type BatchExportFormat = 'png' | 'svg' | 'webp' | 'png+svg';

export interface BatchProgress {
  current: number;
  total: number;
  percentage: number;
  currentFilename: string;
  passedCount?: number;
  repairedCount?: number;
  failedCount?: number;
  successCount?: number;
  errorCount?: number;
}

export type ProgressCallback = (progress: BatchProgress) => void;

export interface BatchResult {
  total: number;
  passedCount: number;
  repairedCount: number;
  failedCount: number;
  reportItems: BulkItem[];
  zipBlob: Blob;
  format: BatchExportFormat;
}

let isCancellationRequested = false;

export function cancelBatchProcessing(): void {
  isCancellationRequested = true;
}

export function downloadBatchZipFile(zipBlob: Blob, zipFilename: string = 'oloka_qr_codes'): void {
  saveAs(zipBlob, `${zipFilename}.zip`);
}

export async function processBatchQR(
  items: BulkItem[],
  config: QRDesignConfig,
  format: BatchExportFormat = 'png',
  validateWithZXing: boolean = true,
  onProgress?: ProgressCallback
): Promise<BatchResult> {
  isCancellationRequested = false;
  const zip = new JSZip();
  const folder = zip.folder('qr_codes') || zip;

  const total = items.length;
  if (total === 0) {
    throw new Error('Chưa có danh sách mã QR để xử lý');
  }

  const updatedItems: BulkItem[] = [];
  const usedFilenames = new Map<string, number>();

  function getUniqueBaseFilename(rawName: string): string {
    const clean = rawName.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'qr';
    const count = usedFilenames.get(clean) ?? 0;
    usedFilenames.set(clean, count + 1);
    if (count === 0) return clean;
    return `${clean}_${count + 1}`;
  }

  let passedCount = 0;
  let repairedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < total; i++) {
    if (isCancellationRequested) {
      break;
    }

    const item: BulkItem = { ...items[i] };
    const rawData = item.data?.trim();

    // Check for empty data
    if (!rawData) {
      item.status = 'failed';
      item.errorMessage = 'Dữ liệu mã QR bị trống';
      failedCount++;
      updatedItems.push(item);
      continue;
    }

    const baseName = getUniqueBaseFilename(item.filename || `qr_${String(i + 1).padStart(3, '0')}`);
    item.filename = baseName;

    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        percentage: Math.round(((i + 1) / total) * 100),
        currentFilename: `${baseName}`,
        passedCount,
        repairedCount,
        failedCount,
      });
    }

    try {
      // Step 1: Render with current config
      let currentConfig = { ...config };
      let canvas = await renderQRToCanvas(rawData, currentConfig, item.label);
      let isVerified = true;
      let wasRepaired = false;
      let repairReason = '';

      if (validateWithZXing) {
        // Attempt 1 validation
        const verifyRes = await verifyQRCanvas(canvas, rawData);
        if (!verifyRes.match) {
          // Attempt 2: Auto-repair (bump ECC to H, reduce logo size, increase margin)
          const repairedConfig: QRDesignConfig = {
            ...currentConfig,
            errorCorrectionLevel: 'H',
            margin: Math.max(currentConfig.margin, 16),
            logoSize: currentConfig.logoUrl ? Math.min(currentConfig.logoSize, 0.22) : currentConfig.logoSize,
            clearLogoBackground: true,
          };

          const repairedCanvas = await renderQRToCanvas(rawData, repairedConfig, item.label);
          const verifyRepaired = await verifyQRCanvas(repairedCanvas, rawData);

          if (verifyRepaired.match) {
            canvas = repairedCanvas;
            currentConfig = repairedConfig;
            isVerified = true;
            wasRepaired = true;
            repairReason = 'Đã tự động sửa (ECC H, lề ≥16px)';
          } else {
            isVerified = false;
            item.errorMessage = verifyRes.errorMessage || 'Không thể giải mã quét';
          }
        }
      }

      // Quality Gate: If validation failed, DO NOT export as success
      if (!isVerified) {
        item.status = 'failed';
        failedCount++;
        updatedItems.push(item);
        continue;
      }

      // Export files to ZIP for valid items
      const addPng = format === 'png' || format === 'png+svg';
      const addSvg = format === 'svg' || format === 'png+svg';
      const addWebp = format === 'webp';

      if (addPng) {
        const pngBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), 'image/png');
        });
        if (pngBlob) {
          folder.file(`${baseName}.png`, pngBlob);
        }
      }

      if (addWebp) {
        const webpBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((b) => resolve(b), 'image/webp', 0.95);
        });
        if (webpBlob) {
          folder.file(`${baseName}.webp`, webpBlob);
        }
      }

      if (addSvg) {
        const svgXml = await renderQRToVectorSVG(rawData, currentConfig, item.label);
        folder.file(`${baseName}.svg`, svgXml);
      }

      if (wasRepaired) {
        item.status = 'repaired';
        item.repairDetails = repairReason;
        repairedCount++;
      } else {
        item.status = 'passed';
        passedCount++;
      }
    } catch (err: any) {
      console.error(`Error rendering QR item ${i + 1}:`, err);
      item.status = 'failed';
      item.errorMessage = err?.message || 'Lỗi render canvas';
      failedCount++;
    }

    updatedItems.push(item);

    // Yield to keep UI responsive
    if (i % 4 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 5));
    }
  }

  if (isCancellationRequested) {
    throw new Error('Quá trình tạo file ZIP đã bị người dùng hủy');
  }

  // Create validation report CSV inside the ZIP
  const csvHeader = 'STT,Du_Lieu_QR,Ten_File,Nhan_In,Trang_Thai,Ghi_Chu_Loi_Hoac_Sua\n';
  const csvRows = updatedItems
    .map(
      (it, idx) =>
        `"${idx + 1}","${(it.data || '').replace(/"/g, '""')}","${it.filename}","${(it.label || '').replace(/"/g, '""')}","${it.status.toUpperCase()}","${(it.repairDetails || it.errorMessage || '').replace(/"/g, '""')}"`
    )
    .join('\n');

  zip.file('bao_cao_kiem_tra.csv', '\uFEFF' + csvHeader + csvRows); // Add BOM for Excel UTF-8

  // Generate ZIP in-memory
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  return {
    total,
    passedCount,
    repairedCount,
    failedCount,
    reportItems: updatedItems,
    zipBlob,
    format,
  };
}

export async function processAndDownloadBatchZip(
  items: BulkItem[],
  config: QRDesignConfig,
  format: 'png' | 'webp' = 'png',
  zipFilename: string = 'oloka_qr_codes',
  onProgress?: ProgressCallback
): Promise<{ successCount: number; errorCount: number; reportItems: BulkItem[] }> {
  const res = await processBatchQR(items, config, format, true, onProgress ? (p: BatchProgress) => onProgress({
    current: p.current,
    total: p.total,
    percentage: p.percentage,
    currentFilename: p.currentFilename,
    passedCount: p.passedCount || 0,
    repairedCount: p.repairedCount || 0,
    failedCount: p.failedCount || 0,
    successCount: (p.passedCount || 0) + (p.repairedCount || 0),
    errorCount: p.failedCount || 0,
  }) : undefined);
  downloadBatchZipFile(res.zipBlob, zipFilename);
  return {
    successCount: res.passedCount + res.repairedCount,
    errorCount: res.failedCount,
    reportItems: res.reportItems,
  };
}

