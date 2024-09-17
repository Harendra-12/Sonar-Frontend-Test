import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { Link, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalDeleteFunction,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import ContentLoader from "../../Loader/ContentLoader";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import EmptyPrompt from "../../Loader/EmptyPrompt";

function CallCenterQueue() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [popUp, setPopUp] = useState(false);
  const [callCenter, setCallCenter] = useState();
  const [error, setError] = useState("");
  const [redirectRoutes, setRedirectRoutes] = useState("");
  // const [deleteToggle, setDeleteToggle] = useState();
  const [deleteId, setDeleteId] = useState("");
  const allUser = useSelector((state) => state.allUser);
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const { data: usersData = [] } = allUser;
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const callCenterState = useSelector((state) => state.callCenter);

  useEffect(() => {
    dispatch({
      type: "SET_ALLUSERREFRESH",
      allUserRefresh: allUserRefresh + 1,
    });

    if (callCenterRefresh > 0) {
      setCallCenter(callCenterState);
      setLoading(false);
      async function getData() {
        const apiData = await generalGetFunction("/call-center-queues");
        if (apiData.status) {
          setLoading(false);
          setCallCenter(apiData.data);
        } else {
          setLoading(false);
        }
      }
      getData();
    } else {
      async function getData() {
        const apiData = await generalGetFunction("/call-center-queues");
        if (apiData.status) {
          setLoading(false);
          setCallCenter(apiData.data);
        } else {
          setLoading(false);
        }
      }
      dispatch({
        type: "SET_CALLCENTERREFRESH",
        callCenterRefresh: callCenterRefresh + 1,
      });
      getData();
      dispatch({
        type: "SET_CALLCENTERREFRESH",
        callCenterRefresh: callCenterRefresh + 1,
      });
    }
  }, []);

  const handleAddCallCenterValidation = (e) => {
    e.preventDefault();

    if (usersData.length === 0) {
      setPopUp(true);
      setError("Please add users to create a queue");
      setRedirectRoutes("/users");
      return;
    }

    const hasExtension = usersData.some((item) => item.extension_id);

    if (!hasExtension) {
      setPopUp(true);
      setError("Please add an extension to the users to create a queue");
      setRedirectRoutes("/extensions");
      return;
    }

    navigate("/cal-center-queue-add");
    backToTop();
  };

  async function handleDelete(id) {
    setLoading(true);
    setPopUp(false);
    const apiData = await generalDeleteFunction(
      `/call-center-queue/destroy/${id}`
    );
    if (apiData.status) {
      setLoading(false);
      // setRefresh(refresh+1)
      const updatedCallCenter = callCenter.filter((item) => item.id !== id);
      setCallCenter(updatedCallCenter);
      toast.success(apiData.message);
      setDeleteId("");
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
            <Header title="Call Center" />
            <div
              className="d-flex flex-wrap px-xl-3 py-2 position-relative"
              style={{ zIndex: 1 }}
              id="detailsHeader"
            >
              <div className="col-xl-4 my-auto">
                <div className="position-relative searchBox">
                  <input
                    type="search"
                    name="Search"
                    id="headerSearch"
                    placeholder="Search"
                  />
                </div>
              </div>
              <div className="col-xl-8 pt-3 pt-xl-0">
                <div className="d-flex justify-content-end">
                  <Link
                    // to="/cal-center-queue-add"
                    // onClick={backToTop}
                    onClick={handleAddCallCenterValidation}
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
            <div
              className="col-12"
              style={{ overflow: "auto", position: "relative" }}
            >
              <div className="tableContainer">
                <table>
                  <thead>
                    <tr>
                      <th>Queue Name</th>
                      <th>Extension</th>
                      <th>Strategy</th>
                      <th>Timeout Action</th>
                      <th>Prefix</th>
                      <th>Total Agents</th>
                      <th>Settings</th>
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
                        {callCenter &&
                          callCenter.map((item) => {
                            return (
                              <tr>
                                <td
                                  onClick={() =>
                                    navigate(
                                      `/cal-center-queue-edit?id=${item.id}`
                                    )
                                  }
                                >
                                  {item.queue_name}
                                </td>
                                <td
                                  onClick={() =>
                                    navigate(
                                      `/cal-center-queue-edit?id=${item.id}`
                                    )
                                  }
                                >
                                  {item.extension}
                                </td>
                                <td
                                  onClick={() =>
                                    navigate(
                                      `/cal-center-queue-edit?id=${item.id}`
                                    )
                                  }
                                >
                                  {item.strategy}
                                </td>
                                <td
                                  onClick={() =>
                                    navigate(
                                      `/cal-center-queue-edit?id=${item.id}`
                                    )
                                  }
                                >
                                  {item.queue_timeout_action}
                                </td>
                                <td
                                  onClick={() =>
                                    navigate(
                                      `/cal-center-queue-edit?id=${item.id}`
                                    )
                                  }
                                >
                                  {item.queue_cid_prefix}
                                </td>
                                <td
                                  onClick={() =>
                                    navigate(
                                      `/cal-center-queue-edit?id=${item.id}`
                                    )
                                  }
                                >
                                  {item.agents.length}
                                </td>
                                <td
                                  onClick={() =>
                                    navigate(
                                      `/call-center-settings?id=${item.id}`
                                    )
                                  }
                                >
                                  <i className="fa-duotone fa-gear text-success"></i>
                                </td>
                                <td
                                  // onClick={() => handleDelete(item.id)}
                                  onClick={() => {
                                    setPopUp(true);
                                    // setDeleteToggle(true);
                                    setDeleteId(item.id);
                                  }}
                                >
                                  <label className="tableLabel fail">
                                    Delete
                                  </label>
                                </td>
                              </tr>
                            );
                          })}
                        {callCenter && callCenter.length === 0 ? (
                          <td colSpan={99}>
                            <EmptyPrompt
                              name="Call Center"
                              link="cal-center-queue-add"
                            />
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
            <div className="sidePannel d-none">
              <div className="wrapper">
                <ul className="label">
                  <li>
                    Agent <span className="float-end">Status</span>
                  </li>
                </ul>
                <ul>
                  <li>
                    Name243 <span className="extensionStatus"></span>
                  </li>
                  <li>
                    Name <span className="extensionStatus"></span>
                  </li>
                </ul>
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
                    {deleteId == ""
                      ? error
                      : "Are you sure you want to delete this queue?"}
                  </p>
                  {deleteId == "" ? (
                    <button
                      className="panelButton m-0"
                      onClick={() => {
                        setPopUp(false);
                        navigate(`${redirectRoutes}`);
                      }}
                    >
                      Lets Go!
                    </button>
                  ) : (
                    <button
                      className="panelButton m-0"
                      onClick={() => handleDelete(deleteId)}
                    >
                      Confirm
                    </button>
                  )}

                  <button
                    className="panelButtonWhite m-0 float-end"
                    onClick={() => {
                      setPopUp(false);
                      setDeleteId("");
                    }}
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
}

export default CallCenterQueue;
