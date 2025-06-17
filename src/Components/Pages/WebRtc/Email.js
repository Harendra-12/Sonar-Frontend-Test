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
import HeaderApp from "./HeaderApp";
import NewMail from "./mailBox/NewMail";

function Email({ selectedMail }) {
  const [loading, setLoading] = useState(false);
  const [refreshState, setRefreshState] = useState(false);
  const sessions = useSelector((state) => state.sessions);
  const account = useSelector((state) => state.account);
  const extension = account?.extension?.extension || "";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sessionManager } = useSIPProvider();
  const [availableFromMailAddresses, setAvailableFromMailAddresses] = useState(
    []
  );
  const [showMailList, setShowMailList] = useState(true);
  const [mailReplay, setMailReplay] = useState(false);
  const [showNewMail, setShowNewMail] = useState(false);
  const [activeList, setActiveList] = useState("inbox");
  const [currentMail, setCurrentMail] = useState([]);
  const [allMails, setAllMails] = useState([]);
  const [allStarredMails, setAllStarredMails] = useState([]);
  const [allSendMails, setAllSendMails] = useState([]);
  const [allTrashedMails, setAllTrashedMails] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [allMailLoading, setAllMailLoading] = useState(false);
  // Add separate pagination states for each tab
  const [inboxPage, setInboxPage] = useState(1);
  const [sentPage, setSentPage] = useState(1);
  const [starredPage, setStarredPage] = useState(1);
  const [trashPage, setTrashPage] = useState(1);
  const [inboxLastPage, setInboxLastPage] = useState(1);
  const [sentLastPage, setSentLastPage] = useState(1);
  const [starredLastPage, setStarredLastPage] = useState(1);
  const [trashLastPage, setTrashLastPage] = useState(1);

  const showMailHandler = (mail) => {
    setCurrentMail(mail);
  };

  const fetchMail = () => {};

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleShowNewMail = () => {
    setShowNewMail(true);
    setShowMailList(false);
    setMailReplay(false);
  };
  const handleListingClick = (inbox) => {
    setActiveList(inbox);
    // Reset pagination for the selected tab
    switch (inbox) {
      case "inbox":
        setPageNumber(inboxPage);
        setLastPage(inboxLastPage);
        break;
      case "sent":
        setPageNumber(sentPage);
        setLastPage(sentLastPage);
        break;
      case "starred":
        setPageNumber(starredPage);
        setLastPage(starredLastPage);
        break;
      case "deleted":
        setPageNumber(trashPage);
        setLastPage(trashLastPage);
        break;
    }
    setShowMailList(true);
    setShowNewMail(false);
    setMailReplay(false);
  };
  const handleMailReplay = () => {
    setMailReplay(true);
    setShowMailList(false);
    setShowNewMail(false);
    // We don't change the activeList here to maintain the current tab context
  };

  // get all mails
  const fetchAllMail = async () => {
    setAllMailLoading(true);
    const result = await generalGetFunction(
      `/emails?type=inbox&page=${pageNumber}`
    );
    if (result?.status) {
      setAllMails(result.data);
      const newLastPage = Math.ceil(
        result?.data?.totalEmails / result?.data?.emailsPerPage
      );
      setLastPage(newLastPage);
      setInboxLastPage(newLastPage);
      setInboxPage(pageNumber);
      setAllMailLoading(false);
    } else {
      setAllMailLoading(false);
    }
  };

  // get send mails
  const fetchSendMail = async () => {
    setAllMailLoading(true);
    const result = await generalGetFunction(
      `/emails?type=sent&page=${pageNumber}`
    );
    if (result?.status) {
      setAllSendMails(result.data);
      const newLastPage = Math.ceil(
        result?.data?.totalEmails / result?.data?.emailsPerPage
      );
      setLastPage(newLastPage);
      setSentLastPage(newLastPage);
      setSentPage(pageNumber);
      setAllMailLoading(false);
    } else {
      setAllMailLoading(false);
    }
  };

  // get starred mails
  const fetchStarredMail = async () => {
    setAllMailLoading(true);
    const result = await generalGetFunction(
      `/emails?type=starred&page=${pageNumber}`
    );
    if (result?.status) {
      setAllStarredMails(result.data);
      const newLastPage = Math.ceil(
        result?.data?.totalEmails / result?.data?.emailsPerPage
      );
      setLastPage(newLastPage);
      setStarredLastPage(newLastPage);
      setStarredPage(pageNumber);
      setAllMailLoading(false);
    } else {
      setAllMailLoading(false);
    }
  };

  // get trash mails
  const fetchTrashedMail = async () => {
    setAllMailLoading(true);
    const result = await generalGetFunction(
      `/emails?type=trash&page=${pageNumber}`
    );
    if (result?.status) {
      setAllTrashedMails(result.data);
      const newLastPage = Math.ceil(
        result?.data?.totalEmails / result?.data?.emailsPerPage
      );
      setLastPage(newLastPage);
      setTrashLastPage(newLastPage);
      setTrashPage(pageNumber);
      setAllMailLoading(false);
    } else {
      setAllMailLoading(false);
    }
  };

  const fetchData = async (shouldLoad) => {
    if (shouldLoad) setLoading(true);
    const result = await generalGetFunction("/mail-setting/all");
    if (result?.status) {
      setAvailableFromMailAddresses(result.data);
      setLoading(false);
      setRefreshState(false);
    } else {
      setLoading(false);
      setRefreshState(false);
      // navigate("/");
    }
  };
  useEffect(() => {
    setRefreshState(true);
    const shouldLoad = true;
    fetchData(shouldLoad);
    fetchAllMail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // Only fetch mails if we're in list view mode and not returning from mail reply
    if (showMailList && !mailReplay) {
      // Always fetch data when page number changes
      if (activeList === "inbox") {
        fetchAllMail();
      } else if (activeList === "sent") {
        fetchSendMail();
      } else if (activeList === "starred") {
        fetchStarredMail();
      } else if (activeList === "deleted") {
        fetchTrashedMail();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, activeList, showMailList, mailReplay]);

  // Add a new useEffect to handle initial data load
  useEffect(() => {
    // Only fetch mails if we're in list view mode and not returning from mail reply
    if (showMailList && !mailReplay) {
      // Check if we need to fetch data based on active tab and existing data
      const shouldFetch = (() => {
        switch (activeList) {
          case "inbox":
            return !allMails?.emails?.length;
          case "sent":
            return !allSendMails?.emails?.length;
          case "starred":
            return !allStarredMails?.emails?.length;
          case "deleted":
            return !allTrashedMails?.emails?.length;
          default:
            return true;
        }
      })();

      if (shouldFetch) {
        // Fetch mails based on active tab
        if (activeList === "inbox") {
          fetchAllMail();
        } else if (activeList === "sent") {
          fetchSendMail();
        } else if (activeList === "starred") {
          fetchStarredMail();
        } else if (activeList === "deleted") {
          fetchTrashedMail();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeList, showMailList, mailReplay]);

  const handleRefreshBtnClicked = () => {
    setRefreshState(true);
    const shouldLoad = false;
    fetchData(shouldLoad);
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
          <div className="col-12 ps-xl-0 stickyHeader">
            <HeaderApp
              title={"E-Mail"}
              loading={loading}
              setLoading={setLoading}
              refreshApi={() => featureUnderdevelopment()}
            />
          </div>
          <div className="container-fluid">
            <div className="row webrtc_newMessageUi">
              <div className="p-0">
                <div className="card mb-0 border-0">
                  <div
                    className="card-header d-flex justify-content-between align-items-center"
                    style={{ borderColor: "var(--me-border1)" }}
                  >
                    <h5 className="card-title mb-0 text_dark">Mailbox</h5>
                    {/* <button className="btn btn-primary"><i class="fa-regular fa-envelope me-2"></i>  New Email</button> */}
                    <button
                      type="button"
                      class="btn btn-primary"
                      onClick={() => {
                        setShowNewMail(true);
                        setMailReplay(false);
                      }}
                    >
                      <i class="fa-regular fa-envelope me-2"></i> New Email
                    </button>
                  </div>
                  <div
                    className="card-body"
                    style={{ height: "calc(100vh - 135px)" }}
                  >
                    <div className="d-flex ">
                      <div className="card mail_leftbar rounded-end-3 mb-0 shadow-none">
                        <div className="card-body ps-0">
                          <ul>
                            <li className=" ">
                              <button
                                // className={`mail_list ${activeList === "inbox" ? "active" : ""}`}
                                //   onClick={handleListingClick}
                                className={`mail_list ${
                                  activeList === "inbox" ? "active" : ""
                                }`}
                                onClick={() => handleListingClick("inbox")}
                              >
                                <p className="mb-0">
                                  {" "}
                                  <i class="fa-duotone fa-solid fa-envelope me-2"></i>{" "}
                                  Inbox
                                </p>
                                <div className="badge badge-solid-primary rounded-pill rounded-5">
                                  <span>30</span>
                                </div>
                              </button>
                            </li>
                            <li>
                              <button
                                // className={`mail_list ${activeList === "inbox" ? "active" : ""}`}
                                className={`mail_list ${
                                  activeList === "sent" ? "active" : ""
                                }`}
                                onClick={() => handleListingClick("sent")}
                              >
                                <p className="mb-0">
                                  <i class="fa-duotone fa-solid fa-paper-plane me-2"></i>{" "}
                                  Sent Item
                                </p>
                              </button>
                            </li>
                            <li className="">
                              <button
                                className={`mail_list ${
                                  activeList === "starred" ? "active" : ""
                                }`}
                                onClick={() => handleListingClick("starred")}
                              >
                                <p className="mb-0">
                                  <i class="fa-duotone fa-light fa-star me-2"></i>{" "}
                                  Starred
                                </p>
                              </button>
                            </li>
                            <li className="">
                              <button
                                className={`mail_list ${
                                  activeList === "deleted" ? "active" : ""
                                }`}
                                onClick={() => handleListingClick("deleted")}
                              >
                                {" "}
                                <p className="mb-0 text-danger">
                                  <i class="fa-duotone fa-solid fa-trash me-2"></i>{" "}
                                  Deleted
                                </p>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {activeList === "inbox" && (
                        <div className="table_card">
                          {showMailList && !mailReplay && !showNewMail && (
                            <EmailList
                              handleShowNewMail={handleShowNewMail}
                              handleListingClick={handleListingClick}
                              handleMailReplay={handleMailReplay}
                              showMailHandler={showMailHandler}
                              loading={allMailLoading}
                              allMails={allMails}
                              pageNumber={pageNumber}
                              setPageNumber={setPageNumber}
                              lastPage={lastPage}
                            />
                          )}

                          {mailReplay && !showMailList && !showNewMail && (
                            <MailReply
                              handleShowNewMail={handleShowNewMail}
                              handleListingClick={handleListingClick}
                              handleMailReplay={handleMailReplay}
                              currentMail={currentMail}
                              activeList={activeList}
                            />
                          )}

                          {showNewMail && !mailReplay && (
                            <NewMail
                              handleShowNewMail={handleShowNewMail}
                              handleListingClick={handleListingClick}
                              handleMailReplay={handleMailReplay}
                              availableFromMailAddresses={
                                availableFromMailAddresses
                              }
                              activeList={activeList}
                            />
                          )}
                        </div>
                      )}{" "}
                      {activeList === "sent" && (
                        <div className="table_card">
                          {showMailList && !mailReplay && !showNewMail && (
                            <EmailList
                              handleShowNewMail={handleShowNewMail}
                              handleListingClick={handleListingClick}
                              handleMailReplay={handleMailReplay}
                              showMailHandler={showMailHandler}
                              loading={allMailLoading}
                              allMails={allSendMails}
                              pageNumber={pageNumber}
                              setPageNumber={setPageNumber}
                              lastPage={lastPage}
                            />
                          )}
                          {mailReplay && !showMailList && !showNewMail && (
                            <MailReply
                              handleShowNewMail={handleShowNewMail}
                              handleListingClick={handleListingClick}
                              handleMailReplay={handleMailReplay}
                              currentMail={currentMail}
                              activeList={activeList}
                            />
                          )}
                          {showNewMail && !mailReplay && (
                            <NewMail
                              handleShowNewMail={handleShowNewMail}
                              handleListingClick={handleListingClick}
                              handleMailReplay={handleMailReplay}
                              availableFromMailAddresses={
                                availableFromMailAddresses
                              }
                              activeList={activeList}
                            />
                          )}
                        </div>
                      )}
                      {activeList === "starred" && (
                        <div className="table_card">
                          {showMailList && !mailReplay && !showNewMail && (
                            <EmailList
                              handleShowNewMail={handleShowNewMail}
                              handleListingClick={handleListingClick}
                              handleMailReplay={handleMailReplay}
                              showMailHandler={showMailHandler}
                              loading={allMailLoading}
                              allMails={allStarredMails}
                              pageNumber={pageNumber}
                              setPageNumber={setPageNumber}
                              lastPage={lastPage}
                            />
                          )}
                          {mailReplay && !showMailList && !showNewMail && (
                            <MailReply
                              handleShowNewMail={handleShowNewMail}
                              handleListingClick={handleListingClick}
                              handleMailReplay={handleMailReplay}
                              currentMail={currentMail}
                              activeList={activeList}
                            />
                          )}
                          {showNewMail && !mailReplay && (
                            <NewMail
                              handleShowNewMail={handleShowNewMail}
                              handleListingClick={handleListingClick}
                              handleMailReplay={handleMailReplay}
                              availableFromMailAddresses={
                                availableFromMailAddresses
                              }
                              activeList={activeList}
                            />
                          )}
                        </div>
                      )}
                      {activeList === "deleted" && (
                        <div className="table_card">
                          {showMailList && !mailReplay && !showNewMail && (
                            <EmailList
                              handleShowNewMail={handleShowNewMail}
                              handleListingClick={handleListingClick}
                              handleMailReplay={handleMailReplay}
                              showMailHandler={showMailHandler}
                              loading={allMailLoading}
                              allMails={allTrashedMails}
                              pageNumber={pageNumber}
                              setPageNumber={setPageNumber}
                              lastPage={lastPage}
                            />
                          )}
                          {mailReplay && !showMailList && !showNewMail && (
                            <MailReply
                              handleShowNewMail={handleShowNewMail}
                              handleListingClick={handleListingClick}
                              handleMailReplay={handleMailReplay}
                              currentMail={currentMail}
                              activeList={activeList}
                            />
                          )}
                          {showNewMail && !mailReplay && (
                            <NewMail
                              handleShowNewMail={handleShowNewMail}
                              handleListingClick={handleListingClick}
                              handleMailReplay={handleMailReplay}
                              availableFromMailAddresses={
                                availableFromMailAddresses
                              }
                              activeList={activeList}
                            />
                          )}
                        </div>
                      )}
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

export default Email;
