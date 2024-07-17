import React, { useEffect, useState } from 'react'
import AllCallsDetails from './AllCallsDetails'
import CallQueueDetails from "./CallQueueDetails"
import RingGroup from "./RingGroupDetails"
import { useNavigate } from 'react-router-dom'
import { generalGetFunction } from '../../GlobalFunction/globalFunction'
import { useSelector } from 'react-redux'
import Header from '../../CommonComponents/Header'
import GlobalCalls from '../../GlobalFunction/GlobalCalls'
import DoughnutChart from '../../CommonComponents/DoughnutChart'
import GraphChart from '../../CommonComponents/GraphChart'


function PhoneDashboard() {
    const [calls, setCalls] = useState(true)
    const [group, setGroup] = useState(false)
    const [queue, setQueue] = useState(false)
    const navigate = useNavigate()
    // const account = useSelector((state) => state.account)
    const [extensionList, setExtensionList] = useState(0)
    const [userList, setUserList] = useState(0)
    const registerUser = useSelector((state) => state.registerUser);
    const loginUser = useSelector((state) => state.loginUser);
    useEffect(() => {
        async function getData() {
            const apiData = await generalGetFunction(`/extension/search?account=1`, navigate)
            const userApi = await generalGetFunction(`/user/search?account=1`, navigate)
            if (apiData.status) {
                setExtensionList(apiData.data.length)
            }
            if (userApi.status) {
                setUserList(userApi.data.length)
            }
        }
        getData()
    }, [navigate])
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row ">

                        <Header title="Phone Dashboard" />
                        {/* <div
                                className="row pt-3 justify-content-between"
                                style={{}}
                            >
                                <div className="col-xl-4 col-6 my-auto">
                                    <div className="position-relative searchBox">
                                        <input
                                            type="search"
                                            name="Search"
                                            id="headerSearch"
                                            placeholder="Looking for an option?"
                                        />
                                    </div>
                                </div>
                                <div className="col-xl-8 col-6">
                                    <div className="d-flex justify-content-end">
                                        <button
                                            effect="ripple"
                                            className="appPanelButton"
                                        >
                                            <i className="fa-duotone fa-pen" />
                                        </button>
                                        <button
                                            effect="ripple"
                                            className="appPanelButton"
                                        >
                                            <i className="fa-duotone fa-message" />
                                        </button>
                                        <button
                                            effect="ripple"
                                            className="appPanelButton"
                                        >
                                            <i className="fa-duotone fa-gear" />
                                        </button>
                                    </div>
                                </div>
                            </div> */}

                        <div className='col-12 mt-3 tangoNavs'>
                            <div className="col-12 mt-3">
                                <div className="row">
                                    <div className="col-xl-4 tabButtonParent">
                                        <button
                                            className={calls ? "tabButton active" : "tabButton"}
                                            onClick={() => setCalls(!calls)}
                                            data-id={1}
                                        >
                                            Extensions
                                        </button>
                                    </div>
                                    <div className="col-xl-4 tabButtonParent">
                                        <button
                                            className={group ? "tabButton active" : "tabButton"}
                                            onClick={() => setGroup(!group)}
                                            data-id={2}
                                        >
                                            Ring Group
                                        </button>
                                    </div>
                                    <div className="col-xl-4 tabButtonParent">
                                        <button
                                            className={queue ? "tabButton active" : "tabButton"}
                                            onClick={() => setQueue(!queue)}
                                            data-id={3}
                                        >
                                            Call Queue
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {calls ? <AllCallsDetails /> : ""}
                            {group ? <RingGroup /> : ""}
                            {queue ? <CallQueueDetails /> : ""}
                            <div className="row mt-3">
                                <div className="col-xl-3">
                                    <div className="itemWrapper c">
                                        <div className="heading"><i class="fa-duotone fa-phone-office"></i> Extensions</div>
                                        <div className="data-number">10</div>
                                        <div className="label">10 Extension on Call</div>
                                        <div className="label">5 Extension Offline</div>
                                        <div className="label">12 Extension Online</div>
                                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/extensions'" effect="ripple"><i className="fa-duotone fa-phone-office"></i> View All Extensions</button> */}
                                    </div>
                                </div>
                                <div className="col-xl-3">
                                    <div className="itemWrapper a">
                                        <div className="heading"><i class="fa-duotone fa-users"></i> Users</div>
                                        <div className="data-number">2</div>
                                        <div className="label">21 Inbound (Answered)</div>
                                        <div className="label">0 Connected Callbacks</div>
                                        <div className="label">17 Outbound (Connected)</div>
                                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/user'" effect="ripple"><i className="fa-duotone fa-users"></i> View All Users</button> */}
                                    </div>
                                </div>
                                <div className="col-xl-3">
                                    <div className="itemWrapper b">
                                        <div className="heading"><i class="fa-duotone fa-clock"></i> Call Center Queue</div>
                                        <div className="data-number">1075</div>
                                        <div className="label">21 Inbound (Answered)</div>
                                        <div className="label">17 Outbound (Connected)</div>
                                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/extensions'" effect="ripple"><i className="fa-duotone fa-phone-office"></i> View All Extensions</button> */}
                                    </div>
                                </div>
                                <div className="col-xl-3">
                                    <div className="itemWrapper d">
                                        <div className="heading"><i class="fa-duotone fa-phone-missed"></i> Devices</div>
                                        <div className="data-number">5</div>
                                        <div className="label">1 Voicecall Missed</div>
                                        <div className="label">4 Calls Missed</div>
                                        {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 mt-4 mb-2 chartWrapper">
                            <div className="row">
                                <div className="col-xl-3">
                                    <div className='wrapper'>
                                        <DoughnutChart fields={["Online Extension", "Register Extension", "Available Extension"]} percentage={[registerUser.length, extensionList, 69 - extensionList]} centerTitle={`${extensionList}/69`} centerDesc="Extensions Details" colors={['#9999', '#FF6384', '#36A2EB']} />
                                    </div>
                                </div>
                                <div className="col-xl-3">
                                    <div className='wrapper'>
                                        <DoughnutChart fields={["Online Users", "Registered Users ", "Available Users "]} percentage={[loginUser.length, userList, 10 - userList]} centerTitle={`${userList}/10`} centerDesc="Total Users Available" colors={['#9999', '#FF6384', '#36A2EB']} />
                                    </div>
                                    {/* <div className='circularProgressWrapper'>
                                        <svg width="250" height="250" viewBox="0 0 250 250" className="circular-progress" style={{ '--progress': `50` }}>
                                            <circle className="bg"
                                                cx="125" cy="125" r="115" fill="none" stroke="#f18f0130" stroke-width="20"
                                            ></circle>
                                            <circle className="fg"
                                                cx="125" cy="125" r="115" fill="none" stroke="#f18f01" stroke-width="20"
                                                stroke-dasharray="361.25 361.25"
                                            ></circle>
                                        </svg>
                                        <div className='circularProgressContent'>
                                            <div className="data-number">
                                                <label style={{ color: '#f18f01' }}>{userList}</label> <span>/ 69</span>
                                            </div>
                                            <p>Total Users Created</p>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="col-xl-6">
                                    <div className='wrapper'>
                                        <GraphChart fields={["Available Extension", "Registered Extension"]} percentage={[(69 - extensionList) * 100 / 69, extensionList * 100 / 69]} centerTitle={`${extensionList}/69`} centerDesc="Total Extensions" colors={['#f18f01', '#36A2EB']} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <GlobalCalls />
        </main >
    )
}

export default PhoneDashboard
