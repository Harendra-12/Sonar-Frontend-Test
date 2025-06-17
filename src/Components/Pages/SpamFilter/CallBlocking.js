/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  checkViewSidebar,
  generalDeleteFunction,
  generalGetFunction,
  generalPostFunction,
  useDebounce,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import Header from "../../CommonComponents/Header";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import { toast } from "react-toastify";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import ThreeDotedLoader from "../../Loader/ThreeDotedLoader";

const CallBlocking = () => {
  const [callBlock, setCallBlock] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [popUp, setPopUp] = useState(false);
  const account = useSelector((state) => state.account);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteId, setDeleteId] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [type, setType] = useState("");
  const [number, setNumber] = useState("");
  const [deletePopup, setDeletePopup] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchTerm = useDebounce(searchValue, 1000);
  const [refreshState, setRefreshState] = useState(false);
  const slugPermissions = useSelector((state) => state?.permissions);


  const getRingGroupDashboardData = async (shouldLoad) => {
    if (account && account.id) {
      if (shouldLoad) setLoading(true);
      const apidata = await generalGetFunction(
        `/spam/all?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${searchValue}`
      );
      if (apidata?.status) {
        setCallBlock(apidata.data);
        setLoading(false);
        setRefreshState(false)
      } else {
        navigate("/");
        setRefreshState(false)
      }
    } else {
      navigate("/");
      setRefreshState(false)
    }
  };

  useEffect(() => {
    setRefreshState(true)
    const shouldLoad = true;
    getRingGroupDashboardData(shouldLoad);
  }, [pageNumber, itemsPerPage, debouncedSearchTerm])

  // Add number to block list
  async function addBlock() {
    if (type === "") {
      toast.error("Please enter type");
    } else if (number === "") {
      toast.error("Please enter number");
    } else if (number < 99999999 || number > 99999999999999) {
      toast.error("Please enter valid number");
    } else {
      setPopUp(false);
      setLoading(true);
      const parsedData = {
        type: type,
        number: number,
      };
      const apidata = await generalPostFunction(`/spam/store`, parsedData);
      if (apidata.status) {
        setLoading(false);
        setType("");
        setNumber("");
        setCallBlock([...callBlock, apidata.data]);
        toast.success("Number added to block list");
      } else {
        setLoading(false);
      }
    }
  }

  async function handleDelete(id) {
    setDeletePopup(false);
    setLoading(true);
    const apidata = await generalDeleteFunction(`/spam/destroy/${id}`);
    if (apidata.status) {
      setLoading(false);
      const newList = callBlock.data.filter((item) => item.id !== id);
      setCallBlock({ ...callBlock, data: newList });
      setDeleteId("");
      toast.success("Number removed from block list");
    } else {
      setLoading(false);
    }
  }

  const handleRefreshBtnClicked = () => {
    setRefreshState(true)
    const shouldLoad = false;
    getRingGroupDashboardData(shouldLoad);
  }

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Block List" />
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Block List {" "}
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
                        <p>You can see all list of blocked numbers</p>
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
                          "Spam",
                          slugPermissions,
                          account?.sectionPermissions,
                          account?.permissions,
                          "add"
                        ) &&
                          <div
                            effect="ripple"
                            className="panelButton"
                            onClick={() => navigate("/call-blocking-add")}
                          >
                            <span className="text">Add</span>
                            <span className="icon">
                              <i className="fa-solid fa-plus"></i>
                            </span>
                          </div>
                        }
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

                      {checkViewSidebar(
                        "Spam",
                        slugPermissions,
                        account?.sectionPermissions,
                        account?.permissions,
                        "search"
                      ) &&
                        <div className="searchBox">
                          <label>Search:</label>
                          <input
                            type="search"
                            className="formItem"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                          />
                        </div>
                      }
                    </div>
                    <div className="tableContainer">
                      {loading ? (
                        // <SkeletonTableLoader col={3} row={15} />
                        <ThreeDotedLoader />
                      ) :
                        <table>
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Number</th>
                              {checkViewSidebar("Spam", slugPermissions, account?.sectionPermissions, account?.permissions, "delete") && <th>Remove</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {!checkViewSidebar(
                              "callBlocking",
                              slugPermissions,
                              account?.sectionPermissions,
                              account?.permissions,
                              "read"
                            ) ? <tr><td colSpan={99}>You dont have any permission</td></tr>
                              : (
                                <>
                                  {callBlock &&
                                    callBlock.data?.map((item, index) => {
                                      return (
                                        <tr key={index}>
                                          <td>{item.type}</td>
                                          <td>{item.number}</td>
                                          {checkViewSidebar(
                                            "Spam",
                                            slugPermissions,
                                            account?.sectionPermissions,
                                            account?.permissions,
                                            "delete"
                                          ) &&
                                            <td>
                                              <button
                                                className="tableButton delete"
                                                onClick={() => {
                                                  // handleDelete(item.id)
                                                  setDeletePopup(true);
                                                  setDeleteId(item.id);
                                                }}
                                              >
                                                <i className="fa-solid fa-trash"></i>
                                              </button>
                                            </td>
                                          }
                                        </tr>
                                      );
                                    })}
                                  {callBlock && callBlock.length === 0 ? (
                                    <td colSpan={99}>
                                      <EmptyPrompt
                                        name="Call Blocking"
                                        link="call-blocking"
                                      />
                                    </td>
                                  ) : (
                                    ""
                                  )}
                                </>
                              )}
                          </tbody>
                        </table>
                      }
                    </div>
                    <div className="tableHeader mb-3">
                      {callBlock && callBlock?.data?.length > 0 ? (
                        <PaginationComponent
                          pageNumber={(e) => setPageNumber(e)}
                          totalPage={callBlock.last_page}
                          from={callBlock.from}
                          to={callBlock.to}
                          total={callBlock.total}
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
        <div className="backdropContact">
          <div className="addNewContactPopup">
            <div className="row">
              <div className="col-12 heading">
                <i className="fa-light fa-user-plus"></i>
                <h5>Add number to block Lists</h5>
                <p>
                  Add number to block Lists so that it will not able to call you
                </p>
                <div className="border-bottom col-12" />
              </div>
              <div className="col-xl-12">
                <div className="formLabel">
                  <label htmlFor="">Type</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    className="formItem"
                    placeholder="DID/PSTN..."
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-xl-12 mt-3">
                <div className="formLabel">
                  <label htmlFor="">Number</label>
                </div>
                <div className="col-12">
                  <input
                    type="number"
                    className="formItem"
                    placeholder="Number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-xl-12 mt-4">
                <div className="d-flex justify-content-between">
                  <button
                    disabled={loading}
                    className="panelButton gray ms-0"
                    onClick={() => setPopUp(false)}
                  >
                    <span className="text">Cancel</span>
                    <span className="icon">
                      <i className="fa-solid fa-caret-left"></i>
                    </span>
                  </button>
                  <button className="panelButton me-0" onClick={addBlock}>
                    <span className="text">Save</span>
                    <span className="icon">
                      <i className="fa-solid fa-check"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {deletePopup ? (
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
                    Are you sure you want to remove this Contact from block
                    list?
                  </p>
                  <div className="mt-2 d-flex justify-content-between">
                    <button
                      className="panelButton m-0"
                      onClick={() => handleDelete(deleteId)}
                    >
                      <span className="text">Confirm</span>
                      <span className="icon">
                        <i className="fa-solid fa-check"></i>
                      </span>
                    </button>

                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setDeletePopup(false);
                        setDeleteId(null);
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
  );
};

export default CallBlocking;
