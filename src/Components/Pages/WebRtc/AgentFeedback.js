import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generalPostFunction } from '../../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';

/**
 * Renders a modal popup for agent feedback, which appears after a call with a lead has ended.
 * The popup displays a list of dispositions that the agent can select from, and allows the agent to provide text feedback.
 * The component uses the Redux store to retrieve the list of dispositions for the current campaign, and to dispatch actions to update the store.
 * The component also uses the generalPostFunction utility function to make a POST request to the API to save the agent's feedback.
 * @returns {JSX.Element}
 */
function AgentFeedback() {
    const desposiTionOptions = useSelector((state) => state.desposiTionOptions);
    console.log("desposiTionOptions", desposiTionOptions);
    const [currentDisposition, setCurrentDisposiTion] = useState([]);
    const [agentNote, setAgentNote] = useState("");

    // Function to check wetaher this dispo is already presnt if yes then remove otherwise add
    const checkDispo = (item) => {
        const index = currentDisposition?.findIndex((dispo) => dispo.id === item.id);
        if (index !== -1) {
            const newDisposition = [...currentDisposition];
            newDisposition.splice(index, 1);
            setCurrentDisposiTion(newDisposition);
        } else {
            setCurrentDisposiTion([item]);
        }
    };

    const dispatch = useDispatch()

    /**
     * Handles the submission of the agent feedback form. Makes a POST request to the API with the agent's feedback,
     * and if the response is successful, dispatches an action to update the Redux store to indicate that the agent feedback has been recorded.
     * If the response is not successful, displays an error message to the agent.
     */
    async function handleFeedback() {
        if (currentDisposition.length === 0) {
            toast.error("Please select at least one feedback option")
            return
        }
        const parseddata = {
            'agent_id': desposiTionOptions.agent_id,
            'lead_id': desposiTionOptions.lead_id,
            'campaign_id': desposiTionOptions.campaign_id,
            'disposition_id': currentDisposition[0]?.id,
            'feedback': currentDisposition[0]?.campaign_disposition_name,
            'agent_note': agentNote
        }
        const response = await generalPostFunction("/campaign-feedback", parseddata)
        if (response.status) {
            toast.success(response.message)
            dispatch({
                type: "SET_AGENT_DEPOSITION",
                agentDeposition: false,
            })
        } else {
            toast.error(response.message)
        }
    }

    console.log("currentDisposition", currentDisposition);

    return (
        <>
            <div className="addNewContactPopup">
                <div className="row">
                    <div className="col-12 heading mb-0">
                        <i className="fa-light fa-comments"></i>
                        <h5>Agent Feedback!</h5>
                        <p>
                            {`Your call with ${desposiTionOptions.first_name} with number ${desposiTionOptions.phone_number} has ended, provide your valuable feedback in the form below.`}
                        </p>
                        <div className="border-bottom col-12" />
                    </div>
                    <div className="col-xl-12 mt-3">
                        <div className="row justify-content-between">
                            <style>
                                {`
                            .formRow.col-xl-3{
                                min-width: 45%;
                                width: auto;
                                margin-right: 0 !important;
                                min-height: auto;
                            }
                            `}
                            </style>
                            {
                                desposiTionOptions?.disposition?.map((item, key) => {
                                    return (
                                        <div key={key} className="formRow col-xl-3 justify-content-start">
                                            <div className='col-auto me-2'>
                                                <input onChange={() => checkDispo(item)} checked={currentDisposition?.some((dispo) => dispo.id === item.id)} type="checkbox" />
                                            </div>
                                            <div className="formLabel">
                                                <label htmlFor="">{item.campaign_disposition_name}</label>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className="border-bottom col-12" />
                            <div className="formRow">
                                <div className="d-flex justify-content-between w-100">
                                    <div className="formLabel">
                                        <label>Notes</label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <textarea
                                        type="text"
                                        className="formItem h-auto"
                                        rows={3}
                                        placeholder="Please enter notes specific to this call here!"
                                        defaultValue={""}
                                        value={agentNote}
                                        onChange={(e) => setAgentNote(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-12 mt-2">
                        <div className="d-flex justify-content-between">
                            {/* <button className="panelButton gray ms-0" onClick={() => {
                                dispatch({
                                    type: "SET_AGENT_DEPOSITION",
                                    agentDeposition: false,
                                })
                            }}>
                                <span className="text">Close</span>
                                <span className="icon">
                                    <i className="fa-light fa-xmark"></i>
                                </span>
                            </button> */}
                            <button className="panelButton ms-0" onClick={handleFeedback} >
                                <span className="text">Done</span>
                                <span className="icon">
                                    <i className="fa-solid fa-check" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AgentFeedback