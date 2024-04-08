SELECT
    d.date,
    loc.name                                                                                                                                           AS location,
    AVG(CASE WHEN d.hour_of_day BETWEEN 7 AND 11 THEN p.precipprob END)                                                                                AS morning_avg_prob,
    AVG(CASE WHEN d.hour_of_day BETWEEN 12 AND 16 THEN p.precipprob END)                                                                               AS afternoon_avg_prob,
    AVG(CASE WHEN d.hour_of_day BETWEEN 17 AND 21 THEN p.precipprob END)                                                                               AS evening_avg_prob,
    IF(AVG(IF(d.hour_of_day BETWEEN 7 AND 11, p.precipprob, NULL)) > 0.5, 'Bring umbrella',
       'No umbrella needed')                                                                                                                           AS morning_umbrella,
    IF(AVG(IF(d.hour_of_day BETWEEN 12 AND 16, p.precipprob, NULL)) > 0.5, 'Bring umbrella',
       'No umbrella needed')                                                                                                                           AS afternoon_umbrella,
    IF(AVG(IF(d.hour_of_day BETWEEN 17 AND 21, p.precipprob, NULL)) > 0.5, 'Bring umbrella',
       'No umbrella needed') AS evening_umbrella
FROM
    Precipitation p
JOIN
    date d ON p.date_key = d.date_key
JOIN
    Locations loc ON p.zipcode = loc.zip_code
WHERE
    loc.name = 'Tri-State Holiness Association' -- Replace with the OTHER location name
GROUP BY
    d.date, loc.name;
