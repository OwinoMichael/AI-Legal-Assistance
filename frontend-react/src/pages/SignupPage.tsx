import { SignupForm } from '@/components/signup-form'
import React from 'react'

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background elements matching your landing page exactly */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Signup Form container */}
      <div className="relative z-10 max-w-lg w-full">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;