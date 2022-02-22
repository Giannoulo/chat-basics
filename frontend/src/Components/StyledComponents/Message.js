import styled from "styled-components";

const Message = styled.div`
  position: relative;
  word-wrap: break-word;
  font-size: ${(props) => props.fontSize};
  max-width: 60%;
  padding: 8px 15px;
  border-radius: 15px;
  color: ${(props) => props.color};
  &:before {
    width: 20px;
  }
  &:after {
    width: 10px;
    background-color: #fff;
  }
  &:before,
  &:after {
    position: absolute;
    bottom: 0;
    height: 15px;
    content: "";
  }
`;

export default Message;
