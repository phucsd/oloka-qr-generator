import React, { useState } from 'react';
import { CornerDotType, CornerSquareType, ErrorCorrectionLevel, QRDesignConfig } from '../../types';

interface AdvancedPanelProps {
  config: QRDesignConfig;
  onChange: (newConfig: QRDesignConfig) => void;
}

// Mini 28x28 Finder Outer Square Preview
const FinderOuterPreview: React.FC<{ type: CornerSquareType }> = ({ type }) => {
  switch (type) {
    case 'square':
      return (
        <svg viewBox="0 0 28 28" className="w-6 h-6 stroke-current fill-none">
          <rect x="3" y="3" width="22" height="22" strokeWidth="3.5" />
          <rect x="9.5" y="9.5" width="9" height="9" className="fill-current stroke-none" />
        </svg>
      );
    case 'extra-rounded':
      return (
        <svg viewBox="0 0 28 28" className="w-6 h-6 stroke-current fill-none">
          <rect x="3" y="3" width="22" height="22" rx="6" strokeWidth="3.5" />
          <circle cx="14" cy="14" r="4.5" className="fill-current stroke-none" />
        </svg>
      );
    case 'dot':
      return (
        <svg viewBox="0 0 28 28" className="w-6 h-6 stroke-current fill-none">
          <circle cx="14" cy="14" r="11" strokeWidth="3.5" />
          <circle cx="14" cy="14" r="4.5" className="fill-current stroke-none" />
        </svg>
      );
  }
};

// Mini 28x28 Finder Center Dot Preview
const FinderCenterPreview: React.FC<{ type: CornerDotType }> = ({ type }) => {
  switch (type) {
    case 'square':
      return (
        <svg viewBox="0 0 28 28" className="w-6 h-6">
          <rect x="4" y="4" width="20" height="20" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
          <rect x="9" y="9" width="10" height="10" className="fill-current" />
        </svg>
      );
    case 'dot':
      return (
        <svg viewBox="0 0 28 28" className="w-6 h-6">
          <rect x="4" y="4" width="20" height="20" rx="4" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
          <circle cx="14" cy="14" r="5" className="fill-current" />
        </svg>
      );
  }
};

