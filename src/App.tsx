import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Login from "./components/login";
import Inicio from "./components/inicio";
import MenuPrincipal from "./components/menuPrincipal";
import { theme } from "./styles"; // Asegúrate de tener este archivo

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Ruta para la página de inicio/login */}
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/" element={<Login />} />
          
          {/* Ruta para el sistema principal con menú */}
          <Route path="/sistema/*" element={<MenuPrincipal />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;