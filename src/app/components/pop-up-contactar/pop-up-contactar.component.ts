import { Component } from '@angular/core';
import { PopupServiceService }from "../../services/popup.service.service";
import { ConnectionsService} from '../../services/connections.service';
import  Swal  from 'sweetalert2';
import { Mail } from '../../models/dtoModelos.component';

@Component({
  selector: 'app-pop-up-contactar',
  templateUrl: './pop-up-contactar.component.html'
})
export class PopUpContactarComponent {

  modalAbierto: boolean = false;
  mensajePopup!: string;
  mailRecibido!: any;
  mailAEnviar!: Mail;
  producto: any;

  constructor(private popupService:PopupServiceService, private connectionsService: ConnectionsService)
  {
    this.mailRecibido = this.popupService.getParametro();
  }

  abrirModal(): void {
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  enviarMail()
  {
    let mailContacto =  new Mail();
    mailContacto.titulo = 'Contacto por producto';
    mailContacto.enviado = false;
    mailContacto.cuerpo = this.mensajePopup;
    mailContacto.idUsuarioReceptor =   this.mailRecibido.idUsuario  
    
     this.connectionsService.envioDeMail(mailContacto).subscribe((response: any) =>{      
      
      Swal.fire(
        {      
          title: 'Se envio el mail correctamente',
          icon: 'success',
          showConfirmButton: false,
          timer:1000
        })
        this.cerrarModal();
     },
     (error:any) =>{
 
       Swal.fire({
         icon:'error',
         title:'Error al enviar el mail de contacto',
         text: error.message
       });
     });                      
  }

}
