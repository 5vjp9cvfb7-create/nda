# NDA x UD Coalition Website

Premium, responsive Next.js website for the NDA x UD student coalition. It includes public pages, smooth Framer Motion animations, dark/light mode, global search, contact and membership forms, and a Firebase-ready protected admin dashboard.

## Stack

- Next.js, React, TypeScript
- Tailwind CSS
- Framer Motion
- Firebase Authentication, Firestore and Storage
- Optional SMTP email delivery for contact form messages

## Local Setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Firebase Setup

1. Create a Firebase project.
2. Enable Email/Password authentication.
3. Add the public Firebase web config to `.env.local` using `.env.example`.
4. Add server-side Firebase Admin credentials using `FIREBASE_SERVICE_ACCOUNT_JSON` or the separate project/client/private-key variables.
5. Set `NEXT_PUBLIC_ADMIN_EMAILS` to comma-separated admin email addresses.
6. Deploy `firestore.rules` and `storage.rules`.

Without Firebase variables, the admin dashboard runs in demo mode and stores edits in browser local storage.

## Contact Email

The contact form always accepts the message. It saves to Firestore when Firebase Admin is configured. To send directly to `macfrost2811@gmail.com`, add SMTP values in `.env.local`:

```bash
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
CONTACT_TO_EMAIL=macfrost2811@gmail.com
```

## Admin Features

- Upload logos, photos, carousel images, event images, agenda images and notice attachments
- Edit homepage, about page, statistics, agenda, leadership and notices
- Create, edit, delete, pin, search and attach files to notices
- Review contact messages and membership applications
- Export messages and applications as CSV

## Production

```bash
pnpm build
pnpm start
```

Replace `https://nda-ud-coalition.example` in metadata, sitemap and robots with the final production domain before deployment

