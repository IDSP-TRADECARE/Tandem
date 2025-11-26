CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"time_from" time NOT NULL,
	"time_to" time NOT NULL,
	"location" varchar(255),
	"notes" text,
	"completed" boolean DEFAULT false NOT NULL,
	"schedule_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "schedules" RENAME COLUMN "to" TO "time_to";--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_schedule_id_schedules_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_events_user_id" ON "events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_events_date" ON "events" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_events_type" ON "events" USING btree ("type");