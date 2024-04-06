ALTER TABLE `Locations`
ADD INDEX `zip_code_index` (`zip_code`);
ALTER TABLE `AdjacencyRegions`
ADD INDEX `zip_code_index` (`zip_code`);
ALTER TABLE `AdjacencyRegions`
ADD FOREIGN KEY (`zip_code`) REFERENCES `Locations` (`zip_code`);