"use client";

import React, { useState } from "react";
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

interface RegistrationFormProps {
  handleRegister: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function RegistrationForm({
  handleRegister,
  isLoading,
  error,
}: RegistrationFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleRegister}>
      <CardContent className="space-y-4">
        <CardTitle>Create account</CardTitle>
        <CardDescription>
          Sign up to start organizing your bookmarks
        </CardDescription>
        <div className="space-y-2">
          <Label htmlFor="name-register">Full Name</Label>
          <Input
            id="name-register"
            type="text"
            placeholder="Enter your full name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email-register">Email</Label>
          <Input
            id="email-register"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="relative space-y-2">
          <Label htmlFor="password-register">Password</Label>
          <Input
            id="password-register"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
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
              <Eye className="h-w-5" />
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
				{error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </CardFooter>
    </form>
  );
}
