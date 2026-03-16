ALTER TABLE `places` ADD `description` text;--> statement-breakpoint
ALTER TABLE `places` ADD `highlights` text;--> statement-breakpoint
ALTER TABLE `places` ADD `amenities` text;--> statement-breakpoint
ALTER TABLE `places` ADD `image` varchar(500);--> statement-breakpoint
ALTER TABLE `places` ADD `icon` varchar(50);--> statement-breakpoint
ALTER TABLE `places` ADD `color` varchar(20);--> statement-breakpoint
ALTER TABLE `places` ADD `difficulty` varchar(50);--> statement-breakpoint
ALTER TABLE `places` ADD `depth` varchar(50);--> statement-breakpoint
ALTER TABLE `places` ADD `waveHeight` varchar(50);--> statement-breakpoint
ALTER TABLE `places` ADD `rating` varchar(10);--> statement-breakpoint
ALTER TABLE `places` ADD `reviews` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `places` ADD `population` int;--> statement-breakpoint
ALTER TABLE `places` ADD `priceRange` varchar(50);--> statement-breakpoint
ALTER TABLE `places` ADD `bestSeason` varchar(100);--> statement-breakpoint
ALTER TABLE `places` ADD `guideId` int;--> statement-breakpoint
ALTER TABLE `places` ADD `published` int DEFAULT 0 NOT NULL;