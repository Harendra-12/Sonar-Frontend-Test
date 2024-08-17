import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import ContentLoader from '../../Loader/ContentLoader';
import { useNavigate } from 'react-router-dom';

function AllCallsDetails() {
    const callDetails = useSelector((state) => state.allCall)
    const activeCall = useSelector((state) => state.activeCall)
    const navigate = useNavigate();
    const [inboundCall, setInboundCall] = useState([]);
    const [outboundCall, setOutboundCall] = useState([]);
    const [allCalls, setAllCalls] = useState([]);

    useEffect(()=>{
        if(callDetails.calls){
            setInboundCall(callDetails.calls.filter((call) => call["Call-Direction"] === "inbound"));
            setOutboundCall(callDetails.calls.filter((call) => call["Call-Direction"] === "outbound"));
            setAllCalls(callDetails.calls);
        }
    }, [callDetails])
    return (
        <>
            {(callDetails) ?
                <div
                    className="tabGroupDetails"
                    data-id={1}
                >
                    <div className="col-12">
                        <div
                            className="callItemWrapper"
                            data-id={1}
                            style={{ height: 'auto' }}
                        >
                            <div className="row mb-3">
                                <div className="col-12 title text-start mb-2">
                                    <i className="fa-duotone fa-phone-volume" /> All Calls{" "}
                                </div>
                                <div className="col-xl-2">
                                    <div className="itemWrapperb a">
                                        <div className="heading">Total Calls</div>
                                        <div className="data-number">{callDetails.count}</div>
                                        <div className="label2">100% of total calls</div>
                                    </div>
                                </div>
                                <div className="col-xl-2">
                                    <div className="itemWrapperb d">
                                        <div className="heading">Total Calls Completed</div>
                                        <div className="data-number">{callDetails.success}</div>
                                        <div className="label2">Percentage {((callDetails.success / (callDetails.count)) * 100).toFixed(2)}%</div>
                                    </div>
                                </div>
                                <div className="col-xl-2">
                                    <div className="itemWrapperb c">
                                        <div className="heading">Missed Calls</div>
                                        {/* <div className="data-number">{callDetails.missed}</div> */}
                                        <div className="data-number">{ allCalls.filter((call => call["variable_DIALSTATUS"] === "NO_USER_RESPONSE")).length}</div>
                                        <div className="label2">Percentage {((callDetails.missed / (callDetails.count)) * 100).toFixed(2)}%</div>
                                    </div>
                                </div>
                                <div className="col-xl-2">
                                    <div className="itemWrapperb a" onClick={() => navigate('/active-calls')} style={{ cursor: 'pointer' }}>
                                        <div className="heading">Extensions On Calls</div>
                                        <div className="data-number">{activeCall.length}</div>
                                        <div className="label2">Percentage 0%</div>
                                    </div>
                                </div>
                                <div className="col-xl-2">
                                    <div className="itemWrapperb b">
                                        <div className="heading">Average Talk Time</div>
                                        <div className="data-number">00.00.00</div>
                                        <div className="label2">Total 00.00.00</div>
                                    </div>
                                </div>
                                <div className="col-xl-2">
                                    <div className="itemWrapperb d">
                                        <div className="heading">Total Spent</div>
                                        <div className="data-number">$0.00</div>
                                        <div className="label2">N/A</div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-12 title text-start mb-2">
                                    <i
                                        className="fa-duotone fa-phone-arrow-down-left"
                                        style={{ color: "var(--funky-boy3)" }}
                                    />{" "}
                                    Inbound Calls
                                </div>
                                <div className="col-xl-2">
                                    <div className="itemWrapperb a">
                                        <div className="heading">Total Inbound Calls</div>
                                        {/* <div className="data-number">{callDetails.inboundData.count}</div> */}
                                        <div className="data-number">{inboundCall.length}</div>
                                        {/* <div className="label2">{((callDetails.inboundData.count / (callDetails.all.count)) * 100).toFixed(2)}% of total calls</div> */}
                                        <div className="label2">{((inboundCall.length / (callDetails.count)) * 100).toFixed(2)}% of total calls</div>
                                    </div>
                                </div>
                                <div className="col-xl-2">
                                    <div className="itemWrapperb d">
                                        <div className="heading">Inbound Calls Completed</div>
                                        {/* <div className="data-number">{callDetails.inboundData.success}</div> */}
                                        <div className="data-number">{inboundCall.filter((call) => call["variable_DIALSTATUS"] === "SUCCESS").length}</div>
                                        {/* <div className="label2">Percentage {((callDetails.inboundData.success / (callDetails.inboundData.count)) * 100).toFixed(2)}%</div> */}
                                        <div className="label2">Percentage {((inboundCall.filter((call) => call["variable_DIALSTATUS"] === "SUCCESS").length / (inboundCall.length)) * 100).toFixed(2)}%</div>
                                    </div>
                                </div>
                                <div className="col-xl-2">
                                    <div className="itemWrapperb c">
                                        <div className="heading">Missed Inbound Calls</div>
                                        {/* <div className="data-number">{callDetails.inboundData.missed}</div> */}
                                        <div className="data-number">{inboundCall.filter((call) => call["variable_DIALSTATUS"] === "NO_USER_RESPONSE").length}</div>
                                        {/* <div className="label2">Percentage {((callDetails.inboundData.missed / (callDetails.inboundData.count)) * 100).toFixed(2)}%</div> */}
                                        <div className="label2">Percentage {((inboundCall.filter((call) => call["variable_DIALSTATUS"] === "NO_USER_RESPONSE").length / (inboundCall.length)) * 100).toFixed(2)}%</div>
                                    </div>
                                </div>
                                <div className="col-xl-2">
                                    <div className="itemWrapperb a" onClick={() => navigate('/active-calls')} style={{ cursor: "pointer" }}>
                                        <div className="heading">Extensions On Calls</div>
                                        <div className="data-number">{activeCall.length}</div>
                                        <div className="label2">Percentage 0%</div>
                                    </div>
                                </div>
                                <div className="col-xl-2">
                                    <div className="itemWrapperb b">
                                        <div className="heading">Average Talk Time</div>
                                        <div className="data-number">00.00.00</div>
                                        <div className="label2">Total 00.00.00</div>
                                    </div>
                                </div>
                                <div className="col-xl-2">
                                    <div className="itemWrapperb d">
                                        <div className="heading">Total Spent</div>
                                        <div className="data-number">$0.00</div>
                                        <div className="label2">N/A</div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-12 title text-start mb-2">
                                    <i
                                        className="fa-duotone fa-phone-arrow-up-right"
                                        style={{ color: "var(--color3)" }}
                                    />{" "}
                                    Outbound Calls
                                </div>
                                <div className="col-xl-2">
                                    <div className="itemWrapperb a">
                                        <div className="heading">Total Outbound Calls</div>
                                        {/* <div className="data-number">{callDetails.outboundData.count}</div> */}
                                        <div className="data-number">{outboundCall.length}</div>
                                        {/* <div className="label2">{((callDetails.outboundData.count / (callDetails.all.count)) * 100).toFixed(2)}% of total calls</div> */}
                                        <div className="label2">{((outboundCall.length / (callDetails.count)) * 100).toFixed(2)}% of total calls</div>
                                    </div>
                                </div>
                                <div className="col-xl-2">
                                    <div className="itemWrapperb d">
                                        <div className="heading">Outbound Calls Completed</div>
                                        {/* <div className="data-number">{callDetails.outboundData.success}</div> */}
                                        <div className="data-number">{outboundCall.filter((call) => call["variable_DIALSTATUS"] === "SUCCESS").length}</div>
                                        {/* <div className="label2">Percentage {((callDetails.outboundData.success / (callDetails.outboundData.count)) * 100).toFixed(2)}%</div> */}
                                        <div className="label2">Percentage {((outboundCall.filter((call) => call["variable_DIALSTATUS"] === "SUCCESS").length / (outboundCall.length)) * 100).toFixed(2)}%</div>
                                    </div>
                                </div>
                                <div className="col-xl-2">
                                    <div className="itemWrapperb c">
                                        <div className="heading">Missed Outbound Calls</div>
                                        {/* <div className="data-number">{callDetails.outboundData.missed}</div> */}
                                        <div className="data-number">{outboundCall.filter((call) => call["variable_DIALSTATUS"] === "NO_USER_RESPONSE").length}</div>
                                        {/* <div className="label2">Percentage {((callDetails.outboundData.missed / (callDetails.outboundData.count)) * 100).toFixed(2)}%</div> */}
                                        <div className="label2">Percentage {((outboundCall.filter((call) => call["variable_DIALSTATUS"] === "NO_USER_RESPONSE").length / (outboundCall.length)) * 100).toFixed(2)}%</div>
                                    </div>
                                </div>
                                <div className="col-xl-2">
                                    <div className="itemWrapperb a">
                                        <div className="heading">Extensions On Calls</div>
                                        <div className="data-number">0</div>
                                        <div className="label2">Percentage 0%</div>
                                    </div>
                                </div>
                                <div className="col-xl-2">
                                    <div className="itemWrapperb b">
                                        <div className="heading">Average Talk Time</div>
                                        <div className="data-number">00.00.00</div>
                                        <div className="label2">Total 00.00.00</div>
                                    </div>
                                </div>
                                <div className="col-xl-2">
                                    <div className="itemWrapperb d">
                                        <div className="heading">Total Spent</div>
                                        <div className="data-number">$0.00</div>
                                        <div className="label2">N/A</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 row d-none">
                        <div className="col-xl-6 position-relative">
                            <canvas id="callsChart" />
                        </div>
                        <div className="col-xl-6 position-relative">
                            <canvas id="usersChart" />
                        </div>
                    </div>
                </div>
                : <ContentLoader />}
        </>

    )
}

export default AllCallsDetails
