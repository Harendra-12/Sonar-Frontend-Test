import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

function AgentFeedback() {
    const desposiTionOptions = useSelector((state) => state.desposiTionOptions);
    const dispatch = useDispatch()
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
                            <div className="formRow col-xl-3 justify-content-start">
                                <div className='col-auto me-2'>
                                    <input type="checkbox" />
                                </div>
                                <div className="formLabel">
                                    <label htmlFor="">Interested</label>
                                </div>
                            </div>
                            <div className="formRow col-xl-3 justify-content-start">
                                <div className='col-auto me-2'>
                                    <input type="checkbox" />
                                </div>
                                <div className="formLabel">
                                    <label htmlFor="">Not Interested</label>
                                </div>
                            </div>
                            <div className="formRow col-xl-3 justify-content-start">
                                <div className='col-auto me-2'>
                                    <input type="checkbox" />
                                </div>
                                <div className="formLabel">
                                    <label htmlFor="">Demo Booked</label>
                                </div>
                            </div>
                            <div className="formRow col-xl-3 justify-content-start">
                                <div className='col-auto me-2'>
                                    <input type="checkbox" />
                                </div>
                                <div className="formLabel">
                                    <label htmlFor="">Deal Closed</label>
                                </div>
                            </div>
                            <div className="formRow col-xl-3 justify-content-start">
                                <div className='col-auto me-2'>
                                    <input type="checkbox" />
                                </div>
                                <div className="formLabel">
                                    <label htmlFor="">Requires Follow-up</label>
                                </div>
                            </div>
                            <div className="formRow col-xl-3 justify-content-start">
                                <div className='col-auto me-2'>
                                    <input type="checkbox" />
                                </div>
                                <div className="formLabel">
                                    <label htmlFor="">Incorrect Number</label>
                                </div>
                            </div>
                            <div className="formRow col-xl-3 justify-content-start">
                                <div className='col-auto me-2'>
                                    <input type="checkbox" />
                                </div>
                                <div className="formLabel">
                                    <label htmlFor="">Left Voicemail</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-12 mt-2">
                        <div className="d-flex justify-content-between">
                            <button className="panelButton gray ms-0" onClick={()=>{
                                dispatch({
                                    type:"SET_AGENT_DEPOSITION",
                                    agentDeposition:false,
                                })
                            }}>
                                <span className="text">Close</span>
                                <span className="icon">
                                    <i className="fa-light fa-xmark"></i>
                                </span>
                            </button>
                            <button className="panelButton" >
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