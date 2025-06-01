import './index.css'

import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { 
  Route, 
  createBrowserRouter, 
  createRoutesFromElements, 
  RouterProvider, 
  Navigate
} from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UnverifiedPage from './pages/UnverifiedPage';
import { useEffect, useState } from 'react';
import AuthService from './services/AuthService';
import HomePage from './pages/HomePage';
import EmailVerifyErrorPage from './pages/EmailVerifyErrorPage';
import EmailVerifySuccessPage from './pages/EmailVerifySucessPage';
import LandingPage from './pages/LandingPage';
import CaseDetailPage from './pages/CasePage';
import LegalPDFExport from './pages/CaseExportPage';



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Keep auth state updated based on localStorage
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setIsAuthenticated(!!user);

    const handleStorageChange = () => {
      const user = AuthService.getCurrentUser();
      setIsAuthenticated(!!user);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Component to protect routes
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const user = AuthService.getCurrentUser();

    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (!user.verified) {
      return <Navigate to="/unverified-email" replace />;
    }

    return <>{children}</>;
  };

  // Define your router with protected and public routes
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Protected Home Page */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/unverified-email" element={<UnverifiedPage />} />
        <Route path="/verify-error" element={<EmailVerifyErrorPage />} />
        <Route path="verify-success" element={<EmailVerifySuccessPage />} />
        <Route path="cases" element={<CaseDetailPage />} />
        <Route path="cases-export" element={<LegalPDFExport />} />
        <Route path="*" element={<NotFoundPage />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;