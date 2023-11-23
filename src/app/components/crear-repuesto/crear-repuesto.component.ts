import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConnectionsService } from '../../services/connections.service';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { Producto } from '../../models/dtoModelos.component';


@Component({
  selector: 'app-crear-repuesto',
  templateUrl: './crear-repuesto.component.html'
})
export class CrearRepuestoComponent {
  
  productoId!: string | null;
  producto!: Producto;
  imagenData: any;
  imagenDataRepuestoNuevo: any;
  archivos: any = [];
  archivosRepuestos: any = [];
  previsualizacion!: string;
  previsualizacionRepuestoNuevo!: string;
  estaSobreElemento: boolean = false;
  options: string[] = ['Caño de escape', 'Asiento inferior', 'Cuadro de chasis', 'Horquilla', 'Soporte de pedalin', 'Otro'];
  selectedOption: string = 'vacio';
  esRepuestoAValidar: boolean = false;
  esRepuestoRechazado!: boolean;

  constructor(private connectionService: ConnectionsService, private router: ActivatedRoute,
              private sanitizer: DomSanitizer, private routerNavagate: Router, private autService: AuthService ) 
  {
    this.productoId = this.router.snapshot.paramMap.get('id');        

    if (this.productoId != 'nuevo') 
    {
      this.producto =  new Producto();

      this.connectionService.getProductoPorId(this.productoId!).subscribe( (response: any) => {
        response.precio =  response.precio.toString().trim()
        this.producto = response

        this.validacionEstado(response.estado)
      
        this.connectionService.getImagenProductoPorId(response.idProducto, 'Producto').subscribe((responseImage:any) =>{
          this.imagenData = this.convertirBlobAURL(responseImage);
        });
      });      
    }
    else
    {
      this.producto =  new Producto();
    }
  }

  capturarArchivo(event:any): any
  {
    const archivoCapturado = event.target.files[0];

    this.extraerABase64(archivoCapturado).then( (imagen: any) =>{
      this.previsualizacion = imagen.base;
    });
    this.archivos.push(archivoCapturado);
  }

  capturarRepuesto(event:any): any
  {
    const archivoCapturado = event.target.files[0];

    this.extraerABase64(archivoCapturado).then( (imagen: any) =>{
      this.previsualizacionRepuestoNuevo = imagen.base;
    });
    this.archivosRepuestos.push(archivoCapturado);
  }

  extraerABase64 = async($event: any) => new Promise( (resolve, reject) =>{
    try
    {
      const unsafeImage =  window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImage);
      const reader = new FileReader();

      reader.readAsDataURL($event);
      reader.onload = () =>{
        resolve({
          base:reader.result
        });
      };
    }
    catch(e)
    {
      return;
    }
  });

  
  guardarProducto(formularioValue: NgForm) 
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
    
    if(this.productoId == 'nuevo')
    {  
      if(this.producto.tipoProducto === "R" && this.selectedOption === "vacio")
      {
        Swal.fire({
          icon:'error',
          title:'Debe seleccionar el tipo de repuesto'        
        });

        return;
      }

      if(this.producto.tipoProducto === "R" && this.selectedOption != "Otro" && this.archivosRepuestos.length === 0)
      {
        Swal.fire({
          icon:'error',
          title:'Debe cargar una imagen del repuesto donde fue grabada'        
        });

        return;
      }

      if(this.archivos.length === 0)
      {
        Swal.fire({
          icon:'error',
          title:'Debe cargar una imagen del producto'        
        });
  
        return;
      }

      const formImagen =  new FormData();
      
      this.archivos.forEach((archivo: any) => {        
        formImagen.append('Nombre', this.producto.nombre);
        formImagen.append('Detalle', this.producto.detalle);               
        formImagen.append('Precio', this.producto.precio.toString());               
        formImagen.append('Marca', this.producto.marca);               
        formImagen.append('Modelo', this.producto.modelo); 
        formImagen.append('IdUsuario', this.autService.GetIdUsuarioLocalStorage());                                         
        formImagen.append('imagen', archivo); 
        
        if(this.producto.tipoProducto === "A")
        {
          formImagen.append('TipoProducto', 'A');        
        }

        if(this.producto.tipoProducto === "R")
        {
          formImagen.append('TipoProducto', 'R');        

          if(this.selectedOption != "Otro" && this.selectedOption != "vacio")
          {
            formImagen.append('Estado', 'PENDIENTE');
        
            this.archivosRepuestos.forEach((archivoRepuesto: any) =>{
              formImagen.append('imagenRepuesto', archivoRepuesto);
            });
        
            formImagen.append('tipoRepuesto', this.selectedOption);
          }
          else
          {
            formImagen.append('Estado', 'HABILITADO');                  
          }
        }
        else
        {
          formImagen.append('Estado', 'HABILITADO');                  
        } 
      });
      peticion = this.connectionService.postCrearProducto(formImagen);

      peticion.subscribe((response:any) =>{
      Swal.fire(      
          this.producto.nombre,
          'Se genero correctamente',
          'success')      
          this.routerNavagate.navigate(['/miCuenta']);
      },
      (error:any) =>{
  
        Swal.fire({
          icon:'error',
          title:'Error al crear el producto',
          text: error.message
        });
      });
    }
    else
    {    
      const formProductoActualizado =  new FormData();
      
      formProductoActualizado.append('IdProducto', this.producto.idProducto.toString());
      formProductoActualizado.append('Nombre', this.producto.nombre);
      formProductoActualizado.append('Detalle', this.producto.detalle);               
      formProductoActualizado.append('Precio', this.producto.precio.toString());               
      formProductoActualizado.append('Marca', this.producto.marca);               
      formProductoActualizado.append('Modelo', this.producto.modelo);          
      formProductoActualizado.append('IdUsuario', this.autService.GetIdUsuarioLocalStorage());                                                        

      if(this.esRepuestoRechazado)
      {
        this.archivosRepuestos.forEach((archivoRepuesto: any) =>{  
        formProductoActualizado.append('imagenRepuesto', archivoRepuesto);
        });      
        formProductoActualizado.append('Estado', 'PENDIENTE');
      }            
      
      peticion = this.connectionService.putEditarProducto(formProductoActualizado);

      peticion.subscribe((response:any) =>{      
      Swal.fire(
        {      
          title:  this.producto.nombre,
          text: 'Se edito correctamente',
          icon: 'success',
          showConfirmButton: false,
          timer:1500
        })

        setTimeout(() => {
          this.routerNavagate.navigate(['/miCuenta']);
        }, 1700);          
      },
      (error:any) =>{
  
        Swal.fire({
          icon:'error',
          title:'Error al editar el producto',
          text: error.message
        });
      });    
    }         
  }
  
  validacionRepuesto(show: boolean)
  { 
    this.esRepuestoAValidar = show;   
  }
  
  validacionEstado(estado:string)
  {   
    if(estado === 'RECHAZADO')
    {
      this.esRepuestoRechazado = true;
    }
  }

  convertirBlobAURL(blob: Blob): string {
    const url = URL.createObjectURL(blob);
    return url;
  }
    
}
