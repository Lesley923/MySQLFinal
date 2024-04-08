CREATE TABLE Precipitation (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `zipcode` VARCHAR(10),
  `date_key` INT,
  `precip` FLOAT,
  `precipprob` INT,
  `preciptype` VARCHAR(50),
  FOREIGN KEY (`date_key`) REFERENCES date(`date_key`),
  FOREIGN KEY (`zipcode`) REFERENCES Locations(`zip_code`)
);