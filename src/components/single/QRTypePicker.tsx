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
  MessageCircle,
  Video,
  Calendar,
  MapPin,
  Share2,
  DollarSign,
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
      { id: 'url', label: 'Website', desc: 'Mở đường dẫn trang web', icon: Globe },
      { id: 'vietqr', label: 'VietQR', desc: 'Chuyển khoản Napas247', icon: CreditCard },
      { id: 'text', label: 'Văn bản', desc: 'Ghi chú, thông điệp', icon: FileText },
      { id: 'wifi', label: 'Mạng Wi-Fi', desc: 'Kết nối mạng tự động', icon: Wifi },
    ],
  },
  {
    group: 'Liên hệ',
    items: [
      { id: 'vcard', label: 'Danh bạ (vCard)', desc: 'Lưu thông tin liên hệ', icon: User },
      { id: 'email', label: 'E-mail', desc: 'Soạn và gửi email nhanh', icon: Mail },
      { id: 'phone', label: 'Điện thoại', desc: 'Gọi số điện thoại trực tiếp', icon: Phone },
      { id: 'sms', label: 'Tin nhắn SMS', desc: 'Gửi tin nhắn mẫu', icon: MessageSquare },
    ],
  },
  {
    group: 'Tiện ích',
    items: [
      { id: 'whatsapp', label: 'WhatsApp', desc: 'Nhắn tin qua WhatsApp', icon: MessageCircle },
      { id: 'zoom', label: 'Họp Zoom', desc: 'Tham gia phòng họp', icon: Video },
      { id: 'event', label: 'Sự kiện', desc: 'Thêm vào ứng dụng lịch', icon: Calendar },
      { id: 'location', label: 'Vị trí', desc: 'Mở bản đồ Google Maps', icon: MapPin },
    ],
  },
  {
    group: 'Khác',
    items: [
      { id: 'paypal', label: 'PayPal', desc: 'Thanh toán trực tuyến', icon: DollarSign },
      { id: 'social', label: 'Mạng xã hội', desc: 'Kênh truyền thông, liên kết', icon: Share2 },
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
  const currentItem =
    TYPE_GROUPS.flatMap((g) => g.items).find((item) => item.id === selectedType) ||
    TYPE_GROUPS[0].items[0];
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
      <label className="block text-xs font-medium text-slate-700 mb-1.5">
        Loại mã QR
      </label>

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-200/90 hover:border-indigo-300 rounded-xl shadow-2xs text-left transition-all group focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <CurrentIcon className="w-4 h-4 stroke-[1.8]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">{currentItem.label}</div>
            <div className="text-xs text-slate-500 font-normal">{currentItem.desc}</div>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180 text-indigo-600' : ''
          }`}
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-full sm:w-[460px] bg-white rounded-2xl border border-slate-200/90 shadow-xl z-50 p-3 space-y-3 animate-in fade-in zoom-in-95 duration-100 max-h-[440px] overflow-y-auto">
          {TYPE_GROUPS.map((group) => (
            <div key={group.group} className="space-y-1.5">
              <div className="px-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                {group.group}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
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
                      className={`flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-indigo-50/80 text-indigo-700'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Icon className="w-4 h-4 stroke-[1.8]" />
                        </div>
                        <div className="min-w-0 truncate">
                          <div
                            className={`text-xs truncate ${
                              isSelected ? 'font-semibold text-indigo-900' : 'font-medium text-slate-800'
                            }`}
                          >
                            {item.label}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate font-normal">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-indigo-600 shrink-0 ml-1.5" />
                      )}
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
