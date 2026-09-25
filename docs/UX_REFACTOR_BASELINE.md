# Oloka QR Generator — UX Refactor Baseline

> Tài liệu kiểm kê hiện trạng (Baseline Audit) trước khi tiến hành UX Refactor. Được lập theo yêu cầu tại Phần 3 & Phần 70 của kế hoạch Refactor.

---

## 1. Existing Features (Tính Năng Đang Hoạt Động)

### 1.1. Single QR
- **14 loại nội dung**: Website URL, VietQR (chuyển khoản ngân hàng), Văn bản (Text), Wi-Fi (WPA/WEP/Hidden), Danh bạ vCard 3.0, E-mail, Điện thoại, SMS, WhatsApp, Zoom Meeting, Sự kiện iCalendar, PayPal, Vị trí bản đồ (Google Maps), Mạng xã hội.
- **Tùy biến thiết kế**:
  - Màu sắc: Đơn sắc, Gradient chuyển màu (Linear/Radial xoay góc), nền trong suốt, màu riêng cho mắt QR (Corner squares & inner dots).
  - Kiểu dáng hạt: Vuông (square), chấm tròn (dots), bo góc (rounded), siêu tròn (extra-rounded), classy, classy-rounded.
  - Khung viền mắt: Vuông, bo tròn, tròn hoàn toàn; Chấm tâm mắt: Vuông, tròn.
  - Logo thương hiệu: Upload từ máy, chọn 7 preset logo phổ biến (VietQR, Zalo, Facebook, TikTok, Instagram, YouTube, WiFi), thanh trượt tỷ lệ logo, tạo khoảng trống đệm phía sau logo (`clearLogoBackground`).
  - Đóng khung viền CTA: Không khung, thanh dưới, thanh trên, bong bóng, khung thẻ viền; chữ CTA, màu khung, màu chữ, font chữ.
  - Thông số kỹ thuật: Kích thước pixel (300, 500, 1000, 2000px), mức sửa lỗi ECC (L, M, Q, H), viền lề an toàn Quiet Zone (px).
- **Xem trước & Xuất file**:
  - Live preview canvas thời gian thực.
  - Tải file: PNG (độ phân giải cao), SVG (Vector XML thật), WebP.
  - Sao chép ảnh vào Clipboard (`ClipboardItem`).
  - Chia sẻ ảnh trực tiếp qua Web Share API (`navigator.share({ files: [file] })`).

### 1.2. Bulk QR
- **Nguồn dữ liệu**:
  - Nhập danh sách nhiều dòng văn bản (Multiline textarea).
  - Tải lên File Excel (`.xlsx`, `.xls`) hoặc `.csv`.
  - Kéo thả file HTML5 Drag & Drop (`onDragOver`, `onDragLeave`, `onDrop`).
  - Hỗ trợ file Excel có nhiều trang tính (Multi-sheet selector).
  - Tải file Excel mẫu `.xlsx` chuẩn cột.
- **Ánh xạ cột (Column Mapping)**:
  - Chọn cột dữ liệu QR (Content Column).
  - Chọn cột tên file (Filename Column).
  - Chọn cột nhãn chữ in tem (Label Column).
- **Xem trước & Quản lý dữ liệu**:
  - Bảng Data Grid xem trước từng dòng dữ liệu và trạng thái hợp lệ/lỗi.
  - Thanh tìm kiếm lọc dòng.
  - Báo cáo số lượng tổng, số dòng hợp lệ, số dòng lỗi dữ liệu.
- **Xuất hàng loạt**:
  - Đóng gói file `.ZIP` chứa toàn bộ ảnh QR (PNG hoặc WebP) kèm file `bao_cao_kiem_tra.csv`.
  - Tự động chống trùng tên file (`_2`, `_3`).
  - Xuất bảng in tem nhãn PDF khổ A4 theo các preset decal (18 tem, 30 tem, 8 tem) render tiếng Việt bằng Canvas.
  - Xuất file Excel báo cáo kiểm tra (`exportValidationReportExcel`).

---

## 2. Existing Working Flows (Luồng Đang Hoạt Động Hiện Tại)

### Flow 1: Tạo QR Đơn Lẻ (Single)
1. Người dùng chọn 1 trong 14 tab loại QR nằm ngang ở đầu trang.
2. Nhập thông tin vào các trường tương ứng của loại QR đó.
3. Cuộn xuống dưới màn hình để mở các accordion của `DesignCustomizer` (Màu sắc, Kiểu dáng, Logo, Khung, Nâng cao).
4. Quan sát Live Preview ở cột bên phải (sticky), thấy nhãn kết quả quét của ZXing (`PASS` hoặc `CẢNH BÁO`).
5. Bấm một trong 5 nút: Tải PNG, Tải SVG, Tải WebP, Copy ảnh, Share ảnh.

