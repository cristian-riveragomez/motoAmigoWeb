export interface DatosLocalizacion {
    latitud: string;
    longitud: string;
  }
  
  export interface ClimaPorDia {
    temperaturaMaxima: string;
    temperaturaMinima: string;
    descripcionClima: string;
    probabilidadLluviaMaxima: number;
    diaDeLaSemana: string;
    fecha: string;
    icono: string;
  }
  
  export interface listaClimaPorDiaInterfaz {
    listaClimaPorDiaInterfaz: ClimaPorDia[];
  }
  
  export interface DatosClimaActuales {
    temperatura: number;
    sensacionTermica: number;
    humedad: number;
    descripcionClima: string;
    icono: string;
  }
  
  
  export class  Usuario {
  
    constructor()
    {}
    id: number;
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    contrasena: string;
    email: string;
    esAdmin: boolean;
  }
  
  export class  UsuarioLogin {
  
    constructor()
    {}
  
    id: number;
    contrasena: string;
    emailUsuario: string;
  }
  
  export class Producto {
    constructor()
    {}
    idProducto: string;
    nombre: string;
    detalle: string;
    precio: number;
    marca: string;
    modelo: string;
    idUsuario: number;
    esDestacado: boolean;
    cantDenuncias: number;
    tipoProducto: string;
    imagenNombre: string;
    imagenContenido: string;
    estado: string;
    imagenRepuestoNombre:string;
    imagenRepuestoContenido: string;
    tipoRepuesto: string;
  }
  
  export class Mail{
    
    constructor(){}
    id: string;
    enviado:boolean;
    idUsuarioReceptor: string;  
    titulo: string;
    cuerpo: string
  }
  