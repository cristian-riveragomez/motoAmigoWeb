import { Component, NgZone } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-establecimientos',
  templateUrl: './establecimientos.component.html',
})
export class EstablecimientosComponent {
  public latitude!: number;
  public longitude!: number;
  public zoom: number = 14;

  public mapOptions!: google.maps.MapOptions;
  map!: google.maps.Map;
  infoWindow: google.maps.InfoWindow = new google.maps.InfoWindow();

  checkboxEstacionesValue: boolean = false;
  checkboxTalleresValue: boolean = false;
  checkboxGomeriasValue: boolean = false;

  listaEstablecimientos: Establecimientos[] = [];
  marcadores: google.maps.Marker[] = []; // Lista de marcadores

  miUbicacion: Establecimientos;

  establecimientoGomerias: string = 'gomerias';
  establecimientoEstacionesServicio: string = 'estaciones de servicio';
  establecimientoTalleres: string = 'taller mecanico de motos';

  loading!: boolean;

  constructor(private ngZone: NgZone) 
  {
    this.loading = true;
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;

      this.generarMarcadorDeMiUbicacion();
      
     
      this.obtenerListaDeEstablecimientos([
        this.establecimientoGomerias,
        this.establecimientoEstacionesServicio,
        this.establecimientoTalleres,
      ]);
    });
    this.loading = false;    
  }

  obtenerListaDeEstablecimientos(listaTipoEstablecimientoUsado: string[]) 
  {
    listaTipoEstablecimientoUsado.forEach((tipoEstablecimiento) => {
      const placesService = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      const request = {
        location: new google.maps.LatLng(this.latitude, this.longitude),
        radius: 2000,
        keyword: tipoEstablecimiento,
      };

      placesService.nearbySearch(request, (results, status) => {
        if ( status === google.maps.places.PlacesServiceStatus.OK && results &&results.length > 0) 
        {
          for (let index = 0; index < results.length; index++) {
            const place = results[index];

            if (place.geometry && place.name && place.vicinity && place.icon && place.geometry.location) 
            {
              let nuevoEstablecimiento = new Establecimientos(
                place.name,
                place.vicinity,
                place.geometry.location.lat(),
                place.geometry.location.lng(),
                tipoEstablecimiento,
                undefined,
                place.rating,
                place.user_ratings_total
              );

              this.listaEstablecimientos.push(nuevoEstablecimiento);
              
              const marker = new google.maps.Marker({
                position: {
                  lat: nuevoEstablecimiento.latitud,
                  lng: nuevoEstablecimiento.longitud,
                },
                map: this.map,
                title: nuevoEstablecimiento.tipo,
                icon: nuevoEstablecimiento.icono,
              });

              this.marcadores.push(marker);            
              
              marker.addListener('click', () => {
                this.ngZone.run(() => {
                  this.infoWindow.setContent(
                    `<div style="color:black;"><b>${nuevoEstablecimiento.nombre} </b>
                                              <br>${nuevoEstablecimiento.direccion}
                                              <br>${nuevoEstablecimiento.calificacion} ☆ (${nuevoEstablecimiento.calificacionesTotaltes})
                      </div>`
                  );
                  this.infoWindow.open(this.map, marker);
                });
              });                          
            }
          }          
        } else {
          Swal.fire({
            icon:'error',
            title:'Error',
            text: 'ERROR:No se encontraron resultados para la búsqueda.'
          });
        }
      });
    });
  }

  generarMarcadorDeMiUbicacion() 
  {
    this.mapOptions = {
      center: new google.maps.LatLng(this.latitude, this.longitude),
      zoom: this.zoom,
    };

    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      this.mapOptions
    );

    this.miUbicacion = new Establecimientos(
      'Mi Ubicacion',
      '',
      this.latitude,
      this.longitude,
      'Mi Ubicacion',
      'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    );

    this.listaEstablecimientos.push(this.miUbicacion);

    // Crear un marcador para la ubicación y agregarlo a la lista
    const marker = new google.maps.Marker({
      position: {
        lat: this.miUbicacion.latitud,
        lng: this.miUbicacion.longitud,
      },
      map: this.map,
      title: this.miUbicacion.tipo,
      icon: this.miUbicacion.icono,
    });

    this.marcadores.push(marker);

    marker.addListener('click', () => {
      this.ngZone.run(() => {
        this.infoWindow.setContent(
          `<div style="color:black;">${this.miUbicacion.nombre} <br> ${this.miUbicacion.direccion}</div>`
        );
        this.infoWindow.open(this.map, marker);
      });
    });
  }

  onCheckboxChange() 
  {
    this.marcadores.forEach((marker) => 
    {
      if(marker.getTitle() != 'Mi Ubicacion')
      {
        marker.setVisible(false);
      }
      
    });

    if ( !this.checkboxEstacionesValue && !this.checkboxGomeriasValue && !this.checkboxTalleresValue) 
    {
      this.marcadores.forEach((marker) => {
        marker.setVisible(true);
      });

    } 
    else 
    {    
      if (this.checkboxEstacionesValue) 
      {
        this.mostrarMarcadoresPorTipo(this.establecimientoEstacionesServicio);
      }
      if (this.checkboxGomeriasValue) 
      {
        this.mostrarMarcadoresPorTipo(this.establecimientoGomerias);
      }
      if (this.checkboxTalleresValue) 
      {
        this.mostrarMarcadoresPorTipo(this.establecimientoTalleres);
      }
    }
  }

  mostrarMarcadoresPorTipo(tipo: string) 
  {
    this.marcadores.forEach((marker) => {
      if (marker.getTitle() === tipo) 
      {
        marker.setVisible(true);
      }
    });
  }

}

export class Establecimientos {
  constructor(
    public nombre: string,
    public direccion: string,
    public latitud: number,
    public longitud: number,
    public tipo?: string,
    public icono?: string,
    public calificacion?: number,
    public calificacionesTotaltes?: number
  ) {}
}
