import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import XYZ from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import Select from 'ol/interaction/Select';
import TileWMS from 'ol/source/TileWMS'
import {Circle as CircleStyle, Fill, Stroke, Style, Icon} from 'ol/style';
import {Draw, Modify, Snap} from 'ol/interaction';
import {defaults as defaultControls, ScaleLine, FullScreen, OverviewMap} from 'ol/control';
import Overlay from 'ol/Overlay';
import {toStringHDMS} from 'ol/coordinate.js';
import {fromLonLat, toLonLat} from 'ol/proj.js';
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo';
import OSM from 'ol/source/OSM'
import axios from 'axios';
var json = require('../../assets/json/styles.json');

let scaleLineControl = new ScaleLine();
scaleLineControl.setUnits('metric');


const singleClick = new Select();
let source = new VectorSource();
let modify = new Modify({source: source});

let vector = new VectorLayer({
  source: source,
});
let aero = new TileLayer({
  source: new XYZ({
    url: `https://{1-4}.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/png?app_id=bC3EwJd5PpBZQksByia9&app_code=ZgXJboW6NT-PllF8etor9g`
  })
});
let osm = new TileLayer({
  source: new OSM()
});

export default {
  name: 'map',
  data: () => ({
      styles: json,
    array: [],
      picsArr: [],
      changingLayerId: null,
      selectedLayer: {styles:[]},
      selectedIds:[],
      selectedStyles: [],
      selected: [],
      search: null,
      searched: [],
      pointsAdding: false,
      showDialog: false,
      layersIds: [],
      layers: [],
      layerNames: [],
      layerStyles: [],
      url: 'http://nuolh.belstu.by:4201',
      noConn: false,
      loading: false,
      photosDialog: false
    }
  ),
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
    var swipe = document.getElementById('myRange');

    aero.on('precompose', function(event) {
      var ctx = event.context;
      var width = ctx.canvas.width * (swipe.value / 100);

      ctx.save();
      ctx.beginPath();
      ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
      ctx.clip();
    });

    aero.on('postcompose', function(event) {
      const ctx = event.context;
      ctx.restore();
    });

    swipe.addEventListener('input', () => {
      this.map.render();
    }, false);
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
  methods: {
    onSelect (items) {
      this.selected = items
    },
    retry: function () {
      this.initLayers()
    },
    addLayer: function (name) {
      if(name.indexOf('v_') + 1) {
        this.layers.push(
          new VectorLayer({
            source: new VectorSource({
              format: new GeoJSON(),
              url: `http://nuolh.belstu.by:4201/geoserver/cite/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${name}&srsName=EPSG:3857&outputFormat=application%2Fjson`,
              params: {},
              style: new Style({
                fill: new Fill({
                  color: [203, 194, 185, 1]
                }),
                stroke: new Stroke({
                  color: [177, 163, 148, 0.5],
                  width: 2,
                  lineCap: 'round'
                })
              })
            })
          })
        );
      } else {
        this.layers.push(
          new TileLayer({
            source: new TileWMS(
              ({
                url: `${this.url}/geoserver/cite/wms`,
                params: {
                  'LAYERS': name,
                  'TILED': true,
                  'STYLES': ''
                },
                title: 'SPA'
              })
            ),
          }),
        );
      }
    },
    getStylesForLayer: function (layerName) {
      let styles = [];
      axios.get(`${this.url}/geoserver/rest/layers/${layerName}.json`)
        .then(res => {
          this.addLayer(layerName);
          this.layerNames.push(layerName);
          styles.push(res.data.layer.defaultStyle.name);
          if (res.data.layer.styles) {
            res.data.layer.styles.style.forEach(style => {
              styles.push(style.name);
            })
          }
          this.selectedStyles.push({name: res.data.layer.defaultStyle.name});
          const haveStyles = (layerName.indexOf('v_') + 1)?false:true
          this.layerStyles.push({id:this.layerStyles.length ,name: layerName.split('_')[1], styles: [...styles], selectedStyle: res.data.layer.defaultStyle.name,haveStyles: haveStyles});
        })
        .catch(() => {})
    },
    initLayers: function () {
      this.layerNames = [];
      this.layers = [];
      this.loading = true;
      this.noConn = false;
      axios
        .get(`${this.url}/geoserver/rest/layers.json`)
        .then(response => {
          const data = response.data;
          data.layers.layer.forEach(layer => {
            this.getStylesForLayer(layer.name)
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

            // this.searched = this.layers
            // }
          });
          this.loading = false;
        }).catch(() => {
          this.loading = false;
          console.info('conn with geoserver lost');
          this.noConn = true;
        }
      )
      console.log(this.layerNames)
    },
    selectStyle: function (layerId) {
      console.log(layerId)
      this.changingLayerId = layerId;
      this.selectedLayer = this.layerStyles[layerId];
      this.showDialog=true;
    },
    changeStyle: function () {
      if(this.layers[this.changingLayerId].getSource().updateParams) {
        this.layers[this.changingLayerId].getSource().updateParams({
          'STYLES': this.layerStyles[this.changingLayerId].selectedStyle
        });
      }
      this.showDialog = false;
    },
    createMap: function () {
      this.map = new Map({
        controls: defaultControls().extend([
          scaleLineControl,
          // fullScreenControl,
        ]),
        target: 'map',
        layers: [
          osm,
          aero,
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
      singleClick.on('select',  (e) => {
        console.log(e.selected[0].get('name'));
        let id = parseInt(e.selected[0].get('name'),10);
        console.log(json)

        axios.get(`http://nuolh.belstu.by:3000/static/${id}`)
          .then(res => {
            const dom = res.data;
            const arr = dom.split('\n');
            let arr2 = [];
            for(let i =1;i<arr.length-2;i++) {
              arr2.push(`http://nuolh.belstu.by:3000/static/${id}/` + arr[i].split('\"')[1]);
            }
            this.picsArr = arr2;
            console.log('dialog!');
            this.photosDialog = true;
          })
          .catch(() => {})
      });
    },
    addDrawInteraction: function () {
      this.map.addInteraction(this.draw);
      // this.map.addInteraction(this.snap);
    },
    removeDrawInteraction: function () {
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
      this.selectedIds.forEach((id)=>{
        this.map.addLayer(this.layers[id]);
        console.log(this.layers[id].getSource())
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
