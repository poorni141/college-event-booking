import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Production CORS Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// In-memory atomic state for Express REST endpoints
interface HoldEntry {
  holdId: string;
  eventId: string;
  userId: string;
  seatNumbers: string[];
  expiresAt: number;
}

const activeHolds = new Map<string, HoldEntry>();

// Periodic cleanup of expired holds (10-minute expiry)
setInterval(() => {
  const now = Date.now();
  for (const [holdId, hold] of activeHolds.entries()) {
    if (hold.expiresAt <= now) {
      activeHolds.delete(holdId);
    }
  }
}, 5000);

// Simple password hashing helper
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'campustix_salt').digest('hex');
}

// Health check and runtime information
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    appName: 'CampusTix API',
    database: process.env.DATABASE_URL ? 'PostgreSQL (Prisma)' : 'Client-Local Reactive Store Fallback',
    timestamp: new Date().toISOString(),
    activeHoldsCount: activeHolds.size,
  });
});

// Authentication routes
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, role, rollNumber, department } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  return res.json({
    success: true,
    user: {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: role || 'student',
      rollNumber: rollNumber || 'CS-2026-001',
      department: department || 'General Engineering',
      token,
    },
    message: 'User registered successfully',
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const role = email.includes('admin') ? 'admin' : 'student';

  return res.json({
    success: true,
    user: {
      id: `usr-${Date.now()}`,
      name: role === 'admin' ? 'Prof. Sarah Vance' : 'Alex Rivera',
      email,
      role,
      token,
    },
    message: 'Login successful',
  });
});

// 10-Minute Seat Reservation Hold Endpoint (Atomic)
app.post('/api/bookings/hold', (req: Request, res: Response) => {
  const { eventId, userId, seatNumbers, tierId, totalAmount } = req.body;

  if (!eventId || !userId || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
    return res.status(400).json({ error: 'Missing required reservation parameters' });
  }

  // Check if any seat is already locked in active holds
  for (const hold of activeHolds.values()) {
    if (hold.eventId === eventId && hold.expiresAt > Date.now()) {
      const conflict = seatNumbers.find((s) => hold.seatNumbers.includes(s));
      if (conflict) {
        return res.status(409).json({
          error: `Seat ${conflict} is currently reserved by another student. Please select another seat.`,
        });
      }
    }
  }

  const holdDuration = 10 * 60 * 1000; // 10 minutes
  const expiresAt = Date.now() + holdDuration;
  const holdId = `hold-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  activeHolds.set(holdId, {
    holdId,
    eventId,
    userId,
    seatNumbers,
    expiresAt,
  });

  return res.json({
    success: true,
    holdId,
    eventId,
    seatNumbers,
    expiresAt,
    holdDurationSeconds: 600,
    message: 'Seats locked for 10 minutes.',
  });
});

// Confirm Booking Endpoint
app.post('/api/bookings/confirm', (req: Request, res: Response) => {
  const { holdId, paymentMethod, paymentReference } = req.body;

  if (!holdId) {
    return res.status(400).json({ error: 'Missing holdId' });
  }

  const hold = activeHolds.get(holdId);
  if (!hold) {
    return res.status(410).json({ error: 'Reservation hold has expired. Please select seats again.' });
  }

  if (hold.expiresAt <= Date.now()) {
    activeHolds.delete(holdId);
    return res.status(410).json({ error: 'Hold timed out. Seats were released back to inventory.' });
  }

  // Clear hold upon confirmation
  activeHolds.delete(holdId);

  const bookingCode = `CTIX-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  return res.json({
    success: true,
    bookingId: bookingCode,
    paymentStatus: 'completed',
    paymentMethod: paymentMethod || 'upi',
    paymentReference: paymentReference || `REF-${Date.now().toString().slice(-8)}`,
    message: 'Booking confirmed successfully!',
  });
});

// Release Hold
app.post('/api/bookings/release', (req: Request, res: Response) => {
  const { holdId } = req.body;
  if (holdId && activeHolds.has(holdId)) {
    activeHolds.delete(holdId);
  }
  res.json({ success: true, message: 'Hold released.' });
});

// Export Attendees CSV route
app.get('/api/admin/attendees/export', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="campustix_attendees.csv"');
  res.send('Booking ID,Student Name,Email,Event,Seat Numbers,Status\nCTIX-2026-AURA42,Alex Rivera,student@campustix.edu,Aura 2026,"A1, A2",CONFIRMED\n');
});

// Start Express server if run directly
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // When in dev mode, mount Vite middleware so a single port 3000 serves both API and React frontend!
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`CampusTix Full-Stack Server running on port ${PORT}`);
  });
}

// Start only if executed directly
if (process.env.RUN_SERVER === 'true') {
  startServer();
}

export default app;
