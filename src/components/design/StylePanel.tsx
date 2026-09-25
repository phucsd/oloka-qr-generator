import React from 'react';
import { DotType, QRDesignConfig } from '../../types';
import { DESIGN_PRESETS } from './presets';
import { Sparkles, Check, AlertTriangle } from 'lucide-react';

interface StylePanelProps {
  config: QRDesignConfig;
  onChange: (newConfig: QRDesignConfig) => void;
}

// Simple luminance calculation for contrast estimate
function getLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return 0.5;
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Mini SVG Thumbnail for Preset Cards
const PresetThumbnail: React.FC<{ presetId: string }> = ({ presetId }) => {
  switch (presetId) {
    case 'classic':
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 rounded shrink-0 bg-white p-0.5 border border-slate-200">
          {/* Top-left finder */}
          <rect x="2" y="2" width="10" height="10" fill="none" stroke="#0f172a" strokeWidth="2" />
          <rect x="5" y="5" width="4" height="4" fill="#0f172a" />
          {/* Top-right finder */}
          <rect x="20" y="2" width="10" height="10" fill="none" stroke="#0f172a" strokeWidth="2" />
          <rect x="23" y="5" width="4" height="4" fill="#0f172a" />
          {/* Bottom-left finder */}
          <rect x="2" y="20" width="10" height="10" fill="none" stroke="#0f172a" strokeWidth="2" />
          <rect x="5" y="23" width="4" height="4" fill="#0f172a" />
          {/* Modules */}
          <rect x="15" y="4" width="2.5" height="2.5" fill="#0f172a" />
          <rect x="15" y="15" width="2.5" height="2.5" fill="#0f172a" />
          <rect x="20" y="15" width="2.5" height="2.5" fill="#0f172a" />
          <rect x="25" y="22" width="2.5" height="2.5" fill="#0f172a" />
          <rect x="15" y="25" width="2.5" height="2.5" fill="#0f172a" />
        </svg>
      );
    case 'rounded':
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 rounded shrink-0 bg-white p-0.5 border border-slate-200">
          <rect x="2" y="2" width="10" height="10" rx="3" fill="none" stroke="#334155" strokeWidth="2" />
          <circle cx="7" cy="7" r="2" fill="#334155" />
          <rect x="20" y="2" width="10" height="10" rx="3" fill="none" stroke="#334155" strokeWidth="2" />
          <circle cx="25" cy="7" r="2" fill="#334155" />
          <rect x="2" y="20" width="10" height="10" rx="3" fill="none" stroke="#334155" strokeWidth="2" />
          <circle cx="7" cy="25" r="2" fill="#334155" />
          <circle cx="16" cy="6" r="1.5" fill="#334155" />
          <circle cx="16" cy="16" r="1.5" fill="#334155" />
          <circle cx="22" cy="16" r="1.5" fill="#334155" />
          <circle cx="26" cy="23" r="1.5" fill="#334155" />
          <circle cx="16" cy="26" r="1.5" fill="#334155" />
        </svg>
      );
    case 'modern-gradient':
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 rounded shrink-0 bg-white p-0.5 border border-slate-200">
          <defs>
            <linearGradient id="thumbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="10" height="10" rx="3" fill="none" stroke="url(#thumbGrad)" strokeWidth="2" />
          <circle cx="7" cy="7" r="2" fill="url(#thumbGrad)" />
          <rect x="20" y="2" width="10" height="10" rx="3" fill="none" stroke="url(#thumbGrad)" strokeWidth="2" />
          <circle cx="25" cy="7" r="2" fill="url(#thumbGrad)" />
          <rect x="2" y="20" width="10" height="10" rx="3" fill="none" stroke="url(#thumbGrad)" strokeWidth="2" />
          <circle cx="7" cy="25" r="2" fill="url(#thumbGrad)" />
          <rect x="14.5" y="4" width="3" height="3" rx="1.5" fill="url(#thumbGrad)" />
          <rect x="14.5" y="14.5" width="3" height="3" rx="1.5" fill="url(#thumbGrad)" />
          <rect x="21" y="14.5" width="3" height="3" rx="1.5" fill="url(#thumbGrad)" />
          <rect x="25" y="22" width="3" height="3" rx="1.5" fill="url(#thumbGrad)" />
        </svg>
      );
    case 'print-safe':
    default:
      return (
        <svg viewBox="0 0 32 32" className="w-8 h-8 rounded shrink-0 bg-white p-0.5 border border-slate-200">
          <rect x="0.5" y="0.5" width="31" height="31" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 1" />
          <rect x="4" y="4" width="8" height="8" fill="none" stroke="#000000" strokeWidth="1.8" />
          <rect x="6.5" y="6.5" width="3" height="3" fill="#000000" />
          <rect x="20" y="4" width="8" height="8" fill="none" stroke="#000000" strokeWidth="1.8" />
          <rect x="22.5" y="6.5" width="3" height="3" fill="#000000" />
          <rect x="4" y="20" width="8" height="8" fill="none" stroke="#000000" strokeWidth="1.8" />
          <rect x="6.5" y="22.5" width="3" height="3" fill="#000000" />
          <rect x="15" y="5" width="2" height="2" fill="#000000" />
          <rect x="15" y="15" width="2" height="2" fill="#000000" />
          <rect x="22" y="15" width="2" height="2" fill="#000000" />
          <rect x="15" y="23" width="2" height="2" fill="#000000" />
        </svg>
      );
  }
};

