import styled from "styled-components";

const Input = styled.input`
  padding: 20px 10px;
  color: #636363;
  font-size: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  &:focus-visible {
    border: 1px solid #777777;
    outline: none;
  }
`;

export default Input;
