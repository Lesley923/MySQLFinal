document.addEventListener('DOMContentLoaded', function() {     
    //add city filter button
    const loadWeatherButton = document.getElementById('load-weather');
    loadWeatherButton.addEventListener('click', function() {
        const cityZipCode = document.getElementById('city').value;
        if(!cityZipCode){
            alert("Please select City!");
            document.getElementById('forecast-container').innerHTML = "";
        }
        else{
            //decide endpoint
            const endpoint = cityZipCode ? `/weather?zip=${cityZipCode}` : '/weather';        
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

                        // Call the drawBarChart function to draw the bar chart with the monthly stats
                        drawBarChart(monthlyStats);
                    });
            })
            .catch(error => console.error('Error fetching forecast:', error));
        }
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

    function drawBarChart(monthlyStats) {
        const monthAbbreviations = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
        const svgElement = d3.select('#temp-bar-chart');
        const margin = { top: 20, right: 20, bottom: 50, left: 60 };
        //const width = +svgElement.style('width').slice(0, -2) - margin.left - margin.right; // Parse width from style attribute
        //const height = +svgElement.style('height').slice(0, -2) - margin.top - margin.bottom; // Parse height from style attribute
    
        // Account for margins when setting width and height
        const width = parseInt(svgElement.style('width')) - margin.left - margin.right;
        const height = parseInt(svgElement.style('height')) - margin.top - margin.bottom;

        // Clear any previous SVG content
        svgElement.selectAll("*").remove();
    
        const xScale = d3.scaleBand()
            .domain(monthAbbreviations) // Use month abbreviations for domain
            .range([0, width])
            .padding(0.1);
        
        // Define the scales
        const yScale = d3.scaleLinear()
        .domain([0, d3.max(Object.values(monthlyStats), d => d.avgTemp) * 4]) // Multiply by 1.1 to add some space at the top
        .range([height, 0]);
    
        const g = svgElement.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        // Bars
        g.selectAll('rect')
            .data(Object.values(monthlyStats))
            .enter()
            .append('rect')
            .attr('x', (d, i) => xScale(monthAbbreviations[i]))
            .attr('y', d => yScale(d.avgTemp))
            .attr('width', xScale.bandwidth() - 5 ) 
            .attr('height', d => height - yScale(d.avgTemp))
            .attr('fill', 'steelblue');
    
        // X Axis
        g
            .append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
    
        // Y Axis
        g
            .append('g')
            .call(d3.axisLeft(yScale).ticks(10))
            .append('text')
    
        // Adding text labels for each bar
        g.selectAll('.text')
            .data(Object.values(monthlyStats))
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', (d, i) => xScale(monthAbbreviations[i]) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d.avgTemp) - 5)
            .attr('text-anchor', 'middle')
            .text(d => d.avgTemp + '°C')
            .attr('font-size', '10px');

            // Y-Axis Title
            g.append("text")
            .attr("transform", "rotate(-90)") // Rotate the text for vertical y-axis title
            .attr("y", 0 - margin.left) // Position it to the left of the y-axis
            .attr("x", 0 - (height / 2)) // Center it vertically
            .attr("dy", "1em") // Adjust distance from the axis
            .style("text-anchor", "middle") // Center the text horizontally
            .text("Average Temperature (°C)"); // The subtitle text for the y-axis

            // X-Axis Title
            g.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`) // Position it below the x-axis
            .style("text-anchor", "middle") // Center the text horizontally
            .text("Months of the Year"); // The subtitle text for the x-axis
    }

    // function drawBarChart(monthlyStats) {
    //     const svg = document.getElementById('temp-bar-chart');
    //     svg.innerHTML = ''; // Clear any previous chart
    
    //     const margin = {top: 20, right: 20, bottom: 50, left: 50}; // Increase left margin for Y-axis labels
    //     const width = svg.clientWidth - margin.left - margin.right; //svg.clientWidth
    //     const height = svg.clientHeight - margin.top - margin.bottom;   //svg.clientHeight

    //     // Create a group element to encapsulate all bar chart elements
    //     const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    //     g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
        
    //     // Find max temperature for scaling
    //     const maxTemp = Math.max(...Object.values(monthlyStats).map(month => parseFloat(month.avgTemp)));
        
    //     // Draw bars
    //     const barWidth = width / Object.keys(monthlyStats).length;
    //     Object.keys(monthlyStats).forEach((month, index) => {
    //         const stats = monthlyStats[month];
    //         const barHeight = (parseFloat(stats.avgTemp) / maxTemp) * height;

    //         const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    //         rect.setAttribute('x', index * barWidth);
    //         rect.setAttribute('y', height - barHeight);
    //         rect.setAttribute('width', barWidth - 5); // 5px gap between bars
    //         rect.setAttribute('height', barHeight);
    //         rect.setAttribute('fill', 'steelblue');
    //         g.appendChild(rect);
    
    //         // Optionally, add text labels for temperatures
    //         const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    //         text.setAttribute('x', (index * barWidth) + (barWidth / 2));
    //         text.setAttribute('y', height - barHeight - 5);
    //         text.setAttribute('text-anchor', 'middle');
    //         text.setAttribute('font-size', '10px');
    //         text.textContent = stats.avgTemp + '°C';
    //         g.appendChild(text);
    //     });
    
    //     // Draw X axis
    //     const xAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    //     xAxisLine.setAttribute('x1', 0);
    //     xAxisLine.setAttribute('y1', height);
    //     xAxisLine.setAttribute('x2', width);
    //     xAxisLine.setAttribute('y2', height);
    //     xAxisLine.setAttribute('stroke', 'black');
    //     g.appendChild(xAxisLine);
    
    //     // Draw Y axis
    //     const yAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    //     yAxisLine.setAttribute('x1', 0);
    //     yAxisLine.setAttribute('y1', 0);
    //     yAxisLine.setAttribute('x2', 0);
    //     yAxisLine.setAttribute('y2', height);
    //     yAxisLine.setAttribute('stroke', 'black');
    //     g.appendChild(yAxisLine);

    //     const monthAbbreviations = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
    //     // Adjust X-axis labels (months)
    //     Object.keys(monthlyStats).forEach((month, index) => {
    //         const xAxisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    //         xAxisLabel.setAttribute('x', (index * barWidth) + (barWidth / 2));
    //         xAxisLabel.setAttribute('y', height + 30); // Move down to give more space
    //         xAxisLabel.setAttribute('text-anchor', 'middle');
    //         xAxisLabel.setAttribute('font-size', '10px');
    //         //xAxisLabel.setAttribute('transform', `rotate(-45, ${(index * barWidth) + (barWidth / 2)}, ${height + 30})`); // Rotate labels
    //         //xAxisLabel.textContent = month.substring(5); // Optionally show only MM part of 'YYYY-MM'
    //         xAxisLabel.textContent = monthAbbreviations[parseInt(month.substring(5), 10) - 1];
    //         g.appendChild(xAxisLabel);
    //     });

    //     // Draw Y-axis labels
    //     const yAxisScale = height / maxTemp;
    //     for (let i = 0; i <= maxTemp; i += maxTemp / 5) { // Adjust the step to suitable intervals for your data
    //         const yValue = height - (i * yAxisScale);
    //         const yAxisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    //         yAxisLabel.setAttribute('x', -margin.left); // Align labels to the left of the Y-axis
    //         yAxisLabel.setAttribute('y', yValue);
    //         yAxisLabel.setAttribute('text-anchor', 'end');
    //         yAxisLabel.setAttribute('alignment-baseline', 'middle'); // Center alignment for text
    //         yAxisLabel.setAttribute('font-size', '10px');
    //         yAxisLabel.textContent = i.toFixed(2) + '°C';
    //         g.appendChild(yAxisLabel);
    //     }
    
    //     // Append the group to the SVG element
    //     svg.appendChild(g);
    // }
});


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
