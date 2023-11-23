import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, UsuarioLogin, Mail } from '../models/dtoModelos.component';
@Injectable({
  providedIn: 'root'
})
export class ConnectionsService {

   private dominio: string = 'https://www.motoamigoapi.somee.com'
  //private dominio: string = 'https://localhost:7265'
  constructor(private http: HttpClient) 
  {    
  }

  getDatosClimaSemanal(latitud:string, longitud:string) {
    return this.http.post<any>(
      this.dominio + '/apiMotoAmigo/ObtencionDatosClimaSemanal',
      { latitud: latitud, longitud: longitud }
    );
  }

  getDatosClimaActuales(latitud:string, longitud:string) {
    return this.http.post<any>(
      this.dominio + '/apiMotoAmigo/ObtencionDatosClimaActual',
      { latitud: latitud, longitud: longitud }
    );
  }


  //Productos
  getBusquedaProductos(filtro: string) {
    return this.http.get<any>(
      `${this.dominio}/Productos/BuscarProducto?filtro=${filtro}`
    );
  }

  getListaProductosTotales() {
    return this.http.get<any>(
      `${this.dominio}/Productos/ObtenerListaProductos`
    );
  }

  getProductosDenunciados() {
    return this.http.get<any>(
      `${this.dominio}/Productos/ObtenerProductosPorCantDenuncias`
    );
  }

  getProductoPorId(idRepuesto: string) {
    return this.http.get<any>(
      `${this.dominio}/Productos/ObtenerProductoPorId?idProducto=${idRepuesto}`
    );
  }

  getImagenProductoPorId(idProducto: number, tipoImagen: string) : Observable<any> {
    return this.http.get(`${this.dominio}/Productos/ObtenerImagenDelProductoPorId?idProducto=${idProducto}&tipoImagen=${tipoImagen}`, { responseType: 'blob' });
  }

  getProductosPorIdUsuario(idUsuario: string) {
    return this.http.get<any>(
      `${this.dominio}/Productos/ObtenerProductosPorIdUsuario?idUsuario=${idUsuario}`
    );
  }

  postCrearProducto(producto:FormData)
  {
    return this.http.post<any>(
      `${this.dominio}/Productos/InsertarProducto`,
      producto
    );
  }
  
  postGuardarImagen(producto: FormData)
  {
    return this.http.post<any>(
      `${this.dominio}/Productos/GuardarImagen`,
      producto
    );
    
  }

  putEditarProducto(producto:FormData)
  {
    return this.http.put<any>(
      `${this.dominio}/Productos/EditarProducto`,
      producto
    );
  }

  deleteProducto(idProducto:string)
  {
    return this.http.delete<any>(
      `${this.dominio}/Productos/BorrarProducto?idProducto=${idProducto}`
    );
  }

  validarProductoDestacado(idUsuario: string, idProducto: string)
  {
    return this.http.get<any>(
      `${this.dominio}/Productos/ValidarProductoDestacado?idUsuarioDestacando=${idUsuario}&idProducto=${idProducto}`
    );
  }

  denunciarProducto(idProducto:string, idUsuario: string)
  {
    return this.http.get<any>(
      `${this.dominio}/Productos/DenunciarProducto?idProducto=${idProducto}&idUsuario=${idUsuario}`
    );    
  }

  validarProductoDenunciado(idUsuario: string, idProducto:string )
  {
    return this.http.get<any>(
      `${this.dominio}/Productos/ValidarProductoDenunciadoPorUsuario?idUsuario=${idUsuario}&idProducto=${idProducto}`
    );    
  }

  borrarProductoDestacado(idUsuario: string, idProducto: string)
  {
    return this.http.delete<any>(
      `${this.dominio}/Productos/BorrarProductoDestacado?idUsuarioDestacando=${idUsuario}&idProducto=${idProducto}`
    );
  }

  InsertarProductoDestacado(idUsuario: string, idProducto: string)
  {
    return this.http.get<any>(
      `${this.dominio}/Productos/AgregarProductoDestacado?idUsuarioDestacando=${idUsuario}&idProducto=${idProducto}`
    );
  }

  getObtenerProductosDestacados(idUsuario: string)
  {
    return this.http.get<any>(
      `${this.dominio}/Productos/ObtenerProductosPorUsuarioDestacado?idUsuario=${idUsuario}`
    );
  }
  
  getObtenerProductosPendientes() {
    return this.http.get<any>(
      `${this.dominio}/Productos/ObtenerProductosPendientes`
    );
  }

  getUpdateEstadoProducto(idProducto: string, estado: string) {
    return this.http.get<any>(
      `${this.dominio}/Productos/UpdateEstadoProducto?idProducto=${idProducto}&estado=${estado}`
    );
  }

  AprobarProductoDenunciado(idProducto: string) {
    return this.http.get<any>(
      `${this.dominio}/Productos/AprobarProductoDenunciado?idProducto=${idProducto}`
    );
  }

  ObtenerProductosPorPrecio(precioMin: string, precioMaximo: string) {
    return this.http.get<any>(
      `${this.dominio}/Productos/ObtenerProductosPorPrecio?precioMin=${precioMin}&precioMaximo=${precioMaximo}`
    );
  }

  
  //Usuarios
  getUsuarioPorId(idUsuario: string) {
    return this.http.get<any>(
      `${this.dominio}/Usuarios/ObtenerUsuario?idUsuario=${idUsuario}`
    );
  }

  postInsertarUsuario(usuario: FormData)
  {
    return this.http.post<any>(
      `${this.dominio}/Usuarios/InsertarUsuario`,
      usuario
    );
  }

  postEditarUsuario(usuario: Usuario) {
    return this.http.post<any>(
      `${this.dominio}/Usuarios/EditarUsuario`,
      usuario
    );
  }

  getListaUsuarios()
  {
    return this.http.get<any>(`${this.dominio}/Usuarios/ObtenerListaUsuarios`);
  }
  
  borrarUsuario(idUsuario: string)
  {
    return this.http.delete<any>(
      `${this.dominio}/Usuarios/BorrarUsuario?idUsuario=${idUsuario}`
    );
  }
  
  loginUsuario(usuarioLogin: UsuarioLogin)
  {
    return this.http.post<any>(
      `${this.dominio}/Usuarios/LoginUsuario`,
      usuarioLogin
    );
  }
  
  
  // MAIL
  envioDeMail(mail:Mail)
  {
    return this.http.post<any>(
      `${this.dominio}/Mail/InsertarMail`,
      mail
    );
  }

}