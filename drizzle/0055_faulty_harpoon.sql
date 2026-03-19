CREATE TABLE `dive_site_guides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`placeId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`difficulty` enum('beginner','intermediate','advanced') NOT NULL,
	`depthMin` int NOT NULL,
	`depthMax` int NOT NULL,
	`currentStrength` enum('none','weak','moderate','strong','very_strong') NOT NULL,
	`visibilityMin` int NOT NULL,
	`visibilityMax` int NOT NULL,
	`bestTimeStart` int,
	`bestTimeEnd` int,
	`distanceFromIsland` int,
	`boatTimeMinutes` int,
	`description` text NOT NULL,
	`tips` text,
	`bestFor` text,
	`marineLife` text,
	`seasonalVariations` text,
	`certifications` text,
	`hazards` text,
	`images` text,
	`metaTitle` varchar(255),
	`metaDescription` varchar(500),
	`metaKeywords` varchar(500),
	`published` int NOT NULL DEFAULT 0,
	`featured` int NOT NULL DEFAULT 0,
	`viewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dive_site_guides_id` PRIMARY KEY(`id`),
	CONSTRAINT `dive_site_guides_placeId_unique` UNIQUE(`placeId`),
	CONSTRAINT `dive_site_guides_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `surf_spot_guides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`placeId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`difficulty` enum('beginner','intermediate','advanced') NOT NULL,
	`waveHeightMin` decimal(4,2),
	`waveHeightMax` decimal(4,2),
	`waveType` varchar(100),
	`currentStrength` enum('none','weak','moderate','strong','very_strong') NOT NULL,
	`windDirection` varchar(100),
	`bestTimeStart` int,
	`bestTimeEnd` int,
	`bestTimeOfDay` varchar(100),
	`distanceFromIsland` int,
	`boatTimeMinutes` int,
	`description` text NOT NULL,
	`tips` text,
	`bestFor` text,
	`marineLife` text,
	`seasonalVariations` text,
	`hazards` text,
	`images` text,
	`metaTitle` varchar(255),
	`metaDescription` varchar(500),
	`metaKeywords` varchar(500),
	`published` int NOT NULL DEFAULT 0,
	`featured` int NOT NULL DEFAULT 0,
	`viewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `surf_spot_guides_id` PRIMARY KEY(`id`),
	CONSTRAINT `surf_spot_guides_placeId_unique` UNIQUE(`placeId`),
	CONSTRAINT `surf_spot_guides_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `dive_site_guides` ADD CONSTRAINT `dive_guide_place_fk` FOREIGN KEY (`placeId`) REFERENCES `places`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `surf_spot_guides` ADD CONSTRAINT `surf_guide_place_fk` FOREIGN KEY (`placeId`) REFERENCES `places`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_dive_place` ON `dive_site_guides` (`placeId`);--> statement-breakpoint
CREATE INDEX `idx_dive_difficulty` ON `dive_site_guides` (`difficulty`);--> statement-breakpoint
CREATE INDEX `idx_dive_published` ON `dive_site_guides` (`published`);--> statement-breakpoint
CREATE INDEX `idx_dive_featured` ON `dive_site_guides` (`featured`);--> statement-breakpoint
CREATE INDEX `idx_surf_place` ON `surf_spot_guides` (`placeId`);--> statement-breakpoint
CREATE INDEX `idx_surf_difficulty` ON `surf_spot_guides` (`difficulty`);--> statement-breakpoint
CREATE INDEX `idx_surf_published` ON `surf_spot_guides` (`published`);--> statement-breakpoint
CREATE INDEX `idx_surf_featured` ON `surf_spot_guides` (`featured`);