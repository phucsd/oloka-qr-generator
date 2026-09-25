import React, { useState } from 'react';
import { ArrowLeft, Play, ShieldCheck, Printer, FileArchive, Check } from 'lucide-react';
import { BulkItem, QRDesignConfig } from '../../types';
import { BatchExportFormat } from '../../services/batchService';
import { LABEL_PRESETS } from '../../services/pdfService';

interface GenerateStepProps {
  items: BulkItem[];
  config: QRDesignConfig;
  onBack: () => void;
  onStartGenerate: (
    format: BatchExportFormat,
    validateWithZXing: boolean,
    generatePdf: boolean,
    pdfPresetId: string
  ) => void;
}

// Mini SVG Illustration for Formats
const FormatMiniIcon: React.FC<{ format: BatchExportFormat }> = ({ format }) => {
  switch (format) {
    case 'png':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.8]">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      );
    case 'svg':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.8]">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      );
    case 'webp':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.8]">
          <circle cx="12" cy="12" r="9" />
          <path d="M3.6 9h16.8M3.6 15h16.8" />
        </svg>
      );
    case 'png+svg':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[1.8]">
          <rect x="2" y="2" width="13" height="13" rx="2" />
          <path d="M7 16v5a1 1 0 001 1h13a1 1 0 001-1V8a1 1 0 00-1-1h-5" />
        </svg>
      );
  }
};

export const GenerateStep: React.FC<GenerateStepProps> = ({
  items,
  onBack,
  onStartGenerate,
}) => {
  const [format, setFormat] = useState<BatchExportFormat>('png');
  const [validateWithZXing, setValidateWithZXing] = useState<boolean>(true);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);
  const [pdfPresetId, setPdfPresetId] = useState<string>('a4-18');

  const validItems = items.filter((it) => it.data && it.data.trim().length > 0);

  const formatOptions: { id: BatchExportFormat; label: string; desc: string }[] = [
    { id: 'png', label: 'PNG', desc: 'Universal' },
    { id: 'svg', label: 'SVG', desc: 'Vector' },
    { id: 'webp', label: 'WebP', desc: 'Lightweight' },
    { id: 'png+svg', label: 'PNG + SVG', desc: 'Combo' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-7 space-y-6">
      {/* Title */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">
          Bước 4: Cấu hình tạo mã
        </h2>
        <p className="text-xs text-slate-500 font-normal mt-0.5">
          Chọn định dạng xuất file và kiểm định chất lượng
        </p>
      </div>

      {/* Summary Box */}
      <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex items-center justify-between text-xs">
        <div>
          <span className="font-semibold text-indigo-950 text-sm">
            Sẵn sàng tạo {validItems.length.toLocaleString()} mã QR
          </span>
          <p className="text-indigo-700/80 font-normal mt-0.5">
            Dữ liệu và thiết kế đã được áp dụng hoàn tất
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-medium shadow-2xs">
          <FileArchive className="w-5 h-5 stroke-[1.8]" />
        </div>
      </div>

      {/* Output Format Picker (Visual Cards) */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-700">
          Định dạng ảnh trong file ZIP
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {formatOptions.map((opt) => {
            const isSelected = format === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFormat(opt.id)}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-semibold shadow-2xs'
                    : 'border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 font-normal'
                }`}
              >
                <div className={isSelected ? 'text-indigo-600' : 'text-slate-400'}>
                  <FormatMiniIcon format={opt.id} />
                </div>
                <div className="text-xs">{opt.label}</div>
                <div className="text-[10px] text-slate-400 font-normal">{opt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quality Gate Checkbox */}
      <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={validateWithZXing}
            onChange={(e) => setValidateWithZXing(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
          />
          <div>
            <div className="font-medium text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Kiểm thử khả năng quét tự động</span>
            </div>
            <p className="text-slate-500 text-[11px] mt-0.5 font-normal leading-relaxed">
              Quét thử từng mã sau khi render. Tự động khắc phục lề/ECC nếu phát hiện mã khó quét.
            </p>
          </div>
        </label>
      </div>

      {/* Optional PDF Decal Toggle */}
      <div className="p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl space-y-3 text-xs">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={generatePdf}
            onChange={(e) => setGeneratePdf(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
          />
          <div>
            <div className="font-medium text-slate-900 flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-indigo-600" />
              <span>Đồng thời tạo bảng tem nhãn in ấn A4 (PDF)</span>
            </div>
            <p className="text-slate-500 text-[11px] mt-0.5 font-normal">
              Chia sẵn lưới tem decal trên trang A4 cho máy in
            </p>
          </div>
        </label>

        {generatePdf && (
          <div className="pt-2.5 border-t border-slate-200/70 space-y-2">
            <span className="font-medium text-slate-700">Mẫu tem decal:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {LABEL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setPdfPresetId(preset.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    pdfPresetId === preset.id
                      ? 'border-indigo-600 bg-white text-indigo-700 font-semibold shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-normal'
                  }`}
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {preset.columns * preset.rows} tem / trang ({preset.labelWidthMm} × {preset.labelHeightMm} mm)
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <button
          type="button"
          disabled={validItems.length === 0}
          onClick={() => onStartGenerate(format, validateWithZXing, generatePdf, pdfPresetId)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Tạo {validItems.length.toLocaleString()} mã QR</span>
        </button>
      </div>
    </div>
  );
};
