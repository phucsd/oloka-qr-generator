import React, { useState, useId } from 'react';
import {
  Palette,
  Shapes,
  Image as ImageIcon,
  Frame,
  Sliders,
  ChevronDown,
  ChevronUp,
  Upload,
  Trash2,
} from 'lucide-react';
import {
  CornerDotType,
  CornerSquareType,
  DotType,
  FrameType,
  QRDesignConfig,
} from '../types';

interface DesignCustomizerProps {
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

export const DesignCustomizer: React.FC<DesignCustomizerProps> = ({ config, onChange }) => {
  const logoInputId = useId();
  const [openSection, setOpenSection] = useState<'colors' | 'patterns' | 'logo' | 'frame' | 'advanced' | null>('colors');

  const toggleSection = (section: 'colors' | 'patterns' | 'logo' | 'frame' | 'advanced') => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange({
        ...config,
        logoUrl: dataUrl,
        errorCorrectionLevel: 'H', // Auto switch to high error correction when logo is added
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden divide-y divide-slate-100">
      <div className="p-4 bg-slate-50/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Tùy Biến Thiết Kế & Nhận Diện Mã QR</h2>
        </div>
        <span className="text-[11px] font-semibold text-slate-500">Xem trước tức thì</span>
      </div>

      {/* 1. MÀU SẮC (COLORS) */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection('colors')}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Màu Sắc & Nền</h3>
              <p className="text-[11px] text-slate-500">Đơn sắc, chuyển màu gradient, nền trong suốt</p>
            </div>
          </div>
          {openSection === 'colors' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'colors' && (
          <div className="px-5 pb-5 pt-1 space-y-4 text-xs">
            {/* Background Color */}
            <div className="space-y-2">
              <label className="block font-semibold text-slate-700">Màu Nền Mã QR</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.bgColor}
                  disabled={config.isTransparentBg}
                  onChange={(e) => onChange({ ...config, bgColor: e.target.value })}
                  className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer disabled:opacity-30"
                />
                <input
                  type="text"
                  value={config.bgColor}
                  disabled={config.isTransparentBg}
                  onChange={(e) => onChange({ ...config, bgColor: e.target.value })}
                  className="w-24 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono disabled:opacity-30"
                />
                <label className="flex items-center gap-1.5 cursor-pointer ml-2">
                  <input
                    type="checkbox"
                    checked={config.isTransparentBg}
                    onChange={(e) => onChange({ ...config, isTransparentBg: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="font-semibold text-slate-700">Nền Trong Suốt (Transparent)</span>
                </label>
              </div>
            </div>

            {/* QR Foreground Color Mode */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block font-semibold text-slate-700">Màu Vẽ Mã QR</label>
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => onChange({ ...config, fgColorType: 'solid' })}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    config.fgColorType === 'solid'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Màu Đơn Sắc
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ...config, fgColorType: 'gradient' })}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    config.fgColorType === 'gradient'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Gradient Chuyển Màu
                </button>
              </div>

              {config.fgColorType === 'solid' ? (
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.fgColor}
                    onChange={(e) => onChange({ ...config, fgColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.fgColor}
                    onChange={(e) => onChange({ ...config, fgColor: e.target.value })}
                    className="w-24 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              ) : (
                <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Màu 1:</span>
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
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Màu 2:</span>
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
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Kiểu:</span>
                      <select
                        value={config.fgGradient.type}
                        onChange={(e) =>
                          onChange({
                            ...config,
                            fgGradient: {
                              ...config.fgGradient,
                              type: e.target.value as any,
                            },
                          })
                        }
                        className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="linear">Tuyến tính (Linear)</option>
                        <option value="radial">Xuyên tâm (Radial)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Góc xoay:</span>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={config.fgGradient.rotation}
                        onChange={(e) =>
                          onChange({
                            ...config,
                            fgGradient: {
                              ...config.fgGradient,
                              rotation: Number(e.target.value),
                            },
                          })
                        }
                        className="w-24 accent-indigo-600"
                      />
                      <span className="font-mono text-slate-600">{config.fgGradient.rotation}°</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Eye Colors */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
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
                <div className="flex items-center gap-6 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
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
          </div>
        )}
      </div>

      {/* 2. KIỂU DÁNG HẠT & GÓC (PATTERNS) */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection('patterns')}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <Shapes className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Kiểu Dáng Hạt & Mắt QR</h3>
              <p className="text-[11px] text-slate-500">Vuông, chấm tròn, bo góc hiện đại, classy</p>
            </div>
          </div>
          {openSection === 'patterns' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'patterns' && (
          <div className="px-5 pb-5 pt-1 space-y-4 text-xs">
            {/* Body Dots */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">Hạt Nội Dung Bên Trong (Body Dots)</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(
                  [
                    { id: 'square', label: 'Vuông' },
                    { id: 'dots', label: 'Chấm Tròn' },
                    { id: 'rounded', label: 'Bo Góc' },
                    { id: 'extra-rounded', label: 'Siêu Tròn' },
                    { id: 'classy', label: 'Classy' },
                    { id: 'classy-rounded', label: 'Classy Mềm' },
                  ] as { id: DotType; label: string }[]
                ).map((dot) => (
                  <button
                    key={dot.id}
                    type="button"
                    onClick={() => onChange({ ...config, dotType: dot.id })}
                    className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                      config.dotType === dot.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {dot.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Corner Square */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block font-semibold text-slate-700 mb-2">Khung Viền Góc Mắt (Corner Square)</label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'square', label: 'Vuông Cổ Điển' },
                    { id: 'extra-rounded', label: 'Bo Tròn Hiện Đại' },
                    { id: 'dot', label: 'Tròn Hoàn Toàn' },
                  ] as { id: CornerSquareType; label: string }[]
                ).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onChange({ ...config, cornerSquareType: c.id })}
                    className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                      config.cornerSquareType === c.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Corner Dot */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block font-semibold text-slate-700 mb-2">Chấm Tâm Góc Mắt (Corner Dot)</label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'dot', label: 'Chấm Tròn' },
                    { id: 'square', label: 'Chấm Vuông' },
                  ] as { id: CornerDotType; label: string }[]
                ).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => onChange({ ...config, cornerDotType: d.id })}
                    className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                      config.cornerDotType === d.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. LOGO THƯƠNG HIỆU */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection('logo')}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Logo Thương Hiệu</h3>
              <p className="text-[11px] text-slate-500">Tải ảnh lên, logo mạng xã hội, khoảng trống đệm cho logo</p>
            </div>
          </div>
          {openSection === 'logo' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'logo' && (
          <div className="px-5 pb-5 pt-1 space-y-4 text-xs">
            {/* Upload or Selected Logo */}
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

            {/* Logo Presets */}
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

            {/* Logo Size and Clear Background Toggle */}
            {config.logoUrl && (
              <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Kích thước logo:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0.1"
                      max="0.38"
                      step="0.02"
                      value={config.logoSize}
                      onChange={(e) => onChange({ ...config, logoSize: Number(e.target.value) })}
                      className="w-28 accent-indigo-600"
                    />
                    <span className="font-mono text-slate-600">{Math.round(config.logoSize * 100)}%</span>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-slate-200/70">
                  <input
                    type="checkbox"
                    checked={config.clearLogoBackground}
                    onChange={(e) => onChange({ ...config, clearLogoBackground: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="font-semibold text-slate-700">
                    Tạo khoảng trống đệm phía sau logo (Tránh chấm QR đè lên logo, giúp quét nhanh)
                  </span>
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. ĐÓNG KHUNG VIỀN (FRAMES) */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection('frame')}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <Frame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Đóng Khung Viền & Thông Điệp</h3>
              <p className="text-[11px] text-slate-500">Thêm thanh "SCAN ME", "QUÉT TÔI", màu khung & font</p>
            </div>
          </div>
          {openSection === 'frame' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'frame' && (
          <div className="px-5 pb-5 pt-1 space-y-4 text-xs">
            {/* Frame Type */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">Mẫu Khung Viền</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(
                  [
                    { id: 'none', label: 'Không Khung' },
                    { id: 'bottom-bar', label: 'Thanh Dưới' },
                    { id: 'top-bar', label: 'Thanh Trên' },
                    { id: 'bubble-bottom', label: 'Bong Bóng' },
                    { id: 'card-border', label: 'Khung Thẻ' },
                  ] as { id: FrameType; label: string }[]
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...config,
                        frame: { ...config.frame, type: f.id },
                      })
                    }
                    className={`p-2 rounded-xl border text-center font-semibold transition-all ${
                      config.frame.type === f.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {config.frame.type !== 'none' && (
              <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chữ Kêu Gọi Hành Động (CTA)</label>
                  <input
                    type="text"
                    value={config.frame.text}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        frame: { ...config.frame, text: e.target.value },
                      })
                    }
                    placeholder="SCAN ME / QUÉT MÃ TẠI ĐÂY..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-semibold">Màu Khung:</span>
                    <input
                      type="color"
                      value={config.frame.bgColor}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          frame: { ...config.frame, bgColor: e.target.value },
                        })
                      }
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-semibold">Màu Chữ:</span>
                    <input
                      type="color"
                      value={config.frame.textColor}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          frame: { ...config.frame, textColor: e.target.value },
                        })
                      }
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-semibold">Font Chữ:</span>
                    <select
                      value={config.frame.font}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          frame: { ...config.frame, font: e.target.value },
                        })
                      }
                      className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="Be Vietnam Pro">Be Vietnam Pro (Chuẩn)</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Arial">Arial</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. THÔNG SỐ KỸ THUẬT (ADVANCED) */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection('advanced')}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Thông Số Kỹ Thuật & Sửa Lỗi</h3>
              <p className="text-[11px] text-slate-500">Độ phân giải pixel, mức sửa lỗi L/M/Q/H, viền lề an toàn</p>
            </div>
          </div>
          {openSection === 'advanced' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSection === 'advanced' && (
          <div className="px-5 pb-5 pt-1 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kích Thước Xuất Ảnh (Resolution)
                </label>
                <select
                  value={config.size}
                  onChange={(e) => onChange({ ...config, size: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                >
                  <option value="300">300 x 300 px (Màn hình nhỏ / Web)</option>
                  <option value="500">500 x 500 px (Chuẩn hiển thị số)</option>
                  <option value="1000">1000 x 1000 px (Khuyến nghị cho in ấn 3-5 cm)</option>
                  <option value="2000">2000 x 2000 px (In khổ lớn / Pano / Standee)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mức Độ Sửa Lỗi (Error Correction)
                </label>
                <select
                  value={config.errorCorrectionLevel}
                  onChange={(e) => onChange({ ...config, errorCorrectionLevel: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                >
                  <option value="L">L - Thấp (7% - Mã thoáng nhất)</option>
                  <option value="M">M - Trung bình (15%)</option>
                  <option value="Q">Q - Cao (25% - Cân bằng)</option>
                  <option value="H">H - Tốt Nhất (30% - Khuyến nghị khi có Logo)</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-700">Viền Lề An Toàn (Quiet Zone):</span>
                <span className="font-mono text-slate-600">
                  {config.margin}px {config.margin < 8 ? '(Khuyến nghị ≥ 8px)' : '(Chuẩn)'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={config.margin}
                onChange={(e) => onChange({ ...config, margin: Number(e.target.value) })}
                className="w-full accent-indigo-600"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Theo chuẩn ISO/IEC 18004, mã QR cần khoảng đệm viền lề trống tối thiểu 4 modules để các ứng dụng camera nhận diện và quét tức thì.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
