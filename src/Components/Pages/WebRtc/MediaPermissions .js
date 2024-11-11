import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function MediaPermissions() {
  const dispatch = useDispatch();
  const [permission, setPermission] = useState("request");
  function getLocalStream() {
    if (navigator && navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setPermission("granted");
          // rest of the code
        })
        .catch((err) => {
          setPermission("denied");
          console.error(`you got an error: ${err}`);
        });
    } else {
      console.error("navigator or navigator.mediaDevices is not defined");
    }
  }
  function requestSoundPermission() {
    const audioContext = new AudioContext();
    audioContext.resume().then(() => {
      console.log('Sound permission granted');
    }).catch((error) => {
      console.log('Sound permission denied');
    });
  }
  useEffect(() => {
    if (permission === "request") {
      dispatch({
        type: "SET_MICROPHONEPERMISSION",
        microPhonePermission: false,
      });
      getLocalStream();
      requestSoundPermission();
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Audio auto-play permission granted');
        } else {
          console.log('Audio auto-play permission denied');
          // Provide a fallback, such as displaying an error message or playing a different audio file
        }
      });
    } else if (permission === "granted") {
      dispatch({
        type: "SET_MICROPHONEPERMISSION",
        microPhonePermission: true,
      });
    }
  }, [permission, dispatch]);
  return (
    <div className="invisible">
      {permission === "denied" ? (
        <div>
          Permission denied{" "}
          <button onClick={getLocalStream}>Allow Microphone</button>
        </div>
      ) : null}
    </div>
  );
}

export default MediaPermissions;
