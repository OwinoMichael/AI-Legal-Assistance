import React, { useState } from 'react'
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
import { Loader2 } from "lucide-react"
import { ValidationPresets,  useFieldValidation } from '@/services/ValidationService'

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const [isLoading, setIsLoading] = useState(false)
  
  const email = useFieldValidation(ValidationPresets.email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const isEmailValid = email.forceValidate();

    if(!isEmailValid){
        return
    }
    

    setIsLoading(true)
    try {
      // Simulate async operation
      await new Promise((res) => setTimeout(res, 1000))
      alert(`Password reset email sent to ${email}`)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false);
      
    }
  }

   

    

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot Password</CardTitle>
          <CardDescription>
            <p>Provide the email address attached to your account </p>
            <p className='text-left'>and we will send a link to reset your password</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-left pl-1">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="jdoe@example.com"
                  value={email.value}
                  onChange={email.handleChange}
                  onBlur={email.handleBlur}
                  className={email.error ? "border-red-500" : ""}
                />
                {/* Error message div - only visible when emailError exists */}
                {email.error && (
                  <div className="text-red-500 text-sm mt-1 pl-1">
                    <p>
                        {email.error}
                    </p>
                    
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading }>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending email...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>

              <div className="text-right text-sm">
                <a href="/signup" className="underline underline-offset-4 pr-4">
                  Sign up
                </a>
                <a href="/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}