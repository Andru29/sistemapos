import styled, { keyframes } from "styled-components";

// Animaciones
const textAnimation = keyframes`
  0% {
    letter-spacing: 1px;
    transform: translateX(0px);
  }
  40% {
    letter-spacing: 2px;
    transform: translateX(26px);
  }
  80% {
    letter-spacing: 1px;
    transform: translateX(32px);
  }
  90% {
    letter-spacing: 2px;
    transform: translateX(0px);
  }
  100% {
    letter-spacing: 1px;
    transform: translateX(0px);
  }
`;

const loadingAnimation = keyframes`
  0% {
    width: 16px;
    transform: translateX(0px);
  }
  40% {
    width: 100%;
    transform: translateX(0px);
  }
  80% {
    width: 16px;
    transform: translateX(64px);
  }
  90% {
    width: 100%;
    transform: translateX(0px);
  }
  100% {
    width: 16px;
    transform: translateX(0px);
  }
`;

const loading2Animation = keyframes`
  0% {
    transform: translateX(0px);
    width: 16px;
  }
  40% {
    transform: translateX(0%);
    width: 80%;
  }
  80% {
    width: 100%;
    transform: translateX(0px);
  }
  90% {
    width: 80%;
    transform: translateX(15px);
  }
  100% {
    transform: translateX(0px);
    width: 16px;
  }
`;

// Estilos del loader
const LoaderContainer = styled.div`
  width: 80px;
  height: 50px;
  position: relative;
`;

const LoaderText = styled.p`
  position: absolute;
  top: 0;
  padding: 0;
  margin: 0;
  color: rgb(3, 3, 3);
  animation: ${textAnimation} 3.5s ease both infinite;
  font-size: 0.8rem;
  letter-spacing: 1px;
`;

const Load = styled.div`
  background-color: rgb(16, 137, 211);
  border-radius: 50px;
  display: block;
  height: 16px;
  width: 16px;
  bottom: 0;
  position: absolute;
  transform: translateX(64px);
  animation: ${loadingAnimation} 3.5s ease both infinite;

  &::before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background-color: #d1c2ff;
    border-radius: inherit;
    animation: ${loading2Animation} 3.5s ease both infinite;
  }
`;

// Componente Loader
const Loader = () => {
  return (
    <LoaderContainer>
      <LoaderText>Cargando...</LoaderText>
      <Load />
    </LoaderContainer>
  );
};

export default Loader;