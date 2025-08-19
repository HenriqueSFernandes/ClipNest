"use client";

import { useState, useEffect } from "react";
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
  Mail,
  RefreshCw,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function CheckEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const resendVerificationEmail = async () => {
    if (isResending || resendCooldown > 0) return;

    try {
      setIsResending(true);
      setResendSuccess(false);

      const status = await authClient.sendVerificationEmail({
        email: "admin@example.com",
        callbackURL: process.env.NEXT_PUBLIC_BASE_URL + "/auth/verify-email",
      });

      if (!status.error) {
        setResendCooldown(60);
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        throw new Error("Failed to resend email");
      }
    } catch (error) {
      console.error("Resend error:", error);
    } finally {
      setIsResending(false);
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

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>
              We&apos;ve sent you a verification link
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Click the verification link in your email to activate your
                ClipNest account. The link will expire in 24 hours.
              </p>

              {resendSuccess && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Verification email sent successfully! Check your inbox.
                  </AlertDescription>
                </Alert>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  What to do next:
                </h4>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Check your email inbox for a message from ClipNest</li>
                  <li>Click the &quot;Verify Email Address&quot; button in the email</li>
                  <li>You&apos;ll be automatically signed in to your account</li>
                </ol>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Can&apos;t find the email?</strong> Check your spam or junk
                  folder. Sometimes verification emails end up there.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={resendVerificationEmail}
                disabled={isResending || resendCooldown > 0}
                variant="outline"
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
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>

              <Button variant="ghost" asChild className="w-full">
                <Link href="/auth">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Need help? Contact our support team at{" "}
                <a
                  href="mailto:support@clipnest.com"
                  className="text-blue-600 hover:underline"
                >
                  support@clipnest.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
