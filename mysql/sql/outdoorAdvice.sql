SELECT 
    d.date,
    AVG(wf.feelslike) AS average_feels_like,
    MAX(w.wind_gust) AS max_wind_gust,
    CASE
        WHEN AVG(wf.feelslike) < -10 THEN 'Frigid'
        WHEN AVG(wf.feelslike) BETWEEN -10 AND 0 THEN 'Cold'
        WHEN AVG(wf.feelslike) BETWEEN 0 AND 10 THEN 'Cool'
        WHEN AVG(wf.feelslike) BETWEEN 10 AND 20 THEN 'Mild'
        WHEN AVG(wf.feelslike) BETWEEN 20 AND 30 THEN 'Warm'
        WHEN AVG(wf.feelslike) BETWEEN 30 AND 40 THEN 'Hot'
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
FROM 
    weather_fact AS wf
JOIN 
    date AS d ON wf.date_key = d.date_key
JOIN 
    wind AS w ON wf.wind_key = w.wind_key
WHERE
    wf.zipcode = ? AND
    d.date = ?
GROUP BY
    d.date
