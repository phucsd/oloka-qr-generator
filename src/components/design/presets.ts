import { QRDesignConfig } from '../../types';

export interface DesignPreset {
  id: string;
  name: string;
  desc: string;
  configPatch: Partial<QRDesignConfig>;
}

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: 'classic',
    name: 'Cổ Điển',
    desc: 'Vuông đen trắng chuẩn ISO',
    configPatch: {
      dotType: 'square',
      cornerSquareType: 'square',
      cornerDotType: 'square',
      fgColor: '#111827',
      bgColor: '#ffffff',
      fgColorType: 'solid',
      isTransparentBg: false,
      isCustomEyeColors: false,
      errorCorrectionLevel: 'Q',
      margin: 16,
    },
  },
  {
    id: 'rounded',
    name: 'Bo Tròn Mềm',
    desc: 'Hạt bo góc hiện đại',
    configPatch: {
      dotType: 'rounded',
      cornerSquareType: 'extra-rounded',
      cornerDotType: 'dot',
      fgColor: '#1e293b',
      bgColor: '#ffffff',
      fgColorType: 'solid',
      isTransparentBg: false,
      isCustomEyeColors: false,
      errorCorrectionLevel: 'Q',
      margin: 16,
    },
  },
  {
    id: 'modern-gradient',
    name: 'Hiện Đại (Gradient)',
    desc: 'Chuyển sắc xanh tím',
    configPatch: {
      dotType: 'extra-rounded',
      cornerSquareType: 'extra-rounded',
      cornerDotType: 'dot',
      fgColorType: 'gradient',
      fgGradient: {
        type: 'linear',
        rotation: 45,
        colorStops: [
          { offset: 0, color: '#4f46e5' },
          { offset: 1, color: '#06b6d4' },
        ],
      },
      bgColor: '#ffffff',
      isTransparentBg: false,
      isCustomEyeColors: false,
      errorCorrectionLevel: 'Q',
      margin: 16,
    },
  },
  {
    id: 'print-safe',
    name: 'In Decal (Print-Safe)',
    desc: 'Tương phản tuyệt đối & lề an toàn',
    configPatch: {
      dotType: 'square',
      cornerSquareType: 'square',
      cornerDotType: 'square',
      fgColor: '#000000',
      bgColor: '#ffffff',
      fgColorType: 'solid',
      isTransparentBg: false,
      isCustomEyeColors: false,
      errorCorrectionLevel: 'H',
      margin: 20,
    },
  },
];
