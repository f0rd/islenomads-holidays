CREATE TABLE `branding` (
	`id` int AUTO_INCREMENT NOT NULL,
	`logoUrl` varchar(500),
	`logoMarkUrl` varchar(500),
	`faviconUrl` varchar(500),
	`logoWhiteUrl` varchar(500),
	`logoColorUrl` varchar(500),
	`primaryColor` varchar(7),
	`accentColor` varchar(7),
	`companyName` varchar(255),
	`tagline` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `branding_id` PRIMARY KEY(`id`)
);
