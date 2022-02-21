import React, {useRef, useEffect} from "react";
import styled from "styled-components";
import SentMessage from "./StyledComponents/SentMessage";
import ReceivedMessage from "./StyledComponents/ReceivedMessage";

const Container = styled.div`
  background-color: #fff;
  flex: auto;
  padding: 5px;
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
  align-self: ${(props) => (props.sent ? "flex-end" : "flex-start")};
`;
const Target = styled.div`
  margin-top: 20px;
`;

const ChatBody = ({messages, username}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    /*
    Add a ref div at the end of the chatbody, when the
    element gets out of the view as more messages are added
    scroll it into view.
    */
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: "smooth"});
    }
  }, [messages]);

  return (
    <Container>
      {messages.map((messageObj) => {
        const sent = messageObj.author === username ? true : false;
        return (
          <React.Fragment key={messageObj.time}>
            <Time sent={sent}>
              {new Date(messageObj.time).getHours() +
                ":" +
                new Date(messageObj.time).getMinutes() +
                "  -  " +
                messageObj.author}
            </Time>
            {sent ? (
              <SentMessage color={messageObj.color}>{messageObj.message}</SentMessage>
            ) : (
              <ReceivedMessage color={messageObj.color}>{messageObj.message}</ReceivedMessage>
            )}
          </React.Fragment>
        );
      })}
      <Target ref={messagesEndRef} />
    </Container>
  );
};

export default ChatBody;
