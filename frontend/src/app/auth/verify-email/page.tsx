"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Bookmark,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error" | "expired"
  >("success");
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (email) {
      setUserEmail(email);
    }

    // If there's a token, attempt verification
    if (token) {
      verifyEmail(token);
    }
  }, [token, email]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      setVerificationStatus("pending");

      // Simulate API call to your backend
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      if (response.ok) {
        setVerificationStatus("success");
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        const errorData = await response.json();
        if (errorData.error === "TOKEN_EXPIRED") {
          setVerificationStatus("expired");
        } else {
          setVerificationStatus("error");
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationStatus("error");
    }
  };

  const resendVerificationEmail = async () => {
    if (!userEmail || isResending || resendCooldown > 0) return;

    try {
      setIsResending(true);

      // Simulate API call to resend verification email
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (response.ok) {
        setResendCooldown(60); // 60 second cooldown
      } else {
        throw new Error("Failed to resend email");
      }
    } catch (error) {
      console.error("Resend error:", error);
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "success":
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-green-900">Email Verified!</CardTitle>
              <CardDescription>
                Your email has been successfully verified. You&apos;ll be redirected
                to your dashboard shortly.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Welcome to ClipNest! Your account is now active.
                </AlertDescription>
              </Alert>
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        );

      case "error":
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-red-900">
                Verification Failed
              </CardTitle>
              <CardDescription>
                We couldn&apos;t verify your email address. The verification link may
                be invalid or corrupted.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  The verification link is invalid or has been corrupted. Please
                  request a new verification email.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Button
                  onClick={resendVerificationEmail}
                  disabled={isResending || resendCooldown > 0}
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    "Send New Verification Email"
                  )}
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="w-full bg-transparent"
                >
                  <Link href="/auth">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "expired":
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-orange-900">Link Expired</CardTitle>
              <CardDescription>
                This verification link has expired. Please request a new
                verification email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-orange-200 bg-orange-50">
                <XCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Verification links expire after 1 hour for security reasons.
                  Request a new one below.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Button
                  onClick={resendVerificationEmail}
                  disabled={isResending || resendCooldown > 0}
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    "Send New Verification Email"
                  )}
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="w-full bg-transparent"
                >
                  <Link href="/auth">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "pending":
      default:
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <CardTitle>Verifying Email...</CardTitle>
              <CardDescription>
                Please wait while we verify your email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  This should only take a moment...
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <Bookmark className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">ClipNest</h1>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
