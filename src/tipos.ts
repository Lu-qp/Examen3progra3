export interface Paquete {
  id: number;
  nombre: string;
  descripcion: string | null;
  precioColones: number;
}

export interface ServicioIncluido {
  id: number;
  orden: number;
  servicio: {
    nombre: string;
    descripcion: string | null;
  };
}

export interface DetallePaquete extends Paquete {
  paquetesServicios: ServicioIncluido[];
}

export interface ProductoAdicional {
  nombre: string;
  descripcion: string | null;
  imagenUrl: string | null;
}

export interface OpcionAdicional {
  id: number;
  productoAdicionalId: number;
  nombre: string;
  precioVentaColones: number;
  productoAdicional: ProductoAdicional;
}
