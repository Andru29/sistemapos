import { Box, Typography, Container } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import imagen1 from "../images/imagen1.jpg";
import imagen2 from "../images/imagen2.jpg";
import imagen3 from "../images/imagen3.jpg";

// Estilos para el carrusel
const carouselStyles = {
    position: "relative",
    width: "100%",
    height: "500px", // Ajusta la altura según tus necesidades
    overflow: "hidden",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
};

// Estilos para las imágenes del carrusel
const imageStyles: React.CSSProperties = {
    width: "100%",
    height: "600px", // Ajusta la altura según tus necesidades
    objectFit: "cover", // Usa un valor válido para objectFit
};

// Configuración del carrusel
const carouselSettings = {
    dots: true, // Muestra los puntos de navegación
    infinite: true, // Infinito
    speed: 500, // Velocidad de transición
    slidesToShow: 1, // Muestra una imagen a la vez
    slidesToScroll: 1, // Desplaza una imagen a la vez
    autoplay: true, // Autoplay
    autoplaySpeed: 3000, // Velocidad del autoplay
};

// Array de imágenes importadas
const images = [imagen1, imagen2, imagen3];

const Inicio = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* Carrusel de imágenes */}
            <Box sx={carouselStyles}>
                <Slider {...carouselSettings}> 
                    {images.map((image, index) => (
                        <Box key={index}>
                            <img src={image} alt={`Imagen ${index + 1}`} style={imageStyles} />
                        </Box>
                    ))}
                </Slider>
            </Box>

            {/* Mensaje de bienvenida */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Bienvenido al Sistema de Gestión
                </Typography>
                <Typography variant="h5" component="h2" color="textSecondary">
                    Gestiona tus ventas, inventario y usuarios de manera eficiente.
                </Typography>
            </Box>
        </Container>
    );
};

export default Inicio;