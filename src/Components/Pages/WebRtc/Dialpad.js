import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSIPProvider } from "react-sipjs";
import { toast } from "react-toastify";

function Dialpad({ hideDialpad, setSelectedModule }) {
  const account = useSelector((state) => state.account);
  const globalSession = useSelector((state) => state.sessions);
  const dispatch = useDispatch();
  const { sessionManager } = useSIPProvider();
  const [destNumber, setDestNumber] = useState("");
  const extension = account?.extension?.extension || "";
  const handleInputChange = (e) => {
    const { value } = e.target;
    const regex = /^[0-9*#]*$/;
    if (regex.test(value)) {
      setDestNumber(value);
    }
  };

  async function onSubmit(e) {
    if (extension == "") {
      toast.error("No extension assigned to your account");
      return;
    }
    if (destNumber == extension) {
      toast.error("You cannot call yourself");
      return;
    }
    if (destNumber.length > 3) {
      hideDialpad(false);
      // e.preventDefault();
      const apiData = await sessionManager?.call(
        `sip:${Number(destNumber)}@${account.domain.domain_name}`,
        {}
      );
      setSelectedModule("onGoingCall");
      dispatch({
        type: "SET_SESSIONS",
        sessions: [
          ...globalSession,
          { id: apiData._id, destination: destNumber, state: "Established" },
        ],
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
        callProgress: true,
      });
    }
  }

  return (
    <>
      <div id="dialPad">
        <div className="container h-100">
          <div className="row align-items-center justify-content-center h-100">
            <div className="col-xl-3 col-md-6 col-11 dialPadContainer p-2">
              <div className="d-flex justify-content-between pt-3 pb-1 px-2">
                <div>
                  <i className="fa-light fa-address-book fs-5" />
                </div>
                <div>
                  <h3>Dial Number:</h3>
                </div>
                <div
                  onClick={() => hideDialpad(false)}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fa-regular fa-xmark fs-5" />
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
                  value={destNumber}
                  // onChange={(e) => setDestNumber(e.target.value)}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSubmit();
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
              <div onClick={onSubmit}>
                <button className="callButton">
                  <i className="fa-thin fa-phone" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dialpad;
