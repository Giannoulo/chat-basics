import React, { useState, useEffect } from "react";

const ChatRoom = ({ socket, username, room }) => {
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

  const sendMessage = async () => {
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
    <div>
      ChatRoom
      <div>Header</div>
      <div>Chat body</div>
      <div>
        <input
          type="text"
          placeholder="Message..."
          onChange={(event) => setCurrentMessage(event.target.value)}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default ChatRoom;
