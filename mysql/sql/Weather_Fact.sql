CREATE TABLE weather_fact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_id INT,
    wind_id INT,
    temperature_id INT,
    humidity_id INT,
    precipitation_id INT,
    location_id INT,
    visibility FLOAT,
    cloudcover FLOAT
);