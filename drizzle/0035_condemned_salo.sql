CREATE TABLE `entity_details` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityId` int NOT NULL,
	`bestTimeToVisit` varchar(255),
	`currency` varchar(10),
	`language` varchar(100),
	`flightInfo` text,
	`speedboatInfo` text,
	`ferryInfo` text,
	`activities` text,
	`restaurants` text,
	`whatToPack` text,
	`healthTips` text,
	`emergencyContacts` text,
	`attractions` text,
	`threeDayItinerary` text,
	`fiveDayItinerary` text,
	`faq` text,
	`quickFacts` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `entity_details_id` PRIMARY KEY(`id`),
	CONSTRAINT `entity_details_entityId_unique` UNIQUE(`entityId`)
);
--> statement-breakpoint
CREATE TABLE `entity_media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityId` int NOT NULL,
	`mediaType` enum('image','video','audio') NOT NULL,
	`url` varchar(500) NOT NULL,
	`caption` text,
	`altText` varchar(255),
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `entity_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `entity_relationships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceEntityId` int NOT NULL,
	`targetEntityId` int NOT NULL,
	`relationshipType` enum('nearby_dive_site','nearby_surf_spot','nearby_snorkeling_spot','airport_access','resort_access','related_island') NOT NULL,
	`distance` varchar(50),
	`difficulty` varchar(50),
	`notes` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `entity_relationships_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_entity_relationship` UNIQUE(`sourceEntityId`,`targetEntityId`,`relationshipType`)
);
--> statement-breakpoint
CREATE TABLE `geographical_entities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`code` varchar(50),
	`entityType` enum('island','dive_site','surf_spot','snorkeling_spot','airport','resort','poi') NOT NULL,
	`latitude` varchar(50),
	`longitude` varchar(50),
	`atollId` int,
	`description` text,
	`overview` text,
	`heroImage` varchar(500),
	`isActive` int NOT NULL DEFAULT 1,
	`published` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `geographical_entities_id` PRIMARY KEY(`id`),
	CONSTRAINT `geographical_entities_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `geographical_entities_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
ALTER TABLE `entity_details` ADD CONSTRAINT `entity_details_entityId_geographical_entities_id_fk` FOREIGN KEY (`entityId`) REFERENCES `geographical_entities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `entity_media` ADD CONSTRAINT `entity_media_entityId_geographical_entities_id_fk` FOREIGN KEY (`entityId`) REFERENCES `geographical_entities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `entity_relationships` ADD CONSTRAINT `entity_relationships_sourceEntityId_geographical_entities_id_fk` FOREIGN KEY (`sourceEntityId`) REFERENCES `geographical_entities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `entity_relationships` ADD CONSTRAINT `entity_relationships_targetEntityId_geographical_entities_id_fk` FOREIGN KEY (`targetEntityId`) REFERENCES `geographical_entities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_entity_details_entity` ON `entity_details` (`entityId`);--> statement-breakpoint
CREATE INDEX `idx_entity_media_entity` ON `entity_media` (`entityId`);--> statement-breakpoint
CREATE INDEX `idx_entity_media_type` ON `entity_media` (`mediaType`);--> statement-breakpoint
CREATE INDEX `idx_entity_rel_source` ON `entity_relationships` (`sourceEntityId`);--> statement-breakpoint
CREATE INDEX `idx_entity_rel_target` ON `entity_relationships` (`targetEntityId`);--> statement-breakpoint
CREATE INDEX `idx_entity_rel_type` ON `entity_relationships` (`relationshipType`);--> statement-breakpoint
CREATE INDEX `idx_geo_entities_slug` ON `geographical_entities` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_geo_entities_type` ON `geographical_entities` (`entityType`);--> statement-breakpoint
CREATE INDEX `idx_geo_entities_atoll` ON `geographical_entities` (`atollId`);