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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../../Loader/CircularLoader";
import { useForm, Controller } from "react-hook-form";
import {
  nameNumberValidator,
  nameValidator,
  noSpecialCharactersValidator,
  numberValidator,
  requiredValidator,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import ActionList from "../../CommonComponents/ActionList";
import Select from "react-select";
import Header from "../../CommonComponents/Header";

function CallCenterQueueAdd() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [music, setMusic] = useState();
  const account = useSelector((state) => state.account);
  // const domain = useSelector((state) => state.domain);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  // const { domain_name = "" } = domain;
  // const [popUp, setPopUp] = useState(true);

  const {
    register,

    setError: setErr,
    clearErrors,

    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
  } = useForm();
  useEffect(() => {
    async function getData() {
      const userData = await generalGetFunction("/user/all");
      const musicData = await generalGetFunction("/sound/all?type=hold");
      if (userData.status) {
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
      if (musicData.status) {
        setMusic(musicData.data);
      }
    }
    getData();
  }, [account.account_id]);

  const [agent, setAgent] = useState([
    {
      id: 1,
      name: "",
      level: "0",
      position: "0",
      type: "callback",
      // status: "Logged Out",
      password: "1234",
      contact: "",
    },
  ]);

  const actionListValue = (value) => {
    setValue("queue_timeout_action", value[0]);
  };

  function addNewAgent() {
    setAgent([
      ...agent,
      {
        id: agent.length + 1,
        name: "",
        level: "0",
        position: "0",
        type: "callback",
        // status: "Logged Out",
        password: "1234",
        contact: "",
      },
    ]);
  }

  function removeAgenet(id) {
    const updatedAgent = agent.filter((item) => item.id !== id);
    if (validateAgents()) {
      clearErrors("agent");
    }
    setAgent(updatedAgent);
  }
  // const handleAgentChange = (event, index) => {
  //   const { name, value } = event.target;
  //   const newAgent = [...agent];
  //   newAgent[index][name] = value;
  //   setAgent(agent);

  //   if (validateAgents()) {
  //     clearErrors("agent");
  //   } else {
  //     setErr("agent", {
  //       type: "manual",
  //       message: "Agent name and password required in all rows",
  //     });
  //   }
  // };

  const handleAgentChange = (event, index) => {
    const { name, value } = event.target;
    const newAgent = [...agent];
    newAgent[index][name] = value;
    setAgent(newAgent);

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

  const validateAgents = () => {
    const allFieldsFilled = agent.every(
      (item) => item.name.trim() !== "" && item.password.trim() !== ""
    );
    return allFieldsFilled;
  };
  const validateUniqueAgents = () => {
    const agentValues = agent.map((item) => item.name);
    const uniqueValues = [...new Set(agentValues)];
    return agentValues.length === uniqueValues.length;
  };

  const handleExtensionChange = (selectedOption) => {
    setValue("extension", selectedOption.value);
  };

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      // border: '1px solid var(--color4)',
      border: "1px solid #ababab",
      borderRadius: "2px",
      outline: "none",
      fontSize: "14px",
      width: "100%",
      minHeight: "32px",
      height: "32px",
      boxShadow: state.isFocused ? "none" : provided.boxShadow,
      "&:hover": {
        borderColor: "none",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "32px",
      padding: "0 6px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0",
    }),
    indicatorSeparator: (provided) => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "32px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#202020",
      "&:hover": {
        color: "#202020",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      paddingLeft: "15px",
      paddingTop: 0,
      paddingBottom: 0,
      // backgroundColor: state.isSelected ? "transparent" : "transparent",
      "&:hover": {
        backgroundColor: "#0055cc",
        color: "#fff",
      },
      fontSize: "14px",
    }),
    menu: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
      margin: 0,
      maxHeight: "150px",
      overflowY: "auto",
    }),
  };

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

    const { recording_enabled, queue_name, extension, queue_timeout_action } =
      data;

    //     const xmlObj = {
    //       xml: `<extension name="${queue_name.trim()}">
    //         <condition field="destination_number" expression="^(callcenter\+)?${extension}$" >
    //           <action application="answer" data=""/>
    //           <action application="set" data="hangup_after_bridge=true"/>
    //           <action application="sleep" data="1000"/>
    //           <action application="callcenter" data="${extension}@${domain_name}"/>
    //            <action application="transfer" data="${queue_timeout_action} XML ${domain_name}"/>
    //         </condition>
    // </extension>`,
    //     };

    const payload = {
      ...data,
      ...{
        // record_template: record_template === true,
        recording_enabled: recording_enabled === "true" ? 1 : 0,
        account_id: account.account_id,
        created_by: account.id,
      },
      // ...xmlObj,

      ...{
        agents: agent.map((item) => {
          return {
            agent_name: item.name,
            tier_level: item.level,
            tier_position: item.position,
            type: item.type,
            status: "Logged Out",
            password: item.password,
            contact: item.contact,
          };
        }),
      },
    };
    // delete payload.record_template;
    const apiData = await generalPostFunction(
      "/call-center-queue/store",
      payload
    );
    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message);
      reset();
      dispatch({
        type: "SET_CALLCENTERREFRESH",
        callCenterRefresh: callCenterRefresh + 1,
      });
    } else {
      setLoading(false);
      if (apiData.error) {
        toast.error(apiData.error);
      } else {
        const errorMessage = Object.keys(apiData.errors);
        toast.error(apiData.errors[errorMessage[0]][0]);
      }
    }
  });

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="Call Center Queue" />
          <div id="subPageHeader">
            <div className="col-xl-6 my-auto">
              {/* <h4 className="my-auto">Add Call Center Queue</h4> */}
            </div>
            <div className="col-xl-6 ps-2">
              <div className="d-flex justify-content-end">
                <button
                  effect="ripple"
                  className="panelButton"
                  onClick={() => {
                    backToTop();
                    navigate(-1);
                  }}
                >
                  Back
                </button>
                <button
                  effect="ripple"
                  className="panelButton"
                  onClick={handleFormSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-12">
          {loading && (
            <div colSpan={99}>
              <CircularLoader />
            </div>
          )}
          <div className="mx-2" id="detailsContent">
            <form action="#" className="row">
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Queue Name</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    {...register("queue_name", {
                      ...requiredValidator,
                      ...nameNumberValidator,
                    })}
                    className="formItem"
                  />
                  {errors.queue_name && (
                    <ErrorMessage text={errors.queue_name.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the queue name.
                  </label>
                </div>
              </div>
              {/* <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Extension</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    {...register("extension", {
                      ...requiredValidator,
                      // ...nameValidator,
                    })}
                    className="formItem"
                  />
                  {errors.extension && (
                    <ErrorMessage text={errors.extension.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the extension.
                  </label>
                </div>
              </div> */}
              {/* <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Extension</label>
                </div>
                <div className="col-12">
                  <Controller
                    name="extension"
                    control={control}
                    defaultValue=""
                    rules={{ ...requiredValidator, ...numberValidator }}
                    render={({ field: { onChange, value, ...field } }) => {
                      const options = user
                        ? user.map((item) => ({
                            value: item.extension.extension,
                            label: `${item.name} (${item.extension.extension})`,
                          }))
                        : [];

                      const selectedOption =
                        options.find((option) => option.value === value) ||
                        null;

                      return (
                        <Select
                          {...field}
                          value={selectedOption}
                          onChange={(selectedOption) => {
                            onChange(selectedOption.value);
                            handleExtensionChange(selectedOption);
                          }}
                          options={options}
                          styles={customStyles}
                        />
                      );
                    }}
                  />
                  {errors.extension && (
                    <ErrorMessage text={errors.extension.message} />
                  )}
                  <label htmlFor="data" className="formItemDesc">
                    Enter the extension number.
                  </label>
                </div>
              </div> */}
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Greeting</label>
                </div>
                <div className="col-12">
                  <select {...register("greeting")} className="formItem w-100">
                    <option>say</option>
                    <option>tone_stream</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Select the desired Greeting.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Strategy</label>
                </div>
                <div className="col-12">
                  <select {...register("strategy")} className="formItem w-100">
                    <option value="ring-all">Ring All</option>
                    <option value="longest-idle-agent">
                      Longest Idle Agent
                    </option>
                    <option value="round-robin">Round Robin</option>
                    <option value="top-down">Top Down</option>
                    <option value="agent-with-least-talk-time">
                      Agent with least talk time
                    </option>
                    <option value="agent-with-fewest-calls">
                      Agent with fewest calls
                    </option>
                    <option value="sequentially-by-aget-order">
                      Sequentially by agent order
                    </option>
                    <option value="ring-progressively">
                      Ring Progressively
                    </option>
                    <option value="random">Random</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Select the queue ring strategy.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Music on Hold</label>
                </div>
                <div className="col-12">
                  <select {...register("moh_sound")} className="formItem w-100">
                    <option></option>
                    {music &&
                      music.map((item, index) => {
                        return (
                          <option key={index} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Select the desired hold music.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Record</label>
                </div>
                <div className="col-12">
                  <select
                    {...register("recording_enabled")}
                    className="formItem w-100"
                    name="recording_enabled"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Save the recording.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <ActionList
                  getDropdownValue={actionListValue}
                  value={watch().queue_timeout_action}
                />
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Discard Abandoned After</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("discard_abandoned_after", {
                      ...noSpecialCharactersValidator,
                    })}
                  />
                  {errors.discard_abandoned_after && (
                    <ErrorMessage
                      text={errors.discard_abandoned_after.message}
                    />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    The number of seconds before the abandoned call is removed
                    from the queue.
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
                    {...register("queue_cid_prefix", {
                      ...noSpecialCharactersValidator,
                    })}
                  />
                  {errors.queue_cid_prefix && (
                    <ErrorMessage text={errors.queue_cid_prefix.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Set a prefix on the caller ID name.
                  </label>
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Time Base Score</label>
                </div>
                <div className="col-12">
                  <select
                    {...register("time_base_score")}
                    className="formItem w-100"
                  >
                    <option value="queue">Queue</option>
                    <option value="system">System</option>
                  </select>
                  <br />
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Tier Rules Apply</label>
                </div>
                <div className="col-12">
                  <select
                    {...register("tier_rules_apply")}
                    className="formItem w-100"
                  >
                    <option value={1}>True</option>
                    <option value={0}>False</option>2{" "}
                  </select>
                  <br />
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Tier Rule Wait Second</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("tier_rule_wait_second", {
                      ...noSpecialCharactersValidator,
                    })}
                  />
                  {errors.tier_rule_wait_second && (
                    <ErrorMessage text={errors.tier_rule_wait_second.message} />
                  )}
                  <br />
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Tier Rule Wait Multiply Level</label>
                </div>
                <div className="col-12">
                  <select
                    {...register("tier_rule_wait_multiply_level")}
                    className="formItem w-100"
                  >
                    <option value={1}>True</option>
                    <option value={0}>False</option>
                  </select>
                  <br />
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Tier Rule No Agent No Wait</label>
                </div>
                <div className="col-12">
                  <select
                    {...register("tier_rule_no_agent_no_wait")}
                    className="formItem w-100"
                  >
                    <option value={1}>True</option>
                    <option value={0}>False</option>
                  </select>
                  <br />
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Abandoned Resume Allowed</label>
                </div>
                <div className="col-12">
                  <select
                    {...register("abandoned_resume_allowed")}
                    className="formItem w-100"
                  >
                    <option value={1}>True</option>
                    <option value={0}>False</option>
                  </select>
                  <br />
                </div>
              </div>
              <div className="formRow col-xl-12 row">
                {agent &&
                  agent.map((item, index) => {
                    return (
                      <div className="d-flex flex-wrap" key={index}>
                        <div
                          className="formLabel col-auto pe-2 m-0 mt-auto"
                        >
                          <label>{index + 1}.</label>
                        </div>
                        <div className="col-2 pe-1">
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
                              onChange={(e) => {
                                handleAgentChange(e, index);
                                user.map((item) => {
                                  if (item.id == e.target.value) {
                                    const newAgent = [...agent];
                                    newAgent[index][
                                      "contact"
                                    ] = `user/${item.extension.extension}@${item.domain.domain_name}`;
                                    setAgent(agent);
                                  }
                                });
                              }}
                              className="formItem"
                              placeholder="Destination"
                            >
                              <option value="" disabled>
                                Choose agent
                              </option>
                              {user &&
                                user.map((item) => {
                                  return (
                                    <option value={item.id} key={item.id}>
                                      {item.name}({item.extension?.extension})
                                    </option>
                                  );
                                })}
                            </select>
                          </div>
                        </div>
                        <div className="col-2 pe-2">
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
                        <div className="col-2 pe-2">
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
                        <div className="col-2 pe-2">
                          <div className="formLabel">
                            {index === 0 ? (
                              <label htmlFor="">Tier Position</label>
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
                        <div className="col-2 pe-2">
                          <div className="formLabel">
                            {index === 0 ? <label htmlFor="">Type</label> : ""}
                          </div>
                          <select
                            className="formItem me-0"
                            style={{ width: "100%" }}
                            name="type"
                            onChange={(e) => handleAgentChange(e, index)}
                            id="selectFormRow"
                            value={item.type}
                          >
                            <option value={"callback"}>Call Back</option>
                            <option value={"uuid-standby"}>UUID Standbu</option>
                          </select>
                        </div>
                        {/* <div className="col-2 pe-2">
                          <div className="formLabel">
                            {index === 0 ? (
                              <label htmlFor="">Status</label>
                            ) : (
                              ""
                            )}
                          </div>
                          <select
                            className="formItem me-0"
                            style={{ width: "100%" }}
                            name="status"
                            onChange={(e) => handleAgentChange(e, index)}
                            id="selectFormRow"
                          >
                            <option value={"Logged Out"}>Logged Out</option>
                            <option value={"Available"}>Available</option>
                            <option value={"Available (On Demand)"}>
                              Available (On Demand)
                            </option>
                            <option value={"On Break"}>On Break</option>
                          </select>
                        </div> */}

                        {agent.length === 1 ? (
                          ""
                        ) : (
                          <div
                            onClick={() => removeAgenet(item.id)}
                            className="col-auto h-100 d-flex align-items-center"
                          >
                            <button
                              type="button"
                              className="clearButton text-danger my-auto"
                            >
                              <i className="fa-duotone fa-trash"></i>
                            </button>
                          </div>
                        )}
                        {index === agent.length - 1 &&
                          index !== (user && user.length - 1) ? (
                          <div
                            onClick={addNewAgent}
                            className="col-auto h-100 d-flex align-items-center"
                          >
                            <button
                              type="button"
                              className={
                                index === 0
                                  ? "panelButton mt-4 mb-0"
                                  : "panelButton my-auto"
                              }
                            >
                              Add more
                            </button>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  })}
                {errors.agent && <ErrorMessage text={errors.agent.message} />}
              </div>
            </form>
          </div>
        </div>
        {/* {popUp ? (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div className="row content col-xl-4">
                  <div className="col-2 px-0">
                    <div className="iconWrapper">
                      <i className="fa-duotone fa-triangle-exclamation"></i>
                    </div>
                  </div>
                  <div className="col-10 ps-0">
                    <h4>Warning!</h4>
                    <p>
                      No Extension is currently asigned! Please add an extension first!
                    </p>
                    <button
                      className="panelButton m-0"
                      onClick={() => {
                        // setForce(true);
                        setPopUp(false);
                        navigate('/extensions-add')
                      }}
                    >
                      Lets Go!
                    </button>
                    <button
                      className="panelButtonWhite m-0 float-end"
                      onClick={() => setPopUp(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )} */}
      </section>
      {loading ? (
        <div colSpan={99}>
          <CircularLoader />
        </div>
      ) : (
        ""
      )}
      {/* <ToastContainer
        position="bottom-right"
        autoClose={false}
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
}

export default CallCenterQueueAdd;
