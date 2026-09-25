# Oloka QR Generator — UX Refactor Implementation Plan

> Kế hoạch thực thi chi tiết 6 giai đoạn (Phase UX-1 đến Phase UX-6) theo đặc tả kiến trúc sản phẩm.

---

## 1. Mục Tiêu & Định Nghĩa Hoàn Thành (Definition of Done)

- **Single QR**: Người dùng nhập URL/chọn loại QR → thấy preview ngay lập tức → thấy trạng thái `✓ Scan verified` → tải về thành công trong < 30 giây mà không bị choáng ngợp bởi hàng chục control.
- **Bulk QR**: Người dùng tải Excel/dán danh sách → ánh xạ cột → chọn mẫu thiết kế → bấm tạo → thấy tiến trình → xem màn hình kết quả (Tổng, Đạt, Lỗi) → chủ động tải ZIP các mã đạt hoặc thử lại mã lỗi.
- **Không phá vỡ bất kỳ logic lõi nào**: Toàn bộ các chuẩn đã fix ở đợt audit trước (VietQR `QRIBFTTA`, UTF-8 byte length/CRC, SVG vector thật, SheetJS `raw: false`, escape Wi-Fi/vCard/Event, PDF decal tiếng Việt) được bảo toàn 100%.

---

## 2. Lộ Trình 6 Giai Đoạn (Phases)

### Phase UX-1: App Shell & Layout Hierarchy
- [ ] Tạo `src/components/AppHeader.tsx`:
  - Logo Oloka QR tinh tế, bộ chuyển chế độ `[ QR Đơn Lẻ ] [ Tạo Hàng Loạt ]`.
  - Menu góc phải: `Mẫu Thiết Kế (Templates)`, `Trợ Giúp (Help / Giới thiệu / Cài đặt PWA / GitHub)`.
  - Loại bỏ hoàn toàn Hero banner khổng lồ, badge nhấp nháy, CTA trùng lặp phía trên công cụ.
- [ ] Tổ chức lại `App.tsx`:
  - Viewport đầu tiên trên máy tính thấy ngay thanh tiêu đề ngắn gọn (80–100px) và trực tiếp vào khu vực công cụ (Workspace).
  - Phân tách rõ ràng giữa khu vực Workspace và phần Cẩm nang SEO bên dưới bằng đường phân cách `──────── CẨM NANG & KIẾN THỨC QR CODE ────────`.

### Phase UX-2: Tái Cấu Trúc Single QR Flow
- [ ] Tạo `src/components/single/QRTypePicker.tsx`:
  - Thay thế thanh 14 tab cuộn ngang bằng nút chọn dropdown/popover thông minh, phân thành 4 nhóm rõ ràng:
    - **Phổ biến**: Website (URL), VietQR (Ngân hàng), Văn bản (Text), Wi-Fi.
    - **Liên hệ**: Danh bạ (vCard), E-mail, Điện thoại, Tin nhắn SMS.
    - **Tiện ích**: WhatsApp, Zoom Meeting, Sự kiện (iCalendar), Bản đồ (Location).
    - **Khác**: PayPal, Mạng xã hội.
- [ ] Tạo `src/components/single/QRInputForm.tsx`:
  - Kế thừa và tinh gọn các form nhập liệu từ `SingleQRForm.tsx` tương ứng với loại QR đang chọn.
- [ ] Tạo hệ thống `DesignTabs` dùng chung (`src/components/design/`):
  - `DesignTabs.tsx`: Thanh tab gọn gàng gồm `[ Giao Diện (Style) ] [ Logo ] [ Khung Viền ] [ Nâng Cao ]`.
  - Mặc định chỉ mở tab **Giao Diện (Style)** với các mẫu Preset 1 click (`Classic`, `Rounded`, `Modern`, `High Contrast`, `Print Safe`) + Màu vẽ & Màu nền.
  - Các thiết lập sâu (Góc mắt, chấm tâm, góc xoay gradient, mức sửa lỗi, quiet zone) đưa vào tab **Nâng Cao (Advanced)** để người dùng thông thường không bị rối.
- [ ] Tạo `src/components/single/QRPreviewPanel.tsx`:
  - Canvas xem trước sắc nét thời gian thực.
  - Quality Gate Badge chuẩn 3 trạng thái:
    - `✓ Scan verified` (Xanh lá).
    - `◌ Đang kiểm tra...` (Xanh dương / Xám).
    - `✕ Scan failed` (Đỏ rực) kèm hướng dẫn khắc phục: giảm kích thước logo, tăng độ tương phản, tăng lề an toàn.
  - Nút tải chính duy nhất: `[ Tải Về PNG ▼ ]` tích hợp menu thả xuống để tải SVG hoặc WebP.
  - Nút phụ: `Sao chép ảnh` và `Chia sẻ`.

### Phase UX-3: Tái Cấu Trúc Bulk QR Thành Wizard 5 Bước
- [ ] Tạo `src/components/bulk/BulkWorkspace.tsx` và `BulkStepper.tsx`:
  - Quản lý trạng thái bước: `type BulkStep = 'data' | 'mapping' | 'design' | 'generate' | 'results'`.
