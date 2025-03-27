import React, { useState } from "react";
import Header from "../../CommonComponents/Header";
import UsersEdit from "../Users/UsersEdit";
import ExtensionsEdit from "../Extensions/ExtensionsEdit";
import { useLocation } from "react-router-dom";

function AgentsEdits() {
 const location=useLocation();
 const [usersDetails, setUsersDetails] = useState({
     user_id: "",
     role_id: "",
   });

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0">
            <Header title="Agents" />
          </div>
          <div className="col-xl-12" style={{ overflow: "auto" }}>
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Agents Edit</h4>
                        <p>Edit user information and group membership.</p>
                      </div>
                      {/* <div className="buttonGroup">
                        <button
                          onClick={() => {
                            navigate("-1");
                            backToTop();
                          }}
                          type="button"
                          effect="ripple"
                          className="panelButton gray"
                        >
                          <span className="text">Back</span>
                          <span className="icon">
                            <i className="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        <button
                          type="button"
                          effect="ripple"
                          className="panelButton"
                        >
                          <span className="text">Save</span>
                          <span className="icon">
                            <i className="fa-solid fa-floppy-disk"></i>
                          </span>
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>
                <div
                  className="col-12 formScroller"
                  style={{ padding: "25px 23px" }}
                >
                  <nav className="tangoNavs">
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <button
                        className="nav-link active"
                        id="nav-user-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-user"
                        type="button"
                        role="tab"
                        aria-controls="nav-user"
                        aria-selected="true"
                      >
                        User Configuration
                      </button>
                      <button
                        className="nav-link"
                        id="nav-exten-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-exten"
                        type="button"
                        role="tab"
                        aria-controls="nav-exten"
                        aria-selected="false"
                      >
                        Extension Configuration
                      </button>
                    </div>
                  </nav>
                  <div
                    className="tab-content"
                    id="nav-tabContent"
                    style={{
                      border: "1px solid var(--border-color)",
                      borderTop: "none",
                      borderRadius: "0 0 5px 5px",
                    }}
                  >
                    <div
                      className="tab-pane fade show active"
                      id="nav-user"
                      role="tabpanel"
                      aria-labelledby="nav-user-tab"
                      tabindex="0"
                    >
                      <UsersEdit page="marginleftAdjust" setUsersDetails={setUsersDetails }/>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="nav-exten"
                      role="tabpanel"
                      aria-labelledby="nav-exten-tab"
                      tabindex="0"
                    >
                      <ExtensionsEdit page="agents" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default AgentsEdits;
