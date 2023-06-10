//Store the JSON endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Perform a GET request to the query URL.
d3.json(queryUrl).then(function(data) 
{
    console.log(data);
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    //Define a function that displays each feature in the features array.
    // Give each feature a popup that tells the place and time of the earthquake.
    function onEachFeature(feature, layer)
    {
        layer.bindPopup(`<h3>${feature.properties.place}<h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData,
        {
            onEachFeature: onEachFeature
    });

    //Send the earthquakes layer to the createmap function.
    createMap(earthquakes);
}

function createMap(earthquakes)
{
    //Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
    {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', 
    {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    //Create a baseMaps object.
    let baseMaps =
    {
        Street: street,
        Topo: topo
    };

    //Create an overlay object to hold our overlay.
    let overlayMaps =
    {
        Earthquakes: earthquakes
    };

    //Create our map
    let myMap = L.map("map",
    {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    //Create a layer control.
    //Passit it the baseMaps and overlayMaps
    //Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}