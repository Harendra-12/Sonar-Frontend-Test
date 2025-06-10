import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { backToTop, generalGetFunction, generalPostFunction } from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";
import { emailValidator, lengthValidator, numberValidator, requiredValidator } from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import PhoneInput, { getCountryCallingCode, parsePhoneNumber } from "react-phone-number-input";

const ElasticTrunkAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { watch, register, formState: { errors }, reset, handleSubmit, setValue } = useForm();

  // Handle Trunk Add
  const handleFormSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const payload = { ...data };
    const apiData = await generalPostFunction("/fportaltrunk/store", payload);
    if (apiData?.status) {
      setLoading(false);
      reset();
      navigate('/elastic-trunk');
      toast.success(apiData.message);
    } else {
      setLoading(false);
    }
  });

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          {loading ? (
            <div colSpan={99}>
              <CircularLoader />
            </div>
          ) : (
            ""
          )}
          <div className="container-fluid">
            <div className="row">
              <Header title="Elastic Trunk Portal" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>Add Trunk</h4>
                          <p>Add an elastic trunk for your portal</p>
                        </div>
                        <div className="buttonGroup">
                          <div className="my-auto position-relative mx-1">
                            <div class="cl-toggle-switch">
                              <label class="cl-switch">
                                <input
                                  type="checkbox"
                                  defaultChecked={"false"}
                                  checked={watch().status}
                                  {...register("status")}
                                  id="showAllCheck"
                                />
                                <span></span>
                              </label>
                            </div>
                          </div>
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
                              <i className="fa-solid fa-caret-left"></i>
                            </span>
                          </button>
                          <button type="button" className="panelButton" onClick={handleFormSubmit}>
                            <span className="text">Save</span>
                            <span className="icon">
                              <i className="fa-solid fa-floppy-disk"></i>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-12" style={{ padding: "25px 23px" }}>
                      <form className="row mb-0">
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              Description <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a description for the trunk.
                            </label>
                          </div>
                          <div className="col-6">
                            <input type="text"
                              className="formItem"
                              {...register("description", { ...requiredValidator, })}
                            />
                            {errors.description && (
                              <ErrorMessage text={errors.description.message} />
                            )}
                          </div>
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              Channel{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter the channel for the trunk.
                            </label>
                          </div>
                          <div className="col-6">
                            <input type="text"
                              className="formItem"
                              {...register("channels", { ...requiredValidator })}
                            />
                            {errors.channels && (
                              <ErrorMessage text={errors.channels.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              Caller Id{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter the caller id for the trunk.
                            </label>
                          </div>
                          <div className="col-6">
                            <input type="text"
                              className="formItem"
                              {...register("caller_id", { ...requiredValidator })}
                            />
                            {errors.caller_id && (
                              <ErrorMessage text={errors.caller_id.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              Emergency Location <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a emergency location for the trunk.
                            </label>
                          </div>
                          <div className="col-6">
                            <input type="text"
                              className="formItem"
                              {...register("emergency_location", { ...requiredValidator })}
                            />
                            {errors.emergency_location && (
                              <ErrorMessage text={errors.emergency_location.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              Auth Type <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a auth type for the trunk.
                            </label>
                          </div>
                          <div className="col-6">
                            <select {...register("auth_type", { ...requiredValidator, })} className="formItem">
                              <option value="">Select Auth Type</option>
                              <option value={0}>IP Based</option>
                              <option value={1}>Username & Password</option>
                            </select>
                            {errors.auth_type && (
                              <ErrorMessage text={errors.auth_type.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              Domain IP <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter the domain IP for the trunk.
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              className="formItem"
                              {...register("domain_ip", { ...requiredValidator, })}
                            />
                            {errors.domain_ip && (
                              <ErrorMessage text={errors.domain_ip.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              Port <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a port for the trunk.
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              className="formItem"
                              {...register("state", { ...requiredValidator, })}
                            />
                            {errors.port && (
                              <ErrorMessage text={errors.port.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              SIP Username <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter the sip username for the trunk.
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              className="formItem"
                              {...register("sip_username", { ...requiredValidator, })}
                            />
                            {errors.sip_username && (
                              <ErrorMessage text={errors.sip_username.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              SIP Password <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter the sip password for the trunk.
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              className="formItem"
                              {...register("sip_password", { ...requiredValidator, })}
                            />
                            {errors.sip_password && (
                              <ErrorMessage text={errors.sip_password.message} />
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ElasticTrunkAdd;
