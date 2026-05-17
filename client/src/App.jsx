import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Sprint 1 Pages
import HomePage          from './pages/HomePage';
import VisitorRegister   from './pages/VisitorRegister';
import VisitorLogin      from './pages/VisitorLogin';
import GuideRegister     from './pages/GuideRegister';
import GuideLogin        from './pages/GuideLogin';
import AdminLogin        from './pages/AdminLogin';
import PeppersPage       from './pages/PeppersPage';
import PepperDetailPage  from './pages/PepperDetailPage';
import GuideDashboard    from './pages/GuideDashboard';
import AdminDashboard    from './pages/AdminDashboard';
import NotFound          from './pages/NotFound';

// Sprint 2 Pages
import StorePage             from './pages/StorePage';
import ProductDetailPage     from './pages/ProductDetailPage';
import CartPage              from './pages/CartPage';
import CheckoutPage          from './pages/CheckoutPage';
import AddProductPage        from './pages/AddProductPage';
import ManageProductsPage    from './pages/ManageProductsPage';
import OrdersManagementPage  from './pages/OrdersManagementPage';
import ToursPage             from './pages/ToursPage';
import BookingConfirmPage    from './pages/BookingConfirmPage';
import MyBookingsPage        from './pages/MyBookingsPage';
import CreateTourPage        from './pages/guide/CreateTourPage';
import MyToursPage           from './pages/guide/MyToursPage';

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'guide') return <Navigate to="/peppers" replace />;
    return <Navigate to="/peppers" replace />;
  }
  return children;
};

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<HomePage />} />
    <Route path="/peppers"     element={<PeppersPage />} />
    <Route path="/peppers/:id" element={<PepperDetailPage />} />

    {/* Guest-only */}
    <Route path="/register"       element={<GuestRoute><VisitorRegister /></GuestRoute>} />
    <Route path="/login"          element={<GuestRoute><VisitorLogin /></GuestRoute>} />
    <Route path="/guide/register" element={<GuestRoute><GuideRegister /></GuestRoute>} />
    <Route path="/guide/login"    element={<GuestRoute><GuideLogin /></GuestRoute>} />
    <Route path="/admin/login"    element={<GuestRoute><AdminLogin /></GuestRoute>} />

    {/* Public browsing — no login required */}
    <Route path="/store"     element={<StorePage />} />
    <Route path="/store/:id" element={<ProductDetailPage />} />
    <Route path="/tours"     element={<ToursPage />} />

    {/* Visitor — login required */}
    <Route path="/cart"          element={<PrivateRoute roles={['visitor']}><CartPage /></PrivateRoute>} />
    <Route path="/checkout"      element={<PrivateRoute roles={['visitor']}><CheckoutPage /></PrivateRoute>} />
    <Route path="/tours/confirm" element={<PrivateRoute roles={['visitor']}><BookingConfirmPage /></PrivateRoute>} />
    <Route path="/my-bookings"   element={<PrivateRoute roles={['visitor']}><MyBookingsPage /></PrivateRoute>} />

    {/* Guide */}
    <Route path="/guide"              element={<PrivateRoute roles={['guide']}><GuideDashboard /></PrivateRoute>} />
    <Route path="/guide/tours"        element={<PrivateRoute roles={['guide']}><MyToursPage /></PrivateRoute>} />
    <Route path="/guide/tours/create" element={<PrivateRoute roles={['guide']}><CreateTourPage /></PrivateRoute>} />

    {/* Admin */}
    <Route path="/admin"          element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
    <Route path="/admin/products" element={<PrivateRoute roles={['admin']}><ManageProductsPage /></PrivateRoute>} />
    <Route path="/admin/products/add" element={<PrivateRoute roles={['admin']}><AddProductPage /></PrivateRoute>} />
    <Route path="/admin/orders"   element={<PrivateRoute roles={['admin']}><OrdersManagementPage /></PrivateRoute>} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
