import { Avatar, CircularProgress } from '@mui/material'
import { green } from '@mui/material/colors';
import React, { useState } from 'react'

function ConfigureStepDashboard() {
    const [isComplete, setIsComplete] = useState(true);
    return (
        <div>
            <div className="profileView">
                <div className="profileDetailsHolder position-relative">
                    <div className='content'>
                        <h2>Congratulations<span>!</span></h2>
                        <p>You are at the final step of getting access to <b>Angel PBX</b>, please <span>configure your account</span> to proceed further.</p>
                        <div className='col-xl-2 mx-auto'><button className='payNow'>Configure Now <i class="ms-1 fa-duotone fa-circle-arrow-right"></i></button></div>
                    </div>
                    <div className='configProgressWrapper'>
                        <ul>
                            <li>
                                <div className={isComplete ? 'configProgress success' : "configProgress pending"}>
                                    {!isComplete ? <CircularProgress size="35px" sx={{ color: green[500], }} /> : <i class="fa-duotone fa-check"></i>}
                                </div>
                                <div className='configProgressText '>
                                    <p>Searching for available DID</p>
                                </div>
                            </li>
                            <li>
                                <div className="configProgress">
                                    {true ? <CircularProgress size="35px" sx={{ color: green[500], }} /> : <i class="fa-duotone fa-check"></i>}
                                </div>
                                <div className='configProgressText'>
                                    <p>Acquiring your DID</p>
                                </div>
                            </li>
                            <li>
                                <div className={false ? 'configProgress success' : "configProgress pending"}>
                                    {false ? <CircularProgress size="35px" sx={{ color: green[500], }} /> : <i class="fa-duotone fa-check"></i>}
                                </div>
                                <div className='configProgressText'>
                                    <p>Configuring your DID</p>
                                </div>
                            </li>
                            <li>
                                <div className={false ? 'configProgress success' : "configProgress pending"}>
                                    {false ? <CircularProgress size="35px" sx={{ color: green[500], }} /> : <i class="fa-duotone fa-check"></i>}
                                </div>
                                <div className='configProgressText'>
                                    <p>Good to go!</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ConfigureStepDashboard