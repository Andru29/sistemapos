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
    CircularProgress
  } from "@mui/material";
  import {
    Home as HomeIcon,
    Inventory as InventoryIcon,
    BarChart as BarChartIcon,
    PointOfSale as PointOfSaleIcon,
    Person as PersonIcon,
    ExitToApp as ExitToAppIcon
  } from "@mui/icons-material";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { ThemeProvider } from "@mui/material/styles";
  import { theme } from "../styles";
  
  const MenuPrincipal = () => {
    const [openConfirmLogOut, setOpenConfirmLogOut] = useState(false);
    const [loadingSection, setLoadingSection] = useState<string | null>(null);
    const navigate = useNavigate();
  
    const menuItems = [
      { text: "Inicio", section: "inicio", icon: <HomeIcon /> },
      { text: "Ventas", section: "ventas", icon: <PointOfSaleIcon /> },
      { text: "Historial Ventas", section: "historialventas", icon: <BarChartIcon /> },
      { text: "Usuarios", section: "usuarios", icon: <PersonIcon /> },
      { text: "Ingreso Mercancia", section: "ingresoMercancia", icon: <InventoryIcon /> },
    ];
  
    const cambiarSeccion = (seccion: string) => {
      setLoadingSection(seccion);
      // Simulamos carga con timeout
      setTimeout(() => {
        navigate(`/${seccion}`);
        setLoadingSection(null);
      }, 500);
    };
  
    const handleLogout = () => {
      // Lógica básica de logout sin AuthContext
      localStorage.removeItem('user'); // Opcional: si guardabas algo en localStorage
      navigate("/login");
    };
  
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          
          {/* Barra de navegación superior */}
          <AppBar position="fixed">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Sistema POS
              </Typography>
              
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.section}
                    color="inherit"
                    startIcon={
                      loadingSection === item.section ? 
                      <CircularProgress size={20} color="inherit" /> : 
                      item.icon
                    }
                    onClick={() => cambiarSeccion(item.section)}
                    disabled={loadingSection === item.section}
                    sx={{ textTransform: "none" }}
                  >
                    {item.text}
                  </Button>
                ))}
                
                <Button
                  color="inherit"
                  startIcon={<ExitToAppIcon />}
                  onClick={() => setOpenConfirmLogOut(true)}
                  sx={{ textTransform: "none" }}
                >
                  Cerrar Sesión
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
  
          {/* Contenido principal */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              mt: "64px",
              minHeight: "calc(100vh - 64px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            <Typography variant="h4" gutterBottom>
              Bienvenido al Sistema POS
            </Typography>
            <Typography variant="body1">
              Selecciona una sección del menú superior para comenzar
            </Typography>
          </Box>
        </Box>
  
        {/* Diálogo de confirmación de cierre de sesión */}
        <Dialog open={openConfirmLogOut} onClose={() => setOpenConfirmLogOut(false)}>
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