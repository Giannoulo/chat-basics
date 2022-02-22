import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 3rem;
  animation-name: splash;
  animation-duration: 1s;
  animation-timing-function: ease-out;
  animation-iteration-count: infinite;
  @keyframes splash {
    0%,
    100% {
      transform: scale(1);
      opacity: 0;
      color: inherit;
    }
    50% {
      transform: scale(2);
      opacity: 0.8;
      color: #db0000;
    }
  }
`;
const CountdownModal = ({ counter, setCounter }) => {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (counter > 0) {
      setCountdown(counter);
      setCounter(0);
    }
  }, [counter, setCounter]);

  useEffect(() => {
    let countdownInterval;
    if (countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearInterval(countdownInterval);
  }, [countdown]);

  return <>{countdown > 0 && <Container>{countdown}</Container>}</>;
};

export default CountdownModal;
