import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalDeleteFunction,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import ContentLoader from "../../Loader/ContentLoader";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import Header from "../../CommonComponents/Header";
import { toast } from "react-toastify";
import PaginationComponent from "../../CommonComponents/PaginationComponent";

const RingGroups = () => {
  const [ringGroup, setRingGroup] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [popUp, setPopUp] = useState(false);
  const account = useSelector((state) => state.account);
  const allUser = useSelector((state) => state.allUser);
  const [error, setError] = useState("");
  const [redirectRoutes, setRedirectRoutes] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRingGroup, setSelectedRingGroup] = useState(null);
  // const [deleteToggle, setDeleteToggle] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const { data: usersData = [] } = allUser;
  const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
  const ringGroupState = useSelector((state) => state.ringGroup);

  useEffect(() => {
    dispatch({
      type: "SET_ALLUSERREFRESH",
      allUserRefresh: allUserRefresh + 1,
    });

    if (ringGroupRefresh > 0) {
      setLoading(false);
      setRingGroup(ringGroupState);
      if (account && account.id) {
        async function getData() {
          //Add query for items per page - itemsPerPage
          const apidata = await generalGetFunction(
            `/ringgroup?account=${account.account_id}`
          );
          if (apidata?.status) {
            setRingGroup(apidata.data);
          } else {
            navigate("/");
          }
        }
        getData();
      } else {
        navigate("/");
      }
    } else {
      if (account && account.id) {
        async function getData() {
          const apidata = await generalGetFunction(
            `/ringgroup?account=${account.account_id}`
          );
          if (apidata?.status) {
            setRingGroup(apidata.data);
            setLoading(false);
          } else {
            navigate("/");
          }
        }
        getData();
      } else {
        navigate("/");
      }
      dispatch({
        type: "SET_RINGGROUPREFRESH",
        ringGroupRefresh: ringGroupRefresh + 1,
      });
    }
  }, []);

  const handleRingGroupAddValidation = (e) => {
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

    navigate("/ring-groups-add");
    backToTop();
  };

  async function handleDelete(id) {
    setPopUp(false);
    setLoading(true);
    const apiData = await generalDeleteFunction(`/ringgroup/${id}`);
    if (apiData?.status) {
      const newArray = ringGroup.filter((item) => item.id !== id);
      setRingGroup(newArray);
      setLoading(false);
      toast.success(apiData.message);

      setDeleteId("");
    } else {
      setLoading(false);
      // toast.error(apiData.error);
      setDeleteId("");
    }
  }

  const handleUpdateStatusRingGroup = async (id) => {
    setLoading(true);

    const payLoad = {
      ...selectedRingGroup,
      ...{
        account_id: account.account_id,
        status: selectedRingGroup.status == "active" ? "inactive" : "active",
        destination: selectedRingGroup.ring_group_destination
          .map((item) => {
            if (item.destination.length > 0) {
              return {
                destination: item.destination,
                delay_order: item.delay_order,
                destination_timeout: item.destination_timeout,
                status: item.status,
                created_by: account.account_id,
                id: item.id,
              };
            } else {
              return null;
            }
          })
          .filter((item) => item !== null),
      },
    };
    delete payLoad.ring_group_destination;
    delete payLoad.ring_group_timeout_data;
    delete payLoad.ring_group_timeout_app;

    const apiData = await generalPutFunction(`/ringgroup/${id}`, payLoad);

    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message);
      const ringGroupData = [...ringGroupState];
      const updatedRingGroupState = ringGroupData.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status:
              selectedRingGroup.status === "active" ? "inactive" : "active",
          };
        }
        return item;
      });
      //updating on global state
      dispatch({
        type: "SET_RINGGROUP",
        ringGroup: updatedRingGroupState,
      });
      //updating on local state
      setRingGroup(updatedRingGroupState);

      setSelectedRingGroup(null);
      setPopUp(false);
    } else {
      setLoading(false);
    }
  };

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Ring Groups" />
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Ring Group List</h4>
                        <p>You can see all list of ring groups</p>
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
                          // to="/ring-groups-add"
                          // onClick={backToTop}
                          onClick={handleRingGroupAddValidation}
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
                      <div className="searchBox">
                        <label>Search:</label>
                        <input type="search" className="formItem" />
                      </div>
                    </div>
                    <div className="tableContainer">
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Extension</th>
                            <th>Strategy</th>
                            <th>Members</th>
                            <th>Phone Numbers</th>
                            <th>Status</th>
                            <th>Description</th>
                            {/* <th>Setting</th>
                            <th>Edit</th>
                            <th>Delete</th> */}
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
                              {ringGroup &&
                                ringGroup.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td
                                        onClick={() =>
                                          navigate(
                                            `/ring-groups-edit?id=${item.id}`
                                          )
                                        }
                                      >
                                        {item.name}
                                      </td>
                                      <td
                                        onClick={() =>
                                          navigate(
                                            `/ring-groups-edit?id=${item.id}`
                                          )
                                        }
                                      >
                                        {item.extension}
                                      </td>
                                      <td
                                        onClick={() =>
                                          navigate(
                                            `/ring-groups-edit?id=${item.id}`
                                          )
                                        }
                                      >
                                        {item.strategy}
                                      </td>
                                      <td
                                        onClick={() =>
                                          navigate(
                                            `/ring-groups-edit?id=${item.id}`
                                          )
                                        }
                                      >
                                        {item.ring_group_destination.map(
                                          (item, index, array) => (
                                            <span>
                                              {item.destination}
                                              {index < array.length - 1
                                                ? ", "
                                                : ""}
                                            </span>
                                          )
                                        )}
                                      </td>
                                      <td>(999) 999-9999, (999) 999-9999</td>
                                      <td>
                                        <div className="my-auto position-relative mx-1">
                                          <label className="switch">
                                            <input
                                              type="checkbox"
                                              checked={item.status == "active"}
                                              onClick={(e) => {
                                                setSelectedRingGroup(item);
                                                setPopUp(true);
                                              }}
                                              // {...register("status")}
                                              id="showAllCheck"
                                            />
                                            <span className="slider round" />
                                          </label>
                                        </div>
                                      </td>
                                      <td
                                        onClick={() =>
                                          navigate(
                                            `/ring-groups-edit?id=${item.id}`
                                          )
                                        }
                                        className="ellipsis"
                                        id="detailBox"
                                      >
                                        {item.description}
                                      </td>
                                      <div className="utilPopup">
                                        <button
                                          onClick={() =>
                                            navigate(
                                              `/ring-groups-settings?id=${item.id}`
                                            )
                                          }
                                        >
                                          <i className="fa-light fa-gear" />
                                        </button>
                                        <button
                                          onClick={() =>
                                            navigate(
                                              `/ring-groups-edit?id=${item.id}`
                                            )
                                          }
                                        >
                                          <i className="fa-light fa-pencil" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            setPopUp(true);
                                            setDeleteId(item.id);
                                          }}
                                        >
                                          <i className="fa-light fa-trash" />
                                        </button>
                                      </div>
                                    </tr>
                                  );
                                })}
                              {ringGroup && ringGroup.length === 0 ? (
                                <td colSpan={99}>
                                  <EmptyPrompt
                                    name="Ring Group"
                                    link="ring-groups-add"
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
                      {ringGroup && ringGroup.length > 0 ? (
                        //Need to implement pagination in api (Backend)
                        <PaginationComponent

                        // pageNumber={(e) => setPageNumber(e)}
                        // totalPage={user.last_page}
                        // from={(pageNumber - 1) * user.per_page + 1}
                        // to={user.to - 1} // -1 because customeradmin user is removed form the list
                        // total={user.total - 1} // -1 because customeradmin user is removed form the list
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
                      : "Are you sure you want to delete this ring group?"}
                    {selectedRingGroup?.id && (
                      <p>
                        Are you sure you want to{" "}
                        {selectedRingGroup.status == "active"
                          ? "deactivate"
                          : "activate"}{" "}
                        this ring group?
                      </p>
                    )}
                  </p>
                  <div className="d-flex justify-content-between">
                    {deleteId !== "" || selectedRingGroup.id ? (
                      <button
                        disabled={loading}
                        className="panelButton m-0"
                        onClick={() => {
                          if (deleteId !== "") handleDelete(deleteId);
                          else if (selectedRingGroup.id)
                            handleUpdateStatusRingGroup(selectedRingGroup.id);
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
                        onClick={() => {
                          // setForce(true);
                          setPopUp(false);
                          navigate(`${redirectRoutes}`);
                        }}
                      >
                        <span className="text">Lets Go!</span>
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
                        setSelectedRingGroup({});
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

export default RingGroups;
