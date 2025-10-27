CREATE TABLE "nanny_shares" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_id" text NOT NULL,
	"date" text NOT NULL,
	"location" text NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"price" numeric(10, 2),
	"certificates" jsonb,
	"max_spots" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"members" jsonb DEFAULT '[]'::jsonb NOT NULL
);
