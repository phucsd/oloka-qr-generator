import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, FileText, Download, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';
import { ExcelWorkbookInfo, downloadSampleExcelTemplate, parseExcelOrCsvFile } from '../../services/excelService';

interface DataStepProps {
  dataSourceType: 'file' | 'text';
  setDataSourceType: (type: 'file' | 'text') => void;
  workbookInfo: ExcelWorkbookInfo | null;
  uploadedFile: File | null;
  onWorkbookLoaded: (info: ExcelWorkbookInfo, file: File) => void;
  onSheetChange: (sheetName: string) => void;
  rawTextLines: string;
  onTextLinesChange: (text: string) => void;
  onContinue: () => void;
}

export const DataStep: React.FC<DataStepProps> = ({
  dataSourceType,
  setDataSourceType,
  workbookInfo,
  uploadedFile,
  onWorkbookLoaded,
  onSheetChange,
  rawTextLines,
  onTextLinesChange,
  onContinue,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setErrorMsg(null);
    setIsLoadingFile(true);
    try {
      const info = await parseExcelOrCsvFile(file);
      if (info.totalCount === 0) {
        setErrorMsg('File được chọn không chứa dữ liệu hợp lệ');
        return;
      }
      onWorkbookLoaded(info, file);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Không thể đọc file: ' + (err?.message || 'Định dạng không được hỗ trợ'));
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFileProcess(file);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileProcess(file);
    }
  };

  // Stats for multiline text
  const rawLines = rawTextLines.split('\n');
  const totalRawCount = rawLines.length;
  const validLineCount = rawLines.filter((l) => l.trim().length > 0).length;
  const emptyLineCount = totalRawCount - validLineCount;

  const canContinue =
    (dataSourceType === 'file' && workbookInfo && workbookInfo.totalCount > 0) ||
    (dataSourceType === 'text' && validLineCount > 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-7 space-y-6">
      {/* Top Source Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Bước 1: Nhập Dữ Liệu Tạo Hàng Loạt
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Chọn file bảng tính Excel/CSV hoặc dán trực tiếp danh sách nội dung
          </p>
        </div>

        {/* Source Mode Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/70 shrink-0">
          <button
            type="button"
            onClick={() => setDataSourceType('file')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              dataSourceType === 'file'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>File Excel / CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setDataSourceType('text')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              dataSourceType === 'text'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Dán Danh Sách</span>
          </button>
        </div>
      </div>

      {/* Mode A: File Upload */}
      {dataSourceType === 'file' && (
        <div className="space-y-4">
          {!workbookInfo ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 sm:p-12 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-600 bg-indigo-50/50 scale-[0.99]'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                Kéo thả file Excel (.xlsx, .xls) hoặc CSV vào đây
              </h3>
              <p className="text-xs text-slate-500 mt-1">hoặc bấm vào khung để duyệt file từ máy tính</p>
            </div>
          ) : (
            /* Uploaded File Info Card */
            <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {uploadedFile?.name || 'File Dữ Liệu'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Đã phát hiện <strong className="text-slate-800 font-semibold">{workbookInfo.totalCount.toLocaleString()}</strong> dòng dữ liệu
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Đổi file khác</span>
                </button>
              </div>

              {/* Multi-Sheet Selector */}
              {workbookInfo.sheetNames.length > 1 && (
                <div className="pt-3 border-t border-slate-200/70 flex items-center gap-3 text-xs">
                  <span className="font-semibold text-slate-700 shrink-0">Chọn Sheet:</span>
                  <select
                    value={workbookInfo.selectedSheet}
                    onChange={(e) => onSheetChange(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-indigo-700 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {workbookInfo.sheetNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <span className="text-slate-400 text-[11px]">(File có {workbookInfo.sheetNames.length} trang tính)</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-medium pt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Đã nạp dữ liệu thành công. Bấm Tiếp Tục để cấu hình cột.</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl font-medium">
              {errorMsg}
            </p>
          )}

          {/* Sample XLSX Helper */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">Chưa có bảng mẫu chuẩn?</span>
            <button
              type="button"
              onClick={downloadSampleExcelTemplate}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file Excel mẫu (.xlsx)</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode B: Paste Lines */}
      {dataSourceType === 'text' && (
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-700">
              Nhập danh sách nội dung (Mỗi dòng là một mã QR):
            </label>
            <button
              type="button"
              onClick={() =>
                onTextLinesChange(
                  'https://oloka.vn/sp-01\nhttps://oloka.vn/sp-02\nhttps://oloka.vn/sp-03\nWIFI:T:WPA;S:Coffee_Guest;P:Coffee123;;\ntel:0903456789'
                )
              }
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Dán dữ liệu mẫu
            </button>
          </div>

          <textarea
            rows={7}
            value={rawTextLines}
            onChange={(e) => onTextLinesChange(e.target.value)}
            placeholder="https://example.com/item1&#10;https://example.com/item2&#10;https://example.com/item3..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-mono focus:ring-2 focus:ring-indigo-500/20"
          />

          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span>
              Phát hiện: <strong className="text-slate-800 font-semibold">{validLineCount}</strong> dòng hợp lệ
            </span>
            {emptyLineCount > 0 && (
              <span className="text-amber-600">({emptyLineCount} dòng trống được tự động bỏ qua)</span>
            )}
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
        <button
          type="button"
          disabled={!canContinue || isLoadingFile}
          onClick={onContinue}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2"
        >
          <span>Tiếp Tục (Ánh Xạ Cột)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
