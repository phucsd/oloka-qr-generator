import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, XCircle, Loader2 } from 'lucide-react';
import { BulkItem, QRDesignConfig } from '../../types';
import { DesignTabs } from '../design/DesignTabs';
import { renderQRToCanvas } from '../../services/qrService';
import { verifyQRCanvas, DecodeVerificationResult } from '../../services/qrVerification';

interface DesignStepProps {
  items: BulkItem[];
  config: QRDesignConfig;
  onChangeConfig: (newConfig: QRDesignConfig) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const DesignStep: React.FC<DesignStepProps> = ({
  items,
  config,
  onChangeConfig,
  onBack,
  onContinue,
}) => {
  const sampleItem = items.find((it) => it.data && it.data.trim().length > 0) || {
    id: 'sample-01',
    index: 1,
    data: 'https://oloka.vn',
    filename: 'sample_qr',
    label: 'Mẫu Tem In',
    status: 'pending',
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [decodeResult, setDecodeResult] = useState<DecodeVerificationResult | null>(null);

  useEffect(() => {
    let isCurrent = true;
    setIsRendering(true);

    const render = async () => {
      try {
        const canvas = await renderQRToCanvas(
          sampleItem.data,
          config,
          sampleItem.label || undefined
        );
        if (!isCurrent) return;

        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          canvas.className =
            'w-full h-auto max-w-[220px] sm:max-w-[260px] rounded-2xl shadow-2xs border border-slate-200/80';
          containerRef.current.appendChild(canvas);
        }

        const res = await verifyQRCanvas(canvas, sampleItem.data);
        if (isCurrent) setDecodeResult(res);
      } catch (e) {
        console.error('Error rendering sample QR:', e);
      } finally {
        if (isCurrent) setIsRendering(false);
      }
    };

    const timer = setTimeout(render, 100);
    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [config, sampleItem.data, sampleItem.label]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Shared Design Tabs */}
        <div className="lg:col-span-8">
          <DesignTabs config={config} onChange={onChangeConfig} />
        </div>

        {/* Right: Sample Preview Sticky Inspector */}
        <div className="lg:col-span-4 sticky top-20 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Xem Trước 1 Dòng Mẫu
            </h3>
            {isRendering ? (
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                <span>Đang vẽ...</span>
              </span>
            ) : decodeResult?.match ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>✓ Scan verified</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                <XCircle className="w-3 h-3 text-rose-600" />
                <span>✕ Scan failed</span>
              </span>
            )}
          </div>

          <div className="p-3 bg-slate-50/70 border border-slate-200/60 rounded-2xl flex items-center justify-center min-h-[220px]">
            <div ref={containerRef} className="flex items-center justify-center" />
          </div>

          <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-400">Dòng mẫu:</span>
              <span className="font-semibold text-slate-800">#{sampleItem.index}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">File:</span>
              <span className="font-mono text-slate-700 truncate max-w-[150px]">{sampleItem.filename}.png</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Nội dung:</span>
              <span className="font-mono text-slate-700 truncate max-w-[150px]">{sampleItem.data}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay Lại (Ánh Xạ)</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2"
        >
          <span>Tiếp Tục (Cấu Hình Tạo)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
