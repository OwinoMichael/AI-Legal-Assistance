import { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have cn utility from shadcn/UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Eye, EyeIcon, EyeOff, EyeOffIcon, Key, Loader2, Shield } from "lucide-react"; // Import icons from lucide-react
import { createValidation, useFieldValidation, ValidationPresets } from "@/services/ValidationService";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Mock validation hooks (replace with your actual hooks)
  const password = {
    value: '',
    error: '',
    handleChange: (e) => {},
    handleBlur: () => {},
    forceValidate: () => true,
    clearField: () => {}
  };
  
  const confirmPassword = {
    value: '',
    error: '',
    handleChange: (e) => {},
    handleBlur: () => {},
    forceValidate: () => true,
    clearField: () => {}
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    password.handleChange(e);
    if (confirmPassword.value) {
      confirmPassword.forceValidate();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isPasswordValid = password.forceValidate();
    const isConfirmPasswordValid = confirmPassword.forceValidate();
    
    if (!isPasswordValid || !isConfirmPasswordValid) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Password reset successful:", { password: password.value });
      password.clearField();
      confirmPassword.clearField();
      alert("Password reset successfully!");
    } catch (error) {
      console.error("Password reset failed:", error);
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
              <Key className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800">LegalMind</span>
          </div>
          
          <CardTitle className="text-2xl text-slate-800 mb-2">Reset your password</CardTitle>
          <CardDescription className="text-slate-600">
            Enter a new password below to change your password
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {/* Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password.value}
                    onChange={handlePasswordChange}
                    onBlur={password.handleBlur}
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
                
              {/* Confirm Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">Confirm Password</Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword.value}
                    onChange={confirmPassword.handleChange}
                    onBlur={confirmPassword.handleBlur}
                    className={cn(
                      "h-12 px-4 pr-12 bg-white/70 backdrop-blur-sm border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200",
                      confirmPassword.error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : ""
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent text-slate-400 hover:text-slate-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                {confirmPassword.error && (
                  <p className="text-xs text-red-500 pl-1">{confirmPassword.error}</p>
                )}
              </div>

              {/* Enhanced Reset Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:transform-none" 
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust indicators */}
      <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500" />
          <span>Secure & encrypted</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-green-500" />
          <span>Privacy protected</span>
        </div>
      </div>
    </div>
  );
}
