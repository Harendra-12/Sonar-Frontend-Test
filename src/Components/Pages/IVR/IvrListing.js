import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  backToTop,
  featureUnderdevelopment,
  generalDeleteFunction,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import ContentLoader from "../../Loader/ContentLoader";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import Header from "../../CommonComponents/Header";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

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
  const loadings = useSelector;
  const [refreshState, setRefreshState] = useState(false);
  const [noPermissionToRead, setNoPermissionToRead] = useState(false);
  useEffect(() => {
    // async function getData() {
    //   const apiData = await generalGetFunction("/ivr-master/all");
    //   if (apiData.status) {
    //     setIvr(apiData.data);
    //     setLoading(false);
    //   } else {
    //     setLoading(false);
    //   }
    // }
    // getData();
    setLoading(true);
    if (ivrArr && !refreshState) {
      setIvr(ivrArr);
      setLoading(false);
      setRefreshState(false);
    } else {
      dispatch({
        type: "SET_IVRREFRESH",
        ivrRefresh: ivrRefresh + 1,
      });
      setRefreshState(false);
      setLoading(true);
    }
  }, [ivrArr, refreshState]);

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
                        <h4>IVR Master</h4>
                      </div>
                      <div className="buttonGroup">
                        <button
                          effect="ripple"
                          className="panelButton"
                          onClick={() => setRefreshState(true)}
                        >
                          <span className="text">Refresh</span>
                          <span className="icon">
                            <i
                              class={
                                loading
                                  ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                  : "fa-regular fa-arrows-rotate fs-5"
                              }
                            ></i>
                          </span>
                        </button>
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
                        {account?.permissions?.includes(232) ? (
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
                  <div
                    className="col-12"
                    style={{  padding: "25px 20px 0" }}
                  >
                    <div className="tableHeader">
                      <div className="showEntries">
                        <label>Show</label>
                        <select className="formItem">
                          <option value={10}>Max</option>
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
                          onChange={() => featureUnderdevelopment()}
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
                            <tr>
                              <td colSpan={99}>
                                <ContentLoader />
                              </td>
                            </tr>
                          ) : (
                            <>
                              {ivr &&
                                ivr.map((item, index) => {
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
                                          <i class="fa-solid fa-pencil"></i>
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
                  <p>Are you sure you want to delete this IVR?</p>
                  <div className="d-flex justify-content-between">
                    {deleteId !== "" ? (
                      <button
                        className="panelButton m-0"
                        onClick={() => handleDelete(deleteId)}
                      >
                        <span className="text">Confirm</span>
                        <span className="icon">
                          <i class="fa-solid fa-check"></i>
                        </span>
                      </button>
                    ) : (
                      <button
                        className="panelButton m-0"
                        onClick={() => {
                          setPopUp(false);
                        }}
                      >
                        <span className="text">Confirm</span>
                        <span className="icon">
                          <i class="fa-solid fa-check"></i>
                        </span>
                      </button>
                    )}

                    <button
                      className="panelButtonWhite m-0 float-end"
                      onClick={() => {
                        setPopUp(false);
                        setDeleteId("");
                        // setDeleteToggle(false);
                      }}
                    >
                      Cancel
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
