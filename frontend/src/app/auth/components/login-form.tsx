"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  handleLogin: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function LoginForm({
  handleLogin,
  isLoading,
  error,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to access your bookmarks
        </CardDescription>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="relative space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-6"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
        <Link
          href="/auth/forgot-password"
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot your password?
        </Link>
      </CardFooter>
    </form>
  );
}
