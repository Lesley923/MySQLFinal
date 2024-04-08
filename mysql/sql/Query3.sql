SELECT
    d.date,
    l.name AS LocationName,
    MIN(wf.cloudcover) AS CloudCover,
    MAX(COALESCE(wf.visibility, 10)) AS Visibility
FROM
    weather_fact wf
JOIN
    date d ON wf.date_key = d.date_key
JOIN
    Locations l ON wf.zipcode = l.zip_code
JOIN
    Precipitation p ON wf.weather_id = p.id
JOIN
    Temperature t ON wf.weather_id = t.id
WHERE
    d.date BETWEEN now() AND DATE_ADD(now(), INTERVAL 2 DAY)
    AND (TIME(d.sunrise) - INTERVAL 1 HOUR) <= d.hour_of_day
    AND TIME(d.sunrise) >= d.hour_of_day
    AND wf.cloudcover <= 20
    AND (wf.visibility >= 10 OR wf.visibility IS NULL)
GROUP BY
    d.date, l.id
ORDER BY
    d.date, CloudCover, Visibility DESC
LIMIT 3;