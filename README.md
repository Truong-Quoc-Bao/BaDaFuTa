# BaDaFuTa - Multi-Platform Food Ordering Monorepo Ecosystem

A highly scalable, modular food ordering and restaurant management ecosystem (inspired by ShopeeFood) designed to orchestrate seamless interactions between customers, merchants, and mobile clients in real-time.

The project is structured as a **Monorepo Workspace** that separates TypeScript core backend logic, a secondary JS server, web platforms (PWA for users, admin for merchants), and an Expo-based mobile client.

---

## 🏗️ Monorepo System Architecture

```text
                                    +-------------------+
                                    |   PostgreSQL DB   |
                                    |    (Supabase)     |
                                    +--------+----------+
                                             |
                                      (Prisma ORM)
                                             |
                                             v
                          +-----------------+------------------+
                          |       backend (TypeScript Core)    |
                          |   - Express, Socket.IO, JWT        |
                          |   - Domain Modular Modules         |
                          +-----------------+------------------+
                                            ^
                          (HTTP REST & Real-time WebSockets)
                                            |
              +-----------------------------+-----------------------------+
              |                             |                             |
              v                             v                             v
+-------------+------+   +-----------------+--+   +----+------------+   +---------+-----------+
| frontend_customer  |   |  frontend_admin    |   | frontend_merchant|   |       mobile        |
| (Customer PWA Web) |   |  (Admin Web)       |   | (Store Admin Web)|   | (Expo Android/iOS)  |
| - Vite, React, JS  |   |  - Vite, React, JS |   | - Vite, React,JS |   | - React Native, TS  |
+--------------------+   +--------------------+   +-----------------+   +---------------------+
```

---

## 🚀 Live Demo & Deployment

