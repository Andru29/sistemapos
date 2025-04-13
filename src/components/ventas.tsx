import React, {
    useState,
    useEffect,
    useRef,
  } from "react";
  import {
    Autocomplete,
    Box,
    Modal,
    Typography,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
  } from "@mui/material";
  import { createClient } from "@supabase/supabase-js";
  import { Snackbar, Alert } from "@mui/material";
  import { ThemeProvider } from "@mui/material/styles";
  import useGenerarPDF from "../hooks/useGenerarPDF";
  import TablaVenta from "./tablaVenta";
  import { Producto } from "./types";
  import {
    theme,
    LoginTitle,
    LoginTextField,
    LoginButton,
    FlexContainer,
    FlexItem,
    WarningButton,
    SalesContainer,
    ProductsContainer,
  } from "../styles";
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  import {
    // ... tus otros imports existentes
    Tabs,
    Tab,
  } from "@mui/material";
  import { useNavigation } from "../context/NavigationContext";
  
  // Definición del tipo Cliente
  type Cliente = {
    id: number;
    tipo_documento: "CC" | "NIT" | "CE" | "TI" | "PASAPORTE";
    numero_documento: string;
    dv?: string; // Dígito de verificación (solo para NIT)
    razon_social: string;
    nombre_comercial?: string;
    direccion: string;
    ciudad: string;
    departamento: string;
    pais?: string;
    telefono?: string;
    email?: string;
    regimen?:
      | "Simplificado"
      | "Común"
      | "Gran contribuyente"
      | "Autoretenedor"
      | "Régimen especial";
    responsabilidades_fiscales?: string[];
    activo?: boolean;
    fecha_creacion?: string;
  };
  
  const Ventas = () => {
    const { blockNavigation, unblockNavigation } = useNavigation();
    const [buscar, setBuscar] = useState("");
    const [productos, setProductos] = useState<Producto[]>([]);
    const [venta, setVenta] = useState<Producto[]>([]);
    const [dineroRecibido, setDineroRecibido] = useState(0);
    const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);
    const [descuentoValor, setDescuentoValor] = useState(0);
    const [metodoPago, setMetodoPago] = useState("Efectivo");
    const [errores, setErrores] = useState<{ [key: number]: string }>({});
    const [modalAbierto, setModalAbierto] = useState(false);
    const [idFacturaGenerada, setIdFacturaGenerada] = useState<number | null>(
      null
    );
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<
      "error" | "success" | "warning" | "info"
    >("error"); // o "success"
    const [loading, setLoading] = useState(false);
    const [openConfirmEliminar, setOpenConfirmEliminar] = useState(false);
    const [indexProductoAEliminar, setIndexProductoAEliminar] = useState<
      number | null
    >(null);
    const [openConfirmCancelarVenta, setOpenConfirmCancelarVenta] =
      useState(false);
    const [indiceProductoSeleccionado, setIndiceProductoSeleccionado] =
      useState(-1);
    const inputBuscarRef = useRef<HTMLInputElement>(null);
    const camposCantidadRef = useRef<HTMLInputElement[]>([]);
    const [campoCantidadEnfocado, setCampoCantidadEnfocado] = useState<
      number | null
    >(null);
  
    const [modalClienteAbierto, setModalClienteAbierto] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] =
      useState<Cliente | null>(null);
    const [nuevoCliente, setNuevoCliente] = useState({
      tipo_documento: "CC",
      numero_documento: "",
      razon_social: "",
      direccion: "",
      ciudad: "",
      departamento: "",
      pais: "",
      telefono: "",
      email: "",
      regimen: "Simplificado",
    });
    const [tabCliente, setTabCliente] = useState(0); // 0 para seleccionar, 1 para crear
  
    const crearNuevoCliente = async () => {
      try {
        setLoading(true);
  
        // Validación básica
        if (!nuevoCliente.numero_documento || !nuevoCliente.razon_social) {
          mostrarSnackbar(
            "Número de documento y razón social son obligatorios",
            "error"
          );
          return;
        }
  
        const { data, error } = await supabase
          .from("clientes")
          .insert([nuevoCliente])
          .select()
          .single();
  
        if (error) throw error;
  
        setClienteSeleccionado(data);
        setModalClienteAbierto(false);
        mostrarSnackbar("Cliente creado con éxito", "success");
  
        // Resetear formulario
        setNuevoCliente({
          tipo_documento: "CC",
          numero_documento: "",
          razon_social: "",
          direccion: "",
          ciudad: "",
          departamento: "",
          pais: "CO",
          telefono: "",
          email: "",
          regimen: "Simplificado",
        });
      } catch (error) {
        console.error("Error creando cliente:", error);
        mostrarSnackbar("Error al crear cliente. Verifica los datos.", "error");
      } finally {
        setLoading(false);
      }
    };
  
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [busquedaCliente, setBusquedaCliente] = useState("");
  
    const generarFacturaElectronica = async () => {
      if (!clienteSeleccionado) {
        mostrarSnackbar("Debe seleccionar un cliente para facturar", "error");
        return;
      }
  
      // 1. Obtener numeración disponible
      const { data: numeracion, error: errorNum } = await supabase
        .from("numeracion_facturas")
        .select("*")
        .eq("vigente", true)
        .single();
  
      if (errorNum || !numeracion) {
        mostrarSnackbar("No hay numeración disponible para facturar", "error");
        return;
      }
  
      // 2. Construir objeto factura según estándar DIAN
      const factura = {
        encabezado: {
          tipo_documento: "01", // 01 = Factura electrónica de venta
          prefijo: numeracion.prefijo,
          consecutivo: numeracion.consecutivo_actual.toString().padStart(8, "0"),
          fecha_emision: new Date().toISOString(),
          fecha_vencimiento: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          moneda: "COP",
          medio_pago:
            metodoPago === "Efectivo"
              ? "01"
              : metodoPago === "Tarjeta"
                ? "02"
                : "03",
          forma_pago: "1", // 1 = Contado
        },
        vendedor: {
          // Tus datos de empresa
          tipo_documento: "31", // 31 = NIT
          numero_documento: "900123456-7",
          razon_social: "TU EMPRESA S.A.S.",
          direccion: "Calle 123 # 45-67",
          ciudad: "Bogotá",
          departamento: "Bogotá D.C.",
          pais: "CO",
          telefono: "6011234567",
          email: "contacto@tuempresa.com",
          regimen: "48", // 48 = Simplificado
          responsabilidades: ["O-07"], // O-07 = Responsable de IVA
        },
        comprador: {
          tipo_documento:
            clienteSeleccionado.tipo_documento === "NIT" ? "31" : "13",
          numero_documento: clienteSeleccionado.numero_documento,
          razon_social: clienteSeleccionado.razon_social,
          direccion: clienteSeleccionado.direccion || "No especificada",
          ciudad: clienteSeleccionado.ciudad || "No especificada",
          departamento: clienteSeleccionado.departamento || "No especificado",
          pais: "CO",
          telefono: clienteSeleccionado.telefono || "",
          email: clienteSeleccionado.email || "",
          regimen: clienteSeleccionado.regimen || "48",
        },
        items: venta.map((producto) => ({
          codigo: producto.codigo_barra,
          descripcion: producto.nombre,
          cantidad:
            producto.cantidad_cajas +
            producto.cantidad_pastas / producto.unidades_por_caja,
          unidad_medida: "94", // 94 = Unidad
          valor_unitario: producto.valor_caja,
          subtotal:
            producto.cantidad_cajas * producto.valor_caja +
            producto.cantidad_pastas * producto.valor_pasta,
          impuestos: [
            {
              tipo: "01", // 01 = IVA
              porcentaje: producto.iva ? 19 : 0,
              valor: producto.iva
                ? (producto.cantidad_cajas * producto.valor_caja +
                    producto.cantidad_pastas * producto.valor_pasta) *
                  0.19
                : 0,
            },
          ],
        })),
        totales: {
          subtotal: totalBruto,
          descuentos: descuentoCalculado,
          impuestos: venta.reduce(
            (sum, p) =>
              sum +
              (p.iva
                ? (p.cantidad_cajas * p.valor_caja +
                    p.cantidad_pastas * p.valor_pasta) *
                  0.19
                : 0),
            0
          ),
          total: totalFacturado,
        },
      };
  
      // 3. Enviar a tu API que manejará la comunicación con la DIAN
      try {
        const response = await fetch("https://tu-api.com/generar-factura", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(factura),
        });
  
        const result = await response.json();
  
        if (result.success) {
          // Actualizar consecutivo
          await supabase
            .from("numeracion_facturas")
            .update({ consecutivo_actual: numeracion.consecutivo_actual + 1 })
            .eq("id", numeracion.id);
  
          // Guardar factura en la base de datos
          const { error } = await supabase
            .from("ventas")
            .update({
              cufe: result.cufe,
              estado_dian: result.estado,
              respuesta_dian: result.respuesta,
              qr_code: result.qr_code,
              pdf_base64: result.pdf,
              cliente_id: clienteSeleccionado.id,
            })
            .eq("id", idFacturaGenerada);
  
          mostrarSnackbar("Factura electrónica generada con éxito", "success");
        } else {
          mostrarSnackbar(`Error al generar factura: ${result.message}`, "error");
        }
      } catch (error) {
        mostrarSnackbar(
          "Error al conectar con el servicio de facturación",
          "error"
        );
      }
    };
  
    const buscarClientes = async (termino: string) => {
      if (termino.length < 2) {
        setClientes([]);
        return;
      }
  
      try {
        const { data, error } = await supabase
          .from("clientes")
          .select("*")
          .or(
            `numero_documento.ilike.%${termino}%,razon_social.ilike.%${termino}%`
          )
          .limit(10);
  
        if (error) throw error;
  
        setClientes(data || []);
      } catch (error) {
        console.error("Error buscando clientes:", error);
        mostrarSnackbar("Error al buscar clientes", "error");
      }
    };
  
    // Llamar en useEffect para búsqueda en tiempo real
    useEffect(() => {
      const timer = setTimeout(() => {
        buscarClientes(busquedaCliente);
      }, 300);
  
      return () => clearTimeout(timer);
    }, [busquedaCliente]);
  
    useEffect(() => {
      if (venta.length > 0) {
        blockNavigation();
      } else {
        unblockNavigation();
      }
  
      // Limpiar al desmontar
      return () => {
        unblockNavigation();
      };
    }, [venta]);
  
    const totalBruto = venta.reduce((sum, producto) => {
      return (
        sum +
        producto.cantidad_cajas * producto.valor_caja +
        producto.cantidad_pastas * producto.valor_pasta
      );
    }, 0);
    const descuentoCalculado =
      descuentoPorcentaje > 0
        ? (totalBruto * descuentoPorcentaje) / 100
        : descuentoValor;
    const totalFacturado = totalBruto - descuentoCalculado;
    const cambio = dineroRecibido > 0 ? dineroRecibido - totalFacturado : 0;
  
    const mostrarSnackbar = (
      mensaje: string,
      severidad: "error" | "success" | "warning" | "info" = "error"
    ) => {
      setSnackbarMessage(mensaje);
      setSnackbarSeverity(severidad);
      setSnackbarOpen(true);
    };
  
    const cerrarSnackbar = () => {
      setSnackbarOpen(false);
    };
  
    const { generarTicketPDF } = useGenerarPDF();
    useEffect(() => {
      const buscarProductos = async () => {
        setLoading(true);
        if (!buscar.trim()) {
          setProductos([]);
          setLoading(false);
          return;
        }
        const { data, error } = await supabase
          .from("productos")
          .select("*")
          .or(`codigo_barra.eq.${buscar}, nombre.ilike.%${buscar}%`);
        if (error) {
          console.error("Error buscando producto:", error);
          setLoading(false);
          return;
        }
        setLoading(false);
        setProductos(data || []);
      };
      const delayDebounce = setTimeout(() => {
        buscarProductos();
      }, 300);
      return () => clearTimeout(delayDebounce);
    }, [buscar]);
  
    const agregarProductoAVenta = (producto: Producto) => {
      if (
        !producto ||
        venta.some((p) => p.codigo_barra === producto.codigo_barra)
      ) {
        return;
      }
  
      setVenta([
        ...venta,
        {
          ...producto,
          stock_cajas: producto.cantidad_cajas,
          stock_pastas: producto.cantidad_pastas,
          cantidad_cajas: 0,
          cantidad_pastas: 0,
        },
      ]);
      setBuscar("");
      setProductos([]);
      setIndiceProductoSeleccionado(-1); // Resetear la selección
      if (inputBuscarRef.current) {
        inputBuscarRef.current.focus(); // Volver a enfocar el campo de búsqueda
      }
    };
  
    const actualizarCantidad = (
      index: number,
      campo: "cantidad_cajas" | "cantidad_pastas",
      valor: number
    ) => {
      if (valor < 0 || isNaN(valor)) {
        mostrarSnackbar("La cantidad debe ser un número positivo.");
        return;
      }
      setVenta((prevVenta) => {
        return prevVenta.map((producto, i) => {
          if (i === index) {
            const productoActualizado = { ...producto };
  
            if (campo === "cantidad_cajas") {
              if (valor > producto.stock_cajas) {
                mostrarSnackbar(
                  `Stock insuficiente. Máximo: ${producto.stock_cajas} cajas`
                );
                productoActualizado.cantidad_cajas =
                  productoActualizado.stock_cajas;
              } else {
                productoActualizado.cantidad_cajas = valor;
              }
            } else if (campo === "cantidad_pastas") {
              const stockTotalPastas =
                productoActualizado.stock_cajas *
                  productoActualizado.unidades_por_caja +
                productoActualizado.stock_pastas;
              if (valor > stockTotalPastas) {
                mostrarSnackbar(
                  `Stock insuficiente. Máximo: ${stockTotalPastas} pastas`
                );
                productoActualizado.cantidad_pastas = stockTotalPastas;
              } else {
                productoActualizado.cantidad_pastas = valor;
              }
            }
  
            setErrores((prevErrores) => ({
              ...prevErrores,
              [index]: "",
            }));
  
            return productoActualizado;
          }
          return producto;
        });
      });
    };
  
    const eliminarProductoDeVenta = (index: number) => {
      setIndexProductoAEliminar(index);
      setOpenConfirmEliminar(true);
    };
  
    const confirmarEliminarProducto = () => {
      if (indexProductoAEliminar !== null) {
        setVenta((prevVenta) =>
          prevVenta.filter((_, i) => i !== indexProductoAEliminar)
        );
        setIndexProductoAEliminar(null);
        setOpenConfirmEliminar(false);
      }
    };
  
    const confirmarCancelarVenta = () => {
      setVenta([]);
      setOpenConfirmCancelarVenta(false);
      unblockNavigation(); // Desbloquear al cancelar
    };
  
    useEffect(() => {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (venta.length > 0) {
          e.preventDefault();
          e.returnValue =
            "Tienes una venta en curso. ¿Estás seguro de querer salir?";
          return e.returnValue;
        }
      };
  
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [venta]);
  
    const facturarVenta = async () => {
      if (dineroRecibido < 0 || isNaN(dineroRecibido)) {
        mostrarSnackbar("El dinero recibido debe ser un número positivo.");
        return;
      }
      if (venta.length === 0) {
        mostrarSnackbar("No hay productos en la venta.");
        return;
      }
  
      if (isNaN(descuentoPorcentaje) || isNaN(descuentoValor)) {
        mostrarSnackbar("Los descuentos deben ser valores numéricos.");
        return;
      }
  
      if (dineroRecibido < totalFacturado) {
        mostrarSnackbar("El dinero recibido es insuficiente.");
        return;
      }
  
      const ventaData = venta.map((producto) => ({
        codigo_barra: producto.codigo_barra,
        nombre: producto.nombre,
        cantidad_cajas: producto.cantidad_cajas,
        valor_caja: producto.valor_caja,
        cantidad_pastas: producto.cantidad_pastas,
        valor_pasta: producto.valor_pasta,
        total:
          producto.cantidad_cajas * producto.valor_caja +
          producto.cantidad_pastas * producto.valor_pasta,
      }));
  
      if (dineroRecibido < totalFacturado) {
        mostrarSnackbar("El dinero recibido es insuficiente.");
        return;
      }
  
      setLoading(true);
      const { data, error } = await supabase
        .from("ventas")
        .insert([
          {
            productos: ventaData, // JSONB puede recibir un array directamente
            total: totalFacturado,
            metodo_pago: metodoPago,
          },
        ])
        .select("*"); // Asegura que devuelva todos los datos
  
      if (error) {
        console.error("Error al guardar la venta:", error);
        alert("Error al procesar la venta. Por favor, inténtalo de nuevo.");
        return;
      }
  
      if (!data || data.length === 0) {
        console.error("No se recibió un ID de factura");
        return;
      }
  
      const idFactura = data[0]?.id;
      if (!idFactura) {
        console.error("ID de factura no disponible", data);
        return;
      }
  
      // Llamar a la función para actualizar el stock
      await actualizarStock(venta);
      //actualizarStockDespuesDeVenta(venta);
      setLoading(false);
      setIdFacturaGenerada(idFactura); // Guardamos el ID de la factura
      setModalAbierto(true); // Abrimos el modal
      generarTicketPDF(
        idFactura,
        venta,
        totalFacturado,
        descuentoCalculado,
        dineroRecibido,
        cambio
      );
      setVenta([]); // Limpiar la venta después de facturar
      mostrarSnackbar("Venta realizada con éxito", "success");
      unblockNavigation();
    };
  
    const actualizarStock = async (productosVendidos: Producto[]) => {
      setLoading(true);
  
      for (const producto of productosVendidos) {
        console.log(producto);
        if (producto.unidades_por_caja > 0) {
          let stockTotalPastasRestante =
            producto.stock_cajas * producto.unidades_por_caja +
            producto.stock_pastas -
            (producto.cantidad_cajas * producto.unidades_por_caja +
              producto.cantidad_pastas);
  
          // Asegurar que el stock restante de pastas no sea negativo
          if (stockTotalPastasRestante < 0) {
            stockTotalPastasRestante = 0;
          }
  
          const nuevasCajasDisponibles = Math.floor(
            stockTotalPastasRestante / producto.unidades_por_caja
          );
          const nuevasPastasDisponibles =
            stockTotalPastasRestante % producto.unidades_por_caja;
  
          const { error } = await supabase
            .from("productos")
            .update({
              cantidad_cajas: nuevasCajasDisponibles,
              cantidad_pastas: nuevasPastasDisponibles,
            })
            .eq("codigo_barra", producto.codigo_barra);
  
          if (error) {
            console.error(
              `Error actualizando stock para ${producto.nombre}:`,
              error
            );
          }
        } else {
          const { error } = await supabase
            .from("productos")
            .update({
              cantidad_cajas: producto.stock_cajas - producto.cantidad_cajas,
            })
            .eq("codigo_barra", producto.codigo_barra);
  
          if (error) {
            console.error(
              `Error actualizando stock para ${producto.nombre}:`,
              error
            );
          }
        }
      }
      setLoading(false);
    };
  
    useEffect(() => {
      const manejarKeyDown = (evento: KeyboardEvent) => {
        if (evento.key === "ArrowDown") {
          if (productos.length > 0) {
            setIndiceProductoSeleccionado((indiceActual) =>
              Math.min(indiceActual + 1, productos.length - 1)
            );
          }
        } else if (evento.key === "ArrowUp") {
          if (productos.length > 0) {
            setIndiceProductoSeleccionado((indiceActual) =>
              Math.max(indiceActual - 1, 0)
            );
          }
        } else if (evento.key === "Enter" && indiceProductoSeleccionado !== -1) {
          agregarProductoAVenta(productos[indiceProductoSeleccionado]);
          setIndiceProductoSeleccionado(-1);
          setBuscar("");
        } else if (evento.key === "F12") {
          facturarVenta();
        } else if (evento.key === "Escape") {
          setOpenConfirmCancelarVenta(true);
        } else if (evento.key === "Tab") {
          if (campoCantidadEnfocado !== null) {
            evento.preventDefault();
            const siguienteCampo =
              camposCantidadRef.current[campoCantidadEnfocado + 1];
            if (siguienteCampo) {
              siguienteCampo.focus();
              setCampoCantidadEnfocado(campoCantidadEnfocado + 1);
            }
          }
        }
      };
  
      window.addEventListener("keydown", manejarKeyDown);
  
      return () => {
        window.removeEventListener("keydown", manejarKeyDown);
      };
    }, [
      productos,
      indiceProductoSeleccionado,
      agregarProductoAVenta,
      facturarVenta,
      campoCantidadEnfocado,
    ]);
  
    useEffect(() => {
      if (inputBuscarRef.current) {
        inputBuscarRef.current.focus();
      }
    }, []);
  
    const manejarEnfoqueCantidad = (index: number) => {
      setCampoCantidadEnfocado(index);
    };
  
    return (
      <ThemeProvider theme={theme}>
        <ProductsContainer maxWidth="xl">
          {loading && <LinearProgress sx={{ mb: 2 }} />}
          <Autocomplete
            freeSolo
            open={productos.length > 0}
            options={productos}
            value={buscar}
            getOptionLabel={(option) => {
              if (typeof option === "string") {
                return option; // Manejar el caso de string si freeSolo está activado.
              } else if (option && option.nombre && option.codigo_barra) {
                return `${option.nombre} - ${option.codigo_barra}`;
              } else {
                return "";
              }
            }}
            loading={loading}
            onInputChange={(event, newInputValue) => {
              setBuscar(newInputValue);
              if (newInputValue === "") {
                setProductos([]);
              }
            }}
            onChange={(event, newValue) => {
              if (
                newValue &&
                typeof newValue !== "string" &&
                "nombre" in newValue
              ) {
                agregarProductoAVenta(newValue);
                setBuscar(""); // Borra el campo despues de seleccionar
                setProductos([]);
              }
            }}
            renderOption={(props, option, { selected }) => (
              <Box
                component="li"
                {...props}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding={1}
                sx={{
                  borderBottom: "1px solid #ddd",
                  backgroundColor: selected
                    ? "#e0e0e0"
                    : indiceProductoSeleccionado === productos.indexOf(option)
                      ? "#f0f0f0"
                      : "inherit",
                }}
              >
                <Box>
                  <strong>{option.nombre}</strong> <br />
                  <small>Código: {option.codigo_barra}</small>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#f8f9fa",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontSize: "12px",
                    textAlign: "center",
                    minWidth: "80px",
                  }}
                >
                  Cajas: {option.cantidad_cajas} <br />
                  Pastas: {option.cantidad_pastas}
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <LoginTextField
                {...params}
                color="secondary"
                label="Buscar producto"
                variant="outlined"
                fullWidth
                placeholder="Escanea el código de barras o ingresa el nombre..."
                inputRef={inputBuscarRef}
              />
            )}
            style={{ marginBottom: "10px" }}
          />
          <TablaVenta
            venta={venta}
            errores={errores}
            actualizarCantidad={actualizarCantidad}
            eliminarProductoDeVenta={eliminarProductoDeVenta}
            camposCantidadRef={camposCantidadRef}
            manejarEnfoqueCantidad={manejarEnfoqueCantidad}
          />
        </ProductsContainer>
        <SalesContainer maxWidth="xs">
          {/* Contenedor General */}
          <FlexContainer>
            {/* Sección de Facturación */}
            <Box flex={1} display="flex" flexDirection="column" gap={2}>
              <FlexContainer>
                <FlexItem>
                  <LoginTextField
                    color="secondary"
                    label="Descuento (%)"
                    type="number"
                    fullWidth
                    value={descuentoPorcentaje || ""}
                    onChange={(e) =>
                      setDescuentoPorcentaje(Number(e.target.value) || 0)
                    }
                  />
                  <LoginTextField
                    color="secondary"
                    label="Descuento ($)"
                    type="number"
                    fullWidth
                    value={descuentoValor || ""}
                    onChange={(e) =>
                      setDescuentoValor(Number(e.target.value) || 0)
                    }
                  />
                </FlexItem>
              </FlexContainer>
  
              <LoginTitle>
                Total Facturado: ${totalFacturado.toFixed(2)}
              </LoginTitle>
              <LoginTextField
                color="secondary"
                label="Dinero Recibido"
                type="number"
                fullWidth
                value={dineroRecibido || ""}
                onChange={(e) => setDineroRecibido(Number(e.target.value) || 0)}
              />
              {dineroRecibido > 0 && (
                <LoginTitle>Cambio: ${cambio.toFixed(2)}</LoginTitle>
              )}
  
              {/* Selección del Método de Pago */}
              <FormControl fullWidth color="secondary">
                <Select
                  sx={{
                    background: "white",
                    borderRadius: "20px",
                    boxShadow: "#cff0ff 0px 10px 10px -5px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                    },
                  }}
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                >
                  <MenuItem value="Efectivo">Efectivo</MenuItem>
                  <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                  <MenuItem value="Mixto">Mixto</MenuItem>
                </Select>
              </FormControl>
  
              <WarningButton
                variant="contained"
                color="warning"
                onClick={() => setOpenConfirmCancelarVenta(true)}
              >
                Cancelar Venta
              </WarningButton>
  
              <Box mb={2}>
                {clienteSeleccionado ? (
                  <Box>
                    <Typography>
                      Cliente: {clienteSeleccionado.razon_social}
                    </Typography>
                    <LoginButton onClick={() => setModalClienteAbierto(true)}>
                      Cambiar Cliente
                    </LoginButton>
                  </Box>
                ) : (
                  <LoginButton
                    variant="outlined"
                    onClick={() => setModalClienteAbierto(true)}
                  >
                    Seleccionar Cliente
                  </LoginButton>
                )}
              </Box>
  
              <LoginButton
                variant="contained"
                color="secondary"
                onClick={facturarVenta}
              >
                Facturar
              </LoginButton>
            </Box>
          </FlexContainer>
  
          <Modal open={modalAbierto} onClose={() => setModalAbierto(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 300,
                bgcolor: "background.paper",
                p: 3,
                borderRadius: 2,
                boxShadow: 24,
              }}
            >
              <LoginTitle variant="h6" gutterBottom>
                Venta realizada con éxito
              </LoginTitle>
              <Typography variant="body1">
                ID de la factura: <strong>{idFacturaGenerada}</strong>
              </Typography>
              <WarningButton
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => setModalAbierto(false)}
              >
                Cerrar
              </WarningButton>
            </Box>
          </Modal>
  
          {/* Modal para seleccionar/crear cliente */}
          <Modal
            open={modalClienteAbierto}
            onClose={() => setModalClienteAbierto(false)}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 3,
                borderRadius: 2,
              }}
            >
              <Tabs
                value={tabCliente}
                onChange={(event: React.SyntheticEvent, newValue: number) =>
                  setTabCliente(newValue)
                }
                variant="fullWidth"
              >
                <Tab label="Seleccionar Cliente" />
                <Tab label="Crear Nuevo Cliente" />
              </Tabs>
  
              {tabCliente === 0 ? (
                // Contenido para seleccionar cliente existente
                <Box sx={{ mt: 2 }}>
                  <Autocomplete
                    options={clientes}
                    getOptionLabel={(cliente) =>
                      `${cliente.razon_social} (${cliente.tipo_documento} ${cliente.numero_documento})`
                    }
                    renderInput={(params) => (
                      <LoginTextField
                        {...params}
                        label="Buscar cliente"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                    onChange={(event, value) => {
                      if (value) {
                        setClienteSeleccionado(value);
                        setModalClienteAbierto(false);
                      }
                    }}
                  />
                </Box>
              ) : (
                // Contenido para crear nuevo cliente
                <Box
                  component="form"
                  sx={{ mt: 2 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    crearNuevoCliente();
                  }}
                >
                  <LoginTextField
                    select
                    label="Tipo de Documento"
                    value={nuevoCliente.tipo_documento}
                    onChange={(e) =>
                      setNuevoCliente({
                        ...nuevoCliente,
                        tipo_documento: e.target.value as any,
                      })
                    }
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                    <MenuItem value="NIT">NIT</MenuItem>
                    <MenuItem value="CE">Cédula de Extranjería</MenuItem>
                    <MenuItem value="TI">Tarjeta de Identidad</MenuItem>
                    <MenuItem value="PASAPORTE">Pasaporte</MenuItem>
                  </LoginTextField>
  
                  <LoginTextField
                    label="Número de Documento"
                    value={nuevoCliente.numero_documento}
                    onChange={(e) =>
                      setNuevoCliente({
                        ...nuevoCliente,
                        numero_documento: e.target.value,
                      })
                    }
                    fullWidth
                    margin="normal"
                    required
                  />
  
                  {/* Resto de campos del formulario... */}
  
                  <LoginButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Guardar Cliente
                  </LoginButton>
                </Box>
              )}
            </Box>
          </Modal>
  
          <Dialog
            open={openConfirmEliminar}
            onClose={() => setOpenConfirmEliminar(false)}
          >
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogContent>
              <Typography>
                ¿Estás seguro de que deseas eliminar este producto de la venta?
              </Typography>
            </DialogContent>
            <DialogActions>
              <LoginButton
                onClick={() => setOpenConfirmEliminar(false)}
                color="secondary"
              >
                Cancelar
              </LoginButton>
              <WarningButton onClick={confirmarEliminarProducto} color="error">
                Eliminar
              </WarningButton>
            </DialogActions>
          </Dialog>
  
          <Dialog
            open={openConfirmCancelarVenta}
            onClose={() => setOpenConfirmCancelarVenta(false)}
          >
            <DialogTitle>Confirmar Cancelación</DialogTitle>
            <DialogContent>
              <Typography>
                ¿Estás seguro de que deseas cancelar la venta?
              </Typography>
            </DialogContent>
            <DialogActions>
              <LoginButton
                onClick={() => setOpenConfirmCancelarVenta(false)}
                color="secondary"
              >
                Cancelar
              </LoginButton>
              <WarningButton onClick={confirmarCancelarVenta} color="error">
                Confirmar
              </WarningButton>
            </DialogActions>
          </Dialog>
  
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={cerrarSnackbar}
          >
            <Alert
              onClose={cerrarSnackbar}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </SalesContainer>
      </ThemeProvider>
    );
  };
  
  export default Ventas;
  