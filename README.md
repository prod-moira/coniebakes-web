# Conie Bakes — Ordering Platform

A full-stack ordering system for **Conie Bakes** (@coniebakes), a home bakery based in the Philippines. Built to replace a Facebook Messenger-based ordering workflow with a structured, guided digital experience.

🔗 [Live Site](https://coniebakes.vercel.app)

## Features
- Product catalog with modal-based detail view for structured variation selection
- Cart system with localStorage persistence across sessions
- Order submission flow with automated email notification to the bakery
- Delivery date picker with availability validation
- Contact form for inquiries, special orders, and feedback

## Tech Stack
- **Next.js** — frontend framework with built-in API routes for server-side order processing
- **TypeScript** — type safety
- **Firebase Firestore** — cloud database for products and orders
- **Resend** — transactional email notifications
- **Vercel** — deployment
- **Tailwind CSS** — styling

## Getting Started

1. Clone the repo and install dependencies:
```bash
npm install
```

2. Set up your environment variables. Create a `.env.local` file at the root:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
RESEND_API_KEY=
```

3. Run the development server:
```bash
npm run dev
```

## Notes
- This is the customer-facing site only. The admin panel is a separate project.
- Never commit `.env.local` — already covered by `.gitignore`.