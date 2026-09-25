import React, { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import {
  BankInfo,
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
} from '../../types';
import { STATIC_BANKS, fetchLiveBankList } from '../../services/vietqrService';

interface QRInputFormProps {
  selectedType: QRType;
  onContentChange: (type: QRType, data: any) => void;
}

export const QRInputForm: React.FC<QRInputFormProps> = ({ selectedType, onContentChange }) => {
  const [bankList, setBankList] = useState<BankInfo[]>(STATIC_BANKS);

  // Load 55+ live banks on mount
  useEffect(() => {
    fetchLiveBankList().then((banks) => {
      if (banks && banks.length > 0) {
        setBankList(banks);
      }
    });
  }, []);

  // Form states
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
    ssid: 'Oloka_Guest_WiFi',
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
    meetingId: 'https://zoom.us/j/82912345678',
    password: '',
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

  // Emit current data to parent whenever inputs change
  useEffect(() => {
    switch (selectedType) {
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
    selectedType,
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

  return (
    <div className="space-y-3">
      {/* 1. Website URL */}
      {selectedType === 'url' && (
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Đường Dẫn Website (URL)
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
      )}

      {/* 2. Text */}
      {selectedType === 'text' && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-slate-700">
              Nội Dung Văn Bản
            </label>
            <button
              type="button"
              onClick={() => setText('')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Xoá
            </button>
          </div>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập bất kỳ đoạn văn bản, ghi chú nào..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none"
          />
        </div>
      )}

      {/* 3. VietQR */}
      {selectedType === 'vietqr' && (
        <div className="space-y-3">
          <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              Mã chuyển khoản nhanh Napas247 (QRIBFTTA), quét được bằng 100% ứng dụng ngân hàng.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Ngân Hàng Thụ Hưởng ({bankList.length})
              </label>
              <select
                value={vietqr.bankBin}
                onChange={(e) => setVietqr({ ...vietqr, bankBin: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              >
                {bankList.map((b) => (
                  <option key={b.bin} value={b.bin}>
                    {b.shortName} - {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Số Tài Khoản <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={vietqr.accountNumber}
                onChange={(e) => setVietqr({ ...vietqr, accountNumber: e.target.value })}
                placeholder="1012345678"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tên Chủ Tài Khoản (Không dấu)
              </label>
              <input
                type="text"
                value={vietqr.accountName}
                onChange={(e) => setVietqr({ ...vietqr, accountName: e.target.value.toUpperCase() })}
                placeholder="NGUYEN VAN A"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Số Tiền (VNĐ - Tùy chọn)
              </label>
              <input
                type="number"
                value={vietqr.amount}
                onChange={(e) => setVietqr({ ...vietqr, amount: e.target.value })}
                placeholder="500000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Nội Dung Chuyển Khoản (Tùy chọn)
            </label>
            <input
              type="text"
              value={vietqr.description}
              onChange={(e) => setVietqr({ ...vietqr, description: e.target.value })}
              placeholder="Thanh toan don hang SP01"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>
        </div>
      )}

      {/* 4. Wi-Fi */}
      {selectedType === 'wifi' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Tên Mạng Wi-Fi (SSID)
            </label>
            <input
              type="text"
              value={wifi.ssid}
              onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
              placeholder="Ví dụ: Oloka_Guest"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Mật Khẩu Wi-Fi
              </label>
              <input
                type="text"
                value={wifi.password}
                onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                placeholder="Nhập mật khẩu..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Chuẩn Bảo Mật
              </label>
              <select
                value={wifi.encryption}
                onChange={(e) => setWifi({ ...wifi, encryption: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP (Mạng cũ)</option>
                <option value="nopass">Không có mật khẩu</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={wifi.hidden}
              onChange={(e) => setWifi({ ...wifi, hidden: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-xs text-slate-600 font-medium">
              Đây là mạng Wi-Fi ẩn (Hidden SSID)
            </span>
          </label>
        </div>
      )}

      {/* 5. vCard */}
      {selectedType === 'vcard' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Họ và Tên</label>
              <input
                type="text"
                value={vcard.fullName}
                onChange={(e) => setVcard({ ...vcard, fullName: e.target.value })}
                placeholder="Nguyễn Văn An"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Công Ty / Tổ Chức</label>
              <input
                type="text"
                value={vcard.organization}
                onChange={(e) => setVcard({ ...vcard, organization: e.target.value })}
                placeholder="Oloka Studio"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Chức Danh</label>
              <input
                type="text"
                value={vcard.title}
                onChange={(e) => setVcard({ ...vcard, title: e.target.value })}
                placeholder="Giám đốc"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">SĐT Di Động</label>
              <input
                type="tel"
                value={vcard.mobile}
                onChange={(e) => setVcard({ ...vcard, mobile: e.target.value })}
                placeholder="0901234567"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
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
              <label className="block text-xs font-medium text-slate-700 mb-1">Website</label>
              <input
                type="text"
                value={vcard.website}
                onChange={(e) => setVcard({ ...vcard, website: e.target.value })}
                placeholder="https://oloka.vn"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Địa Chỉ</label>
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

      {/* 6. Email */}
      {selectedType === 'email' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email Người Nhận</label>
            <input
              type="email"
              value={email.email}
              onChange={(e) => setEmail({ ...email, email: e.target.value })}
              placeholder="contact@oloka.vn"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Tiêu Đề Thư</label>
            <input
              type="text"
              value={email.subject}
              onChange={(e) => setEmail({ ...email, subject: e.target.value })}
              placeholder="Liên hệ tư vấn..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Nội Dung Thư</label>
            <textarea
              rows={3}
              value={email.body}
              onChange={(e) => setEmail({ ...email, body: e.target.value })}
              placeholder="Nội dung thư soạn sẵn..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>
        </div>
      )}

      {/* 7. Phone */}
      {selectedType === 'phone' && (
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Số Điện Thoại Gọi Trực Tiếp
          </label>
          <input
            type="tel"
            value={phone.phone}
            onChange={(e) => setPhone({ phone: e.target.value })}
            placeholder="0903456789"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
          />
        </div>
      )}

      {/* 8. SMS */}
      {selectedType === 'sms' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Số Điện Thoại</label>
            <input
              type="tel"
              value={sms.phone}
              onChange={(e) => setSms({ ...sms, phone: e.target.value })}
              placeholder="0903456789"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Nội Dung Tin Nhắn</label>
            <textarea
              rows={2}
              value={sms.message}
              onChange={(e) => setSms({ ...sms, message: e.target.value })}
              placeholder="Soạn sẵn nội dung..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>
        </div>
      )}

      {/* 9. WhatsApp */}
      {selectedType === 'whatsapp' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Số Điện Thoại (Kèm mã quốc gia, ví dụ 84)
            </label>
            <input
              type="tel"
              value={whatsapp.phone}
              onChange={(e) => setWhatsapp({ ...whatsapp, phone: e.target.value })}
              placeholder="84903456789"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Nội Dung Lời Nhắn</label>
            <textarea
              rows={2}
              value={whatsapp.message}
              onChange={(e) => setWhatsapp({ ...whatsapp, message: e.target.value })}
              placeholder="Nội dung gửi qua WhatsApp..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>
        </div>
      )}

      {/* 10. Zoom */}
      {selectedType === 'zoom' && (
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Đường Dẫn Tham Gia Họp Zoom (Join URL) hoặc Meeting ID
          </label>
          <input
            type="text"
            value={zoom.meetingId}
            onChange={(e) => setZoom({ ...zoom, meetingId: e.target.value })}
            placeholder="https://zoom.us/j/82912345678?pwd=..."
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
          />
        </div>
      )}

      {/* 11. Event */}
      {selectedType === 'event' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Tên Sự Kiện</label>
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
              <label className="block text-xs font-medium text-slate-700 mb-1">Bắt Đầu (Giờ địa phương)</label>
              <input
                type="datetime-local"
                value={event.startTime}
                onChange={(e) => setEvent({ ...event, startTime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Kết Thúc (Giờ địa phương)</label>
              <input
                type="datetime-local"
                value={event.endTime}
                onChange={(e) => setEvent({ ...event, endTime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Địa Điểm Tổ Chức</label>
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

      {/* 12. PayPal */}
      {selectedType === 'paypal' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email PayPal</label>
              <input
                type="email"
                value={paypal.email}
                onChange={(e) => setPaypal({ ...paypal, email: e.target.value })}
                placeholder="paypal@oloka.vn"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Loại Thanh Toán</label>
              <select
                value={paypal.type}
                onChange={(e) => setPaypal({ ...paypal, type: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              >
                <option value="buy">Mua Ngay (Buy Now)</option>
                <option value="donate">Ủng Hộ (Donations)</option>
                <option value="cart">Giỏ Hàng (Cart)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tên Hàng Hóa</label>
              <input
                type="text"
                value={paypal.itemName}
                onChange={(e) => setPaypal({ ...paypal, itemName: e.target.value })}
                placeholder="Gói VIP"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Giá Tiền</label>
              <input
                type="number"
                value={paypal.price}
                onChange={(e) => setPaypal({ ...paypal, price: e.target.value })}
                placeholder="29.99"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* 13. Location */}
      {selectedType === 'location' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Tên Địa Điểm</label>
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
              <label className="block text-xs font-medium text-slate-700 mb-1">Vĩ Độ (Latitude)</label>
              <input
                type="text"
                value={location.latitude}
                onChange={(e) => setLocation({ ...location, latitude: e.target.value })}
                placeholder="10.7769"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Kinh Độ (Longitude)</label>
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

      {/* 14. Social */}
      {selectedType === 'social' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Nền Tảng Mạng Xã Hội</label>
            <select
              value={social.platform}
              onChange={(e) => setSocial({ ...social, platform: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
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
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Username hoặc Số Điện Thoại
            </label>
            <input
              type="text"
              value={social.usernameOrUrl}
              onChange={(e) => setSocial({ ...social, usernameOrUrl: e.target.value })}
              placeholder="Ví dụ: olokavn hoặc 0903456789"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};
