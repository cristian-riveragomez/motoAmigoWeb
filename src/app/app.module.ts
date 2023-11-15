import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import  { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ClimaComponent } from './components/clima/clima.component';
import { EstablecimientosComponent } from './components/establecimientos/establecimientos.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { GoogleMapsModule } from '@angular/google-maps'
import { FormsModule } from '@angular/forms';
import { MarketPlaceComponent } from './components/market-place/market-place.component';
import { LoadingComponent } from './components/shared/loading/loading.component';
import { ProductoComponent } from './components/producto/producto.component';
import { MiCuentaComponent } from './components/mi-cuenta/mi-cuenta.component';
import { CrearRepuestoComponent } from './components/crear-repuesto/crear-repuesto.component';

//social login
import { SocialLoginModule, FacebookLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';

//Import routes
import { APP_ROUTES } from "./app.routes";

//Services
import { ConnectionsService } from "../app/services/connections.service";
import { LocationService } from "../app/services/location.service";
import { UsuarioAdminComponent } from './components/usuario-admin/usuario-admin.component';
import { CrearUsuarioComponent } from './components/crear-usuario/crear-usuario.component';
import { PopUpContactarComponent } from './components/pop-up-contactar/pop-up-contactar.component';
import { LoginComponent } from './components/login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    ClimaComponent,
    EstablecimientosComponent,
    NavbarComponent,
    HomeComponent,
    MarketPlaceComponent,
    LoadingComponent,
    ProductoComponent,
    MiCuentaComponent,
    CrearRepuestoComponent,
    UsuarioAdminComponent,
    CrearUsuarioComponent,
    PopUpContactarComponent,
    LoginComponent    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(APP_ROUTES, {useHash:true}),
    GoogleMapsModule,
    FormsModule,
    SocialLoginModule
  ],
  providers: [
     ConnectionsService,
     LocationService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [{
          id:FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider('704893378128301')
        }]
      } as SocialAuthServiceConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
