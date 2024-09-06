/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../../Loader/CircularLoader";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import {
  domainValidator,
  emailValidator,
  lengthValidator,
  noSpecialCharactersValidator,
  noSpecialCharNumberValidator,
  numberValidator,
  requiredValidator,
} from "../../validations/validation";
import Header from "../../CommonComponents/Header";

const ExtensionsAdd = () => {
  const navigate = useNavigate();
  const acount = useSelector((state) => state.account);
  const domain = useSelector((state) => state.domain);
  // const [domains, setDomains] = useState();
  const [loading, setLoading] = useState(false);
  const [music, setMusic] = useState([]);
  const [musicHold, setMusicHold] = useState();
  const extensionRefresh = useSelector((state) => state.extensionRefresh);
  const dispatch = useDispatch();
  const { id: domainId = "" } = domain;
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const account = useSelector((state) => state.account);
  useEffect(() => {
    if (account === null) {
      navigate("/");
    } else {
      async function getDomain() {
        // const domain = await generalGetFunction(
        //   `/domain/search?account=${account.account_id}`
        // );
        const musicData = await generalGetFunction("/sound/all?type=hold");
        // if (domain.status) {
        //   setDomains(
        //     domain.data.map((item) => {
        //       return [item.id, item.domain_name];
        //     })
        //   );
        // } else {
        //   navigate("/");
        // }
        if (musicData.status) {
          setMusic(musicData.data);
        }
      }
      getDomain();
    }
  }, []);

  const handleFormSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const payLoad = {
      ...data,
      ...{ account_id: acount.account_id, domain: `${domainId}` },
    };
    const apiData = await generalPostFunction("/extension/store", payLoad);
    if (apiData.status) {
      reset();
      setLoading(false);
      toast.success(apiData.message);
      dispatch({
        type: "SET_EXTENSIONREFRESH",
        extensionRefresh: extensionRefresh + 1,
      });
      navigate("/extensions");
    } else {
      setLoading(false);
      const errorMessage = Object.keys(apiData.errors);
      toast.error(apiData.errors[errorMessage[0]][0]);
    }
  });

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="Extension Add" />
          <div id="subPageHeader">
            <div className="col-xl-12 ps-2">
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
                // onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-12">
          {loading ? (
            <div colSpan={99}>
              <CircularLoader />
            </div>
          ) : (
            ""
          )}
          <div className="mx-2" id="detailsContent">
            <form action="#" className="row">
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Extension</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("extension", {
                      ...requiredValidator,
                      ...numberValidator,
                      ...lengthValidator(2, 15),
                      ...noSpecialCharNumberValidator,
                    })}
                  />
                  {errors.extension && (
                    <ErrorMessage text={errors.extension.message} />
                  )}
                  <label htmlFor="data" className="formItemDesc">
                    Enter the numeric extension. The default configuration
                    allows 2 - 15 digit extensions.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Password</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("password", {
                      ...requiredValidator,
                      ...lengthValidator(4, 50),
                    })}
                  />
                  {errors.password && (
                    <ErrorMessage text={errors.password.message} />
                  )}
                  <label htmlFor="data" className="formItemDesc">
                    Password length must be atleast 4 character
                  </label>
                </div>
              </div>
              {/* <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Domain</label>
                </div>
                <div className="col-12 d-flex flex-column">
                  <select
                    className="formItem"
                    id="selectFormRow"
                    {...register("domain", {
                      ...requiredValidator,
                      ...domainValidator,
                    })}
                    defaultValue={""}
                  >
                    <option value="" disabled>
                      Select Domain
                    </option>
                    {domains &&
                      domains.map((item, key) => {
                        return (
                          <option key={key} value={item[0]}>
                            {item[1]}
                          </option>
                        );
                      })}
                  </select>
                  {errors.domain && (
                    <ErrorMessage text={errors.domain.message} />
                  )}
                  <label htmlFor="data" className="formItemDesc">
                    Select the Domain.
                  </label>
                </div>
              </div> */}
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Voicemail Password</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("voicemail_password", {
                      ...requiredValidator,
                      ...lengthValidator(4, 50),
                    })}
                  />
                  {errors.voicemail_password && (
                    <ErrorMessage text={errors.voicemail_password.message} />
                  )}
                  <label htmlFor="data" className="formItemDesc">
                    Enter the numeric voicemail password here.
                  </label>
                </div>
              </div>
              {music.length != 0 && (
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Music on Hold</label>
                  </div>
                  <div className="col-12">
                    <select
                      // value={callCenter.musicHold}
                      // onChange={(e) => {
                      //   setMusicHold(e.target.value);
                      // }}
                      {...register("moh")}
                      className="formItem w-100"
                    >
                      <option></option>
                      {music &&
                        music.map((item, index) => {
                          return (
                            <option key={index} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      {/* <option>test</option> */}
                    </select>
                    <br />
                    <label htmlFor="data" className="formItemDesc">
                      Select the desired hold music.
                    </label>
                  </div>
                </div>
              )}

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Account Code</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("account_code", {
                      ...noSpecialCharactersValidator,
                    })}
                  />
                  {errors.account_code && (
                    <ErrorMessage text={errors.account_code.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the account code here.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Effective Caller ID Name</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("effectiveCallerIdName", {
                      ...noSpecialCharactersValidator,
                    })}
                  />
                  {errors.effectiveCallerIdName && (
                    <ErrorMessage text={errors.effectiveCallerIdName.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the internal caller ID name here.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Effective Caller ID Number</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("effectiveCallerIdNumber", {
                      ...numberValidator,
                    })}
                  />
                  {errors.effectiveCallerIdNumber && (
                    <ErrorMessage
                      text={errors.effectiveCallerIdNumber.message}
                    />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the internal caller ID number here.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Outbound Caller ID Name</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("outbundCallerIdName", {
                      ...noSpecialCharactersValidator,
                    })}
                  />
                  {errors.outbundCallerIdName && (
                    <ErrorMessage text={errors.outbundCallerIdName.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the external (public) caller ID name here.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Outbound Caller ID Number</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("outbundCallerIdNumber", {
                      ...noSpecialCharactersValidator,
                      ...numberValidator,
                    })}
                  />
                  {errors.outbundCallerIdNumber && (
                    <ErrorMessage text={errors.outbundCallerIdNumber.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the external (public) caller ID number here.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Emergency Caller ID Name</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("emergencyCallerIdName", {
                      ...noSpecialCharactersValidator,
                    })}
                  />
                  {errors.emergencyCallerIdName && (
                    <ErrorMessage text={errors.emergencyCallerIdName.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the emergency caller ID name here.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Emergency Caller ID Number</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("emergencyCallerIdNumber", {
                      ...noSpecialCharactersValidator,
                      ...numberValidator,
                    })}
                  />
                  {errors.emergencyCallerIdNumber && (
                    <ErrorMessage
                      text={errors.emergencyCallerIdNumber.message}
                    />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the emergency caller ID number here.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Directory Full Name</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("directoryFullname", {
                      ...noSpecialCharactersValidator,
                    })}
                  />
                  {errors.directoryFullname && (
                    <ErrorMessage text={errors.directoryFullname.message} />
                  )}

                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the first name followed by the last name.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">
                    Directory Extension Visible
                  </label>
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    name=""
                    id="selectFormRow"
                    {...register("directoryExtensionVisible")}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Select whether announce the extension when calling the
                    directory.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Max Registrations</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("maxRegistration", {
                      ...noSpecialCharactersValidator,
                      ...numberValidator,
                    })}
                  />
                  {errors.maxRegistration && (
                    <ErrorMessage text={errors.maxRegistration.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the maximum concurrent registrations allowed.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Limit Max</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("limitMax", {
                      ...noSpecialCharactersValidator,
                      ...numberValidator,
                    })}
                  />
                  {errors.limitMax && (
                    <ErrorMessage text={errors.limitMax.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the maximum number of concurrent outbound calls
                    allowed.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Limit Destination</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("limitDestinations", {
                      ...noSpecialCharactersValidator,
                      ...numberValidator,
                    })}
                  />
                  {errors.limitDestinations && (
                    <ErrorMessage text={errors.limitDestinations.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the destination to send the calls when the max number
                    of outgoing calls has been reached.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Voicemail Enabled</label>
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    name=""
                    defaultValue={"true"}
                    id="selectFormRow"
                    {...register("voiceMailEnable")}
                  >
                    {/* <option value="" disabled ></option> */}
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enable/disable voicemail for this extension.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Voicemail Mail To</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("voiceEmailTo", {
                      ...noSpecialCharactersValidator,
                      ...emailValidator,
                    })}
                  />
                  {errors.voiceEmailTo && (
                    <ErrorMessage text={errors.voiceEmailTo.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the email address to send voicemail to (optional).
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Voicemail File</label>
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    name=""
                    defaultValue={""}
                    id="selectFormRow"
                    {...register("voiceMailFile")}
                  >
                    <option value={""} disabled>
                      Select Voicemail File
                    </option>
                    <option value="audio">Audio File Attachment</option>
                    <option value="listen">Listen Link (Login Required)</option>
                    <option value="download">
                      Download Link (No Login Required)
                    </option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Select a listening option to include with the email
                    notification.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Voicemail Keep Local</label>
                </div>

                <div className="col-12">
                  <select
                    className="formItem"
                    name=""
                    id="selectFormRow"
                    {...register("voiceMailKeepFile")}
                    defaultValue={"true"}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Choose whether to keep the voicemail in the system after
                    sending the email notification.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Missed Call</label>
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    name=""
                    id="selectFormRow"
                    {...register("missedCall")}
                    defaultValue={"none"}
                  >
                    <option value="email">Email</option>
                    <option value="none">None</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Select the notification type, and enter the appropriate
                    destination.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Toll Allow</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("tollAllowValue", {
                      ...noSpecialCharactersValidator,
                    })}
                  />
                  {errors.tollAllowValue && (
                    <ErrorMessage text={errors.tollAllowValue.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the toll allow value here. (Examples:
                    domestic,international,local).
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Call Timeout</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("callTimeOut", {
                      ...noSpecialCharactersValidator,
                      ...numberValidator,
                    })}
                  />
                  {errors.callTimeOut && (
                    <ErrorMessage text={errors.callTimeOut.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the ring time (delay in seconds) before sending a call
                    to voicemail.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Call Group</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("callGroup", {
                      ...noSpecialCharactersValidator,
                    })}
                  />
                  {errors.callGroup && (
                    <ErrorMessage text={errors.callGroup.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the user call group here. Groups available by default:
                    sales, support, billing.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Call Screen</label>
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    name=""
                    id="selectFormRow"
                    {...register("callScreen")}
                    defaultValue={"Disable"}
                  >
                    <option value="Enable">Enable</option>
                    <option value="Disable">Disable</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Choose whether to enable or disable call screening.
                  </label>
                </div>
              </div>
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
                    defaultValue={"A"}
                  >
                    <option value="D">Disabled</option>
                    <option value="A">All</option>
                    <option value="L">Local</option>
                    <option value="I">Inbound</option>
                    <option value="O">Outbound</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Choose whether to record local, inbound, outbound, or all.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Description</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("description", {
                      ...noSpecialCharactersValidator,
                    })}
                  />
                  {errors.description && (
                    <ErrorMessage text={errors.description.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the description.
                  </label>
                </div>
              </div>
              <div />
            </form>
          </div>
        </div>
      </section>
      {/* <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      /> */}
    </main>
  );
};

export default ExtensionsAdd;
