"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

interface RegistrationFormProps {
  handleRegister: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

export default function RegistrationForm({
  handleRegister,
  isLoading,
}: RegistrationFormProps) {
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
        <div className="space-y-2">
          <Label htmlFor="password-register">Password</Label>
          <Input
            id="password-register"
            type="password"
            placeholder="Create a password"
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </CardFooter>
    </form>
  );
}
