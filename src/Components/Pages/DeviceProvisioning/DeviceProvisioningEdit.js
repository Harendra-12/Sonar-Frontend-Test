/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CircularLoader from "../../Loader/CircularLoader";
import {
  lengthValidator,
  numberValidator,
  requiredValidator,
  restrictToMacAddress,
  restrictToNumbers,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import {
  backToTop,
  generalDeleteFunction,
} from "../../GlobalFunction/globalFunction";
import Header from "../../CommonComponents/Header";
import { toast } from "react-toastify";

const DeviceProvisioningEdit = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const provisionings = location.state?.provisionings;
  const extension_id = location.state?.extension_id;
  const [popUp, setPopUp] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [loading, setLoading] = useState(false);

  const deviceProvisioningRefresh = useSelector(
    (state) => state.deviceProvisioningRefresh
  );
  const {
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  useEffect(() => {
    reset({
      address: String(extension_id),
      transport: provisionings.transport,
      port: provisionings.port,
      serial_number: provisionings.serial_number,
    });
  }, [provisionings]);

  // const handleFormSubmit = handleSubmit(async (data) => {
  //   setLoading(true);
  //   const apiData = await generalPutFunction(
  //     `/provision/update/${provisionings.id}`,
  //     data
  //   );
  //   if (apiData.status) {
  //     setLoading(false);
  //     toast.success(apiData.message);

  //     // after succesfully editing data need to recall the global function to update the global state
  //     dispatch({
  //       type: "SET_DEVICE_PROVISIONINGREFRESH",
  //       deviceProvisioningRefresh: deviceProvisioningRefresh + 1,
  //     });
  //     reset();
  //     navigate(-1);
  //   } else {
  //     setLoading(false);
  //   }
  // });

  async function handleDelete(id) {
    setPopUp(false);
    setLoading(true);
    const apiData = await generalDeleteFunction(`/provision/destroy/${id}`);
    if (apiData.status) {
      //   const newArray = provisioningData.filter((item) => item.id !== id);

      setLoading(false);
      toast.success(apiData.message);

      setDeleteId("");

      // after succesfully deleting data need to recall the global function to update the global state
      dispatch({
        type: "SET_DEVICE_PROVISIONINGREFRESH",
        deviceProvisioningRefresh: deviceProvisioningRefresh + 1,
      });
      navigate(-1);
    } else {
      setLoading(false);
      toast.error(apiData.error);
      setDeleteId("");
    }
  }
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="Device Provisioning" />
          {/* <div id="subPageHeader">
            <div className="col-xl-9 my-auto">
              <p className="mb-0">Edit Device Provisioning</p>
            </div>
            <div className="col-xl-3 ps-2">
              <div className="d-flex justify-content-end">
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
                <button
                  effect="ripple"
                  className="panelButton"
                  onClick={handleFormSubmit}
                >
                  <span className="text">Update</span>
                  <span className="icon">
                    <i class="fa-solid fa-floppy-disk"></i>
                  </span>
                </button>
                <button
                  effect="ripple"
                  className="panelButton"
                  onClick={() => {
                    setPopUp(true);
                    setDeleteId(provisionings.id);
                  }}
                >
                  <span className="text">Delete</span>
                  <span className="icon">
                    <i class="fa-solid fa-trash"></i>
                  </span>
                </button>
              </div>
            </div>
          </div> */}
        </div>

        <div className="col-xl-12" style={{ overflow: "auto" }}>
          {loading ? (
            <div colSpan={99}>
              <CircularLoader />
            </div>
          ) : (
            ""
          )}
          <div className="overviewTableWrapper">
            <div className="overviewTableChild">
              <div className="d-flex flex-wrap">
                <div className="col-12">
                  <div className="heading">
                    <div className="content">
                      <h4>Device Provisioning Edit</h4>
                      <p>
                        Edit Device Provisioning
                      </p>
                    </div>
                    <div className="buttonGroup">
                      <button
                        onClick={() => {
                          navigate(-1);
                          backToTop();
                        }}
                        type="button"
                        effect="ripple"
                        className="panelButton gray"
                      >
                        <span className="text">Back</span>
                        <span className="icon">
                          <i class="fa-solid fa-caret-left"></i>
                        </span>
                      </button>
                      <button
                        effect="ripple"
                        className="panelButton delete"
                        onClick={() => {
                          setPopUp(true);
                          setDeleteId(provisionings.id);
                        }}
                      >
                        <span className="text">Delete</span>
                        <span className="icon">
                          <i class="fa-solid fa-trash"></i>
                        </span>
                      </button>
                      <button
                        effect="ripple"
                        className="panelButton"
                        onClick={() => {
                          setPopUp(true);
                          setDeleteId(provisionings.id);
                        }}
                      >
                        <span className="text">Update</span>
                        <span className="icon">
                          <i class="fa-solid fa-floppy-disk"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className="col-12"
                  style={{
                    padding: "25px 23px",
                  }}
                >
                  <form>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label className="text-dark">Address</label>
                        <label htmlFor="data" className="formItemDesc">
                          Select a address
                        </label>
                      </div>
                      <div className="col-6">
                        <input
                          type="text"
                          className="formItem"
                          value={provisionings.address}
                          disabled
                        />

                        {errors.address && (
                          <ErrorMessage text={errors.address.message} />
                        )}
                      </div>
                    </div>

                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label className="text-dark">Transport</label>
                        <label htmlFor="data" className="formItemDesc">
                          Select a transport
                        </label>
                      </div>
                      <div className="col-6">
                        <select
                          value={watch().transport}
                          className="formItem"
                          name="transport "
                          id="selectFormRow"
                          {...register("transport", {
                            ...requiredValidator,
                          })}
                        >
                          <option disabled value="">
                            Chose a vendor
                          </option>
                          <option selected value="TCPpreferred">
                            TCP Preferred
                          </option>
                          <option value="UDPOnly">UDP Only</option>
                          <option value="TLS">TLS</option>
                          <option value="TCPOnly">TCP Only</option>
                        </select>
                        {errors.transport && (
                          <ErrorMessage text={errors.transport.message} />
                        )}
                      </div>
                    </div>

                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label className="text-dark">Port</label>
                        <label htmlFor="data" className="formItemDesc">
                          Select a port
                        </label>
                      </div>
                      <div className="col-6">
                        <input
                          type="text"
                          name="address"
                          className="formItem"
                          minLength="3"
                          maxLength="4"
                          placeholder="5070"
                          {...register("port", {
                            ...requiredValidator,
                            ...numberValidator,
                            ...lengthValidator(3, 4),
                          })}
                          onKeyDown={restrictToNumbers}
                        />
                        {errors.port && <ErrorMessage text={errors.port.message} />}
                      </div>
                    </div>

                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label className="text-dark">Serial Number</label>
                        <label htmlFor="data" className="formItemDesc">
                          Enter serial number
                        </label>
                      </div>
                      <div className="col-6">
                        <input
                          type="text"
                          name="serial_number"
                          className="formItem"
                          placeholder="124abc"
                          {...register("serial_number", {
                            ...requiredValidator,
                          })}
                          onKeyDown={restrictToMacAddress}
                        />
                        {errors.serial_number && (
                          <ErrorMessage text={errors.serial_number.message} />
                        )}
                      </div>
                    </div>
                  </form>
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
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setPopUp(false);
                        setDeleteId("");
                        // setDeleteToggle(false);
                      }}
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
      )}
    </main>
  );
};

export default DeviceProvisioningEdit;
