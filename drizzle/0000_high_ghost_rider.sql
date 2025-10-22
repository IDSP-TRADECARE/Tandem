CREATE TABLE "schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"working_days" jsonb NOT NULL,
	"time_from" time NOT NULL,
	"to" time NOT NULL,
	"location" varchar(255),
	"notes" text,
	"original_file_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"phone" varchar(20),
	"address" text,
	"occupation" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
CREATE INDEX "idx_schedules_user_id" ON "schedules" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_schedules_created_at" ON "schedules" USING btree ("created_at");