CREATE TABLE `activity_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(50) NOT NULL,
	`name` varchar(100) NOT NULL,
	`icon` varchar(100),
	`description` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `activity_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `activity_types_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`activityTypeId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`shortIntro` varchar(500),
	`description` text,
	`durationMin` int,
	`priceFromUsd` decimal(8,2),
	`includes` text,
	`excludes` text,
	`requirements` text,
	`featuredImage` varchar(500),
	`published` int NOT NULL DEFAULT 0,
	`featured` int NOT NULL DEFAULT 0,
	`displayOrder` int NOT NULL DEFAULT 0,
	`metaTitle` varchar(255),
	`metaDescription` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `experiences_id` PRIMARY KEY(`id`),
	CONSTRAINT `experiences_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `island_experiences` (
	`islandId` int NOT NULL,
	`experienceId` int NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `island_experiences_islandId_experienceId_pk` PRIMARY KEY(`islandId`,`experienceId`)
);
--> statement-breakpoint
CREATE TABLE `island_spot_access` (
	`id` int AUTO_INCREMENT NOT NULL,
	`islandId` int NOT NULL,
	`spotId` int NOT NULL,
	`distanceKm` decimal(6,2),
	`travelTimeMin` int,
	`transferType` enum('dhoni','speedboat','public_ferry','walk','mixed'),
	`priceFromUsd` decimal(8,2),
	`operatorNotes` text,
	`recommended` int NOT NULL DEFAULT 0,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `island_spot_access_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_island_spot_access` UNIQUE(`islandId`,`spotId`)
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` varchar(500) NOT NULL,
	`altText` varchar(255),
	`caption` text,
	`credit` varchar(255),
	`width` int,
	`height` int,
	`mimeType` varchar(50),
	`fileSize` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seo_metadata` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` enum('island','spot','atoll','experience','blog') NOT NULL,
	`entityId` int NOT NULL,
	`metaTitle` varchar(255),
	`metaDescription` varchar(500),
	`metaKeywords` varchar(500),
	`ogImageId` int,
	`twitterCard` varchar(50),
	`canonicalUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seo_metadata_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_seo_entity` UNIQUE(`entityType`,`entityId`)
);
--> statement-breakpoint
CREATE TABLE `spot_types` (
	`spotId` int NOT NULL,
	`activityTypeId` int NOT NULL,
	CONSTRAINT `spot_types_spotId_activityTypeId_pk` PRIMARY KEY(`spotId`,`activityTypeId`)
);
--> statement-breakpoint
CREATE TABLE `transport_routes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fromIslandId` int NOT NULL,
	`toIslandId` int NOT NULL,
	`routeType` enum('public_ferry','speedboat','private_transfer') NOT NULL,
	`operatorName` varchar(255),
	`scheduleText` text,
	`durationMin` int,
	`priceMvr` decimal(8,2),
	`priceUsd` decimal(8,2),
	`bookingInfo` text,
	`sourceUrl` varchar(500),
	`lastVerifiedAt` timestamp,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transport_routes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_island_spot_access_island` ON `island_spot_access` (`islandId`);--> statement-breakpoint
CREATE INDEX `idx_island_spot_access_spot` ON `island_spot_access` (`spotId`);--> statement-breakpoint
CREATE INDEX `idx_transport_from_island` ON `transport_routes` (`fromIslandId`);--> statement-breakpoint
CREATE INDEX `idx_transport_to_island` ON `transport_routes` (`toIslandId`);--> statement-breakpoint
CREATE INDEX `idx_transport_route_type` ON `transport_routes` (`fromIslandId`,`toIslandId`,`routeType`);