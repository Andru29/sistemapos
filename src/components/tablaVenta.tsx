import { useEffect } from "react";
import { LoginTextField, WarningButton } from "../styles";

import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Box, Button,
} from "@mui/material";

import { Producto } from './types';

interface TablaVentaProps {
  venta: Producto[];
  errores: { [key: number]: string };
  actualizarCantidad: (index: number, campo: "cantidad_cajas" | "cantidad_pastas", valor: number) => void;
  eliminarProductoDeVenta: (index: number) => void;
  camposCantidadRef: React.MutableRefObject<HTMLInputElement[]>;
  manejarEnfoqueCantidad: (index: number) => void;
}

const TablaVenta: React.FC<TablaVentaProps> = ({
  venta,
  actualizarCantidad,
  eliminarProductoDeVenta,
  camposCantidadRef,
  manejarEnfoqueCantidad,
}) => {
  useEffect(() => {
    camposCantidadRef.current = camposCantidadRef.current.slice(0, venta.length * 2);
  }, [venta]);

  return (
    <Box flex={3}>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Código de Barras</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Cajas Disp</TableCell>
            <TableCell>Cant Cajas</TableCell>
            <TableCell>Valor Caja</TableCell>
            <TableCell>Pastas Disp</TableCell>
            <TableCell>Cant Pastas</TableCell>
            <TableCell>Valor por Pasta</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {venta.map((option, index) => (
            <TableRow key={index}>
              <TableCell>{option.codigo_barra}</TableCell>
              <TableCell>{option.nombre}</TableCell>
              <TableCell>
                {option.stock_cajas < 5 && (
                  <span style={{ color: "orange" }}>Stock Bajo: {option.stock_cajas}</span>
                )}
                {option.stock_cajas >= 5 && option.stock_cajas}
              </TableCell>
              <TableCell>
                <LoginTextField
                  sx={{minWidth: "60px"}}
                  type="number"
                  value={option.cantidad_cajas > 0 ? option.cantidad_cajas : ""}
                  onChange={(e) => 
                    actualizarCantidad(index, "cantidad_cajas", Number(e.target.value) || 0)
                  }
                  inputProps={{ min: 0 }}
                  disabled={option.stock_cajas === 0} // Deshabilita si no hay stock
                  inputRef={(ref) => (camposCantidadRef.current[index * 2] = ref!)}
                  onFocus={() => manejarEnfoqueCantidad(index * 2)}
                />
              </TableCell>
              <TableCell>
                {(option.valor_caja).toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                })}
              </TableCell>
              <TableCell>{option.stock_pastas}</TableCell>
              <TableCell>
                <LoginTextField 
                  sx={{minWidth: "60px"}}
                  type="number"
                  value={option.cantidad_pastas > 0 ? option.cantidad_pastas : ""}
                  onChange={(e) => 
                    actualizarCantidad(index, "cantidad_pastas", Number(e.target.value) || 0)
                  }
                  inputProps={{ min: 0 }}
                  disabled={!option.venta_por_pasta}// Deshabilita si no hay stock  
                  inputRef={(ref) => (camposCantidadRef.current[index * 2 + 1] = ref!)}
                                        onFocus={() => manejarEnfoqueCantidad(index * 2 + 1)}                
                />
              </TableCell>
              <TableCell>
                {(option.valor_pasta).toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                })}
              </TableCell>
              <TableCell>
                {(option.cantidad_cajas * option.valor_caja + option.cantidad_pastas * option.valor_pasta).toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                })}
              </TableCell>
              <TableCell>
                <WarningButton 
                  variant="outlined" 
                  color="error" 
                  onClick={() => eliminarProductoDeVenta(index)}
                >
                  Eliminar
                </WarningButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
  );
};

export default TablaVenta;