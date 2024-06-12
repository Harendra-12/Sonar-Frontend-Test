import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ContentLoader from "../Misc/ContentLoader";
import EmptyPrompt from "../Misc/EmptyPrompt";
import Header from "../../CommonComponents/Header";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
const Users = () => {
  const account = useSelector((state) => state.account);
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
  useEffect(() => {
    if (logonUser && logonUser.length > 0) {
      setOnlineUSer(
        logonUser.map((item) => {
          return item.id;
        })
      );
    }
  }, [logonUser]);
  console.log("This is online user", onlineUser);

  useEffect(() => {
    setLoading(true);
    async function getApi() {
      const apiData = await generalGetFunction(
        `/user/all?account=${account.account_id}&page=${pageNumber}`
      );
      if (apiData.status) {
        setUser(apiData.data);
        setFilterUser(apiData.data.data);
        setLoading(false);
      } else {
        navigate("/");
      }
    }
    getApi();
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
      } else if (selectedOption === "domain") {
        setFilterUser(
          user.data.filter((item) =>
            item?.domain?.domain_name?.includes(userInput)
          )
        );
      } else if (selectedOption === "online") {
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
      console.log("Thi si api data", apiData);
    }
  }
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Users" />
            <div className="row px-xl-3 py-2" id="detailsHeader">
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
                    <option value="domain">Domain</option>
                    <option value="online">Online</option>
                    <option value="onCall">On Call</option>
                  </select>
                </div>
              </div>
              <div className="col-xl-8 mt-3 mt-xl-0">
                <div className="d-flex justify-content-end flex-wrap gap-2">
                  <Link
                    to="/users-add"
                    onClick={backToTop}
                    effect="ripple"
                    className="panelButton"
                  >
                    Add
                  </Link>
                  <div className="my-auto position-relative mx-3">
                    <label className="switch">
                      <input type="checkbox" id="showAllCheck" />
                      <span className="slider round" />
                    </label>
                    <span className="position-relative mx-1">Show All</span>
                  </div>
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
                      <th>Domain</th>
                      <th>Online</th>
                      <th>On Call</th>
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
                                  {item?.domain?.domain_name}
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
              to={user.to}
              total={user.total}
            />
          ) : (
            ""
          )}
        </div>
      </section>
    </main>
  );
};

export default Users;
