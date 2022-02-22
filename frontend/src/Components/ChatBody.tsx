import React, {useRef, useEffect} from "react";
import styled from "styled-components";
import {Message} from "../Types/Message";

import Bubble from "./Bubble";

const Container = styled.div`
  background-color: #fff;
  flex: auto;
  padding: 5px 5px 15px 5px;
  width: 60%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  @media (max-width: 750px) {
    width: 98%;
  }
`;
const Time = styled.span`
  margin-top: 15px;
  font-size: 0.7rem;
  align-self: ${({sent}: {sent: boolean}) => (sent ? "flex-end" : "flex-start")};
`;
const Target = styled.div`
  margin-top: 40px;
`;

const addZero = (i: number): string => {
  if (i < 10) {
    return "0" + i.toString();
  }
  return i.toString();
};

const ChatBody = ({messages, username}: {messages: Message[]; username: string}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    /*
    Add a ref div at the end of the chatbody, when the
    element gets out of the view as more messages are added
    scroll it into view.
    */
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  return (
    <Container>
      {messages.map((messageObj) => {
        const sent = messageObj.author === username ? true : false;
        return (
          <React.Fragment key={messageObj.time}>
            <Time sent={sent}>
              {addZero(new Date(messageObj.time).getHours()) +
                ":" +
                addZero(new Date(messageObj.time).getMinutes()) +
                "  -  " +
                messageObj.author}
            </Time>
            <Bubble sent={sent} messageObj={messageObj} />
          </React.Fragment>
        );
      })}
      <Target ref={messagesEndRef} />
    </Container>
  );
};

export default ChatBody;
