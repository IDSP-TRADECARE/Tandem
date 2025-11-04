DROP INDEX "idx_schedules_created_at";--> statement-breakpoint
ALTER TABLE "schedules" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "schedules" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "schedules" ALTER COLUMN "location" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "schedules" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "schedules" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "schedules" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "schedules" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "schedules" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "schedules" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "deleted_dates" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "edited_dates" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "schedules" DROP COLUMN "original_file_url";