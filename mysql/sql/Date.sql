CREATE TABLE date (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    hour_of_day INT NOT NULL,
    sunrise TIME NOT NULL,
    sunset TIME NOT NULL
);
