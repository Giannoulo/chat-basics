import React from "react";
import styled from "styled-components";
const Container = styled.div`
  position: relative;
  & div {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: #cccccc;
    float: left;
    margin: 0 2px 9px 0px;
  }
  & .ball1 {
    z-index: 1;
    animation: bounce 1s infinite ease-in;
  }
  & .ball2 {
    animation: bounce 1s infinite ease-in-out;
    animation-delay: 0.2s;
  }
  & .ball3 {
    animation: bounce 1s infinite ease-in-out;
    animation-delay: 0.4s;
  }
  & .ball4 {
    animation: bounce 1s infinite ease-out;
    animation-delay: 0.6s;
  }

  @keyframes bounce {
    0%,
    15% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(0, -10px);
    }
    85%,
    100% {
      transform: translate(0, 0);
    }
  }
`;
const TypingNotification = () => {
  return (
    <Container>
      <div className="ball1"></div>
      <div className="ball2"></div>
      <div className="ball3"></div>
      <div className="ball4"></div>
    </Container>
  );
};

export default TypingNotification;
