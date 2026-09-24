import React, { useEffect, useRef, useState } from 'react';
import {
  Download,
  Copy,
  Share2,
  Check,
  Sparkles,
  ShieldCheck,
  FileCode2,
} from 'lucide-react';
import { QRDesignConfig } from '../types';
import { downloadQRCode, renderQRToCanvas } from '../services/qrService';

interface QRPreviewStickyProps {
  content: string;
  designConfig: QRDesignConfig;
}

export const QRPreviewSticky: React.FC<QRPreviewStickyProps> = ({ content, designConfig }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [filename, setFilename] = useState('oloka_qrcode');
  const [customLabel, setCustomLabel] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isRendering, setIsRendering] = useState(false);

  // Render QR to canvas whenever content, designConfig, or customLabel changes
  useEffect(() => {
    let isCurrent = true;
    setIsRendering(true);

    const render = async () => {
      try {
        const effectiveContent = content || 'https://oloka.vn';
        const canvas = await renderQRToCanvas(effectiveContent, designConfig, customLabel || undefined);
        if (!isCurrent) return;

        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          canvas.className = 'w-full h-auto max-w-[280px] sm:max-w-[320px] rounded-2xl shadow-sm border border-slate-200/80 transition-all';
          containerRef.current.appendChild(canvas);
        }
      } catch (err) {
        console.error('Error rendering preview canvas:', err);
      } finally {
        if (isCurrent) setIsRendering(false);
      }
    };

    const timer = setTimeout(render, 80);
    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [content, designConfig, customLabel]);

  const handleDownload = async (format: 'png' | 'svg' | 'webp') => {
    try {
      await downloadQRCode(
        content || 'https://oloka.vn',
        designConfig,
        format,
        filename || 'oloka_qrcode',
        customLabel || undefined
      );
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const canvas = await renderQRToCanvas(
        content || 'https://oloka.vn',
        designConfig,
        customLabel || undefined
      );
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } catch (clipErr) {
          console.error('Clipboard error:', clipErr);
          alert('Không thể sao chép trực tiếp vào bộ nhớ tạm trên trình duyệt này. Vui lòng tải file PNG!');
        }
      }, 'image/png');
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Oloka QR Code',
          text: 'Mã QR được tạo bởi Oloka QR Generator',
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      await handleCopyToClipboard();
    }
  };

  return (
    <div className="sticky top-20 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-5">
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Khung Xem Trước Trực Tiếp</span>
        </div>
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Quét nhạy 100%</span>
        </div>
      </div>

      {/* QR Canvas Container */}
      <div className="relative flex items-center justify-center p-4 bg-slate-50/70 border border-slate-200/60 rounded-2xl min-h-[280px]">
        <div ref={containerRef} className="flex items-center justify-center" />
        {isRendering && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-2xs flex items-center justify-center rounded-2xl">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Inputs for Filename & Label */}
      <div className="space-y-3 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Tên File Khi Tải Về</label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="oloka_qrcode"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Chữ In Dưới Mã QR (Tùy chọn)
          </label>
          <input
            type="text"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="Ví dụ: SP01 - Áo Thun Trắng"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      {/* Primary Download Buttons */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => handleDownload('png')}
          className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Tải Ảnh PNG (300 DPI Chuẩn In)</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDownload('svg')}
            className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
            title="Định dạng Vector không vỡ hình"
          >
            <FileCode2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tải SVG Vector</span>
          </button>

          <button
            type="button"
            onClick={() => handleDownload('webp')}
            className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
            title="Định dạng WebP dung lượng nhẹ"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Tải WebP</span>
          </button>
        </div>

        {/* Quick Utility Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopyToClipboard}
            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-medium text-xs transition-all flex items-center justify-center gap-1.5"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Đã chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Sao Chép Ảnh</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-medium text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Chia Sẻ Mã</span>
          </button>
        </div>
      </div>
    </div>
  );
};
