import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 100px;
  width: 100%;
  background-image: linear-gradient(#0dccea, #0d70ea);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Header = ({participant}) => {
  return <Container>You are chatting with: {participant}</Container>;
};

export default Header;
