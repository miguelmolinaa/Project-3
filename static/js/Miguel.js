// Load JSON data using D3.js
d3.json("Resources/all-listing-gecodio.json").then(function(data) {
    // Create a Leaflet map and set the initial view to Texas
    const map = L.map('mapSection3').setView([31.9686, -99.9018], 6); // Texas coordinates and zoom level

    // Add a tile layer (e.g., OpenStreetMap) to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Function to update the map with markers for filtered data
    function updateMap(filteredData) {
        // Clear existing markers from the map
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Add markers for each property in filteredData
        filteredData.forEach(property => {
            const latitude = parseFloat(property.Latitude);
            const longitude = parseFloat(property.Longitude);

            if (!isNaN(latitude) && !isNaN(longitude)) {
                L.marker([latitude, longitude]).addTo(map)
                    .bindPopup(`Property ID: ${property["Property ID"]}<br>Address: ${property["Full Address"]}`);
            }
        });
    }

    // Implement search functionality
    document.getElementById("searchInput").addEventListener("input", function() {
        const searchTerm = this.value.toLowerCase();
        const filteredData = data.filter(property => {
            const fullAddress = property["Full Address"].toLowerCase();
            const city = property["City"].toLowerCase();
            const zip = property["ZIP"].toLowerCase();
            const propertyID = property["Property ID"].toLowerCase();
            return (
                fullAddress.includes(searchTerm) ||
                city.includes(searchTerm) ||
                zip.includes(searchTerm) ||
                propertyID.includes(searchTerm)
            );
        });
        updateMap(filteredData);
    });

    // Create an object to store filter options and their corresponding HTML elements
    const filterOptions = {
        "Property Type": "propertyTypeFilter",
        "City": "cityFilter",
        "State": "stateFilter",
        "Specialist": "specialistFilter",
        // Add more filter options as needed
    };

    // Dynamically generate filter options based on the filterOptions object
    for (const [filterName, filterId] of Object.entries(filterOptions)) {
        const filterElement = document.getElementById(filterId);
        const filterValues = [...new Set(data.map(item => item[filterName]))]; // Get unique values
        filterValues.sort(); // Sort the values alphabetically

        // Create an "All" option and append it to the filter
        const allOption = document.createElement("option");
        allOption.value = "";
        allOption.text = `All ${filterName}`;
        filterElement.appendChild(allOption);

        // Create options for each unique value and append them to the filter
        filterValues.forEach(value => {
            const option = document.createElement("option");
            option.value = value;
            option.text = value;
            filterElement.appendChild(option);
        });
    }

    // Function to apply filters based on the selected criteria
    function applyFilters() {
        const filters = {};

        // Loop through filter options and get selected values
        for (const [filterName, filterId] of Object.entries(filterOptions)) {
            const selectedValue = document.getElementById(filterId).value;
            if (selectedValue !== "") {
                filters[filterName] = selectedValue;
            }
        }

        // Filter data based on selected criteria
        const filteredData = data.filter(property => {
            // Implement filtering logic based on the selected filters
            // You can add more filter conditions here
            for (const [filterName, filterValue] of Object.entries(filters)) {
                if (filterName === "Price") {
                    // Handle price range filtering here
                } else if (filterName === "Sale Date") {
                    // Handle sale date range filtering here
                } else if (filterName === "Inspected Date") {
                    // Handle inspected date range filtering here
                } else {
                    // Regular filter based on selected values
                    if (property[filterName] !== filterValue) {
                        return false;
                    }
                }
            }
            return true;
        });

        // Update the map with the filtered data
        updateMap(filteredData);
    }

    // Add event listener for the filter button
    document.getElementById("filterButton").addEventListener("click", applyFilters);

    // Initialize the map with all properties
    updateMap(data);
});
