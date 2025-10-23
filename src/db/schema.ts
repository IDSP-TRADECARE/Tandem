import { pgTable, serial, varchar, text, timestamp, uuid, jsonb, time, index } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  occupation: varchar('occupation', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});


// Schedules table
export const schedules = pgTable('schedules', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  workingDays: jsonb('working_days').$type<string[]>().notNull(),
  timeFrom: time('time_from').notNull(),
  timeTo: time('to').notNull(),
  location: varchar('location', { length: 255 }),
  notes: text('notes'),
  originalFileUrl: text('original_file_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('idx_schedules_user_id').on(table.userId),
    createdAtIdx: index('idx_schedules_created_at').on(table.createdAt),
  };
});

// TypeScript types
export type Schedule = typeof schedules.$inferSelect;
export type NewSchedule = typeof schedules.$inferInsert;

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
