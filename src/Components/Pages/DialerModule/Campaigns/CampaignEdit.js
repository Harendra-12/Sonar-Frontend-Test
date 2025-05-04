/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Header from "../../../CommonComponents/Header";
import { useLocation, useNavigate } from "react-router-dom";
import {
  backToTop,
  featureUnderdevelopment,
  fileUploadFunction,
  generalDeleteFunction,
  generalGetFunction,
  generalPostFunction,
  generalPutFunction,
} from "../../../GlobalFunction/globalFunction";
import PaginationComponent from "../../../CommonComponents/PaginationComponent";
import { useForm } from "react-hook-form";
import {
  numberValidator,
  requiredValidator,
} from "../../../validations/validation";
import ErrorMessage from "../../../CommonComponents/ErrorMessage";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import CircularLoader from "../../../Loader/CircularLoader";
function CampaignCreate() {
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const [stepSelector, setStepSelector] = useState(1);
  const [did, setDid] = useState([]);
  const [agents, setAgents] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [agentPerPage, setAgentPerPage] = useState(10);
  const [agentSearch, setAgentSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completedStep, setCompletedStep] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState([]);
  const [newFile, setNewFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [availableDidSearch, setAvailableDidSearch] = useState("");
  const [filteredDids, setFilteredDids] = useState([]);
  const queryParams = new URLSearchParams(useLocation().search);
  const value = queryParams.get("id");
  const [popUp, setPopUp] = useState(false);
  const [leadsEditState, setLeadsEditState] = useState();
  const [editState, seteditState] = useState();
  const [editSteps, seteditSteps] = useState({
    firstStep: false,
    secondStep: false,
    thirdStep: false,
    fourthStep: false,
  });
  const [addNewCsvToggle, setAddNewCsvToggle] = useState(false);
  const [addLeadInternalToggle, setAddLeadInternalToggle] = useState(false);
  const [allDisposition, setAllDisposition] = useState([]);
  const [selectedDesposition, setSelectedDisposition] = useState([]);
  const [campaignRefresh, setcampaignRefresh] = useState(0);
  const [matchIdAgent, setmatchIdAgent] = useState([]);
  const [unmatchIdAgent, setunmatchIdAgent] = useState([]);
  const [dispoState, setDispoState] = useState([
    { name: "", id: "", state: "" }
  ]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch
  } = useForm();

  const handleDeleteAgent = async (id) => {
    setLoading(true);
    const delteAgent = await generalDeleteFunction(
      `/campaign-agent/destroy/${id}`
    );

    if (delteAgent.status) {
      setcampaignRefresh((prev) => prev + 1);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  // Getting disposition data
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/disposition/all`)
      if (apiData?.status) {
        setAllDisposition(apiData.data)
      }
    }
    getData()
  }, [])

  useEffect(() => {
    if (
      editSteps.firstStep &&
      !editSteps.secondStep &&
      !editSteps.thirdStep &&
      !editSteps.fourthStep
    ) {
      setCompletedStep(1);
      setStepSelector(2);
    } else if (
      editSteps.firstStep &&
      editSteps.secondStep &&
      !editSteps.thirdStep &&
      !editSteps.fourthStep
    ) {
      setCompletedStep(2);
      setStepSelector(3);
    } else if (
      editSteps.firstStep &&
      editSteps.secondStep &&
      editSteps.thirdStep &&
      !editSteps.fourthStep
    ) {
      setCompletedStep(3);
      setStepSelector(4);
    } else {
      setCompletedStep(4);
    }
  }, [editSteps]);

  useEffect(() => {
    async function getDidData() {
      const getDid = await generalGetFunction(`/campaign/show/${value}`);

      if (getDid?.status) {
        const { dialer, agents, leads } = getDid.data;
        setSelectedDisposition(getDid.data.disposition.map((item) => { return ({ id: item.disposition_id, rechain: item.rechain }) }));
        seteditSteps({
          firstStep: true,
          secondStep: dialer != null,
          thirdStep: agents.length !== 0,
          fourthStep: leads.length > 0,
        });
        if (leads.length > 0) {
          setCompletedStep(4);
        }
      }
      seteditState(getDid.data);
    }
    getDidData();
  }, [value, campaignRefresh]);

  const findBusinessNum = () => {
    const bussNum = JSON.parse(editState.business_numbers);
    setSelectedItems(bussNum);
  };

  const findAgents = () => {
    const agent = editState?.agents;
    setSelectedAgent(agent?.map((item) => item.user_id));
  };

  useEffect(() => {
    if (editState && editState.agents.length === 0) {
      setunmatchIdAgent(agents.data);
      setmatchIdAgent([]);
    } else if (editState && editState.agents.length !== 0) {
      const agentsArr = agents?.data;
      const EditStateAgent = editState?.agents;
      const matchId = agentsArr
        ?.filter(
          (item) => EditStateAgent.some((agent) => agent.user_id === item.id) // Filtering logic
        )
        .map((item) => {
          // Find the matching user_id from EditStateAgent
          const matchedAgent = EditStateAgent.find(
            (agent) => agent.user_id === item.id
          );
          return {
            ...item, // Include all fields from agentsArr
            Campaign_user_id: matchedAgent ? matchedAgent.id : null, // Add user_id from EditStateAgent
          };
        });
      setmatchIdAgent(matchId);
      const unmatchId = agentsArr
        ?.filter(
          (item) => !EditStateAgent.some((agent) => agent.user_id === item.id)
        )
        .map((item) => {
          const matchedAgent = EditStateAgent.find(
            (agent) => agent.user_id === item.id
          );
          return {
            ...item,
            Campaign_user_id: matchedAgent ? matchedAgent.id : null, // add user_id if found, or null if not
          };
        });
      setunmatchIdAgent(unmatchId);
    }
  }, [agents, editState]);

  useEffect(() => {
    if (stepSelector === 1 && editState?.title) {
      const result = {
        title: editState.title,
        campaign_type: editState.campaign_type,
        description: editState.description,
      };

      reset(result);
      findBusinessNum();
    } else if (stepSelector === 2 && editState?.dialer) {
      const result = {
        preview_time: editState.dialer.preview_time,
        wrapup_time: editState.dialer.wrapup_time,
        max_ring_time: editState.dialer.max_ring_time,
        default_retry_period: editState.dialer.default_retry_period,
        max_attempts_per_record: editState.dialer.max_attempts_per_record,
        interested: editState.dialer.interested,
        demo_booked: editState.dialer.demo_booked,
        deal_closed: editState.dialer.deal_closed,
        requires_followup: editState.dialer.requires_followup,
        incorrect_number: editState.dialer.incorrect_number,
        left_voicemail: editState.dialer.left_voicemail,
        type: editState.dialer.type
      };
      reset(result);
    } else if (stepSelector === 3) {
      findAgents();
    }
  }, [stepSelector, editState]);

  useEffect(() => {
    if (availableDidSearch !== "") {
      const FilteredDids = did.filter((item) => {
        return item.did.includes(availableDidSearch);
      });
      setFilteredDids(FilteredDids);
    } else {
      setFilteredDids(did);
    }
  }, [availableDidSearch, did]);

  useEffect(() => {
    async function getDidData() {
      setLoading(true);
      try {
        const getDid = await generalGetFunction("did/all");

        if (getDid?.status) {
          setDid(getDid.data.filter((item) => item.usages === "dialer"));
        }
      } catch (error) {
        console.error("Error fetching DID data:", error);
      } finally {
        setLoading(false);
      }
    }
    getDidData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const getAgentData = async () => {
        const getAgents = await generalGetFunction(
          `agents?usages=dialer&row_per_page=${agentPerPage}&search=${agentSearch}`
        );

        if (getAgents?.status) {
          setAgents(getAgents.data);
        } else {
          setLoading(false);
        }
      };

      getAgentData();
    }, 1000);

    return () => clearTimeout(timer);
  }, [agentPerPage, agentSearch]);

  // Step one form submit to create campaign
  const handleFormSubmitStepOne = handleSubmit(async (data) => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one did");
      return;
    }
    setLoading(true);
    const payload = {
      ...data,
      business_numbers: selectedItems,
      account_id: account.account_id,
      status: "Active",
    };
    const apiData = await generalPutFunction(
      `/campaign/update/${value}`,
      payload
    );
    if (apiData?.status) {
      setCompletedStep(1);
      setStepSelector(2);
      setLoading(false);
      toast.success(apiData.message);
      // setCampaignId(apiData.data.id);
      setcampaignRefresh((prev) => prev + 1);
    } else {
      setLoading(false);
      toast.error(apiData?.message || apiData?.error);
    }
  });

  // Step two form submit to add dialer settings
  const handleFormSubmitStepTwo = handleSubmit(async (data) => {
    if (selectedDesposition.length === 0) {
      toast.error("Please select at least one disposition");
      return
    }
    if (editState.dialer == null) {
      const payload = { ...data, campaign_id: value, dispositions: selectedDesposition };
      const apiData = await generalPostFunction(
        "/dialer-setting/store",
        payload
      );

      if (apiData?.status) {
        setCompletedStep(2);
        setStepSelector(3);
        setLoading(false);
        toast.success(apiData.message);
      } else {
        setLoading(false);
      }
    } else {
      const payload = { ...data, campaign_id: value, dispositions: selectedDesposition };
      setLoading(true);
      const apiData = await generalPutFunction(
        `/dialer-setting/update/${editState.dialer.id}`,
        payload
      );
      if (apiData?.status) {
        setCompletedStep(2);
        setStepSelector(3);
        setLoading(false);
        toast.success(apiData.message);
        setcampaignRefresh((prev) => prev + 1);
      } else {
        setLoading(false);
        toast.error(apiData?.message || apiData?.error);
      }
    }
  });

  // Step three form submit for adding agents
  async function handleFormSubmitStepThree() {
    if (selectedAgent.length === 0) {
      toast.error("Please select at least one agent");
      return;
    }
    setLoading(true);
    const payload = {
      campaign_id: value,
      user_id: selectedAgent,
      status: "active",
    };
    const apiData = await generalPostFunction("/campaign-agent/store", payload);
    if (apiData?.status) {
      setCompletedStep(3);
      setStepSelector(4);
      setLoading(false);
      toast.success(apiData.message);
      setcampaignRefresh((prev) => prev + 1);
    } else {
      setLoading(false);
      toast.error(apiData?.message || apiData?.error);
    }
  }

  // Step four form submit for adding leads
  async function handleFormSubmitStepFour() {
    if (newFile) {
      const maxSizeInKB = 2048;
      const fileSizeInKB = newFile.size / 1024;

      if (fileSizeInKB > maxSizeInKB) {
        toast.error("Please choose a file less than 2048 kilobytes.");
      } else {
        setLoading(true);
        const parsedData = new FormData();
        parsedData.append("csv_file", newFile);
        parsedData.append("campaign_id", value);
        const apiData = await fileUploadFunction(
          "/campaign-lead/store",
          parsedData
        );
        if (apiData.status) {
          navigate(-1);
          setLoading(false);
          setCompletedStep(4);
          setNewFile();
          toast.success(apiData.message);
        } else {
          setLoading(false);
          toast.error(apiData?.message || apiData?.error);
        }
      }
    } else {
      toast.error("Please choose a file");
    }
  }

  // Logic to select and unselect did
  const toggleSelect = (index) => {
    setSelectedItems(
      (prevSelected) =>
        prevSelected.includes(index)
          ? prevSelected.filter((item) => item !== index) // Remove if already selected
          : [...prevSelected, index] // Add if not selected
    );
  };

  // Logic to select and unselect agents
  const toggleSelectAgents = (index) => {
    setSelectedAgent(
      (prevSelected) =>
        prevSelected.includes(index)
          ? prevSelected.filter((item) => item !== index) // Remove if already selected
          : [...prevSelected, index] // Add if not selected
    );
  };

  // Function to get selected file name
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const sanitizedFileName = file.name.replace(/ /g, "-");
      setFileName(sanitizedFileName); // Set the file name in state
      // Additional logic for the newFile can go here
    }
  };

  const handleUpdateLeads = async () => {
    const payload = { ...leadsEditState };
    setLoading(true);
    const apiData = await generalPutFunction(
      `/campaign-lead/update/${leadsEditState.id}`,
      payload
    );
    if (apiData?.status) {
      setLoading(false);
      toast.success(apiData.message);
      setcampaignRefresh((prev) => prev + 1);
      setPopUp(false);
    } else {
      setLoading(false);
    }
  };

  // Handel selcetd desposition change
  function handleDispositionChange(id) {
    // If id is present then remove it if not add it
    // setSelectedDisposition((prevSelected) => (prevSelected.includes(id) ? prevSelected.filter((item) => item !== id) : [...prevSelected, id]));

    setSelectedDisposition((prevSelected) => prevSelected.filter((item) => item.id === id).length > 0 ? prevSelected.filter((item) => item.id !== id) : [...prevSelected, { id: id, rechain: 0 }])
  }


  // Function to handle rechain checkbox change
  function handleDispositionRechainChange(id) {
    console.log("id", id);

    setSelectedDisposition((prevSelected) => prevSelected.filter((item) => item.id === id).length > 0 ? prevSelected.map((item) => {
      if (item.id === id) {
        return { ...item, rechain: item.rechain === 0 ? 1 : 0 }
      } else {
        return item
      }
    }) : [...prevSelected, { id: id, rechain: false }])
  }

  console.log("selectedDesposition", selectedDesposition);

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Campaign Manage" />
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Campaign Edit</h4>
                        <p>Edit existing campaign</p>
                      </div>
                      <div className="buttonGroup">
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
                        <button
                          type="button"
                          className="panelButton"
                          onClick={() => {
                            if (stepSelector === 1) {
                              handleFormSubmitStepOne();
                            } else if (stepSelector === 2) {
                              handleFormSubmitStepTwo();
                            } else if (stepSelector === 3) {
                              handleFormSubmitStepThree();
                            } else if (stepSelector === 4) {
                              handleFormSubmitStepFour();
                            }
                          }}
                        >
                          <span className="text">Save</span>
                          <span className="icon">
                            <i className="fa-solid fa-floppy-disk"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-12" style={{ padding: "25px 23px" }}>
                    <div className="row">
                      <div className="col-xl-2 col-3">
                        <div className="someTempDialerDesign">
                          <ul>
                            <li
                              className={stepSelector === 1 && "active"}
                              onClick={() => setStepSelector(1)}
                            >
                              <div
                                className={
                                  completedStep > 0
                                    ? "numberHolder completed"
                                    : "numberHolder"
                                }
                              >
                                1
                              </div>
                              <div className="textHolder">
                                <h3>General Settings</h3>
                                {/* <div className='description'>
                                                                    <div>
                                                                        Numbers
                                                                    </div>
                                                                    <div>
                                                                        18081818181
                                                                    </div>
                                                                </div> */}
                              </div>
                            </li>
                            <li
                              className={stepSelector === 2 && "active"}
                              onClick={() => {
                                // if (completedStep > 0) {
                                setStepSelector(2);
                                // }
                              }}
                            >
                              <div
                                className={
                                  completedStep > 1
                                    ? "numberHolder completed"
                                    : "numberHolder"
                                }
                              >
                                2
                              </div>
                              <div className="textHolder">
                                <h3>Dialer Settings</h3>
                              </div>
                            </li>
                            <li
                              className={stepSelector === 3 && "active"}
                              onClick={() => {
                                // if (completedStep > 1) {
                                setStepSelector(3);
                                // }
                              }}
                            >
                              <div
                                className={
                                  completedStep > 2
                                    ? "numberHolder completed"
                                    : "numberHolder"
                                }
                              >
                                3
                              </div>
                              <div className="textHolder">
                                <h3>Agent List</h3>
                              </div>
                            </li>
                            <li
                              className={stepSelector === 4 && "active"}
                              onClick={() => {
                                // if (completedStep > 2) {
                                setStepSelector(4);
                                // }
                              }}
                            >
                              <div
                                className={
                                  completedStep > 3
                                    ? "numberHolder completed"
                                    : "numberHolder"
                                }
                              >
                                4
                              </div>
                              <div className="textHolder">
                                <h3>Record List</h3>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {stepSelector === 1 && (
                        <>
                          <div
                            className="col-xl-7 col-6"
                            style={{
                              borderLeft: "1px solid var(--border-color)",
                              padding: "0 10px",
                            }}
                          >
                            <form className="row mb-0">
                              <div className="formRow">
                                <div className="formLabel">
                                  <label>Campaign Name</label>
                                </div>
                                <div className="col-6">
                                  <input
                                    type="text"
                                    className="formItem"
                                    {...register("title", {
                                      ...requiredValidator,
                                    })}
                                  />
                                  {errors.title && (
                                    <ErrorMessage text={errors.title.message} />
                                  )}
                                </div>
                              </div>
                              <div className="formRow">
                                <div className="formLabel">
                                  <label>Campaign Type</label>
                                </div>
                                <div className="col-6">
                                  <select
                                    defaultValue={"Inbound"}
                                    className="formItem"
                                    {...register("campaign_type", {
                                      ...requiredValidator,
                                    })}
                                  >
                                    <option value="Inbound">Inbound</option>
                                    <option value="Outbound">Outbound</option>
                                    <option value="pbx">PBX</option>
                                    <option value="dialer">Dialer</option>
                                  </select>
                                </div>
                              </div>
                              <div className="formRow align-items-start">
                                <div className="formLabel">
                                  <label>Campaign Description</label>
                                </div>
                                <div className="col-6">
                                  <textarea
                                    type="text"
                                    className="formItem h-auto"
                                    rows={3}
                                    {...register("description", {
                                      ...requiredValidator,
                                    })}
                                  />
                                  {errors.description && (
                                    <ErrorMessage
                                      text={errors.description.message}
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="formRow">
                                <div className="formLabel">
                                  <label>Target Timezone</label>
                                </div>
                                <div className="col-6">
                                  <select
                                    className="formItem"
                                  >
                                    <option value="1">Asia/Kolkata</option>
                                    <option value="2">Pacific/California</option>
                                  </select>
                                  {/* {errors.title && (
                                    <ErrorMessage text={errors.title.message} />
                                  )} */}
                                </div>
                              </div>
                              <div className="formRow">
                                <div className="formLabel">
                                  <label>Target Date Range</label>
                                </div>
                                <div className="col-6">
                                  <div className="row">
                                    <div className="col-6 pe-2">
                                      <div className="formLabel">
                                        <label>From</label>
                                      </div>
                                      <input
                                        type="date"
                                        className="formItem"
                                      />
                                    </div>
                                    <div className="col-6 ps-2">
                                      <div className="formLabel">
                                        <label>To</label>
                                      </div>
                                      <input
                                        type="date"
                                        className="formItem"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="formRow d-block">
                                <div className="formLabel">
                                  <label className="fw-bold" style={{ fontSize: 'initial' }}>Set Target Time</label>
                                </div>
                                <div style={{ width: 'fit-content', marginTop: '10px' }}>
                                  <div className="timeTableWrapper col-auto">
                                    <div className="col-12">
                                      <div className="wrapper">
                                        <div className="item" style={{ width: '95px' }}>
                                          <input type="checkbox" />
                                          <label className="ms-2 fw-bold">Sunday</label>
                                        </div>
                                        <div className="item">
                                          <input type="time" className="formItem" />
                                        </div>
                                        <div className="item">
                                          <input type="time" className="formItem" />
                                        </div>
                                        <div className="item">
                                          <div className="my-auto position-relative mx-1">
                                            {/* <label className="switch">
                                              <input type="checkbox" id="showAllCheck" checked="false" />
                                              <span className="slider round"></span>
                                            </label> */}
                                            <div class="cl-toggle-switch">
                                              <label class="cl-switch">
                                                <input type="checkbox" id="showAllCheck" checked="false" />
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <label className="ms-1">Full day</label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-12">
                                      <div className="wrapper">
                                        <div className="item" style={{ width: '95px' }}>
                                          <input type="checkbox" />
                                          <label className="ms-2 fw-bold">Monday</label>
                                        </div>
                                        <div className="item">
                                          <input type="time" className="formItem" />
                                        </div>
                                        <div className="item">
                                          <input type="time" className="formItem" />
                                        </div>
                                        <div className="item">
                                          <div className="my-auto position-relative mx-1">
                                            {/* <label className="switch">
                                              <input type="checkbox" id="showAllCheck" checked="false" />
                                              <span className="slider round"></span>
                                            </label> */}
                                            <div class="cl-toggle-switch">
                                              <label class="cl-switch">
                                                <input type="checkbox" id="showAllCheck" checked="false" />
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <label className="ms-1">Full day</label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-12">
                                      <div className="wrapper">
                                        <div className="item" style={{ width: '95px' }}>
                                          <input type="checkbox" />
                                          <label className="ms-2 fw-bold">Tuesday</label>
                                        </div>
                                        <div className="item">
                                          <input type="time" className="formItem" />
                                        </div>
                                        <div className="item">
                                          <input type="time" className="formItem" />
                                        </div>
                                        <div className="item">
                                          <div className="my-auto position-relative mx-1">
                                            {/* <label className="switch">
                                              <input type="checkbox" id="showAllCheck" checked="false" />
                                              <span className="slider round"></span>
                                            </label> */}
                                            <div class="cl-toggle-switch">
                                              <label class="cl-switch">
                                                <input type="checkbox" id="showAllCheck" checked="false" />
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <label className="ms-1">Full day</label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-12">
                                      <div className="wrapper">
                                        <div className="item" style={{ width: '95px' }}>
                                          <input type="checkbox" />
                                          <label className="ms-2 fw-bold">Wednesday</label>
                                        </div>
                                        <div className="item">
                                          <input type="time" className="formItem" />
                                        </div>
                                        <div className="item">
                                          <input type="time" className="formItem" />
                                        </div>
                                        <div className="item">
                                          <div className="my-auto position-relative mx-1">
                                            {/* <label className="switch">
                                              <input type="checkbox" id="showAllCheck" checked="false" />
                                              <span className="slider round"></span>
                                            </label> */}
                                            <div class="cl-toggle-switch">
                                              <label class="cl-switch">
                                                <input type="checkbox" id="showAllCheck" checked="false" />
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <label className="ms-1">Full day</label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-12">
                                      <div className="wrapper">
                                        <div className="item" style={{ width: '95px' }}>
                                          <input type="checkbox" />
                                          <label className="ms-2 fw-bold">Thursday</label>
                                        </div>
                                        <div className="item">
                                          <input type="time" className="formItem" />
                                        </div>
                                        <div className="item">
                                          <input type="time" className="formItem" />
                                        </div>
                                        <div className="item">
                                          <div className="my-auto position-relative mx-1">
                                            {/* <label className="switch">
                                              <input type="checkbox" id="showAllCheck" checked="false" />
                                              <span className="slider round"></span>
                                            </label> */}
                                            <div class="cl-toggle-switch">
                                              <label class="cl-switch">
                                                <input type="checkbox" id="showAllCheck" checked="false" />
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <label className="ms-1">Full day</label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-12">
                                      <div className="wrapper">
                                        <div className="item" style={{ width: '95px' }}>
                                          <input type="checkbox" />
                                          <label className="ms-2 fw-bold">Friday</label>
                                        </div>
                                        <div className="item">
                                          <input type="time" className="formItem" />
                                        </div>
                                        <div className="item">
                                          <input type="time" className="formItem" />
                                        </div>
                                        <div className="item">
                                          <div className="my-auto position-relative mx-1">
                                            {/* <label className="switch">
                                              <input type="checkbox" id="showAllCheck" checked="false" />
                                              <span className="slider round"></span>
                                            </label> */}
                                            <div class="cl-toggle-switch">
                                              <label class="cl-switch">
                                                <input type="checkbox" id="showAllCheck" checked="false" />
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <label className="ms-1">Full day</label>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-12">
                                      <div className="wrapper mb-0">
                                        <div className="item" style={{ width: '95px' }}>
                                          <input type="checkbox" />
                                          <label className="ms-2 fw-bold">Saturday</label>
                                        </div>
                                        <div className="item">
                                          <input type="time" className="formItem" />
                                        </div>
                                        <div className="item">
                                          <input type="time" className="formItem" />
                                        </div>
                                        <div className="item">
                                          <div className="my-auto position-relative mx-1">
                                            {/* <label className="switch">
                                              <input type="checkbox" id="showAllCheck" checked="false" />
                                              <span className="slider round"></span>
                                            </label> */}
                                            <div class="cl-toggle-switch">
                                              <label class="cl-switch">
                                                <input type="checkbox" id="showAllCheck" checked="false" />
                                                <span></span>
                                              </label>
                                            </div>
                                          </div>
                                          <label className="ms-1">Full day</label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                          <div
                            className="col-xl-3 col-3"
                            style={{
                              borderLeft: "1px solid var(--border-color)",
                            }}
                          >
                            <div
                              className="itemWrapper a py-0"
                              style={{
                                backgroundColor: "transparent",
                                boxShadow: "none",
                              }}
                            >
                              <div className="heading">
                                <div className="col-10">
                                  <h5>Available DID</h5>
                                  <p>Select from the available list of DIDs</p>
                                </div>
                                <div
                                  className="col-2"
                                  style={{ cursor: "pointer" }}
                                >
                                  <i
                                    className="fa-solid fa-hashtag"
                                    style={{
                                      boxShadow:
                                        "rgba(0, 0, 0, 0.15) 0px 3px 5px",
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="col-12 my-2">
                                <div className="searchBox position-relative">
                                  {/* <input type="text" name="Search" placeholder="Search" className="formItem" value={filter}  /> */}
                                  <div className="searchBox position-relative">
                                    <input
                                      type="number"
                                      name="Search"
                                      placeholder="Search"
                                      className="formItem"
                                      value={availableDidSearch}
                                      onChange={(e) => {
                                        setAvailableDidSearch(e.target.value);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === "e") {
                                          e.preventDefault();
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <ul className="invoiceList list-unstyled">
                                {filteredDids.map((item, index) => (
                                  <li
                                    key={index}
                                    className="d-flex justify-content-start align-items-center mb-2 p-2 "
                                    style={{ cursor: "pointer" }}
                                    onClick={() => toggleSelect(item.id)}
                                  >
                                    {/* Blank field that toggles a tick */}
                                    <div
                                      className={`checkbox-placeholder me-3 d-flex justify-content-center align-items-center ${selectedItems.includes(index)
                                        ? "selected"
                                        : ""
                                        }`}
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        border: "1px solid #ccc",
                                        borderRadius: "3px",
                                      }}
                                    >
                                      {selectedItems.includes(item.id) && (
                                        <i className="fa-solid fa-check text-success"></i>
                                      )}
                                    </div>
                                    <div className="col-xxl-7 col-xl-6">
                                      <p className="mb-0">{item.did}</p>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </>
                      )}
                      {stepSelector === 2 && (
                        <>
                          <div
                            className="col-xl-9 col-9"
                            style={{
                              borderLeft: "1px solid var(--border-color)",
                              padding: "0 30px",
                            }}
                          >
                            <form className="row mb-0">
                              <div className="formRow col-xl-6">
                                <div className="formLabel">
                                  <label
                                    className="fw-bold"
                                    style={{ fontSize: "initial" }}
                                  >
                                    Dialer Type
                                  </label>
                                </div>
                                <div className="col-6">
                                  <select
                                    defaultValue={"preview"}
                                    className="formItem"
                                    {...register("type", {
                                      ...requiredValidator,
                                    })}
                                    value={watch().type}
                                  >
                                    <option value="preview">Preview</option>
                                    <option value="progressive">
                                      Progressive
                                    </option>
                                    <option value="predictive">
                                      Predictive
                                    </option>
                                    <option value="agentless">
                                      Agentless
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div></div>
                              <>
                                <div className="formRow col-xl-6">
                                  <div className="formLabel">
                                    <label>{watch().type === "preview" ? "Preview Time" : "Agent Ringing Time"}</label>
                                  </div>
                                  <div className="col-6">
                                    <input
                                      type="number"
                                      className="formItem"
                                      {...register("preview_time", {
                                        ...requiredValidator,
                                        ...numberValidator,
                                      })}
                                    />
                                    {errors.preview_time && (
                                      <ErrorMessage
                                        text={errors.preview_time.message}
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="formRow col-xl-6">
                                  <div className="formLabel">
                                    <label>Wrap Up Time</label>
                                  </div>
                                  <div className="col-6">
                                    <input
                                      type="number"
                                      className="formItem"
                                      {...register("wrapup_time", {
                                        ...requiredValidator,
                                        ...numberValidator,
                                      })}
                                    />
                                    {errors.wrapup_time && (
                                      <ErrorMessage
                                        text={errors.wrapup_time.message}
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="formRow col-xl-6">
                                  <div className="formLabel">
                                    <label>Max Ring Time</label>
                                  </div>
                                  <div className="col-6">
                                    <input
                                      type="number"
                                      className="formItem"
                                      {...register("max_ring_time", {
                                        ...requiredValidator,
                                        ...numberValidator,
                                      })}
                                    />
                                    {errors.max_ring_time && (
                                      <ErrorMessage
                                        text={errors.max_ring_time.message}
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="formRow col-xl-6">
                                  <div className="formLabel">
                                    <label>Default Retry Period <i>(minute)</i></label>
                                  </div>
                                  <div className="col-6">
                                    <input
                                      type="number"
                                      className="formItem"
                                      {...register("default_retry_period", {
                                        ...requiredValidator,
                                        ...numberValidator,
                                      })}
                                    />
                                    {errors.default_retry_period && (
                                      <ErrorMessage
                                        text={errors.default_retry_period.message}
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="formRow col-xl-6">
                                  <div className="formLabel">
                                    <label>Max Attempt Per Record</label>
                                  </div>
                                  <div className="col-6">
                                    <input
                                      type="number"
                                      className="formItem"
                                      {...register("max_attempts_per_record", {
                                        ...requiredValidator,
                                        ...numberValidator,
                                      })}
                                    />
                                    {errors.max_attempts_per_record && (
                                      <ErrorMessage
                                        text={
                                          errors.max_attempts_per_record.message
                                        }
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="formRow col-xl-6">
                                  <div className="formLabel">
                                    <label>Rechain</label>
                                  </div>
                                  <div className="col-6">
                                    <select
                                      className="formItem"
                                      {...register("rechain", { ...requiredValidator })}
                                    >
                                      <option value="1">Enabled</option>
                                      <option value="0">Disabled</option>
                                    </select>
                                    {errors.rechain && (
                                      <ErrorMessage
                                        text={
                                          errors.rechain.message
                                        }
                                      />
                                    )}
                                  </div>
                                </div>
                              </>
                            </form>
                            <div className="row mt-2 gx-xxl-5">
                              <div className="col-xl-6">
                                <div className="profileView p-0">
                                  <div
                                    className="profileDetailsHolder position-relative px-0"
                                    style={{
                                      backgroundColor: "transparent",
                                      boxShadow: "none",
                                    }}
                                  >
                                    <div className="col-xl-12">
                                      <div
                                        className="header d-flex align-items-center justify-content-between"
                                        style={{ height: "35px" }}
                                      >
                                        <div
                                          className="col-5 fw-bold"
                                          style={{ fontFamily: "Noto Sans" }}
                                        >
                                          System Disposition
                                        </div>
                                      </div>
                                      <div className="col-xl-12 pt-3">
                                        <div className="d-flex align-items-center">
                                          <div
                                            className="savedCardWrapper col"
                                            style={{ height: "47px" }}
                                          >
                                            <div>
                                              <label>Busy</label>
                                            </div>
                                            <div
                                              style={{
                                                fontSize: "11px",
                                                color: "var(--color-subtext)",
                                              }}
                                            >
                                              <div>Retry Period: 30 min</div>
                                              <div>Attempts per rec: 3</div>
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              width: "40px",
                                              borderTop:
                                                "1px dashed var(--border-color)",
                                            }}
                                          />
                                          <div className="contactTags">
                                            <span data-id="0">Retry</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xl-12 pt-3">
                                        <div className="d-flex align-items-center">
                                          <div
                                            className="savedCardWrapper col"
                                            style={{ height: "47px" }}
                                          >
                                            <div>
                                              <label>No Answer</label>
                                            </div>
                                            <div
                                              style={{
                                                fontSize: "11px",
                                                color: "var(--color-subtext)",
                                              }}
                                            >
                                              <div>Retry Period: 30 min</div>
                                              <div>Attempts per rec: 3</div>
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              width: "40px",
                                              borderTop:
                                                "1px dashed var(--border-color)",
                                            }}
                                          />
                                          <div className="contactTags">
                                            <span data-id="0">Retry</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xl-12 pt-3">
                                        <div className="d-flex align-items-center">
                                          <div
                                            className="savedCardWrapper col"
                                            style={{ height: "47px" }}
                                          >
                                            <div>
                                              <label>Agent Abandoned</label>
                                            </div>
                                            <div
                                              style={{
                                                fontSize: "11px",
                                                color: "var(--color-subtext)",
                                              }}
                                            >
                                              <div>Retry Period: 30 min</div>
                                              <div>Attempts per rec: 3</div>
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              width: "40px",
                                              borderTop:
                                                "1px dashed var(--border-color)",
                                            }}
                                          />
                                          <div className="contactTags">
                                            <span data-id="0">Retry</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xl-12 pt-3">
                                        <div className="d-flex align-items-center">
                                          <div
                                            className="savedCardWrapper col"
                                            style={{ height: "47px" }}
                                          >
                                            <div>
                                              <label>Hang Up</label>
                                            </div>
                                            <div
                                              style={{
                                                fontSize: "11px",
                                                color: "var(--color-subtext)",
                                              }}
                                            >
                                              <div>Retry Period: 30 min</div>
                                              <div>Attempts per rec: 3</div>
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              width: "40px",
                                              borderTop:
                                                "1px dashed var(--border-color)",
                                            }}
                                          />
                                          <div className="contactTags">
                                            <span data-id="0">Retry</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xl-12 pt-3">
                                        <div className="d-flex align-items-center">
                                          <div
                                            className="savedCardWrapper col"
                                            style={{ height: "47px" }}
                                          >
                                            <div>
                                              <label>Invalid Number</label>
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              width: "40px",
                                              borderTop:
                                                "1px dashed var(--border-color)",
                                            }}
                                          />
                                          <div className="contactTags">
                                            <span data-id="1">Final</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-xl-6">
                                <div className="profileView p-0">
                                  <div
                                    className="profileDetailsHolder position-relative px-0"
                                    style={{
                                      backgroundColor: "transparent",
                                      boxShadow: "none",
                                    }}
                                  >
                                    <div className="col-xl-12">
                                      <div className="header d-flex align-items-center justify-content-between">
                                        <div
                                          className="col-5 fw-bold"
                                          style={{ fontFamily: "Noto Sans" }}
                                        >
                                          Agent Disposition
                                        </div>
                                      </div>
                                      {allDisposition.map((item, index) => {
                                        return (
                                          <div className="col-xl-12 pt-3">
                                            <div className='d-flex align-items-center'>
                                              <div className="savedCardWrapper col">
                                                <div>
                                                  <label>{item.name}</label>
                                                </div>
                                                <div>
                                                  {/* <label className="switch">
                                                    <input
                                                      type="checkbox"
                                                      checked={selectedDesposition.filter((dispo) => dispo?.id == item.id).length > 0}
                                                      id="showAllCheck"
                                                      onChange={() => handleDispositionChange(item.id)}
                                                    />
                                                    <span className="slider round" />
                                                  </label> */}

                                                  <div class="cl-toggle-switch">
                                                    <label class="cl-switch">
                                                      <input
                                                        type="checkbox"
                                                        checked={selectedDesposition.filter((dispo) => dispo?.id == item.id).length > 0}
                                                        id="showAllCheck"
                                                        onChange={() => handleDispositionChange(item.id)}
                                                      />
                                                      <span></span>
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
                                              <div style={{ width: '40px', borderTop: '1px dashed var(--border-color)' }} />
                                              <div className="contactTags">
                                                <span data-id={`${selectedDesposition?.filter((dispo) => dispo?.id == item.id)?.[0]?.rechain ? 'rechain' : 'none'}`} onClick={() => selectedDesposition?.filter((dispo) => dispo?.id == item.id) ? handleDispositionRechainChange(item.id) : ""}> Rechain </span>

                                                {/* <span >
                                                  Retry
                                                  <input type="radio" name={`dispoState${index}`}
                                                    style={{ width: '100%', height: '100%', opacity: '0', position: 'absolute', top: '0', left: '0' }}
                                                    value="retry"
                                                    checked={selectedDesposition.filter((dispo) => dispo.id == item.id)?.[0]?.rechain}
                                                    onChange={(e) => handleDispositionRechainChange(item.id)}
                                                  />
                                                </span>
                                                <span data-id={dispoState.state === 'final' ? '1' : "none"}>
                                                  Final
                                                  <input type="radio" name={`dispoState${index}`}
                                                    style={{ width: '100%', height: '100%', opacity: '0', position: 'absolute', top: '0', left: '0' }}
                                                    value="final"
                                                    checked={dispoState.state === 'final'}
                                                    onChange={(e) => setDispoState((prev) => ({ ...prev, name: item.name, id: item.id, state: e.target.value }))}
                                                  />
                                                </span> */}
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      })}
                                      {/* <div className="col-xl-12 pt-3">
                                        <div className="d-flex align-items-center">
                                          <div className="savedCardWrapper col">
                                            <div>
                                              <label>Interested</label>
                                            </div>
                                            <div>
                                              <label className="switch">
                                                <input
                                                  type="checkbox"
                                                  id="showAllCheck"
                                                  {...register("interested")}
                                                />
                                                <span className="slider round" />
                                              </label>
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              width: "40px",
                                              borderTop:
                                                "1px dashed var(--border-color)",
                                            }}
                                          />
                                          <div className="contactTags">
                                            <span data-id="1">Final</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xl-12 pt-3">
                                        <div className="d-flex align-items-center">
                                          <div className="savedCardWrapper col">
                                            <div>
                                              <label>Not Interested</label>
                                            </div>
                                            <div>
                                              <label className="switch">
                                                <input
                                                  type="checkbox"
                                                  {...register(
                                                    "not_interested"
                                                  )}
                                                  id="showAllCheck"
                                                />
                                                <span className="slider round" />
                                              </label>
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              width: "40px",
                                              borderTop:
                                                "1px dashed var(--border-color)",
                                            }}
                                          />
                                          <div className="contactTags">
                                            <span data-id="1">Final</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xl-12 pt-3">
                                        <div className="d-flex align-items-center">
                                          <div className="savedCardWrapper col">
                                            <div>
                                              <label>Demo Booked</label>
                                            </div>
                                            <div>
                                              <label className="switch">
                                                <input
                                                  type="checkbox"
                                                  {...register("demo_booked")}
                                                  id="showAllCheck"
                                                />
                                                <span className="slider round" />
                                              </label>
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              width: "40px",
                                              borderTop:
                                                "1px dashed var(--border-color)",
                                            }}
                                          />
                                          <div className="contactTags">
                                            <span data-id="1">Final</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xl-12 pt-3">
                                        <div className="d-flex align-items-center">
                                          <div className="savedCardWrapper col">
                                            <div>
                                              <label>Deal Closed</label>
                                            </div>
                                            <div>
                                              <label className="switch">
                                                <input
                                                  type="checkbox"
                                                  {...register("deal_closed")}
                                                  id="showAllCheck"
                                                />
                                                <span className="slider round" />
                                              </label>
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              width: "40px",
                                              borderTop:
                                                "1px dashed var(--border-color)",
                                            }}
                                          />
                                          <div className="contactTags">
                                            <span data-id="1">Final</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xl-12 pt-3">
                                        <div className="d-flex align-items-center">
                                          <div className="savedCardWrapper col">
                                            <div>
                                              <label>Requires Follow-up</label>
                                            </div>
                                            <div>
                                              <label className="switch">
                                                <input
                                                  type="checkbox"
                                                  {...register(
                                                    "requires_followup"
                                                  )}
                                                  id="showAllCheck"
                                                />
                                                <span className="slider round" />
                                              </label>
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              width: "40px",
                                              borderTop:
                                                "1px dashed var(--border-color)",
                                            }}
                                          />
                                          <div className="contactTags">
                                            <span data-id="1">Final</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xl-12 pt-3">
                                        <div className="d-flex align-items-center">
                                          <div className="savedCardWrapper col">
                                            <div>
                                              <label>Incorrect Number</label>
                                            </div>
                                            <div>
                                              <label className="switch">
                                                <input
                                                  type="checkbox"
                                                  {...register(
                                                    "incorrect_number"
                                                  )}
                                                  id="showAllCheck"
                                                />
                                                <span className="slider round" />
                                              </label>
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              width: "40px",
                                              borderTop:
                                                "1px dashed var(--border-color)",
                                            }}
                                          />
                                          <div className="contactTags">
                                            <span data-id="1">Final</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-xl-12 pt-3">
                                        <div className="d-flex align-items-center">
                                          <div className="savedCardWrapper col">
                                            <div>
                                              <label>Left Voicemail</label>
                                            </div>
                                            <div>
                                              <label className="switch">
                                                <input
                                                  type="checkbox"
                                                  {...register(
                                                    "left_voicemail"
                                                  )}
                                                  id="showAllCheck"
                                                />
                                                <span className="slider round" />
                                              </label>
                                            </div>
                                          </div>
                                          <div
                                            style={{
                                              width: "40px",
                                              borderTop:
                                                "1px dashed var(--border-color)",
                                            }}
                                          />
                                          <div className="contactTags">
                                            <span data-id="1">Final</span>
                                          </div>
                                        </div>
                                      </div> */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {stepSelector === 3 && (
                        <>
                          <div
                            className="col-xl-9 col-9"
                            style={{
                              borderLeft: "1px solid var(--border-color)",
                              padding: "0 30px",
                            }}
                          >
                            <div
                              className="itemWrapper a py-0"
                              style={{
                                backgroundColor: "transparent",
                                boxShadow: "none",
                              }}
                            >
                              <div className="heading">
                                <div className="col-10">
                                  <h5>Available Agents</h5>
                                  <p>
                                    Select from the available list of agents
                                  </p>
                                </div>
                              </div>
                              {/* <div className='col-12 my-2'>
                                                            <div className="searchBox position-relative">
                                                                <input type="text" name="Search" placeholder="Search" className="formItem" value="" />
                                                            </div>
                                                        </div> */}
                              <div className="tableHeader">
                                <div className="showEntries">
                                  <label>Show</label>
                                  <select
                                    className="formItem"
                                    value={agentPerPage}
                                    onChange={(e) =>
                                      setAgentPerPage(e.target.value)
                                    }
                                  >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={30}>30</option>
                                  </select>
                                  <label>entries</label>
                                </div>
                                <div className="searchBox position-relative">
                                  <label>Search:</label>
                                  <input
                                    type="search"
                                    name="Search"
                                    className="formItem"
                                    value={agentSearch}
                                    onChange={(e) =>
                                      setAgentSearch(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="mainContentApp m-0 bg-transparent mt-3">
                                <div className="row">
                                  <div className="col-xl-6" style={{ borderRight: '1px solid var(--border-color)' }}>
                                    {unmatchIdAgent?.map((item, index) => {
                                      return (
                                        <div
                                          className="callListItem"
                                          key={index}
                                          onClick={() =>
                                            toggleSelectAgents(item.id)
                                          }
                                        >
                                          <div className="row justify-content-between">
                                            <div className="col-xl-5 col-xxl-5 col-lg-5 col-md-4 d-flex ps-0">
                                              <div className="profileHolder">
                                                <i className="fa-light fa-user fs-5" />
                                              </div>
                                              <div className="my-auto ms-2 ms-xl-3 text-start">
                                                <h4>{item.name}</h4>
                                                <h5 className="mt-2">
                                                  {item.extension.extension}
                                                </h5>
                                              </div>
                                            </div>
                                            <div className=" col-xl-3 col-xxl-3">
                                              <div className="contactTags">
                                                <span data-id={2}>Agent</span>
                                              </div>
                                            </div>
                                            <div className={`checkbox-placeholder me-3 d-flex justify-content-center align-items-center ${selectedAgent.includes(index)
                                              ? "selected"
                                              : ""
                                              }`}
                                              style={{
                                                width: "20px",
                                                height: "20px",
                                                border: "1px solid #ccc",
                                                borderRadius: "3px",
                                              }}
                                            >
                                              {selectedAgent.includes(
                                                item.id
                                              ) && (
                                                  <i className="fa-solid fa-check text-success"></i>
                                                )}
                                            </div>
                                            {/* <div className="col-auto text-end d-flex justify-content-center align-items-center">
                                                                                    <div className="tableButton edit" ><i className="fa-solid fa-plus"></i> </div>
                                                                                </div> */}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div className="col-xl-6">
                                    {matchIdAgent?.map((item, index) => {
                                      return (
                                        <div
                                          className="callListItem"
                                          key={index}
                                          onClick={() =>
                                            toggleSelectAgents(item.id)
                                          }
                                        >
                                          <div className="row justify-content-between">
                                            <div className="col-7 col-xl-7 col-xxl-6 d-flex ps-0">
                                              <div className="profileHolder">
                                                <i className="fa-light fa-user fs-5" />
                                              </div>
                                              <div className="my-auto ms-2 ms-xl-3 text-start">
                                                <h4>{item.name}</h4>
                                                <h5 className="mt-2">
                                                  {item.extension.extension}
                                                </h5>
                                              </div>
                                            </div>
                                            <div className="col">
                                              <div className="contactTags">
                                                <span data-id={2}>Agent</span>
                                              </div>
                                            </div>

                                            <div className="w-auto">
                                              <button
                                                className="clearButton2 text-danger"
                                                onClick={() =>
                                                  handleDeleteAgent(
                                                    item.Campaign_user_id
                                                  )
                                                }
                                              >
                                                <i className="fa-solid fa-xmark"></i>
                                              </button>
                                            </div>
                                            {/* <div
                                          className={`checkbox-placeholder me-3 d-flex justify-content-center align-items-center ${
                                            selectedAgent.includes(index)
                                              ? "selected"
                                              : ""
                                          }`}
                                          style={{
                                            width: "20px",
                                            height: "20px",
                                            border: "1px solid #ccc",
                                            borderRadius: "3px",
                                          }}
                                        >
                                          {selectedAgent.includes(item.id) && (
                                            <i className="fa-solid fa-check text-success"></i>
                                          )}
                                        </div> */}
                                            {/* <div className="col-auto text-end d-flex justify-content-center align-items-center">
                                                                                    <div className="tableButton edit" ><i className="fa-solid fa-plus"></i> </div>
                                                                                </div> */}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              <div className="tableHeader text-start my-3">
                                <PaginationComponent
                                  pageNumber={(e) => setPageNumber(e)}
                                  totalPage={agents.last_page}
                                  from={(pageNumber - 1) * agents.per_page + 1}
                                  to={agents.to}
                                  total={agents.total}
                                />
                              </div>
                            </div>

                          </div>
                        </>
                      )}
                      {stepSelector === 4 && (
                        <>
                          <div
                            className="col-xl-9 col-9"
                            style={{
                              borderLeft: "1px solid var(--border-color)",
                              // padding: "0 30px",
                            }}
                          >
                            <div className="w-auto h-auto">
                              <div className="container h-100">
                                <div className="row h-100 justify-content-center align-items-center">

                                  <div className="heading bg-transparent border-bottom-0 pt-0">
                                    <div className="content">
                                      <h4>List of Leads</h4>
                                      <p>You can see the list of leads assigned to this campaign.</p>
                                    </div>
                                    <div className="buttonGroup gap-2">
                                      <button
                                        className="panelButton static m-0 px-2"
                                        onClick={() => setAddLeadInternalToggle(!addLeadInternalToggle)}
                                      >
                                        <span className="text">Add Lead</span>
                                      </button>
                                      <button
                                        className="panelButton static m-0 px-2"
                                        onClick={() => setAddNewCsvToggle(!addNewCsvToggle)}
                                      >
                                        <span className="text">Import CSV</span>
                                      </button>
                                    </div>
                                  </div>

                                  {/* <button
                                    onClick={() =>
                                      setAddNewCsvToggle(!addNewCsvToggle)
                                    }
                                  >
                                    Add New CSV
                                  </button> */}
                                  {addNewCsvToggle && (
                                    <div className="popup music">
                                      <div className="container h-100">
                                        <div className="row h-100 justify-content-center align-items-center">
                                          <div
                                            className="card px-0 col-5 shadow-none"
                                            style={{
                                              border: "1px solid var(--border-color)",
                                            }}
                                          >
                                            <div className="header bg-transparent">
                                              <div className="d-flex justify-content-between">
                                                <h5 className="card-title fs14 border-bootm fw700">
                                                  Upload Documents
                                                </h5>
                                                <button className="clearButton2 xl" onClick={() => setAddNewCsvToggle(!addNewCsvToggle)}>
                                                  <i className="fa-solid fa-xmark"></i>
                                                </button>
                                              </div>
                                            </div>
                                            <div className="card-body">
                                              <div className="popup-border text-center p-2">
                                                <input
                                                  type="file"
                                                  className="form-control-file d-none"
                                                  id="fileInput"
                                                  accept=".csv"
                                                  onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                      // Check if the file type is MP3

                                                      const fileName =
                                                        file.name.replace(/ /g, "-");
                                                      const newFile = new File(
                                                        [file],
                                                        fileName,
                                                        {
                                                          type: file.type,
                                                        }
                                                      );
                                                      setNewFile(newFile);
                                                      handleFileChange(e);
                                                    }
                                                  }}
                                                />
                                                <label
                                                  htmlFor="fileInput"
                                                  className="d-block"
                                                >
                                                  <div className="test-user text-center">
                                                    <i
                                                      className="fa-solid fa-cloud-arrow-up"
                                                      style={{ fontSize: 30 }}
                                                    />
                                                    <p className="mb-0 mt-2 text-center">
                                                      Drag and Drop or{" "}
                                                      <span>Click on upload</span>
                                                    </p>
                                                    <span>
                                                      Supports formats : MP3, Max
                                                      Size: 2MB
                                                    </span>
                                                  </div>
                                                </label>
                                                {fileName && (
                                                  <p className="mt-3 text-center">
                                                    Selected File:{" "}
                                                    <strong>{fileName}</strong>
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {addLeadInternalToggle &&
                                    <div className="backdropContact">
                                      <div className="addNewContactPopup">
                                        <div className="row">
                                          <div className="col-12 heading border-0 mb-0">
                                            <i className="fa-light fa-user-plus" />
                                            <h5>Add Leads to the selected Campaign</h5>
                                          </div>
                                          <div className="col-xl-12">
                                            <div className="col-12 d-flex justify-content-between align-items-center">
                                              <input
                                                type="text"
                                                className="formItem"
                                                placeholder="Search"
                                                name="name"
                                                defaultValue=""
                                              />
                                              <button className="tableButton popupIcon_btn ms-2">
                                                <i className="fa-solid fa-user-plus" />
                                              </button>
                                            </div>
                                          </div>
                                          <div className="col-xl-12 mt-3">
                                            <div
                                              className="tableContainer mt-0"
                                              style={{ maxHeight: "calc(-400px + 100vh)" }}
                                            >
                                              <table>
                                                <thead>
                                                  <tr>
                                                    <th>S.No</th>
                                                    <th>Name</th>
                                                    <th>Qty</th>
                                                    <th><input type="checkbox" /></th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  <tr>
                                                    <td>1</td>
                                                    <td>test</td>
                                                    <td>1000</td>
                                                    <td>
                                                      <input type="checkbox" />
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td>2</td>
                                                    <td>ravi raj</td>
                                                    <td>1007</td>
                                                    <td>
                                                      <input type="checkbox" />
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td>3</td>
                                                    <td>riddhee</td>
                                                    <td>1001</td>
                                                    <td>
                                                      <input type="checkbox" />
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td>4</td>
                                                    <td>pratima</td>
                                                    <td>1002</td>
                                                    <td>
                                                      <input type="checkbox" />
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td>5</td>
                                                    <td>biplab</td>
                                                    <td>1003</td>
                                                    <td>
                                                      <input type="checkbox" />
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td>6</td>
                                                    <td>tushar</td>
                                                    <td>1004</td>
                                                    <td>
                                                      <input type="checkbox" />
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td>7</td>
                                                    <td>solman</td>
                                                    <td>1005</td>
                                                    <td>
                                                      <input type="checkbox" />
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td>8</td>
                                                    <td>sanchit</td>
                                                    <td>1010</td>
                                                    <td>
                                                      <input type="checkbox" />
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td>9</td>
                                                    <td>damini</td>
                                                    <td>1011</td>
                                                    <td>
                                                      <input type="checkbox" />
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td>10</td>
                                                    <td>rishabh</td>
                                                    <td>1012</td>
                                                    <td>
                                                      <input type="checkbox" />
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                          <div className="col-xl-12 mt-2">
                                            <div className="d-flex justify-content-between">
                                              <button className="panelButton gray ms-0" onClick={() => setAddLeadInternalToggle(false)}>
                                                <span className="text">Close</span>
                                                <span className="icon">
                                                  <i className="fa-light fa-xmark" />
                                                </span>
                                              </button>
                                              <button className="panelButton" onClick={() => featureUnderdevelopment()}>
                                                <span className="text">Done</span>
                                                <span className="icon">
                                                  <i className="fa-solid fa-check" />
                                                </span>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  }

                                  <div>
                                    <div className="tableContainer mt-0">
                                      <table>
                                        <thead>
                                          <tr>
                                            <th>Name</th>
                                            <th>Number</th>
                                            <th>Country Code</th>
                                            <th>Address</th>
                                            <th>Edit</th>
                                          </tr>
                                        </thead>
                                        <tbody className="">
                                          {editState?.leads?.map(
                                            (item, index) => {
                                              return (
                                                <tr>
                                                  <td>
                                                    {item.first_name}{" "}
                                                    {item.last_name}
                                                  </td>
                                                  <td>{item.phone_number}</td>
                                                  <td>{item.phone_code}</td>
                                                  <td>
                                                    {item.address1}{" "}
                                                    {item.address2}{" "}
                                                    {item.address3}
                                                  </td>
                                                  <td>
                                                    <button
                                                      className="tableButton edit"
                                                      onClick={() => {
                                                        setLeadsEditState(item);
                                                        setPopUp(true);
                                                      }}
                                                    >
                                                      <i className="fa-solid fa-pencil"></i>
                                                    </button>
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {popUp ? (
          <div className="backdropContact">
            <div className="addNewContactPopup">
              <div className="row">
                <div className="col-12 heading mb-0">
                  <i className="fa-light fa-circle-exclamation"></i>
                  <h5>Lead Edit</h5>
                </div>
                <div className="col-12" style={{ padding: "0px 0px 10px" }}>
                  <form className="mb-0 d-flex flex-wrap">
                    <div className="formRow col-xl-6">
                      <div className="formLabel">
                        <label>First Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={leadsEditState.first_name}
                          onChange={(e) => {
                            setLeadsEditState({
                              ...leadsEditState,
                              first_name: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="formRow col-xl-6">
                      <div className="formLabel">
                        <label>Last Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={leadsEditState.last_name}
                          onChange={(e) => {
                            setLeadsEditState({
                              ...leadsEditState,
                              last_name: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-6">
                      <div className="formLabel">
                        <label>Phone Number</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="number"
                          className="formItem"
                          value={leadsEditState.phone_number}
                          onChange={(e) => {
                            setLeadsEditState({
                              ...leadsEditState,
                              phone_number: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="formRow col-xl-6">
                      <div className="formLabel">
                        <label>Address 1</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={leadsEditState.address1}
                          onChange={(e) => {
                            setLeadsEditState({
                              ...leadsEditState,
                              address1: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-6">
                      <div className="formLabel">
                        <label>Address 2</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={leadsEditState.address2}
                          onChange={(e) => {
                            setLeadsEditState({
                              ...leadsEditState,
                              address2: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-6">
                      <div className="formLabel">
                        <label>City</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={leadsEditState.city}
                          onChange={(e) => {
                            setLeadsEditState({
                              ...leadsEditState,
                              city: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-6">
                      <div className="formLabel">
                        <label>State</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={leadsEditState.state}
                          onChange={(e) => {
                            setLeadsEditState({
                              ...leadsEditState,
                              state: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="formRow col-xl-6">
                      <div className="formLabel">
                        <label>Country code</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="number"
                          className="formItem"
                          value={leadsEditState.phone_code}
                          onChange={(e) => {
                            setLeadsEditState({
                              ...leadsEditState,
                              phone_code: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>

                    <div className="formRow col-xl-6">
                      <div className="formLabel">
                        <label>Zip Code</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="number"
                          className="formItem"
                          value={leadsEditState.postal_code}
                          onChange={(e) => {
                            setLeadsEditState({
                              ...leadsEditState,
                              postal_code: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-6">
                      <div className="formLabel">
                        <label>Gender</label>
                      </div>
                      <div className="col-12">
                        <select
                          name=""
                          id=""
                          className="formItem "
                          value={leadsEditState.gender}
                          onChange={(e) =>
                            setLeadsEditState({
                              ...leadsEditState,
                              gender: e.target.value,
                            })
                          }
                        >
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                          <option value="O">Other</option>
                        </select>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="d-flex justify-content-between">
                  <button
                    className="panelButton m-0"
                    onClick={() => handleUpdateLeads()}
                  >
                    <span className="text">Confirm</span>
                    <span className="icon">
                      <i className="fa-solid fa-check"></i>
                    </span>
                  </button>
                  <button
                    className="panelButton gray m-0 float-end"
                    onClick={() => setPopUp(false)}
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
        ) : (
          ""
        )}
      </section>
      {loading && <CircularLoader />}
    </main>
  );
}

export default CampaignCreate;
