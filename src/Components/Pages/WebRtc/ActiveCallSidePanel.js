import React from "react";
import { useSessionCall } from "react-sipjs";

function ActiveCallSidePanel(sessionId) {
  const { isHeld, isMuted, session, direction, timer } =
    useSessionCall(sessionId);

  console.log("Active call", isHeld, isMuted, session, direction, timer);

  return (
    <section className="activeCallsSidePanel">
      <div className="container">
        <div className="row">
          <div className="col-12 callItem">
            <div className="profilepicHolder">1</div>
            <div className="callContent">
              <h4>Line 1</h4>
              <h5>
                1003 <span className="float-end">02:23</span>
              </h5>
            </div>
          </div>
          <div className="col-12 callItem active">
            <div className="profilepicHolder">2</div>
            <div className="callContent">
              <h4>Line 2</h4>
              <h5>
                1003 <span className="float-end">02:23</span>
              </h5>
            </div>
          </div>
          <div className="col-12 callItem ringing">
            <div className="profilepicHolder">3</div>
            <div className="callContent">
              <h4>Line 3</h4>
              <h5>
                1003 <span className="float-end">02:23</span>
              </h5>
            </div>
          </div>
          <div className="col-12 callItem hold">
            <div className="profilepicHolder">4</div>
            <div className="callContent">
              <h4>Line 4</h4>
              <h5>
                1003 <span className="float-end">02:23</span>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ActiveCallSidePanel;
