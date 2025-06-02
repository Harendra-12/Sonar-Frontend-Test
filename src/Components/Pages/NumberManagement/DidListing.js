/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { Link, useNavigate } from "react-router-dom";
import {
  backToTop,
  checkViewSidebar,
  featureUnderdevelopment,
  generalDeleteFunction,
  generalGetFunction,
  generalPostFunction,
  generalPutFunction,
  useDebounce,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Tippy from "@tippyjs/react";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import ThreeDotedLoader from "../../Loader/ThreeDotedLoader";

function DidListing({ page }) {
  const [did, setDid] = useState();
  const [didWithPagination, setDidWithPagination] = useState()
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const didAll = useSelector((state) => state.didAll);
  const newAddDid = useSelector((state) => state.newAddDid);
  const dispatch = useDispatch();
  const [usagesPopup, setUsagesPopup] = useState(false);
  const [usages, setUsages] = useState("");
  const [id, setId] = useState("");
  const [refreshDid, setRefreshDid] = useState(0);
  const [refreshState, setRefreshState] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [addNew, setAddNew] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [previousUsages, setPreviousUsages] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const account = useSelector((state) => state?.account);
  const slugPermissions = useSelector((state) => state?.permissions);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchTerm = useDebounce(searchQuery, 1000);
  const allUser = useSelector((state) => state.allUser);
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const extensionArr = useSelector((state) => state.extension);
  const extensionRefresh = useSelector((state) => state.extensionRefresh);
  const ringGroup = useSelector((state) => state.ringGroup);
  const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
  const callCenter = useSelector((state) => state.callCenter);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const ivrArr = useSelector((state) => state.ivr);
  const ivrRefresh = useSelector((state) => state.ivrRefresh);

  const [allUserArr, setAllUserArr] = useState([]);

  const getUserData = async () => {
    const apidataUser = await generalGetFunction(
      `/user/search?account=${account.account_id}${account.usertype !== 'Company' || account.usertype !== 'SupreAdmin' ? '&section=Accounts' : ""}`
    );
    if (apidataUser?.status) {
      setAllUserArr(apidataUser.data);
    }
  };

  useEffect(() => {
    if (account && account?.account_id) {
      getUserData();
    }
  }, []);

  useEffect(() => {
    setRefreshState(true);
    if (didAll?.data) {
      setLoading(true);
      // if (page == "number") {
      //   setDid(didAll?.data);
      // } else if (page == "pbx") {
      //   setDid(didAll?.data?.filter((item) => item.usages == "pbx"));
      // } else if (page == "dialer") {
      //   setDid(didAll?.data?.filter((item) => item.usages == "dialer"));
      // } else if (page == "tracker") {
      //   setDid(didAll?.data?.filter((item) => item?.usages == "tracker"))
      // }
      const shouldLoad = true;
      getData(shouldLoad);
    } else {
      const shouldLoad = true;
      getData(shouldLoad);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshDid, page, debouncedSearchTerm, entriesPerPage, pageNumber]);

  // Fetch all the data
  useEffect(() => {
    if (allUserRefresh < 1) {
      dispatch({
        type: "SET_ALLUSERREFRESH",
        allUserRefresh: allUserRefresh + 1,
      });
    }
    if (extensionRefresh < 1) {
      dispatch({
        type: "SET_EXTENSIONREFRESH",
        extensionRefresh: extensionRefresh + 1,
      });
    }

    if (ringGroupRefresh < 1) {
      dispatch({
        type: "SET_RINGGROUPREFRESH",
        ringGroupRefresh: ringGroupRefresh + 1,
      });
    }

    if (callCenterRefresh < 1) {
      dispatch({
        type: "SET_CALLCENTERREFRESH",
        callCenterRefresh: callCenterRefresh + 1,
      });
    }

    if (ivrRefresh < 1) {
      dispatch({
        type: "SET_IVRREFRESH",
        ivrRefresh: ivrRefresh + 1,
      });
    }
  }, [allUser, extensionArr, ringGroup, callCenter, ivrArr]);

  // Fetch ALL DID
  async function getData(shouldLoad) {
    if (shouldLoad) setLoading(true);
    let allDidUrl = `/did/all?search=${searchQuery}&usages=${page}&page=${pageNumber}&row_per_page=${entriesPerPage}`
    if (page === "number")
      allDidUrl = `/did/all?search=${searchQuery}&page=${pageNumber}&row_per_page=${entriesPerPage}`
    const apiData = await generalGetFunction(allDidUrl);
    if (apiData?.status) {
      setLoading(false);
      setRefreshState(false);
      // if (page === "number") {
      //   setDid(apiData.data?.data);
      //   setDidWithPagination(apiData?.data);
      // } else if (page === "pbx") {
      //   setDid(apiData?.data?.data?.filter((item) => item.usages === "pbx"));
      //   setDidWithPagination(apiData?.data);
      // } else if (page === "dialer") {
      //   setDid(apiData?.data?.data.filter((item) => item.usages === "dialer"));
      //   setDidWithPagination(apiData?.data);
      // }
      setDid(apiData.data?.data);
      setDidWithPagination(apiData?.data);
      dispatch({
        type: "SET_DIDALL",
        didAll: apiData.data || [],
      });
    } else {
      setLoading(false);
      setRefreshState(false);
      navigate(-1);
    }
  }

  const handleClick = async (id) => {
    setLoading(true);
    try {
      const apiData = await generalDeleteFunction(
        `/did/configure/destroy/${id}`
      );
      if (apiData?.status) {
        setLoading(false);
        toast.success(apiData.message);
        setRefreshDid(refreshDid + 1);
        // const newData = await generalGetFunction(`/did/all`);
        // if (newData?.status) {
        //   setDid(newData.data);
        //   toast.success(apiData.message);
        //   setRefreshDid(refreshDid + 1);
        // } else {
        //   toast.error(apiData.message);
        //   // navigate(-1);
        // }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  async function handleClickDefault(id, action) {
    setLoading(true);
    const parsedData = {
      id: id,
    };
    const apiData = await generalPostFunction(
      `/did/set-default?${action ? action : ""}`,
      parsedData
    );
    if (apiData?.status) {
      setLoading(false);
      toast.success(apiData.message);
      setRefreshDid(refreshDid + 1);
    } else {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (newAddDid) {
      const addedDid = did?.find((item) => item.id === newAddDid.id);
      if (addedDid) {
        navigate(`/did-config`, {
          state: addedDid,
        });
      }
    }
  }, [newAddDid, did]);

  async function handleUsagesEdit(id) {
    setLoading(true);
    setAddNew(false);
    const parsedData = {
      usages: page === "pbx" ? "pbx" : page === "dialer" ? "dialer" : usages,
    };
    const apiData = await generalPutFunction(`/did/update/${id}`, parsedData);
    if (apiData.status) {
      setLoading(false);
      setUsages("");
      setPreviousUsages("");
      toast.success(apiData.message);
      setRefreshDid(refreshDid + 1);
    } else {
      setLoading(false);
      toast.error(apiData.message);
    }
  }

  async function handleDelete(id) {
    setLoading(true);
    const apiData = await generalDeleteFunction(`/did/destroy/${id}`);
    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message);
      setRefreshDid(refreshDid + 1);
      setDeleteId("");
    } else {
      setLoading(false);
      // toast.error(apiData.message)
    }
  }

  // Debounce Search Function
  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //     getData();
  //   }, 500);

  //   return () => clearTimeout(delay);
  // }, [searchQuery]);

  const handleRefreshBtnClicked = () => {
    setRefreshState(true);
    const shouldLoad = false;
    getData(shouldLoad);
  };

  function checkUserName(extension, usages) {
    if (extension === null || extension === undefined) return "";

    if (usages === "extension") {
      const findData = extensionArr.find(
        (item) => item?.extension == extension
      );
      const userData = findData && allUserArr?.length > 0 && allUserArr?.find(
        (item) => item?.extension?.extension == findData.extension
      );

      return `${userData?.name}- `;
    }

    if (usages === "ring group") {
      const findData = ringGroup.find((item) => item?.extension == extension);
      return `${findData?.name}- `;
    }

    if (usages === "call center") {
      const findData = callCenter.find((item) => item?.extension == extension);
      return `${findData?.queue_name}- `;
    }

    if (usages === "ivr") {
      const ivrId = extension.split("_")[1];
      const findData = ivrArr.find((item) => item?.id == ivrId);
      return `${findData?.ivr_name}- `;
    }

    // if (usages === "pstn") {
    //   const findData = ringGroup.find((item) => item?.extension == extension);
    //   return `${findData?.name}- `;
    // }
  }

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Number Configuration" />

            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>
                          All DID
                          <button
                            className="clearButton"
                            onClick={handleRefreshBtnClicked}
                            disabled={refreshState}
                          >
                            <i
                              class={`fa-regular fa-arrows-rotate fs-5 
                                ${refreshState ? "fa-spin" : ""}`}
                            ></i>
                          </button>
                        </h4>
                        <p>Add a new DID</p>
                      </div>
                      <div className="buttonGroup">
                        <button
                          effect="ripple"
                          className="panelButton gray"
                          onClick={() => {
                            navigate(-1);
                            backToTop();
                          }}
                        >
                          <span className="text">Back</span>
                          <span className="icon">
                            <i className="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        {checkViewSidebar(
                          "DidConfigure",
                          slugPermissions,
                          account?.sectionPermissions,
                          account?.permissions,
                          "add"
                        ) && (
                            <button
                              type="button"
                              className="panelButton"
                              onClick={() => {
                                if (page === "number") {
                                  navigate("/did-add");
                                } else {
                                  setAddNew(true);
                                }
                              }}
                            >
                              <span className="text">Add</span>
                              <span className="icon">
                                <i className="fa-solid fa-plus"></i>
                              </span>
                            </button>
                          )}
                      </div>
                    </div>
                  </div>

                  {addNew ? (
                    didAll?.data?.filter((item) => item.usages === "" || !item.usages)
                      .length === 0 ? (
                      <div
                        className="popup loggedPopupSm"
                        style={{ backgroundColor: "#000000e0" }}
                      >
                        <div className="container h-100">
                          <div className="row h-100 justify-content-center align-items-center">
                            <div className="row content col-xl-4 col-md-5 align-items-center justify-content-center flex-column">
                              <div className="col-2 px-0">
                                <div className="iconWrapper log__warning mb-3">
                                  <img
                                    className=" "
                                    src={require("../../assets/images/crisis.png")}
                                    alt="logout"
                                  />
                                </div>
                              </div>
                              <div className="col-10 ps-0 px-0">
                                <h4 className="mb-2 text-center text-orange">
                                  Warning!
                                </h4>
                                <p className="text-center">
                                  All number is assign with other module please
                                  add <Link to="/did-add">new number</Link>!
                                </p>
                                <div className="mt-3 logoutPopup d-flex justify-content-center">
                                  <button
                                    type="button"
                                    class="btn btn_info"
                                    onClick={() => setAddNew(false)}
                                  >
                                    <span>Ok</span>
                                    <i class="fa-solid fa-power-off "></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="backdropContact">
                        <div className="addNewContactPopup">
                          <div className="row">
                            <div className="col-12 heading border-0 bg-transparent mb-0 pb-0">
                              <i className="fa-light fa-user-plus shadow-none" />
                              <h5 className=" text-primary">Add new DID </h5>
                            </div>
                            <div className="col-xl-12 ">
                              <div
                                className="tableContainer mt-0"
                                style={{ maxHeight: "calc(100vh - 400px)" }}
                              >
                                <table>
                                  <thead>
                                    <tr>
                                      <th>S.No</th>
                                      <th>Number</th>
                                      <th className="text-center">Add DID</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {didAll?.data?.filter(
                                      (item) =>
                                        item.usages === "" || !item.usages
                                    )
                                      .map((item, index) => {
                                        return (
                                          <tr>
                                            <td> {index + 1}</td>
                                            <td>{item.did}</td>
                                            {/* <button
                                                className="tableButton mx-auto"
                                                onClick={() =>
                                                  navigate(
                                                    "/device-provisioning-new",
                                                    {
                                                      state: {
                                                        extension: item.extension,
                                                        id: item.id,
                                                      },
                                                    }
                                                  )
                                                }
                                              >
                                                <i className="fa-solid fa-plus"></i>
                                              </button> */}
                                            <div className="mt-1">
                                              <button
                                                className="tableButton align-items-center justify-content-center mx-auto"
                                                onClick={() => {
                                                  handleUsagesEdit(item.id);
                                                }}
                                              >
                                                <i className="fa-solid fa-plus"></i>
                                              </button>
                                            </div>
                                          </tr>
                                        );
                                      })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="col-xl-12 mt-3">
                              <div className="d-flex justify-content-center">
                                <button
                                  className="panelButton gray ms-0"
                                  onClick={() => setAddNew(false)}
                                >
                                  <span className="text">Close</span>
                                  <span className="icon">
                                    <i className="fa-solid fa-caret-left" />
                                  </span>
                                </button>
                                {/* <button
                              className="panelButton me-0"

                            >
                              <span className="text">Done</span>
                              <span className="icon">
                                <i className="fa-solid fa-check" />
                              </span>
                            </button> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    ""
                  )}
                  <div
                    className="col-12"
                    style={{ overflow: "auto", padding: "10px 20px 0" }}
                  >
                    <div className="tableHeader">
                      <div className="showEntries">
                        <label>Show</label>
                        <select
                          className="formItem"
                          onChange={(e) => setEntriesPerPage(e?.target?.value)}
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={30}>30</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                        <label>entries</label>
                      </div>
                      {checkViewSidebar(
                        "DidDetail",
                        slugPermissions,
                        account?.sectionPermissions,
                        account?.permissions,
                        "search"
                      ) &&
                        <div className="searchBox position-relative">
                          <label>Search:</label>
                          <input
                            type="search"
                            name="Search"
                            className="formItem"
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      }
                    </div>
                    <div className="tableContainer">
                      {loading ? (
                        // <SkeletonTableLoader
                        //   col={page === "number" ? 10 : 12}
                        //   row={15}
                        // />
                        <ThreeDotedLoader />
                      ) :
                        <table>
                          <thead>
                            <tr>
                              <th>DID</th>
                              <th>E911</th>
                              <th>Cname</th>
                              <th>SMS</th>
                              {page === "pbx" ? (
                                <>
                                  <th>Tag</th>
                                  <th>Route</th>
                                </>
                              ) : (
                                ""
                              )}
                              <th>Recording</th>
                              {page === "number" ? (
                                <>
                                  <th>Usages</th>
                                </>
                              ) : (
                                ""
                              )}
                              {checkViewSidebar(
                                "DidDetail",
                                slugPermissions,
                                account?.sectionPermissions,
                                account?.permissions,
                                "edit"
                              ) &&
                                <th style={{ textAlign: "center" }}>
                                  WhatsApp DID
                                </th>
                              }
                              {checkViewSidebar(
                                "DidDetail",
                                slugPermissions,
                                account?.sectionPermissions,
                                account?.permissions,
                                "edit"
                              ) &&
                                <th style={{ textAlign: "center" }}>E-fax DID</th>
                              }
                              {
                                checkViewSidebar(
                                  "DidDetail",
                                  slugPermissions,
                                  account?.sectionPermissions,
                                  account?.permissions,
                                  "edit"
                                ) &&
                                <th style={{ textAlign: "center" }}>SMS DID</th>
                              }
                              {page === "pbx" ? (
                                <>
                                  <th style={{ textAlign: "center" }}>
                                    Default Caller DID
                                  </th>
                                </>
                              ) : (
                                ""
                              )}
                              {checkViewSidebar(
                                "DidDetail",
                                slugPermissions,
                                account?.sectionPermissions,
                                account?.permissions,
                                "delete"
                              ) && checkViewSidebar(
                                "DidDetail",
                                slugPermissions,
                                account?.sectionPermissions,
                                account?.permissions,
                                "edit"
                              ) && checkViewSidebar(
                                "DidConfigure",
                                slugPermissions,
                                account?.sectionPermissions,
                                account?.permissions,
                                "browse"
                              ) ?
                                <th style={{ textAlign: "center" }}>Options</th> : ""
                              }
                              {/* <th>Delete</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            <>
                              {did &&
                                did.map((item) => {
                                  return (
                                    <tr>
                                      <td style={{ cursor: "default" }}>
                                        {item.did}
                                      </td>
                                      <td style={{ cursor: "default" }}>
                                        {item?.e911}
                                      </td>
                                      <td style={{ cursor: "default" }}>
                                        {item?.cnam}
                                      </td>
                                      <td style={{ cursor: "default" }}>
                                        {item?.sms}
                                      </td>
                                      {page === "pbx" ? (
                                        <>
                                          <td>{item?.configuration?.tag}</td>
                                          <td style={{ cursor: "default" }}>
                                            {item?.configuration?.forward !==
                                              "disabled"
                                              ? checkUserName(
                                                item?.configuration
                                                  ?.forward_to,
                                                item?.configuration?.forward
                                              )
                                              : checkUserName(
                                                item?.configuration?.action,
                                                item?.configuration?.usages
                                              )}
                                            {item?.configuration?.forward_to
                                              ? item?.configuration?.forward_to
                                              : item?.configuration?.action}
                                          </td>
                                        </>
                                      ) : (
                                        ""
                                      )}
                                      <td>{item?.configuration ? item?.configuration?.record ? "Enabled" : "Disabled" : "N/A"}</td>

                                      {page === "number" ? (
                                        <>
                                          <td
                                            style={{
                                              cursor: "default",
                                              width: "152px",
                                            }}
                                          >
                                            {item.usages}
                                          </td>
                                        </>
                                      ) : (
                                        ""
                                      )}
                                      {checkViewSidebar(
                                        "DidDetail",
                                        slugPermissions,
                                        account?.sectionPermissions,
                                        account?.permissions,
                                        "edit"
                                      ) &&
                                        <td
                                          style={{
                                            cursor: "default",
                                            width: "152px",
                                          }}
                                        >
                                          <Tippy
                                            content={
                                              item.default_whatsapp === 1
                                                ? "This DID is set as default for WhatsApp"
                                                : item.is_secondary_whatsapp === 1
                                                  ? "This DID is set as secondary for WhatsApp"
                                                  : "Set this DID default for WhatsApp"
                                            }
                                          >
                                            <div className="dropdown w-100">
                                              <button
                                                data-bs-toggle="dropdown"
                                                className={
                                                  item.default_whatsapp === 1
                                                    ? "tableButton whatsapp mx-auto"
                                                    : item.is_secondary_whatsapp ===
                                                      1
                                                      ? "tableButton warning mx-auto"
                                                      : "tableButton whatsapp empty mx-auto"
                                                }
                                                style={{ cursor: "pointer" }}
                                              >
                                                <i className="fa-brands fa-whatsapp"></i>
                                              </button>
                                              <ul className="dropdown-menu actionBtnDropdowns">
                                                <li className="dropdown-item">
                                                  <button
                                                    className="clearButton text-align-start"
                                                    onClick={() => {
                                                      if (
                                                        item.default_whatsapp ===
                                                        0
                                                      ) {
                                                        handleClickDefault(
                                                          item.id,
                                                          "default_whatsapp"
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    <i class="fa-solid fa-bolt-lightning me-2"></i>{" "}
                                                    Default
                                                  </button>
                                                </li>
                                                <li className="dropdown-item">
                                                  <button
                                                    className="clearButton text-align-start"
                                                    onClick={() => {
                                                      if (
                                                        item.is_secondary_whatsapp ===
                                                        0
                                                      ) {
                                                        handleClickDefault(
                                                          item.id,
                                                          "is_secondary_whatsapp"
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    <i class="fa-solid fa-code-merge me-2"></i>{" "}
                                                    Alternate
                                                  </button>
                                                </li>
                                              </ul>
                                            </div>
                                          </Tippy>
                                        </td>
                                      }
                                      {checkViewSidebar(
                                        "DidDetail",
                                        slugPermissions,
                                        account?.sectionPermissions,
                                        account?.permissions,
                                        "edit"
                                      ) &&
                                        <td
                                          style={{
                                            cursor: "default",
                                            width: "139px",
                                          }}
                                        >
                                          <Tippy
                                            content={
                                              item.default_eFax === 1
                                                ? "This DID is set as default for E-fax"
                                                : item.is_secondary_eFax === 1
                                                  ? "This DID is set as secondary for E-fax"
                                                  : "Set this DID default for E-fax"
                                            }
                                          >
                                            <div className="dropdown w-100">
                                              <button
                                                data-bs-toggle="dropdown"
                                                className={
                                                  item.default_eFax === 1
                                                    ? "tableButton fax mx-auto"
                                                    : item.is_secondary_eFax === 1
                                                      ? "tableButton warning mx-auto"
                                                      : "tableButton fax empty mx-auto"
                                                }
                                                style={{ cursor: "pointer" }}
                                              >
                                                <i className="fa-solid fa-fax"></i>
                                              </button>
                                              <ul className="dropdown-menu actionBtnDropdowns">
                                                <li className="dropdown-item">
                                                  <button
                                                    className="clearButton text-align-start"
                                                    onClick={() => {
                                                      if (
                                                        item.default_eFax === 0
                                                      ) {
                                                        handleClickDefault(
                                                          item.id,
                                                          "default_eFax"
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    <i class="fa-solid fa-bolt-lightning me-2"></i>{" "}
                                                    Default
                                                  </button>
                                                </li>
                                                <li className="dropdown-item">
                                                  <button
                                                    className="clearButton text-align-start"
                                                    onClick={() => {
                                                      if (
                                                        item.is_secondary_eFax ===
                                                        0
                                                      ) {
                                                        handleClickDefault(
                                                          item.id,
                                                          "is_secondary_eFax"
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    <i class="fa-solid fa-code-merge me-2"></i>{" "}
                                                    Alternate
                                                  </button>
                                                </li>
                                              </ul>
                                            </div>
                                          </Tippy>
                                        </td>
                                      }
                                      {checkViewSidebar(
                                        "DidDetail",
                                        slugPermissions,
                                        account?.sectionPermissions,
                                        account?.permissions,
                                        "edit"
                                      ) &&
                                        <td style={{ cursor: "default" }}>
                                          <Tippy
                                            content={
                                              item.default_sms === 1
                                                ? "This DID is set as default for SMS"
                                                : item.is_secondary_sms === 1
                                                  ? "This DID is set as secondary for SMS"
                                                  : "Set this DID default for SMS"
                                            }
                                          >
                                            <div className="dropdown w-100">
                                              <button
                                                data-bs-toggle="dropdown"
                                                className={
                                                  item.default_sms === 1
                                                    ? "tableButton sms mx-auto"
                                                    : item.is_secondary_sms === 1
                                                      ? "tableButton warning  mx-auto"
                                                      : "tableButton sms empty mx-auto"
                                                }
                                                style={{ cursor: "pointer" }}
                                              >
                                                <i className="fa-solid fa-comment-sms"></i>
                                              </button>
                                              <ul className="dropdown-menu actionBtnDropdowns">
                                                <li className="dropdown-item">
                                                  <button
                                                    className="clearButton text-align-start"
                                                    onClick={() => {
                                                      if (
                                                        item.default_sms === 0
                                                      ) {
                                                        handleClickDefault(
                                                          item.id,
                                                          "default_sms"
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    <i class="fa-solid fa-bolt-lightning me-2"></i>{" "}
                                                    Default
                                                  </button>
                                                </li>
                                                <li className="dropdown-item">
                                                  <button
                                                    className="clearButton text-align-start"
                                                    onClick={() => {
                                                      if (
                                                        item.is_secondary_sms ===
                                                        0
                                                      ) {
                                                        handleClickDefault(
                                                          item.id,
                                                          "is_secondary_sms"
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    <i class="fa-solid fa-code-merge me-2"></i>{" "}
                                                    Alternate
                                                  </button>
                                                </li>
                                              </ul>
                                            </div>
                                          </Tippy>
                                        </td>
                                      }
                                      {page === "pbx" ? (
                                        <>
                                          <td style={{ cursor: "default" }}>
                                            <Tippy
                                              content={
                                                item.default_outbound === 1
                                                  ? "This DID is set as default"
                                                  : "Set this DID default"
                                              }
                                            >
                                              <button
                                                className={
                                                  item.default_outbound === 1
                                                    ? "tableButton head mx-auto"
                                                    : "tableButton head empty mx-auto"
                                                }
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                  if (
                                                    item.default_outbound === 0
                                                  ) {
                                                    handleClickDefault(item.id);
                                                  }
                                                }}
                                              >
                                                <i className="fa-solid fa-headset"></i>
                                              </button>
                                            </Tippy>
                                          </td>
                                        </>
                                      ) : (
                                        ""
                                      )}
                                      {checkViewSidebar(
                                        "DidDetail",
                                        slugPermissions,
                                        account?.sectionPermissions,
                                        account?.permissions,
                                        "delete"
                                      ) && checkViewSidebar(
                                        "DidDetail",
                                        slugPermissions,
                                        account?.sectionPermissions,
                                        account?.permissions,
                                        "edit"
                                      ) && checkViewSidebar(
                                        "DidConfigure",
                                        slugPermissions,
                                        account?.sectionPermissions,
                                        account?.permissions,
                                        "browse"
                                      ) ?
                                        < td className="text-center">
                                          <div className="dropdown">
                                            <button
                                              className={`tableButton`}
                                              href="#"
                                              role="button"
                                              data-bs-toggle="dropdown"
                                              aria-expanded="false"
                                            >
                                              <i className="fa-solid fa-ellipsis-vertical" />
                                            </button>
                                            <ul className="dropdown-menu actionBtnDropdowns">
                                              {page === "pbx" ? (
                                                <>
                                                  {checkViewSidebar(
                                                    "DidConfigure",
                                                    slugPermissions,
                                                    account?.sectionPermissions,
                                                    account?.permissions,
                                                    "browse"
                                                  ) &&
                                                    <li className="dropdown-item">
                                                      <Tippy
                                                        content={
                                                          item.configuration !==
                                                            null
                                                            ? "Update the configuration"
                                                            : "Not Configured! Click to configure"
                                                        }
                                                      >
                                                        <div
                                                          className="clearButton text-align-start"
                                                          onClick={() =>
                                                            navigate(
                                                              `/did-config`,
                                                              {
                                                                state: item,
                                                              }
                                                            )
                                                          }
                                                        >
                                                          <i
                                                            className={`fa-regular fa-${item.configuration !==
                                                              null
                                                              ? "gear"
                                                              : "triangle-exclamation"
                                                              } me-2`}
                                                          ></i>{" "}
                                                          {item.configuration !==
                                                            null
                                                            ? "Update"
                                                            : "Configure"}
                                                        </div>
                                                      </Tippy>
                                                    </li>
                                                  }
                                                  {item.configuration !==
                                                    null && checkViewSidebar(
                                                      "DidDetail",
                                                      slugPermissions,
                                                      account?.sectionPermissions,
                                                      account?.permissions,
                                                      "edit"
                                                    ) ? (
                                                    <li className="dropdown-item">
                                                      <Tippy content="Reset configuration of this DID">
                                                        <div
                                                          className="clearButton text-align-start"
                                                          onClick={() =>
                                                            handleClick(
                                                              item.configuration
                                                                .id
                                                            )
                                                          }
                                                        >
                                                          <i className="fa-regular fa-arrows-rotate me-2"></i>{" "}
                                                          Reset
                                                        </div>
                                                      </Tippy>
                                                    </li>
                                                  ) : ""}
                                                </>
                                              ) : page === "number" ? (
                                                <>
                                                  {checkViewSidebar(
                                                    "DidDetail",
                                                    slugPermissions,
                                                    account?.sectionPermissions,
                                                    account?.permissions,
                                                    "edit"
                                                  ) &&
                                                    <li className="dropdown-item">
                                                      <Tippy content="Select the usage of this DID">
                                                        <div
                                                          className="clearButton text-align-start"
                                                          onClick={() => {
                                                            setPreviousUsages(
                                                              item.usages
                                                            );
                                                            setUsagesPopup(true);
                                                            setId(item.id);
                                                            setUsages(item.usages);
                                                          }}
                                                        >
                                                          <i className="fa-regular fa-gear me-2"></i>{" "}
                                                          Set Usage
                                                        </div>
                                                      </Tippy>
                                                    </li>
                                                  }
                                                </>
                                              ) : (
                                                ""
                                              )}
                                              {checkViewSidebar(
                                                "DidDetail",
                                                slugPermissions,
                                                account?.sectionPermissions,
                                                account?.permissions,
                                                "delete"
                                              ) &&
                                                <li className="dropdown-item">
                                                  <Tippy content={"Delete the DID"}>
                                                    <div
                                                      className="clearButton text-align-start"
                                                      onClick={() => {
                                                        setDeletePopup(true);
                                                        setDeleteId(item.id);
                                                      }}
                                                    >
                                                      <i
                                                        className={`fa-regular fa-trash me-2`}
                                                      ></i>{" "}
                                                      Delete
                                                    </div>
                                                  </Tippy>
                                                </li>
                                              }
                                            </ul>
                                          </div>
                                        </td> : ""
                                      }
                                    </tr>
                                  );
                                })}
                            </>
                          </tbody>
                        </table>
                      }
                    </div>
                    <div className="tableHeader mb-3">
                      <PaginationComponent
                        pageNumber={(e) => setPageNumber(e)}
                        totalPage={didWithPagination?.last_page}
                        from={(pageNumber - 1) * didWithPagination?.per_page + 1}
                        to={didWithPagination?.to}
                        total={didWithPagination?.total}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {
        usagesPopup ? (
          <div className="popup">
            <div className="container h-100">
              <div className="d-flex h-100 justify-content-center align-items-center">
                <div className="row content col-xxl-4 col-xl-5 col-md-6">
                  <div className="col-12 px-0">
                    <div className="iconWrapper mb-3">
                      <i className="fa-duotone fa-circle-exclamation"></i>
                    </div>
                  </div>
                  <div className="col-12 ps-0 pe-0 text-center">
                    <h4 className="text-center text-orange">Confirmation!</h4>
                    <p className="mb-2">
                      Please select the options you want to assign to this DID
                    </p>
                    <select
                      className="formItem"
                      value={usages}
                      onChange={(e) => {
                        setUsages(e.target.value);
                      }}
                    >
                      <option value="">None</option>
                      <option value="pbx">PBX</option>
                      <option value="dialer">Dialer</option>
                      <option value="tracker">Tracker</option>
                    </select>
                    <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
                      <button
                        className="panelButton m-0"
                        onClick={() => {
                          if (previousUsages === usages) {
                            setUsagesPopup(false);
                          } else if (previousUsages === "" || !previousUsages) {
                            handleUsagesEdit(id);
                            setUsagesPopup(false);
                          } else {
                            setConfirmPopup(true);
                            setUsagesPopup(false);
                          }
                        }}
                      >
                        <span className="text">Lets Go!</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray m-0 float-end"
                        onClick={() => {
                          setUsagesPopup(false);
                          setId("");
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )
      }
      {
        deletePopup ? (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div className="row content col-xl-4 col-md-5">
                  <div className="col-12">
                    <div className="iconWrapper">
                      <i className="fa-duotone fa-circle-exclamation text-danger"></i>
                    </div>
                  </div>
                  <div className="col-12">
                    <h4 className="text-center text-danger">Confirmation!</h4>
                    <p className="text-center">Are you sure! You want to delete this DID</p>

                    <div className="d-flex justify-content-center gap-2 mt-4">
                      <button
                        className="panelButton m-0"
                        onClick={() => {
                          handleDelete(deleteId);
                          setDeletePopup(false);
                        }}
                      >
                        <span className="text">Delete</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray m-0 float-end"
                        onClick={() => {
                          setDeletePopup(false);
                          setDeleteId("");
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )
      }
      {
        confirmPopup ? (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div className="row content col-xl-4">
                  <div className="col-2 px-0">
                    <div className="iconWrapper">
                      <i className="fa-duotone fa-circle-exclamation"></i>
                    </div>
                  </div>
                  <div className="col-10 ps-0">
                    <h4>Confirmation!</h4>
                    <p>
                      {`Are you sure!
                    You want to change usages from "${previousUsages}" to "${usages === "" ? "None" : usages
                        }"`}
                    </p>

                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="panelButton m-0"
                        onClick={() => {
                          handleUsagesEdit(id);
                          setConfirmPopup(false);
                        }}
                      >
                        <span className="text">Let's Go!</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray m-0 float-end"
                        onClick={() => {
                          setConfirmPopup(false);
                          setUsages("");
                          setPreviousUsages("");
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )
      }
    </main >
  );
}

export default DidListing;
