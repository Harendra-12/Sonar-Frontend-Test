import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import Select from "react-select";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Link } from "react-router-dom";
import {
  aiGeneralDeleteFunction,
  aiGeneralGetFunction,
  aiGeneralPostFunction,
  aiGeneralPutFunction,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";

const AiPhoneNumber = () => {
  const [refreshState, setRefreshState] = useState(false);
  const [addKnowledgeBase, setKnowledgeBase] = useState(false);
  const [idCopy, setIdCopy] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
  const [value, setValue] = useState();
  const [selectedOption, setSelectedOption] = useState("");
  const [linkCopy, setLinkCopy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState("");
  const [defaultName, setDefaultName] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [areaCode, setAreaCode] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [inboundCallAgent, setInboundCallAgent] = useState();
  const [outboundCallAgent, setOutboundCallAgent] = useState();
  const [numberProvider, setNumberProvider] = useState("twilio");
  const [showUrlField, setShowUrlField] = useState(false);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [availableNumbers, setAvailableNumbers] = useState([]);

  useEffect(() => {
    fetchAvailableAgents();
    fetchAvailableNumbers();
  }, []);

  // link copy function with dynamically state change
  const copyLink = (link) => {
    if (!link) return;
    setLinkCopy(link);
    navigator.clipboard.writeText(link);

    setTimeout(() => {
      setLinkCopy(null);
    }, 1000);
  };

  const formattedAgents = [
    { value: "null", label: "None (disabled inbound)" },
    ...availableAgents.map((agent) => ({
      value: agent.agent_id,
      label: `${agent.agent_name} - Version: ${agent.version}`,
    })),
  ];

  const fetchAvailableAgents = async () => {
    setLoading(true);
    const res = await aiGeneralGetFunction("/agent/all");
    if (res.status) {
      setAvailableAgents(res.data);
      // setInboundCallAgent(res.data[0]?.agent_id);
      // setOutboundCallAgent(res.data[0]?.agent_id);
      setLoading(false);
    } else {
      setLoading(false);
      console.error("Failed to fetch available LLMs");
    }
  };
  const fetchAvailableNumbers = async () => {
    const res = await aiGeneralGetFunction("/phonenumber/all");
    if (res.status) {
      setAvailableNumbers(res.data);
      if (res.data[0]) {
        const firstNumber = res.data[0];
        setSelectedNumber(firstNumber.phone_number);
        setDefaultName(firstNumber.nickname || firstNumber.phone_number || "");
        setAreaCode(firstNumber.area_code || "");
        setWebhookUrl(firstNumber.inbound_webhook_url || "");
        setInboundCallAgent(firstNumber.inbound_agent_id || "");
        setOutboundCallAgent(firstNumber.outbound_agent_id || "");
        setNumberProvider(firstNumber.number_provider || "twilio");
      }
    } else {
      console.error("Failed to fetch available phone numbers");
    }
  };

  const selectedAgent = (agentId) => {
    return availableAgents.find((agent) => agent.agent_id === agentId);
  };

  const handleCreateNumber = async () => {
    const inboundAgent = selectedAgent(inboundCallAgent);
    const outboundAgent = selectedAgent(outboundCallAgent);

    // Convert area code to integer or null if empty/invalid
    const parsedAreaCode = areaCode ? parseInt(areaCode, 10) : null;
    if (areaCode && isNaN(parsedAreaCode)) {
      toast.error("Area code must be a valid number");
      return;
    }

    const payload = {
      inbound_agent_id: inboundAgent ? inboundAgent.agent_id : null,
      inbound_agent_name: inboundAgent ? inboundAgent.agent_name : null,
      inbound_agent_version: inboundAgent ? inboundAgent.version : null,
      outbound_agent_id: outboundAgent ? outboundAgent.agent_id : null,
      area_code: parsedAreaCode,
      nickname: defaultName ? defaultName : null,
      inbound_webhook_url: webhookUrl ? webhookUrl : null,
      number_provider: numberProvider ? numberProvider : "twilio",
    };

    setLoading(true);
    const res = await aiGeneralPostFunction("/phonenumber/store", payload);
    if (res.status) {
      setAvailableNumbers([...availableNumbers, res.data]);
      setDefaultName(res?.data?.nickname || res?.data?.phone_number || "");
      setAreaCode("");
      setWebhookUrl("");
      setInboundCallAgent("");
      setOutboundCallAgent("");
      setNumberProvider("twilio");
      setShowUrlField(false);
      fetchAvailableAgents();
      fetchAvailableNumbers();
      setKnowledgeBase(false);
      toast.success("Phone number created successfully!");
    } else {
      console.error("Faild to create phone number: ", res);
      setLoading(false);
      toast.error("Failed to create phone number. Please try again.");
    }

    setLoading(false);
  };

  const handleUpdateNumber = async (updatedData = {}) => {
    if (!selectedNumber) {
      toast.error("Please select a phone number to update.");
      return;
    }

    const inboundAgent = selectedAgent(
      updatedData.inboundCallAgent || inboundCallAgent
    );
    const outboundAgent = selectedAgent(
      updatedData.outboundCallAgent || outboundCallAgent
    );

    // Prepare the payload with all required fields
    const newAreaCode = updatedData.areaCode || areaCode;
    const parsedAreaCode = newAreaCode ? parseInt(newAreaCode, 10) : null;
    if (newAreaCode && isNaN(parsedAreaCode)) {
      toast.error("Area code must be a valid number");
      return;
    }

    const payload = {
      phone_number: selectedNumber,
      inbound_agent_id: inboundAgent ? inboundAgent.agent_id : null,
      outbound_agent_id: outboundAgent ? outboundAgent.agent_id : null,
      inbound_agent_version: inboundAgent ? inboundAgent.version : null,
      outbound_agent_version: outboundAgent ? outboundAgent.version : null,
      area_code: parsedAreaCode,
      nickname: updatedData.defaultName || defaultName || null,
      inbound_webhook_url: updatedData.webhookUrl || webhookUrl || null,
      number_provider: updatedData.numberProvider || numberProvider || "twilio",
    };

    console.log("update numbr payload: ", payload);
    setLoading(true);
    try {
      const res = await aiGeneralPutFunction(
        `/phonenumber/update/${selectedNumber}`,
        payload
      );
      if (res.status) {
        await Promise.all([fetchAvailableAgents(), fetchAvailableNumbers()]);
        toast.success("Phone number updated successfully!");
      } else {
        console.error("Failed to update phone number: ", res);
        toast.error("Failed to update phone number. Please try again.");
      }
    } catch (error) {
      console.error("Error updating phone number:", error);
      toast.error("Failed to update phone number. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNumber = async () => {
    if (!selectedNumber) {
      toast.error("Please select a phone number to delete.");
      return;
    }
    setLoading(true);
    const res = await aiGeneralDeleteFunction(
      `/phonenumber/delete/${selectedNumber}`
    );
    if (res.status) {
      setAvailableNumbers(
        availableNumbers.filter((num) => num.phone_number !== selectedNumber)
      );
      setSelectedNumber("");
      setDefaultName("");
      setAreaCode("");
      setWebhookUrl("");
      setInboundCallAgent("");
      setOutboundCallAgent("");
      setNumberProvider("twilio");
      setShowUrlField(false);
      fetchAvailableAgents();
      toast.success("Phone number deleted successfully!");
    } else {
      console.error("Failed to delete phone number: ", res);
      toast.error("Failed to delete phone number. Please try again.");
    }
    setLoading(false);
  };

  const handleRefreshBtnClicked = () => {
    setRefreshState(true);
    // const shouldLoad = false
    // getData(shouldLoad);
  };

  if (loading) {
    return <CircularLoader />;
  }

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Phone Numbers" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>
                            Phone Numbers
                            <button
                              className="clearButton"
                              onClick={handleRefreshBtnClicked}
                              disabled={refreshState}
                            >
                              <i
                                className={
                                  refreshState
                                    ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                    : "fa-regular fa-arrows-rotate fs-5"
                                }
                              ></i>
                            </button>
                          </h4>
                          <p>You can manage yours Phone Numbers here</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="row p-3">
                        <div className="col-xxl-4 col-xl-5 col-lg-5 ">
                          <div className="KnowledgeLeftinfo">
                            <div className="info_header">
                              <h5 className="mb-0">Available Numbers</h5>
                              <button
                                className={`tableButton`}
                                role="button"
                                onClick={setKnowledgeBase}
                              >
                                <i className="fa-regular fa-plus" />
                              </button>
                            </div>
                            <div className="knowledge__list">
                              {availableNumbers.length === 0 ? (
                                <div className="flex items-center justify-center p-2 border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer">
                                  <span>No numbers available</span>
                                </div>
                              ) : (
                                availableNumbers.map((number, index) => (
                                  <div
                                    key={index}
                                    className="nav flex-column nav-pills me-3"
                                    id="v-pills-tab"
                                    role="tablist"
                                    aria-orientation="vertical"
                                  >
                                    <button
                                      className={`nav-link ${
                                        number?.phone_number === selectedNumber
                                          ? "active"
                                          : ""
                                      }`}
                                      id="v-pills-home-tab"
                                      data-bs-toggle="pill"
                                      data-bs-target="#v-pills-home"
                                      type="button"
                                      role="tab"
                                      aria-controls="v-pills-home"
                                      aria-selected="true"
                                      onClick={() => {
                                        // Update all state values when selecting a number
                                        setSelectedNumber(number?.phone_number);
                                        setDefaultName(
                                          number?.nickname ||
                                            number?.phone_number ||
                                            ""
                                        );
                                        setAreaCode(number?.area_code || "");
                                        setWebhookUrl(
                                          number?.inbound_webhook_url || ""
                                        );
                                        setInboundCallAgent(
                                          number?.inbound_agent_id || ""
                                        );
                                        setOutboundCallAgent(
                                          number?.outbound_agent_id || ""
                                        );
                                        setNumberProvider(
                                          number?.number_provider || "twilio"
                                        );
                                        setShowUrlField(
                                          !!number?.inbound_webhook_url
                                        );
                                      }}
                                    >
                                      <p className="mb-0">
                                        <i className="fa-solid fa-phone me-2"></i>{" "}
                                        {number?.phone_number}
                                      </p>
                                      {/* <p className='mb-0'>added on <span> 5/26/2025</span></p> */}
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-xxl-8 col-xl-7 col-lg-7 ">
                          <div
                            className="tab-content KnowledgeRightinfo"
                            id="v-pills-tabContent"
                          >
                            <div
                              className="tab-pane fade show active"
                              id="v-pills-home"
                              role="tabpanel"
                              aria-labelledby="v-pills-home-tab"
                            >
                              <div className="heading">
                                <div className="content">
                                  <div className="d-flex align-items-center">
                                    {isEdit ? (
                                      <input
                                        className={"formItem"}
                                        value={defaultName}
                                        onChange={(e) =>
                                          setDefaultName(e.target.value)
                                        }
                                        onBlur={() => {
                                          setIsEdit(false);
                                          handleUpdateNumber({ defaultName });
                                        }}
                                      />
                                    ) : (
                                      <h4 className="text-xl mb-0">
                                        {defaultName}
                                      </h4>
                                    )}
                                    <button
                                      variant={"outline"}
                                      size={"icon"}
                                      className={"clearButton2 ms-2"}
                                      onClick={() => setIsEdit(!isEdit)}
                                    >
                                      <i
                                        className={`fa-solid fa-${
                                          !isEdit
                                            ? "pen-to-square"
                                            : "floppy-disk"
                                        }`}
                                      />
                                    </button>
                                  </div>
                                  <div className="d-flex justify-content-start align-items-center gap-3">
                                    <p className="mb-0">
                                      ID: <span>{selectedNumber}</span>
                                      <button
                                        className="clearButton"
                                        onClick={() => {
                                          copyLink(selectedNumber);
                                        }}
                                      >
                                        <i
                                          className={
                                            linkCopy
                                              ? "fa-solid fa-check text_success"
                                              : "fa-solid fa-clone"
                                          }
                                        ></i>
                                      </button>
                                    </p>
                                    <p className="mb-0">
                                      Provider: <span>{numberProvider}</span>
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  {/* <p className='text-end mb-2 f-s-14'>Last Update on : <strong> 5/26/2025</strong></p> */}
                                  <div className="buttonGroup">
                                    <button
                                      className="panelButton danger"
                                      onClick={setDeletePopup}
                                    >
                                      <span className="text">Delete</span>
                                      <span className="icon">
                                        <i className="fa-solid fa-trash"></i>
                                      </span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="k_body px-3">
                                <div className="d_card mb-3">
                                  <div>
                                    <form>
                                      <div className="formRow flex-column align-items-start px-0">
                                        <div className="formLabel">
                                          <label>Inbound Call Agent</label>
                                        </div>
                                        <div className="col-12">
                                          <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            isDisabled={isDisabled}
                                            isLoading={isLoading}
                                            isClearable={isClearable}
                                            isRtl={isRtl}
                                            isSearchable={isSearchable}
                                            name="inboundCallAgent"
                                            value={formattedAgents.find(
                                              (option) =>
                                                option.value ===
                                                inboundCallAgent
                                            )}
                                            onChange={(option) => {
                                              const selected = option?.value;
                                              setInboundCallAgent(selected);
                                              handleUpdateNumber({
                                                inboundCallAgent: selected,
                                              });
                                            }}
                                            options={formattedAgents}
                                          />
                                        </div>
                                      </div>
                                      <div className="py-2">
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          id="toggleWebhook"
                                          onClick={() => {
                                            setShowUrlField(!showUrlField);
                                          }}
                                        />
                                        <label
                                          className="form-check-label ms-3"
                                          htmlFor="toggleWebhook"
                                        >
                                          Add on Inbound webhook.{" "}
                                          <Link to="" className="urlText">
                                            ( Learn More )
                                          </Link>
                                        </label>
                                        {showUrlField && (
                                          <div className="formRow flex-column align-items-start px-0 showUrl">
                                            <div className="formLabel">
                                              <label>Enter url</label>
                                            </div>
                                            <div className="col-12">
                                              <input
                                                type="text"
                                                className="formItem"
                                                placeholder="Enter url"
                                                onChange={(e) =>
                                                  setWebhookUrl(e.target.value)
                                                }
                                                onBlur={() => {
                                                  handleUpdateNumber({
                                                    webhookUrl,
                                                  });
                                                }}
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      <div className="formRow flex-column align-items-start px-0">
                                        <div className="formLabel">
                                          <label>Outbound Call Agent</label>
                                        </div>
                                        <div className="col-12">
                                          {/* <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            // defaultValue={colourOptions[0]}
                                            isDisabled={isDisabled}
                                            isLoading={isLoading}
                                            isClearable={isClearable}
                                            isRtl={isRtl}
                                            isSearchable={isSearchable}
                                            name="color"
                                            // options={colourOptions}
                                          /> */}
                                          <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            isDisabled={isDisabled}
                                            isLoading={isLoading}
                                            isClearable={isClearable}
                                            isRtl={isRtl}
                                            isSearchable={isSearchable}
                                            name="outboundCallAgent"
                                            value={formattedAgents.find(
                                              (option) =>
                                                option.value ===
                                                outboundCallAgent
                                            )}
                                            onChange={(option) => {
                                              const selected = option?.value;
                                              setOutboundCallAgent(selected);
                                              handleUpdateNumber({
                                                outboundCallAgent: selected,
                                              });
                                            }}
                                            options={formattedAgents}
                                          />
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {addKnowledgeBase && (
          <div className="popup ">
            <div className="popup music">
              <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                  <div
                    className="card px-0 col-5 shadow-none w50"
                    style={{
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div className="card-header bg-transparent ">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="card-title fs14 fw700 mb-0">
                            Buy Phone Number
                          </h5>
                        </div>
                        <button
                          className="clearButton2 xl"
                          onClick={() => setKnowledgeBase(false)}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    </div>
                    <div className="card-body aiAgentTab p-3">
                      {/* <div class="mt-3 baseNav">
                        <ul class="nav nav-pills" id="pills-tab" role="tablist">

                          <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="twilio-tab" data-bs-toggle="pill" data-bs-target="#twilio" type="button" role="tab" aria-controls="twilio" aria-selected="true">Import Twilio</button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className="nav-link" id="Vonage-tab" data-bs-toggle="pill" data-bs-target="#Vonage" type="button" role="tab" aria-controls="Vonage" aria-selected="false">Import Vonage</button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className="nav-link" id="import-tab" data-bs-toggle="pill" data-bs-target="#import" type="button" role="tab" aria-controls="import" aria-selected="false">Import Telnyx</button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className="nav-link" id="sip-tab" data-bs-toggle="pill" data-bs-target="#sip" type="button" role="tab" aria-controls="sip" aria-selected="false">BYO SIP Trunk Number</button>
                          </li>
                        </ul>
                        <div className="tab-content" id="pills-tabContent">
                          <div className="tab-pane fade show active" id="twilio" role="tabpanel" aria-labelledby="twilio-tab">
                            <form>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel mw-100">
                                  <label>Twilio Phone Number</label>
                                </div>
                                <div className="col-12">
                                  <PhoneInput
                                    defaultCountry="IN"
                                    placeholder="Enter phone number"
                                    value={value}
                                    onChange={setValue}
                                    className="custom-phone-input formItem"
                                  />
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>Twilio Account SID</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Twilio Account SID'
                                  />
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>Twilio Auth Token</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Twilio Auth Token'
                                  />
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>Label</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Label for Phone Number'
                                  />
                                </div>
                              </div>
                            </form>
                          </div>

                          <div className="tab-pane fade pb-3" id="Vonage" role="tabpanel" aria-labelledby="Vonage-tab">
                            <form>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel mw-100">
                                  <label>Vonage Phone Number</label>
                                </div>
                                <div className="col-12">
                                  <PhoneInput
                                    defaultCountry="IN"
                                    placeholder="Enter phone number"
                                    value={value}
                                    onChange={setValue}
                                    className="custom-phone-input formItem"
                                  />
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>API Key</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Enter API Key'
                                  />
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>API Secret</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Enter API Secret'
                                  />
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>Label</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Label for Phone Number'
                                  />
                                </div>
                              </div>
                            </form>

                          </div>

                          <div className="tab-pane fade" id="import" role="tabpanel" aria-labelledby="import-tab">
                            <form>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel mw-100">
                                  <label>Vonage Phone Number</label>
                                </div>
                                <div className="col-12">
                                  <PhoneInput
                                    defaultCountry="IN"
                                    placeholder="Enter phone number"
                                    value={value}
                                    onChange={setValue}
                                    className="custom-phone-input formItem"
                                  />
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>API Key</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Enter API Key'
                                  />
                                </div>
                              </div>

                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>Label</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Label for Phone Number'
                                  />
                                </div>
                              </div>
                            </form>

                          </div>
                          <div className="tab-pane fade" id="sip" role="tabpanel" aria-labelledby="sip-tab">
                            <form>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>Phone Number</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Phone Number'
                                  />
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start px-0">

                                <div className="col-12 formLabel mw-100">
                                  <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="checkDefault" />
                                    <label class="form-check-label" for="checkDefault">
                                      Allow non-E164 Phone Number <br />
                                      <span>Check this box to disabled E164 format validation and use custom phone number formats.</span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>Sip Trunk  Credential</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Enter API Key'
                                  />
                                </div>
                              </div>

                              <div className="formRow flex-column align-items-start px-0">
                                <div className="formLabel">
                                  <label>Label</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Label for Phone Number'
                                  />
                                </div>
                              </div>
                            </form>

                          </div>
                        </div>
                      </div> */}
                      <div className="formLabel">
                        <label>Provider</label>
                      </div>
                      <div className="row radio-input px-2">
                        <div className="col-6">
                          <label className="label radioLabel">
                            <p className="text">Twilio</p>
                            <input
                              type="radio"
                              id="twilio"
                              name="twilio"
                              value="twilio"
                              checked={numberProvider === "twilio"}
                              onChange={(e) =>
                                setNumberProvider(e.target.value)
                              }
                            />
                          </label>
                        </div>
                        <div className="col-6">
                          <label className="label radioLabel">
                            <p className="text">Telnyx</p>
                            <input
                              type="radio"
                              id="telnyx"
                              name="telnyx"
                              value="telnyx"
                              checked={numberProvider === "telnyx"}
                              onChange={(e) =>
                                setNumberProvider(e.target.value)
                              }
                            />
                          </label>
                        </div>
                        <div className="col-12 mt-3">
                          <div className="formLabel">
                            <label>Area Code (Optional)</label>
                          </div>
                          <div className="col-12">
                            <input
                              type="text"
                              className="formItem"
                              placeholder="e.g. 650"
                              value={areaCode}
                              onChange={(e) => {
                                // Only allow numbers
                                const value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                                setAreaCode(value);
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-12 mt-3">
                          <div className="noticeMessageBox">
                            <i class="fa-regular fa-circle-exclamation "></i>{" "}
                            <p className="mb-0 f-s-14">
                              This number incurs a monthly fee of $2.00.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" card-footer d-flex justify-content-end">
                      <div className="d-flex justify-content-end">
                        <button
                          className="panelButton  m-0"
                          onClick={handleCreateNumber}
                        >
                          <span className="text">Confirm</span>
                          <span className="icon">
                            <i className="fa-solid fa-check"></i>
                          </span>
                        </button>
                        <button
                          className="panelButton gray"
                          onClick={() => {
                            setKnowledgeBase(false);
                          }}
                        >
                          <span className="text">Cancel</span>
                          <span className="icon">
                            <i className="fa-solid fa-xmark"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {deletePopup && (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div className="row content col-xl-4 col-md-5">
                  <div className="col-12">
                    <div className="iconWrapper">
                      <i className="fa-duotone fa-circle-exclamation text-danger"></i>
                    </div>
                  </div>
                  <div className="col-12">
                    <h4 className="text-center text-danger">Confirmation!</h4>
                    <p className="text-center">
                      Are you sure! You want to delete this Number?
                    </p>

                    <div className="d-flex justify-content-center gap-2 mt-4">
                      <button
                        className="panelButton m-0"
                        onClick={handleDeleteNumber}
                      >
                        <span className="text">Delete</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray m-0 float-end"
                        onClick={() => {
                          setDeletePopup(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default AiPhoneNumber;
