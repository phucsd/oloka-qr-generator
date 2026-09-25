import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  FileCheck,
  Store,
  Calendar,
  Utensils,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'Tạo mã QR hàng loạt (Bulk QR Code) là gì và hoạt động ra sao?',
    answer:
      'Tạo mã QR hàng loạt là quá trình sinh ra cùng lúc hàng chục, hàng trăm hoặc hàng nghìn mã QR khác nhau từ một danh sách dữ liệu (như danh sách đường link, danh bạ, mã sản phẩm trong file Excel .xlsx hoặc CSV). Thay vì mất hàng giờ tạo thủ công từng mã một, bạn chỉ cần tải danh sách lên Oloka QR và hệ thống sẽ tự động tạo trọn bộ mã QR chỉ trong vài giây.',
  },
  {
    question: 'Công cụ Oloka QR có giới hạn số lượng mã hay tính phí không?',
    answer:
      'Hoàn toàn KHÔNG GIỚI HẠN và 100% MIỄN PHÍ vĩnh viễn. Bạn có thể tạo từ vài mã đến hàng nghìn mã QR mỗi lần, không bị giới hạn số lần tải, không gắn watermark quảng cáo và không cần đăng ký tài khoản.',
  },
  {
    question: 'Dữ liệu file Excel và khách hàng của tôi có được bảo mật không?',
    answer:
      'Tuyệt đối an toàn và riêng tư. Khác với các hệ thống yêu cầu gửi file dữ liệu của bạn lên máy chủ lưu trữ từ xa, Oloka QR hoạt động 100% tại Client-Side (xử lý trực tiếp ngay trên trình duyệt thiết bị của bạn bằng JavaScript, HTML5 Canvas và SVG). Không có bất kỳ dòng dữ liệu nào bị tải lên máy chủ trung gian hay lưu vết ra bên ngoài.',
  },
  {
    question: 'Làm thế nào để xuất mã QR thành file tem nhãn in ấn khổ A4?',
    answer:
      'Sau khi tải file Excel hoặc nhập danh sách, bạn chỉ cần bấm nút "In Tem Nhãn PDF". Oloka QR sẽ tự động chia lưới các mã QR đều đặn trên các trang giấy khổ A4 (lựa chọn 18 tem hoặc 32 tem mỗi trang) kèm viền kẻ cắt sẵn và tên sản phẩm bên dưới để bạn cho vào máy in Decal/A4 in ngay lập tức.',
  },
  {
    question: 'Nên chọn định dạng file PNG hay SVG khi in ấn mã QR?',
    answer:
      'Nếu bạn in tem nhãn thông thường, file ảnh PNG độ phân giải cao 1000px - 2000px sẽ đảm bảo mật độ điểm ảnh sắc nét chuẩn in ấn khi in ở kích thước tem 3-5 cm. Nếu bạn cần in ấn khổ lớn (như biển hiệu, pano, áp phích hội chợ), bạn nên chọn định dạng Vector SVG để phóng to thu nhỏ tùy ý mà không bao giờ bị vỡ hạt hay mờ nét.',
  },
  {
    question: 'Mã QR chèn Logo thương hiệu ở giữa thì camera điện thoại có quét được không?',
    answer:
      'Chắc chắn quét cực kỳ nhạy! Oloka QR tự động kích hoạt mức độ sửa lỗi cao nhất (High - 30%), nghĩa là ngay cả khi đến 30% diện tích mã QR bị che bởi logo, thuật toán Reed-Solomon vẫn phục hồi dữ liệu chính xác. Ngoài ra, tính năng tạo khoảng trống đệm phía sau logo giúp tách biệt các chấm QR và logo thương hiệu để camera điện thoại dễ dàng nhận diện.',
  },
  {
    question: 'Mã QR tạo ra có thời hạn sử dụng (hết hạn) hay không?',
    answer:
      'Tất cả mã QR được tạo bởi Oloka QR là mã QR Tĩnh (Static QR Code) chuẩn quốc tế ISO/IEC 18004. Dữ liệu được mã hóa trực tiếp vào các ô vuông đen trắng nên mã QR có giá trị vĩnh viễn, không bao giờ hết hạn và không phụ thuộc vào bất kỳ máy chủ nào.',
  },
  {
    question: 'Tôi có thể tạo mã QR thanh toán ngân hàng (VietQR) theo danh sách không?',
    answer:
      'Có! Oloka QR tích hợp chuẩn VietQR Napas247 của tất cả các ngân hàng Việt Nam (Vietcombank, MB, Techcombank, VPBank, ACB, BIDV...). Khách hàng quét mã này bằng bất kỳ app ngân hàng nào cũng sẽ tự động điền sẵn STK, tên người nhận và số tiền chính xác 100%.',
  },
  {
    question: 'File Excel tải lên cần định dạng cột như thế nào?',
    answer:
      'Rất đơn giản, bạn chỉ cần có ít nhất một cột chứa dữ liệu cần tạo mã QR (như link web, số điện thoại, mã đơn). Bạn có thể bấm nút "Tải File Excel Mẫu (.xlsx)" trên giao diện để có sẵn bảng chuẩn và chỉ việc điền thông tin vào.',
  },
  {
    question: 'Làm sao để đảm bảo mã QR in ra giấy luôn quét được 100%?',
    answer:
      'Bạn nên giữ kích thước in tối thiểu từ 2x2 cm trở lên, đảm bảo độ tương phản cao (màu mã QR tối hơn màu nền đáng kể), giữ khoảng trắng an toàn (quiet zone) xung quanh viền lề và không in trên bề mặt bóng loáng dễ bị phản xạ ánh sáng.',
  },
];

