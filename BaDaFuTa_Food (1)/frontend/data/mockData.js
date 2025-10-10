
export const restaurants = [
  {
    id: '1',
    name: 'Phở Hà Nội',
    image: 'https://images.unsplash.com/photo-1595215909290-847cb783facf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc1OTY3MjkwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    cuisine: 'Việt Nam',
    rating: 4.8,
    deliveryTime: '25-35 phút',
    deliveryFee: 15000,
    description: 'Phở truyền thống Hà Nội với nước dùng được ninh từ xương bò suốt 12 tiếng, thịt bò tươi ngon và bánh phở dai ngon. Không gian ấm cúng, phong cách cổ điển Hà thành.',
    location: 'Quận 1, TP.HCM',
    coordinates: { lat: 10.7769, lng: 106.7009 },
    locationId: 'district1'
  },
  {
    id: '2',
    name: 'Pizza Heaven',
    image: 'https://images.unsplash.com/photo-1758448500799-0162cffd85d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwaXp6YSUyMHJlc3RhdXJhbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk2NzI5MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    cuisine: 'Ý',
    rating: 4.6,
    deliveryTime: '30-40 phút',
    deliveryFee: 20000,
    description: 'Pizza Ý chính gốc với lò nướng đá imported từ Napoli, bột pizza lên men tự nhiên 24h, cheese mozzarella tươi hàng ngày và sauce cà chua San Marzano DOP.',
    location: 'Quận 3, TP.HCM',
    coordinates: { lat: 10.7756, lng: 106.6934 },
    locationId: 'district3'
  },
  {
    id: '3',
    name: 'Sushi Tokyo',
    image: 'https://images.unsplash.com/photo-1639650538773-ffe1d8ad9d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NTk1ODc4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    cuisine: 'Nhật Bản',
    rating: 4.9,
    deliveryTime: '20-30 phút',
    deliveryFee: 25000,
    description: 'Sushi và sashimi cao cấp với cá tươi được nhập khẩu hàng ngày từ Tsukiji, đầu bếp Nhật chính hiệu và gạo sushi Koshihikari thượng hạng. Omakase trải nghiệm đích thực.',
    location: 'Quận 7, TP.HCM',
    coordinates: { lat: 10.7336, lng: 106.7219 },
    locationId: 'district7'
  },
  {
    id: '4',
    name: 'Bún Bò Huế Authentique',
    image: 'https://images.unsplash.com/photo-1715168438603-4dc3452f2f4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwYm8lMjBodWUlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1OTY3MjkxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    cuisine: 'Việt Nam',
    rating: 4.7,
    deliveryTime: '20-30 phút',
    deliveryFee: 12000,
    description: 'Bún bò Huế chuẩn vị cố đô với công thức gia truyền 3 đời, nước lèo ninh từ xương ống bò và heo, gia vị đặc trưng miền Trung. Thịt bò, chả cua, giò heo tự làm.',
    location: 'Quận 5, TP.HCM',
    coordinates: { lat: 10.7594, lng: 106.6833 },
    locationId: 'district5'
  },
  {
    id: '5',
    name: 'Burger Station',
    image: 'https://images.unsplash.com/photo-1679344600900-87a98b85c01f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWVyaWNhbiUyMGJ1cmdlciUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjcyOTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    cuisine: 'Mỹ',
    rating: 4.5,
    deliveryTime: '25-35 phút',
    deliveryFee: 18000,
    description: 'Burger Mỹ authentic với thịt bò Angus xay tươi hàng ngày, bánh brioche nướng vàng giòn, rau tươi organic và khoai tây Idaho cắt tay chiên giòn. Không gian American diner vintage.',
    location: 'Quận 2, TP.HCM',
    coordinates: { lat: 10.7829, lng: 106.7196 },
    locationId: 'district2'
  },
  {
    id: '6',
    name: 'Pad Thai Corner',
    image: 'https://images.unsplash.com/photo-1675150303909-1bb94e33132f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwcmVzdGF1cmFudCUyMHBhZCUyMHRoYWl8ZW58MXx8fHwxNzU5NjcyOTE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    cuisine: 'Thái Lan',
    rating: 4.4,
    deliveryTime: '30-40 phút',
    deliveryFee: 22000,
    description: 'Ẩm thực Thái Lan đích thực với đầu bếp gốc Thái, nguyên liệu nhập khẩu từ Thailand như sốt tamarind, mắm tôm và gia vị đặc trưng. Pad Thai, Tom Yum và Green Curry chuẩn vị.',
    location: 'Quận 10, TP.HCM',
    coordinates: { lat: 10.7731, lng: 106.6679 },
    locationId: 'district10'
  },
  {
    id: '7',
    name: 'Cà Phê Sài Gòn',
    image: 'https://images.unsplash.com/photo-1648451142763-6fb6244cb8a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY29mZmVlJTIwc2hvcCUyMGludGVyaW9yfGVufDF8fHx8MTc1OTY3Mzk1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    cuisine: 'Việt Nam',
    rating: 4.6,
    deliveryTime: '15-25 phút',
    deliveryFee: 10000,
    description: 'Cà phê Việt Nam truyền thống với hương vị đậm đà, thơm lừng. Robusta Buôn Ma Thuột nguyên chất, pha phin truyền thống, không gian vintage Sài Gòn xưa.',
    location: 'Quận 1, TP.HCM',
    coordinates: { lat: 10.7769, lng: 106.7009 },
    locationId: 'district1'
  },
  {
    id: '8',
    name: 'Seoul BBQ House',
    image: 'https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYXJiZWN1ZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NTg4MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    cuisine: 'Hàn Quốc',
    rating: 4.7,
    deliveryTime: '35-45 phút',
    deliveryFee: 25000,
    description: 'BBQ Hàn Quốc đích thực với thịt bò Wagyu và heo Black Pig cao cấp. Bàn nướng than hoa, banchan (kimchi, namul) tự làm và gochujang nhập khẩu từ Hàn Quốc.',
    location: 'Quận 3, TP.HCM',
    coordinates: { lat: 10.7756, lng: 106.6934 },
    locationId: 'district3'
  },
  {
    id: '9',
    name: 'Mumbai Curry House',
    image: 'https://images.unsplash.com/photo-1690915475414-9aaecfd3ba74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyeSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjYwNTg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    cuisine: 'Ấn Độ',
    rating: 4.5,
    deliveryTime: '30-40 phút',
    deliveryFee: 20000,
    description: 'Cà ri Ấn Độ chính gốc với đầu bếp Mumbai, gia vị nhập khẩu từ Ấn Độ. Tandoor oven truyền thống, basmati rice thơm ngon và naan bread nướng tươi.',
    location: 'Quận 7, TP.HCM',
    coordinates: { lat: 10.7336, lng: 106.7219 },
    locationId: 'district7'
  },
  {
    id: '10',
    name: 'Dragon Palace Dim Sum',
    image: 'https://images.unsplash.com/photo-1563538866332-01d4b73d13b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwcmVzdGF1cmFudCUyMGRpbSUyMHN1bXxlbnwxfHx8fDE3NTk2NzM5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    cuisine: 'Trung Quốc',
    rating: 4.8,
    deliveryTime: '25-35 phút',
    deliveryFee: 18000,
    description: 'Dim sum Quảng Đông chính hiệu với đầu bếp từ Hong Kong. Har gow, siu mai, char siu bao được làm thủ công. Trà Oolong thượng hạng và không gian sang trọng.',
    location: 'Quận 5, TP.HCM',
    coordinates: { lat: 10.7594, lng: 106.6833 },
    locationId: 'district5'
  },
  {
    id: '11',
    name: 'Amigos Taco Bar',
    image: 'https://images.unsplash.com/photo-1700625915228-f2b3d88c6676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwdGFjbyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjczOTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    cuisine: 'Mexico',
    rating: 4.3,
    deliveryTime: '25-35 phút',
    deliveryFee: 20000,
    description: 'Taco Mexico authentic với tortilla corn tự làm, carnitas nướng 8 tiếng, salsa verde tươi và guacamole bơ Hass. Margarita cocktails và không gian sôi động.',
    location: 'Quận 2, TP.HCM',
    coordinates: { lat: 10.7829, lng: 106.7196 },
    locationId: 'district2'
  },
  {
    id: '12',
    name: 'Green Garden Salads',
    image: 'https://images.unsplash.com/photo-1555057949-7e4a30956f1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1OTU4OTg0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    cuisine: 'Healthy',
    rating: 4.4,
    deliveryTime: '20-30 phút',
    deliveryFee: 15000,
    description: 'Salad tươi healthy với rau organic, superfood hạt chia, quinoa, avocado. Dressing tự làm không chất bảo quản. Smoothie bowl và cold-pressed juice tươi mỗi ngày.',
    location: 'Quận 1, TP.HCM',
    coordinates: { lat: 10.7769, lng: 106.7009 },
    locationId: 'district1'
  }
];

// Featured restaurants with special offers
export const featuredRestaurants = restaurants.slice(0, 3);

// Promotions data
export const promotions = [
  {
    id: '1',
    title: 'Giảm 50% đơn đầu tiên',
    description: 'Áp dụng cho khách hàng mới, tối đa 100.000đ',
    code: 'WELCOME50',
    restaurantIds: ['1', '2', '3']
  },
  {
    id: '2', 
    title: 'Miễn phí giao hàng',
    description: 'Đơn từ 200.000đ trở lên',
    code: 'FREESHIP',
    restaurantIds: ['2', '4', '5']
  },
  {
    id: '3',
    title: 'Combo ưu đãi cuối tuần',
    description: 'Giảm 30% các combo, chỉ áp dụng T7-CN',
    code: 'WEEKEND30',
    restaurantIds: ['1', '3', '6']
  },
  {
    id: '4',
    title: 'Happy Hour Coffee',
    description: 'Giảm 25% đồ uống từ 14h-16h',
    code: 'COFFEE25',
    restaurantIds: ['7']
  }
];

// Payment methods
export const paymentMethods = [
  {
    id: '1',
    type: 'cash',
    name: 'Tiền mặt',
    icon: '💵'
  },
  {
    id: '2',
    type: 'card',
    name: 'Thẻ tín dụng/ghi nợ',
    icon: '💳'
  },
  {
    id: '3',
    type: 'bank',
    name: 'Chuyển khoản ngân hàng',
    icon: '🏦'
  },
  {
    id: '4',
    type: 'ewallet',
    name: 'Ví điện tử',
    icon: '📱'
  }
];

