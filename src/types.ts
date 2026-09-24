export type QRType =
  | 'text'
  | 'url'
  | 'vietqr'
  | 'wifi'
  | 'vcard'
  | 'email'
  | 'phone'
  | 'sms'
  | 'whatsapp'
  | 'zoom'
  | 'event'
  | 'paypal'
  | 'location'
  | 'social';

export type DotType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
export type CornerSquareType = 'square' | 'dot' | 'extra-rounded';
export type CornerDotType = 'square' | 'dot';

export type GradientType = 'linear' | 'radial';

export interface GradientConfig {
  type: GradientType;
  rotation: number;
  colorStops: { offset: number; color: string }[];
}

export type FrameType = 'none' | 'bottom-bar' | 'top-bar' | 'bubble-bottom' | 'card-border';

export interface FrameConfig {
  type: FrameType;
  text: string;
  textColor: string;
  bgColor: string;
  font: string;
}

export interface QRDesignConfig {
  size: number;
  margin: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  // Foreground
  fgColorType: 'solid' | 'gradient';
  fgColor: string;
  fgGradient: GradientConfig;
  // Background
  isTransparentBg: boolean;
  bgColor: string;
  // Dots pattern
  dotType: DotType;
  // Corners
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
  isCustomEyeColors: boolean;
  eyeOuterColor: string;
  eyeInnerColor: string;
  // Logo
  logoUrl?: string;
  logoSize: number; // 0.1 - 0.4
  logoMargin: number;
  clearLogoBackground: boolean;
  // Frame
  frame: FrameConfig;
  // Label below QR
  showTextLabel: boolean;
  textLabelField?: string;
}

export interface BankInfo {
  bin: string;
  shortName: string;
  name: string;
}

export interface VietQRData {
  bankBin: string;
  accountNumber: string;
  accountName: string;
  amount: string;
  description: string;
}

export interface WiFiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  fullName: string;
  organization: string;
  title: string;
  phone: string;
  mobile: string;
  email: string;
  website: string;
  address: string;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
}

export interface PhoneData {
  phone: string;
}

export interface SMSData {
  phone: string;
  message: string;
}

export interface WhatsAppData {
  phone: string;
  message: string;
}

export interface ZoomData {
  meetingId: string;
  password: string;
}

export interface EventData {
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  description: string;
}

export interface PayPalData {
  email: string;
  type: 'buy' | 'donate' | 'cart';
  itemName: string;
  itemId: string;
  price: string;
  currency: string;
}

export interface LocationData {
  latitude: string;
  longitude: string;
  name: string;
}

export interface SocialData {
  platform: 'facebook' | 'zalo' | 'tiktok' | 'youtube' | 'instagram' | 'telegram';
  usernameOrUrl: string;
}

export interface BulkItem {
  id: string;
  index: number;
  data: string;
  filename: string;
  label?: string;
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
}
