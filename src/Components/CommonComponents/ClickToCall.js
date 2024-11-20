import React, { useState } from 'react'

function ClickToCall() {
    const [widgetExpanded, setWidgetExpanded] = useState(false)
    const [callFormVisible, setCallFormVisible] = useState(false)
    return (
        <div className="clickToCall">
            <div className="clickToCallButton">
                <button onClick={() => setWidgetExpanded(!widgetExpanded)}>
                    <i className={`fa-solid fa-${!widgetExpanded ? "phone" : "chevron-down"}`}></i>
                </button>
            </div>
            {widgetExpanded ? <div className="clickToCallModule">
                <div className="clickToCallHeader">
                    <div className="wrapper">
                        <button onClick={() => setCallFormVisible(false)}><i className="fa-solid fa-chevron-left"></i></button>
                        <div className="compLogo">
                            <img src={require('../assets/images/compLogo.png')}></img>
                        </div>
                        <div className="text">
                            <h5>AnglePBX</h5>
                            <p>Business Phone System | Cloud Contact Center | Cloud PBX</p>
                        </div>
                    </div>
                </div>
                <div className="clickToCallBody">
                    {!callFormVisible ?
                        <>
                            <div className="callByAudio">
                                <button onClick={() => setCallFormVisible(true)}>
                                    <i className="fa-solid fa-phone"></i>
                                </button>
                                <h5>Arrange an <span>Audio Call</span> with our Agent</h5>
                            </div>
                            <div className="callByVideo">
                                <button onClick={() => setCallFormVisible(true)}>
                                    <i className="fa-solid fa-video"></i>
                                </button>
                                <h5>Arrange a <span>Video Call</span> with our Agent</h5>
                            </div>
                        </> : ""}
                    {callFormVisible ? <div className="callDialogBox">
                        <div className="formBox">
                            <label className="formLabel">Name</label>
                            <input type="text" placeholder="Enter your name" />
                        </div>
                        <div className="formBox">
                            <label className="formLabel">Number</label>
                            <input type="tel" placeholder="Enter your Number" />
                        </div>
                        <div>
                            <button>Call Now!</button>
                        </div>
                    </div> : ""}
                </div>
            </div> : ""}
        </div>
    )
}

export default ClickToCall