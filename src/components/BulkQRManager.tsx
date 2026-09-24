import React, { useState, useId } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  Printer,
  FileArchive,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';
import { BulkItem, QRDesignConfig } from '../types';
import {
  downloadSampleExcelTemplate,
  parseExcelOrCsvFile,
} from '../services/excelService';
import {
  cancelBatchProcessing,
  processAndDownloadBatchZip,
  BatchProgress,
} from '../services/batchService';
import { generatePrintablePDF } from '../services/pdfService';

interface BulkQRManagerProps {
  designConfig: QRDesignConfig;
  onPreviewItemSelect: (data: string) => void;
}

export const BulkQRManager: React.FC<BulkQRManagerProps> = ({
  designConfig,
  onPreviewItemSelect,
}) => {
  const fileInputId = useId();
  const [bulkInputType, setBulkInputType] = useState<'excel' | 'textarea'>('excel');

  // Textarea input state
  const [rawText, setRawText] = useState(
    'https://oloka.vn/sp-01\nhttps://oloka.vn/sp-02\nhttps://oloka.vn/sp-03\nhttps://oloka.vn/sp-04\nhttps://oloka.vn/sp-05'
  );
  const [textPrefix, setTextPrefix] = useState('qr');
  const [includeLabelFromText, setIncludeLabelFromText] = useState(true);

  // Excel state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [selectedDataCol, setSelectedDataCol] = useState<string>('');
  const [selectedFilenameCol, setSelectedFilenameCol] = useState<string>('');
  const [selectedLabelCol, setSelectedLabelCol] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<BatchProgress | null>(null);
  const [exportFormat, setExportFormat] = useState<'png' | 'webp'>('png');
  const [pdfGrid, setPdfGrid] = useState<'3x6' | '4x8'>('3x6');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Parse items from either Textarea or Excel
  const getBulkItems = (): BulkItem[] => {
    if (bulkInputType === 'textarea') {
      const lines = rawText
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      return lines.map((line, idx) => ({
        id: `text-${idx}`,
        index: idx,
        data: line,
        filename: `${textPrefix}_${String(idx + 1).padStart(3, '0')}`,
        label: includeLabelFromText ? line.substring(0, 30) : undefined,
        status: 'pending',
      }));
    } else {
      if (!selectedDataCol || rawRows.length === 0) return [];

      return rawRows
        .map((row, idx) => {
          const dataVal = row[selectedDataCol] || '';
          const nameVal = selectedFilenameCol ? row[selectedFilenameCol] : '';
          const labelVal = selectedLabelCol ? row[selectedLabelCol] : '';

          return {
            id: `row-${idx}`,
            index: idx,
            data: dataVal,
            filename: nameVal || `qr_${String(idx + 1).padStart(3, '0')}`,
            label: labelVal || undefined,
            status: dataVal ? 'pending' : 'error',
            errorMessage: dataVal ? undefined : 'Thiếu dữ liệu tạo mã QR',
          } as BulkItem;
        })
        .filter((item) => item.data.length > 0);
    }
  };

  const currentItems = getBulkItems();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setErrorMessage(null);
      const res = await parseExcelOrCsvFile(file);
      if (res.headers.length === 0 || res.rows.length === 0) {
        setErrorMessage('File tải lên không có dữ liệu hoặc không đúng định dạng');
        return;
      }

      setUploadedFile(file);
      setHeaders(res.headers);
      setRawRows(res.rows);

      // Auto pick smartest default columns
      const firstCol = res.headers[0];
      setSelectedDataCol(firstCol);

      const filenameCandidate = res.headers.find(
        (h) => /tên|file|name|mã|code|sku/i.test(h) && h !== firstCol
      );
      if (filenameCandidate) setSelectedFilenameCol(filenameCandidate);

      const labelCandidate = res.headers.find(
        (h) => /nhãn|label|tên sản phẩm|title/i.test(h)
      );
      if (labelCandidate) setSelectedLabelCol(labelCandidate);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Lỗi đọc file Excel');
    }
  };

  const handleDownloadZip = async () => {
    if (currentItems.length === 0) {
      setErrorMessage('Chưa có danh sách mã QR để tạo. Vui lòng nhập dữ liệu hoặc tải file Excel');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setProgress({ current: 0, total: currentItems.length, percentage: 0, currentFilename: 'Bắt đầu xử lý...' });

    try {
      const filenameBase = uploadedFile ? uploadedFile.name.replace(/\.[^.]+$/, '') : 'oloka_qr_batch';
      await processAndDownloadBatchZip(
        currentItems,
        designConfig,
        exportFormat,
        filenameBase,
        (p) => setProgress(p)
      );
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Có lỗi xảy ra khi tạo file ZIP');
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const handleDownloadPDF = async () => {
    if (currentItems.length === 0) {
      setErrorMessage('Chưa có danh sách mã QR để in');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const [cols, rows] = pdfGrid === '3x6' ? [3, 6] : [4, 8];
      const filenameBase = uploadedFile ? `${uploadedFile.name.replace(/\.[^.]+$/, '')}_tem_nhan` : 'oloka_tem_nhan_a4';
      await generatePrintablePDF(
        currentItems,
        designConfig,
        {
          columns: cols,
          rows: rows,
          pageSize: 'a4',
          showCutBorder: true,
          showLabels: true,
        },
        filenameBase
      );
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Lỗi xuất file PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredPreviewRows = currentItems.filter(
    (item) =>
      item.data.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.label && item.label.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-6">
      {/* Switch Input Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            <span>Tạo Mã QR Hàng Loạt (Bulk Generator)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tạo đồng thời hàng trăm mã QR, tải về trọn bộ file ZIP hoặc in tem nhãn PDF
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setBulkInputType('excel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              bulkInputType === 'excel'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>File Excel / CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setBulkInputType('textarea')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              bulkInputType === 'textarea'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Nhập Văn Bản Nhiều Dòng</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Excel / CSV Upload */}
      {bulkInputType === 'excel' && (
        <div className="space-y-4">
          {!uploadedFile ? (
            <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20 rounded-2xl p-6 sm:p-8 text-center transition-all">
              <input
                type="file"
                id={fileInputId}
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor={fileInputId} className="cursor-pointer block">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3 shadow-2xs">
                  <Upload className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Kéo thả file Excel (.xlsx, .xls) hoặc CSV vào đây
                </p>
                <p className="text-xs text-slate-500 mt-1">hoặc bấm vào để chọn file từ máy tính của bạn</p>
              </label>

              <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={downloadSampleExcelTemplate}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-700 text-xs font-semibold transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải File Excel Mẫu Chuẩn (.xlsx)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info Card */}
              <div className="flex items-center justify-between p-3.5 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{uploadedFile.name}</h3>
                    <p className="text-xs text-slate-500">
                      Đã đọc thành công <span className="font-bold text-indigo-600">{rawRows.length}</span> dòng dữ liệu
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={downloadSampleExcelTemplate}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-white border border-emerald-200 rounded-lg shadow-2xs hover:bg-emerald-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>File Mẫu</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFile(null);
                      setHeaders([]);
                      setRawRows([]);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white transition-all"
                    title="Chọn file khác"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Column Mapping Section */}
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Ánh Xạ Cột Dữ Liệu (Column Mapping)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cột Dữ Liệu QR <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={selectedDataCol}
                      onChange={(e) => setSelectedDataCol(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/30"
                    >
                      {headers.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cột Đặt Tên File Tải Về
                    </label>
                    <select
                      value={selectedFilenameCol}
                      onChange={(e) => setSelectedFilenameCol(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/30"
                    >
                      <option value="">(Tự động đặt theo số thứ tự qr_001...)</option>
                      {headers.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cột Nhãn In Kèm Dưới QR
                    </label>
                    <select
                      value={selectedLabelCol}
                      onChange={(e) => setSelectedLabelCol(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/30"
                    >
                      <option value="">(Không in chữ bên dưới)</option>
                      {headers.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Multi-line Textarea */}
      {bulkInputType === 'textarea' && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Danh Sách Nội Dung (Mỗi dòng là một mã QR)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setRawText(
                      'SP001 - Áo Thun Trắng\nSP002 - Quần Jean Slimfit\nSP003 - Giày Thể Thao\nSP004 - Mũ Lưỡi Trai\nSP005 - Kính Râm Thời Trang'
                    )
                  }
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  Nạp dữ liệu mẫu
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={() => setRawText('')}
                  className="text-xs text-slate-500 hover:text-slate-700 font-semibold"
                >
                  Xoá hết
                </button>
              </div>
            </div>

            <textarea
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Nhập danh sách đường link hoặc nội dung, mỗi dòng là một mã QR code..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-y"
            />

            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <p>
                Tổng số dòng:{' '}
                <span className="font-bold text-indigo-600">{currentItems.length} mã QR</span>
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span>Tiền tố tên file:</span>
                  <input
                    type="text"
                    value={textPrefix}
                    onChange={(e) => setTextPrefix(e.target.value)}
                    className="w-20 px-2 py-0.5 bg-white border border-slate-200 rounded text-xs"
                    placeholder="qr"
                  />
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLabelFromText}
                    onChange={(e) => setIncludeLabelFromText(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span>In kèm dòng chữ dưới QR</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message banner */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Data Preview Table */}
      {currentItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Bảng Xem Trước Dữ Liệu ({currentItems.length} mã)
            </h3>
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm dòng..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="max-h-52 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/90 text-slate-600 font-semibold sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">STT</th>
                    <th className="py-2.5 px-3">Nội Dung QR</th>
                    <th className="py-2.5 px-3 w-40">Tên File</th>
                    <th className="py-2.5 px-3 w-36">Nhãn Dưới QR</th>
                    <th className="py-2.5 px-3 w-20 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPreviewRows.slice(0, 10).map((row) => (
                    <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="py-2 px-3 text-center text-slate-400 font-mono">
                        {row.index + 1}
                      </td>
                      <td className="py-2 px-3 font-medium text-slate-800 truncate max-w-xs">
                        {row.data}
                      </td>
                      <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">
                        {row.filename}.{exportFormat}
                      </td>
                      <td className="py-2 px-3 text-slate-500 truncate max-w-[120px]">
                        {row.label || '-'}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onPreviewItemSelect(row.data)}
                          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline"
                          title="Xem thử mã QR này trên khung bên phải"
                        >
                          Xem thử
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredPreviewRows.length > 10 && (
              <div className="py-2 px-3 bg-slate-50 text-[11px] text-slate-500 border-t border-slate-100 text-center">
                Đang hiển thị 10/{filteredPreviewRows.length} dòng đầu tiên. Tất cả {currentItems.length} mã sẽ được tạo đầy đủ khi tải về.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar Modal/Notification when generating */}
      {isProcessing && progress && (
        <div className="p-4 bg-indigo-50/90 border border-indigo-200 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>Đang render mã QR: {progress.current} / {progress.total}</span>
            </span>
            <span className="font-mono text-indigo-600">{progress.percentage}%</span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="truncate max-w-xs">Đang xử lý: {progress.currentFilename}</span>
            <button
              type="button"
              onClick={cancelBatchProcessing}
              className="text-rose-600 hover:text-rose-700 font-semibold"
            >
              Dừng lại
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons Bar */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Export format & PDF Grid settings */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-semibold">Định dạng ảnh:</span>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 text-xs"
            >
              <option value="png">PNG (300 DPI Siêu Nét)</option>
              <option value="webp">WebP (Dung Lượng Nhẹ)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-semibold">Lưới in tem PDF:</span>
            <select
              value={pdfGrid}
              onChange={(e) => setPdfGrid(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 text-xs"
            >
              <option value="3x6">Khổ A4 (18 tem / trang)</option>
              <option value="4x8">Khổ A4 (32 tem nhỏ / trang)</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            disabled={isProcessing || currentItems.length === 0}
            onClick={handleDownloadPDF}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold shadow-2xs transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>In Tem Nhãn PDF</span>
          </button>

          <button
            type="button"
            disabled={isProcessing || currentItems.length === 0}
            onClick={handleDownloadZip}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <FileArchive className="w-4 h-4" />
            <span>Tạo & Tải Về File ZIP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
