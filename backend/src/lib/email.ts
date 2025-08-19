import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import { VerifyEmail } from "../emails/VerifyEmail";
import ResetPasswordEmail from "../emails/ResetPassword";

const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: Number(process.env.EMAIL_PORT),
	secure: process.env.EMAIL_SECURE === "true",
	auth:
		process.env.EMAIL_USER && process.env.EMAIL_PASSWORD
			? {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			}
			: undefined,
});

interface sendVerificationEmailProps {
	verificationUrl: string;
	callbackUrl?: string;
	userName?: string;
	userEmail: string;
}

interface sendPasswordResetEmailProps {
	url: string;
	userName?: string;
	userEmail: string;
}

export const sendVerificationEmail = async ({
	verificationUrl,
	callbackUrl,
	userName,
	userEmail,
}: sendVerificationEmailProps) => {
	 const url: string =
		verificationUrl +
		(callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : "");
	const verifyEmailHtml = await render(
		VerifyEmail({
			url,
			userName,
		}),
	);
	const options = {
		from: "no-reply@clipnest.cloud",
		to: userEmail,
		subject: "Verify your email",
		html: verifyEmailHtml,
	};

	await transporter.sendMail(options);
};

export const sendPasswordResetEmail = async ({
	url,
	userName,
	userEmail,
}: sendPasswordResetEmailProps) => {

	const verifyEmailHtml = await render(
		ResetPasswordEmail({
			url,
			userName,
		}),
	);
	const options = {
		from: "no-reply@clipnest.cloud",
		to: userEmail,
		subject: "Reset your password",
		html: verifyEmailHtml,
	};

	await transporter.sendMail(options);
};
