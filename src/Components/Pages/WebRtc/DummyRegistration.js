import React, { useEffect, useState } from "react";
import { SIPProvider } from "react-sipjs";
import { DummySipRegisteration } from "./DummySipRegisteration";
import { useLocation, useNavigate } from "react-router-dom";

function DummyRegistration() {
  const ip = process.env.REACT_APP_IP;
  const port = process.env.REACT_APP_SIP_REGISTER_PORT;
  const location = useLocation();
  const locationState = location.state;
  console.log("locationState", locationState);
  const navigate = useNavigate();
  const [extension, setExtension] = useState();
  const [password, setPassword] = useState();
  const [domain, setDomain] = useState();
  const [webSocketServer, setWebSocketServer] = useState();
  useEffect(() => {
    if (locationState.extension && locationState.password) {
      setDomain(locationState.domainName);
      setExtension(locationState.extension);
      setPassword(locationState.password);
      setWebSocketServer(`wss://${ip}:${port}`);
    } else {
      navigate(-1);
    }
  }, [locationState]);

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
