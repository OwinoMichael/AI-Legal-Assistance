import { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have cn utility from shadcn/UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"; // Import icons from lucide-react
import { createValidation, useFieldValidation, ValidationPresets } from "@/services/ValidationService";

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
      // Process form submission here - simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      console.log("Form submitted:");
      // Add your signup logic here
      
      // Reset form or redirect after successful signup
      // navigate("/dashboard"); // If using React Router
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
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to Legal-Mind</CardTitle>
          <CardDescription>
            Sign up to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label className="text-left pl-1">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    required
                    value={firstName.value}
                    onChange={firstName.handleChange}
                    onBlur={firstName.handleBlur}
                    className={firstName.error ? "border-red-500" : ""}
                  />
                  {firstName.error && (
                    <div className="text-xs text-red-500 pl-1 min-h-[16px]">
                      <p>{firstName.error}</p>
                    </div>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label className="text-left pl-1">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    required
                    value={lastName.value}
                    onChange={lastName.handleChange}
                    onBlur={lastName.handleBlur}
                    className={lastName.error ? "border-red-500" : ""}
                  />
                  {lastName.error && (
                    <div className="text-xs text-red-500 pl-1 min-h-[16px]">
                      <p>{lastName.error}</p>
                    </div>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label className="text-left pl-1" htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="jdoe@example.com"
                    required
                    value={email.value}
                    onChange={email.handleChange}
                    onBlur={email.handleBlur}
                  />
                  {email.error && (
                    <div className="text-xs text-red-500 pl-1 min-h-[16px]">
                      <p>{email.error}</p>
                    </div>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      required
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
                  {/* <div className="min-h-[16px] max-w-full pl-1"> */}
                      {password.error && (
                        <div className="text-xs text-red-500 pl-1 min-h-[16px] max-w-full">
                            <p className="truncate" title={password.error}>
                            {password.error.length > 55 ? `${password.error.substring(0, 55)}...` : password.error}
                            </p>
                        </div>
                    )}
                  {/* </div> */}
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                  </div>
                  <div className="relative">
                    <Input 
                      id="confirmPassword" 
                      type={showConfirmPassword ? "text" : "password"} 
                      required
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
                  {/* <div className="min-h-[16px] max-w-full pl-1"> */}
                    {confirmPassword.error && (
                    <p className="text-xs text-red-500 truncate" title={confirmPassword.error}>
                        {confirmPassword.error.length > 55 ? `${confirmPassword.error.substring(0, 55)}...` : confirmPassword.error}
                    </p>
                    )}
                  {/* </div> */}
                  {!passwordMatch && (
                    <p className="text-xs text-red-500 pl-1">Passwords do not match</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing up...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
              
              <div className="text-center text-sm">
                Have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}