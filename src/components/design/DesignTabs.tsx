import React, { useState, useEffect } from 'react';
import { Palette, Image as ImageIcon, Frame, Sliders, Bookmark, Check, Trash2 } from 'lucide-react';
import { QRDesignConfig } from '../../types';
import { StylePanel } from './StylePanel';
import { LogoPanel } from './LogoPanel';
import { FramePanel } from './FramePanel';
import { AdvancedPanel } from './AdvancedPanel';

interface DesignTabsProps {
  config: QRDesignConfig;
  onChange: (newConfig: QRDesignConfig) => void;
}

type TabKey = 'style' | 'logo' | 'frame' | 'advanced';

interface SavedTemplate {
  name: string;
  config: QRDesignConfig;
}

const STORAGE_KEY = 'oloka_custom_templates_v1';

export const DesignTabs: React.FC<DesignTabsProps> = ({ config, onChange }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('style');
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  // Load saved templates from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setSavedTemplates(JSON.parse(raw));
      }
    } catch (e) {
      console.warn('Failed to load templates from localStorage', e);
    }
  }, []);

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) return;
    const updated = [...savedTemplates, { name: newTemplateName.trim(), config }];
    setSavedTemplates(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save template', e);
    }
    setNewTemplateName('');
    setShowSaveInput(false);
  };

  const handleDeleteTemplate = (index: number) => {
    const updated = savedTemplates.filter((_, i) => i !== index);
    setSavedTemplates(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to delete template', e);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Tab Navigation Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'style'}
            onClick={() => setActiveTab('style')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'style'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Giao Diện</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'logo'}
            onClick={() => setActiveTab('logo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'logo'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Logo</span>
            {config.logoUrl && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'frame'}
            onClick={() => setActiveTab('frame')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'frame'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Frame className="w-3.5 h-3.5" />
            <span>Khung Viền</span>
            {config.frame.type !== 'none' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'advanced'}
            onClick={() => setActiveTab('advanced')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'advanced'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Nâng Cao</span>
          </button>
        </div>

        {/* Template Save / Quick Recall */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSaveInput(!showSaveInput)}
            className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-50/50 transition-colors"
            title="Lưu mẫu thiết kế này"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lưu Mẫu</span>
          </button>
        </div>
      </div>

      {/* Save Template Inline Drawer */}
      {showSaveInput && (
        <div className="px-4 py-2.5 bg-indigo-50/60 border-b border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-indigo-900">Lưu thiết kế hiện tại:</span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="Tên mẫu (VD: Tem Nhãn Shop)..."
              className="px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs flex-1 sm:w-48 focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="button"
              onClick={handleSaveTemplate}
              className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Lưu
            </button>
          </div>
        </div>
      )}

      {/* Saved Custom Templates Quick Badges */}
      {savedTemplates.length > 0 && (
        <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 shrink-0 font-medium">Mẫu đã lưu:</span>
          {savedTemplates.map((t, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs shrink-0"
            >
              <button
                type="button"
                onClick={() => onChange({ ...config, ...t.config })}
                className="font-medium hover:text-indigo-600 transition-colors"
              >
                {t.name}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteTemplate(idx)}
                className="text-slate-400 hover:text-rose-500 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Active Panel Content */}
      <div className="p-4 sm:p-5">
        {activeTab === 'style' && <StylePanel config={config} onChange={onChange} />}
        {activeTab === 'logo' && <LogoPanel config={config} onChange={onChange} />}
        {activeTab === 'frame' && <FramePanel config={config} onChange={onChange} />}
        {activeTab === 'advanced' && <AdvancedPanel config={config} onChange={onChange} />}
      </div>
    </div>
  );
};
