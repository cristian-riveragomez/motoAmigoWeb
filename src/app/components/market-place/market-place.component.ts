import { Component } from '@angular/core';
import { ConnectionsService } from "../../services/connections.service";
import { Router } from "@angular/router";
import  Swal  from 'sweetalert2';
import { Producto } from '../../models/dtoModelos.component';

@Component({
  selector: 'app-market-place',
  templateUrl: './market-place.component.html'
})
export class MarketPlaceComponent {

  productos:Producto[] = []; 
  loading!:boolean;
  checkboxAccesoriosValue: boolean = false;
  checkboxRepuestosValue: boolean = false;
  precioMinimoInput: string;
  precioMaximoInput: string;

  constructor(private connectionsService: ConnectionsService, private router: Router)
  {    
    this.loading = true;
    this.connectionsService.getListaProductosTotales().subscribe( (response:any) =>{
      this.productos = response;
      this.generarListaImagenesProductos();         
      this.loading = false;
    });

  }

  onCheckboxChange()
  {
    this.loading = true;
    let listaAccesorios:any[] = []; 
    let listaRepuesto:any[] = []; 
    
    if(this.checkboxAccesoriosValue && !this.checkboxRepuestosValue)
    {
      this.productos.forEach(element => {
        if(element.tipoProducto == 'A')
        {
          listaAccesorios.push(element);
        }
      });
      this.productos = listaAccesorios;
      this.generarListaImagenesProductos();
      this.loading = false;  
    }
    else if(!this.checkboxAccesoriosValue && this.checkboxRepuestosValue)
    {
      this.productos.forEach(element => {
        if(element.tipoProducto == 'R')
        {
          listaRepuesto.push(element);
        }
      });

      this.productos = listaRepuesto;
      this.generarListaImagenesProductos();
      this.loading = false;  
    }
    else if( (!this.checkboxAccesoriosValue && !this.checkboxRepuestosValue) || (this.checkboxAccesoriosValue && this.checkboxRepuestosValue) ) 
    {
      this.connectionsService.getListaProductosTotales().subscribe( (response:any) =>{
        this.productos = response;
        this.generarListaImagenesProductos();
        this.loading = false;
      });
    }

  }

  buscar(termino:string)
  {
    this.loading = true;
    if(termino == '')
    {
      this.connectionsService.getListaProductosTotales().subscribe( (response:any) =>{
        this.productos = response;
        this.generarListaImagenesProductos();
        this.loading = false;
      });
    }
    else
    {
      this.connectionsService.getBusquedaProductos(termino).subscribe( (response:any) => {
        this.productos = response;
        this.generarListaImagenesProductos();
        this.loading = false;
      });
    }    
  }
  
  verProducto( item: any )
  {
    let productoId;
    productoId = item.idProducto;
    
    this.router.navigate(['/producto', productoId, 'marketPlace']);
  }
  
  convertirBlobAURL(blob: Blob): string {
    const url = URL.createObjectURL(blob);
    return url;
  }
  
  generarListaImagenesProductos()
  {
    for (let index = 0; index < this.productos.length; index++) {
        
      this.connectionsService.getImagenProductoPorId(Number(this.productos[index].idProducto), 'Producto').subscribe((responseImage:any) =>{
        
        this.productos[index].imagenContenido = this.convertirBlobAURL(responseImage); 
      });
    }
  }

  ObtenerProductosPorPrecio()
  {    
    this.loading = true;
    this.connectionsService.ObtenerProductosPorPrecio(this.precioMinimoInput, this.precioMaximoInput).subscribe( (response:any) =>
    {
      this.productos = response;
      this.generarListaImagenesProductos();
      this.loading = false;
      },      
      (error:any) =>
      {    
        Swal.fire({
          icon:'error',
          title:'Error',
          text: error.message
        });
        this.loading = true;
        this.connectionsService.getListaProductosTotales().subscribe( (response:any) =>
        {
          this.productos = response;
          this.generarListaImagenesProductos();         
          this.loading = false;
        }
      );
    });   
  }

}
