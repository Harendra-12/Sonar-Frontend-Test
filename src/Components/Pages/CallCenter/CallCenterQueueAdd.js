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
import { useForm } from "react-hook-form";
import {
  nameValidator,
  numberValidator,
  requiredValidator,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";

function CallCenterQueueAdd() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [ringGroup, setRingGroup] = useState();
  const [extension, setExtension] = useState();
  const [user, setUser] = useState();
  const [music, setMusic] = useState();
  const account = useSelector((state) => state.account);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const {
    register,

    setError: setErr,
    clearErrors,

    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  useEffect(() => {
    async function getData() {
      const apidata = await generalGetFunction(
        `/ringgroup?account=${account.account_id}`
      );
      const extensionData = await generalGetFunction(
        `/extension/search?account=${account.account_id}`
      );
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
      if (apidata.status) {
        setRingGroup(apidata.data);
      }
      if (extensionData.status) {
        setExtension(extensionData.data);
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
      status: "Logged Out",
      password: "1234",
      contact: "",
    },
  ]);

  function addNewAgent() {
    setAgent([
      ...agent,
      {
        id: agent.length + 1,
        name: "",
        level: "0",
        position: "0",
        type: "callback",
        status: "Logged Out",
        password: "1234",
        contact: "",
      },
    ]);
  }

  function removeAgenet(id) {
    const updatedAgent = agent.filter((item) => item.id !== id);
    setAgent(updatedAgent);
  }

  const handleAgentChange = (event, index) => {
    const { name, value } = event.target;
    const newAgent = [...agent];
    newAgent[index][name] = value;
    setAgent(agent);

    if (validateAgents()) {
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
      (item) => item.name.trim() !== "" && item.password.trim() !== ""
    );
    return allFieldsFilled;
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    if (!validateAgents()) {
      setErr("agent", {
        type: "manual",
        message: "Agent name and password required in all rows",
      });
      return;
    }

    const { record_template, queue_name, extension, queue_timeout_action } =
      data;

    const xmlObj = {
      xml: `<extension name="${queue_name.trim()}">
        <condition field="destination_number" expression="^(callcenter\+)?${extension}$" >
          <action application="answer" data=""/>
          <action application="set" data="hangup_after_bridge=true"/>
          <action application="sleep" data="1000"/>
          <action application="callcenter" data="${extension}@${
        account.domain.domain_name
      }"/>
           <action application="transfer" data="${queue_timeout_action} XML ${
        account.domain.domain_name
      }"/>
        </condition>
</extension>`,
    };

    const payload = {
      ...data,
      ...{
        record_template: record_template === "true" ? 1 : 0,
        account_id: account.account_id,
        created_by: account.id,
      },
      ...xmlObj,

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
      const errorMessage = Object.keys(apiData.errors);
      toast.error(apiData.errors[errorMessage[0]][0]);
    }
  });

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <div className="row justify-content-center" id="subPageHeader">
            <div className="col-xl-6 my-auto">
              <h4 className="my-auto">Add Call Center Queue</h4>
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
                      ...nameValidator,
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
                    })}
                  />
                  {errors.extension && (
                    <ErrorMessage text={errors.extension.message} />
                  )}
                  <label htmlFor="data" className="formItemDesc">
                    Enter the extension number.
                  </label>
                </div>
              </div>
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
                    {...register("record_template")}
                    className="formItem w-100"
                  >
                    <option>True</option>
                    <option>False</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Save the recording.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Timeout Action</label>
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    name=""
                    id="selectFormRow"
                    {...register("queue_timeout_action")}
                  >
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
                    Set the action to perform when the max wait time is reached.
                  </label>
                </div>
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
                    {...register("discard_abandoned_after")}
                  />
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
                    {...register("queue_cid_prefix")}
                  />
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
                    {...register("tier_rule_wait_second")}
                  />
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
                          className="formLabel pe-2 m-0 mt-auto"
                          style={{ width: 14 }}
                        >
                          <label>{index + 1}.</label>
                        </div>
                        <div className="col-auto pe-1">
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
                              defaultValue=""
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
                                    <option value={item.id}>
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
                        <div className="col-1 pe-2">
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
                        <div className="col-1 pe-2">
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
                          >
                            <option value={"callback"}>Call Back</option>
                            <option value={"uuid-standby"}>UUID Standbu</option>
                          </select>
                        </div>
                        <div className="col-2 pe-2">
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
                        </div>

                        {index === 0 ? (
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
                        {index === agent.length - 1 ? (
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
      </section>
      <ToastContainer
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
      />
    </main>
  );
}

export default CallCenterQueueAdd;
