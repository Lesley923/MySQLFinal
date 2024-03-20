document.addEventListener('DOMContentLoaded', function() {
    //add city filter button
    const loadWeatherButton = document.getElementById('load-weather');
    loadWeatherButton.addEventListener('click', function() {
        const cityZipCode = document.getElementById('city').value;
        if(!cityZipCode){
            alert("Please select City!");
        }
        else{
            const endpoint = cityZipCode ? `/weather?zip=${cityZipCode}` : '/weather';

            //console.log(endpoint);
        
            fetch(endpoint)
                .then(response => response.json())
                .then(data => {
                    const container = document.getElementById('forecast-container');
                    container.innerHTML = ''; // Clear previous results
                    const days = data[0]?.days; // Adjust based on your actual data structure
                    const monthlyStats = calculateMonthlyStats(days);

                    Object.keys(monthlyStats).forEach(month => {
                        const stats = monthlyStats[month];
                        const card = document.createElement('div');
                        card.className = 'forecast-card';

                        const monthEl = document.createElement('h2');
                        monthEl.textContent = `Month: ${month}`;
                        card.appendChild(monthEl);

                        const avgTempEl = document.createElement('p');
                        avgTempEl.textContent = `Average Temperature: ${stats.avgTemp}°C`;
                        card.appendChild(avgTempEl);

                        const totalPrecipEl = document.createElement('p');
                        totalPrecipEl.textContent = `Total Precipitation: ${stats.totalPrecip}mm`;
                        card.appendChild(totalPrecipEl);

                        const maxWindGustEl = document.createElement('p');
                        maxWindGustEl.textContent = `Max Wind Gust: ${stats.maxWindGust}km/h`;
                        card.appendChild(maxWindGustEl);

                        container.appendChild(card);
                    });
            })
            .catch(error => console.error('Error fetching forecast:', error));
        }
    });
});


function calculateMonthlyStats(days) {
    let monthlyStats = {};

    days.forEach(day => {
        const month = day.datetime.substring(0, 7); // YYYY-MM
        if (!monthlyStats[month]) {
            monthlyStats[month] = { totalTemp: 0, totalPrecip: 0, maxWindGust: 0, count: 0 };
        }
        monthlyStats[month].totalTemp += day.temp;
        monthlyStats[month].totalPrecip += day.precip || 0;
        monthlyStats[month].maxWindGust = Math.max(monthlyStats[month].maxWindGust, day.windgust || 0);
        monthlyStats[month].count++;
    });

    // Calculate averages
    Object.keys(monthlyStats).forEach(month => {
        monthlyStats[month].avgTemp = (monthlyStats[month].totalTemp / monthlyStats[month].count).toFixed(2);
        monthlyStats[month].totalPrecip = monthlyStats[month].totalPrecip.toFixed(2);
        monthlyStats[month].maxWindGust = monthlyStats[month].maxWindGust.toFixed(2);
    });

    return monthlyStats;
}


// document.addEventListener('DOMContentLoaded', function() {
//     fetch('/weather')
//         .then(response => response.json())
//         .then(data => {
//             const container = document.getElementById('forecast-container');
            
//             // // Assuming the first document in the array contains the weather data you're interested in
//             // const weatherData = data[0].days;
//             console.log(data[0]);
//             const zipCode = data[0].address
            
            
//             // Check if data contains documents and at least one document has days
//             if (data && data.length > 0) {
//                 console.log("You are in");
//                 const daily_data = data[0].days;
                
//                 // Create a forecast card for each day
//                 daily_data.forEach(day => {
//                     const card = document.createElement('div');
//                     card.className = 'forecast-card';
                    
//                     // Example of what might be included on a card
//                     const date = document.createElement('h2');
//                     date.textContent = `Date: ${day.datetime}`;
//                     card.appendChild(date);
                    
//                     const temp = document.createElement('p');
//                     temp.textContent = `Average Temperature: ${day.temp}°C`;
//                     card.appendChild(temp);

//                     const highLow = document.createElement('p');
//                     highLow.textContent = `High/Low: ${day.tempmax}°C / ${day.tempmin}°C`;
//                     card.appendChild(highLow);

//                     const precipitation = document.createElement('p');
//                     precipitation.textContent = `Precipitation: ${day.precip ? day.precip + 'mm' : 'No precipitation'}`;
//                     card.appendChild(precipitation);
                    
//                     const conditions = document.createElement('p');
//                     conditions.textContent = `Conditions: ${day.conditions}`;
//                     card.appendChild(conditions);

//                     const description = document.createElement('p');
//                     description.textContent = `Description: ${day.description}`;
//                     card.appendChild(description);
                    
//                     container.appendChild(card);
//                 });
//             } else {
//                 // Handle case where no weather data is found
//                 container.textContent = 'No weather data available';
//             }
//         })
//         .catch(error => console.error('Error fetching forecast:', error));
// });



// document.addEventListener('DOMContentLoaded', function() {
//     fetch('https://api.weather.gov/points/40.4445,-79.9530')
//         .then(response => response.json())
//         .then(data => fetch(data.properties.forecast))
//         .then(response => response.json())
//         .then(forecastData => {
//             const forecastContainer = document.getElementById('forecast-container');
//             forecastContainer.innerHTML = ''; // Clear existing forecast data
            
//             forecastData.properties.periods.forEach(period => {
//                 const periodDiv = document.createElement('div');
//                 periodDiv.className = 'forecast-period';
//                 periodDiv.innerHTML = `
//                     <div class="forecast-header">
//                         <h3>${period.name}</h3>
//                         <img src="${period.icon}" alt="${period.shortForecast}" />
//                     </div>
//                     <p>${period.detailedForecast}</p>
//                     <p><strong>Temperature:</strong> ${period.temperature} ${period.temperatureUnit}</p>
//                 `;
//                 forecastContainer.appendChild(periodDiv);
//             });
//         })
//         .catch(error => console.error('Error fetching forecast:', error));
// });
