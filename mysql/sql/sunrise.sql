SELECT d.date,
    d.sunrise,
    AVG(wf.visibility) AS average_visibility,
    CASE
        WHEN AVG(wf.visibility) > 20 THEN 'Excellent'
        WHEN AVG(wf.visibility) BETWEEN 10 AND 20 THEN 'Good'
        WHEN AVG(wf.visibility) BETWEEN 4 AND 10 THEN 'Moderate'
        WHEN AVG(wf.visibility) BETWEEN 1 AND 4 THEN 'Poor'
        ELSE 'Very Poor'
    END AS visibility_category,
    AVG(wf.cloudcover) AS average_cloud_cover,
    CASE
        WHEN AVG(wf.cloudcover) BETWEEN 0 AND 10 THEN 'Clear Skies'
        WHEN AVG(wf.cloudcover) BETWEEN 10 AND 30 THEN 'Mostly Clear'
        WHEN AVG(wf.cloudcover) BETWEEN 30 AND 70 THEN 'Partly Cloudy'
        WHEN AVG(wf.cloudcover) BETWEEN 70 AND 90 THEN 'Mostly Cloudy'
        ELSE 'Overcast'
    END AS cloud_cover_category,
    CASE
        WHEN AVG(wf.visibility) < 1
        OR AVG(wf.cloudcover) > 90 THEN 'Very Low'
        WHEN AVG(wf.visibility) BETWEEN 1 AND 4
        OR AVG(wf.cloudcover) BETWEEN 70 AND 90 THEN 'Low'
        WHEN AVG(wf.visibility) BETWEEN 4 AND 20
        OR AVG(wf.cloudcover) BETWEEN 30 AND 70 THEN 'Moderate'
        ELSE 'High'
    END AS watching_possibility
FROM weather_fact AS wf
    JOIN date AS d ON wf.date_id = d.id
    JOIN location AS l ON wf.location_id = l.id
WHERE l.zip_code = ?
    AND d.date = ?
    AND (
        HOUR(d.sunrise) - 1 <= d.hour_of_day
        AND d.hour_of_day <= HOUR(d.sunrise) + 1
    )
GROUP BY d.date