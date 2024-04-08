SELECT
    t.maxtemp AS MaxTemperature,
    t.mintemp AS MinTemperature,
    t.feelslikemax AS FeelsLikeMax,
    t.feelslikemin AS FeelsLikeMin,
    h.humidity AS Humidity,
    w.wind_speed AS WindSpeed,
    w.wind_gust AS WindGust,
    p.precip AS Precipitation,
    d.sunrise AS Sunrise,
    d.sunset AS Sunset
FROM
    weather_fact wf
INNER JOIN
    date d ON wf.date_id = d.id
INNER JOIN
    location l ON wf.location_id = l.id
INNER JOIN
    temperature t ON wf.temperature_id = t.id
INNER JOIN
    humidity h ON wf.humidity_id = h.id
INNER JOIN
    wind w ON wf.wind_id = w.id
INNER JOIN
    precipitation p ON wf.precipitation_id = p.id
WHERE
    l.zip_code = ? AND DATE(d.date) = DATE(?);
