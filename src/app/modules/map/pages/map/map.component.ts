import { Component, OnInit } from '@angular/core';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS'



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map: Map;
  constructor() { }

  ngOnInit() {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            // url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            url: `https://{1-4}.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/png?app_id=bC3EwJd5PpBZQksByia9&app_code=ZgXJboW6NT-PllF8etor9g`
            // url: ' https://mt1.google.com/vt/lyrs=s&x=%7Bx%7D&y=%7By%7D&z=%7Bz%7D'
          })
        }),
        // new TileLayer ({
        //   // extent: [479792.580417208,5919986.873842877,538430.5024032703,5953276.110803715],
        //   source: new TileWMS(
        //     ({
        //       url: 'http://127.0.0.1:8080/geoserver/main/wms',
        //       params: {
        //         'LAYERS': 'main:Kvartal_WGS84N35',
        //         'TILED': true,
        //       },
        //       title: 'SPA'
        //     })
        //   ),
        // }),
        // new TileLayer ({
        //   // extent: [479792.580417208,5919986.873842877,538430.5024032703,5953276.110803715],
        //   source: new TileWMS(
        //     ({
        //       url: 'http://127.0.0.1:8080/geoserver/main/wms',
        //       params: {
        //         'LAYERS': 'main:Vydel_WGS84N35',
        //         'TILED': true,
        //       },
        //       title: 'SPA'
        //     })
        //   ),
        // }),
    new TileLayer ({
      // extent: [479792.580417208,5919986.873842877,538430.5024032703,5953276.110803715],
      source: new TileWMS(
        ({
          url: 'http://127.0.0.1:8080/geoserver/main/wms',
          params: {
            'LAYERS': 'main:Gidrografija_WGS84N35',
            'TILED': true,
          },
          title: 'SPA'
        })
      ),
    }),
      new TileLayer ({
        // extent: [479792.580417208,5919986.873842877,538430.5024032703,5953276.110803715],
        source: new TileWMS(
          ({
            url: 'http://127.0.0.1:8080/geoserver/main/wms',
            params: {
              'LAYERS': 'main:Line_WGS84N35',
              'TILED': true,
            },
            title: 'SPA'
          })
        ),
      })
      ],
      view: new View({
        // projection: 'EPSG:32635',
        center: [3016281,7089075],
        zoom: 12
      })
    });
  }

}
