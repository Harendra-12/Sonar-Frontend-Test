import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import { Link, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import CircularLoader from "../../Loader/CircularLoader";

function Agents({ type }) {
  const navigate = useNavigate();
  const logonUser = useSelector((state) => state.loginUser);
  const [agents, setAgents] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (logonUser && logonUser.length > 0) {
      setOnlineUsers(
        logonUser.map((item) => {
          return item.id;
        })
      );
    }
  }, [logonUser]);
  console.log(logonUser);
  useEffect(() => {
    const getData = async () => {
      setLoading(false);
      const apiData = await generalGetFunction(`/agents?usages=${type}`);
      if (apiData?.status) {
        console.log(apiData);
        setAgents(apiData.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    getData();
  }, []);

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
                            <i class="fa-solid fa-caret-left"></i>
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            navigate("/agents-add");
                            backToTop();
                          }}
                          className="panelButton"
                        >
                          <span className="text">Add</span>
                          <span className="icon">
                            <i class="fa-solid fa-plus"></i>
                          </span>
                        </button>
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
                        <select className="formItem">
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
                        />
                      </div>
                    </div>
                    <div className="tableContainer">
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Extension</th>
                            <th>Account ID</th>
                            {/* <th>Role</th> */}
                            {/* <th>Domain</th> */}
                            <th>Online</th>
                            <th>Edit</th>
                            {/* <th>Status</th> */}
                          </tr>
                        </thead>
                        <tbody className="">
                          {agents?.data?.map((item, index) => {
                            return (
                              <tr>
                                <td>{item.name}</td>
                                <td>{item.extension.extension}</td>
                                <td>{item.account_id}</td>
                                <td>
                                  <span
                                    className={
                                      onlineUsers.includes(item.id)
                                        ? "extensionStatus online"
                                        : "extensionStatus"
                                    }
                                  ></span>
                                </td>
                                <td>
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
                                </td>
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
                      // pageNumber={(e) => setPageNumber(e)}
                      // totalPage={extension.last_page}
                      // from={(pageNumber - 1) * extension.per_page + 1}
                      // to={extension.to}
                      // total={extension.total}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {loading && (
          <div colSpan={99}>
            <CircularLoader />
          </div>
        )}
      </section>
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
                                                <i class="fa-solid fa-check"></i>
                                            </span>
                                        </button>
                                        <button
                                            className="panelButton gray m-0 float-end"
                                           
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
            )} */}
    </main>
  );
}

export default Agents;
