export interface Producto {
    id?: number;
    codigo_barra: string;
    nombre: string;
    unidades_por_caja: number;
    cantidad_cajas: number;
    cantidad_pastas: number;
    venta_por_pasta: boolean;
    valor_caja: number;
    valor_pasta: number;
    venta_caja: number;
    venta_pasta: number;
    stock_cajas: number;
    stock_pastas: number;
    iva: "19%";
    total?: number;
    registro_invima?: string; // Asegúrate de que sea opcional si corresponde
    // ... (otros campos)
  }

export interface Venta {
  id: number;
  productos: string | Producto[];
  total: number;
  metodo_pago: string;
  fecha: string;
}