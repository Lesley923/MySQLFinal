CREATE TABLE wind (
    wind_key INT AUTO_INCREMENT PRIMARY KEY,
    wind_gust DECIMAL(5, 2) NOT NULL,
    wind_speed DECIMAL(5, 2) NOT NULL,
    wind_direction INT NOT NULL
);