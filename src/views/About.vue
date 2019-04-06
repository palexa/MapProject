<template>
  <div id="map" class="map"></div>
</template>
<script>
  import {Map, View} from 'ol';
  import TileLayer from 'ol/layer/Tile';
  import VectorLayer from 'ol/layer/Vector';
  import XYZ from 'ol/source/XYZ';
  import TileWMS from 'ol/source/TileWMS'
  import GeoJSON from 'ol/format/GeoJSON';
  import VectorSource from 'ol/source/Vector.js';
  import Projection from 'ol/proj/Projection'

  export default {
    name: 'about',
    props: {
      msg: String,
    },
    mounted: function () {
      const map = new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new XYZ({
              url: `https://{1-4}.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/png?app_id=bC3EwJd5PpBZQksByia9&app_code=ZgXJboW6NT-PllF8etor9g`
            })
          }),
          // new TileLayer ({
          //   // extent: [479792.580417208,5919986.873842877,538430.5024032703,5953276.110803715],
          //   source: new TileWMS(
          //     ({
          //       url: 'http://192.168.100.4:8080/geoserver/main/wms',
          //       params: {
          //         'LAYERS': 'main:Kvartal_WGS84N35',
          //         'TILED': true,
          //       },
          //       title: 'SPA'
          //     })
          //   ),
          // }),
          // new VectorLayer({
          //   source: new VectorSource({
          //     url: 'http://192.168.100.4:8080/geoserver/main/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=main:Kvartal_WGS84N35&maxFeatures=10000&outputFormat=application%2Fjson',
          //     format: new GeoJSON(),
          //     projection : 'EPSG:3856'
          //   })
          // }),
          // new TileLayer ({
          //   // extent: [479792.580417208,5919986.873842877,538430.5024032703,5953276.110803715],
          //   source: new TileWMS(
          //     ({
          //       url: 'http://192.168.100.4:8080/geoserver/main/wms',
          //       params: {
          //         'LAYERS': 'main:Vydel_WGS84N35',
          //         'TILED': true,
          //       },
          //       title: 'SPA'
          //     })
          //   ),
          // }),
          // new TileLayer ({
          //   source: new TileWMS(
          //           ({
          //             url: 'http://192.168.100.4:8080/geoserver/main/wms',
          //             params: {
          //               'LAYERS': 'main:Gidrografija_WGS84N35',
          //               'TILED': true,
          //             },
          //             title: 'SPA'
          //           })
          //   ),
          // }),
          // new TileLayer ({
          //   source: new TileWMS(
          //           ({
          //             url: 'http://192.168.100.4:8080/geoserver/main/wms',
          //             params: {
          //               'LAYERS': 'main:Line_WGS84N35',
          //               'TILED': true,
          //             },
          //             title: 'SPA'
          //           })
          //   ),
          // }),
          new VectorLayer({
            source: new VectorSource({
              format: new GeoJSON(),
              url: 'http://localhost:8080/geoserver/main/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=main:Kvartal_WGS84N35&srsName=EPSG:3857&maxFeatures=1000&outputFormat=application%2Fjson',
            })
          })
        ],
        view: new View({
          // projection:
          center: [3016281,7089075],
          minZoom:11,
          zoom: 12
        })
      });
      // map.addLayer(vector);
    }
  };
</script>
<style scoped>
  #map {
    position: absolute;
    top: 7vh;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
