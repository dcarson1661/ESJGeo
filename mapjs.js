require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/LayerList",
    "esri/widgets/Search",
    "esri/widgets/Home",
    "esri/widgets/BasemapGallery",
    "esri/core/watchUtils",
    "esri/popup/content/TextContent",
    "esri/smartMapping/renderers/color",
    "esri/smartMapping/statistics/histogram",
    "esri/widgets/smartMapping/ColorSlider",
    "esri/smartMapping/symbology/color",
    "esri/Viewpoint",
    "esri/smartMapping/statistics/summaryStatistics"
], (
    Map,
    MapView,
    FeatureLayer,
    LayerList,
    Search,
    Home,
    BasemapGallery,
    watchUtils,
    TextContent,
    colorRendererCreator,
    histogram,
    ColorSlider,
    colorSchemes,
    Viewpoint,
    summaryStatistics



) => {


    function mobileCheck() {
        let check = false;
        (function(a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };



    var bar2 = document.querySelector("#bar2");
    bar2.value = 1


    var bar3 = document.querySelector("#bar3");
    bar3.value = 1


    var bar4 = document.querySelector("#bar4");
    bar4.value = 1


    var bar5 = document.querySelector("#bar5");
    bar5.value = 1



    // Create the Map 
    var map = new Map({
        basemap: "streets-navigation-vector"
    })


    // Create the MapView
    var view = new MapView({
        container: "viewDiv",
        map: map,
        zoom: 12
    });

    //Search Widget
    const searchWidget = new Search({
        view: view
    });
    view.ui.add(searchWidget, {
        position: "top-left",
        index: 0
    });
    //

    // Home button
    var homeBtn = new Home({
        view: view
    });
    view.ui.add(homeBtn, "top-left");
    //

    //basmap gallery
    var basemapGallery = new BasemapGallery({
        view: view,
        //container: document.createElement("div")
        container: document.getElementById("basemapPanel")
    });



    //this var is casted again in generateRenderer()
    var indexExpression = "round(Sum([$feature.LOWINCPCT_ZScore*" + bar2.value + ", $feature.MINORPCT_ZScore *" + bar3.value + ", $feature.UNEMPPCT_ZScore*" + bar4.value + ", $feature.LINGISOPCT_ZScore*" + bar5.value + "]),2)"



    let contentText = new TextContent();
    contentText.text = `
  Adjusted Index: ${indexExpression}<br>
  Percent Minority Population: $feature.MINORPCT
  `
    "Adjusted Index: {" + indexExpression + "}<br>";


    //Popup template


    //don't allow popup to collapse
    view.popup.collapseEnabled = false;

    var labelClass = {
        // autocasts as new LabelClass()
        symbol: {
            type: "text",
            haloColor: "white",
            haloSize: .8,
            font: {
                family: "Playfair Display",
                size: 12,
                weight: "bold",

            }
        },
        labelExpressionInfo: {
            expression: indexExpression

        }
    };


    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const GEOID = urlParams.get('GEOID')
    const place = urlParams.get('place')

    document.getElementById("title").description = place

    let featureLayer = new FeatureLayer({
        url: "https://services9.arcgis.com/jyf59MjuiWfY46oy/arcgis/rest/services/ESJGeo_gdb/FeatureServer/1",
        outFields: ["*"],
        title: "Adjusted Index Layer",
        // popupTemplate: popupTemplate,
        //renderer: renderer,
        labelingInfo: [labelClass],
        opacity: 0,
        definitionExpression: "PlaceID = '" + GEOID + "'"
    });
    map.add(featureLayer);

    let placeLayer = new FeatureLayer({
        url: "https://services9.arcgis.com/jyf59MjuiWfY46oy/arcgis/rest/services/ESJGeo_gdb/FeatureServer/0",
        outFields: ["*"],
        title: place,
        definitionExpression: "FIPS = '" + GEOID + "'",
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-fill",
                color: [255, 128, 0, 0],
                outline: {
                    width: 1.5,
                    color: "black",
                    style: "solid"
                }
            }
        }
    });
    map.add(placeLayer);

    placeLayer.when(() => {
            return placeLayer.queryExtent();
            //view.goTo(placeLayer)
        })
        .then((response) => {
            view.goTo(response.extent);

            homeBtn.viewpoint = new Viewpoint({
                targetGeometry: response.extent
            });

        });

    watchUtils.whenFalseOnce(view, "updating", generateRenderer);

    function generateRenderer() {
        indexExpression = "round(Sum([$feature.LOWINCPCT_ZScore*" + bar2.value + ", $feature.MINORPCT_ZScore *" + bar3.value + ", $feature.UNEMPPCT_ZScore*" + bar4.value + ", $feature.LINGISOPCT_ZScore*" + bar5.value + "]),2)"

        summaryStatistics({
            layer: featureLayer,
            valueExpression: indexExpression,
            view: view
        }).then(function(stats) {
            var stdDev = stats.stddev
            stdDev = stdDev.toFixed(1)
            console.log(stats.stddev);

            var content = `
				The population in this area is <b>{expression/stdDevMSG}</b> relative to other areas in ${place}</b><br><br>
				Percent Low Income: {expression/LOWINCPCT}<br>
				Percent Minority Population: {expression/MINORPCT}<br>
				Percent Unemployed: {expression/UNEMPPCT}<br>
				Percent Linguistically Isolated: {expression/LINGISOPCT}<br>
				<div id=histogramPopupDiv></div>
			`
            var stdDevMSGExpression = `
				if(${indexExpression}>${stdDev}){
					return "statistically significantly MORE vulnerable"
				}else if(${indexExpression}<(${stdDev}*-1)){
					return "statistically significantly LESS vulnerable"
				}else{
					return "similarly vulnerable"
				}
		    `

            var popupTemplate = {
                title: "Adjusted Index: {expression/index}",
                content: content,
                expressionInfos: [{
                        name: "index",
                        expression: indexExpression
                    },
                    {
                        name: "LOWINCPCT",
                        expression: 'ROUND($feature.LOWINCPCT*100,1)+"%"'
                    },
                    {
                        name: "MINORPCT",
                        expression: 'ROUND($feature.MINORPCT*100,1)+"%"'
                    },
                    {
                        name: "UNEMPPCT",
                        expression: 'ROUND($feature.UNEMPPCT*100,1)+"%"'
                    },
                    {
                        name: "LINGISOPCT",
                        expression: 'ROUND($feature.LINGISOPCT*100,1)+"%"'
                    },
                    {
                        name: "stdDevMSG",
                        expression: stdDevMSGExpression
                    }
                ]
            };

            featureLayer.popupTemplate = popupTemplate

        })

        const colorScheme = colorSchemes.getSchemeByName({
            basemap: map.basemap,
            geometryType: featureLayer.geometryType,
            theme: "above-and-below",
            name: "Blue and Orange 5"
        });

        const colorParams = {
            layer: featureLayer,
            valueExpression: indexExpression,
            view: view,
            outlineOptimizationEnabled: true,
            colorScheme: colorScheme
        };

        let rendererResult;

        colorRendererCreator
            .createContinuousRenderer(colorParams)
            .then((response) => {
                rendererResult = response;
                featureLayer.renderer = rendererResult.renderer;
                featureLayer.opacity = .8

                return histogram({
                    layer: featureLayer,
                    valueExpression: colorParams.valueExpression,
                    view: view,
                    numBins: 70
                });
            }).then((histogramResult) => {
                console.log(histogramResult)
                document.getElementById("slider").innerHTML = ''

                var colorSlider = ColorSlider.fromRendererResult(
                    rendererResult,
                    histogramResult
                );

                colorSlider.container = "slider";
                colorSlider.primaryHandleEnabled = true;
                colorSlider.labelFormatFunction = (value, type) => {
                    return value.toFixed(1);
                };
                colorSlider.viewModel.precision = 1;

                enableBars()

                // When the user slides the handle(s), update the renderer
                // with the updated color visual variable object
                function changeEventHandler() {
                    var renderer = featureLayer.renderer.clone();
                    var colorVariable = renderer.visualVariables[0].clone();
                    var outlineVariable = renderer.visualVariables[1];
                    colorVariable.stops = colorSlider.stops;
                    renderer.visualVariables = [colorVariable, outlineVariable];
                    featureLayer.renderer = renderer;
                }

                colorSlider.on(
                    ["thumb-change", "thumb-drag", "min-change", "max-change"],
                    changeEventHandler
                );

            })
            
    }

    function updateLabels() {
        featureLayer.labelingInfo[0].labelExpressionInfo.expression = indexExpression

    }

    //layerList with Legend & Actions //
    const layerList = new LayerList({
        view: view,
        index: 1,
        container: document.getElementById("layerListDiv"),
        listItemCreatedFunction: function(event) {
            const item = event.item;

            //Add group layer actions

            item.actionsSections = [

                [{
                        title: "Increase opacity",
                        className: "esri-icon-up",
                        id: "increase-opacity"
                    },
                    {
                        title: "Decrease opacity",
                        className: "esri-icon-down",
                        id: "decrease-opacity"
                    }
                ]
            ];

            //Add Legend to Layer List
            if (item.layer.type != "group") {
                item.panel = {
                    content: "legend",
                    open: true
                };
            }
        }
    });

    //LayerList Actions Function
    layerList.on("trigger-action", function(event) {

        var actionLayers = event.item.layer.layers
        var actionLayer = event.item.layer

        var id = event.action.id;

        if (id === "increase-opacity") {

            if (actionLayer.opacity < 1) {
                actionLayer.opacity += 0.10;
            }

        } else if (id === "decrease-opacity") {
            if (actionLayer.opacity > 0) {
                actionLayer.opacity -= 0.10;
            }

        } else if (id === "toggle-labels") {

            if (actionLayers.items[0].labelsVisible === false) {

                actionLayers.forEach(element => {
                    element.labelsVisible = true
                });
            } else {
                actionLayers.forEach(element => {
                    element.labelsVisible = false
                });
            }

        }
    });


    //side panel controls
    const basemapPanel = document.getElementById("basemapPanel");
    const basemapShellPanel = document.getElementById("basemapShellPanel");
    const basemapAction = document.getElementById("basemapAction");

    const indexPanel = document.getElementById("indexPanel");
    const indexShellPanel = document.getElementById("indexShellPanel");
    const indexAction = document.getElementById("indexAction");

    const layersPanel = document.getElementById("layersPanel");
    const layersShellPanel = document.getElementById("layersShellPanel");
    const layersAction = document.getElementById("layersAction");

    const weightsPanel = document.getElementById("weightsPanel");
    const weightsShellPanel = document.getElementById("weightsShellPanel");
    const weightsAction = document.getElementById("weightsAction");

    function closeShellPanels() {
        basemapShellPanel.collapsed = "true"
        indexShellPanel.collapsed = "true"
        layersShellPanel.collapsed = "true"
        weightsShellPanel.collapsed = "true"
        basemapAction.active = "false"
        indexAction.active = "false"
        layersAction.active = "false"
        weightsAction.active = "false"
    }

    basemapAction.addEventListener("click", function() {
        if (basemapShellPanel.collapsed) {
            closeShellPanels()
            basemapShellPanel.collapsed = "false"
            basemapAction.active = "true"
        } else {
            closeShellPanels()
        }
    })

    indexAction.addEventListener("click", function() {
        if (indexShellPanel.collapsed) {
            closeShellPanels()
            indexShellPanel.collapsed = "false"
            indexAction.active = "true"
        } else {
            closeShellPanels()
        }
    })

    layersAction.addEventListener("click", function() {
        if (layersShellPanel.collapsed) {
            closeShellPanels()
            layersShellPanel.collapsed = "false"
            layersAction.active = "true"
        } else {
            closeShellPanels()
        }
    })

    weightsAction.addEventListener("click", function() {
        if (weightsShellPanel.collapsed) {
            closeShellPanels()
            weightsShellPanel.collapsed = "false"
            weightsAction.active = "true"
        } else {
            closeShellPanels()
        }
    })

    basemapPanel.addEventListener("calcitePanelClose", function(event) {
        closeShellPanels()
        basemapPanel.closed = "false"
    });

    indexPanel.addEventListener("calcitePanelClose", function(event) {
        closeShellPanels()
        indexPanel.closed = "false"
    });

    layersPanel.addEventListener("calcitePanelClose", function(event) {
        closeShellPanels()
        layersPanel.closed = "false"
    });

    weightsPanel.addEventListener("calcitePanelClose", function(event) {
        closeShellPanels()
        weightsPanel.closed = "false"
    });


    function disableBars() {
        document.getElementById("bar2").disabled = true;
        document.getElementById("bar3").disabled = true;
        document.getElementById("bar4").disabled = true;
        document.getElementById("bar5").disabled = true;
        document.getElementById("resetButton").disabled = true;
    }

    function enableBars() {
        document.getElementById("bar2").disabled = false;
        document.getElementById("bar3").disabled = false;
        document.getElementById("bar4").disabled = false;
        document.getElementById("bar5").disabled = false;
        document.getElementById("resetButton").disabled = false;
    }


    if (mobileCheck() == true) {
        const actionBar = document.getElementById("actionBar")
        actionBar.expanded = !actionBar.expanded
        closeShellPanels()
        weightsShellPanel.widthScale = "l"
        indexShellPanel.widthScale = "l"
        basemapShellPanel.widthScale = "l"
        layersShellPanel.widthScale = "l"

    }

    //Event listener for Sliders. One for input to update the label and one click to update the map
    bar2.addEventListener("calciteSliderChange", function() {
        disableBars()
        generateRenderer()
        updateLabels()
    })


    bar3.addEventListener("calciteSliderChange", function() {
        disableBars()
        generateRenderer()
        updateLabels()
    })


    bar4.addEventListener("calciteSliderChange", function() {
        disableBars()
        generateRenderer()
        updateLabels()
    })


    bar5.addEventListener("calciteSliderChange", function() {
        disableBars()
        generateRenderer()
        updateLabels()
    })


    //resetButton event listener to reset the weights and map back to equal weights
    var resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click", function() {

        document.querySelector("#bar2").value = 1
        document.querySelector("#bar3").value = 1
        document.querySelector("#bar4").value = 1
        document.querySelector("#bar5").value = 1

        disableBars()
        generateRenderer()
        updateLabels()
    })

});