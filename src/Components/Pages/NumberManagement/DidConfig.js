import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { useLocation, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import ActionList from "../../CommonComponents/ActionList";
import Select from "react-select";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import {
  noSpecialCharactersValidator,
  requiredValidator,
  usagesValidator,
} from "../../validations/validation";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import CircularLoader from "../../Loader/CircularLoader";

const DidConfig = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationData = location.state;
  const [dataAvailable, setDataAvailable] = useState(true);
  const account = useSelector((state) => state.account);
  const [holdMusic, setHoldMusic] = useState();
  const [loading, setLoading] = useState(true);
  // const queryParams = new URLSearchParams(useLocation().search);
  // const did_id_view = queryParams.get("did_id_view");
  const {
    register,
    setError: setErr,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm();

  useEffect(() => {
    if (locationData.configuration !== null) {
      setDataAvailable(false);
      console.log("This is configuration", locationData.configuration);

      setValue("usages", locationData.configuration.usages || []);
      setValue("did_id_view", locationData.did || "");
      setValue("forward", locationData.configuration.forward || "");
      // if(locationData.configuration.forward === "direct"){
      // }else if (locationData.configuration.forward === "forward_to"){
      // }else{
      //   setValue("forward_to", "");
      // }
      setValue("direct_extension", locationData.configuration.forward_to || "");
      setValue("forward_to", locationData.configuration.forward_to || "");
      setValue("action", locationData.configuration.action || "");
      setValue("hold_music", locationData.configuration.hold_music || "");

      setValue(
        "record",
        locationData.configuration.record === 0 ? false : true || ""
      );
      setValue(
        "status",
        locationData.configuration.status === 0 ? false : true || ""
      );
    } else {
      setDataAvailable(true);
    }
  }, [locationData]);
  useEffect(() => {
    if (account && account.id) {
      async function getData() {
        const holdMusic = await generalGetFunction("/sound/all?type=hold");
        setLoading(false);
        if (holdMusic.status) {
          setHoldMusic(holdMusic.data);
        } else {
          navigate("/");
        }
      }
      getData();
    } else {
      setLoading(false);
      navigate("/");
    }
  }, [navigate, account]);

  useEffect(() => {
    if (locationData) {
      setValue("did_id_view", locationData.did || "");
    } else {
      console.warn(
        "Location data is undefined or missing expected properties."
      );
    }

    register("usages", {
      validate: usagesValidator.validate,
      ...requiredValidator,
    });
    register("did_id_view", { required: true });

    // if (locationData !== undefined) {
    //   setValue("did_id_view", locationData.did_id_view);
    // }
  }, [register, setValue]);

  useEffect(() => {
    if (watch("forward") === "disabled") {
      setValue("forward_to", "");
      setValue("direct_extension", "");
    } else if (watch("forward") === "pstn") {
      setValue("direct_extension", "");
    } else if (watch("forward") === "direct") {
      setValue("forward_to", "");
    }
  }, [watch("forward"), setValue]);

  const actionListValue = (value) => {
    setValue("action", value[0]);
  };
  const directListValue = (value) => {
    setValue("direct_extension", value[0]);
  };
  const usagesOptions = [
    { value: "voice", label: "Voice" },
    { value: "text", label: "Text" },
    { value: "fax", label: "Fax" },
    { value: "emergency", label: "Emergency" },
  ];
  const selectedUsages = watch("usages", []);
  const forwardStatus = watch("forward", "disabled");

  const handleFormSubmit = handleSubmit(async (data) => {
    data.record = data.record === true || data.record === "true";
    data.status = data.status === true || data.status === "true";

    if (!Array.isArray(data.usages)) {
      data.usages = [data.usages];
    }

    if (data.forward === "pstn" && !data.forward_to) {
      setErr("forward_to", {
        type: "required",
        message: "This field is required when forwarding to PSTN.",
      });
    } else if (data.forward === "pstn" && data.forward_to.length < 10) {
      setErr("forward_to", {
        type: "minLength",
        message: "Number must be at least 10 digits.",
      });
    } else if (data.forward === "direct" && !data.direct_extension) {
      setErr("direct_extension", {
        type: "required",
        message: "This field is required when forwarding directly.",
      });
    }

    // Final data preparation
    if (data.forward === "pstn") {
      data.forward_to = data.forward_to || "";
    } else if (data.forward === "direct") {
      data.forward_to = data.direct_extension || "";
    } else {
      data.forward_to = "";
    }
    delete data.direct_extension;
    delete data.did_id;
    const payload = { ...data, did_id: locationData.id };

    if (locationData.configuration === null) {
      setLoading(true);
      const apiData = await generalPostFunction("/did/configure", payload);
      if (apiData.status) {
        setLoading(false);
        toast.success(apiData.message);
      } else {
        setLoading(false);
        toast.error(apiData.message);
      }
    }
    if (locationData.configuration) {
      setLoading(true);
      const apiData = await generalPutFunction(
        `/did/configure/update/${locationData.configuration.id}`,
        payload
      );
      if (apiData.status) {
        setLoading(false);
        toast.success(apiData.message);
      } else {
        setLoading(false);
        toast.error(apiData.message);
      }
    }
    console.log("payload", payload);
  });

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      // border: '1px solid var(--color4)',
      border: "1px solid var(--color4)",
      borderRadius: "5px",
      outline: "none",
      fontSize: "14px",
      width: "100%",
      minHeight: "32px",
      height: "auto",
      boxShadow: state.isFocused ? "none" : provided.boxShadow,
      "&:hover": {
        borderColor: "var(--ui-accent)",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "auto",
      padding: "0 6px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0",
    }),
    indicatorSeparator: (provided) => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "32px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#202020",
      "&:hover": {
        color: "#202020",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      paddingLeft: "15px",
      paddingTop: 0,
      paddingBottom: 0,
      // backgroundColor: state.isSelected ? "transparent" : "transparent",
      "&:hover": {
        backgroundColor: "#0055cc",
        color: "#fff",
      },
      fontSize: "14px",
    }),
    menu: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
      margin: 0,
      maxHeight: "150px",
      overflowY: "auto",
    }),
  };

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0">
            <Header title="Destination Config" />
            <div id="subPageHeader">
              <div className="col-xl-9 my-auto">
                <p className="pt-2 mt-1 mb-0">
                  Inbound destinations are the DID/DDI, DNIS or Alias for
                  inbound calls.
                </p>
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
                    Back
                  </button>
                  <button
                    effect="ripple"
                    className="panelButton"
                    onClick={handleFormSubmit}
                  >
                    {locationData.configuration ? "Update" : "Save"}
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
              <form className="row">
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Selected DID</label>
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      name="did_id_view"
                      className="formItem"
                      value={locationData.did && locationData.did}
                      disabled
                      {...register("did_id", {
                        ...noSpecialCharactersValidator,
                      })}
                    />

                    {errors.did_id && (
                      <ErrorMessage text={errors.did_id.message} />
                    )}
                  </div>
                  <label htmlFor="data" className="formItemDesc">
                    Selected DID.
                  </label>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Usage</label>
                  </div>
                  <div className="col-12 d-flex flex-column">
                    <Select
                      closeMenuOnSelect={false}
                      isMulti
                      options={usagesOptions}
                      value={usagesOptions.filter((option) =>
                        selectedUsages.includes(option.value)
                      )}
                      styles={customStyles}
                      onChange={(selectedOptions) => {
                        const values = selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : [];
                        setValue("usages", values);
                      }}
                    />

                    {errors.usages && (
                      <ErrorMessage text={errors.usages.message} />
                    )}
                    <label htmlFor="data" className="formItemDesc">
                      Set how the Destination will be used.
                    </label>
                  </div>
                </div>

                <div className="formRow col-xl-3">
                  <ActionList
                    getDropdownValue={actionListValue}
                    value={watch().action}
                    {...register("action", requiredValidator)}
                  />
                  {errors.action && (
                    <ErrorMessage text={errors.action.message} />
                  )}
                </div>

                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Forward DID</label>
                  </div>
                  <div className="col-12 d-flex flex-column">
                    <select
                      className="formItem"
                      name="forward"
                      id="selectFormRow"
                      // onChange={(e) => setForwardEnable(e.target.value)}
                      {...register("forward")}
                    >
                      <option value="disabled">Disable</option>
                      <option value="pstn">PSTN</option>
                      <option value="direct">Direct</option>
                    </select>
                    <label htmlFor="data" className="formItemDesc">
                      Want to forword DID.
                    </label>
                  </div>
                </div>
                {forwardStatus === "pstn" && (
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="forward_to">Select PSTN</label>
                    </div>
                    <div className="col-12">
                      <input
                        type="number"
                        name="forward_to"
                        className="formItem"
                        {...register("forward_to", {
                          required: "PSTN is required",
                          pattern: {
                            value: /^[0-9]*$/,
                            message: "Only digits are allowed",
                          },
                          minLength: {
                            value: 10,
                            message: "Must be at least 10 digits",
                          },

                          ...noSpecialCharactersValidator,
                        })}
                      />
                      {errors.forward_to && (
                        <ErrorMessage text={errors.forward_to.message} />
                      )}
                    </div>
                    <label htmlFor="data" className="formItemDesc">
                      Select a PSTN.
                    </label>
                  </div>
                )}
                {forwardStatus === "direct" && (
                  <div className="formRow col-xl-3">
                    <ActionList
                      getDropdownValue={directListValue}
                      value={watch().direct_extension}
                      title="Forward Extension"
                      label="Select extension."
                      {...register("direct_extension", {
                        requiredValidator,
                      })}
                    />
                    {errors.direct_extension && (
                      <ErrorMessage text={errors.direct_extension.message} />
                    )}
                  </div>
                )}
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="selectFormRow">Record</label>
                  </div>
                  <div className="col-12">
                    <select
                      className="formItem"
                      name=""
                      id="selectFormRow"
                      {...register("record")}
                    >
                      <option selected="" value="true">
                        True
                      </option>
                      <option value="false">False</option>
                    </select>
                  </div>
                  <label htmlFor="data" className="formItemDesc">
                    Save the recording.
                  </label>
                </div>

                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="selectFormRow">Hold Music</label>
                  </div>
                  <div className="col-12">
                    <select
                      className="formItem"
                      name=""
                      id="selectFormRow"
                      {...register("hold_music")}
                      value={watch().hold_music}
                    >
                      <option value="default">
                        default
                      </option>
                      {holdMusic &&
                        holdMusic.map((ring) => {
                          return (
                            <option key={ring.id} value={ring.id}>
                              {ring.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  <label htmlFor="data" className="formItemDesc">
                    Save the recording.
                  </label>
                </div>

                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="selectFormRow">Status</label>
                  </div>
                  <div className="col-12 d-flex flex-column">
                    <select
                      className="formItem"
                      name=""
                      id="selectFormRow"
                      {...register("status")}
                    >
                      <option selected="" value="true">
                        True
                      </option>
                      <option value="false">False</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default DidConfig;
