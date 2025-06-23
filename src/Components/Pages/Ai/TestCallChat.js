import Tippy from "@tippyjs/react";
import React, { useEffect, useRef, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import { aiGeneralPostFunction } from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";

const retellWebClient = new RetellWebClient();

const TestCallChat = ({ agentData }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [transcript, setTranscript] = useState([]);
  const transcriptRef = useRef([]); // Holds the latest value always
  const [agentId, setAgentId] = useState();
  const [testCallToken, setTestCallToken] = useState(null);

  useEffect(() => {
    // Setup event listeners
    retellWebClient.on("call_started", () => {
      console.log("✅ Call started");
    });

    retellWebClient.on("call_ended", () => {
      console.log("📞 Call ended");
      setIsCalling(false);
      setIsLoading(false);
    });

    retellWebClient.on("agent_start_talking", () => {
      console.log("🗣️ Agent started talking");
    });

    retellWebClient.on("agent_stop_talking", () => {
      console.log("🔇 Agent stopped talking");
    });

    retellWebClient.on("audio", (audio) => {
      console.log("🎧 Audio chunk received:", audio);
    });

    retellWebClient.on("update", (update) => {
      if (update.transcript) {
        handleTranscript(
          update.transcript[update.transcript.length - 1].role,
          update.transcript[update.transcript.length - 1].content
        );
      }
    });

    retellWebClient.on("metadata", (metadata) => {
      console.log("ℹ️ Metadata received:", metadata);
    });

    retellWebClient.on("error", (error) => {
      console.error("❌ Error:", error);
      retellWebClient.stopCall();
      setIsCalling(false);
      setIsLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (agentData?.agent_id) {
      setAgentId(agentData?.agent_id);
    }
  }, [agentData?.agent_id]);

  const toggleConversation = async () => {
    setIsLoading(true);
    if (isCalling) {
      // Stop the call
      try {
        await retellWebClient.stopCall();
      } catch (err) {
        console.error("Failed to stop call:", err);
      } finally {
        setIsCalling(false);
        setIsLoading(false);
        setTestCallToken(null);
        setTranscript([]);
        transcriptRef.current = [];
      }
    } else {
      // Start the call
      try {
        const token = await registerCall(agentId);
        if (token) {
          setTestCallToken(token);
          await retellWebClient.startCall({ accessToken: token });
          setIsCalling(true);
        }
      } catch (err) {
        console.error("Failed to start call:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const registerCall = async (agentId) => {
    try {
      const response = await aiGeneralPostFunction(`/call/create-web-call`, {
        agent_id: agentId,
      });
      if (response.status) {
        return response.data.access_token;
      } else {
        toast.error(response.error);
        return null;
      }
    } catch (err) {
      console.error("Call registration failed:", err);
      return null;
    }
  };

  function handleTranscript(role, text) {
    const currentTranscript = transcriptRef.current;
    if (
      currentTranscript.length > 0 &&
      currentTranscript[currentTranscript.length - 1].role === role
    ) {
      const updatedTranscript = [...currentTranscript];
      updatedTranscript[updatedTranscript.length - 1].content = text;
      transcriptRef.current = updatedTranscript;
      setTranscript(updatedTranscript);
    } else {
      const newTranscript = [...currentTranscript, { role, content: text }];
      transcriptRef.current = newTranscript;
      setTranscript(newTranscript);
    }
  }

  return (
    <>
      <div className="TestCallMessage">
        <div className="messageHeader px-2 py-2">
          <button
            className="callBtn"
            disabled={isCalling || isLoading || !agentId}
            onClick={toggleConversation}
          >
            <div className="text_info">
              <i className="fa-light fa-phone me-2"></i>
              <span>Test Audio</span>
            </div>
          </button>
        </div>

        {testCallToken && (isCalling || transcript.length > 0) ? (
          <>
            <div className="messageContent heightAuto">
              {transcript &&
                transcript.map((msg, index) => (
                  <div key={index} className="messageList">
                    <div
                      className={`messageItem ${
                        msg.role === "agent" ? "sender" : "receiver"
                      }`}
                    >
                      <div className="second">
                        <div className="messageDetails">
                          <p>{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="messageFooter">
              <button
                className="callBtn"
                onClick={toggleConversation}
                disabled={isLoading}
              >
                {isCalling ? (
                  <div className="text-danger">
                    <i className="fa-light fa-phone-slash me-2"></i>
                    <span>Stop</span>
                  </div>
                ) : (
                  <div className="text_info">
                    <i className="fa-light fa-phone-arrow-up-right me-2"></i>
                    <span>Start</span>
                  </div>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="textCall">
            <i className="fa-regular fa-microphone-lines"></i>
            <div className="d-flex">
              <p className="mb-0">Test your agent</p>
              <Tippy content="Call transfer only works on phone calls, not web calls.">
                <button className="clearButton text-align-start">
                  <i className="fa-regular fa-circle-exclamation "></i>
                </button>
              </Tippy>
            </div>
            <button
              className="panelButton static gray"
              onClick={toggleConversation}
              disabled={!agentId || isLoading}
            >
              <span className="text">Test</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default TestCallChat;
