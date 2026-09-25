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
    { id: 'png', label: 'Ảnh PNG', desc: 'Độ nét cao, tương thích 100% mọi thiết bị' },
    { id: 'svg', label: 'Vector SVG', desc: 'Mở được trên AI/Corel, in ấn khổ lớn không vỡ hạt' },
    { id: 'webp', label: 'Ảnh WebP', desc: 'Dung lượng nhẹ hơn 40%, tối ưu website' },
    { id: 'png+svg', label: 'PNG + SVG', desc: 'Bao gồm cả ảnh PNG và file Vector SVG' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-7 space-y-6">
      {/* Title */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          Bước 4: Cấu Hình Xuất File & Tạo Hàng Loạt
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Chọn định dạng file đóng gói và các tùy chọn kiểm định chất lượng trước khi khởi chạy
        </p>
      </div>

      {/* Summary Box */}
      <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-indigo-950 text-sm">
            {validItems.length.toLocaleString()} mã QR hợp lệ
          </span>
          <p className="text-indigo-700/80 mt-0.5">
            Dữ liệu đã được nạp và gán mẫu thiết kế hoàn tất
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
          <FileArchive className="w-5 h-5" />
        </div>
      </div>

      {/* Output Format Picker */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Định Dạng Ảnh Trong File ZIP
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {formatOptions.map((opt) => {
            const isSelected = format === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFormat(opt.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/60 text-slate-900 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quality Gate Checkbox */}
      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 text-xs">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={validateWithZXing}
            onChange={(e) => setValidateWithZXing(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
          />
          <div>
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Kiểm Thử Khả Năng Quét Bằng ZXing (Quality Gate)</span>
            </div>
            <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
              Tự động quét thử từng mã sau khi render. Nếu phát hiện mã khó quét, hệ thống sẽ tự động thử sửa lỗi (tăng ECC, căn lề) trước khi quyết định đưa vào kết quả.
            </p>
          </div>
        </label>
      </div>

      {/* Optional PDF Decal Toggle */}
      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 text-xs">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={generatePdf}
            onChange={(e) => setGeneratePdf(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 mt-0.5"
          />
          <div>
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-indigo-600" />
              <span>Đồng Thời Tạo Bảng Tem Nhãn In Ấn Khổ A4 (PDF)</span>
            </div>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Tự động chia lưới tem decal trên các trang giấy A4 sẵn sàng cho máy in.
            </p>
          </div>
        </label>

        {generatePdf && (
          <div className="pt-3 border-t border-slate-200/70 space-y-2">
            <span className="font-semibold text-slate-700">Chọn Mẫu Tem Decal:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {LABEL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setPdfPresetId(preset.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    pdfPresetId === preset.id
                      ? 'border-indigo-600 bg-white text-indigo-700 font-bold shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold">{preset.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {preset.columns * preset.rows} tem / trang ({preset.labelWidthMm} x {preset.labelHeightMm} mm)
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
          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay Lại (Thiết Kế)</span>
        </button>

        <button
          type="button"
          disabled={validItems.length === 0}
          onClick={() => onStartGenerate(format, validateWithZXing, generatePdf, pdfPresetId)}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Bắt Đầu Tạo {validItems.length.toLocaleString()} Mã QR</span>
        </button>
      </div>
    </div>
  );
};
