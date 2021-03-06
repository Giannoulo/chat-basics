import React, {useState, useEffect} from "react";
import {io, Socket} from "socket.io-client";
import styled from "styled-components";

import ChatRoom from "./Components/ChatRoom";
import Button from "./Components/StyledComponents/Button";
import Input from "./Components/StyledComponents/Input";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  font-size: 22px;
  font-family: "Roboto", sans-serif;
`;
const Title = styled.span`
  font-size: 2rem;
  color: #464646;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  margin-bottom: 20px;
`;
const Form = styled.form`
  display: contents;
`;

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(false);

  useEffect(() => {
    // Initialize web socket connection
    setSocket(io("http://localhost:3001"));
  }, []);

  const joinRoom = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (room !== "" && username !== "") {
      socket?.emit("join_room", {username: username, room: room});
      setJoinedRoom(true);
    }
  };

  return (
    <Container>
      {joinedRoom && socket ? (
        <ChatRoom socket={socket} room={room} username={username} setUsername={setUsername} />
      ) : (
        <>
          <Title>Start Chatting</Title>
          <Form onSubmit={joinRoom}>
            <Input
              type="text"
              placeholder="Username..."
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <Input
              type="text"
              placeholder="Room ID..."
              onChange={(event) => {
                setRoom(event.target.value);
              }}
            />
            <Button>Join Room</Button>
          </Form>
        </>
      )}
    </Container>
  );
}

export default App;
