import styled from "styled-components";
import Message from "./Message";

const ReceivedMessage = styled(Message)`
  background: #d2d2d2;
  box-shadow: 4px 4px 6px -1px rgba(0, 0, 0, 0.23);
  align-self: flex-start;
  &:before {
    width: 20px;
    left: -7px;
    background-color: #d2d2d2;
    border-bottom-right-radius: 16px 14px;
  }
  &:after {
    width: 10px;
    background-color: #fff;
    left: -10px;
    border-bottom-right-radius: 10px;
  }
`;

export default ReceivedMessage;
