import './App.css'

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



function App() {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setIsAuthenticated(!!user);
    
    const handleStorageChange = () => {
      const user = AuthService.getCurrentUser();
      setIsAuthenticated(!!user);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); 
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      return <Navigate to="/login" />;
    }
    return <>{children}</>;
  };


  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/unverified-email' element={<UnverifiedPage />} />
        

        <Route path='*' element={<NotFoundPage />} />
      </>
    )
  );

  return <RouterProvider router={router}/>
}

export default App
