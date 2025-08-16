"use client";

import type React from "react";
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

interface LoginFormProps {
  handleLogin: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

export default function LoginForm({ handleLogin, isLoading }: LoginFormProps) {
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
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
        <Link href="#" className="text-sm text-blue-600 hover:underline">
          Forgot your password?
        </Link>
      </CardFooter>
    </form>
  );
}
