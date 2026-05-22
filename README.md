# Conie Bakes — Customer-Facing Website

A cozy, warm bakery website for **Conie Bakes** (@coniebakes), a home bakery based in the Philippines. Built with Next.js, Firebase, and Resend.

## Features

- Browse the full product menu with pricing and storage details
- Add items to cart and proceed to checkout
- Order request form that notifies the owner via email
- Delivery date picker with availability validation (max 12 deliveries/day)
- Contact form for inquiries, special orders, and feedback

## Tech Stack

- **Next.js** — frontend framework
- **Firebase Firestore** — product and delivery data
- **Resend** — transactional emails
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

4. Seed the database:

```bash
curl http://localhost:3000/api/seed-products
```
## Next Objectives

- [ ] Add images for homepage and menu
- [ ] User test the UI
- [ ] Implement Resend with coniebakes@gmail.com (Rotate API keys on all platforms)
- [ ] Begin `coniebakes-admin` — separate Next.js project for owner-facing management once site is officially deployed

## Notes

- This is the customer-facing site only. The admin panel is a separate project (`coniebakes-admin`).
- Never commit `.env.local` — it is already covered by `.gitignore`.