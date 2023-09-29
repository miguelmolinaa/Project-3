// Sample JSON data (replace this with your actual data)
import jsonData from '../Resources/all-listing-json.js';

function plotLocations() {
    const locations = jsonData.map(property => ({
        lon: parseFloat(property.Longitude),
        lat: parseFloat(property.Latitude)
    })).filter(location => 
        !isNaN(location.lon) && 
        !isNaN(location.lat)
    );

    const lonValues = locations.map(location => location.lon);
    const latValues = locations.map(location => location.lat);

    const trace = {
        type: 'scattermapbox',
        lon: lonValues,
        lat: latValues,
        mode: 'markers',
        marker: { size: 10, color: 'red' }
    };

    const layout = {
        title: 'Property Locations',
        mapbox: { 
            style: 'open-street-map', 
            zoom: 4, 
            center: { 
                lat: latValues[0], 
                lon: lonValues[0] 
            } 
        },
        margin: { r: 0, t: 0, b: 0, l: 0 }
    };

    Plotly.newPlot('map', [trace], layout, { responsive: true });
}

plotLocations();  // Call the function to plot locations
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

// Call the functions with your JSON data
calculatePriceDistribution(jsonData);
countPropertiesByState(jsonData);
calculateAveragePricePerSqft(jsonData);
