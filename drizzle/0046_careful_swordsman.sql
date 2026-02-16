
CREATE TABLE `attraction_island_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attractionGuideId` int NOT NULL,
	`islandGuideId` int NOT NULL,
	`distance` varchar(100),
	`travelTime` varchar(100),
	`transportMethod` varchar(100),
	`notes` text,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `attraction_island_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `places` ADD `slug` varchar(255);--> statement-breakpoint
ALTER TABLE `places` ADD `latitude` decimal(10,6);--> statement-breakpoint
ALTER TABLE `places` ADD `longitude` decimal(10,6);--> statement-breakpoint
ALTER TABLE `places` ADD CONSTRAINT `places_slug_unique` UNIQUE(`slug`);