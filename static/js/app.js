// Load data from your JSON file (all-listing-json.json)
//http://localhost:8000
d3.json("Resources/all-listing-json.json").then(function(data) {
    const specialistData = calculateSpecialistData(data);

    // Filter out "Unknown" specialists and empty names
    const filteredData = specialistData.filter(d => d.specialist !== "Unknown" && d.specialist !== "");
  
    // Create a bar chart to display the results
    createSpecialistBarChart(filteredData);
  });
  
  function calculateSpecialistData(data) {
    // Group data by specialist and calculate the number of houses sold and the sum of sales for each specialist
    const specialistData = d3.rollup(
      data,
      v => {
        return {
          housesSold: v.length,
          totalSales: d3.sum(v, d => parseFloat(d.Price.replace(/,/g, "")) || 0),
        };
      },
      d => d.Specialist || "Unknown"
    );
  
    // Convert the map to an array of objects
    return Array.from(specialistData, ([specialist, data]) => ({ specialist, ...data }));
  }
  
  function createSpecialistBarChart(data) {
    // Sort the data by the number of houses sold in descending order
    data.sort((a, b) => b.housesSold - a.housesSold);
  
    // Extract the specialist names and sales data
    const specialists = data.map(d => d.specialist);
    const housesSold = data.map(d => d.housesSold);
    const totalSales = data.map(d => d.totalSales);
  
    // Create a bar chart
    const trace1 = {
      x: specialists,
      y: housesSold,
      type: "bar",
      name: "Houses Sold",
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