// Mock saved cards
export const savedCards = [
  {
    id: '1',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2025,
    holderName: 'NGUYEN VAN A'
  },
  {
    id: '2',
    last4: '5555',
    brand: 'Mastercard',
    expiryMonth: 8,
    expiryYear: 2026,
    holderName: 'NGUYEN VAN A'
  }
];

export const menuItems = [
  // Phở Hà Nội - Món ăn
  {
    id: '1',
    name: 'Phở Bò Đặc Biệt',
    description: 'Phở bò thượng hạng với đầy đủ topping: thịt chín mềm, tái mỏng, gầu dai ngon, gân giòn và sách bò. Nước dùng trong vắt, thơm lừng ninh từ xương bò suốt 12 tiếng. Kèm rau thơm, chanh, ớt tươi.',
    price: 68000,
    originalPrice: 85000,
    image: 'https://images.unsplash.com/photo-1579866997815-ecbb27a4dd43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwYmVlZiUyMHNwZWNpYWx8ZW58MXx8fHwxNzU5NjcyOTIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Phở',
    restaurantId: '1',
    isAvailable: true,
    toppings: [
      { id: 'size_pho', name: 'Size', price: 0, required: true },
      { id: 'extra_meat', name: 'Thêm thịt', price: 25000 },
      { id: 'extra_noodles', name: 'Thêm bánh phở', price: 15000 },
      { id: 'side_herbs', name: 'Rau thơm thêm', price: 10000 }
    ],
    ingredients: [
      'Bánh phở tươi', 'Thịt bò Úc', 'Xương bò ninh 12h', 'Hành tây', 
      'Gừng tươi', 'Quế Cassia', 'Hồi bát giác', 'Thảo quả', 
      'Rau răm', 'Ngò gai', 'Hành lá', 'Chanh tươi'
    ],
    allergens: ['Gluten'],
    nutrition: {
      calories: 450,
      protein: 35,
      carbs: 52,
      fat: 12
    }
  },
  {
    id: '2',
    name: 'Phở Gà',
    description: 'Phở gà thơm ngon với thịt gà tây rán vàng thơm phức, nước dùng trong ngọt từ xương gà ta. Bánh phở mềm dai, kèm đầy đủ rau thơm và nước chấm đặc biệt của nhà hàng.',
    price: 70000,
    image: 'https://images.unsplash.com/photo-1636474498689-27e2d3ecf8d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY2hpY2tlbiUyMHBobyUyMG5vb2RsZSUyMHNvdXB8ZW58MXx8fHwxNzU5NjgzODU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Phở',
    restaurantId: '1'
  },
  {
    id: '3',
    name: 'Bánh Mì Thịt Nướng',
    description: 'Bánh mì Việt Nam truyền thống với vỏ giòn rụm, ruột mềm. Thịt heo nướng than hoa thơm lừng, pate gan tự làm, rau cải, cà rót, đồ chua và tương ớt đặc biệt.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1524062008239-962eb6d3383d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYmFuaCUyMG1pJTIwc2FuZHdpY2h8ZW58MXx8fHwxNzU5NjcyOTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bánh Mì',
    restaurantId: '1'
  },
  {
    id: '8',
    name: 'Bún Chả Hà Nội',
    description: 'Món bún chả Hà Nội chính gốc với thịt nướng than hoa thơm ngon, chả viên đặc biệt, bún tươi. Nước chấm chua ngọt đậm đà, rau sống tươi mát và nem cua bể giòn tan.',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1594020293008-5f99f60bd4d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwZnJlc2glMjBzcHJpbmclMjByb2xsc3xlbnwxfHx8fDE3NTk2NzM5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bún',
    restaurantId: '1'
  },
  {
    id: '104',
    name: 'Phở Tái',
    description: 'Phở bò tái với thịt bò tái mỏng như giấy, tươi ngon, nước dùng trong vắt ninh từ xương bò. Ăn kèm rau thơm và chanh tươi.',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1579866997815-ecbb27a4dd43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwYmVlZiUyMHNwZWNpYWx8ZW58MXx8fHwxNzU5NjcyOTIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Phở',
    restaurantId: '1'
  },
  {
    id: '105',
    name: 'Phở Chín',
    description: 'Phở bò chín truyền thống với thịt bò chín mềm ngon, nước dùng đậm đà thơm lừng. Món phở an toàn cho mọi lứa tuổi.',
    price: 70000,
    image: 'https://images.unsplash.com/photo-1579866997815-ecbb27a4dd43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwYmVlZiUyMHNwZWNpYWx8ZW58MXx8fHwxNzU5NjcyOTIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Phở',
    restaurantId: '1'
  },
  {
    id: '106',
    name: 'Bánh Mì Pâté',
    description: 'Bánh mì pâté truyền thống với pâté gan tự làm thơm ngon, rau thơm tươi mát, đồ chua giòn giòn và tương ớt đặc biệt.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1524062008239-962eb6d3383d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYmFuaCUyMG1pJTIwc2FuZHdpY2h8ZW58MXx8fHwxNzU5NjcyOTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bánh Mì',
    restaurantId: '1'
  },
  {
    id: '107',
    name: 'Bánh Mì Chả Cá',
    description: 'Bánh mì chả cá Hà Nội với chả cá thơm lừng, thêm thì là, rau thơm và bún tươi. Hương vị đặc trưng khó quên.',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1524062008239-962eb6d3383d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYmFuaCUyMG1pJTIwc2FuZHdpY2h8ZW58MXx8fHwxNzU5NjcyOTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bánh Mì',
    restaurantId: '1'
  },
  {
    id: '108',
    name: 'Bánh Mì Xíu Mại',
    description: 'Bánh mì xíu mại với những viên xíu mại mềm thơm, nước sốt đậm đà, rau sống tươi và đồ chua chua ngọt.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1524062008239-962eb6d3383d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYmFuaCUyMG1pJTIwc2FuZHdpY2h8ZW58MXx8fHwxNzU5NjcyOTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bánh Mì',
    restaurantId: '1'
  },
  {
    id: '109',
    name: 'Bún Bò Nam Bộ',
    description: 'Bún bò Nam Bộ đặc biệt với thịt bò nướng thơm ngon, rau thơm đa dạng, đậu phộng rang và nước mắm chua ngọt.',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1594020293008-5f99f60bd4d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwZnJlc2glMjBzcHJpbmclMjByb2xsc3xlbnwxfHx8fDE3NTk2NzM5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bún',
    restaurantId: '1'
  },
  {
    id: '110',
    name: 'Bún Riêu',
    description: 'Bún riêu cua đồng với nước dùng chua ngọt từ cua đồng, cà chua, đậu hũ và rau muống. Thơm ngon đậm đà.',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1594020293008-5f99f60bd4d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwZnJlc2glMjBzcHJpbmclMjByb2xsc3xlbnwxfHx8fDE3NTk2NzM5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bún',
    restaurantId: '1'
  },
  {
    id: '111',
    name: 'Bún Chả Cá',
    description: 'Bún chả cá Hà Nội với chả cá thơm lừng, thì là tươi, bún tươi và nước mắm chấm đậm đà. Món ăn đặc trưng của thủ đô.',
    price: 70000,
    image: 'https://images.unsplash.com/photo-1594020293008-5f99f60bd4d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwZnJlc2glMjBzcHJpbmclMjByb2xsc3xlbnwxfHx8fDE3NTk2NzM5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bún',
    restaurantId: '1'
  },

  // Phở Hà Nội - Đồ uống
  {
    id: '101',
    name: 'Nước Lọc',
    description: 'Nước lọc tinh khiết chai 500ml, mát lạnh.',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1757332051114-ae8c79214cef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NvbnV0JTIwd2F0ZXIlMjBmcmVzaCUyMHRyb3BpY2FsfGVufDF8fHx8MTc1OTY3Mzk5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Đồ Uống',
    restaurantId: '1'
  },
  {
    id: '102',
    name: 'Nước Dừa Tươi',
    description: 'Nước dừa tươi ngọt mát, giải khát tuyệt vời. Dừa xiêm xanh tươi hái trong ngày.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1757332051114-ae8c79214cef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NvbnV0JTIwd2F0ZXIlMjBmcmVzaCUyMHRyb3BpY2FsfGVufDF8fHx8MTc1OTY3Mzk5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Đồ Uống',
    restaurantId: '1'
  },
  {
    id: '103',
    name: 'Trà Đá',
    description: 'Trà đá truyền thống Việt Nam, thơm mát, giá phải chăng.',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Đồ Uống',
    restaurantId: '1'
  },

  // Pizza Heaven
  {
    id: '4',
    name: 'Pizza Margherita',
    description: 'Pizza Margherita cổ điển từ Napoli với đế bánh mỏng giòn, sốt cà chua San Marzano DOP, mozzarella di Bufala tươi, lá basil tươi và dầu olive extra virgin. Nướng trong lò đá 450°C.',
    price: 144000,
    originalPrice: 180000,
    image: 'https://images.unsplash.com/photo-1759283391598-83b0ceb0faef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emElMjBmcmVzaCUyMG1venphcmVsbGF8ZW58MXx8fHwxNzU5NjcyOTMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Pizza',
    restaurantId: '2',
    isAvailable: true,
    toppings: [
      { id: 'pizza_size', name: 'Kích thước', price: 0, required: true },
      { id: 'extra_cheese', name: 'Phô mai thêm', price: 30000 },
      { id: 'extra_basil', name: 'Lá basil thêm', price: 15000 },
      { id: 'chili_flakes', name: 'Ớt bột', price: 5000 }
    ],
    ingredients: [
      'Bột mì Caputo Tipo 00', 'Sốt cà chua San Marzano DOP', 
      'Mozzarella di Bufala Campana', 'Lá basil tươi', 
      'Dầu olive Extra Virgin', 'Muối biển Sicilia'
    ],
    allergens: ['Gluten', 'Dairy'],
    nutrition: {
      calories: 320,
      protein: 18,
      carbs: 42,
      fat: 16
    }
  },
  {
    id: '5',
    name: 'Pizza Pepperoni',
    description: 'Pizza pepperoni kinh điển với lớp phô mai mozzarella tan chảy, pepperoni Italy cao cấp cay nồng, đế bánh giòn mỏng và sốt cà chua đặc biệt. Rắc thêm oregano và parmesan.',
    price: 220000,
    image: 'https://images.unsplash.com/photo-1754799565151-e24cd6ea61e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXBwZXJvbmklMjBwaXp6YSUyMGNoZWVzZSUyMG1lbHRlZHxlbnwxfHx8fDE3NTk2ODM4NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Pizza',
    restaurantId: '2'
  },
  {
    id: '9',
    name: 'Pizza Quattro Stagioni',
    description: 'Pizza 4 mùa với 4 phần riêng biệt: nấm mushroom, artichoke, prosciutto và olive đen. Mozzarella tươi, sốt cà chua thảo mộc và đế bánh lên men tự nhiên 24h.',
    price: 260000,
    image: 'https://images.unsplash.com/photo-1758448500799-0162cffd85d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwaXp6YSUyMHJlc3RhdXJhbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk2NzI5MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Pizza',
    restaurantId: '2'
  },
  {
    id: '10',
    name: 'Pasta Carbonara',
    description: 'Pasta carbonara Roma truyền thống với mì spaghetti al dente, trứng gà tươi, phô mai Pecorino Romano, pancetta giòn và tiêu đen hạt. Không kem, chỉ kỹ thuật và nguyên liệu chất lượng.',
    price: 195000,
    image: 'https://images.unsplash.com/photo-1759283391598-83b0ceb0faef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emElMjBmcmVzaCUyMG1venphcmVsbGF8ZW58MXx8fHwxNzU5NjcyOTMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Pasta',
    restaurantId: '2'
  },
  {
    id: '201',
    name: 'Pizza Diavola',
    description: 'Pizza cay nồng với salami piccante, ớt jalapeño, mozzarella và sốt cà chua cay. Cho những ai yêu thích hương vị mạnh mẽ.',
    price: 240000,
    image: 'https://images.unsplash.com/photo-1609732858591-725d6f2af10b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXBwZXJvbmklMjBwaXp6YSUyMGNoZWVzZXxlbnwxfHx8fDE3NTk2NzI5MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Pizza',
    restaurantId: '2'
  },
  {
    id: '202',
    name: 'Pasta Bolognese',
    description: 'Pasta Bolognese với sốt thịt bò ninh 4 tiếng, mì tagliatelle thủ công và phô mai Parmigiano Reggiano. Công thức gia truyền từ Bologna.',
    price: 210000,
    image: 'https://images.unsplash.com/photo-1759283391598-83b0ceb0faef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emElMjBmcmVzaCUyMG1venphcmVsbGF8ZW58MXx8fHwxNzU5NjcyOTMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Pasta',
    restaurantId: '2'
  },
  {
    id: '203',
    name: 'Pasta Pesto',
    description: 'Pasta pesto với sốt basil tươi, hạt thông, tỏi, dầu olive và Parmigiano. Mì linguine al dente, hương vị tươi mát từ Liguria.',
    price: 185000,
    image: 'https://images.unsplash.com/photo-1759283391598-83b0ceb0faef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwYmVlZiUyMHNwZWNpYWx8ZW58MXx8fHwxNzU5NjcyOTIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Pasta',
    restaurantId: '2'
  },
  {
    id: '204',
    name: 'Pasta Amatriciana',
    description: 'Pasta Amatriciana cổ điển với pancetta, cà chua San Marzano, ớt đỏ và Pecorino Romano. Hương vị đậm đà từ vùng Lazio.',
    price: 200000,
    image: 'https://images.unsplash.com/photo-1759283391598-83b0ceb0faef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwYmVlZiUyMHNwZWNpYWx8ZW58MXx8fHwxNzU5NjcyOTIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Pasta',
    restaurantId: '2'
  },

  // Sushi Tokyo
  {
    id: '6',
    name: 'Sushi Set A',
    description: 'Set sushi cao cấp 12 miếng gồm: sake (cá hồi), maguro (cá ngừ), ebi (tôm), tamago (trứng) và ikura (trứng cá hồi). Gạo sushi Koshihikari, wasabi tươi và shoyu đặc biệt.',
    price: 350000,
    image: 'https://images.unsplash.com/photo-1630748662890-11623a758d6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwc2V0JTIwcGxhdHRlcnxlbnwxfHx8fDE3NTk2NzI5MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Sushi',
    restaurantId: '3'
  },
  {
    id: '7',
    name: 'Sashimi Cá Hồi',
    description: 'Sashimi cá hồi Atlantic tươi sống cao cấp, cắt lát mỏng theo kỹ thuật yanagiba truyền thống. Cá nhập khẩu từ Na Uy, độ tươi sashimi grade, ăn kèm wasabi tươi và gari.',
    price: 280000,
    image: 'https://images.unsplash.com/photo-1758384075930-6e3835d22b1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbG1vbiUyMHNhc2hpbWklMjBzbGljZXxlbnwxfHx8fDE3NTk2ODM4NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Sashimi',
    restaurantId: '3',
    isAvailable: false // Hết hàng để test E1
  },
  {
    id: '11',
    name: 'Chirashi Bowl',
    description: 'Chirashi bowl đặc biệt với 8 loại sashimi tươi ngon trên nền cơm sushi: cá hồi, cá ngừ, cá bụng, tôm, mực, trứng cá và tamago. Kèm súp miso và salad rong biển.',
    price: 420000,
    image: 'https://images.unsplash.com/photo-1639650538773-ffe1d8ad9d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NTk1ODc4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Chirashi',
    restaurantId: '3'
  },
  {
    id: '12',
    name: 'Tempura Set',
    description: 'Set tempura kinh điển với tôm, cà tím, bí ngòi, nấm shitake và rau củ theo mùa. Bột tempura mỏng giòn, dầu chiên nhiệt độ hoàn hảo, ăn kèm tentsuyu và daikon oroshi.',
    price: 320000,
    image: 'https://images.unsplash.com/photo-1630748662890-11623a758d6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwc2V0JTIwcGxhdHRlcnxlbnwxfHx8fDE3NTk2NzI5MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Tempura',
    restaurantId: '3'
  },
  {
    id: '301',
    name: 'Sushi Set B',
    description: 'Set sushi cao cấp 16 miếng với tuna, salmon, yellowtail, sea bream và uni. Gạo sushi premium, wasabi tươi từ Shizuoka.',
    price: 480000,
    image: 'https://images.unsplash.com/photo-1630748662890-11623a758d6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwc2V0JTIwcGxhdHRlcnxlbnwxfHx8fDE3NTk2NzI5MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Sushi',
    restaurantId: '3'
  },
  {
    id: '302',
    name: 'Sushi Set C',
    description: 'Set sushi deluxe 20 miếng với otoro, chutoro, amaebi, ika và ikºra. Dành cho những người sành ăn, cá tươi nhập khẩu hàng ngày.',
    price: 650000,
    image: 'https://images.unsplash.com/photo-1630748662890-11623a758d6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwc2V0JTIwcGxhdHRlcnxlbnwxfHx8fDE3NTk2NzI5MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Sushi',
    restaurantId: '3'
  },
  {
    id: '303',
    name: 'Sushi Omakase',
    description: 'Omakase của đầu bếp với 12 món sushi và sashimi theo mùa. Trải nghiệm đỉnh cao ẩm thực Nhật Bản, không thể đặt trước.',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1630748662890-11623a758d6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwc2V0JTIwcGxhdHRlcnxlbnwxfHx8fDE3NTk2NzI5MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Sushi',
    restaurantId: '3'
  },
  {
    id: '304',
    name: 'Sashimi Tuna',
    description: 'Sashimi cá ngừ đại dương cao cấp, thái lát dày, tan trong miệng. Độ tươi sashimi grade AAA, ăn kèm wasabi và shoyu.',
    price: 320000,
    image: 'https://images.unsplash.com/photo-1646408814483-de1127ddc5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjBzYXNoaW1pJTIwZnJlc2glMjBmaXNofGVufDF8fHx8MTc1OTY3MjkzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Sashimi',
    restaurantId: '3'
  },
  {
    id: '305',
    name: 'Sashimi Yellowtail',
    description: 'Sashimi cá bụng vàng (hamachi) béo ngậy, thịt mềm mại. Cá tươi từ vùng biển Kyushu, cắt theo kỹ thuật truyền thống.',
    price: 360000,
    image: 'https://images.unsplash.com/photo-1646408814483-de1127ddc5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjBzYXNoaW1pJTIwZnJlc2glMjBmaXNofGVufDF8fHx8MTc1OTY3MjkzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Sashimi',
    restaurantId: '3'
  },
  {
    id: '306',
    name: 'Sashimi Mixed',
    description: 'Sashimi tổng hợp với 6 loại cá tươi: salmon, tuna, yellowtail, sea bream, mackerel và sweet shrimp. Đa dạng hương vị.',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1646408814483-de1127ddc5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjBzYXNoaW1pJTIwZnJlc2glMjBmaXNofGVufDF8fHx8MTc1OTY3MjkzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Sashimi',
    restaurantId: '3'
  },
  {
    id: '307',
    name: 'Chirashi Premium',
    description: 'Chirashi bowl cao cấp với 10 loại sashimi tốt nhất, trứng cá hồi, uni và tamago trên cơm sushi. Bữa ăn hoàn hảo.',
    price: 580000,
    image: 'https://images.unsplash.com/photo-1639650538773-ffe1d8ad9d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NTk1ODc4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Chirashi',
    restaurantId: '3'
  },
  {
    id: '308',
    name: 'Chirashi Salmon',
    description: 'Chirashi bowl cá hồi đặc biệt với nhiều loại cá hồi: tái, nướng, sashimi. Cơm sushi thơm ngon, rong biển và wasabi.',
    price: 380000,
    image: 'https://images.unsplash.com/photo-1639650538773-ffe1d8ad9d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NTk1ODc4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Chirashi',
    restaurantId: '3'
  },
  {
    id: '309',
    name: 'Chirashi Vegetarian',
    description: 'Chirashi chay với tamago, inari, avocado, cucumber, rong biển và shiitake nướng. Lựa chọn tuyệt vời cho người ăn chay.',
    price: 280000,
    image: 'https://images.unsplash.com/photo-1639650538773-ffe1d8ad9d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NTk1ODc4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Chirashi',
    restaurantId: '3'
  },
  {
    id: '310',
    name: 'Tempura Shrimp',
    description: 'Tempura tôm cao cấp với 8 con tôm sú lớn, bột tempura giòn tan, dầu sesame thơm. Ăn kèm tentsuyu và daikon.',
    price: 380000,
    image: 'https://images.unsplash.com/photo-1630748662890-11623a758d6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwc2V0JTIwcGxhdHRlcnxlbnwxfHx8fDE3NTk2NzI5MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Tempura',
    restaurantId: '3'
  },
  {
    id: '311',
    name: 'Tempura Vegetables',
    description: 'Tempura rau củ đa dạng: bí ngòi, cà tím, nấm shitake, ớt shishito. Tươi ngon, giòn tan, phù hợp người ăn chay.',
    price: 280000,
    image: 'https://images.unsplash.com/photo-1630748662890-11623a758d6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwc2V0JTIwcGxhdHRlcnxlbnwxfHx8fDE3NTk2NzI5MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Tempura',
    restaurantId: '3'
  },
  {
    id: '312',
    name: 'Tempura Fish',
    description: 'Tempura cá trắng (white fish) với bột tempura mỏng, thịt cá tươi ngọt. Kèm nước chấm ponzu và rau củ nhỏ.',
    price: 340000,
    image: 'https://images.unsplash.com/photo-1630748662890-11623a758d6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwc2V0JTIwcGxhdHRlcnxlbnwxfHx8fDE3NTk2NzI5MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Tempura',
    restaurantId: '3'
  },

  // Bún Bò Huế Authentique
  {
    id: '13',
    name: 'Bún Bò Huế Đặc Biệt',
    description: 'Bún bò Huế chuẩn vị cố đô với nước lèo đỏ đặc trưng ninh từ xương ống bò, heo và sả. Thịt bò tái, chả cua Huế, giò heo, ăn kèm rau thơm miền Trung và tôm chua.',
    price: 78000,
    image: 'https://images.unsplash.com/photo-1573555957315-723d970bcdde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwYm8lMjBodWUlMjBzcGljeSUyMHNvdXB8ZW58MXx8fHwxNzU5NjcyOTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bún',
    restaurantId: '4'
  },
  {
    id: '14',
    name: 'Bánh Khoái Huế',
    description: 'Bánh khoái Huế truyền thống với vỏ bánh giòn tan, tôm tươi, thịt ba chỉ, giá đỗ và trứng. Ăn kèm rau sống đặc trưng Huế và nước chấm lèo chua ngọt đậm đà.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1715168438603-4dc3452f2f4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwYm8lMjBodWUlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1OTY3MjkxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bánh',
    restaurantId: '4'
  },
  {
    id: '401',
    name: 'Bún Bò Huế Thường',
    description: 'Bún bò Huế truyền thống với nước lèo đỏ đậm đà, thịt bò và chả, rau thơm tươi. Phiên bản classic cho mọi người.',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1573555957315-723d970bcdde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwYm8lMjBodWUlMjBzcGljeSUyMHNvdXB8ZW58MXx8fHwxNzU5NjcyOTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bún',
    restaurantId: '4'
  },
  {
    id: '402',
    name: 'Bún Bò Huế Chay',
    description: 'Bún bò Huế chay với nước lèo từ nấm và rau củ, đậu hũ, nấm các loại và rau thơm. Đậm đà không kém phiên bản thịt.',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1573555957315-723d970bcdde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwYm8lMjBodWUlMjBzcGljeSUyMHNvdXB8ZW58MXx8fHwxNzU5NjcyOTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bún',
    restaurantId: '4'
  },
  {
    id: '403',
    name: 'Bún Bò Huế Tôm Cua',
    description: 'Bún bò Huế đặc biệt với tôm sú, cua đồng, chả cua và thịt bò. Nước lèo đậm đà từ xương cua, hương vị biển cả.',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1573555957315-723d970bcdde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwYm8lMjBodWUlMjBzcGljeSUyMHNvdXB8ZW58MXx8fHwxNzU5NjcyOTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bún',
    restaurantId: '4'
  },
  {
    id: '404',
    name: 'Bánh Bèo Huế',
    description: 'Bánh bèo Huế tinh tế với vỏ bánh mềm, tôm khô, mỡ hành và nước mắm chấm đặc trưng. Set 8 chiếc bánh bèo thơm ngon.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1715168438603-4dc3452f2f4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwYm8lMjBodWUlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1OTY3MjkxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bánh',
    restaurantId: '4'
  },
  {
    id: '405',
    name: 'Bánh Nậm Huế',
    description: 'Bánh nậm Huế với vỏ bánh từ bột nếp, nhân tôm thịt thơm ngon, gói lá chuối. Hấp chín, ăn kèm nước mắm pha.',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1715168438603-4dc3452f2f4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwYm8lMjBodWUlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1OTY3MjkxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bánh',
    restaurantId: '4'
  },
  {
    id: '406',
    name: 'Bánh Lọc Huế',
    description: 'Bánh lọc Huế trong suốt với nhân tôm thịt, vỏ bánh từ bột năng và bột gạo. Hấp trong lá chuối, ăn kèm tương.',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1715168438603-4dc3452f2f4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYnVuJTIwYm8lMjBodWUlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1OTY3MjkxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bánh',
    restaurantId: '4'
  },

  // Burger Station
  {
    id: '15',
    name: 'Classic Beef Burger',
    description: 'Burger bò kinh điển với patty bò Angus 180g xay tươi, pho mai cheddar, rau diếp, cà chua, hành tây caramel và sốt đặc biệt. Bánh brioche nướng vàng, kèm fries khoai tây Idaho.',
    price: 148000,
    originalPrice: 185000,
    image: 'https://images.unsplash.com/photo-1591336277697-cdae7e42dead?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwYmVlZiUyMGJ1cmdlciUyMGZyaWVzfGVufDF8fHx8MTc1OTY4Mzg3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Burger',
    restaurantId: '5'
  },
  {
    id: '16',
    name: 'BBQ Bacon Burger',
    description: 'Burger BBQ với double patty bò Angus, bacon giòn, pho mai smoked cheddar, hành tây chiên giòn và sốt BBQ đặc biệt. Bánh sesame seed bun, kèm onion rings và coleslaw.',
    price: 225000,
    image: 'https://images.unsplash.com/photo-1679344600900-87a98b85c01f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWVyaWNhbiUyMGJ1cmdlciUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjcyOTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Burger',
    restaurantId: '5'
  },
  {
    id: '501',
    name: 'Chicken Burger',
    description: 'Burger gà giòn với ức gà tẩm bột chiên vàng, rau diếp, cà chua, mayo và sốt ranch. Bánh brioche mềm, kèm khoai tây chiên.',
    price: 165000,
    image: 'https://images.unsplash.com/photo-1586540480250-e3a0717298b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWVyaWNhbiUyMGNoZWVzZWJ1cmdlciUyMGZyaWVzfGVufDF8fHx8MTc1OTY3Mjk0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Burger',
    restaurantId: '5'
  },
  {
    id: '502',
    name: 'Fish Burger',
    description: 'Burger cá với phi lê cá tuyết chiên giòn, sốt tartar, rau diếp và cà chua. Bánh sesame bun, kèm coleslaw và pickles.',
    price: 175000,
    image: 'https://images.unsplash.com/photo-1586540480250-e3a0717298b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWVyaWNhbiUyMGNoZWVzZWJ1cmdlciUyMGZyaWVzfGVufDF8fHx8MTc1OTY3Mjk0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Burger',
    restaurantId: '5'
  },
  {
    id: '503',
    name: 'Veggie Burger',
    description: 'Burger chay với patty từ đậu đen, quinoa và rau củ, avocado, rau diếp, cà chua và sốt chipotle. Bánh wholewheat bun.',
    price: 155000,
    image: 'https://images.unsplash.com/photo-1586540480250-e3a0717298b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWVyaWNhbiUyMGNoZWVzZWJ1cmdlciUyMGZyaWVzfGVufDF8fHx8MTc1OTY3Mjk0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Burger',
    restaurantId: '5'
  },

  // Pad Thai Corner
  {
    id: '17',
    name: 'Pad Thai Tôm',
    description: 'Pad Thai chính gốc với tôm tươi size lớn, bánh phở tươi, trứng, đậu phộng rang, giá đỗ và rau củ. Sốt tamarind, nước mắm nguyên chất và ớt Thái đặc trưng. Chua ngọt cay đậm đà.',
    price: 76000,
    originalPrice: 95000,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwcGFkJTIwdGhhaSUyMG5vb2RsZXMlMjBzaHJpbXB8ZW58MXx8fHwxNzU5NjgzODc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Mì',
    restaurantId: '6'
  },
  {
    id: '18',
    name: 'Tom Yum Goong',
    description: 'Tom Yum Goong chua cay kinh điển với tôm sú tươi, nấm rơm, cà chua cherry, sả, lá chanh và ớt Thái. Nước dùng trong vắt, thơm lừng với nước mắm cá cơm và lime tươi.',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1571809839227-b2ac3d261257?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwdG9tJTIweXVtJTIwc291cCUyMHNwaWN5fGVufDF8fHx8MTc1OTY3Mjk1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Soup',
    restaurantId: '6'
  },
  {
    id: '19',
    name: 'Green Curry Gà',
    description: 'Green Curry Thái đặc trưng với gà thái miếng, cà tím tím, đậu cove, lá basil Thái và nước cốt dừa đặc. Cà ri xanh cay nồng từ ớt xanh tươi, galangal và lemongrass.',
    price: 110000,
    image: 'https://images.unsplash.com/photo-1675150303909-1bb94e33132f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwcmVzdGF1cmFudCUyMHBhZCUyMHRoYWl8ZW58MXx8fHwxNzU5NjcyOTE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Curry',
    restaurantId: '6'
  },
  {
    id: '601',
    name: 'Pad Thai Gà',
    description: 'Pad Thai truyền thống với thịt gà tươi, bánh phở, trứng, đậu phộng và rau củ. Sốt tamarind đậm đà, vị chua ngọt cân bằng.',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1757845301698-da07924946a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwcGFkJTIwdGhhaSUyMG5vb2RsZXN8ZW58MXx8fHwxNzU5NjcyOTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Mì',
    restaurantId: '6'
  },
  {
    id: '602',
    name: 'Pad Thai Chay',
    description: 'Pad Thai chay với đậu hũ, rau củ đa dạng, bánh phở và đậu phộng. Không thịt nhưng vẫn đậm đà hương vị Thái.',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1757845301698-da07924946a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwcGFkJTIwdGhhaSUyMG5vb2RsZXN8ZW58MXx8fHwxNzU5NjcyOTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Mì',
    restaurantId: '6'
  },
  {
    id: '603',
    name: 'Pad See Ew',
    description: 'Pad See Ew với mì to, thịt heo, rau cải, trứng và sốt đậu nành đen. Hương vị đậm đà, ngọt ngào đặc trưng.',
    price: 90000,
    image: 'https://images.unsplash.com/photo-1757845301698-da07924946a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwcGFkJTIwdGhhaSUyMG5vb2RsZXN8ZW58MXx8fHwxNzU5NjcyOTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Mì',
    restaurantId: '6'
  },
  {
    id: '604',
    name: 'Tom Yum Gà',
    description: 'Tom Yum Gà chua cay với thịt gà tươi, nấm rơm, cà chua cherry và gia vị Thái. Nước dùng trong vắt, chua cay đúng điệu.',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1571809839227-b2ac3d261257?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwdG9tJTIweXVtJTIwc291cCUyMHNwaWN5fGVufDF8fHx8MTc1OTY3Mjk1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Soup',
    restaurantId: '6'
  },
  {
    id: '605',
    name: 'Tom Kha Gà',
    description: 'Tom Kha Gà với nước cốt dừa, thịt gà, nấm, galangal và lá chanh. Soup kem béo ngậy, vị chua nhẹ và thơm lừng.',
    price: 105000,
    image: 'https://images.unsplash.com/photo-1571809839227-b2ac3d261257?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwdG9tJTIweXVtJTIwc291cCUyMHNwaWN5fGVufDF8fHx8MTc1OTY3Mjk1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Soup',
    restaurantId: '6'
  },
  {
    id: '606',
    name: 'Tom Yum Chay',
    description: 'Tom Yum chay với đậu hũ, nấm các loại, cà chua và rau củ. Vị chua cay đặc trưng nhưng hoàn toàn thuần chay.',
    price: 80000,
    image: 'https://images.unsplash.com/photo-1571809839227-b2ac3d261257?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwdG9tJTIweXVtJTIwc291cCUyMHNwaWN5fGVufDF8fHx8MTc1OTY3Mjk1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Soup',
    restaurantId: '6'
  },
  {
    id: '607',
    name: 'Red Curry Bò',
    description: 'Red Curry đỏ cay nồng với thịt bò, cà tím, đậu cove và nước cốt dừa. Curry paste tự làm, cay đậm đà đặc trưng.',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1675150303909-1bb94e33132f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwcmVzdGF1cmFudCUyMHBhZCUyMHRoYWl8ZW58MXx8fHwxNzU5NjcyOTE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Curry',
    restaurantId: '6'
  },
  {
    id: '608',
    name: 'Yellow Curry Gà',
    description: 'Yellow Curry vàng nhẹ nhàng với thịt gà, khoai tây, hành tây và nước cốt dừa. Vị ngọt dịu, không cay, phù hợp mọi người.',
    price: 100000,
    image: 'https://images.unsplash.com/photo-1675150303909-1bb94e33132f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwcmVzdGF1cmFudCUyMHBhZCUyMHRoYWl8ZW58MXx8fHwxNzU5NjcyOTE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Curry',
    restaurantId: '6'
  },
  {
    id: '609',
    name: 'Massaman Curry',
    description: 'Massaman Curry ngọt đậm đà với thịt bò, khoai tây, đậu phộng và gia vị ấn độ. Curry phức tạp nhất của Thái Lan.',
    price: 130000,
    image: 'https://images.unsplash.com/photo-1675150303909-1bb94e33132f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwcmVzdGF1cmFudCUyMHBhZCUyMHRoYWl8ZW58MXx8fHwxNzU5NjcyOTE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Curry',
    restaurantId: '6'
  },

  // Cà Phê Sài Gòn - Đồ uống
  {
    id: '701',
    name: 'Cà Phê Đen Đá',
    description: 'Cà phê đen Robusta Buôn Ma Thuột rang mộc, pha phin truyền thống, đậm đà, thơm lừng. Uống kèm đá lạnh giải nhiệt.',
    price: 20000,
    originalPrice: 25000,
    image: 'https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Cà Phê',
    restaurantId: '7',
    isAvailable: true,
    toppings: [
      { id: 'coffee_strength', name: 'Độ đậm', price: 0, required: true },
      { id: 'extra_shot', name: 'Thêm shot', price: 15000 },
      { id: 'less_ice', name: 'Ít đá', price: 0 }
    ],
    ingredients: [
      'Hạt cà phê Robusta Buôn Ma Thuột', 'Nước tinh khiết', 
      'Đá lạnh', 'Phin nhôm truyền thống'
    ],
    allergens: ['Caffeine'],
    nutrition: {
      calories: 5,
      protein: 0.3,
      carbs: 1,
      fat: 0
    }
  },
  {
    id: '702',
    name: 'Cà Phê Sữa Đá',
    description: 'Cà phê phin Việt Nam kết hợp sữa đặc ngọt ngào, tạo nên hương vị đặc trưng không thể nhầm lẫn của Sài Gòn.',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Cà Phê',
    restaurantId: '7'
  },
  {
    id: '703',
    name: 'Trà Sen Vàng',
    description: 'Trà sen Hà Nội thơm lừng với hạt sen tươi, mật ong thiên nhiên. Thanh mát, thanh lọc cơ thể.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Trà',
    restaurantId: '7'
  },
  {
    id: '704',
    name: 'Sinh Tố Xoài',
    description: 'Sinh tố xoài cát Hòa Lộc mịn mượt, thơm ngon tự nhiên. Không đường, không chất bảo quản.',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1604298331663-de303fbc7059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwc21vb3RoaWV8ZW58MXx8fHwxNzU5NjczNTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Sinh Tố',
    restaurantId: '7'
  },
  {
    id: '705',
    name: 'Trà Sữa Trân Châu',
    description: 'Trà sữa Đài Loan với trân châu dai ngon, trà Ceylon thơm, sữa tươi ngọt ngào. Topping trân châu đen và trân châu trắng.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1627781245399-a1fe415c0046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB0ZWElMjBib2JhJTIwZHJpbmt8ZW58MXx8fHwxNzU5NjczOTgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Trà Sữa',
    restaurantId: '7'
  },
  {
    id: '706',
    name: 'Cà Phê Bạc Xỉu',
    description: 'Cà phê bạc xỉu với nhiều sữa, ít cà phê, ngọt ngào dễ uống. Phù hợp cho người không thích đắng.',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Cà Phê',
    restaurantId: '7'
  },
  {
    id: '707',
    name: 'Cà Phê Espresso',
    description: 'Espresso Việt Nam đậm đà, pha theo style Italy nhưng dùng hạt Robusta Buôn Ma Thuột. Đắng ngọt hậu vị.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Cà Phê',
    restaurantId: '7'
  },
  {
    id: '708',
    name: 'Cà Phê Cappuccino',
    description: 'Cappuccino Việt Nam với espresso đậm, sữa tươi và bọt sữa mịn. Rắc bột cacao, phong cách Âu - Á.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Cà Phê',
    restaurantId: '7'
  },
  {
    id: '709',
    name: 'Trà Olong Đài Loan',
    description: 'Trà Olong cao cấp từ Đài Loan, vị ngọt tự nhiên, thơm lâu. Pha theo phong cách Công phu trà truyền thống.',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Trà',
    restaurantId: '7'
  },
  {
    id: '710',
    name: 'Trà Đào Cam Sã',
    description: 'Trà đào cam sã tươi mát với đào cắt lát, cam tươi, sả thơm và trà xanh. Đồ uống detox tự nhiên.',
    price: 42000,
    image: 'https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Trà',
    restaurantId: '7'
  },
  {
    id: '711',
    name: 'Trà Atiso Đỏ',
    description: 'Trà atiso đỏ Đà Lạt thanh mát, giải nhiệt tốt. Vị đắng nhẹ, ngọt hậu, tốt cho sức khỏe gan.',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Trà',
    restaurantId: '7'
  },
  {
    id: '712',
    name: 'Sinh Tố Dưa Hấu',
    description: 'Sinh tố dưa hấu tươi mát, ngọt tự nhiên, giải khát tuyệt vời. Không đường, không chất bảo quản.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1604298331663-de303fbc7059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwc21vb3RoaWV8ZW58MXx8fHwxNzU5NjczNTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Sinh Tố',
    restaurantId: '7'
  },
  {
    id: '713',
    name: 'Sinh Tố Bơ',
    description: 'Sinh tố bơ Đà Lạt béo ngậy, thơm ngon với sữa tươi và đá. Bổ dưỡng, giàu vitamin tự nhiên.',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1604298331663-de303fbc7059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwc21vb3RoaWV8ZW58MXx8fHwxNzU5NjczNTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Sinh Tố',
    restaurantId: '7'
  },
  {
    id: '714',
    name: 'Sinh Tố Dâu',
    description: 'Sinh tố dâu tây Đà Lạt chua ngọt, màu đỏ đẹp mắt. Tươi mát, giàu vitamin C và chất chống oxy hóa.',
    price: 42000,
    image: 'https://images.unsplash.com/photo-1604298331663-de303fbc7059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwc21vb3RoaWV8ZW58MXx8fHwxNzU5NjczNTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Sinh Tố',
    restaurantId: '7'
  },
  {
    id: '715',
    name: 'Trà Sữa Matcha',
    description: 'Trà sữa matcha Nhật Bản với bột trà xanh thượng hạng, sữa tươi và trân châu. Vị đắng nhẹ, thơm lừng.',
    price: 48000,
    image: 'https://images.unsplash.com/photo-1627781245399-a1fe415c0046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB0ZWElMjBib2JhJTIwZHJpbmt8ZW58MXx8fHwxNzU5NjczOTgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Trà Sữa',
    restaurantId: '7'
  },
  {
    id: '716',
    name: 'Trà Sữa Taro',
    description: 'Trà sữa khoai môn tím với vị ngọt béo đặc trưng, màu tím đẹp mắt. Trân châu dai ngon, topping phong phú.',
    price: 46000,
    image: 'https://images.unsplash.com/photo-1627781245399-a1fe415c0046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB0ZWElMjBib2JhJTIwZHJpbmt8ZW58MXx8fHwxNzU5NjczOTgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Trà Sữa',
    restaurantId: '7'
  },
  {
    id: '717',
    name: 'Trà Sữa Socola',
    description: 'Trà sữa socola đậm đà với bột cacao Bỉ, sữa tươi và trân châu. Ngọt ngào, thơm lừng hương chocolate.',
    price: 47000,
    image: 'https://images.unsplash.com/photo-1627781245399-a1fe415c0046?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWJibGUlMjB0ZWElMjBib2JhJTIwZHJpbmt8ZW58MXx8fHwxNzU5NjczOTgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Trà Sữa',
    restaurantId: '7'
  },

  // Seoul BBQ House
  {
    id: '801',
    name: 'Bulgogi Beef',
    description: 'Thịt bò Wagyu A5 thái lát mỏng, ướp sốt bulgogi truyền thống với lê, nước tương, mắm tôm. Nướng than hoa, ăn kèm kimchi và banchan.',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYXJiZWN1ZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NTg4MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'BBQ',
    restaurantId: '8'
  },
  {
    id: '802',
    name: 'Kimchi Jjigae',
    description: 'Canh kimchi chua cay đặc trưng với kimchi lên men 3 tháng, thịt heo ba chỉ, đậu phụ và rau củ. Nước dùng đậm đà, ấm nóng.',
    price: 180000,
    image: 'https://images.unsplash.com/photo-1743419612786-19d116bb8c40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBraW1jaGklMjBzb3VwJTIwaG90fGVufDF8fHx8MTc1OTY3Mzk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Soup',
    restaurantId: '8'
  },
  {
    id: '803',
    name: 'Soju Original',
    description: 'Soju truyền thống Hàn Quốc 20.1% độ cồn, vị ngọt nhẹ, uống lạnh cùng BBQ.',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Đồ Uống',
    restaurantId: '8'
  },
  {
    id: '804',
    name: 'Galbi Beef',
    description: 'Sườn bò Galbi cao cấp ướp sốt truyền thống, nướng than hoa. Thịt mềm ngọt, ăn kèm kimchi và banchan.',
    price: 580000,
    image: 'https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYXJiZWN1ZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NTg4MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'BBQ',
    restaurantId: '8'
  },
  {
    id: '805',
    name: 'Samgyeopsal',
    description: 'Thịt ba chỉ heo Hàn Quốc nướng giòn, ăn với rau sống, tỏi và các loại banchan. Đậm đà hương vị truyền thống.',
    price: 380000,
    image: 'https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYXJiZWN1ZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NTg4MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'BBQ',
    restaurantId: '8'
  },
  {
    id: '806',
    name: 'Korean Fried Chicken',
    description: 'Gà rán Hàn Quốc giòn tan với sốt gochujang cay ngọt. Da giòn, thịt mềm, vị cay đậm đà khó cưỡng.',
    price: 280000,
    image: 'https://images.unsplash.com/photo-1632558610168-8377309e34c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYXJiZWN1ZSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NTg4MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'BBQ',
    restaurantId: '8'
  },
  {
    id: '807',
    name: 'Sundubu Jjigae',
    description: 'Canh đậu hũ non cay với hải sản, trứng và kimchi. Nước dùng đỏ đậm đà, ấm nóng, tốt cho sức khỏe.',
    price: 160000,
    image: 'https://images.unsplash.com/photo-1743419612786-19d116bb8c40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBraW1jaGklMjBzb3VwJTIwaG90fGVufDF8fHx8MTc1OTY3Mzk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Soup',
    restaurantId: '8'
  },
  {
    id: '808',
    name: 'Doenjang Jjigae',
    description: 'Canh tương đậu truyền thống với đậu hũ, khoai tây, hành lá và rau củ. Vị đậm đà, bổ dưỡng.',
    price: 140000,
    image: 'https://images.unsplash.com/photo-1743419612786-19d116bb8c40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBraW1jaGklMjBzb3VwJTIwaG90fGVufDF8fHx8MTc1OTY3Mzk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Soup',
    restaurantId: '8'
  },
  {
    id: '809',
    name: 'Miyeok Guk',
    description: 'Canh rong biển truyền thống Hàn Quốc với thịt bò, bổ dưỡng cho phụ nữ sau sinh. Trong vắt, ngọt thanh.',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1743419612786-19d116bb8c40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBraW1jaGklMjBzb3VwJTIwaG90fGVufDF8fHx8MTc1OTY3Mzk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Soup',
    restaurantId: '8'
  },

  // Mumbai Curry House
  {
    id: '901',
    name: 'Chicken Tikka Masala',
    description: 'Gà tikka nướng tandoor trong sốt cà ri kem đặc trưng, thơm lừng với garam masala, cardamom và lá cà ri. Ăn kèm basmati rice.',
    price: 220000,
    image: 'https://images.unsplash.com/photo-1690915475414-9aaecfd3ba74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyeSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjYwNTg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Curry',
    restaurantId: '9'
  },
  {
    id: '902',
    name: 'Naan Bread',
    description: 'Bánh naan nướng tươi trong lò tandoor, mềm thơm với bơ ghee. Phù hợp ăn kèm curry.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1690915475414-9aaecfd3ba74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyeSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjYwNTg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bánh',
    restaurantId: '9'
  },
  {
    id: '903',
    name: 'Lassi Xoài',
    description: 'Lassi xoài Ấn Độ truyền thống với sữa chua Hy Lạp, xoài Alphonso và mật ong. Mát lạnh, giải nhiệt.',
    price: 60000,
    image: 'https://images.unsplash.com/photo-1604298331663-de303fbc7059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwc21vb3RoaWV8ZW58MXx8fHwxNzU5NjczNTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Đồ Uống',
    restaurantId: '9'
  },
  {
    id: '904',
    name: 'Butter Chicken',
    description: 'Gà bơ Ấn Độ với sốt cà ri kem béo ngậy, gà nướng tandoor mềm ngọt. Ăn kèm basmati rice và naan.',
    price: 240000,
    image: 'https://images.unsplash.com/photo-1690915475414-9aaecfd3ba74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyeSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjYwNTg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Curry',
    restaurantId: '9'
  },
  {
    id: '905',
    name: 'Lamb Biryani',
    description: 'Cơm Biryani cừu với gạo basmati thơm, thịt cừu ướp gia vị và saffron. Món cơm sang trọng nhất Ấn Độ.',
    price: 320000,
    image: 'https://images.unsplash.com/photo-1690915475414-9aaecfd3ba74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyeSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjYwNTg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Curry',
    restaurantId: '9'
  },
  {
    id: '906',
    name: 'Palak Paneer',
    description: 'Cà ri rau bina với phô mai paneer tự làm, kem chua và gia vị Ấn Độ. Món chay bổ dưỡng, màu xanh đẹp mắt.',
    price: 180000,
    image: 'https://images.unsplash.com/photo-1690915475414-9aaecfd3ba74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyeSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjYwNTg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Curry',
    restaurantId: '9'
  },
  {
    id: '907',
    name: 'Garlic Naan',
    description: 'Bánh naan tỏi nướng tandoor với bơ ghee và tỏi tươi băm. Thơm lừng, giòn ngoài mềm trong.',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1690915475414-9aaecfd3ba74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyeSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjYwNTg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bánh',
    restaurantId: '9'
  },
  {
    id: '908',
    name: 'Cheese Naan',
    description: 'Bánh naan phô mai với nhân phô mai mozzarella tan chảy, nướng trong lò tandoor. Béo ngậy, thơm lừng.',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1690915475414-9aaecfd3ba74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyeSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjYwNTg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bánh',
    restaurantId: '9'
  },
  {
    id: '909',
    name: 'Roti Canai',
    description: 'Bánh roti canai giòn tan với lớp bánh mỏng, ăn kèm cà ri đậu. Bánh nướng tươi, thơm bơ.',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1690915475414-9aaecfd3ba74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjdXJyeSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjYwNTg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bánh',
    restaurantId: '9'
  },

  // Dragon Palace Dim Sum
  {
    id: '1001',
    name: 'Har Gow',
    description: 'Bánh há cảo tôm tinh tế với vỏ trong suốt, nhân tôm tươi ngọt, măng tây giòn. Hấp trong long bàn tre.',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1563538866332-01d4b73d13b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwcmVzdGF1cmFudCUyMGRpbSUyMHN1bXxlbnwxfHx8fDE3NTk2NzM5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Dim Sum',
    restaurantId: '10'
  },
  {
    id: '1002',
    name: 'Siu Mai',
    description: 'Siu mai thịt heo và tôm truyền thống, nhân thịt đậm đà với nấm hương, trứng cút phủ trên. Hấp chín tới.',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1563538866332-01d4b73d13b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwcmVzdGF1cmFudCUyMGRpbSUyMHN1bXxlbnwxfHx8fDE3NTk2NzM5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Dim Sum',
    restaurantId: '10'
  },
  {
    id: '1003',
    name: 'Trà Oolong',
    description: 'Trà Oolong Đài Loan cao cấp, hương thơm thanh tao, vị ngọt dịu tự nhiên. Pha theo phong cách Công phu trà.',
    price: 80000,
    image: 'https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Trà',
    restaurantId: '10'
  },
  {
    id: '1004',
    name: 'Char Siu Bao',
    description: 'Bánh bao char siu với nhân thịt heo nướng ngọt, vỏ bánh mềm xốp. Dim sum kinh điển không thể thiếu.',
    price: 70000,
    image: 'https://images.unsplash.com/photo-1563538866332-01d4b73d13b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwcmVzdGF1cmFudCUyMGRpbSUyMHN1bXxlbnwxfHx8fDE3NTk2NzM5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Dim Sum',
    restaurantId: '10'
  },
  {
    id: '1005',
    name: 'Xiao Long Bao',
    description: 'Tiểu long bao với nhân thịt heo và nước dùng nóng bên trong. Vỏ bánh mỏng, ăn cẩn thận để không bỏng.',
    price: 90000,
    image: 'https://images.unsplash.com/photo-1563538866332-01d4b73d13b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwcmVzdGF1cmFudCUyMGRpbSUyMHN1bXxlbnwxfHx8fDE3NTk2NzM5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Dim Sum',
    restaurantId: '10'
  },
  {
    id: '1006',
    name: 'Cheong Fun',
    description: 'Bánh cuốn Hong Kong với nhân tôm hoặc thịt heo, vỏ bánh trong suốt mềm mịn. Ăn kèm sốt đậu nành ngọt.',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1563538866332-01d4b73d13b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwcmVzdGF1cmFudCUyMGRpbSUyMHN1bXxlbnwxfHx8fDE3NTk2NzM5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Dim Sum',
    restaurantId: '10'
  },
  {
    id: '1007',
    name: 'Trà Phổ Nhĩ',
    description: 'Trà Phổ Nhĩ Vân Nam cao cấp, vị đậm đà, giúp tiêu hóa và giảm mỡ. Thích hợp uống sau bữa ăn dim sum.',
    price: 90000,
    image: 'https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Trà',
    restaurantId: '10'
  },
  {
    id: '1008',
    name: 'Trà Tiết Quan Âm',
    description: 'Trà Tiết Quan Âm thượng hạng với hương thơm quyến rủ, vị ngọt tự nhiên. Trà cao cấp nhất của nhà hàng.',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Trà',
    restaurantId: '10'
  },
  {
    id: '1009',
    name: 'Trà Long Tỉnh',
    description: 'Trà Long Tỉnh tươi mát từ Hàng Châu, vị thanh đạm, thơm nhẹ. Trà xanh cao cấp phù hợp mọi thời điểm.',
    price: 70000,
    image: 'https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Trà',
    restaurantId: '10'
  },

  // Amigos Taco Bar
  {
    id: '1101',
    name: 'Carnitas Tacos',
    description: 'Tacos thịt heo carnitas nướng 8 tiếng, tortilla corn tự làm, salsa verde, pico de gallo và guacamole bơ Hass tươi.',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1700625915228-f2b3d88c6676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwdGFjbyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjczOTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Tacos',
    restaurantId: '11'
  },
  {
    id: '1102',
    name: 'Quesadillas',
    description: 'Quesadillas phô mai Oaxaca tan chảy, thịt gà ướp gia vị Mexico, ăn kèm sour cream và jalapeño.',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1700625915228-f2b3d88c6676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwdGFjbyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjczOTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Mexican',
    restaurantId: '11'
  },
  {
    id: '1103',
    name: 'Horchata',
    description: 'Horchata Mexico truyền thống từ gạo, sữa tươi, quế và vanilla. Ngọt dịu, mát lạnh.',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1604298331663-de303fbc7059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwc21vb3RoaWV8ZW58MXx8fHwxNzU5NjczNTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Đồ Uống',
    restaurantId: '11'
  },
  {
    id: '1104',
    name: 'Fish Tacos',
    description: 'Tacos cá với phi lê cá tươi chiên giòn, salsa xoài, rau cải và sốt lime mayo. Tươi mát, đậm đà hương biển.',
    price: 135000,
    image: 'https://images.unsplash.com/photo-1700625915228-f2b3d88c6676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwdGFjbyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjczOTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Tacos',
    restaurantId: '11'
  },
  {
    id: '1105',
    name: 'Chicken Tacos',
    description: 'Tacos gà với thịt gà ướp gia vị Mexico, pico de gallo, phô mai và guacamole. Đậm đà hương vị truyền thống.',
    price: 115000,
    image: 'https://images.unsplash.com/photo-1700625915228-f2b3d88c6676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwdGFjbyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjczOTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Tacos',
    restaurantId: '11'
  },
  {
    id: '1106',
    name: 'Veggie Tacos',
    description: 'Tacos chay với đậu đen, bắp nướng, avocado, salsa verde và phô mai vegan. Bổ dưỡng, thơm ngon.',
    price: 105000,
    image: 'https://images.unsplash.com/photo-1700625915228-f2b3d88c6676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwdGFjbyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjczOTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Tacos',
    restaurantId: '11'
  },
  {
    id: '1107',
    name: 'Chicken Burrito',
    description: 'Burrito gà khổng lồ với thịt gà, gạo cilantro lime, đậu đen, phô mai và salsa. Bữa ăn đầy đủ dinh dưỡng.',
    price: 145000,
    image: 'https://images.unsplash.com/photo-1700625915228-f2b3d88c6676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwdGFjbyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjczOTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Mexican',
    restaurantId: '11'
  },
  {
    id: '1108',
    name: 'Beef Enchiladas',
    description: 'Enchiladas thịt bò với sốt ớt đỏ cay nồng, phô mai tan chảy và kem chua. Nướng trong lò, thơm lừng.',
    price: 165000,
    image: 'https://images.unsplash.com/photo-1700625915228-f2b3d88c6676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwdGFjbyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjczOTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Mexican',
    restaurantId: '11'
  },
  {
    id: '1109',
    name: 'Nachos Supreme',
    description: 'Nachos với tortilla chips giòn, phô mai cheddar tan chảy, jalapeño, guacamole và sour cream. Chia sẻ hoàn hảo.',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1700625915228-f2b3d88c6676?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwdGFjbyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzU5NjczOTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Mexican',
    restaurantId: '11'
  },

  // Green Garden Salads
  {
    id: '1201',
    name: 'Buddha Bowl',
    description: 'Buddha bowl với quinoa organic, avocado, kale massage, sweet potato nướng, tahini dressing và hạt chia. Vegan, gluten-free.',
    price: 132000,
    originalPrice: 165000,
    image: 'https://images.unsplash.com/photo-1555057949-7e4a30956f1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1OTU4OTg0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Salad',
    restaurantId: '12'
  },
  {
    id: '1202',
    name: 'Acai Bowl',
    description: 'Acai bowl antioxidant với acai berry, blueberry, banana, granola yến mạch, hạt dẻ cười và mật ong rừng.',
    price: 145000,
    image: 'https://images.unsplash.com/photo-1555057949-7e4a30956f1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1OTU4OTg0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Smoothie Bowl',
    restaurantId: '12'
  },
  {
    id: '1203',
    name: 'Green Detox Juice',
    description: 'Nước ép detox với cần tây, dưa chuột, táo xanh, gừng tươi và lemon. Cold-pressed, không đường, thanh lọc cơ thể.',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1604298331663-de303fbc7059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwc21vb3RoaWV8ZW58MXx8fHwxNzU5NjczNTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Nước Ép',
    restaurantId: '12'
  },
  {
    id: '1204',
    name: 'Kombucha Ginger',
    description: 'Kombucha gừng tươi lên men tự nhiên, giàu probiotics, tốt cho hệ tiêu hóa. Vị chua ngọt nhẹ, sảng khoái.',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1604298331663-de303fbc7059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwc21vb3RoaWV8ZW58MXx8fHwxNzU5NjczNTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Đồ Uống',
    restaurantId: '12'
  },
  {
    id: '1205',
    name: 'Rainbow Salad',
    description: 'Salad cầu vồng với rau củ 7 màu: cà rốt, bắp cải tím, dưa chuột, cà chua, ớt chuông. Dressing vinaigrette.',
    price: 135000,
    image: 'https://images.unsplash.com/photo-1555057949-7e4a30956f1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1OTU4OTg0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Salad',
    restaurantId: '12'
  },
  {
    id: '1206',
    name: 'Caesar Salad',
    description: 'Caesar salad cổ điển với rau xà lách romaine, parmesan, croutons và dressing caesar tự làm. Có thể thêm gà nướng.',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1555057949-7e4a30956f1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1OTU4OTg0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Salad',
    restaurantId: '12'
  },
  {
    id: '1207',
    name: 'Greek Salad',
    description: 'Salad Hy Lạp với cà chua, dưa chuột, olive đen, phô mai feta và dressing olive oil oregano. Thanh mát Mediterranean.',
    price: 145000,
    image: 'https://images.unsplash.com/photo-1555057949-7e4a30956f1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1OTU4OTg0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Salad',
    restaurantId: '12'
  },
  {
    id: '1208',
    name: 'Mango Smoothie Bowl',
    description: 'Smoothie bowl xoài với base xoài cát, topped granola, dẻ cháy, hạt chia và dừa sấy. Ngọt tự nhiên, sống động.',
    price: 155000,
    image: 'https://images.unsplash.com/photo-1555057949-7e4a30956f1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1OTU4OTg0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Smoothie Bowl',
    restaurantId: '12'
  },
  {
    id: '1209',
    name: 'Dragon Fruit Bowl',
    description: 'Smoothie bowl thanh long với base thanh long, chuối, topped granola, kiwi và hạt lanh. Màu hồng Instagram-able.',
    price: 165000,
    image: 'https://images.unsplash.com/photo-1555057949-7e4a30956f1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1OTU4OTg0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Smoothie Bowl',
    restaurantId: '12'
  },
  {
    id: '1210',
    name: 'Coconut Bowl',
    description: 'Smoothie bowl dừa với base nước cốt dừa, chuối, topped granola, dừa tươi và hạt điều. Béo ngậy tropical.',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1555057949-7e4a30956f1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjByZXN0YXVyYW50fGVufDF8fHx8MTc1OTU4OTg0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Smoothie Bowl',
    restaurantId: '12'
  },
  {
    id: '1211',
    name: 'Orange Carrot Juice',
    description: 'Nước ép cam và cà rốt tươi cold-pressed, giàu beta-carotene và vitamin C. Ngọt tự nhiên, tốt cho mắt.',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1604298331663-de303fbc7059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwc21vb3RoaWV8ZW58MXx8fHwxNzU5NjczNTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Nước Ép',
    restaurantId: '12'
  },
  {
    id: '1212',
    name: 'Beetroot Apple Juice',
    description: 'Nước ép củ dền và táo tươi cold-pressed, màu đỏ đẹp mắt, detox gan và tăng cường tuần hoàn máu.',
    price: 80000,
    image: 'https://images.unsplash.com/photo-1604298331663-de303fbc7059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwc21vb3RoaWV8ZW58MXx8fHwxNzU5NjczNTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Nước Ép',
    restaurantId: '12'
  },
  {
    id: '1213',
    name: 'Pineapple Mint Juice',
    description: 'Nước ép thơm và bạc hà tươi mát, giải nhiệt tuyệt vời. Vị chua ngọt tự nhiên, thơm mát lá bạc hà.',
    price: 70000,
    image: 'https://images.unsplash.com/photo-1604298331663-de303fbc7059?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwc21vb3RoaWV8ZW58MXx8fHwxNzU5NjczNTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Nước Ép',
    restaurantId: '12'
  }
];

