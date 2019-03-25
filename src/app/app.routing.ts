import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {LayoutComponent} from './components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'map',
        loadChildren: './modules/map/map.module#MapModule'
      }
    ]
  }
];

export const routing = RouterModule.forRoot(routes);

@NgModule({
  imports: [ RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
