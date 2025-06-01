import { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have cn utility from shadcn/UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Eye, EyeIcon, EyeOff, EyeOffIcon, Loader2, Mail, User, Lock, FileText } from "lucide-react"; // Import icons from lucide-react
import { createValidation, useFieldValidation, ValidationPresets } from "@/services/ValidationService";
import AuthService from "@/services/AuthService";
import { useNavigate } from 'react-router-dom';

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const firstName = useFieldValidation(ValidationPresets.firstName);
  const lastName = useFieldValidation(ValidationPresets.lastName);
  const email = useFieldValidation(ValidationPresets.email);
  const password = useFieldValidation(ValidationPresets.password);

  const navigate = useNavigate();
  
  // State for password match validation
  const [passwordMatch, setPasswordMatch] = useState(true);
  
  // State for loading status
  const [isLoading, setIsLoading] = useState(false);

  // Custom validation for confirm password that checks matching
    const confirmPassword = useFieldValidation(
        createValidation({
        required: true,
        minLength: 8,
        custom: (value) => {
            // Custom rule: must match the password
            return value === password.value || value === ""
        },
        messages: {
            required: 'Please confirm your password',
            minLength: 'Password must be at least 8 characters',
            custom: 'Passwords do not match'
        }
        })
    )

    // Re-validate confirm password when main password changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    password.handleChange(e)
    // If confirm password has a value, re-validate it when main password changes
    if (confirmPassword.value) {
      confirmPassword.forceValidate()
    }
  }
  
 
    
   
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const isFirstNameValid = firstName.forceValidate()
    const isLastNameValid = lastName.forceValidate()
    const isEmailValid = email.forceValidate()
    const isPasswordValid = password.forceValidate()
    const isConfirmPasswordValid = confirmPassword.forceValidate()
    
    if (!isPasswordValid || !isConfirmPasswordValid || !isEmailValid || !isFirstNameValid || !isLastNameValid) {
      return;
    }
    
    // Set loading state
    setIsLoading(true);
    
    try {
        await AuthService.signup(
          firstName.value,
          lastName.value,
          email.value,
          password.value
        );

        navigate('/unverified-email');
    } catch (error) {
      console.error("Signup failed:", error);
      // Handle signup error (show message, etc.)
    } finally {
      // Reset loading state
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
          
          <CardTitle className="text-2xl text-slate-800 mb-2">Welcome to LegalMind</CardTitle>
          <CardDescription className="text-slate-600">
            Create your account to get started with AI-powered legal document analysis
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {/* First and Last Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-slate-700 font-medium flex items-center gap-2">
                    <User size={16} className="text-slate-500" />
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    required
                    value={firstName.value}
                    onChange={firstName.handleChange}
                    onBlur={firstName.handleBlur}
                    className={cn(
                      "h-12 px-4 bg-white/70 backdrop-blur-sm border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200",
                      firstName.error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : ""
                    )}
                  />
                  {firstName.error && (
                    <div className="text-xs text-red-500 pl-1 min-h-[16px]">
                      <p>{firstName.error}</p>
                    </div>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label className="text-slate-700 font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    required
                    value={lastName.value}
                    onChange={lastName.handleChange}
                    onBlur={lastName.handleBlur}
                    className={cn(
                      "h-12 px-4 bg-white/70 backdrop-blur-sm border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200",
                      lastName.error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : ""
                    )}
                  />
                  {lastName.error && (
                    <div className="text-xs text-red-500 pl-1 min-h-[16px]">
                      <p>{lastName.error}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Email Field */}
              <div className="grid gap-2">
                <Label className="text-slate-700 font-medium flex items-center gap-2" htmlFor="email">
                  <Mail size={16} className="text-slate-500" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jdoe@example.com"
                  required
                  value={email.value}
                  onChange={email.handleChange}
                  onBlur={email.handleBlur}
                  className={cn(
                    "h-12 px-4 bg-white/70 backdrop-blur-sm border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200",
                    email.error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : ""
                  )}
                />
                {email.error && (
                  <div className="text-xs text-red-500 pl-1 min-h-[16px]">
                    <p>{email.error}</p>
                  </div>
                )}
              </div>
              
              {/* Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-slate-700 font-medium flex items-center gap-2">
                  <Lock size={16} className="text-slate-500" />
                  Password
                </Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    required
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
                  <div className="text-xs text-red-500 pl-1 min-h-[16px] max-w-full">
                    <p className="truncate" title={password.error}>
                      {password.error.length > 55 ? `${password.error.substring(0, 55)}...` : password.error}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Confirm Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="text-slate-700 font-medium flex items-center gap-2">
                  <Lock size={16} className="text-slate-500" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"} 
                    required
                    value={confirmPassword.value}
                    onChange={confirmPassword.handleChange}
                    onBlur={confirmPassword.handleBlur}
                    className={cn(
                      "h-12 px-4 pr-12 bg-white/70 backdrop-blur-sm border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200",
                      confirmPassword.error || !passwordMatch ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : ""
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
                  <p className="text-xs text-red-500 pl-1 truncate" title={confirmPassword.error}>
                    {confirmPassword.error.length > 55 ? `${confirmPassword.error.substring(0, 55)}...` : confirmPassword.error}
                  </p>
                )}
                {!passwordMatch && (
                  <p className="text-xs text-red-500 pl-1">Passwords do not match</p>
                )}
              </div>
              
              {/* Enhanced Signup Button matching your landing page style */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:transform-none" 
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              
              {/* Login link */}
              <div className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <a 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-700 underline underline-offset-4 font-medium transition-colors"
                >
                  Sign in
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
          <span>Secure signup</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500" />
          <span>No spam, ever</span>
        </div>
      </div>

      {/* Terms */}
      <div className="text-center text-xs text-slate-500">
        By creating an account, you agree to our{" "}
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