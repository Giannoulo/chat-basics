import {Socket} from "socket.io-client";
import {Message} from "../Types/Message";
import React from "react";

export const changeUsername = (
  currentMessage: string,
  socket: Socket,
  room: string,
  username: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  messages: Message[],
  setUsername: React.Dispatch<React.SetStateAction<string>>
): string => {
  let newUsername = "";
  if (currentMessage.includes("/nick ")) {
    newUsername = currentMessage.split("/nick ")[1].split(" ")[0];
    if (newUsername.length > 0) {
      socket.emit("change_username", {username: newUsername, room: room});
      setMessages(
        messages.map((message) => {
          if (message.author === username) {
            message.author = newUsername;
          }
          return message;
        })
      );
      setUsername(newUsername);
    }
  }
  return newUsername;
};

export const formatMessage = (
  currentMessage: string
): {
  remainingMessage: string;
  highlight: boolean;
  thinking: boolean;
} => {
  const formatObj = {
    remainingMessage: "",
    highlight: false,
    thinking: false,
  };
  // TODO what happens if the command is not at the start or both commands are
  // present
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

export const checkForCommands = (
  currentMessage: string,
  socket: Socket,
  room: string,
  username: string
): boolean => {
  if (currentMessage.includes("/oops")) {
    socket.emit("remove_message", {room: room, username: username});
    return true;
  } else if (currentMessage.includes("/fadelast")) {
    socket.emit("fade_message", {room: room, username: username});
    return true;
  } else if (currentMessage.includes("/countdown ")) {
    const [counter, website] = currentMessage.split("/countdown ")[1].split(" ");
    socket.emit("countdown", {room: room, counter: counter, website: website});
    return true;
  } else {
    return false;
  }
};
