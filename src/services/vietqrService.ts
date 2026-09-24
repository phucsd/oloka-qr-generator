import { BankInfo, VietQRData } from '../types';

export const STATIC_BANKS: BankInfo[] = [
  { bin: '970436', shortName: 'Vietcombank', name: 'Ngân hàng TMCP Ngoại Thương Việt Nam (VCB)' },
  { bin: '970422', shortName: 'MBBank', name: 'Ngân hàng TMCP Quân Đội (MB)' },
  { bin: '970407', shortName: 'Techcombank', name: 'Ngân hàng TMCP Kỹ Thương Việt Nam (TCB)' },
  { bin: '970415', shortName: 'VietinBank', name: 'Ngân hàng TMCP Công Thương Việt Nam (CTG)' },
  { bin: '970418', shortName: 'BIDV', name: 'Ngân hàng TMCP Đầu Tư và Phát Triển Việt Nam' },
  { bin: '970432', shortName: 'VPBank', name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng' },
  { bin: '970416', shortName: 'ACB', name: 'Ngân hàng TMCP Á Châu' },
  { bin: '970405', shortName: 'Agribank', name: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn VN' },
  { bin: '970423', shortName: 'TPBank', name: 'Ngân hàng TMCP Tiên Phong' },
  { bin: '970403', shortName: 'Sacombank', name: 'Ngân hàng TMCP Sài Gòn Thương Tín' },
  { bin: '970441', shortName: 'VIB', name: 'Ngân hàng TMCP Quốc Tế Việt Nam' },
  { bin: '970437', shortName: 'HDBank', name: 'Ngân hàng TMCP Phát Triển TP.HCM' },
  { bin: '970448', shortName: 'OCB', name: 'Ngân hàng TMCP Phương Đông' },
  { bin: '970426', shortName: 'MSB', name: 'Ngân hàng TMCP Hàng Hải' },
  { bin: '970443', shortName: 'SHB', name: 'Ngân hàng TMCP Sài Gòn - Hà Nội' },
  { bin: '970440', shortName: 'SeABank', name: 'Ngân hàng TMCP Đông Nam Á' },
  { bin: '970454', shortName: 'Cake by VPBank', name: 'Ngân hàng số Cake by VPBank' },
  { bin: '963388', shortName: 'Timo', name: 'Ngân hàng số Timo by BanVietBank' },
  { bin: '970425', shortName: 'ABBank', name: 'Ngân hàng TMCP An Bình' },
  { bin: '970409', shortName: 'BacABank', name: 'Ngân hàng TMCP Bắc Á' },
  { bin: '970438', shortName: 'BaoVietBank', name: 'Ngân hàng TMCP Bảo Việt' },
  { bin: '970452', shortName: 'KienLongBank', name: 'Ngân hàng TMCP Kiên Long' },
  { bin: '970428', shortName: 'NamABank', name: 'Ngân hàng TMCP Nam Á' },
  { bin: '970414', shortName: 'OceanBank', name: 'Ngân hàng TM TNHH MTV Đại Dương' },
  { bin: '970430', shortName: 'PGBank', name: 'Ngân hàng TMCP Thịnh Vượng và Phát Triển' },
  { bin: '970412', shortName: 'PVcomBank', name: 'Ngân hàng TMCP Đại Chúng Việt Nam' },
  { bin: '970429', shortName: 'SaigonBank', name: 'Ngân hàng TMCP Sài Gòn Công Thương' },
  { bin: '970449', shortName: 'LPBank', name: 'Ngân hàng TMCP Lộc Phát Việt Nam' },
  { bin: '970427', shortName: 'VietABank', name: 'Ngân hàng TMCP Việt Á' },
  { bin: '970433', shortName: 'VietBank', name: 'Ngân hàng TMCP Việt Nam Thương Tín' },
  { bin: '970457', shortName: 'Woori Bank', name: 'Ngân hàng Woori Bank Việt Nam' },
  { bin: '970424', shortName: 'Shinhan Bank', name: 'Ngân hàng Shinhan Bank Việt Nam' },
  { bin: '970462', shortName: 'Kookmin Bank', name: 'Ngân hàng Kookmin - Chi nhánh TP.HCM' },
  { bin: '970439', shortName: 'PublicBank', name: 'Ngân hàng Public Bank Việt Nam' },
];

export async function fetchLiveBankList(): Promise<BankInfo[]> {
  const CACHE_KEY = 'oloka_vietqr_banks_cache';
  const CACHE_TIME_KEY = 'oloka_vietqr_banks_time';

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    const ONE_DAY = 24 * 60 * 60 * 1000;

    if (cached && cachedTime && Date.now() - Number(cachedTime) < ONE_DAY) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }

    const res = await fetch('https://api.vietqr.io/v2/banks');
    if (!res.ok) throw new Error('Failed to fetch from VietQR API');
    const json = await res.json();
    if (json?.data && Array.isArray(json.data)) {
      const formatted: BankInfo[] = json.data.map((b: any) => ({
        bin: String(b.bin),
        shortName: b.shortName || b.short_name || b.name,
        name: b.name,
      }));
      localStorage.setItem(CACHE_KEY, JSON.stringify(formatted));
      localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
      return formatted;
    }
  } catch (e) {
    console.warn('Using static VietQR bank list fallback:', e);
  }

  return STATIC_BANKS;
}

