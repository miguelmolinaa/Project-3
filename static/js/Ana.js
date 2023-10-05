// Specialist count
function createSpecialistCount(data) {
    // Group data by specialist and count the occurrences
    const specialistCounts = d3.rollup(data, v => v.length, d => d.Specialist);

    // Sort specialist counts in descending order
    const sortedSpecialistCounts = Array.from(specialistCounts, ([specialist, count]) => ({ specialist, count }));
    sortedSpecialistCounts.sort((a, b) => b.count - a.count);

    // Select the top 10 specialist counts
    const top10SpecialistCounts = sortedSpecialistCounts.slice(0, 10);

    // Create a bar chart to visualize specialist counts
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#specialistCount")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(top10SpecialistCounts.map(d => d.specialist))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(top10SpecialistCounts, d => d.count)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .selectAll("rect")
        .data(top10SpecialistCounts)
        .enter()
        .append("rect")
        .attr("x", d => x(d.specialist))
        .attr("y", d => y(d.count))
        .attr("height", d => height - y(d.count))
        .attr("width", x.bandwidth())
        .attr("fill", "#69b3a2");

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-45)");
}

// Total sales per county (top 10)
function createTotalSalesPerCounty(data) {
    // Group data by county and calculate total sales
    const countySales = d3.rollup(data, v => d3.sum(v, d => parseFloat(d.Price.replace(/,/g, ''))), d => d.County);

    // Convert county sales map to an array of objects
    const countySalesArray = Array.from(countySales, ([county, totalSales]) => ({ county, totalSales }));

    // Sort county sales in descending order
    countySalesArray.sort((a, b) => b.totalSales - a.totalSales);

    // Select the top 10 counties
    const top10CountySales = countySalesArray.slice(0, 10);

    // Create a bar chart to visualize total sales per county
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#totalSalesPerCounty")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(top10CountySales.map(d => d.county))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(top10CountySales, d => d.totalSales)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .selectAll("rect")
        .data(top10CountySales)
        .enter()
        .append("rect")
        .attr("x", d => x(d.county))
        .attr("y", d => y(d.totalSales))
        .attr("height", d => height - y(d.totalSales))
        .attr("width", x.bandwidth())
        .attr("fill", "#69b3a2");

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-45)");
}

// Call the functions to create the charts when the page loads
document.addEventListener("DOMContentLoaded", function () {
    // Load your JSON data using d3.json and pass it to the chart functions
    d3.json("Resources/all-listing-gecodio.json").then(function (data) {
        createSpecialistCount(data);
        createTotalSalesPerCounty(data);
    });
});
