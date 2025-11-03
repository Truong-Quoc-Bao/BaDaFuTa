import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Header } from '../components/Header';
import { HomePage } from '../pages/HomePage';
import { OrdersPage } from '../pages/OrdersPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { MyOrdersPage } from '../pages/MyOrdersPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ProfileInfoPage } from '../pages/ProfileInfoPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { RestaurantDetailPage } from '../pages/RestaurantDetailPage';
import { BottomNav } from '../components/BottomNav';
import { FoodItem } from '../components/FoodCard';
import { Cart, CartItem } from '../components/Cart';
import { CheckoutDialog, OrderData } from '../components/CheckoutDialog';
import Toast from 'react-native-toast-message';


// Mock data
const foodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Phở Hà Nội',
    description: 'Phở truyền thống Hà Nội với nước dùng được ninh từ xương bò suốt 12 tiếng, thịt bò tươi ngon và bánh phở mềm mịn',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1701480253822-1842236c9a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG8lMjBub29kbGVzJTIwYm93bHxlbnwxfHx8fDE3NjExNDEwMTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'main',
    cuisine: 'Việt Nam',
    rating: 4.8,
    deliveryTime: '25-35 phút',
    distance: '0km',
  },
  {
    id: '2',
    name: 'Cà Phê Sài Gòn',
    description: 'Cà phê Việt Nam truyền thống với hương vị đậm đà, thơm lừng. Robusta Buôn Ma Thuột nguyên chất, pha phin, đá đầy. Thưởng thức vị ngon đặc trưng.',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1592663527359-cf6642f54cff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBkcmlua3xlbnwxfHx8fDE3NjExMTMwNjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'drink',
    cuisine: 'Việt Nam',
    rating: 4.6,
    deliveryTime: '15-20 phút',
    distance: '0km',
  },
  {
    id: '3',
    name: 'Green Garden Salads',
    description: 'Salad tươi healthy với rau organic, superfood hạt chia, quinoa, avocado. Dressing tự làm không chất bảo quản. Dinh dưỡng cân bằng cho sức khỏe.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1643750182373-b4a55a8c2801?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2MTEzOTU2MHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'main',
    cuisine: 'Healthy',
    rating: 4.4,
    deliveryTime: '20-30 phút',
    distance: '0km',
  },
  {
    id: '4',
    name: 'Pizza Heaven',
    description: 'Pizza Ý chính gốc với bột nhào đá imported từ Napoli, bột pizza lên men tự nhiên 24h, cheese mozzarella tươi, sốt cà chua San Marzano.',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1749169395459-9eb9835bd718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGl0YWxpYW4lMjBmb29kfGVufDF8fHx8MTc2MTA2NTE5MXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'main',
    cuisine: 'Ý',
    rating: 4.6,
    deliveryTime: '30-40 phút',
    distance: '0.8km',
  },
  {
    id: '5',
    name: 'Seoul BBQ House',
    description: 'BBQ Hàn Quốc địch thực với thịt bò Wagyu vá heo Black Pig cao cấp. Bàn nướng than hoa, banchan tươi ngon. Trải nghiệm ẩm thực Hàn Quốc chân thật.',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1677367342016-72525ee2ae29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYnElMjBmb29kfGVufDF8fHx8MTc2MTA0MzA3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'main',
    cuisine: 'Hàn Quốc',
    rating: 4.7,
    deliveryTime: '35-45 phút',
    distance: '0.8km',
  },
  {
    id: '6',
    name: 'Burger Station',
    description: 'Burger Mỹ authentic với thịt bò Angus xay tươi hàng ngày. bánh brioche mềm mịn, rau xanh giòn, rau hành tím. Khoai tây chiên vàng giòn.',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1699874372100-2c4906c4c27e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBhbWVyaWNhbiUyMGZvb2R8ZW58MXx8fHwxNzYxMTM5NzU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'main',
    cuisine: 'Mỹ',
    rating: 4.5,
    deliveryTime: '25-35 phút',
    distance: '2.1km',
  },
  {
    id: '7',
    name: 'Sushi Tokyo',
    description: 'Sushi Nhật Bản cao cấp với cá hồi Na Uy tươi sống, cá ngừ đại dương. Gạo sushi Nhật, rong biển nori premium. Chef Nhật chế biến.',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1700324822763-956100f79b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGphcGFuZXNlJTIwZm9vZHxlbnwxfHx8fDE3NjEwMjE3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'main',
    cuisine: 'Nhật Bản',
    rating: 4.9,
    deliveryTime: '30-40 phút',
    distance: '1.2km',
  },
  {
    id: '8',
    name: 'Bangkok Street',
    description: 'Pad Thai Thái Lan chính gốc với tôm sú tươi, đậu phụ non, giá đỗ giòn. Nước sốt tamarind chua ngọt đậm đà. Đậu phộng rang giòn rụm.',
    price: 16000,
    image: 'https://images.unsplash.com/photo-1593906115209-6d0011a840e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwZm9vZCUyMGN1cnJ5fGVufDF8fHx8MTc2MTAzMTE1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'main',
    cuisine: 'Thái Lan',
    rating: 4.6,
    deliveryTime: '25-35 phút',
    distance: '1.5km',
  },
  {
    id: '9',
    name: 'Bún Bò Huế',
    description: 'Bún bò Huế cay cay, nước dùng đậm đà hương vị miền Trung',
    price: 16000,
    image: 'https://images.unsplash.com/photo-1745817095847-625ab76756a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwZm9vZCUyMGRpc2h8ZW58MXx8fHwxNzYxMTM2OTA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'main',
    cuisine: 'Việt Nam',
    rating: 4.7,
    deliveryTime: '20-30 phút',
    distance: '0.5km',
  },
  {
    id: '10',
    name: 'Gỏi Cuốn',
    description: 'Gỏi cuốn tôm thịt tươi mát, ăn kèm nước chấm đậm đà',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1595238734477-ae7f8a79ce02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJpbmclMjByb2xscyUyMHZpZXRuYW1lc2V8ZW58MXx8fHwxNzYxMDk2NzI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'appetizer',
    cuisine: 'Việt Nam',
    rating: 4.3,
    deliveryTime: '15-25 phút',
    distance: '0.3km',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [showCheckoutPage, setShowCheckoutPage] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2);
  const [selectedRestaurant, setSelectedRestaurant] = useState<FoodItem | null>(null);

  const handleAddToCart = (item: FoodItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    Toast.show({ type: 'success', text1: `Đã thêm ${item.name} vào giỏ hàng` });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    Toast.show({ type: 'success', text1: 'Đã xóa món khỏi giỏ hàng' });
  };

  const handleClearCart = () => {
    setCartItems([]);
    Toast.show({ type: 'success', text1: 'Đã xóa tất cả món khỏi giỏ hàng' });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setSelectedRestaurant(null);
    setShowCheckoutPage(true);
  };

  const handleConfirmOrder = (orderData: OrderData) => {
    console.log('Order placed:', { items: cartItems, ...orderData });
    Toast.show({ type: 'success', text1: 'Đặt hàng thành công!' });
    setCartItems([]);
    setIsCheckoutOpen(false);
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    setShowCheckoutPage(false);
    setSelectedRestaurant(null);
    setActiveTab('home');
    Toast.show({ type: 'success', text1: 'Đơn hàng đã được ghi nhận!' });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 15000;

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCartItems([]);
    setActiveTab('home');
    Toast.show({ type: 'success', text1: 'Đã đăng xuất thành công' });
  };

  const handleRestaurantClick = (restaurant: FoodItem) => {
    setSelectedRestaurant(restaurant);
  };

  const renderPage = () => {
    if (selectedRestaurant) {
      return (
        <RestaurantDetailPage
          restaurant={selectedRestaurant}
          onBack={() => setSelectedRestaurant(null)}
          onAddToCart={handleAddToCart}
          cartCount={cartCount}
          cartTotal={cartTotal}
          onViewCart={() => setIsCartOpen(true)}
          onCheckout={() => {
            setSelectedRestaurant(null);
            setShowCheckoutPage(true);
          }}
        />
      );
    }

    if (showCheckoutPage) {
      return (
        <CheckoutPage
          onBack={() => {
            setShowCheckoutPage(false);
            setActiveTab('home');
          }}
          cartItems={cartItems}
          onOrderComplete={handleOrderComplete}
        />
      );
    }

    if (showMyOrders) return <MyOrdersPage onBack={() => setShowMyOrders(false)} />;
    if (showSettings) return <SettingsPage onBack={() => setShowSettings(false)} />;
    if (showProfileInfo) return <ProfileInfoPage onBack={() => setShowProfileInfo(false)} />;

    switch (activeTab) {
      case 'home':
        return <HomePage foodItems={foodItems} onAddToCart={handleAddToCart} onRestaurantClick={handleRestaurantClick} />;
      case 'orders':
        return (
          <OrdersPage 
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
          />
        );
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return (
          <ProfilePage 
            onLogout={handleLogout}
            onMyOrdersClick={() => setShowMyOrders(true)}
            onSettingsClick={() => setShowSettings(true)}
            onEditProfileClick={() => setShowProfileInfo(true)}
          />
        );
      default:
        return <HomePage foodItems={foodItems} onAddToCart={handleAddToCart} />;
    }
  };

  if (!isLoggedIn) {
    return (
      <View style={{ flex: 1 }}>
        {showSignup ? (
          <SignupPage 
            onSignupSuccess={() => setIsLoggedIn(true)}
            onLoginClick={() => setShowSignup(false)}
          />
        ) : (
          <LoginPage 
            onLoginSuccess={() => setIsLoggedIn(true)}
            onSignupClick={() => setShowSignup(true)}
          />
        )}
        <Toast />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {!showCheckoutPage && !selectedRestaurant && (
        <Header 
          cartCount={cartCount}
          onMenuClick={() => Toast.show({ type: 'info', text1: 'Back button clicked' })}
          onCartClick={() => setIsCartOpen(true)}
          onSearchClick={() => Toast.show({ type: 'info', text1: 'Search clicked' })}
          onLocationClick={() => Toast.show({ type: 'info', text1: 'Location clicked' })}
        />
      )}
      
      <ScrollView style={{ flex: 1 }}>{renderPage()}</ScrollView>

      {!showCheckoutPage && !selectedRestaurant && (
        <BottomNav 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          cartCount={cartCount}
          notificationCount={notificationCount}
        />
      )}

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <CheckoutDialog 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onConfirm={handleConfirmOrder}
        total={cartTotal}
      />

      <Toast />
    </View>
  );
}

