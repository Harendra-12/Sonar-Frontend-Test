import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import ThreeDotedLoader from "../../Loader/ThreeDotedLoader";
import Tippy from "@tippyjs/react";
import "../../assets/css/components/aiAgent.css";
import {
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { set } from "date-fns";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import { toast } from "react-toastify";

const AllUser = () => {
  const [refreshState, setRefreshState] = useState(false);
  const [updatePopup, setUpdatePopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [newKey, setNewKey] = useState("");
  const [refreshData, setRefreshData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allUser, setAllUser] = useState([]);

  const handleRefreshBtnClicked = () => {
    setRefreshState(true);
  };

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const apiData = await generalGetFunction("/ai/all");
      if (apiData.status) {
        setLoading(false);
        setAllUser(apiData.data);
      } else {
        setLoading(false);
        toast.error(apiData.message);
      }
    }
    getData();
  }, [refreshData]);

  async function UpdateKey() {
    setUpdatePopup(false);
    setLoading(true);
    if (!newKey || newKey.trim() === "") {
      toast.error("Please enter a valid key");
      setLoading(false);
      return;
    }
    const parsedData = {
      email: selectedUser?.email,
      retail_api_key: newKey,
    };
    const apiData = await generalPostFunction("/ai/update", parsedData);
    if (apiData.status) {
      toast.success(apiData.message);
      setRefreshData(refreshData + 1);
    } else {
      toast.error(apiData.message);
      setLoading(false);
    }
  }

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="All Users" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>
                            All Users{" "}
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
                          <p>You can manage your users here</p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-12"
                      style={{ overflow: "auto", padding: "10px 20px 0" }}
                    >
                      <div className="tableContainer">
                        <table>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Username</th>
                              <th>Email</th>
                              <th>Key</th>
                              <th>Update key</th>
                            </tr>
                          </thead>
                          <tbody className="">
                            <>
                              {loading ? (
                                <SkeletonTableLoader col={5} row={15} />
                              ) : allUser?.length === 0 ? (
                                <tr>
                                  <td colSpan="5" className="text-center">
                                    No users found
                                  </td>
                                </tr>
                              ) : (
                                allUser?.map((item, index) => (
                                  <tr key={index}>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <div className="tableProfilePicHolder">
                                          <i className="fa-light fa-user" />
                                          {/* )} */}
                                        </div>
                                        <div className="ms-2">{item.full_name}</div>
                                      </div>
                                    </td>
                                    <td>{item.username}</td>
                                    <td>{item.email}</td>
                                    <td>{item.retail_api_key}</td>
                                    <td>
                                      <div className="dropdown">
                                        <button
                                          className="panelButton static"
                                          role="button"
                                          onClick={() => {setUpdatePopup(true); setSelectedUser(item);setNewKey(item.retail_api_key);}}
                                        >
                                          Update
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {updatePopup && (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="row content col-xl-4 col-md-5">
                <div className="col-12">
                  <div className="iconWrapper">
                    <i className="fa-duotone fa-circle-exclamation text-danger"></i>
                  </div>
                </div>
                <div className="col-12">
                  <h4 className="text-center text-danger">Update Key!</h4>
                  <div className="formRow border-0 p-0 gap-2">
                    <div className="d-flex w-100">
                      <input
                        type="text"
                        className="formItem"
                        placeholder="Enter key here"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-center gap-2 mt-4">
                    <button className="panelButton m-0" onClick={UpdateKey}>
                      <span className="text">Update</span>
                      <span className="icon">
                        <i className="fa-solid fa-check"></i>
                      </span>
                    </button>
                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setUpdatePopup(false);
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
      )}
    </>
  );
};

export default AllUser;
