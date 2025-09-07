import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import React from "react";

interface ResetPasswordEmailProps {
	url?: string;
	userName?: string;
}

export const ResetPasswordEmail = ({
	url,
	userName,
}: ResetPasswordEmailProps) => {
	const frontendUrl = process.env.BASE_FRONTEND_URL || "https://clipnest.cloud";

	return (
		<Html>
			<Head />
			<Body style={main}>
				<Preview>Reset your ClipNest password</Preview>
				<Container style={container}>
					<Img
						src={`${frontendUrl}/clipnest-logo.svg`}
						width="42"
						height="42"
						alt="ClipNest"
						style={logo}
					/>

					{/* Heading */}
					<Heading style={heading}>Reset your password</Heading>

					{/* Greeting */}
					<Text style={paragraph}>
						{userName ? `Hi ${userName},` : "Hello,"}
					</Text>
					<Text style={paragraph}>
						We received a request to reset the password for your{" "}
						<strong>ClipNest</strong> account. Click the button below to set a
						new password.
					</Text>

					{/* Button */}
					<Section style={buttonContainer}>
						<Button style={button} href={url}>
							Reset Password
						</Button>
					</Section>

					{/* Fallback link */}
					<Text style={paragraph}>
						If the button doesn’t work, copy and paste this link into your
						browser:
					</Text>
					<Link href={url} style={link}>
						{url}
					</Link>

					<Hr style={hr} />

					{/* Footer */}
					<Text style={footer}>
						If you didn’t request a password reset, you can safely ignore this
						email—your password will remain unchanged.
					</Text>
				</Container>
			</Body>
		</Html>
	);
};

ResetPasswordEmail.PreviewProps = {
	url: "https://clipnest.cloud/reset/xyz456",
	userName: "Henrique",
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;

/* ---------- Styles ---------- */

const main = {
	backgroundColor: "#ffffff",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
	maxWidth: "560px",
};

const logo = {
	borderRadius: 8,
	width: 42,
	height: 42,
};

const heading = {
	fontSize: "24px",
	fontWeight: "bold",
	textAlign: "center" as const,
	margin: "40px 0 20px",
};

const paragraph = {
	fontSize: "16px",
	lineHeight: "26px",
	margin: "16px 0",
};

const buttonContainer = {
	textAlign: "center" as const,
	margin: "30px 0",
};

const button = {
	backgroundColor: "#4F46E5",
	color: "#ffffff",
	fontSize: "16px",
	fontWeight: "bold",
	textDecoration: "none",
	padding: "12px 24px",
	borderRadius: "6px",
};

const link = {
	color: "#4F46E5",
	wordBreak: "break-all" as const,
};

const hr = {
	borderColor: "#eaeaea",
	margin: "26px 0",
};

const footer = {
	fontSize: "12px",
	color: "#888888",
	lineHeight: "20px",
};
