"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bookmark, ArrowLeft, Mail, AlertCircle } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    await authClient.requestPasswordReset(
      {
        email,
        redirectTo: process.env.NEXT_PUBLIC_BASE_URL + "/auth/reset-password",
      },
      {
        onRequest: () => {
          setIsLoading(true);
          setError("");
          setIsSubmitted(false);
        },
        onSuccess: () => {
          setIsLoading(false);
          setError("");
          setIsSubmitted(true);
        },
        onError: (ctx) => {
          setIsLoading(false);
          setError(ctx.error.message || "An unexpected error occurred");
          setIsSubmitted(false);
        },
      },
    );
  };

  if (isSubmitted) {
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
                We&apos;ve sent password reset instructions to{" "}
                <strong>{email}</strong>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Click the reset link in your email to create a new password.
                  The link will expire in 1 hour for security.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    What to do next:
                  </h4>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Check your email inbox for a message from ClipNest</li>
                    <li>
                      Click the &quot;Reset Password&quot; button in the email
                    </li>
                    <li>Create your new password on the next page</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Can&apos;t find the email?</strong> Check your spam
                    or junk folder. Sometimes reset emails end up there.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send to Different Email
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
            <CardTitle>Forgot Password?</CardTitle>
            <CardDescription>
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </CardContent>
          </form>

          <CardContent className="pt-0">
            <div className="text-center">
              <Button variant="ghost" asChild>
                <Link href="/auth">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
