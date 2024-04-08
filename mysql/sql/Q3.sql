SELECT
    d.date,
    l.name AS LocationName,
    MIN(p.cloud_cover) AS CloudCover,
    MAX(COALESCE(t.visibility, 10)) AS Visibility
FROM
    weather_fact wf
JOIN
    date d ON wf.date_id = d.id
JOIN
    location l ON wf.location_id = l.id
JOIN
    precipitation p ON wf.precipitation_id = p.id
JOIN
    temperature t ON wf.temperature_id = t.id
WHERE
    d.date BETWEEN ? AND DATE_ADD(?, INTERVAL 2 DAY)
    AND (TIME(d.sunrise) - INTERVAL 1 HOUR) <= d.hour_of_day
    AND TIME(d.sunrise) >= d.hour_of_day
    AND p.cloud_cover <= 20
    AND (t.visibility >= 10 OR t.visibility IS NULL)
GROUP BY
    d.date, l.id
ORDER BY
    d.date, CloudCover ASC, Visibility DESC
LIMIT 3;
