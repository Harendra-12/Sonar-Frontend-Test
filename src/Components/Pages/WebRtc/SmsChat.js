import React, { useEffect, useState } from "react";
import { featureUnderdevelopment, generalGetFunction, generalPostFunction, logout } from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { useSIPProvider } from "modify-react-sipjs";
import LogOutPopUp from "./LogOutPopUp";
import DarkModeToggle from "../../CommonComponents/DarkModeToggle";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { numberValidator, requiredValidator } from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";

function SmsChat({ setLoading, loading }) {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const extension = account?.extension?.extension || "";
  const { sessionManager, connectStatus } = useSIPProvider();
  const [allLogOut, setAllLogOut] = useState(false);
  const allCallCenterIds = useSelector((state) => state.allCallCenterIds);

  const [allSmsLogs, setAllSmsLogs] = useState([]);

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset
  } = useForm();

  // Function to handle logout
  const handleLogOut = async () => {
    setLoading(true);
    try {
      const apiResponses = await logout(
        allCallCenterIds,
        dispatch,
        sessionManager
      );
    } catch (error) {
      console.error("Unexpected error in handleLogOut:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSMSData();
  }, []);

  const getAllSMSData = async () => {
    try {
      const response = await generalGetFunction(`get-all-sms`);
      if (response.status) {
        setAllSmsLogs(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Send SMS Function
  const sendSMSMessage = handleSubmit(async (data) => {
    const payload = { ...data };
    try {
      const apiData = await generalPostFunction("/send-sms", payload);
      if (apiData.status) {
        toast.success(apiData.message);
      } else {
        if (apiData.errors.from_did) {
          toast.error(apiData.errors.from_did[0]);
        } else if (apiData.errors.to_did) {
          toast.error(apiData.errors.to_did[0]);
        } else {
          toast.error(apiData.message);
        }
      }
      reset();
    } catch (err) {
      console.error("Error sending SMS:", err);
    }
  })

  return (
    <>
      {/* <SideNavbarApp /> */}
      {allLogOut && (
        <LogOutPopUp setAllLogOut={setAllLogOut} handleLogOut={handleLogOut} />
      )}
      <main
        className="mainContentApp" style={{ marginRight: 0 }}
      // style={{
      //   marginRight:
      //     sessions.length > 0 && Object.keys(sessions).length > 0
      //       ? "250px"
      //       : "0",
      // }}
      >
        <section className="callPage">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 ps-xl-0">
                <div className="newHeader">
                  <div className="col-auto" style={{ padding: "0px 10px" }}>
                    <h3 style={{ fontFamily: "Outfit", marginBottom: 0 }}>
                      <button className="clearButton2 text-dark">
                        <i className="fa-solid fa-chevron-left fs-4" />
                      </button>{" "}
                      SMS {" "}
                      <button className="clearButton2" onClick={getAllSMSData}>
                        <i
                          className="fa-regular fa-arrows-rotate fs-5"
                          style={{ color: "var(--webUtilGray)" }}
                        />
                      </button>
                    </h3>
                  </div>
                  <div className="d-flex justify-content-end align-items-center">
                    <div className="col-9">
                      <input
                        type="search"
                        name="Search"
                        placeholder="Search users, groups or chat"
                        className="formItem fw-normal"
                        onChange={() => featureUnderdevelopment()}
                        style={{ backgroundColor: "var(--searchBg)" }}
                      />
                    </div>
                    <div className="col-auto ms-2">
                      <button
                        className="clearButton2 xl"
                        effect="ripple"
                        onClick={() => featureUnderdevelopment()}
                      >
                        <i className="fa-regular fa-bell" />
                      </button>
                    </div>
                    <DarkModeToggle marginLeft={"2"} />
                    <div className="col-auto">
                      <div className="dropdown">
                        <div
                          className="myProfileWidget"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <div className="profileHolder" id="profileOnlineNav">
                            <img
                              src={account?.profile_picture}
                              alt="profile"
                              onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                            />
                          </div>
                          <div className="profileName">
                            {account?.username}{" "}<span className="status">Available</span>
                          </div>
                        </div>
                        <ul className="dropdown-menu">
                          <li
                            onClick={() => {
                              if (allCallCenterIds.length > 0) {
                                setAllLogOut(true);
                              } else {
                                handleLogOut();
                              }
                            }}
                          >
                            <div
                              className="dropdown-item"
                              style={{ cursor: "pointer" }}
                            >
                              Logout
                            </div>
                          </li>
                          <li
                            onClick={() => {
                              sessionManager.disconnect();
                            }}
                          >
                            <div
                              className="dropdown-item"
                              style={{ cursor: "pointer" }}
                            >
                              Disconnect
                            </div>
                          </li>
                          <li
                            onClick={() => {
                              sessionManager.connect();
                            }}
                          >
                            <div
                              className="dropdown-item"
                              style={{ cursor: "pointer" }}
                            >
                              Reconnect
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-5 col-xl-6 allCallHistory pb-0">
                <div className="col-auto" style={{ padding: "0px 10px" }}>
                  <h5 className="viewingAs">
                    Viewing As:
                    {account && extension ? (
                      <span>
                        {account?.username} - {account && extension}
                      </span>
                    ) : (
                      <span className="text-danger">No Extension Assigned</span>
                    )}
                  </h5>
                </div>
                {/* <div className="col-auto" style={{ padding: "0px 10px" }}>
                  <button className="clearColorButton dark">
                    <i className="fa-light fa-fax" /> New SMS
                  </button>
                </div> */}
                <div className="col-12 my-3" style={{ padding: "0px 10px" }}>
                  <input
                    type="search"
                    name="Search"
                    id="headerSearch"
                    placeholder="Search"
                    onChange={() => featureUnderdevelopment()}
                  />
                </div>
                <div className="col-12">
                  <div className="tab-content">
                    <div className="callList">
                      {/* <div className="dateHeader">
                    <p className="fw-semibold">Today</p>
                  </div> */}
                      {allSmsLogs?.map((item, index) => {
                        return (
                          <div data-bell="" className="callListItem incomingm" key={index}>
                            <div className="row justify-content-between">
                              <div className="col-xl-12 d-flex">
                                <div className="profileHolder">
                                  <i className="fa-light fa-user fs-5" />
                                </div>
                                <div
                                  className="col-3 my-auto ms-2 ms-xl-3"
                                  style={{ cursor: "pointer" }}
                                >
                                  <h4>{item?.from}</h4>
                                </div>
                                <div
                                  className="col-3 my-auto ms-2 ms-xl-3"
                                  style={{ cursor: "pointer" }}
                                >
                                  <h4>{item?.to}</h4>
                                </div>
                                <div className="col-3 mx-auto">
                                  <div className="contactTags mt-2">
                                    <span data-id={1}>{item?.status}</span>
                                  </div>
                                  {item?.error &&
                                    <h5 style={{ fontWeight: 400 }}>
                                      <i className="fa-light fa-paperclip" /> {item?.error}
                                    </h5>
                                  }
                                </div>
                                <div className="col-1 text-end ms-auto">
                                  <p className="timeAgo">{item.time}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      <div data-bell="" className="callListItem outgoing0">
                        <div className="row justify-content-between">
                          <div className="col-xl-12 d-flex">
                            <div className="profileHolder">
                              <i className="fa-light fa-user fs-5" />
                            </div>
                            <div  className="col-2 my-auto ms-1 ms-xl-2" style={{ cursor: "pointer" }}>
                              <h4>AUSER XYZ</h4>

                            </div>

                            <div className="callIconAdmin"><i class="fa-solid fa-circle-check mx-2" style={{color:"var(--ui-accent)"}}></i></div>
                            {/* <i class="fa-regular fa-circle-check"></i> */}
                            {/* <i class="fa-solid fa-circle-check"></i> */}
                            <div
                              className="col-2 my-auto ms-1 ms-xl-3"
                              style={{ cursor: "pointer" }}
                            >
                              <h4>AUSER XYZ</h4>

                            </div>
                            <div className="col-2 mx-auto">
                              <div className="contactTags  mt-2">
                                <span data-id={0}>Active</span>
                              </div>
                              {/* <h5 style={{ fontWeight: 400 }}>
                            <i className="fa-light fa-paperclip" /> 1 Attachment
                          </h5> */}
                            </div>
                            <div className="col-1 text-end ms-auto">
                              <p className="timeAgo">12:46pm</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-xxl-7 col-xl-6 callDetails eFaxCompose"
                id="callDetails"
                style={{ height: "100%" }}
              >
                <div className="overviewTableWrapper p-2 mt-2">
                  <div className="overviewTableChild">
                    <div className="d-flex flex-wrap">
                      <div className="col-12">
                        <div className="heading">
                          <div className="content">
                            <h4>New SMS</h4>
                            <p>You can send a new sms from here</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12" style={{ padding: "0px 20px" }}>
                        <div className="newMessageWrapper  mb-3">
                          <div>
                            <div className="messageTo mt-3">
                              <label>Enter Sender Number</label>
                              <div className="d-flex flex-wrap">
                                <div className="col-auto my-auto">
                                  <input
                                    type="text"
                                    className="border-0 mb-0"
                                    name="from_did"
                                    {...register("from_did", { ...requiredValidator, ...numberValidator })}
                                  />
                                  {errors.from_did && (
                                    <ErrorMessage text={errors.from_did.message} />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="messageSubject mt-3">
                              <label className="mt-3">Enter Receiver Number</label>
                              <input
                                type="text"
                                name="to_did"
                                {...register("to_did", { ...requiredValidator, ...numberValidator })}
                              />
                              {errors.to_did && (
                                <ErrorMessage text={errors.to_did.message} />
                              )}
                            </div>
                            <div className="messageBody mt-5">
                              <label>Enter your messsage</label>
                              <textarea
                                type="text"
                                rows={3}
                                name="message"
                                {...register("message", {
                                  ...requiredValidator,
                                })}
                              />
                              {errors.message && (
                                <ErrorMessage text={errors.message.message} />
                              )}
                            </div>
                            <div className="buttonControl">
                              <button className="panelButton" onClick={sendSMSMessage}>
                                <span className="text">Send</span>
                                <span className="icon">
                                  <i className="fa-solid fa-paper-plane-top" />
                                </span>
                              </button>
                            </div>
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
    </>
  );
}

export default SmsChat;
