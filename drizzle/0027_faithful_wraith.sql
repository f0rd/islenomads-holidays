CREATE TABLE `islands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`atollId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `islands_id` PRIMARY KEY(`id`),
	CONSTRAINT `islands_code_unique` UNIQUE(`code`)
);
