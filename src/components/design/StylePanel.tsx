import React from 'react';
import { DotType, QRDesignConfig } from '../../types';
import { DESIGN_PRESETS } from './presets';
import { Sparkles, Check } from 'lucide-react';

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

export const StylePanel: React.FC<StylePanelProps> = ({ config, onChange }) => {
  const fgLum = config.fgColorType === 'solid' ? getLuminance(config.fgColor) : 0.2;
  const bgLum = config.isTransparentBg ? 1.0 : getLuminance(config.bgColor);
  const contrastRatio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
  const isLowContrast = contrastRatio < 3.0;

  const dotOptions: { id: DotType; label: string }[] = [
    { id: 'square', label: 'Vuông' },
    { id: 'dots', label: 'Chấm Tròn' },
    { id: 'rounded', label: 'Bo Góc' },
    { id: 'extra-rounded', label: 'Siêu Tròn' },
    { id: 'classy', label: 'Classy' },
    { id: 'classy-rounded', label: 'Classy Mềm' },
  ];

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Quick Presets */}
      <div>
        <label className="flex items-center gap-1.5 font-bold text-slate-700 uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Mẫu Phong Cách Nhanh</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DESIGN_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange({ ...config, ...preset.configPatch })}
              className="p-2.5 rounded-xl border text-left bg-slate-50/70 hover:bg-indigo-50/50 hover:border-indigo-300 transition-all group"
            >
              <div className="font-bold text-slate-800 group-hover:text-indigo-600 text-xs">
                {preset.name}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Body Dot Style */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block font-semibold text-slate-700 mb-2">Kiểu Dáng Hạt QR (Body Dots)</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {dotOptions.map((dot) => {
            const isSelected = config.dotType === dot.id;
            return (
              <button
                key={dot.id}
                type="button"
                onClick={() => onChange({ ...config, dotType: dot.id })}
                className={`py-2 px-1 rounded-xl border text-center font-medium transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {dot.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Foreground Color & Gradient */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-slate-700">Màu Vẽ Mã QR</label>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
            <button
              type="button"
              onClick={() => onChange({ ...config, fgColorType: 'solid' })}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                config.fgColorType === 'solid'
                  ? 'bg-white text-indigo-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đơn Sắc
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...config, fgColorType: 'gradient' })}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                config.fgColorType === 'gradient'
                  ? 'bg-white text-indigo-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
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
              className="w-24 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
            />
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
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
              <span className="text-slate-500 text-[11px]">Góc:</span>
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
        <label className="block font-semibold text-slate-700">Màu Nền Mã QR</label>
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
            <span className="font-semibold text-slate-700 text-xs">Nền Trong Suốt (Transparent)</span>
          </label>
        </div>

        {/* Contrast feedback */}
        {isLowContrast ? (
          <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] flex items-center gap-1.5">
            <span>⚠ Độ tương phản giữa màu vẽ và màu nền hơi thấp, máy ảnh có thể khó nhận diện.</span>
          </div>
        ) : (
          <div className="text-emerald-600 text-[11px] flex items-center gap-1 font-medium">
            <Check className="w-3.5 h-3.5" />
            <span>Độ tương phản màu tốt, dễ quét</span>
          </div>
        )}
      </div>
    </div>
  );
};
