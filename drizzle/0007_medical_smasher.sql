CREATE TABLE "pending_nanny_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"date" text NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "schedules" ADD COLUMN "week_of" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "pending_nanny_requests_user_date_idx" ON "pending_nanny_requests" USING btree ("user_id","date");