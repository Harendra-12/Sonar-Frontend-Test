import React from 'react'
import { useSelector } from 'react-redux';
import ContentLoader from '../Misc/ContentLoader';

function AllCallsDetails() {
    const callDetails = useSelector((state)=>state.allCall)
    console.log("This is call details",callDetails);
    return (
        <>
        {(callDetails && callDetails.all)?
         <div
            className="tabGroupDetails"
            data-id={1}
        >
            <div className="col-12">
                <div
                    className="callItemWrapper"
                    data-id={1}
                    style={{ height: 350 }}
                >
                    <div className="row gx-3">
                        <div className="col-12 title text-start">
                            <i className="fa-duotone fa-phone-volume" /> All Calls{" "}
                        </div>
                        <div className="col-xl-2">
                            <div className="itemWrapperb a">
                                <div className="heading">Total Calls</div>
                                <div className="data-number">{callDetails.all.count}</div>
                                <div className="label2">100% of total calls</div>
                            </div>
                        </div>
                        <div className="col-xl-2">
                            <div className="itemWrapperb d">
                                <div className="heading">Total Calls Completed</div>
                                <div className="data-number">{callDetails.all.success}</div>
                                <div className="label2">Percentage {((callDetails.all.success/(callDetails.all.count))*100).toFixed(2)}%</div>
                            </div>
                        </div>
                        <div className="col-xl-2">
                            <div className="itemWrapperb c">
                                <div className="heading">Missed Calls</div>
                                <div className="data-number">{callDetails.all.missed}</div>
                                <div className="label2">Percentage {((callDetails.all.missed/(callDetails.all.count))*100).toFixed(2)}%</div>
                            </div>
                        </div>
                        <div className="col-xl-2">
                            <div className="itemWrapperb a">
                                <div className="heading">Active Calls</div>
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
                    <div className="row gx-3 mt-2">
                        <div className="col-12 title text-start">
                            <i
                                className="fa-duotone fa-phone-arrow-down-left"
                                style={{ color: "var(--funky-boy3)" }}
                            />{" "}
                            Inbound Calls
                        </div>
                        <div className="col-xl-2">
                            <div className="itemWrapperb a">
                                <div className="heading">Total Calls</div>
                                <div className="data-number">{callDetails.inboundData.count}</div>
                                <div className="label2">{((callDetails.inboundData.count/(callDetails.all.count))*100).toFixed(2)}% of total calls</div>
                            </div>
                        </div>
                        <div className="col-xl-2">
                            <div className="itemWrapperb d">
                                <div className="heading">Total Calls Completed</div>
                                <div className="data-number">{callDetails.inboundData.success}</div>
                                <div className="label2">Percentage {((callDetails.inboundData.success/(callDetails.inboundData.count))*100).toFixed(2)}%</div>
                            </div>
                        </div>
                        <div className="col-xl-2">
                            <div className="itemWrapperb c">
                                <div className="heading">Missed Calls</div>
                                <div className="data-number">{callDetails.inboundData.missed}</div>
                                <div className="label2">Percentage {((callDetails.inboundData.missed/(callDetails.inboundData.count))*100).toFixed(2)}%</div>
                            </div>
                        </div>
                        <div className="col-xl-2">
                            <div className="itemWrapperb a">
                                <div className="heading">Active Calls</div>
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
                    <div className="row gx-3 mt-2">
                        <div className="col-12 title text-start">
                            <i
                                className="fa-duotone fa-phone-arrow-up-right"
                                style={{ color: "var(--color3)" }}
                            />{" "}
                            Outbound Calls
                        </div>
                        <div className="col-xl-2">
                            <div className="itemWrapperb a">
                                <div className="heading">Total Calls</div>
                                <div className="data-number">{callDetails.outboundData.count}</div>
                                <div className="label2">{((callDetails.outboundData.count/(callDetails.all.count))*100).toFixed(2)}% of total calls</div>
                            </div>
                        </div>
                        <div className="col-xl-2">
                            <div className="itemWrapperb d">
                                <div className="heading">Total Calls Completed</div>
                                <div className="data-number">{callDetails.outboundData.success}</div>
                                <div className="label2">Percentage {((callDetails.outboundData.success/(callDetails.outboundData.count))*100).toFixed(2)}%</div>
                            </div>
                        </div>
                        <div className="col-xl-2">
                            <div className="itemWrapperb c">
                                <div className="heading">Missed Calls</div>
                                <div className="data-number">{callDetails.outboundData.missed}</div>
                                <div className="label2">Percentage {((callDetails.outboundData.missed/(callDetails.outboundData.count))*100).toFixed(2)}%</div>
                            </div>
                        </div>
                        <div className="col-xl-2">
                            <div className="itemWrapperb a">
                                <div className="heading">Active Calls</div>
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
        :<ContentLoader />}
        </>
       
    )
}

export default AllCallsDetails
