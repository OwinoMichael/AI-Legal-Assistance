import { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have cn utility from shadcn/UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"; // Import icons from lucide-react
import { createValidation, useFieldValidation, ValidationPresets } from "@/services/ValidationService";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Use validation hooks for both password fields
  const password = useFieldValidation(ValidationPresets.password)

  // State for password match validation
  const [passwordMatch, setPasswordMatch] = useState(true);
  
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

    // Validate both fields
    const isPasswordValid = password.forceValidate()
    const isConfirmPasswordValid = confirmPassword.forceValidate()
    
    if (!isPasswordValid || !isConfirmPasswordValid) {
      return;
    }
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Process form submission here - simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Password reset successful:", {
        password: password.value
      });
      
      // Reset form after successful submission
      password.clearField();
      confirmPassword.clearField();
      
      // Add success message or redirect
      alert("Password reset successfully!");
      
    } catch (error) {
      console.error("Password reset failed:", error);
      // Handle error (show message, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>
            Enter a new password below to change your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="pl-1">Password</Label>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password.value}
                    onChange={handlePasswordChange}
                    onBlur={password.handleBlur}
                    className={password.error ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="transparent"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                    ) : (
                    <EyeIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                    </span>
                </Button>
                </div>
                {password.error && (
                  <div className="text-xs text-red-500 pl-1 min-h-[32px] whitespace-pre-wrap leading-snug">
                    <p className="truncate" title={password.error}>
                      {password.error.length > 55 ? `${password.error.substring(0, 55)}...` : password.error}
                    </p>
                  </div>
                )}
              </div>
                
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirmPassword" className="pl-1">Confirm Password</Label>
                </div>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword.value}
                    onChange={confirmPassword.handleChange}
                    onBlur={confirmPassword.handleBlur}
                    className={confirmPassword.error ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="transparent"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                    ) : (
                    <EyeIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                    {showConfirmPassword ? "Hide password" : "Show password"}
                    </span>
                </Button>
                </div>
                {confirmPassword.error && (
                  <div className="text-xs text-red-500 pl-1 min-h-[32px] whitespace-pre-wrap leading-snug">
                    <p className="truncate" title={confirmPassword.error}>
                      {confirmPassword.error.length > 55 ? `${confirmPassword.error.substring(0, 55)}...` : confirmPassword.error}
                    </p>
                  </div>
                )}
                {!passwordMatch && (
                    <p className="text-xs text-red-500 pl-1">Passwords do not match</p>
                  )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}