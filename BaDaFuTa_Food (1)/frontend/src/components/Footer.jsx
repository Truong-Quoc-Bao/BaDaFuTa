import { memo } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

export const Footer = memo(function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            {/* logo */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-2xl font-bold text-orange-500">
                BADAFUTA
              </span>
            </div>
            {/* Mô tả */}
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Ứng dụng đặt đồ ăn trực tuyến hàng đầu Việt Nam. Giao hàng nhanh,
              đa dạng nhà hàng, giá cả hợp lý.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          {/* liên kết */}
          <div className="">
            <h3 className="font-bold text-lg mb-4 text-orange-500">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 text-sm transition-colors hover:text-orange-500"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 text-sm transition-colors hover:text-orange-500"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="text-gray-300 text-sm transition-colors hover:text-orange-500"
                >
                  Hỗ trợ
                </Link>
              </li>
              <li>
                <Link
                  to="/my-orders"
                  className="text-gray-300 text-sm transition-colors hover:text-orange-500"
                >
                  Đơn hàng của tôi
                </Link>
              </li>
            </ul>
          </div>
          {/* Customer service */}
          <div className="">
            <h3 className="font-bold text-lg mb-4 text-orange-500">
              Dành cho khách hàng
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#"
                  className="text-gray-300 text-sm transition-colors hover:text-orange-500"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-300 text-sm transition-colors hover:text-orange-500"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-300 text-sm transition-colors hover:text-orange-500"
                >
                  Hướng dẫn đặt hàng
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-300 text-sm transition-colors hover:text-orange-500"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>
          {/* Contact */}
          <div className="">
            <h3 className="font-bold text-lg mb-4 text-orange-500">
              Thông tin liên hệ
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  123 Nguyễn Huệ, Quận 1, TP.HCM
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="text-gray-300 text-sm">1900 1234</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  support@badafuta.vn
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Phục vụ 24/7
                  <br />
                  Hỗ trợ 6:00 - 22:00
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* bottom */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 BADAFUTA. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/merchant/login"
                className="text-gray-400 hover:text-orange-500 transition-colors text-sm"
              >
                Dành cho đối tác
              </Link>
              <a
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors text-sm"
              >
                Tải app iOS
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors text-sm"
              >
                Tải app Android
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
})
