import React, { useState } from 'react';
import { CornerDotType, CornerSquareType, QRDesignConfig } from '../../types';
import { ShieldCheck } from 'lucide-react';

interface AdvancedPanelProps {
  config: QRDesignConfig;
  onChange: (newConfig: QRDesignConfig) => void;
}

export const AdvancedPanel: React.FC<AdvancedPanelProps> = ({ config, onChange }) => {
  const [quietZoneMode, setQuietZoneMode] = useState<'safe' | 'compact' | 'custom'>(
    config.margin >= 16 ? 'safe' : config.margin >= 12 ? 'compact' : 'custom'
  );

  const cornerSquares: { id: CornerSquareType; label: string }[] = [
    { id: 'square', label: 'Vuông' },
    { id: 'extra-rounded', label: 'Bo Tròn' },
    { id: 'dot', label: 'Tròn' },
  ];

  const cornerDots: { id: CornerDotType; label: string }[] = [
    { id: 'square', label: 'Chấm Vuông' },
    { id: 'dot', label: 'Chấm Tròn' },
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
      {/* 1. Finder Eyes Styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">Khung Viền Góc Mắt</label>
          <div className="grid grid-cols-3 gap-1.5">
            {cornerSquares.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onChange({ ...config, cornerSquareType: c.id })}
                className={`py-1.5 px-1 rounded-lg border text-center font-medium transition-all ${
                  config.cornerSquareType === c.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">Tâm Góc Mắt</label>
          <div className="grid grid-cols-2 gap-1.5">
            {cornerDots.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => onChange({ ...config, cornerDotType: d.id })}
                className={`py-1.5 px-1 rounded-lg border text-center font-medium transition-all ${
                  config.cornerDotType === d.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Custom Eye Colors */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={config.isCustomEyeColors}
            onChange={(e) => onChange({ ...config, isCustomEyeColors: e.target.checked })}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
          />
          <span>Màu Riêng Cho Các Góc Mắt (Markers)</span>
        </label>

        {config.isCustomEyeColors && (
          <div className="flex items-center gap-6 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Khung viền mắt:</span>
              <input
                type="color"
                value={config.eyeOuterColor}
                onChange={(e) => onChange({ ...config, eyeOuterColor: e.target.value })}
                className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Tâm mắt:</span>
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

      {/* 3. Error Correction Level */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block font-semibold text-slate-700 mb-1">
          Mức Độ Sửa Lỗi (Error Correction)
        </label>
        <select
          value={config.errorCorrectionLevel}
          onChange={(e) => onChange({ ...config, errorCorrectionLevel: e.target.value as any })}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
        >
          <option value="L">L - Tiết kiệm dung lượng (7%)</option>
          <option value="M">M - Tiêu chuẩn (15%)</option>
          <option value="Q">Q - Cân bằng khuyến nghị (25%)</option>
          <option value="H">H - Tốt nhất khi có Logo (30%)</option>
        </select>
      </div>

      {/* 4. Quiet Zone (Viền lề an toàn) */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-slate-700">Viền Lề An Toàn (Quiet Zone)</label>
          <span className="font-mono text-slate-500 text-[11px]">{config.margin}px</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => handleQuietZoneModeChange('safe')}
            className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-all ${
              quietZoneMode === 'safe'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Safe (≥4 ô)
          </button>
          <button
            type="button"
            onClick={() => handleQuietZoneModeChange('compact')}
            className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-all ${
              quietZoneMode === 'compact'
                ? 'border-amber-600 bg-amber-50 text-amber-700 font-bold'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Compact (3 ô) ⚠
          </button>
          <button
            type="button"
            onClick={() => handleQuietZoneModeChange('custom')}
            className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-all ${
              quietZoneMode === 'custom'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Tùy biến px
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
              className="w-full accent-indigo-600"
            />
          </div>
        )}

        <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Chuẩn ISO/IEC 18004 yêu cầu viền lề trống tối thiểu 4 modules để quét nhạy.</span>
        </div>
      </div>

      {/* 5. Size / Resolution */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block font-semibold text-slate-700 mb-1">
          Kích Thước Xuất Ảnh (Resolution)
        </label>
        <select
          value={config.size}
          onChange={(e) => onChange({ ...config, size: Number(e.target.value) })}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
        >
          <option value="300">300 x 300 px (Màn hình nhỏ / Web)</option>
          <option value="500">500 x 500 px (Chuẩn hiển thị số)</option>
          <option value="1000">1000 x 1000 px (Khuyên dùng cho tem in 3-5 cm)</option>
          <option value="2000">2000 x 2000 px (In khổ lớn / Pano / Standee)</option>
        </select>
      </div>
    </div>
  );
};
