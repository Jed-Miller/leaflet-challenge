//Store the JSON endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//Perform a GET request to the query URL.
d3.json(queryUrl).then(function(data) 
{
    console.log(data);
    createFeatures(data.features);
});

function circleSize(mag) {
    return mag * 10000;
};

function colorDepth(depth)
{
    if (depth < 10) {
        return "##b6f44c";
    }
    else if (depth < 30) {
        return "#e1f34f";
    }
    else if (depth < 50) {
        return "#f2dc4c";
    }
    else if (depth < 70) {
        return "#f3ba4c";
    }
    else if (depth < 90) {
        return "#efa76a";
    }
    else {
        return "#ed6a6a";
    }
}

function createFeatures(quakeData) {
    //Define a function that displays each feature in the features array.
    // Give each feature a popup that tells the place and time of the earthquake.
    function onEachFeature(feature, layer)
    {
        layer.bindPopup(`<h3>${feature.properties.place}<h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(quakeData,
        {
            onEachFeature: onEachFeature,

        pointToLayer: function(feature, latlng) {
        
            let circleMarkerFeatures =
            {
                radius: circleSize(feature.properties.mag),
                fillColor: colorDepth(feature.geometry.coordinates[2]),
                fillOpacity: 0.6,
                weight: 0.5,
                stroke: true
                
            }
            return L.circle(latlng, circleMarkerFeatures);
        }
    });
;
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