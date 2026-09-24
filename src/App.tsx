import React, { useState, useRef } from 'react';
import { QRDesignConfig, QRType } from './types';
import { DEFAULT_DESIGN_CONFIG } from './services/qrService';
import { formatQRContent } from './services/qrFormatter';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SingleQRForm } from './components/SingleQRForm';
import { BulkQRManager } from './components/BulkQRManager';
import { DesignCustomizer } from './components/DesignCustomizer';
import { QRPreviewSticky } from './components/QRPreviewSticky';
import { SEOArticle } from './components/SEOArticle';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('bulk');
  const [designConfig, setDesignConfig] = useState<QRDesignConfig>(DEFAULT_DESIGN_CONFIG);

  // Single QR code content
  const [singleFormattedContent, setSingleFormattedContent] = useState<string>('https://oloka.vn');

  // Preview content currently displayed in sticky sidebar
  const [previewContent, setPreviewContent] = useState<string>('https://oloka.vn');

  const mainAppRef = useRef<HTMLDivElement>(null);

  const handleSingleContentChange = (type: QRType, data: any) => {
    const formatted = formatQRContent(type, data);
    setSingleFormattedContent(formatted);
    if (activeTab === 'single') {
      setPreviewContent(formatted);
    }
  };

  const handleTabSwitch = (tab: 'single' | 'bulk') => {
    setActiveTab(tab);
    if (tab === 'single') {
      setPreviewContent(singleFormattedContent || 'https://oloka.vn');
    }
  };

  const handlePreviewItemSelect = (data: string) => {
    setPreviewContent(data);
    // Smooth scroll to preview on mobile
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const scrollToGenerator = () => {
    handleTabSwitch('single');
    mainAppRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectBulkMode = () => {
    handleTabSwitch('bulk');
    mainAppRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Fixed / Sticky Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={handleTabSwitch} />

      {/* Hero Section with Call To Action */}
      <HeroSection
        onScrollToGenerator={scrollToGenerator}
        onSelectBulkMode={selectBulkMode}
      />

      {/* Main Interactive Tool Section */}
      <main id="main-app" ref={mainAppRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Inputs & Customization Panel (7 cols on lg, 8 on xl) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Input Mode Form */}
            {activeTab === 'single' ? (
              <section id="single" aria-label="Tạo mã QR đơn lẻ">
                <SingleQRForm onContentChange={handleSingleContentChange} />
              </section>
            ) : (
              <section id="bulk" aria-label="Tạo mã QR hàng loạt">
                <BulkQRManager
                  designConfig={designConfig}
                  onPreviewItemSelect={handlePreviewItemSelect}
                />
              </section>
            )}

            {/* Design & Style Customization Accordion */}
            <section id="customize" aria-label="Tùy biến thiết kế mã QR">
              <DesignCustomizer
                config={designConfig}
                onChange={(newConfig) => setDesignConfig(newConfig)}
              />
            </section>
          </div>

          {/* Right Column: Sticky Live QR Preview Sidebar (5 cols on lg, 4 on xl) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <aside aria-label="Xem trước mã QR">
              <QRPreviewSticky
                content={previewContent}
                designConfig={designConfig}
              />
            </aside>
          </div>
        </div>

        {/* 2000+ Words Rich SEO Article, HowTo Guide & 10 FAQs */}
        <SEOArticle />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
