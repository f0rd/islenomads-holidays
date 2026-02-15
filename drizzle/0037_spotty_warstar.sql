DROP TABLE `boat_routes`;--> statement-breakpoint
ALTER TABLE `transports` ADD `slug` varchar(255);--> statement-breakpoint
ALTER TABLE `transports` ADD `fromAtollId` int;--> statement-breakpoint
ALTER TABLE `transports` ADD `toAtollId` int;--> statement-breakpoint
ALTER TABLE `transports` ADD `fromLat` varchar(50);--> statement-breakpoint
ALTER TABLE `transports` ADD `fromLng` varchar(50);--> statement-breakpoint
ALTER TABLE `transports` ADD `toLat` varchar(50);--> statement-breakpoint
ALTER TABLE `transports` ADD `toLng` varchar(50);--> statement-breakpoint
ALTER TABLE `transports` ADD `distance` varchar(50);--> statement-breakpoint
ALTER TABLE `transports` ADD `duration` varchar(100);--> statement-breakpoint
ALTER TABLE `transports` ADD `price` int;--> statement-breakpoint
ALTER TABLE `transports` ADD `boatInfo` text;--> statement-breakpoint
ALTER TABLE `transports` ADD CONSTRAINT `transports_slug_unique` UNIQUE(`slug`);