<<<<<<< HEAD
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
=======
// Load data from your JSON file (all-listing-json.json)
<<<<<<< HEAD
// http://localhost:8000       python -m http.server   
d3.json("Resources/all-listing-json.json").then(function (data) {
=======
// http://localhost:8000
d3.json("Resources/all-listing-gecodio.json").then(function (data) {
>>>>>>> main
    // Begin state pie chart code
  
    // Extract unique states from the data
    const states = [...new Set(data.map((item) => item.State))];
  
    // Populate the state dropdown with state options
    const stateDropdown = document.getElementById("state-dropdown");
  
    states.forEach((state) => {
      const option = document.createElement("option");
      option.value = state;
      option.text = state;
      stateDropdown.appendChild(option);
    });
  
    // Add an event listener to the dropdown to update property type counts and the state chart
    stateDropdown.addEventListener("change", function () {
      const selectedState = this.value;
      const filteredData = data.filter((item) => item.State === selectedState);
      const propertyTypeCounts = countPropertyTypes(filteredData);
      displayPropertyTypeCounts(propertyTypeCounts);
      createPropertyStateChart(filteredData); // Call the function to create the state chart
    });
  
    // Initial chart creation for the first state (if available)
    if (states.length > 0) {
      const initialData = data.filter((item) => item.State === states[0]);
      createPropertyStateChart(initialData);
    }
  
    // End state pie chart code
  
    const specialistData = calculateSpecialistData(data);
  
    // Filter out "Unknown" specialists and empty names
    const filteredData = specialistData.filter(
      (d) => d.specialist !== "Unknown" && d.specialist !== ""
    );
  
    // Create a bar chart to display the results
    createSpecialistBarChart(filteredData);
  });
  
  function calculateSpecialistData(data) {
    // Group data by specialist and calculate the number of houses sold and the sum of sales for each specialist
    const specialistData = d3.rollup(
      data,
      (v) => {
        return {
          housesSold: v.length,
          totalSales: d3.sum(v, (d) => parseFloat(d.Price.replace(/,/g, "")) || 0),
        };
      },
      (d) => d.Specialist || "Unknown"
    );
  
    // Convert the map to an array of objects
    return Array.from(specialistData, ([specialist, data]) => ({
      specialist,
      ...data,
    }));
  }
  
  function createSpecialistBarChart(data) {
    // Sort the data by the number of houses sold in descending order
    data.sort((a, b) => b.housesSold - a.housesSold);
  
    // Extract the specialist names and sales data
    const specialists = data.map((d) => d.specialist);
    const housesSold = data.map((d) => d.housesSold);
    const totalSales = data.map((d) => d.totalSales);
  
    // Create a bar chart
    const trace1 = {
      x: specialists,
      y: housesSold,
      type: "bar",
      name: "Houses Sold",
>>>>>>> 265c10219cddc5e830a1de41ce1fbe9c8a6af79f
    };
  
    const trace2 = {
      x: specialists,
      y: totalSales,
      type: "bar",
      name: "Total Sales",
    };
  
    const layout = {
      title: "Specialist Sales Data",
      xaxis: {
        title: "Specialist",
      },
      yaxis: {
        title: "Count/Total Sales",
      },
    };
  
    const chartData = [trace1, trace2];
  
    Plotly.newPlot("specialist-chart", chartData, layout);
  }
  
  // Function for counting property types and displaying property type counts
  function countPropertyTypes(data) {
    const propertyTypeCounts = {};
  
    data.forEach((item) => {
      const propertyType = item["Property Type"];
      if (propertyType) {
        if (propertyTypeCounts[propertyType]) {
          propertyTypeCounts[propertyType]++;
        } else {
          propertyTypeCounts[propertyType] = 1;
        }
      }
    });
  
    return propertyTypeCounts;
  }
  
  function displayPropertyTypeCounts(propertyTypeCounts) {
    // ... (existing code for displaying property type counts)
  }
  
  // Function for creating the state pie chart
  function createPropertyStateChart(data) {
    // Check if data is available
    if (data && data.length > 0) {
      // Count the number of properties in each state
      const stateCounts = countPropertyTypes(data);
  
      // Extract state names and counts
      const stateNames = Object.keys(stateCounts);
      const propertyCounts = Object.values(stateCounts);
  
      // Create a pie chart
      const trace = {
        labels: stateNames,
        values: propertyCounts,
        type: "pie",
        textinfo: "label+percent+value", // Show label, percent, and value in hover
        hoverinfo: "label+percent+value", // Show label, percent, and value on hover
        customdata: propertyCounts, // Store property counts in custom data
      };
  
      const layout = {
        title: "Property Type by State",
        showlegend: true,
        legend: {
          x: 0.85, // Adjust the legend position
          y: 0.5,
          traceorder: "normal", // Display legend items in the order they appear in the data
          title: {
            text: "State Properties", // Legend title
          },
          // Create a function to customize the legend item text
          itemclick: "toggleothers",
          itemdoubleclick: "toggle",
          itemwidth: 50,
          itemheight: 20,
          itemsizing: "constant",
          valign: "middle",
          borderwidth: 1,
          bordercolor: "#ddd",
          bgcolor: "white",
          font: {
            family: "Arial, sans-serif",
            size: 12,
            color: "#333",
          },
          // Customize the legend item text to include property counts
          itemtemplate:
            "%{label} (%{percent}) %{value} Properties", // Display label, percent, and value
        },
      };
  
      const chartData = [trace];
  
      Plotly.newPlot("state-chart", chartData, layout);
    }
  }


  document.addEventListener("DOMContentLoaded", function () {
    // Initialize the map at the beginning
    const map = L.map("map").setView([29.7604, -95.3698], 5);
  
    // Set the Mapbox tile layer
    const mapboxTileLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data © <a href='https://www.mapbox.com/'>Mapbox</a> contributors",
      maxZoom: 18,
      id: "mapbox/satellite-streets-v11", // Specify the Mapbox style ID
      accessToken: "pk.eyJ1IjoiY3BpbWVudGVsMTUiLCJhIjoiY2xuMTBxbDc4MXhyZjJrbnRvNTF2a2h6NiJ9.g_yMQ4MLNN4zMajTjjhnXw"
    });
  
    mapboxTileLayer.addTo(map); // Add the tile layer to the map
  
    // Load JSON data and create the map with markers
    d3.json("Resources/all-listing-gecodio.json").then(function (data) {
      const markerGroup = createPropertyMap(data, map);
      markerGroup.addTo(map);
    });
  
    function createPropertyMap(data, map) {
      const markers = []; // Array to store markers
  
      data.forEach((property) => {
        if (property.Latitude && property.Longitude) {
          const popupContent = `
            <b>Full Address:</b> ${property.Address}<br>
            <b>Price:</b> ${property.Price}<br>
            <b>Property Type:</b> ${property["Property Type"]}<br>
            <b>Beds:</b> ${property.Beds}<br>
            <b>Baths:</b> ${property.Baths}<br>
            <b>Year Built:</b> ${property["Year Built"]}<br>
          `;
  
          const marker = L.marker([parseFloat(property.Latitude), parseFloat(property.Longitude)])
            .bindPopup(popupContent);
          markers.push(marker);
        }
      });
  
      const markerGroup = L.layerGroup(markers);
      return markerGroup;
    }
  });