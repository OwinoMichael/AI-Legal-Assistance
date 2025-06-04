import './index.css'

import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { 
  Route, 
  createBrowserRouter, 
  createRoutesFromElements, 
  RouterProvider, 
  Navigate,
  Outlet
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

const ProtectedRoute = () => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const validateAuth = async () => {
      const isValid = await AuthService.validateToken();
      setIsAuthenticated(isValid);
      setIsValidating(false);
    };
    
    validateAuth();
  }, []);
  
  if (isValidating) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return <Outlet />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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

  // ✅ Use <Outlet> instead of children for route nesting
  const ProtectedRoute = () => {
    const user = AuthService.getCurrentUser();

    if (!user) return <Navigate to="/login" replace />;
    if (!user.verified) return <Navigate to="/unverified-email" replace />;

    return <Outlet />;
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* ✅ Protected routes grouped under <ProtectedRoute> */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/cases" element={<CaseDetailPage />} />
          <Route path="/cases-export" element={<LegalPDFExport />} />
        </Route>

        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/unverified-email" element={<UnverifiedPage />} />
        <Route path="/verify-error" element={<EmailVerifyErrorPage />} />
        <Route path="/verify-success" element={<EmailVerifySuccessPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
}


export default App;
