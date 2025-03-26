/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  checkViewSidebar,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import SkeletonFormLoader from "../../Loader/SkeletonFormLoader";
function Agents({ type }) {
  const navigate = useNavigate();
  const logonUser = useSelector((state) => state.loginUser);
  const [agents, setAgents] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([0]);
  const [loading, setLoading] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [userInput, setuserInput] = useState("");
  const account = useSelector((state) => state?.account);
  const slugPermissions = useSelector((state) => state?.permissions);

  useEffect(() => {
    if (logonUser && logonUser.length > 0) {
      setOnlineUsers(
        logonUser.map((item) => {
          return item.id;
        })
      );
    }
  }, [logonUser]);
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const apiData = await generalGetFunction(
        `/agents?usages=${type}&row_per_page=${entriesPerPage}&page=${pageNumber}&search=${userInput}`
      );
      if (apiData?.status) {
        setAgents(apiData.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    if (userInput.trim().length === 0) {
      getData();
    } else {
      const timer = setTimeout(() => {
        getData();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [entriesPerPage, pageNumber, type, userInput]);

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Agents" />
            {loading ? (
              <div colSpan={99}>
                <SkeletonFormLoader />
              </div>
            ) : (
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>Agent List</h4>
                          <p>List of all agents</p>
                        </div>
                        <div className="buttonGroup">
                          <button
                            onClick={() => {
                              navigate(-1);
                              backToTop();
                            }}
                            effect="ripple"
                            className="panelButton gray"
                          >
                            <span className="text">Back</span>
                            <span className="icon">
                              <i className="fa-solid fa-caret-left"></i>
                            </span>
                          </button>

                          {checkViewSidebar(
                            "CallCenterAgent",
                            slugPermissions,
                            account?.permissions, "add") && <button
                              onClick={() => {
                                navigate("/agents-pbx-add");
                                backToTop();
                              }}
                              className="panelButton"
                            >
                              <span className="text">Add</span>
                              <span className="icon">
                                <i className="fa-solid fa-plus"></i>
                              </span>
                            </button>}
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
                            value={entriesPerPage}
                            onChange={(e) => setEntriesPerPage(e.target.value)}
                            className="formItem"
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
                              <th>Name</th>
                              <th>Extension</th>
                              {/* <th>Account ID</th> */}
                              {/* <th>Role</th> */}
                              {/* <th>Domain</th> */}
                              <th>Online</th>
                              {checkViewSidebar(
                                "CallCenterAgent",
                                slugPermissions,
                                account?.permissions, "edit") && <th>Edit</th>}
                              {/* <th>Status</th> */}
                            </tr>
                          </thead>
                          <tbody className="">
                            {checkViewSidebar(
                              "CallCenterAgent",
                              slugPermissions,
                              account?.permissions, "read") && agents?.data?.map((item, index) => {
                                return (
                                  <tr>
                                    <td>{item.name}</td>
                                    <td>{item.extension.extension}</td>
                                    {/* <td>{item.account_id}</td> */}
                                    <td>
                                      <span
                                        className={
                                          onlineUsers.includes(item.id)
                                            ? "extensionStatus online"
                                            : "extensionStatus"
                                        }
                                      ></span>
                                    </td>
                                    {checkViewSidebar(
                                      "CallCenterAgent",
                                      slugPermissions,
                                      account?.permissions, "edit") && <td>
                                        <button
                                          className="tableButton edit"
                                          onClick={() => {
                                            navigate(`/agents-edit?id=${item.id}`, {
                                              state: item,
                                            });
                                          }}
                                        >
                                          <i className="fa-solid fa-pencil"></i>
                                        </button>
                                      </td>}
                                    {/* <td>
                                  <div className="my-auto position-relative mx-1">
                                    <label className="switch">
                                      <input
                                        type="checkbox"
                                        id="showAllCheck"
                                        checked=""
                                      />
                                      <span className="slider round"></span>
                                    </label>
                                  </div>
                                </td> */}
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                      <div className="tableHeader mb-3">
                        <PaginationComponent
                          pageNumber={(e) => setPageNumber(e)}
                          totalPage={agents.last_page}
                          from={(pageNumber - 1) * agents.per_page + 1}
                          to={agents.to}
                          total={agents.total}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* {loading ? (
        <div colSpan={99}>
          <CircularLoader />
        </div>
      ) : (
        ""
      )} */}
      {/* {popUp ? (
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
                                        
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <button
                                           
                                        >
                                            <span className="text">
                                               
                                            </span>
                                            <span className="icon">
                                                <i className="fa-solid fa-check"></i>
                                            </span>
                                        </button>
                                        <button
                                            className="panelButton gray m-0 float-end"
                                           
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
            )} */}
    </main>
  );
}

export default Agents;
