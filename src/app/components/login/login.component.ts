import { Component, OnInit } from '@angular/core';
import { ConnectionsService } from '../../services/connections.service';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SocialAuthService, FacebookLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { UsuarioLogin } from '../../models/dtoModelos.component';
import { AppComponent } from '../../app.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit  {
  
  usuarioLogin!: UsuarioLogin;
  inputType: string = 'password';

  constructor(private connectionService: ConnectionsService, private router: Router, private autService: AuthService,
              private authService: SocialAuthService, private appComponent: AppComponent)
  {
    this.usuarioLogin =  new UsuarioLogin();    
  }  

  togglePasswordVisibility() {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }
  
  ngOnInit(): void {   
    this.appComponent.mostrarNavbar = false;
  }

  login(form: NgForm)
  {  
    if(form.invalid)
    {
      return;
    }

    let peticion!: Observable<any>;  
        
    peticion = this.connectionService.loginUsuario(this.usuarioLogin);
    
    peticion.subscribe( (response: any) => {    

      this.autService.guardarIdEnLocalStorage(response.id);
      this.autService.validarSiEsAdmin(response);

      Swal.close()
      this.router.navigateByUrl('/home');      
      
    },
    (error:any) =>{

      Swal.fire({
        icon:'error',
        title:'Error al autenticar',
        text: error.error
      });
    });

  }
  
  signInWithFacebook(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((user: SocialUser) => {

      })
      .catch((error: any) => {

        console.log(error.error);
      });
  }

}
