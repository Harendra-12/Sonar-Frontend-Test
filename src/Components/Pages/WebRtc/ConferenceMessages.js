import React, { useEffect, useState } from 'react'
import { useSIPProvider, CONNECT_STATUS } from 'react-sipjs';
import { Messager, UserAgent } from "sip.js";

function ConferenceMessages() {
    const [messageInput, setMessageInput] = useState("");
    const sipProvider = useSIPProvider();
    const [isSIPReady, setIsSIPReady] = useState(false);

    // Check weather user is register with sip or not
    useEffect(() => {
        if (sipProvider && sipProvider.connectStatus === CONNECT_STATUS.CONNECTED) {
            console.log("SIP provider connected", sipProvider.connectStatus);

            setIsSIPReady(true);
        } else {
            setIsSIPReady(false);
        }
    }, [sipProvider?.connectStatus]);
    // Logic to recieve messages from differnt users
    const userAgent = sipProvider?.sessionManager?.userAgent;
    if (userAgent) {
        // Setup message delegate to handle incoming messages
        userAgent.delegate = {
            onMessage: (message) => {
                const from =
                    message?.incomingMessageRequest?.message?.from?.uri?.user.toString();
                const body = message?.incomingMessageRequest?.message?.body;
                console.log(`Message from ${from}: ${body}`);
    
                // Check if the message is from a conference
                if (message.isInConference) {
                    console.log(`Message from conference: ${from}: ${body}`);
                    // Handle the message as needed for the conference
                }
            },
        };
    }
    

    // Logic to send message
    const sendMessage = () => {
        if (messageInput.trim() === "") return;
        if (isSIPReady) {
            // const targetURI = `sip:${recipient[0]}@${account.domain.domain_name}`;
            const targetURI = `sip:1003@webs.9.webvio.in`
            const userAgent = sipProvider?.sessionManager?.userAgent;

            const target = UserAgent.makeURI(targetURI);

            if (target) {
                try {
                    const messager = new Messager(userAgent, target, messageInput);
                    messager.message();

                    console.log("Message sent to:", targetURI);
                } catch (error) {
                    console.error("Error sending message:", error);
                }
            } else {
                console.error("Invalid recipient address.");
            }
        } else {
            console.error("UserAgent or session not ready.");
        }
    };
    return (
        <div className="messageOverlay">
            <div className="contactHeader py-3">
                <div>
                    <h4>Messages</h4>
                </div>
            </div>
            <div className="messageContent">
                <div className="messageList">
                    <div className="messageItem sender">
                        <div className="second">
                            <h6>
                                1003,<span>3:48</span>
                            </h6>
                            <div className="messageDetails">
                                <p>hi</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="messageInput">
                    <textarea
                        type="text"
                        name=""
                        className="input"
                        placeholder="Please enter your message"
                        rows={2}
                        onChange={(e) => setMessageInput(e.target.value)}
                        value={messageInput}
                    />
                    <div className="col-12 d-flex justify-content-between align-items-center pt-2">
                        <div className="d-flex">
                            <button className="clearButton2">
                                <i className="fa-regular fa-image" />
                            </button>
                            <button className="clearButton2">
                                <i className="fa-solid fa-paperclip" />
                            </button>
                            <button className="clearButton2">
                                <i className="fa-regular fa-face-smile" />
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={sendMessage}
                                effect="ripple"
                                className="clearColorButton dark"
                            >
                                Send Now{" "}
                                <i className="fa-solid fa-paper-plane-top" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConferenceMessages
