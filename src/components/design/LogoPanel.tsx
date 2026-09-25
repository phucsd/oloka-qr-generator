import React, { useId } from 'react';
import { Upload, Trash2, AlertTriangle } from 'lucide-react';
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

  const isLargeLogo = config.logoSize > 0.30;

  return (
    <div className="space-y-4 text-xs">
      {/* Upload Button or Clear */}
      <div className="flex items-center gap-3">
        <input
          type="file"
          id={logoInputId}
          accept="image/*"
          onChange={handleCustomLogoUpload}
          className="hidden"
        />
        <label
          htmlFor={logoInputId}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-700 font-semibold rounded-xl cursor-pointer transition-all"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Tải Logo Từ Máy Tính</span>
        </label>

        {config.logoUrl && (
          <button
            type="button"
            onClick={() => onChange({ ...config, logoUrl: '' })}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold rounded-xl transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa Logo</span>
          </button>
        )}
      </div>

      {/* Preset Logos */}
      <div>
        <label className="block font-semibold text-slate-700 mb-2">Hoặc Chọn Logo Phổ Biến:</label>
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
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                config.logoUrl === item.url
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <img src={item.url} alt={item.name} className="w-4 h-4 object-contain" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Logo Controls */}
      {config.logoUrl && (
        <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Tỷ lệ kích thước logo:</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.1"
                max="0.36"
                step="0.02"
                value={config.logoSize}
                onChange={(e) => onChange({ ...config, logoSize: Number(e.target.value) })}
                className="w-28 accent-indigo-600"
              />
              <span className="font-mono text-slate-600">{Math.round(config.logoSize * 100)}%</span>
            </div>
          </div>

          {isLargeLogo && (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>Logo kích thước lớn (&gt; 30%) có thể làm giảm khả năng quét của một số camera.</span>
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-slate-200/70">
            <input
              type="checkbox"
              checked={config.clearLogoBackground}
              onChange={(e) => onChange({ ...config, clearLogoBackground: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="font-semibold text-slate-700">
              Tạo khoảng trống đệm phía sau logo (Tránh chấm QR đè lên logo)
            </span>
          </label>
        </div>
      )}
    </div>
  );
};