export const AdvancedPanel: React.FC<AdvancedPanelProps> = ({ config, onChange }) => {
  const [quietZoneMode, setQuietZoneMode] = useState<'safe' | 'compact' | 'custom'>(
    config.margin >= 16 ? 'safe' : config.margin >= 12 ? 'compact' : 'custom'
  );

  const cornerSquares: { id: CornerSquareType; label: string }[] = [
    { id: 'square', label: 'Vuông' },
    { id: 'extra-rounded', label: 'Bo tròn' },
    { id: 'dot', label: 'Tròn' },
  ];

  const cornerDots: { id: CornerDotType; label: string }[] = [
    { id: 'square', label: 'Chấm vuông' },
    { id: 'dot', label: 'Chấm tròn' },
  ];

  const eccOptions: { id: ErrorCorrectionLevel; title: string; desc: string }[] = [
    { id: 'L', title: 'L (7%)', desc: 'Tiết kiệm dung lượng' },
    { id: 'M', title: 'M (15%)', desc: 'Tiêu chuẩn hiển thị' },
    { id: 'Q', title: 'Q (25%)', desc: 'Khuyên dùng cân bằng' },
    { id: 'H', title: 'H (30%)', desc: 'Tốt nhất khi có logo' },
  ];

  const handleQuietZoneModeChange = (mode: 'safe' | 'compact' | 'custom') => {
    setQuietZoneMode(mode);
    if (mode === 'safe') {
      onChange({ ...config, margin: 16 });
    } else if (mode === 'compact') {
      onChange({ ...config, margin: 12 });
    }
  };

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Finder Eyes Styling with Mini 28x28 Previews */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-medium text-slate-700 mb-1.5">Khung viền góc mắt</label>
          <div className="grid grid-cols-3 gap-1.5">
            {cornerSquares.map((c) => {
              const isSelected = config.cornerSquareType === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onChange({ ...config, cornerSquareType: c.id })}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-semibold shadow-2xs'
                      : 'border-slate-200/90 bg-white text-slate-600 hover:bg-slate-50 font-normal'
                  }`}
                >
                  <div className={isSelected ? 'text-indigo-600' : 'text-slate-400'}>
                    <FinderOuterPreview type={c.id} />
                  </div>
                  <span className="text-[11px] truncate">{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1.5">Tâm góc mắt</label>
          <div className="grid grid-cols-2 gap-1.5">
            {cornerDots.map((d) => {
              const isSelected = config.cornerDotType === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onChange({ ...config, cornerDotType: d.id })}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-semibold shadow-2xs'
                      : 'border-slate-200/90 bg-white text-slate-600 hover:bg-slate-50 font-normal'
                  }`}
                >
                  <div className={isSelected ? 'text-indigo-600' : 'text-slate-400'}>
                    <FinderCenterPreview type={d.id} />
                  </div>
                  <span className="text-[11px] truncate">{d.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Custom Eye Colors */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
          <input
            type="checkbox"
            checked={config.isCustomEyeColors}
            onChange={(e) => onChange({ ...config, isCustomEyeColors: e.target.checked })}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
          />
          <span>Màu riêng cho góc mắt</span>
        </label>

        {config.isCustomEyeColors && (
          <div className="flex items-center gap-5 p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[11px]">Khung mắt:</span>
              <input
                type="color"
                value={config.eyeOuterColor}
                onChange={(e) => onChange({ ...config, eyeOuterColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[11px]">Tâm mắt:</span>
              <input
                type="color"
                value={config.eyeInnerColor}
                onChange={(e) => onChange({ ...config, eyeInnerColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Error Correction Level (Segmented Cards) */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block font-medium text-slate-700 mb-1.5">
          Mức độ sửa lỗi (ECC)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {eccOptions.map((opt) => {
            const isSelected = config.errorCorrectionLevel === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ ...config, errorCorrectionLevel: opt.id })}
                className={`p-2 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-semibold shadow-2xs'
                    : 'border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 font-normal'
                }`}
              >
                <div className="text-xs">{opt.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{opt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Quiet Zone with Visual Demonstration */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-medium text-slate-700">Viền lề an toàn (Quiet zone)</label>
          <span className="font-mono text-slate-400 text-[11px]">{config.margin}px</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Safe Option with Wide Margin Demo */}
          <button
            type="button"
            onClick={() => handleQuietZoneModeChange('safe')}
            className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
              quietZoneMode === 'safe'
                ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-semibold shadow-2xs'
                : 'border-slate-200/90 bg-white text-slate-600 hover:bg-slate-50 font-normal'
            }`}
          >
            {/* Visual Mini QR with Wide Margin */}
            <svg viewBox="0 0 28 28" className="w-6 h-6 border border-slate-300 rounded p-0.5 bg-slate-50">
              <rect x="7" y="7" width="14" height="14" fill="#4f46e5" rx="1" />
            </svg>
            <div className="text-xs">Safe (≥4 ô)</div>
            <div className="text-[9px] text-emerald-600 font-medium">Khuyên dùng</div>
          </button>

          {/* Compact Option with Tight Margin Demo */}
          <button
            type="button"
            onClick={() => handleQuietZoneModeChange('compact')}
            className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
              quietZoneMode === 'compact'
                ? 'border-amber-600 bg-amber-50/80 text-amber-800 font-semibold shadow-2xs'
                : 'border-slate-200/90 bg-white text-slate-600 hover:bg-slate-50 font-normal'
            }`}
          >
            {/* Visual Mini QR with Tight Margin */}
            <svg viewBox="0 0 28 28" className="w-6 h-6 border border-slate-300 rounded bg-slate-50">
              <rect x="2" y="2" width="24" height="24" fill="#d97706" rx="1" />
            </svg>
            <div className="text-xs">Compact (3 ô)</div>
            <div className="text-[9px] text-amber-600 font-medium">Gọn hơn ⚠</div>
          </button>

          {/* Custom Option */}
          <button
            type="button"
            onClick={() => handleQuietZoneModeChange('custom')}
            className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
              quietZoneMode === 'custom'
                ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-semibold shadow-2xs'
                : 'border-slate-200/90 bg-white text-slate-600 hover:bg-slate-50 font-normal'
            }`}
          >
            <div className="text-xs mt-1">Tùy biến px</div>
            <div className="text-[10px] text-slate-400 font-mono">{config.margin}px</div>
          </button>
        </div>

        {quietZoneMode === 'custom' && (
          <div className="pt-1">
            <input
              type="range"
              min="8"
              max="40"
              value={config.margin}
              onChange={(e) => onChange({ ...config, margin: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* 5. Output Resolution */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block font-medium text-slate-700 mb-1">
          Kích thước xuất ảnh (Resolution)
        </label>
        <select
          value={config.size}
          onChange={(e) => onChange({ ...config, size: Number(e.target.value) })}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-normal text-slate-800 focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="300">300 × 300 px (Màn hình nhỏ / Web)</option>
          <option value="500">500 × 500 px (Chuẩn hiển thị số)</option>
          <option value="1000">1000 × 1000 px (Khuyên dùng cho tem nhãn)</option>
          <option value="2000">2000 × 2000 px (In khổ lớn / Standee)</option>
        </select>
      </div>
    </div>
  );
};