export const getRestaurantById = (id) => {
  return restaurants.find(restaurant => restaurant.id === id);
};

export const getMenuItemsByRestaurant = (restaurantId) => {
  return menuItems.filter(item => item.restaurantId === restaurantId);
};

// Order History Mock Data
export const orderHistory = [
  {
    id: 'ORD001',
    restaurantName: 'Phở Hà Nội',
    restaurantImage: 'https://images.unsplash.com/photo-1595215909290-847cb783facf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc1OTY3MjkwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    items: [
      {
        id: '1',
        menuItem: {
          id: '1',
          name: 'Phở Bò Đặc Biệt',
          description: 'Phở bò thượng hạng với đầy đủ topping: thịt chín mềm, tái mỏng, gầu dai ngon, gân giòn và sách bò',
          price: 85000,
          image: 'https://images.unsplash.com/photo-1579866997815-ecbb27a4dd43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwcGhvJTIwYmVlZiUyMHNwZWNpYWx8ZW58MXx8fHwxNzU5NjcyOTIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          category: 'Phở',
          restaurantId: '1'
        },
        quantity: 2,
        restaurant: restaurants[0]
      },
      {
        id: '2',
        menuItem: {
          id: '3',
          name: 'Bánh Mì Thịt Nướng',
          description: 'Bánh mì Việt Nam truyền thống với vỏ giòn rụm, ruột mềm. Thịt heo nướng than hoa thơm lừng',
          price: 35000,
          image: 'https://images.unsplash.com/photo-1524062008239-962eb6d3383d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYmFuaCUyMG1pJTIwc2FuZHdpY2h8ZW58MXx8fHwxNzU5NjcyOTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          category: 'Bánh Mì',
          restaurantId: '1'
        },
        quantity: 1,
        restaurant: restaurants[0]
      }
    ],
    total: 205000,
    status: 'delivered',
    orderDate: '2024-01-15T14:30:00.000Z',
    deliveryDate: '2024-01-15T15:15:00.000Z',
    rating: 5,
    review: 'Phở rất ngon, nước dùng đậm đà. Bánh mì giòn rụm, thịt nướng thơm lừng. Sẽ đặt lại!',
    canRate: false,
    paymentMethod: 'Tiền mặt'
  },
  {
    id: 'ORD002',
    restaurantName: 'Pizza Heaven',
    restaurantImage: 'https://images.unsplash.com/photo-1758448500799-0162cffd85d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwaXp6YSUyMHJlc3RhdXJhbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk2NzI5MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    items: [
      {
        id: '3',
        menuItem: {
          id: '4',
          name: 'Pizza Margherita',
          description: 'Pizza Margherita cổ điển từ Napoli với đế bánh mỏng giòn, sốt cà chua San Marzano DOP',
          price: 180000,
          image: 'https://images.unsplash.com/photo-1759283391598-83b0ceb0faef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emElMjBmcmVzaCUyMG1venphcmVsbGF8ZW58MXx8fHwxNzU5NjcyOTMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          category: 'Pizza',
          restaurantId: '2'
        },
        quantity: 1,
        restaurant: restaurants[1]
      }
    ],
    total: 205000,
    status: 'shipping',
    orderDate: '2024-01-20T19:45:00.000Z',
    canRate: false,
    paymentMethod: 'Thẻ tín dụng'
  },
  {
    id: 'ORD003',
    restaurantName: 'Sushi Tokyo',
    restaurantImage: 'https://images.unsplash.com/photo-1639650538773-ffe1d8ad9d3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NTk1ODc4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    items: [
      {
        id: '4',
        menuItem: {
          id: '6',
          name: 'Sushi Set A',
          description: 'Set sushi cao cấp 12 miếng gồm: sake (cá hồi), maguro (cá ngừ), ebi (tôm), tamago (trứng)',
          price: 350000,
          image: 'https://images.unsplash.com/photo-1630748662890-11623a758d6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwc2V0JTIwcGxhdHRlcnxlbnwxfHx8fDE3NTk2NzI5MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          category: 'Sushi',
          restaurantId: '3'
        },
        quantity: 1,
        restaurant: restaurants[2]
      },
      {
        id: '5',
        menuItem: {
          id: '7',
          name: 'Sashimi Cá Hồi',
          description: 'Sashimi cá hồi Atlantic tươi sống cao cấp, cắt lát mỏng theo kỹ thuật yanagiba truyền thống',
          price: 280000,
          image: 'https://images.unsplash.com/photo-1646408814483-de1127ddc5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjBzYXNoaW1pJTIwZnJlc2glMjBmaXNofGVufDF8fHx8MTc1OTY3MjkzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          category: 'Sashimi',
          restaurantId: '3'
        },
        quantity: 1,
        restaurant: restaurants[2]
      }
    ],
    total: 655000,
    status: 'delivered',
    orderDate: '2024-01-18T12:20:00.000Z',
    deliveryDate: '2024-01-18T13:30:00.000Z',
    canRate: true,
    paymentMethod: 'Ví điện tử'
  },
  {
    id: 'ORD004',
    restaurantName: 'Pizza Heaven',
    restaurantImage: 'https://images.unsplash.com/photo-1758448500799-0162cffd85d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwaXp6YSUyMHJlc3RhdXJhbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk2NzI5MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    items: [
      {
        id: '6',
        menuItem: {
          id: '5',
          name: 'Pizza Pepperoni',
          description: 'Pizza pepperoni kinh điển với lớp phô mai mozzarella tan chảy, pepperoni Italy cao cấp cay nồng',
          price: 220000,
          image: 'https://images.unsplash.com/photo-1609732858591-725d6f2af10b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXBwZXJvbmklMjBwaXp6YSUyMGNoZWVzZXxlbnwxfHx8fDE3NTk2NzI5MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          category: 'Pizza',
          restaurantId: '2'
        },
        quantity: 2,
        restaurant: restaurants[1]
      }
    ],
    total: 465000,
    status: 'cancelled',
    orderDate: '2024-01-10T20:15:00.000Z',
    canRate: false,
    paymentMethod: 'Chuyển khoản ngân hàng'
  },
  {
    id: 'ORD005',
    restaurantName: 'Cà Phê Sài Gòn',
    restaurantImage: 'https://images.unsplash.com/photo-1648451142763-6fb6244cb8a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY29mZmVlJTIwc2hvcCUyMGludGVyaW9yfGVufDF8fHx8MTc1OTY3Mzk1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    items: [
      {
        id: '7',
        menuItem: {
          id: '701',
          name: 'Cà Phê Sữa Đá',
          description: 'Cà phê phin Việt Nam kết hợp sữa đặc ngọt ngào, tạo nên hương vị đặc trưng không thể nhầm lẫn của Sài Gòn.',
          price: 30000,
          image: 'https://images.unsplash.com/photo-1569315095807-995e6e3ba320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwaWNlZCUyMGNvZmZlZXxlbnwxfHx8fDE3NTk2NzM1NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          category: 'Cà Phê',
          restaurantId: '7'
        },
        quantity: 2,
        restaurant: restaurants[6]
      }
    ],
    total: 75000,
    status: 'confirmed',
    orderDate: '2024-01-22T11:00:00.000Z',
    canRate: false,
    paymentMethod: 'Tiền mặt'
  }
];

