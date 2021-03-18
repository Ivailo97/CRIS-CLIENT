import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DaisyConfigComponent} from './component/daisy-config/daisy-config.component';
import {NavbarComponent} from './component/navbar/navbar.component';
import {FooterComponent} from './component/footer/footer.component';
import {AppRoutingModule} from './app-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ItemListComponent} from './component/item-list/item-list.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';
import { LoginComponent } from './component/login/login.component';
import {MatCardModule} from '@angular/material/card';
import {AuthInterceptor} from './core/interceptor/authInterceptor';

@NgModule({
  declarations: [
    AppComponent,
    DaisyConfigComponent,
    NavbarComponent,
    FooterComponent,
    ItemListComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCardModule,
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
