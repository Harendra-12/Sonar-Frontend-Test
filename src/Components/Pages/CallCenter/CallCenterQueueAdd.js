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
import ActionList from "../../CommonComponents/ActionList";

function CallCenterQueueAdd() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [music, setMusic] = useState();
  const account = useSelector((state) => state.account);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);

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

  const [callCenter, setCallCenter] = useState({
    name: "",
    extension: "",
    greeting: "say",
    strategy: "ring-all",
    musicHold: "",
    record: "true",
    action: "",
    abandoned: "",
    prefix: "",
    time_base_score: "queue",
    tier_rules_apply: 0,
    tier_rule_wait_second: null,
    tier_rule_wait_multiply_level: 0,
    tier_rule_no_agent_no_wait: 1,
    abandoned_resume_allowed: 0,
  });

  const [error, setError] = useState({
    name: false,
    extension: false,
    agentName: false,
    action: false,
    abandoned: false,
    prefix: false,
    password: false,
  });

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

  const actionListValue = (value) => {
    setCallCenter((prevData) => ({
      ...prevData,
      action: value[0],
    }));
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
    if (name === "name") {
      setError((prevState) => ({
        ...prevState,
        agentName: false,
      }));
    }

    if (name === "password") {
      setError((prevState) => ({
        ...prevState,
        password: false,
      }));
    }
  };

  async function handleSubmit() {
    agent.map((item) => {
      if (item.name === "") {
        setError((prevState) => ({
          ...prevState,
          agentName: true,
        }));
      }
      if (item.password === "") {
        setError((prevState) => ({
          ...prevState,
          password: true,
        }));
      }
    });
    if (callCenter.name === "") {
      setError((prevState) => ({
        ...prevState,
        name: true,
      }));
    }
    if (callCenter.extension === "") {
      setError((prevState) => ({
        ...prevState,
        extension: true,
      }));
    }
    if (
      !(callCenter.name === "") &&
      !(callCenter.extension === "") &&
      !agent
        .map((item) => {
          if (item.password === "") {
            return true;
          }
        })
        .includes(true) &&
      !agent
        .map((item) => {
          if (item.name === "") {
            return true;
          }
        })
        .includes(true)
    ) {
      setLoading(true);
      const parsedData = {
        queue_name: callCenter.name,
        greeting: callCenter.greeting,
        extension: callCenter.extension,
        strategy: callCenter.strategy,
        record_template: callCenter.record === "true" ? 1 : 0,
        moh_sound: callCenter.musicHold,
        queue_timeout_action: callCenter.action,
        discard_abandoned_after: callCenter.abandoned,
        queue_cid_prefix: callCenter.prefix,
        account_id: account.account_id,
        time_base_score: account.time_base_score,
        tier_rules_apply: account.tier_rules_apply,
        tier_rule_wait_second: account.tier_rule_wait_second,
        tier_rule_wait_multiply_level: account.tier_rule_wait_multiply_level,
        tier_rule_no_agent_no_wait: account.tier_rule_no_agent_no_wait,
        abandoned_resume_allowed: account.abandoned_resume_allowed,
        created_by: account.id,
        xml: `<extension name="${callCenter.name.trim()}">
        <condition field="destination_number" expression="^(callcenter\+)?${
          callCenter.extension
        }$" >
          <action application="answer" data=""/>
          <action application="set" data="hangup_after_bridge=true"/>
          <action application="sleep" data="1000"/>
          <action application="callcenter" data="${callCenter.extension}@${
          account.domain.domain_name
        }"/>
           <action application="transfer" data="${callCenter.action} XML ${
          account.domain.domain_name
        }"/>
        </condition>
</extension>`,
        agents: agent.map((item) => {
          if (item.name !== "") {
            return {
              agent_name: item.name,
              tier_level: item.level,
              tier_position: item.position,
              type: item.type,
              status: "Logged Out",
              password: item.password,
              contact: item.contact,
            };
          }
        }),
      };

      const apiData = await generalPostFunction(
        "/call-center-queue/store",
        parsedData
      );
      if (apiData.status) {
        setLoading(false);
        toast.success(apiData.message);
        setCallCenter({
          name: "",
          extension: "",
          greeting: "say",
          strategy: "ring-all",
          musicHold: "",
          record: "true",
          action: "",
          abandoned: "",
          prefix: "",
        });
        dispatch({
          type: "SET_CALLCENTERREFRESH",
          callCenterRefresh: callCenterRefresh + 1,
        });
      } else {
        setLoading(false);
        const errorMessage = Object.keys(apiData.errors);
        toast.error(apiData.errors[errorMessage[0]][0]);
      }
    }
  }
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
                  onClick={handleSubmit}
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
                  <label htmlFor="">Queue Name</label>
                  {error.name ? (
                    <label className="status missing">Field missing</label>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    value={callCenter.name}
                    onChange={(e) => {
                      setCallCenter((prevState) => ({
                        ...prevState,
                        name: e.target.value,
                      }));
                      setError((prevState) => ({
                        ...prevState,
                        name: false,
                      }));
                    }}
                    className="formItem"
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the queue name.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Extension</label>
                  {error.extension ? (
                    <label className="status missing">Field missing</label>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={callCenter.extension}
                    onChange={(e) => {
                      setCallCenter((prevState) => ({
                        ...prevState,
                        extension: e.target.value,
                      }));
                      setError((prevState) => ({
                        ...prevState,
                        extension: false,
                      }));
                    }}
                  />
                  <br />
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
                  <select
                    value={callCenter.greeting}
                    onChange={(e) => {
                      setCallCenter((prevState) => ({
                        ...prevState,
                        greeting: e.target.value,
                      }));
                    }}
                    className="formItem w-100"
                  >
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
                  <select
                    value={callCenter.strategy}
                    onChange={(e) => {
                      setCallCenter((prevState) => ({
                        ...prevState,
                        strategy: e.target.value,
                      }));
                    }}
                    className="formItem w-100"
                  >
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
                  <select
                    // value={callCenter.musicHold}
                    onChange={(e) => {
                      setCallCenter((prevState) => ({
                        ...prevState,
                        musicHold: e.target.value,
                      }));
                    }}
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
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Record</label>
                </div>
                <div className="col-12">
                  <select
                    value={callCenter.record}
                    onChange={(e) => {
                      setCallCenter((prevState) => ({
                        ...prevState,
                        record: e.target.value,
                      }));
                    }}
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
                <ActionList
                  getDropdownValue={actionListValue}
                  value={callCenter.action}
                />
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Discard Abandoned After</label>
                  {error.abandoned ? (
                    <label className="status missing">Field missing</label>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={callCenter.abandoned}
                    onChange={(e) => {
                      setCallCenter((prevState) => ({
                        ...prevState,
                        abandoned: e.target.value,
                      }));
                      setError((prevState) => ({
                        ...prevState,
                        abandoned: false,
                      }));
                    }}
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
                  {error.prefix ? (
                    <label className="status missing">Field missing</label>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={callCenter.prefix}
                    onChange={(e) => {
                      setCallCenter((prevState) => ({
                        ...prevState,
                        prefix: e.target.value,
                      }));
                      setError((prevState) => ({
                        ...prevState,
                        prefix: false,
                      }));
                    }}
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
                    value={callCenter.time_base_score}
                    onChange={(e) => {
                      setCallCenter((prevState) => ({
                        ...prevState,
                        time_base_score: e.target.value,
                      }));
                    }}
                    className="formItem w-100"
                  >
                    <option value="queue">Queue</option>
                    <option value="system">System</option>
                  </select>
                  <br />
                  {/* <label htmlFor="data" className="formItemDesc">
                    Save the recording.
                  </label> */}
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Tier Rules Apply</label>
                </div>
                <div className="col-12">
                  <select
                    value={callCenter.time_base_score}
                    onChange={(e) => {
                      setCallCenter((prevState) => ({
                        ...prevState,
                        time_base_score: e.target.value,
                      }));
                    }}
                    className="formItem w-100"
                  >
                    <option value={1}>True</option>
                    <option value={0}>False</option>
                  </select>
                  <br />
                  {/* <label htmlFor="data" className="formItemDesc">
                    Save the recording.
                  </label> */}
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
                    value={callCenter.tier_rule_wait_second}
                    onChange={(e) => {
                      setCallCenter((prevState) => ({
                        ...prevState,
                        tier_rule_wait_second: e.target.value,
                      }));
                    }}
                  />
                  <br />
                  {/* <label htmlFor="data" className="formItemDesc">
                    Save the recording.
                  </label> */}
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Tier Rule Wait Multiply Level</label>
                </div>
                <div className="col-12">
                  <select
                    value={callCenter.tier_rule_wait_multiply_level}
                    onChange={(e) => {
                      setCallCenter((prevState) => ({
                        ...prevState,
                        tier_rule_wait_multiply_level: e.target.value,
                      }));
                    }}
                    className="formItem w-100"
                  >
                    <option value={1}>True</option>
                    <option value={0}>False</option>
                  </select>
                  <br />
                  {/* <label htmlFor="data" className="formItemDesc">
                    Save the recording.
                  </label> */}
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Tier Rule No Agent No Wait</label>
                </div>
                <div className="col-12">
                  <select
                    value={callCenter.tier_rule_no_agent_no_wait}
                    onChange={(e) => {
                      setCallCenter((prevState) => ({
                        ...prevState,
                        tier_rule_no_agent_no_wait: e.target.value,
                      }));
                    }}
                    className="formItem w-100"
                  >
                    <option value={1}>True</option>
                    <option value={0}>False</option>
                  </select>
                  <br />
                  {/* <label htmlFor="data" className="formItemDesc">
                    Save the recording.
                  </label> */}
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Abandoned Resume Allowed</label>
                </div>
                <div className="col-12">
                  <select
                    value={callCenter.abandoned_resume_allowed}
                    onChange={(e) => {
                      setCallCenter((prevState) => ({
                        ...prevState,
                        abandoned_resume_allowed: e.target.value,
                      }));
                    }}
                    className="formItem w-100"
                  >
                    <option value={1}>True</option>
                    <option value={0}>False</option>
                  </select>
                  <br />
                  {/* <label htmlFor="data" className="formItemDesc">
                    Save the recording.
                  </label> */}
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
                            {error.agentName && item.name === "" ? (
                              <label className="status missing">
                                Field missing
                              </label>
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
                              <option value="">Choose agent</option>
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
                            {error.password && item.password === "" ? (
                              <label className="status missing">
                                Field missing
                              </label>
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
