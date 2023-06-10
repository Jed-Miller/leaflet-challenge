//Store the JSON endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

//Perform a GET request to the query URL.
d3.json(queryUrl).then(function(data) 
{
    console.log(data);
});