import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConnectionsService, Usuario, Producto } from "../../services/connections.service";
import  Swal  from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.component.html'
})
export class MiCuentaComponent {

  usuario!: Usuario; 
  productos:Producto[] = []; 
  misProductosDestacados:Producto[] = [];
  cargando: boolean = false;
  inputType: string = 'password';

  constructor(private connectionsService: ConnectionsService, private autService: AuthService)
  {
    this.cargando =true;
    this.connectionsService.getUsuarioPorId(this.autService.GetIdUsuarioLocalStorage()).subscribe((usuarioBd:any) => {
       this.usuario = usuarioBd;
       this.cargando = false;
    },
    (error:any) =>{

      Swal.fire({
        icon:'error',
        title:'Error al cargar el usuario',
        text: error.message
      });
    });

    this.connectionsService.getProductosPorIdUsuario(this.autService.GetIdUsuarioLocalStorage()).subscribe((listaProductosPorId:Producto[]) => {
      this.productos = listaProductosPorId;
      for (let index = 0; index < this.productos.length; index++) 
      {         
        this.productos[index].tipoProducto = this.validarTipoProducto(this.productos[index].tipoProducto);       
      }
      this.cargando = false;
    },
    (error:any) =>{
 
      Swal.fire({
        icon:'error',
        title:'Error al obtener mis productos',
        text: error.message
      });
     });

   this.connectionsService.getObtenerProductosDestacados(this.autService.GetIdUsuarioLocalStorage()).subscribe((listaProductosDestacadosPorId:Producto[]) => {
    this.misProductosDestacados = listaProductosDestacadosPorId;
    
    for (let index = 0; index < this.misProductosDestacados.length; index++) 
    {         
      this.misProductosDestacados[index].tipoProducto = this.validarTipoProducto(this.misProductosDestacados[index].tipoProducto);       
    }
    this.cargando = false;

    },
    (error:any) =>{
 
      Swal.fire({
        icon:'error',
        title:'Error al obtener mis productos destacados',
        text: error.message
      });
    });

  }

  togglePasswordVisibility() {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }

  actualizarUsuario(formularioValue: NgForm)
  {    
    if(formularioValue.invalid)
    {
      Object.values(formularioValue.controls).forEach( (controles: any) => {
        controles.markAsTouched();
      });

      return;
    }
    else
    {
      Swal.fire({
        title: 'Espere por favor',
        text: 'Procesando informacion',
        icon: 'info',
        allowOutsideClick: false
      })
      Swal.showLoading();
      
      this.connectionsService.postEditarUsuario(this.usuario).subscribe( (resp:any)=> {
        
       Swal.fire(
        {      
          title: 'Se edito correctamente',
          icon: 'success',
          showConfirmButton: false,
          timer:1500
        })     
      },
      (error:any) =>{
  
        Swal.fire({
          icon:'error',
          title:'Error al editar cuenta',
          text: error.message
        });
      });
    }

  }

  borrarProducto( producto: Producto, i:number )
  {
    Swal.fire({
      title: '¿Esta seguro?',
      text: `Esta seguro de borrar al producto: ${ producto.nombre }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then((resp:any) => {
      
      if(resp.value)
      {        
        this.connectionsService.deleteProducto(producto.idProducto).subscribe( (resp:any)=>
        { 
        
          Swal.fire(
            {      
              title: 'Se elimino correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer:1500
            })     
            this.productos.splice(i, 1);
        },
        (error:any) =>{
    
          Swal.fire({
            icon:'error',
            title:'Error al eliminar el producto',
            text: error.message
          });
        });  
      }      

    })    
  }
  
  validarTipoProducto(tipoProd: string):string
  {
    if(tipoProd === 'R')
    {
      return 'Repuesto';
    }
    else if(tipoProd === 'A')
    {
      return 'Accesorio';
    }
     return '';
  }
  
}
