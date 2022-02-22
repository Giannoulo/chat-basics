import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import ChatBody from "./ChatBody";
import CountdownModal from "./CountdownModal";
import Header from "./Header";
import Button from "./StyledComponents/Button";
import Input from "./StyledComponents/Input";
import TypingNotification from "./TypingNotification";

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

const ChatRoom = ({ socket, username, room, setUsername }) => {
  const isMounted = useRef(false);

  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [counter, setCounter] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    socket.on("receive_message", (data) => {
      if (isMounted.current) {
        setMessages([...messages, data]);
      }
    });
    socket.on("remove_message", (username) => {
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
    socket.on("fade_message", (username) => {
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
    socket.on("countdown", (data) => {
      // Trigger a countdown that redirects the user to a website
      setCounter(data.counter);
      setTimeout(() => {
        window.open(data.website, "_blank", "location=0");
      }, data.counter * 1000);
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
    socket.on("typing_notification", (someoneTyping) => {
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

  const changeUsername = useCallback(() => {
    if (currentMessage.includes("/nick ")) {
      const newUsername = currentMessage.split("/nick ")[1].split(" ")[0];
      if (newUsername.length > 0) {
        socket.emit("change_username", { username: newUsername, room: room });
        setMessages(
          messages.map((message) => {
            if (message.author === username) {
              message.author = newUsername;
              return message;
            } else {
              return message;
            }
          })
        );
        setUsername(newUsername);
        return newUsername;
      } else {
        return null;
      }
    }
  }, [currentMessage, messages, room, setUsername, socket, username]);

  const formatMessage = useCallback(() => {
    const formatObj = {
      remainingMessage: "",
      highlight: false,
      thinking: false,
    };
    if (currentMessage.includes("/think ")) {
      formatObj.remainingMessage = currentMessage.split("/think ")[1];
      formatObj.thinking = true;
      return formatObj;
    } else if (currentMessage.includes("/highlight ")) {
      formatObj.remainingMessage = currentMessage.split("/highlight ")[1];
      formatObj.highlight = true;
      return formatObj;
    } else {
      return formatObj;
    }
  }, [currentMessage]);

  const deleteMessage = useCallback(() => {
    if (currentMessage.includes("/oops")) {
      socket.emit("remove_message", { room: room, username: username });
      return true;
    } else {
      return false;
    }
  }, [currentMessage, room, socket, username]);

  const fadeLastMessage = useCallback(() => {
    if (currentMessage.includes("/fadelast")) {
      socket.emit("fade_message", { room: room, username: username });
      return true;
    } else {
      return false;
    }
  }, [currentMessage, room, socket, username]);

  const countdownTrigger = useCallback(() => {
    if (currentMessage.includes("/countdown ")) {
      const messageArray = currentMessage.split("/countdown ")[1].split(" ");
      socket.emit("countdown", { room: room, counter: messageArray[0], website: messageArray[1] });
      return true;
    } else {
      return false;
    }
  }, [currentMessage, socket, room]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentMessage !== "") {
      const deletedMessage = deleteMessage();
      const newUsername = changeUsername();
      const fadedMessage = fadeLastMessage();
      const countdown = countdownTrigger();

      const formatObj = formatMessage();

      const messageData = {
        room: room,
        author: newUsername ? newUsername : username,
        message: formatObj.remainingMessage ? formatObj.remainingMessage : currentMessage,
        time: new Date(Date.now()).getTime(),
        color: formatObj.thinking ? "#6e6e6e" : "#000",
        fontSize: formatObj.highlight ? "1.4rem" : "1.2rem",
        brightness: formatObj.highlight ? "darken" : "normal",
        opacity: 1,
      };
      if (!newUsername && !deletedMessage && !fadedMessage && !countdown) {
        socket.emit("send_message", messageData);
      }
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    if (currentMessage.length > 0) {
      socket.emit("typing_notification", { room: room, typing: true });
    } else {
      socket.emit("typing_notification", { room: room, typing: false });
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
