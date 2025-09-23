import React from 'react'
import { AlertCircle, ArrowLeft, CheckCircle, Shield } from "lucide-react"
import { Link } from 'react-router-dom';

 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthBackground from '@/layout/AuthBackground';


const NotFoundPage = () => {
  return (
    <AuthBackground>
      <div className="flex flex-col gap-6">
        {/* Enhanced Card with glassmorphism */}
        <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-2xl relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
          
          <CardHeader className="text-center relative z-10 pb-6">
            {/* Logo matching your landing page */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-800">LegalMind</span>
            </div>
            
            <CardTitle className="text-2xl text-slate-800 mb-2">Page Not Found</CardTitle>
            <CardDescription className="text-slate-600">
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10 space-y-4">
            <Alert className="border-red-200 bg-red-50/80 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Error 404 Not Found</AlertTitle>
              <AlertDescription className="text-red-700">
                This page does not exist, please go back
              </AlertDescription>
            </Alert>

            <a
              href="/"
              className="inline-flex items-center justify-center w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl rounded-md"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back Home
            </a>
          </CardContent>
        </Card>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            <span>Secure navigation</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-green-500" />
            <span>Protected site</span>
          </div>
        </div>
      </div>
    </AuthBackground>
  );
};

export default NotFoundPage