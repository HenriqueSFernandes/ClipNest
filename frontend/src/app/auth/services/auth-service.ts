/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const useAuth = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null); // Clear previous errors
		const form = e.target as HTMLFormElement;
		const email = form.email.value;
		const password = form.password.value;

		const { data, error: authError } = await authClient.signIn.email(
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
					setIsLoading(false);
					setError(ctx.error.message);
				},
			},
		);
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null); // Clear previous errors

		const form = e.target as HTMLFormElement;
		const name = form["name-register"].value;
		const email = form["email-register"].value;
		const password = form["password-register"].value;

		const { data, error: authError } = await authClient.signUp.email(
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
					// router.push("/auth/check-email");
					router.push("/dashboard");
				},
				onError: (ctx) => {
					setIsLoading(false);
					setError(ctx.error.message);
				},
			},
		);
	};

	const handleLogout = async () => {
		const { data, error } = await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/auth");
				},
			},
		});
	};

	const clearError = () => {
		setError(null);
	};

	return {
		isLoading,
		error,
		handleLogin,
		handleRegister,
		handleLogout,
		clearError,
	};
};
