import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getAdminDb } from "@/lib/firebase/server";
import type { ContactMessage } from "@/lib/types";

function isValidContact(payload: Partial<ContactMessage>) {
  return Boolean(payload.email && payload.subject && payload.message);
}

async function sendEmail(payload: ContactMessage) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.CONTACT_TO_EMAIL ?? "macfrost2811@gmail.com",
    replyTo: payload.email,
    subject: `[NDA x UD] ${payload.subject}`,
    text: `From: ${payload.email}\n\n${payload.message}`
  });

  return true;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as ContactMessage;

  if (!isValidContact(payload)) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const message = {
    email: payload.email,
    subject: payload.subject,
    message: payload.message,
    createdAt: new Date().toISOString()
  };

  const db = getAdminDb();

  if (db) {
    await db.collection("contactMessages").add(message);
  }

  const emailed = await sendEmail(message);

  return NextResponse.json({
    ok: true,
    savedToFirebase: Boolean(db),
    emailed
  });
}
