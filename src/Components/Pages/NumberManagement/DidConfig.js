import React, { useEffect } from "react";
import Header from "../../CommonComponents/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { backToTop } from "../../GlobalFunction/globalFunction";
import ActionList from "../../CommonComponents/ActionList";
import Select from "react-select";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import {
  requiredValidator,
  usageValidator,
} from "../../validations/validation";

const DidConfig = () => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(useLocation().search);
  const did = queryParams.get("did");
  const {
    register,
    setError: setErr,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm();

  useEffect(() => {
    register("usage", {
      validate: usageValidator.validate,
      ...requiredValidator,
    });
    register("did", { required: true });

    if (did !== undefined) {
      setValue("did", did);
    }
  }, [register, did, setValue]);

  useEffect(() => {
    if (watch("forward_status") === "disable") {
      setValue("forword_extension", "");
      setValue("direct_extension", "");
    } else if (watch("forward_status") === "pstn") {
      setValue("direct_extension", "");
    } else if (watch("forward_status") === "direct") {
      setValue("forword_extension", "");
    }
  }, [watch("forward_status"), setValue]);

  const actionListValue = (value) => {
    setValue("dial_action", value[0]);
  };
  const directListValue = (value) => {
    setValue("direct_extension", value[0]);
  };
  const usageOptions = [
    { value: "voice", label: "Voice" },
    { value: "text", label: "Text" },
    { value: "fax", label: "Fax" },
    { value: "emergency", label: "Emergency" },
  ];
  const selectedUsage = watch("usage", []);
  const forwardStatus = watch("forward_status", "disable");

  const handleFormSubmit = handleSubmit((data) => {
    if (data.forward_status === "pstn") {
      if (!data.forword_extension) {
        setErr("forword_extension", {
          type: "required",
          message: "This field is required when forwarding to PSTN.",
        });
      } else if (data.forword_extension.length < 10) {
        setErr("forword_extension", {
          type: "minLength",
          message: "Number must be at least 10 digits.",
        });
      }
    } else if (data.forward_status === "direct") {
      if (!data.direct_extension) {
        setErr("direct_extension", {
          type: "required",
          message: "This field is required when forwarding directly.",
        });
      }
    }

    // if only one key is needed
    // if (data.forward_status === "pstn") {
    //   data.forword_extension = data.forword_extension || "";
    // } else if (data.forward_status === "direct") {
    //   data.forword_extension = data.direct_extension || "";
    // } else {
    //   data.forword_extension = "";
    // }
    // delete data.direct_extension;
    console.log(data);
  });

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      // border: '1px solid var(--color4)',
      border: "1px solid #ababab",
      borderRadius: "2px",
      outline: "none",
      fontSize: "14px",
      width: "100%",
      minHeight: "32px",
      height: "auto",
      boxShadow: state.isFocused ? "none" : provided.boxShadow,
      "&:hover": {
        borderColor: "none",
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
            <div className="row justify-content-center" id="subPageHeader">
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
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-12" style={{ overflow: "auto" }}>
            <div className="mx-2" id="detailsContent">
              <form className="row">
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Selected DID</label>
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      name="did"
                      className="formItem"
                      defaultValue={did === undefined ? "" : did}
                      disabled
                      {...register("did")}
                    />
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
                      options={usageOptions}
                      value={usageOptions.filter((option) =>
                        selectedUsage.includes(option.value)
                      )}
                      styles={customStyles}
                      onChange={(selectedOptions) => {
                        const values = selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : [];
                        setValue("usage", values);
                      }}
                    />

                    {errors.usage && (
                      <ErrorMessage text={errors.usage.message} />
                    )}
                    <label htmlFor="data" className="formItemDesc">
                      Set how the Destination will be used.
                    </label>
                  </div>
                </div>

                <div className="formRow col-xl-3">
                  <ActionList
                    getDropdownValue={actionListValue}
                    value={watch().dial_action}
                    {...register("dial_action", requiredValidator)}
                  />
                  {errors.dial_action && (
                    <ErrorMessage text={errors.dial_action.message} />
                  )}
                </div>

                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Forward DID</label>
                  </div>
                  <div className="col-12 d-flex flex-column">
                    <select
                      className="formItem"
                      name="forward_status"
                      id="selectFormRow"
                      // onChange={(e) => setForwardEnable(e.target.value)}
                      {...register("forward_status")}
                    >
                      <option value="disable">Disable</option>
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
                      <label htmlFor="forword_extension">
                        Forward Extension
                      </label>
                    </div>
                    <div className="col-12">
                      <input
                        type="number"
                        name="forword_extension"
                        className="formItem"
                        {...register("forword_extension", {
                          required: "Forward extension is required",
                          pattern: {
                            value: /^[0-9]*$/,
                            message: "Only digits are allowed",
                          },
                          minLength: {
                            value: 10,
                            message: "Must be at least 10 digits",
                          },
                        })}
                      />
                      {errors.forword_extension && (
                        <ErrorMessage text={errors.forword_extension.message} />
                      )}
                    </div>
                    <label htmlFor="data" className="formItemDesc">
                      Select extension.
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
                        required: "Select at least one option",
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
                      {...register("holdMusic")}
                    >
                      <option selected="" value="default">
                        default
                      </option>
                      <option value="none">none</option>
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
                      defaultValue={""}
                      id="selectFormRow"
                      {...register("status", {
                        ...requiredValidator,
                      })}
                    >
                      <option selected="" value={true}>
                        True
                      </option>
                      <option value={false}>False</option>
                    </select>
                    {errors.status && (
                      <ErrorMessage text={errors.status.message} />
                    )}
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
