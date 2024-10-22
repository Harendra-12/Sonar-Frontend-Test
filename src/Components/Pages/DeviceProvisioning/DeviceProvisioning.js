import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { Link, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalDeleteFunction,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import ContentLoader from "../../Loader/ContentLoader";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const DeviceProvisioning = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [provisioningData, setProvisioningData] = useState();
  const [popUp, setPopUp] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const deviceProvisioning = useSelector((state) => state.deviceProvisioning);
  const deviceProvisioningRefresh = useSelector(
    (state) => state.deviceProvisioningRefresh
  );

  useEffect(() => {
    // setLoading(true);
    // const apiData = async () => {
    //   const apiData = await generalGetFunction("/provision/all");
    //   if (apiData?.status) {
    //     setLoading(false);
    //     setProvisioningData(apiData.data);
    //   } else {
    //     setLoading(false);
    //   }
    // };
    // apiData();
    setLoading(true);
    if (deviceProvisioningRefresh > 0) {
      setProvisioningData(deviceProvisioning);
      setLoading(false);
    } else {
      dispatch({
        type: "SET_DEVICE_PROVISIONINGREFRESH",
        deviceProvisioningRefresh: deviceProvisioningRefresh + 1,
      });
      setLoading(false);
    }
  }, [deviceProvisioning]);

  async function handleDelete(id) {
    setPopUp(false);
    setLoading(true);
    const apiData = await generalDeleteFunction(`/provision/destroy/${id}`);
    if (apiData.status) {
      //   const newArray = provisioningData.filter((item) => item.id !== id);
      setProvisioningData("");
      setLoading(false);
      toast.success(apiData.message);

      setDeleteId("");

      // after succesfully deleting data need to recall the global function to update the global state
      dispatch({
        type: "SET_DEVICE_PROVISIONINGREFRESH",
        deviceProvisioningRefresh: deviceProvisioningRefresh + 1,
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
            <Header title="Device Provisioning" />
            <div className="d-flex flex-wrap px-xl-3 py-2" id="detailsHeader">
              <div className="col-xl-4 my-auto">
                {/* <div className="position-relative searchBox">
                  <input
                    type="search"
                    name="Search"
                    id="headerSearch"
                    placeholder="Search"
                  />
                </div> */}
              </div>
              <div className="col-xl-8 pt-3 pt-xl-0">
                <div className="d-flex justify-content-end">
                  <Link
                    to="/device-provisioning-add"
                    onClick={backToTop}
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

            <div className="col-12" style={{ overflow: "auto" }}>
              <div className="tableContainer">
                <table>
                  <thead>
                    <tr>
                      <th>User Id</th>
                      <th>Serial Id</th>
                      <th>Server Address</th>
                      <th>Port</th>
                      <th>Transport</th>
                      <th>Edit</th>
                      <thd>Delete</thd>
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
                        {provisioningData && (
                          <tr>
                            <td
                              onClick={() =>
                                navigate(`/device-provisioning-edit`, {
                                  state: provisioningData.id,
                                })
                              }
                            >
                              {provisioningData.user_id}
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/device-provisioning-edit`, {
                                  state: provisioningData.id,
                                })
                              }
                            >
                              {provisioningData.serial_id}
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/device-provisioning-edit`, {
                                  state: provisioningData.id,
                                })
                              }
                            >
                              {provisioningData.server_address}
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/device-provisioning-edit`, {
                                  state: provisioningData.id,
                                })
                              }
                            >
                              {provisioningData.port}
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/device-provisioning-edit`, {
                                  state: provisioningData.id,
                                })
                              }
                            >
                              {provisioningData.transport}
                            </td>
                            <td>
                              {" "}
                              <button
                                className="tableButton edit"
                                onClick={() =>
                                  navigate(`/device-provisioning-edit`, {
                                    state: provisioningData.id,
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
                                  setDeleteId(provisioningData.id);
                                }}
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        )}
                        {provisioningData && provisioningData.length === 0 ? (
                          <td colSpan={99}>
                            <EmptyPrompt
                              name="Device Provisioning"
                              link="device-provisioning-add"
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
                  <p>Are you sure you want to delete this?</p>
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

export default DeviceProvisioning;
