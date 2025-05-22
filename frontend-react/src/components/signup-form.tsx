import { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have cn utility from shadcn/UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"; // Import icons from lucide-react

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // State for form values
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  // State for password match validation
  const [passwordMatch, setPasswordMatch] = useState(true);
  
  // State for loading status
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Check if passwords match when either password field changes
    if (id === "password" || id === "confirmPassword") {
      if (id === "password") {
        setPasswordMatch(value === formData.confirmPassword || formData.confirmPassword === "");
      } else {
        setPasswordMatch(value === formData.password);
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Process form submission here - simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      console.log("Form submitted:", formData);
      // Add your signup logic here
      
      // Reset form or redirect after successful signup
      // navigate("/dashboard"); // If using React Router
    } catch (error) {
      console.error("Signup failed:", error);
      // Handle signup error (show message, etc.)
    } finally {
      // Reset loading state
      setIsLoading(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
      })
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
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label className="text-left pl-1">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label className="text-left pl-1" htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jdoe@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
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
                      value={formData.password}
                      onChange={handleChange}
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
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={!passwordMatch ? "border-red-500" : ""}
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