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

function escapeWifi(str: string): string {
  return (str || '').replace(/([\\;,":])/g, '\\$1');
}

function escapeVCard(str: string): string {
  return (str || '')
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

/**
 * Converts datetime string to RFC 5545 UTC format: YYYYMMDDTHHMMSSZ
 */
function formatEventUtcTime(localIso: string): string {
  if (!localIso) return '';
  const d = new Date(localIso);
  if (isNaN(d.getTime())) return '';
  // Convert to true UTC representation
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  const seconds = String(d.getUTCSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

export function formatQRContent(
  type: QRType,
  data: any
): string {
  switch (type) {
    case 'text':
      return typeof data === 'string' ? data.trim() : (data?.text || '').trim();

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
      const escapedSsid = escapeWifi(wifi.ssid.trim());
      const escapedPass = escapeWifi(wifi.password || '');
      const hidden = wifi.hidden ? 'true' : 'false';
      return `WIFI:T:${enc};S:${escapedSsid};P:${escapedPass};H:${hidden};;`;
    }

    case 'vcard': {
      const v = data as VCardData;
      if (!v?.fullName && !v?.phone && !v?.mobile) return '';

      const nameParts = (v.fullName || '').trim().split(/\s+/);
      const lastName = nameParts.length > 1 ? nameParts[0] : '';
      const firstName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0] || '';

      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${escapeVCard(v.fullName || '')}`,
        `N:${escapeVCard(lastName)};${escapeVCard(firstName)};;;`,
        v.organization ? `ORG:${escapeVCard(v.organization)}` : '',
        v.title ? `TITLE:${escapeVCard(v.title)}` : '',
        v.mobile ? `TEL;TYPE=CELL:${v.mobile.replace(/[^0-9+]/g, '')}` : '',
        v.phone ? `TEL;TYPE=WORK:${v.phone.replace(/[^0-9+]/g, '')}` : '',
        v.email ? `EMAIL:${v.email.trim()}` : '',
        v.website ? `URL:${v.website.trim()}` : '',
        v.address ? `ADR:;;${escapeVCard(v.address)};;;;` : '',
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
      return `mailto:${em.email.trim()}${query ? `?${query}` : ''}`;
    }

    case 'phone': {
      const ph = data as PhoneData;
      if (!ph?.phone) return '';
      return `tel:${ph.phone.trim().replace(/\s+/g, '')}`;
    }

    case 'sms': {
      const sms = data as SMSData;
      if (!sms?.phone) return '';
      return `smsto:${sms.phone.trim().replace(/\s+/g, '')}:${sms.message || ''}`;
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
      const input = zm.meetingId.trim();
      // If user pasted a full Zoom join URL
      if (input.startsWith('http://') || input.startsWith('https://')) {
        return input;
      }
      const cleanId = input.replace(/\D/g, '');
      return `https://zoom.us/j/${cleanId}`;
    }

    case 'event': {
      const ev = data as EventData;
      if (!ev?.title) return '';
      const startUtc = formatEventUtcTime(ev.startTime);
      const endUtc = formatEventUtcTime(ev.endTime);

      return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Oloka QR Generator//VN',
        'BEGIN:VEVENT',
        `SUMMARY:${escapeVCard(ev.title)}`,
        ev.location ? `LOCATION:${escapeVCard(ev.location)}` : '',
        startUtc ? `DTSTART:${startUtc}` : '',
        endUtc ? `DTEND:${endUtc}` : '',
        ev.description ? `DESCRIPTION:${escapeVCard(ev.description)}` : '',
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
        business: pp.email.trim(),
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
      return `https://maps.google.com/local?q=${loc.latitude.trim()},${loc.longitude.trim()}${label}`;
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
      return typeof data === 'string' ? data.trim() : JSON.stringify(data);
  }
}