// Mini SVG Illustration for Body Dots
const DotPatternIcon: React.FC<{ type: DotType }> = ({ type }) => {
  switch (type) {
    case 'square':
      return (
        <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
          <rect x="2" y="2" width="6.5" height="6.5" />
          <rect x="11.5" y="2" width="6.5" height="6.5" />
          <rect x="2" y="11.5" width="6.5" height="6.5" />
          <rect x="11.5" y="11.5" width="6.5" height="6.5" />
        </svg>
      );
    case 'dots':
      return (
        <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
          <circle cx="5" cy="5" r="3.5" />
          <circle cx="15" cy="5" r="3.5" />
          <circle cx="5" cy="15" r="3.5" />
          <circle cx="15" cy="15" r="3.5" />
        </svg>
      );
    case 'rounded':
      return (
        <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
          <rect x="2" y="2" width="6.5" height="6.5" rx="2" />
          <rect x="11.5" y="2" width="6.5" height="6.5" rx="2" />
          <rect x="2" y="11.5" width="6.5" height="6.5" rx="2" />
          <rect x="11.5" y="11.5" width="6.5" height="6.5" rx="2" />
        </svg>
      );
    case 'extra-rounded':
      return (
        <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
          <rect x="2" y="2" width="6.5" height="6.5" rx="3.25" />
          <rect x="11.5" y="2" width="6.5" height="6.5" rx="3.25" />
          <rect x="2" y="11.5" width="6.5" height="6.5" rx="3.25" />
          <rect x="11.5" y="11.5" width="6.5" height="6.5" rx="3.25" />
        </svg>
      );
    case 'classy':
      return (
        <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
          <path d="M 5 2 L 8.5 5.5 L 5 9 L 1.5 5.5 Z" />
          <path d="M 15 2 L 18.5 5.5 L 15 9 L 11.5 5.5 Z" />
          <path d="M 5 11.5 L 8.5 15 L 5 18.5 L 1.5 15 Z" />
          <path d="M 15 11.5 L 18.5 15 L 15 18.5 L 11.5 15 Z" />
        </svg>
      );
    case 'classy-rounded':
      return (
        <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
          <path d="M 5.25 2 C 7 3.5 7 3.5 8.5 5.25 C 7 7 7 7 5.25 8.5 C 3.5 7 3.5 7 2 5.25 C 3.5 3.5 3.5 3.5 5.25 2 Z" />
          <path d="M 15.25 2 C 17 3.5 17 3.5 18.5 5.25 C 17 7 17 7 15.25 8.5 C 13.5 7 13.5 7 12 5.25 C 13.5 3.5 13.5 3.5 15.25 2 Z" />
          <path d="M 5.25 11.5 C 7 13 7 13 8.5 14.75 C 7 16.5 7 16.5 5.25 18 C 3.5 16.5 3.5 16.5 2 14.75 C 3.5 13 3.5 13 5.25 11.5 Z" />
          <path d="M 15.25 11.5 C 17 13 17 13 18.5 14.75 C 17 16.5 17 16.5 15.25 18 C 13.5 16.5 13.5 16.5 12 14.75 C 13.5 13 13.5 13 15.25 11.5 Z" />
        </svg>
      );
    default:
      return null;
  }
};

