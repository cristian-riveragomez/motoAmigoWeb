import { RouterModule, Routes} from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { ClimaComponent } from "./components/clima/clima.component";
import { EstablecimientosComponent } from "./components/establecimientos/establecimientos.component";
import { MarketPlaceComponent } from "./components/market-place/market-place.component";
import { ProductoComponent } from "./components/producto/producto.component";
import { MiCuentaComponent } from "./components/mi-cuenta/mi-cuenta.component";
import { CrearRepuestoComponent } from "./components/crear-repuesto/crear-repuesto.component";
import { UsuarioAdminComponent } from "./components/usuario-admin/usuario-admin.component";
import { CrearUsuarioComponent } from "./components/crear-usuario/crear-usuario.component";
import { LoginComponent } from "./components/login/login.component";
import { AuthGuard } from './guards/auth.guard';


export const APP_ROUTES: Routes = [
    {path: 'home', component: HomeComponent, canActivate:[AuthGuard]},
    {path: 'clima', component: ClimaComponent, canActivate:[AuthGuard]},
    {path: 'establecimientos', component: EstablecimientosComponent, canActivate:[AuthGuard]},
    {path: 'marketPlace', component: MarketPlaceComponent, canActivate:[AuthGuard]},
    {path: 'producto/:id/:tipo', component: ProductoComponent, canActivate:[AuthGuard]},
    {path: 'miCuenta', component: MiCuentaComponent, canActivate:[AuthGuard]},
    {path: 'usuarioAdmin', component: UsuarioAdminComponent, canActivate:[AuthGuard]},
    {path: 'crearRepuesto/:id', component: CrearRepuestoComponent, canActivate:[AuthGuard]},
    {path: 'crearUsuario', component: CrearUsuarioComponent},
    {path: 'login', component: LoginComponent},
    {path: '', pathMatch: 'full', redirectTo:'home' },
    {path: '**', pathMatch: 'full', redirectTo:'home'}    
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);