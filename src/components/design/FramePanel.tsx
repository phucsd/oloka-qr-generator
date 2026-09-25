import React from 'react';
import { FrameType, QRDesignConfig } from '../../types';

interface FramePanelProps {
  config: QRDesignConfig;
  onChange: (newConfig: QRDesignConfig) => void;
}

export const FramePanel: React.FC<FramePanelProps> = ({ config, onChange }) => {
  const frameOptions: { id: FrameType; label: string }[] = [
    { id: 'none', label: 'Không Khung' },
    { id: 'bottom-bar', label: 'Thanh Dưới' },
    { id: 'top-bar', label: 'Thanh Trên' },
    { id: 'bubble-bottom', label: 'Bong Bóng' },
    { id: 'card-border', label: 'Khung Thẻ' },
  ];

  return (
    <div className="space-y-4 text-xs">
      <div>
        <label className="block font-semibold text-slate-700 mb-2">Mẫu Khung Viền</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {frameOptions.map((f) => {
            const isSelected = config.frame.type === f.id;
            return (
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
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {config.frame.type !== 'none' && (
        <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Chữ Kêu Gọi Hành Động (CTA)
            </label>
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
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider focus:ring-2 focus:ring-indigo-500/20"
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
  );
};
