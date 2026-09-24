import QRCodeStyling, {
  CornerDotType as StyledCornerDotType,
  CornerSquareType as StyledCornerSquareType,
  DotType as StyledDotType,
  Options as QRCodeOptions,
} from 'qr-code-styling';
import { QRDesignConfig } from '../types';

export const DEFAULT_DESIGN_CONFIG: QRDesignConfig = {
  size: 400,
  margin: 16, // Safe default >= 4 modules
  errorCorrectionLevel: 'Q',
  fgColorType: 'solid',
  fgColor: '#1e1b4b',
  fgGradient: {
    type: 'linear',
    rotation: 45,
    colorStops: [
      { offset: 0, color: '#4f46e5' },
      { offset: 1, color: '#06b6d4' },
    ],
  },
  isTransparentBg: false,
  bgColor: '#ffffff',
  dotType: 'rounded',
  cornerSquareType: 'extra-rounded',
  cornerDotType: 'dot',
  isCustomEyeColors: false,
  eyeOuterColor: '#4f46e5',
  eyeInnerColor: '#4f46e5',
  logoUrl: '',
  logoSize: 0.22,
  logoMargin: 6,
  clearLogoBackground: true,
  frame: {
    type: 'none',
    text: 'QUÉT MÃ TẠI ĐÂY',
    textColor: '#ffffff',
    bgColor: '#4f46e5',
    font: 'Be Vietnam Pro',
  },
  showTextLabel: false,
  textLabelField: '',
};

export function buildQRCodeOptions(content: string, config: QRDesignConfig): QRCodeOptions {
  if (!content || !content.trim()) {
    throw new Error('EMPTY_PAYLOAD: Nội dung mã QR không được để trống');
  }

  const options: QRCodeOptions = {
    width: config.size,
    height: config.size,
    data: content.trim(),
    margin: Math.max(8, config.margin), // Ensure safe quiet zone
    qrOptions: {
      errorCorrectionLevel: config.errorCorrectionLevel,
    },
    backgroundOptions: {
      color: config.isTransparentBg ? 'transparent' : config.bgColor,
    },
    dotsOptions: {
      type: config.dotType as StyledDotType,
      color: config.fgColorType === 'solid' ? config.fgColor : undefined,
      gradient:
        config.fgColorType === 'gradient'
          ? {
              type: config.fgGradient.type,
              rotation: (config.fgGradient.rotation * Math.PI) / 180,
              colorStops: config.fgGradient.colorStops,
            }
          : undefined,
    },
    cornersSquareOptions: {
      type: config.cornerSquareType as StyledCornerSquareType,
      color: config.isCustomEyeColors ? config.eyeOuterColor : config.fgColorType === 'solid' ? config.fgColor : '#4f46e5',
    },
    cornersDotOptions: {
      type: config.cornerDotType as StyledCornerDotType,
      color: config.isCustomEyeColors ? config.eyeInnerColor : config.fgColorType === 'solid' ? config.fgColor : '#4f46e5',
    },
  };

  if (config.logoUrl) {
    options.image = config.logoUrl;
    options.imageOptions = {
      hideBackgroundDots: config.clearLogoBackground,
      imageSize: Math.min(0.35, config.logoSize), // Cap logo size to prevent unreadable QR
      margin: config.logoMargin,
      crossOrigin: 'anonymous',
    };
  }

  return options;
}

