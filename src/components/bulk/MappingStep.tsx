import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle, Eye, CheckCircle2, X } from 'lucide-react';
import { ExcelWorkbookInfo } from '../../services/excelService';
import { BulkItem } from '../../types';

interface MappingStepProps {
  dataSourceType: 'file' | 'text';
  workbookInfo: ExcelWorkbookInfo | null;
  rawTextLines: string;
  contentCol: string;
  setContentCol: (col: string) => void;
  filenameCol: string;
  setFilenameCol: (col: string) => void;
  labelCol: string;
  setLabelCol: (col: string) => void;
  onBack: () => void;
  onContinue: (items: BulkItem[]) => void;
}

export const MappingStep: React.FC<MappingStepProps> = ({
  dataSourceType,
  workbookInfo,
  rawTextLines,
  contentCol,
  setContentCol,
  filenameCol,
  setFilenameCol,
  labelCol,
  setLabelCol,
  onBack,
  onContinue,
}) => {
  const [showErrorDrawer, setShowErrorDrawer] = useState(false);

  // Generate resolved items list
  const { allItems, validCount, errorCount, errorItems } = useMemo(() => {
    if (dataSourceType === 'text') {
      const lines = rawTextLines.split('\n');
      const items: BulkItem[] = [];
      const errors: BulkItem[] = [];

      lines.forEach((line, idx) => {
        const clean = line.trim();
        const item: BulkItem = {
          id: `item-${idx + 1}`,
          index: idx + 1,
          data: clean,
          filename: `qr_${String(idx + 1).padStart(3, '0')}`,
          label: '',
          status: clean ? 'pending' : 'failed',
          errorMessage: clean ? undefined : 'Dữ liệu dòng này bị trống',
        };
        items.push(item);
        if (!clean) errors.push(item);
      });

      return {
        allItems: items,
        validCount: items.length - errors.length,
        errorCount: errors.length,
        errorItems: errors,
      };
    }

    if (!workbookInfo || workbookInfo.rows.length === 0) {
      return { allItems: [], validCount: 0, errorCount: 0, errorItems: [] };
    }

    const items: BulkItem[] = [];
    const errors: BulkItem[] = [];

    workbookInfo.rows.forEach((row, idx) => {
      // Resolve content
      let content = (row[contentCol] || '').trim();

      // Resolve filename
      let fname = filenameCol && row[filenameCol] ? String(row[filenameCol]).trim() : `qr_${String(idx + 1).padStart(3, '0')}`;
      fname = fname.replace(/[/\\?%*:|"<>]/g, '_').trim() || `qr_${idx + 1}`;

      // Resolve label
      let lbl = labelCol && row[labelCol] ? String(row[labelCol]).trim() : '';

      const item: BulkItem = {
        id: `row-${idx + 1}`,
        index: idx + 1,
        data: content,
        filename: fname,
        label: lbl,
        status: content ? 'pending' : 'failed',
        errorMessage: content ? undefined : `Cột "${contentCol || 'Nội dung'}" bị trống`,
      };

      items.push(item);
      if (!content) {
        errors.push(item);
      }
    });

    return {
      allItems: items,
      validCount: items.length - errors.length,
      errorCount: errors.length,
      errorItems: errors,
    };
  }, [dataSourceType, rawTextLines, workbookInfo, contentCol, filenameCol, labelCol]);

  // Preview only the first 10 rows
  const previewSample = allItems.slice(0, 10);

  const handleProceed = () => {
    // Pass valid items to next step
    onContinue(allItems);
  };

  const headers = workbookInfo?.headers || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-7 space-y-6">
      {/* Top Title */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          Bước 2: Ánh Xạ Cột & Xem Trước Dữ Liệu
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Chỉ định cột chứa dữ liệu QR, tên file tải về và nhãn chữ in tem
        </p>
      </div>

      {/* Column Selectors (for File mode) */}
      {dataSourceType === 'file' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cột Nội Dung QR <span className="text-rose-500">*</span>
            </label>
            <select
              value={contentCol}
              onChange={(e) => setContentCol(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">-- Chọn cột nội dung --</option>
              {headers.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 mt-1">Đường link, mã sản phẩm hoặc text</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cột Tên File Tải Về
            </label>
            <select
              value={filenameCol}
              onChange={(e) => setFilenameCol(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">(Tự động đặt tên qr_001, qr_002...)</option>
              {headers.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 mt-1">Mã SKU hoặc tên sản phẩm</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cột Nhãn In Tem Decal
            </label>
            <select
              value={labelCol}
              onChange={(e) => setLabelCol(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">(Không in nhãn chữ dưới QR)</option>
              {headers.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 mt-1">Dòng chữ hiển thị dưới mỗi mã QR</p>
          </div>
        </div>
      )}

      {/* Validation Summary Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{validCount.toLocaleString()} mã sẵn sàng</span>
          </div>

          {errorCount > 0 && (
            <button
              type="button"
              onClick={() => setShowErrorDrawer(true)}
              className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorCount} dòng lỗi (Xem chi tiết)</span>
            </button>
          )}
        </div>

        <span className="text-slate-400 text-[11px]">
          Hiển thị xem trước 10 dòng đầu tiên của tổng số {allItems.length.toLocaleString()} dòng
        </span>
      </div>

      {/* Preview Table (10 rows max) */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3 w-12 text-center">#</th>
              <th className="py-2.5 px-3">Nội Dung Mã QR</th>
              <th className="py-2.5 px-3">Tên File Sẽ Tải Về</th>
              <th className="py-2.5 px-3">Nhãn In Kèm</th>
              <th className="py-2.5 px-3 w-20 text-center">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {previewSample.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/60">
                <td className="py-2 px-3 text-center text-slate-400 font-mono">{item.index}</td>
                <td className="py-2 px-3 font-mono text-slate-800 max-w-xs truncate" title={item.data}>
                  {item.data || <span className="text-rose-400 italic">[Trống]</span>}
                </td>
                <td className="py-2 px-3 text-slate-600 font-mono truncate">{item.filename}</td>
                <td className="py-2 px-3 text-slate-600 truncate">{item.label || <span className="text-slate-300">-</span>}</td>
                <td className="py-2 px-3 text-center">
                  {item.data ? (
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="Hợp lệ" />
                  ) : (
                    <span className="inline-block w-2 h-2 rounded-full bg-rose-500" title="Lỗi rỗng" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Drawer / Modal for Error Rows */}
      {showErrorDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Danh Sách {errorCount} Dòng Lỗi Dữ Liệu
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowErrorDrawer(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Các dòng này có nội dung mã QR bị trống nên hệ thống sẽ tự động bỏ qua khi tạo file ảnh:
            </p>

            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {errorItems.map((err) => (
                <div
                  key={err.id}
                  className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-100 flex items-center justify-between"
                >
                  <span className="font-semibold text-rose-900">Dòng #{err.index}</span>
                  <span className="text-rose-600 text-[11px]">{err.errorMessage}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowErrorDrawer(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay Lại</span>
        </button>

        <button
          type="button"
          disabled={validCount === 0}
          onClick={handleProceed}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2"
        >
          <span>Tiếp Tục (Chọn Thiết Kế)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
