import { Injectable } from '@angular/core';
import { Mail } from './connections.service';

@Injectable({
  providedIn: 'root'
})
export class PopupServiceService {
  
  private _parametro!: Mail;

  constructor() { }

  setParametro(valor: Mail) {
    this._parametro = valor;
  }

  getParametro() {
    return this._parametro;
  }
    
}
