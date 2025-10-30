import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  Search,
  Shield,
  CreditCard,
  Truck,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { useState } from "react";

export const SupportPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqData = [
    {
      category: "Đặt hàng",
      icon: "🍕",
      questions: [
        {
          question: "Làm thế nào để đặt hàng trên BADAFUTA?",
          answer:
            "Bạn có thể đặt hàng bằng cách: 1) Chọn nhà hàng yêu thích, 2) Thêm món ăn vào giỏ hàng, 3) Kiểm tra thông tin đơn hàng, 4) Chọn phương thức thanh toán và địa chỉ giao hàng, 5) Xác nhận đặt hàng. Đơn hàng của bạn sẽ được xử lý ngay lập tức.",
        },
        {
          question: "Tôi có thể hủy đơn hàng sau khi đã đặt không?",
          answer:
            "Bạn có thể hủy đơn hàng miễn phí trong vòng 2 phút sau khi đặt hàng. Sau thời gian này, nếu nhà hàng đã bắt đầu chuẩn bị món ăn, việc hủy đơn có thể bị tính phí theo quy định.",
        },
        {
          question: "Tôi có thể đặt hàng trước không?",
          answer:
            "Có, BADAFUTA hỗ trợ đặt hàng trước tối đa 7 ngày. Bạn chỉ cần chọn thời gian giao hàng mong muốn trong quá trình checkout.",
        },
        {
          question: "Làm sao để theo dõi đơn hàng?",
          answer:
            'Sau khi đặt hàng thành công, bạn sẽ nhận được mã đơn hàng. Bạn có thể theo dõi tình trạng đơn hàng realtime trong mục "Đơn hàng của tôi" hoặc qua SMS/email thông báo.',
        },
      ],
    },
    {
      category: "Thanh toán",
      icon: "💳",
      questions: [
        {
          question: "BADAFUTA hỗ trợ những phương thức thanh toán nào?",
          answer:
            "Chúng tôi hỗ trợ: Tiền mặt khi nhận hàng (COD), thẻ tín dụng/ghi nợ (Visa, Mastercard), ví điện tử (MoMo, ZaloPay, ShopeePay), và chuyển khoản ngân hàng.",
        },
        {
          question: "Thông tin thanh toán của tôi có an toàn không?",
          answer:
            "Tuyệt đối an toàn. BADAFUTA sử dụng mã hóa SSL 256-bit và tuân thủ tiêu chuẩn bảo mật PCI DSS. Chúng tôi không lưu trữ thông tin thẻ tín dụng của khách hàng.",
        },
        {
          question: "Khi nào tôi bị trừ tiền?",
          answer:
            "Đối với thanh toán online, tiền sẽ được trừ ngay khi xác nhận đặt hàng. Đối với COD, bạn thanh toán khi nhận hàng. Nếu đơn hàng bị hủy, tiền sẽ được hoàn lại trong 3-5 ngày làm việc.",
        },
        {
          question: "Tôi có thể sử dụng mã giảm giá không?",
          answer:
            "Có, bạn có thể áp dụng mã giảm giá trong bước thanh toán. Mỗi đơn hàng chỉ được sử dụng một mã giảm giá và không thể kết hợp với các khuyến mãi khác.",
        },
      ],
    },
    {
      category: "Giao hàng",
      icon: "🚚",
      questions: [
        {
          question: "Thời gian giao hàng là bao lâu?",
          answer:
            "Thời gian giao hàng trung bình là 25-35 phút tùy thuộc vào khoảng cách và tình trạng giao thông. Chúng tôi cam kết giao hàng trong vòng 60 phút hoặc miễn phí toàn bộ đơn hàng.",
        },
        {
          question: "BADAFUTA giao hàng ở những khu vực nào?",
          answer:
            "Hiện tại chúng tôi phục vụ toàn bộ TP.HCM và một số quận ở Hà Nội, Đà Nẵng. Bạn có thể kiểm tra khu vực giao hàng bằng cách nhập địa chỉ khi đặt hàng.",
        },
        {
          question: "Phí giao hàng là bao nhiêu?",
          answer:
            "Phí giao hàng từ 15.000-25.000đ tùy theo khoảng cách. Đơn hàng từ 200.000đ trở lên được miễn phí giao hàng. Trong giờ cao điểm có thể có phụ phí 5.000-10.000đ.",
        },
        {
          question: "Nếu tôi không có mặt khi shipper đến thì sao?",
          answer:
            "Shipper sẽ gọi điện cho bạn và chờ tối đa 10 phút. Nếu không liên lạc được, đơn hàng sẽ được đưa về và bạn có thể sắp xếp lại thời gian giao hàng hoặc hủy đơn.",
        },
      ],
    },
    {
      category: "Chất lượng & Hoàn tiền",
      icon: "⭐",
      questions: [
        {
          question: "Nếu món ăn không đúng như mong đợi thì sao?",
          answer:
            "Nếu không hài lòng với chất lượng món ăn, vui lòng liên hệ ngay với chúng tôi trong vòng 30 phút sau khi nhận hàng. Chúng tôi sẽ hoàn tiền hoặc giao lại món ăn mới.",
        },
        {
          question: "Làm thế nào để đánh giá nhà hàng và món ăn?",
          answer:
            'Sau khi hoàn thành đơn hàng, bạn có thể đánh giá từ 1-5 sao và để lại nhận xét trong mục "Đơn hàng của tôi". Đánh giá của bạn giúp cải thiện chất lượng dịch vụ.',
        },
        {
          question: "Chính sách hoàn tiền như thế nào?",
          answer:
            "Hoàn tiền 100% nếu: đơn hàng bị hủy bởi nhà hàng, giao hàng quá 60 phút, món ăn có vấn đề về chất lượng. Tiền sẽ được hoàn về tài khoản trong 3-7 ngày làm việc.",
        },
        {
          question: "Tôi có thể khiếu nại về dịch vụ ở đâu?",
          answer:
            "Bạn có thể gửi khiếu nại qua: 1) Hotline 1900 1234, 2) Email support@badafuta.com, 3) Chat trực tiếp trong app, 4) Fanpage Facebook. Chúng tôi cam kết phản hồi trong vòng 2 giờ.",
        },
      ],
    },
  ];

  const supportChannels = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Trò chuyện trực tiếp với đội ngũ hỗ trợ",
      action: "Chat ngay",
      available: "24/7",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      icon: Phone,
      title: "Hotline",
      description: "1900 1234",
      action: "Gọi ngay",
      available: "24/7",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
    {
      icon: Mail,
      title: "Email",
      description: "support@badafuta.com",
      action: "Gửi email",
      available: "Phản hồi trong 2h",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
    },
  ];

  const filteredFaq = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          searchQuery === "" ||
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-400 to-orange-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Trung tâm hỗ trợ
          </h1>
          <p className="text-xl text-orange-100 mb-8">
            Chúng tôi luôn sẵn sàng giúp đỡ bạn. Tìm câu trả lời cho mọi thắc
            mắc về BADAFUTA.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900 border-0 rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Contact Cards */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cần hỗ trợ ngay?
            </h2>
            <p className="text-gray-600">
              Chọn cách thức liên hệ phù hợp với bạn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => (
              <Card
                key={index}
                className={`${channel.bgColor} border-0 hover:shadow-lg transition-shadow cursor-pointer`}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 ${channel.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm`}
                  >
                    <channel.icon className={`w-8 h-8 ${channel.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {channel.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{channel.description}</p>
                  <Badge variant="secondary" className="mb-4">
                    <Clock className="w-3 h-3 mr-1" />
                    {channel.available}
                  </Badge>
                  <div>
                    <Button 
                      className={`${channel.buttonColor} text-white w-[180px]`}
                    >
                      {channel.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Câu hỏi thường gặp
            </h2>
            <p className="text-gray-600">
              Tìm câu trả lời nhanh chóng cho những thắc mắc phổ biến
            </p>
          </div>

          {searchQuery && (
            <div className="mb-6 ">
              <p className="text-gray-600 ">
                Kết quả tìm kiếm cho:{" "}
                <span className="font-semibold">"{searchQuery}"</span>
              </p>
            </div>
          )}

          <div className="grid gap-8">
            {filteredFaq.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
                  <CardTitle className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-xl">{category.category}</span>
                    <Badge variant="secondary">
                      {category.questions.length} câu hỏi
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 ">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem
                        key={faqIndex}
                        value={`${categoryIndex}-${faqIndex}`}
                        className="border-b border-gray-200"
                      >
                        <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50">
                          <span className="font-medium text-gray-900">
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFaq.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy kết quả
              </h3>
              <p className="text-gray-600 mb-6">
                Thử sử dụng từ khóa khác hoặc liên hệ trực tiếp với chúng tôi
              </p>
              <Button onClick={() => setSearchQuery("")} variant="outline">
                Xóa tìm kiếm
              </Button>
            </div>
          )}
        </section>

        {/* Additional Help Section */}
        <section className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Vẫn cần hỗ trợ thêm?
            </h3>
            <p className="text-gray-600 mb-6">
              Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn
              24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="default" className="bg-orange-600 w-max hover:bg-orange-700">
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat với chúng tôi
              </Button>
              <Button size="lg" variant="outline">
                <Phone className="w-5 h-5 mr-2" />
                Gọi hotline: 1900 1234
              </Button>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="mt-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Mẹo sử dụng BADAFUTA hiệu quả
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những bí quyết giúp bạn tối ưu trải nghiệm đặt món và tiết kiệm
              chi phí
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tip 1 */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-3 text-center">
                  Đặt hàng thông minh
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Kiểm tra rating và reviews của nhà hàng</li>
                  <li>• Đọc thông tin chi tiết món ăn</li>
                  <li>• Xem thời gian chuẩn bị ước tính</li>
                  <li>• Chọn nhà hàng có thời gian giao nhanh</li>
                </ul>
              </CardContent>
            </Card>

            {/* Tip 2 */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-3 text-center">
                  Tiết kiệm tối đa
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Đặt hàng trên 200k để miễn phí ship</li>
                  <li>• Sử dụng mã giảm giá khi checkout</li>
                  <li>• Đặt hàng nhóm để chia sẻ phí ship</li>
                  <li>• Theo dõi khuyến mãi flash sale</li>
                </ul>
              </CardContent>
            </Card>

            {/* Tip 3 */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Truck className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-3 text-center">
                  Giao hàng nhanh chóng
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Chọn nhà hàng gần vị trí của bạn</li>
                  <li>• Tránh giờ cao điểm (11h-13h, 18h-20h)</li>
                  <li>• Cập nhật địa chỉ chính xác và chi tiết</li>
                  <li>• Luôn bật điện thoại để shipper liên lạc</li>
                </ul>
              </CardContent>
            </Card>

            {/* Tip 4 */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-3 text-center">
                  Trải nghiệm tốt hơn
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Đánh giá sau mỗi đơn hàng</li>
                  <li>• Lưu nhà hàng yêu thích để đặt nhanh</li>
                  <li>• Báo cáo vấn đề để được hỗ trợ</li>
                  <li>• Theo dõi đơn hàng realtime</li>
                </ul>
              </CardContent>
            </Card>

            {/* Tip 5 */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-red-50 to-red-100">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-3 text-center">
                  Quản lý thời gian
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Đặt hàng trước cho bữa ăn chính</li>
                  <li>• Sử dụng tính năng đặt hàng theo lịch</li>
                  <li>• Theo dõi thời gian giao hàng ước tính</li>
                  <li>• Liên hệ ngay nếu giao hàng trễ</li>
                </ul>
              </CardContent>
            </Card>

            {/* Tip 6 */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-teal-50 to-teal-100">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-3 text-center">
                  Giao tiếp hiệu quả
                </h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Ghi chú rõ ràng yêu cầu đặc biệt</li>
                  <li>• Chat trực tiếp với nhà hàng nếu cần</li>
                  <li>• Liên hệ hotline khi gặp khó khăn</li>
                  <li>• Phản hồi tích cực để cải thiện dịch vụ</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Pro Tips Section */}
          <div className="mt-12 p-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl text-white">
            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold mb-2">
                💡 Pro Tips cho người dùng thường xuyên
              </h4>
              <p className="text-indigo-100">
                Những bí quyết từ các "food hunter" chuyên nghiệp
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h5 className="font-bold text-lg mb-4 flex items-center">
                  <span className="bg-yellow-400 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    1
                  </span>
                  Chiến lược đặt hàng thông minh
                </h5>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-300 mt-1">▸</span>
                    <span>
                      Đặt combo để được giá tốt hơn so với order từng món riêng
                      lẻ
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-300 mt-1">▸</span>
                    <span>
                      Follow các nhà hàng yêu thích để nhận thông báo khuyến mãi
                      đầu tiên
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-300 mt-1">▸</span>
                    <span>
                      Đặt hàng vào cuối tuần thường có nhiều deal hấp dẫn hơn
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h5 className="font-bold text-lg mb-4 flex items-center">
                  <span className="bg-green-400 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    2
                  </span>
                  Tối ưu hóa trải nghiệm
                </h5>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-300 mt-1">▸</span>
                    <span>
                      Lưu nhiều địa chỉ giao hàng để chuyển đổi nhanh chóng
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-300 mt-1">▸</span>
                    <span>
                      Sử dụng filter theo rating, giá, thời gian giao để tìm
                      đúng ý
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-300 mt-1">▸</span>
                    <span>
                      Bookmark các món ăn ngon để dễ dàng order lại lần sau
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
