import React, {useState, useEffect, useRef} from "react";
import styled from "styled-components";

import ChatBody from "./ChatBody";
import CountdownModal from "./CountdownModal";
import Header from "./Header";
import Button from "./StyledComponents/Button";
import Input from "./StyledComponents/Input";
import TypingNotification from "./TypingNotification";
import {formatMessage, checkForCommands, changeUsername} from "../Utilities/commandFunctions";
import {Socket} from "socket.io-client";
import {Message} from "../Types/Message";

const Container = styled.div`
  max-height: 100%;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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

type Props = {
  socket: Socket;
  username: string;
  room: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
};
const ChatRoom = ({socket, username, room, setUsername}: Props) => {
  const isMounted = useRef(false);

  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [counter, setCounter] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    socket.on("receive_message", (message: Message) => {
      if (isMounted.current) {
        setMessages([...messages, message]);
      }
    });
    socket.on("remove_message", (username: string) => {
      // Delete the last user sent message
      const messageArray = [...messages];
      for (let i = messageArray.length - 1; i >= 0; i--) {
        if (messageArray[i].author === username) {
          messageArray.splice(i, 1);
          if (isMounted.current) {
            setMessages(messageArray);
            break;
          }
        }
      }
    });
    socket.on("fade_message", (username: string) => {
      // Fade out the last user sent message
      const messageArray = [...messages];
      for (let i = messageArray.length - 1; i >= 0; i--) {
        if (messageArray[i].author === username) {
          messageArray[i].opacity = 0.1;
          if (isMounted.current) {
            setMessages(messageArray);
            break;
          }
        }
      }
    });
    socket.on("countdown", (response: {counter: number; website: string}) => {
      // Trigger a countdown that redirects the user to a website
      setCounter(response.counter);
      setTimeout(() => {
        window.open(response.website, "_blank", "location=0");
      }, response.counter * 1000);
    });
    socket.on("room_clients", (participants: string[]) => {
      // Avoid setting state if the component has been unmounted
      if (isMounted.current) {
        const otherParticipants = participants.filter((participant) => participant !== username);
        if (otherParticipants !== participants) {
          setParticipants(otherParticipants);
        }
      }
    });
    socket.on("typing_notification", (someoneTyping: boolean) => {
      // Render the typing notification component when someone else in the room is typing
      setTyping(someoneTyping);
    });
    return () => {
      isMounted.current = false;
      // Remove event listeners on cleanup
      socket.off("receive_message");
      socket.off("remove_message");
      socket.off("fade_message");
      socket.off("room_clients");
      socket.off("countdown");
      socket.off("typing_notification");
    };
  }, [socket, username, participants, messages]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (currentMessage.length > 0) {
      const commandsExist = checkForCommands(currentMessage, socket, room, username);
      const newUsername = changeUsername(
        currentMessage,
        socket,
        room,
        username,
        setMessages,
        messages,
        setUsername
      );
      const formatObj = formatMessage(currentMessage);
      const messageData: Message = {
        room: room,
        author: newUsername.length > 0 ? newUsername : username,
        message:
          formatObj.remainingMessage.length > 0 ? formatObj.remainingMessage : currentMessage,
        time: new Date(Date.now()).getTime(),
        color: formatObj.thinking ? "#6e6e6e" : "#000",
        fontSize: formatObj.highlight ? "1.4rem" : "1.2rem",
        brightness: formatObj.highlight ? "darken" : "normal",
        opacity: 1,
      };
      if (!newUsername && !commandsExist) {
        socket.emit("send_message", messageData);
      }
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    if (currentMessage.length > 0) {
      socket.emit("typing_notification", {room: room, typing: true});
    } else {
      socket.emit("typing_notification", {room: room, typing: false});
    }
  }, [currentMessage, socket, room]);

  return (
    <Container>
      <Header participants={participants} />
      <ChatBody messages={messages} username={username} />
      {typing && <TypingNotification />}
      <Form onSubmit={handleSubmit}>
        <StyledInput
          type="text"
          placeholder="Message..."
          value={currentMessage}
          onChange={(event) => setCurrentMessage(event.target.value)}
        />
        <StyledButton>&#9658;</StyledButton>
      </Form>
      <CountdownModal counter={counter} setCounter={setCounter} />
    </Container>
  );
};

export default ChatRoom;
