/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import {
  backToTop,
  generalDeleteFunction,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";
import ActionList from "../../CommonComponents/ActionList";
import { useForm } from "react-hook-form";
import {
  nameNumberValidator,
  noSpecialCharactersValidator,
  requiredValidator,
  restrictToAllowedChars,
  restrictToNumbers,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import Header from "../../CommonComponents/Header";
import SkeletonFormLoader from "../../Loader/SkeletonFormLoader";
import AddMusic from "../../CommonComponents/AddMusic";

function CallCenterQueueEdit() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(useLocation().search);
  const value = queryParams.get("id");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const account = useSelector((state) => state.account);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const [prevAgents, setPrevAgents] = useState([]);
  const [greetingSound, setGreetingSound] = useState();
  const [holdSound, setHoldSound] = useState();
  const [announcmentSound, setAnnouncmentSound] = useState();
  const [advance, setAdvance] = useState([]);
  const [showMusicGreet, setShowMusicGreet] = useState(false);
  const [uploadedMusicGreet, setUploadedMusicGreet] = useState();
  const [musicRefreshGreet, setMusicRefreshGreet] = useState(0);
  const [showMusicAnnouncement, setShowMusicAnnouncement] = useState(false);
  const [uploadedMusicAnnouncement, setUploadedMusicAnnouncement] = useState();
  const [musicRefreshAnnouncement, setMusicRefreshAnnouncement] = useState(0);
  const [showMusicHold, setShowMusicHold] = useState(false);
  const [uploadedMusicHold, setUploadedMusicHold] = useState();
  const [musicRefreshHold, setMusicRefreshHold] = useState(0);
  const [bulkAddPopUp, setBulkAddPopUp] = useState(false);
  const [bulkUploadSelectedAgents, setBulkUploadSelectedAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [bulkEditAllToggle, setBulkEditAllToggle] = useState(true);
  const [bulkEditPopup, setBulkEditPopup] = useState(false);
  const [selectedAgentToEdit, setSelectedAgentToEdit] = useState([]);
  const [settingsForBulkEdit, setSettingsForBulkEdit] = useState({
    tier_level: 0,
    tier_position: 0,
    call_timeout: "",
    reject_delay: "",
    max_no_answer: "",
    busy_delay: "",
    no_answer_delay: "",
    wrap_up_time: "",
    reserve_agents: 0,
    truncate_agents_on_load: 0,
    truncate_tiers_on_load: 0,
  });
  // Define the initial state of the form
  const [agent, setAgent] = useState([
    {
      id: Math.floor(Math.random() * 10000),
      name: "",
      level: "0",
      position: "0",
      type: "callback",
      password: "1234",
      contact: "",
      time_base_score: "queue",
      tier_rules_apply: 0,
      tier_rule_wait_second: null,
      tier_rule_wait_multiply_level: 0,
      tier_rule_no_agent_no_wait: 1,
    },
  ]);
  const {
    register,
    setError: setErr,
    clearErrors,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      // status: true, // Set the default value for "status" to true
      call_timeout: `${160}`,
    },
  });

  // Calling api for getting user data and call center queue data
  useEffect(() => {
    if (account && account.id) {
      async function getData() {
        setLoading(true);
        const userData = await generalGetFunction("/user/all");
        const callCenterData = await generalGetFunction(
          `call-center-queues/show/${value}`
        );
        if (userData?.status) {
          setLoading(false);
          if (userData.data.data.length === 0) {
            toast.error("Please create user first");
          } else {
            const filterUser = userData.data.data.filter(
              (item) => item.extension_id !== null
            );

            if (filterUser.length > 0) {
              setUser(filterUser);
            } else {
              toast.error("No user found with assign extension");
            }
          }
        } else {
          setLoading(false);
        }
        if (callCenterData?.status) {
          setLoading(false);
          const { agents, recording_enabled } = callCenterData.data;
          setPrevAgents(agents);
          setAgent(
            agents.map((item, index) => {
              return {
                id: item.id,
                name: item.agent_name,
                level: item.tier_level,
                call_timeout: item.call_timeout,
                reject_delay_time: item.reject_delay_time,
                max_no_answer: item.max_no_answer,
                no_answer_delay_time: item.no_answer_delay_time,
                wrap_up_time: item.wrap_up_time,
                reserve_agents: item.reserve_agents,
                busy_delay_time: item.busy_delay_time,
                position: item.tier_position,
                type: item.type,
                password: item?.password,
                contact: item.contact,
                "truncate-agents-on-load": item["truncate_agents_on_load"],
                "truncate-tiers-on-load": item["truncate_tiers_on_load"],
              };
            })
          );

          const destructuredData = {
            ...callCenterData.data,
            ...{
              recording_enabled: recording_enabled === 1 ? "true" : "false",
            },
          };

          reset(destructuredData);
        } else {
          setLoading(false);
          navigate(-1);
        }
      }
      getData();
    } else {
      setLoading(false);
    }
  }, []);

  // Calling user and sound api to get user and sound data at time of page render
  useEffect(() => {
    async function getData() {
      const musicData = await generalGetFunction("/sound/all");
      if (musicData?.status) {
        setGreetingSound(
          musicData.data.filter((item) => item.type === "ringback")
        );
        if (musicData.data.length > 0 && uploadedMusicGreet) {
          setValue("greeting", `${uploadedMusicGreet.id}`);
        }
        setHoldSound(musicData.data.filter((item) => item.type === "hold"));
        if (musicData.data.length > 0 && uploadedMusicHold) {
          setValue("moh_sound", `${uploadedMusicHold.id}`);
        }
        setAnnouncmentSound(
          musicData.data.filter((item) => item.type === "announcement")
        );
        if (musicData.data.length > 0 && uploadedMusicAnnouncement) {
          setValue("queue_announce_sound", `${uploadedMusicAnnouncement.id}`);
        }
      }
    }
    getData();
  }, [
    account.account_id,
    musicRefreshAnnouncement,
    musicRefreshGreet,
    musicRefreshHold,
  ]);

  const actionListValue = (value) => {
    setValue("queue_timeout_action", value[0]);
  };

  const checkPrevAgents = (id) => {
    const result = prevAgents.filter((item, idx) => {
      return item.id == id;
    });
    if (result.length > 0) return true;
    return false;
  };

  // Add new agent with some default value
  function addNewAgent() {
    setAgent([
      ...agent,
      {
        id: Math.floor(Math.random() * 10000),
        name: "",
        level: "0",
        position: "0",
        type: "callback",
        password: "1234",
        call_timeout: "",
        reject_delay_time: "",
        max_no_answer: "",
        no_answer_delay_time: "",
        wrap_up_time: "",
        reserve_agents: 0,
        "truncate-agents-on-load": 0,
        "truncate-tiers-on-load": 0,
        busy_delay_time: "",
        contact: "",
      },
    ]);
  }
  // if (agent.length === 0) {
  //   addNewAgent();
  // }

  // Handle agent change
  const handleAgentChange = (event, index) => {
    const { name, value } = event.target; // Extract name and selected value

    // Check if the user chose to add a new user
    if (value === "addUser") {
      navigate("/users-add");
      return;
    }

    const newAgent = [...agent]; // Copy the agent array
    newAgent[index][name] = value; // Update the name (id) of the selected agent

    // Find the selected user from the user list to set contact info
    const selectedUser = user.find((userItem) => userItem.id == value);
    if (selectedUser) {
      newAgent[index][
        "contact"
      ] = `user/${selectedUser.extension?.extension}@${selectedUser.domain?.domain_name}`;
    }

    setAgent(newAgent); // Update the agent array in the state

    // Validate agents to ensure no duplicates and required fields are filled
    if (!validateUniqueAgents()) {
      setErr("agent", {
        type: "manual",
        message: "Same agent can't be selected for two or more fields",
      });
    } else if (validateAgents()) {
      clearErrors("agent");
    } else {
      setErr("agent", {
        type: "manual",
        message: "Agent name and password required in all rows",
      });
    }
  };

  const validateAgents = () => {
    const allFieldsFilled = agent.every(
      (item) => item?.name?.trim() !== "" && item?.password?.trim() !== ""
    );
    return allFieldsFilled;
  };

  // Validate unique agents
  const validateUniqueAgents = () => {
    const agentValues = agent.map((item) => item.name);
    const uniqueValues = [...new Set(agentValues)];
    return agentValues.length == uniqueValues.length;
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  // Handle form submit and validation
  const handleFormSubmit = handleSubmit(async (data) => {
    if (!validateAgents()) {
      setErr("agent", {
        type: "manual",
        message: "Agent name and password required in all rows",
      });
      return;
    }
    if (agent.length === 0) {
      toast.error("Please add at least one agent");
      return;
    }

    setLoading(true);
    const { recording_enabled } = data;

    const payload = {
      ...data,
      ...{
        // recording_enabled: record_template === "true" ? 1 : 0,
        recording_enabled: recording_enabled === "true" ? 1 : 0,
        account_id: account.account_id,
        created_by: account.id,
      },

      // set the default values as per freeswitch requirements
      ...{
        max_wait_time:
          data.max_wait_time === "" ? 0 : Number(data.max_wait_time),
        max_wait_time_with_no_agent:
          data.max_wait_time_with_no_agent === ""
            ? 0
            : Number(data.max_wait_time_with_no_agent),
        max_wait_time_with_no_agent_time_reached:
          data.max_wait_time_with_no_agent_time_reached === ""
            ? 5
            : Number(data.max_wait_time_with_no_agent_time_reached),
        ring_progressively_delay:
          data.ring_progressively_delay === ""
            ? 10
            : Number(data.ring_progressively_delay),
      },

      ...{
        agents: agent
          .map((item) => {
            // Call checkPrevDestination with the current item
            const hasId = checkPrevAgents(item.id);

            if (item.name.length > 0) {
              // Return the object with or without 'id' based on hasId
              return {
                agent_name: item.name,
                reserve_agents: item.reserve_agents,
                truncate_agents_on_load: item["truncate-agents-on-load"],
                truncate_tiers_on_load: item["truncate-tiers-on-load"],
                tier_level: item.level,
                call_timeout:
                  item.call_timeout === null ? null : Number(item.call_timeout),
                reject_delay_time:
                  item.reject_delay_time === null
                    ? null
                    : Number(item.reject_delay_time),
                max_no_answer:
                  item.max_no_answer === null
                    ? null
                    : Number(item.max_no_answer),
                no_answer_delay_time:
                  item.no_answer_delay_time === null
                    ? null
                    : Number(item.no_answer_delay_time),
                wrap_up_time:
                  item.wrap_up_time === null ? null : Number(item.wrap_up_time),
                busy_delay_time:
                  item.busy_delay_time === null
                    ? null
                    : Number(item.busy_delay_time),
                queue_timeout:
                  item.queue_timeout === null
                    ? null
                    : Number(item.queue_timeout),
                tier_position: item.position,
                type: item.type,
                // status: "Logged Out",
                password: item.password,
                contact: item.contact,
                ...(hasId ? { id: item.id } : {}), // Conditionally add 'id' field
              };
            } else {
              return null;
            }
          })
          .filter((item) => item !== null),
      },
    };
    setLoading(true);
    // delete payload.record_template;
    const apiData = await generalPutFunction(
      `/call-center-queues/update/${value}`,
      payload
    );
    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message);
      dispatch({
        type: "SET_CALLCENTERREFRESH",
        callCenterRefresh: callCenterRefresh + 1,
      });
      navigate("/cal-center-queue");
    } else {
      setLoading(false);
      // if (apiData.error) {
      //   toast.error(apiData.error);
      // } else {
      //   const errorMessage = Object.keys(apiData.errors);
      //   toast.error(apiData.errors[errorMessage[0]][0]);
      // }
    }
  });

  // Check if a destination i spreviously exit or not
  const checkPrevDestination = (id) => {
    const result = prevAgents.filter((item, idx) => {
      return item.id == id;
    });
    if (result.length > 0) return true;
    return false;
  };

  // Delete destination based on previously present or newely added
  async function deleteDestination(id) {
    const updatedArr = agent.filter((item) => item.id !== id);
    if (checkPrevDestination(id)) {
      setLoading(true);
      const deleteGroup = await generalDeleteFunction(
        `/call-center-agent/destroy/${id}`
      );
      if (deleteGroup.status) {
        const updatedDestination = updatedArr;
        if (validateAgents()) {
          clearErrors("agent");
        }
        setAgent(updatedDestination);
        setLoading(false);
        toast.success(deleteGroup.message);
      } else {
        setLoading(false);
        toast.error(deleteGroup.message);
      }
    } else {
      setAgent(updatedArr);
    }

    const allFieldsFilled = updatedArr.every(
      (item) => item?.name?.trim() !== "" && item?.password?.trim() !== ""
    );
    if (allFieldsFilled) {
      clearErrors("agent");
    }
  }
  // console.log(user);
  // Handle advance click
  function handleAdvance(id) {
    if (advance.includes(id)) {
      setAdvance(advance.filter((item) => item !== id));
    } else {
      setAdvance([...advance, id]);
    }
  }
  const handleAddMusicGreet = () => {
    setValue("greeting", "");
    setShowMusicGreet(true);
  };
  const handleAddMusicAnnouncement = () => {
    setValue("queue_announce_sound", "");
    setShowMusicAnnouncement(true);
  };
  const handleAddMusicHold = () => {
    setValue("moh_sound", "");
    setShowMusicHold(true);
  };

  console.log(user, agent);
  const handleCheckboxChange = (item) => {
    setBulkUploadSelectedAgents((prevSelected) => {
      if (prevSelected.some((agent) => agent.name == item.name)) {
        // If the item is already in the array, remove it
        return prevSelected.filter((agent) => agent.name !== item.name);
      } else {
        // Otherwise, add the item
        return [...prevSelected, item];
      }
    });
  };
  console.log(user, agent);

  const handleBulkUpload = (selectedAgents) => {
    console.log(selectedAgents);
    const newAgents = [...agent]; // Copy the current agent array

    selectedAgents.forEach((selectedAgent) => {
      const existingAgentIndex = newAgents.findIndex(
        (a) => a.name == selectedAgent.id
      );

      if (existingAgentIndex == -1) {
        // Add new agent if it doesn't already exist
        newAgents.push({
          name: `${selectedAgent.id}`,
          contact: `user/${selectedAgent.extension?.extension}@${selectedAgent.domain?.domain_name}`,

          id: Math.floor(Math.random() * 10000),

          level: "0",
          position: "0",
          type: "callback",
          password: "1234",

          call_timeout: "",
          max_no_answer: "",
          no_answer_delay_time: "",

          reject_delay_time: "",

          reserve_agents: 0,

          "truncate-agents-on-load": 0,
          "truncate-tiers-on-load": 0,
          time_base_score: "queue",

          wrap_up_time: "",
          busy_delay_time: "",
        });
      }
    });

    setAgent(newAgents); // Update the agent state
    setBulkAddPopUp(false);
  };
  function truncateString(str) {
    if (str.length > 8) {
      return str.substring(0, 8) + "...";
    }
    return str; // Return the string as is if it's 8 characters or less
  }
  const filteredUsers = user?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user?.extension?.extension || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Filter out agents already added
  const availableUsers = filteredUsers?.filter(
    (user) => !agent.some((agent) => user.id == agent.name)
  );

  // Handle Select All
  const handleSelectAll = () => {
    const newSelectAllState = !selectAll; // Toggle Select All state
    setSelectAll(newSelectAllState);

    if (newSelectAllState) {
      // Add all visible users to bulkUploadSelectedAgents
      availableUsers.forEach((item) => {
        if (
          !bulkUploadSelectedAgents.some((agent) => agent.name == item.name)
        ) {
          handleCheckboxChange(item);
        }
      });
    } else {
      // Remove all visible users from bulkUploadSelectedAgents
      availableUsers.forEach((item) => {
        if (bulkUploadSelectedAgents.some((agent) => agent.name == item.name)) {
          handleCheckboxChange(item);
        }
      });
    }
  };

  const handleSelectUserToEdit = (item) => {
    setSelectedAgentToEdit((prevSelected) => {
      if (prevSelected.some((agent) => agent.name == item.name)) {
        return prevSelected.filter((agent) => agent.name !== item.name);
      } else {
        return [...prevSelected, item];
      }
    });
  };

  const handleApplyEditSettings = (data) => {
    const updatedAgents = selectedAgentToEdit.map((item) => {
      return {
        ...item,
        busy_delay_time: data.busy_delay,
        call_timeout: data.call_timeout,
        level: data.tier_level,
        max_no_answer: data.max_no_answer,
        no_answer_delay_time: data.no_answer_delay,
        position: data.tier_position,
        reject_delay_time: data.reject_delay,
        reserve_agents: data.reserve_agents,
        "truncate-agents-on-load": data.truncate_agents_on_load,
        "truncate-tiers-on-load": data.truncate_tiers_on_load,
        wrap_up_time: data.wrap_up_time,
      };
    });

    // Merge unselected agents with updated selected agents
    const mergedAgents = agent.map((agent) => {
      // Check if the agent is in the selectedAgentToEdit array
      const updatedAgent = updatedAgents.find(
        (updated) => updated.id === agent.id // Assuming `id` is the unique identifier
      );
      return updatedAgent || agent; // Use the updated agent if found, otherwise keep the original
    });

    setAgent(mergedAgents);
    setBulkEditPopup(false);
  };
  console.log(selectedAgentToEdit);
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="Call Center Queue" />
          {/* <div id="subPageHeader">
            <div className="col-xl-6 my-auto">
            </div>
            <div className="col-xl-6 ps-2">
              <div className="d-flex align-items-center justify-content-end">
                <div className="d-flex align-items-center">
                  <div className="formLabel py-0 me-2">
                    <label htmlFor="selectFormRow">Enabled</label>
                  </div>
                  <div className="my-auto position-relative mx-1">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={watch().status}
                        {...register("status")}
                        id="showAllCheck"
                      />
                      <span className="slider round" />
                    </label>
                  </div>
                </div>
                <button
                  effect="ripple"
                  className="panelButton"
                  onClick={() => {
                    backToTop();
                    navigate(-1);
                  }}
                >
                  <span className="text">Back</span>
                  <span className="icon"><i class="fa-solid fa-caret-left"></i></span>
                </button>
                <button
                  effect="ripple"
                  className="panelButton"
                  onClick={handleFormSubmit}
                >
                  <span className="text">Save</span>
                  <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                </button>
              </div>
            </div>
          </div> */}
        </div>
        <div className="col-xl-12">
          {loading ? (
            <div colSpan={99}>
              <SkeletonFormLoader />
            </div>
          ) : (
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div
                  className="d-flex flex-wrap"
                  style={{ position: "sticky", top: "0", zIndex: "9" }}
                >
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Edit Call Center Queue</h4>
                        <p>Edit the configurations of the call center queue</p>
                      </div>
                      <div className="buttonGroup">
                        <div className="d-flex align-items-center">
                          <div className="formLabel py-0 me-2">
                            <label htmlFor="selectFormRow">Enabled</label>
                          </div>
                          <div className="my-auto position-relative mx-1">
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={watch().status}
                                {...register("status")}
                                id="showAllCheck"
                              />
                              <span className="slider round" />
                            </label>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            navigate(-1);
                            backToTop();
                          }}
                          type="button"
                          effect="ripple"
                          className="panelButton gray"
                        >
                          <span className="text">Back</span>
                          <span className="icon">
                            <i class="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        <button
                          effect="ripple"
                          className="panelButton"
                          onClick={handleFormSubmit}
                        >
                          <span className="text">Save</span>
                          <span className="icon">
                            <i class="fa-solid fa-floppy-disk"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="col-12"
                  style={{
                    padding: "25px 23px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <form action="#" className="tangoNavs mb-0">
                    <nav>
                      <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button
                          class="nav-link active"
                          id="nav-gen-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-gen"
                          type="button"
                          role="tab"
                          aria-controls="nav-gen"
                          aria-selected="true"
                        >
                          General{" "}
                          {errors?.queue_name?.message && (
                            <i
                              class="fa fa-exclamation-circle text-danger"
                              aria-hidden="true"
                            ></i>
                          )}
                        </button>
                        <button
                          class="nav-link"
                          id="nav-tier-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-tier"
                          type="button"
                          role="tab"
                          aria-controls="nav-tier"
                          aria-selected="false"
                        >
                          Tier Rules
                        </button>
                        <button
                          class="nav-link"
                          id="nav-max-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-max"
                          type="button"
                          role="tab"
                          aria-controls="nav-max"
                          aria-selected="false"
                        >
                          Max Wait Time
                        </button>
                        <button
                          class="nav-link"
                          id="nav-queue-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-queue"
                          type="button"
                          role="tab"
                          aria-controls="nav-queue"
                          aria-selected="false"
                        >
                          Queue Announcement
                        </button>
                        <button
                          class="nav-link"
                          id="nav-adv-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-adv"
                          type="button"
                          role="tab"
                          aria-controls="nav-adv"
                          aria-selected="false"
                        >
                          Advanced
                        </button>
                      </div>
                    </nav>
                    <div class="tab-content" id="nav-tabContent">
                      <div
                        class="tab-pane fade show active"
                        id="nav-gen"
                        role="tabpanel"
                        aria-labelledby="nav-gen-tab"
                        tabindex="0"
                      >
                        <form className="row col-12 mx-auto mb-0">
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">
                                Queue Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <label htmlFor="data" className="formItemDesc">
                                Enter the queue name.
                              </label>
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                name="extension"
                                {...register("queue_name", {
                                  ...requiredValidator,
                                  ...nameNumberValidator,
                                })}
                                className="formItem"
                                onKeyDown={restrictToAllowedChars}
                              />
                              {errors.queue_name && (
                                <ErrorMessage
                                  text={errors.queue_name.message}
                                />
                              )}
                            </div>
                          </div>

                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Greeting</label>
                              <label htmlFor="data" className="formItemDesc">
                                Select the desired Greeting.
                              </label>
                            </div>
                            <div className="col-6">
                              <select
                                {...register("greeting")}
                                className="formItem w-100"
                                onChange={(e) => {
                                  const selectedValue = e.target.value;
                                  if (selectedValue === "add-music") {
                                    handleAddMusicGreet(); // Call your function here
                                  }
                                }}
                              >
                                <option disabled value="" selected>
                                  Select Greeting
                                </option>
                                {greetingSound &&
                                  greetingSound.map((item, index) => {
                                    return (
                                      <option key={index} value={item.id}>
                                        {item.name}
                                      </option>
                                    );
                                  })}
                                <option
                                  value="add-music"
                                  className="addmusic"
                                  style={{ cursor: "pointer" }}
                                >
                                  Add Music
                                </option>
                              </select>
                              {errors.greeting && (
                                <ErrorMessage text={errors.greeting.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Strategy</label>
                              <label htmlFor="data" className="formItemDesc">
                                Select the queue ring strategy.
                              </label>
                            </div>
                            <div className="col-6">
                              <select
                                {...register("strategy")}
                                className="formItem w-100"
                              >
                                <option value="ring-all">Ring All</option>
                                <option value="top-down">Top Down</option>
                                <option value="sequentially-by-agent-order">
                                  Sequentially by agent order
                                </option>

                                <option value="random">Random</option>
                                <option value="ring-progressively">
                                  Ring Progressively
                                </option>
                              </select>
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Music on Hold</label>
                              <label htmlFor="data" className="formItemDesc">
                                Select the desired hold music.
                              </label>
                            </div>
                            <div className="col-6">
                              <select
                                {...register("moh_sound")}
                                className="formItem w-100"
                                onChange={(e) => {
                                  const selectedValue = e.target.value;
                                  if (selectedValue === "add-music") {
                                    handleAddMusicHold(); // Call your function here
                                  }
                                }}
                              >
                                <option disabled value="" selected>
                                  Select Hold Music
                                </option>
                                {holdSound &&
                                  holdSound.map((item, index) => {
                                    return (
                                      <option key={index} value={item.id}>
                                        {item.name}
                                      </option>
                                    );
                                  })}
                                <option
                                  value="add-music"
                                  className="addmusic"
                                  style={{ cursor: "pointer" }}
                                >
                                  Add Music
                                </option>
                              </select>
                              {errors.moh_sound && (
                                <ErrorMessage text={errors.moh_sound.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Record</label>
                              <label htmlFor="data" className="formItemDesc">
                                Save the recording.
                              </label>
                            </div>
                            <div className="col-6">
                              <select
                                {...register("recording_enabled")}
                                className="formItem w-100"
                                name="recording_enabled"
                                defaultValue={"false"}
                              >
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </select>
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Action</label>
                              <label htmlFor="data" className="formItemDesc">
                                Set the action to perform when the max wait time
                                is reached.
                              </label>
                            </div>
                            <div className="col-6">
                              <ActionList
                                title={null}
                                label={null}
                                getDropdownValue={actionListValue}
                                value={watch().queue_timeout_action}
                              />
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Discard Abandoned After</label>
                              <label htmlFor="data" className="formItemDesc">
                                The number of seconds before the abandoned call
                                is removed from the queue.
                              </label>
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("discard_abandoned_after", {
                                  ...noSpecialCharactersValidator,
                                })}
                                onKeyDown={restrictToAllowedChars}
                              />
                              {errors.discard_abandoned_after && (
                                <ErrorMessage
                                  text={errors.discard_abandoned_after.message}
                                />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Caller ID Name Prefix</label>
                              <label htmlFor="data" className="formItemDesc">
                                Set a prefix on the caller ID name.
                              </label>
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("queue_cid_prefix", {
                                  ...noSpecialCharactersValidator,
                                })}
                                onKeyDown={restrictToAllowedChars}
                              />
                              {errors.queue_cid_prefix && (
                                <ErrorMessage
                                  text={errors.queue_cid_prefix.message}
                                />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Tag</label>
                              <label htmlFor="data" className="formItemDesc">
                                Set a tag.
                              </label>
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("tag", {
                                  ...noSpecialCharactersValidator,
                                })}
                                onKeyDown={restrictToAllowedChars}
                              />
                              {errors.tag && (
                                <ErrorMessage text={errors.tag.message} />
                              )}
                            </div>
                          </div>
                        </form>
                      </div>
                      <div
                        class="tab-pane fade"
                        id="nav-tier"
                        role="tabpanel"
                        aria-labelledby="nav-tier-tab"
                        tabindex="0"
                      >
                        <form className="row col-12 mx-auto mb-0">
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Tier Rules Apply</label>
                            </div>
                            <div className="col-6">
                              <select
                                {...register("tier_rules_apply")}
                                className="formItem w-100"
                                defaultValue={0}
                              >
                                <option value={1}>True</option>
                                <option value={0}>False</option>2{" "}
                              </select>
                            </div>
                          </div>

                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Tier Rule Wait Second</label>
                            </div>
                            <div className="col-6">
                              <input
                                type="number"
                                name="extension"
                                className="formItem"
                                {...register("tier_rule_wait_second", {
                                  ...noSpecialCharactersValidator,
                                })}
                              />
                              {errors.tier_rule_wait_second && (
                                <ErrorMessage
                                  text={errors.tier_rule_wait_second.message}
                                />
                              )}
                            </div>
                          </div>

                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">
                                Tier Rule Wait Multiply Level
                              </label>
                            </div>
                            <div className="col-6">
                              <select
                                {...register("tier_rule_wait_multiply_level")}
                                className="formItem w-100"
                                defaultValue={0}
                              >
                                <option value={1}>True</option>
                                <option value={0}>False</option>
                              </select>
                            </div>
                          </div>

                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">
                                Tier Rule No Agent No Wait
                              </label>
                            </div>
                            <div className="col-6">
                              <select
                                {...register("tier_rule_no_agent_no_wait")}
                                className="formItem w-100"
                                defaultValue={0}
                              >
                                <option value={1}>True</option>
                                <option value={0}>False</option>
                              </select>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div
                        class="tab-pane fade"
                        id="nav-max"
                        role="tabpanel"
                        aria-labelledby="nav-max-tab"
                        tabindex="0"
                      >
                        <form className="row col-12 mx-auto mb-0">
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Max Wait Time</label>
                            </div>
                            <div className="col-6">
                              <input
                                type="number"
                                name="extension"
                                className="formItem"
                                {...register("max_wait_time", {
                                  ...noSpecialCharactersValidator,
                                })}
                                onKeyDown={restrictToNumbers}
                              />
                              {errors.max_wait_time && (
                                <ErrorMessage
                                  text={errors.max_wait_time.message}
                                />
                              )}
                            </div>
                          </div>

                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">
                                Max Wait Time with no agent
                              </label>
                            </div>
                            <div className="col-6">
                              <input
                                type="number"
                                name="extension"
                                className="formItem"
                                {...register("max_wait_time_with_no_agent", {
                                  ...noSpecialCharactersValidator,
                                })}
                                onKeyDown={restrictToNumbers}
                              />
                              {errors.max_wait_time_with_no_agent && (
                                <ErrorMessage
                                  text={errors.max_wait_time_with_no_agent}
                                />
                              )}
                            </div>
                          </div>

                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">
                                Max Wait Time With No Agent Time Reached{" "}
                              </label>
                            </div>
                            <div className="col-6">
                              <input
                                type="number"
                                name="extension"
                                className="formItem"
                                {...register(
                                  "max_wait_time_with_no_agent_time_reached",
                                  {
                                    ...noSpecialCharactersValidator,
                                  }
                                )}
                                onKeyDown={restrictToNumbers}
                              />
                              {errors.max_wait_time_with_no_agent_time_reached && (
                                <ErrorMessage
                                  text={
                                    errors.max_wait_time_with_no_agent_time_reached
                                  }
                                />
                              )}
                            </div>
                          </div>
                        </form>
                      </div>
                      <div
                        class="tab-pane fade"
                        id="nav-queue"
                        role="tabpanel"
                        aria-labelledby="nav-queue-tab"
                        tabindex="0"
                      >
                        <form className="row col-12 mx-auto mb-0">
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Queue Announce</label>
                              <label htmlFor="data" className="formItemDesc">
                                Select the desired queue announce sound.
                              </label>
                            </div>
                            <div className="col-6">
                              <select
                                {...register("queue_announce_sound")}
                                className="formItem w-100"
                                onChange={(e) => {
                                  const selectedValue = e.target.value;
                                  if (selectedValue === "add-music") {
                                    handleAddMusicAnnouncement(); // Call your function here
                                  }
                                }}
                              >
                                <option disabled value="" selected>
                                  Select Queue Announce
                                </option>
                                {announcmentSound &&
                                  announcmentSound.map((item, index) => {
                                    return (
                                      <option key={index} value={item.id}>
                                        {item.name}
                                      </option>
                                    );
                                  })}
                                <option
                                  className="bg-primary text-white text-center"
                                  value="add-music"
                                >
                                  Add Music
                                </option>
                              </select>
                            </div>
                          </div>

                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Queue Announce Frequency</label>
                            </div>
                            <div className="col-6">
                              <input
                                type="number"
                                name="extension"
                                className="formItem"
                                {...register("queue_announce_frequency", {
                                  ...noSpecialCharactersValidator,
                                })}
                                onKeyDown={restrictToNumbers}
                              />
                              {errors.queue_announce_frequency && (
                                <ErrorMessage
                                  text={errors.queue_announce_frequency}
                                />
                              )}
                            </div>
                          </div>

                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Queue Description</label>
                              <label htmlFor="data" className="formItemDesc">
                                Define queue description.
                              </label>
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                name="queue_description"
                                className="formItem"
                                {...register("queue_description", {
                                  ...noSpecialCharactersValidator,
                                })}
                                onKeyDown={restrictToAllowedChars}
                              />
                              {errors.queue_description && (
                                <ErrorMessage text={errors.queue_description} />
                              )}
                            </div>
                          </div>

                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Queue Announcement</label>
                              <label htmlFor="data" className="formItemDesc">
                                Make Queue Announcement enable and disable.
                              </label>
                            </div>
                            <div className="col-xl-6 col-12">
                              <select
                                type="text"
                                name="queue_description"
                                defaultValue="0"
                                className="formItem"
                                {...register("queue_announcement", {
                                  ...noSpecialCharactersValidator,
                                })}
                                onKeyDown={restrictToAllowedChars}
                              >
                              <option value="1">Enable</option>
                              <option value="0">Disable</option>
                              </select>
                              {errors.queue_description && (
                                <ErrorMessage text={errors.queue_description} />
                              )}
                            </div>
                          </div>
                        </form>
                      </div>
                      <div
                        class="tab-pane fade"
                        id="nav-adv"
                        role="tabpanel"
                        aria-labelledby="nav-adv-tab"
                        tabindex="0"
                      >
                        <form className="row col-12 mx-auto mb-0">
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Ring Progressively Delay</label>
                            </div>
                            <div className="col-6">
                              <input
                                type="number"
                                name="extension"
                                className="formItem"
                                {...register("ring_progressively_delay", {
                                  ...noSpecialCharactersValidator,
                                })}
                                onKeyDown={restrictToNumbers}
                              />
                              {errors.ring_progressively_delay && (
                                <ErrorMessage
                                  text={errors.ring_progressively_delay}
                                />
                              )}
                            </div>
                          </div>

                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Record Template</label>
                              <label htmlFor="data" className="formItemDesc">
                                Define record template.
                              </label>
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                name="record_template"
                                className="formItem"
                                {...register("record_template", {
                                  ...noSpecialCharactersValidator,
                                })}
                                onKeyDown={restrictToAllowedChars}
                              />
                              {errors.record_template && (
                                <ErrorMessage text={errors.record_template} />
                              )}
                            </div>
                          </div>

                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Time Base Score</label>
                            </div>
                            <div className="col-6">
                              <select
                                {...register("time_base_score")}
                                className="formItem w-100"
                              >
                                <option value="queue">Queue</option>
                                <option value="system">System</option>
                              </select>
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="">Abandoned Resume Allowed</label>
                            </div>
                            <div className="col-6">
                              <select
                                {...register("abandoned_resume_allowed")}
                                className="formItem w-100"
                                defaultValue={0}
                              >
                                <option value={1}>True</option>
                                <option value={0}>False</option>
                              </select>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>

                    {/* <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Truncate Agents On Load</label>
                  <label htmlFor="data" className="formItemDesc">
                    Truncate Agents On Load.
                  </label>
                </div>
                <div className="col-6">
                  <select
                    {...register("truncate-agents-on-load")}
                    className="formItem w-100"
                    name="truncate-agents-on-load"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
              </div> */}

                    {/* <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Truncate Tiers On Load</label>
                  <label htmlFor="data" className="formItemDesc">
                    Truncate Tiers On Load.
                  </label>
                </div>
                <div className="col-6">
                  <select
                    {...register("truncate-tiers-on-load")}
                    className="formItem w-100"
                    name="truncate-tiers-on-load"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
              </div> */}
                  </form>
                </div>

                <div className="col-12">
                  <div class="heading bg-transparent border-bottom-0">
                    <div class="content">
                      <h4>List of Agents</h4>
                      <p>You can see the list of agents in this ring group.</p>
                    </div>
                    <div class="buttonGroup">
                      {selectedAgentToEdit.length > 0 &&
                        selectedAgentToEdit.length != agent.length ? (
                        <button
                          type="button"
                          class="panelButton"
                          onClick={() => {
                            setBulkEditPopup(true);
                          }}
                        >
                          <span class="text">Edit</span>
                          <span class="icon">
                            <i class="fa-solid fa-pen"></i>
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          class="panelButton"
                          onClick={() => {
                            setSelectedAgentToEdit(agent);
                            setBulkEditPopup(true);
                          }}
                        >
                          <span class="text">Edit All</span>
                          <span class="icon">
                            <i class="fa-solid fa-pen"></i>
                          </span>
                        </button>
                      )}

                      <button
                        type="button"
                        class="panelButton"
                        onClick={() => {
                          if (user.length !== agent.length)
                            setBulkAddPopUp(true);
                          else toast.warn("All agent selected");
                        }}
                      >
                        <span class="text">Add</span>
                        <span class="icon">
                          <i class="fa-solid fa-plus"></i>
                        </span>
                      </button>
                    </div>
                  </div>

                  {agent.length > 0 && (
                    <form className="row" style={{ padding: "0px 23px 20px" }}>
                      <div className="formRow col-xl-12 border-0">
                        {agent &&
                          agent.map((item, index) => {
                            return (
                              <div
                                className="row pb-3 pt-2 ps-3 col-12"
                                key={index}
                                style={{ borderBottom: "1px solid #8f8f8f47" }}
                              >
                                <div
                                  className="formLabel pe-2 m-0 d-flex justify-content-between"
                                  style={{ width: "40px" }}
                                >
                                  <div>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleSelectUserToEdit(item)
                                      }
                                      checked={selectedAgentToEdit.some(
                                        (agent) => agent.name == item.name
                                      )}
                                    ></input>
                                  </div>
                                  <label>{index + 1}.</label>
                                </div>
                                <div
                                  className={`row col-${advance.includes(item.id)
                                    ? "11"
                                    : "xxl-5 col-xl-6"
                                    }`}
                                >
                                  <div
                                    className={`col-${advance.includes(item.id) ? "2" : "4"
                                      } ps-0 pe-2`}
                                  >
                                    {index === 0 && <div className="formLabel">
                                      <label htmlFor="">
                                        Choose Agent{" "}
                                        <span className="text-danger">*</span>
                                      </label>
                                    </div>}
                                    <div className="position-relative">
                                      <select
                                        type="text"
                                        disabled
                                        name="name"
                                        value={item.name}
                                        onChange={(e) =>
                                          handleAgentChange(e, index)
                                        }
                                        className="formItem"
                                        placeholder="Destination"
                                      >
                                        <option value="" disabled>
                                          Choose agent
                                        </option>
                                        {user &&
                                          user
                                            .filter((userItem) => {
                                              // Keep the current agent for this index and exclude already selected ones in other indexes
                                              return (
                                                userItem.id ==
                                                agent[index]?.name || // Keep the current agent for this index
                                                !agent.some(
                                                  (agentItem, agentIndex) =>
                                                    agentItem.name ==
                                                    userItem.id &&
                                                    agentIndex != index
                                                ) // Exclude agents selected in other rows
                                              );
                                            })
                                            .map((userItem) => (
                                              <option
                                                value={userItem.id}
                                                key={userItem.id}
                                              >
                                                {userItem.alias
                                                  ? `${truncateString(
                                                    userItem?.alias
                                                  )} - ${userItem.extension
                                                    ?.extension
                                                  }`
                                                  : `${truncateString(
                                                    userItem?.name
                                                  )} - ${userItem.extension
                                                    ?.extension
                                                  }`}
                                                {/* {userItem.username} (
                                              {userItem.extension?.extension}) */}
                                              </option>
                                            ))}
                                        <option
                                          value="addUser"
                                          className="text-center border bg-info-subtle fs-6 fw-bold text-info"
                                          style={{ cursor: "pointer" }}
                                        >
                                          Add User
                                        </option>
                                      </select>
                                    </div>
                                  </div>
                                  <div
                                    className={`col-${advance.includes(item.id) ? "2" : "4"
                                      } ps-0 pe-2`}
                                  >
                                    {index === 0 && <div className="formLabel">
                                      <label htmlFor="">Password</label>
                                    </div>}
                                    <div className="position-relative">
                                      <input
                                        type="text"
                                        name="password"
                                        value={item.password}
                                        onChange={(e) =>
                                          handleAgentChange(e, index)
                                        }
                                        className="formItem"
                                        placeholder="Password"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    className={`col-${advance.includes(item.id) ? "1" : "2"
                                      } ps-0 pe-2`}
                                  >
                                    {index === 0 && <div className="formLabel">
                                      <label htmlFor="">Tier Level</label>
                                    </div>}
                                    <select
                                      className="formItem me-0"
                                      style={{ width: "100%" }}
                                      name="level"
                                      value={item.level}
                                      onChange={(e) =>
                                        handleAgentChange(e, index)
                                      }
                                      id="selectFormRow"
                                    >
                                      <option value={0}>0</option>
                                      <option value={1}>1</option>
                                      <option value={2}>2</option>
                                      <option value={3}>3</option>
                                      <option value={4}>4</option>
                                      <option value={5}>5</option>
                                      <option value={6}>6</option>
                                      <option value={7}>7</option>
                                      <option value={8}>8</option>
                                      <option value={9}>9</option>
                                    </select>
                                  </div>
                                  <div
                                    className={`col-${advance.includes(item.id) ? "1" : "2"
                                      } ps-0 pe-2`}
                                  >
                                    {index === 0 && <div className="formLabel">
                                      <label
                                        htmlFor=""
                                        style={{ whiteSpace: "nowrap" }}
                                      >
                                        Tier Position
                                      </label>
                                    </div>}
                                    <select
                                      className="formItem me-0"
                                      style={{ width: "100%" }}
                                      name="position"
                                      value={item.position}
                                      onChange={(e) =>
                                        handleAgentChange(e, index)
                                      }
                                      id="selectFormRow"
                                    >
                                      <option value={0}>0</option>
                                      <option value={1}>1</option>
                                      <option value={2}>2</option>
                                      <option value={3}>3</option>
                                      <option value={4}>4</option>
                                      <option value={5}>5</option>
                                      <option value={6}>6</option>
                                      <option value={7}>7</option>
                                      <option value={8}>8</option>
                                      <option value={9}>9</option>
                                    </select>
                                  </div>
                                  {advance.includes(item.id) && (
                                    <>
                                      <div className="col-2 ps-0 pe-2">
                                        {index === 0 && <div className="formLabel">
                                          <label htmlFor="">
                                            Call Timeout
                                          </label>
                                        </div>}
                                        <div className="position-relative">
                                          <input
                                            type="number"
                                            name="call_timeout"
                                            value={
                                              item.call_timeout === null
                                                ? ""
                                                : item.call_timeout
                                            }
                                            onChange={(e) =>
                                              handleAgentChange(e, index)
                                            }
                                            className="formItem"
                                            placeholder="Call Timeout"
                                          />
                                        </div>
                                      </div>

                                      <div className="col-2 ps-0 pe-2">
                                        {index === 0 && <div className="formLabel">
                                          <label htmlFor="">
                                            Reject Delay
                                          </label>
                                        </div>}
                                        <div className="position-relative">
                                          <input
                                            type="number"
                                            name="reject_delay_time"
                                            value={
                                              item.reject_delay_time === null
                                                ? ""
                                                : item.reject_delay_time
                                            }
                                            onChange={(e) =>
                                              handleAgentChange(e, index)
                                            }
                                            className="formItem"
                                            placeholder="Reject Delay"
                                          />
                                        </div>
                                      </div>

                                      <div className="col-2 ps-0 pe-2">
                                        {index === 0 && <div className="formLabel">
                                          <label htmlFor="">
                                            Max No Answer
                                          </label>
                                        </div>}
                                        <div className="position-relative">
                                          <input
                                            type="number"
                                            name="max_no_answer"
                                            value={
                                              item.max_no_answer === null
                                                ? ""
                                                : item.max_no_answer
                                            }
                                            onChange={(e) =>
                                              handleAgentChange(e, index)
                                            }
                                            className="formItem"
                                            placeholder="Max No Answer"
                                          />
                                        </div>
                                      </div>

                                      <div className="col-2 ps-0 pe-2">
                                        <div className="formLabel">
                                          {index === 0 ? (
                                            <label htmlFor="">Busy Delay</label>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                        <div className="position-relative">
                                          <input
                                            type="number"
                                            name="busy_delay_time"
                                            value={
                                              item.busy_delay_time === null
                                                ? ""
                                                : item.busy_delay_time
                                            }
                                            onChange={(e) =>
                                              handleAgentChange(e, index)
                                            }
                                            className="formItem"
                                            placeholder="Busy Delay"
                                          />
                                        </div>
                                      </div>

                                      <div className="col-2 ps-0 pe-2">
                                        <div className="formLabel">
                                          {index === 0 ? (
                                            <label htmlFor="">
                                              No Answer Delay
                                            </label>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                        <div className="position-relative">
                                          <input
                                            type="number"
                                            name="no_answer_delay_time"
                                            value={
                                              item.no_answer_delay_time === null
                                                ? ""
                                                : item.no_answer_delay_time
                                            }
                                            onChange={(e) =>
                                              handleAgentChange(e, index)
                                            }
                                            className="formItem"
                                            placeholder="No Answer Delay"
                                          />
                                        </div>
                                      </div>

                                      <div className="col-2 ps-0 pe-2">
                                        <div className="formLabel">
                                          {index === 0 ? (
                                            <label htmlFor="">
                                              Wrap Up Time
                                            </label>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                        <div className="position-relative">
                                          <input
                                            type="number"
                                            name="wrap_up_time"
                                            value={
                                              item.wrap_up_time === null
                                                ? ""
                                                : item.wrap_up_time
                                            }
                                            onChange={(e) =>
                                              handleAgentChange(e, index)
                                            }
                                            className="formItem"
                                            placeholder="Wrap Up Time"
                                          />
                                        </div>
                                      </div>

                                      <div className="col-2 ps-0 pe-2">
                                        <div className="formLabel">
                                          {index === 0 ? (
                                            <label htmlFor="">
                                              Reserve Agents
                                            </label>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                        <select
                                          className="formItem me-0"
                                          style={{ width: "100%" }}
                                          name="reserve_agents"
                                          value={item.reserve_agents}
                                          onChange={(e) =>
                                            handleAgentChange(e, index)
                                          }
                                          id="selectFormRow"
                                        >
                                          <option value={0}>False</option>
                                          <option value={1}>True</option>
                                        </select>
                                      </div>

                                      <div className="col-2 ps-0 pe-2">
                                        <div className="formLabel">
                                          {index === 0 ? (
                                            <label htmlFor="">
                                              Truncate agents on load
                                            </label>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                        <select
                                          className="formItem me-0"
                                          style={{ width: "100%" }}
                                          name="truncate-agents-on-load"
                                          value={
                                            item["truncate-agents-on-load"]
                                          }
                                          onChange={(e) =>
                                            handleAgentChange(e, index)
                                          }
                                          id="selectFormRow"
                                        >
                                          <option value={0}>False</option>
                                          <option value={1}>True</option>
                                        </select>
                                      </div>

                                      <div className="col-2 ps-0 pe-2">
                                        <div className="formLabel">
                                          {index === 0 ? (
                                            <label htmlFor="">
                                              Truncate tiers on load
                                            </label>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                        <select
                                          className="formItem me-0"
                                          style={{ width: "100%" }}
                                          name="truncate-tiers-on-load"
                                          value={item["truncate-tiers-on-load"]}
                                          onChange={(e) =>
                                            handleAgentChange(e, index)
                                          }
                                          id="selectFormRow"
                                        >
                                          <option value={0}>False</option>
                                          <option value={1}>True</option>
                                        </select>
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div className="row col mt-xxl-0 mt-md-2 mt-xl-2">
                                  {
                                    <div
                                      onClick={() => handleAdvance(item.id)}
                                      className="col-auto px-0 mt-auto"
                                    >
                                      <button
                                        type="button"
                                        className={`tableButton edit my-auto ${agent.length < 2 ? "me-2" : ""
                                          }`}
                                      >
                                        <i
                                          className={`fa-solid fa-${advance.includes(item.id)
                                            ? "gear"
                                            : "gears"
                                            }`}
                                        ></i>
                                      </button>
                                    </div>
                                  }

                                  {agent.length === 1 ? (
                                    ""
                                  ) : (
                                    <div
                                      onClick={() => deleteDestination(item.id)}
                                      className="col-auto px-0 mt-auto ms-2"
                                    >
                                      <button
                                        type="button"
                                        className="tableButton delete"
                                      >
                                        <i className="fa-solid fa-trash"></i>
                                      </button>
                                    </div>
                                  )}

                                  {/* {index === agent.length - 1 &&
                                  index !== (user && user.length - 1) ? (
                                  <div
                                    onClick={addNewAgent}
                                    className="col-auto px-0 mt-auto"
                                  >
                                    <button
                                      type="button"
                                      className="panelButton ms-0"
                                    >
                                      <span className="text">Add</span>
                                      <span className="icon">
                                        <i class="fa-solid fa-plus"></i>
                                      </span>
                                    </button>
                                  </div>
                                ) : (
                                  ""
                                )} */}
                                </div>
                              </div>
                            );
                          })}
                        {errors.agent && (
                          <ErrorMessage text={errors.agent.message} />
                        )}
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      {showMusicGreet && (
        <AddMusic
          show={showMusicGreet}
          setShow={setShowMusicGreet}
          setUploadedMusic={setUploadedMusicGreet}
          setMusicRefresh={setMusicRefreshGreet}
          musicRefresh={musicRefreshGreet}
          listArray={["ringback"]}
        />
      )}
      {showMusicAnnouncement && (
        <AddMusic
          show={showMusicAnnouncement}
          setShow={setShowMusicAnnouncement}
          setUploadedMusic={setUploadedMusicAnnouncement}
          setMusicRefresh={setMusicRefreshAnnouncement}
          musicRefresh={musicRefreshAnnouncement}
          listArray={["announcement"]}
        />
      )}
      {showMusicHold && (
        <AddMusic
          show={showMusicHold}
          setShow={setShowMusicHold}
          setUploadedMusic={setUploadedMusicHold}
          setMusicRefresh={setMusicRefreshHold}
          musicRefresh={musicRefreshHold}
          listArray={["hold"]}
        />
      )}
      {bulkAddPopUp ? (
        <div className="addNewContactPopup">
          <div className="row">
            <div className="col-12 heading mb-0">
              <i className="fa-light fa-user-plus" />
              <h5>Add People to the selected Queue</h5>
              {/* <p>
                Add people to yourqueue effortlessly, keeping your connections
                organized and efficient
              </p> */}
              {/* <div className="border-bottom col-12" /> */}
            </div>
            <div className="col-xl-12">
              <div className="col-12 d-flex justify-content-between align-items-center">
                <input
                  type="text"
                  className="formItem"
                  placeholder="Search"
                  name="name"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button
                  className="tableButton ms-2"
                  onClick={() => navigate("/users-add")}
                >
                  <i className="fa-solid fa-user-plus"></i>
                </button>
              </div>
            </div>
            <div className="col-xl-12 mt-3">
              <div
                className="tableContainer mt-0"
                style={{ maxHeight: "calc(100vh - 400px)" }}
              >
                <table>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Name</th>
                      <th>Extension</th>
                      <th>
                        <input
                          type="checkbox"
                          onChange={handleSelectAll} // Call handler on change
                          checked={selectAll ? true : false} // Keep checkbox state in sync
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {user
                      .sort((a, b) => {
                        const aMatches =
                          a.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          (a?.extension?.extension || "")
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase());
                        const bMatches =
                          b.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          (b?.extension?.extension || "")
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase());
                        return bMatches - aMatches;
                      })
                      .filter(
                        (user) => !agent.some((agent) => user.id == agent.name)
                      ) // Exclude agents already in `agent`
                      .map((item, index) => (
                        <tr key={item.id || index}>
                          <td>{index + 1}.</td>
                          <td>{item.name}</td>
                          <td>{item?.extension?.extension}</td>
                          <td>
                            <input
                              type="checkbox"
                              onChange={() => handleCheckboxChange(item)} // Call handler on change
                              checked={bulkUploadSelectedAgents.some(
                                (agent) => agent.name == item.name
                              )}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-xl-12 mt-2">
              <div className="d-flex justify-content-between">
                <button
                  className="panelButton gray ms-0"
                  onClick={() => {
                    setBulkAddPopUp(false);
                  }}
                >
                  <span className="text">Close</span>
                  <span className="icon">
                    <i className="fa-solid fa-caret-left" />
                  </span>
                </button>
                <button
                  className="panelButton me-0"
                  onClick={() => handleBulkUpload(bulkUploadSelectedAgents)}
                >
                  <span className="text">Done</span>
                  <span className="icon">
                    <i className="fa-solid fa-check" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* {bulkEditPopup ? (
        <div className="addNewContactPopup">
          <div className="row">
            <div className="col-12 heading mb-0">
              <i className="fa-light fa-user-plus" />
              <h5>Edit People to the selected Queue</h5>
            </div>
            <div>
              Affected user:{" "}
              {selectedAgentToEdit
                .map((item) => user.find((user) => item.name == user.id))
                .map((items) => items.name)
                .join(", ")}
            </div>
            <div className="col-xl-12">
              <div className="col-12 d-flex justify-content-between align-items-center"></div>
            </div>
            <div className="col-12 mt-3">
              <div className="row">
                <div className="col-4">
                  <div className="formLabel">
                    <label htmlFor="">Tier Level</label>
                  </div>
                  <select
                    className="formItem me-0"
                    style={{ width: "100%" }}
                    name="level"
                    value={settingsForBulkEdit.tier_level}
                    onChange={(e) =>
                      setSettingsForBulkEdit({
                        ...settingsForBulkEdit,
                        tier_level: e.target.value,
                      })
                    }
                    id="selectFormRow"
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={9}>9</option>
                  </select>
                </div>
                <div className="col-4">
                  <div className="formLabel">
                    <label htmlFor="" style={{ whiteSpace: "nowrap" }}>
                      Tier Position
                    </label>
                  </div>
                  <select
                    className="formItem me-0"
                    style={{ width: "100%" }}
                    name="position"
                    value={settingsForBulkEdit.tier_position}
                    onChange={(e) =>
                      setSettingsForBulkEdit({
                        ...settingsForBulkEdit,
                        tier_position: e.target.value,
                      })
                    }
                    id="selectFormRow"
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={9}>9</option>
                  </select>
                </div>

                <div className="col-4 ">
                  <div className="formLabel">
                    <label htmlFor="">Call Timeout</label>
                  </div>
                  <div className="position-relative">
                    <input
                      type="number"
                      name="call_timeout"
                      value={settingsForBulkEdit.call_timeout}
                      onChange={(e) =>
                        setSettingsForBulkEdit({
                          ...settingsForBulkEdit,
                          call_timeout: e.target.value,
                        })
                      }
                      className="formItem"
                      placeholder="Call Timeout"
                    />
                  </div>
                </div>

                <div className="col-4 ">
                  <div className="formLabel">
                    <label htmlFor="">Reject Delay</label>
                  </div>
                  <div className="position-relative">
                    <input
                      type="number"
                      name="reject_delay_time"
                      value={settingsForBulkEdit.reject_delay}
                      onChange={(e) =>
                        setSettingsForBulkEdit({
                          ...settingsForBulkEdit,
                          reject_delay: e.target.value,
                        })
                      }
                      className="formItem"
                      placeholder="Reject Delay"
                    />
                  </div>
                </div>

                <div className="col-4">
                  <div className="formLabel">
                    <label htmlFor="">Busy Delay</label>
                  </div>
                  <div className="position-relative">
                    <input
                      type="number"
                      name="busy_delay_time"
                      value={settingsForBulkEdit.busy_delay}
                      onChange={(e) =>
                        setSettingsForBulkEdit({
                          ...settingsForBulkEdit,
                          busy_delay: e.target.value,
                        })
                      }
                      className="formItem"
                      placeholder="Busy Delay"
                    />
                  </div>
                </div>

                <div className="col-4">
                  <div className="formLabel">
                    <label htmlFor="">Wrap Up Time</label>
                  </div>
                  <div className="position-relative">
                    <input
                      type="number"
                      name="wrap_up_time"
                      value={settingsForBulkEdit.wrap_up_time}
                      onChange={(e) =>
                        setSettingsForBulkEdit({
                          ...settingsForBulkEdit,
                          wrap_up_time: e.target.value,
                        })
                      }
                      className="formItem"
                      placeholder="Wrap Up Time"
                    />
                  </div>
                </div>

                <div className="col-6">
                  <div className="formLabel">
                    <label htmlFor="">Max No Answer</label>
                  </div>
                  <div className="position-relative">
                    <input
                      type="number"
                      name="max_no_answer"
                      value={settingsForBulkEdit.max_no_answer}
                      onChange={(e) =>
                        setSettingsForBulkEdit({
                          ...settingsForBulkEdit,
                          max_no_answer: e.target.value,
                        })
                      }
                      className="formItem"
                      placeholder="Max No Answer"
                    />
                  </div>
                </div>

                <div className="col-6">
                  <div className="formLabel">
                    <label htmlFor="">No Answer Delay</label>
                  </div>
                  <div className="position-relative">
                    <input
                      type="number"
                      name="no_answer_delay_time"
                      value={settingsForBulkEdit.no_answer_delay}
                      onChange={(e) =>
                        setSettingsForBulkEdit({
                          ...settingsForBulkEdit,
                          no_answer_delay: e.target.value,
                        })
                      }
                      className="formItem"
                      placeholder="No Answer Delay"
                    />
                  </div>
                </div>

                <div className="col-5">
                  <div className="formLabel">
                    <label htmlFor="">Reserve Agents</label>
                  </div>
                  <select
                    className="formItem me-0"
                    style={{ width: "100%" }}
                    name="reserve_agents"
                    value={settingsForBulkEdit.reserve_agents}
                    onChange={(e) =>
                      setSettingsForBulkEdit({
                        ...settingsForBulkEdit,
                        reserve_agents: e.target.value,
                      })
                    }
                    id="selectFormRow"
                  >
                    <option value={0}>False</option>
                    <option value={1}>True</option>
                  </select>
                </div>

                <div className="col-7">
                  <div className="formLabel">
                    <label htmlFor="">Truncate agents on load</label>
                  </div>
                  <select
                    className="formItem me-0"
                    style={{ width: "100%" }}
                    name="truncate-agents-on-load"
                    value={settingsForBulkEdit.truncate_agents_on_load}
                    onChange={(e) =>
                      setSettingsForBulkEdit({
                        ...settingsForBulkEdit,
                        truncate_agents_on_load: e.target.value,
                      })
                    }
                    id="selectFormRow"
                  >
                    <option value={0}>False</option>
                    <option value={1}>True</option>
                  </select>
                </div>

                <div className="col-6">
                  <div className="formLabel">
                    <label htmlFor="">Truncate tiers on load</label>
                  </div>
                  <select
                    className="formItem me-0"
                    style={{ width: "100%" }}
                    name="truncate-tiers-on-load"
                    value={settingsForBulkEdit.truncate_tiers_on_load}
                    onChange={(e) =>
                      setSettingsForBulkEdit({
                        ...settingsForBulkEdit,
                        truncate_tiers_on_load: e.target.value,
                      })
                    }
                    id="selectFormRow"
                  >
                    <option value={0}>False</option>
                    <option value={1}>True</option>
                  </select>
                </div>
              </div>

              <div className="col-3">
                <div className="formLabel">
                  <label htmlFor="">Wrap Up Time</label>
                </div>
                <div className="position-relative">
                  <input
                    type="number"
                    name="wrap_up_time"
                    value={settingsForBulkEdit.wrap_up_time}
                    onChange={(e) =>
                      setSettingsForBulkEdit({
                        ...settingsForBulkEdit,
                        wrap_up_time: e.target.value,
                      })
                    }
                    className="formItem"
                    placeholder="Wrap Up Time"
                  />
                </div>
              </div>

              <div className="col-3">
                <div className="formLabel">
                  <label htmlFor="">Reserve Agents</label>
                </div>
                <select
                  className="formItem me-0"
                  style={{ width: "100%" }}
                  name="reserve_agents"
                  value={settingsForBulkEdit.reserve_agents}
                  onChange={(e) =>
                    setSettingsForBulkEdit({
                      ...settingsForBulkEdit,
                      reserve_agents: e.target.value,
                    })
                  }
                  id="selectFormRow"
                >
                  <option value={0}>False</option>
                  <option value={1}>True</option>
                </select>
              </div>

              <div className="col-3">
                <div className="formLabel">
                  <label htmlFor="">Truncate agents on load</label>
                </div>
                <select
                  className="formItem me-0"
                  style={{ width: "100%" }}
                  name="truncate-agents-on-load"
                  value={settingsForBulkEdit.truncate_agents_on_load}
                  onChange={(e) =>
                    setSettingsForBulkEdit({
                      ...settingsForBulkEdit,
                      truncate_agents_on_load: e.target.value,
                    })
                  }
                  defaultValue={0}
                  id="selectFormRow"
                >
                  <option value={0}>False</option>
                  <option value={1}>True</option>
                </select>
              </div>

              <div className="col-3">
                <div className="formLabel">
                  <label htmlFor="">Truncate tiers on load</label>
                </div>
                <select
                  className="formItem me-0"
                  style={{ width: "100%" }}
                  name="truncate-tiers-on-load"
                  value={settingsForBulkEdit.truncate_tiers_on_load}
                  onChange={(e) =>
                    setSettingsForBulkEdit({
                      ...settingsForBulkEdit,
                      truncate_tiers_on_load: e.target.value,
                    })
                  }
                  defaultValue={0}
                  id="selectFormRow"
                >
                  <option value={0}>False</option>
                  <option value={1}>True</option>
                </select>
              </div>
            </div>
            <div className="col-xl-12 mt-2">
              <div className="d-flex justify-content-between">
                <button
                  className="panelButton gray ms-0"
                  onClick={() => {
                    setBulkEditPopup(false);
                    setSettingsForBulkEdit({
                      tier_level: "",
                      tier_position: "",
                      call_timeout: "",
                      reject_delay: "",
                      max_no_answer: "",
                      busy_delay: "",
                      no_answer_delay: "",
                      wrap_up_time: "",
                      reserve_agents: "",
                      truncate_agents_on_load: "",
                      truncate_tiers_on_load: "",
                    });
                  }}
                >
                  <span className="text">Close</span>
                  <span className="icon">
                    <i className="fa-solid fa-caret-left" />
                  </span>
                </button>
                <button
                  className="panelButton me-0"
                  // onClick={() => handleBulkUpload(bulkUploadSelectedAgents)}
                  onClick={() => handleApplyEditSettings(settingsForBulkEdit)}
                >
                  <span className="text">Done</span>
                  <span className="icon">
                    <i className="fa-solid fa-check" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )} */}
      {bulkEditPopup ? (
        <div className="addNewContactPopup">
          <div className="row">
            <div className="col-12 heading mb-0">
              <i className="fa-light fa-user-plus" />
              <h5>Edit People to the selected Queue</h5>
            </div>
            <div>
              Affected user:{" "}
              {selectedAgentToEdit
                .map((item) => user.find((user) => item.name == user.id))
                .map((items) => items.name)
                .join(", ")}
            </div>
            <div className="col-xl-12">
              <div className="col-12 d-flex justify-content-between align-items-center"></div>
            </div>
            <div className="mt-3 row g-2">
              <div className="col-3">
                <div className="formLabel">
                  <label htmlFor="">Tier Level</label>
                </div>
                <select
                  className="formItem me-0"
                  style={{ width: "100%" }}
                  name="level"
                  value={settingsForBulkEdit.tier_level}
                  onChange={(e) =>
                    setSettingsForBulkEdit({
                      ...settingsForBulkEdit,
                      tier_level: e.target.value,
                    })
                  }
                  id="selectFormRow"
                  defaultValue={0}
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                  <option value={7}>7</option>
                  <option value={8}>8</option>
                  <option value={9}>9</option>
                </select>
              </div>
              <div className="col-3">
                <div className="formLabel">
                  <label htmlFor="" style={{ whiteSpace: "nowrap" }}>
                    Tier Position
                  </label>
                </div>
                <select
                  className="formItem me-0"
                  style={{ width: "100%" }}
                  name="position"
                  value={settingsForBulkEdit.tier_position}
                  onChange={(e) =>
                    setSettingsForBulkEdit({
                      ...settingsForBulkEdit,
                      tier_position: e.target.value,
                    })
                  }
                  id="selectFormRow"
                  defaultValue={0}
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                  <option value={7}>7</option>
                  <option value={8}>8</option>
                  <option value={9}>9</option>
                </select>
              </div>


              <div className="col-3 ">
                <div className="formLabel">
                  <label htmlFor="">Reject Delay</label>
                </div>
                <div className="position-relative">
                  <input
                    type="number"
                    name="reject_delay_time"
                    value={settingsForBulkEdit.reject_delay}
                    onChange={(e) =>
                      setSettingsForBulkEdit({
                        ...settingsForBulkEdit,
                        reject_delay: e.target.value,
                      })
                    }
                    className="formItem"
                    placeholder="Reject Delay"
                    defaultValue={0}
                  />
                </div>
              </div>

              <div className="col-3">
                <div className="formLabel">
                  <label htmlFor="">Busy Delay</label>
                </div>
                <div className="position-relative">
                  <input
                    type="number"
                    name="busy_delay_time"
                    value={settingsForBulkEdit.busy_delay}
                    onChange={(e) =>
                      setSettingsForBulkEdit({
                        ...settingsForBulkEdit,
                        busy_delay: e.target.value,
                      })
                    }
                    className="formItem"
                    placeholder="Busy Delay"
                    defaultValue={0}
                  />
                </div>
              </div>
              <div className="col-4 ">
                <div className="formLabel">
                  <label htmlFor="">Call Timeout</label>
                </div>
                <div className="position-relative">
                <input
                    type="number"
                    name="call_timeout"
                    value={settingsForBulkEdit.call_timeout}
                    onChange={(e) =>
                      setSettingsForBulkEdit({
                        ...settingsForBulkEdit,
                        call_timeout: e.target.value,
                      })
                    }
                    className="formItem"
                    placeholder="Max No Answer"
                    defaultValue={0}
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="formLabel">
                  <label htmlFor="">Max No Answer</label>
                </div>
                <div className="position-relative">
                  <input
                    type="number"
                    name="max_no_answer"
                    value={settingsForBulkEdit.max_no_answer}
                    onChange={(e) =>
                      setSettingsForBulkEdit({
                        ...settingsForBulkEdit,
                        max_no_answer: e.target.value,
                      })
                    }
                    className="formItem"
                    placeholder="Max No Answer"
                    defaultValue={0}
                  />
                </div>
              </div>

              <div className="col-4">
                <div className="formLabel">
                  <label htmlFor="">Wrap Up Time</label>
                </div>
                <div className="position-relative">
                  <input
                    type="number"
                    name="wrap_up_time"
                    value={settingsForBulkEdit.wrap_up_time}
                    onChange={(e) =>
                      setSettingsForBulkEdit({
                        ...settingsForBulkEdit,
                        wrap_up_time: e.target.value,
                      })
                    }
                    className="formItem"
                    placeholder="Wrap Up Time"
                    defaultValue={0}
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="formLabel">
                  <label htmlFor="">No Answer Delay</label>
                </div>
                <div className="position-relative">
                  <input
                    type="number"
                    name="no_answer_delay_time"
                    value={settingsForBulkEdit.no_answer_delay}
                    onChange={(e) =>
                      setSettingsForBulkEdit({
                        ...settingsForBulkEdit,
                        no_answer_delay: e.target.value,
                      })
                    }
                    className="formItem"
                    placeholder="No Answer Delay"
                    defaultValue={0}
                  />
                </div>
              </div>

              <div className="col-6">
                <div className="formLabel">
                  <label htmlFor="">Reserve Agents</label>
                </div>
                <select
                  className="formItem me-0"
                  style={{ width: "100%" }}
                  name="reserve_agents"
                  value={settingsForBulkEdit.reserve_agents}
                  onChange={(e) =>
                    setSettingsForBulkEdit({
                      ...settingsForBulkEdit,
                      reserve_agents: e.target.value,
                    })
                  }
                  id="selectFormRow"
                  defaultValue={0}
                >
                  <option value={0}>False</option>
                  <option value={1}>True</option>
                </select>
              </div>

              <div className="col-6">
                <div className="formLabel">
                  <label htmlFor="">Truncate agents on load</label>
                </div>
                <select
                  className="formItem me-0"
                  style={{ width: "100%" }}
                  name="truncate-agents-on-load"
                  value={settingsForBulkEdit.truncate_agents_on_load}
                  onChange={(e) =>
                    setSettingsForBulkEdit({
                      ...settingsForBulkEdit,
                      truncate_agents_on_load: e.target.value,
                    })
                  }
                  id="selectFormRow"
                  defaultValue={0}
                >
                  <option value={0}>False</option>
                  <option value={1}>True</option>
                </select>
              </div>

              <div className="col-6">
                <div className="formLabel">
                  <label htmlFor="">Truncate tiers on load</label>
                </div>
                <select
                  className="formItem me-0"
                  style={{ width: "100%" }}
                  name="truncate-tiers-on-load"
                  value={settingsForBulkEdit.truncate_tiers_on_load}
                  onChange={(e) =>
                    setSettingsForBulkEdit({
                      ...settingsForBulkEdit,
                      truncate_tiers_on_load: e.target.value,
                    })
                  }
                  id="selectFormRow"
                  defaultValue={0}
                >
                  <option value={0}>False</option>
                  <option value={1}>True</option>
                </select>
              </div>
            </div>
            <div className="col-xl-12 mt-2">
              <div className="d-flex justify-content-between">
                <button
                  className="panelButton gray ms-0"
                  onClick={() => {
                    setBulkEditPopup(false);
                    setSettingsForBulkEdit({
                      tier_level: "",
                      tier_position: "",
                      call_timeout: "",
                      reject_delay: "",
                      max_no_answer: "",
                      busy_delay: "",
                      no_answer_delay: "",
                      wrap_up_time: "",
                      reserve_agents: "",
                      truncate_agents_on_load: "",
                      truncate_tiers_on_load: "",
                    });
                  }}
                >
                  <span className="text">Close</span>
                  <span className="icon">
                    <i className="fa-solid fa-caret-left" />
                  </span>
                </button>
                <button
                  className="panelButton me-0"
                  // onClick={() => handleBulkUpload(bulkUploadSelectedAgents)}
                  onClick={() => handleApplyEditSettings(settingsForBulkEdit)}
                >
                  <span className="text">Done</span>
                  <span className="icon">
                    <i className="fa-solid fa-check" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </main>
  );
}

export default CallCenterQueueEdit;
