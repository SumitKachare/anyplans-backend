ALTER TABLE "categories" ADD CONSTRAINT "categories_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "spots" ADD CONSTRAINT "spots_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "spots" ADD CONSTRAINT "spots_location_unique" UNIQUE("location");