CREATE TABLE `crm_customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(20),
	`country` varchar(100),
	`totalQueries` int DEFAULT 0,
	`totalBookings` int DEFAULT 0,
	`totalSpent` int DEFAULT 0,
	`preferredContact` enum('email','phone','sms') DEFAULT 'email',
	`newsletter` int DEFAULT 0,
	`isActive` int DEFAULT 1,
	`lastContactedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crm_customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `crm_customers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `crm_interactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`queryId` int NOT NULL,
	`staffId` int NOT NULL,
	`type` enum('note','email','call','meeting','sms') NOT NULL DEFAULT 'note',
	`subject` varchar(255),
	`content` text NOT NULL,
	`isInternal` int NOT NULL DEFAULT 1,
	`attachments` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crm_interactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crm_queries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerPhone` varchar(20),
	`customerCountry` varchar(100),
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`queryType` enum('booking','general','complaint','feedback','support','other') NOT NULL DEFAULT 'general',
	`status` enum('new','in_progress','waiting_customer','resolved','closed') NOT NULL DEFAULT 'new',
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`assignedTo` int,
	`packageId` int,
	`islandGuideId` int,
	`firstResponseAt` timestamp,
	`resolvedAt` timestamp,
	`closedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crm_queries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `crm_interactions` ADD CONSTRAINT `crm_interactions_queryId_crm_queries_id_fk` FOREIGN KEY (`queryId`) REFERENCES `crm_queries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `crm_interactions` ADD CONSTRAINT `crm_interactions_staffId_staff_id_fk` FOREIGN KEY (`staffId`) REFERENCES `staff`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `crm_queries` ADD CONSTRAINT `crm_queries_assignedTo_staff_id_fk` FOREIGN KEY (`assignedTo`) REFERENCES `staff`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `crm_queries` ADD CONSTRAINT `crm_queries_packageId_packages_id_fk` FOREIGN KEY (`packageId`) REFERENCES `packages`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `crm_queries` ADD CONSTRAINT `crm_queries_islandGuideId_island_guides_id_fk` FOREIGN KEY (`islandGuideId`) REFERENCES `island_guides`(`id`) ON DELETE set null ON UPDATE no action;