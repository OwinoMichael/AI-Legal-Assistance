import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AuthBackground from '@/layout/AuthBackground'
import AuthService from '@/services/AuthService'
import { CheckCircle, Loader2, Mail, Terminal } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const EmailVerifyErrorPage = () => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  // Mock user and services (replace with your actual implementations)
  const user = { email: 'user@example.com', verified: false };
  const navigate = (path: string) => console.log('Navigate to:', path);

  useEffect(() => {
    if (user?.verified) {
      navigate("/");
    }
  }, [user?.verified]);

  const handleResend = async () => {
    if (!user?.email) return;

    setLoading(true);
    setStatusMessage(null);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatusMessage("Verification email resent successfully.");
    } catch (error: any) {
      console.error("Resend error:", error);
      setStatusMessage("Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

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
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-800">LegalMind</span>
            </div>
            
            <CardTitle className="text-2xl text-slate-800 mb-2">Verification Required</CardTitle>
            <CardDescription className="text-slate-600">
              Your verification token has expired. Click the button below to receive a new verification email.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10 space-y-4">
            <Alert className="border-red-200 bg-red-50/80 backdrop-blur-sm">
              <Terminal className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Error!</AlertTitle>
              <AlertDescription className="text-red-700">
                Verification token expired, click the button below to receive another email verification message
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleResend}
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend Verification Email"
              )}
            </Button>

            {statusMessage && (
              <Alert className={statusMessage.includes('successfully') ? 'border-green-200 bg-green-50/80' : 'border-red-200 bg-red-50/80'}>
                <AlertDescription className={statusMessage.includes('successfully') ? 'text-green-700' : 'text-red-700'}>
                  {statusMessage}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            <span>Secure verification</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-green-500" />
            <span>Email protected</span>
          </div>
        </div>
      </div>
    </AuthBackground>
  );
};

export default EmailVerifyErrorPage