// Topping Groups Mock Data
export const toppingGroups = [
  {
    id: 'tg1',
    name: 'Tương',
    items: [
      { id: 'ti1', name: 'Tương cà', price: 5000 },
      { id: 'ti2', name: 'Tương ớt', price: 5000 },
      { id: 'ti3', name: 'Tương đậu tương', price: 3000 },
      { id: 'ti4', name: 'Tương ngọt', price: 3000 }
    ],
    required: false,
    linkedMenuItemIds: ['1', '2'], // Phở Bò Tái, Phở Gà
    restaurantId: '1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'tg2', 
    name: 'Độ cay',
    items: [
      { id: 'ti5', name: 'Không cay', price: 0 },
      { id: 'ti6', name: 'Cay nhẹ', price: 0 },
      { id: 'ti7', name: 'Cay vừa', price: 0 },
      { id: 'ti8', name: 'Cay nhiều', price: 2000 }
    ],
    required: true,
    linkedMenuItemIds: ['7', '8'], // Bún bò Huế, Bánh tráng nướng
    restaurantId: '4',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'tg3',
    name: 'Kích thước Pizza',
    items: [
      { id: 'ti9', name: 'Size S (20cm)', price: 0 },
      { id: 'ti10', name: 'Size M (25cm)', price: 50000 },
      { id: 'ti11', name: 'Size L (30cm)', price: 100000 }
    ],
    required: true,
    linkedMenuItemIds: ['4', '5', '9'], // Pizza Margherita, Pizza Pepperoni, Pizza Quattro Stagioni
    restaurantId: '2',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'tg4',
    name: 'Topping Pizza',
    items: [
      { id: 'ti12', name: 'Phô mai thêm', price: 30000 },
      { id: 'ti13', name: 'Pepperoni thêm', price: 40000 },
      { id: 'ti14', name: 'Nấm', price: 25000 },
      { id: 'ti15', name: 'Olive đen', price: 20000 },
      { id: 'ti16', name: 'Basil tươi', price: 15000 }
    ],
    required: false,
    linkedMenuItemIds: ['4', '5', '9'],
    restaurantId: '2',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'tg5',
    name: 'Độ ngọt đồ uống',
    items: [
      { id: 'ti17', name: '0% đường', price: 0 },
      { id: 'ti18', name: '30% đường', price: 0 },
      { id: 'ti19', name: '50% đường', price: 0 },
      { id: 'ti20', name: '70% đường', price: 0 },
      { id: 'ti21', name: '100% đường', price: 0 }
    ],
    required: true,
    linkedMenuItemIds: ['20', '21', '22'], // Trà sữa, Cà phê
    restaurantId: '7',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'tg6',
    name: 'Topping Burger',
    items: [
      { id: 'ti22', name: 'Thịt patty thêm', price: 35000 },
      { id: 'ti23', name: 'Phô mai cheddar', price: 15000 },
      { id: 'ti24', name: 'Bacon giòn', price: 25000 },
      { id: 'ti25', name: 'Hành tây chiên', price: 10000 },
      { id: 'ti26', name: 'Pickles', price: 5000 }
    ],
    required: false,
    linkedMenuItemIds: ['13', '14'], // Classic Beef Burger, Chicken Deluxe
    restaurantId: '5',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];