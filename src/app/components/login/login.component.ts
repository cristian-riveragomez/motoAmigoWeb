import { Component } from '@angular/core';
import { ConnectionsService, UsuarioLogin } from '../../services/connections.service';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SocialAuthService, FacebookLoginProvider, SocialUser } from '@abacritt/angularx-social-login';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent  {
  
  usuarioLogin!: UsuarioLogin;
  inputType: string = 'password';

  constructor(private connectionService: ConnectionsService, private router: Router, private autService: AuthService,
              private authService: SocialAuthService)
  {
    this.usuarioLogin =  new UsuarioLogin();    
  }  

  togglePasswordVisibility() {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
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
        text: error.message
      });
    });

  }
  
  signInWithFacebook(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((user: SocialUser) => {

        // Aquí puedes manejar la respuesta exitosa del inicio de sesión de Facebook
        //this.router.navigateByUrl('/home');      
        
      })
      .catch((error: any) => {
        // Aquí puedes manejar el error del inicio de sesión de Facebook
        console.log(error.error);
      });
  }

}
