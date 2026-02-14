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
DROP TABLE `islands`;