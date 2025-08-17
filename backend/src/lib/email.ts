import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import { VerifyEmail } from "../emails/VerifyEmail";

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
  userName?: string;
  userEmail: string;
}

export const sendVerificationEmail = async ({
  verificationUrl,
  userName,
  userEmail,
}: sendVerificationEmailProps) => {
  const verifyEmailHtml = await render(
    VerifyEmail({
      verificationUrl,
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
