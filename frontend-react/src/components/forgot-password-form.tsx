import React, { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Loader2, Mail } from "lucide-react"
import { ValidationPresets,  useFieldValidation } from '@/services/ValidationService'

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock validation hook
  const email = {
    value: '',
    error: '',
    handleChange: (e) => {},
    handleBlur: () => {},
    forceValidate: () => true
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmailValid = email.forceValidate();
    if (!isEmailValid) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      alert(`Password reset email sent to ${email.value}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Enhanced Card with glassmorphism */}
      <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-2xl relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
        
        <CardHeader className="text-center relative z-10 pb-6">
          {/* Logo matching your landing page */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800">LegalMind</span>
          </div>
          
          <CardTitle className="text-2xl text-slate-800 mb-2">Forgot Password</CardTitle>
          <CardDescription className="text-slate-600">
            Provide the email address attached to your account and we will send a link to reset your password
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {/* Email Field */}
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jdoe@example.com"
                  value={email.value}
                  onChange={email.handleChange}
                  onBlur={email.handleBlur}
                  className={cn(
                    "h-12 px-4 bg-white/70 backdrop-blur-sm border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200",
                    email.error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : ""
                  )}
                />
                {email.error && (
                  <p className="text-xs text-red-500 pl-1">{email.error}</p>
                )}
              </div>

              {/* Enhanced Reset Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:transform-none" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending email...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>

              {/* Navigation links */}
              <div className="text-center text-sm text-slate-600">
                <a 
                  href="/signup" 
                  className="text-blue-600 hover:text-blue-700 underline underline-offset-4 font-medium transition-colors mr-4"
                >
                  Sign up
                </a>
                <a 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-700 underline underline-offset-4 font-medium transition-colors"
                >
                  Login
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Trust indicators */}
      <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500" />
          <span>Secure & encrypted</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-green-500" />
          <span>Email protected</span>
        </div>
      </div>
    </div>
  );
}