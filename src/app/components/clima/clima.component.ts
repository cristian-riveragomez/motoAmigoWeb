import { Component, OnInit } from '@angular/core';
import { ConnectionsService } from "../../services/connections.service";
import Swal from 'sweetalert2';
import { DatosClimaActuales, ClimaPorDia } from '../../models/dtoModelos.component';

@Component({
  selector: 'app-clima',
  templateUrl: './clima.component.html'
})
export class ClimaComponent implements OnInit 
{
  datosActualues!: DatosClimaActuales;
  datosSemanales:ClimaPorDia[] = [];

  latitud!:string;
  longitud!: string;

  fechaString!: string;
  pathIconoActual!: string;
  listaPathIconoSemanal: string[]= [];
  loadingClima!: boolean;  

  constructor(private connectionsService: ConnectionsService)
  { 
  }

  ngOnInit(): void
  {
    this.loadingClima = false;
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitud = position.coords.latitude.toString();
      this.longitud = position.coords.longitude.toString();
    
      this.mostrarDatosActuales(this.latitud, this.longitud);
      this.mostrarDatosSemanales(this.latitud, this.longitud);
    }); 
  }

  mostrarDatosActuales(lat:string, lng:string)
  {
    this.loadingClima = false;    
    this.connectionsService.getDatosClimaActuales(lat, lng).subscribe((response:any) => {

      this.datosActualues = response;

      this.obtenerIconoActual(this.datosActualues.icono);
      this.loadingClima = true;
    },
    (error:any) =>{

      Swal.fire({
        icon:'error',
        title:'Error al refrescar',
        text: error.error
      });
    }
    
    );

    this.ObtenerFechaYHoraActual();
  }
  
  mostrarDatosSemanales(lat:string, lng:string)
  {
    this.loadingClima = false;    
    
    this.connectionsService.getDatosClimaSemanal(lat, lng).subscribe( (response:ClimaPorDia[] )=> {
      response.forEach(element => {
        element.diaDeLaSemana = this.ObtenerDiaAString(Number(element.diaDeLaSemana));
        element.icono = element.icono.replace('n', 'd')
        element.icono = '../../../assets/img/' + element.icono + '@2x.png'                
      });

      this.datosSemanales = response;      
      this.loadingClima = true;
    },
    (error:any) =>{

      Swal.fire({
        icon:'error',
        title:'Error al refrescar',
        text: error.error
      });
    }     
    );
  }
  
  RefrescarDatos()
  {
    this.loadingClima = false;
    this.mostrarDatosActuales(this.latitud, this.longitud);
    this.mostrarDatosSemanales(this.latitud, this.longitud);
  }

  ObtenerFechaYHoraActual()
  {
    let fecha =  new Date;
    let minutos = fecha.getMinutes().toString();
    
    if(minutos.length === 1)
    {
      minutos = '0' + minutos;
    }

    this.fechaString = this.ObtenerDiaAString(fecha.getDay()) + ', ' + fecha.getHours() + ':' +  minutos;
  }
  
  obtenerIconoActual(icono: string)
  {
      this.pathIconoActual = '../../../assets/img/' + icono + '@4x.png';                 
  }
  
  obtenerIconosSemanal(icono:string)
  {
    this.listaPathIconoSemanal.push('../../../assets/img/' + icono + '@2x.png');     
  }

  ObtenerDiaAString(diaNumeral:number)
  {
    let diaString='';

    switch(diaNumeral)
    {
      case 0:
      diaString="Domingo";
      break;
      case 1:
      diaString="Lunes";
      break;
      case 2:
      diaString="Martes";
      break;
      case 3:
      diaString="Miercoles";
      break;
      case 4:
      diaString="Jueves";
      break;
      case 5:
      diaString="Viernes";
      break;
      case 6:
      diaString="Sabado";
      break;
    }
    
    return diaString;
  }

}