export async function renderQRToCanvas(
  content: string,
  config: QRDesignConfig,
  labelText?: string
): Promise<HTMLCanvasElement> {
  const qrOptions = buildQRCodeOptions(content, config);
  const qrCode = new QRCodeStyling(qrOptions);

  const rawBlob = await qrCode.getRawData('png');
  if (!rawBlob) {
    throw new Error('Không thể render ảnh QR raw');
  }

  const qrImg = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(rawBlob as Blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });

  const qrSize = config.size;
  const frame = config.frame;
  const hasFrame = frame && frame.type !== 'none';
  const hasLabel = !!(labelText && labelText.trim());

  let frameTopHeight = 0;
  let frameBottomHeight = 0;
  let labelHeight = 0;
  let padding = 16;

  if (hasFrame) {
    if (frame.type === 'bottom-bar' || frame.type === 'bubble-bottom') {
      frameBottomHeight = Math.max(48, Math.round(qrSize * 0.14));
    } else if (frame.type === 'top-bar') {
      frameTopHeight = Math.max(48, Math.round(qrSize * 0.14));
    } else if (frame.type === 'card-border') {
      frameBottomHeight = Math.max(48, Math.round(qrSize * 0.14));
      padding = 24;
    }
  }

  if (hasLabel) {
    labelHeight = Math.max(32, Math.round(qrSize * 0.08));
  }

  const canvasWidth = qrSize + (hasFrame && frame.type === 'card-border' ? padding * 2 : 0);
  const canvasHeight =
    qrSize +
    frameTopHeight +
    frameBottomHeight +
    labelHeight +
    (hasFrame && frame.type === 'card-border' ? padding * 2 : 0);

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get canvas context');

  if (!config.isTransparentBg) {
    ctx.fillStyle = config.bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  if (hasFrame && frame.type === 'card-border') {
    ctx.lineWidth = Math.max(4, Math.round(qrSize * 0.015));
    ctx.strokeStyle = frame.bgColor;
    ctx.strokeRect(padding / 2, padding / 2, canvasWidth - padding, canvasHeight - padding);
  }

  const qrX = (canvasWidth - qrSize) / 2;
  const qrY = (hasFrame && frame.type === 'card-border' ? padding : 0) + frameTopHeight;
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  if (hasFrame && frame.type === 'top-bar') {
    ctx.fillStyle = frame.bgColor;
    ctx.fillRect(0, 0, canvasWidth, frameTopHeight);

    ctx.fillStyle = frame.textColor;
    ctx.font = `bold ${Math.round(frameTopHeight * 0.45)}px "${frame.font || 'Be Vietnam Pro'}", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(frame.text, canvasWidth / 2, frameTopHeight / 2);
  }

  if (hasFrame && (frame.type === 'bottom-bar' || frame.type === 'bubble-bottom' || frame.type === 'card-border')) {
    const barY = qrY + qrSize;
    if (frame.type === 'bubble-bottom') {
      const bubbleW = canvasWidth * 0.8;
      const bubbleH = frameBottomHeight * 0.8;
      const bubbleX = (canvasWidth - bubbleW) / 2;
      const bubbleY = barY + (frameBottomHeight - bubbleH) / 2;
      const radius = bubbleH / 2;

      ctx.fillStyle = frame.bgColor;
      ctx.beginPath();
      ctx.moveTo(bubbleX + radius, bubbleY);
      ctx.lineTo(bubbleX + bubbleW - radius, bubbleY);
      ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY, bubbleX + bubbleW, bubbleY + radius);
      ctx.lineTo(bubbleX + bubbleW, bubbleY + bubbleH - radius);
      ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY + bubbleH, bubbleX + bubbleW - radius, bubbleY + bubbleH);
      ctx.lineTo(bubbleX + radius, bubbleY + bubbleH);
      ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleH, bubbleX, bubbleY + bubbleH - radius);
      ctx.lineTo(bubbleX, bubbleY + radius);
      ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + radius, bubbleY);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = frame.textColor;
      ctx.font = `bold ${Math.round(bubbleH * 0.45)}px "${frame.font || 'Be Vietnam Pro'}", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(frame.text, canvasWidth / 2, bubbleY + bubbleH / 2);
    } else {
      ctx.fillStyle = frame.bgColor;
      ctx.fillRect(0, barY, canvasWidth, frameBottomHeight);

      ctx.fillStyle = frame.textColor;
      ctx.font = `bold ${Math.round(frameBottomHeight * 0.45)}px "${frame.font || 'Be Vietnam Pro'}", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(frame.text, canvasWidth / 2, barY + frameBottomHeight / 2);
    }
  }

  if (hasLabel && labelText) {
    const textY = canvasHeight - labelHeight / 2;
    ctx.fillStyle = config.isTransparentBg ? '#1e293b' : config.fgColorType === 'solid' ? config.fgColor : '#0f172a';
    ctx.font = `600 ${Math.round(labelHeight * 0.45)}px "Be Vietnam Pro", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labelText, canvasWidth / 2, textY);
  }

  return canvas;
}

/**
 * Generates 100% PURE, GENUINE VECTOR SVG (never wrapped PNG)
 */
