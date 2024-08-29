import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useSessionCall } from "react-sipjs";
import { CallTimer } from "./CallTimer";
import { SessionState } from "sip.js";

function OngoingCall({ setHangupRefresh, hangupRefresh }) {
  const callProgressId = useSelector((state) => state.callProgressId);
  const [hideDialpad,setHideDialpad] = useState(false)
  const [destNumber,setDestNumber]=useState("")
  const callProgressDestination = useSelector(
    (state) => state.callProgressDestination
  );

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
  } = useSessionCall(callProgressId);

  // Handle dialpad press and send DTMF
  const handleDigitPress = (digit) => {
    if (session) {
      const dtmfSender = session.sessionDescriptionHandler.peerConnection.getSenders().find(sender => sender.dtmf);
      if (dtmfSender && dtmfSender.dtmf) {
        dtmfSender.dtmf.insertDTMF(digit);
      } else {
        console.error('DTMF sender not available');
      }
    } else {
      console.error('No active session found');
    }
  };
  return (
    <>
      <div className="caller">
        <div className="container-fluid">
          <div class="row header">
            <div class="col-4"></div>
            <div class="col-4 text-center">
              <h5>
                {timer?.answeredAt && (
                  <CallTimer
                    isEnd={session.state === SessionState.Terminated}
                    startAt={timer.answeredAt}
                  />
                )}
              </h5>
            </div>
            <div class="col-4 d-none d-xl-flex justify-content-end">
              <button class="appPanelButtonColor" effect="ripple">
                <i class="fa-thin fa-gear"></i>
              </button>
              <button
                class="appPanelButtonColor ms-2"
                effect="ripple"
                onclick="openMaximizeView()"
              >
                <i class="fa-thin fa-arrows-maximize"></i>
              </button>
            </div>
          </div>
          <div className="user">
            <div className="my-auto">
              <div id="userCallerProfile">
                <div className="userHolder col-12 mx-auto my-5">
                  <i className="fa-solid fa-user" />
                </div>
                <div className="col-12 text-center">
                  <h3>{callProgressDestination}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="row footer">
            <button
              onClick={isMuted ? unmute : mute}
              className={
                isMuted ? "appPanelButtonCaller active" : "appPanelButtonCaller"
              }
              effect="ripple"
            >
              <i className="fa-thin fa-microphone-slash" />
            </button>
            <button
            onClick={() => setHideDialpad(!hideDialpad)}
            className={
              hideDialpad ? "appPanelButtonCaller active" : "appPanelButtonCaller"
            } effect="ripple">
              <i className="fa-thin fa-grid" />
            </button>
            <button className="appPanelButtonCaller" effect="ripple">
              <i className="fa-thin fa-user-plus" />
            </button>
            <button className="appPanelButtonCaller" effect="ripple">
              <i className="fa-thin fa-phone-arrow-up-right" />
            </button>
            <button className="appPanelButtonCaller" effect="ripple">
              P
            </button>
            <button
              onClick={isHeld ? unhold : hold}
              className={
                isHeld ? "appPanelButtonCaller active" : "appPanelButtonCaller"
              }
              effect="ripple"
            >
              <i className="fa-thin fa-pause" />
            </button>
            <button
              onClick={() => {
                hangup();
                setHangupRefresh(hangupRefresh + 1);
              }}
              className="appPanelButtonCaller bg-danger"
              effect="ripple"
            >
              <i className="fa-thin fa-phone-hangup" />
            </button>
          </div>
          
        </div>
        {hideDialpad?
        <div id="dialPad" className="inCall">
        <div className="container h-100">
          <div className="row align-items-center justify-content-center h-100">
            <div className="col-xl-5 col-md-6 col-11 dialPadContainer p-2">
              <div className="d-flex justify-content-end pt-1 pb-1 px-2">
                {/* <div>
                  <i className="fa-light fa-address-book fs-5" />
                </div> */}
                {/* <div>
                  <h3>Dial Number:</h3>
                </div> */}
                <div
                  onClick={() => setHideDialpad(false)}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa-regular fa-xmark fs-5 text-white" />
                </div>
              </div>
              <div className="mb-2">
                {/* <span>Outbound ID: (999) 999-9999</span> */}
              </div>
              <div>
                <input
                  type="text"
                  placeholder=""
                  className="dialerInput"
                  disabled={true}
                  value={destNumber}
                  // onChange={(e) => setDestNumber(e.target.value)}
                  // onChange={handleInputChange}
                />
              </div>
              <div className="dialerWrap mt-2">
                <div
                  className="col-4"
                  onClick={() => {setDestNumber(destNumber + "1");handleDigitPress(1)}}
                >
                  <h4>1</h4>
                  <h6>&nbsp;</h6>
                </div>
                <div
                  className="col-4"
                  onClick={() => {setDestNumber(destNumber + "2");handleDigitPress(2)}}
                >
                  <h4>2</h4>
                  <h6>ABC</h6>
                </div>
                <div
                  className="col-4"
                  onClick={() => {setDestNumber(destNumber + "3");handleDigitPress(3)}}
                >
                  <h4>3</h4>
                  <h6>DEF</h6>
                </div>
                <div
                  className="col-4"
                  onClick={() => {setDestNumber(destNumber + "4");handleDigitPress(4)}}
                >
                  <h4>4</h4>
                  <h6>GHI</h6>
                </div>
                <div
                  className="col-4"
                  onClick={() => {setDestNumber(destNumber + "5");handleDigitPress(5)}}
                >
                  <h4>5</h4>
                  <h6>JKL</h6>
                </div>
                <div
                  className="col-4"
                  onClick={() => {setDestNumber(destNumber + "6");handleDigitPress(6)}}
                >
                  <h4>6</h4>
                  <h6>MNO</h6>
                </div>
                <div
                  className="col-4"
                  onClick={() => {setDestNumber(destNumber + "7");handleDigitPress(7)}}
                >
                  <h4>7</h4>
                  <h6>PQRS</h6>
                </div>
                <div
                  className="col-4"
                  onClick={() =>{ setDestNumber(destNumber + "8");handleDigitPress(8)}}
                >
                  <h4>8</h4>
                  <h6>TUV</h6>
                </div>
                <div
                  className="col-4"
                  onClick={() => {setDestNumber(destNumber + "9");handleDigitPress(9)}}
                >
                  <h4>9</h4>
                  <h6>WXYZ</h6>
                </div>
                <div className="col-4"
                onClick={() => {setDestNumber(destNumber + "*");handleDigitPress("*")}}
                >
                  <h4>
                    <i className="fa-light fa-asterisk" />
                  </h4>
                </div>
                <div
                  className="col-4"
                  onClick={() => {setDestNumber(destNumber + "0");handleDigitPress(0)}}
                >
                  <h4>0</h4>
                  <h6>+</h6>
                </div>
                <div className="col-4"
                onClick={() => {setDestNumber(destNumber + "#");handleDigitPress("#")}}
                >
                  <h4>
                    <i className="fa-light fa-hashtag" />
                  </h4>
                </div>
              </div>
              {/* <div 
                // onClick={onSubmit}
                >
                <button className="callButton">
                  <i className="fa-thin fa-phone" />
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      :""}
      </div>

    </>
  );
}

export default OngoingCall;
