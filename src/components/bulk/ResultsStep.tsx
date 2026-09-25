import React, { useEffect, useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  RefreshCw,
  Printer,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ChevronRight,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BatchResult, downloadBatchZipFile } from '../../services/batchService';
import { exportValidationReportExcel } from '../../services/excelService';
import { BulkItem } from '../../types';

interface ResultsStepProps {
  result: BatchResult;
  onRetryFailed: () => void;
  onExportPdf?: () => void;
  onStartNewBatch: () => void;
}

export const ResultsStep: React.FC<ResultsStepProps> = ({
  result,
  onRetryFailed,
  onExportPdf,
  onStartNewBatch,
}) => {
  const [selectedFailedItem, setSelectedFailedItem] = useState<BulkItem | null>(null);

  // Fire confetti if 100% passed with zero failures!
  useEffect(() => {
    if (result.failedCount === 0 && result.total > 0) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Ignore canvas-confetti error if unmounted
      }
    }
  }, [result.failedCount, result.total]);

  const handleDownloadZip = () => {
    downloadBatchZipFile(result.zipBlob, `oloka_batch_qr_${result.format}`);
  };

  const handleDownloadExcelReport = () => {
    exportValidationReportExcel(result.reportItems);
  };

  const failedItems = result.reportItems.filter(
    (it) => it.status === 'failed' || it.status === 'mismatch'
  );

  const totalValid = result.passedCount + result.repairedCount;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6 max-w-xl mx-auto">
      {/* Top Banner */}
      <div className="text-center space-y-1.5">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2.5 shadow-2xs">
          <CheckCircle2 className="w-7 h-7 stroke-[1.8]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
          Hoàn tất xử lý lô mã QR!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Đã kiểm thử và đóng gói hoàn tất <strong className="text-slate-800 font-medium">{result.total.toLocaleString()}</strong> mã QR
        </p>
      </div>

      {/* Completion Stat Badges - Clean Typography */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
          <div className="text-xs font-medium text-emerald-800 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Đạt</span>
          </div>
          <div className="text-2xl font-semibold text-emerald-700 mt-0.5 font-mono">
            {result.passedCount.toLocaleString()}
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80">
          <div className="text-xs font-medium text-amber-800 flex items-center justify-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Đã sửa</span>
          </div>
          <div className="text-2xl font-semibold text-amber-700 mt-0.5 font-mono">
            {result.repairedCount.toLocaleString()}
          </div>
        </div>

        <div className="p-3 sm:p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200/80">
          <div className="text-xs font-medium text-rose-800 flex items-center justify-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Lỗi</span>
          </div>
          <div className="text-2xl font-semibold text-rose-700 mt-0.5 font-mono">
            {result.failedCount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        {/* Main Download ZIP Button (Clean 2-line layout) */}
        <button
          type="button"
          onClick={handleDownloadZip}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-all flex flex-col items-center justify-center"
        >
          <div className="flex items-center gap-2 text-sm sm:text-base font-semibold">
            <Download className="w-4 h-4" />
            <span>Tải ZIP</span>
          </div>
          <span className="text-[11px] text-indigo-100 font-normal mt-0.5">
            {totalValid.toLocaleString()} mã hợp lệ
          </span>
        </button>

        {/* Secondary Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleDownloadExcelReport}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Báo cáo kiểm tra (Excel)</span>
          </button>

          {onExportPdf && (
            <button
              type="button"
              onClick={onExportPdf}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-indigo-600" />
              <span>Tạo PDF tem nhãn</span>
            </button>
          )}
        </div>

        {/* Retry Failed button (if any failed items) */}
        {result.failedCount > 0 && (
          <button
            type="button"
            onClick={onRetryFailed}
            title="Sử dụng cấu hình an toàn hơn để quét lại các mã này"
            className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-rose-600" />
            <span>Thử lại {result.failedCount} mã lỗi</span>
          </button>
        )}
      </div>

      {/* Failed Items List - Compact with Detail Modal */}
      {failedItems.length > 0 && (
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-800">
              Mã không đạt chuẩn ({failedItems.length})
            </h4>
            <span className="text-[11px] text-slate-400 font-normal">Đã loại khỏi file ZIP</span>
          </div>

          <div className="max-h-44 overflow-y-auto space-y-1 text-xs pr-1">
            {failedItems.map((item) => (
              <div
                key={item.id}
                className="p-2 rounded-xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between hover:bg-slate-100/60 transition-colors"
              >
                <div className="truncate max-w-[280px]">
                  <span className="font-medium text-slate-800">#{item.index} {item.filename}: </span>
                  <span className="font-mono text-slate-500 text-[11px]">{item.data}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFailedItem(item)}
                  className="text-indigo-600 hover:text-indigo-800 text-[11px] font-medium shrink-0 ml-2 inline-flex items-center gap-0.5"
                >
                  <span>Chi tiết</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedFailedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600" />
                <h4 className="text-sm font-semibold text-slate-900">
                  Chi tiết mã #{selectedFailedItem.index} ({selectedFailedItem.filename})
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFailedItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-medium text-slate-600">Nội dung gửi vào:</span>
                <p className="mt-0.5 p-2 bg-slate-50 rounded-lg font-mono text-[11px] text-slate-800 break-all">
                  {selectedFailedItem.data}
                </p>
              </div>

              {selectedFailedItem.decodedText && (
                <div>
                  <span className="font-medium text-slate-600">Nội dung máy ảnh đọc được:</span>
                  <p className="mt-0.5 p-2 bg-slate-50 rounded-lg font-mono text-[11px] text-slate-800 break-all">
                    {selectedFailedItem.decodedText}
                  </p>
                </div>
              )}

              <div>
                <span className="font-medium text-slate-600">Lý do:</span>
                <p className="mt-0.5 text-rose-600 font-normal">
                  {selectedFailedItem.errorMessage || 'Camera không đọc được dữ liệu sau khi render'}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedFailedItem(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Start Over Button */}
      <div className="pt-2 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={onStartNewBatch}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          <span>Tạo một lô mới</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
