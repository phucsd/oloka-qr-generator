import { BankInfo, VietQRData } from '../types';

export const POPULAR_BANKS: BankInfo[] = [
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
  { bin: '963388', shortName: 'Timo', name: 'Ngân hàng số Timo' },
];

function crc16Ccitt(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    crc ^= c << 8;
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

function tlv(tag: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${tag}${len}${value}`;
}

export function generateVietQRPayload(data: VietQRData): string {
  if (!data.bankBin || !data.accountNumber) return '';

  // 00: Payload Format Indicator = '01'
  let payload = tlv('00', '01');

  // 01: Point of Initiation Method = '12' (Dynamic if amount exists, else '11' Static)
  const isDynamic = !!(data.amount && parseFloat(data.amount) > 0);
  payload += tlv('01', isDynamic ? '12' : '11');

  // 38: Merchant Account Information (VietQR Napas247)
  // Sub-tag 00: GUID = A000000727
  const guid = tlv('00', 'A000000727');
  // Sub-tag 01: Beneficiary Organization
  // Sub-sub 00: Bank BIN
  const bankBinTLV = tlv('00', data.bankBin);
  // Sub-sub 01: Account Number
  const accNoTLV = tlv('01', data.accountNumber.trim());
  const paymentInfo = tlv('01', bankBinTLV + accNoTLV);
  // Sub-tag 02: Service Code (QRIBFTTC: Chuyển tiền nhanh đến tài khoản)
  const serviceCode = tlv('02', 'QRIBFTTC');
  payload += tlv('38', guid + paymentInfo + serviceCode);

  // 53: Transaction Currency: 704 (VND)
  payload += tlv('53', '704');

  // 54: Transaction Amount
  if (data.amount && parseFloat(data.amount) > 0) {
    payload += tlv('54', parseFloat(data.amount).toString());
  }

  // 58: Country Code: VN
  payload += tlv('58', 'VN');

  // 62: Additional Data Field Template
  if (data.description && data.description.trim()) {
    // 08: Purpose of Transaction
    const purpose = tlv('08', data.description.trim());
    payload += tlv('62', purpose);
  }

  // 63: CRC
  payload += '6304';
  const crc = crc16Ccitt(payload);
  return payload + crc;
}
