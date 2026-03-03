ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','editor','manager','contributor') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `department` varchar(100);