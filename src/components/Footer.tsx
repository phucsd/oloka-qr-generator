import React from 'react';
import { QrCode, Heart, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-xs">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Oloka QR Generator
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed font-normal">
              Nền tảng tạo mã QR đơn lẻ và hàng loạt miễn phí tốt nhất 2026. Xử lý 100% tại Client-Side, bảo mật tuyệt đối dữ liệu người dùng, hỗ trợ Excel, VietQR và in tem nhãn trực tiếp.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Không lưu dữ liệu trên máy chủ • Bảo mật 100%</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-800 mb-3">
              Tính năng nổi bật
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a href="#main-app" className="hover:text-indigo-600 transition-colors">
                  Tạo mã QR từ file Excel
                </a>
              </li>
              <li>
                <a href="#main-app" className="hover:text-indigo-600 transition-colors">
                  Tạo mã VietQR Napas247
                </a>
              </li>
              <li>
                <a href="#main-app" className="hover:text-indigo-600 transition-colors">
                  Tùy biến Gradient & Chèn Logo
                </a>
              </li>
              <li>
                <a href="#main-app" className="hover:text-indigo-600 transition-colors">
                  Xuất file ZIP & Tem nhãn PDF A4
                </a>
              </li>
            </ul>
          </div>

          {/* Deployment & Resources */}
          <div>
            <h4 className="text-xs font-semibold text-slate-800 mb-3">
              Mã nguồn & Triển khai
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <a
                  href="https://huggingface.co/spaces/phucsd/oloka-qr-generator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
                >
                  <span>Hugging Face Spaces</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/phucsd/oloka-qr-generator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-indigo-600 transition-colors">
                  Câu hỏi thường gặp (FAQ)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Oloka QR Generator. Miễn phí sử dụng cho mọi mục đích cá nhân và thương mại.</p>
          <p className="flex items-center gap-1">
            <span>Được phát triển với</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>cho cộng đồng Việt Nam</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
