SELECT
    l.name AS LocationName,
    d.date AS Date,
    d.sunrise AS SunriseTime,
    d.sunset AS SunsetTime,
    AVG(CASE WHEN d.hour_of_day BETWEEN HOUR(d.sunrise)-1 AND HOUR(d.sunrise)+1 THEN wf.visibility ELSE NULL END) AS SunriseVisibility,
    AVG(CASE WHEN d.hour_of_day BETWEEN HOUR(d.sunrise)-1 AND HOUR(d.sunrise)+1 THEN wf.cloudcover ELSE NULL END) AS SunriseCloudCover,
    AVG(CASE WHEN d.hour_of_day BETWEEN HOUR(d.sunset)-1 AND HOUR(d.sunset)+1 THEN wf.visibility ELSE NULL END) AS SunsetVisibility,
    AVG(CASE WHEN d.hour_of_day BETWEEN HOUR(d.sunset)-1 AND HOUR(d.sunset)+1 THEN wf.cloudcover ELSE NULL END) AS SunsetCloudCover,
    MAX(CASE WHEN d.hour_of_day BETWEEN HOUR(d.sunrise)-1 AND HOUR(d.sunrise)+1 THEN w.wind_gust ELSE NULL END) AS MaxWindGustSunrise,
    MAX(CASE WHEN d.hour_of_day BETWEEN HOUR(d.sunset)-1 AND HOUR(d.sunset)+1 THEN w.wind_gust ELSE NULL END) AS MaxWindGustSunset
FROM
    weather_fact wf
INNER JOIN
    date d ON wf.date_key = d.date_key
INNER JOIN
    Locations l ON wf.zipcode = l.zip_code
INNER JOIN
    wind w ON wf.wind_key = w.wind_key
WHERE
    l.name = 'Tri-State Holiness Association' -- Replace with location name
GROUP BY
    d.date, l.name;