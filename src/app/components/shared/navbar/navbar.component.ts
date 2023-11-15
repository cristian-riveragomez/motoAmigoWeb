import { Component} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ConnectionsService } from '../../../services/connections.service';
import { Router, NavigationEnd  } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent  {
  
  esAdmin!: boolean;
  isAuthenticated!: boolean;
  isMenuOpen: boolean = false;

  constructor(private autService: AuthService, private router: Router, private connectionService: ConnectionsService)
  {        
    this.autService.isAuthenticated.subscribe((authenticated: boolean) => {
      this.isAuthenticated = authenticated;      
    });

    this.router.events.subscribe((event:any) => 
    {      
      if (event instanceof NavigationEnd) {
        if(event.url != '/login')
        {
          this.connectionService.getUsuarioPorId(this.autService.GetIdUsuarioLocalStorage()).subscribe((usuarioBd:any) => {
            this.esAdmin = usuarioBd.esAdmin
         });
        }         
      }      
    });   

    this.autService.esAdmin.subscribe((admin: boolean) => {
      this.esAdmin = admin;      
    });
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  salir()
  {
    this.autService.logout()
    this.router.navigateByUrl('/login')    
  }

}
