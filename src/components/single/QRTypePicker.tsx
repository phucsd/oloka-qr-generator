import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  CreditCard,
  FileText,
  Wifi,
  User,
  Mail,
  Phone,
  MessageSquare,
  Video,
  Calendar,
  MapPin,
  Share2,
  ChevronDown,
  Check,
} from 'lucide-react';
import { QRType } from '../../types';

interface QRTypeOption {
  id: QRType;
  label: string;
  desc: string;
  icon: React.FC<{ className?: string }>;
}

const TYPE_GROUPS: { group: string; items: QRTypeOption[] }[] = [
  {
    group: 'Phổ biến',
    items: [
      { id: 'url', label: 'Website (URL)', desc: 'Mở đường dẫn trang web', icon: Globe },
      { id: 'vietqr', label: 'VietQR Ngân hàng', desc: 'Chuyển khoản Napas247', icon: CreditCard },
      { id: 'text', label: 'Văn bản (Text)', desc: 'Hiển thị ghi chú, nội dung', icon: FileText },
      { id: 'wifi', label: 'Mạng Wi-Fi', desc: 'Kết nối mạng tự động', icon: Wifi },
    ],
  },
  {
    group: 'Liên hệ',
    items: [
      { id: 'vcard', label: 'Danh bạ (vCard)', desc: 'Lưu số vào danh bạ', icon: User },
      { id: 'email', label: 'E-mail', desc: 'Gửi thư soạn sẵn', icon: Mail },
      { id: 'phone', label: 'Điện thoại', desc: 'Gọi số điện thoại trực tiếp', icon: Phone },
      { id: 'sms', label: 'Tin nhắn SMS', desc: 'Gửi tin nhắn SMS', icon: MessageSquare },
    ],
  },
  {
    group: 'Tiện ích',
    items: [
      { id: 'whatsapp', label: 'WhatsApp', desc: 'Nhắn tin qua WhatsApp', icon: MessageSquare },
      { id: 'zoom', label: 'Họp Zoom', desc: 'Tham gia cuộc họp Zoom', icon: Video },
      { id: 'event', label: 'Sự kiện (Event)', desc: 'Thêm vào lịch sự kiện', icon: Calendar },
      { id: 'location', label: 'Bản đồ (Location)', desc: 'Định vị Google Maps', icon: MapPin },
    ],
  },
  {
    group: 'Khác',
    items: [
      { id: 'paypal', label: 'PayPal', desc: 'Thanh toán trực tuyến', icon: CreditCard },
      { id: 'social', label: 'Mạng xã hội', desc: 'Facebook, Zalo, TikTok...', icon: Share2 },
    ],
  },
];

interface QRTypePickerProps {
  selectedType: QRType;
  onSelectType: (type: QRType) => void;
}

export const QRTypePicker: React.FC<QRTypePickerProps> = ({ selectedType, onSelectType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find currently active item
  const currentItem = TYPE_GROUPS.flatMap((g) => g.items).find((item) => item.id === selectedType) || TYPE_GROUPS[0].items[0];
  const CurrentIcon = currentItem.icon;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
        Loại Mã QR
      </label>

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-200/90 hover:border-indigo-400 rounded-xl shadow-2xs text-left transition-all group focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <CurrentIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">{currentItem.label}</div>
            <div className="text-[11px] text-slate-500">{currentItem.desc}</div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-full sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2 space-y-3 animate-in fade-in zoom-in-95 duration-100 max-h-[420px] overflow-y-auto">
          {TYPE_GROUPS.map((group) => (
            <div key={group.group} className="space-y-1">
              <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {group.group}
              </div>
              <div className="grid grid-cols-1 gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isSelected = item.id === selectedType;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectType(item.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold">{item.label}</div>
                          <div className="text-[10px] text-slate-400">{item.desc}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