- **Customer Web Demo:** [https://ba-da-fu-ta-food.vercel.app](https://ba-da-fu-ta-food.vercel.app)
- **Partner Web Demo:** [https://ba-da-fu-ta-partner.vercel.app](https://ba-da-fu-ta-partner.vercel.app)

- **Admin Web Demo:** [https://ba-da-fu-ta-admin.vercel.app](https://ba-da-fu-ta-admin.vercel.app)

- **Deployment Setup:** Frontend: Vercel | Backend: Render | Database: Supabase (PostgreSQL)

### Admin

| Field    | Value              |
| -------- | ------------------ |
| Email    | admin@badafuta.com |
| Name     | Trương Quốc Bảo    |
| Password | admin123           |

### Partner (Merchant)

| Tên                                | Email                    | Password |
| ---------------------------------- | ------------------------ | -------- |
| Jollibee Vietnam                   | jollibee@gmail.com       | 123456a  |
| KFC Vietnam                        | kfc@gmail.com            | 123456a  |
| McDonald's Vietnam                 | mcdonalds@gmail.com      | 123456a  |
| Phê La                             | phela2@gmail.com         | 123456a  |
| Bánh Mì Huynh Hoa                  | huynhhoa@gmail.com       | 123456a  |
| Katinat Saigon Kafe                | katinat@gmail.com        | 123456a  |
| Busan Korean Street Food           | busanbbq2@gmail.com      | 123456a  |
| Phở Hà Nội                         | pho@gmail.com            | 123456a  |
| Cơm Tấm Phúc Lộc Thọ               | phucloctho2@gmail.com    | 123456a  |
| TukTuk Thai Bistro                 | tuktuk@gmail.com         | 123456a  |
| Bò Né Lệ Hồng Phú Nhuận            | lehongphunhuan@gmail.com | 123456a  |
| Hải Sản Gió Biển Nha Trang         | giobiennt@gmail.com      | 123456a  |
| Seoul Tofu & BBQ                   | seoultofu2@gmail.com     | 123456a  |
| Phúc Long                          | phuclong2@gmail.com      | 123456a  |
| Nem Nướng Đặng Văn Quyên Nha Trang | dangvanquyennt@gmail.com | 123456a  |

### Customer

| Tên               | Email                        | Password |
| ----------------- | ---------------------------- | -------- |
| Phan Bảo Trâm     | baotram.phan@gmail.com       | 123456a  |
| Nguyễn Minh Khang | khang.nguyen@gmail.com       | 123456a  |
| Nguyễn Hoàng Yến  | hoangyen.nguyen@gmail.com    | 123456a  |
| Đỗ Tuấn Kiệt      | tuankiet.do@gmail.com        | 123456a  |
| Lê Thị Mai Anh    | maianh.le@gmail.com          | 123456a  |
| Vũ Quỳnh Chi      | quynhchi.vu@gmail.com        | 123456a  |
| Lê Minh Triết     | minhtriet.le@gmail.com       | 123456a  |

---

## 🛠️ Technology Stack

- **Main Backend Service:** Node.js, TypeScript, Express, Prisma ORM, Docker
- **Customer & Merchant Web Portals:** ReactJS, Vite, Tailwind CSS, Service Worker (PWA)
- **Mobile Client:** React Native, Expo, Tailwind CSS
- **Database:** PostgreSQL (Supabase)
- **Real-time Engine:** Socket.IO / WebSockets

---

## ✨ Key Features

- **Modular Domain Architecture:** Clean separation of business domains (Users, Orders, Vouchers, OTP, Payments) within the backend.
- **Real-time Order Workflow:** Bidirectional instant notifications using Socket.IO, keeping customers, restaurants, and delivery statuses synchronized.
- **Progressive Web App (PWA):** Service worker caching, asset pre-fetching, and web manifest integration for an offline-friendly customer experience.
- **Dual-Payment Gateways:** Fully integrated payment handling using **MoMo** and **VNPay**.
- **SMS/OTP Verification:** Safe user registration and password recovery via OTP authentication.
- **Comprehensive Database Design:** Deep relational database model using Prisma ORM to efficiently map complex merchant-to-product-to-order associations.

---

## 📁 Repository Directory Structure

<details>
<summary><b>Click to expand/collapse the full recursive directory tree</b></summary>

```text
BaDaFuTa_Food
├── .expo
│   ├── README.md
│   └── settings.json
├── backend
│   ├── .env
│   ├── .env.production
│   ├── docker-compose.yml
│   ├── package-lock.json
│   ├── package.json
│   ├── prisma
│   │   └── schema.prisma
│   ├── railpack-plan.json
│   ├── src
│   │   ├── app.ts
│   │   ├── libs
│   │   │   ├── mailer.ts
│   │   │   └── prisma.ts
│   │   ├── middlewares
│   │   │   ├── auth.middleware.ts
│   │   │   ├── bigint-json.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── logger.middleware.ts
│   │   ├── modules
│   │   │   ├── admin
│   │   │   │   ├── admin.controller.ts
│   │   │   │   ├── admin.repository.ts
│   │   │   │   ├── admin.route.ts
│   │   │   │   ├── admin.service.ts
│   │   │   │   ├── admin.types.ts
│   │   │   │   ├── admin.validation.ts
│   │   │   │   └── index.ts
│   │   │   ├── customer
│   │   │   │   ├── customer-routes
│   │   │   │   │   └── index.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── menu-item
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── menu-item.controller.ts
│   │   │   │   │   ├── menu-item.repository.ts
│   │   │   │   │   ├── menu-item.route.ts
│   │   │   │   │   ├── menu-item.service.ts
│   │   │   │   │   ├── menu-item.types.ts
│   │   │   │   │   ├── menu-item.validation.ts
│   │   │   │   │   ├── product-item.controller.ts
│   │   │   │   │   ├── product-item.repository.ts
│   │   │   │   │   └── product-item.service.ts
│   │   │   │   ├── merchant
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── merchant.controller.ts
│   │   │   │   │   ├── merchant.repository.ts
│   │   │   │   │   ├── merchant.route.ts
│   │   │   │   │   ├── merchant.service.ts
│   │   │   │   │   ├── merchant.types.ts
│   │   │   │   │   └── merchant.validation.ts
│   │   │   │   ├── momo
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── momo.controller.ts
│   │   │   │   │   ├── momo.repository.ts
│   │   │   │   │   ├── momo.route.ts
│   │   │   │   │   └── momo.service.ts
│   │   │   │   ├── order
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── order.controller.ts
│   │   │   │   │   ├── order.repository.ts
│   │   │   │   │   ├── order.route.ts
│   │   │   │   │   ├── order.service.ts
│   │   │   │   │   ├── order.type.ts
│   │   │   │   │   └── order.validation.ts
│   │   │   │   ├── otp
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── otp.controller.ts
│   │   │   │   │   ├── otp.route.ts
│   │   │   │   │   ├── otp.service.ts
│   │   │   │   │   └── otp.store.ts
│   │   │   │   ├── users
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── user.controller.ts
│   │   │   │   │   ├── user.repository.ts
│   │   │   │   │   ├── user.route.ts
│   │   │   │   │   ├── user.service.ts
│   │   │   │   │   ├── user.types.ts
│   │   │   │   │   └── user.validation.ts
│   │   │   │   ├── vnpay
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── payment.controller.ts
│   │   │   │   │   ├── payment.repository.ts
│   │   │   │   │   ├── payment.route.ts
│   │   │   │   │   ├── payment.service.ts
│   │   │   │   │   ├── vnpay.controller.ts
│   │   │   │   │   ├── vnpay.repository.ts
│   │   │   │   │   ├── vnpay.route.ts
│   │   │   │   │   └── vnpay.service.ts
│   │   │   │   └── voucher
│   │   │   │       ├── index.ts
│   │   │   │       ├── voucher.controller.ts
│   │   │   │       ├── voucher.repository.ts
│   │   │   │       ├── voucher.routes.ts
│   │   │   │       ├── voucher.service.ts
│   │   │   │       ├── voucher.type.ts
│   │   │   │       └── voucher.validation.ts
│   │   │   └── merchant-store
│   │   │       ├── index.ts
│   │   │       ├── merchant
│   │   │       │   ├── index.ts
│   │   │       │   ├── merchant.controller.ts
│   │   │       │   ├── merchant.repository.ts
│   │   │       │   ├── merchant.route.ts
│   │   │       │   ├── merchant.service.ts
│   │   │       │   ├── merchant.types.ts
│   │   │       │   └── merchant.validation.ts
│   │   │       ├── merchant-dashboard
│   │   │       │   ├── index.ts
│   │   │       │   ├── merchant-dashboard.controller.ts
│   │   │       │   ├── merchant-dashboard.repository.ts
│   │   │       │   ├── merchant-dashboard.routes.ts
│   │   │       │   ├── merchant-dashboard.service.ts
│   │   │       │   ├── merchant-dashboard.type.ts
│   │   │       │   └── merchant-dashboard.validation.ts
│   │   │       ├── merchant-menu
│   │   │       │   ├── index.ts
│   │   │       │   ├── merchant-menu.controller.ts
│   │   │       │   ├── merchant-menu.repository.ts
│   │   │       │   ├── merchant-menu.route.ts
│   │   │       │   ├── merchant-menu.service.ts
│   │   │       │   ├── merchant-menu.type.ts
│   │   │       │   ├── merchant-menu.validation.ts
│   │   │       │   └── merchant-topping.service.ts
│   │   │       ├── merchant-store-routes
│   │   │       │   └── index.ts
│   │   │       ├── merchant_order
│   │   │       │   ├── index.ts
│   │   │       │   ├── merchant_order.controller.ts
│   │   │       │   ├── merchant_order.repository.ts
│   │   │       │   ├── merchant_order.routes.ts
│   │   │       │   ├── merchant_order.service.ts
│   │   │       │   ├── merchant_order.type.ts
│   │   │       │   └── merchant_order.validation.ts
│   │   │       └── order
│   │   │           ├── index.ts
│   │   │           ├── order.controller.ts
│   │   │           ├── order.repository.ts
│   │   │           ├── order.routes.ts
│   │   │           ├── order.service.ts
│   │   │           ├── order.type.ts
│   │   │           └── order.validation.ts
│   │   ├── routes
│   │   │   ├── index.ts
│   │   │   └── merchant.route.ts
│   │   ├── server.ts
│   │   ├── socket.ts
│   │   ├── utils
│   │   │   ├── async-handler.ts
│   │   │   └── response.ts
│   │   └── ws.ts
│   └── tsconfig.json
├── frontend_admin
│   ├── .env
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── api
│   │   │   └── api.js
│   │   ├── assets
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── components
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ui
│   │   │       ├── alert-dialog.jsx
│   │   │       ├── button.jsx
│   │   │       ├── card.jsx
│   │   │       ├── dialog.jsx
│   │   │       ├── input.jsx
│   │   │       ├── label.jsx
│   │   │       └── utils.js
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── AdminAddMerchantPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── PartnersPage.jsx
│   │   │   └── UsersPage.jsx
│   │   └── utils
│   │       └── utils.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
├── frontend_customer
│   ├── .env
│   ├── cert
│   │   ├── cert.pem
│   │   └── key.pem
│   ├── certs
│   │   ├── cert.pem
│   │   └── key.pem
│   ├── data
│   │   └── mockData.js
│   ├── eslint.config.js
│   ├── index.html
│   ├── manifest.json
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── pwa-192.png
│   │   ├── pwa-512.png
│   │   ├── pwa-maskable.png
│   │   └── vite.svg
│   ├── service-worker.js
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── api
│   │   │   └── api.js
│   │   ├── assets
│   │   │   ├── Gemini_Generated_Image_45i7go45i7go45i7.png
│   │   │   ├── Google.jpg
│   │   │   └── Google.svg
│   │   ├── components
│   │   │   ├── CancelOrderDialog.jsx
│   │   │   ├── Confirm.jsx
│   │   │   ├── DroneAnimated.jsx
│   │   │   ├── FeaturedRestaurant.jsx
│   │   │   ├── FlyToCart.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── FullScreenLayout.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── LocationSelector.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── MenuItemCard.jsx
│   │   │   ├── OpeningStatus.jsx
│   │   │   ├── OrderHistoryCard.jsx
│   │   │   ├── OrderStatusBadge.jsx
│   │   │   ├── PaymentIcons.jsx
│   │   │   ├── PromotionBanner.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RatingDialog.jsx
│   │   │   ├── RestaurantCard.jsx
│   │   │   ├── ToppingSelectionDialog.jsx
│   │   │   ├── TruckAnimated.jsx
│   │   │   ├── VNPayCallback.jsx
│   │   │   ├── VoucherDialog.jsx
│   │   │   ├── figma
│   │   │   │   └── ImageWithFallback.jsx
│   │   │   └── ui
│   │   │       ├── accordion.jsx
│   │   │       ├── addresdialog.jsx
│   │   │       ├── alert.jsx
│   │   │       ├── avartar.jsx
│   │   │       ├── badge.jsx
│   │   │       ├── button.jsx
│   │   │       ├── card.jsx
│   │   │       ├── checkbox.jsx
│   │   │       ├── dialog.jsx
│   │   │       ├── dropdown-menu.jsx
│   │   │       ├── input.jsx
│   │   │       ├── label.jsx
│   │   │       ├── select.jsx
│   │   │       ├── separator.jsx
│   │   │       ├── switch.jsx
│   │   │       ├── tabs.jsx
│   │   │       ├── textarea.jsx
│   │   │       └── utils.js
│   │   ├── contexts
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   ├── LocationContext.jsx
│   │   │   └── MerchantContext.jsx
│   │   ├── helper
│   │   │   └── fetchFromHosts.js
│   │   ├── hooks
│   │   │   └── useDeliveryFee.js
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── test.jsx
│   │   │   └── user
│   │   │       ├── AboutPage.jsx
│   │   │       ├── CartPage.jsx
│   │   │       ├── ChatDriverPage.jsx
│   │   │       ├── CheckOutPage.jsx
│   │   │       ├── ForgotPasswordPage.jsx
│   │   │       ├── HomePage.jsx
│   │   │       ├── LoginPage.jsx
│   │   │       ├── MenuItemDetailPage.jsx
│   │   │       ├── MyOrdersPage.jsx
│   │   │       ├── OrderPendingPage.jsx
│   │   │       ├── OrderSuccessPage.jsx
│   │   │       ├── PhoneVerificationPage.jsx
│   │   │       ├── ProfilePage.jsx
│   │   │       ├── RegisterPage.jsx
│   │   │       ├── ResetPasswordPage.jsx
│   │   │       ├── RestaurantPage.jsx
│   │   │       ├── SettingsPage.jsx
│   │   │       ├── SupportPage.jsx
│   │   │       ├── TrackOrderPage.jsx
│   │   │       └── TrackOrderPageBike.jsx
│   │   └── utils
│   │       ├── imageUtils.js
│   │       └── useDeliveryFee.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
├── frontend_merchant
│   ├── .env
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── sounds
│   │   │   └── new-order.mp3
│   │   └── vite.svg
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── components
│   │   │   ├── Header.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── MerchantLayout.jsx
│   │   │   ├── MerchantOrderCard.jsx
│   │   │   ├── MerchantProtectedRoute.jsx
│   │   │   ├── test.jsx
│   │   │   └── ui
│   │   │       ├── alert-dialog.jsx
│   │   │       ├── badge.jsx
│   │   │       ├── button.jsx
│   │   │       ├── card.jsx
│   │   │       ├── checkbox.jsx
│   │   │       ├── dialog.jsx
│   │   │       ├── input.jsx
│   │   │       ├── label.jsx
│   │   │       ├── radio-group.jsx
│   │   │       ├── select.jsx
│   │   │       ├── separator.jsx
│   │   │       ├── switch.jsx
│   │   │       ├── table.jsx
│   │   │       ├── tabs.jsx
│   │   │       ├── textarea.jsx
│   │   │       └── utils.js
│   │   ├── contexts
│   │   │   └── MerchantContext.jsx
│   │   ├── data
│   │   │   └── mockData.js
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── pages
│   │       ├── MerchantLoginPage.jsx
│   │       ├── MerchantMenuManagementPage.jsx
│   │       ├── MerchantOrderManagementPage.jsx
│   │       ├── MerchantOverviewPage.jsx
│   │       └── ToppingGroupManagementPage.jsx
│   ├── vercel.json
│   └── vite.config.js
├── mobile
│   ├── .expo
│   │   ├── README.md
│   │   ├── devices.json
│   │   └── types
│   │       └── router.d.ts
│   ├── README.md
│   ├── app.json
│   ├── babel.config.js
│   ├── eslint.config.js
│   ├── expo-env.d.ts
│   ├── metro.config.js
│   ├── package-lock.json
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── src
│   │   ├── App.tsx
│   │   ├── Attributions.md
│   │   ├── app
│   │   │   ├── (tabs)
│   │   │   │   └── _layout.tsx
│   │   │   └── index.tsx
│   │   ├── assets
│   │   │   └── images
│   │   │       ├── android-icon-background.png
│   │   │       ├── android-icon-foreground.png
│   │   │       ├── android-icon-monochrome.png
│   │   │       ├── favicon.png
│   │   │       ├── icon.png
│   │   │       ├── partial-react-logo.png
│   │   │       ├── react-logo.png
│   │   │       ├── react-logo@2x.png
│   │   │       ├── react-logo@3x.png
│   │   │       └── splash-icon.png
│   │   ├── components
│   │   │   ├── BottomNav.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── CategoryNav.tsx
│   │   │   ├── CheckoutDialog.tsx
│   │   │   ├── CuisineFilter.tsx
│   │   │   ├── FoodCard.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── PromoCarousel.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── figma
│   │   │   │   └── ImageWithFallback.tsx
│   │   │   ├── test.tsx
│   │   │   └── ui
│   │   │       ├── accordion.tsx
│   │   │       ├── alert-dialog.tsx
│   │   │       ├── alert.tsx
│   │   │       ├── aspect-ratio.tsx
│   │   │       ├── avatar.tsx
│   │   │       ├── badge.tsx
│   │   │       ├── breadcrumb.tsx
│   │   │       ├── button.tsx
│   │   │       ├── calendar.tsx
│   │   │       ├── card.tsx
│   │   │       ├── carousel.tsx
│   │   │       ├── chart.tsx
│   │   │       ├── checkbox.tsx
│   │   │       ├── collapsible.tsx
│   │   │       ├── command.tsx
│   │   │       ├── context-menu.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── drawer.tsx
│   │   │       ├── dropdown-menu.tsx
│   │   │       ├── form.tsx
│   │   │       ├── haptic-tab.tsx
│   │   │       ├── hover-card.tsx
│   │   │       ├── input-otp.tsx
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       ├── menubar.tsx
│   │   │       ├── navigation-menu.tsx
│   │   │       ├── pagination.tsx
│   │   │       ├── popover.tsx
│   │   │       ├── progress.tsx
│   │   │       ├── radio-group.tsx
│   │   │       ├── resizable.tsx
│   │   │       ├── scroll-area.tsx
│   │   │       ├── select.tsx
│   │   │       ├── separator.tsx
│   │   │       ├── sheet.tsx
│   │   │       ├── sidebar.tsx
│   │   │       ├── skeleton.tsx
│   │   │       ├── slider.tsx
│   │   │       ├── sonner.tsx
│   │   │       ├── switch.tsx
│   │   │       ├── table.tsx
│   │   │       ├── tabs.tsx
│   │   │       ├── textarea.tsx
│   │   │       ├── toggle-group.tsx
│   │   │       ├── toggle.tsx
│   │   │       ├── tooltip.tsx
│   │   │       ├── use-mobile.ts
│   │   │       └── utils.ts
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── pages
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── MyOrdersPage.tsx
│   │   │   ├── NotificationsPage.tsx
│   │   │   ├── OrdersPage.tsx
│   │   │   ├── PhoneVerificationPage.tsx
│   │   │   ├── ProfileInfoPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── RestaurantDetailPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   └── SignupPage.tsx
│   │   ├── scripts
│   │   │   └── reset-project.js
│   │   └── styles
│   │       └── global.css
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── package-lock.json
├── package.json
├── server
│   ├── .env
│   ├── certs
│   │   ├── cert.pem
│   │   └── key.pem
│   ├── controllers
│   │   ├── homePageController.js
│   │   ├── loginCustomerController.js
│   │   ├── otpController.js
│   │   ├── registerController.js
│   │   └── restaurantController.js
│   ├── db.js
│   ├── index.js
│   ├── models
│   │   └── Restaurant.js
│   ├── package-lock.json
│   ├── package.json
│   └── routes
│       ├── auth.js
│       ├── homepageRoutes.js
│       ├── loginCustomerRoutes.js
│       ├── otpRoutes.js
│       ├── registerRoutes.js
│       └── restaurantRoutes.js
└── sql
    ├── Insert.sql
    ├── Insert3merchant.sql
    ├── sql25-10-2025.sql
    └── updatedata26_10_2025.sql
```

</details>

---

## 🔧 Environment Variables

> ⚠️ **Security Notice:** Never commit real credentials to version control. Copy the `.env.example` files below and fill in your own values.

### `backend/.env`

```env
# Server
PORT=3000
HOST=0.0.0.0

# Database
# Local development examples (uncomment as needed):
# DATABASE_URL="postgres://postgres:<PASSWORD>@localhost:54320/BaDaFuTa?schema=public"

# Production (Supabase - Transaction Pooler)
DATABASE_URL="postgresql://<SUPABASE_USER>:<SUPABASE_PASSWORD>@<SUPABASE_HOST>:6543/postgres?pgbouncer=true&connection_limit=1"

# Production (Supabase - Direct Connection for Prisma migrations)
DIRECT_URL="postgresql://<SUPABASE_USER>:<SUPABASE_PASSWORD>@<SUPABASE_HOST>:5432/postgres"

# JWT
JWT_SECRET=your_jwt_secret_here

# Twilio OTP
TWILIO_SID=your_twilio_sid
TWILIO_AUTH=your_twilio_auth_token
TWILIO_VERIFY_SID=your_twilio_verify_sid

# Brevo (Email)
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_sender@email.com
BREVO_SENDER_NAME=Badafuta Support

# Gmail SMTP (alternative email)
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASS=your_gmail_app_password

# Resend (alternative email)
RESEND_API_KEY=your_resend_api_key

# VNPay Sandbox
VNP_TMN_CODE=your_vnpay_tmn_code
VNP_HASH_SECRET=your_vnpay_hash_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=http://localhost:3000/api/payment/vnpay-return

# MoMo IPN (use ngrok for local development)
MOMO_IPN_URL=https://your-ngrok-url.ngrok-free.dev/api/momo/callback

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
```

### `frontend_customer/.env`

```env
VITE_API_URL=https://your-backend.onrender.com

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Facebook OAuth
VITE_FACEBOOK_APP_ID=your_facebook_app_id
```

### `frontend_admin/.env`

```env
VITE_API_URL=https://your-backend.onrender.com
```

### `frontend_merchant/.env`

```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## ⚙️ Local Setup & Run Commands

### 1. Start Main Backend (`backend`)

```bash
cd backend
npm install
npx prisma db push
npm run dev
```

### 2. Start Customer Web App (`frontend_customer`)

```bash
cd ../frontend_customer
npm install
npm run dev
```

### 3. Start Admin Dashboard (`frontend_admin`)

```bash
cd ../frontend_admin
npm install
npm run dev
```

### 4. Start Merchant Dashboard (`frontend_merchant`)

```bash
cd ../frontend_merchant
npm install
npm run dev
```

### 5. Start Expo Mobile Application (`mobile`)

```bash
cd ../mobile
npm install
npx expo start
```

---

## 🐳 Docker (Backend)

```bash
cd backend
docker-compose up --build
```

---

## 📝 Notes

- The `sql/` directory contains raw SQL migration and seed scripts used during initial database setup.
- For MoMo payment callbacks during local development, use [ngrok](https://ngrok.com/) to expose your local backend port and set the tunnel URL in `MOMO_IPN_URL`.
- VNPay is configured for **sandbox** by default. Update `VNP_URL` and credentials for production.
