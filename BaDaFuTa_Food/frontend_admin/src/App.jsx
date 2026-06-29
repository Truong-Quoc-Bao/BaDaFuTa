import { Routes, Route, Navigate, useLocation, BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import PartnersPage from './pages/PartnersPage';
import AdminAddMerchantPage from './pages/AdminAddMerchantPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import { Toaster } from 'react-hot-toast';
import './index.css';

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="partners" element={<PartnersPage />} />
        <Route path="add-partner" element={<AdminAddMerchantPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1500,
          style: { pointerEvents: 'none' },
          pauseOnFocusLoss: false,
          pauseOnHover: false,
        }}
      />
      <AdminRoutes />
    </Router>
  );
}
