// Load data from your JSON file (all-listings-json.json)
d3.json("Resources/all-listing-json.json").then(function(data) {
    // Extract unique states from the data
    const states = [...new Set(data.map(item => item.State))];
  
    // Populate the dropdown menu with state options
    const dropdown = d3.select("#state-dropdown");
  
    dropdown
      .selectAll("option")
      .data(states)
      .enter()
      .append("option")
      .text(d => d)
      .attr("value", d => d);
  
    // Initialize the charts with all data
    updateCharts(data);
  
    // Add an event listener to the dropdown to update the charts when a state is selected
    dropdown.on("change", function() {
      const selectedState = this.value;
      const filteredData = data.filter(item => item.State === selectedState);
      updateCharts(filteredData);
    });
  });
  
  function updateCharts(data) {
    // Update the price-chart (Properties by State - pie chart)
    const stateCounts = d3.rollup(
      data,
      v => v.length,
      d => d.State
    );
  
    const stateNames = Array.from(stateCounts.keys());
    const stateValues = Array.from(stateCounts.values());
  
    const priceChartTrace = {
      labels: stateNames,
      values: stateValues,
      type: "pie"
    };
  
    const priceChartData = [priceChartTrace];
  
    Plotly.newPlot("price-chart", priceChartData);
  
    // Update the avg-price-chart (Average Price per Square Foot)
    const avgPriceData = data.filter(item => item["Price"] !== "");
    const avgPricePerSqFt = avgPriceData.map(item => ({
      State: item.State,
      AvgPricePerSqFt: parseFloat(item["Price"].replace(/,/g, "")) / parseFloat(item["Sq.Ft"].replace(/,/g, ""))
    }));
  
    const avgPriceTrace = {
      x: avgPricePerSqFt.map(item => item.State),
      y: avgPricePerSqFt.map(item => item.AvgPricePerSqFt),
      type: "bar"
    };
  
    const avgPriceChartData = [avgPriceTrace];
  
    Plotly.newPlot("avg-price-chart", avgPriceChartData);
  }
  