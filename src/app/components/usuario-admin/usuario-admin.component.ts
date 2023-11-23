import { Component } from '@angular/core';
import { ConnectionsService} from '../../services/connections.service';
import  Swal  from 'sweetalert2';
import { Producto, Usuario, Mail } from '../../models/dtoModelos.component';

@Component({
  selector: 'app-usuario-admin',
  templateUrl: './usuario-admin.component.html'
})
export class UsuarioAdminComponent {

  productosDenunciados:Producto[] = [];
  productosPendientes:Producto[] = [];
  usuarios: Usuario[] = [];
  cargando: boolean = false; 

  constructor(private connectionsService: ConnectionsService)
  {
    this.cargando = true;
    this.connectionsService.getProductosDenunciados().subscribe((listaProductosDenunciados:Producto[]) => {
      this.productosDenunciados = listaProductosDenunciados;
      for (let index = 0; index < this.productosDenunciados.length; index++) 
      {         
        this.productosDenunciados[index].tipoProducto = this.validarTipoProducto(this.productosDenunciados[index].tipoProducto);       
      }
      this.cargando = false;
    },
    (error:any) =>{
 
      Swal.fire({
        icon:'error',
        title:'Error al obtener los productos denunciados',
        text: error.message
      });
    });
  
   this.cargando = true;
   this.connectionsService.getListaUsuarios().subscribe((listaUsuarios:Usuario[]) => {
    this.usuarios = listaUsuarios;
    this.cargando = false;
    },
    (error:any) =>{
 
      Swal.fire({
        icon:'error',
        title:'Error al obtener la lista de usuarios',
        text: error.message
      });
   });
  
   this.cargando = true;
   this.connectionsService.getObtenerProductosPendientes().subscribe((listaProductosPend:Producto[]) => {
     this.productosPendientes = listaProductosPend;
     for (let index = 0; index < this.productosPendientes.length; index++) 
     {         
       this.productosPendientes[index].tipoProducto = this.validarTipoProducto(this.productosPendientes[index].tipoProducto);       
     }
     this.cargando = false;
   },
   (error:any) =>{

     Swal.fire({
       icon:'error',
       title:'Error al obtener los productos pendientes de aprobación',
       text: error.message
     });
   });

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
        this.connectionsService.deleteProducto(producto.idProducto).subscribe((resp:any)=> {
          Swal.fire(
            {      
              title: 'Se borro el producto denunciado correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer:1500
            })
          this.productosDenunciados.splice(i, 1);
          
          this.connectionsService.getUsuarioPorId(producto.idUsuario.toString()).subscribe((usuario: any) => { 
              
            let mailContacto =  new Mail();
            mailContacto.titulo = 'Eliminacion de producto denunciado';
            mailContacto.enviado = false;
            mailContacto.cuerpo = 'Hola ' + usuario+ ', te informamos que tu producto ' + producto.nombre + ' a sido eliminado por el administrador al ser denunciado por multiples usuarios.';
            mailContacto.idUsuarioReceptor =  producto.idUsuario.toString();  
          
            this.connectionsService.envioDeMail(mailContacto).subscribe((response: any) =>{
              });
          });       
                
          },
          (error:any) =>{
      
            Swal.fire({
              icon:'error',
              title:'Error al borrar el producto',
              text: error.message
            });
          });          
      }      
    })    
  }

  borrarUsuario(usuario: Usuario, i:number)
  {
    Swal.fire({
      title: '¿Esta seguro?',
      text: `Esta seguro de borrar al usuario: ${ usuario.nombreUsuario }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then((resp:any) => {
      
      if(resp.value)
      {
        let mailContacto =  new Mail();
        mailContacto.titulo = 'Eliminacion de usuario';
        mailContacto.enviado = false;
        mailContacto.cuerpo = 'Hola ' + usuario.nombreUsuario + ', lamentamos informar que su usuario fue eliminado por el administrador.'
        mailContacto.idUsuarioReceptor =  usuario.id.toString()
        
        console.log(mailContacto)
        this.connectionsService.envioDeMail(mailContacto).subscribe((response: any) =>{
        });  

        this.connectionsService.borrarUsuario(usuario.id.toString()).subscribe( (resp:any)=>{
          Swal.fire(
            {      
              title: 'Se borro el usuario correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer:1500
            })
          this.usuarios.splice(i, 1);                
         },
         (error:any) =>{
     
           Swal.fire({
             icon:'error',
             title:'Error al borrar usuario',
             text: error.message
           });
         });  
      }      
    })    
  }
  
  actualizarEstadoProducto(producto: Producto, i:number, tipo:string)
  {
    if(tipo === 'Aprobar')
    {      
      Swal.fire({
        title: '¿Esta seguro?',
        text: `Esta seguro de aprobar el producto: ${ producto.nombre } ?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true
      }).then((resp:any) => {
        
        if(resp.value)
        {        
          this.connectionsService.getUpdateEstadoProducto(producto.idProducto, 'HABILITADO').subscribe( (resp:any)=>{
            Swal.fire(
              {      
                title: 'Se aprobo el producto correctamente',
                icon: 'success',
                showConfirmButton: false,
                timer:1500
              })              
            this.productosPendientes.splice(i, 1);
            
            this.connectionsService.getUsuarioPorId(producto.idUsuario.toString()).subscribe((usuario: any) => { 
              
              let mailContacto =  new Mail();
              mailContacto.titulo = 'Aprobacion de producto pendiente';
              mailContacto.enviado = false;
              mailContacto.cuerpo = `Hola ${usuario.nombreUsuario}, le informamos que su producto ${producto.nombre} a sido revisado y aprobado por el administrador.`;
              mailContacto.idUsuarioReceptor =  producto.idUsuario.toString();  
            
              this.connectionsService.envioDeMail(mailContacto).subscribe((response: any) =>{
                });
            });          
           
           },
           (error:any) =>{
       
             Swal.fire({
               icon:'error',
               title:'Error al aprobar el producto',
               text: error.message
             });
           });  
        }      
      })    

    }
    else
    {      
      Swal.fire({
        title: '¿Esta seguro?',
        text: `Esta seguro de rechazar el producto: ${ producto.nombre } ?`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true
      }).then((resp:any) => {
        
        if(resp.value)
        {        
          this.connectionsService.getUpdateEstadoProducto(producto.idProducto, 'RECHAZADO').subscribe( (resp:any)=>{
            Swal.fire(
              {      
                title: 'Se rechazo el producto correctamente',
                icon: 'success',
                showConfirmButton: false,
                timer:1500
              })
            this.productosPendientes.splice(i, 1);            

            this.connectionsService.getUsuarioPorId(producto.idUsuario.toString()).subscribe((usuario: any) => { 
              
              let mailContacto =  new Mail();
              mailContacto.titulo = 'Rechazo de producto pendiente';
              mailContacto.enviado = false;
              mailContacto.cuerpo = `Hola ${usuario.nombreUsuario}, le informamos que su producto ${producto.nombre} a sido rechazo por el administrador. Por favor modifique la imagen del grabado de su repuesto.`;
              mailContacto.idUsuarioReceptor =  producto.idUsuario.toString();  
            
              this.connectionsService.envioDeMail(mailContacto).subscribe((response: any) =>{
                });
            });                                                      

           },
           (error:any) =>{
       
             Swal.fire({
               icon:'error',
               title:'Error al rechazar el producto',
               text: error.message
             });
           });  
        }      
      })    
    } 
  }

  aprobarProductoDenunciado(producto: Producto, i:number)
  {
    this.connectionsService.AprobarProductoDenunciado(producto.idProducto).subscribe( (resp:any)=>{
      Swal.fire(
        {      
          title: 'Se aprobo el producto denunciado correctamente',
          icon: 'success',
          showConfirmButton: false,
          timer:1500
        })
      this.productosDenunciados.splice(i, 1);
      
      this.connectionsService.getUsuarioPorId(producto.idUsuario.toString()).subscribe((usuario: any) => { 
              
        let mailContacto =  new Mail();
        mailContacto.titulo = 'Aprobacion de producto denunciado';
        mailContacto.enviado = false;
        mailContacto.cuerpo = `Hola ${usuario.nombreUsuario}, le informamos que su producto denunciado ${producto.nombre} a sido revisado y aprobado por el administrador.`;
        mailContacto.idUsuarioReceptor =  producto.idUsuario.toString();  
      
        this.connectionsService.envioDeMail(mailContacto).subscribe((response: any) =>{
          });
      });       

     },
     (error:any) =>{
 
       Swal.fire({
         icon:'error',
         title:'Error al aprobar el producto',
         text: error.message
       });
     });  
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
