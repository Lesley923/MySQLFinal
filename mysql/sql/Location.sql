CREATE TABLE `location` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(50),
  `address` varchar(100),
  `zip_code` varchar(10) NOT NULL,
  `latitude` decimal(9, 6),
  `longitude` decimal(9, 6)
);