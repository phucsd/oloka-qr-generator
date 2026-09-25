import React from 'react';
import { FrameType, QRDesignConfig } from '../../types';

interface FramePanelProps {
  config: QRDesignConfig;
  onChange: (newConfig: QRDesignConfig) => void;
}

const FrameMiniPreview: React.FC<{ type: FrameType }> = ({ type }) => {
  switch (type) {
    case 'none':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-slate-400 fill-none">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" strokeDasharray="3 2" />
        </svg>
      );
    case 'bottom-bar':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <rect x="2" y="2" width="20" height="15" rx="1.5" fill="none" stroke="#64748b" strokeWidth="1.5" />
          <rect x="2" y="17" width="20" height="5" rx="1" fill="#4f46e5" />
        </svg>
      );
    case 'top-bar':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <rect x="2" y="2" width="20" height="5" rx="1" fill="#4f46e5" />
          <rect x="2" y="7" width="20" height="15" rx="1.5" fill="none" stroke="#64748b" strokeWidth="1.5" />
        </svg>
      );
    case 'bubble-bottom':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <rect x="3" y="1" width="18" height="16" rx="2" fill="none" stroke="#64748b" strokeWidth="1.5" />
          <rect x="5" y="18" width="14" height="5" rx="2.5" fill="#4f46e5" />
        </svg>
      );
    case 'card-border':
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="#4f46e5" strokeWidth="2" />
          <rect x="6" y="6" width="12" height="12" fill="#94a3b8" rx="1" />
        </svg>
      );
  }
};

export const FramePanel: React.FC<FramePanelProps> = ({ config, onChange }) => {
  const frameOptions: { id: FrameType; label: string }[] = [
    { id: 'none', label: 'Không khung' },
    { id: 'bottom-bar', label: 'Thanh dưới' },
    { id: 'top-bar', label: 'Thanh trên' },
    { id: 'bubble-bottom', label: 'Bong bóng' },
    { id: 'card-border', label: 'Khung thẻ' },
  ];

  return (
    <div className="space-y-4 text-xs">
      <div>
        <label className="block font-medium text-slate-700 mb-2">Mẫu khung viền</label>
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
                className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-semibold shadow-2xs'
                    : 'border-slate-200/90 bg-white text-slate-600 hover:bg-slate-50 font-normal'
                }`}
              >
                <FrameMiniPreview type={f.id} />
                <span className="text-[11px] truncate">{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {config.frame.type !== 'none' && (
        <div className="space-y-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Chữ kêu gọi hành động (CTA)
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
              placeholder="QUÉT MÃ TẠI ĐÂY..."
              className="w-full px-3 py-2 bg-white border border-slate-200/90 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[11px]">Màu khung:</span>
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
              <span className="text-slate-500 text-[11px]">Màu chữ:</span>
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
              <span className="text-slate-500 text-[11px]">Phông chữ:</span>
              <select
                value={config.frame.font}
                onChange={(e) =>
                  onChange({
                    ...config,
                    frame: { ...config.frame, font: e.target.value },
                  })
                }
                className="px-2.5 py-1 bg-white border border-slate-200/90 rounded-lg text-xs font-normal"
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
