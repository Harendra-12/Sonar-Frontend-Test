import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { Link, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalDeleteFunction,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import ContentLoader from "../../Loader/ContentLoader";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import PaginationComponent from "../../CommonComponents/PaginationComponent";

function CallCenterQueue() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [popUp, setPopUp] = useState(false);
  const [callCenter, setCallCenter] = useState();
  const [error, setError] = useState("");
  const [redirectRoutes, setRedirectRoutes] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(null);
  const [selectedCallCenter, setSelectedCallCenter] = useState(null);
  // const [deleteToggle, setDeleteToggle] = useState();
  const [deleteId, setDeleteId] = useState("");
  const allUser = useSelector((state) => state.allUser);
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const { data: usersData = [] } = allUser;
  // const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  // const callCenterState = useSelector((state) => state.callCenter);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    dispatch({
      type: "SET_ALLUSERREFRESH",
      allUserRefresh: allUserRefresh + 1,
    });

    const getCallCenterDashboardData = async () => {
      const apidata = await generalGetFunction(
        `/call-center-queues/dashboard?page=${pageNumber}`
      );
      if (apidata?.status) {
        setLoading(false);
        setCallCenter(apidata.data);
      } else {
        setLoading(false);
      }
    };
    getCallCenterDashboardData();
  }, [pageNumber]);

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
    if (apiData?.status) {
      setLoading(false);
      // setRefresh(refresh+1)
      const updatedCallCenter = callCenter.data.filter(
        (item) => item.id !== id
      );
      setCallCenter({ ...callCenter, data: updatedCallCenter });
      toast.success(apiData.message);
      setDeleteId("");
    } else {
      setLoading(false);
      // toast.error(apiData.error);
      setDeleteId("");
    }
  }

  const handleUpdateCallCenterStatus = async (id) => {
    setLoading(true);
    const payload = {
      ...selectedCallCenter,
      status: selectedCallCenter.status == 0 ? true : false,
      ...{
        agents: selectedCallCenter?.agents
          .map((item) => {
            // Call checkPrevDestination with the current item

            if (item.id.length > 0) {
              // Return the object with or without 'id' based on hasId
              return {
                agent_name: item.name,
                reserve_agents: item.reserve_agents,
                truncate_agents_on_load: item["truncate-agents-on-load"],
                truncate_tiers_on_load: item["truncate-tiers-on-load"],
                tier_level: item.level,
                call_timeout:
                  item.call_timeout === null ? null : Number(item.call_timeout),
                reject_delay_time:
                  item.reject_delay_time === null
                    ? null
                    : Number(item.reject_delay_time),
                max_no_answer:
                  item.max_no_answer === null
                    ? null
                    : Number(item.max_no_answer),
                no_answer_delay_time:
                  item.no_answer_delay_time === null
                    ? null
                    : Number(item.no_answer_delay_time),
                wrap_up_time:
                  item.wrap_up_time === null ? null : Number(item.wrap_up_time),
                busy_delay_time:
                  item.busy_delay_time === null
                    ? null
                    : Number(item.busy_delay_time),
                queue_timeout:
                  item.queue_timeout === null
                    ? null
                    : Number(item.queue_timeout),
                tier_position: item.position,
                type: item.type,
                // status: "Logged Out",
                password: item.password,
                contact: item.contact,
                id: item.id,
              };
            } else {
              return null;
            }
          })
          .filter((item) => item !== null),
      },
    };
    const apiData = await generalPutFunction(
      `/call-center-queue/update/${id}`,
      payload
    );
    if (apiData?.status) {
      setLoading(false);
      const updatedCallCenter = callCenter.data.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: item.status == 0 ? 1 : 0,
          };
        } else {
          return item;
        }
      });

      setCallCenter({
        ...callCenter,
        data: updatedCallCenter,
      });
      toast.success(apiData.message);
      setPopUp(false);
      setSelectedCallCenter(null);
    } else {
      setLoading(false);
    }
  };

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Call Center" />
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Call Center Queue</h4>
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
                            <i class="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        <Link
                          // to="/cal-center-queue-add"
                          // onClick={backToTop}
                          onClick={handleAddCallCenterValidation}
                          effect="ripple"
                          className="panelButton"
                        >
                          <span className="text">Add</span>
                          <span className="icon">
                            <i class="fa-solid fa-plus"></i>
                          </span>
                        </Link>
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
                          placeholder="Search"
                          className="formItem"
                        />
                      </div>
                    </div>
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
                            <th>Status</th>
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
                              {callCenter &&
                                callCenter.data.map((item) => {
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
                                      <td>
                                        <div className="my-auto position-relative mx-1">
                                          <label className="switch">
                                            <input
                                              type="checkbox"
                                              checked={item.status == 1}
                                              onClick={(e) => {
                                                setSelectedCallCenter(item);
                                                setPopUp(true);
                                              }}
                                              // {...register("status")}
                                              id="showAllCheck"
                                            />
                                            <span className="slider round" />
                                          </label>
                                        </div>
                                        {/* <button
                                          className="tableButton"
                                          onClick={() =>
                                            navigate(
                                              `/call-center-settings?id=${item.id}`
                                            )
                                          }
                                        >
                                          <i className="fa-duotone fa-gear"></i>
                                        </button> */}
                                      </td>
                                      <td>
                                        {" "}
                                        <button
                                          className="tableButton edit"
                                          onClick={() =>
                                            navigate(
                                              `/cal-center-queue-edit?id=${item.id}`
                                            )
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
                                            // setDeleteToggle(true);
                                            setDeleteId(item.id);
                                          }}
                                        >
                                          <i class="fa-solid fa-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              {callCenter && callCenter.data.length === 0 ? (
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
                    <div className="tableHeader mb-3">
                      {callCenter && callCenter?.data?.length > 0 ? (
                        <PaginationComponent
                          pageNumber={(e) => setPageNumber(e)}
                          totalPage={callCenter.totalPage}
                          from={callCenter.from}
                          to={callCenter.to}
                          total={callCenter.total}
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
                    {selectedCallCenter?.id &&
                      `Are you sure you want to ${
                        selectedCallCenter?.status == 1 ? "disable" : "enable"
                      } the queue ${selectedCallCenter?.queue_name}?`}
                  </p>
                  <div className="mt-2 d-flex justify-content-between">
                    {deleteId == "" ? (
                      <button
                        disabled={loading}
                        className="panelButton m-0"
                        onClick={() => {
                          if (selectedCallCenter?.id) {
                            handleUpdateCallCenterStatus(
                              selectedCallCenter?.id
                            );
                          } else {
                            setPopUp(false);
                            navigate(`${redirectRoutes}`);
                          }
                        }}
                      >
                        <span className="text">Confirm</span>
                        <span className="icon">
                          <i class="fa-solid fa-check"></i>
                        </span>
                      </button>
                    ) : (
                      <button
                        className="panelButton m-0"
                        onClick={() => handleDelete(deleteId)}
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
                        setSelectedCallCenter(null);
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
}

export default CallCenterQueue;
