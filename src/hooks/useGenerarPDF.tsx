import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Producto } from '../components/types';



const useGenerarPDF = () => {
  const generarTicketPDF = (
    idFactura: number, // Tipo explícito para idFactura
    venta: Producto[],
    totalFacturado: number,
    descuentoCalculado: number,
    dineroRecibido: number,
    cambio: number,
  ) => {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text("SALUD DROGAS", 80, 10);
        doc.setFontSize(10);
        doc.text(`Factura: ${idFactura}`, 10, 20);
        doc.text(`Fecha: ${new Date().toLocaleString()}`, 10, 30);
      
        autoTable(doc, { // <-- Usar autoTable correctamente
          startY: 40,
          head: [["Código", "Nombre", "Cajas", "Pastas", "Valor Caja", "Valor Pasta", "Subtotal"]],
          body: venta.map((producto) => [
            producto.codigo_barra,
            producto.nombre,
            producto.cantidad_cajas,
            producto.cantidad_pastas,
            `$${producto.valor_caja}`,
            `$${producto.valor_pasta}`,
            `$${(producto.cantidad_cajas * producto.valor_caja + producto.cantidad_pastas * producto.valor_pasta).toFixed(2)}`
          ]),
        });
      
        const finalY = (doc as any).lastAutoTable.finalY || 50;
        
        doc.text(`Descuento: $${descuentoCalculado.toFixed(2)}`, 10, finalY + 10);
        doc.text(`Total Factura: $${totalFacturado.toFixed(2)}`, 10, finalY + 20);
        doc.text(`Valor Entregado: $${dineroRecibido.toFixed(2)}`, 10, finalY + 30);
        doc.text(`Cambio: $${cambio.toFixed(2)}`, 10, finalY + 40);
        doc.text("Gracias por su compra", 70, finalY + 50);
      
        doc.save(`Factura_${idFactura}.pdf`);
  };

  return { generarTicketPDF };
};

export default useGenerarPDF;