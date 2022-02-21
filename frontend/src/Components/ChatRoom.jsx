import React, {useState, useEffect, useRef} from "react";
import styled from "styled-components";
import ChatBody from "./ChatBody";
import Header from "./Header";
import Button from "./UI/Button";
import Input from "./UI/Input";

const Container = styled.div`
  max-height: 100%;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const Form = styled.form`
  width: 60%;
  position: relative;
  @media (max-width: 750px) {
    width: 98%;
  }
`;

const StyledInput = styled(Input)`
  width: 100%;
  margin-bottom: 15px;
`;
const StyledButton = styled(Button)`
  position: absolute;
  right: 0px;
`;
const ChatRoom = ({socket, username, room}) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    console.log(socket);
    socket.on("receive_message", (data) => {
      console.log("receive_message", data);
      if (isMounted.current) {
        setMessages([...messages, data]);
      }
    });
    socket.on("room_clients", (data) => {
      // Avoid setting state if the component has been unmounted
      if (isMounted.current) {
        const otherParticipants = data.filter((participant) => participant !== username);
        if (otherParticipants !== participants) {
          setParticipants(otherParticipants);
        }
      }
    });
    return () => {
      isMounted.current = false;
      // Remove event listeners on cleanup
      socket.off("receive_message");
      socket.off("room_clients");
    };
  }, [socket, username, participants, messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getTime(),
      };
      await socket.emit("send_message", messageData);
    }
  };
  return (
    <Container>
      <Header participants={participants} />
      <ChatBody messages={messages} username={username} />
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
