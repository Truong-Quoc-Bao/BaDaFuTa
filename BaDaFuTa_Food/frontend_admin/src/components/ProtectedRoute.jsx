import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Thay logic kiểm tra bằng auth state hoặc localStorage thực tế của bạn
  const isAuthenticated = localStorage.getItem('admin_token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}