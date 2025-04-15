import React from "react";

function FportalCampaignCreate() {
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <div id="detailsHeader">
              <div className="col-4 d-flex align-items-center">
                <div className="d-xl-none d-block me-3">
                  <button className="clearButton d-flex align-items-center">
                    <i className="fa-light fa-bars fs-5" />
                  </button>
                </div>
                <h4 className="my-auto">Campaign Manage</h4>
              </div>
              <div className="col-8 d-flex justify-content-end align-items-center">
                <div className="col-auto">
                  <div className="d-flex justify-content-end align-items-center">
                    <div className="my-auto mx-3">
                      <a
                        href="/webrtc"
                        target="_blank"
                        className="clearColorButton"
                        style={{ cursor: "pointer" }}
                      >
                        <i className="fa-regular fa-phone-office" />{" "}
                        <span className="d-none d-xl-inline-block">
                          Go to Dialer
                        </span>
                      </a>
                    </div>
                    <div>
                      <div
                        className="clearColorButton"
                        style={{ cursor: "pointer", minWidth: 140 }}
                      >
                        <i className="fa-regular fa-wallet" />{" "}
                        <span className="d-none d-xl-inline-block">
                          $654.60
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-auto mx-2">
                  <button className="clearButton2 xl" effect="ripple">
                    <i className="fa-light fa-moon" />
                    <input
                      type="checkbox"
                      style={{
                        opacity: 0,
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                      }}
                    />
                  </button>
                </div>
                <div className="col-auto col-xl-auto d-flex justify-content-end align-items-center">
                  <div className="profileName">webvio</div>&nbsp; &nbsp;
                  <div className="profileHolder">
                    <img
                      src="/static/media/placeholder-image.c872bce112e99ec719cb.webp"
                      alt="profile"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Campaign add</h4>
                        <p>Edit existing campaign</p>
                      </div>
                      <div className="buttonGroup">
                        <button effect="ripple" className="panelButton gray">
                          <span className="text">Back</span>
                          <span className="icon">
                            <i className="fa-solid fa-caret-left" />
                          </span>
                        </button>
                        <button type="button" className="panelButton">
                          <span className="text">Save</span>
                          <span className="icon">
                            <i className="fa-solid fa-floppy-disk" />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-12" style={{ padding: "25px 23px" }}>
                    <div className="row">
                      <div className="col-xl-2 col-3">
                        <div className="someTempDialerDesign">
                          <ul>
                            <li className="active">
                              <div className="numberHolder completed">1</div>
                              <div className="textHolder">
                                <h3>General Settings</h3>
                              </div>
                            </li>
                            <li>
                              <div className="numberHolder completed">2</div>
                              <div className="textHolder">
                                <h3>Dialer Settings</h3>
                              </div>
                            </li>
                            <li>
                              <div className="numberHolder">3</div>
                              <div className="textHolder">
                                <h3>Agent List</h3>
                              </div>
                            </li>
                            <li>
                              <div className="numberHolder">4</div>
                              <div className="textHolder">
                                <h3>Record List</h3>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div
                        className="col-xl-7 col-6"
                        style={{
                          borderLeft: "1px solid var(--border-color)",
                          padding: "0px 30px",
                        }}
                      >
                        <form className="row mb-0">
                          <div className="formRow">
                            <div className="formLabel">
                              <label>Campaign Name</label>
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                className="formItem"
                                name="title"
                              />
                            </div>
                          </div>
                          <div className="formRow">
                            <div className="formLabel">
                              <label>Buyer Name</label>
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                className="formItem"
                                name="title"
                              />
                            </div>
                          </div>
                          <div className="formRow">
                            <div className="formLabel">
                              <label>Ring Timeout</label>
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                className="formItem"
                                name="title"
                              />
                            </div>
                          </div>

                          <div className="formRow">
                            <div className="formLabel">
                              <label>Number Config</label>
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                className="formItem"
                                name="title"
                              />
                            </div>
                          </div>
                          <div className="formRow">
                            <div className="formLabel">
                              <label>Campaign Type</label>
                            </div>
                            <div className="col-6">
                              <select className="formItem" name="campaign_type">
                                <option value="Inbound" selected="">
                                  Inbound
                                </option>
                                <option value="Outbound">Outbound</option>
                              </select>
                            </div>
                          </div>
                          <div className="formRow align-items-start">
                            <div className="formLabel">
                              <label>Campaign Description</label>
                            </div>
                            <div className="col-6">
                              <textarea
                                type="text"
                                className="formItem h-auto"
                                rows={3}
                                name="description"
                                defaultValue={""}
                              />
                            </div>
                          </div>

                          <div className="formRow">
                            <div className="formLabel">
                              <label>Target Timezone</label>
                            </div>
                            <div className="col-6">
                              <select className="formItem">
                                <option value={1}>Asia/Kolkata</option>
                                <option value={2}>Pacific/California</option>
                              </select>
                            </div>
                          </div>

                          <div className="formRow">
                            <div className="formLabel">
                              <label>Target Date Range</label>
                            </div>
                            <div className="col-6">
                              <div className="row">
                                <div className="col-6 pe-2">
                                  <div className="formLabel">
                                    <label>From</label>
                                  </div>
                                  <input type="date" className="formItem" />
                                </div>
                                <div className="col-6 ps-2">
                                  <div className="formLabel">
                                    <label>To</label>
                                  </div>
                                  <input type="date" className="formItem" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="formRow">
                            <div className="formLabel">
                              <label>Status</label>
                            </div>
                            <div className="col-6">
                              <div className="my-auto position-relative mx-1">
                                {/* <label className="switch">
                                  <input type="checkbox" id="showAllCheck" />
                                  <span className="slider round" />
                                </label> */}
                                <div class="cl-toggle-switch">
                                  <label class="cl-switch">
                                    <input
                                      type="checkbox" id="showAllCheck"

                                    />
                                    <span></span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="formRow d-block">
                            <div className="formLabel">
                              <label
                                className="fw-bold"
                                style={{ fontSize: "initial" }}
                              >
                                Set Target Time
                              </label>
                            </div>
                            <div
                              style={{ width: "fit-content", marginTop: 10 }}
                            >
                              <div className="timeTableWrapper col-auto">
                                <div className="col-12">
                                  <div className="wrapper">
                                    <div className="item" style={{ width: 95 }}>
                                      <input type="checkbox" />
                                      <label className="ms-2 fw-bold">
                                        Sunday
                                      </label>
                                    </div>
                                    <div className="item">
                                      <input type="time" className="formItem" />
                                    </div>
                                    <div className="item">
                                      <input type="time" className="formItem" />
                                    </div>
                                    <div className="item">
                                      <div className="my-auto position-relative mx-1">
                                        {/* <label className="switch">
                                          <input
                                            type="checkbox"
                                            id="showAllCheck"
                                            defaultChecked=""
                                          />
                                          <span className="slider round" />
                                        </label> */}
                                        <div class="cl-toggle-switch">
                                          <label class="cl-switch">
                                            <input
                                              type="checkbox" id="showAllCheck"
                                              defaultChecked=""
                                            />
                                            <span></span>
                                          </label>
                                        </div>
                                      </div>
                                      <label className="ms-1">Full day</label>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="wrapper">
                                    <div className="item" style={{ width: 95 }}>
                                      <input type="checkbox" />
                                      <label className="ms-2 fw-bold">
                                        Monday
                                      </label>
                                    </div>
                                    <div className="item">
                                      <input type="time" className="formItem" />
                                    </div>
                                    <div className="item">
                                      <input type="time" className="formItem" />
                                    </div>
                                    <div className="item">
                                      <div className="my-auto position-relative mx-1">
                                        {/* <label className="switch">
                                          <input
                                            type="checkbox"
                                            id="showAllCheck"
                                            defaultChecked=""
                                          />
                                          <span className="slider round" />
                                        </label> */}
                                        <div class="cl-toggle-switch">
                                          <label class="cl-switch">
                                            <input
                                              type="checkbox" id="showAllCheck"
                                              defaultChecked=""
                                            />
                                            <span></span>
                                          </label>
                                        </div>
                                      </div>
                                      <label className="ms-1">Full day</label>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="wrapper">
                                    <div className="item" style={{ width: 95 }}>
                                      <input type="checkbox" />
                                      <label className="ms-2 fw-bold">
                                        Tuesday
                                      </label>
                                    </div>
                                    <div className="item">
                                      <input type="time" className="formItem" />
                                    </div>
                                    <div className="item">
                                      <input type="time" className="formItem" />
                                    </div>
                                    <div className="item">
                                      <div className="my-auto position-relative mx-1">
                                        {/* <label className="switch">
                                          <input
                                            type="checkbox"
                                            id="showAllCheck"
                                            defaultChecked=""
                                          />
                                          <span className="slider round" />
                                        </label> */}
                                         <div class="cl-toggle-switch">
                                          <label class="cl-switch">
                                            <input
                                              type="checkbox" id="showAllCheck"
                                              defaultChecked=""
                                            />
                                            <span></span>
                                          </label>
                                        </div>
                                      </div>
                                      <label className="ms-1">Full day</label>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="wrapper">
                                    <div className="item" style={{ width: 95 }}>
                                      <input type="checkbox" />
                                      <label className="ms-2 fw-bold">
                                        Wednesday
                                      </label>
                                    </div>
                                    <div className="item">
                                      <input type="time" className="formItem" />
                                    </div>
                                    <div className="item">
                                      <input type="time" className="formItem" />
                                    </div>
                                    <div className="item">
                                      <div className="my-auto position-relative mx-1">
                                        {/* <label className="switch">
                                          <input
                                            type="checkbox"
                                            id="showAllCheck"
                                            defaultChecked=""
                                          />
                                          <span className="slider round" />
                                        </label> */}
                                         <div class="cl-toggle-switch">
                                          <label class="cl-switch">
                                            <input
                                              type="checkbox" id="showAllCheck"
                                              defaultChecked=""
                                            />
                                            <span></span>
                                          </label>
                                        </div>
                                      </div>
                                      <label className="ms-1">Full day</label>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="wrapper">
                                    <div className="item" style={{ width: 95 }}>
                                      <input type="checkbox" />
                                      <label className="ms-2 fw-bold">
                                        Thursday
                                      </label>
                                    </div>
                                    <div className="item">
                                      <input type="time" className="formItem" />
                                    </div>
                                    <div className="item">
                                      <input type="time" className="formItem" />
                                    </div>
                                    <div className="item">
                                      <div className="my-auto position-relative mx-1">
                                        {/* <label className="switch">
                                          <input
                                            type="checkbox"
                                            id="showAllCheck"
                                            defaultChecked=""
                                          />
                                          <span className="slider round" />
                                        </label> */}
                                         <div class="cl-toggle-switch">
                                          <label class="cl-switch">
                                            <input
                                              type="checkbox" id="showAllCheck"
                                              defaultChecked=""
                                            />
                                            <span></span>
                                          </label>
                                        </div>
                                      </div>
                                      <label className="ms-1">Full day</label>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="wrapper">
                                    <div className="item" style={{ width: 95 }}>
                                      <input type="checkbox" />
                                      <label className="ms-2 fw-bold">
                                        Friday
                                      </label>
                                    </div>
                                    <div className="item">
                                      <input type="time" className="formItem" />
                                    </div>
                                    <div className="item">
                                      <input type="time" className="formItem" />
                                    </div>
                                    <div className="item">
                                      <div className="my-auto position-relative mx-1">
                                        {/* <label className="switch">
                                          <input
                                            type="checkbox"
                                            id="showAllCheck"
                                            defaultChecked=""
                                          />
                                          <span className="slider round" />
                                        </label> */}
                                         <div class="cl-toggle-switch">
                                          <label class="cl-switch">
                                            <input
                                              type="checkbox" id="showAllCheck"
                                              defaultChecked=""
                                            />
                                            <span></span>
                                          </label>
                                        </div>
                                      </div>
                                      <label className="ms-1">Full day</label>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="wrapper mb-0">
                                    <div className="item" style={{ width: 95 }}>
                                      <input type="checkbox" />
                                      <label className="ms-2 fw-bold">
                                        Saturday
                                      </label>
                                    </div>
                                    <div className="item">
                                      <input type="time" className="formItem" />
                                    </div>
                                    <div className="item">
                                      <input type="time" className="formItem" />
                                    </div>
                                    <div className="item">
                                      <div className="my-auto position-relative mx-1">
                                        {/* <label className="switch">
                                          <input
                                            type="checkbox"
                                            id="showAllCheck"
                                            defaultChecked=""
                                          />
                                          <span className="slider round" />
                                        </label> */}
                                         <div class="cl-toggle-switch">
                                          <label class="cl-switch">
                                            <input
                                              type="checkbox" id="showAllCheck"
                                              defaultChecked=""
                                            />
                                            <span></span>
                                          </label>
                                        </div>
                                      </div>
                                      <label className="ms-1">Full day</label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div
                        className="col-xl-3 col-3"
                        style={{ borderLeft: "1px solid var(--border-color)" }}
                      >
                        <div
                          className="itemWrapper a py-0"
                          style={{
                            backgroundColor: "transparent",
                            boxShadow: "none",
                          }}
                        >
                          <div className="heading">
                            <div className="col-10">
                              <h5>Available DID</h5>
                              <p>Select from the available list of DIDs</p>
                            </div>
                            <div
                              className="col-2"
                              style={{ cursor: "pointer" }}
                            >
                              <i
                                className="fa-solid fa-hashtag"
                                style={{
                                  boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 5px",
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-12 my-2">
                            <div className="searchBox position-relative">
                              <div className="searchBox position-relative">
                                <input
                                  type="number"
                                  name="Search"
                                  placeholder="Search"
                                  className="formItem"
                                  defaultValue=""
                                />
                              </div>
                            </div>
                          </div>
                          <ul className="invoiceList list-unstyled">
                            <li
                              className="d-flex justify-content-start align-items-center mb-2 p-2 "
                              style={{ cursor: "pointer" }}
                            >
                              <div
                                className="checkbox-placeholder me-3 d-flex justify-content-center align-items-center "
                                style={{
                                  width: 20,
                                  height: 20,
                                  border: "1px solid rgb(204, 204, 204)",
                                  borderRadius: 3,
                                }}
                              >
                                <i className="fa-solid fa-check text-success" />
                              </div>
                              <div className="col-xxl-7 col-xl-6">
                                <p className="mb-0">18883489917</p>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default FportalCampaignCreate;