- [ ] **Bước 1 — Data (`DataStep.tsx`)**:
  - Tùy chọn: `[ File Excel / CSV ]` hoặc `[ Dán Văn Bản ]`.
  - Vùng kéo thả file HTML5 sạch sẽ + nút "Tải File Excel Mẫu (.xlsx)".
  - Sau khi chọn file: hiển thị tên file, số dòng tìm thấy, bộ chọn Sheet nếu có nhiều trang tính, nút [Tiếp tục →].
- [ ] **Bước 2 — Mapping (`MappingStep.tsx`)**:
  - 3 trường chọn cột: Cột nội dung QR (bắt buộc), Cột tên file, Cột nhãn in tem.
  - Hỗ trợ cú pháp ghép cột (Expression) dạng `{SKU}_{ProductName}` hoặc link web.
  - Bảng xem trước tối đa 10 dòng đầu kèm số lượng dòng hợp lệ và nút mở drawer xem các dòng bị lỗi.
  - Nút [← Quay lại] và [Tiếp tục →].
- [ ] **Bước 3 — Design (`DesignStep.tsx`)**:
  - Tái sử dụng component `DesignTabs.tsx`.
  - Cột xem trước bên cạnh chỉ render **1 dòng mẫu duy nhất (sample row)** để người dùng thấy giao diện tức thì, không gây lag CPU/GPU khi đổi màu.
  - Nút [← Quay lại] và [Tiếp tục →].
- [ ] **Bước 4 — Generate (`GenerateStep.tsx`)**:
  - Tóm tắt số lượng mã chuẩn bị tạo (ví dụ: "Sẵn sàng tạo 1,021 mã QR").
  - Tùy chọn định dạng xuất ảnh: PNG, SVG, WebP, hoặc PNG + SVG.
  - Checkbox: "Kiểm tra khả năng quét từng mã bằng ZXing (Khuyến nghị)".
  - Toggle tùy chọn: "Đồng thời tạo file PDF in tem nhãn".
  - Nút bấm chính nổi bật: `[ Bắt Đầu Tạo & Kiểm Thử ]`.
- [ ] **Bước 5 — Results (`ResultsStep.tsx`)**:
  - Màn hình tổng kết hoàn chỉnh độc lập:
    - Tổng số mã đã xử lý.
    - Số lượng `✓ ĐẠT (PASS)`, `⚠ ĐÃ SỬA (REPAIRED)`, `✕ THẤT BẠI (FAILED)`.
  - Các nút hành động rõ ràng:
    - `[ Tải File ZIP Mã Hợp Lệ ]` (Mặc định chỉ tải các mã PASS).
    - `[ Tải Báo Cáo Kiểm Tra (Excel/CSV) ]`.
    - `[ Thử Lại Mã Thất Bại ]`.
    - `[ Xuất File In Tem Nhãn PDF ]`.
  - Danh sách chi tiết các mã thất bại (nếu có) kèm lý do lỗi.
  - Nút `[ Bắt Đầu Lô Mới ]`.

### Phase UX-4: Triển Khai Quality Gate Thực Thụ Trong Batch Processor
- [ ] Sửa đổi `src/services/batchService.ts`:
  - Định nghĩa dữ liệu kết quả chuẩn:
    ```ts
    export type QRResultStatus = 'passed' | 'failed' | 'mismatch' | 'cancelled';
    export interface QRBatchItemResult {
      id: string;
      index: number;
      payload: string;
      filename: string;
      label?: string;
      status: QRResultStatus;
      decodedText?: string;
      error?: string;
    }
    ```
  - Logic bắt buộc: Khi ZXing giải mã không khớp (`!validation.match` hoặc `!validation.success`):
    - Đánh dấu `status = 'failed'` (hoặc `'mismatch'`).
    - Tăng `failedCount++`.
    - KHÔNG thêm file hỏng vào ZIP hợp lệ (trừ khi người dùng bật tùy chọn nâng cao).
  - Xuất báo cáo kiểm tra `bao_cao_kiem_tra.csv` chuẩn xác với các cột: `#`, `Tên File`, `Nội Dung Nạp`, `Nội Dung Giải Mã`, `Trạng Thái (PASSED/FAILED/MISMATCH)`, `Ghi Chú`.

### Phase UX-5: Tối Ưu Trải Nghiệm Responsive & Khả Năng Tiếp Cận (Accessibility)
- [ ] Mobile Single QR: Input trên cùng → Live Preview ngay dưới → Design tabs cuộn nhẹ bên dưới.
- [ ] Mobile Bulk QR: Stepper tối giản (Bước 1/4), form dạng 1 cột, bảng dữ liệu chuyển sang dạng card thu gọn.
- [ ] Đảm bảo chuẩn ARIA cho tablist, modal, nút bấm, tỷ lệ tương phản màu sắc đạt chuẩn WCAG.

### Phase UX-6: Tối Ưu Code Splitting, Build Verification & Báo Cáo Hoàn Thành
- [ ] Lazy loading các thư viện nặng (`xlsx`, `jspdf`, `jszip`) khi người dùng thực sự kích hoạt tính năng tương ứng.
- [ ] Chạy `npm run build` xác nhận 0 lỗi TypeScript, kiểm tra kích thước bundle tối ưu.
- [ ] Chụp lại các ảnh chụp màn hình kiểm thử giao diện Desktop & Mobile theo đúng yêu cầu mục 63.
- [ ] Commit, push GitHub và deploy trực tiếp lên Hugging Face Space.
