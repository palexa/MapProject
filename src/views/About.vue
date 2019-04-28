<template>
  <div>
    <md-speed-dial class="actions" md-direction="bottom">
      <md-speed-dial-target class="md-primary">
        <!--        <md-icon>my_location</md-icon>-->
        <md-icon class="md-morph-initial">edit</md-icon>
        <md-icon class="md-morph-final">close</md-icon>
      </md-speed-dial-target>

      <md-speed-dial-content>
        <md-button class="md-icon-button" v-on:click="changePointer">
          <md-icon v-show="pointsAdding">games</md-icon>
          <md-icon v-show="!pointsAdding">control_point</md-icon>
        </md-button>
        <md-button class="md-icon-button" @click="showDialog = true">
          <md-icon>filter_list</md-icon>
        </md-button>
      </md-speed-dial-content>
    </md-speed-dial>
    <div id="fullscreen" class="fullscreen">
      <div id="map" class="map"></div>
    </div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Фильтр</md-dialog-title>
      <md-dialog-content>
        <md-tabs md-dynamic-height>
          <md-tab md-label="Слои">
            <md-field>
              <label for="movies">Выберите слой</label>
              <md-select v-model="layersIds" name="movies" id="movies" multiple>
                <md-option v-for="(name, index) in layerNames" v-bind:value="index">{{name}}</md-option>
              </md-select>
            </md-field>
          </md-tab>
          <md-tab md-label="Справка">
          </md-tab>
          <md-tab md-label="Дополнительно">
          </md-tab>
        </md-tabs>

      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Отмена</md-button>
        <md-button class="md-primary" @click="filter">Применить</md-button>
      </md-dialog-actions>
    </md-dialog>
    <div id="popup" title="Welcome to OpenLayers"></div>
  </div>
