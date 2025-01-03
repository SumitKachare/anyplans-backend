ALTER TABLE "categories" DROP CONSTRAINT "categories_name_unique";--> statement-breakpoint
ALTER TABLE "spots" DROP CONSTRAINT "spots_name_unique";--> statement-breakpoint
ALTER TABLE "spots" DROP CONSTRAINT "spots_location_unique";--> statement-breakpoint
ALTER TABLE "spots" ADD COLUMN "userId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "spots" ADD CONSTRAINT "spots_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;