---
title: Oloka QR Code Generator
emoji: ⚡
colorFrom: indigo
colorTo: purple
sdk: static
pinned: false
---

# ⚡ Oloka QR Code Generator - Tạo Mã QR Hàng Loạt Miễn Phí 2026

> **Công cụ tạo mã QR đơn lẻ và hàng loạt (Bulk QR Code) hiện đại, bảo mật 100% Client-Side, hỗ trợ kéo thả Excel/CSV, tích hợp VietQR Napas247, tùy biến Gradient/Logo, tải file ZIP và xuất PDF in tem nhãn khổ A4 trực tiếp.**

[![React](https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?style=flat&logo=vite)](https://vite.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Tính Năng Nổi Bật Vượt Trội

### 1. 🛡️ 100% Xử Lý Tại Trình Duyệt (Client-Side Privacy)
- **Bảo mật tuyệt đối**: Dữ liệu danh bạ, link nội bộ, mật khẩu WiFi và danh sách khách hàng trong file Excel **không bao giờ bị gửi lên bất kỳ máy chủ nào**.
- **Xử lý tức thì**: Tạo và nén hàng trăm mã QR nhanh chóng nhờ thư viện Canvas, SVG, SheetJS và JSZip chạy trực tiếp tại trình duyệt thiết bị.
- **Không phụ thuộc backend**: Không lo quá tải server hay nghẽn mạng.

### 2. 🔍 Vòng Kiểm Thử Khả Năng Quét Tự Động (ZXing Decoder Loop)
- **Kiểm tra scannability ngay tại chỗ**: Tích hợp bộ giải mã `@zxing/browser` chạy song song trên Canvas thực tế để xác thực camera điện thoại sẽ đọc được nội dung trước khi xuất file.
- **Huy hiệu trạng thái**: Hiển thị nhãn xanh `Đã kiểm tra khả năng quét (ZXing PASS)` trực quan.
- **Báo cáo kiểm tra tự động**: Tự động sinh file `bao_cao_kiem_tra.csv` bên trong file ZIP hoặc xuất Excel báo cáo tỉ lệ hợp lệ/lỗi cho từng dòng dữ liệu.

### 3. 📊 Tạo Mã QR Hàng Loạt Chuẩn Xác (Bulk QR Engine)
- **Kéo thả File Excel (.xlsx, .xls) hoặc CSV**:
  - Hỗ trợ đa sheet (Multi-sheet workbook selection).
  - Giữ nguyên số 0 ở đầu (`raw: false`) cho số tài khoản, mã SKU, số điện thoại.
  - Tích hợp nút **"Tải File Excel Mẫu (.xlsx)"** chuẩn định dạng.
  - **Ánh xạ cột linh hoạt**: Cột dữ liệu QR, cột đặt tên file tải về, cột nhãn chữ in tem.
  - **Chống trùng lặp tên file**: Tự động đánh số hậu tố `_2`, `_3` tránh ghi đè file trong ZIP.
- **Tải về file `.ZIP`**: Nén file tự động kèm thanh tiến trình thời gian thực (`%`, số lượng đã xong, nút dừng lại).
- **In Tem Nhãn PDF Khổ A4**: Các mẫu tem decal tiêu chuẩn (18 tem 63.5x46.6mm, 30 tem, 8 tem) render bằng Canvas đảm bảo 100% font tiếng Việt không bị lỗi hiển thị.

### 4. 💳 Hỗ Trợ 14+ Loại Nội Dung Chuẩn Quốc Tế & VietQR
- **VietQR / Napas247 Chuẩn Xác**:
  - Đúng chuẩn định danh `0208QRIBFTTA` cho tài khoản ngân hàng.
  - Tính toán độ dài trường TLV và mã kiểm tra CRC16 trên chuỗi byte UTF-8.
  - Tự động nạp động danh sách 55+ ngân hàng từ VietQR API với cơ chế cache 24h và fallback offline.
- **Định Dạng Tương Thích Cao**:
  - Wi-Fi: Escape ký tự đặc biệt theo chuẩn ZXing.
  - vCard: Tuân thủ chuẩn RFC 6350, phân tách họ tên và escape ký tự đúng quy cách.
  - iCalendar: Định dạng thời gian UTC `YYYYMMDDTHHMMSSZ` và khai báo PRODID.
  - Zoom, URL, Văn bản, SMS, Email, Bản đồ, Mạng xã hội...

### 5. 🎨 Bộ Tùy Biến Thiết Kế & Xuất Vector SVG Thật
- **Màu sắc & Gradient**: Đơn sắc, nền trong suốt, gradient chuyển màu (Linear / Radial) xoay góc tùy chỉnh, màu riêng cho từng góc mắt.
- **Vector SVG Thật**: Sinh mã XML SVG nguyên bản với thẻ `<rect>` và `<text>`, không bao giờ lồng raster PNG vào đuôi `.svg`.
- **Đệm Logo An Toàn**: Tạo khoảng trống đệm phía sau logo thương hiệu, bảo đảm mức độ sửa lỗi High (30%) giúp camera quét nhạy.
- **Đóng khung viền CTA**: Khung "SCAN ME", "QUÉT MÃ TẠI ĐÂY", tùy chỉnh màu sắc và font chữ tiếng Việt.

### 6. 🚀 Tối Ưu SEO & PWA
- Điểm Core Web Vitals tối ưu.
- Đầy đủ 4 bộ Schema JSON-LD: `WebApplication`, `FAQPage`, `HowTo`, `BreadcrumbList`.
- Hỗ trợ **PWA (Progressive Web App)**: Cài đặt và sử dụng offline nhanh chóng.

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Local Development)