</template>
<script>
  import {Map, View} from 'ol';
  import TileLayer from 'ol/layer/Tile';
  import VectorLayer from 'ol/layer/Vector';
  import XYZ from 'ol/source/XYZ';
  import GeoJSON from 'ol/format/GeoJSON';
  import VectorSource from 'ol/source/Vector.js';
  import Select from 'ol/interaction/Select';
  import TileWMS from 'ol/source/TileWMS'
  import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
  import {Draw, Modify, Snap} from 'ol/interaction';
  import {defaults as defaultControls, ScaleLine, FullScreen, OverviewMap} from 'ol/control';
  import Overlay from 'ol/Overlay';
  import {toStringHDMS} from 'ol/coordinate.js';
  import {fromLonLat, toLonLat} from 'ol/proj.js';
  import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo';
  import axios from 'axios';

  // let tetLayer = new TileLayer({
  //       source: new TileWMS(
  //         ({
  //           url: 'http://172.16.193.174:4201/geoserver/main/wms',
  //           // url: 'http://localhost:8080/geoserver/main/wms',
  //           params: {
  //             'LAYERS': 'main:Gidrografija_WGS84N35',
  //             'TILED': true,
  //           },
  //           title: 'SPA'
  //         })
  //       ),
  //     });

  let scaleLineControl = new ScaleLine();
  scaleLineControl.setUnits('metric');
  let fullScreenControl = new FullScreen({});


  const singleClick = new Select();
  var source = new VectorSource();
  var modify = new Modify({source: source});

  var vector = new VectorLayer({
    source: source,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 2
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33'
        })
      })
    })
  });


  export default {
    name: 'about',
    data: function () {
      return {
        pointsAdding: false,
        showDialog: false,
        layersIds: [],
        layers: [],
        layerNames: [],
        url: 'http://172.16.193.174:4201'
      }
    },
    date: {
      map: null,
      // layers: null,
      draw: null,
      snap: null,
    },
    props: {
      msg: String,
    },
    mounted: function () {
      this.initLayers();
      this.createMap();
      this.map.addInteraction(modify);
      this.draw = new Draw({
        source: source,
        type: 'Point'
      });
      this.snap = new Snap({source: source});
      this.map.removeInteraction(this.draw);
      // this.map.on('click', function(evt) {
      //   // var element = popup.getElement();
      //   let coordinate = evt.coordinate;
      //   let hdms = toStringHDMS(toLonLat(coordinate));
      //   console.log(coordinate)
      //   console.log(hdms)
      // });

    },
    created: function () {
    },
    methods: {
      initLayers: function () {
        axios
          .get(`${this.url}/geoserver/rest/layers.json`)
          .then(response => {
            const data = response.data;
            data.layers.layer.forEach(layer => {
              this.layerNames.push(layer.name);
              console.log(layer.name)
              // if(layer.name.indexOf('kvartal') + 1) {
              //   console.log('vector')
              //   this.layers.push(
              //     new VectorLayer({
              //       source: new VectorSource({
              //         format: new GeoJSON(),
              //         url: 'http://172.16.193.174:4201/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3Akvartal_wgs84n35&srsName=EPSG:3857&maxFeatures=500&outputFormat=application%2Fjson',
              //         // url: 'http://localhost:8080/geoserver/main/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=main:Kvartal_WGS84N35&srsName=EPSG:3857&maxFeatures=1000&outputFormat=application%2Fjson',
              //       })
              //     })
              //   );
              // } else {
                this.layers.push(
                  new TileLayer({
                    source: new TileWMS(
                      ({
                        // url: 'http://192.168.43.243:8080/geoserver/main/wms',
                        url: `${this.url}/geoserver/cite/wms`,
                        params: {
                          'LAYERS': layer.name,
                          'TILED': true,
                          'STYLES': 'LCH'
                        },
                        title: 'SPA'
                      })
                    ),
                  }),
                );
              // }
            });
          });
        // this.layers.push(
        //   new TileLayer({
        //     source: new TileWMS(
        //       ({
        //         url: 'http://192.168.43.243:8080/geoserver/main/wms',
        //         // url: 'http://localhost:8080/geoserver/main/wms',
        //         params: {
        //           'LAYERS': 'main:Vydel_WGS84N35',
        //           'TILED': true,
        //         },
        //         title: 'SPA'
        //       })
        //     ),
        //   }),
        // );
        // this.layers.push(
        //   new VectorLayer({
        //     source: new VectorSource({
        //       format: new GeoJSON(),
        //       url: 'http://172.16.193.174:4201/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=cite%3Akvartal_wgs84n35&srsName=EPSG:3857&maxFeatures=500&outputFormat=application%2Fjson',
        //       // url: 'http://localhost:8080/geoserver/main/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=main:Kvartal_WGS84N35&srsName=EPSG:3857&maxFeatures=1000&outputFormat=application%2Fjson',
        //     })
        //   }),
        // );
        // this.layers.push(
        //   new VectorLayer({
        //     source: new VectorSource({
        //       format: new GeoJSON(),
        //       url: 'http://192.168.43.243:8080/geoserver/main/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=main:Kvartal_WGS84N35&srsName=EPSG:3857&maxFeatures=1000&outputFormat=application%2Fjson',
        //       // url: 'http://localhost:8080/geoserver/main/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=main:Kvartal_WGS84N35&srsName=EPSG:3857&maxFeatures=1000&outputFormat=application%2Fjson',
        //     })
        //   }),
        // );
        // this.layers.push(
        //   new TileLayer({
        //     source: new TileWMS(
        //       ({
        //         url: 'http://192.168.43.243:8080/geoserver/main/wms',
        //         // url: 'http://localhost:8080/geoserver/main/wms',
        //         params: {
        //           'LAYERS': 'main:Kvartal_WGS84N35',
        //           'TILED': true,
        //         },
        //         title: 'SPA'
        //       })
        //     ),
        //   })
        // );
        // this.layers.push(
        //   new VectorLayer({
        //     source: new VectorSource({
        //       format: new GeoJSON(),
        //       url: 'http://192.168.43.243:8080/geoserver/main/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=main:Stacionary_43&srsName=EPSG:3857&maxFeatures=1000&outputFormat=application%2Fjson',
        //       // url: 'http://localhost:8080/geoserver/main/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=main:Stacionary_43&srsName=EPSG:3857&maxFeatures=1000&outputFormat=application%2Fjson',
        //     })
        //   }),
        // );
        //
        // this.layers.push(
        //   new TileLayer({
        //     source: new TileWMS(
        //       ({
        //         url: 'http://192.168.43.243:8080/geoserver/main/wms',
        //         // url: 'http://localhost:8080/geoserver/main/wms',
        //         params: {
        //           'LAYERS': 'main:Gidrografija_WGS84N35',
        //           'TILED': true,
        //         },
        //         title: 'SPA'
        //       })
        //     ),
        //   }),
        // );
        // this.layers.push(
        //   new TileLayer({
        //     source: new TileWMS(
        //       ({
        //         url: 'http://192.168.43.243:8080/geoserver/main/wms',
        //         // url: 'http://localhost:8080/geoserver/main/wms',
        //         params: {
        //           'LAYERS': 'main:Line_WGS84N35',
        //           'TILED': true,
        //         },
        //         title: 'SPA'
        //       })
        //     ),
        //   }),
        // );
      },
      createMap: function () {
        this.map = new Map({
          controls: defaultControls().extend([
            scaleLineControl,
            // fullScreenControl,
          ]),
          target: 'map',
          layers: [
            new TileLayer({
              source: new XYZ({
                url: `https://{1-4}.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/png?app_id=bC3EwJd5PpBZQksByia9&app_code=ZgXJboW6NT-PllF8etor9g`
              })
            }),
            vector
          ],
          view: new View({
            center: [3016281, 7089075],
            minZoom: 11,
            zoom: 12
          })
        });
        let popup = new Overlay({
          element: document.getElementById('popup')
        });
        this.map.addOverlay(popup);
        this.map.addInteraction(singleClick);
        singleClick.on('select', function (e) {
          console.log(e)
        });
      },
      addDrawInteraction: function () {
        this.layers[0].getSource().updateParams({
          'STYLES': 'grass'
        });
        console.log(this.layers[0].getSource().getParams());
        this.map.addInteraction(this.draw);
        // this.map.addInteraction(this.snap);
      },
      removeDrawInteraction: function () {
        this.layers[0].getSource().updateParams({
          'STYLES': 'LCH'
        });
        this.map.removeInteraction(this.draw);
        // this.map.removeInteraction(this.snap);
      },
      filter() {
        let allIds = this.layers.map(function (currentValue, index) {
          return `${index}`
        });
        allIds.forEach(id => {
          this.map.removeLayer(this.layers[id])
        });
        this.layersIds.forEach(id => {
          this.map.addLayer(this.layers[id]);
        });
        this.showDialog = false;
      },
      changePointer() {
        if (this.pointsAdding) {
          this.removeDrawInteraction();
        } else {
          this.addDrawInteraction();
        }
        this.pointsAdding = !this.pointsAdding;
      }
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

  .actions {
    position: absolute;
    top: 15vh;
    bottom: 0;
    right: 2vw;
  }

  .fullscreen:-moz-full-screen {
    height: 100vh;
  }

  .fullscreen:-webkit-full-screen {
    height: 100vh;
  }

  .fullscreen:-ms-fullscreen {
    height: 100vh;
  }

  .fullscreen:fullscreen {
    height: 100%;
  }

  .fullscreen {
    margin-bottom: 10px;
    width: 100%;
    height: 400px;
  }

  .ol-custom-overviewmap,
  .ol-custom-overviewmap.ol-uncollapsible {
    bottom: auto;
    left: auto;
    right: 0;
    top: 0;
  }

  .ol-custom-overviewmap:not(.ol-collapsed) {
    border: 1px solid black;
  }

  .ol-custom-overviewmap .ol-overviewmap-map {
    border: none;
    width: 300px;
  }

  .ol-custom-overviewmap .ol-overviewmap-box {
    border: 2px solid red;
  }

  .ol-custom-overviewmap:not(.ol-collapsed) button {
    bottom: auto;
    left: auto;
    right: 1px;
    top: 1px;
  }

  .ol-rotate {
    top: 170px;
    right: 0;
  }
</style>
