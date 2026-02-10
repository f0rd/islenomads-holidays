ALTER TABLE `activity_spots` ADD `atollId` int;--> statement-breakpoint
ALTER TABLE `activity_spots` ADD `category` varchar(100);--> statement-breakpoint
ALTER TABLE `activity_spots` ADD `rating` varchar(10);--> statement-breakpoint
ALTER TABLE `activity_spots` ADD `reviewCount` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `activity_spots` ADD `capacity` int;--> statement-breakpoint
ALTER TABLE `activity_spots` ADD `operatorInfo` text;