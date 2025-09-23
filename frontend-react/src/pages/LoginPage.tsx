import { LoginForm } from '@/components/login-form'
import React from 'react'

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-lg opacity-50 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-lg opacity-50 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-lg opacity-50 animate-pulse delay-2000"></div>
      </div>

      {/* Login Form container */}
      <div className="relative z-10 max-w-md w-full">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;