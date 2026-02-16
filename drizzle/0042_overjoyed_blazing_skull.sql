ALTER TABLE `places` ADD `slug` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `places` ADD CONSTRAINT `places_slug_unique` UNIQUE(`slug`);