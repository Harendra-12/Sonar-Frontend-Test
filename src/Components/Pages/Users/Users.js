import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ContentLoader from "../../Loader/ContentLoader";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import Header from "../../CommonComponents/Header";
import PaginationComponent from "../../CommonComponents/PaginationComponent";

import { toast } from "react-toastify";
const Users = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const roles = useSelector((state) => state.roles);
  const rolesAndPermissionRefresh = useSelector(
    (state) => state.rolesAndPermissionRefresh
  );
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [userInput, setuserInput] = useState("");
  const [selectedOption, setSelectedOption] = useState("userName");
  const [filterUser, setFilterUser] = useState(user);
  const [loading, setLoading] = useState(true);
  const logonUser = useSelector((state) => state.loginUser);
  const [pageNumber, setPageNumber] = useState(1);
  const [onlineUser, setOnlineUSer] = useState([0]);
  // const [changeState, setChangeState] = useState(1);
  const [popUp, setPopUp] = useState(false);
  const [error, setError] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const usersByAccount = useSelector((state) => state.usersByAccount);
  useEffect(() => {
    if (logonUser && logonUser.length > 0) {
      setOnlineUSer(
        logonUser.map((item) => {
          return item.id;
        })
      );
    }
  }, [logonUser]);

  useEffect(() => {
    dispatch({
      type: "SET_ROLES_PERMISSIONREFRESH",
      rolesAndPermissionRefresh: rolesAndPermissionRefresh + 1,
    });
  }, []);

  useEffect(() => {
    if (usersByAccount.data) {
      setUser(usersByAccount);
      setFilterUser(usersByAccount.data);
      setLoading(false);
      async function getApi() {
        const apiData = await generalGetFunction(
          `/user/all?page=${pageNumber}`
        );
        if (apiData?.status) {
          setUser(apiData.data);
          setFilterUser(apiData.data.data);
          dispatch({
            type: "SET_USERSBYACCOUNT",
            usersByAccount: apiData.data,
          });
        } else {
          navigate("/");
        }
      }
      getApi();
    } else {
      setLoading(true);
      async function getApi() {
        const apiData = await generalGetFunction(
          `/user/all?page=${pageNumber}`
        );
        if (apiData?.status) {
          setUser(apiData.data);
          setFilterUser(apiData.data.data);
          dispatch({
            type: "SET_USERSBYACCOUNT",
            usersByAccount: apiData.data,
          });
          setLoading(false);
        } else {
          toast.error(apiData.message);
        }
      }
      getApi();
    }
  }, [account, navigate, pageNumber]);

  // Filter user based on input
  useEffect(() => {
    if (user) {
      if (selectedOption === "userName") {
        setFilterUser(
          user.data.filter((item) => item.username.includes(userInput))
        );
      } else if (selectedOption === "accountId") {
        setFilterUser(
          user.data.filter((item) =>
            String(item.account_id).includes(userInput)
          )
        );
      }
      //  else if (selectedOption === "domain") {
      //   setFilterUser(
      //     user.data.filter((item) =>
      //       item?.domain?.domain_name?.includes(userInput)
      //     )
      //   );
      // }
      else if (selectedOption === "online") {
        setFilterUser(user.data.filter((item) => onlineUser.includes(item.id)));
      } else if (selectedOption === "onCall") {
      }
    }
  }, [onlineUser, selectedOption, user, userInput]);

  // Handle status cahnge when a user click on status
  // async function handleStatusChange(id, status) {
  //   const parsedData = {
  //     status: status === "E" ? "D" : "E",
  //   };
  //   const apiData = await generalPutFunction(`/user/${id}`, parsedData);
  //   if (apiData.status) {
  //     setChangeState(changeState + 1);
  //   }
  // }

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
      dispatch({
        type: "SET_USERSBYACCOUNT",
        usersByAccount: { ...user, data: updatedData },
      });
      setPopUp(false);
      toast.success(apiData.message);
      setLoading(false);
    } else {
      setLoading(false);
    }
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
                      <div className="content">
                        <h4>Users</h4>
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
                        {account?.permissions?.includes(442) ? (
                          <Link
                            // to="/users-add"
                            // onClick={backToTop}
                            onClick={handleAddUserValidation}
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
                            onClick={handleAddUserValidation}
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
                          placeholder="Search"
                          value={userInput}
                          onChange={(e) => setuserInput(e.target.value)}
                          style={{ paddingRight: 100 }}
                        />
                        <select
                          className="secretSelect"
                          value={selectedOption}
                          onChange={(e) => setSelectedOption(e.target.value)}
                        >
                          <option value="userName">Username</option>
                          <option value="accountId">Account ID</option>
                          {/* <option value="domain">Domain</option> */}
                          <option value="online">Online</option>
                          <option value="onCall">On Call</option>
                        </select>
                      </div>
                    </div>
                    <div className="tableContainer">
                      <table>
                        <thead>
                          <tr>
                            <th>Username (Extension)</th>
                            <th>Account ID</th>
                            {/* <th>Domain</th> */}
                            <th>Online</th>
                            <th>On Call</th>
                            <th>Edit</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr>
                              <td colSpan={99}>
                                <ContentLoader />
                              </td>
                            </tr>
                          ) : (
                            <>
                              {user &&
                                filterUser.map((item, index) => {
                                  const isCustomerAdmin =
                                    account.email === item.email;

                                  // Skip rendering the row if isCustomerAdmin is true
                                  if (isCustomerAdmin) {
                                    return null; // Return null to avoid rendering the row
                                  }

                                  return (
                                    <tr key={index}>
                                      <td
                                        onClick={() =>
                                          navigate(`/users-edit`, {
                                            state: item,
                                          })
                                        }
                                      >
                                        {item.username} (
                                        {item.extension?.extension})
                                      </td>
                                      <td
                                        onClick={() =>
                                          navigate(`/users-edit`, {
                                            state: item,
                                          })
                                        }
                                      >
                                        {item.account_id}
                                      </td>
                                      <td
                                        onClick={() =>
                                          navigate(`/users-edit`, {
                                            state: item,
                                          })
                                        }
                                      >
                                        <span
                                          className={
                                            onlineUser.includes(item.id)
                                              ? "extensionStatus online"
                                              : "extensionStatus"
                                          }
                                        ></span>
                                      </td>
                                      <td
                                        onClick={() =>
                                          navigate(`/users-edit`, {
                                            state: item,
                                          })
                                        }
                                      >
                                        True
                                      </td>
                                      <td>
                                        <button
                                          className="tableButton edit"
                                          onClick={() =>
                                            navigate(`/users-edit`, {
                                              state: item,
                                            })
                                          }
                                        >
                                          <i class="fa-solid fa-pencil"></i>
                                        </button>
                                      </td>
                                      <td
                                      // onClick={() =>
                                      //   handleStatusChange(item.id, item.status)
                                      // }
                                      >
                                        {/* {item.status === "E"
                                          ? "Enabled"
                                          : "Disabled"} */}
                                        <div className="my-auto position-relative mx-1">
                                          <label className="switch">
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
                                          </label>
                                        </div>
                                      </td>
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
                          to={user.to - 1} // -1 because customeradmin user is removed form the list
                          total={user.total - 1} // -1 because customeradmin user is removed form the list
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
              <div className="row content col-xl-4">
                <div className="col-2 px-0">
                  <div className="iconWrapper">
                    <i className="fa-duotone fa-triangle-exclamation"></i>
                  </div>
                </div>
                <div className="col-10 ps-0">
                  <h4>Warning!</h4>
                  <p>
                    {error
                      ? error
                      : selectedUser?.id
                      ? `Are you sure you want to ${
                          selectedUser?.status === "E" ? "disable" : "enable"
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
                        <i class="fa-solid fa-check"></i>
                      </span>
                    </button>
                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => setPopUp(false)}
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

export default Users;
