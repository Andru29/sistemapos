import { createTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import styled from "styled-components";
import { Container, Typography, TextField, Button } from "@mui/material";

export const LoginContainer = styled(Container)(({ theme }) => ({
  maxWidth: "350px",
  background: "#F8F9FD",
  backgroundImage:
    "linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%)",
  borderRadius: "40px",
  padding: "25px 35px",
  border: "5px solid rgb(255, 255, 255)",
  boxShadow: "rgba(133, 189, 215, 0.878) 0px 30px 30px -20px",
  margin: "20px auto",
  textAlign: "center",
}));

export const SalesContainer = styled(Container)(({ theme }) => ({
  maxWidth: "350px",
  background: "#F8F9FD",
  backgroundImage:
    "linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%)",
  borderRadius: "20px",
  padding: "25px 35px",
  border: "5px solid rgb(255, 255, 255)",
  boxShadow: "rgba(133, 189, 215, 0.878) 0px 30px 30px -20px",
  textAlign: "center",
  float: "right",
}));

export const ProductsContainer = styled(Container)(({ theme }) => ({
  maxWidth: "1500px",
  background: "#F8F9FD",
  backgroundImage:
    "linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%)",
  borderRadius: "20px",
  padding: "25px 10px",
  border: "5px solid rgb(255, 255, 255)",
  boxShadow: "rgba(133, 189, 215, 0.878) 0px 30px 30px -20px",
  textAlign: "center",
  float: "left",
}));

export const HistContainer = styled(Container)(({ theme }) => ({
  width: "100%",
  background: "#F8F9FD",
  backgroundImage:
    "linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%)",
  borderRadius: "20px",
  padding: "25px 10px",
  border: "5px solid rgb(255, 255, 255)",
  boxShadow: "rgba(133, 189, 215, 0.878) 0px 30px 30px -20px",
  textAlign: "center",
  alignContent: "center",
}));

export const InpContainer = styled(Container)(({ theme }) => ({
  width: "100%",
  background: "#F8F9FD",
  backgroundImage:
    "linear-gradient(0deg, rgb(255, 255, 255) 0%, rgb(244, 247, 251) 100%)",
  borderRadius: "20px",
  padding: "25px 10px",
  border: "5px solid rgb(255, 255, 255)",
  boxShadow: "rgba(133, 189, 215, 0.878) 0px 30px 30px -20px",
  textAlign: "center",
  marginBottom: "30px",
}));

export const LoginTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  fontSize: "30px",
  color: "rgb(16, 137, 211)",
  marginBottom: "20px",
}));

export const SubTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  fontSize: "20px",
  color: "rgb(16, 137, 211)",
  marginBottom: "20px",
}));

export const TableTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  fontSize: "15px",
  color: "rgb(16, 137, 211)",
}));

export const LoginTextField = styled(TextField)(({ theme }) => ({
  background: "white",
  borderRadius: "20px",
  boxShadow: "#cff0ff 0px 10px 10px -5px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "20px",
  },
}));

export const Select = styled(TextField)(({ theme }) => ({
  background: "white",
  borderRadius: "20px",
  boxShadow: "#cff0ff 0px 10px 10px -5px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "20px",
  },
}));

export const LoginButton = styled(Button)(({ theme }) => ({
  fontWeight: "bold",
  background:
    "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
  color: "rgb(255, 255, 255) !important", // Añade !important aquí
  borderRadius: "20px",
  "&:hover": {
    color: "rgb(255, 255, 255) !important", // También para el estado hover
  },
}));

export const EditButton = styled(Button)(({ theme }) => ({
  fontWeight: "bold",
  color: "rgb(16, 137, 211)", // Color del texto igual al gradiente inicial
  borderRadius: "20px",
  border: "2px solid",
  borderColor: "rgb(16, 137, 211)", // Color del borde igual al gradiente inicial
  background: "transparent",
  "&:hover": {
    borderColor: "rgb(18, 177, 209)", // Color del hover igual al gradiente final
    background: "rgba(16, 137, 211, 0.08)", // Fondo sutil al hacer hover
  },
}));

export const AddButton = styled(Button)(({ theme }) => ({
  minWidth: "40px", // Tamaño fijo cuadrado
  width: "40px", // Mismo valor para ancho y alto
  height: "40px",
  padding: "8px", // Padding mínimo
  borderRadius: "50%", // Forma circular (alternativa: "20px" para esquinas redondeadas)
  fontWeight: "bold",
  background:
    "linear-gradient(45deg, rgb(16, 137, 211) 0%, rgb(18, 177, 209) 100%)",
  color: "white",
  "&:hover": {
    transform: "scale(1.05)", // Efecto sutil al hover
  },
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const WarningButton = styled(Button)(({ theme }) => ({
  fontWeight: "bold",
  background:
    "linear-gradient(45deg, rgb(211, 39, 16) 0%, rgb(216, 75, 75) 100%)",
  color: "white",
  borderRadius: "20px",
}));

export const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(16, 137, 211)", // Azul principal
    },
    secondary: {
      main: "rgba(133, 189, 215, 0.878)", // Morado secundario
    },
    error: {
      main: "#EF233C", // Rojo para errores
    },
    warning: {
      main: "#DD6E42", // Naranja para advertencias
    },
    success: {
      main: "#2e7d32", // Verde para éxito
    },
    background: {
      default: "#f5f5f5", // Gris claro de fondo
      paper: "#ffffff", // Blanco para las tarjetas y modales
    },
    text: {
      primary: "rgb(0,0,0)", // Gris oscuro para el texto principal
      secondary: "#757575", // Gris para el texto secundario
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif", // Fuente principal
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
    button: {
      textTransform: "none", // Evita la capitalización automática de los botones
    },
  },
  components: {
    MuiSelect: {},
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 10,
          borderRadius: 5,
          backgroundColor: "#e0e0e0",
        },
        bar: {
          borderRadius: 5,
          background:
            "linear-gradient(90deg, rgb(16, 137, 211), rgba(255, 255, 255, 0.88))", // Gradiente
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // Bordes redondeados para los botones
          padding: "10px 20px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          color: "warning",
          marginBottom: "10px",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "8px",
          padding: "20px",
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          bottom: "20px",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
        },
      },
    },
  },
});

export const FlexContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  marginRight: "10px",
});

export const FlexItem = styled(Box)({
  flex: "1 1 200px",
  minWidth: "200px",
});
