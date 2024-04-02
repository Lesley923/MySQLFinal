CREATE TABLE Location (
    location_id INT PRIMARY KEY,
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    resolved_address VARCHAR(255),
    timezone VARCHAR(50),
    tzoffset VARCHAR(10)
);