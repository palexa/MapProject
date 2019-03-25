import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapRoutingModule} from './map-routing.module';
import {MapComponent} from './pages/map/map.component';
import {MatToolbarModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MapRoutingModule,
    MatToolbarModule
  ],
  declarations: [MapComponent]
})

export class MapModule {

}
