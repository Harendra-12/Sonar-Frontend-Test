/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalDeleteFunction,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import Header from "../../CommonComponents/Header";
import { toast } from "react-toastify";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";

const RingGroups = () => {
  const [ringGroup, setRingGroup] = useState();
  const navigate = useNavigate();
  const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
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
  const [refreshState, setRefreshState] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [noPermissionToRead, setNoPermissionToRead] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Getting ringgroup data and also update user refresh to trigger user listing api call
  useEffect(() => {
    const getRingGroupDashboardData = async () => {
      if (account && account.id) {
        setLoading(true);
        const apidata = await generalGetFunction(
          `/ringgroup-dashboard?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${searchValue}`
        );
        console.log(apidata);
        if (apidata?.status) {
          setRingGroup(apidata.data);
          setLoading(false);
        } else {
          if (apidata.response.status === 403) {
            setNoPermissionToRead(true);
          }
        }
      } else {
        navigate("/");
      }
    };
    if (searchValue.trim().length === 0) {
      getRingGroupDashboardData();
    } else {
      const timer = setTimeout(() => {
        getRingGroupDashboardData();
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (refreshState === 0) {
      dispatch({
        type: "SET_ALLUSERREFRESH",
        allUserRefresh: allUserRefresh + 1,
      });
    }
  }, [pageNumber, refreshState, itemsPerPage, searchValue]);

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

  return (
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
                        <h4>Ring Group List
                          <button className="clearButton" onClick={() => setRefreshState(refreshState + 1)} disabled={loading}>
                            <i className={
                              loading
                                ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                : "fa-regular fa-arrows-rotate fs-5"
                            }></i>
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
                            <i class="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        {account?.permissions?.includes(346) ? (
                          <Link
                            // to="/ring-groups-add"
                            // onClick={backToTop}
                            onClick={handleRingGroupAddValidation}
                            effect="ripple"
                            className="panelButton"
                          >
                            <span className="text">Add</span>
                            <span className="icon">
                              <i class="fa-solid fa-plus"></i>
                            </span>
                          </Link>
                        ) : (
                          <button
                            disabled
                            onClick={handleRingGroupAddValidation}
                            effect="ripple"
                            className="panelButton"
                            style={{ cursor: "not-allowed" }}
                          >
                            <span className="text">Add</span>
                            <span className="icon">
                              <i class="fa-solid fa-plus"></i>
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12"
                    style={{ overflow: "auto", padding: "25px 20px 0" }}
                  >
                    <div className="tableHeader">
                      <div className="showEntries">
                        <label>Show</label>
                        <select
                          className="formItem"
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(e.target.value);
                          }}
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={30}>30</option>
                        </select>
                        <label>entries</label>
                      </div>
                      <div className="searchBox position-relative">
                        <label>Search:</label>
                        <input
                          type="text"
                          name="Search"
                          placeholder="Search"
                          value={searchValue}
                          className="formItem"
                          onChange={(e) => setSearchValue(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="tableContainer">
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Extension</th>
                            <th>Strategy</th>
                            <th>Members</th>
                            <th>Status</th>
                            <th>Description</th>
                            <th>Edit</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {noPermissionToRead ? (
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>No Permission</td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          ) : (
                            <>
                              {loading ? (
                                <SkeletonTableLoader col={8} row={15} />
                              ) : (
                                <>
                                  {ringGroup &&
                                    ringGroup?.data?.map((item, index) => {
                                      return (
                                        <tr key={index}>
                                          <td
                                            onClick={() =>
                                              navigate(
                                                `/ring-groups-edit?id=${item.id}`
                                              )
                                            }
                                          >
                                            {item.name}
                                          </td>
                                          <td
                                            onClick={() =>
                                              navigate(
                                                `/ring-groups-edit?id=${item.id}`
                                              )
                                            }
                                          >
                                            {item.extension}
                                          </td>
                                          <td
                                            onClick={() =>
                                              navigate(
                                                `/ring-groups-edit?id=${item.id}`
                                              )
                                            }
                                          >
                                            {item.strategy}
                                          </td>
                                          <td
                                            onClick={() =>
                                              navigate(
                                                `/ring-groups-edit?id=${item.id}`
                                              )
                                            }
                                          >
                                            {item.ring_group_destination.map(
                                              (item, index, array) => (
                                                <span>
                                                  {item.username}
                                                  {index < array.length - 1
                                                    ? ", "
                                                    : ""}
                                                </span>
                                              )
                                            )}
                                          </td>
                                          {/* <td>(999) 999-9999, (999) 999-9999</td> */}
                                          <td>
                                            <div className="my-auto position-relative mx-1">
                                              <label className="switch">
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
                                              </label>
                                            </div>
                                          </td>
                                          <td
                                            onClick={() =>
                                              navigate(
                                                `/ring-groups-edit?id=${item.id}`
                                              )
                                            }
                                            className="ellipsis"
                                            id="detailBox"
                                          >
                                            {item.description}
                                          </td>
                                          <td>
                                            <button
                                              className="tableButton edit"
                                              onClick={() =>
                                                navigate(
                                                  `/ring-groups-edit?id=${item.id}`
                                                )
                                              }
                                            >
                                              <i className="fa-solid fa-pencil" />
                                            </button>
                                          </td>
                                          <td>
                                            <button
                                              className="tableButton delete"
                                              onClick={() => {
                                                setPopUp(true);
                                                setDeleteId(item.id);
                                              }}
                                            >
                                              <i className="fa-solid fa-trash" />
                                            </button>
                                          </td>
                                          <div className="utilPopup">
                                          </div>
                                        </tr>
                                      );
                                    })}
                                  {ringGroup && ringGroup?.data?.length === 0 ? (
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
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="tableHeader mb-3">
                      {ringGroup && ringGroup?.data?.length > 0 ? (
                        <PaginationComponent
                          pageNumber={(e) => setPageNumber(e)}
                          totalPage={ringGroup.last_page}
                          from={ringGroup.from}
                          to={ringGroup.to}
                          total={ringGroup.total}
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
                <div className="col-2 px-0">
                  <div className="iconWrapper">
                    <i className="fa-duotone fa-triangle-exclamation"></i>
                  </div>
                </div>
                <div className="col-10 ps-0">
                  <h4>Warning!</h4>
                  <p>
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
                  <div className="d-flex justify-content-between">
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
                          <i class="fa-solid fa-check"></i>
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
                          <i class="fa-solid fa-check"></i>
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
                        <i class="fa-solid fa-xmark"></i>
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
  );
};

export default RingGroups;
