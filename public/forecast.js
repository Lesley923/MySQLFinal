document.addEventListener('DOMContentLoaded', function() {
    fetch('https://api.weather.gov/points/40.4445,-79.9530')
        .then(response => response.json())
        .then(data => fetch(data.properties.forecast))
        .then(response => response.json())
        .then(forecastData => {
            const forecastContainer = document.getElementById('forecast-container');
            forecastContainer.innerHTML = ''; // Clear existing forecast data
            
            let temperatures = []; // Array to hold temperature values for visualization
            
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
                
                // Collect temperature data for D3 visualization
                temperatures.push(period.temperature);
            });
            
            // After the forecast is displayed, create a visualization
            createTemperatureChart(temperatures);
        })
        .catch(error => console.error('Error fetching forecast:', error));
});

function createTemperatureChart(temperatures) {
    const svgWidth = 500, svgHeight = 300, barPadding = 5;
    let barWidth = (svgWidth / temperatures.length);
    
    const svg = d3.select('#d3-visualization')
                  .append('svg')
                  .attr('width', svgWidth)
                  .attr('height', svgHeight);
    
    svg.selectAll('rect')
       .data(temperatures)
       .enter()
       .append('rect')
       .attr('y', d => svgHeight - d)
       .attr('height', d => d)
       .attr('width', barWidth - barPadding)
       .attr('transform', (d, i) => {
           let translate = [barWidth * i, 0];
           return `translate(${translate})`;
       });
}
