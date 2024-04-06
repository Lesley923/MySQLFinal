ALTER TABLE Locations
ADD INDEX `location_id_index` (`zip_code`);
ALTER TABLE `AdjacencyRegions`
ADD FOREIGN KEY (`zip_code`) REFERENCES `Locations` (`zip_code`);