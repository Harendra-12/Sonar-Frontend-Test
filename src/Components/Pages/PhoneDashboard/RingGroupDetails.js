import React from 'react'
import { useSelector } from 'react-redux'

const RingGroup = () => {
    const ringGroup = useSelector((state) => state.ringGroup)
    console.log("ring group", ringGroup);
    
    return (
        <div
            className="tabGroupDetails"
            data-id={2}
        // style={{ display: "none" }}
        >
            <div className="col-12">
                <div className="col-12 title text-start">
                    <i className="fa-duotone fa-ball-pile" /> Ring Group{" "}
                </div>
                <div className="row mb-3">
                    <div className="col-xl-1b">
                        <div className="itemWrapperb a">
                            <div className="heading">Ring Group</div>
                            <div
                                className="data-number"
                                style={{ fontSize: "19px" }}
                            >
                                XYZ.ABC.123
                            </div>
                            <div className="label2">N/A</div>
                        </div>
                    </div>
                    <div className="col-xl-1b">
                        <div className="itemWrapperb d">
                            <div className="heading">Total Calls</div>
                            <div className="data-number">0</div>
                            <div className="label2">100% of total calls</div>
                        </div>
                    </div>
                    <div className="col-xl-1b">
                        <div className="itemWrapperb d">
                            <div className="heading">Total Calls Completed</div>
                            <div className="data-number">0</div>
                            <div className="label2">N/A</div>
                        </div>
                    </div>
                    <div className="col-xl-1b">
                        <div className="itemWrapperb c">
                            <div className="heading">Missed Calls</div>
                            <div className="data-number">0</div>
                            <div className="label2">Percentage 0%</div>
                        </div>
                    </div>
                    <div className="col-xl-1b">
                        <div className="itemWrapperb a">
                            <div className="heading">Active Calls</div>
                            <div className="data-number">0</div>
                            <div className="label2">Percentage 0%</div>
                        </div>
                    </div>
                    <div className="col-xl-1b">
                        <div className="itemWrapperb d">
                            <div className="heading">Total Extensions</div>
                            <div className="data-number">5</div>
                            <div className="label2">N/A</div>
                        </div>
                    </div>
                    <div className="col-xl-1b">
                        <div className="itemWrapperb d">
                            <div className="heading">Total Spent</div>
                            <div className="data-number">$0.00</div>
                            <div className="label2">N/A</div>
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-xl-1b">
                        <div className="itemWrapperb a">
                            <div className="heading">Ring Group</div>
                            <div
                                className="data-number"
                                style={{ fontSize: "19px" }}
                            >
                                XYZ.ABC.123
                            </div>
                            <div className="label2">N/A</div>
                        </div>
                    </div>
                    <div className="col-xl-1b">
                        <div className="itemWrapperb d">
                            <div className="heading">Total Calls</div>
                            <div className="data-number">0</div>
                            <div className="label2">100% of total calls</div>
                        </div>
                    </div>
                    <div className="col-xl-1b">
                        <div className="itemWrapperb d">
                            <div className="heading">Total Calls Completed</div>
                            <div className="data-number">0</div>
                            <div className="label2">N/A</div>
                        </div>
                    </div>
                    <div className="col-xl-1b">
                        <div className="itemWrapperb c">
                            <div className="heading">Missed Calls</div>
                            <div className="data-number">0</div>
                            <div className="label2">Percentage 0%</div>
                        </div>
                    </div>
                    <div className="col-xl-1b">
                        <div className="itemWrapperb a">
                            <div className="heading">Active Calls</div>
                            <div className="data-number">0</div>
                            <div className="label2">Percentage 0%</div>
                        </div>
                    </div>
                    <div className="col-xl-1b">
                        <div className="itemWrapperb d">
                            <div className="heading">Total Extensions</div>
                            <div className="data-number">5</div>
                            <div className="label2">N/A</div>
                        </div>
                    </div>
                    <div className="col-xl-1b">
                        <div className="itemWrapperb d">
                            <div className="heading">Total Spent</div>
                            <div className="data-number">$0.00</div>
                            <div className="label2">N/A</div>
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-xl-1b">
                        <div className="itemWrapperb a">
                            <div className="heading">Ring Group</div>
                            <div
                                className="data-number"
                                style={{ fontSize: "19px" }}
                            >
                                XYZ.ABC.123
                            </div>
                            <div className="label2">N/A</div>
                        </div>
                    </div>
                    <div className="col-xl-1b">
                        <div className="itemWrapperb d">
                            <div className="heading">Total Calls</div>
                            <div className="data-number">0</div>
                            <div className="label2">100% of total calls</div>
                        </div>
                    </div>
                    <div className="col-xl-1b">
                        <div className="itemWrapperb d">
                            <div className="heading">Total Calls Completed</div>
                            <div className="data-number">0</div>
                            <div className="label2">N/A</div>
                        </div>
                    </div>
                    <div className="col-xl-1b">
                        <div className="itemWrapperb c">
                            <div className="heading">Missed Calls</div>
                            <div className="data-number">0</div>
                            <div className="label2">Percentage 0%</div>
                        </div>
                    </div>
                    <div className="col-xl-1b">
                        <div className="itemWrapperb a">
                            <div className="heading">Active Calls</div>
                            <div className="data-number">0</div>
                            <div className="label2">Percentage 0%</div>
                        </div>
                    </div>
                    <div className="col-xl-1b">
                        <div className="itemWrapperb d">
                            <div className="heading">Total Extensions</div>
                            <div className="data-number">5</div>
                            <div className="label2">N/A</div>
                        </div>
                    </div>
                    <div className="col-xl-1b">
                        <div className="itemWrapperb d">
                            <div className="heading">Total Spent</div>
                            <div className="data-number">$0.00</div>
                            <div className="label2">N/A</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RingGroup