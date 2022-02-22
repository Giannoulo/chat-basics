import styled from "styled-components";

type Props = {
  fontSize: string;
  color: string;
};
const Message = styled.div`
  position: relative;
  word-wrap: break-word;
  font-size: ${(props: Props) => props.fontSize};
  max-width: 60%;
  padding: 8px 15px;
  border-radius: 15px;
  color: ${(props: Props) => props.color};
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
