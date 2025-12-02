ALTER TABLE "schedules" ADD COLUMN "week_of" text NOT NULL;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "original_file_url" text;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "daily_times" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_picture" text;