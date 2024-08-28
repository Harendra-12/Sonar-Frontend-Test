import React, { useEffect } from "react";
import Header from "../../CommonComponents/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { backToTop } from "../../GlobalFunction/globalFunction";
import ActionList from "../../CommonComponents/ActionList";
import Select from "react-select";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import {
  noSpecialCharactersValidator,
  requiredValidator,
  usagesValidator,
} from "../../validations/validation";

const DidConfig = () => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(useLocation().search);
  const did_id = queryParams.get("did_id");
  const {
    register,
    setError: setErr,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm();

  useEffect(() => {
    register("usages", {
      validate: usagesValidator.validate,
      ...requiredValidator,
    });
    register("did_id", { required: true });

    if (did_id !== undefined) {
      setValue("did_id", did_id);
    }
  }, [register, did_id, setValue]);

  useEffect(() => {
    if (watch("forward") === "disable") {
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
  const forwardStatus = watch("forward", "disable");

  const handleFormSubmit = handleSubmit((data) => {
    if (data.forward === "pstn") {
      if (!data.forward_to) {
        setErr("forward_to", {
          type: "required",
          message: "This field is required when forwarding to PSTN.",
        });
      } else if (data.forward_to.length < 10) {
        setErr("forward_to", {
          type: "minLength",
          message: "Number must be at least 10 digits.",
        });
      }
    } else if (data.forward === "direct") {
      if (!data.direct_extension) {
        setErr("direct_extension", {
          type: "required",
          message: "This field is required when forwarding directly.",
        });
      }
    }

    // if only one key is needed
    if (data.forward === "pstn") {
      data.forward_to = data.forward_to || "";
    } else if (data.forward === "direct") {
      data.forward_to = data.direct_extension || "";
    } else {
      data.forward_to = "";
    }
    delete data.direct_extension;
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
                      name="did_id"
                      className="formItem"
                      defaultValue={did_id === undefined ? "" : did_id}
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
                      <option selected="" value={true}>
                        True
                      </option>
                      <option value={false}>False</option>
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
