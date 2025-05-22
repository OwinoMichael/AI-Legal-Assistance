import { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have cn utility from shadcn/UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react"


 export function ResetPasswordForm({
   className,
   ...props
 }: React.ComponentPropsWithoutRef<"div">){

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  })

  const [isLoading, setIsLoading] = useState(false)
  // State for password match validation
  const [passwordMatch, setPasswordMatch] = useState(true);
  
  // State for loading status



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
        password: "",
        confirmPassword: ""
      })
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
                      type= "text"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                    
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="confirmPassword" className="pl-1">Confirm Password</Label>
                  </div>
                  <div className="relative">
                    <Input 
                      id="confirmPassword" 
                      type= "text"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={!passwordMatch ? "border-red-500" : ""}
                    />
                    
                  </div>
                  {!passwordMatch && (
                    <p className="text-xs text-red-500 pl-1">Passwords do not match</p>
                  )}
                </div>
               

              <Button type="submit" className="w-full" disabled={isLoading}>
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

