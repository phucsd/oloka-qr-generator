import React, { useEffect } from 'react';
import {
  Download,
  FileSpreadsheet,
  RefreshCw,
  Printer,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileArchive,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BatchResult, downloadBatchZipFile } from '../../services/batchService';
import { exportValidationReportExcel } from '../../services/excelService';

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
  // Fire confetti if 100% passed with zero failures!
  useEffect(() => {
    if (result.failedCount === 0 && result.total > 0) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
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

  const failedItems = result.reportItems.filter((it) => it.status === 'failed' || it.status === 'mismatch');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Hoàn Tất Xử Lý Lô Mã QR!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Đã kiểm thử và đóng gói hoàn tất <strong className="text-slate-800">{result.total.toLocaleString()}</strong> mã QR
        </p>
      </div>

      {/* Completion Stat Badges */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 sm:p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
          <div className="text-xs font-semibold text-emerald-800 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đạt Chuẩn (PASS)</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 font-mono">
            {result.passedCount.toLocaleString()}
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80">
          <div className="text-xs font-semibold text-amber-800 flex items-center justify-center gap-1">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Đã Tự Sửa Lỗi</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1 font-mono">
            {result.repairedCount.toLocaleString()}
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80">
          <div className="text-xs font-semibold text-rose-800 flex items-center justify-center gap-1">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>Thất Bại</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-700 mt-1 font-mono">
            {result.failedCount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Download ZIP Button (Passed files only) */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleDownloadZip}
          className="w-full py-3.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          <span>Tải Về File ZIP Mã Hợp Lệ ({result.passedCount + result.repairedCount} file)</span>
        </button>

        {/* Secondary Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleDownloadExcelReport}
            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Tải Báo Cáo Kiểm Tra (Excel)</span>
          </button>

          {onExportPdf && (
            <button
              type="button"
              onClick={onExportPdf}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-indigo-600" />
              <span>In Tem Nhãn PDF (A4 Decal)</span>
            </button>
          )}
        </div>

        {/* Retry Failed button (if any failed items) */}
        {result.failedCount > 0 && (
          <button
            type="button"
            onClick={onRetryFailed}
            className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-rose-600" />
            <span>Thử Lại {result.failedCount} Mã Bị Lỗi Với Tùy Chỉnh An Toàn Hơn</span>
          </button>
        )}
      </div>

      {/* Failed Items Drawer / List */}
      {failedItems.length > 0 && (
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Chi Tiết {failedItems.length} Mã Không Đạt Chuẩn
          </h4>
          <div className="max-h-48 overflow-y-auto space-y-1.5 text-xs pr-1">
            {failedItems.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
              >
                <div className="truncate max-w-[260px]">
                  <span className="font-semibold text-slate-900">#{item.index} {item.filename}: </span>
                  <span className="font-mono text-slate-500">{item.data}</span>
                </div>
                <span className="text-rose-600 text-[11px] shrink-0 font-medium ml-2">
                  {item.errorMessage || 'Lỗi quét'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Start Over Button */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="button"
          onClick={onStartNewBatch}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
        >
          <span>Tạo Một Lô Mã QR Khác</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
