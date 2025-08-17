/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
		// TODO: handle missing email verification and other errors
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    const { data, error } = await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: (ctx) => {
          setIsLoading(true);
        },
        onSuccess: (ctx) => {
          setIsLoading(false);
          router.push("/dashboard");
        },
        onError: (ctx) => {
          alert(ctx.error.message);
          console.log(ctx);
        },
      },
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const name = form["name-register"].value;
    const email = form["email-register"].value;
    const password = form["password-register"].value;

    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onRequest: (ctx) => {
          setIsLoading(true);
        },
        onSuccess: (ctx) => {
          setIsLoading(false);
          router.push("/dashboard");
        },
        onError: (ctx) => {
          alert(ctx.error.message);
          console.log(ctx);
        },
      },
    );
  };

	const handleLogout = async () => {
		const {data, error} = await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/auth");
				}
			}
		})

	}

  return {
    isLoading,
    handleLogin,
    handleRegister,
  };
};
