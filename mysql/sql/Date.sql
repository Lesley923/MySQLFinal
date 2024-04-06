CREATE TABLE date (
    date_key INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    day_of_week VARCHAR(9) NOT NULL,
    week_of_year INT NOT NULL,
    month INT NOT NULL,
    quarter INT NOT NULL,
    year INT NOT NULL,
    hour_of_day INT NOT NULL,
    sunrise TIME NOT NULL,
    sunset TIME NOT NULL
);
