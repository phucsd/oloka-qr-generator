import React, { useState } from 'react';
import { QRDesignConfig } from './types';
import { DEFAULT_DESIGN_CONFIG } from './services/qrService';
import { AppHeader } from './components/AppHeader';
import { SingleWorkspace } from './components/single/SingleWorkspace';
import { BulkWorkspace } from './components/bulk/BulkWorkspace';
import { SEOArticle } from './components/SEOArticle';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [designConfig, setDesignConfig] = useState<QRDesignConfig>(DEFAULT_DESIGN_CONFIG);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Sticky Clean Header */}
      <AppHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Interactive Tool Workspace */}
      <main id="main-app" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-6">
        {/* Workspace Intro Header (Compact, no giant marketing hero) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === 'single' ? 'Tạo Mã QR Đơn Lẻ' : 'Tạo Mã QR Hàng Loạt Từ Excel / CSV'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Xử lý 100% tại trình duyệt, bảo mật dữ liệu tuyệt đối, hỗ trợ VietQR và in tem nhãn A4
            </p>
          </div>
        </div>

        {/* Active Workspace */}
        {activeTab === 'single' ? (
          <section id="single-workspace" aria-label="Khu vực tạo mã QR đơn lẻ">
            <SingleWorkspace
              designConfig={designConfig}
              onDesignConfigChange={setDesignConfig}
            />
          </section>
        ) : (
          <section id="bulk-workspace" aria-label="Khu vực tạo mã QR hàng loạt">
            <BulkWorkspace
              designConfig={designConfig}
              onDesignConfigChange={setDesignConfig}
            />
          </section>
        )}

        {/* Clear Visual Divider Before Educational / SEO Section */}
        <div className="pt-12 pb-4">
          <div className="border-t border-slate-200 text-center relative">
            <span className="bg-slate-50 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest relative -top-2.5">
              Cẩm Nang Hướng Dẫn & Câu Hỏi Thường Gặp
            </span>
          </div>
        </div>

        {/* 2000+ Words Rich SEO Article & 10 FAQs */}
        <section aria-label="Tài liệu hướng dẫn và tối ưu QR code">
          <SEOArticle />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
