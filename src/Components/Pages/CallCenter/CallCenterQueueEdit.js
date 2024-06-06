/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import {
  backToTop,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../Misc/CircularLoader";

function CallCenterQueueEdit() {
  const navigate = useNavigate();
  const location = useLocation()
  const locationState = location.state
  const [loading,setLoading]=useState(false)
  const [ringGroup, setRingGroup] = useState();
  const [extension, setExtension] = useState();
  const account = useSelector((state) => state.account);
  
  const [agent, setAgent] = useState([
    {
      id: 1,
      name: "",
      level: "0",
      position: "0",
      type:"callback",
      status:"Logged Out",
    },
  ]);
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
  });
  useEffect(() => {
    async function getData() {
      const apidata = await generalGetFunction(
        `/ringgroup?account=${account.account_id}`
      );
      const extensionData = await generalGetFunction(
        `/extension/search?account=${account.account_id}`
      );
      if (apidata.status) {
        setRingGroup(apidata.data);
      }
      if (extensionData.status) {
        setExtension(extensionData.data);
      }
    }
    getData()
    if(locationState){
      setCallCenter(prevData=>({
        ...prevData,
        name:locationState.queue_name,
        extension:locationState.extension,
        greeting:locationState.greeting,
        strategy:locationState.strategy,
        musicHold:locationState.moh_sound,
        record:locationState.record_template=="0"?"false":"true",
        action:locationState.queue_timeout_action,
        abandoned:locationState.discard_abandoned_after,
        prefix:locationState.queue_cid_prefix
      }))
      setAgent(locationState.agents.map((item,index)=>{
        return(
          {
            id:item.id,
            name:item.agent_name,
            level:item.tier_level,
            position:item.tier_position,
            type:item.type,
            status:item.status,
          }
        )
      }))
    }else{
    navigate(-1)
    }
  }, []);
  

  const [error, setError] = useState({
    name: false,
    extension: false,
    agentName: false,
    action: false,
    abandoned: false,
    prefix: false,
  });


  function addNewAgent() {
    setAgent([
      ...agent,
      {
        id: agent.length + 100000,
        name: "",
        level: "0",
        position: "0",
        type:"callback",
        status:"Logged Out",
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
    setAgent(newAgent);
    if (name === "name") {
      setError((prevState) => ({
        ...prevState,
        agentName: false,
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
    if (callCenter.action === "") {
      setError((prevState) => ({
        ...prevState,
        action: true,
      }));
    }
    if (callCenter.abandoned === "") {
      setError((prevState) => ({
        ...prevState,
        abandoned: true,
      }));
    }
    if (callCenter.prefix === "") {
      setError((prevState) => ({
        ...prevState,
        prefix: true,
      }));
    }
    if (
      !(callCenter.name === "") &&
      !(callCenter.extension === "") &&
      !(callCenter.action === "") &&
      !(callCenter.abandoned === "") &&
      !(callCenter.prefix === "")
    ) {
      setLoading(true)
      const parsedData = {
        id:locationState.id,
        queue_name: callCenter.name,
        greeting: callCenter.greeting,
        extension: callCenter.extension,
        strategy: callCenter.strategy,
        record_template: callCenter.record === "true" ? 1 : 0,
        moh_sound: callCenter.musicHold,
        queue_timeout_action: callCenter.action,
        discard_abandoned_after: callCenter.abandoned,
        queue_cid_prefix: callCenter.prefix,
        agents: agent.map((item) => {
          if (item.name !== "") {
            return {
              ...(item.id < 10000 && { id: item.id }),
              agent_name: item.name,
              tier_level: item.level,
              tier_position: item.position,
              type:item.type,
              status:item.status
            };
          }
        }),
      };

      const apiData = await generalPutFunction(
        `/call-center-queue/update/${locationState.id}`,
        parsedData
      );
      if (apiData.status) {
        setLoading(false)
        toast.success(apiData.message);
      } else {
        setLoading(false)
        toast.error(apiData.message);
      }
    }
  }
  console.log("This is agenty",agent);
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12" id="subPageHeader">
              <div className="row px-xl-3">
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
                        <option value="agent-with-least-talk-time">Agent with least talk time</option>
                        <option value="agent-with-fewest-calls">Agent with fewest calls</option>
                        <option value="sequentially-by-aget-order">Sequentially by agent order</option>
                        <option value="ring-progressively">Ring Progressively</option>
                        <option value="random">Random</option>
                      </select>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Select the queue ring strategy.
                      </label>
                    </div>
                  </div>
                  <div className="formRow col-xl-12 row">
                  {agent &&
                      agent.map((item, index) => {
                        return (
                          <div className="row" key={index}>
                            <div
                              className="formLabel pe-2 m-0 mt-auto"
                              style={{ width: 14 }}
                            >
                              <label>{index + 1}.</label>
                            </div>
                            <div className="col-2 pe-2">
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
                                <input
                                  type="text"
                                  name="name"
                                  value={item.name}
                                  onChange={(e) => handleAgentChange(e, index)}
                                  className="formItem"
                                  placeholder="Destination"
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
                                {index === 0 ? (
                                  <label htmlFor="">Type</label>
                                ) : (
                                  ""
                                )}
                              </div>
                              <select
                                className="formItem me-0"
                                style={{ width: "100%" }}
                                name="type"
                                value={item.type}
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
                                value={item.status}
                                onChange={(e) => handleAgentChange(e, index)}
                                id="selectFormRow"
                              >
                                <option value={"Logged Out"}>Logged Out</option>
                                <option value={"Available"}>Available</option>
                                <option value={"Available (On Demand)"}>Available (On Demand)</option>
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
                                  Add
                                </button>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        );
                      })}
                  </div>

                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Music on Hold</label>
                    </div>
                    <div className="col-12">
                      <select
                        value={callCenter.musicHold}
                        onChange={(e) => {
                          setCallCenter((prevState) => ({
                            ...prevState,
                            musicHold: e.target.value,
                          }));
                        }}
                        className="formItem w-100"
                      >
                        <option>test</option>
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
                    <div className="formLabel">
                      <label htmlFor="">Timeout Action</label>
                      {error.action ? (
                        <label className="status missing">Field missing</label>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-12">
                      {/* <input
                        type="text"
                        name="extension"
                        className="formItem"
                        value={callCenter.action}
                        onChange={(e)=>{
                            setCallCenter(prevState=>({
                                ...prevState,
                                action:e.target.value
                            }));
                            setError(prevState=>({
                                ...prevState,
                                action:false
                            }))
                        }}
                      /> */}
                      <select
                        className="formItem"
                        name=""
                        id="selectFormRow"
                        value={callCenter.action}
                        onChange={(e) => {
                          setCallCenter((prevState) => ({
                            ...prevState,
                            action: e.target.value,
                          }));
                          setError((prevState) => ({
                            ...prevState,
                            action: false,
                          }));
                        }}
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
                        Set the action to perform when the max wait time is
                        reached.
                      </label>
                    </div>
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
                        The number of seconds before the abandoned call is
                        removed from the queue.
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
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
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
    </main>
  );
}

export default CallCenterQueueEdit;
