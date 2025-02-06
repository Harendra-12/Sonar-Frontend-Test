import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSIPProvider, useSessionCall, CONNECT_STATUS } from "modify-react-sipjs";

const MessagingComponent = () => {
  const account = useSelector((state) => state.account);
  const [selectedExtension, setSelectedExtension] = useState(null); // Track the selected extension
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [session, setSession] = useState(null); // Track the active SIP session
  const sipProvider = useSIPProvider(); // Get SIP provider for managing messages
  const [isSIPReady, setIsSIPReady] = useState(false); // Track if SIP provider is ready

  // Check if SIP provider is connected and ready
  useEffect(() => {
    if (sipProvider && sipProvider.connectStatus === CONNECT_STATUS.CONNECTED) {
      setIsSIPReady(true);
    } else {
      setIsSIPReady(false);
    }
  }, [sipProvider?.connectStatus]);

  // Handle extension selection
  const handleSelectExtension = (extension) => {
    setSelectedExtension(extension);

    // Create a new session with the selected extension
    if (sipProvider?.userAgent && isSIPReady) {
      const targetURI = `sip:${extension}@${account.domain.domain_name}`; // Replace with your SIP domain
      const newSession = sipProvider.userAgent.invite(targetURI, {
        sessionDescriptionHandlerOptions: {
          constraints: {
            audio: false,
            video: false, // Set to true if you want a video call session
          },
        },
      });

      setSession(newSession); // Store the session in state

      // Listen for messages on this session
      newSession.on("message", (messageEvent) => {
        setReceivedMessages((prevMessages) => [
          ...prevMessages,
          messageEvent.body,
        ]);
      });

      // Handle session end
      newSession.on("bye", () => {
        setSession(null); // Clear session when the call ends
      });
    } else {
      console.error("SIP provider is not ready for creating a session.");
    }
  };

  // Send a message within the established session
  const handleSendMessage = () => {
    if (session) {
      session.sendMessage(message);
      setMessage(""); // Clear the input field after sending
    } else {
      console.error("No active SIP session to send the message.");
    }
  };

  return (
    <div>
      <h3>Select Extension for Chat</h3>
      <select onChange={(e) => handleSelectExtension(e.target.value)}>
        <option value="">Select Extension</option>
        <option value="1000">1000</option> {/* Example extensions */}
        <option value="1002">1002</option>
        <option value="1003">1003</option>
      </select>

      {selectedExtension && (
        <>
          <h3>Send a Message</h3>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
          />
          <button onClick={handleSendMessage} disabled={!session}>
            {session ? "Send" : "No Active Session"}
          </button>

          <h3>Received Messages</h3>
          <ul>
            {receivedMessages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default MessagingComponent;
