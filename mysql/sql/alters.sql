ALTER TABLE `location`
ADD INDEX `zip_code_index` (`zip_code`);
ALTER TABLE `adjacency_regions`
ADD INDEX `zip_code_index` (`zip_code`);
ALTER TABLE `adjacency_regions`
ADD FOREIGN KEY (`zip_code`) REFERENCES `location` (`zip_code`);
ALTER TABLE `weather_fact`
ADD INDEX `date_id_index` (`date_id`),
    ADD INDEX `wind_id_index` (`wind_id`),
    ADD INDEX `temperature_id_index` (`temperature_id`),
    ADD INDEX `humidity_id_index` (`humidity_id`),
    ADD INDEX `precipitation_id_index` (`precipitation_id`),
    ADD INDEX `location_id_index` (`location_id`);
ALTER TABLE `weather_fact`
ADD FOREIGN KEY (`date_id`) REFERENCES `date` (`id`),
    ADD FOREIGN KEY (`wind_id`) REFERENCES `wind` (`id`),
    ADD FOREIGN KEY (`temperature_id`) REFERENCES `temperature` (`id`),
    ADD FOREIGN KEY (`humidity_id`) REFERENCES `humidity` (`id`),
    ADD FOREIGN KEY (`precipitation_id`) REFERENCES `precipitation` (`id`),
    ADD FOREIGN KEY (`location_id`) REFERENCES `location` (`id`);