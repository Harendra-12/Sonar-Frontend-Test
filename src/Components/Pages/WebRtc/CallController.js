import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useSessionCall } from 'react-sipjs';

function CallController({ id }) {
    const navigate = useNavigate();
    console.log("idsasasas", id);
    const {
        isHeld,
        isMuted,
        hangup,
        hold,
        mute,
        session,
        unhold,
        unmute,
        timer,
    } = useSessionCall(id);
    
    if (session?.["_state"] === "Terminated") {
        navigate(-1)
    }
    
    return (
        <div>
            <div className="videoControls">
                <button className="appPanelButtonCallerRect">
                    {isMuted? <i onClick={unmute} class="fa-light fa-microphone-slash"></i> : <i onClick={mute} class="fa-light fa-microphone"></i>}
                   
                </button>
                <button className="appPanelButtonCallerRect">
                    <i class="fa-light fa-video"></i>
                </button>
                <button className="appPanelButtonCallerRect">
                    <i class="fa-sharp fa-light fa-record-vinyl"></i>
                </button>
                <button
                    className="appPanelButtonCallerRect"
                    style={{
                        fontSize: "14px",
                        padding: "10px 20px",
                        backgroundColor: "#e45758",
                    }}
                    onClick={hangup}
                >
                    Leave Call
                </button>
                <button className="appPanelButtonCallerRect">
                    <i class="fa-light fa-screencast"></i>
                </button>
                <button className="appPanelButtonCallerRect">
                    <i class="fa-light fa-chalkboard-user"></i>
                </button>
                <button className="appPanelButtonCallerRect">
                    <i class="fa-light fa-hand"></i>
                </button>
            </div>

        </div>
    )
}

export default CallController
