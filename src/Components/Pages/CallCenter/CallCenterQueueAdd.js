/* eslint-disable eqeqeq */
/* eslint-disable no-useless-escape */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";
import { useForm } from "react-hook-form";
import {
  nameNumberValidator,
  noSpecialCharactersValidator,
  requiredValidator,
  restrictToAllowedChars,
  restrictToNumbers,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import ActionList from "../../CommonComponents/ActionList";
import Header from "../../CommonComponents/Header";

function CallCenterQueueAdd() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const loadings = useSelector((state) => state.loading);
  const [user, setUser] = useState([]);
  const [greetingSound, setGreetingSound] = useState();
  const [holdSound, setHoldSound] = useState();
  const [announcmentSound, setAnnouncmentSound] = useState();
  const account = useSelector((state) => state.account);
  const [advance, setAdvance] = useState([]);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);

  const {
    register,
    setError: setErr,
    clearErrors,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm();
  useEffect(() => {
    // Calling user and sound api to get user and sound data
    async function getData() {
      const userData = await generalGetFunction("/user/all");
      const musicData = await generalGetFunction("/sound/all");
      if (userData?.status) {
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
      }
      if (musicData?.status) {
        setGreetingSound(
          musicData.data.filter((item) => item.type === "ringback")
        );
        setHoldSound(musicData.data.filter((item) => item.type === "hold"));
        setAnnouncmentSound(
          musicData.data.filter((item) => item.type === "announcement")
        );
      }
    }
    getData();
  }, [account.account_id]);

  // Define agent with some default values
  const [agent, setAgent] = useState([
    {
      id: Math.floor(Math.random() * 10000),
      name: "",
      level: "0",
      position: "0",
      type: "callback",
      password: "1234",
      contact: "",
      call_timeout: "",
      busy_delay_time: "",
      reject_delay_time: "",
      max_no_answer: "",
      no_answer_delay_time: "",
      wrap_up_time: "",
      reserve_agents: 0,
      "truncate-agents-on-load": 0,
      "truncate-tiers-on-load": 0,
    },
  ]);

  const actionListValue = (value) => {
    setValue("queue_timeout_action", value[0]);
  };

  // This is for new agent add
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
        contact: "",
        call_timeout: "",
        reject_delay_time: "",
        max_no_answer: "",
        busy_delay_time: "",
        no_answer_delay_time: "",
        wrap_up_time: "",
        reserve_agents: 0,
        "truncate-agents-on-load": 0,
        "truncate-tiers-on-load": 0,
      },
    ]);
  }

  // Remove agent
  function removeAgenet(id) {
    const updatedAgent = agent.filter((item) => item.id !== id);
    if (validateAgents()) {
      clearErrors("agent");
    }
    setAgent(updatedAgent);
  }

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

  if (agent.length === 0) {
    addNewAgent();
  }

  // Validate agents
  const validateAgents = () => {
    const allFieldsFilled = agent.every(
      (item) => item.name.trim() !== "" && item.password.trim() !== ""
    );
    return allFieldsFilled;
  };

  // Validate unique agents
  const validateUniqueAgents = () => {
    const agentValues = agent.map((item) => item.name);
    const uniqueValues = [...new Set(agentValues)];
    return agentValues.length === uniqueValues.length;
  };

  // Handle form submit and validation errors
  const handleFormSubmit = handleSubmit(async (data) => {
    setLoading(true);
    if (!validateAgents()) {
      setErr("agent", {
        type: "manual",
        message: "Agent name and password required in all rows",
      });
      setLoading(false);
      return;
    }

    const { recording_enabled } = data;

    const payload = {
      ...data,
      ...{
        // record_template: record_template === true,
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
        agents: agent.map((item) => {
          return {
            agent_name: item.name,
            call_timeout:
              item.call_timeout === "" ? null : Number(item.call_timeout),
            reject_delay_time:
              item.reject_delay_time === ""
                ? null
                : Number(item.reject_delay_time),
            max_no_answer:
              item.max_no_answer === "" ? null : Number(item.max_no_answer),
            no_answer_delay_time:
              item.no_answer_delay_time === ""
                ? null
                : Number(item.no_answer_delay_time),
            wrap_up_time:
              item.wrap_up_time === "" ? null : Number(item.wrap_up_time),
            busy_delay_time:
              item.busy_delay_time === "" ? null : Number(item.busy_delay_time),
            tier_level: item.level,
            tier_position: item.position,
            type: item.type,
            status: "Logged Out",
            password: item.password,
            contact: item.contact,
            reserve_agents: item.reserve_agents,
            "truncate-agents-on-load": item["truncate-agents-on-load"],
            "truncate-tiers-on-load": item["truncate-tiers-on-load"],
          };
        }),
      },
    };
    // delete payload.record_template;
    const apiData = await generalPostFunction(
      "/call-center-queues/store",
      payload
    );
    if (apiData?.status) {
      setLoading(false);
      toast.success(apiData.message);
      reset();
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

  // Handle advance click 
  function handleAdvance(id) {
    if (advance.includes(id)) {
      setAdvance(advance.filter((item) => item !== id));
    } else {
      setAdvance([...advance, id]);
    }
  }

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="Call Center Queue" />
        </div>
        <div className="col-xl-12">
          {loading && loadings && (
            <div colSpan={99}>
              <CircularLoader />
            </div>
          )}
          <div className="overviewTableWrapper">
            <div className="overviewTableChild">
              <div className="d-flex flex-wrap" style={{ position: 'sticky', top: '0', zIndex: '9' }}>
                <div className="col-12">
                  <div className="heading">
                    <div className="content">
                      <h4>Create Call Center Queue</h4>
                      <p>Setup configurations of the call center queue.</p>
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
                </div>
              </div>
              <div className="col-12" style={{ padding: '25px 23px', borderBottom: '1px solid #ddd' }}>
                <form action="#" className="tangoNavs mb-0">
                  <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                      <button class="nav-link active" id="nav-gen-tab" data-bs-toggle="tab" data-bs-target="#nav-gen" type="button" role="tab" aria-controls="nav-gen" aria-selected="true">General</button>
                      <button class="nav-link" id="nav-tier-tab" data-bs-toggle="tab" data-bs-target="#nav-tier" type="button" role="tab" aria-controls="nav-tier" aria-selected="false">Tier Rules</button>
                      <button class="nav-link" id="nav-max-tab" data-bs-toggle="tab" data-bs-target="#nav-max" type="button" role="tab" aria-controls="nav-max" aria-selected="false">Max Wait Time</button>
                      <button class="nav-link" id="nav-queue-tab" data-bs-toggle="tab" data-bs-target="#nav-queue" type="button" role="tab" aria-controls="nav-queue" aria-selected="false">Queue Rules</button>
                      <button class="nav-link" id="nav-adv-tab" data-bs-toggle="tab" data-bs-target="#nav-adv" type="button" role="tab" aria-controls="nav-adv" aria-selected="false">Advanced</button>
                    </div>
                  </nav>
                  <div class="tab-content" id="nav-tabContent">
                    <div class="tab-pane fade show active" id="nav-gen" role="tabpanel" aria-labelledby="nav-gen-tab" tabindex="0">
                      <form className="row col-12 mx-auto mb-0">
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="">Queue Name</label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter the queue name.
                            </label>
                          </div>
                          <div className="col-xl-6 col-12">
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
                              <ErrorMessage text={errors.queue_name.message} />
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
                          <div className="col-xl-6 col-12">
                            <select
                              {...register("greeting", { ...requiredValidator })}
                              className="formItem w-100"
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
                          <div className="col-xl-6 col-12">
                            <select {...register("strategy")} className="formItem w-100">
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
                          <div className="col-xl-6 col-12">
                            <select
                              {...register("moh_sound", { ...requiredValidator })}
                              className="formItem w-100"
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
                          <div className="col-xl-6 col-12">
                            <select
                              {...register("recording_enabled")}
                              className="formItem w-100"
                              name="recording_enabled"
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
                              Set the action to perform when the max wait time is reached.
                            </label>
                          </div>
                          <div className="col-xl-6 col-12">
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
                              The number of seconds before the abandoned call is removed
                              from the queue.
                            </label>
                          </div>
                          <div className="col-xl-6 col-12">
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
                          <div className="col-xl-6 col-12">
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
                              <ErrorMessage text={errors.queue_cid_prefix.message} />
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                    <div class="tab-pane fade" id="nav-tier" role="tabpanel" aria-labelledby="nav-tier-tab" tabindex="0">
                      <form className="row col-12 mx-auto mb-0">
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="">Tier Rules Apply</label>
                          </div>
                          <div className="col-xl-6 col-12">
                            <select
                              {...register("tier_rules_apply")}
                              className="formItem w-100"
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
                          <div className="col-xl-6 col-12">
                            <input
                              type="number"
                              name="extension"
                              className="formItem"
                              {...register("tier_rule_wait_second", {
                                ...noSpecialCharactersValidator,
                              })}
                            />
                            {errors.tier_rule_wait_second && (
                              <ErrorMessage text={errors.tier_rule_wait_second.message} />
                            )}
                          </div>
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="">Tier Rule Wait Multiply Level</label>
                          </div>
                          <div className="col-xl-6 col-12">
                            <select
                              {...register("tier_rule_wait_multiply_level")}
                              className="formItem w-100"
                            >
                              <option value={1}>True</option>
                              <option value={0}>False</option>
                            </select>
                          </div>
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="">Tier Rule No Agent No Wait</label>
                          </div>
                          <div className="col-xl-6 col-12">
                            <select
                              {...register("tier_rule_no_agent_no_wait")}
                              className="formItem w-100"
                            >
                              <option value={1}>True</option>
                              <option value={0}>False</option>
                            </select>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div class="tab-pane fade" id="nav-max" role="tabpanel" aria-labelledby="nav-max-tab" tabindex="0">
                      <form className="row col-12 mx-auto mb-0">
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="">Max Wait Time</label>
                          </div>
                          <div className="col-xl-6 col-12">
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
                              <ErrorMessage text={errors.max_wait_time.message} />
                            )}
                          </div>
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="">Max Wait Time with no agent</label>
                          </div>
                          <div className="col-xl-6 col-12">
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
                              <ErrorMessage text={errors.max_wait_time_with_no_agent} />
                            )}
                          </div>
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="">
                              Max Wait Time With No Agent Time Reached{" "}
                            </label>
                          </div>
                          <div className="col-xl-6 col-12">
                            <input
                              type="number"
                              name="extension"
                              className="formItem"
                              {...register("max_wait_time_with_no_agent_time_reached", {
                                ...noSpecialCharactersValidator,
                              })}
                              onKeyDown={restrictToNumbers}
                            />
                            {errors.max_wait_time_with_no_agent_time_reached && (
                              <ErrorMessage
                                text={errors.max_wait_time_with_no_agent_time_reached}
                              />
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                    <div class="tab-pane fade" id="nav-queue" role="tabpanel" aria-labelledby="nav-queue-tab" tabindex="0">
                      <form className="row col-12 mx-auto mb-0">
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="">Queue Announce</label>
                            <label htmlFor="data" className="formItemDesc">
                              Select the desired queue announce sound.
                            </label>
                          </div>
                          <div className="col-xl-6 col-12">
                            <select
                              {...register("queue_announce_sound")}
                              className="formItem w-100"
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
                            </select>
                          </div>
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="">Queue Announce Frequency</label>
                          </div>
                          <div className="col-xl-6 col-12">
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
                              <ErrorMessage text={errors.queue_announce_frequency} />
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
                          <div className="col-xl-6 col-12">
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
                      </form>
                    </div>
                    <div class="tab-pane fade" id="nav-adv" role="tabpanel" aria-labelledby="nav-adv-tab" tabindex="0">
                      <form className="row col-12 mx-auto mb-0">
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="">Ring Progressively Delay</label>
                          </div>
                          <div className="col-xl-6 col-12">
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
                              <ErrorMessage text={errors.ring_progressively_delay} />
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
                          <div className="col-xl-6 col-12">
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
                          <div className="col-xl-6 col-12">
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
                          <div className="col-xl-6 col-12">
                            <select
                              {...register("abandoned_resume_allowed")}
                              className="formItem w-100"
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
                <div className="col-xl-6 col-12">
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
                <div className="col-xl-6 col-12">
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
              <div className="col-12" style={{ padding: '20px 23px' }}>
                <form className="row">
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
                              className="formLabel pe-2 m-0"
                              style={{ width: "30px" }}
                            >
                              <label>{index + 1}.</label>
                            </div>
                            <div className={`row col-${advance.includes(item.id) ? "11" : "xxl-5 col-xl-6"}`}>
                              <div className={`col-${advance.includes(item.id) ? "2" : "4"} ps-0 pe-2`}>
                                <div className="formLabel">
                                  {index === 0 ? (
                                    <label htmlFor="">Agent Name</label>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <div className="position-relative">
                                  <select
                                    type="text"
                                    name="name"
                                    value={item.name}
                                    onChange={(e) => handleAgentChange(e, index)}
                                    className="formItem"
                                    placeholder="Destination"
                                  >
                                    <option value="" disabled>
                                      Choose agent
                                    </option>
                                    {user &&
                                      user
                                        .filter((userItem) => {
                                          return (
                                            userItem.id == agent[index]?.name ||
                                            !agent.some(
                                              (agentItem, agentIndex) =>
                                                agentItem.name == userItem.id &&
                                                agentIndex != index
                                            )
                                          );
                                        })
                                        .map((userItem) => (
                                          <option
                                            value={userItem.id}
                                            key={userItem.id}
                                          >
                                            {userItem.username} (
                                            {userItem.extension?.extension})
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
                              <div className={`col-${advance.includes(item.id) ? "2" : "4"} ps-0 pe-2`}>
                                <div className="formLabel">
                                  {index === 0 ? (
                                    <label htmlFor="">Password</label>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <div className="position-relative">
                                  <input
                                    type="text"
                                    name="password"
                                    value={item.password}
                                    onChange={(e) => handleAgentChange(e, index)}
                                    className="formItem"
                                    placeholder="Password"
                                  />
                                </div>
                              </div>
                              <div className={`col-${advance.includes(item.id) ? "1" : "2"} ps-0 pe-2`}>
                                <div className="formLabel">
                                  {index === 0 ? (
                                    <label htmlFor="">Tier Level</label>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <select
                                  className="formItem me-0"
                                  style={{ width: "100%" }}
                                  name="level"
                                  value={item.level}
                                  onChange={(e) => handleAgentChange(e, index)}
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
                              <div className={`col-${advance.includes(item.id) ? "1" : "2"} ps-0 pe-2`}>
                                <div className="formLabel">
                                  {index === 0 ? (
                                    <label htmlFor="" style={{ whiteSpace: 'nowrap' }}>Tier Position</label>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                <select
                                  className="formItem me-0"
                                  style={{ width: "100%" }}
                                  name="position"
                                  value={item.position}
                                  onChange={(e) => handleAgentChange(e, index)}
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
                                    <div className="formLabel">
                                      {index === 0 ? (
                                        <label htmlFor="">Call Timeout</label>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                    <div className="position-relative">
                                      <input
                                        type="number"
                                        name="call_timeout"
                                        value={item.call_timeout}
                                        onChange={(e) => handleAgentChange(e, index)}
                                        className="formItem"
                                        placeholder="Call Timeout"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-2 ps-0 pe-2">
                                    <div className="formLabel">
                                      {index === 0 ? (
                                        <label htmlFor="">Reject Delay</label>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                    <div className="position-relative">
                                      <input
                                        type="number"
                                        name="reject_delay_time"
                                        value={item.reject_delay_time}
                                        onChange={(e) => handleAgentChange(e, index)}
                                        className="formItem"
                                        placeholder="Reject Delay"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-2 ps-0 pe-2">
                                    <div className="formLabel">
                                      {index === 0 ? (
                                        <label htmlFor="">Max No Answer</label>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                    <div className="position-relative">
                                      <input
                                        type="number"
                                        name="max_no_answer"
                                        value={item.max_no_answer}
                                        onChange={(e) => handleAgentChange(e, index)}
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
                                        value={item.busy_delay_time}
                                        onChange={(e) => handleAgentChange(e, index)}
                                        className="formItem"
                                        placeholder="Busy Delay"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-2 ps-0 pe-2">
                                    <div className="formLabel">
                                      {index === 0 ? (
                                        <label htmlFor="">No Answer Delay</label>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                    <div className="position-relative">
                                      <input
                                        type="number"
                                        name="no_answer_delay_time"
                                        value={item.no_answer_delay_time}
                                        onChange={(e) => handleAgentChange(e, index)}
                                        className="formItem"
                                        placeholder="No Answer Delay"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-2 ps-0 pe-2">
                                    <div className="formLabel">
                                      {index === 0 ? (
                                        <label htmlFor="">Wrap Up Time</label>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                    <div className="position-relative">
                                      <input
                                        type="number"
                                        name="wrap_up_time"
                                        value={item.wrap_up_time}
                                        onChange={(e) => handleAgentChange(e, index)}
                                        className="formItem"
                                        placeholder="Wrap Up Time"
                                      />
                                    </div>
                                  </div>

                                  <div className="col-2 ps-0 pe-2">
                                    <div className="formLabel">
                                      {index === 0 ? (
                                        <label htmlFor="">Reserve Agents</label>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                    <select
                                      className="formItem me-0"
                                      style={{ width: "100%" }}
                                      name="reserve_agents"
                                      value={item.reserve_agents}
                                      onChange={(e) => handleAgentChange(e, index)}
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
                                      value={item["truncate-agents-on-load"]}
                                      onChange={(e) => handleAgentChange(e, index)}
                                      id="selectFormRow"
                                    >
                                      <option value={0}>False</option>
                                      <option value={1}>True</option>
                                    </select>
                                  </div>

                                  <div className="col-2 ps-0 pe-2">
                                    <div className="formLabel">
                                      {index === 0 ? (
                                        <label htmlFor="">Truncate tiers on load</label>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                    <select
                                      className="formItem me-0"
                                      style={{ width: "100%" }}
                                      name="truncate-tiers-on-load"
                                      value={item["truncate-tiers-on-load"]}
                                      onChange={(e) => handleAgentChange(e, index)}
                                      id="selectFormRow"
                                    >
                                      <option value={0}>False</option>
                                      <option value={1}>True</option>
                                    </select>
                                  </div>
                                </>
                              )}

                            </div>

                            <div className="row col mt-xxl-0 mt-xl-2">
                              {<div
                                onClick={() => handleAdvance(item.id)}
                                className="col-auto px-0 mt-auto"
                              >
                                <button
                                  type="button"
                                  className={`tableButton edit my-auto ${agent.length < 2 ? "me-2" : ""}`}
                                >

                                  <i className={`fa-solid fa-${advance.includes(item.id) ? "gear" : "gears"}`}></i>
                                </button>
                              </div>}

                              {agent.length === 1 ? (
                                ""
                              ) : (
                                <div
                                  onClick={() => removeAgenet(item.id)}
                                  className="col-auto px-0 mt-auto mx-2"
                                >
                                  <button
                                    type="button"
                                    className="tableButton delete"
                                  >
                                    <i className="fa-solid fa-trash"></i>
                                  </button>
                                </div>
                              )}

                              {index === agent.length - 1 &&
                                index !== (user && user.length - 1) ? (
                                <div
                                  onClick={addNewAgent}
                                  className="col-auto  px-0 mt-auto"
                                >
                                  <button
                                    type="button"
                                    className="panelButton my-auto ms-0"
                                  >
                                    <span className="text">Add</span>
                                    <span className="icon"> <i class="fa-solid fa-plus"></i></span>
                                  </button>
                                </div>
                              ) : (
                                ""
                              )}

                            </div>
                          </div>
                        );
                      })}
                    {errors.agent && <ErrorMessage text={errors.agent.message} />}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {loading ? (
        <div colSpan={99}>
          <CircularLoader />
        </div>
      ) : (
        ""
      )}
    </main>
  );
}

export default CallCenterQueueAdd;
