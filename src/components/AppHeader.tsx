import React, { useState, useEffect, useRef } from 'react';
import { QrCode, HelpCircle, Palette, Download, ExternalLink, X, Shield, Cpu } from 'lucide-react';

interface AppHeaderProps {
  activeTab: 'single' | 'bulk';
  setActiveTab: (tab: 'single' | 'bulk') => void;
  onOpenTemplates?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenTemplates,
}) => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert('Ứng dụng đã sẵn sàng chạy trực tiếp trên trình duyệt, hoặc bạn có thể chọn "Thêm vào màn hình chính / Cài đặt ứng dụng" trong menu trình duyệt!');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left: Brand Logo & Title */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <QrCode className="w-5 h-5" />
              </div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                Oloka QR
              </span>
            </div>

            {/* Center: Main Workspace Switcher */}
            <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80" role="tablist" aria-label="Bộ chọn chế độ làm việc">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'single'}
                onClick={() => setActiveTab('single')}
                className={`px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'single'
                    ? 'bg-white text-indigo-600 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                QR Đơn Lẻ
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'bulk'}
                onClick={() => setActiveTab('bulk')}
                className={`px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'bulk'
                    ? 'bg-white text-indigo-600 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tạo Hàng Loạt
              </button>
            </nav>

            {/* Right: Clean Utility Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {onOpenTemplates && (
                <button
                  type="button"
                  onClick={onOpenTemplates}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Xem các mẫu thiết kế"
                >
                  <Palette className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Mẫu thiết kế</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Trợ giúp & Thông tin"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Trợ giúp</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Help & Information Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div
            ref={helpRef}
            className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-semibold text-slate-900">Về Oloka QR Studio</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Shield className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">Bảo mật 100% Client-Side</p>
                  <p className="text-slate-500 mt-0.5">Mọi thao tác đọc file Excel, render mã và nén ZIP đều thực thi trực tiếp trên trình duyệt của bạn.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Cpu className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">Kiểm thử scannability bằng ZXing</p>
                  <p className="text-slate-500 mt-0.5">Tích hợp bộ giải mã quét thử trực tiếp trên Canvas trước khi xuất file để đảm bảo tính khả dụng.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleInstallPWA}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                <span>Cài đặt ứng dụng (PWA)</span>
              </button>

              <a
                href="https://github.com/phucsd/oloka-qr-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
