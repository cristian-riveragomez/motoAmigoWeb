import { Injectable } from '@angular/core';
import { Mail } from '../models/dtoModelos.component';


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
