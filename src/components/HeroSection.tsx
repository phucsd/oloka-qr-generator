import React from 'react';
import { ShieldCheck, Zap, Palette, FileSpreadsheet, Gift } from 'lucide-react';

interface HeroSectionProps {
  onScrollToGenerator: () => void;
  onSelectBulkMode: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToGenerator,
  onSelectBulkMode,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 bg-gradient-to-b from-indigo-50/60 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Top Announcement Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs sm:text-sm font-medium mb-5 shadow-2xs">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
          <span>Phiên bản mới 2026: Hỗ trợ Import Excel & In Tem Nhãn PDF</span>
        </div>

        {/* Main H1 Title for SEO */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          Tạo Mã QR Hàng Loạt{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
            Miễn Phí Siêu Tốc
          </span>
        </h1>

        {/* Subtitle with High-Value Keywords */}
        <p className="mt-4 text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Tạo hàng trăm mã QR code từ văn bản hoặc file Excel chỉ trong vài giây. Hỗ trợ VietQR ngân hàng, tùy biến màu sắc, chèn logo thương hiệu, tải file ZIP và xuất PDF in tem nhãn khổ A4 chuẩn xác.
        </p>

        {/* Highlight Feature Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-700">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Client-Side Bảo Mật</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Xử Lý Tức Thì Tại Trình Duyệt</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
            <span>Kéo Thả Excel / CSV</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
            <Gift className="w-4 h-4 text-rose-500" />
            <span>Miễn Phí, Không Watermark</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onSelectBulkMode}
            className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-5 h-5" />
            <span>Tạo QR Hàng Loạt Từ Excel Ngay</span>
          </button>
          <button
            type="button"
            onClick={onScrollToGenerator}
            className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2"
          >
            <Palette className="w-5 h-5 text-indigo-600" />
            <span>Tạo QR Đơn Lẻ Nhanh</span>
          </button>
        </div>
      </div>
    </section>
  );
};
