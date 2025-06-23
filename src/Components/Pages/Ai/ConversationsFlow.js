import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import Tippy from "@tippyjs/react";
import WelcomeMessage from "./WelcomeMessage";
import FlowAccordionContent from "./FlowAccordionContent";
import { useLocation, useNavigate } from "react-router-dom";
import { backToTop } from "../../GlobalFunction/globalFunction";
import TestCallChat from "./TestCallChat";

const ConversationsFlow = () => {
  const [idCopy, setIdCopy] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state;
  const [defaultName, setDefaultName] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [saveClicked, setSaveClicked] = useState(0);
  const [agentData, setAgentData] = useState();
  const [loading, setLoading] = useState(false);
  const [beginMessage, setBeginMessage] = useState("");
  const [generalPrompt, setGeneralPrompt] = useState("");
  const [agentId,setAgentId] = useState();

  useEffect(() => {
    if (locationState?.agentName) {
      setDefaultName(locationState.agentName);
      setAgentData(locationState.agentData);
    } else {
      navigate(-1);
    }
  }, []);

   useEffect(() => {
      if (agentData?.agent_id) {
        setAgentId(agentData?.agent_id);
      }
    }, [agentData?.agent_id]);

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Conversations Flow" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <div className="editable-title d-flex justify-content-start align-items-center gap-2 mb-3">
                            {isEditing ? (
                              <input
                                type="text"
                                className="formItem"
                                value={defaultName}
                                onChange={(e) => setDefaultName(e.target.value)}
                                onBlur={() => setIsEditing(false)}
                                autoFocus
                              />
                            ) : (
                              <h4>{defaultName}</h4>
                            )}

                            <button
                              className="aitable_button bg-transparent"
                              onClick={() => setIsEditing(true)}
                            >
                              <i className="fa-regular fa-pen"></i>
                            </button>
                          </div>
                          {locationState.unique ? (
                            ""
                          ) : (
                            <div className="d-flex justify-content-start align-items-center gap-3">
                              <p className="mb-0">
                                Agent ID: <span>{agentData?.agent_id}</span>
                                <button
                                  className="clearButton"
                                  onClick={() => {
                                    setIdCopy(!idCopy);
                                  }}
                                >
                                  <i
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        agentData?.agent_id || ""
                                      );
                                    }}
                                    className={
                                      idCopy
                                        ? "fa-solid fa-check text_success"
                                        : "fa-solid fa-clone"
                                    }
                                  ></i>
                                </button>
                              </p>
                              {/* <p className="mb-0">
                              {" "}
                              <span>$0.12/min</span>
                              <Tippy
                                content={
                                  <>
                                    <ul className="toolTripContext">
                                      <li>
                                        Cost per minute{" "}
                                        <strong>$0.12/min</strong>
                                      </li>
                                      <li>
                                        - Voice Engine: 11labs{" "}
                                        <strong>$0.07/min</strong>
                                      </li>
                                      <li>
                                        - LLM: gpt-4o <strong>$0.05/min</strong>
                                      </li>
                                    </ul>
                                  </>
                                }
                              >
                                <button className="clearButton text-align-start">
                                  <i class="fa-regular fa-chart-pie-simple"></i>
                                </button>
                              </Tippy>
                            </p> */}
                            </div>
                          )}
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

                          <div
                            effect="ripple"
                            className="panelButton"
                            onClick={() => setSaveClicked(saveClicked + 1)}
                          >
                            {locationState.unique ? (
                              <>
                                {loading ? (
                                  <>
                                    <span className="text">Saving..</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text">Save</span>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                {loading ? (
                                  <>
                                    <span className="text">Updating..</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text">Update</span>
                                  </>
                                )}{" "}
                              </>
                            )}
                            <span className="icon">
                              <i className="fa-solid fa-plus"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="row p-3">
                        <div className="col-xxl-6 ">
                          <div className="KnowledgeLeftinfo">
                            <div className="heightAuto">
                              <WelcomeMessage
                                beginMessage={beginMessage}
                                generalPrompt={generalPrompt}
                                setBeginMessage={setBeginMessage}
                                setGeneralPrompt={setGeneralPrompt}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-xxl-3 ">
                          <div className="KnowledgeLeftinfo">
                            <div className="heightAuto">
                              <FlowAccordionContent
                                defaultName={defaultName}
                                setDefaultName={setDefaultName}
                                newAgent={locationState.unique}
                                saveClicked={saveClicked}
                                agentData={agentData}
                                llmData={locationState.llmData}
                                loading={loading}
                                setLoading={setLoading}
                                beginMessage={beginMessage}
                                generalPrompt={generalPrompt}
                                setBeginMessage={setBeginMessage}
                                setGeneralPrompt={setGeneralPrompt}
                                agentId={agentId}
                                setAgentId={setAgentId}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-xxl-3 ">
                          <div className="KnowledgeLeftinfo">
                            <div className="heightAuto">
                              <TestCallChat agentId={agentId} />
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
      </main>
    </>
  );
};

export default ConversationsFlow;
