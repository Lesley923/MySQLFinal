SELECT
    wdpl.Date,
    wdpl.Location,
    wdpl.MorningPrecipProb,
    wdpl.AfternoonPrecipProb,
    wdpl.EveningPrecipProb,
    wdpl.MorningUmbrella,
    wdpl.AfternoonUmbrella,
    wdpl.EveningUmbrella
FROM (
    SELECT
        d.date                                                                                       AS Date,
        loc.name                                                                                     AS Location,
        AVG(CASE WHEN d.hour_of_day BETWEEN 7 AND 11 THEN precip.precipprob ELSE 0 END)              AS MorningPrecipProb,
        AVG(CASE WHEN d.hour_of_day BETWEEN 12 AND 16 THEN precip.precipprob ELSE 0 END)             AS AfternoonPrecipProb,
        AVG(CASE WHEN d.hour_of_day BETWEEN 17 AND 21 THEN precip.precipprob ELSE 0 END)             AS EveningPrecipProb,
        IF(AVG(CASE WHEN d.hour_of_day BETWEEN 7 AND 11 THEN precip.precipprob ELSE 0 END) > 0.5, 'Bring umbrella', 'No umbrella needed') AS MorningUmbrella,
        IF(AVG(CASE WHEN d.hour_of_day BETWEEN 12 AND 16 THEN precip.precipprob ELSE 0 END) > 0.5, 'Bring umbrella', 'No umbrella needed') AS AfternoonUmbrella,
        IF(AVG(CASE WHEN d.hour_of_day BETWEEN 17 AND 21 THEN precip.precipprob ELSE 0 END) > 0.5, 'Bring umbrella', 'No umbrella needed') AS EveningUmbrella
    FROM
        weather_fact wf
    JOIN
        date d ON wf.date_id = d.id
    JOIN
        precipitation precip ON wf.precipitation_id = precip.id
    JOIN
        location loc ON wf.location_id = loc.id
    WHERE
        loc.zip_code = ? AND d.date = ? -- Use the parameters here
    GROUP BY
        d.date, loc.name
) wdpl;
