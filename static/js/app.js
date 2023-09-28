// Use D3.js to load JSON data from an external file
d3.json("Resources/all-listing-json.json").then(function(data) {
    // Function to calculate the price distribution
    function calculatePriceDistribution(data) {
        // Extract property prices and convert to numeric values
        const prices = data.map(property => parseFloat(property.Price.replace(',', '')));

        // Create a histogram of property prices
        const trace = {
            x: prices,
            type: 'histogram',
            marker: { color: 'blue' },
        };

        const layout = {
            title: 'Price Distribution',
            xaxis: { title: 'Price' },
            yaxis: { title: 'Count' },
        };

        Plotly.newPlot('price-chart', [trace], layout);
    }

    // Function to count properties by state
    function countPropertiesByState(data) {
        const states = {};

        data.forEach(property => {
            const state = property.State;
            if (states[state]) {
                states[state]++;
            } else {
                states[state] = 1;
            }
        });

        const stateNames = Object.keys(states);
        const propertyCounts = stateNames.map(state => states[state]);

        const trace = {
            x: stateNames,
            y: propertyCounts,
            type: 'bar',
            marker: { color: 'green' },
        };

        const layout = {
            title: 'Properties by State',
            xaxis: { title: 'State' },
            yaxis: { title: 'Count' },
        };

        Plotly.newPlot('state-chart', [trace], layout);
    }

    // Function to calculate average price per square foot
    function calculateAveragePricePerSqft(data) {
        const sqftPrices = data.map(property => {
            const price = parseFloat(property.Price.replace(',', ''));
            const sqft = parseFloat(property['Sq.Ft'].replace(',', ''));
            return sqft > 0 ? price / sqft : 0;
        });

        const trace = {
            x: sqftPrices,
            type: 'histogram',
            marker: { color: 'orange' },
        };

        const layout = {
            title: 'Average Price per Square Foot',
            xaxis: { title: 'Price per Sq.Ft' },
            yaxis: { title: 'Count' },
        };

        Plotly.newPlot('avg-price-chart', [trace], layout);
    }

    // Call the functions with the loaded JSON data
    calculatePriceDistribution(data);
    countPropertiesByState(data);
    calculateAveragePricePerSqft(data);
});
