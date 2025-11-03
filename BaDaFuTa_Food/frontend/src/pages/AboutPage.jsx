import {
  Users,
  Target,
  Heart,
  Award,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Utensils,
  TrendingUp,
  Globe,
  Star,
  CheckCircle,
  ArrowRight,
  Building,
  Zap,
  Leaf,
} from "lucide-react";
import { Logo } from "../components/Logo";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Premium Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50 py-20 lg:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 bg-[size:20px_20px] opacity-20"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-600 rounded-3xl flex items-center justify-center shadow-xl border-4 border-white">
                  <Logo size="lg" className="text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    BADAFUTA
                  </h1>
                  <p className="text-orange-600 font-medium text-lg">
                    Food Delivery Excellence
                  </p>
                </div>
              </div>

              <h2 className="text-2xl lg:text-3xl font-medium text-gray-700 mb-6 leading-tight">
                Định nghĩa lại trải nghiệm
                <span className="block text-orange-600 font-bold">
                  giao đồ ăn trực tuyến
                </span>
              </h2>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                Nền tảng công nghệ hàng đầu kết nối hàng nghìn nhà hàng với
                triệu khách hàng, mang đến trải nghiệm ẩm thực đẳng cấp thế giới
                ngay tại Việt Nam.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10">
                <Badge
                  variant="secondary"
                  className="text-sm px-5 py-2 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-200"
                >
                  <Building className="w-4 h-4 mr-2" />
                  1,000+ Nhà hàng đối tác
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-sm px-5 py-2 bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Giao hàng 25 phút
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-sm px-5 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200"
                >
                  <Star className="w-4 h-4 mr-2" />
                  4.9/5 rating
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center lg:justify-start">
                <div className="flex space-x-[12px]">
                  <Button
                    size="lg"
                    variant="default"
                    className="bg-gradient-to-r w-max from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg text-lg  rounded-2xl"
                    onClick={() => (window.location.href = "/")}
                  >
                    Khám phá ngay
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2  w-max border-orange-500 text-orange-600 hover:bg-orange-50 text-lg px-8 py-[18px] rounded-2xl"
                    onClick={() => (window.location.href = "/merchantlogin")}
                  >
                    Đối tác nhà hàng
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1703797967062-70681a18f71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZm9vZCUyMHByZXNlbnRhdGlvbiUyMGVsZWdhbnR8ZW58MXx8fHwxNzU5Njg2MDU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Món ăn cao cấp được trình bày đẹp mắt"
                  className="w-full h-96 lg:h-[600px] object-cover"
                />
                {/* Premium overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Floating stats */}
                <div className="absolute top-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      99.2%
                    </div>
                    <div className="text-sm text-gray-600">Tỷ lệ hài lòng</div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          Premium Dining Experience
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Chất lượng nhà hàng 5 sao, giao tận nơi
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center mb-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-bold ml-1">4.9</span>
                        </div>
                        <p className="text-xs text-gray-500">12.5k đánh giá</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-8">
                <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
                  Câu chuyện của chúng tôi
                </Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Hành trình tạo nên
                  <span className="text-orange-600 block">sự khác biệt</span>
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Từ một startup nhỏ năm 2020, BADAFUTA đã phát triển thành nền
                  tảng giao đồ ăn hàng đầu với công nghệ AI tiên tiến và mạng
                  lưới logistics thông minh.
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Chúng tôi không chỉ giao đồ ăn, mà còn kiến tạo một hệ sinh
                  thái ẩm thực hoàn chỉnh, nơi mọi bữa ăn đều trở thành trải
                  nghiệm đáng nhớ.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    4
                  </div>
                  <div className="text-gray-700 font-medium">
                    Năm phát triển
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    50+
                  </div>
                  <div className="text-gray-700 font-medium">
                    Thành phố phủ sóng
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758873268631-fa944fc5cad2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBzcGFjZSUyMHRlYW0lMjBjb2xsYWJvcmF0aW9ufGVufDF8fHx8MTc1OTY4NjA1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Đội ngũ BADAFUTA làm việc trong không gian hiện đại"
                className="w-full h-96 lg:h-[500px] object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-orange-500 rounded-3xl opacity-20"></div>
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-blue-500 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Premium Cards */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
              Định hướng phát triển
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Sứ mệnh & Tầm nhìn
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những giá trị cốt lõi định hình nên BADAFUTA của hôm nay và tương
              lai
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-orange-50/50">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Sứ mệnh</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed text-lg">
                  Democratize fine dining - Mang trải nghiệm ẩm thực cao cấp đến
                  với mọi người thông qua công nghệ tiên tiến và dịch vụ xuất
                  sắc.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Chúng tôi tin rằng mỗi bữa ăn đều xứng đáng được thưởng thức
                  một cách trọn vẹn, bất kể bạn đang ở đâu hay có bao nhiều thời
                  gian.
                </p>
                <div className="pt-4">
                  <div className="flex items-center text-orange-600 font-medium">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Nâng tầm trải nghiệm ẩm thực Việt Nam
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/50">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Tầm nhìn</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed text-lg">
                  Trở thành Super App ẩm thực toàn cầu, kết nối văn hóa ẩm thực
                  các quốc gia và định hình tương lai của ngành F&B.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Đến năm 2030, BADAFUTA sẽ có mặt tại 20 quốc gia, phục vụ 100
                  triệu khách hàng với hơn 500,000 nhà hàng đối tác.
                </p>
                <div className="pt-4">
                  <div className="flex items-center text-blue-600 font-medium">
                    <Globe className="w-5 h-5 mr-2" />
                    Mở rộng ra thị trường quốc tế
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values - Modern Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
              DNA của BADAFUTA
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Giá trị cốt lõi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những nguyên tắc dẫn lối cho mọi quyết định và hành động của chúng
              tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-orange-50/30">
              <CardContent className="pt-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Utensils className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Excellence</h3>
                <p className="text-gray-600 leading-relaxed">
                  Cam kết chất lượng 5 sao trong từng món ăn, từng dịch vụ và
                  từng trải nghiệm khách hàng.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-blue-50/30">
              <CardContent className="pt-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Innovation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Đầu tư vào AI, blockchain và IoT để tạo ra những breakthrough
                  trong ngành F&B.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-green-50/30">
              <CardContent className="pt-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Sustainability</h3>
                <p className="text-gray-600 leading-relaxed">
                  Bảo vệ môi trường với packaging sinh học và hệ thống logistics
                  carbon-neutral.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-purple-50/30">
              <CardContent className="pt-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Trust</h3>
                <p className="text-gray-600 leading-relaxed">
                  Xây dựng niềm tin thông qua minh bạch, an toàn thông tin và
                  dịch vụ đáng tin cậy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics - Premium Design */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:30px_30px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 mb-4">
              Thành tựu đạt được
            </Badge>
            <h2 className="text-4xl font-bold mb-6">Con số ấn tượng</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Minh chứng cho sự tin tưởng và thành công của BADAFUTA
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Building className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-bold text-orange-400 mb-2">
                1,200+
              </div>
              <p className="text-gray-300 text-lg">Nhà hàng đối tác</p>
              <p className="text-gray-400 text-sm mt-1">Tăng 40% mỗi quý</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-bold text-blue-400 mb-2">2.5M+</div>
              <p className="text-gray-300 text-lg">Khách hàng tích cực</p>
              <p className="text-gray-400 text-sm mt-1">
                MAU (Monthly Active Users)
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-bold text-green-400 mb-2">50M+</div>
              <p className="text-gray-300 text-lg">Đơn hàng thành công</p>
              <p className="text-gray-400 text-sm mt-1">
                Tổng cộng từ năm 2020
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Award className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-bold text-purple-400 mb-2">
                99.2%
              </div>
              <p className="text-gray-300 text-lg">Tỷ lệ hài lòng</p>
              <p className="text-gray-400 text-sm mt-1">
                Khảo sát 6 tháng gần đây
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
              Đội ngũ lãnh đạo
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Những người kiến tạo tương lai
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Đội ngũ lãnh đạo giàu kinh nghiệm từ các tập đoàn công nghệ và F&B
              hàng đầu thế giới
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50">
              <CardContent className="pt-8 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-xl group-hover:scale-105 transition-transform duration-300">
                  QB
                </div>
                <h3 className="text-xl font-bold mb-2">Trương Quốc Bảo</h3>
                <p className="text-orange-600 font-medium mb-4">
                  CEO & Co-Founder
                </p>
                <p className="text-gray-600 mb-4">
                  Ex-Google, Ex-Grab. MBA Harvard Business School. 15 năm kinh
                  nghiệm trong fintech và marketplace.
                </p>
                <div className="flex justify-center space-x-4 text-gray-400">
                  <Badge variant="outline" className="text-xs">
                    Ex-Google
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Harvard MBA
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50">
              <CardContent className="pt-8 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-xl group-hover:scale-105 transition-transform duration-300">
                  QB
                </div>
                <h3 className="text-xl font-bold mb-2">Trương Quốc Bảo</h3>
                <p className="text-blue-600 font-medium mb-4">
                  CTO & Co-Founder
                </p>
                <p className="text-gray-600 mb-4">
                  Ex-Meta, Ex-Uber. PhD Computer Science Stanford. Chuyên gia
                  AI/ML với 12 năm kinh nghiệm Silicon Valley.
                </p>
                <div className="flex justify-center space-x-4 text-gray-400">
                  <Badge variant="outline" className="text-xs">
                    Ex-Meta
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Stanford PhD
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50">
              <CardContent className="pt-8 text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-xl group-hover:scale-105 transition-transform duration-300">
                  TT
                </div>
                <h3 className="text-xl font-bold mb-2">Trần Thiện Tâm</h3>
                <p className="text-green-600 font-medium mb-4">COO</p>
                <p className="text-gray-600 mb-4">
                  Ex-Amazon, Ex-FedEx. MBA Wharton. Chuyên gia logistics và
                  supply chain với 14 năm kinh nghiệm quốc tế.
                </p>
                <div className="flex justify-center space-x-4 text-gray-400">
                  <Badge variant="outline" className="text-xs">
                    Ex-Amazon
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Wharton MBA
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section - Elegant */}
      <section className="py-20 bg-gradient-to-br from-gray-100 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200 mb-4">
              Kết nối với chúng tôi
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Hãy cùng tạo nên điều kỳ diệu
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi luôn lắng nghe và sẵn sàng hỗ trợ bạn 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-orange-50/50">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3">Hotline 24/7</h3>
                <p className="text-2xl font-bold text-orange-600 mb-2">
                  1900 1968
                </p>
                <p className="text-gray-600 text-sm">
                  Hỗ trợ khách hàng và đối tác
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Phản hồi trung bình dưới 30 giây
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/50">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3">Email Support</h3>
                <p className="text-lg font-bold text-blue-600 mb-2">
                  hello@badafuta.com
                </p>
                <p className="text-gray-600 text-sm">Partnership & Business</p>
                <p className="text-gray-500 text-xs mt-2">
                  Phản hồi trong vòng 1 giờ
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-green-50/50">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3">Headquarters</h3>
                <p className="text-gray-700 font-medium mb-2">BADAFUTA Tower</p>
                <p className="text-gray-600 text-sm">Bình Chánh</p>
                <p className="text-gray-500 text-xs mt-2">TP.HCM, Vietnam</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="py-20 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:50px_50px]"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Sẵn sàng trải nghiệm
            <span className="block">tương lai ẩm thực?</span>
          </h2>
          <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Tham gia cùng hàng triệu người dùng đã tin tưởng BADAFUTA. Khám phá
            thế giới ẩm thực ngay hôm nay.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 shadow-xl text-lg px-10 py-6 rounded-2xl font-bold"
              onClick={() => (window.location.href = "/register")}
            >
              Đăng ký miễn phí
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 text-lg px-10 py-6 rounded-2xl font-bold"
              onClick={() => (window.location.href = "/merchantlogin")}
            >
              Trở thành đối tác
            </Button>
          </div>

          <div className="mt-12 flex justify-center items-center space-x-8 text-orange-100">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Miễn phí đăng ký</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Không phí ẩn</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
