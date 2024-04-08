CREATE TABLE Temperature (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50),
  `date` date,
  `maxtemp` FLOAT,
  `mintemp` FLOAT,
  `feelslikemax` FLOAT,
  `feelslikemin` FLOAT
);