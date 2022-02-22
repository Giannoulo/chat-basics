export const changeUsername = (
  currentMessage,
  socket,
  room,
  username,
  setMessages,
  messages,
  setUsername
) => {
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
};

export const formatMessage = (currentMessage) => {
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
};

export const deleteMessage = (currentMessage, socket, room, username) => {
  if (currentMessage.includes("/oops")) {
    socket.emit("remove_message", { room: room, username: username });
    return true;
  } else {
    return false;
  }
};

export const fadeLastMessage = (currentMessage, socket, room, username) => {
  if (currentMessage.includes("/fadelast")) {
    socket.emit("fade_message", { room: room, username: username });
    return true;
  } else {
    return false;
  }
};

export const countdownTrigger = (currentMessage, socket, room) => {
  if (currentMessage.includes("/countdown ")) {
    const messageArray = currentMessage.split("/countdown ")[1].split(" ");
    socket.emit("countdown", { room: room, counter: messageArray[0], website: messageArray[1] });
    return true;
  } else {
    return false;
  }
};
