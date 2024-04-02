CREATE TABLE `Locations` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(50),
  `address` varchar(100),
  `zip_code` varchar(10),
  `latitude` decimal(9, 6),
  `longitude` decimal(9, 6)
);