export const StylePanel: React.FC<StylePanelProps> = ({ config, onChange }) => {
  const fgLum = config.fgColorType === 'solid' ? getLuminance(config.fgColor) : 0.2;
  const bgLum = config.isTransparentBg ? 1.0 : getLuminance(config.bgColor);
  const contrastRatio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
  const isLowContrast = contrastRatio < 3.0;

  const dotOptions: { id: DotType; label: string }[] = [
    { id: 'square', label: 'Vuông' },
    { id: 'dots', label: 'Chấm tròn' },
    { id: 'rounded', label: 'Bo góc' },
    { id: 'extra-rounded', label: 'Siêu tròn' },
    { id: 'classy', label: 'Classy' },
    { id: 'classy-rounded', label: 'Classy mềm' },
  ];

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Quick Presets with Mini Thumbnails */}
      <div>
        <label className="flex items-center gap-1.5 font-medium text-slate-700 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Mẫu phong cách nhanh</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DESIGN_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange({ ...config, ...preset.configPatch })}
              className="p-2.5 rounded-xl border border-slate-200/90 text-left bg-slate-50/50 hover:bg-indigo-50/40 hover:border-indigo-300 transition-all group flex flex-col justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <PresetThumbnail presetId={preset.id} />
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 group-hover:text-indigo-600 text-xs truncate">
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{preset.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Body Dot Style with Mini Illustrations */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block font-medium text-slate-700 mb-2">Kiểu dáng hạt QR (Body dots)</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {dotOptions.map((dot) => {
            const isSelected = config.dotType === dot.id;
            return (
              <button
                key={dot.id}
                type="button"
                onClick={() => onChange({ ...config, dotType: dot.id })}
                className={`py-2 px-1.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-semibold shadow-2xs'
                    : 'border-slate-200/90 bg-white text-slate-600 hover:bg-slate-50 font-normal'
                }`}
              >
                <div className={isSelected ? 'text-indigo-600' : 'text-slate-400'}>
                  <DotPatternIcon type={dot.id} />
                </div>
                <span className="text-[11px] truncate">{dot.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Foreground Color & Gradient */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-medium text-slate-700 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block" />
            <span>Màu vẽ mã QR</span>
          </label>
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/70">
            <button
              type="button"
              onClick={() => onChange({ ...config, fgColorType: 'solid' })}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                config.fgColorType === 'solid'
                  ? 'bg-white text-indigo-700 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              Đơn sắc
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...config, fgColorType: 'gradient' })}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                config.fgColorType === 'gradient'
                  ? 'bg-white text-indigo-700 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              Gradient
            </button>
          </div>
        </div>

        {config.fgColorType === 'solid' ? (
          <div className="flex items-center gap-2.5">
            <input
              type="color"
              value={config.fgColor}
              onChange={(e) => onChange({ ...config, fgColor: e.target.value })}
              className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer"
            />
            <input
              type="text"
              value={config.fgColor}
              onChange={(e) => onChange({ ...config, fgColor: e.target.value })}
              className="w-24 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-800"
            />
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3 p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Màu 1:</span>
              <input
                type="color"
                value={config.fgGradient.colorStops[0]?.color || '#4f46e5'}
                onChange={(e) =>
                  onChange({
                    ...config,
                    fgGradient: {
                      ...config.fgGradient,
                      colorStops: [
                        { offset: 0, color: e.target.value },
                        { offset: 1, color: config.fgGradient.colorStops[1]?.color || '#06b6d4' },
                      ],
                    },
                  })
                }
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Màu 2:</span>
              <input
                type="color"
                value={config.fgGradient.colorStops[1]?.color || '#06b6d4'}
                onChange={(e) =>
                  onChange({
                    ...config,
                    fgGradient: {
                      ...config.fgGradient,
                      colorStops: [
                        { offset: 0, color: config.fgGradient.colorStops[0]?.color || '#4f46e5' },
                        { offset: 1, color: e.target.value },
                      ],
                    },
                  })
                }
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Góc xoay:</span>
              <input
                type="range"
                min="0"
                max="360"
                value={config.fgGradient.rotation}
                onChange={(e) =>
                  onChange({
                    ...config,
                    fgGradient: { ...config.fgGradient, rotation: Number(e.target.value) },
                  })
                }
                className="w-16 accent-indigo-600"
              />
              <span className="font-mono text-slate-600 text-[10px]">{config.fgGradient.rotation}°</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Background Color */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <label className="font-medium text-slate-700 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border border-slate-400 bg-white inline-block" />
          <span>Màu nền mã QR</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={config.bgColor}
            disabled={config.isTransparentBg}
            onChange={(e) => onChange({ ...config, bgColor: e.target.value })}
            className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer disabled:opacity-30"
          />
          <input
            type="text"
            value={config.bgColor}
            disabled={config.isTransparentBg}
            onChange={(e) => onChange({ ...config, bgColor: e.target.value })}
            className="w-24 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs disabled:opacity-30"
          />
          <label className="flex items-center gap-1.5 cursor-pointer ml-2">
            <input
              type="checkbox"
              checked={config.isTransparentBg}
              onChange={(e) => onChange({ ...config, isTransparentBg: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="font-medium text-slate-700 text-xs">Nền trong suốt (Transparent)</span>
          </label>
        </div>

        {/* Contrast feedback */}
        {isLowContrast ? (
          <div className="p-2 bg-amber-50 border border-amber-200/80 rounded-lg text-amber-800 text-[11px] flex items-center gap-1.5 font-normal">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Độ tương phản màu thấp, máy ảnh có thể khó quét.</span>
          </div>
        ) : (
          <div className="text-emerald-600 text-[11px] flex items-center gap-1 font-medium">
            <Check className="w-3.5 h-3.5" />
            <span>Độ tương phản màu tốt</span>
          </div>
        )}
      </div>
    </div>
  );
};
