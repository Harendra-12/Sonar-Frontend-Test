import React, { useState } from 'react'
import { useSelector } from 'react-redux';

function ConferenceMessages({ sendMessage, userName, conferenceId, setToggleMessages }) {
    const [messageInput, setMessageInput] = useState("");
    const conferenceMessage = useSelector((state) => state.conferenceMessage);
    console.log("conferenceMessage", conferenceMessage);

    // Logic to send message
    function sendConferenceMessage() {
        if (messageInput.trim() === "") return;
        sendMessage({
            action: "conferenceMessage",
            user: userName || "annonymous",
            sharedMessage: messageInput,
            room_id: conferenceId,
        });
        setMessageInput("");
    }
    return (
        <div className="messageOverlay">
            <div className="contactHeader py-3">
                <div>
                    <h4>Messages</h4>
                </div>
                <div >
                    <button className='clearButton2 xl' onClick={() => setToggleMessages(false)}>
                        <i className='fa-solid fa-xmark'></i>
                    </button>
                </div>
            </div>
            <div className="messageContent">
                <div className="messageList">

                    {conferenceMessage?.map((item) => (
                        <div className={item.user === userName ? "messageItem sender" : "messageItem receiver"}>
                            <div className="second">
                                <h6>
                                    {item.user}
                                </h6>
                                <div className="messageDetails">
                                    <p>{item.sharedMessage}</p>
                                </div>
                            </div>
                        </div>
                    ))}


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
                                onClick={sendConferenceMessage}
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
