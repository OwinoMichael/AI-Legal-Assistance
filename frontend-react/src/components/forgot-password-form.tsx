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
import { Loader2 } from "lucide-react" // ✅ Add this

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value) // ✅ Set string directly
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Simulate async operation
      await new Promise((res) => setTimeout(res, 1000))
      alert(`Password reset email sent to ${email}`)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false);
      setEmail("");
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
                  type="email"
                  placeholder="jdoe@example.com"
                  required
                  value={email}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
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