const encoder = new TextEncoder();

/**
 * Standard EMVCo TLV builder where length is UTF-8 byte length
 */
function tlv(tag: string, value: string): string {
  const byteLength = encoder.encode(value).length;
  const lenStr = byteLength.toString().padStart(2, '0');
  return `${tag}${lenStr}${value}`;
}

/**
 * CRC16 CCITT (0x1021, init 0xFFFF) calculated over UTF-8 byte stream
 */
function crc16Ccitt(payloadStr: string): string {
  const bytes = encoder.encode(payloadStr);
  let crc = 0xffff;
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    crc ^= byte << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function validateVietQRData(data: VietQRData): { valid: boolean; error?: string } {
  if (!data.bankBin || !/^\d{6}$/.test(data.bankBin.trim())) {
    return { valid: false, error: 'Mã BIN ngân hàng phải gồm 6 chữ số' };
  }
  const cleanAcc = data.accountNumber.trim();
  if (!cleanAcc || cleanAcc.length < 6 || cleanAcc.length > 24) {
    return { valid: false, error: 'Số tài khoản phải từ 6 đến 24 ký tự' };
  }
  if (data.amount && parseFloat(data.amount) < 0) {
    return { valid: false, error: 'Số tiền chuyển không được âm' };
  }
  return { valid: true };
}

/**
 * Generates official VietQR transfer-to-account (QRIBFTTA) payload
 */
export function generateVietQRPayload(data: VietQRData): string {
  const validation = validateVietQRData(data);
  if (!validation.valid) return '';

  const cleanAcc = data.accountNumber.trim();

  // 00: Payload Format Indicator = '01'
  let payload = tlv('00', '01');

  // 01: Point of Initiation Method = '12' (Dynamic if amount specified, else '11' Static)
  const amountVal = data.amount ? Math.round(parseFloat(data.amount)) : 0;
  const isDynamic = amountVal > 0;
  payload += tlv('01', isDynamic ? '12' : '11');

  // 38: Merchant Account Information (VietQR Napas247)
  // Sub-tag 00: GUID = A000000727
  const guid = tlv('00', 'A000000727');
  // Sub-tag 01: Beneficiary Organization
  // Sub-sub 00: Bank BIN (6 digits)
  const bankBinTLV = tlv('00', data.bankBin.trim());
  // Sub-sub 01: Account Number
  const accNoTLV = tlv('01', cleanAcc);
  const paymentInfo = tlv('01', bankBinTLV + accNoTLV);

  // Sub-tag 02: Service Code
  // CRITICAL FIX: QRIBFTTA is transfer-to-account (QRIBFTTC is transfer-to-card)
  const serviceCode = tlv('02', 'QRIBFTTA');
  payload += tlv('38', guid + paymentInfo + serviceCode);

  // 53: Transaction Currency = 704 (VND)
  payload += tlv('53', '704');

  // 54: Transaction Amount (integer for VND)
  if (amountVal > 0) {
    payload += tlv('54', String(amountVal));
  }

  // 58: Country Code = VN
  payload += tlv('58', 'VN');

  // 62: Additional Data Field Template (Purpose of transaction)
  if (data.description && data.description.trim()) {
    // Truncate to 50 chars to avoid exceeding standard EMV payload limits
    const safeDesc = data.description.trim().substring(0, 50);
    const purpose = tlv('08', safeDesc);
    payload += tlv('62', purpose);
  }

  // 63: CRC placeholder
  payload += '6304';
  const crc = crc16Ccitt(payload);
  return payload + crc;
}
