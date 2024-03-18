// forecast.js
document.addEventListener('DOMContentLoaded', function() {
    fetch('https://api.weather.gov/points/40.4445,-79.9530')
        .then(response => response.json())
        .then(data => fetch(data.properties.forecast))
        .then(response => response.json())
        .then(forecastData => {
            const forecastContainer = document.getElementById('forecast-container');
            forecastContainer.innerHTML = ''; // Clear existing forecast data
            
            forecastData.properties.periods.forEach(period => {
                const periodDiv = document.createElement('div');
                periodDiv.className = 'forecast-period';
                periodDiv.innerHTML = `
                    <div class="forecast-header">
                        <h3>${period.name}</h3>
                        <img src="${period.icon}" alt="${period.shortForecast}" />
                    </div>
                    <p>${period.detailedForecast}</p>
                    <p><strong>Temperature:</strong> ${period.temperature} ${period.temperatureUnit}</p>
                `;
                forecastContainer.appendChild(periodDiv);
            });
        })
        .catch(error => console.error('Error fetching forecast:', error));
});
