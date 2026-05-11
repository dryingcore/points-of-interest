ALTER TABLE "pois" ADD CONSTRAINT "pois_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "pois" ADD CONSTRAINT "unique_coordinates" UNIQUE("x","y");