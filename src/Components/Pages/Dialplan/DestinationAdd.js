import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DestinationAdd() {
  const navigate = useNavigate();
  const [domains, setDomains] = useState();
  const [users, setUsers] = useState();
  const [ringGroup, setRingGroup] = useState();
  const [extension, setExtension] = useState();
  const account = useSelector((state) => state.account);
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
        const apidata = await generalGetFunction(
          `/ringgroup?account=${account.account_id}`
        );
        const extensionData = await generalGetFunction(
          `/extension/search?account=${account.account_id}`
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

        if (apidata.status) {
          setRingGroup(apidata.data);
        } else {
          navigate("/");
        }
        if (extensionData.status) {
          setExtension(extensionData.data);
        } else {
          navigate("/");
        }
      }
      getDomain();
    }
  }, []);
  const [destination, setDestination] = useState({
    type: "Inbound",
    countryCode: "",
    countryCodeMissing: false,
    destination: "",
    destinationMissing: false,
    context: "",
    contextMissing: false,
    usage: "",
    usageMissing: false,
    domain: "",
    domainMissing: false,
    order: "",
    orderMissing: false,
    enabled: false,
    enabledMissing: false,
    description: "",
    descriptionMissing: false,
    callerIdName: "",
    callerIdNumber: "",
    condition: "",
    action: "",
    user: "",
    group: "",
    callerIdNamePrefix: "",
    record: "",
    holdMusic: "",
    distinctiveRing: "",
    accountCode: "",
    actionMissing: false
  });

  async function handleSubmit() {
    if (destination.countryCode === "") {
      setDestination((prevState) => ({
        ...prevState,
        countryCodeMissing: true,
      }));
    } else {
      setDestination((prevState) => ({
        ...prevState,
        countryCodeMissing: false,
      }));
    }
    if (destination.destination === "") {
      setDestination((prevState) => ({
        ...prevState,
        destinationMissing: true,
      }));
    } else {
      setDestination((prevState) => ({
        ...prevState,
        destinationMissing: false,
      }));
    }
    if (destination.context === "") {
      setDestination((prevState) => ({
        ...prevState,
        contextMissing: true,
      }));
    } else {
      setDestination((prevState) => ({
        ...prevState,
        contextMissing: false,
      }));
    }
    if (destination.usage === "") {
      setDestination((prevState) => ({
        ...prevState,
        usageMissing: true,
      }));
    } else {
      setDestination((prevState) => ({
        ...prevState,
        usageMissing: false,
      }));
    }
    if (destination.domain === "") {
      setDestination((prevState) => ({
        ...prevState,
        domainMissing: true,
      }));
    } else {
      setDestination((prevState) => ({
        ...prevState,
        domainMissing: false,
      }));
    }
    if (destination.order === "") {
      setDestination((prevState) => ({
        ...prevState,
        orderMissing: true,
      }));
    } else {
      setDestination((prevState) => ({
        ...prevState,
        orderMissing: false,
      }));
    }
    if (destination.enabled === "") {
      setDestination((prevState) => ({
        ...prevState,
        enabledMissing: true,
      }));
    } else {
      setDestination((prevState) => ({
        ...prevState,
        enabledMissing: false,
      }));
    }
    if (destination.description === "") {
      setDestination((prevState) => ({
        ...prevState,
        descriptionMissing: true,
      }));
    } else {
      setDestination((prevState) => ({
        ...prevState,
        descriptionMissing: false,
      }));
    }

    if (destination.action === "") {
      setDestination((prevState) => ({
        ...prevState,
        actionMissing: true,
      }));
    } else {
      setDestination((prevState) => ({
        ...prevState,
        actionMissing: false,
      }));
    }

    if (
      !(
        destination.action === "" ||
        destination.countryCode === "" ||
        destination.destination === "" ||
        destination.context === "" ||
        destination.usage === "" ||
        destination.domain === "" ||
        destination.order === "" ||
        destination.description === ""
      )
    ) {
      const parsedData = {
        type: destination.type,
        country_code: destination.countryCode,
        destination: destination.destination,
        context: destination.context,
        caller_Id_name: destination.callerIdName,
        caller_Id_number: destination.callerIdNumber,
        caller_Id_name_prefix: destination.callerIdNamePrefix,
        usage: destination.usage,
        domain: destination.domain,
        order: destination.order,
        destination_status: destination.enabled === "true" ? true : false,
        description: destination.description,
        account_id: account.account_id,
        user: destination.user,
        group: destination.group,
        record: destination.record,
        holdMusic: destination.holdMusic,
        dial_action: destination.action,
      };
      const apiData = await generalPostFunction(`/dialplan/store`, parsedData);
      if (apiData.status) {
        setDestination({
          type: "Inbound",
          countryCode: "",
          countryCodeMissing: false,
          destination: "",
          destinationMissing: false,
          context: "",
          contextMissing: false,
          usage: "",
          usageMissing: false,
          domain: "",
          domainMissing: false,
          order: "",
          orderMissing: false,
          enabled: false,
          enabledMissing: false,
          description: "",
          descriptionMissing: false,
          callerIdName: "",
          callerIdNumber: "",
          condition: "",
          action: "",
          user: "",
          group: "",
          callerIdNamePrefix: "",
          record: "",
          holdMusic: "",
          distinctiveRing: "",
          accountCode: "",
          actionMissing: false
        })
        toast.success(apiData.message);
      } else {
        toast.error(apiData.message);
      }
      console.log("All validated", parsedData);
    }
  }
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-12" id="subPageHeader">

                <div className="row px-xl-3">
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
                        onClick={handleSubmit}
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
                        <label htmlFor="">Type</label>
                      </div>
                      <div className="col-12">
                        <select
                          className="formItem"
                          name=""
                          id="selectFormRow"
                          value={destination.type}
                          onChange={(e) => {
                            setDestination((prevState) => ({
                              ...prevState,
                              type: e.target.value,
                            }));
                          }}
                        >
                          <option value="Inbound">Inbound</option>
                          <option value="Outbound">Outbound</option>
                          <option value="Local">Local</option>
                        </select>
                        <br />
                        <label htmlFor="data" className="formItemDesc">
                          Select the type.
                        </label>
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Country Code</label>
                        {destination.countryCodeMissing ? (
                          <label className="status missing">
                            Field missing
                          </label>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          value={destination.countryCode}
                          onChange={(e) => {
                            setDestination((prevState) => ({
                              ...prevState,
                              countryCode: e.target.value,
                            }));
                          }}
                          required="required"
                        />
                      </div>
                      <label htmlFor="data" className="formItemDesc">
                        Enter the country code.
                      </label>
                    </div>
                    {/* <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Trunk Prefix</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          
                          className="formItem"
                          
                          required="required"
                        />
                      </div>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Enter the trunk prefix.
                      </label>
                    </div> */}
                    {/* <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Area Code</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                         
                          className="formItem"
                          
                          required="required"
                        />
                      </div>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Enter the area code.
                      </label>
                    </div> */}
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Destination</label>
                        {destination.destinationMissing ? (
                          <label className="status missing">
                            Field missing
                          </label>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          value={destination.destination}
                          className="formItem"
                          onChange={(e) => {
                            setDestination((prevState) => ({
                              ...prevState,
                              destination: e.target.value,
                            }));
                          }}
                          required="required"
                        />
                      </div>
                      <label htmlFor="data" className="formItemDesc">
                        Enter the destination.
                      </label>
                    </div>
                    {/* <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Condition</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          value={destination.condition}
                          className="formItem"
                          onChange={(e)=>{
                            setDestination(prevState=>({
                              ...prevState,
                              condition:e.target.value
                            }))
                          }}
                          required="required"
                        />
                      </div>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Enter the destination condition.
                      </label>
                    </div> */}
                    {destination.type === "Inbound" ? (
                      <>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="">Caller ID Name</label>
                          </div>
                          <div className="col-12">
                            <input
                              type="text"
                              name="extension"
                              value={destination.callerIdName}
                              className="formItem"
                              onChange={(e) => {
                                setDestination((prevState) => ({
                                  ...prevState,
                                  callerIdName: e.target.value,
                                }));
                              }}
                              required="required"
                            />
                          </div>
                          <br />
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
                              value={destination.callerIdNumber}
                              className="formItem"
                              onChange={(e) => {
                                setDestination((prevState) => ({
                                  ...prevState,
                                  callerIdNumber: e.target.value,
                                }));
                              }}
                              required="required"
                            />
                          </div>
                          <br />
                          <label htmlFor="data" className="formItemDesc">
                            Enter the caller ID number.
                          </label>
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Context</label>
                        {destination.contextMissing ? (
                          <label className="status missing">
                            Field missing
                          </label>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          value={destination.context}
                          className="formItem"
                          onChange={(e) => {
                            setDestination((prevState) => ({
                              ...prevState,
                              context: e.target.value,
                            }));
                          }}
                          required="required"
                        />
                      </div>
                      <label htmlFor="data" className="formItemDesc">
                        Enter the context.
                      </label>
                    </div>
                    {/* <div className="formRow">
                      <div className="formLabel">
                        <label htmlFor="">Conditions</label>
                      </div>
                      <div className="col-12">
                        <select className="formItem" name="" id="selectFormRow">
                          <option selected="" />
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
                        <input
                          type="text"
                          name="extension"
                          
                          className="formItem ms-2"
                          
                          required="required"
                        />
                        <select className="formItem mt-2" name="" id="selectFormRow">
                          <option selected="" />
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
                        <button
                          className="formButton ms-2"
                          type="button"
                          effect="ripple"
                        >
                          <i className="fa-regular fa-caret-left" />
                        </button>
                        <br />
                        <label htmlFor="data" className="formItemDesc">
                          If the condition matches perform the action.
                        </label>
                      </div>
                    </div> */}
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Actions</label>
                        {destination.actionMissing ? (
                          <label className="status missing">
                            Field missing
                          </label>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="col-12">
                        <select className="formItem" name="" id="selectFormRow" value={destination.action} onChange={(e) => {
                          setDestination(prevState => ({
                            ...prevState,
                            action: e.target.value
                          }))
                        }}>
                          <option selected="" value="" />
                          <optgroup label="Extension" disabled />
                          {extension &&
                            extension.map((item, key) => {
                              return (
                                <option key={key} value={item.extension}>
                                  {item.extension}
                                </option>
                              );
                            })}
                          <optgroup label="Ring Group" disabled />
                          {ringGroup &&
                            ringGroup.map((item, key) => {
                              return (
                                <option key={key} value={item.extension}>
                                  {item.extension}
                                </option>
                              );
                            })}
                        </select>

                        <br />
                        <label htmlFor="data" className="formItemDesc">
                          Add additional actions.
                        </label>
                      </div>
                    </div>
                    {destination.type === "Inbound" ? (
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
                              value={destination.user}
                              onChange={(e) => {
                                setDestination((prevState) => ({
                                  ...prevState,
                                  user: e.target.value,
                                }));
                              }}
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
                            <br />
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
                              value={destination.group}
                              onChange={(e) => {
                                setDestination((prevState) => ({
                                  ...prevState,
                                  group: e.target.value,
                                }));
                              }}
                            >
                              <option selected="" value="" />
                              {ringGroup &&
                                ringGroup.map((item, key) => {
                                  return (
                                    <option key={key} value={item.name}>
                                      {item.name}
                                    </option>
                                  );
                                })}

                              {/* <option value="agent">agent</option>
                              <option value="fax">fax</option>
                              <option value="public">public</option> */}
                            </select>
                            <br />
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
                              value={destination.callerIdNamePrefix}
                              className="formItem"
                              onChange={(e) => {
                                setDestination((prevState) => ({
                                  ...prevState,
                                  callerIdNamePrefix: e.target.value,
                                }));
                              }}
                              required="required"
                            />
                            <br />
                            <label htmlFor="data" className="formItemDesc">
                              Set a prefix on the caller ID name.
                            </label>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    {destination.type === "Outbound" ? (
                      ""
                    ) : (
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
                              value={destination.record}
                              onChange={(e) => {
                                setDestination((prevState) => ({
                                  ...prevState,
                                  record: e.target.value,
                                }));
                              }}
                            >
                              <option selected="" value="true">
                                True
                              </option>
                              <option value="false">False</option>
                              <option value="" />
                            </select>
                            <br />
                            <label htmlFor="data" className="formItemDesc">
                              Save the recording.
                            </label>
                          </div>
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
                              value={destination.holdMusic}
                              onChange={(e) => {
                                setDestination((prevState) => ({
                                  ...prevState,
                                  holdMusic: e.target.value,
                                }));
                              }}
                            >
                              <option selected="" value="default">
                                default
                              </option>
                              <option value="none">none</option>
                              <option value="" />
                            </select>
                            <br />
                            <label htmlFor="data" className="formItemDesc">
                              Save the recording.
                            </label>
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="">Distinctive Ring</label>
                          </div>
                          <div className="col-12">
                            <input
                              type="text"
                              name="extension"
                              value={destination.distinctiveRing}
                              className="formItem"
                              onChange={(e) => {
                                setDestination((prevState) => ({
                                  ...prevState,
                                  distinctiveRing: e.target.value,
                                }));
                              }}
                              required="required"
                            />
                            <br />
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
                              value={destination.accountCode}
                              className="formItem"
                              onChange={(e) => {
                                setDestination((prevState) => ({
                                  ...prevState,
                                  accountCode: e.target.value,
                                }));
                              }}
                              required="required"
                            />
                            <br />
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
                        {destination.usageMissing ? (
                          <label className="status missing">
                            Field missing
                          </label>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="col-12">
                        <select
                          className="formItem"
                          name=""
                          id="selectFormRow"
                          value={destination.usage}
                          onChange={(e) => {
                            setDestination((prevState) => ({
                              ...prevState,
                              usage: e.target.value,
                            }));
                          }}
                        >
                          <option value=""></option>
                          <option value="voice">Voice</option>
                          <option value="text">Text</option>
                          <option value="fax">Fax</option>
                          <option value="emergency">Emergency</option>
                        </select>

                        <br />
                        <label htmlFor="data" className="formItemDesc">
                          Set how the Destination will be used.
                        </label>
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="selectFormRow">Domain</label>
                        {destination.domainMissing ? (
                          <label className="status missing">
                            Field missing
                          </label>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="col-12">
                        <select
                          className="formItem"
                          name=""
                          id="selectFormRow"
                          value={destination.domain}
                          onChange={(e) => {
                            setDestination((prevState) => ({
                              ...prevState,
                              domain: e.target.value,
                            }));
                          }}
                        >
                          <option value=""></option>
                          {domains &&
                            domains.map((item, key) => {
                              return <option value={item[0]} key={key}>{item[1]}</option>;
                            })}
                        </select>
                        <br />
                        <label htmlFor="data" className="formItemDesc">
                          Select the Domain.
                        </label>
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="selectFormRow">Order</label>
                        {destination.orderMissing ? (
                          <label className="status missing">
                            Field missing
                          </label>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="col-12">
                        <select
                          className="formItem"
                          name=""
                          id="selectFormRow"
                          value={destination.order}
                          onChange={(e) => {
                            setDestination((prevState) => ({
                              ...prevState,
                              order: e.target.value,
                            }));
                          }}
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
                    </div>

                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Description</label>
                        {destination.descriptionMissing ? (
                          <label className="status missing">
                            Field missing
                          </label>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          value={destination.description}
                          onChange={(e) => {
                            setDestination((prevState) => ({
                              ...prevState,
                              description: e.target.value,
                            }));
                          }}
                          required="required"
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="selectFormRow">Status</label>
                      </div>
                      <div className="col-12">
                        <select
                          className="formItem"
                          name=""
                          id="selectFormRow"
                          value={destination.enabled}
                          onChange={(e) => {
                            setDestination((prevState) => ({
                              ...prevState,
                              enabled: e.target.value,
                            }));
                          }}
                        >
                          <option selected="" value={true}>
                            True
                          </option>
                          <option value={false}>False</option>
                        </select>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
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
