CREATE TABLE Temperature (
  'id' INT PRIMARY KEY AUTO_INCREMENT,
  'name' VARCHAR(50),
  'datetime' datetime,
  'maxtemp' FLOAT,
  'mintemp' FLOAT,
  'feelslikemax' FLOAT,
  'feelslikemin' FLOAT
);