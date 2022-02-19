import React, {useState, useEffect} from "react";
import io from "socket.io-client";
import styled from "styled-components";

import ChatRoom from "./Components/ChatRoom.jsx";
import Button from "./Components/UI/Button";
import Input from "./Components/UI/Input.js";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fdfdfd;
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
  const [socket, setSocket] = useState(null);
  const [room, setRoom] = useState("");
  const [joinedRoom, setJoinedRoom] = useState(false);

  useEffect(() => {
    // Initialize web socket connection
    setSocket(io.connect("http://localhost:3001"));
  }, []);

  const joinRoom = (e) => {
    e.preventDefault();
    if (room !== "") {
      socket.emit("join_room", room, function (data) {
        if (data.successfullyJoined === true) {
          setJoinedRoom(room);
        } else {
          console.log(data.error);
        }
      });
    }
  };

  return (
    <Container>
      {joinedRoom ? (
        <ChatRoom socket={socket} room={room} />
      ) : (
        <>
          <Title>Start Chatting</Title>
          <Form onSubmit={joinRoom}>
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
