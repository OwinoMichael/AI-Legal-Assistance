import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import AuthService from '@/services/AuthService'
import { Terminal } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const EmailVerifyErrorPage = () => {
    const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const user = AuthService.getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.verified) {
      navigate("/");
    }
  }, [user?.verified, navigate]);

  const handleResend = async () => {
    if (!user?.email) return;

    setLoading(true);
    setStatusMessage(null);

    try {
      await AuthService.resendVerification(user.email);
      setStatusMessage("Verification email resent successfully.");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Resend error:", error);
      setStatusMessage(
        error.response?.data || "Failed to resend verification email."
      );
    } finally {
      setLoading(false);
    }
  };


  return (

    <Alert variant="destructive">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Error!</AlertTitle>
      <AlertDescription>
        Verification token expried, click the button below to receive another email verification message
      </AlertDescription>

      <Button
        onClick={handleResend}
        disabled={loading}
        //className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Resend Verification Email"}
      </Button>

      {statusMessage && (
        <p className="mt-3 text-sm text-gray-700">{statusMessage}</p>
      )}
    </Alert>
    
  )
}

export default EmailVerifyErrorPage