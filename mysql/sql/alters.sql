ALTER TABLE `location`
ADD INDEX `zip_code_index` (`zip_code`);
ALTER TABLE `adjacency_regions`
ADD INDEX `zip_code_index` (`zip_code`);
ALTER TABLE `adjacency_regions`
ADD FOREIGN KEY (`zip_code`) REFERENCES `location` (`zip_code`);