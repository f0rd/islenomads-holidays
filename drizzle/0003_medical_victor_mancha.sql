ALTER TABLE `blog_posts` ADD `ogTitle` varchar(255);--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `ogDescription` varchar(500);--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `ogImage` varchar(500);--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `twitterCard` varchar(50);--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `focusKeyword` varchar(255);--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `keywordDensity` varchar(50);--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `readabilityScore` int;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `seoScore` int;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `schemaType` varchar(100) DEFAULT 'BlogPosting';--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `canonicalUrl` varchar(500);--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `robotsIndex` varchar(20) DEFAULT 'index';--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `robotsFollow` varchar(20) DEFAULT 'follow';--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `internalLinks` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `lastModified` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `packages` ADD `ogTitle` varchar(255);--> statement-breakpoint
ALTER TABLE `packages` ADD `ogDescription` varchar(500);--> statement-breakpoint
ALTER TABLE `packages` ADD `ogImage` varchar(500);--> statement-breakpoint
ALTER TABLE `packages` ADD `focusKeyword` varchar(255);--> statement-breakpoint
ALTER TABLE `packages` ADD `seoScore` int;--> statement-breakpoint
ALTER TABLE `packages` ADD `canonicalUrl` varchar(500);--> statement-breakpoint
ALTER TABLE `packages` ADD `robotsIndex` varchar(20) DEFAULT 'index';--> statement-breakpoint
ALTER TABLE `packages` ADD `robotsFollow` varchar(20) DEFAULT 'follow';--> statement-breakpoint
ALTER TABLE `packages` ADD `schemaType` varchar(100) DEFAULT 'Product';