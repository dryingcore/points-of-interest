CREATE TABLE "pois" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "check_x" CHECK ("pois"."x" >= 0),
	CONSTRAINT "check_y" CHECK ("pois"."y" >= 0)
);
