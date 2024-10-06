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
  const [changeState, setChangeState] = useState(1);
  const [popUp, setPopUp] = useState(false);
  const [error, setError] = useState("");
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
    console.log("usersByAccount", usersByAccount);
    if (usersByAccount.data) {
      setUser(usersByAccount);
      setFilterUser(usersByAccount.data);
      setLoading(false);
      async function getApi() {
        const apiData = await generalGetFunction(
          `/user/all?account=${account.account_id}&page=${pageNumber}`
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
          `/user/all?account=${account.account_id}&page=${pageNumber}`
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
          navigate("/");
        }
      }
      getApi();
    }
  }, [account, navigate, pageNumber, changeState]);

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
  async function handleStatusChange(id, status) {
    const parsedData = {
      status: status === "E" ? "D" : "E",
    };
    const apiData = await generalPutFunction(`/user/${id}`, parsedData);
    if (apiData.status) {
      setChangeState(changeState + 1);
    }
  }

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
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Users" />
            <div className="d-flex flex-wrap px-xl-3 py-2" id="detailsHeader">
              <div className="col-xl-4 my-auto">
                <div className="position-relative searchBox">
                  <input
                    type="search"
                    name="Search"
                    id="headerSearch"
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
              <div className="col-xl-8 mt-3 mt-xl-0">
                <div className="d-flex justify-content-end flex-wrap gap-2">
                  <Link
                    // to="/users-add"
                    // onClick={backToTop}
                    onClick={handleAddUserValidation}
                    effect="ripple"
                    className="panelButton"
                  >
                    Add
                  </Link>
                  {/* <div className="my-auto position-relative mx-3">
                    <label className="switch">
                      <input type="checkbox" id="showAllCheck" />
                      <span className="slider round" />
                    </label>
                    <span className="position-relative mx-1">Show All</span>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="col-12" style={{ overflow: "auto" }}>
              <div className="mx-2 tableContainer">
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
                                  {item.username} ({item.extension?.extension})
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
                                  <button className="tableButton edit" onClick={() =>
                                    navigate(`/users-edit`, {
                                      state: item,
                                    })
                                  }>
                                    <i class="fa-solid fa-pencil"></i>
                                  </button>
                                </td>
                                <td
                                  onClick={() =>
                                    handleStatusChange(item.id, item.status)
                                  }
                                >
                                  <label
                                    className={
                                      item.status === "E"
                                        ? "tableLabel success"
                                        : "tableLabel fail"
                                    }
                                  >
                                    {item.status === "E"
                                      ? "Enabled"
                                      : "Disabled"}
                                  </label>
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
            </div>
          </div>
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
                  <p>{error}</p>
                  <button
                    className="panelButton m-0"
                    onClick={() => {
                      // setForce(true);
                      setPopUp(false);
                      navigate("/roles");
                    }}
                  >
                    Lets Go!
                  </button>
                  <button
                    className="panelButtonWhite m-0 float-end"
                    onClick={() => setPopUp(false)}
                  >
                    Cancel
                  </button>
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
