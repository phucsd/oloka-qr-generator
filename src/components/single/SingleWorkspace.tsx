import React, { useState } from 'react';
import { QRDesignConfig, QRType } from '../../types';
import { QRTypePicker } from './QRTypePicker';
import { QRInputForm } from './QRInputForm';
import { QRPreviewPanel } from './QRPreviewPanel';
import { DesignTabs } from '../design/DesignTabs';
import { formatQRContent } from '../../services/qrFormatter';

interface SingleWorkspaceProps {
  designConfig: QRDesignConfig;
  onDesignConfigChange: (newConfig: QRDesignConfig) => void;
}

export const SingleWorkspace: React.FC<SingleWorkspaceProps> = ({
  designConfig,
  onDesignConfigChange,
}) => {
  const [selectedType, setSelectedType] = useState<QRType>('url');
  const [formattedContent, setFormattedContent] = useState<string>('https://oloka.vn');

  const handleContentChange = (type: QRType, data: any) => {
    const formatted = formatQRContent(type, data);
    setFormattedContent(formatted);
  };

  const handleAutoRepair = () => {
    onDesignConfigChange({
      ...designConfig,
      errorCorrectionLevel: 'H',
      logoSize: Math.min(designConfig.logoSize, 0.22),
      margin: Math.max(designConfig.margin, 16),
      dotType: designConfig.dotType === 'classy' || designConfig.dotType === 'classy-rounded' ? 'square' : designConfig.dotType,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Desktop Left Column / Mobile Top: Content & Design */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-6">
        {/* Content Card: Type Picker + Input Fields */}
        <section className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
          <QRTypePicker selectedType={selectedType} onSelectType={setSelectedType} />
          <div className="pt-3 border-t border-slate-100">
            <QRInputForm selectedType={selectedType} onContentChange={handleContentChange} />
          </div>
        </section>

        {/* Mobile ONLY: Preview appears right after Content on mobile screens */}
        <div className="block lg:hidden">
          <QRPreviewPanel
            content={formattedContent}
            designConfig={designConfig}
            onAutoRepair={handleAutoRepair}
          />
        </div>

        {/* Design Tabs Panel */}
        <section aria-label="Tùy biến thiết kế">
          <DesignTabs config={designConfig} onChange={onDesignConfigChange} />
        </section>
      </div>

      {/* Desktop ONLY Right Column: Sticky Live QR Inspector */}
      <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-20">
        <QRPreviewPanel
          content={formattedContent}
          designConfig={designConfig}
          onAutoRepair={handleAutoRepair}
        />
      </div>
    </div>
  );
};
