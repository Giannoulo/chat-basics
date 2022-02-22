import styled from "styled-components";
import Message from "./Message";

const SentMessage = styled(Message)`
  background-color: ${(props) => (props.brightness === "normal" ? "#8ac926" : "#79af21")};
  align-self: flex-end;
  margin-right: 5px;
  box-shadow: -4px 4px 6px -1px rgba(0, 0, 0, 0.23);
  opacity: ${(props) => props.opacity};
  &:before {
    width: 20px;
    right: -7px;
    background-color: ${(props) => (props.brightness === "normal" ? "#8ac926" : "#79af21")};
    border-bottom-left-radius: 16px 14px;
  }
  &:after {
    width: 10px;
    background-color: #fff;
    right: -10px;
    border-bottom-left-radius: 10px;
  }
  &:before,
  &:after {
    position: absolute;
    bottom: 0;
    height: 15px;
    content: "";
  }
`;

export default SentMessage;
