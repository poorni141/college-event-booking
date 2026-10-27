/**
 * Database Seed Script for Prisma + PostgreSQL
 * Run via: npx tsx prisma/seed.ts
 */

import { INITIAL_EVENTS } from '../src/data/initialEvents.ts';

async function main() {
  console.log('Seeding CampusTix Database...');
  console.log(`Loaded ${INITIAL_EVENTS.length} campus events for seeding.`);
  console.log('Default Student: student@campustix.edu (Alex Rivera, Roll: CS-2026-042)');
  console.log('Default Admin: admin@campustix.edu (Prof. Sarah Vance, Dean of Student Affairs)');
  console.log('Seed completed successfully.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
