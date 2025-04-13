import {
  AppBar,
  Toolbar,
  CssBaseline,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import {
  Home as HomeIcon,
  Inventory as InventoryIcon,
  BarChart as BarChartIcon,
  PointOfSale as PointOfSaleIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import React, { Suspense, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../styles";


const Inicio = React.lazy(() => import("./inicio"));

const MenuPrincipal = () => {
  const [openConfirmLogOut, setOpenConfirmLogOut] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { text: "Inicio", section: "inicio", icon: <HomeIcon /> },
    { text: "Ventas", section: "ventas", icon: <PointOfSaleIcon /> },
    {
      text: "Historial Ventas",
      section: "historialventas",
      icon: <BarChartIcon />,
    },
    { text: "Usuarios", section: "usuarios", icon: <PersonIcon /> },
    {
      text: "Ingreso Mercancia",
      section: "ingresoMercancia",
      icon: <InventoryIcon />,
    },
  ];

  const cambiarSeccion = (seccion: string) => {
    // Simulamos carga con timeout
    setTimeout(() => {
      navigate(`/${seccion}`);
    }, 500);
  };

  const handleLogout = () => {
    // Lógica básica de logout sin AuthContext
    localStorage.removeItem("user"); // Opcional: si guardabas algo en localStorage
    navigate("/login");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* Barra de navegación superior */}
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: theme.palette.primary.main,
            transition: "0.3s",
          }}
        >
          <Toolbar>
            {/* Botones de navegación en la barra superior */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.section}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => cambiarSeccion(item.section)}
                  sx={{ textTransform: "none" }}
                >
                  {item.text}
                </Button>
              ))}
              <Button
                color="inherit"
                startIcon={<ExitToAppIcon />}
                onClick={handleLogout}
                sx={{ textTransform: "none" }}
              >
                Cerrar Sesión
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: "64px",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Suspense fallback={<div>Cargando...</div>}>
            <Routes>
              <Route path="inicio" element={<Inicio />} />
            </Routes>
          </Suspense>
        </Box>
      </Box>

      {/* Diálogo de confirmación de cierre de sesión */}
      <Dialog
        open={openConfirmLogOut}
        onClose={() => setOpenConfirmLogOut(false)}
      >
        <DialogTitle>Confirmar Cierre de Sesión</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas cerrar sesión?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmLogOut(false)} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleLogout}
            color="error"
            startIcon={<ExitToAppIcon />}
          >
            Cerrar Sesión
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default MenuPrincipal;
