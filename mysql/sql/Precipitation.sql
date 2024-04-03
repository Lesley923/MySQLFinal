CREATE TABLE Precipitation (
  'id' INT PRIMARY KEY AUTO_INCREMENT,
  'name' VARCHAR(50),
  'datetime' datetime,
  'precip' FLOAT,
  'precipprob' INT,
  'preciptype' VARCHAR(50)
);
