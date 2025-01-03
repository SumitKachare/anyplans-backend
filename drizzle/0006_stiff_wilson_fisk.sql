ALTER TABLE "categories" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "spots" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "spots" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "userPreferences" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "userPreferences" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP IDENTITY;