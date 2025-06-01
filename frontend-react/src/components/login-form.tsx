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
import { useState } from "react"
import { CheckCircle, Eye, EyeIcon, EyeOff, EyeOffIcon, FileText, Loader2 } from "lucide-react";
import { useSubmitValidation, ValidationPresets } from "@/services/ValidationService"
import { useNavigate } from 'react-router-dom';
import AuthService from "@/services/AuthService"
import { CustomError } from "@/services/CustomError"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const email = useSubmitValidation(ValidationPresets.loginEmail);
  const password = useSubmitValidation(ValidationPresets.loginPassword);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = email.forceValidate();
    const isPasswordValid = password.forceValidate();

    if (!isEmailValid || !isPasswordValid) {
      setError("Please fix validation errors before submitting.");
      return;
    }

    const emailStr = String(email.value || "").trim();
    const passwordStr = String(password.value || "").trim();

    if (!emailStr || !passwordStr) {
      setError("Email and password are required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await AuthService.login(emailStr, passwordStr);
      console.log("Login successful:", response);

      const user = AuthService.getCurrentUser();

      if (user?.verified) {
        navigate("/", { replace: true });
      } else if (user && !user.verified) {
        navigate("/unverified-email", { replace: true });
      } else {
        setError("Unexpected login state. Please try again.");
      }

    } catch (error: any) {
      console.error("Login error:", error);

      if (error instanceof CustomError) {
        switch (error.name) {
          case "ACCOUNT_NOT_VERIFIED":
            { const unverifiedEmail = error.data?.email || error.data;
            if (unverifiedEmail) {
              sessionStorage.setItem("unverifiedEmail", unverifiedEmail);
            }
            navigate("/unverified-email", { replace: true });
            break; }
          case "INVALID_CREDENTIALS":
            setError("Invalid email or password.");
            break;
          default:
            setError(error.message || "An error occurred during login.");
        }
      } else if (error.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        const fallback = error.response?.data?.message || error.message || "An error occurred during login.";
        setError(fallback);
      }
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
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800">LegalMind</span>
          </div>
          
          <CardTitle className="text-2xl text-slate-800 mb-2">Welcome back</CardTitle>
          <CardDescription className="text-slate-600">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10">
          {/* Error Message with enhanced styling */}
          {errorMessage && (
            <div className="text-sm text-red-600 text-center bg-red-50 border border-red-200 p-3 rounded-xl mb-6">
              {errorMessage}
            </div>
          )}

          <div onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {/* Email Field */}
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jdoe@example.com"
                  required
                  value={email.value}
                  onChange={email.handleChange}
                  className={cn(
                    "h-12 px-4 bg-white/70 backdrop-blur-sm border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200",
                    email.error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : ""
                  )}
                />
                {email.error && (
                  <p className="text-xs text-red-500 pl-1">{email.error}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto text-sm text-blue-600 hover:text-blue-700 transition-colors underline underline-offset-4"
                  >
                    Forgot your password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password.value}
                    onChange={password.handleChange}
                    className={cn(
                      "h-12 px-4 pr-12 bg-white/70 backdrop-blur-sm border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200",
                      password.error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : ""
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                {password.error && (
                  <p className="text-xs text-red-500 pl-1">{password.error}</p>
                )}
              </div>

              {/* Enhanced Login Button matching your landing page style */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:transform-none" 
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Sign up link */}
              <div className="text-center text-sm text-slate-600">
                Don't have an account?{" "}
                <a 
                  href="/signup" 
                  className="text-blue-600 hover:text-blue-700 underline underline-offset-4 font-medium transition-colors"
                >
                  Sign up
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust indicators matching your landing page */}
      <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500" />
          <span>Secure & encrypted</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500" />
          <span>Privacy protected</span>
        </div>
      </div>

      {/* Terms */}
      <div className="text-center text-xs text-slate-500">
        By signing in, you agree to our{" "}
        <a href="#" className="text-blue-600 hover:text-blue-700 underline underline-offset-4 transition-colors">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-blue-600 hover:text-blue-700 underline underline-offset-4 transition-colors">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
};
