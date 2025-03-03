/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { SIPProvider } from "modify-react-sipjs";
import { DummySipRegisteration } from "./DummySipRegisteration";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function DummyRegistration() {
  const ip = process.env.REACT_APP_BACKEND_IP;
  const port = process.env.REACT_APP_FREESWITCH_PORT;
  const location = useLocation();
  const locationState = location.state;
  const [isVideoOn, setIsVideoOn] = useState(false);
  const navigate = useNavigate();
  const extension = useSelector((state) => state.dummyExtension);
  const password = useSelector((state) => state.dummyPassword);
  const [domain, setDomain] = useState();
  const [webSocketServer, setWebSocketServer] = useState();
  useEffect(() => {
    if (extension!=="" && password!=="") {
      setDomain(locationState.state.domainName);
      setWebSocketServer(`wss://${ip}:${port}`);
    } else {
      navigate(-1);
    }
  }, [locationState]);
  useEffect(() => {
    // checkMicrophoneStatus(); // Check mic status when component mounts
    checkVideoStatus();
  }, []);
  const checkVideoStatus = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // Microphone access granted
        setIsVideoOn(true);
        // Stop the stream after the check
      })
      .catch((err) => {
        // Microphone access denied or error occurred
        console.error("Microphone access denied or error:", err);
        setIsVideoOn(false);
      });
  };
  const options = {
    domain: domain,
    webSocketServer: webSocketServer,
  };
  return (
    <>
      {webSocketServer && extension && password && (
        <SIPProvider options={options}>
          <DummySipRegisteration
            webSocketServer={webSocketServer}
            extension={extension}
            password={password}
            isVideoOn={isVideoOn}
          />
          <style>
            {`#sidenNav{
                    display:none;
                } .circularLoader{
                    display:none;
                }`}
          </style>
        </SIPProvider>
      )}
    </>
  );
}

export default DummyRegistration;
