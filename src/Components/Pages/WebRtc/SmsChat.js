import React, { useEffect, useState } from "react";
import { featureUnderdevelopment, formatTimeWithAMPM, generalGetFunction, generalPostFunction, logout } from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { useSIPProvider } from "modify-react-sipjs";
import LogOutPopUp from "./LogOutPopUp";
import DarkModeToggle from "../../CommonComponents/DarkModeToggle";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { numberValidator, requiredValidator } from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import Tippy from "@tippyjs/react";
import CircularLoader from "../../Loader/CircularLoader";
import HeaderApp from "./HeaderApp";

function SmsChat({ setLoading, loading, did }) {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const extension = account?.extension?.extension || "";
  const { sessionManager, connectStatus } = useSIPProvider();
  const [allLogOut, setAllLogOut] = useState(false);
  const allCallCenterIds = useSelector((state) => state.allCallCenterIds);

  const [allSmsLogs, setAllSmsLogs] = useState([]);
  const [iconLoading, setIconLoading] = useState(false);

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
    setIconLoading(true);
    try {
      const response = await generalGetFunction(`get-all-sms`);
      if (response.status) {
        setAllSmsLogs(response.data);
        setIconLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIconLoading(false);
    }
  }

  // Send SMS Function
  const sendSMSMessage = handleSubmit(async (data) => {
    const payload = { ...data };
    try {
      const apiData = await generalPostFunction("/send-sms", payload);
      if (apiData.status) {
        toast.success(apiData.message);
        getAllSMSData();
      } else {
        if (apiData.error) {
          toast.error(apiData.error.message);
        }
      }
      reset();
    } catch (err) {
      console.error("Error sending SMS:", err);
    }
  })

  return (
    <>
      {loading && <CircularLoader />}
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
        <section className="callPage sms__page">
          <div className="ps-xl-0">
            <HeaderApp title={"SMS"} loading={iconLoading} setLoading={setIconLoading} refreshApi={getAllSMSData} />
          </div>
          <div className="container-fluid">
            <div className="row webrtc_newMessageUi">
              <div className="pb-0 col-12 col-xl-4 col-lg-4 col-xxl-3 py-3 px-0 rounded-3 allCallHistory pb-0">
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
                    className="searchStyle"
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
                          <>
                            <div data-bell="" className="callListItem incomingm wertc_iconBox border-0" key={index} data-bs-toggle="collapse" href={`#messageCollapse${index}`} role="button">
                              <div className="row justify-content-between">
                                <div className="col-xl-12 d-flex align-items-center">
                                  <div className="profileHolder">
                                    <i className="fa-light fa-user fs-5" />
                                  </div>
                                  <div
                                    className="col-3 my-auto ms-2 ms-xl-3"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <h4>{item?.from_did}</h4>
                                  </div>
                                  <div class="callIconAdmin">
                                    <i class={`fa-solid fa-circle-${item?.delivery_status === 'rejected' ? 'x' : 'check'} mx-2`} style={{ color: item?.delivery_status === 'rejected' ? 'var(--funky-boy4)' : "var(--ui-accent)" }}></i>
                                  </div>
                                  <div
                                    className="col-3 my-auto ms-2 ms-xl-3"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <h4>{item?.to_did}</h4>

                                    <div className=" mx-auto my-auto">
                                      {item?.additional_info && <Tippy content={item?.additional_info || ''}>
                                        <div className="contactTags">
                                          <span data-id={item?.delivery_status === 'rejected' ? 2 : 1} style={{ textTransform: 'capitalize' }}>{item?.delivery_status}</span>
                                        </div>
                                      </Tippy>}
                                      {/* {item?.additional_info &&
                                      <h5 className="mt-2" style={{ fontWeight: 400 }}>
                                        <i className="fa-light fa-info" /> {item?.additional_info}
                                      </h5>
                                    } */}
                                    </div>
                                  </div>
                                  <div className="col-auto text-end ms-auto">
                                    <p className="timeAgo">{new Date(item?.created_at).toLocaleTimeString()}</p>
                                    {item?.message && <button className="clearButton2"><i className="fa-regular fa-comment" /></button>}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {item?.message &&
                              <div className="collapse p-2" id={`messageCollapse${index}`}>
                                <div className="back-comment">
                                  <span>
                                    <img
                                      src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                      alt="img"
                                      height={30}
                                      width={30}
                                    />
                                  </span>
                                  <span className="username-cmt ms-2"> {item?.from_did}</span>
                                  <div className="d-flex align-items-end justify-content-between mt-1">
                                    <span className="name-comment ms-1"> {item?.message}</span>
                                    <span className="date-small"> {new Date(item?.created_at).toLocaleTimeString()}</span>
                                  </div>
                                </div>
                              </div>
                            }
                          </>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="callDetails eFaxCompose col-12 col-xl-8 col-lg-8 col-xxl-9 callDetails newVoicemailBoxUi"
                id="callDetails"
                style={{ height: "100%" }}
              >
                <div className="overviewTableWrapper p-0">
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
                      <div className="w-100 p-3 rounded-start-0 rounded-end-0" >
                        <div className="col-12">
                          <div className="newMessageWrapper mt-0 ">
                            <div>
                              <div className="messageSubject">
                                <label>Enter Sender Number</label>
                                <select className="formItem rounded-3 p-2 mt-1"
                                  {...register("from_did")}
                                >
                                  {did && did.length > 0 ?
                                    did.sort((a, b) => (b.default_sms == 1) - (a.default_sms == 1))
                                      .map((item, index) => (
                                        <option key={index} value={item.did}>
                                          {item.did}{item.default_sms == 1 ? ' - (Default)' : ''}
                                        </option>
                                      ))
                                    : ""
                                  }
                                </select>
                                {/* <input
                                type="text"
                                defaultValue={""}
                                {...register("from_did", { ...requiredValidator, ...numberValidator })}
                              />
                              {errors.from_did && (
                                <ErrorMessage text={errors.from_did.message} />
                              )} */}
                              </div>
                              <div className="messageSubject">
                                <label className="mt-3">Enter Receiver Number</label>
                                <input
                                  type="text"
                                  defaultValue={""}
                                  className="formItem rounded-3 p-2"
                                  {...register("to_did", { ...requiredValidator, ...numberValidator })}
                                />
                                {errors.to_did && (
                                  <ErrorMessage text={errors.to_did.message} />
                                )}
                              </div>
                              <div className="messageBody">
                                <label>Enter your messsage</label>
                                <textarea
                                  type="text"
                                  rows={3}
                                  className="formItem h-auto rounded-3 p-2"
                                  defaultValue={""}
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
          </div>
        </section>
      </main>
    </>
  );
}

export default SmsChat;
