import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { useLocation, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useForm } from "react-hook-form";
import {
  lengthValidator,
  minValidator,
  numberValidator,
  requiredValidator,
  restrictToMacAddress,
  restrictToNumbers,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import CircularLoader from "../../Loader/CircularLoader";
import { toast } from "react-toastify";

const DeviceProvisioningAdd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const deviceProvisioningRefresh = useSelector(
    (state) => state.deviceProvisioningRefresh
  );
  const extensionData = location.state;

  const [loading, setLoading] = useState(true);
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
    setValue,
  } = useForm();

  const handleFormSubmit = handleSubmit(async (data) => {
    setLoading(true);
    data.address = extensionData.id;
    const apiData = await generalPostFunction("/provision/store", data);
    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message);

      // // after succesfully adding data need to recall the global function to update the global state
      dispatch({
        type: "SET_DEVICE_PROVISIONINGREFRESH",
        deviceProvisioningRefresh: deviceProvisioningRefresh + 1,
      });
      reset();
      navigate(-1);
    } else {
      setLoading(false);
    }
  });

  useEffect(() => {
    setValue("address", extensionData.id);
    setLoading(false);
  }, [extensionData]);

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="Device Provisioning Add" />
          {/* <div id="subPageHeader">
            <div className="col-xl-9 my-auto">
              <p className="mb-0">Add an Device Provisioning</p>
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
                  <span className="text">Save</span>
                  <span className="icon">
                    <i class="fa-solid fa-floppy-disk"></i>
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
                      <h4>Device Provisioning Add</h4>
                      <p>
                        Add an Device Provisioning
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
                        className="panelButton"
                        onClick={handleFormSubmit}
                      >
                        <span className="text">Save</span>
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
                    borderBottom: "1px solid #ddd",
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
                          value={extensionData.extension}
                          disabled
                          type="text"
                          name="address"
                          className="formItem"
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
    </main>
  );
};

export default DeviceProvisioningAdd;