export const SEOArticle: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <article className="mt-16 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 lg:p-12 space-y-12 text-slate-700 leading-relaxed">
      {/* Intro Header */}
      <section className="space-y-4 border-b border-slate-100 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cẩm Nang Hướng Dẫn & Tối Ưu QR Code 2026</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
          Giải Pháp Tạo Mã QR Hàng Loạt Miễn Phí Chuyên Nghiệp Nhất
        </h2>
        <p className="text-base text-slate-600 leading-relaxed font-normal">
          Trong kỷ nguyên số hóa và thương mại đa kênh hiện nay, <strong>mã QR (Quick Response Code)</strong> đã trở thành cầu nối không thể thiếu giữa thế giới vật lý và thế giới trực tuyến. Tuy nhiên, việc tạo từng mã QR thủ công khi bạn có hàng trăm sản phẩm, hàng nghìn khách mời hội nghị hay hàng loạt tem nhãn kho hàng là một công việc tiêu tốn rất nhiều thời gian và dễ xảy ra nhầm lẫn. <strong>Oloka QR Generator</strong> ra đời nhằm cung cấp một công cụ tạo mã QR code hàng loạt mạnh mẽ, bảo mật tuyệt đối và hoàn toàn miễn phí.
        </p>
      </section>

      {/* 3 Steps Guide (HowTo) */}
      <section id="howto-create" className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-indigo-600" />
          <span>Hướng Dẫn 3 Bước Tạo Hàng Trăm Mã QR Từ File Excel Trong 1 Phút</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-semibold flex items-center justify-center text-lg shadow-2xs">
              1
            </div>
            <h3 className="text-base font-semibold text-slate-900">Chuẩn Bị Dữ Liệu Excel / CSV</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Tải file Excel mẫu chuẩn (.xlsx) từ công cụ, điền danh sách đường dẫn, mã SKU hoặc nội dung cần tạo. Bạn cũng có thể chọn cột đặt tên file tải về và cột nhãn in tem.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-semibold flex items-center justify-center text-lg shadow-2xs">
              2
            </div>
            <h3 className="text-base font-semibold text-slate-900">Tùy Biến Thiết Kế Thương Hiệu</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Chọn màu sắc đồng bộ nhận diện (đơn sắc hoặc gradient), đổi kiểu dáng hạt tròn/vuông, tải logo doanh nghiệp có chế độ xóa nền tự động và chọn khung viền "QUÉT TÔI" bắt mắt.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-semibold flex items-center justify-center text-lg shadow-2xs">
              3
            </div>
            <h3 className="text-base font-semibold text-slate-900">Tải File ZIP Hoặc In Tem A4</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Bấm nút "Tạo & Tải Về File ZIP" để nhận trọn bộ ảnh PNG/WebP được đặt tên tự động chuẩn xác, hoặc chọn "In Tem Nhãn PDF" để in ngay trên các tờ giấy decal khổ A4.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table: PNG vs SVG vs WebP vs PDF */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          So Sánh Các Định Dạng Xuất File Mã QR: Nên Chọn Loại Nào?
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Định Dạng</th>
                <th className="py-3 px-4">Độ Phân Giải</th>
                <th className="py-3 px-4">Ưu Điểm Vượt Trội</th>
                <th className="py-3 px-4">Mục Đích Khuyên Dùng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-indigo-600">PNG (Độ Phân Giải Cao)</td>
                <td className="py-3 px-4">1000px - 2000px</td>
                <td className="py-3 px-4">Hỗ trợ nền trong suốt, độ tương thích cao nhất trên mọi thiết bị</td>
                <td className="py-3 px-4 font-medium">Tem nhãn sản phẩm, bao bì đóng gói, in ấn tài liệu</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-indigo-600">SVG (Vector)</td>
                <td className="py-3 px-4">Vô hạn (Vector)</td>
                <td className="py-3 px-4">Không bao giờ vỡ hạt dù phóng to gấp 100 lần, dung lượng siêu nhẹ</td>
                <td className="py-3 px-4 font-medium">Biển hiệu quảng cáo, pano áp phích, thiết kế đồ họa Illustrator/Corel</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-indigo-600">WebP</td>
                <td className="py-3 px-4">500px - 1000px</td>
                <td className="py-3 px-4">Dung lượng nhẹ hơn PNG tới 40%, tốc độ tải trang web cực nhanh</td>
                <td className="py-3 px-4 font-medium">Đưa lên website, ứng dụng di động, gửi qua email</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-indigo-600">PDF Tem Nhãn A4</td>
                <td className="py-3 px-4">Chuẩn In Ấn A4</td>
                <td className="py-3 px-4">Chia sẵn ô lưới tem (18 hoặc 32 tem/trang), có đường kẻ cắt decal</td>
                <td className="py-3 px-4 font-medium">Bấm lệnh in trực tiếp ra máy in laser/decal dán hộp hàng</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Real-World Use Cases */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Ứng Dụng Thực Tế Của Mã QR Hàng Loạt Trong Doanh Nghiệp
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Bán Lẻ, Kho Hàng & Tem Mã Vạch SKU</h3>
              <p className="text-xs text-slate-600 mt-1">
                Tạo mã QR cho hàng nghìn sản phẩm cùng lúc. Khách hàng quét mã xem nguồn gốc xuất xứ, thông số kỹ thuật, hướng dẫn sử dụng và giá bán trực tiếp.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Sự Kiện, Hội Nghị & Vé Điện Tử E-Ticket</h3>
              <p className="text-xs text-slate-600 mt-1">
                Tạo mã QR định danh riêng cho từng khách mời tham dự. Nhân viên lễ tân chỉ cần dùng điện thoại quét mã QR tại cửa ra vào để check-in tức thì trong 1 giây.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">F&B, Nhà Hàng & Menu Gọi Món Theo Bàn</h3>
              <p className="text-xs text-slate-600 mt-1">
                Xuất hàng loạt mã QR tương ứng từ Bàn 01 đến Bàn 100. Khách ngồi vào bàn quét mã là hiển thị thực đơn điện tử và đặt món tự động không cần gọi phục vụ.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Giáo Dục, Đào Tạo & Tài Liệu Bài Giảng</h3>
              <p className="text-xs text-slate-600 mt-1">
                Giảng viên tạo mã QR cho từng chương học, bài tập thực hành hoặc video thí nghiệm, giúp học sinh - sinh viên truy cập tài liệu nhanh chóng bằng camera điện thoại.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10 FAQs Accordion for Rich Snippet Dominance */}
      <section id="faq" className="space-y-6 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Câu Hỏi Thường Gặp Về Tạo Mã QR Hàng Loạt (FAQ)
          </h2>
        </div>

        <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="bg-white">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900 pr-4">
                    {String(index + 1).padStart(2, '0')}. {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-indigo-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
};
