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
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import Header from "../../CommonComponents/Header";
import { toast } from "react-toastify";

const DeviceProvisioningEdit = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state;

  const [loading, setLoading] = useState(false);
  const [allExtensions, setAllExtensions] = useState([]);
  const extensionAll = useSelector((state) => state.extension);
  const extensionRefresh = useSelector((state) => state.extensionRefresh);
  const deviceProvisioningRefresh = useSelector(
    (state) => state.deviceProvisioningRefresh
  );
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm();

  useEffect(() => {
    async function getData() {
      // fetch all the available extensions
      setLoading(true);
      if (extensionRefresh > 0) {
        setAllExtensions(extensionAll);
        setLoading(false);
      } else {
        dispatch({
          type: "SET_EXTENSIONREFRESH",
          extensionRefresh: extensionRefresh + 1,
        });
        setLoading(false);
      }
      const provisioningData = await generalGetFunction(
        `/provision/show/${id}`
      );
      const prevId = extensionAll.find(
        (item) => item.extension === provisioningData?.data.address
      );
      if (provisioningData.status && prevId) {
        setLoading(false);
        // reset(provisioningData.data);
        reset({
          address: String(prevId.id),
          transport: provisioningData.data.transport,
          port: provisioningData.data.port,
          serial_number: provisioningData.data.serial_number,
        });
      }
    }
    if (id) {
      getData();
    } else {
      navigate(-1);
    }
  }, [extensionRefresh, extensionAll]);

  const handleFormSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const apiData = await generalPutFunction(`/provision/update/${id}`, data);
    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message);

      // after succesfully editing data need to recall the global function to update the global state
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

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="Device Provisioning Edit" />
          <div id="subPageHeader">
            <div className="col-xl-9 my-auto">
              <p className="mb-0">Edit Device Provisioning</p>
            </div>
            <div className="col-xl-3 ps-2">
              <div className="d-flex justify-content-end">
                <button
                  effect="ripple"
                  className="panelButton"
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
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-12" style={{ overflow: "auto" }}>
          {loading ? (
            <div colSpan={99}>
              <CircularLoader />
            </div>
          ) : (
            ""
          )}
          <div className="mx-2" id="detailsContent">
            <form>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label className="text-dark">Address</label>
                  <label htmlFor="data" className="formItemDesc">
                    Select a address
                  </label>
                </div>
                <div className="col-6">
                  <select
                    className="formItem"
                    // value={String(prevId?.id)}
                    name="address "
                    id="selectFormRow"
                    {...register("address", {
                      ...requiredValidator,
                      ...numberValidator,
                    })}
                  >
                    <option disabled selected value="">
                      Chose a address
                    </option>
                    {allExtensions &&
                      allExtensions.map((extension) => (
                        <option value={extension.id} key={extension.id}>
                          {extension.extension}
                        </option>
                      ))}
                  </select>
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
      </section>
    </main>
  );
};

export default DeviceProvisioningEdit;
