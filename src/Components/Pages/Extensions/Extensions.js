/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  backToTop,
  checkViewSidebar,
  generalGetFunction,
  useDebounce,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import Header from "../../CommonComponents/Header";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import ThreeDotedLoader from "../../Loader/ThreeDotedLoader";
const Extensions = () => {
  const navigate = useNavigate();
  const [extension, setExtension] = useState();
  const [filteredExtension, setFilteredExtension] = useState([]);
  const account = useSelector((state) => state.account);
  const [loading, setLoading] = useState(false);
  const [onlineExtension, setOnlineExtension] = useState([0]);
  const [pageNumber, setPageNumber] = useState(1);
  const registerUser = useSelector((state) => state.registerUser);
  const extensionByAccount = useSelector((state) => state.extensionByAccount);
  const [userList, setUserList] = useState([]);
  // const userList = useSelector((state) => state.allUser?.data) || [];
  const dispatch = useDispatch();
  const [noPermissionToRead, setNoPermissionToRead] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [onlineFilter, setonlineFilter] = useState("all")
  const [searchValue, setSearchValue] = useState("");
  const [refreshState, setRefreshState] = useState(false)
  const showKeys = [
    "extension",
    "user",
    "effectiveCallerIdName",
    "outbundCallerIdName",
    "description",
    "sofia_status"
  ];
  const slugPermissions = useSelector((state) => state?.permissions);
  const [allDID, setAllDID] = useState([]);
  const debouncedSearchTerm = useDebounce(searchValue, 1000);
  // Geeting online extensions from socket and updating the state
  useEffect(() => {
    if (registerUser?.length > 0) {
      setOnlineExtension(
        registerUser.map((item) => {
          if (item.account_id === account.account_id) {
            return item.extension;
          }
        })
      );
    } else {
      setOnlineExtension([0]);
    }
  }, [registerUser]);


  // Getting all DID from did listing
  const getAllDid = async () => {
    const apiData = await generalGetFunction(`/did/all?all-dids`);
    if (apiData?.status) {
      setAllDID(apiData.data);
    }
  }

  // Trigger user api to get latest users
  const getCurrentUser = async () => {
    const userApi = await generalGetFunction(
      `/user/search?account=${account.account_id}${account.usertype !== 'Company' || account.usertype !== 'SupreAdmin' ? '&section=Accounts' : ""}`
    );
    if (userApi?.status) {
      setUserList(userApi.data);
    }
  }


  useEffect(() => {
    setLoading(true)
    getAllDid();
    getCurrentUser();
  }, [])


  // Filtering users with extensions
  const userWithExtension = userList
    .filter((user) => user.extension && user.extension.extension) // Filter out null or undefined extensions
    .map((user) => ({
      name: user?.username,
      extension: user.extension.extension, // Access the nested extension value
      profile_picture: user.profile_picture,
    }));

  // Getting list of all users by various filters like page number, items per page and search keys
  const getExtensionData = async (shouldLoad) => {
    if (shouldLoad) {
      setLoading(true);
    }
    if (account && account.account_id) {
      const apiData = await generalGetFunction(
        `/extension/all?${onlineFilter === "all" ? `page=${pageNumber}` : ""}&row_per_page=${itemsPerPage}&search=${searchValue}${onlineFilter === "all" ? "" : onlineFilter == "online" ? "&online" : "&offline"}`
      );
      if (apiData?.status) {
        // setLoading(false);
        // setRefreshState(false)
        setExtension(apiData.data);
        dispatch({
          type: "SET_EXTENSIONBYACCOUNT",
          extensionByAccount: apiData.data,
        });
        setLoading(false);
        setRefreshState(false)
      } else {
        if (apiData.response.status === 403) {
          setNoPermissionToRead(true);
        }
        // setLoading(false);
        setRefreshState(false)
      }
    } else {
      // setLoading(false);
      setRefreshState(false)
    }
  }

  useEffect(() => {
    setLoading(true);
    setRefreshState(true)
    if (extensionByAccount.data) {
      setExtension(extensionByAccount);
      if (pageNumber === 1 && itemsPerPage === 10) {
        // setLoading(false);
      }
      // setLoading(false);
      // async function getData() {
      //   if (account && account.account_id) {
      //     const apiData = await generalGetFunction(
      //       `/extension/all?${onlineFilter === "all" ? `page=${pageNumber}` : ""}&row_per_page=${itemsPerPage}&search=${searchValue}${onlineFilter === "all" ? "" : onlineFilter == "online" ? "&online" : "&offline"}`
      //     );
      //     if (apiData?.status) {
      //       setExtension(apiData.data);
      //       dispatch({
      //         type: "SET_EXTENSIONBYACCOUNT",
      //         extensionByAccount: apiData.data,
      //       });
      //       setLoading(false);
      //     }
      //   } else {
      //     setLoading(false);
      //   }
      // }
      // if (searchValue.trim().length === 0) {
      //   getData();
      // } else {
      //   const timer = setTimeout(() => {
      //     getData();
      //   }, 1000);
      //   return () => clearTimeout(timer);
      // }
      const shouldLoad = true
      getExtensionData(shouldLoad)
    } else {
      // async function getData() {
      //   setLoading(true);
      //   if (account && account.account_id) {
      //     const apiData = await generalGetFunction(
      //       `/extension/all?${onlineFilter === "all" ? `page=${pageNumber}` : ""}&row_per_page=${itemsPerPage}&search=${searchValue}${onlineFilter === "all" ? "" : onlineFilter == "online" ? "&online" : "&offline"}`
      //     );
      //     if (apiData?.status) {
      //       setLoading(false);
      //       setExtension(apiData.data);
      //       dispatch({
      //         type: "SET_EXTENSIONBYACCOUNT",
      //         extensionByAccount: apiData.data,
      //       });
      //       setLoading(false);
      //     } else {
      //       if (apiData.response.status === 403) {
      //         setNoPermissionToRead(true);
      //       }
      //       setLoading(false);
      //     }
      //   } else {
      //     setLoading(false);
      //   }
      // }
      // if (searchValue.trim().length === 0) {
      //   getData();
      // } else {
      //   const timer = setTimeout(() => {
      //     getData();
      //   }, 1000);
      //   return () => clearTimeout(timer);
      // }
      const shouldLoad = true;
      getExtensionData(shouldLoad)
    }
  }, [navigate, pageNumber, account, itemsPerPage, debouncedSearchTerm, onlineFilter]);

  useEffect(() => {
    if (onlineExtension.length > 0 && extension) {
      switch (onlineFilter) {
        case "all":
          setFilteredExtension(extension.data);
          break;
        case "online":
          setFilteredExtension(extension.data.filter((item) => onlineExtension.includes(item.extension)));
          break;
        case "offline":
          setFilteredExtension(extension.data.filter((item) => !onlineExtension.includes(item.extension)));
          break;
        default:
          setFilteredExtension(extension.data);
          break;
      }
      // setLoading(false)
    }
  }, [onlineExtension, extension])

  const handleRefreshBtnClicked = () => {
    setRefreshState(true)
    const shouldLoad = false
    getExtensionData(shouldLoad)
  }

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Extensions" />
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>
                          Extension List {" "}
                          <button
                            className="clearButton"
                            onClick={handleRefreshBtnClicked}
                            disabled={refreshState}
                          >
                            <i
                              className={
                                refreshState
                                  ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                  : "fa-regular fa-arrows-rotate fs-5"
                              }
                            >
                            </i>
                          </button>
                        </h4>
                        <p>You can see the list of extensions</p>
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
                          "Extension",
                          slugPermissions,
                          account?.sectionPermissions,
                          account?.permissions,
                          "add"
                        ) &&
                          <Link
                            to="/store-extension"
                            effect="ripple"
                            className="panelButton"
                          >
                            <span className="text">Buy</span>
                            <span className="icon">
                              <i className="fa-solid fa-cart-shopping"></i>
                            </span>
                          </Link>
                        }
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12"
                    style={{ overflow: "auto", padding: "10px 20px 0" }}
                  >
                    <div className="tableHeader">
                      <div className="showEntries">
                        <label>Show</label>
                        <select
                          className="formItem"
                          value={itemsPerPage}
                          onChange={(e) => setItemsPerPage(e.target.value)}
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={30}>30</option>
                        </select>
                        <label>entries</label>
                      </div>
                      {checkViewSidebar(
                        "Extension",
                        slugPermissions,
                        account?.sectionPermissions,
                        account?.permissions,
                        "search"
                      ) && <div className="searchBox">
                          <label>Search:</label>
                          <input
                            type="search"
                            value={searchValue}
                            className="formItem"
                            onChange={(e) => setSearchValue(e.target.value)}
                          />
                        </div>
                      }
                    </div>
                    <div className="tableContainer">
                      <table>
                        <tbody>
                          {noPermissionToRead || !checkViewSidebar(
                            "Extension",
                            slugPermissions,
                            account?.sectionPermissions,
                            account?.permissions,
                            "read"
                          ) ? (
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>No Permissions</td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          ) : (
                            <>

                              <>
                                {extension &&
                                  extension?.data?.length > 0 &&
                                  (() => {
                                    // Filter showKeys to include only keys that exist in extension.data
                                    const validKeys = showKeys.filter((key) =>
                                      extension.data.some(
                                        (item) => key in item
                                      )
                                    );
                                    return (
                                      <table>
                                        <thead>
                                          <tr>
                                            {validKeys.filter((item) => item !== "effectiveCallerIdName" && item !== "outbundCallerIdName").map((key) => {
                                              let formattedKey = "";
                                              if (
                                                key ===
                                                "effectiveCallerIdName"
                                              ) {
                                                formattedKey =
                                                  "Effective CID Name";
                                              } else if (
                                                key === "outbundCallerIdName"
                                              ) {
                                                formattedKey =
                                                  "Outbound CID Name";
                                              }
                                              else {
                                                formattedKey = key
                                                  .replace(/[-_]/g, " ")
                                                  .toLowerCase()
                                                  .replace(/\b\w/g, (char) =>
                                                    char.toUpperCase()
                                                  );
                                              }
                                              if (key == 'sofia_status') {
                                                return (
                                                  <th className="text-center">
                                                    <span>
                                                      <select className="formItem f-select-width" value={onlineFilter} onChange={(e) => setonlineFilter(e.target.value)}>
                                                        <option value="all" disabled>Status</option>
                                                        <option value="online">Online</option>
                                                        <option value="offline">Offline</option>
                                                        <option value="all">All</option>
                                                      </select>
                                                    </span>
                                                  </th>
                                                )
                                              } else {
                                                return (
                                                  <th key={key}>
                                                    {formattedKey}
                                                  </th>
                                                );
                                              }
                                            })}
                                            <th>Default Outbound Number</th>
                                            {checkViewSidebar(
                                              "Extension",
                                              slugPermissions,
                                              account?.sectionPermissions,
                                              account?.permissions,
                                              "edit"
                                            ) && (
                                                <th className="text-center">
                                                  Edit
                                                </th>
                                              )}
                                            <th className="text-center">
                                              Add Devices
                                            </th>
                                          </tr>
                                        </thead>
                                        {
                                          loading ? (
                                            // <SkeletonTableLoader col={7} row={15} />
                                              <ThreeDotedLoader />
                                          )
                                            : (
                                              <tbody>
                                                {filteredExtension.map(
                                                  (item, index) => {
                                                    const foundUser =
                                                      userWithExtension.find(
                                                        (value) =>
                                                          value.extension ===
                                                          item.extension
                                                      );
                                                    return (
                                                      <>
                                                        <tr key={index}>
                                                          {validKeys.filter((item) => item !== "effectiveCallerIdName" && item !== "outbundCallerIdName").map((key) => (
                                                            <td key={key}>
                                                              {key === "user"
                                                                ? foundUser
                                                                  ?
                                                                  <div className="d-flex align-items-center">
                                                                    <div className="tableProfilePicHolder">
                                                                      {foundUser.profile_picture ? (
                                                                        <img
                                                                          src={foundUser.profile_picture}
                                                                          onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                                                        />
                                                                      ) : (
                                                                        <i className="fa-light fa-user" />
                                                                      )}
                                                                    </div>
                                                                    <div className="ms-2">{foundUser.name}</div>
                                                                  </div>
                                                                  : ""
                                                                : key == 'sofia_status' ? (
                                                                  <span
                                                                    className={
                                                                      onlineExtension.includes(
                                                                        item.extension
                                                                      )
                                                                        ? "extensionStatus online mx-auto"
                                                                        : "extensionStatus mx-auto"
                                                                    }
                                                                  ></span>
                                                                ) :
                                                                  item[key]}
                                                            </td>
                                                          ))}
                                                          <td>{allDID?.filter((item) => item.default_outbound == 1)[0]?.did}</td>
                                                          {checkViewSidebar(
                                                            "Extension",
                                                            slugPermissions,
                                                            account?.sectionPermissions,
                                                            account?.permissions,
                                                            "edit"
                                                          ) && (
                                                              <td
                                                                style={{
                                                                  cursor: "default",
                                                                }}
                                                              >
                                                                <button
                                                                  className="tableButton edit mx-auto"
                                                                  onClick={() =>
                                                                    navigate(
                                                                      `/extensions-edit?id=${item.id}`
                                                                    )
                                                                  }
                                                                >
                                                                  <i className="fa-solid fa-pencil"></i>
                                                                </button>
                                                              </td>
                                                            )}
                                                          <td
                                                            style={{
                                                              cursor: "default",
                                                            }}
                                                          >
                                                            {/* {item.provisionings ? (
                                                        <button
                                                          className="tableButton edit mx-auto"
                                                          onClick={() =>
                                                            navigate(
                                                              `/device-provisioning-edit`,
                                                              {
                                                                state: {
                                                                  provisionings:
                                                                    item.provisionings,
                                                                  extension_id:
                                                                    item.id,
                                                                },
                                                              }
                                                            )
                                                          }
                                                        >
                                                          <i className="fa-solid fa-phone-office"></i>
                                                        </button>
                                                      ) : ( */}
                                                            <button
                                                              className="tableButton mx-auto"
                                                              onClick={() =>
                                                                navigate(
                                                                  "/all-devices",
                                                                  {
                                                                    state: {
                                                                      extension:
                                                                        item.extension,
                                                                      id: item.id,
                                                                    },
                                                                  }
                                                                )
                                                              }
                                                            >
                                                              <i className="fa-solid fa-plus"></i>
                                                            </button>
                                                            {/* )} */}
                                                          </td>
                                                        </tr>
                                                      </>
                                                    );
                                                  }
                                                )}
                                              </tbody>)}
                                      </table>
                                    );
                                  })()}
                              </>
                            </>
                          )}

                          {extension && extension?.data?.length === 0 ? (
                            <td colSpan={99}>
                              <EmptyPrompt
                                name="Extension"
                                link="extensions-add"
                              />
                            </td>
                          ) : (
                            ""
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="tableHeader mb-3">
                      {extension && extension.data.length > 0 ? (
                        <PaginationComponent
                          pageNumber={(e) => setPageNumber(e)}
                          totalPage={extension.last_page}
                          from={(pageNumber - 1) * extension.per_page + 1}
                          to={extension.to}
                          total={extension.total}
                        />
                      ) : (
                        ""
                      )}
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
};

export default Extensions;
