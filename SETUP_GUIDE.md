# Cafe Crown — Website Setup Guide

> Complete deployment and configuration guide for the developer/client.

---

## 🚀 Quick Start (Development)

```bash
# 1. Ensure Node.js is in your PATH (it's at C:\nodejs\node-v20.18.1-win-x64)
# Either add it permanently to Windows PATH, or prefix each command:

set PATH=C:\nodejs\node-v20.18.1-win-x64;%PATH%

# 2. Install dependencies (already done)
npm install

# 3. Copy environment file and fill in values
copy .env.local.example .env.local

# 4. Start development server
npm run dev

# Open: http://localhost:3000
```

---

## 🔑 Step 1 — Firebase Setup

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project: **cafe-crown** (or any name)
3. Enable **Firestore Database** (start in production mode)
4. Enable **Authentication** → Email/Password provider
5. Create an admin account: go to Authentication → Users → Add User
   - Email: `owner@cafecrown.in` (or any email)
   - Password: choose a strong password
6. Go to **Project Settings** → Your apps → Add Web App
7. Copy the config values to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cafe-crown.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cafe-crown
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cafe-crown.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

8. Go to **Project Settings** → Service Accounts → Generate New Private Key
9. Download the JSON file
10. Add to `.env.local`:

```env
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"cafe-crown",...}
```

---

## 💳 Step 2 — Razorpay Setup

1. Go to [https://razorpay.com](https://razorpay.com) → Sign Up
2. Complete KYC with business PAN (the client's PAN card)
3. Go to **Settings** → **API Keys** → Generate Test Key
4. Add to `.env.local`:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
```

5. When going live, generate **Live Keys** and replace `rzp_test_` with `rzp_live_`

---

## 📱 Step 3 — WhatsApp (WATI) Setup

1. Go to [https://www.wati.io](https://www.wati.io) → Start Free Trial
2. Connect your WhatsApp Business number (owner's number: 9838226066)
3. Go to **API** → Copy your:
   - API Endpoint (e.g., `https://live-server-12345.wati.io`)
   - API Token (Bearer token)
4. Add to `.env.local`:

```env
WATI_API_ENDPOINT=https://live-server-12345.wati.io
WATI_API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OWNER_WHATSAPP_NUMBER=919838226066
```

---

## 🌐 Step 4 — Domain & Deployment

### Get a Domain (cheapest option)
1. Go to [hostinger.in](https://www.hostinger.in)
2. Search for `cafecrown.in` → ~₹199/year (first year promo)
3. Purchase and note your domain

### Deploy to Vercel (free)
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial Cafe Crown website"
   git remote add origin https://github.com/yourusername/cafe-crown.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → Import your GitHub repo
3. In Vercel dashboard → Settings → Environment Variables
4. Add ALL the variables from your `.env.local`
5. Deploy!

### Connect Domain
1. In Vercel: Settings → Domains → Add `cafecrown.in`
2. In Hostinger DNS: Add the CNAME record Vercel gives you
3. Done! Your site is live at `cafecrown.in`

---

## 🔥 Step 5 — Deploy Firestore Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

---

## 👤 Admin Dashboard

- URL: `https://cafecrown.in/admin`
- Login with the email/password you set in Firebase Auth Step 5
- From dashboard you can:
  - See all live orders in real-time
  - Update order status (triggers WhatsApp to customer)
  - Manage menu items
  - View revenue analytics

---

## 📋 Final .env.local Template

```env
# Firebase (client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase (server-side admin)
FIREBASE_SERVICE_ACCOUNT_JSON=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# WhatsApp (WATI)
WATI_API_ENDPOINT=
WATI_API_TOKEN=
OWNER_WHATSAPP_NUMBER=91XXXXXXXXXX

# App URL (for internal API calls)
NEXT_PUBLIC_APP_URL=https://cafecrown.in
```

---

## 🆘 Common Issues

| Issue | Fix |
|---|---|
| `node` not found | Add `C:\nodejs\node-v20.18.1-win-x64` to Windows PATH |
| Payment not working | Check Razorpay keys in `.env.local` |
| WhatsApp not sending | Verify WATI endpoint and token |
| Orders not saving | Check Firebase service account JSON |
| Build errors | Run `npm run build` locally to see errors |
