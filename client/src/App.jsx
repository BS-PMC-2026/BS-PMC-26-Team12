import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
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

// Route guards
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

    {/* Guest-only auth */}
    <Route path="/register"       element={<GuestRoute><VisitorRegister /></GuestRoute>} />
    <Route path="/login"          element={<GuestRoute><VisitorLogin /></GuestRoute>} />
    <Route path="/guide/register" element={<GuestRoute><GuideRegister /></GuestRoute>} />
    <Route path="/guide/login"    element={<GuestRoute><GuideLogin /></GuestRoute>} />
    <Route path="/admin/login"    element={<GuestRoute><AdminLogin /></GuestRoute>} />

    {/* Peppers — fully public */}
    <Route path="/peppers"     element={<PeppersPage />} />
    <Route path="/peppers/:id" element={<PepperDetailPage />} />

    {/* Guide */}
    <Route path="/guide" element={<PrivateRoute roles={['guide']}><GuideDashboard /></PrivateRoute>} />

    {/* Admin */}
    <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />

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
