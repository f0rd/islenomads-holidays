CREATE TABLE `airport_routes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`airportId` int NOT NULL,
	`islandGuideId` int NOT NULL,
	`transportType` enum('speedboat','ferry','seaplane','dhoni') NOT NULL,
	`distance` varchar(100),
	`duration` varchar(100) NOT NULL,
	`price` int,
	`frequency` varchar(100),
	`operatingDays` varchar(100),
	`description` text,
	`notes` text,
	`isPopular` int NOT NULL DEFAULT 0,
	`published` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `airport_routes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `airports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`iataCode` varchar(10) NOT NULL,
	`icaoCode` varchar(10),
	`description` text,
	`latitude` varchar(50) NOT NULL,
	`longitude` varchar(50) NOT NULL,
	`atoll` varchar(255),
	`facilities` text,
	`airlines` text,
	`internationalFlights` int NOT NULL DEFAULT 1,
	`domesticFlights` int NOT NULL DEFAULT 0,
	`phone` varchar(20),
	`email` varchar(320),
	`website` varchar(500),
	`isActive` int NOT NULL DEFAULT 1,
	`published` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `airports_id` PRIMARY KEY(`id`),
	CONSTRAINT `airports_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `airports_iataCode_unique` UNIQUE(`iataCode`)
);
--> statement-breakpoint
CREATE TABLE `places` (
	`id` int AUTO_INCREMENT NOT NULL,
	`atollId` int,
	`name` varchar(255) NOT NULL,
	`code` varchar(50) NOT NULL,
	`type` enum('island','dive_site','surf_spot','snorkeling_spot','poi') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `places_id` PRIMARY KEY(`id`),
	CONSTRAINT `places_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
ALTER TABLE `activity_spots` ADD `placeId` int;--> statement-breakpoint
ALTER TABLE `boat_routes` ADD `fromPlaceId` int;--> statement-breakpoint
ALTER TABLE `boat_routes` ADD `toPlaceId` int;--> statement-breakpoint
ALTER TABLE `island_guides` ADD `placeId` int;--> statement-breakpoint
ALTER TABLE `island_guides` ADD `nearbyAirports` text;--> statement-breakpoint
ALTER TABLE `island_guides` ADD `nearbyDiveSites` text;--> statement-breakpoint
ALTER TABLE `island_guides` ADD `nearbySurfSpots` text;--> statement-breakpoint
ALTER TABLE `map_locations` ADD `placeId` int;--> statement-breakpoint
ALTER TABLE `transports` ADD `fromPlaceId` int;--> statement-breakpoint
ALTER TABLE `transports` ADD `toPlaceId` int;--> statement-breakpoint
ALTER TABLE `airport_routes` ADD CONSTRAINT `airport_routes_airportId_airports_id_fk` FOREIGN KEY (`airportId`) REFERENCES `airports`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `airport_routes` ADD CONSTRAINT `airport_routes_islandGuideId_island_guides_id_fk` FOREIGN KEY (`islandGuideId`) REFERENCES `island_guides`(`id`) ON DELETE cascade ON UPDATE no action;