import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConnectionsService } from '../../services/connections.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { Usuario } from '../../models/dtoModelos.component';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html'
})
export class CrearUsuarioComponent {

  cargando: boolean = false;
  usuario!: Usuario;

  constructor(private connectionService: ConnectionsService, private router: Router, private autService: AuthService)
  {
    this.usuario= new Usuario();
  }

  guardarUsuario(formularioValue: NgForm)
  {
    if (formularioValue.invalid) {
      Object.values(formularioValue.controls).forEach((controles: any) => {
        controles.markAsTouched();
      });

      return;
    }
    
    Swal.fire({
      title: 'Espere por favor',
      text: 'Procesando informacion',
      icon: 'info',
      allowOutsideClick: false
    })
    Swal.showLoading();

    let peticion!: Observable<any>;  

    const formImagen =  new FormData();
   
    this.usuario.esAdmin = false;

    formImagen.append('Nombre', this.usuario.nombre);
    formImagen.append('Apellido', this.usuario.apellido);               
    formImagen.append('NombreUsuario', this.usuario.nombreUsuario.toString());               
    formImagen.append('Contrasena', this.usuario.contrasena);                                         
    formImagen.append('Email', this.usuario.email);    
    formImagen.append('EsAdmin', this.usuario.esAdmin.toString() );                                               

    peticion = this.connectionService.postInsertarUsuario(formImagen);

    peticion.subscribe((response:any) =>{
      Swal.fire(
        {      
          title: 'Se genero correctamente',
          icon: 'success',
          showConfirmButton: false,
          timer:1500
        })
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1700);           
    },
    (error:any) =>{

      Swal.fire({
        icon:'error',
        title:'Error al crear el usuario',
        text: error.message
      });
    });
  }

}
