import confetti from 'canvas-confetti';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { BulkItem, QRDesignConfig } from '../types';
import { renderQRToCanvas } from './qrService';

export interface BatchProgress {
  current: number;
  total: number;
  percentage: number;
  currentFilename: string;
}

export type ProgressCallback = (progress: BatchProgress) => void;

let isCancellationRequested = false;

export function cancelBatchProcessing(): void {
  isCancellationRequested = true;
}

export async function processAndDownloadBatchZip(
  items: BulkItem[],
  config: QRDesignConfig,
  format: 'png' | 'webp' = 'png',
  zipFilename: string = 'oloka_qr_codes',
  onProgress?: ProgressCallback
): Promise<{ successCount: number; errorCount: number }> {
  isCancellationRequested = false;
  const zip = new JSZip();
  const folder = zip.folder('qr_codes') || zip;

  const validItems = items.filter((it) => it.data && it.data.trim().length > 0);
  const total = validItems.length;

  if (total === 0) {
    throw new Error('Không có dữ liệu hợp lệ để tạo mã QR');
  }

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < total; i++) {
    if (isCancellationRequested) {
      break;
    }

    const item = validItems[i];
    const safeName = (item.filename || `qr_${String(i + 1).padStart(3, '0')}`)
      .replace(/[/\\?%*:|"<>]/g, '_')
      .trim();

    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        percentage: Math.round(((i + 1) / total) * 100),
        currentFilename: `${safeName}.${format}`,
      });
    }

    try {
      const canvas = await renderQRToCanvas(item.data, config, item.label);
      const mimeType = format === 'webp' ? 'image/webp' : 'image/png';

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), mimeType, 0.95);
      });

      if (blob) {
        folder.file(`${safeName}.${format}`, blob);
        successCount++;
      } else {
        errorCount++;
      }
    } catch (err) {
      console.error(`Error rendering QR item ${i + 1}:`, err);
      errorCount++;
    }

    // Yield back to event loop every 3 items to keep UI responsive
    if (i % 3 === 0) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  if (isCancellationRequested) {
    throw new Error('Quá trình tạo file ZIP đã bị người dùng huỷ');
  }

  // Generate zip file with compression
  const zipContent = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const finalZipName = `${zipFilename.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'oloka_qr_codes'}.zip`;
  saveAs(zipContent, finalZipName);

  // Trigger celebration confetti
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  } catch (e) {
    // Ignore confetti errors if canvas not available
  }

  return { successCount, errorCount };
}
