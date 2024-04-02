ALTER TABLE `AdjacencyRegion`
ADD FOREIGN KEY (`zip_code`) REFERENCES `Location` (`zip_code`);