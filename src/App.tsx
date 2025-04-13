import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Layout from "./components/layout";
import Login from "./components/login";
import Inicio from "./components/inicio";
import MenuPrincipal from "./components/menuPrincipal";
import { theme } from "./styles"; // Asegúrate de tener este archivo

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/*" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route path="/inicio" element={<Inicio />} />

            {/* Ruta principal que envuelve todas las rutas del sistema */}
            <Route path="/sistema" element={<MenuPrincipal />}>
              <Route index element={<Login />} /> {/* Ruta por defecto */}
              {/* Agrega más rutas según necesites */}
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
