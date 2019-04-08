<template>
    <div>
        <div id="map"></div>
    </div>
</template>

<script>
    import Map from 'ol/Map.js';
    import View from 'ol/View.js';
    import {click, pointerMove, altKeyOnly} from 'ol/events/condition.js';
    import GeoJSON from 'ol/format/GeoJSON.js';
    import Select from 'ol/interaction/Select.js';
    import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
    import OSM from 'ol/source/OSM.js';
    import VectorSource from 'ol/source/Vector.js';

    export default {
        name: "example",
        mounted() {

                var raster = new TileLayer({
                    source: new OSM()
                });

                var vector2 = new VectorLayer({
                    source: new VectorSource({
                        format: new GeoJSON(),
                        url: 'http://192.168.100.4:8080/geoserver/main/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=main:Kvartal_WGS84N35&srsName=EPSG:3857&maxFeatures=1000&outputFormat=application%2Fjson',
                    })
                });


                var map = new Map({
                    layers: [
                        raster,
                        vector2
                    ],
                    target: 'map',
                    view: new View({
                        center: [3016281,7089075],
                        zoom: 12
                    })
                });

            var vector = new VectorLayer({
                source: new VectorSource({
                    url: 'http://192.168.100.4:8080/geoserver/main/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=main:Kvartal_WGS84N35&CRS=EPSG%3A32635&maxFeatures=1000&outputFormat=application%2Fjson',
                    format: new GeoJSON(),
                    projection: map.getView().getProjection(),
                })
            });

            // map.addLayer(vectorLayer);
            // map.addLayer(vector);


            var select = null; // ref to currently selected interaction

                // select interaction working on "singleclick"
                var selectSingleClick = new Select();

                // select interaction working on "click"
                var selectClick = new Select({
                    condition: click
                });

                // select interaction working on "pointermove"
                var selectPointerMove = new Select({
                    condition: pointerMove
                });

                var selectAltClick = new Select({
                    condition: function(mapBrowserEvent) {
                        return click(mapBrowserEvent) && altKeyOnly(mapBrowserEvent);
                    }
                });

                // var selectElement = document.getElementById('type');

                // var changeInteraction = function() {
                //     if (select !== null) {
                //         map.removeInteraction(select);
                    // }
                    // var value = selectElement.value;
                    // if (value == 'singleclick') {
                        select = selectSingleClick;
                    // } else if (value == 'click') {
                    //     select = selectClick;
                    // } else if (value == 'pointermove') {
                    //     select = selectPointerMove;
                    // } else if (value == 'altclick') {
                    //     select = selectAltClick;
                    // } else {
                    //     select = null;
                    // }
                    // if (select !== null) {
                        map.addInteraction(select);
                        select.on('select', function(e) {
                          console.log(e)
                            // document.getElementById('status').innerHTML = '&nbsp;' +
                            //     e.target.getFeatures().getLength() +
                            //     ' selected features (last operation selected ' + e.selected.length +
                            //     ' and deselected ' + e.deselected.length + ' features)';
                        });
                    // }
                // };
                // selectElement.onchange = changeInteraction;
                // changeInteraction();

        }
    }
</script>

<style scoped>

</style>
