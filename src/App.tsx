import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import QuickViewModal from './components/QuickViewModal';
import PromoPopup from './components/PromoPopup';
import MobileBottomNav from './components/MobileBottomNav';
import ScrollToTop from './components/ScrollToTop';
import ScrollProgress from './components/ScrollProgress';
import Chatbot from './components/Chatbot';

// Pages
import HomePage from './pages/Home';
import MenuPage from './pages/Menu';
import ProductPage from './pages/Product';
import CartPage from './pages/Cart';
import CheckoutPage from './pages/Checkout';
import OrderSuccessPage from './pages/OrderSuccess';
import OrderTrackingPage from './pages/OrderTracking';
import WishlistPage from './pages/Wishlist';
import AccountPage from './pages/Account';
import OrdersPage from './pages/Orders';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import AdminPage from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ScrollProgress />
      <div className="min-h-screen" style={{ backgroundColor: '#070707', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
        <Navbar />
        <main className="pb-20 lg:pb-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/menu/:category" element={<MenuPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
            <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
        <SearchModal />
        <QuickViewModal />
        <PromoPopup />
        <MobileBottomNav />
        <Chatbot />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(16,16,16,0.95)',
              color: '#fff',
              border: '1px solid rgba(245,166,35,0.3)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            },
            success: {
              iconTheme: { primary: '#f5a623', secondary: '#070707' },
              duration: 2500,
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#070707' },
              duration: 3000,
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}
