import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Layout from "./components/layout";
import Login from "./components/login";
import Inicio from "./components/inicio";
import Ventas from "./components/ventas";
import MenuPrincipal from "./components/menuPrincipal";
import { theme } from "./styles"; // Asegúrate de tener este archivo

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<Layout />}>
            <Route path="/inicio" element={<Inicio />} />
          </Route>

          {/* Ruta principal que envuelve todas las rutas del sistema */}
          <Route path="/sistema" element={<MenuPrincipal />}>
            <Route index element={<Login />} /> {/* Ruta por defecto */}
            <Route path="ventas" element={<Ventas />} />
          </Route>

          {/* Ruta de fallback (puede ser login o 404) */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
