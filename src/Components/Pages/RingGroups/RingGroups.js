/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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
import EmptyPrompt from "../../Loader/EmptyPrompt";
import Header from "../../CommonComponents/Header";
import { toast } from "react-toastify";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import Tippy from "@tippyjs/react";
import CircularLoader from "../../Loader/CircularLoader";
import ThreeDotedLoader from "../../Loader/ThreeDotedLoader";

const RingGroups = () => {
  const [ringGroup, setRingGroup] = useState();
  const navigate = useNavigate();
  const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const account = useSelector((state) => state.account);
  const allUser = useSelector((state) => state.allUser);
  const [error, setError] = useState("");
  const [redirectRoutes, setRedirectRoutes] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRingGroup, setSelectedRingGroup] = useState(null);
  const [deleteId, setDeleteId] = useState("");
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const { data: usersData = [] } = allUser;
  const [refreshState, setRefreshState] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [noPermissionToRead, setNoPermissionToRead] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const slugPermissions = useSelector((state) => state?.permissions);
  const debouncedSearchTerm = useDebounce(searchValue, 1000);

  const getRingGroupDashboardData = async (shouldLoad) => {
    if (account && account.id) {
      if (shouldLoad) setLoading(true);
      const apidata = await generalGetFunction(
        `/ringgroup-dashboard?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${searchValue}`
      );
      if (apidata?.status) {
        setRingGroup(apidata.data);
        setLoading(false);
        setRefreshState(false);
      } else {
        if (apidata.response.status === 403) {
          setNoPermissionToRead(true);
        }
        setRefreshState(false);
      }
    } else {
      navigate("/");
      setRefreshState(false);
    }

    // Refresh User API if user list is empty
    if (usersData.length === 0) {
      dispatch({
        type: "SET_ALLUSERREFRESH",
        allUserRefresh: allUserRefresh + 1,
      });
    }
  };

  // Getting ringgroup data and also update user refresh to trigger user listing api call
  useEffect(() => {
    setRefreshState(true);
    const shouldLoad = true;
    getRingGroupDashboardData(shouldLoad);
    // if (refreshState === 0) {
    //   dispatch({
    //     type: "SET_ALLUSERREFRESH",
    //     allUserRefresh: allUserRefresh + 1,
    //   });
    // }
  }, [pageNumber, itemsPerPage, debouncedSearchTerm]);

  // Handle validation for naviagte to ring group add page if no user is create then redirect to user page to create user
  const handleRingGroupAddValidation = (e) => {
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

    navigate("/ring-groups-add");
    backToTop();
  };

  // Handle logic to delete ring group and then update the new ring group list
  async function handleDelete(id) {
    setPopUp(false);
    setLoading(true);
    const apiData = await generalDeleteFunction(`/ringgroup/${id}`);
    if (apiData?.status) {
      const newArray = ringGroup?.data?.filter((item) => item.id !== id);
      setRingGroup({ ...ringGroup, data: newArray });
      setLoading(false);
      toast.success(apiData.message);
      dispatch({
        type: "SET_RINGGROUPREFRESH",
        ringGroupRefresh: ringGroupRefresh + 1,
      });
      setDeleteId("");
    } else {
      setLoading(false);
      // toast.error(apiData.error);
      setDeleteId("");
    }
  }

  // Handle logic to update ring group status like enable or disable a ring group
  const handleUpdateStatusRingGroup = async (id) => {
    setLoading(true);

    const payLoad = {
      ...selectedRingGroup,
      ...{
        account_id: account.account_id,
        status: selectedRingGroup.status == "active" ? "inactive" : "active",
        destination: selectedRingGroup.ring_group_destination
          .map((item) => {
            if (item.destination.length > 0) {
              return {
                destination: item.destination,
                delay_order: item.delay_order,
                destination_timeout: item.destination_timeout,
                status: item.status,
                created_by: account.account_id,
                id: item.id,
              };
            } else {
              return null;
            }
          })
          .filter((item) => item !== null),
      },
    };
    delete payLoad.ring_group_destination;
    delete payLoad.ring_group_timeout_data;
    delete payLoad.ring_group_timeout_app;
      if (payLoad.destination_type === "disabled") {
      delete payLoad.timeout_destination
    }
    console.log(payLoad)

    setPopUp(false);
    const apiData = await generalPutFunction(`/ringgroup/${id}`, payLoad);
    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message);
      const ringGroupData = ringGroup?.data;
      const updatedRingGroupState = ringGroupData.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status:
              selectedRingGroup.status === "active" ? "inactive" : "active",
          };
        }
        return item;
      });
      //update on localstate
      setRingGroup({
        ...ringGroup,
        data: updatedRingGroupState,
      });

      setSelectedRingGroup(null);
    } else {
      setLoading(false);
    }
  };

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
    getRingGroupDashboardData(shouldLoad);
  };

  return (
    <>
      {pageLoading && <CircularLoader />}

      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Ring Groups" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>
                            Ring Group List
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
                          <p>You can see all list of ring groups</p>
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
                            "Ringgroup",
                            slugPermissions,
                            account?.sectionPermissions,
                            account?.permissions,
                            "add"
                          ) && (
                            <Link
                              // to="/ring-groups-add"
                              // onClick={backToTop}
                              onClick={handleRingGroupAddValidation}
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
                      <div className="tableHeader ">
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
                          "Ringgroup",
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
                      <div className="tableContainer mb-0">
                        {loading ? (
                          // <SkeletonTableLoader col={8} row={15} />
                          <ThreeDotedLoader />
                        ) : (
                          <table>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Extension</th>
                                <th>Strategy</th>
                                <th>Members</th>
                                {checkViewSidebar(
                                  "Ringgroup",
                                  slugPermissions,
                                  account?.sectionPermissions,
                                  account?.permissions,
                                  "edit"
                                ) && <th>Status</th>}
                                <th>Description</th>
                                {checkViewSidebar(
                                  "Ringgroup",
                                  slugPermissions,
                                  account?.sectionPermissions,
                                  account?.permissions,
                                  "edit"
                                ) && <th className="text-center">Edit</th>}
                                {checkViewSidebar(
                                  "Ringgroup",
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
                                "Ringgroup",
                                slugPermissions,
                                account?.sectionPermissions,
                                account?.permissions,
                                "read"
                              ) ? (
                                <tr>
                                  <td colSpan={99}>
                                    You dont have any permission
                                  </td>
                                </tr>
                              ) : (
                                <>
                                  {ringGroup &&
                                    ringGroup?.data?.map((item, index) => {
                                      return (
                                        <tr key={index}>
                                          <td>{item.name}</td>
                                          <td>{item.extension}</td>
                                          <td>{item.strategy}</td>

                                          <td>
                                            {/* {item.ring_group_destination.length} */}
                                            <Tippy
                                              content={
                                                <ul
                                                  className="dropdown-menu-hover"
                                                  style={{
                                                    columnCount:
                                                      item
                                                        .ring_group_destination
                                                        .length > 8
                                                        ? 2
                                                        : 1,
                                                  }}
                                                >
                                                  {/* <li className="col-12">
                                                    <div className="dropdown-item fw-bold disabled">
                                                      Agents
                                                    </div>
                                                  </li> */}
                                                  {item.ring_group_destination.map(
                                                    (item, index) => (
                                                      <li>
                                                        <div
                                                          className="dropdown-item d-flex align-items-center"
                                                          onClick={() =>
                                                            handleAgentClick(
                                                              item
                                                            )
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
                                                          </span>
                                                          <span className="ms-2">
                                                            {item?.username}
                                                          </span>
                                                        </div>
                                                      </li>
                                                    )
                                                  )}
                                                  {/* {item.ring_group_destination.length > 6 && <li className="col-12">
                                                    <Link to="/agents" className="dropdown-item text-center text-primary">
                                                      Show More
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
                                                <div className="avatar-container">
                                                  {item.ring_group_destination
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
                                                        </Tippy>
                                                      );
                                                    })}
                                                  {item.ring_group_destination
                                                    .length > 4 && (
                                                    <span>
                                                      +
                                                      {item
                                                        .ring_group_destination
                                                        .length - 4}
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            </Tippy>
                                          </td>

                                          {/* <td>(999) 999-9999, (999) 999-9999</td> */}
                                          {checkViewSidebar(
                                            "Ringgroup",
                                            slugPermissions,
                                            account?.sectionPermissions,
                                            account?.permissions,
                                            "edit"
                                          ) && (
                                            <td>
                                              <div className="my-auto position-relative mx-1">
                                                {/* <label className="switch">
                                                  <input
                                                    type="checkbox"
                                                    checked={
                                                      item.status == "active"
                                                    }
                                                    onClick={(e) => {
                                                      setSelectedRingGroup(item);
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
                                                      checked={
                                                        item.status == "active"
                                                      }
                                                      onClick={(e) => {
                                                        setSelectedRingGroup(
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
                                            </td>
                                          )}
                                          <td
                                            className="align-middle"
                                            id="detailBox"
                                          >
                                            <p className="ellipsis mb-0">
                                              {" "}
                                              {item.description}
                                            </p>
                                          </td>
                                          {checkViewSidebar(
                                            "Ringgroup",
                                            slugPermissions,
                                            account?.sectionPermissions,
                                            account?.permissions,
                                            "edit"
                                          ) && (
                                            <td>
                                              <button
                                                className="tableButton edit mx-auto"
                                                onClick={() =>
                                                  navigate(
                                                    `/ring-groups-edit?id=${item.id}`
                                                  )
                                                }
                                              >
                                                <i className="fa-solid fa-pencil" />
                                              </button>
                                            </td>
                                          )}
                                          {checkViewSidebar(
                                            "Ringgroup",
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
                                                  setDeleteId(item.id);
                                                }}
                                              >
                                                <i className="fa-solid fa-trash" />
                                                {/* <i className="fa-duotone fa-solid fa-trash"></i> */}
                                                {/* <i className="fa-duotone fa-solid fa-user-minus"></i> */}
                                              </button>
                                            </td>
                                          )}
                                          <div className="utilPopup"></div>
                                        </tr>
                                      );
                                    })}
                                  {ringGroup &&
                                  ringGroup?.data?.length === 0 ? (
                                    <td colSpan={99}>
                                      <EmptyPrompt
                                        name="Ring Group"
                                        link="ring-groups-add"
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
                      <div className="tableFooter">
                        {ringGroup && ringGroup?.data?.length > 0 ? (
                          <PaginationComponent
                            pageNumber={(e) => setPageNumber(e)}
                            totalPage={ringGroup.last_page}
                            from={ringGroup.from}
                            to={ringGroup.to}
                            total={ringGroup.total}
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
                  <div className="col-12">
                    <h4 className="text-center text-orange mb-1">Warning!</h4>
                    <p className="text-center">
                      {deleteId == ""
                        ? error
                        : "Are you sure you want to delete this ring group?"}
                      {selectedRingGroup?.id && (
                        <p>
                          Are you sure you want to{" "}
                          {selectedRingGroup.status == "active"
                            ? "deactivate"
                            : "activate"}{" "}
                          this ring group?
                        </p>
                      )}
                    </p>
                    <div className="d-flex justify-content-center gap-2 mt-3">
                      {deleteId !== "" || selectedRingGroup?.id ? (
                        <button
                          disabled={loading}
                          className="panelButton m-0"
                          onClick={() => {
                            if (deleteId !== "") handleDelete(deleteId);
                            else if (selectedRingGroup.id)
                              handleUpdateStatusRingGroup(selectedRingGroup.id);
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
                          onClick={() => {
                            // setForce(true);
                            setPopUp(false);
                            navigate(`${redirectRoutes}`);
                          }}
                        >
                          <span className="text">Lets Go!</span>
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
                          setSelectedRingGroup({});
                          // setDeleteToggle(false);
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
};

export default RingGroups;
