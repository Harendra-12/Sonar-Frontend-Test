import React from "react";
import SkeletonFormLoader from "../../Loader/SkeletonFormLoader";
import Header from "../../CommonComponents/Header";
import { backToTop } from "../../GlobalFunction/globalFunction";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import UsersEdit from "../Users/UsersEdit";
import ExtensionsEdit from "../Extensions/ExtensionsEdit";

function AgentsEdits() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const locationState = location.state;
  console.log(locationState);
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
                            <i class="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        <button
                          type="button"
                          effect="ripple"
                          className="panelButton"
                        >
                          <span className="text">Save</span>
                          <span className="icon">
                            <i class="fa-solid fa-floppy-disk"></i>
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
                  <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                      <button
                        class="nav-link active"
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
                        class="nav-link"
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
                    class="tab-content"
                    id="nav-tabContent"
                    style={{
                      border: "1px solid var(--border-color)",
                      borderTop: "none",
                      borderRadius: "0 0 5px 5px",
                    }}
                  >
                    <div
                      class="tab-pane fade show active"
                      id="nav-user"
                      role="tabpanel"
                      aria-labelledby="nav-user-tab"
                      tabindex="0"
                    >
                      <UsersEdit />
                    </div>
                    <div
                      class="tab-pane fade"
                      id="nav-exten"
                      role="tabpanel"
                      aria-labelledby="nav-exten-tab"
                      tabindex="0"
                    >
                      <ExtensionsEdit />
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
