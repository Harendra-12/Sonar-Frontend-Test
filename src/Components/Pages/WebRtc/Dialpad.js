import React, { useState } from "react";
import { generalPostFunction } from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Dialpad({ hideDialpad }) {
  const [destNumber, setDestNumber] = useState("");
  const navigate = useNavigate();
  const account = useSelector((state)=>state.account)
  console.log("This is account",account);
  async function call() {
    const parsedData = {
      src: "1002",
      destination: "1001",
      account_id:account.account_id
    };
    generalPostFunction("/freeswitch/call", parsedData);

    navigate("/ongoing-call");
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
                  type="number"
                  placeholder="Dial"
                  className="dialerInput"
                  value={destNumber}
                  onChange={(e) => setDestNumber(e.target.value)}
                />
              </div>
              <div className="dialerWrap mt-2">
                <div
                  className="col-4"
                  onClick={() => setDestNumber(destNumber + "1")}
                >
                  <h4>1</h4>
                  {/* <h6>DEL</h6> */}
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
                <div className="col-4">
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
                <div className="col-4">
                  <h4>
                    <i className="fa-light fa-hashtag" />
                  </h4>
                </div>
              </div>
              <div onClick={call}>
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
