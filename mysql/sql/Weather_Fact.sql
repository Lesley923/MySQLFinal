CREATE TABLE weather_fact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_id INT NOT NULL,
    wind_id INT NOT NULL,
    temperature_id INT NOT NULL,
    humidity_id INT NOT NULL,
    precipitation_id INT NOT NULL,
    location_id INT NOT NULL
);