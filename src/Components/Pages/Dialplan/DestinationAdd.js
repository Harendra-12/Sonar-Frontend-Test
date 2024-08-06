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
import { lengthValidator, requiredValidator } from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";

function DestinationAdd() {
  const location = useLocation();
  const locationData = location.state;
  console.log("This is location data", locationData);
  const navigate = useNavigate();
  const [domains, setDomains] = useState();
  const [users, setUsers] = useState();
  const account = useSelector((state) => state.account);
  const {
    register, watch, setValue,formState: { errors }, handleSubmit, reset
  } = useForm()
  useEffect(() => {
    if (account === null) {
      navigate("/");
    } else {
      async function getDomain() {
        const domain = await generalGetFunction(
          `/domain/search?account=${account.account_id}`
        );
        const apidataUser = await generalGetFunction(
          `/user/search?account=${account.account_id}`
        );
        if (domain.status) {
          setDomains(
            domain.data.map((item) => {
              return [item.id, item.domain_name];
            })
          );
        } else {
          navigate("/");
        }
        if (apidataUser.status) {
          setUsers(apidataUser.data);
        } else {
          navigate("/");
        }
      }
      getDomain();
    }
  }, []);
 

  const hadleFormSubmit = handleSubmit(async (data) => {

    const payload = {...data, ...{account_id:account.account_id, 
      destination_status: data.destination_status == "true"? true : false}}
    const apiData = await generalPostFunction(`/dialplan/store`, payload);
        if (apiData.status) {
          reset()
          toast.success(apiData.message);
        } else {
          const errorMessage = Object.keys(apiData.errors);
          toast.error(apiData.errors[errorMessage[0]][0]);
        }
  })

  // async function handleSubmit() {
  //   if (destination.countryCode === "") {
  //     setDestination((prevState) => ({
  //       ...prevState,
  //       countryCodeMissing: true,
  //     }));
  //   } else {
  //     setDestination((prevState) => ({
  //       ...prevState,
  //       countryCodeMissing: false,
  //     }));
  //   }
  //   if (destination.destination === "") {
  //     setDestination((prevState) => ({
  //       ...prevState,
  //       destinationMissing: true,
  //     }));
  //   } else {
  //     setDestination((prevState) => ({
  //       ...prevState,
  //       destinationMissing: false,
  //     }));
  //   }
  //   if (destination.context === "") {
  //     setDestination((prevState) => ({
  //       ...prevState,
  //       contextMissing: true,
  //     }));
  //   } else {
  //     setDestination((prevState) => ({
  //       ...prevState,
  //       contextMissing: false,
  //     }));
  //   }
  //   if (destination.usage === "") {
  //     setDestination((prevState) => ({
  //       ...prevState,
  //       usageMissing: true,
  //     }));
  //   } else {
  //     setDestination((prevState) => ({
  //       ...prevState,
  //       usageMissing: false,
  //     }));
  //   }
  //   if (destination.domain === "") {
  //     setDestination((prevState) => ({
  //       ...prevState,
  //       domainMissing: true,
  //     }));
  //   } else {
  //     setDestination((prevState) => ({
  //       ...prevState,
  //       domainMissing: false,
  //     }));
  //   }
  //   if (destination.order === "") {
  //     setDestination((prevState) => ({
  //       ...prevState,
  //       orderMissing: true,
  //     }));
  //   } else {
  //     setDestination((prevState) => ({
  //       ...prevState,
  //       orderMissing: false,
  //     }));
  //   }
  //   if (destination.enabled === "") {
  //     setDestination((prevState) => ({
  //       ...prevState,
  //       enabledMissing: true,
  //     }));
  //   } else {
  //     setDestination((prevState) => ({
  //       ...prevState,
  //       enabledMissing: false,
  //     }));
  //   }
  //   if (destination.description === "") {
  //     setDestination((prevState) => ({
  //       ...prevState,
  //       descriptionMissing: true,
  //     }));
  //   } else {
  //     setDestination((prevState) => ({
  //       ...prevState,
  //       descriptionMissing: false,
  //     }));
  //   }

  //   if (destination.action === "") {
  //     setDestination((prevState) => ({
  //       ...prevState,
  //       actionMissing: true,
  //     }));
  //   } else {
  //     setDestination((prevState) => ({
  //       ...prevState,
  //       actionMissing: false,
  //     }));
  //   }

  //   if (
  //     !(
  //       destination.action === "" ||
  //       destination.countryCode === "" ||
  //       destination.destination === "" ||
  //       destination.context === "" ||
  //       destination.usage === "" ||
  //       destination.domain === "" ||
  //       destination.order === "" ||
  //       destination.description === ""
  //     )
  //   ) {
  //     const parsedData = {
  //       type: destination.type,
  //       country_code: destination.countryCode,
  //       destination: destination.destination,
  //       context: destination.context,
  //       caller_Id_name: destination.callerIdName,
  //       caller_Id_number: destination.callerIdNumber,
  //       caller_Id_name_prefix: destination.callerIdNamePrefix,
  //       usage: destination.usage,
  //       domain: destination.domain,
  //       order: destination.order,
  //       destination_status: destination.enabled === "true" ? true : false,
  //       description: destination.description,
  //       account_id: account.account_id,
  //       user: destination.user,
  //       group: destination.group,
  //       record: destination.record,
  //       holdMusic: destination.holdMusic,
  //       dial_action: destination.action,
  //     };
  //     const apiData = await generalPostFunction(`/dialplan/store`, parsedData);
  //     if (apiData.status) {
  //       setDestination({
  //         type: "Inbound",
  //         countryCode: "",
  //         countryCodeMissing: false,
  //         destination: "",
  //         destinationMissing: false,
  //         context: "",
  //         contextMissing: false,
  //         usage: "",
  //         usageMissing: false,
  //         domain: "",
  //         domainMissing: false,
  //         order: "",
  //         orderMissing: false,
  //         enabled: false,
  //         enabledMissing: false,
  //         description: "",
  //         descriptionMissing: false,
  //         callerIdName: "",
  //         callerIdNumber: "",
  //         condition: "",
  //         action: "",
  //         user: "",
  //         group: "",
  //         callerIdNamePrefix: "",
  //         record: "",
  //         holdMusic: "",
  //         distinctiveRing: "",
  //         accountCode: "",
  //         actionMissing: false,
  //       });
  //       toast.success(apiData.message);
  //     } else {
  //       const errorMessage = Object.keys(apiData.errors);
  //       toast.error(apiData.errors[errorMessage[0]][0]);
  //     }
  //     console.log("All validated", parsedData);
  //   }
  // }

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0">
            <div className="row justify-content-center" id="subPageHeader">
              <div className="col-xl-9 my-auto">
                <h4 className="my-auto">Destination Add</h4>
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
                        {...  ("type", {...requiredValidator})}
                    
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
                      {...register("country_code", {...requiredValidator, ...lengthValidator(1,4)})}
                  
                    />
                  {errors.country_code && <ErrorMessage text={errors.country_code.message} />}
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
                      {...register("destination", {...requiredValidator})}
              
                    />
                  {errors.destination && <ErrorMessage text={errors.destination.message} />}
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
                          {...register("caller_Id_name")}
                        
                        />
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
                          {...register("caller_Id_number")}
                          
                        />
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
                      {...register("context", {...requiredValidator})}
                     
                    />
                  {errors.context && <ErrorMessage text={errors.context.message} />}
                  </div>
                  <label htmlFor="data" className="formItemDesc">
                    Enter the context.
                  </label>
                </div>
                <div className="formRow col-xl-3">
                  <ActionList
                    // getDropdownValue={actionListValue}
                    // value={destination.action}
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
                          {...register("caller_Id_name_prefix")}
                         
                        />

                        <label htmlFor="data" className="formItemDesc">
                          Set a prefix on the caller ID name.
                        </label>
                      </div>
                    </div>
                  </>
                ) }

                {watch().type !== "Outbound" &&
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
                          {...register("distinctiveRing")}
                        
                        />

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
                          {...register("accountCode")}
                       
                        />

                        <label htmlFor="data" className="formItemDesc">
                          Enter account code.
                        </label>
                      </div>
                    </div>
                  </>
                }
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Usage</label>
                  
                  </div>
                  <div className="col-12 d-flex flex-column">
                    <select
                      className="formItem"
                      name=""
                      id="selectFormRow"
                      {...register("usage",  {...requiredValidator})}
                    
                    >
                      <option disabled value=""></option>
                      <option value="voice">Voice</option>
                      <option value="text">Text</option>
                      <option value="fax">Fax</option>
                      <option value="emergency">Emergency</option>
                    </select>
                    {errors.usage && <ErrorMessage text={errors.usage.message} />}
                    <label htmlFor="data" className="formItemDesc">
                      Set how the Destination will be used.
                    </label>
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="selectFormRow">Domain</label>
                   
                  </div>
                  <div className="col-12 d-flex flex-column">
                    <select
                      className="formItem"
                      name=""
                      id="selectFormRow"
                      {...register("domain",  {...requiredValidator})}
                    
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
                  {errors.domain && <ErrorMessage text={errors.domain.message} />}
                  </div>
                  <label htmlFor="data" className="formItemDesc">
                    Select the Domain.
                  </label>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="selectFormRow">Order</label>
                  
                  </div>
                  <div className="col-12">
                    <select
                      className="formItem"
                      name=""
                      id="selectFormRow"
                      {...register("order",  {...requiredValidator})}
                      
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
                      {...register("description",  {...requiredValidator})}
                     
                    />
                    {errors.description && <ErrorMessage text={errors.description.message} />}
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
                  
                      {...register("destination_status", {...requiredValidator,
                     

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
                    {errors.destination_status && <ErrorMessage text={errors.destination_status.message} />}
                  </div>

                 
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <ToastContainer
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
      />
    </>
  );
}

export default DestinationAdd;
