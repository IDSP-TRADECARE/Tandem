import { pgTable, serial, varchar, text, timestamp, uuid, jsonb, time, index, json, integer, decimal } from 'drizzle-orm/pg-core';
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

export const surveyData = pgTable('survey_data', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phoneNumber: text('phone_number'),
  children: json('children').$type<Array<{ name: string; age: string }>>(),
  address: text('address'),
  city: text('city'),
  zipCode: text('zip_code'),
  allergies: text('allergies'),
  medicalConditions: text('medical_conditions'),
  learningBehavioral: text('learning_behavioral'),
  additionalNotes: text('additional_notes'),
  language: text('language'),
  certificates: json('certificates').$type<string[]>(),
  budget: text('budget'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// NANNY SHARE ------------------------------------------

export const nannyShares = pgTable('nanny_shares', {
  id: serial('id').primaryKey(),
  creatorId: text('creator_id').notNull(),
  date: text('date').notNull(),
  location: text('location').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }),
  certificates: jsonb('certificates').$type<string[]>(),
  maxSpots: integer('max_spots'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  members: jsonb('members').$type<Array<{
    userId: string;
    name: string;
    kidsCount: number;
    joinedAt: string;
  }>>().notNull().default([]),
  messages: jsonb('messages').$type<Array<{
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
  }>>().notNull().default([]), // Changed from json to jsonb and added array type + default
});

// TypeScript types
export type Schedule = typeof schedules.$inferSelect;
export type NewSchedule = typeof schedules.$inferInsert;

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type NannyShare = typeof nannyShares.$inferSelect;
export type NewNannyShare = typeof nannyShares.$inferInsert;
