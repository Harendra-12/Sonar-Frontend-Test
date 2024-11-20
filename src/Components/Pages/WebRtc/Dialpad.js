/* eslint-disable eqeqeq */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSIPProvider } from "react-sipjs";
import { toast } from "react-toastify";

function Dialpad({ hideDialpad, setSelectedModule, isMicOn, isVideoOn }) {
  const account = useSelector((state) => state.account);
  const globalSession = useSelector((state) => state.sessions);
  const dispatch = useDispatch();
  const { sessionManager, connectStatus } = useSIPProvider();
  const [destNumber, setDestNumber] = useState("");
  const extension = account?.extension?.extension || "";
  const dialpadRef = useRef();
  const handleInputChange = (e) => {
    const { value } = e.target;
    const regex = /^[0-9*#]*$/;
    if (regex.test(value)) {
        const value = e.target.value;
        if (value.length <= 15) {
          setDestNumber(value);
        }
    }
  };

  console.log("connectstatus form dialpad", connectStatus);

  async function onSubmit(mode) {
    if (!isMicOn) {
      toast.warn("Please turn on microphone");
      return;
    }
    if (mode === "video") {
      if (!isVideoOn) {
        toast.warn("Please turn on camera");
        return;
      }
    }

    if (extension == "") {
      toast.error("No extension assigned to your account");
      return;
    }
    if (destNumber == extension) {
      toast.error("You cannot call yourself");
      return;
    }

    if (connectStatus !== "CONNECTED") {
      toast.error("You are not connected with server");
      return;
    }

    if (destNumber.length > 3) {
      dispatch({
        type: "SET_MINIMIZE",
        minimize: false,
      });
      hideDialpad(false);
      // e.preventDefault();
      const apiData = await sessionManager?.call(
        `sip:${destNumber}@${account.domain.domain_name}`,
        {
          sessionDescriptionHandlerOptions: {
            constraints: {
              audio: true,
              video: mode === "video" ? true : false,
            },
          },
        },
        {
          media: {
            audio: true,
            video:
              mode === "audio"
                ? true
                : {
                  mandatory: {
                    minWidth: 1280,
                    minHeight: 720,
                    minFrameRate: 30,
                  },
                  optional: [{ facingMode: "user" }],
                },
          },
        }
      );
      console.log("apiData", apiData);

      setSelectedModule("onGoingCall");
      dispatch({
        type: "SET_SESSIONS",
        sessions: [
          ...globalSession,
          {
            id: apiData._id,
            destination: destNumber,
            state: "Established",
            mode: mode,
          },
        ],
      });
      dispatch({
        type: "SET_VIDEOCALL",
        videoCall: mode === "video" ? true : false,
      });
      dispatch({
        type: "SET_CALLPROGRESSID",
        callProgressId: apiData._id,
      });
      dispatch({
        type: "SET_CALLPROGRESSDESTINATION",
        callProgressDestination: destNumber,
      });
      dispatch({
        type: "SET_CALLPROGRESS",
        callProgress: mode === "video" ? false : true,
      });
    } else {
      toast.error("Please enter a valid number");
    }
  }

  // Dialpad Input Field will remain focused when this component mounts.
  useEffect(() => {
    dialpadRef.current.focus();
  }, [])

  return (
    <>
      <div id="dialPad">
        <div className="container h-100">
          <div className="row align-items-center justify-content-center h-100">
            <div className="col-xl-3 col-md-6 col-11 dialPadContainer p-2">
              <div className="d-flex justify-content-between pt-3 pb-1 px-2">
                <div>
                  <i className="fa-light fa-address-book fs-5 text-white" />
                </div>
                <div>
                  <h3>Dial Number:</h3>
                </div>
                <div
                  onClick={() => hideDialpad(false)}
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
                  placeholder="Dial"
                  className="dialerInput"
                  ref={dialpadRef}
                  value={destNumber}
                  // onChange={(e) => setDestNumber(e.target.value)}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSubmit("audio");
                    }
                  }}
                />
              </div>
              <div className="dialerWrap mt-2">
                <div
                  className="col-4"
                  onClick={() => setDestNumber(destNumber + "1")}
                >
                  <h4>1</h4>
                  <h6>&nbsp;</h6>
                </div>
                <div
                  className="col-4"
                  onClick={() => setDestNumber(destNumber + "2")}
                >
                  <h4>2</h4>
                  <h6>ABC</h6>
                </div>
                <div
                  className="col-4"
                  onClick={() => setDestNumber(destNumber + "3")}
                >
                  <h4>3</h4>
                  <h6>DEF</h6>
                </div>
                <div
                  className="col-4"
                  onClick={() => setDestNumber(destNumber + "4")}
                >
                  <h4>4</h4>
                  <h6>GHI</h6>
                </div>
                <div
                  className="col-4"
                  onClick={() => setDestNumber(destNumber + "5")}
                >
                  <h4>5</h4>
                  <h6>JKL</h6>
                </div>
                <div
                  className="col-4"
                  onClick={() => setDestNumber(destNumber + "6")}
                >
                  <h4>6</h4>
                  <h6>MNO</h6>
                </div>
                <div
                  className="col-4"
                  onClick={() => setDestNumber(destNumber + "7")}
                >
                  <h4>7</h4>
                  <h6>PQRS</h6>
                </div>
                <div
                  className="col-4"
                  onClick={() => setDestNumber(destNumber + "8")}
                >
                  <h4>8</h4>
                  <h6>TUV</h6>
                </div>
                <div
                  className="col-4"
                  onClick={() => setDestNumber(destNumber + "9")}
                >
                  <h4>9</h4>
                  <h6>WXYZ</h6>
                </div>
                <div
                  className="col-4"
                  onClick={() => setDestNumber(destNumber + "*")}
                >
                  <h4>
                    <i className="fa-light fa-asterisk" />
                  </h4>
                </div>
                <div
                  className="col-4"
                  onClick={() => setDestNumber(destNumber + "0")}
                >
                  <h4>0</h4>
                  <h6>+</h6>
                </div>
                <div
                  className="col-4"
                  onClick={() => setDestNumber(destNumber + "#")}
                >
                  <h4>
                    <i className="fa-light fa-hashtag" />
                  </h4>
                </div>
              </div>
              <div className="d-flex justify-content-center my-2">
                <div onClick={() => onSubmit("audio")}>
                  <button className="callButton">
                    <i className="fa-thin fa-phone" />
                  </button>
                </div>
                {isVideoOn ? (
                  <div onClick={() => onSubmit("video")} className="ms-3">
                    <button className="callButton">
                      <i className="fa-thin fa-video" />
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dialpad;
