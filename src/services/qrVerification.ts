import { BrowserQRCodeReader } from '@zxing/browser';

const codeReader = new BrowserQRCodeReader();

export interface DecodeVerificationResult {
  success: boolean;
  decodedText?: string;
  match: boolean;
  errorMessage?: string;
}

/**
 * Decodes the rendered QR canvas back to text and verifies against original source payload
 */
export async function verifyQRCanvas(
  canvas: HTMLCanvasElement,
  expectedPayload: string
): Promise<DecodeVerificationResult> {
  if (!expectedPayload || !expectedPayload.trim()) {
    return {
      success: false,
      match: false,
      errorMessage: 'Nội dung gốc rỗng',
    };
  }

  try {
    const result = await codeReader.decodeFromCanvas(canvas);
    const decoded = result.getText();
    const match = decoded === expectedPayload;

    return {
      success: true,
      decodedText: decoded,
      match,
      errorMessage: match ? undefined : 'Nội dung quét được không khớp 100% với dữ liệu gốc',
    };
  } catch (err: any) {
    return {
      success: false,
      match: false,
      errorMessage: 'Không thể giải mã QR. Vui lòng tăng độ tương phản, giảm kích thước logo hoặc tăng lề an toàn (Quiet Zone).',
    };
  }
}
