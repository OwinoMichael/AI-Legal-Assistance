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
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useSubmitValidation, ValidationPresets } from "@/services/ValidationService"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  
  // Use submit-only validation for login form
  const email = useSubmitValidation(ValidationPresets.loginEmail)
  const password = useSubmitValidation(ValidationPresets.loginPassword)

  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate only on submit - no real-time validation
    const isEmailValid = email.forceValidate()
    const isPasswordValid = password.forceValidate()

    if (!isEmailValid || !isPasswordValid) {
      return; // Show errors and stop submission
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
      // setFormData({
      //   email: "",
      //   password: ""
      // });
    }
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            {/* Login with your Apple or Google account */}
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="jdoe@example.com"
                    required
                    value={email.value}
                    onChange={email.handleChange}
                    className={email.error ? "border-red-500" : ""}
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
                    <a
                      href="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
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
                      className={password.error ? "border-red-500" : ""} 
                    />
                    {password.error && (
                      <div className="text-xs text-red-500 pl-1 min-h-[16px]">
                        <p>{password.error}</p>
                      </div>
                    )}
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
                  
                    
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log In"
                  )}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