### Flow 2: Tạo QR Hàng Loạt (Bulk)
1. Chuyển tab sang "Tạo Hàng Loạt" trên Header.
2. Chọn tab con "Tải File Excel / CSV" hoặc "Nhập Nhiều Dòng".
3. Kéo thả file hoặc browse file. Nếu có nhiều sheet, chọn sheet trong dropdown.
4. Chọn 3 dropdown ánh xạ: Cột nội dung QR, Cột tên file, Cột nhãn in.
5. Xem trước các dòng trong bảng table ở ngay phía dưới.
6. Cuộn xuống để chỉnh thiết kế chung trong `DesignCustomizer`.
7. Chọn định dạng xuất (PNG/WebP), tùy chọn kích thước, tùy chọn in PDF.
8. Bấm "Tạo & Tải Về File ZIP" hoặc "In Tem Nhãn PDF".
9. Thanh tiến trình chạy % và số lượng. Khi hoàn tất, file ZIP hoặc PDF tự động tải về máy.

---

## 3. Existing Important Functions (Hàm Lõi Tuyệt Đối Không Được Phá)

| Tên Hàm / Hằng Số | File Định Nghĩa | Vai Trò & Ràng Buộc Bắt Buộc |
| :--- | :--- | :--- |
| `formatQRContent(type, data)` | `src/services/qrFormatter.ts` | Sinh chuỗi payload cho 14 loại QR. Phải giữ chuẩn escaping Wi-Fi, vCard RFC 6350 `N:Last;First;;;`, Zoom clean URL/ID, iCalendar UTC `YYYYMMDDTHHMMSSZ`. |
| `generateVietQRPayload(options)` | `src/services/vietqrService.ts` | Sinh mã VietQR Napas247 EMVCo. BẮT BUỘC giữ Service Code `0208QRIBFTTA`, độ dài TLV UTF-8 byte và CRC16 trên byte stream. |
| `fetchLiveBankList()` | `src/services/vietqrService.ts` | Lấy 55+ ngân hàng từ API VietQR, cache 24h localStorage + 34 fallback banks. |
| `renderQRToVectorSVG(content, config)` | `src/services/qrService.ts` | Xuất XML Vector SVG thật với thẻ `<rect>`, `<text>`. Tuyệt đối không nhúng raster PNG vào SVG. |
| `renderQRCode(container, content, config)` | `src/services/qrService.ts` | Wrapper render `qr-code-styling` với frame, text label, quiet zone an toàn. Chặn payload rỗng (ném lỗi `EMPTY_PAYLOAD`). |
| `decodeQR(canvas, expectedContent)` | `src/services/qrVerification.ts` | Sử dụng `@zxing/browser` giải mã Canvas thực tế và so khớp với payload gốc. |
| `parseExcelOrCsvFile(file)` | `src/services/excelService.ts` | Đọc file Excel/CSV bằng SheetJS với `raw: false` để giữ nguyên số 0 ở đầu (SKU, STK, SĐT). Hỗ trợ `workbook.SheetNames`. |
| `generateSampleExcel()` | `src/services/excelService.ts` | Sinh file `.xlsx` mẫu chuẩn cho người dùng tải về. |
| `exportValidationReportExcel(items)` | `src/services/excelService.ts` | Xuất báo cáo kiểm tra file Excel chi tiết. |
| `generateQRPdf(items, config, presetId, options)` | `src/services/pdfService.ts` | Xuất PDF in tem nhãn decal A4 chuẩn kích thước vật lý (18 tem, 30 tem, 8 tem) bằng Canvas UTF-8. Mặc định `showOlokaFooter: false`. |

---

## 4. Known Defects (Khiếm Khuyết Hiện Tại Được Xác Định Cần Giải Quyết)

