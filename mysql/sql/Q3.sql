SELECT d.date,
    d.sunrise,
    l.name AS BestLocationName,
    MIN(wf.cloudcover) AS CloudCover,
    MAX(COALESCE(wf.visibility, 10)) AS Visibility
FROM weather_fact wf
    JOIN date d ON wf.date_id = d.id
    JOIN location l ON wf.location_id = l.id
WHERE d.date BETWEEN ? AND DATE_ADD(?, INTERVAL 2 DAY)
    AND 0 <= d.hour_of_day
    AND TIME(d.sunrise) >= d.hour_of_day
    AND wf.cloudcover <= 100
    AND (
        wf.visibility >= 10
        OR wf.visibility IS NULL
    )
GROUP BY d.date,
    l.id
ORDER BY d.date,
    CloudCover,
    Visibility DESC
LIMIT 3