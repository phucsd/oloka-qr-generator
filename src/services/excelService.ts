import * as XLSX from 'xlsx';

export interface ExcelParseResult {
  headers: string[];
  rows: Record<string, string>[];
  totalCount: number;
}

export async function parseExcelOrCsvFile(file: File): Promise<ExcelParseResult> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert to array of objects
  const rawJson = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

  if (rawJson.length === 0) {
    return { headers: [], rows: [], totalCount: 0 };
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

  // Set nice column widths
  worksheet['!cols'] = [
    { wch: 38 }, // Nội dung QR
    { wch: 28 }, // Tên File
    { wch: 32 }, // Nhãn in kèm
    { wch: 42 }, // Ghi chú
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh_Sach_QR_Mau');

  XLSX.writeFile(workbook, 'Mau_Tao_Ma_QR_Hang_Loat_Oloka.xlsx');
}
