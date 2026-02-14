DROP TABLE `airport_routes`;--> statement-breakpoint
DROP TABLE `airports`;--> statement-breakpoint
DROP TABLE `places`;--> statement-breakpoint
ALTER TABLE `activity_spots` DROP COLUMN `placeId`;--> statement-breakpoint
ALTER TABLE `boat_routes` DROP COLUMN `fromPlaceId`;--> statement-breakpoint
ALTER TABLE `boat_routes` DROP COLUMN `toPlaceId`;--> statement-breakpoint
ALTER TABLE `island_guides` DROP COLUMN `placeId`;--> statement-breakpoint
ALTER TABLE `island_guides` DROP COLUMN `nearbyAirports`;--> statement-breakpoint
ALTER TABLE `island_guides` DROP COLUMN `nearbyDiveSites`;--> statement-breakpoint
ALTER TABLE `island_guides` DROP COLUMN `nearbySurfSpots`;--> statement-breakpoint
ALTER TABLE `map_locations` DROP COLUMN `placeId`;--> statement-breakpoint
ALTER TABLE `transports` DROP COLUMN `fromPlaceId`;--> statement-breakpoint
ALTER TABLE `transports` DROP COLUMN `toPlaceId`;