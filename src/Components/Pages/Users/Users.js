/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  backToTop,
  checkViewSidebar,
  generalDeleteFunction,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import Header from "../../CommonComponents/Header";
import PaginationComponent from "../../CommonComponents/PaginationComponent";

import { toast } from "react-toastify";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
const Users = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const roles = useSelector((state) => state.roles);
  const rolesRefresh = useSelector((state) => state.rolesRefresh);
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [userInput, setuserInput] = useState("");
  const [filterUser, setFilterUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const logonUser = useSelector((state) => state.loginUser);
  const [pageNumber, setPageNumber] = useState(1);
  const [onlineUser, setOnlineUSer] = useState([0]);
  const [popUp, setPopUp] = useState(false);
  const [error, setError] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshState, setRefreshState] = useState(false);
  const [noPermissionToRead, setNoPermissionToRead] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [refreshData, setRefreshData] = useState(0);
  const [onlineFilter, setonlineFilter] = useState("all")
  const slugPermissions = useSelector((state) => state?.permissions);
  // Setting up online users to display when user is logged in
  useEffect(() => {
    if (logonUser && logonUser.length > 0) {
      setOnlineUSer(
        logonUser.map((item) => {
          return item.id;
        })
      );
    }
  }, [logonUser]);

  // Getting roles data to show which role is assigned to a user
  useEffect(() => {
    dispatch({
      type: "SET_ROLES_REFRESH",
      rolesRefresh: rolesRefresh + 1,
    });
  }, []);

  // Getting users data with pagination row per page and search filter
  useEffect(() => {
    setLoading(true);
    async function getApi() {
      const apiData = await generalGetFunction(
        `/user/all?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${userInput}${onlineFilter == "all" ? "" : onlineFilter == "online" ? "&online" : "&offline"}`
      );
      if (apiData?.status) {
        setUser(apiData.data);
        setFilterUser(apiData.data.data);
        dispatch({
          type: "SET_USERSBYACCOUNT",
          usersByAccount: apiData.data,
        });
        setLoading(false);
        setRefreshState(false);
      } else {
        // toast.error(apiData.message);
        setLoading(false);
        setRefreshState(false);
        if (apiData?.response?.status === 403) {
          setNoPermissionToRead(true);
        }
      }
    }
    if (userInput.trim().length === 0) {
      getApi();
    } else {
      const timer = setTimeout(() => {
        getApi();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [
    account,
    navigate,
    pageNumber,
    refreshState,
    itemsPerPage,
    userInput,
    refreshData,
    onlineFilter,
  ]);

  // Checking if role is created and the current user have permsiion to create user
  const handleAddUserValidation = (e) => {
    e.preventDefault();
    if (roles.length === 0) {
      setPopUp(true);
      setError("Please add roles to create a user");
      return;
    }
    const hasPermissions = roles.some((role) => role.permissions.length > 0);

    if (!hasPermissions) {
      setPopUp(true);
      setError("Please add permissions to create a user");
      return;
    }

    navigate(`/users-add`);
    backToTop();
  };

  // Updating user status enable or disable
  const handleUpdateStatusUser = async (id) => {
    setLoading(true);

    const payload = {
      account_id: account.account_id,
      email: selectedUser.email,
      extension_id: selectedUser.extension_id,
      name: selectedUser.name,
      permissions: selectedUser.permissions,
      role_id: selectedUser.role_id,
      status: selectedUser.status === "E" ? "D" : "E",
      timezone_id: selectedUser.timezone_id,
    };

    setPopUp(false);
    const apiData = await generalPutFunction(`user/${id}`, payload);
    if (apiData.status) {
      const updatedData = user.data.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: selectedUser.status === "E" ? "D" : "E",
          };
        }
        return item;
      });
      setUser({ ...user, data: updatedData });
      setFilterUser(updatedData);
      dispatch({
        type: "SET_USERSBYACCOUNT",
        usersByAccount: { ...user, data: updatedData },
      });

      toast.success(apiData.message);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  // Deleting userand updating the global state
  const handleDelete = async (deleteId) => {
    setPopUp(false);
    setLoading(true)
    const apiData = await generalDeleteFunction(`/user/${deleteId}`);
    if (apiData.status) {
      const updatedData = user.data.filter((item) => item.id !== deleteId);
      setUser({ ...user, data: updatedData });
      setFilterUser(updatedData);
      setRefreshData(refreshData + 1);
      dispatch({
        type: "SET_USERSBYACCOUNT",
        usersByAccount: { ...user, data: updatedData },
      });
      toast.success(apiData.message)
    } else {
      toast.error(apiData.error);
    }
    setDeleteId(deleteId);
  };
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Users" />
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content d-flex">
                        <h4>
                          User List{" "}
                          <button
                            className="clearButton"
                            onClick={() => setRefreshState(true)}
                          >
                            <i
                              className={
                                loading
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
                        {checkViewSidebar("User", slugPermissions, account?.permissions, "add") ? (
                          <Link
                            // to="/users-add"
                            // onClick={backToTop}
                            onClick={handleAddUserValidation}
                            effect="ripple"
                            className="panelButton"
                          >
                            <span className="text">Add</span>
                            <span className="icon">
                              <i className="fa-solid fa-plus"></i>
                            </span>
                          </Link>
                        ) : (
                          <button
                            disabled
                            onClick={handleAddUserValidation}
                            effect="ripple"
                            className="panelButton"
                            style={{ cursor: "not-allowed" }}
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
                  <div
                    className="col-12"
                    style={{ overflow: "auto", padding: "20px 20px 0" }}
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
                      <div className="searchBox position-relative">
                        <label>Search:</label>
                        <input
                          type="search"
                          name="Search"
                          className="formItem"
                          value={userInput}
                          onChange={(e) => setuserInput(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="tableContainer">
                      <table>
                        <thead>
                          <tr>
                            <th>Username</th>
                            <th>Extension</th>
                            {/* <th>Account ID</th> */}
                            <th>Role</th>
                            <th>Usage</th>
                            <th>  <select className="formItem f-select-width" value={onlineFilter} onChange={(e) => setonlineFilter(e.target.value)}>
                              <option value="all" disabled>Status</option>
                              <option value="online">Online</option>
                              <option value="offline">Offline</option>
                              <option value="all">All</option>
                            </select></th>
                            {checkViewSidebar("User", slugPermissions, account?.permissions, "edit") && <th className="text-center">Edit</th>}
                            <th>Activation <span>

                            </span></th>
                            <th className="text-center">Delete</th>
                          </tr>
                        </thead>
                        <tbody className="">
                          {noPermissionToRead && checkViewSidebar(
                            "User",
                            slugPermissions,
                            account?.permissions,
                            "read"
                          ) ? (
                            // <div className="">
                            <tr>
                              <td></td>
                              <td></td>
                              <td>You dont have any permission</td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          ) : // </div>
                            loading ? (
                              <SkeletonTableLoader col={8} row={15} />
                            ) : (
                              <>
                                {user &&
                                  filterUser?.map((item, index) => {
                                    const isCustomerAdmin =
                                      account.email === item.email;

                                    // Skip rendering the row if isCustomerAdmin is true
                                    // if (isCustomerAdmin) {
                                    //   return null; // Return null to avoid rendering the row
                                    // }

                                    return (
                                      <tr key={index}>
                                        <td>
                                          <div className="d-flex align-items-center">
                                            <div className="tableProfilePicHolder">
                                              {item.profile_picture ? (
                                                <img
                                                  src={item.profile_picture}
                                                  onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                                />
                                              ) : (
                                                <i className="fa-light fa-user" />
                                              )}
                                            </div>
                                            <div className="ms-2">{item.username}</div>
                                          </div>
                                        </td>
                                        <td>
                                          {item.extension?.extension || "N/A"}
                                        </td>
                                        {/* <td
                                          onClick={() =>
                                            navigate(`/users-edit`, {
                                              state: item,
                                            })
                                          }
                                        >
                                          {item.account_id}
                                        </td> */}
                                        <td>
                                          {item?.user_role?.roles?.name}
                                        </td>
                                        <td
                                          onClick={() =>
                                            navigate(`/users-config`, {
                                              state: item,
                                            })
                                          }
                                        >
                                          {item?.usages}
                                        </td>
                                        <td >
                                          <span
                                            className={
                                              onlineUser.includes(item.id)
                                                ? "extensionStatus online"
                                                : "extensionStatus"
                                            }
                                          ></span>
                                        </td>
                                        {checkViewSidebar("User", slugPermissions, account?.permissions, "edit") && <td>
                                          <button
                                            className="tableButton edit"
                                            onClick={() =>
                                              navigate(`/users-config`, {
                                                state: item,
                                              })
                                            }
                                          >
                                            <i className="fa-solid fa-pencil"></i>
                                          </button>
                                        </td>}
                                        <td
                                        // onClick={() =>
                                        //   handleStatusChange(item.id, item.status)
                                        // }
                                        >
                                          {/* {item.status === "E"
                                            ? "Enabled"
                                            : "Disabled"} */}
                                          <div className="my-auto position-relative mx-1">
                                            {/* <label className="switch">
                                              <input
                                                type="checkbox"
                                                checked={item.status === "E"}
                                                onClick={(e) => {
                                                  setSelectedUser(item);
                                                  setPopUp(true);
                                                }}
                                                id="showAllCheck"
                                              />
                                              <span className="slider round" />
                                            </label> */}
                                            <div class="cl-toggle-switch">
                                                  <label class="cl-switch">
                                                    <input type="checkbox"
                                                       checked={item.status === "E"}
                                                       onClick={(e) => {
                                                         setSelectedUser(item);
                                                         setPopUp(true);
                                                       }}
                                                      id="showAllCheck"
                                                       />
                                                      <span></span>
                                                  </label>
                                                </div>
                                          </div>
                                        </td>
                                        {checkViewSidebar("User", slugPermissions, account?.permissions, "delete") && <td>
                                          <button
                                            className="tableButton delete"
                                            onClick={() => {
                                              setPopUp(true);
                                              setDeleteId(item.id);
                                            }}
                                          >
                                            <i className="fa-solid fa-trash" />
                                          </button>
                                        </td>}
                                      </tr>
                                    );
                                  })}
                              </>
                            )}

                          {user && user.length === 0 ? (
                            <td colSpan={99}>
                              <EmptyPrompt name="User" link="users-add" />
                            </td>
                          ) : (
                            ""
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="tableHeader mb-3">
                      {user && user.data.length > 0 ? (
                        <PaginationComponent
                          pageNumber={(e) => setPageNumber(e)}
                          totalPage={user.last_page}
                          from={(pageNumber - 1) * user.per_page + 1}
                          to={user.to}
                          total={user.total}
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
                    {deleteId
                      ? "Are you sure you want to delete this user?"
                      : ""}
                    {error
                      ? error
                      : selectedUser?.id
                        ? `Are you sure you want to ${selectedUser?.status === "E" ? "disable" : "enable"
                        } ${selectedUser?.username}?`
                        : ""}
                  </p>
                  <div className="d-flex justify-content-between">
                    <button
                      disabled={loading}
                      className="panelButton m-0"
                      onClick={() => {
                        // setForce(true);
                        if (selectedUser?.id) {
                          handleUpdateStatusUser(selectedUser?.id);
                        } else if (deleteId) {
                          handleDelete(deleteId);
                        } else {
                          setPopUp(false);
                          navigate("/roles");
                        }
                      }}
                    >
                      <span className="text">
                        {selectedUser?.id ? "Confirm" : "Lets Go!"}
                      </span>
                      <span className="icon">
                        <i className="fa-solid fa-check"></i>
                      </span>
                    </button>
                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setPopUp(false);
                        setDeleteId();
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
        " "
      )}
    </main>
  );
};

export default Users;
