CREATE TABLE `boat_routes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`type` enum('speedboat','ferry') NOT NULL,
	`fromPlaceId` int,
	`toPlaceId` int,
	`fromIslandGuideId` int,
	`toIslandGuideId` int,
	`fromAtollId` int,
	`toAtollId` int,
	`fromLocation` varchar(255) NOT NULL,
	`toLocation` varchar(255) NOT NULL,
	`fromLat` varchar(50) NOT NULL,
	`fromLng` varchar(50) NOT NULL,
	`toLat` varchar(50) NOT NULL,
	`toLng` varchar(50) NOT NULL,
	`distance` varchar(50),
	`duration` varchar(100) NOT NULL,
	`price` int NOT NULL,
	`schedule` text,
	`capacity` int NOT NULL,
	`amenities` text,
	`boatInfo` text,
	`description` text,
	`image` varchar(500),
	`published` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `boat_routes_id` PRIMARY KEY(`id`),
	CONSTRAINT `boat_routes_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `island_guide_transports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`islandGuideId` int NOT NULL,
	`transportId` int NOT NULL,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `island_guide_transports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `transports` DROP INDEX `transports_slug_unique`;--> statement-breakpoint
CREATE INDEX `idx_island_guide_id` ON `island_guide_transports` (`islandGuideId`);--> statement-breakpoint
CREATE INDEX `idx_transport_id` ON `island_guide_transports` (`transportId`);--> statement-breakpoint
CREATE INDEX `idx_unique_guide_transport` ON `island_guide_transports` (`islandGuideId`,`transportId`);--> statement-breakpoint
ALTER TABLE `transports` DROP COLUMN `slug`;--> statement-breakpoint
ALTER TABLE `transports` DROP COLUMN `fromAtollId`;--> statement-breakpoint
ALTER TABLE `transports` DROP COLUMN `toAtollId`;--> statement-breakpoint
ALTER TABLE `transports` DROP COLUMN `fromLat`;--> statement-breakpoint
ALTER TABLE `transports` DROP COLUMN `fromLng`;--> statement-breakpoint
ALTER TABLE `transports` DROP COLUMN `toLat`;--> statement-breakpoint
ALTER TABLE `transports` DROP COLUMN `toLng`;--> statement-breakpoint
ALTER TABLE `transports` DROP COLUMN `distance`;--> statement-breakpoint
ALTER TABLE `transports` DROP COLUMN `duration`;--> statement-breakpoint
ALTER TABLE `transports` DROP COLUMN `price`;--> statement-breakpoint
ALTER TABLE `transports` DROP COLUMN `boatInfo`;