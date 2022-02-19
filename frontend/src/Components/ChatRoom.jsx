import React, {useState, useEffect} from "react";
import styled from "styled-components";
import ChatBody from "./ChatBody";
import Header from "./Header";
import Button from "./UI/Button";
import Input from "./UI/Input";

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 15px;
`;

const Form = styled.form`
  width: 60%;
  position: relative;
`;

const StyledInput = styled(Input)`
  width: 100%;
`;
const StyledButton = styled(Button)`
  position: absolute;
  right: 0px;
`;
const ChatRoom = ({socket, username, room}) => {
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
    });

    // TODO Unsubscribe
    // return () => {
    //   second
    // }
  }, [socket]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
    }
  };
  return (
    <Container>
      <Header participant="George" />
      <ChatBody />
      <Form onSubmit={sendMessage}>
        <StyledInput
          type="text"
          placeholder="Message..."
          onChange={(event) => setCurrentMessage(event.target.value)}
        />
        <StyledButton>&#9658;</StyledButton>
      </Form>
    </Container>
  );
};

export default ChatRoom;
