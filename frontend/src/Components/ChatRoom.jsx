import React, {useState, useEffect, useRef, useCallback} from "react";
import styled from "styled-components";
import ChatBody from "./ChatBody";
import Header from "./Header";
import Button from "./StyledComponents/Button";
import Input from "./StyledComponents/Input";

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

const ChatRoom = ({socket, username, room, setUsername}) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const isMounted = useRef(false);

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
      // Fade the last user sent message
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
      socket.off("remove_message");
      socket.off("fade_message");
      socket.off("room_clients");
    };
  }, [socket, username, participants, messages]);

  const changeUsername = useCallback(() => {
    if (currentMessage.includes("/nick ")) {
      const newUsername = currentMessage.split("/nick ")[1].split(" ")[0];
      if (newUsername.length > 0) {
        socket.emit("change_username", {username: newUsername, room: room});
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
      socket.emit("remove_message", {room: room, username: username});
      return true;
    } else {
      return false;
    }
  }, [currentMessage, room, socket, username]);

  const fadeLastMessage = useCallback(() => {
    if (currentMessage.includes("/fadelast")) {
      socket.emit("fade_message", {room: room, username: username});
      return true;
    } else {
      return false;
    }
  }, [currentMessage, room, socket, username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentMessage !== "") {
      const deletedMessage = deleteMessage();
      const newUsername = changeUsername();
      const fadedMessage = fadeLastMessage();

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
      if (!newUsername && !deletedMessage && !fadedMessage) {
        socket.emit("send_message", messageData);
      }
      setCurrentMessage("");
    }
  };

  return (
    <Container>
      <Header participants={participants} />
      <ChatBody messages={messages} username={username} />
      <Form onSubmit={handleSubmit}>
        <StyledInput
          type="text"
          placeholder="Message..."
          value={currentMessage}
          onChange={(event) => setCurrentMessage(event.target.value)}
        />
        <StyledButton>&#9658;</StyledButton>
      </Form>
    </Container>
  );
};

export default ChatRoom;
