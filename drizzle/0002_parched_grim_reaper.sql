ALTER TABLE "categories" DROP CONSTRAINT "categories_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "spots" DROP CONSTRAINT "spots_categoryId_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "userPreferences" DROP CONSTRAINT "userPreferences_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spots" ADD CONSTRAINT "spots_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userPreferences" ADD CONSTRAINT "userPreferences_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;