1. **ZXing là "tem trang trí" trong Batch (P0)**: Khi `!validation.match`, chỉ ghi `console.warn`, vẫn thêm vào ZIP, gán `status = 'success'` và tăng `successCount++`.
2. **Single QR xử lý ZXing fail sai ngữ nghĩa**: Decode fail hiển thị màu vàng `CẢNH BÁO` thay vì màu đỏ `✕ SCAN FAILED`, và vẫn cho bấm tải PNG/SVG/WebP mà không có cảnh báo/chặn.
3. **Quiet Zone thể hiện sai**: Slider là pixel 0–30px thay vì chuẩn tối thiểu 4 modules (hoặc các preset Safe / Compact).
4. **Bulk thiếu màn hình Kết Quả (Results Screen)**: Sau khi nén xong file ZIP tự động tải về và thanh tiến trình biến mất; người dùng không biết có bao nhiêu mã PASS, bao nhiêu FAIL, không có nút Retry mã lỗi.
5. **Batch thiếu tùy chọn xuất SVG**: Single có SVG nhưng Batch ZIP chỉ có PNG và WebP.
6. **Không có Preset / Template Thiết Kế**: Người dùng tinh chỉnh màu, logo, mắt, viền xong đóng tab là mất hết, không có các mẫu chuẩn (Classic, Rounded, Modern, Print-Safe) chọn nhanh 1 cú click.
7. **Mapping cột chỉ hỗ trợ 1:1**: Chưa có expression mapping dạng `{SKU}_{ProductName}` hoặc `https://domain.vn/{SKU}`.
8. **Bảng dữ liệu Batch thiếu selection workflow**: Chưa có checkbox chọn dòng, filter theo Trạng thái (All / Passed / Failed).
9. **Cognitive Overload (Rối giao diện)**:
   - Header + Hero khổng lồ choáng nửa màn hình đầu tiên với nhiều badge và CTA trùng lặp.
   - 14 loại QR nằm ngang bắt cuộn ngang.
   - 5 accordion thiết kế mở cùng lúc quá dài.
   - Bulk mode phơi bày đồng thời upload, mapping, table, format, pdf, export.
   - Phần SEO dính liền ngay dưới tool gây hiểu nhầm vẫn còn trong ứng dụng.

---

## 5. Components To Preserve / Refactor Mapping

| Component Cũ | Trạng Thái / Hướng Xử Lý | Component Mới / Tương Ứng |
| :--- | :--- | :--- |
| `src/components/Navbar.tsx` | Refactor tinh gọn | `src/components/AppHeader.tsx`: Bỏ badge nhấp nháy, CTA kép; giữ logo Oloka QR, bộ chuyển Single / Bulk, liên kết Mẫu thiết kế & Trợ giúp. |
| `src/components/HeroSection.tsx` | Xóa khỏi trên cùng tool | Chuyển thành phần giới thiệu ngắn gọn gọn gàng (80–120px) hoặc đặt ngay trên phần SEO dưới cùng. Đảm bảo màn hình đầu tiên hiển thị ngay Workspace. |
| `src/components/SingleQRForm.tsx` (14 tabs ngang) | Refactor chia nhỏ | `src/components/single/QRTypePicker.tsx` (dạng dropdown / phân nhóm gọn gàng) + `src/components/single/QRInputForm.tsx`. |
| `src/components/DesignCustomizer.tsx` (5 accordion dài) | Refactor thành Tabs | `src/components/design/DesignTabs.tsx` với các tab con: `StylePanel.tsx`, `LogoPanel.tsx`, `FramePanel.tsx`, `AdvancedPanel.tsx` + bộ Presets nhanh (`Classic`, `Rounded`, `Modern`, `Print-Safe`). Dùng chung cho cả Single và Bulk! |
| `src/components/QRPreviewSticky.tsx` (5 button cạnh tranh) | Refactor tinh gọn | `src/components/single/QRPreviewPanel.tsx`: Live canvas + Quality Gate badge 3 trạng thái (`✓ Scan verified` xanh, `◌ Checking...`, `✕ Scan failed` đỏ) + Primary button `[ Download PNG ▼ ]` dropdown (PNG/SVG/WebP) + nút phụ Copy/Share. |
| `src/components/BulkQRManager.tsx` (Component 900+ dòng) | Phân rã thành Wizard 5 bước | `src/components/bulk/BulkWorkspace.tsx` điều phối `BulkStepper.tsx` (Data → Mapping → Design → Generate → Results). |
| `src/components/SEOArticle.tsx` | Giữ nguyên nội dung SEO | Đặt dưới `hr` phân cách rõ ràng (`──────── KẾT THÚC CÔNG CỤ / TÀI LIỆU HƯỚNG DẪN ────────`). |
| `src/components/Footer.tsx` | Giữ nguyên | Chân trang bản quyền, liên kết và mã nguồn GitHub. |
