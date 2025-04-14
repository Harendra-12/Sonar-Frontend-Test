/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  checkViewSidebar,
  generalGetFunction,
  generalGetFunctionWithToken,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import SkeletonFormLoader from "../../Loader/SkeletonFormLoader";
import { toast } from "react-toastify";
import PromptFunctionPopup from "../../CommonComponents/PromptFunctionPopup";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import EmptyPrompt from "../../Loader/EmptyPrompt";
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
  const { confirm, ModalComponent } = PromptFunctionPopup();
  const baseName = process.env.REACT_APP_BACKEND_BASE_URL;
  const [isAgentLogoutPopup, setIsAgentLogoutPopup] = useState(false);
  const [agentLogOutToken, setAgentLogOutToken] = useState("");
  const allDID = useSelector((state) => state.didAll);

  useEffect(() => {
    if (logonUser && logonUser.length > 0) {
      setOnlineUsers(
        logonUser.map((item) => {
          return item.id;
        })
      );
    }

  }, [logonUser]);

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

  useEffect(() => {
    // getData();
    // if (userInput.trim().length === 0) {
    //   getData();
    // } else {
    //   const timer = setTimeout(() => {
    //     getData();
    //   }, 1000);
    //   return () => clearTimeout(timer);
    // }
    getData();
  }, [entriesPerPage, pageNumber, type,userInput]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     getData();
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, [userInput])


  // Handle Agent Logout Function
  const handleAgentLogout = async (token) => {
    setIsAgentLogoutPopup(false);
    if (agentLogOutToken) {
      // const userConfirmed = await confirm();
      // if (userConfirmed) {
      setLoading(true);
      try {
        const logOut = await generalGetFunctionWithToken(`${baseName}/logout?all`, agentLogOutToken)
        if (logOut?.status) {
          toast.success(logOut?.message);
          setLoading(false);
          getData();
        } else {
          toast.error(logOut?.error || logOut?.error.message);
        }
      } catch (err) {
        console.log(err);
        toast.error(err);
        setLoading(false);
      }
      // }
    }
  }

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Agents" />
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
                    style={{ overflow: "auto", padding: "10px 20px 0" }}
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
                            <th>Caller ID</th>
                            <th>Extension</th>
                            <th>Role</th>
                            <th>Recording</th>
                            <th>Online</th>
                            {checkViewSidebar(
                              "CallCenterAgent",
                              slugPermissions,
                              account?.permissions, "edit") && <th className="text-center">LogOut</th>}
                            {checkViewSidebar(
                              "CallCenterAgent",
                              slugPermissions,
                              account?.permissions, "edit") && <th className="text-center">Edit</th>}
                            {/* <th>Status</th> */}
                          </tr>
                        </thead>
                        <tbody className="">
                          {loading ? (
                            <SkeletonTableLoader col={8} row={15} />
                          ) : (
                            <>
                              {
                                checkViewSidebar(
                                  "CallCenterAgent",
                                  slugPermissions,
                                  account?.permissions, "read") ? agents?.data?.length === 0 ?
                                  <tr>
                                    <td colSpan={99}>
                                      <EmptyPrompt
                                        name="Agent"
                                      />
                                    </td>
                                  </tr>
                                  : agents?.data?.map((item, index) => {
                                    return (
                                      <tr>
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
                                            <div className="ms-2">{item.name}</div>
                                          </div>
                                        </td>
                                        <td>{allDID?.filter((item) => item.default_outbound == 1)[0]?.did}</td>
                                        <td>{item.extension.extension}</td>
                                        <td>{item?.user_role?.roles?.name}</td>
                                        <td>{item.extension.record === "A" ? 'All' : item.extension.record === "L" ? 'Local' : item.extension.record === "I" ? 'Inbound' : item.extension.record === "O" ? 'Outbound' : 'Disabled'}</td>
                                        <td>
                                          <span
                                            className={
                                              onlineUsers.includes(item.id)
                                                ? "extensionStatus online"
                                                : "extensionStatus"
                                            }
                                          ></span>
                                        </td>
                                        {(checkViewSidebar(
                                          "CallCenterAgent",
                                          slugPermissions,
                                          account?.permissions, "edit")) && (onlineUsers.includes(item.id) && item.token != null) ?
                                          <td>
                                            <button
                                              className="tableButton delete"
                                              onClick={() => {
                                                setIsAgentLogoutPopup(true);
                                                setAgentLogOutToken(item.token);
                                              }}
                                            >
                                              <i className="fa-solid fa-power-off"></i>
                                            </button>
                                          </td> : <td></td>}
                                        {checkViewSidebar(
                                          "CallCenterAgent",
                                          slugPermissions,
                                          account?.permissions, "edit") && <td>
                                            <button
                                              className="tableButton edit mx-auto"
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
                            account?.permissions,"edit")&& <td>
                            <button
                              className="tableButton edit"
                              onClick={() => {
                                navigate(`/agents-edit?id=${item?.extension?.id}`, {
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
                                  }) : (
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
                                )
                              }
                            </>
                          )}
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
      {/* <ModalComponent task={"logout"} reference={"agent"} /> */}
      {isAgentLogoutPopup &&
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
                    Are you sure, you want to logout this agent?
                  </p>
                  <div className="mt-2 d-flex justify-content-between">
                    <button
                      className="panelButton m-0"
                      onClick={() => handleAgentLogout(true)}
                    >
                      <span className="text">Confirm</span>
                      <span className="icon">
                        <i className="fa-solid fa-check"></i>
                      </span>
                    </button>
                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => setIsAgentLogoutPopup(false)}
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
      }
    </main>
  );
}

export default Agents;
