import React, { useState, useEffect } from 'react';
import {
  Type,
  Link,
  CreditCard,
  Wifi,
  Contact,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  Video,
  Calendar,
  DollarSign,
  MapPin,
  Share2,
} from 'lucide-react';
import {
  EmailData,
  EventData,
  LocationData,
  PayPalData,
  PhoneData,
  QRType,
  SMSData,
  SocialData,
  VCardData,
  VietQRData,
  WhatsAppData,
  WiFiData,
  ZoomData,
} from '../types';
import { POPULAR_BANKS } from '../services/vietqrService';

interface SingleQRFormProps {
  onContentChange: (type: QRType, data: any) => void;
}

export const SingleQRForm: React.FC<SingleQRFormProps> = ({ onContentChange }) => {
  const [activeType, setActiveType] = useState<QRType>('url');

  // Form states for each type
  const [text, setText] = useState('Chào mừng bạn đến với Oloka QR Generator!');
  const [url, setUrl] = useState('https://oloka.vn');
  const [vietqr, setVietqr] = useState<VietQRData>({
    bankBin: '970436', // Vietcombank
    accountNumber: '1012345678',
    accountName: 'NGUYEN VAN A',
    amount: '100000',
    description: 'Thanh toan don hang',
  });
  const [wifi, setWifi] = useState<WiFiData>({
    ssid: 'Oloka_HighSpeed_WiFi',
    password: 'OlokaPassword2026',
    encryption: 'WPA',
    hidden: false,
  });
  const [vcard, setVcard] = useState<VCardData>({
    fullName: 'Nguyễn Văn An',
    organization: 'Công Ty Công Nghệ Oloka',
    title: 'Giám Đốc Kinh Doanh',
    phone: '02812345678',
    mobile: '0901234567',
    email: 'an.nguyen@oloka.vn',
    website: 'https://oloka.vn',
    address: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM',
  });
  const [email, setEmail] = useState<EmailData>({
    email: 'contact@oloka.vn',
    subject: 'Liên hệ hợp tác và hỗ trợ',
    body: 'Xin chào Oloka, tôi muốn tìm hiểu thêm về dịch vụ...',
  });
  const [phone, setPhone] = useState<PhoneData>({ phone: '0903456789' });
  const [sms, setSms] = useState<SMSData>({
    phone: '0903456789',
    message: 'Tôi quan tâm đến sản phẩm của bạn',
  });
  const [whatsapp, setWhatsapp] = useState<WhatsAppData>({
    phone: '84903456789',
    message: 'Xin chào, tôi cần hỗ trợ tư vấn!',
  });
  const [zoom, setZoom] = useState<ZoomData>({
    meetingId: '829 1234 5678',
    password: 'OlokaZoomPass',
  });
  const [event, setEvent] = useState<EventData>({
    title: 'Hội Thảo Ra Mắt Sản Phẩm Oloka 2026',
    location: 'Khách sạn Landmark 81, TP.HCM',
    startTime: '2026-10-15T09:00',
    endTime: '2026-10-15T12:00',
    description: 'Tham gia để nhận nhiều phần quà và ưu đãi hấp dẫn.',
  });
  const [paypal, setPaypal] = useState<PayPalData>({
    email: 'paypal@oloka.vn',
    type: 'buy',
    itemName: 'Gói Dịch Vụ Oloka VIP',
    itemId: 'VIP-001',
    price: '29.99',
    currency: 'USD',
  });
  const [location, setLocation] = useState<LocationData>({
    latitude: '10.7769',
    longitude: '106.7009',
    name: 'Phố đi bộ Nguyễn Huệ, TP.HCM',
  });
  const [social, setSocial] = useState<SocialData>({
    platform: 'facebook',
    usernameOrUrl: 'olokavn',
  });

  // Emit current data to parent whenever activeType or form values change
  useEffect(() => {
    switch (activeType) {
      case 'text':
        onContentChange('text', text);
        break;
      case 'url':
        onContentChange('url', url);
        break;
      case 'vietqr':
        onContentChange('vietqr', vietqr);
        break;
      case 'wifi':
        onContentChange('wifi', wifi);
        break;
      case 'vcard':
        onContentChange('vcard', vcard);
        break;
      case 'email':
        onContentChange('email', email);
        break;
      case 'phone':
        onContentChange('phone', phone);
        break;
      case 'sms':
        onContentChange('sms', sms);
        break;
      case 'whatsapp':
        onContentChange('whatsapp', whatsapp);
        break;
      case 'zoom':
        onContentChange('zoom', zoom);
        break;
      case 'event':
        onContentChange('event', event);
        break;
      case 'paypal':
        onContentChange('paypal', paypal);
        break;
      case 'location':
        onContentChange('location', location);
        break;
      case 'social':
        onContentChange('social', social);
        break;
    }
  }, [
    activeType,
    text,
    url,
    vietqr,
    wifi,
    vcard,
    email,
    phone,
    sms,
    whatsapp,
    zoom,
    event,
    paypal,
    location,
    social,
  ]);

  const tabs: { id: QRType; label: string; icon: React.ReactNode; isHot?: boolean }[] = [
    { id: 'url', label: 'Đường dẫn', icon: <Link className="w-4 h-4" /> },
    { id: 'vietqr', label: 'VietQR', icon: <CreditCard className="w-4 h-4" />, isHot: true },
    { id: 'text', label: 'Văn bản', icon: <Type className="w-4 h-4" /> },
    { id: 'wifi', label: 'Wi-Fi', icon: <Wifi className="w-4 h-4" /> },
    { id: 'vcard', label: 'Danh bạ', icon: <Contact className="w-4 h-4" /> },
    { id: 'email', label: 'E-mail', icon: <Mail className="w-4 h-4" /> },
    { id: 'phone', label: 'Điện thoại', icon: <Phone className="w-4 h-4" /> },
    { id: 'sms', label: 'SMS', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'zoom', label: 'Zoom', icon: <Video className="w-4 h-4" /> },
    { id: 'event', label: 'Sự kiện', icon: <Calendar className="w-4 h-4" /> },
    { id: 'paypal', label: 'PayPal', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'location', label: 'Vị trí', icon: <MapPin className="w-4 h-4" /> },
    { id: 'social', label: 'Mạng xã hội', icon: <Share2 className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6">
      {/* Types Scrollable / Wrap Grid Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100 mb-6">
        {tabs.map((tab) => {
          const isActive = activeType === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveType(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.isHot && (
                <span
                  className={`text-[9px] uppercase px-1 py-0.2 rounded font-black tracking-wider ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-rose-500 text-white'
                  }`}
                >
                  Hot
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Form Fields corresponding to active tab */}
      <div className="space-y-4">
        {/* URL Form */}
        {activeType === 'url' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Đường Dẫn Website / Landing Page
            </label>
            <div className="relative rounded-xl shadow-2xs">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Nhập link website, link shopee, tiktok shop, bài viết blog hoặc bất kỳ liên kết nào.
            </p>
          </div>
        )}

        {/* Text Form */}
        {activeType === 'text' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nội Dung Văn Bản
              </label>
              <button
                type="button"
                onClick={() => setText('')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                Xoá nội dung
              </button>
            </div>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập bất kỳ đoạn văn bản, ghi chú, mã vạch nào..."
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none"
            />
            <p className="mt-1 text-xs text-slate-500">
              Độ dài ký tự: {text.length} (Hỗ trợ tiếng Việt đầy đủ có dấu).
            </p>
          </div>
        )}

        {/* VietQR Form */}
        {activeType === 'vietqr' && (
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Mã VietQR chuẩn Napas247 giúp khách hàng quét chuyển khoản nhanh bằng tất cả app ngân hàng và ví điện tử (MoMo, ZaloPay, Vietcombank, MB, v.v.).
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chọn Ngân Hàng Thụ Hưởng
                </label>
                <select
                  value={vietqr.bankBin}
                  onChange={(e) => setVietqr({ ...vietqr, bankBin: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                >
                  {POPULAR_BANKS.map((b) => (
                    <option key={b.bin} value={b.bin}>
                      {b.shortName} - {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số Tài Khoản Ngân Hàng
                </label>
                <input
                  type="text"
                  value={vietqr.accountNumber}
                  onChange={(e) => setVietqr({ ...vietqr, accountNumber: e.target.value })}
                  placeholder="Ví dụ: 1012345678"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên Chủ Tài Khoản (In hoa không dấu)
                </label>
                <input
                  type="text"
                  value={vietqr.accountName}
                  onChange={(e) => setVietqr({ ...vietqr, accountName: e.target.value.toUpperCase() })}
                  placeholder="Ví dụ: NGUYEN VAN A"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số Tiền Chuyển (VNĐ - Tùy chọn)
                </label>
                <input
                  type="number"
                  value={vietqr.amount}
                  onChange={(e) => setVietqr({ ...vietqr, amount: e.target.value })}
                  placeholder="Ví dụ: 500000"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nội Dung Chuyển Tiền (Tùy chọn)
              </label>
              <input
                type="text"
                value={vietqr.description}
                onChange={(e) => setVietqr({ ...vietqr, description: e.target.value })}
                placeholder="Ví dụ: Thanh toan tien mua ao Polo"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Wi-Fi Form */}
        {activeType === 'wifi' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên Mạng Wi-Fi (SSID)
              </label>
              <input
                type="text"
                value={wifi.ssid}
                onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                placeholder="Ví dụ: Coffee_Oloka_Guest"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật Khẩu Wi-Fi
                </label>
                <input
                  type="text"
                  value={wifi.password}
                  onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                  placeholder="Nhập mật khẩu..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chuẩn Bảo Mật
                </label>
                <select
                  value={wifi.encryption}
                  onChange={(e) => setWifi({ ...wifi, encryption: e.target.value as any })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                >
                  <option value="WPA">WPA / WPA2 / WPA3 (Phổ biến)</option>
                  <option value="WEP">WEP (Mạng cũ)</option>
                  <option value="nopass">Không có mật khẩu</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="wifi_hidden"
                checked={wifi.hidden}
                onChange={(e) => setWifi({ ...wifi, hidden: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <label htmlFor="wifi_hidden" className="text-xs text-slate-600 font-medium">
                Đây là mạng Wi-Fi ẩn (Hidden SSID)
              </label>
            </div>
          </div>
        )}

        {/* vCard Form */}
        {activeType === 'vcard' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và Tên</label>
                <input
                  type="text"
                  value={vcard.fullName}
                  onChange={(e) => setVcard({ ...vcard, fullName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Công Ty / Tổ Chức</label>
                <input
                  type="text"
                  value={vcard.organization}
                  onChange={(e) => setVcard({ ...vcard, organization: e.target.value })}
                  placeholder="Ví dụ: Oloka Tech Ltd"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chức Danh</label>
                <input
                  type="text"
                  value={vcard.title}
                  onChange={(e) => setVcard({ ...vcard, title: e.target.value })}
                  placeholder="Giám đốc"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">SĐT Di Động</label>
                <input
                  type="text"
                  value={vcard.mobile}
                  onChange={(e) => setVcard({ ...vcard, mobile: e.target.value })}
                  placeholder="0901234567"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={vcard.email}
                  onChange={(e) => setVcard({ ...vcard, email: e.target.value })}
                  placeholder="an@oloka.vn"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Website</label>
                <input
                  type="text"
                  value={vcard.website}
                  onChange={(e) => setVcard({ ...vcard, website: e.target.value })}
                  placeholder="https://oloka.vn"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Địa Chỉ</label>
                <input
                  type="text"
                  value={vcard.address}
                  onChange={(e) => setVcard({ ...vcard, address: e.target.value })}
                  placeholder="Quận 1, TP.HCM"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Email Form */}
        {activeType === 'email' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Người Nhận</label>
              <input
                type="email"
                value={email.email}
                onChange={(e) => setEmail({ ...email, email: e.target.value })}
                placeholder="contact@oloka.vn"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu Đề Thư</label>
              <input
                type="text"
                value={email.subject}
                onChange={(e) => setEmail({ ...email, subject: e.target.value })}
                placeholder="Liên hệ tư vấn dịch vụ..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nội Dung Thư Soạn Sẵn</label>
              <textarea
                rows={3}
                value={email.body}
                onChange={(e) => setEmail({ ...email, body: e.target.value })}
                placeholder="Nội dung thư..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>
        )}

        {/* Phone Form */}
        {activeType === 'phone' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Số Điện Thoại Gọi Trực Tiếp
            </label>
            <input
              type="tel"
              value={phone.phone}
              onChange={(e) => setPhone({ phone: e.target.value })}
              placeholder="0903456789"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            <p className="mt-2 text-xs text-slate-500">
              Khi quét mã này, điện thoại sẽ tự động mở bàn phím số và sẵn sàng quay số gọi.
            </p>
          </div>
        )}

        {/* SMS Form */}
        {activeType === 'sms' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Số Điện Thoại Nhận SMS</label>
              <input
                type="tel"
                value={sms.phone}
                onChange={(e) => setSms({ ...sms, phone: e.target.value })}
                placeholder="0903456789"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nội Dung Tin Nhắn</label>
              <textarea
                rows={3}
                value={sms.message}
                onChange={(e) => setSms({ ...sms, message: e.target.value })}
                placeholder="Soạn sẵn nội dung tin nhắn SMS..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>
        )}

        {/* WhatsApp Form */}
        {activeType === 'whatsapp' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số Điện Thoại WhatsApp (Kèm mã quốc gia, ví dụ 84 cho Việt Nam)
              </label>
              <input
                type="tel"
                value={whatsapp.phone}
                onChange={(e) => setWhatsapp({ ...whatsapp, phone: e.target.value })}
                placeholder="84903456789"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nội Dung Lời Nhắn</label>
              <textarea
                rows={3}
                value={whatsapp.message}
                onChange={(e) => setWhatsapp({ ...whatsapp, message: e.target.value })}
                placeholder="Xin chào, tôi cần tư vấn thêm..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>
        )}

        {/* Zoom Form */}
        {activeType === 'zoom' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting ID</label>
              <input
                type="text"
                value={zoom.meetingId}
                onChange={(e) => setZoom({ ...zoom, meetingId: e.target.value })}
                placeholder="829 1234 5678"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mật Khẩu Cuộc Họp</label>
              <input
                type="text"
                value={zoom.password}
                onChange={(e) => setZoom({ ...zoom, password: e.target.value })}
                placeholder="Mật khẩu..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>
        )}

        {/* Event Form */}
        {activeType === 'event' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Sự Kiện</label>
              <input
                type="text"
                value={event.title}
                onChange={(e) => setEvent({ ...event, title: e.target.value })}
                placeholder="Hội nghị khách hàng 2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Thời Gian Bắt Đầu</label>
                <input
                  type="datetime-local"
                  value={event.startTime}
                  onChange={(e) => setEvent({ ...event, startTime: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Thời Gian Kết Thúc</label>
                <input
                  type="datetime-local"
                  value={event.endTime}
                  onChange={(e) => setEvent({ ...event, endTime: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Địa Điểm Tổ Chức</label>
              <input
                type="text"
                value={event.location}
                onChange={(e) => setEvent({ ...event, location: e.target.value })}
                placeholder="Landmark 81, TP.HCM"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>
        )}

        {/* PayPal Form */}
        {activeType === 'paypal' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tài Khoản PayPal (Email)</label>
                <input
                  type="email"
                  value={paypal.email}
                  onChange={(e) => setPaypal({ ...paypal, email: e.target.value })}
                  placeholder="paypal@oloka.vn"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Loại Thanh Toán</label>
                <select
                  value={paypal.type}
                  onChange={(e) => setPaypal({ ...paypal, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="buy">Mua Ngay (Buy Now)</option>
                  <option value="donate">Ủng Hộ / Quyên Góp (Donations)</option>
                  <option value="cart">Thêm Vào Giỏ Hàng (Cart)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Hàng Hóa</label>
                <input
                  type="text"
                  value={paypal.itemName}
                  onChange={(e) => setPaypal({ ...paypal, itemName: e.target.value })}
                  placeholder="Gói VIP"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Giá Tiền</label>
                <input
                  type="number"
                  value={paypal.price}
                  onChange={(e) => setPaypal({ ...paypal, price: e.target.value })}
                  placeholder="29.99"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Loại Tiền Tệ</label>
                <select
                  value={paypal.currency}
                  onChange={(e) => setPaypal({ ...paypal, currency: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="SGD">SGD (S$)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Location Form */}
        {activeType === 'location' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Địa Điểm</label>
              <input
                type="text"
                value={location.name}
                onChange={(e) => setLocation({ ...location, name: e.target.value })}
                placeholder="Phố đi bộ Nguyễn Huệ, TP.HCM"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vĩ Độ (Latitude)</label>
                <input
                  type="text"
                  value={location.latitude}
                  onChange={(e) => setLocation({ ...location, latitude: e.target.value })}
                  placeholder="10.7769"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kinh Độ (Longitude)</label>
                <input
                  type="text"
                  value={location.longitude}
                  onChange={(e) => setLocation({ ...location, longitude: e.target.value })}
                  placeholder="106.7009"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Social Form */}
        {activeType === 'social' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nền Tảng Mạng Xã Hội</label>
              <select
                value={social.platform}
                onChange={(e) => setSocial({ ...social, platform: e.target.value as any })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="facebook">Facebook (facebook.com/username)</option>
                <option value="zalo">Zalo (zalo.me/sdt)</option>
                <option value="tiktok">TikTok (tiktok.com/@username)</option>
                <option value="youtube">YouTube (youtube.com/@channel)</option>
                <option value="instagram">Instagram (instagram.com/username)</option>
                <option value="telegram">Telegram (t.me/username)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên Người Dùng (Username) hoặc Số Điện Thoại
              </label>
              <input
                type="text"
                value={social.usernameOrUrl}
                onChange={(e) => setSocial({ ...social, usernameOrUrl: e.target.value })}
                placeholder="Ví dụ: olokavn hoặc 0903456789"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
