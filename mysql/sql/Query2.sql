SELECT
  l.name,
  AVG(CASE WHEN HOUR(d.hour_of_day) BETWEEN 7 AND 11 THEN wf.precipprob ELSE NULL END) AS avg_morning_precipprob,
  AVG(CASE WHEN HOUR(d.hour_of_day) BETWEEN 12 AND 16 THEN wf.precipprob ELSE NULL END) AS avg_afternoon_precipprob,
  AVG(CASE WHEN HOUR(d.hour_of_day) BETWEEN 17 AND 21 THEN wf.precipprob ELSE NULL END) AS avg_evening_precipprob
FROM
  Locations AS l
JOIN
  weather_fact AS wf ON l.id = wf.location_key
JOIN
  date AS d ON wf.date_key = d.date_key
WHERE
  l.name = 'Yough Shore Inn' -- Replace with the actual city name or another unique identifier
  AND d.date >= '2024-04-02' -- Replace with the start date of the desired week
  AND d.date < DATE_ADD('2024-04-02', INTERVAL 7 DAY) -- This calculates the end date by adding 7 days to the start date
GROUP BY
  l.name
HAVING
  avg_morning_precipprob > 0.5 OR avg_afternoon_precipprob > 0.5 OR avg_evening_precipprob > 0.5;
