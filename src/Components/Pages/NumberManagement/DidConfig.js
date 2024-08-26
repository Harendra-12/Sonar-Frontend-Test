import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { backToTop } from "../../GlobalFunction/globalFunction";
import ActionList from "../../CommonComponents/ActionList";

const DidConfig = ({didVal}) => {
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(useLocation().search);
  const did = queryParams.get("did");
  const [forwardEnable, setForwardEnable] = useState(0);
  const [formData, setFormData] = useState({
    did_number: "",
    did_type: "",
    did_forward_action: "",
    did_forward_number: "",
    did_forward_type: "",
  })

  const actionListValue = (value) => {
    // setValue("dial_action", value[0]);
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
                  <button effect="ripple" className="panelButton">
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
                      name="extension"
                      className="formItem"
                      value={did}
                      disabled
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
                    <select
                      className="formItem"
                      name=""
                      id="selectFormRow"
                      //   {...register("usage", { ...requiredValidator })}
                    >
                      <option disabled value=""></option>
                      <option value="voice">Voice</option>
                      <option value="text">Text</option>
                      <option value="fax">Fax</option>
                      <option value="emergency">Emergency</option>
                    </select>
                    {/* {errors.usage && (
                      <ErrorMessage text={errors.usage.message} />
                    )} */}
                    <label htmlFor="data" className="formItemDesc">
                      Set how the Destination will be used.
                    </label>
                  </div>
                </div>

                <div className="formRow col-xl-3">
                  <ActionList
                    getDropdownValue={actionListValue}
                    // value={watch().dial_action}
                    value=""
                  />
                </div>

                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Forward</label>
                  </div>
                  <div className="col-12 d-flex flex-column">
                    <select
                      className="formItem"
                      name="forword"
                      id="selectFormRow"
                      onChange={(e) => setForwardEnable(e.target.value)}
                      value={forwardEnable}
                    >
                      <option value={1}>True</option>
                      <option value={0}>False</option>
                    </select>
                    <label htmlFor="data" className="formItemDesc">
                      Want to forword extension.
                    </label>
                  </div>
                </div>

                {forwardEnable > 0 && (
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Forward Extension</label>
                    </div>
                    <div className="col-12">
                      <input
                        type="number"
                        name="forwordExtension"
                        className="formItem"
                        value={typeof forwardEnable}
                      />
                    </div>
                    <label htmlFor="data" className="formItemDesc">
                      Selected extension.
                    </label>
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
                      //   {...register("caller_Id_name_prefix")}
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
                      //   {...register("holdMusic")}
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
                      //   {...register("destination_status", {
                      //     ...requiredValidator,
                      //   })}
                    >
                      <option selected="" value={true}>
                        True
                      </option>
                      <option value={false}>False</option>
                    </select>
                    {/* {errors.destination_status && (
                      <ErrorMessage text={errors.destination_status.message} />
                    )} */}
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
