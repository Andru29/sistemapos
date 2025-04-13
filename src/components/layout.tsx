import { Outlet } from "react-router-dom";
import MenuPrincipal from "./menuPrincipal";

const Layout = () => {
  return (
    <>
      <MenuPrincipal />
      <Outlet /> {/* Esto renderizará los componentes hijos */}
    </>
  );
};

export default Layout;