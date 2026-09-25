# 📝 Oloka QR — UI Copy Audit

Tài liệu kiểm toán và chuẩn hóa toàn bộ văn bản giao diện (Copy & Microcopy) của **Oloka QR Generator**, loại bỏ các đoạn văn bản dài dòng kỹ thuật, giảm thiểu việc viết hoa toàn bộ (uppercase) không cần thiết, chuyển sang câu văn ngắn gọn, hành động cụ thể (Action-Oriented Microcopy).

---

## 📋 Bảng Đối Chiếu Copy Cũ & Copy Mới

| STT | Vị Trí / Thành Phần | Copy Gốc (Original) | Copy Chuẩn Hóa Mới (Replacement) | Lý Do & Giá Trị Cải Thiện (Reason) |
| :---: | :--- | :--- | :--- | :--- |
| 1 | **Header Tiêu Đề Trang** | `Tạo Mã QR Đơn Lẻ` / `Tạo Mã QR Hàng Loạt Từ Excel / CSV` (font-black) | `Tạo mã QR đơn lẻ` / `Tạo mã QR hàng loạt từ Excel / CSV` (font-semibold) | Loại bỏ font-black nặng nề, dùng sentence case tự nhiên, dịu mắt. |
| 2 | **Label Chọn Loại QR** | `LOẠI MÃ QR` (font-bold uppercase) | `Loại mã QR` (font-medium text-slate-700) | Tránh hét vào mắt người dùng (no shouting uppercase), chuẩn hóa weight 500. |
| 3 | **Tùy Chọn Website URL** | `Website (URL)` — `Mở đường dẫn trang web` | `Website` — `Mở đường dẫn trang web` | Bỏ chữ viết tắt thừa (URL), icon `Globe` đã nói lên bản chất. |
| 4 | **Tùy Chọn VietQR** | `VietQR Ngân hàng` — `Chuyển khoản Napas247` | `VietQR` — `Chuyển khoản Napas247` | Ngắn gọn, nhận diện thương hiệu VietQR chuẩn xác. |
| 5 | **Tùy Chọn Bản Đồ** | `Bản đồ (Location)` | `Vị trí` — `Mở bản đồ Google Maps` | Tiếng Việt trong sáng, tự nhiên, không chêm từ tiếng Anh trong ngoặc đơn. |
| 6 | **Tùy Chọn Sự Kiện** | `Sự kiện (Event)` | `Sự kiện` — `Thêm vào ứng dụng lịch` | Đơn giản hóa tiêu đề, giữ mô tả hành động rõ ràng. |
| 7 | **Tab Thiết Kế** | `Giao Diện`, `Logo`, `Khung Viền`, `Nâng Cao` | `Giao diện`, `Logo`, `Khung`, `Nâng cao` (kèm icon Lucide) | Bổ sung icon nhận diện tức thì, rút ngắn chữ "Khung Viền" thành "Khung". |
| 8 | **Lưu Mẫu Thiết Kế** | `Lưu Mẫu` | `Lưu mẫu` | Chuyển sang sentence case tinh tế. |
| 9 | **Preset Phong Cách** | `MẪU PHONG CÁCH NHANH` (uppercase) | `Mẫu phong cách nhanh` (sentence case + thumbnail) | Bỏ uppercase, thêm mini QR thumbnail trực quan để nhìn thấy trước khi bấm. |
| 10 | **Hạt QR** | `Kiểu Dáng Hạt QR (Body Dots)` | `Kiểu dáng hạt QR (Body dots)` (kèm SVG demo) | Bỏ văn bản giải thích dài dòng, thay bằng icon SVG mô phỏng 4 hạt. |
| 11 | **Màu Vẽ & Màu Nền** | `Màu Vẽ Mã QR`, `Màu Nền Mã QR` | `● Màu vẽ mã QR`, `○ Màu nền mã QR` | Sử dụng ký hiệu trực quan (Visual symbol) phân biệt màu vẽ và màu nền. |
| 12 | **Kích Thước Logo** | `Tỷ lệ kích thước logo: 22%` + paragraph cảnh báo dài 80 ký tự | `Kích thước logo: 22%` + Badge `Khuyên dùng` / `⚠ Rủi ro` + Tooltip | "Show, Don't Tell": Người dùng nhìn màu badge là hiểu mức độ an toàn ngay. |
| 13 | **Viền Lề An Toàn** | `Viền Lề An Toàn (Quiet Zone)` + đoạn trích ISO/IEC 18004 dài 85 ký tự | `Safe (≥4 ô)` vs `Compact (3 ô)` (Card có hình minh họa viền) | Thay đoạn lý thuyết tiêu chuẩn bằng 2 ô thẻ minh họa trực quan độ dày viền lề. |
| 14 | **Mức Sửa Lỗi (ECC)** | `select` dài dòng: `Q - Cân bằng khuyến nghị (25%)` | Segmented Cards 2 dòng: `Q (25%)` / `Khuyên dùng cân bằng` | Hiển thị dạng thẻ bấm 1 chạm, cấu trúc 2 dòng gọn gàng. |
| 15 | **Preview Header** | `XEM TRƯỚC TRỰC TIẾP` (font-bold uppercase) | `Xem trước trực tiếp` (font-semibold) | Sentence case, font-weight 600 thanh thoát. |
| 16 | **Nút Tải Single** | `Tải Về PNG` (font-bold) | `Tải về PNG` (font-semibold) | Cân đối trọng số thị giác giữa nút bấm và nội dung preview. |
| 17 | **Upload Box (Bulk)** | `Kéo thả file Excel (.xlsx, .xls) hoặc CSV vào đây hoặc bấm vào khung để duyệt file từ máy tính` | `Thả Excel / CSV vào đây` <br> `hoặc Chọn file từ máy tính` <br> `XLSX · XLS · CSV` | Bố cục dạng Wireframe chuẩn mực, loại bỏ câu chữ rườm rà. |
| 18 | **File Loaded State** | Paragraph mô tả dài dòng | `products.xlsx` <br> `1.024 dòng · 3 sheet` <br> `[Sheet ▼]` <br> `✓ Sẵn sàng` | Đơn giản hóa trạng thái dữ liệu, chỉ giữ lại các con số cốt lõi. |
| 19 | **Định Dạng Xuất Batch** | `Định Dạng Ảnh Trong File ZIP` + các câu quảng cáo tính năng | Thẻ định dạng: `PNG (Universal)`, `SVG (Vector)`, `WebP (Lightweight)`, `PNG + SVG (Combo)` | Rút gọn mô tả còn 1 từ khóa định vị cốt lõi, bổ sung icon vector minh họa. |
| 20 | **Nút Bắt Đầu Tạo** | `Bắt Đầu Tạo 1,021 Mã QR` (font-bold) | `Tạo 1.021 mã QR` (font-semibold) | Rút ngắn động từ hành động, nhấn mạnh vào số lượng mã. |
| 21 | **Tải File ZIP (Results)** | `Tải Về File ZIP Mã Hợp Lệ (1,013 file)` | `Tải ZIP` <br> `1.013 mã hợp lệ` | Tách biệt nhãn chính và thông tin phụ dạng 2 dòng, dễ quét bằng mắt. |
| 22 | **Thử Lại Mã Lỗi** | `Thử Lại 5 Mã Bị Lỗi Với Tùy Chỉnh An Toàn Hơn` | `Thử lại 5 mã lỗi` (Tooltip: `Sử dụng cấu hình an toàn hơn`) | Giảm chiều dài nút bấm từ 46 ký tự xuống 19 ký tự. |
| 23 | **In Tem PDF** | `In Tem Nhãn PDF (A4 Decal)` | `Tạo PDF tem nhãn` | Ngắn gọn, đúng chuẩn hành động xuất file trong ứng dụng. |
| 24 | **Danh Sách Mã Lỗi** | `Chi Tiết 5 Mã Không Đạt Chuẩn` kèm chuỗi URL dài tràn khung | `Mã không đạt chuẩn (5)` <br> `#1 SKU01: ...` + `[Chi tiết →]` | Thu gọn chuỗi nội dung dài vào Modal chi tiết khi người dùng cần tra cứu sâu. |
