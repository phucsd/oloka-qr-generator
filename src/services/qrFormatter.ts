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
import { generateVietQRPayload } from './vietqrService';

export function formatQRContent(
  type: QRType,
  data: any
): string {
  switch (type) {
    case 'text':
      return typeof data === 'string' ? data : (data?.text || '');

    case 'url': {
      const url = typeof data === 'string' ? data.trim() : (data?.url || '').trim();
      if (!url) return '';
      if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)) {
        return url;
      }
      return `https://${url}`;
    }

    case 'vietqr':
      return generateVietQRPayload(data as VietQRData);

    case 'wifi': {
      const wifi = data as WiFiData;
      if (!wifi?.ssid) return '';
      const enc = wifi.encryption || 'WPA';
      const pass = wifi.password || '';
      const hidden = wifi.hidden ? 'true' : 'false';
      return `WIFI:T:${enc};S:${wifi.ssid};P:${pass};H:${hidden};;`;
    }

    case 'vcard': {
      const v = data as VCardData;
      if (!v?.fullName && !v?.phone) return '';
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${v.fullName || ''}`,
        `N:;${v.fullName || ''};;;`,
        v.organization ? `ORG:${v.organization}` : '',
        v.title ? `TITLE:${v.title}` : '',
        v.mobile ? `TEL;TYPE=CELL:${v.mobile}` : '',
        v.phone ? `TEL;TYPE=WORK:${v.phone}` : '',
        v.email ? `EMAIL:${v.email}` : '',
        v.website ? `URL:${v.website}` : '',
        v.address ? `ADR:;;${v.address};;;;` : '',
        'END:VCARD',
      ]
        .filter(Boolean)
        .join('\n');
    }

    case 'email': {
      const em = data as EmailData;
      if (!em?.email) return '';
      const params = new URLSearchParams();
      if (em.subject) params.set('subject', em.subject);
      if (em.body) params.set('body', em.body);
      const query = params.toString();
      return `mailto:${em.email}${query ? `?${query}` : ''}`;
    }

    case 'phone': {
      const ph = data as PhoneData;
      if (!ph?.phone) return '';
      return `tel:${ph.phone.trim()}`;
    }

    case 'sms': {
      const sms = data as SMSData;
      if (!sms?.phone) return '';
      return `smsto:${sms.phone.trim()}:${sms.message || ''}`;
    }

    case 'whatsapp': {
      const wa = data as WhatsAppData;
      if (!wa?.phone) return '';
      const cleanPhone = wa.phone.replace(/[^0-9]/g, '');
      const textParam = wa.message ? `?text=${encodeURIComponent(wa.message)}` : '';
      return `https://wa.me/${cleanPhone}${textParam}`;
    }

    case 'zoom': {
      const zm = data as ZoomData;
      if (!zm?.meetingId) return '';
      const pwdParam = zm.password ? `?pwd=${encodeURIComponent(zm.password)}` : '';
      return `https://zoom.us/j/${zm.meetingId.replace(/\s+/g, '')}${pwdParam}`;
    }

    case 'event': {
      const ev = data as EventData;
      if (!ev?.title) return '';
      const formatTime = (iso: string) => {
        if (!iso) return '';
        return iso.replace(/[-:]/g, '').replace('.000', '').substring(0, 15) + 'Z';
      };
      return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `SUMMARY:${ev.title}`,
        ev.location ? `LOCATION:${ev.location}` : '',
        ev.startTime ? `DTSTART:${formatTime(ev.startTime)}` : '',
        ev.endTime ? `DTEND:${formatTime(ev.endTime)}` : '',
        ev.description ? `DESCRIPTION:${ev.description}` : '',
        'END:VEVENT',
        'END:VCALENDAR',
      ]
        .filter(Boolean)
        .join('\n');
    }

    case 'paypal': {
      const pp = data as PayPalData;
      if (!pp?.email) return '';
      const baseUrl = 'https://www.paypal.com/cgi-bin/webscr';
      const cmd = pp.type === 'donate' ? '_donations' : pp.type === 'cart' ? '_cart' : '_xclick';
      const params = new URLSearchParams({
        cmd,
        business: pp.email,
        item_name: pp.itemName || '',
        item_number: pp.itemId || '',
        amount: pp.price || '',
        currency_code: pp.currency || 'USD',
      });
      return `${baseUrl}?${params.toString()}`;
    }

    case 'location': {
      const loc = data as LocationData;
      if (!loc?.latitude || !loc?.longitude) return '';
      const label = loc.name ? `(${encodeURIComponent(loc.name)})` : '';
      return `https://maps.google.com/local?q=${loc.latitude},${loc.longitude}${label}`;
    }

    case 'social': {
      const s = data as SocialData;
      if (!s?.usernameOrUrl) return '';
      const input = s.usernameOrUrl.trim();
      if (input.startsWith('http://') || input.startsWith('https://')) {
        return input;
      }
      switch (s.platform) {
        case 'facebook':
          return `https://facebook.com/${input}`;
        case 'zalo':
          return `https://zalo.me/${input.replace(/[^0-9]/g, '')}`;
        case 'tiktok':
          return `https://tiktok.com/@${input.replace(/^@/, '')}`;
        case 'youtube':
          return input.startsWith('@') ? `https://youtube.com/${input}` : `https://youtube.com/@${input}`;
        case 'instagram':
          return `https://instagram.com/${input.replace(/^@/, '')}`;
        case 'telegram':
          return `https://t.me/${input.replace(/^@/, '')}`;
        default:
          return input;
      }
    }

    default:
      return typeof data === 'string' ? data : JSON.stringify(data);
  }
}
