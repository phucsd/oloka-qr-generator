import confetti from 'canvas-confetti';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { BulkItem, QRDesignConfig } from '../types';
import { renderQRToCanvas } from './qrService';
import { verifyQRCanvas } from './qrVerification';

export interface BatchProgress {
  current: number;
  total: number;
  percentage: number;
  currentFilename: string;
  successCount: number;
  errorCount: number;
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
): Promise<{ successCount: number; errorCount: number; reportItems: BulkItem[] }> {
  isCancellationRequested = false;
  const zip = new JSZip();
  const folder = zip.folder('qr_codes') || zip;

  const total = items.length;
  if (total === 0) {
    throw new Error('Chưa có danh sách mã QR để xử lý');
  }

  const updatedItems: BulkItem[] = [];
  const usedFilenames = new Map<string, number>();

  function getUniqueFilename(rawName: string, ext: string): string {
    const clean = rawName.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'qr';
    const count = usedFilenames.get(clean) ?? 0;
    usedFilenames.set(clean, count + 1);
    if (count === 0) return `${clean}.${ext}`;
    return `${clean}_${count + 1}.${ext}`;
  }

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < total; i++) {
    if (isCancellationRequested) {
      break;
    }

    const item = { ...items[i] };
    const rawData = item.data?.trim();

    // Check for empty data
    if (!rawData) {
      item.status = 'error';
      item.errorMessage = 'Dữ liệu mã QR bị trống';
      errorCount++;
      updatedItems.push(item);
      continue;
    }

    const uniqueFullName = getUniqueFilename(item.filename || `qr_${String(i + 1).padStart(3, '0')}`, format);
    item.filename = uniqueFullName.replace(`.${format}`, '');

    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        percentage: Math.round(((i + 1) / total) * 100),
        currentFilename: uniqueFullName,
        successCount,
        errorCount,
      });
    }

    try {
      const canvas = await renderQRToCanvas(rawData, config, item.label);

      // Verify QR decode with ZXing
      const verifyRes = await verifyQRCanvas(canvas, rawData);
      if (!verifyRes.match) {
        console.warn(`ZXing decode warning on item ${i + 1}:`, verifyRes.errorMessage);
      }

      const mimeType = format === 'webp' ? 'image/webp' : 'image/png';
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), mimeType, 0.95);
      });

      if (blob) {
        folder.file(uniqueFullName, blob);
        item.status = 'success';
        item.errorMessage = verifyRes.match ? undefined : `Cảnh báo: ${verifyRes.errorMessage}`;
        successCount++;
      } else {
        item.status = 'error';
        item.errorMessage = 'Không thể xuất blob ảnh';
        errorCount++;
      }
    } catch (err: any) {
      console.error(`Error rendering QR item ${i + 1}:`, err);
      item.status = 'error';
      item.errorMessage = err?.message || 'Lỗi render canvas';
      errorCount++;
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
  const csvHeader = 'STT,Du_Lieu_QR,Ten_File,Nhan_In,Trang_Thai,Ghi_Chu_Loi\n';
  const csvRows = updatedItems
    .map(
      (it, idx) =>
        `"${idx + 1}","${(it.data || '').replace(/"/g, '""')}","${it.filename}.${format}","${(it.label || '').replace(/"/g, '""')}","${it.status}","${(it.errorMessage || '').replace(/"/g, '""')}"`
    )
    .join('\n');

  zip.file('bao_cao_kiem_tra.csv', '\uFEFF' + csvHeader + csvRows); // Add BOM for Excel UTF-8 display

  // Compress and save
  const zipContent = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      if (onProgress) {
        onProgress({
          current: total,
          total,
          percentage: Math.round(metadata.percent),
          currentFilename: `Đang nén ZIP: ${Math.round(metadata.percent)}%`,
          successCount,
          errorCount,
        });
      }
    }
  );

  const finalZipName = `${zipFilename.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'oloka_qr_codes'}.zip`;
  saveAs(zipContent, finalZipName);

  try {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });
  } catch (e) {
    // Ignore
  }

  return { successCount, errorCount, reportItems: updatedItems };
}
