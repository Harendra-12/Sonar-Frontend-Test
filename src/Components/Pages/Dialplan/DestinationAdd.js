/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ActionList from "../../CommonComponents/ActionList";
import { useForm } from "react-hook-form";
import {
  lengthValidator,
  noSpecialCharactersValidator,
  requiredValidator,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import Header from "../../CommonComponents/Header";

function DestinationAdd() {
  const location = useLocation();
  const locationData = location.state;
  console.log("This is location data", locationData);
  const navigate = useNavigate();
  // const [domains, setDomains] = useState();
  const [users, setUsers] = useState();
  const account = useSelector((state) => state.account);
  const domain = useSelector((state) => state.domain);
  const { id: domainId } = domain;
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  useEffect(() => {
    if (account === null) {
      navigate("/");
    } else {
      async function getDomain() {
        // const domain = await generalGetFunction(
        //   `/domain/search?account=${account.account_id}`
        // );
        const apidataUser = await generalGetFunction(
          `/user/search?account=${account.account_id}`
        );
        // if (domain.status) {
        //   setDomains(
        //     domain.data.map((item) => {
        //       return [item.id, item.domain_name];
        //     })
        //   );
        // } else {
        //   navigate("/");
        // }
        if (apidataUser.status) {
          setUsers(apidataUser.data);
        } else {
          navigate("/");
        }
      }
      getDomain();
    }
  }, []);

  const actionListValue = (value) => {
    setValue("dial_action", value[0]);
  };

  const hadleFormSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      ...{
        account_id: account.account_id,
        destination_status: data.destination_status == "true" ? true : false,
        domain: `${domainId}`,
      },
    };
    const apiData = await generalPostFunction(`/dialplan/store`, payload);
    if (apiData.status) {
      reset();
      toast.success(apiData.message);
    } else {
      const errorMessage = Object.keys(apiData.errors);
      toast.error(apiData.errors[errorMessage[0]][0]);
    }
  });

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0">
            <Header title="Destination Add" />
            <div id="subPageHeader">
              <div className="col-xl-9 my-auto">
                {/* <h4 className="my-auto">Destination Add</h4> */}
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
                    onClick={hadleFormSubmit}
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
                {locationData ? (
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Selected DID</label>
                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        value={locationData.did}
                        disabled
                      />
                    </div>
                    <label htmlFor="data" className="formItemDesc">
                      Selected DID.
                    </label>
                  </div>
                ) : (
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Type</label>
                    </div>
                    <div className="col-12">
                      <select
                        className="formItem"
                        id="selectFormRow"
                        defaultValue={"Inbound"}
                        {...("type", { ...requiredValidator })}
                      >
                        <option value="Inbound">Inbound</option>
                        <option value="Outbound">Outbound</option>
                        <option value="Local">Local</option>
                      </select>
                    </div>
                    {errors.type && <ErrorMessage text={errors.type.message} />}
                    <label htmlFor="data" className="formItemDesc">
                      Select the type.
                    </label>
                  </div>
                )}
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Country Code</label>
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      name="extension"
                      className="formItem"
                      {...register("country_code", {
                        ...requiredValidator,
                        ...lengthValidator(1, 4),
                        ...noSpecialCharactersValidator,
                      })}
                    />
                    {errors.country_code && (
                      <ErrorMessage text={errors.country_code.message} />
                    )}
                  </div>
                  <label htmlFor="data" className="formItemDesc">
                    Enter the country code.
                  </label>
                </div>
                <div className="formRow col-xl-3 ">
                  <div className="formLabel">
                    <label htmlFor="">Destination</label>
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      name="extension"
                      className="formItem"
                      {...register("destination", {
                        ...requiredValidator,
                        ...noSpecialCharactersValidator,
                      })}
                    />
                    {errors.destination && (
                      <ErrorMessage text={errors.destination.message} />
                    )}
                  </div>
                  <label htmlFor="data" className="formItemDesc">
                    Enter the destination.
                  </label>
                </div>
                {watch().type === "Inbound" && (
                  <>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Caller ID Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          {...register("caller_Id_name", {
                            ...noSpecialCharactersValidator,
                          })}
                        />
                        {errors.caller_Id_name && (
                          <ErrorMessage text={errors.caller_Id_name.message} />
                        )}
                      </div>

                      <label htmlFor="data" className="formItemDesc">
                        Enter the caller ID name.
                      </label>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Caller ID Number</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          {...register("caller_Id_number", {
                            ...noSpecialCharactersValidator,
                          })}
                        />
                        {errors.caller_Id_number && (
                          <ErrorMessage
                            text={errors.caller_Id_number.message}
                          />
                        )}
                      </div>

                      <label htmlFor="data" className="formItemDesc">
                        Enter the caller ID number.
                      </label>
                    </div>
                  </>
                )}

                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Context</label>
                  </div>
                  <div className="col-12  d-flex flex-column">
                    <input
                      type="text"
                      name="extension"
                      className="formItem"
                      {...register("context", {
                        ...requiredValidator,
                        ...noSpecialCharactersValidator,
                      })}
                    />
                    {errors.context && (
                      <ErrorMessage text={errors.context.message} />
                    )}
                  </div>
                  <label htmlFor="data" className="formItemDesc">
                    Enter the context.
                  </label>
                </div>
                <div className="formRow col-xl-3">
                  <ActionList
                    getDropdownValue={actionListValue}
                    value={watch().dial_action}
                  />
                </div>
                {watch().type === "Inbound" && (
                  <>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">User</label>
                      </div>
                      <div className="col-12">
                        <select
                          className="formItem"
                          name=""
                          id="selectFormRow"
                          {...register("user")}
                        >
                          <option value=""></option>
                          {users &&
                            users.map((item, key) => {
                              return (
                                <option key={key} value={item.id}>
                                  {item.username}
                                </option>
                              );
                            })}
                        </select>

                        <label htmlFor="data" className="formItemDesc">
                          Assign this destination to a user.
                        </label>
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Group</label>
                      </div>
                      <div className="col-12">
                        <select
                          className="formItem"
                          name=""
                          id="selectFormRow"
                          {...register("group")}
                        >
                          <option selected="" value="" />
                          {/* {ringGroup &&
                            ringGroup.map((item, key) => {
                              return (
                                <option key={key} value={item.name}>
                                  {item.name}
                                </option>
                              );
                            })} */}
                        </select>

                        <label htmlFor="data" className="formItemDesc">
                          Assign this destination to a group.
                        </label>
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Caller ID Name Prefix</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          {...register("caller_Id_name_prefix", {
                            ...noSpecialCharactersValidator,
                          })}
                        />

                        {errors.caller_Id_name_prefix && (
                          <ErrorMessage
                            text={errors.caller_Id_name_prefix.message}
                          />
                        )}

                        <label htmlFor="data" className="formItemDesc">
                          Set a prefix on the caller ID name.
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {watch().type !== "Outbound" && (
                  <>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="selectFormRow">Record</label>
                      </div>
                      <div className="col-12">
                        <select
                          className="formItem"
                          name=""
                          id="selectFormRow"
                          {...register("caller_Id_name_prefix")}
                        >
                          <option selected="" value="true">
                            True
                          </option>
                          <option value="false">False</option>
                          <option value="" />
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
                          <option value="" />
                        </select>
                      </div>
                      <label htmlFor="data" className="formItemDesc">
                        Save the recording.
                      </label>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Distinctive Ring</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          {...register("distinctiveRing", {
                            ...noSpecialCharactersValidator,
                          })}
                        />

                        {errors.distinctiveRing && (
                          <ErrorMessage text={errors.distinctiveRing.message} />
                        )}

                        <label htmlFor="data" className="formItemDesc">
                          Select a sound for a distinctive ring.
                        </label>
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Account Code</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          {...register("accountCode", {
                            ...noSpecialCharactersValidator,
                          })}
                        />

                        {errors.accountCode && (
                          <ErrorMessage text={errors.accountCode.message} />
                        )}

                        <label htmlFor="data" className="formItemDesc">
                          Enter account code.
                        </label>
                      </div>
                    </div>
                  </>
                )}
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Usage</label>
                  </div>
                  <div className="col-12 d-flex flex-column">
                    <select
                      className="formItem"
                      name=""
                      id="selectFormRow"
                      {...register("usage", { ...requiredValidator })}
                    >
                      <option disabled value=""></option>
                      <option value="voice">Voice</option>
                      <option value="text">Text</option>
                      <option value="fax">Fax</option>
                      <option value="emergency">Emergency</option>
                    </select>
                    {errors.usage && (
                      <ErrorMessage text={errors.usage.message} />
                    )}
                    <label htmlFor="data" className="formItemDesc">
                      Set how the Destination will be used.
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
                      name=""
                      id="selectFormRow"
                      {...register("domain", { ...requiredValidator })}
                    >
                      <option value=""></option>
                      {domains &&
                        domains.map((item, key) => {
                          return (
                            <option value={item[0]} key={key}>
                              {item[1]}
                            </option>
                          );
                        })}
                    </select>
                    {errors.domain && (
                      <ErrorMessage text={errors.domain.message} />
                    )}
                  </div>
                  <label htmlFor="data" className="formItemDesc">
                    Select the Domain.
                  </label>
                </div> */}
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="selectFormRow">Order</label>
                  </div>
                  <div className="col-12">
                    <select
                      className="formItem"
                      name=""
                      id="selectFormRow"
                      {...register("order", { ...requiredValidator })}
                    >
                      <option selected="" value=""></option>
                      <option value={210}>210</option>
                      <option value={220}>220</option>
                      <option value={230}>230</option>
                      <option value={240}>240</option>
                      <option value={250}>250</option>
                      <option value={260}>260</option>
                      <option value={270}>270</option>
                      <option value={280}>280</option>
                      <option value={290}>290</option>
                      <option value={300}>300</option>
                    </select>
                  </div>
                  {errors.order && <ErrorMessage text={errors.order.message} />}
                </div>

                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Description</label>
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      name="extension"
                      className="formItem"
                      {...register("description", {
                        ...requiredValidator,
                        ...noSpecialCharactersValidator,
                      })}
                    />
                    {errors.description && (
                      <ErrorMessage text={errors.description.message} />
                    )}
                  </div>
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
                      {...register("destination_status", {
                        ...requiredValidator,
                      })}
                    >
                      <option disabled value="">
                        Select
                      </option>
                      <option selected="" value={true}>
                        True
                      </option>
                      <option value={false}>False</option>
                    </select>
                    {errors.destination_status && (
                      <ErrorMessage text={errors.destination_status.message} />
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
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
    </>
  );
}

export default DestinationAdd;
