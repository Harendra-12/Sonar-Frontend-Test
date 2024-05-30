import React, { useState } from "react";
import Dialpad from "./Dialpad";

function Call() {
  const [dialpadShow, setDialpadShow] = useState(false);
  const [clickStatus,setClickStatus]=useState("all")
  function handleHideDialpad(value) {
    setDialpadShow(value);
  }
  return (
    <>
      <main className="mainContentApp">
        <section>
          <div className="container-fluid">
            <div className="row">
              <div
                className="col-12 col-xl-6 d-flex flex-wrap justify-content-between py-3 border-end"
                style={{ height: "100%" }}
              >
                <div className="col-auto">
                  <h3 style={{ fontFamily: "Outfit", color: "#444444" }}>
                    Calls
                  </h3>
                </div>
                <div className="col-auto d-flex">
                  <div className="col-auto">
                    <button
                      className="appPanelButton"
                      effect="ripple"
                      onClick={() => setDialpadShow(!dialpadShow)}
                    >
                      <i className="fa-light fa-mobile-retro" />
                    </button>
                  </div>
                  <div className="col-auto">
                    <button className="appPanelButton" effect="ripple">
                      <i className="fa-light fa-satellite-dish" />
                    </button>
                  </div>
                </div>

                <div className="col-12">
                  <nav>
                    <div className="nav nav-tabs">
                      <button onClick={()=>setClickStatus("all")} className={clickStatus==="all"?"tabLink active":"tabLink"} data-category="all">
                        <i className="fa-light fa-phone" />
                      </button>
                      <button
                        onClick={()=>setClickStatus("incoming")}
                        className={clickStatus==="incoming"?"tabLink active":"tabLink"}
                        effect="ripple"
                        data-category="incoming"
                      >
                        <i className="fa-light fa-phone-arrow-down-left" />
                      </button>
                      <button
                        onClick={()=>setClickStatus("outgoing")}
                        className={clickStatus==="outgoing"?"tabLink active":"tabLink"}
                        effect="ripple"
                        data-category="outgoing"
                      >
                        <i className="fa-light fa-phone-arrow-up-right" />
                      </button>
                      <button
                        onClick={()=>setClickStatus("missed")}
                        className={clickStatus==="missed"?"tabLink active":"tabLink"}
                        effect="ripple"
                        data-category="missed"
                      >
                        <i className="fa-light fa-phone-missed" />
                      </button>
                      <button
                        onClick={()=>setClickStatus("voicemail")}
                        className={clickStatus==="voicemail"?"tabLink active":"tabLink"}
                        effect="ripple"
                        data-category="voicemail"
                      >
                        <i className="fa-light fa-microphone-lines" />
                      </button>
                    </div>
                  </nav>
                  <div className="tab-content">
                    <div className="position-relative searchBox d-flex mt-3">
                      <input
                        type="search"
                        name="Search"
                        id="headerSearch"
                        placeholder="Search"
                      />
                      <button className="appPanelButton" effect="ripple">
                        <i className="fa-light fa-calendar-plus" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-12 col-xl-6 callDetails"
                style={{ height: "100%" }}
                id="callDetails"
              >
                <div className="profileInfoHolder">
                  <div className="profileHolder">
                    <i className="fa-light fa-user fs-3" />
                  </div>
                  <h4>1 (999) 999-9999</h4>
                  <h5>USER XYZ</h5>
                  <div className="d-flex justify-content-center align-items-center mt-3">
                    <button className="appPanelButton" effect="ripple">
                      <i className="fa-light fa-message-dots" />
                    </button>
                    <button className="appPanelButton" effect="ripple">
                      <i className="fa-light fa-phone" />
                    </button>
                    <button className="appPanelButton" effect="ripple">
                      <i className="fa-light fa-video" />
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <button
                        className="tabLink active"
                        effect="ripple"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-home"
                        type="button"
                        role="tab"
                        aria-controls="nav-home"
                        aria-selected="true"
                      >
                        <i className="fa-regular fa-circle-info" />
                      </button>
                      <button
                        className="tabLink"
                        effect="ripple"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-profile"
                        type="button"
                        role="tab"
                        aria-controls="nav-profile"
                        aria-selected="false"
                      >
                        <i className="fa-regular fa-clock-rotate-left" />
                      </button>
                    </div>
                  </nav>
                  <div className="tab-content" id="nav-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="nav-home"
                      role="tabpanel"
                      aria-labelledby="nav-home-tab"
                      tabIndex={0}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {dialpadShow ? <Dialpad hideDialpad={handleHideDialpad} /> : ""}
    </>
  );
}

export default Call;
