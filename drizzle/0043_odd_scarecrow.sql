ALTER TABLE `places` DROP INDEX `places_slug_unique`;--> statement-breakpoint
ALTER TABLE `places` MODIFY COLUMN `slug` varchar(255);