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

interface VerifyEmailProps {
	url?: string;
	userName?: string;
}

export const VerifyEmail = ({
	url,
	userName,
}: VerifyEmailProps) => (
	<Html>
		<Head />
		<Body style={main}>
			<Preview>Confirm your ClipNest account</Preview>
			<Container style={container}>
				{/* Logo 
        <Img
          src={`${baseUrl}/static/clipnest-logo.png`}
          width="42"
          height="42"
          alt="ClipNest"
          style={logo}
        />
*/}

				{/* Heading */}
				<Heading style={heading}>Confirm your ClipNest account</Heading>

				{/* Greeting */}
				<Text style={paragraph}>{userName ? `Hi ${userName},` : "Hello,"}</Text>
				<Text style={paragraph}>
					Thanks for signing up to <strong>ClipNest</strong>. Please confirm
					your email address to activate your account.
				</Text>

				{/* Button */}
				<Section style={buttonContainer}>
					<Button style={button} href={url}>
						Confirm Your Account
					</Button>
				</Section>

				{/* Fallback link */}
				<Text style={paragraph}>
					Didn’t work? Copy and paste this link into your browser:
				</Text>
				<Link href={url} style={link}>
					{url}
				</Link>

				<Hr style={hr} />

				{/* Footer */}
				<Text style={footer}>
					If you didn’t create a ClipNest account, you can ignore this email.
				</Text>
			</Container>
		</Body>
	</Html>
);

VerifyEmail.PreviewProps = {
	verificationUrl: "https://clipnest.cloud/verify/abc123",
	userName: "Henrique",
} as VerifyEmailProps;

export default VerifyEmail;

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
	letterSpacing: "-0.5px",
	lineHeight: "1.3",
	fontWeight: "400",
	color: "#484848",
	padding: "17px 0 0",
};

const paragraph = {
	margin: "0 0 15px",
	fontSize: "15px",
	lineHeight: "1.4",
	color: "#3c4149",
};

const buttonContainer = {
	padding: "27px 0 27px",
};

const button = {
	backgroundColor: "#2563eb",
	borderRadius: "4px",
	fontWeight: "600",
	color: "#fff",
	fontSize: "15px",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block",
	padding: "11px 23px",
};

const link = {
	fontSize: "14px",
	color: "#2563eb",
	wordBreak: "break-all" as const,
};

const hr = {
	borderColor: "#dfe1e4",
	margin: "42px 0 26px",
};

const footer = {
	fontSize: "13px",
	color: "#8898aa",
};
