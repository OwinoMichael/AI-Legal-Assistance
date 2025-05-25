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
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <div className="text-sm text-red-500 text-center bg-red-100 border border-red-300 p-2 rounded-md mb-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                  <p className="text-xs text-red-500 pl-1">{email.error}</p>
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
                  <p className="text-xs text-red-500 pl-1">{password.error}</p>
                )}
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

      <div className="text-center text-xs text-muted-foreground mt-2 [&_a]:underline [&_a]:hover:text-primary">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}