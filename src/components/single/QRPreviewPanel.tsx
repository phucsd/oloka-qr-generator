import React, { useEffect, useRef, useState } from 'react';
import {
  Download,
  Copy,
  Share2,
  Check,
  ShieldCheck,
  XCircle,
  Loader2,
  ChevronDown,
  Wrench,
  ChevronRight,
} from 'lucide-react';
import { QRDesignConfig } from '../../types';
import { downloadQRCode, renderQRToCanvas } from '../../services/qrService';
import { verifyQRCanvas, DecodeVerificationResult } from '../../services/qrVerification';

interface QRPreviewPanelProps {
  content: string;
  designConfig: QRDesignConfig;
  onAutoRepair?: () => void;
}

export const QRPreviewPanel: React.FC<QRPreviewPanelProps> = ({
  content,
  designConfig,
  onAutoRepair,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [filename, setFilename] = useState('oloka_qrcode');
  const [customLabel, setCustomLabel] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [decodeResult, setDecodeResult] = useState<DecodeVerificationResult | null>(null);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg' | 'webp'>('png');
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [showExportSettings, setShowExportSettings] = useState(false);

  const hasValidContent = !!(content && content.trim().length > 0);

  // Render QR to canvas whenever content, designConfig, or customLabel changes
  useEffect(() => {
    let isCurrent = true;
    setIsRendering(true);

    if (!hasValidContent) {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      setDecodeResult(null);
      setIsRendering(false);
      return;
    }

    const render = async () => {
      try {
        const canvas = await renderQRToCanvas(
          content.trim(),
          designConfig,
          customLabel.trim() || undefined
        );
        if (!isCurrent) return;

        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          canvas.className =
            'w-full h-auto max-w-[260px] sm:max-w-[300px] rounded-2xl shadow-2xs border border-slate-200/80 transition-all';
          containerRef.current.appendChild(canvas);
        }

        // Run genuine ZXing decode test
        const verification = await verifyQRCanvas(canvas, content.trim());
        if (isCurrent) {
          setDecodeResult(verification);
        }
      } catch (err) {
        console.error('Error rendering preview canvas:', err);
      } finally {
        if (isCurrent) setIsRendering(false);
      }
    };

    const timer = setTimeout(render, 100);
    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [content, designConfig, customLabel, hasValidContent]);

  const handleDownload = async (format: 'png' | 'svg' | 'webp') => {
    if (!hasValidContent) return;
    try {
      await downloadQRCode(
        content.trim(),
        designConfig,
        format,
        filename || 'oloka_qrcode',
        customLabel.trim() || undefined
      );
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!hasValidContent) return;
    try {
      const canvas = await renderQRToCanvas(
        content.trim(),
        designConfig,
        customLabel.trim() || undefined
      );
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } catch (clipErr) {
          console.error('Clipboard error:', clipErr);
          alert('Không thể sao chép trực tiếp trên trình duyệt này. Vui lòng bấm Tải PNG!');
        }
      }, 'image/png');
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    if (!hasValidContent) return;
    try {
      const canvas = await renderQRToCanvas(
        content.trim(),
        designConfig,
        customLabel.trim() || undefined
      );

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `${filename || 'qrcode'}.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Mã QR Code',
              text: 'Mã QR tạo bởi Oloka QR Studio',
            });
            return;
          } catch (e) {
            return;
          }
        }
        handleCopyToClipboard();
      }, 'image/png');
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  const isScanPassed = decodeResult?.match === true;
  const isScanFailed = decodeResult !== null && !decodeResult.match;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
      {/* Top Header & Validation Badge */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Xem Trước Trực Tiếp
        </h3>

        {/* 3-State Quality Gate Badge */}
        {hasValidContent && (
          <div>
            {isRendering ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
                <span>Đang kiểm tra...</span>
              </span>
            ) : isScanPassed ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>✓ Scan verified</span>
              </span>
            ) : isScanFailed ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>✕ Scan failed</span>
              </span>
            ) : null}
          </div>
        )}
      </div>

      {/* QR Canvas Center */}
      <div className="relative flex flex-col items-center justify-center p-4 bg-slate-50/70 border border-slate-200/60 rounded-2xl min-h-[260px]">
        {hasValidContent ? (
          <>
            <div ref={containerRef} className="flex items-center justify-center" />
            {isRendering && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-2xs flex items-center justify-center rounded-2xl">
                <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10 px-4">
            <p className="text-xs font-semibold text-slate-700">Chưa có nội dung hợp lệ</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Nhập nội dung ở khung bên cạnh để xem trước mã QR
            </p>
          </div>
        )}
      </div>

      {/* Helpful Advice if Scan Failed */}
      {isScanFailed && (
        <div className="p-3 bg-rose-50/80 border border-rose-200 rounded-xl space-y-2 text-xs">
          <div className="font-bold text-rose-900 flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Mã QR không quét được bằng camera!</span>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Nguyên nhân thường do logo quá lớn che mất dữ liệu, độ tương phản màu quá thấp, hoặc viền lề (quiet zone) quá hẹp.
          </p>
          {onAutoRepair && (
            <button
              type="button"
              onClick={onAutoRepair}
              className="w-full mt-1 py-1.5 px-3 bg-white border border-rose-300 hover:bg-rose-100/60 text-rose-700 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5 text-rose-600" />
              <span>Tự Động Sửa Lỗi (Safe Auto-Repair)</span>
            </button>
          )}
        </div>
      )}

      {/* Primary Download Button with Dropdown Selector */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="relative flex">
          <button
            type="button"
            disabled={!hasValidContent}
            onClick={() => handleDownload(downloadFormat)}
            className="flex-1 py-2.5 px-4 rounded-l-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Tải Về {downloadFormat.toUpperCase()}</span>
          </button>

          <button
            type="button"
            disabled={!hasValidContent}
            onClick={() => setShowFormatDropdown(!showFormatDropdown)}
            className="px-2.5 rounded-r-xl bg-indigo-700 hover:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed text-white border-l border-indigo-500/40 transition-colors flex items-center justify-center"
            title="Chọn định dạng ảnh khác"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {showFormatDropdown && (
            <div className="absolute top-full right-0 mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-lg z-30 p-1 space-y-0.5 animate-in fade-in duration-100">
              <button
                type="button"
                onClick={() => {
                  setDownloadFormat('png');
                  setShowFormatDropdown(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                  downloadFormat === 'png' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Ảnh PNG (Chuẩn)</span>
                {downloadFormat === 'png' && <Check className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setDownloadFormat('svg');
                  setShowFormatDropdown(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                  downloadFormat === 'svg' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Vector SVG (In ấn)</span>
                {downloadFormat === 'svg' && <Check className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setDownloadFormat('webp');
                  setShowFormatDropdown(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                  downloadFormat === 'webp' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Ảnh WebP (Siêu nhẹ)</span>
                {downloadFormat === 'webp' && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Secondary Actions: Copy & Share */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!hasValidContent}
            onClick={handleCopyToClipboard}
            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Đã chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Sao Chép</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={!hasValidContent}
            onClick={handleShare}
            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Chia Sẻ</span>
          </button>
        </div>

        {/* Collapsed Optional Export Settings */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowExportSettings(!showExportSettings)}
            className="text-[11px] text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 transition-colors"
          >
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showExportSettings ? 'rotate-90' : ''}`} />
            <span>Tùy chỉnh tên file & nhãn in tem...</span>
          </button>

          {showExportSettings && (
            <div className="pt-2 space-y-2 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tên file tải về</label>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="oloka_qrcode"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nhãn chữ in dưới mã</label>
                <input
                  type="text"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder="Ví dụ: SP01 - Áo Polo"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
