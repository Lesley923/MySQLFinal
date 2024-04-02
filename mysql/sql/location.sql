CREATE TABLE `Location` (
  `id` int PRIMARY KEY,
  `name` varchar(50),
  `address` varchar(100),
  `zip_code` varchar(10),
  `latitude` decimal(9, 6),
  `longtitude` decimal(9, 6)
);