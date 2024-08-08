import React, { useEffect, useState } from "react";
import { useSessionCall } from "react-sipjs";

function ActiveCallSidePanel({ data, index }) {
  const { sessionId, destination } = data;
  const { isHeld, isMuted, session, direction, timer } =
    useSessionCall(sessionId);
  const [duration, setDuration] = useState(0);
  console.log(isHeld, isMuted, session, direction);
  useEffect(() => {
    if (timer && timer.createdAt) {
      const startTime = new Date(timer.createdAt);
      const interval = setInterval(() => {
        const currentTime = new Date();
        const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
        setDuration(elapsedSeconds);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };
  console.log(session);

  return (
    <>
      {session._state == "Initial" ? (
        <div className="col-12 callItem ringing">
          <div className="profilepicHolder">3</div>
          <div className="callContent">
            <h4>Line {index + 1}</h4>
            <h5>
              {destination}{" "}
              <span className="float-end">{formatDuration(duration)}</span>
            </h5>
          </div>
        </div>
      ) : isHeld ? (
        <div className="col-12 callItem hold">
          <div className="profilepicHolder">4</div>
          <div className="callContent">
            <h4>Line {index + 1}</h4>
            <h5>
              {destination}{" "}
              <span className="float-end">{formatDuration(duration)}</span>
            </h5>
          </div>
        </div>
      ) : (
        <div className="col-12 callItem active">
          <div className="profilepicHolder">1</div>
          <div className="callContent">
            <h4>Line {index + 1}</h4>
            <h5>
              {destination}{" "}
              <span className="float-end">{formatDuration(duration)}</span>
            </h5>
          </div>
        </div>
      )}
    </>
  );
}

export default ActiveCallSidePanel;
