/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { Link, useNavigate } from "react-router-dom";
import {
  backToTop,
  checkViewSidebar,
  generalDeleteFunction,
  generalGetFunction,
  generalPutFunction,
  useDebounce,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import Tippy from "@tippyjs/react";
import CircularLoader from "../../Loader/CircularLoader";
import ThreeDotedLoader from "../../Loader/ThreeDotedLoader";

function CallCenterQueue() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const [popUp, setPopUp] = useState(false);
  const [callCenter, setCallCenter] = useState();
  const [error, setError] = useState("");
  const [redirectRoutes, setRedirectRoutes] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCallCenter, setSelectedCallCenter] = useState(null);
  const account = useSelector((state) => state.account);
  const [deleteId, setDeleteId] = useState("");
  const allUser = useSelector((state) => state.allUser);
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const { data: usersData = [] } = allUser;
  const [pageNumber, setPageNumber] = useState(1);
  const [refreshState, setRefreshState] = useState(false);
  const [noPermissionToRead, setNoPermissionToRead] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const slugPermissions = useSelector((state) => state?.permissions);
  const [pageLoading, setPageLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchValue, 1000);

  const getCallCenterDashboardData = async (shouldLoad) => {
    if (shouldLoad) setLoading(true);
    const apidata = await generalGetFunction(
      `/call-center-queues/dashboard?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${searchValue}`
    );
    if (apidata?.status) {
      setLoading(false);
      setRefreshState(false);
      setCallCenter(apidata.data);
    } else {
      setLoading(false);
      setRefreshState(false);
      if (apidata.response.status === 403) {
        setNoPermissionToRead(true);
      }
    }

    // Refresh User API if user list is empty
    if (usersData.length === 0) {
      dispatch({
        type: "SET_ALLUSERREFRESH",
        allUserRefresh: allUserRefresh + 1,
      });
    }
  };

  useEffect(() => {
    // if (searchValue.trim().length === 0) {
    //   getCallCenterDashboardData();
    // } else {
    //   const timer = setTimeout(() => {
    //     getCallCenterDashboardData();
    //   }, 1000);
    //   return () => clearTimeout(timer);
    // }
    setRefreshState(true);
    const shouldLoad = true;
    getCallCenterDashboardData(shouldLoad);
    // if (refreshState === 0) {
    //   dispatch({
    //     type: "SET_ALLUSERREFRESH",
    //     allUserRefresh: allUserRefresh + 1,
    //   });
    // }
  }, [pageNumber, itemsPerPage, debouncedSearchTerm]);

  const handleAddCallCenterValidation = (e) => {
    e.preventDefault();

    if (usersData.length === 0) {
      setPopUp(true);
      setError("Please add users to create a queue");
      setRedirectRoutes("/users");
      return;
    }

    const hasExtension = usersData.some((item) => item.extension_id);

    if (!hasExtension) {
      setPopUp(true);
      setError("Please add an extension to the users to create a queue");
      setRedirectRoutes("/extensions");
      return;
    }

    navigate("/cal-center-queue-add");
    backToTop();
  };

  async function handleDelete(id) {
    setLoading(true);
    setPopUp(false);
    const apiData = await generalDeleteFunction(
      `/call-center-queues/destroy/${id}`
    );
    if (apiData?.status) {
      setLoading(false);
      // setRefresh(refresh+1)
      const updatedCallCenter = callCenter.data.filter(
        (item) => item.id !== id
      );
      dispatch({
        type: "SET_CALLCENTERREFRESH",
        callCenterRefresh: callCenterRefresh + 1,
      });
      setCallCenter({ ...callCenter, data: updatedCallCenter });
      toast.success(apiData.message);
      setDeleteId("");
    } else {
      setLoading(false);
      // toast.error(apiData.error);
      setDeleteId("");
    }
  }

  const handleUpdateCallCenterStatus = async (id) => {
    setLoading(true);
    const payload = {
      ...selectedCallCenter,
      status: selectedCallCenter.status == 0 ? true : false,
      ...{
        agents: selectedCallCenter?.agents
          .map((item) => {
            // Call checkPrevDestination with the current item
            if (item.id.length > 0) {
              // Return the object with or without 'id' based on hasId
              return {
                agent_name: item.name,
                reserve_agents: item.reserve_agents,
                truncate_agents_on_load: item["truncate-agents-on-load"],
                truncate_tiers_on_load: item["truncate-tiers-on-load"],
                tier_level: item.level,
                call_timeout:
                  item.call_timeout === null ? null : Number(item.call_timeout),
                reject_delay_time:
                  item.reject_delay_time === null
                    ? null
                    : Number(item.reject_delay_time),
                max_no_answer:
                  item.max_no_answer === null
                    ? null
                    : Number(item.max_no_answer),
                no_answer_delay_time:
                  item.no_answer_delay_time === null
                    ? null
                    : Number(item.no_answer_delay_time),
                wrap_up_time:
                  item.wrap_up_time === null ? null : Number(item.wrap_up_time),
                busy_delay_time:
                  item.busy_delay_time === null
                    ? null
                    : Number(item.busy_delay_time),
                queue_timeout:
                  item.queue_timeout === null
                    ? null
                    : Number(item.queue_timeout),
                tier_position: item.position,
                type: item.type,
                // status: "Logged Out",
                password: item.password,
                contact: item.contact,
                id: item.id,
              };
            } else {
              return null;
            }
          })
          .filter((item) => item !== null),
      },
    };
    setPopUp(false);
    const apiData = await generalPutFunction(
      `/call-center-queues/update/${id}`,
      payload
    );
    if (apiData?.status) {
      setLoading(false);
      const updatedCallCenter = callCenter.data.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: item.status == 0 ? 1 : 0,
          };
        } else {
          return item;
        }
      });

      setCallCenter({
        ...callCenter,
        data: updatedCallCenter,
      });
      toast.success(apiData.message);

      setSelectedCallCenter(null);
    } else {
      setLoading(false);
    }
  };
  //test

  // Agent Edit
  const handleAgentClick = async (item) => {
    setPageLoading(true);
    if (item) {
      const apiData = await generalGetFunction(
        `/agents?search=${item.username}${
          account.usertype !== "Company" || account.usertype !== "SupreAdmin"
            ? "&section=Accounts"
            : ""
        }`
      );
      if (apiData?.status) {
        const userData = apiData.data.data[0];
        setPageLoading(false);
        navigate(`/agents-edit?id=${userData.id}`, {
          state: userData,
        });
      }
    }
  };

  const handleRefreshBtnClicked = () => {
    setRefreshState(true);
    const shouldLoad = false;
    getCallCenterDashboardData(shouldLoad);
  };
  return (
    <>
      {pageLoading && <CircularLoader />}

      <main className="mainContent">
        <section id="phonePage">
          <Header title="Call Center Queue" />
          <div className="container-fluid">
            <div className="row">
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>
                            Call Center Queue List{" "}
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
                              ></i>
                            </button>
                          </h4>
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
                            "CallCenterQueue",
                            slugPermissions,
                            account?.sectionPermissions,
                            account?.permissions,
                            "add"
                          ) && (
                            <Link
                              // to="/cal-center-queue-add"
                              // onClick={backToTop}
                              onClick={handleAddCallCenterValidation}
                              effect="ripple"
                              className="panelButton"
                            >
                              <span className="text">Add</span>
                              <span className="icon">
                                <i className="fa-solid fa-plus"></i>
                              </span>
                            </Link>
                          )}
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
                            onChange={(e) => {
                              setItemsPerPage(e.target.value);
                              setPageNumber(1);
                            }}
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                          </select>
                          <label>entries</label>
                        </div>
                        {checkViewSidebar(
                          "CallCenterQueue",
                          slugPermissions,
                          account?.sectionPermissions,
                          account?.permissions,
                          "search"
                        ) && (
                          <div className="searchBox position-relative">
                            <label>Search:</label>
                            <input
                              type="search"
                              name="Search"
                              value={searchValue}
                              className="formItem"
                              onChange={(e) => {
                                setSearchValue(e.target.value);
                                setPageNumber(1);
                                setItemsPerPage(10);
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="tableContainer">
                        {loading ? (
                          // <SkeletonTableLoader col={8} row={15} />
                          <ThreeDotedLoader />
                        ) : (
                          <table>
                            <thead>
                              <tr>
                                <th>Tag</th>
                                <th>Queue Name</th>
                                <th>Extension</th>
                                <th>Strategy</th>
                                <th>Total Agents</th>
                                {checkViewSidebar(
                                  "CallCenterQueue",
                                  slugPermissions,
                                  account?.sectionPermissions,
                                  account?.permissions,
                                  "edit"
                                ) && <th className="text-center">Status</th>}
                                {checkViewSidebar(
                                  "CallCenterQueue",
                                  slugPermissions,
                                  account?.sectionPermissions,
                                  account?.permissions,
                                  "edit"
                                ) && <th className="text-center">Edit</th>}
                                {checkViewSidebar(
                                  "CallCenterQueue",
                                  slugPermissions,
                                  account?.sectionPermissions,
                                  account?.permissions,
                                  "delete"
                                ) && <th className="text-center">Delete</th>}
                              </tr>
                            </thead>
                            <tbody>
                              {noPermissionToRead ||
                              !checkViewSidebar(
                                "CallCenterQueue",
                                slugPermissions,
                                account?.sectionPermissions,
                                account?.permissions,
                                "read"
                              ) ? (
                                <tr>
                                  <td colSpan={99}>No Permission</td>
                                </tr>
                              ) : (
                                <>
                                  {callCenter &&
                                    callCenter.data.map((item) => {
                                      return (
                                        <tr>
                                          <td>{item.tag}</td>
                                          <td>{item.queue_name}</td>
                                          <td>{item.extension}</td>
                                          <td>{item.strategy}</td>
                                          <td>
                                            <Tippy
                                              content={
                                                <ul
                                                  className="dropdown-menu-hover"
                                                  style={{
                                                    columnCount:
                                                      item.agents.length > 8
                                                        ? 2
                                                        : 1,
                                                  }}
                                                >
                                                  {/* <li className="col-12">
                                                    <div className="dropdown-item fw-bold disabled">
                                                      Agents
                                                    </div>
                                                  </li> */}
                                                  {item.agents.map(
                                                    (item, index) => (
                                                      <div
                                                        key={index}
                                                        className="dropdown-item d-flex"
                                                        onClick={() =>
                                                          handleAgentClick(item)
                                                        }
                                                      >
                                                        <span className="avatar-container">
                                                          {item.profile_picture ? (
                                                            <img
                                                              alt="profile"
                                                              src={
                                                                item.profile_picture
                                                              }
                                                              onError={(e) =>
                                                                (e.target.src = require("../../assets/images/placeholder-image.webp"))
                                                              }
                                                            />
                                                          ) : (
                                                            <i className="fa-light fa-user"></i>
                                                          )}
                                                        </span>{" "}
                                                        <span className="ms-2">
                                                          {item?.username}
                                                        </span>
                                                      </div>
                                                    )
                                                  )}
                                                  {/* {item.agents.length > 6 && <li className="col-12">
                                                  <Link to="/agents" className="dropdown-item text-center text-primary">
                                                    See More
                                                  </Link>
                                                </li>} */}
                                                </ul>
                                              }
                                              allowHTML={true}
                                              placement="bottom"
                                              interactive={true}
                                              popperOptions={{
                                                strategy: "fixed",
                                              }}
                                            >
                                              <div className="hover-dropdown">
                                                {/* {item.agents.length} */}
                                                <div className="avatar-container">
                                                  {item.agents
                                                    ?.slice(0, 4)
                                                    .map((item, index) => {
                                                      return (
                                                        <Tippy
                                                          key={index}
                                                          content={
                                                            item?.username
                                                          }
                                                        >
                                                          {item.profile_picture ? (
                                                            <img
                                                              alt="avatar"
                                                              src={
                                                                item.profile_picture
                                                              }
                                                              onError={(e) =>
                                                                (e.target.src = require("../../assets/images/placeholder-image.webp"))
                                                              }
                                                            />
                                                          ) : (
                                                            <i className="fa-light fa-user"></i>
                                                          )}
                                                        </Tippy>
                                                      );
                                                    })}
                                                  {item.agents.length > 4 && (
                                                    <span>
                                                      +{item.agents.length - 4}
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            </Tippy>
                                          </td>
                                          {checkViewSidebar(
                                            "CallCenterQueue",
                                            slugPermissions,
                                            account?.sectionPermissions,
                                            account?.permissions,
                                            "edit"
                                          ) && (
                                            <td>
                                              <div className="my-auto position-relative d-flex justify-content-center ">
                                                {/* <label className="switch">
                                                  <input
                                                    type="checkbox"
                                                    checked={item.status == 1}
                                                    onClick={(e) => {
                                                      setSelectedCallCenter(item);
                                                      setPopUp(true);
                                                    }}
                                                    // {...register("status")}
                                                    id="showAllCheck"
                                                  />
                                                  <span className="slider round" />
                                                </label> */}
                                                <div className="cl-toggle-switch">
                                                  <label className="cl-switch">
                                                    <input
                                                      type="checkbox"
                                                      checked={item.status == 1}
                                                      onClick={(e) => {
                                                        setSelectedCallCenter(
                                                          item
                                                        );
                                                        setPopUp(true);
                                                      }}
                                                      // {...register("status")}
                                                      id="showAllCheck"
                                                    />
                                                    <span></span>
                                                  </label>
                                                </div>
                                              </div>
                                              {/* <button
                                          className="tableButton"
                                          onClick={() =>
                                            navigate(
                                              `/call-center-settings?id=${item.id}`
                                            )
                                          }
                                        >
                                          <i className="fa-duotone fa-gear"></i>
                                        </button> */}
                                            </td>
                                          )}
                                          {checkViewSidebar(
                                            "CallCenterQueue",
                                            slugPermissions,
                                            account?.sectionPermissions,
                                            account?.permissions,
                                            "edit"
                                          ) && (
                                            <td>
                                              {" "}
                                              <button
                                                className="tableButton edit mx-auto"
                                                onClick={() =>
                                                  navigate(
                                                    `/cal-center-queue-edit?id=${item.id}`
                                                  )
                                                }
                                              >
                                                <i className="fa-solid fa-pencil"></i>
                                              </button>
                                            </td>
                                          )}
                                          {checkViewSidebar(
                                            "CallCenterQueue",
                                            slugPermissions,
                                            account?.sectionPermissions,
                                            account?.permissions,
                                            "delete"
                                          ) && (
                                            <td>
                                              <button
                                                className="tableButton delete mx-auto"
                                                onClick={() => {
                                                  setPopUp(true);
                                                  // setDeleteToggle(true);
                                                  setDeleteId(item.id);
                                                }}
                                              >
                                                <i className="fa-solid fa-trash"></i>
                                              </button>
                                            </td>
                                          )}
                                        </tr>
                                      );
                                    })}
                                  {callCenter &&
                                  callCenter.data.length === 0 ? (
                                    <td colSpan={99}>
                                      <EmptyPrompt
                                        name="Call Center"
                                        link="cal-center-queue-add"
                                      />
                                    </td>
                                  ) : (
                                    ""
                                  )}
                                </>
                              )}
                            </tbody>
                          </table>
                        )}
                      </div>
                      <div className="tableHeader mb-3">
                        {callCenter && callCenter?.data?.length > 0 ? (
                          <PaginationComponent
                            pageNumber={(e) => setPageNumber(e)}
                            totalPage={callCenter.totalPage}
                            from={callCenter.from}
                            to={callCenter.to}
                            total={callCenter.total}
                            defaultPage={pageNumber}
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
        {popUp ? (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div className="row content col-xl-4 col-md-5">
                  <div className="col-12 mb-2">
                    <div className="iconWrapper">
                      <i className="fa-duotone fa-triangle-exclamation"></i>
                    </div>
                  </div>
                  <div className="col-12 ">
                    <h4 className="text-center text-orange ">Warning!</h4>
                    <p className="text-center">
                      {deleteId == ""
                        ? error
                        : "Are you sure you want to delete this queue?"}
                      {selectedCallCenter?.id &&
                        `Are you sure you want to ${
                          selectedCallCenter?.status == 1 ? "disable" : "enable"
                        } the queue ${selectedCallCenter?.queue_name}?`}
                    </p>
                    <div className="mt-2 d-flex justify-content-center gap-2 mt-3">
                      {deleteId == "" ? (
                        <button
                          disabled={loading}
                          className="panelButton m-0"
                          onClick={() => {
                            if (selectedCallCenter?.id) {
                              handleUpdateCallCenterStatus(
                                selectedCallCenter?.id
                              );
                            } else {
                              setPopUp(false);
                              navigate(`${redirectRoutes}`);
                            }
                          }}
                        >
                          <span className="text">Confirm</span>
                          <span className="icon">
                            <i className="fa-solid fa-check"></i>
                          </span>
                        </button>
                      ) : (
                        <button
                          className="panelButton m-0"
                          onClick={() => handleDelete(deleteId)}
                        >
                          <span className="text">Confirm</span>
                          <span className="icon">
                            <i className="fa-solid fa-check"></i>
                          </span>
                        </button>
                      )}

                      <button
                        className="panelButton gray m-0 float-end"
                        onClick={() => {
                          setPopUp(false);
                          setDeleteId("");
                          setSelectedCallCenter(null);
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
        )}
      </main>
    </>
  );
}

export default CallCenterQueue;
