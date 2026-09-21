import { useEffect, useState } from "react";

import apiConfig from "../config/apiConfig.js";
import {
  sendChatMessage,
  sendTripCompletionUpdate,
} from "../services/chatSocketService.js";

function ChatBox({
  tripId,
  conversationId,
  currentUser,
  otherUser,
  liveMessage,
  liveTripCompletion,
  clientUserId,
  driverUserId,
}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [tripCompletion, setTripCompletion] = useState(null);
  const [isConfirmingTrip, setIsConfirmingTrip] = useState(false);

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

    if (liveMessage.conversationId !== conversationId) {
      return;
    }

    setMessages((previousMessages) => {
      const alreadyExists = previousMessages.some(
        (message) => message._id === liveMessage._id,
      );

      if (alreadyExists) {
        return previousMessages;
      }

      return [...previousMessages, liveMessage];
    });
  }, [liveMessage, conversationId]);

  useEffect(() => {
    async function loadTripCompletion() {
      try {
        const response = await fetch(
          `${apiConfig.baseUrl}/api/trip-completions/conversation/${conversationId}`,
        );

        if (!response.ok) {
          throw new Error("Could not load trip completion");
        }

        const data = await response.json();

        setTripCompletion(data);
      } catch (error) {
        console.error("Error loading trip completion:", error);
      }
    }

    loadTripCompletion();
  }, [conversationId]);

  useEffect(() => {
    if (!liveTripCompletion) {
      return;
    }

    if (liveTripCompletion.conversationId !== conversationId) {
      return;
    }

    setTripCompletion(liveTripCompletion);
  }, [liveTripCompletion, conversationId]);

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

  async function handleTripComplete() {
    if (isConfirmingTrip) {
      return;
    }

    setIsConfirmingTrip(true);

    try {
      let completion = tripCompletion;

      if (!completion) {
        const createResponse = await fetch(
          `${apiConfig.baseUrl}/api/trip-completions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tripId,
              conversationId,
              clientUserId,
              driverUserId,
            }),
          },
        );

        if (!createResponse.ok) {
          throw new Error("Could not create trip completion");
        }

        completion = await createResponse.json();
      }

      const confirmResponse = await fetch(
        `${apiConfig.baseUrl}/api/trip-completions/conversation/${conversationId}/confirm`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id,
          }),
        },
      );

      if (!confirmResponse.ok) {
        throw new Error("Could not confirm trip completion");
      }

      const updatedCompletion = await confirmResponse.json();

      setTripCompletion(updatedCompletion);
      sendTripCompletionUpdate(otherUser.id, updatedCompletion);
    } catch (error) {
      console.error("Error confirming trip completion:", error);
    } finally {
      setIsConfirmingTrip(false);
    }
  }

  const currentUserConfirmed =
    tripCompletion &&
    ((currentUser.id === tripCompletion.clientUserId &&
      tripCompletion.clientConfirmed) ||
      (currentUser.id === tripCompletion.driverUserId &&
        tripCompletion.driverConfirmed));

  const tripFullyCompleted =
    tripCompletion?.clientConfirmed && tripCompletion?.driverConfirmed;

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

      <div>
        <button
          type="button"
          onClick={handleTripComplete}
          disabled={
            isConfirmingTrip || currentUserConfirmed || tripFullyCompleted
          }
        >
          {tripFullyCompleted
            ? "Trip Completed"
            : currentUserConfirmed
              ? "Waiting for other user..."
              : isConfirmingTrip
                ? "Confirming..."
                : "Trip Complete"}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
