import React from "react";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100px;
  width: 100%;
  background-color: #ff9f1c;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Header = ({participants}) => {
  return (
    <Container>
      You are chatting with: {participants.length === 0 ? "None" : participants.join(", ")}
    </Container>
  );
};

export default Header;