export async function renderQRToVectorSVG(
  content: string,
  config: QRDesignConfig,
  labelText?: string
): Promise<string> {
  const qrOptions = buildQRCodeOptions(content, config);
  const qrCode = new QRCodeStyling(qrOptions);

  const rawSvgBlob = await qrCode.getRawData('svg');
  if (!rawSvgBlob) throw new Error('Không thể tạo SVG');

  const rawSvgText = await (rawSvgBlob as Blob).text();

  const qrSize = config.size;
  const frame = config.frame;
  const hasFrame = frame && frame.type !== 'none';
  const hasLabel = !!(labelText && labelText.trim());

  if (!hasFrame && !hasLabel) {
    return rawSvgText;
  }

  // Calculate dimensions
  let frameTopHeight = 0;
  let frameBottomHeight = 0;
  let labelHeight = 0;
  let padding = 16;

  if (hasFrame) {
    if (frame.type === 'bottom-bar' || frame.type === 'bubble-bottom') {
      frameBottomHeight = Math.max(48, Math.round(qrSize * 0.14));
    } else if (frame.type === 'top-bar') {
      frameTopHeight = Math.max(48, Math.round(qrSize * 0.14));
    } else if (frame.type === 'card-border') {
      frameBottomHeight = Math.max(48, Math.round(qrSize * 0.14));
      padding = 24;
    }
  }

  if (hasLabel) {
    labelHeight = Math.max(32, Math.round(qrSize * 0.08));
  }

  const totalWidth = qrSize + (hasFrame && frame.type === 'card-border' ? padding * 2 : 0);
  const totalHeight =
    qrSize +
    frameTopHeight +
    frameBottomHeight +
    labelHeight +
    (hasFrame && frame.type === 'card-border' ? padding * 2 : 0);

  const qrX = (totalWidth - qrSize) / 2;
  const qrY = (hasFrame && frame.type === 'card-border' ? padding : 0) + frameTopHeight;

  // Extract inner SVG content (strip out outer <svg> wrapper)
  const innerContentMatch = rawSvgText.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const innerSvgContent = innerContentMatch ? innerContentMatch[1] : rawSvgText;

  let extraSvgElements = '';

  // Background rect
  if (!config.isTransparentBg) {
    extraSvgElements += `<rect width="${totalWidth}" height="${totalHeight}" fill="${config.bgColor}" />\n`;
  }

  // Frame card border
  if (hasFrame && frame.type === 'card-border') {
    const strokeW = Math.max(4, Math.round(qrSize * 0.015));
    extraSvgElements += `<rect x="${padding / 2}" y="${padding / 2}" width="${totalWidth - padding}" height="${totalHeight - padding}" fill="none" stroke="${frame.bgColor}" stroke-width="${strokeW}" rx="12" />\n`;
  }

  // Top Bar Frame
  if (hasFrame && frame.type === 'top-bar') {
    const fontSize = Math.round(frameTopHeight * 0.45);
    extraSvgElements += `<rect x="0" y="0" width="${totalWidth}" height="${frameTopHeight}" fill="${frame.bgColor}" />\n`;
    extraSvgElements += `<text x="${totalWidth / 2}" y="${frameTopHeight / 2 + fontSize * 0.35}" fill="${frame.textColor}" font-family="${frame.font || 'sans-serif'}" font-size="${fontSize}" font-weight="bold" text-anchor="middle">${escapeXml(frame.text)}</text>\n`;
  }

  // Bottom Bar / Bubble Frame
  if (hasFrame && (frame.type === 'bottom-bar' || frame.type === 'bubble-bottom' || frame.type === 'card-border')) {
    const barY = qrY + qrSize;
    const fontSize = Math.round(frameBottomHeight * 0.45);

    if (frame.type === 'bubble-bottom') {
      const bubbleW = totalWidth * 0.8;
      const bubbleH = frameBottomHeight * 0.8;
      const bubbleX = (totalWidth - bubbleW) / 2;
      const bubbleY = barY + (frameBottomHeight - bubbleH) / 2;
      const r = bubbleH / 2;
      extraSvgElements += `<rect x="${bubbleX}" y="${bubbleY}" width="${bubbleW}" height="${bubbleH}" rx="${r}" fill="${frame.bgColor}" />\n`;
      extraSvgElements += `<text x="${totalWidth / 2}" y="${bubbleY + bubbleH / 2 + fontSize * 0.35}" fill="${frame.textColor}" font-family="${frame.font || 'sans-serif'}" font-size="${fontSize}" font-weight="bold" text-anchor="middle">${escapeXml(frame.text)}</text>\n`;
    } else {
      extraSvgElements += `<rect x="0" y="${barY}" width="${totalWidth}" height="${frameBottomHeight}" fill="${frame.bgColor}" />\n`;
      extraSvgElements += `<text x="${totalWidth / 2}" y="${barY + frameBottomHeight / 2 + fontSize * 0.35}" fill="${frame.textColor}" font-family="${frame.font || 'sans-serif'}" font-size="${fontSize}" font-weight="bold" text-anchor="middle">${escapeXml(frame.text)}</text>\n`;
    }
  }

  // Bottom Label Text
  if (hasLabel && labelText) {
    const labelFontSize = Math.round(labelHeight * 0.45);
    const labelY = totalHeight - labelHeight / 2 + labelFontSize * 0.35;
    const labelColor = config.isTransparentBg ? '#1e293b' : config.fgColorType === 'solid' ? config.fgColor : '#0f172a';
    extraSvgElements += `<text x="${totalWidth / 2}" y="${labelY}" fill="${labelColor}" font-family="Be Vietnam Pro, sans-serif" font-size="${labelFontSize}" font-weight="600" text-anchor="middle">${escapeXml(labelText)}</text>\n`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">
${extraSvgElements}
<g transform="translate(${qrX}, ${qrY})">
${innerSvgContent}
</g>
</svg>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function downloadQRCode(
  content: string,
  config: QRDesignConfig,
  format: 'png' | 'svg' | 'webp' | 'jpeg',
  filename: string = 'qrcode',
  labelText?: string
): Promise<void> {
  if (!content || !content.trim()) {
    throw new Error('EMPTY_PAYLOAD: Không thể tải mã QR khi chưa có dữ liệu');
  }

  const safeFilename = filename.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'qrcode';

  if (format === 'svg') {
    const svgString = await renderQRToVectorSVG(content, config, labelText);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeFilename}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return;
  }

  const canvas = await renderQRToCanvas(content, config, labelText);
  const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
  const dataUrl = canvas.toDataURL(mimeType, 0.95);

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `${safeFilename}.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
