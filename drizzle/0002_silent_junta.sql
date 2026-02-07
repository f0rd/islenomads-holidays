CREATE TABLE `packages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`price` int NOT NULL,
	`duration` varchar(100) NOT NULL,
	`destination` varchar(255) NOT NULL,
	`highlights` text,
	`amenities` text,
	`image` varchar(500),
	`featured` int NOT NULL DEFAULT 0,
	`published` int NOT NULL DEFAULT 0,
	`metaTitle` varchar(255),
	`metaDescription` varchar(500),
	`metaKeywords` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `packages_id` PRIMARY KEY(`id`),
	CONSTRAINT `packages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `metaTitle` varchar(255);--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `metaDescription` varchar(500);--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `metaKeywords` varchar(500);