import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { toast } from "react-toastify";
import {
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import CircularLoader from "../../Loader/CircularLoader";
import { ConferenceCall } from "./ConferenceCall";
import ContentLoader from "../../Loader/ContentLoader";
import { useSelector } from "react-redux";

const ConferenceConfig = ({ setactivePage }) => {
  const [conferenceName, setConferenceName] = useState("");
  const [conferenceType, setConferenceType] = useState("public");
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState(5);
  const [moderatorPin, setModeratorPin] = useState(555555);
  const [participantPin, setParticipantPin] = useState(1111);
  const [retryCount, setRetryCount] = useState(3);
  const [holdSound, setHoldSound] = useState([]);
  const [moh, setMoh] = useState("");
  const [allConferences, setAllConferences] = useState([]);
  const [conferenceRefresh, setConferenceRefresh] = useState(0);
  const [conferenceToggle, setConferenceToggle] = useState(false);
  const sessions = useSelector((state) => state.sessions);
  const account = useSelector((state) => state.account);
  const [conferenceId, setConferenceId] = useState("");
  const [error, setError] = useState("");
  const [selectedTab, setselectedTab] = useState("nav-gen-tab");

  useEffect(() => {
    async function getData() {
      const musicData = await generalGetFunction("/sound/all");
      const apiData = await generalGetFunction("/conference/all");
      if (apiData?.status) {
        setAllConferences(apiData.data);
      }
      if (musicData?.status) {
        setHoldSound(musicData.data.filter((item) => item.type === "hold"));
      }
    }
    getData();
  }, [conferenceRefresh]);

  async function handleSubmit() {
    if (conferenceName === null || conferenceName === "") {
      toast.error("Please enter conference name");
    } else if (
      conferenceType === "private" &&
      (participantPin < 100000 || participantPin > 999999)
    ) {
      toast.error("Please enter 6 digit participant pin");
    } else if (members === null || members === "") {
      toast.error("Please enter number of members");
    } else if (
      conferenceType === "private" &&
      (moderatorPin < 100000 || moderatorPin > 999999)
    ) {
      toast.error("Please enter 6 digit moderator pin");
    } else if (
      conferenceType === "private" &&
      (retryCount < 1 || retryCount > 5)
    ) {
      toast.error("Please enter  retry count between 1 to 5");
    } else if (moh === "") {
      toast.error("Please select moh");
    } else {
      setLoading(true);
      const parsedData = {
        conf_name: conferenceName,
        conf_max_members: members,
        pin_retries: retryCount,
        moderator_pin: String(moderatorPin),
        nopin: conferenceType !== "private" ? "0" : "1",
        conf_type: conferenceType,
        moh_sound: moh,
        participate_pin: String(participantPin),
      };
      const apiData = await generalPostFunction(
        "/conference/store",
        parsedData
      );
      if (apiData.status) {
        setLoading(false);
        toast.success(apiData.message);
        setConferenceRefresh(conferenceRefresh + 1);
        setselectedTab("nav-all-tab");
      } else {
        setLoading(false);
      }
    }
  }

  const validateAndSetConferenceId = (url) => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname; // e.g., "/conference"
      const query = urlObj.searchParams.get("type"); // e.g., "public/8/y03T2a"

      if (path !== "/conference" || !query) {
        throw new Error("Invalid URL format");
      }

      // Extract the conference ID (the "8" part)
      const parts = query.split("/");
      if (parts.length < 2 || isNaN(parts[1])) {
        throw new Error("Invalid conference link");
      }

      setConferenceId(parts[1]); // Set "8" as the conference ID
      setConferenceToggle(true);
      setError(""); // Clear error if validation passes
    } catch (err) {
      setError(err.message);
      setConferenceId(""); // Clear conference ID if validation fails
    }
  };

  return (
    <>
      {conferenceToggle ? (
        <ConferenceCall
          name={account.username}
          extension_id={`${account?.extension?.extension}@${account.domain.domain_name}`}
          room_id={conferenceId}
          setactivePage={setactivePage}
        />
      ) : (
        <main
          className="mainContentApp"
          style={{
            marginRight:
              sessions.length > 0 && Object.keys(sessions).length > 0
                ? "250px"
                : "0",
          }}
        >
          <section id="phonePage">
            <div className="container-fluid px-0">
              <Header title="Conference Settings" />
            </div>
            <div className="col-xl-12">
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>Create / Join a Conference</h4>
                          <p>
                            An extension is a destinations that can be called.
                          </p>
                        </div>
                        <div className="buttonGroup">
                          <button
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
                            onClick={handleSubmit}
                          >
                            <span className="text">Save</span>
                            <span className="icon">
                              <i class="fa-solid fa-floppy-disk"></i>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-12"
                      style={{
                        padding: "25px 23px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <form action="#" className="tangoNavs">
                        <nav>
                          <div class="nav nav-tabs" id="nav-tab" role="tablist">
                            {allConferences?.data?.length &&
                            allConferences?.data?.length > 0 ? (
                              <button
                                className={`nav-link ${
                                  selectedTab == "nav-all-tab" ? "active" : ""
                                } `}
                                id="nav-all-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-all"
                                type="button"
                                role="tab"
                                aria-controls="nav-all"
                                aria-selected="false"
                                onClick={() => setselectedTab("nav-all-tab")}
                              >
                                All
                              </button>
                            ) : (
                              ""
                            )}

                            <button
                              className={`nav-link ${
                                selectedTab == "nav-gen-tab" ? "active" : ""
                              } `}
                              id="nav-gen-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-gen"
                              type="button"
                              role="tab"
                              aria-controls="nav-gen"
                              aria-selected="true"
                              onClick={() => setselectedTab("nav-gen-tab")}
                            >
                              Create
                            </button>
                            <button
                              className={`nav-link ${
                                selectedTab == "nav-voicemail-tab"
                                  ? "active"
                                  : ""
                              } `}
                              id="nav-voicemail-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-voicemail"
                              type="button"
                              role="tab"
                              aria-controls="nav-voicemail"
                              aria-selected="false"
                              onClick={() =>
                                setselectedTab("nav-voicemail-tab")
                              }
                            >
                              Join
                            </button>
                          </div>
                        </nav>
                        {loading ? (
                          <div colSpan={99}>
                            <ContentLoader />
                          </div>
                        ) : (
                          <div class="tab-content" id="nav-tabContent">
                            <div
                              className={`tab-pane fade ${
                                selectedTab == "nav-all-tab"
                                  ? "show active"
                                  : ""
                              }`}
                              id="nav-all"
                              role="tabpanel"
                              aria-labelledby="nav-all"
                              tabindex="0"
                            >
                              <div className="tableContainer">
                                <table>
                                  <thead>
                                    <tr>
                                      <th>Conference Name</th>
                                      <th>Max. Members</th>
                                      <th>Conference ID</th>
                                      <th>Moderator Pin</th>
                                      <th>Joining Pin</th>
                                      <th>Meeting link</th>
                                      <th>Delete</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <>
                                      {allConferences &&
                                        allConferences?.data?.map((item) => {
                                          return (
                                            <tr>
                                              <td>{item.conf_name}</td>
                                              <td>{item.conf_max_members}</td>
                                              <td>{item.conf_ext}</td>
                                              <td>{item.moderator_pin}</td>
                                              <td>{item.participate_pin}</td>
                                              <td>{item.conf_url}</td>
                                              <td>
                                                <button
                                                  className="tableButton delete"
                                                  onClick={() => {
                                                    // setPopUp(true);
                                                    // setDeleteToggle(true);
                                                    // setDeleteId(item.id);
                                                  }}
                                                >
                                                  <i class="fa-solid fa-trash"></i>
                                                </button>
                                              </td>
                                              <td>
                                                <button
                                                  className="tableButton edit"
                                                  onClick={() => {
                                                    setConferenceToggle(true);
                                                    // setPopUp(true);
                                                    // setDeleteToggle(true);
                                                    // setDeleteId(item.id);
                                                  }}
                                                >
                                                  <i class="fa-solid fa-right-to-bracket"></i>
                                                </button>
                                              </td>
                                            </tr>
                                          );
                                        })}{" "}
                                    </>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div
                              className={`tab-pane fade ${
                                selectedTab == "nav-gen-tab"
                                  ? "show active"
                                  : ""
                              }`}
                              id="nav-gen"
                              role="tabpanel"
                              aria-labelledby="nav-gen-tab"
                              tabindex="0"
                            >
                              <form className="col-12 mx-auto">
                                <div className="formRow col-xl-3">
                                  <div className="formLabel">
                                    <label htmlFor="">Conference Name</label>
                                    <label
                                      htmlFor="data"
                                      className="formItemDesc"
                                    >
                                      Name of the conference
                                    </label>
                                  </div>
                                  <div className="col-xl-6 col-12">
                                    <input
                                      type="text"
                                      name="extension"
                                      className="formItem"
                                      onChange={(e) =>
                                        setConferenceName(e.target.value)
                                      }
                                      value={conferenceName}
                                    />
                                  </div>
                                </div>
                                <div className="formRow col-xl-3">
                                  <div className="formLabel">
                                    <label htmlFor="">Conference Type</label>
                                    <label
                                      htmlFor="data"
                                      className="formItemDesc"
                                    >
                                      Define type for the conference so that
                                      participants can join accordingly
                                    </label>
                                  </div>
                                  <div className="col-xl-6 col-12">
                                    <select
                                      className="formItem"
                                      onChange={(e) =>
                                        setConferenceType(e.target.value)
                                      }
                                      value={conferenceType}
                                    >
                                      <option value="public">Public</option>
                                      <option value="private">Private</option>
                                      <option value="webiner">webiner</option>
                                    </select>
                                  </div>
                                </div>
                                {conferenceType !== "private" ? (
                                  ""
                                ) : (
                                  <>
                                    <div className="formRow col-xl-3">
                                      <div className="formLabel">
                                        <label htmlFor="">Conference pin</label>
                                        <label
                                          htmlFor="data"
                                          className="formItemDesc"
                                        >
                                          Share this pin with participants
                                        </label>
                                      </div>
                                      <div className="col-xl-6 col-12">
                                        <input
                                          type="number"
                                          name="extension"
                                          className="formItem"
                                          onChange={(e) =>
                                            setParticipantPin(e.target.value)
                                          }
                                          value={participantPin}
                                        />
                                      </div>
                                    </div>
                                    <div className="formRow col-xl-3">
                                      <div className="formLabel">
                                        <label htmlFor="">Retry attempts</label>
                                        <label
                                          htmlFor="data"
                                          className="formItemDesc"
                                        >
                                          Number of times participant can retry
                                          joining
                                        </label>
                                      </div>
                                      <div className="col-xl-6 col-12">
                                        <input
                                          type="number"
                                          name="extension"
                                          className="formItem"
                                          onChange={(e) =>
                                            setRetryCount(e.target.value)
                                          }
                                          value={retryCount}
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}
                                <div className="formRow col-xl-3">
                                  <div className="formLabel">
                                    <label htmlFor="">Music on hold</label>
                                    <label
                                      htmlFor="data"
                                      className="formItemDesc"
                                    >
                                      Select music that will be played on hold
                                    </label>
                                  </div>
                                  <div className="col-xl-6 col-12">
                                    <select
                                      type="number"
                                      name="extension"
                                      className="formItem"
                                      onChange={(e) => setMoh(e.target.value)}
                                      value={moh}
                                    >
                                      <option disabled value="" selected>
                                        Select Hold Music
                                      </option>
                                      {holdSound &&
                                        holdSound?.map((item, index) => {
                                          return (
                                            <option key={index} value={item.id}>
                                              {item.name}
                                            </option>
                                          );
                                        })}
                                    </select>
                                  </div>
                                </div>
                                <div className="formRow col-xl-3">
                                  <div className="formLabel">
                                    <label htmlFor="">Number of members</label>
                                    <label
                                      htmlFor="data"
                                      className="formItemDesc"
                                    >
                                      Enter maximum number of members that can
                                      join
                                    </label>
                                  </div>
                                  <div className="col-xl-6 col-12">
                                    <input
                                      type="number"
                                      name="extension"
                                      className="formItem"
                                      onChange={(e) =>
                                        setMembers(e.target.value)
                                      }
                                      value={members}
                                    />
                                  </div>
                                </div>
                                <div className="formRow col-xl-3">
                                  <div className="formLabel">
                                    <label htmlFor="">Moderator pin</label>
                                    <label
                                      htmlFor="data"
                                      className="formItemDesc"
                                    >
                                      Set pin for moderators
                                    </label>
                                  </div>
                                  <div className="col-xl-6 col-12">
                                    <input
                                      type="number"
                                      name="extension"
                                      className="formItem"
                                      onChange={(e) =>
                                        setModeratorPin(e.target.value)
                                      }
                                      value={moderatorPin}
                                    />
                                  </div>
                                </div>
                              </form>
                            </div>
                            <div
                              className={`tab-pane fade ${
                                selectedTab == "nav-voicemail-tab"
                                  ? "show active"
                                  : ""
                              }`}
                              id="nav-voicemail"
                              role="tabpanel"
                              aria-labelledby="nav-voicemail-tab"
                              tabindex="0"
                            >
                              <form className="col-12 mx-auto">
                                <div className="formRow col-xl-3">
                                  <div className="formLabel">
                                    <label htmlFor="">Conference link</label>
                                    <label
                                      htmlFor="data"
                                      className="formItemDesc"
                                    >
                                      Paste conference link.
                                    </label>
                                  </div>
                                  <div className="col-xl-6 col-12">
                                    <input
                                      type="text"
                                      name="extension"
                                      className="formItem"
                                      value={conferenceId}
                                      onChange={(e) =>
                                        setConferenceId(e.target.value)
                                      }
                                    />
                                    {error && (
                                      <p style={{ color: "red" }}>{error}</p>
                                    )}
                                  </div>
                                  <div
                                    className="panelButton"
                                    onClick={() =>
                                      validateAndSetConferenceId(conferenceId)
                                    }
                                  >
                                    JOIN
                                  </div>
                                </div>
                                {/* <div className="formRow col-xl-3">
                                  <div className="formLabel">
                                    <label htmlFor="selectFormRow">PIN</label>
                                    <label
                                      htmlFor="data"
                                      className="formItemDesc"
                                    >
                                      Enter pin to join private conference.
                                    </label>
                                  </div>
                                  <div className="col-xl-6 col-12">
                                    <input
                                      type="text"
                                      name="extension"
                                      className="formItem"
                                    />
                                  </div>
                                </div> */}
                              </form>
                            </div>
                          </div>
                        )}

                        <div />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}
    </>
  );
};

export default ConferenceConfig;
