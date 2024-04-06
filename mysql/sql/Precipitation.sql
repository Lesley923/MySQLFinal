CREATE TABLE Precipitation (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50),
  `datetime` DATETIME,
  `precip` FLOAT,
  `precipprob` INT,
  `preciptype` VARCHAR(50)
);
