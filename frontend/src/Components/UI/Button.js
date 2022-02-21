import styled from "styled-components";

const Button = styled.button`
  /* background-image: linear-gradient(#0dccea, #0d70ea); */
  background-color: #2ec4b6;
  border: 0;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.3) 0 5px 15px;
  color: #fff;
  cursor: pointer;
  font-size: 1.2rem;
  margin: 15px;
  padding: 10px 15px;
  text-align: center;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  :active {
    transform: translate(2px, 2px);
  }
`;

export default Button;
