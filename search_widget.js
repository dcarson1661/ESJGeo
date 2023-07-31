

require([
    "esri/widgets/Search",

    "esri/layers/FeatureLayer"
], function(
    Search,

    FeatureLayer
) {

    var myGeocoder = {
        url: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
        name: "World Geocoder",
        placeholder: "search for an address..."
    };

    var search = new Search({
        container: "searchDiv",
        maxSuggestions: 1,
        arcgisGeocoder: myGeocoder

    });

    const featureLayer = new FeatureLayer({
        url: "https://services9.arcgis.com/jyf59MjuiWfY46oy/arcgis/rest/services/ESJGeo_gdb/FeatureServer/0"
    });

    baseURL = "https://esjgeo.com/map.html?"

    search.on("search-complete", function(event) {
        var searchResult = event.results[0].results[0].feature;
        //console.log(searchResult)
        queryFeaturelayer(searchResult.geometry)

    })

    function queryFeaturelayer(geometry) {
        const Query = {
            spatialRelationship: "intersects", // Relationship operation to apply
            geometry: geometry, // The sketch feature geometry
            outFields: ["NAMELSAD", "StateAbbr", "FIPS"], // Attributes to return
            returnGeometry: true
        };

        featureLayer.queryFeatures(Query)
            .then((results) => {
                console.log(results.features.length)
                if (results.features.length > 0) {
                    var GEOID = results.features[0].attributes.FIPS
                    var NAME = results.features[0].attributes.NAMELSAD.replace(' town', '').replace(' city', '').replace(' City', '')
                    var STATE = results.features[0].attributes.StateAbbr
                    window.open(baseURL + 'GEOID=' + GEOID + '&place=' + NAME + ', ' + STATE,"_self");
                } else {
                    //window.open("search.html");
                    document.getElementById("alert").open = true
                }

            }).catch((error) => {
                console.log(error);
            });
    }
});

