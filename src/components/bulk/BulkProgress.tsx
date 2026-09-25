import React from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { BatchProgress } from '../../services/batchService';

interface BulkProgressProps {
  progress: BatchProgress;
  onCancel: () => void;
}

export const BulkProgress: React.FC<BulkProgressProps> = ({ progress, onCancel }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-6 max-w-xl mx-auto text-center">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900">
          Đang tạo & kiểm thử mã QR
        </h3>
        <p className="text-xs text-slate-500 font-normal">
          Xử lý trực tiếp trên trình duyệt, vui lòng không đóng tab này
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-150"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs font-mono text-slate-500">
          <span>
            {progress.current.toLocaleString()} / {progress.total.toLocaleString()} mã
          </span>
          <span className="font-semibold text-indigo-600">{progress.percentage}%</span>
        </div>
      </div>

      {/* Real-time Tally Metrics */}
      <div className="grid grid-cols-3 gap-2 text-xs pt-1">
        <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-100 text-emerald-800">
          <div className="flex items-center justify-center gap-1 font-medium text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Đạt</span>
          </div>
          <div className="text-sm font-semibold mt-0.5 font-mono">{progress.passedCount}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-100 text-amber-800">
          <div className="flex items-center justify-center gap-1 font-medium text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Đã sửa</span>
          </div>
          <div className="text-sm font-semibold mt-0.5 font-mono">{progress.repairedCount}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-100 text-rose-800">
          <div className="flex items-center justify-center gap-1 font-medium text-[11px]">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Lỗi</span>
          </div>
          <div className="text-sm font-semibold mt-0.5 font-mono">{progress.failedCount}</div>
        </div>
      </div>

      {/* Current Filename Indicator */}
      {progress.currentFilename && (
        <p className="text-[11px] text-slate-400 font-mono truncate">
          Đang render: {progress.currentFilename}
        </p>
      )}

      {/* Cancel Button */}
      <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/70 border border-rose-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
        >
          <X className="w-3.5 h-3.5" />
          <span>Hủy bỏ</span>
        </button>
      </div>
    </div>
  );
};
