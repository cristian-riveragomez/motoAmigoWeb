import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../models/dtoModelos.component';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  idUsuario!: string;  

  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  private esAdminSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public esAdmin = this.esAdminSubject.asObservable();

  constructor() {
    this.GetIdUsuarioLocalStorage();
   }

  private setAuthenticationStatus(status: boolean) 
  {
    this.isAuthenticatedSubject.next(status);
  }

  private setAdminStatus(status: boolean) 
  {
    this.esAdminSubject.next(status);
  }

  guardarIdEnLocalStorage(idUsuario: string)
  {
    this.idUsuario = idUsuario;
    localStorage.setItem('idUsuario', idUsuario);
    this.setAuthenticationStatus(true);
  }
  
  GetIdUsuarioLocalStorage(): string
  {
    if(localStorage.getItem('idUsuario'))
    {
      this.idUsuario = localStorage.getItem('idUsuario')!;
      this.setAuthenticationStatus(true);
    }
    else
    {
      this.idUsuario = '';
    }

    return this.idUsuario;
  }

  esUnUsuarioAutenticado(): boolean
  {
    let autenticado = true;
    
    if(this.GetIdUsuarioLocalStorage() === '')
    {
      autenticado = false;
    }

    return autenticado;
  }

  logout()
  {
    localStorage.removeItem('idUsuario')
    this.setAuthenticationStatus(false);
  }
  
  validarSiEsAdmin(usuario: Usuario)
  {
    if(usuario.esAdmin)
    {
      this.setAdminStatus(true);
    }
    else
    {
      this.setAdminStatus(false);
    }
  }

}
