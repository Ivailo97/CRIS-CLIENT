import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DaisyConfigComponent} from './component/daisy-config/daisy-config.component';
import {ItemListComponent} from './component/item-list/item-list.component';
import {LoginComponent} from './component/login/login.component';
import {AnonymGuard} from './core/guards/anonym.guard';
import {AuthGuard} from './core/guards/auth.guard';

const routes: Routes = [
  {path: 'config', component: DaisyConfigComponent, canActivate: [AuthGuard]},
  {path: 'items', component: ItemListComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent, canActivate: [AnonymGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
