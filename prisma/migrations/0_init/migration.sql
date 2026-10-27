-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN');
CREATE TYPE "EventCategory" AS ENUM ('CULTURALS', 'SYMPOSIUM', 'HACKATHON', 'MUSIC_NIGHT', 'DANCE_COMPETITION', 'SPORTS_MEET', 'WORKSHOPS');
CREATE TYPE "SeatStatus" AS ENUM ('AVAILABLE', 'HELD', 'BOOKED');
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'CANCELLED');
CREATE TYPE "PaymentStatus" AS ENUM ('COMPLETED', 'REFUNDED', 'PENDING');

-- CreateTable users
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "rollNumber" TEXT,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable events
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" "EventCategory" NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "locationDetails" TEXT NOT NULL,
    "totalCapacity" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "organizerContact" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable ticket_tiers
CREATE TABLE "ticket_tiers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "capacity" INTEGER NOT NULL,
    "available" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "perks" TEXT[] NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable seats
CREATE TABLE "seats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
    "seatNumber" TEXT NOT NULL,
    "row" TEXT NOT NULL,
    "tierId" TEXT NOT NULL,
    "status" "SeatStatus" NOT NULL DEFAULT 'AVAILABLE',
    "heldById" TEXT REFERENCES "users"("id") ON DELETE SET NULL,
    "holdExpiresAt" TIMESTAMP(3),
    CONSTRAINT "seats_eventId_seatNumber_unique" UNIQUE ("eventId", "seatNumber")
);

-- CreateTable booking_holds
CREATE TABLE "booking_holds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "tierId" TEXT NOT NULL,
    "ticketCount" INTEGER NOT NULL,
    "seatNumbers" TEXT[] NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable bookings
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL UNIQUE,
    "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE RESTRICT,
    "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
    "tierName" TEXT NOT NULL,
    "ticketCount" INTEGER NOT NULL,
    "seatNumbers" TEXT[] NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentReference" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'COMPLETED',
    "bookingStatus" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "qrCodePayload" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelledAt" TIMESTAMP(3)
);

-- Indices for concurrency and performance
CREATE INDEX "seats_status_idx" ON "seats"("eventId", "status");
CREATE INDEX "booking_holds_expiry_idx" ON "booking_holds"("expiresAt");
CREATE INDEX "bookings_user_idx" ON "bookings"("userId");
