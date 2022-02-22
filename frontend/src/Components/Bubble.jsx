import React, {useState, useEffect} from "react";

import SentMessage from "./StyledComponents/SentMessage";
import ReceivedMessage from "./StyledComponents/ReceivedMessage";

const Bubble = ({sent, messageObj}) => {
  const [formatedMsg, setFormatedMsg] = useState("");

  useEffect(() => {
    setFormatedMsg(
      messageObj.message.replaceAll("(smile)", "\u{1F642}").replaceAll("(wink)", "\u{1F609}")
    );
  }, [messageObj]);

  return (
    <>
      {sent ? (
        <SentMessage
          color={messageObj.color}
          opacity={messageObj.opacity}
          fontSize={messageObj.fontSize}
          brightness={messageObj.brightness}
        >
          {formatedMsg}
        </SentMessage>
      ) : (
        <ReceivedMessage
          color={messageObj.color}
          opacity={messageObj.opacity}
          fontSize={messageObj.fontSize}
          brightness={messageObj.brightness}
        >
          {formatedMsg}
        </ReceivedMessage>
      )}
    </>
  );
};

export default Bubble;
