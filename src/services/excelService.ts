import * as XLSX from 'xlsx';
import { BulkItem } from '../types';

export interface ExcelWorkbookInfo {
  sheetNames: string[];
  selectedSheet: string;
  headers: string[];
  rows: Record<string, string>[];
  totalCount: number;
}

export async function parseExcelOrCsvFile(
  file: File,
  targetSheetName?: string
): Promise<ExcelWorkbookInfo> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, {
    type: 'array',
    cellDates: true,
    cellText: true,
  });

  const sheetNames = workbook.SheetNames;
  if (sheetNames.length === 0) {
    return { sheetNames: [], selectedSheet: '', headers: [], rows: [], totalCount: 0 };
  }

  const selectedSheet = targetSheetName && sheetNames.includes(targetSheetName)
    ? targetSheetName
    : sheetNames[0];

  const worksheet = workbook.Sheets[selectedSheet];

  // raw: false ensures strings like "00123" or phone numbers "090..." preserve leading zeros
  const rawJson = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
    raw: false,
    defval: '',
  });

  if (rawJson.length === 0) {
    return { sheetNames, selectedSheet, headers: [], rows: [], totalCount: 0 };
  }

  const headers = Object.keys(rawJson[0]);
  const rows: Record<string, string>[] = rawJson.map((row) => {
    const formatted: Record<string, string> = {};
    headers.forEach((h) => {
      formatted[h] = row[h] !== undefined && row[h] !== null ? String(row[h]).trim() : '';
    });
    return formatted;
  });

  return {
    sheetNames,
    selectedSheet,
    headers,
    rows,
    totalCount: rows.length,
  };
}

export function downloadSampleExcelTemplate(): void {
  const sampleData = [
    {
      'Nội Dung QR Code (Bắt buộc)': 'https://oloka.vn/san-pham/sp-01',
      'Tên File Tải Về (Tùy chọn)': 'SP01_Ao_Thun_Polo',
      'Nhãn In Kèm Dưới QR (Tùy chọn)': 'Áo Thun Polo - Size L',
      'Ghi Chú': 'Mã QR dẫn đến trang chi tiết sản phẩm 01',
    },
    {
      'Nội Dung QR Code (Bắt buộc)': 'https://oloka.vn/san-pham/sp-02',
      'Tên File Tải Về (Tùy chọn)': 'SP02_Quan_Jean_Slim',
      'Nhãn In Kèm Dưới QR (Tùy chọn)': 'Quần Jean Nam - Size 32',
      'Ghi Chú': 'Mã QR dẫn đến trang chi tiết sản phẩm 02',
    },
    {
      'Nội Dung QR Code (Bắt buộc)': 'WIFI:T:WPA;S:Oloka_Coffee;P:Oloka@2026;;',
      'Tên File Tải Về (Tùy chọn)': 'QR_WiFi_Oloka_Coffee',
      'Nhãn In Kèm Dưới QR (Tùy chọn)': 'Quét Để Kết Nối Wi-Fi',
      'Ghi Chú': 'QR đăng nhập Wi-Fi quán cafe',
    },
    {
      'Nội Dung QR Code (Bắt buộc)': 'tel:0903456789',
      'Tên File Tải Về (Tùy chọn)': 'Hotline_Ho_Tro',
      'Nhãn In Kèm Dưới QR (Tùy chọn)': 'Hotline Hỗ Trợ 24/7',
      'Ghi Chú': 'Quét gọi ngay hotline tư vấn',
    },
    {
      'Nội Dung QR Code (Bắt buộc)': 'https://facebook.com/olokavn',
      'Tên File Tải Về (Tùy chọn)': 'Fanpage_Facebook',
      'Nhãn In Kèm Dưới QR (Tùy chọn)': 'Theo dõi Fanpage Oloka',
      'Ghi Chú': 'Liên kết mạng xã hội Facebook',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  worksheet['!cols'] = [
    { wch: 38 },
    { wch: 28 },
    { wch: 32 },
    { wch: 42 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh_Sach_QR_Mau');
  XLSX.writeFile(workbook, 'Mau_Tao_Ma_QR_Hang_Loat_Oloka.xlsx');
}

export function exportValidationReportExcel(
  items: BulkItem[],
  filename: string = 'Bao_Cao_Kiem_Tra_QR_Batch.xlsx'
): void {
  const reportData = items.map((item, idx) => ({
    STT: idx + 1,
    'Dữ Liệu QR': item.data || '(Trống)',
    'Tên File': item.filename,
    'Nhãn In': item.label || '',
    'Trạng Thái': item.status === 'success' ? 'Thành Công' : item.status === 'error' ? 'Lỗi' : 'Chưa Xử Lý',
    'Ghi Chú Lỗi': item.errorMessage || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(reportData);
  worksheet['!cols'] = [
    { wch: 8 },
    { wch: 45 },
    { wch: 30 },
    { wch: 30 },
    { wch: 18 },
    { wch: 40 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ket_Qua_Kiem_Tra');
  XLSX.writeFile(workbook, filename);
}
