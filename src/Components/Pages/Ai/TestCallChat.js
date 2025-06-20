import Tippy from '@tippyjs/react';
import React, { useState } from 'react'

const TestCallChat = () => {
    const [isCalling, setIsCalling] = useState(false);
    const [testCall, setTestCall] = useState();

    const toggleCall = () => {
        setIsCalling((prev) => !prev);
    };
    return (
        <>
            <div className="TestCallMessage">
                <div className='messageHeader px-2 py-2'>
                    <button className='callBtn'>
                        <div className='text_info'>
                            <i class="fa-light fa-phone me-2"></i>
                            <span>Test Audio</span>
                        </div>

                    </button>
                </div>

                {testCall ? (
  <>
                        <div className="messageContent heightAuto">
                            <div className="messageList">
                                <div className="messageItem sender">
                                    <div className="second">
                                        <h6>
                                            p2
                                        </h6>
                                        <div className="messageDetails">
                                            <p>lorem12</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="messageItem receiver">
                                    <div className="second">
                                        <h6>
                                            k2
                                        </h6>
                                        <div className="messageDetails">
                                            <p>lorem12</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="messageList">
                                <div className="messageItem sender">
                                    <div className="second">
                                        <h6>
                                            p2
                                        </h6>
                                        <div className="messageDetails">
                                            <p>lorem12</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="messageItem receiver">
                                    <div className="second">
                                        <h6>
                                            k2
                                        </h6>
                                        <div className="messageDetails">
                                            <p>lorem12</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="messageList">
                                <div className="messageItem sender">
                                    <div className="second">
                                        <h6>
                                            p2
                                        </h6>
                                        <div className="messageDetails">
                                            <p>lorem12</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="messageItem receiver">
                                    <div className="second">
                                        <h6>
                                            k2
                                        </h6>
                                        <div className="messageDetails">
                                            <p>lorem12</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="messageList">
                                <div className="messageItem sender">
                                    <div className="second">
                                        <h6>
                                            p2
                                        </h6>
                                        <div className="messageDetails">
                                            <p>lorem12</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="messageItem receiver">
                                    <div className="second">
                                        <h6>
                                            k2
                                        </h6>
                                        <div className="messageDetails">
                                            <p>lorem12</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="messageList">
                                <div className="messageItem sender">
                                    <div className="second">
                                        <h6>
                                            p2
                                        </h6>
                                        <div className="messageDetails">
                                            <p>lorem12</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="messageItem receiver">
                                    <div className="second">
                                        <h6>
                                            k2
                                        </h6>
                                        <div className="messageDetails">
                                            <p>lorem12</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="messageList">
                                <div className="messageItem sender">
                                    <div className="second">
                                        <h6>
                                            p2
                                        </h6>
                                        <div className="messageDetails">
                                            <p>lorem12</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="messageItem receiver">
                                    <div className="second">
                                        <h6>
                                            k2
                                        </h6>
                                        <div className="messageDetails">
                                            <p>lorem12</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='messageFooter'>
                            <button className="callBtn" onClick={toggleCall}>
                                {isCalling ? (
                                    <div className='text-danger'>
                                        <i className="fa-light fa-phone-slash me-2"></i>
                                        <span>Stop</span>
                                    </div>
                                ) : (
                                    <div className='text_info'>
                                        <i className="fa-light fa-phone-arrow-up-right me-2"></i>
                                        <span>Start</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                  
                    <div className='textCall'>
                        <i class="fa-regular fa-microphone-lines"></i>
                        <div className='d-flex'>
                            <p className='mb-0'>Test your agent</p>
                            <Tippy content='Call transfer only works on phone calls, not web calls.'>
                                <button className="clearButton text-align-start" >
                                    <i class="fa-regular fa-circle-exclamation "></i>
                                </button>
                            </Tippy>
                        </div>
                        <button className="panelButton static gray" onClick={setTestCall}>
                            <span className="text">Test</span>
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default TestCallChat