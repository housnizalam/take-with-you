import { useEffect, useState } from "react";

import apiConfig from "../config/apiConfig.js";
import { sendChatMessage } from "../services/chatSocketService.js";

function ChatBox({
  tripId,
  conversationId,
  currentUser,
  otherUser,
  liveMessage,
}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function loadMessages() {
      try {
        const response = await fetch(
          `${apiConfig.baseUrl}/api/messages/conversation/${conversationId}`,
        );

        if (!response.ok) {
          throw new Error("Could not load messages");
        }

        const data = await response.json();

        setMessages(data);
      } catch (error) {
        console.error("Error loading chat messages:", error);
      }
    }

    loadMessages();
  }, [conversationId]);

  useEffect(() => {
  if (!liveMessage) {
    return;
  }

  if (
    liveMessage.conversationId !== conversationId
  ) {
    return;
  }

  setMessages((previousMessages) => {
    const alreadyExists =
      previousMessages.some(
        (message) =>
          message._id === liveMessage._id,
      );

    if (alreadyExists) {
      return previousMessages;
    }

    return [
      ...previousMessages,
      liveMessage,
    ];
  });
}, [liveMessage, conversationId]);

  async function handleSend(event) {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText || isSending) {
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(`${apiConfig.baseUrl}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          tripId,
          fromUserId: currentUser.id,
          toUserId: otherUser.id,
          text: trimmedText,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not send message");
      }

      const savedMessage = await response.json();

      setMessages((previousMessages) => [...previousMessages, savedMessage]);

      setText("");

      sendChatMessage(otherUser.id, savedMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div>
      <h3>Chat with {otherUser.name}</h3>

      <div>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.fromUserId === currentUser.id;

            return (
              <div key={message._id}>
                <strong>{isOwnMessage ? "You" : otherUser.name}:</strong>{" "}
                {message.text}
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSend}>
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Write a message..."
        />

        <button type="submit" disabled={isSending}>
          {isSending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default ChatBox;
