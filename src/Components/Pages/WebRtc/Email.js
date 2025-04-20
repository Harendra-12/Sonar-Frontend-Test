import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  featureUnderdevelopment,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "../../CommonComponents/DarkModeToggle";
import { useSIPProvider } from "modify-react-sipjs";
import MailReply from "./mailBox/MailReply";
import EmailList from "./mailBox/EmailList";
import ActionListMulti from "../../CommonComponents/ActionListMulti";

function Email() {
  const sessions = useSelector((state) => state.sessions);
  const account = useSelector((state) => state.account);
  const extension = account?.extension?.extension || "";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sessionManager } = useSIPProvider();
  const [mailSettings, setMailSettings] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // setLoading(true);
    const result = await generalGetFunction("/mail-setting/all");
    if (result?.status) {
      setMailSettings(result.data);
      // setLoading(false);
    } else {
      // setLoading(false);
      // navigate("/");
    }
  };
  return (
    <>
      <main
        className="mainContentApp"
        style={{
          marginRight:
            sessions.length > 0 && Object.keys(sessions).length > 0
              ? "250px"
              : "0",
        }}
      >
        <section className="callPage">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 ps-xl-0">
                <div className="newHeader">
                  <div className="col-auto" style={{ padding: "0 10px" }}>
                    <h3 style={{ fontFamily: "Outfit", marginBottom: "0" }}>
                      <button className="clearButton2 text-dark" onClick={() => featureUnderdevelopment()}>
                        <i className="fa-solid fa-chevron-left fs-4"></i>
                      </button>{" "}
                      E-Mail{" "}
                      <button className="clearButton2">
                        <i
                          className="fa-regular fa-arrows-rotate fs-5"
                          style={{ color: "var(--webUtilGray)" }}
                          onClick={() => featureUnderdevelopment()}
                        ></i>
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
                        style={{ backgroundColor: "var(--searchBg)" }}
                        onChange={() => featureUnderdevelopment()}
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
                              src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg"
                              alt="profile"
                            />
                          </div>
                          <div className="profileName">
                            {account?.username}{" "}
                            <span className="status">Available</span>
                          </div>
                        </div>
                        <ul className="dropdown-menu">
                          <li onClick={() => { dispatch({ type: "SET_LOGOUT", logout: 1 }); sessionManager.disconnect() }}>
                            <div
                              className="dropdown-item"
                              style={{ cursor: "pointer" }}
                            >
                              Logout
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="col-xl-6 allCallHistory pb-0">
                <div className="col-auto" style={{ padding: "0 10px" }}>
                  <h5 className="viewingAs">
                    Viewing As:
                    <span>
                      {account && extension ? (
                        <span>
                          {account?.username} - {account && extension}
                        </span>
                      ) : (
                        <span className="text-danger">
                          No Extension Assigned
                        </span>
                      )}
                    </span>
                  </h5>
                </div>
                <div className="col-auto" style={{ padding: "0 10px" }}>
                  <button className="clearColorButton dark">
                    <i className="fa-light fa-at" /> New Email
                  </button>
                </div>
                <div className="col-12 mt-3" style={{ padding: "0 10px" }}>
                  <input
                    type="search"
                    name="Search"
                    id="headerSearch"
                    placeholder="Search"
                  />
                </div>

                <div className="col-12">
                  <div className="callList">
                    <div className="dateHeader">
                      <p className="fw-semibold">Today</p>
                    </div>
                    <div data-bell="" className="callListItem incoming">
                      <div className="row justify-content-between">
                        <div className="col-xl-12 d-flex">
                          <div className="profileHolder">
                            <i className="fa-light fa-user fs-5"></i>
                          </div>

                          <div
                            className="col-4 my-auto ms-2 ms-xl-3"
                            style={{ cursor: "pointer" }}
                          >
                            <h4>AUSER XYZ</h4>
                            <h5 style={{ paddingLeft: "20px" }}>
                              1 (999) 999-9999
                            </h5>
                          </div>

                          <div className="col-3 mx-auto">
                            <div className="contactTags">
                              <span data-id="1">Received</span>
                            </div>
                            <h5 style={{ fontWeight: "400" }}>
                              <i className="fa-light fa-paperclip"></i> 1
                              Attachment
                            </h5>
                          </div>
                          <div className="col-1 text-end ms-auto">
                            <p className="timeAgo">12:46pm</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div data-bell="" className="callListItem outgoing">
                      <div className="row justify-content-between">
                        <div className="col-xl-12 d-flex">
                          <div className="profileHolder">
                            <i className="fa-light fa-user fs-5"></i>
                          </div>

                          <div
                            className="col-4 my-auto ms-2 ms-xl-3"
                            style={{ cursor: "pointer" }}
                          >
                            <h4>AUSER XYZ</h4>
                            <h5 style={{ paddingLeft: "20px" }}>
                              1 (999) 999-9999
                            </h5>
                          </div>

                          <div className="col-3 mx-auto">
                            <div className="contactTags">
                              <span data-id="0">Sent</span>
                            </div>
                            <h5 style={{ fontWeight: "400" }}>
                              <i className="fa-light fa-paperclip"></i> 1
                              Attachment
                            </h5>
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
              <div
                className="col-12 col-xl-6 callDetails eFaxCompose"
                style={{ height: "100%" }}
                id="callDetails"
              >
                <div className="overviewTableWrapper p-2 mt-2">
                  <div className="overviewTableChild">
                    <div className="d-flex flex-wrap">
                      <div className="col-12">
                        <div className="heading">
                          <div className="content">
                            <h4>New Email</h4>
                            <p>You can send a new email from here</p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-12"
                        style={{ padding: "0px 20px 0px" }}
                      >
                        <div className="newMessageWrapper mb-3">
                          <div>
                            <div className="messageTo border-bottom-0">
                              <label>Sender</label>
                              <div className="d-flex flex-wrap">
                                <div className="col-auto my-auto">
                                  <select className="formItem">
                                    {mailSettings.map((item, index) => (
                                      <option key={index}>{item.mail_from_address}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="messageTo">
                              <label>Recipent</label>
                              <div className="d-flex flex-wrap">
                                <div className="col-auto my-auto">
                                  <input
                                    type="text"
                                    className="border-0 mb-0"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="messageSubject">
                              <label>Subject</label>
                              <input type="text" />
                            </div>
                            <div className="messageBody">
                              <label>Body</label>
                              <textarea type="text" rows="5" />
                            </div>
                            <div className="messageBody">
                              <label>
                                <i className="fa-regular fa-link"></i> Attach
                                File(s) (maximum file size is 50 MB)
                              </label>
                              <div className="inputFileWrapper">
                                <input type="file" className="formItem" />
                              </div>
                            </div>
                            <div className="buttonControl">
                              <button className="panelButton">
                                <span className="text">Send</span>
                                <span className="icon">
                                  <i className="fa-solid fa-paper-plane-top"></i>
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}











            </div>
            <div className="pt-3">
              <div className="card mb-0">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0 text_dark">Mailbox</h5>
                  {/* <button className="btn btn-primary"><i class="fa-regular fa-envelope me-2"></i>  New Email</button> */}
                  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    <i class="fa-regular fa-envelope me-2"></i>  New Email</button>
                </div>
                <div className="card-body">
                  <div className="d-flex ">
                    <div className="card mail_leftbar shadow-sm rounded-3 mb-0">
                      <div className="card-body">
                        <ul>
                          <li className="mail_list active">
                            <p className="mb-0"> <i class="fa-duotone fa-solid fa-envelope me-2"></i> Inbox</p>
                            <div className="badge badge-solid-primary rounded-pill rounded-5"><span>30</span></div>
                          </li>
                          <li className="mail_list"><p className="mb-0"><i class="fa-duotone fa-solid fa-paper-plane me-2"></i> Sent Item</p></li>
                          <li className="mail_list"><p className="mb-0"><i class="fa-duotone fa-light fa-star me-2"></i> Starred</p></li>
                          <li className="mail_list">
                            <p className="mb-0 text-danger"><i class="fa-duotone fa-solid fa-trash me-2"></i> Deleted</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="table_card">
                      {/* <EmailList /> */}
                      <MailReply />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>


      <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="staticBackdropLabel">Compose Mail</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form>
                <div className="row ">
                  <div className=" col-12">
                    <div className="from-group">
                      <label htmlFor="" className="from-label">Form</label>
                      <select
                        type="text"
                        name="extension"
                        className="formItem"
                      >
                        <option value={"test12@gmail.com"}>test12@gmail.com</option>
                        <option value={"text22@gmail.com"}>text22@gmail.com</option>
                        <option value={"test11@gmail.com"}>test11@gmail.com</option>
                        <option value={"test15@gmail.com"}>test15@gmail.com</option>
                      </select>
                    </div>
                  </div>
                  <div className=" col-12">
                    <div className="from-group">
                      <label htmlFor="" className="from-label">To</label>
                      <select
                        type="text"
                        name="extension"
                        className="formItem"
                      >
                        <option value={"test12@gmail.com"}>test12@gmail.com</option>
                        <option value={"text22@gmail.com"}>text22@gmail.com</option>
                        <option value={"test11@gmail.com"}>test11@gmail.com</option>
                        <option value={"test15@gmail.com"}>test15@gmail.com</option>
                      </select>
                    </div>
                  </div>
                  <div className=" col-12">
                    <div className="from-group">
                      <label htmlFor="" className="from-label">CC</label>
                      <select
                        type="text"
                        name="extension"
                        className="formItem"
                      >
                        <option value={"test12@gmail.com"}>test12@gmail.com</option>
                        <option value={"text22@gmail.com"}>text22@gmail.com</option>
                        <option value={"test11@gmail.com"}>test11@gmail.com</option>
                        <option value={"test15@gmail.com"}>test15@gmail.com</option>
                      </select>
                    </div>
                  </div>
                  {/* <div className=" col-12">
                    <div className="from-group">
                      <label htmlFor="" className="from-label">BCC</label>
                      <select
                        type="text"
                        name="extension"
                        className="formItem"
                      >
                        <option value={"test12@gmail.com"}>test12@gmail.com</option>
                        <option value={"text22@gmail.com"}>text22@gmail.com</option>
                        <option value={"test11@gmail.com"}>test11@gmail.com</option>
                        <option value={"test15@gmail.com"}>test15@gmail.com</option>
                      </select>
                    </div>
                  </div> */}
                  <div className=" col-12">
                    <div className="from-group">
                      <label htmlFor="" className="from-label">Subjects</label>
                      <input type="text" name="subjects" class="formItem" value="" />
                    </div>
                  </div>
                  <div className=" col-12">
                    <div className="textBox position-relative">
                      <textarea
                        type="text"
                        name=""
                        rows={8}
                        className="formItem h-auto"
                        placeholder="Please enter your message"

                      />
                      <div className="footerSms">
                      <div class="custom_fileWrap">
                        <label for="file" class="custom_file">
                          <i class="fa-solid fa-paperclip"></i>
                        </label>
                        <input id="file" type="file" />
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary">Send</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Email;