### Yêu cầu:
- Node.js version 18+ trở lên.

### Các bước thực hiện:
```bash
# 1. Cài đặt các thư viện cần thiết
npm install

# 2. Khởi chạy môi trường phát triển (Dev server)
npm run dev

# 3. Mở trình duyệt truy cập:
# http://localhost:5173
```

### Build bản Production:
```bash
npm run build
# Kết quả xuất ra thư mục dist/ với bundle tối ưu hoá
```

---

## 🚀 Hướng Dẫn Deploy Lên Hugging Face Spaces

### Cách 1: Deploy dạng Static Space (Khuyên dùng - Nhanh nhất & Uptime 24/7)
1. Đăng nhập vào [Hugging Face](https://huggingface.co/) và tạo một Space mới:
   - **Space name**: `oloka-qr-generator` (hoặc tên tùy thích)
   - **Space SDK**: Chọn **Static**
   - **Visibility**: Chọn **Public**
2. Clone repo Space về máy hoặc push thư mục `dist/` lên Hugging Face Space:
   ```bash
   git clone https://huggingface.co/spaces/<username>/<space-name> hf_space
   cp -r dist/* hf_space/
   cp README.md hf_space/
   cd hf_space
   git add .
   git commit -m "Deploy Oloka QR Generator"
   git push origin main
   ```
3. Truy cập ngay đường dẫn: `https://huggingface.co/spaces/<username>/<space-name>`!

### Cách 2: Deploy dạng Docker Space
Dự án đã có sẵn file `Dockerfile` và `nginx.conf` chuẩn:
1. Tạo Space mới trên Hugging Face và chọn **Space SDK: Docker** (Blank).
2. Push toàn bộ mã nguồn của dự án lên Space. Hugging Face sẽ tự động build image Docker và khởi chạy trên port 7860.

---

## 🐙 Hướng Dẫn Upload Lên GitHub & Kích Hoạt GitHub Pages

```bash
# 1. Khởi tạo Git repository (nếu chưa có)
git init
git add .
git commit -m "Initial commit: Oloka QR Code Generator 2026"

# 2. Đổi tên nhánh sang main
git branch -M main

# 3. Thêm remote repository GitHub của bạn
git remote add origin https://github.com/<username>/oloka-qr-generator.git

# 4. Push mã nguồn lên GitHub
git push -u origin main
```

### Kích hoạt GitHub Pages tự động:
1. Vào **Settings** trên repo GitHub của bạn -> Chọn mục **Pages**.
2. Tại mục **Build and deployment** -> Chọn Source là **GitHub Actions**.
3. Mỗi khi bạn `git push`, file workflow `.github/workflows/deploy.yml` sẽ tự động build và xuất bản trang web của bạn lên link `https://<username>.github.io/oloka-qr-generator/` hoàn toàn tự động!

---

## 📄 Bản Quyền & Giấy Phép

Dự án được phát hành dưới giấy phép [MIT License](LICENSE). Bạn hoàn toàn tự do sử dụng, chỉnh sửa và triển khai cho các mục đích cá nhân lẫn thương mại.
