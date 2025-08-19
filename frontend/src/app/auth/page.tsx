"use client";

import { Bookmark } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./components/login-form";
import RegistrationForm from "./components/registration-form";
import { useAuth } from "./services/auth-service";

export default function AuthPage() {
  const { isLoading, handleLogin, handleRegister, error, clearError } = useAuth();

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
          <Tabs defaultValue="login" className="w-full" onValueChange={clearError}>
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
            </CardHeader>

            <TabsContent value="login">
              <LoginForm handleLogin={handleLogin} isLoading={isLoading} error={error} />
            </TabsContent>

            <TabsContent value="register">
              <RegistrationForm
                handleRegister={handleRegister}
                isLoading={isLoading}
                error={error}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
