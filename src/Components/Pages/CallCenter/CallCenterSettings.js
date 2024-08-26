import React, { useState, useEffect } from "react";
import Header from "../../CommonComponents/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  backToTop,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../../Loader/CircularLoader";
import { useForm } from "react-hook-form";

const CallCenterSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { state: locationState } = location;
  const [loading, setLoading] = useState(false);
  const account = useSelector((state) => state.account);
  const [prevAgents, setPrevAgents] = useState([]);
  const [user, setUser] = useState();

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
      time_base_score: "queue",
      tier_rules_apply: 0,
      tier_rule_wait_second: null,
      tier_rule_wait_multiply_level: 0,
      tier_rule_no_agent_no_wait: 1,
      abandoned_resume_allowed: 0,
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
    control,
  } = useForm();

  useEffect(() => {
    async function getData() {
      const userData = await generalGetFunction("/user/all");

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
    }
    getData();
    if (locationState) {
      const { agents, record_template } = locationState;
      setPrevAgents(agents);
      setAgent(
        agents.map((item, index) => {
          return {
            id: item.id,
            name: item.agent_name,
            level: item.tier_level,
            position: item.tier_position,
            type: item.type,
            status: item.status,
            password: item?.password,
            contact: item.contact,
          };
        })
      );

      const destructuredData = {
        ...locationState,
        ...{ record_template: record_template == 1 ? true : false },
      };

      reset(destructuredData);
    } else {
      navigate(-1);
    }
  }, []);

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

  function addNewAgent() {
    setAgent([
      ...agent,
      {
        id: agent.length + 100000,
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

  const handleExtensionChange = (selectedOption) => {
    setValue("extension", selectedOption.value);
  };

  // const handleFormSubmit = handleSubmit(async (data) => {
  //   if (!validateAgents()) {
  //     setErr("agent", {
  //       type: "manual",
  //       message: "Agent name and password required in all rows",
  //     });
  //     return;
  //   }

  //   const { record_template, queue_name, extension, queue_timeout_action } =
  //     data;
  //   const xmlObj = {
  //     xml: `<extension name="${queue_name.trim()}">
  //           <condition field="destination_number" expression="^(callcenter\+)?${extension}$" >
  //             <action application="answer" data=""/>
  //             <action application="set" data="hangup_after_bridge=true"/>
  //             <action application="sleep" data="1000"/>
  //             <action application="callcenter" data="${extension}@${
  //       account.domain.domain_name
  //     }"/>
  //              <action application="transfer" data="${queue_timeout_action} XML ${
  //       account.domain.domain_name
  //     }"/>
  //           </condition>
  //   </extension>`,
  //   };

  //   const payload = {
  //     ...data,
  //     ...{
  //       record_template: record_template === "true" ? 1 : 0,
  //       account_id: account.account_id,
  //       created_by: account.id,
  //     },
  //     ...xmlObj,

  //     ...{
  //       agents: agent
  //         .map((item) => {
  //           // Call checkPrevDestination with the current item
  //           const hasId = checkPrevAgents(item.id);

  //           if (item.name.length > 0) {
  //             // Return the object with or without 'id' based on hasId
  //             return {
  //               agent_name: item.name,
  //               tier_level: item.level,
  //               tier_position: item.position,
  //               type: item.type,
  //               status: "Logged Out",
  //               password: item.password,
  //               contact: item.contact,
  //               ...(hasId ? { id: item.id } : {}), // Conditionally add 'id' field
  //             };
  //           } else {
  //             return null;
  //           }
  //         })
  //         .filter((item) => item !== null),
  //     },
  //   };
  //   setLoading(true);
  //   const apiData = await generalPutFunction(
  //     `/call-center-queue/update/${locationState.id}`,
  //     payload
  //   );
  //   if (apiData.status) {
  //     setLoading(false);
  //     toast.success(apiData.message);
  //   } else {
  //     setLoading(false);
  //     const errorMessage = Object.keys(apiData.errors);
  //     toast.error(apiData.errors[errorMessage[0]][0]);
  //   }
  // });

  const handleFormSubmit = handleSubmit(async (data) => {
    if (!validateAgents()) {
      setErr("agent", {
        type: "manual",
        message: "Agent name and password required in all rows",
      });
      return;
    }
  
    const selectedData = {
      greeting: data.greeting,
      strategy: data.strategy,
      record_template: data.record_template === "true" ? 1 : 0,
      time_base_score: data.time_base_score,
      tier_rules_apply: data.tier_rules_apply,
      tier_rule_wait_multiply_level: data.tier_rule_wait_multiply_level,
      account_id: account.account_id,
      created_by: account.id,
    };
  
    const agentsData = agent
      .map((item) => {
        if (item.name.length > 0) {
          const hasId = checkPrevAgents(item.id);
          return {
            agent_name: item.name,
            tier_level: item.level,
            tier_position: item.position,
            type: item.type,
            status: "Logged Out",
            password: item.password,
            contact: item.contact,
            ...(hasId ? { id: item.id } : {}), // Conditionally add 'id' field
          };
        } else {
          return null;
        }
      })
      .filter((item) => item !== null);
  
    const payload = {
      ...selectedData,
      agents: agentsData,
    };
  
    setLoading(true);
    const apiData = await generalPutFunction(
      `/call-center-queue/update/${locationState.id}`,
      payload
    );
    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message);
    } else {
      setLoading(false);
      const errorMessage = Object.keys(apiData.errors);
      toast.error(apiData.errors[errorMessage[0]][0]);
    }
  });

  
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0">
            <Header title="Call Center Settings" />
            <div className="row justify-content-center" id="subPageHeader">
              <div className="col-xl-9 my-auto">
                {/* <h4 className="my-auto">Edit Call Center Queue</h4> */}
              </div>
              <div className="col-xl-3 ps-2">
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
                    type="button"
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
            {loading ? (
              <div colSpan={99}>
                <CircularLoader />
              </div>
            ) : (
              ""
            )}

            <div className="mx-2" id="detailsContent">
              <form action="#" className="row">
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label htmlFor="" className="text-dark">
                        Greeting
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <div className="formLabel">
                        <label htmlFor="">Status</label>
                      </div>
                      <select
                        {...register("greeting")}
                        className="formItem me-0"
                        style={{ width: "100%" }}
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
                </div>
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label htmlFor="" className="text-dark">
                        Strategy
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <div className="formLabel">
                        <label htmlFor="">Status</label>
                      </div>
                      <select
                        {...register("strategy")}
                        className="formItem me-0"
                        style={{ width: "100%" }}
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
                </div>
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label className="text-dark" htmlFor="">
                        Record
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <div className="formLabel">
                        <label htmlFor="">Status</label>
                      </div>
                      <select
                        {...register("record_template")}
                        className="formItem me-0"
                        style={{ width: "100%" }}
                      >
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                      </select>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Save the recording.
                      </label>
                    </div>
                  </div>
                </div>
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label className="text-dark" htmlFor="">
                        Time Base Score
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <div className="formLabel">
                        <label htmlFor="">Status</label>
                      </div>
                      <select
                        {...register("time_base_score")}
                        className="formItem me-0"
                        style={{ width: "100%" }}
                      >
                        <option value="queue">Queue</option>
                        <option value="system">System</option>
                      </select>
                      <br />
                    </div>
                  </div>
                </div>

                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label className="text-dark" htmlFor="">
                        Tier Rules Apply
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <div className="formLabel">
                        <label htmlFor="">Status</label>
                      </div>
                      <select
                        {...register("tier_rules_apply")}
                        className="formItem me-0"
                        style={{ width: "100%" }}
                      >
                        <option value={1}>True</option>
                        <option value={0}>False</option>
                      </select>
                      <br />
                    </div>
                  </div>
                </div>

                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label className="text-dark" htmlFor="">
                        Tier Rule Wait Multiply Level
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <div className="formLabel">
                        <label htmlFor="">Status</label>
                      </div>
                      <select
                        {...register("tier_rule_wait_multiply_level")}
                        className="formItem me-0"
                        style={{ width: "100%" }}
                      >
                        <option value={1}>True</option>
                        <option value={0}>False</option>
                      </select>
                      <br />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default CallCenterSettings;
