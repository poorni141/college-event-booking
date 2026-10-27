# CampusTix · College Event Ticket & Reservation Platform

> **Your Next Big Campus Moment.**
> Discover exciting campus events, book your tickets, and make memories that last.

CampusTix is a modern, responsive collegiate event ticket reservation platform built with React 19, TypeScript, Tailwind CSS, Node.js Express, and Prisma ORM with PostgreSQL.

---

## Visual Design Palette

- **Deep Charcoal Canvas**: `#121116` / `#181622` / `#221f2f`
- **Rich Violet**: `#8B5CF6`
- **Lavender Accent**: `#C4B5FD`
- **Warm Coral Primary CTAs**: `#FF7F6B`
- **Modern Typography**: Plus Jakarta Sans & JetBrains Mono (tabular numbers)

---

## Core Features

- **Event Discovery**: Browse and search across 7 flagship categories: Culturals, Symposium, Hackathon, Music Night, Dance Competition, Sports Meet, and Workshops.
- **Seat Allocation & Quantity Selection**: Interactive auditorium seating matrix (Rows A–F) with quick quantity buttons (`1 Ticket`, `2 Tickets`, `3 Tickets`, `4 Tickets`) and auto-assignment.
- **10-Minute Atomic Hold Mechanism**: Prevents overselling during high-traffic registrations. Reserved seats are locked for 10 minutes with an active ticking countdown (`09:59`) and automatically released if unconfirmed.
- **Duplicate Booking Prevention**: Guards against multiple simultaneous bookings for the same user or overlapping seats.
- **Verified QR Passes**: Cryptographically structured QR code passes generated in real time, with boarding-pass print and PDF download support.
- **My Passes & Cancellations**: Review past and upcoming passes with instant seat-inventory restoration upon cancellation.
- **Admin Dashboard**: Live ticket revenue analytics (₹), capacity utilization, Event CRUD (Create, Edit, Delete), and attendee roster CSV export.

---

## Quickstart (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<your-username>/campustix.git
cd campustix
npm install
```

### 2. Configure Environment Variables
Copy the template file to `.env`:
```bash
cp .env.example .env
```
Edit `.env` with your preferred ports and PostgreSQL database credentials:
```env
PORT=3000
JWT_SECRET="your-secure-jwt-secret-here"
DATABASE_URL="postgresql://user:password@localhost:5432/campustix_db?schema=public"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Setup (PostgreSQL + Prisma)

### Option A: Free Hosted Database (Supabase or Neon)
If you do not have a local PostgreSQL installation, you can create a free cloud database in 2 minutes:
1. Create a free project at [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy your connection URI (e.g. `postgresql://user:password@ep-xyz.neon.tech/campustix?sslmode=require`).
3. Paste the connection string into your `.env` file under `DATABASE_URL`.
4. Apply the Prisma schema migration:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Seed initial campus events and demo users:
   ```bash
   npx tsx prisma/seed.ts
   ```

### Option B: Local PostgreSQL Docker Container
```bash
docker run --name campustix-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=campustix -p 5432:5432 -d postgres:15
```

---

## Pushing to GitHub

Follow these steps to publish your code to a new public GitHub repository:

```bash
# 1. Initialize git repository (if not already initialized)
git init

# 2. Add all files (secrets in .env are safely ignored by .gitignore)
git add .

# 3. Create your first commit
git commit -m "feat: complete CampusTix collegiate ticketing platform"

# 4. Rename main branch
git branch -M main

# 5. Link to your GitHub repository
git remote add origin https://github.com/<your-username>/campustix.git

# 6. Push code to GitHub
git push -u origin main
```

> **Security Note**: Never commit `.env` or sensitive credentials. The repository includes `.gitignore` pre-configured to ignore all `.env` files while preserving `.env.example`.

---

## Public Deployment Guide

### Deploying to Google Cloud Run (Recommended)

Google Cloud Run provides serverless container execution with automated SSL certificates and scalable pricing.

#### Step 1: Install & Authenticate Google Cloud CLI
```bash
gcloud auth login
gcloud config set project <YOUR_GCP_PROJECT_ID>
```

#### Step 2: Build and Deploy using Cloud Run
Using the included production `Dockerfile`:
```bash
gcloud run deploy campustix \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,PORT=3000,JWT_SECRET=super-secure-production-key \
  --set-env-vars DATABASE_URL="YOUR_HOSTED_POSTGRES_URL"
```

Once deployment completes, Cloud Run will print your public live URL (e.g., `https://campustix-xyz.a.run.app`).

### Alternative: Deploy to Render / Railway / Vercel
1. Link your GitHub repository (`campustix`) in the Render or Railway dashboard.
2. Set Build Command: `npm run build`
3. Set Start Command: `npm start`
4. In the Environment Variables settings, add `DATABASE_URL` and `JWT_SECRET`.

---

## Preview Sandbox vs. Production Persistence

- **Preview Environment (Local/Client Demo)**: When running inside isolated evaluation sandboxes where an external PostgreSQL database is not connected, CampusTix uses a reactive LocalStorage persistence engine that matches the Prisma schema structure. All features (seat selection, 10-minute hold countdowns, QR generation, booking cancellations, and CSV exports) are interactive and testable.
- **Production Mode**: In production with `DATABASE_URL` configured, transactions utilize Prisma's `$transaction` API and row locks (`SELECT ... FOR UPDATE`) to guarantee ACID compliance and zero overselling across distributed instances.

---

## Repository Structure

```
campustix/
├── Dockerfile                  # Container definition for Google Cloud Run
├── .dockerignore               # Container build ignore rules
├── .env.example                # Safe environment variables template
├── .gitignore                  # Git ignore rules protecting secrets
├── package.json                # Dependencies, dev server, and build scripts
├── prisma/
│   ├── schema.prisma           # Prisma relational schema
│   ├── migrations/             # SQL migrations
│   └── seed.ts                 # Database seeding script
├── server.ts                   # Production Express REST backend with CORS
├── src/
│   ├── assets/images/          # High-resolution collegiate event imagery
│   ├── components/             # React UI components (Dark charcoal & violet theme)
│   ├── data/                   # Initial event schedules and seating layout
│   ├── services/               # Reactive store, hold timers, and QR generation
│   ├── types.ts                # TypeScript definitions
│   ├── App.tsx                 # Root application
│   └── main.tsx                # Entry point
└── README.md                   # Documentation and deployment guide
```
