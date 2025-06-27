import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  featureUnderdevelopment,
  generalGetFunction,
  generalPostFunction,
  useDebounce,
} from "../../GlobalFunction/globalFunction";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "../../CommonComponents/DarkModeToggle";
import { useSIPProvider } from "modify-react-sipjs";
import MailReply from "./mailBox/MailReply";
import EmailList from "./mailBox/EmailList";
import ActionListMulti from "../../CommonComponents/ActionListMulti";
import HeaderApp from "./HeaderApp";
import NewMail from "./mailBox/NewMail";
import { toast } from "react-toastify";
import { api_url } from "../../../urls";
import { useForm } from "react-hook-form";
import ThreeDotedLoader from "../../Loader/ThreeDotedLoader";

function Email({ selectedMail }) {
  const [loading, setLoading] = useState(false);
  const [loadingForDownloadAtachment, setLoadingForDownLoadAtachment] = useState(false);
  const [loadingForActions, setLoadingForActions] = useState([])
  const [labelLoader, setLabelLoader] = useState(false);
  const sessions = useSelector((state) => state.sessions);
  const account = useSelector((state) => state.account);
  const { sessionManager } = useSIPProvider();
  const [availableFromMailAddresses, setAvailableFromMailAddresses] = useState([]);
  const [selectedFromMailAddressId, setSelectedFromMailAddressId] = useState("")
  const [allCategory, setAllCategory] = useState()
  const [showMailList, setShowMailList] = useState(true);
  const [mailReplay, setMailReplay] = useState(false);
  const [showNewMail, setShowNewMail] = useState(false);
  const [activeList, setActiveList] = useState("inbox");
  const [activeCategory, setActiveCategory] = useState()
  const [currentMail, setCurrentMail] = useState([]);
  const [allMails, setAllMails] = useState([]);
  const [allStarredMails, setAllStarredMails] = useState([]);
  const [allSendMails, setAllSendMails] = useState([]);
  const [allTrashedMails, setAllTrashedMails] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [allMailLoading, setAllMailLoading] = useState(false);
  const [checkedMail, setCheckedMail] = useState([])
  const [isAdvanceFilterClicked, setIsAdvanceFilterClicked] = useState(false)
  const [entriesPerPage, setEntriesPerPage] = useState(20)
  const [searchInput, setSearchInput] = useState("")
  const slugPermissions = useSelector((state) => state?.permissions);
  const debouncedSearchTerm = useDebounce(searchInput, 1000);
  // Add separate pagination states for each tab
  const [inboxPage, setInboxPage] = useState(1);
  const [sentPage, setSentPage] = useState(1);
  const [starredPage, setStarredPage] = useState(1);
  const [trashPage, setTrashPage] = useState(1);
  const [inboxLastPage, setInboxLastPage] = useState(1);
  const [sentLastPage, setSentLastPage] = useState(1);
  const [starredLastPage, setStarredLastPage] = useState(1);
  const [trashLastPage, setTrashLastPage] = useState(1);

  const fetchMail = () => { };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleShowNewMail = () => {
    setShowNewMail(true);
    setShowMailList(false);
    setMailReplay(false);
  };
  const handleMailReplay = () => {
    // setMailReplay(true);
    setShowMailList(false);
    setShowNewMail(false);
    // We don't change the activeList here to maintain the current tab context
  };



  // get send mails
  // const fetchSendMail = async () => {
  //   setAllMailLoading(true);
  //   const result = await generalGetFunction(
  //     `/emails?type=sent&page=${pageNumber}`
  //   );
  //   if (result?.status) {
  //     setAllSendMails(result.data);
  //     const newLastPage = Math.ceil(
  //       result?.data?.totalEmails / result?.data?.emailsPerPage
  //     );
  //     setLastPage(newLastPage);
  //     setSentLastPage(newLastPage);
  //     setSentPage(pageNumber);
  //     setAllMailLoading(false);
  //   } else {
  //     setAllMailLoading(false);
  //   }
  // };

  // get starred mails
  // const fetchStarredMail = async () => {
  //   setAllMailLoading(true);
  //   const result = await generalGetFunction(
  //     `/emails?type=starred&page=${pageNumber}`
  //   );
  //   if (result?.status) {
  //     setAllStarredMails(result.data);
  //     const newLastPage = Math.ceil(
  //       result?.data?.totalEmails / result?.data?.emailsPerPage
  //     );
  //     setLastPage(newLastPage);
  //     setStarredLastPage(newLastPage);
  //     setStarredPage(pageNumber);
  //     setAllMailLoading(false);
  //   } else {
  //     setAllMailLoading(false);
  //   }
  // };

  // get trash mails
  // const fetchTrashedMail = async () => {
  //   setAllMailLoading(true);
  //   const result = await generalGetFunction(
  //     `/emails?type=trash&page=${pageNumber}`
  //   );
  //   if (result?.status) {
  //     setAllTrashedMails(result.data);
  //     const newLastPage = Math.ceil(
  //       result?.data?.totalEmails / result?.data?.emailsPerPage
  //     );
  //     setLastPage(newLastPage);
  //     setTrashLastPage(newLastPage);
  //     setTrashPage(pageNumber);
  //     setAllMailLoading(false);
  //   } else {
  //     setAllMailLoading(false);
  //   }
  // };

  const fetchMailCategory = async (shouldLoad, id, isInitial) => {
    if (shouldLoad) {
      setAllMailLoading(true)
      setLabelLoader(true)
    }
    setLoading(true);
    const result = await generalGetFunction(api_url?.GET_EMAIL_LABELS(id));
    if (result?.status) {
      setLabelLoader(false)
      setAllCategory(result?.data);
      if (isInitial) {
        //  const isCategoryExistInAnotherCagetory = result?.data?.find((item) => item?.label?.toLocaleLowerCase() == activeCategory?.label?.toLocaleLowerCase())
        //  if(isCategoryExistInAnotherCagetory){
        //   fetchAllMail(activeCategory?.value, true, "", selectedFromMailAddressId);
        //  }
        fetchAllMail(result?.data[0]?.value, true, "", availableFromMailAddresses[0]?.id);
      } else {
        fetchAllMail(activeCategory?.value, false, "", selectedFromMailAddressId);
      }

      if (activeCategory && !isInitial) {
        setActiveCategory(activeCategory)
        setActiveList(activeCategory?.label)
      } else {
        // const isCategoryExistInAnotherCagetory = result?.data?.find((item) => item?.label?.toLocaleLowerCase() == activeCategory?.label?.toLocaleLowerCase())
        // if (isCategoryExistInAnotherCagetory) {
        //   setActiveCategory(activeCategory)
        //   setActiveList(activeCategory?.label)
        // }
        setActiveCategory(result?.data[0])
        setActiveList(result?.data[0]?.label)
      }
    } else {
      // navigate("/");
    }
  };

  // get all mails
  const fetchAllMail = async (mail_type, shouldLoad, filterData, id) => {
    if (shouldLoad) {
      setAllMailLoading(true);
    }
    setLoading(true)
    const result = await generalGetFunction(
      `/emails?type=${mail_type}&page=${pageNumber}&row_per_page=${entriesPerPage}&search=${searchInput}&from=${filterData?.from || ""}&to=${filterData?.to || ""}&subject=${filterData?.subject || ""}&since=${filterData?.since || ""}&before=${filterData?.before || ""}&id=${id}`
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
      setLoading(false)
    } else {
      setAllMailLoading(false);
      setLoading(false)
    }
  };

  const deleteMail = async (payload) => {
    setLoading(true)
    const result = await generalPostFunction(api_url?.MOVE_TO_TRASH, payload);
    if (result?.status) {
      fetchAllMail(activeCategory?.value, false, "", selectedFromMailAddressId)
      fetchMailCategory(false, selectedFromMailAddressId, false)
      setCheckedMail([])
      toast.success(result?.message)
    } else {
      setAllMailLoading(false);
    }
  }

  const mailStatusApiCall = async (shouldLoad, shouldToast, payload) => {
    if (shouldLoad)
      setAllMailLoading(true);
    setLoading(true)
    const result = await generalPostFunction(api_url?.EMAIL_STATUS, payload);
    if (result?.status) {
      fetchAllMail(activeCategory?.value, false, "", selectedFromMailAddressId)
      fetchMailCategory(false, selectedFromMailAddressId, false)
      setCheckedMail([])
      if (shouldToast)
        toast.success(result?.message)
    } else {
      setAllMailLoading(false);
    }
  }

  const mailBodyMessageApi = async (shouldLoad, payload) => {
    if (shouldLoad)
      setAllMailLoading(true);
    setLoading(true)
    const result = await generalGetFunction(api_url?.GET_EMAIL_BY_UID(payload));
    if (result?.status) {
      setCurrentMail(result?.data)
      setMailReplay(true);
      setCheckedMail([])
      toast.success(result?.message)
    } else {
      setAllMailLoading(false);
    }
  }

  const fetchData = async (shouldLoad) => {
    if (shouldLoad) setLoading(true);
    const result = await generalGetFunction(api_url?.ALL_MAIL_SETTINGS);
    if (result?.status) {
      setAvailableFromMailAddresses(result.data);
      setLoading(false);
    } else {
      setLoading(false);
      // navigate("/");
    }
  };

  const callDownloadAllAtachmentApi = async (payload) => {
    setLoadingForDownLoadAtachment(true);
    const result = await generalGetFunction(api_url?.DOWNLOAD_MAIL_ATACHMENT(payload));
    if (result?.status) {
      setLoadingForDownLoadAtachment(false)
      toast.success(result?.message)
    } else {
      setLoadingForDownLoadAtachment(false)
    }
  };

  // all useEffect stuff start here ===============
  useEffect(() => {
    const shouldLoad = true;
    fetchData(shouldLoad);
  }, []);

  useEffect(() => {
    const shouldLoad = true;
    if (availableFromMailAddresses?.length > 0) {
      if (!selectedFromMailAddressId) {
        fetchMailCategory(shouldLoad, availableFromMailAddresses[0]?.id, true)
        setSelectedFromMailAddressId(availableFromMailAddresses[0]?.id)
      } else {
        fetchMailCategory(false, selectedFromMailAddressId, false)
        setSelectedFromMailAddressId(selectedFromMailAddressId)
      }
    }
  }, [availableFromMailAddresses])

  useEffect(() => {
    if (activeCategory)
      fetchAllMail(activeCategory?.value, true, "", selectedFromMailAddressId)
  }, [pageNumber, entriesPerPage, debouncedSearchTerm]);

  // Add a new useEffect to handle initial data load
  // useEffect(() => {
  //   // Only fetch mails if we're in list view mode and not returning from mail reply
  //   if (showMailList && !mailReplay) {
  //     // Check if we need to fetch data based on active tab and existing data
  //     const shouldFetch = (() => {
  //       switch (activeList) {
  //         case "inbox":
  //           return !allMails?.emails?.length;
  //         case "sent":
  //           return !allSendMails?.emails?.length;
  //         case "starred":
  //           return !allStarredMails?.emails?.length;
  //         case "deleted":
  //           return !allTrashedMails?.emails?.length;
  //         default:
  //           return true;
  //       }
  //     })();

  //     if (shouldFetch) {
  //       // Fetch mails based on active tab
  //       if (activeList === "inbox") {
  //         // fetchAllMail();
  //       } else if (activeList === "sent") {
  //         fetchSendMail();
  //       } else if (activeList === "starred") {
  //         fetchStarredMail();
  //       } else if (activeList === "deleted") {
  //         fetchTrashedMail();
  //       }
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [activeList, showMailList, mailReplay]);

  // const handleRefreshBtnClicked = () => {
  //   setRefreshState(true);
  //   const shouldLoad = false;
  //   fetchData(shouldLoad);
  // };

  // all useEffect stuff end here ================

  const handleListingClick = (category) => {
    setActiveList(category?.label);
    setActiveCategory(category)
    fetchAllMail(category?.value, true, "", selectedFromMailAddressId)
    setShowMailList(true);
    setShowNewMail(false);
    setMailReplay(false);
    setPageNumber(1)
  };

  const handleMailDelete = (item) => {
    setLoadingForActions(prev => [...prev, item]);
    deleteMail({
      uid: [item?.uid?.toString()],
      type: activeCategory?.value,
      action: activeCategory?.value == "[Gmail]/Trash" ? "delete" : "move",
      id: selectedFromMailAddressId
    }).finally(() => {
      setLoadingForActions(prev =>
        prev.filter(actionItem => actionItem.uid !== item.uid)
      )
    });
  }

  const handleMultipleDelete = () => {
    const listOfMessageId = checkedMail?.map((item) => item?.uid?.toString())
    setLoadingForActions(prev => [...prev, ...checkedMail]);
    deleteMail({
      uid: listOfMessageId,
      type: activeCategory?.value,
      action: activeCategory?.value == "[Gmail]/Trash" ? "delete" : "move",
      id: selectedFromMailAddressId
    }).finally(() => {
      setLoadingForActions(prev =>
        prev.filter(actionItem =>
          !checkedMail.some(checked => checked.uid === actionItem.uid)
        )
      );
    });
  }

  const handleMultipleSeen = () => {
    const isAllMailUnseen = checkedMail?.every(item => !item?.status_flags?.seen);
    if (!isAllMailUnseen) {
      toast.warning("Please select only unseen mails!");
      return;
    }
    const listOfMessageId = checkedMail?.map((item) => item?.uid?.toString())
    setLoadingForActions(prev => [...prev, ...checkedMail]);
    const shouldLoad = false;
    mailStatusApiCall(shouldLoad, true, {
      uid: listOfMessageId,
      action: "seen",
      type: activeCategory?.value,
      id: selectedFromMailAddressId
    }).finally(() => {
      setLoadingForActions(prev =>
        prev.filter(actionItem =>
          !checkedMail.some(checked => checked.uid === actionItem.uid)
        )
      );
    });
  }

  const handleMultipleUnSeen = () => {
    const isAllMailSeen = checkedMail?.every(item => item?.status_flags?.seen);
    if (!isAllMailSeen) {
      toast.warning("Please select only seen mails!");
      return;
    }
    const listOfMessageId = checkedMail?.map((item) => item?.uid?.toString())
    setLoadingForActions(prev => [...prev, ...checkedMail]);
    const shouldLoad = false;
    mailStatusApiCall(shouldLoad, true, {
      uid: listOfMessageId,
      action: "unseen",
      type: activeCategory?.value,
      id: selectedFromMailAddressId
    }).finally(() => {
      setLoadingForActions(prev =>
        prev.filter(actionItem =>
          !checkedMail.some(checked => checked.uid === actionItem.uid)
        )
      );
    });
  }

  const handleMultipleStarred = () => {
    const isAllMailUnseen = checkedMail?.every(item => !item?.status_flags?.starred);
    if (!isAllMailUnseen) {
      toast.warning("Please select only unseen mails!");
      return;
    }
    const listOfMessageId = checkedMail?.map((item) => item?.uid?.toString())
    setLoadingForActions(prev => [...prev, ...checkedMail]);
    const shouldLoad = false;
    mailStatusApiCall(shouldLoad, true, {
      uid: listOfMessageId,
      action: "starred",
      type: activeCategory?.value,
      id: selectedFromMailAddressId
    }).finally(() => {
      setLoadingForActions(prev =>
        prev.filter(actionItem =>
          !checkedMail.some(checked => checked.uid === actionItem.uid)
        )
      );
    });
  }
  const handleMultipleUnStarred = () => {
    const isAllMailSeen = checkedMail?.every(item => item?.status_flags?.starred);
    if (!isAllMailSeen) {
      toast.warning("Please select only seen mails!");
      return;
    }
    const listOfMessageId = checkedMail?.map((item) => item?.uid?.toString())
    setLoadingForActions(prev => [...prev, ...checkedMail]);
    const shouldLoad = false;
    mailStatusApiCall(shouldLoad, true, {
      uid: listOfMessageId,
      action: "unstarred",
      type: activeCategory?.value,
      id: selectedFromMailAddressId
    }).finally(() => {
      setLoadingForActions(prev =>
        prev.filter(actionItem =>
          !checkedMail.some(checked => checked.uid === actionItem.uid)
        )
      );
    });
  }

  const handleShowMail = async (mail, shouldToast) => {
    setLoadingForActions(prev => [...prev, mail]);
    setLoading(true)
    const shouldLoad = false
    mailStatusApiCall(shouldLoad, shouldToast, {
      uid: [mail?.uid],
      action: mail?.status_flags?.seen ? "unseen" : "seen",
      type: activeCategory?.value,
      id: selectedFromMailAddressId
    }).finally(() => {
      setLoadingForActions(prev =>
        prev.filter(actionItem => actionItem.uid !== mail?.uid)
      )
    });
    mailBodyMessageApi(shouldLoad, { type: activeCategory?.value, uid: mail?.uid, id: selectedFromMailAddressId })
  };

  const handleUnSeenMail = (mail) => {
    setLoadingForActions(prev => [...prev, mail]);
    const shouldLoad = false
    mailStatusApiCall(shouldLoad, true, {
      uid: [mail?.uid],
      action: mail?.status_flags?.seen ? "unseen" : "seen",
      type: activeCategory?.value,
      id: selectedFromMailAddressId
    }).finally(() => {
      setLoadingForActions(prev =>
        prev.filter(actionItem => actionItem.uid !== mail?.uid)
      )
    });
  }

  const handleStarrClicked = (item) => {
    const shouldLoad = false;
    setLoadingForActions(prev => [...prev, item]);
    mailStatusApiCall(shouldLoad, true, {
      uid: [item?.uid],
      action: item?.status_flags?.starred ? "unstarred" : "starred",
      type: activeCategory?.value,
      id: selectedFromMailAddressId
    }).finally(() => {
      setLoadingForActions(prev =>
        prev.filter(actionItem => actionItem.uid !== item.uid)
      );
    });
  }

  const downloadAllAtachment = (mail) => {
    callDownloadAllAtachmentApi({ uid: mail?.uid, type: activeCategory?.value, id: selectedFromMailAddressId })
  }

  const getCategoryIconClass = (name) => {
    const formatted = name.toLowerCase();

    if (formatted.includes("inbox")) return "fa-solid fa-inbox";
    if (formatted.includes("sent")) return "fa-solid fa-paper-plane";
    if (formatted.includes("all mail")) return "fa-solid fa-box-archive";
    if (formatted.includes("draft")) return "fa-solid fa-pen-to-square";
    if (formatted.includes("spam")) return "fa-solid fa-triangle-exclamation";
    if (formatted.includes("trash") || formatted.includes("deleted")) return "fa-solid fa-trash";

    return "fa-solid fa-envelope";
  };

  const getCategoryColorClass = (name) => {
    const formatted = name.toLowerCase();
    if (formatted.includes("inbox")) return "text-primary";
    if (formatted.includes("sent")) return "text-info";
    if (formatted.includes("all mail")) return "text-secondary";
    if (formatted.includes("draft")) return "text-warning";
    if (formatted.includes("spam")) return "text-danger";
    if (formatted.includes("trash") || formatted.includes("deleted")) return "text-danger";
    return "text-dark";
  };

  const onSubmit = (data) => {
    setIsAdvanceFilterClicked(false)
    fetchAllMail(activeCategory?.value, true, data, selectedFromMailAddressId)
    reset("")
  };

  const handleMailFromAddressChange = (event) => {
    const shouldLoad = true;
    fetchMailCategory(shouldLoad, event?.target?.value, true)
    // fetchAllMail(activeCategory?.value, true, "", event?.target?.value);
    setSelectedFromMailAddressId(event?.target?.value)
  }

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
              refreshApi={() => {
                fetchData(false)
              }}
            />
          </div>
          <div className="container-fluid">
            <div className="row webrtc_newMessageUi">
              <div className="p-0">
                {availableFromMailAddresses?.length > 0 ?
                  <div className="card mb-0 border-0">
                    <div
                      className="card-header d-flex justify-content-between align-items-center"
                      style={{ borderColor: "var(--me-border1)" }}
                    >
                      <h5 className="card-title mb-0 text_dark">Mailbox</h5>
                      {/* <select
                      onChange={(event) => handleMailFromAddressChange(event)}
                    >
                      {availableFromMailAddresses?.map((item) => {
                        return (<option value={item?.id}>{item?.mail_from_address}</option>)
                      })}

                    </select> */}
                      {/* <button className="btn btn-primary"><i class="fa-regular fa-envelope me-2"></i>  New Email</button> */}
                      {/* <button
                      type="button"
                      class="btn btn-primary"
                      onClick={() => {
                        setShowNewMail(true);
                        setMailReplay(false);
                      }}
                    >
                      <i class="fa-regular fa-envelope me-2"></i> New Email
                    </button> */}
                      <div className="d-flex align-items-center justify-content-end gap-2">
                        <select className="formItem"
                          onChange={(event) => handleMailFromAddressChange(event)}
                        >
                          {availableFromMailAddresses?.map((item) => {
                            return (<option value={item?.id}>{item?.mail_from_address}</option>)
                          })}

                        </select>
                        <button
                          type="button"
                          class=" panelButton static text-nowrap text-white "
                          onClick={() => {
                            setIsAdvanceFilterClicked(true)
                          }}
                        >
                          <i class="fa-regular fa-filter me-2"></i> Advance Filter
                        </button>
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          <button className="clearButton2"
                            style={{
                              opacity: loadingForActions?.length > 1 ? 0.5 : 1
                            }}
                            onClick={() => {
                              if (!loadingForActions?.length > 0)
                                handleMultipleUnStarred()
                            }}
                          >
                            <i class="fa-regular fa-star" ></i>
                          </button>
                          <button className="clearButton2"
                            style={{
                              opacity: loadingForActions?.length > 1 ? 0.5 : 1
                            }}
                            onClick={() => {
                              if (!loadingForActions?.length > 0)
                                handleMultipleStarred()
                            }}
                          >
                            <i class="fa fa-star" ></i>
                          </button>
                          <button className="clearButton2"
                            style={{
                              opacity: loadingForActions?.length > 1 ? 0.5 : 1
                            }}
                            onClick={() => {
                              if (!loadingForActions?.length > 0)
                                handleMultipleDelete()
                            }}
                          >
                            <i class="fa-solid fa-trash"></i>
                          </button>
                          <button
                            className="clearButton2"
                            style={{
                              opacity: loadingForActions?.length > 1 ? 0.5 : 1
                            }}
                            onClick={() => {
                              if (!loadingForActions?.length > 0)
                                handleMultipleSeen()
                            }}>
                            <i class="fa-solid fa-envelope-open" ></i>
                          </button>
                          <button
                            className="clearButton2"
                            style={{
                              opacity: loadingForActions?.length > 1 ? 0.5 : 1
                            }}
                            onClick={() => {
                              if (!loadingForActions?.length > 0)
                                handleMultipleUnSeen()
                            }}>
                            <i class="fa-solid fa-envelope" ></i>
                          </button>
                        </div>

                      </div>

                      {/* <button
                      type="button"
                      class="btn btn-primary"
                      onClick={() => {
                        setIsAdvanceFilterClicked(true)
                      }}
                    >
                      <i class="fa-regular fa-filter me-2"></i> Advance Filter
                    </button> */}
                      {/* <h5 className="card-title mb-0 text_dark"> */}
                      {/* <i
                        class="fa-regular fa-star me-3"
                        style={{
                          opacity: loadingForActions?.length > 1 ? 0.5 : 1
                        }}
                        onClick={() => {
                          if (!loadingForActions?.length > 0)
                            handleMultipleStarred()
                        }}
                      ></i> */}
                      {/* <i
                        class="fa-solid fa-trash me-3"
                        style={{
                          opacity: loadingForActions?.length > 1 ? 0.5 : 1
                        }}
                        onClick={() => {
                          if (!loadingForActions?.length > 0)
                            handleMultipleDelete()
                        }
                        }
                      ></i>{" "} */}
                      {/* <i
                        class="fa-solid fa-envelope-open me-3"
                        style={{
                          opacity: loadingForActions?.length > 1 ? 0.5 : 1
                        }}
                        onClick={() => {
                          if (!loadingForActions?.length > 0)
                            handleMultipleSeen()
                        }
                        }
                      ></i> */}
                      {/* </h5> */}
                    </div>
                    <div
                      className="card-body"
                      style={{ height: "calc(100vh - 140px)", padding: '10px' }}
                    >
                      <div className="d-flex ">
                        <div className="card mail_leftbar rounded-end-3 mb-0 shadow-none">
                          <div className="card-body ps-0 pe-2 pt-0">
                            <button
                              type="button"
                              class="btn composeBtn w-100 mb-2"
                              onClick={() => {
                                setShowNewMail(true);
                                setMailReplay(false);
                              }}
                            >
                              <i class="fa-regular fa-envelope me-2"></i> Compose
                            </button>
                            <ul className="postion-relative"
                              style={labelLoader ? {
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "calc(100vh - 234px)"
                              } : undefined}>
                              {labelLoader ? <div class="spinner-border text-dark" role="status" >
                                <span class="sr-only">Loading...</span>
                              </div> :
                                (allCategory?.map((category) => {
                                  const iconClass = getCategoryIconClass(category?.label);
                                  const colorClass = getCategoryColorClass(category?.label);
                                  const isActive = activeList?.toLocaleLowerCase() === category?.label.toLowerCase();
                                  return (<li>
                                    <button
                                      className={`mail_list d-flex align-items-center ${isActive ? "active" : ""}`}
                                      onClick={() => handleListingClick(category)}
                                    >
                                      {" "}
                                      <p className={`mb-0 d-flex align-items-center `}>
                                        <i className={`${iconClass} me-2`}></i>{" "}
                                        {category?.label}
                                      </p>
                                      <div className="">
                                        <span className="fs-10" >{category?.unseenMessages}/{category?.totalMessages}</span>
                                      </div>
                                    </button>
                                  </li>)
                                }
                                ))}
                              {/* <li className=" ">
                              <button
                                // className={`mail_list ${activeList === "inbox" ? "active" : ""}`}
                                //   onClick={handleListingClick}
                                className={`mail_list ${activeList === "inbox" ? "active" : ""
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
                                className={`mail_list ${activeList === "sent" ? "active" : ""
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
                                className={`mail_list ${activeList === "starred" ? "active" : ""
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
                                className={`mail_list ${activeList === "deleted" ? "active" : ""
                                  }`}
                                onClick={() => handleListingClick("deleted")}
                              >
                                {" "}
                                <p className="mb-0 text-danger">
                                  <i class="fa-duotone fa-solid fa-trash me-2"></i>{" "}
                                  Deleted
                                </p>
                              </button>
                            </li> */}
                            </ul>
                          </div>
                        </div>
                        <div className="table_card">
                          {showMailList && !mailReplay && !showNewMail && (
                            <EmailList
                              // handleShowNewMail={handleShowNewMail}
                              // handleListingClick={handleListingClick}
                              handleMailReplay={handleMailReplay}
                              handleShowMail={handleShowMail}
                              loading={allMailLoading}
                              allMails={allMails}
                              pageNumber={pageNumber}
                              setPageNumber={setPageNumber}
                              lastPage={lastPage}
                              handleMailDelete={handleMailDelete}
                              setCheckedMail={setCheckedMail}
                              checkedMail={checkedMail}
                              handleUnSeenMail={handleUnSeenMail}
                              handleStarrClicked={handleStarrClicked}
                              setEntriesPerPage={setEntriesPerPage}
                              setSearchInput={setSearchInput}
                              account={account}
                              slugPermissions={slugPermissions}
                              loadingForActions={loadingForActions}
                            />
                          )}

                          {mailReplay && !showMailList && !showNewMail && (
                            <MailReply
                              handleShowNewMail={handleShowNewMail}
                              handleListingClick={handleListingClick}
                              handleMailReplay={handleMailReplay}
                              currentMail={currentMail}
                              activeList={activeList}
                              activeCategory={activeCategory}
                              handleMailDelete={handleMailDelete}
                              loading={loading}
                              downloadAllAtachment={downloadAllAtachment}
                              loadingForDownloadAtachment={loadingForDownloadAtachment}
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
                              selectedFromMailAddressId={selectedFromMailAddressId}
                            />
                          )}

                          {!showMailList && !mailReplay && !showNewMail && <ThreeDotedLoader />}
                        </div>
                        {/* {activeList === "sent" && (
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
                      )} */}
                      </div>
                    </div>
                  </div> :
                  <div style={{ textAlign: "center" }}>
                    You don't have permission for this module! Please connect with admin!
                  </div>
                }
              </div>
            </div>
          </div>
        </section>
        {
          isAdvanceFilterClicked && (

            <div className="popup">
              <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center ">
                  <div className="row content col-xl-4 col-md-5 px-0">
                    <div className="col-12">

                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className=" ">
                          <div className="formRow flex-column align-items-start">
                            <div className="formLabel">
                              <label>From</label>
                            </div>
                            <div className="col-12">
                              <input
                                {...register("from")}
                                type="text"
                                className="formItem"
                                placeholder="Sender email"
                              />
                            </div>
                          </div>
                          <div className="formRow flex-column align-items-start">
                            <div className="formLabel">
                              <label>To</label>
                            </div>
                            <div className="col-12">
                              <input
                                {...register("to")}
                                type="text"
                                className="formItem"
                                placeholder="Recipient email"
                              />
                            </div>
                          </div>
                          <div className="formRow flex-column align-items-start">
                            <div className="formLabel">
                              <label>Subject</label>
                            </div>
                            <div className="col-12">
                              <input
                                {...register("subject")}
                                type="text"
                                className="formItem"
                                placeholder="Subject"
                              />
                            </div>
                          </div>
                          <div className="formRow flex-row align-items-start gap-2">
                            <div className="formLabel mw-100 w-100">
                              <label>Date within</label>
                            </div>
                            <div className="col-12">
                              <input
                                {...register("since")}
                                type="date"
                                className="formItem"
                              // placeholder="Subject"
                              />
                            </div>
                            <div className="col-12">
                              <input
                                {...register("before")}
                                type="date"
                                className="formItem"
                              // placeholder="Subject"
                              />
                            </div>
                          </div>
                          {/* <div className="row mt-2">
                            <div className="col-4">Date within</div>
                            <div className="col-4">
                              <input
                                {...register("since")}
                                className="form-control"
                                type="date"
                              />
                            </div>
                            <div className="col-4">
                              <input
                                {...register("before")}
                                className="form-control"
                                type="date"
                              />
                            </div>
                          </div> */}

                          {/* <div className="row">
                            <div className="col-12">From</div>
                            <div className="col-12">
                              <input
                                {...register("from")}
                                className="form-control"
                                type="text"
                                placeholder="Sender email"
                              />
                            </div>
                          </div>

                     

                      <div className="row mt-2">
                        <div className="col-4">To</div>
                        <div className="col-4">
                          <input
                            {...register("to")}
                            className="form-control"
                            type="text"
                            placeholder="Recipient email"
                          />
                        </div>
                      </div>

                      <div className="row mt-2">
                        <div className="col-4">Subject</div>
                        <div className="col-4">
                          <input
                            {...register("subject")}
                            className="form-control"
                            type="text"
                            placeholder="Subject"
                          />
                        </div>
                      </div>


                      <div className="row mt-2">
                        <div className="col-4">Date within</div>
                        <div className="col-4">
                          <input
                            {...register("since")}
                            className="form-control"
                            type="date"
                          />
                        </div>
                        <div className="col-4">
                          <input
                            {...register("before")}
                            className="form-control"
                            type="date"
                          />
                        </div>
                      </div> */}

                          <div className="d-flex justify-content-end gap-2 mt-4">
                            <button
                              type="button"
                              className="panelButton m-0"

                            >
                              <span className="text">Apply</span>
                              <span className="icon">
                                <i className="fa-solid fa-filter"></i>
                              </span>
                            </button>
                            <button
                              type="button"
                              className="panelButton gray m-0 float-end"
                              onClick={() => {
                                setIsAdvanceFilterClicked(false);
                              }}
                            >
                              <span className="text">Cancel</span>
                              <span className="icon">
                                <i className="fa-solid fa-xmark"></i>
                              </span>
                            </button>
                          </div>



                        </div>
                      </form>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            //             <div
            //               className="popup loggedPopupSm"
            //               style={{ backgroundColor: "#000000e0" }}
            //             >
            //               <div className="container h-100">
            //                 <div className="row h-100 ">

            //                   <form onSubmit={handleSubmit(onSubmit)} className="col-12 ">
            //                     <div className=" content col-5 ">
            //                       <div className="formRow flex-column">
            //                         <div className="formLabel">
            //                           <label>From</label>
            //                         </div>
            //                         <div className="col-8">
            //                           <input
            //                             {...register("from")}
            //                             type="text"
            //                             className="formItem"
            //                             placeholder="Sender email"
            //                           />
            //                         </div>
            //                       </div>
            //                       <div className="formRow flex-column">
            //                         <div className="formLabel">
            //                           <label>To</label>
            //                         </div>
            //                         <div className="col-8">
            //                           <input
            //                             {...register("to")}
            //                             type="text"
            //                             className="formItem"
            //                             placeholder="Recipient email"
            //                           />
            //                         </div>
            //                       </div>
            //                       <div className="formRow flex-column">
            //                         <div className="formLabel">
            //                           <label>Subject</label>
            //                         </div>
            //                         <div className="col-8">
            //                           <input
            //                             {...register("subject")}
            //                             type="text"
            //                             className="formItem"
            //                             placeholder="Subject"
            //                           />
            //                         </div>
            //                       </div>

            //                       <div className="row">
            //                         <div className="col-12">From</div>
            //                         <div className="col-12">
            //                           <input
            //                             {...register("from")}
            //                             className="form-control"
            //                             type="text"
            //                             placeholder="Sender email"
            //                           />
            //                         </div>
            //                       </div>

            // {/* 

            //                       <div className="row mt-2">
            //                         <div className="col-4">To</div>
            //                         <div className="col-4">
            //                           <input
            //                             {...register("to")}
            //                             className="form-control"
            //                             type="text"
            //                             placeholder="Recipient email"
            //                           />
            //                         </div>
            //                       </div>

            //                       <div className="row mt-2">
            //                         <div className="col-4">Subject</div>
            //                         <div className="col-4">
            //                           <input
            //                             {...register("subject")}
            //                             className="form-control"
            //                             type="text"
            //                             placeholder="Subject"
            //                           />
            //                         </div>
            //                       </div>


            //                       <div className="row mt-2">
            //                         <div className="col-4">Date within</div>
            //                         <div className="col-4">
            //                           <input
            //                             {...register("since")}
            //                             className="form-control"
            //                             type="date"
            //                           />
            //                         </div>
            //                         <div className="col-4">
            //                           <input
            //                             {...register("before")}
            //                             className="form-control"
            //                             type="date"
            //                           />
            //                         </div>
            //                       </div> */}

            //                       <div className="mt-3 logoutPopup d-flex justify-content-center">
            //                         <button
            //                           type="submit"
            //                           className="btn btn_info"
            //                         >
            //                           <span>Apply</span>
            //                           <i className="fa-solid fa-filter ms-2"></i>
            //                         </button>

            //                         <button
            //                           type="submit"
            //                           className="btn btn_info ms-3"
            //                           onClick={() => setIsAdvanceFilterClicked(false)}
            //                         >
            //                           <span>Cancel</span>
            //                           <i className="fa-solid fa-times ms-2"></i>
            //                         </button>
            //                       </div>
            //                     </div>
            //                   </form>
            //                 </div>
            //               </div>
            //             </div>











          )
        }
      </main>
    </>
  );
}

export default Email;
