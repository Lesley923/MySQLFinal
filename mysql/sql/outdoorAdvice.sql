SELECT d.date,
    AVG(t.feelslike) AS average_feels_like,
    MAX(w.wind_gust) AS max_wind_gust,
    CASE
        WHEN AVG(t.feelslike) < -10 THEN 'Frigid'
        WHEN AVG(t.feelslike) BETWEEN -10 AND 0 THEN 'Cold'
        WHEN AVG(t.feelslike) BETWEEN 0 AND 10 THEN 'Cool'
        WHEN AVG(t.feelslike) BETWEEN 10 AND 20 THEN 'Mild'
        WHEN AVG(t.feelslike) BETWEEN 20 AND 30 THEN 'Warm'
        WHEN AVG(t.feelslike) BETWEEN 30 AND 40 THEN 'Hot'
        ELSE 'Very Hot'
    END AS feels_like_category,
    CASE
        WHEN MAX(w.wind_gust) < 10 THEN 'Calm'
        WHEN MAX(w.wind_gust) BETWEEN 10 AND 30 THEN 'Light'
        WHEN MAX(w.wind_gust) BETWEEN 30 AND 50 THEN 'Moderate'
        WHEN MAX(w.wind_gust) BETWEEN 50 AND 70 THEN 'Strong'
        WHEN MAX(w.wind_gust) BETWEEN 70 AND 90 THEN 'Severe'
        ELSE 'Extreme'
    END AS wind_gust_category
FROM weather_fact AS wf
    JOIN date AS d ON wf.date_id = d.id
    JOIN wind AS w ON wf.wind_id = w.id
    JOIN location as l ON wf.location_id = l.id
    JOIN temperature as t ON wf.temperature_id = t.id
WHERE l.zip_code = ?
    AND d.date = ?
GROUP BY d.date