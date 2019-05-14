
const toLower = text => {
  return text.toString().toLowerCase()
};

const searchByName = (items, term) => {
  if (term) {
    return items.filter(item => toLower(item.name).includes(toLower(term)))
  }

  return items
};
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
import OSM from 'ol/source/OSM'
import axios from 'axios';

let scaleLineControl = new ScaleLine();
scaleLineControl.setUnits('metric');
let fullScreenControl = new FullScreen({});


const singleClick = new Select();
let source = new VectorSource();
let modify = new Modify({source: source});

let vector = new VectorLayer({
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
  data: function () {
    return {
      selected: [],
      search: null,
      searched: [],
      users: [
        {
          id: 1,
          name: "Shawna Dubbin",
          email: "sdubbin0@geocities.com",
          gender: "Male",
          title: "Assistant Media Planner"
        },
        {
          id: 2,
          name: "Odette Demageard",
          email: "odemageard1@spotify.com",
          gender: "Female",
          title: "Account Coordinator"
        },
        {
          id: 3,
          name: "Vera Taleworth",
          email: "vtaleworth2@google.ca",
          gender: "Male",
          title: "Community Outreach Specialist"
        },
        {
          id: 4,
          name: "Lonnie Izkovitz",
          email: "lizkovitz3@youtu.be",
          gender: "Female",
          title: "Operator"
        },
        {
          id: 5,
          name: "Thatcher Stave",
          email: "tstave4@reference.com",
          gender: "Male",
          title: "Software Test Engineer III"
        }
      ],
      pointsAdding: false,
      showDialog: false,
      layersIds: [],
      layers: [],
      layerNames: [],
      layerStyles: [],
      url: 'http://172.16.193.174:4201',
      noConn: false,
      loading: false
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
  created: function () {
    this.searched = this.users
  },
  methods: {
    onSelect (items) {
      this.selected = items
    },
    newUser () {
      window.alert('Noop')
    },
    searchOnTable () {
      this.searched = searchByName(this.users, this.search)
    },
    retry: function () {
      this.initLayers()
    },
    getStylesForLayer: function (layerName) {
      axios.get(`${this.url}/geoserver/rest/layers/${layerName}.json`)
        .then(res => {
          console.log(res.data.layer.styles);
          // this.layerStyles.push({name: layerName, data: {...}});
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
            this.layerNames.push(layer.name);
            // console.log(layer.name);
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
            let style = '';
            if(layer.name.indexOf('vydel') + 1) {
              style = 'examplemy';
            } else {
              style = 'New';
            }
            this.layers.push(
              new TileLayer({
                source: new TileWMS(
                  ({
                    // url: 'http://192.168.43.243:8080/geoserver/main/wms',
                    url: `${this.url}/geoserver/cite/wms`,
                    params: {
                      'LAYERS': layer.name,
                      'TILED': true,
                      'STYLES': style
                    },
                    title: 'SPA'
                  })
                ),
              }),
            );
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
      singleClick.on('select', function (e) {
        console.log(e)
      });
    },
    addDrawInteraction: function () {
      if (this.layers.length) {
        this.layers[0].getSource().updateParams({
          'STYLES': 'grass'
        });
        console.log(this.layers[0].getSource().getParams());
      }
      this.map.addInteraction(this.draw);
      // this.map.addInteraction(this.snap);
    },
    removeDrawInteraction: function () {
      if (this.layers.length) {
        this.layers[0].getSource().updateParams({
          'STYLES': 'New'
        });
      }
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
