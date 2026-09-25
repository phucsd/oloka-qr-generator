import React, { useId } from 'react';
import { Upload, Trash2, HelpCircle } from 'lucide-react';
import { QRDesignConfig } from '../../types';

interface LogoPanelProps {
  config: QRDesignConfig;
  onChange: (newConfig: QRDesignConfig) => void;
}

const PRESET_LOGOS = [
  { name: 'VietQR', url: 'https://api.vietqr.io/img/vietqr-ico.png' },
  { name: 'Zalo', url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg' },
  { name: 'Facebook', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg' },
  { name: 'TikTok', url: 'https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg' },
  { name: 'Instagram', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png' },
  { name: 'YouTube', url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg' },
  { name: 'Wi-Fi', url: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/WiFi_Logo.svg' },
];

export const LogoPanel: React.FC<LogoPanelProps> = ({ config, onChange }) => {
  const logoInputId = useId();

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange({
        ...config,
        logoUrl: dataUrl,
        errorCorrectionLevel: 'H', // Auto switch to high error correction
      });
    };
    reader.readAsDataURL(file);
  };

  const logoPercent = Math.round(config.logoSize * 100);
  const isSafe = logoPercent <= 18;
  const isRecommended = logoPercent > 18 && logoPercent <= 28;
  const isRisky = logoPercent > 28;

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Upload Button or Clear */}
      <div className="flex items-center gap-2.5">
        <input
          type="file"
          id={logoInputId}
          accept="image/*"
          onChange={handleCustomLogoUpload}
          className="hidden"
        />
        <label
          htmlFor={logoInputId}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-700 font-medium rounded-xl cursor-pointer transition-all shadow-2xs"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Tải logo từ máy</span>
        </label>

        {config.logoUrl && (
          <button
            type="button"
            onClick={() => onChange({ ...config, logoUrl: '' })}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-medium rounded-xl transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa logo</span>
          </button>
        )}
      </div>

      {/* 2. Preset Logos */}
      <div>
        <label className="block font-medium text-slate-700 mb-2">Hoặc chọn logo phổ biến:</label>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_LOGOS.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() =>
                onChange({
                  ...config,
                  logoUrl: item.url,
                  errorCorrectionLevel: 'H',
                })
              }
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
                config.logoUrl === item.url
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-normal'
              }`}
            >
              <img src={item.url} alt={item.name} className="w-4 h-4 object-contain" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Logo Controls with Visual Reference Demo */}
      {config.logoUrl && (
        <div className="space-y-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-700">Kích thước logo:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-700 font-medium">{logoPercent}%</span>
              {/* Dynamic Status Badge */}
              {isSafe && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
                  An toàn
                </span>
              )}
              {isRecommended && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-800">
                  Khuyên dùng
                </span>
              )}
              {isRisky && (
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-100 text-rose-800 flex items-center gap-1"
                  title="Logo lớn có thể che module QR"
                >
                  <span>⚠ Rủi ro</span>
                  <HelpCircle className="w-3 h-3 text-rose-600" />
                </span>
              )}
            </div>
          </div>

          {/* Visual Slider with Reference Dots */}
          <div className="space-y-1">
            <input
              type="range"
              min="0.10"
              max="0.36"
              step="0.02"
              value={config.logoSize}
              onChange={(e) => onChange({ ...config, logoSize: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            {/* Visual Demo References: Safe / Recommended / Risky */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5 px-0.5">
              <span className={isSafe ? 'text-emerald-700 font-semibold' : ''}>10% An toàn</span>
              <span className={isRecommended ? 'text-indigo-700 font-semibold' : ''}>22% Khuyên dùng</span>
              <span className={isRisky ? 'text-rose-700 font-semibold' : ''}>36% Rủi ro</span>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-slate-200/60">
            <input
              type="checkbox"
              checked={config.clearLogoBackground}
              onChange={(e) => onChange({ ...config, clearLogoBackground: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="font-normal text-slate-700">
              Vùng đệm bảo vệ logo (Tránh hạt QR đè lên hình)
            </span>
          </label>
        </div>
      )}
    </div>
  );
};
