/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  backToTop,
  checkViewSidebar,
  generalDeleteFunction,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import Header from "../../CommonComponents/Header";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";

const IvrListing = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const [ivr, setIvr] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [popUp, setPopUp] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const ivrRefresh = useSelector((state) => state.ivrRefresh);
  const ivrArr = useSelector((state) => state.ivr);
  const [refreshState, setRefreshState] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [userInput, setuserInput] = useState("");
  const slugPermissions = useSelector((state) => state?.permissions);
  useEffect(() => {
    async function getData() {
      setLoading(true);
      const apiData = await generalGetFunction(
        `/ivr-master/all?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${userInput}`
      );
      if (apiData.status) {
        setIvr(apiData.data);
        setLoading(false);
        setRefreshState(false);
      } else {
        setRefreshState(false);
        setLoading(false);
      }
    }
    if (userInput.trim().length === 0) {
      getData();
    } else {
      const timer = setTimeout(() => {
        getData();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [ivrArr, refreshState, itemsPerPage, pageNumber, userInput]);

  async function handleDelete(id) {
    setPopUp(false);
    setLoading(true);
    const apiData = await generalDeleteFunction(`/ivr-master/destroy/${id}`);
    if (apiData.status) {
      const newArray = ivr.filter((item) => item.id !== id);
      setIvr(newArray);
      setLoading(false);
      toast.success(apiData.message);
      setDeleteId("");
      // after succesfully deleting data need to recall the global function to update the global state
      dispatch({
        type: "SET_IVRREFRESH",
        ivrRefresh: ivrRefresh + 1,
      });
    } else {
      setLoading(false);
      toast.error(apiData.error);
      setDeleteId("");
    }
  }
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="IVR Master" />

            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>
                          IVR Master
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
                        {checkViewSidebar(
                          "IvrMaster",
                          slugPermissions,
                          account?.permissions, "add"
                        ) ? (
                          <Link
                            to="/ivr-add"
                            onClick={backToTop}
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
                            type="button"
                            className="panelButton disabled"
                            disabled
                            title="You do not have permission to add"
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
                  <div className="col-12" style={{ padding: "25px 20px 0" }}>
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
                            <th>Name</th>
                            <th>Type</th>
                            <th>Confirm Attempts</th>
                            <th>Timeout</th>
                            <th>Max Failures</th>
                            <th>Options</th>
                            <th>Edit</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <SkeletonTableLoader col={8} row={15} />
                          ) : (
                            <>
                              {ivr &&
                                ivr.data.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td
                                        onClick={() =>
                                          navigate(`/ivr-edit`, {
                                            state: item.id,
                                          })
                                        }
                                      >
                                        {item.ivr_name}
                                      </td>
                                      <td
                                        onClick={() =>
                                          navigate(`/ivr-edit`, {
                                            state: item.id,
                                          })
                                        }
                                      >
                                        {item.ivr_type == "0"
                                          ? "Child"
                                          : "Master"}
                                      </td>
                                      <td
                                        onClick={() =>
                                          navigate(`/ivr-edit`, {
                                            state: item.id,
                                          })
                                        }
                                      >
                                        {item.confirm_attempts}
                                      </td>
                                      <td
                                        onClick={() =>
                                          navigate(`/ivr-edit`, {
                                            state: item.id,
                                          })
                                        }
                                      >
                                        {item.timeout}
                                      </td>
                                      <td
                                        onClick={() =>
                                          navigate(`/ivr-edit`, {
                                            state: item.id,
                                          })
                                        }
                                      >
                                        {item.max_failures}
                                      </td>
                                      <td>
                                        <button
                                          onClick={() =>
                                            navigate(`/ivr-options`, {
                                              state: {
                                                id: item.id,
                                                name: item.ivr_name,
                                              },
                                            })
                                          }
                                          className="tableButton"
                                        >
                                          <i className="fa-duotone fa-gear text-success"></i>
                                        </button>
                                      </td>
                                      <td>
                                        {" "}
                                        <button
                                          className="tableButton edit"
                                          onClick={() =>
                                            navigate(`/ivr-edit`, {
                                              state: item.id,
                                            })
                                          }
                                        >
                                          <i className="fa-solid fa-pencil"></i>
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
                                          <i className="fa-solid fa-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              {ivr && ivr.length === 0 ? (
                                <td colSpan={99}>
                                  <EmptyPrompt name="IVR " link="ivr-add" />
                                </td>
                              ) : (
                                ""
                              )}
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="tableHeader mb-3">
                      {ivr && ivr.data?.length > 0 ? (
                        <PaginationComponent
                          pageNumber={(e) => setPageNumber(e)}
                          totalPage={ivr.last_page}
                          from={(pageNumber - 1) * ivr.per_page + 1}
                          to={ivr.to - 1} // -1 because customeradmin user is removed form the list
                          total={ivr.total - 1} // -1 because customeradmin user is removed form the list
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
                  <p>Are you sure you want to delete this IVR?</p>
                  <div className="d-flex justify-content-between">
                    {deleteId !== "" ? (
                      <button
                        className="panelButton m-0"
                        onClick={() => handleDelete(deleteId)}
                      >
                        <span className="text">Confirm</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                    ) : (

                      <button
                        className="panelButton gray m-0 float-end"
                        onClick={() => {
                          setPopUp(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    )}
                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setPopUp(false);
                        setDeleteId("");
                        // setDeleteToggle(false);
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

export default IvrListing;
