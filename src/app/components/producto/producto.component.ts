import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectionsService, Mail } from "../../services/connections.service";
import { PopupServiceService }from "../../services/popup.service.service";
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html'
})
export class ProductoComponent {

  producto: any;
  productoId!: string | null;
  loadingProducto!: boolean;
  imagenData: any;
  tipoProducto!: string;
  productoDestacado!: boolean;
  usuarioIdLogin!: number;
  productoEsPropio!: boolean;
  mail!: Mail;
  modalAbierto: boolean = false;
  mensajePopup!: string;
  parametroTipoProducto!:string;
  esProductoDenunciado: boolean =  false;  
  imagenRecursoData: any;
  tipoProductoUrl!: string | null;

  constructor(private router: ActivatedRoute, private connectionsService: ConnectionsService, 
              private routerNavegate: Router, private popupservice:PopupServiceService, private autService: AuthService)
  {
    this.tipoProductoUrl = this.router.snapshot.paramMap.get('tipo');     

    this.loadingProducto = true;
    this.router.params.subscribe( (params:any) => {
       this.getProducto(params.id);   
       this.parametroTipoProducto = params.tipo;
        
    });

    this.usuarioIdLogin = Number(this.autService.GetIdUsuarioLocalStorage());
  }
  
  getProducto(productoId: string)
  {
    this.loadingProducto = true;    
      
    this.connectionsService.getProductoPorId(productoId).subscribe( (response: any)  => {
      this.producto = response;             
      
      
      this.connectionsService.getImagenProductoPorId(response.idProducto, 'Producto').subscribe((responseImage:any) =>{
        this.imagenData = this.convertirBlobAURL(responseImage);
      });
      
      this.validarTipoProducto(this.producto.tipoProducto);
      
      if (this.tipoProductoUrl == 'admin' && this.producto.tipoProducto == 'R' && this.producto.imagenRepuestoContenido != null) 
      {
        this.connectionsService.getImagenProductoPorId(response.idProducto, 'RepuestoPendiente').subscribe((responseImage:any) =>{
          this.imagenRecursoData = this.convertirBlobAURL(responseImage);
        });  
      }
      
      this.loadingProducto = false;        
    });     

    this.loadingProducto = true;
    this.connectionsService.validarProductoDestacado(this.autService.GetIdUsuarioLocalStorage(), productoId).subscribe( (response: any)=>
    {
      this.productoDestacado = response;
     
      this.loadingProducto = false;
    });
    
    this.loadingProducto = true;
    this.connectionsService.validarProductoDenunciado(this.autService.GetIdUsuarioLocalStorage(), productoId).subscribe( (response: any)=>
    {
      this.esProductoDenunciado = response;
      this.loadingProducto = false;
    });
  }

  destacarProducto()
  {    
    let peticion!: Observable<any>;  

    if(this.productoDestacado)
    {
      peticion = this.connectionsService.InsertarProductoDestacado(this.autService.GetIdUsuarioLocalStorage(), this.producto.idProducto);

      peticion.subscribe((response:any) =>
      Swal.fire(
        {      
          title:  'Se destaco correctamente',
          icon: 'info',
          showConfirmButton: false,
          timer:1000
        }
      ));     
    }
    else
    {
      peticion = this.connectionsService.borrarProductoDestacado(this.autService.GetIdUsuarioLocalStorage(), this.producto.idProducto);

      peticion.subscribe((response:any) =>
      Swal.fire(
        {      
          title:  'Ya no pertenece a sus destacados',
          icon: 'info',
          showConfirmButton: false,
          timer:1500
        }
      ));     
    }    
  }
  
  denunciarProducto(idProducto:number)
  {
    
    Swal.fire({
      title: '¿Esta seguro de denunciar el producto?',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then((resp:any) => {
      
      if(resp.value)
      {        
        this.connectionsService.denunciarProducto(idProducto.toString(), this.usuarioIdLogin.toString()).subscribe( (response:any)=>{    
        });    
        this.routerNavegate.navigate(['/marketPlace']);    
      }      
    })    
  }

  validarTipoProducto(tipoProd: string)
  {
    if(tipoProd === 'R')
    {
      this.tipoProducto = 'Repuesto'
    }
    else if(tipoProd === 'A')
    {
      this.tipoProducto = 'Accesorio'
    }
  }
  
  abrirModal(): void {
    this.modalAbierto = true;

    this.popupservice.setParametro(this.producto);
  }

  cerrarModal(): void {
   
    this.modalAbierto = false;
  }

  redireccionarPantalla()
  {      
    if(this.parametroTipoProducto === 'cuenta')
    {
      this.routerNavegate.navigate(['/miCuenta']);
      return
    }
    else if(this.parametroTipoProducto === 'marketPlace')
    {
      this.routerNavegate.navigate(['/marketPlace']);
      return
    }
    else if(this.parametroTipoProducto === 'admin')
    {
      this.routerNavegate.navigate(['/usuarioAdmin']);
      return
    }
  }
  
  convertirBlobAURL(blob: Blob): string {
    const url = URL.createObjectURL(blob);
    return url;
  }

}
