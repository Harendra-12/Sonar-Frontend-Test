import React, { useEffect, useState } from 'react'
// import AllCalls from "./AllCallsDetails"
// import CallQueueDetails from "./CallQueueDetails"
// import RingGroup from "./RingGroupDetails"
import { useNavigate } from 'react-router-dom'
import { generalGetFunction } from '../../GlobalFunction/globalFunction'
import { useSelector } from 'react-redux'
import Header from '../../CommonComponents/Header'
import GlobalCalls from '../../GlobalFunction/GlobalCalls'
import DoughnutChart from '../../CommonComponents/DoughnutChart'
import GraphChart from '../../CommonComponents/GraphChart'
const Dashboard = () => {

    // const [calls, setCalls] = useState(false)
    // const [group, setGroup] = useState(false)
    // const [queue, setQueue] = useState(false)
    const navigate = useNavigate()
    const account = useSelector((state) => state.account)
    const [extensionList, setExtensionList] = useState(0)
    const [userList, setUserList] = useState(0)
    const registerUser = useSelector((state) => state.registerUser);
    const loginUser = useSelector((state) => state.loginUser);
    useEffect(() => {
            async function getData() {
                const apiData = await generalGetFunction(`/extension/search?account=${account.account_id}`, navigate)
                const userApi = await generalGetFunction(`/user/search?account=${account.account_id}`, navigate)
                if (apiData.status) {
                    setExtensionList(apiData.data.length)
                }
                if (userApi.status) {
                    setUserList(userApi.data.length)
                }
            }
            getData()
    }, [account, navigate])
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row ">

                        <Header title="Dashboard" />
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
                            <nav>
                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                    <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-calls" type="button" role="tab" aria-controls="nav-calls" aria-selected="true">Calls</button>
                                    <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-messages" type="button" role="tab" aria-controls="nav-messages" aria-selected="false">Messages</button>
                                    <button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-queue" type="button" role="tab" aria-controls="nav-queue" aria-selected="false">Call Queue</button>
                                    <button className="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-ring" type="button" role="tab" aria-controls="nav-ring" aria-selected="false">Ring Group</button>
                                </div>
                            </nav>
                            <div className="tab-content mt-3" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="nav-calls" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">
                                    <div className="row">
                                        <div className="col-xl-3">
                                            <div className="itemWrapper a">
                                                <div className="heading"><i class="fa-duotone fa-phone-office"></i> Handled Calls</div>
                                                <div className="data-number">2</div>
                                                <div className="label">21 Inbound (Answered)</div>
                                                <div className="label">0 Connected Callbacks</div>
                                                <div className="label">17 Outbound (Connected)</div>
                                                {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/user'" effect="ripple"><i className="fa-duotone fa-users"></i> View All Users</button> */}
                                            </div>
                                        </div>
                                        <div className="col-xl-3">
                                            <div className="itemWrapper b">
                                                <div className="heading"><i class="fa-duotone fa-clock"></i> Total Minutes</div>
                                                <div className="data-number">1075</div>
                                                <div className="label">21 Inbound (Answered)</div>
                                                <div className="label">17 Outbound (Connected)</div>
                                                {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/extensions'" effect="ripple"><i className="fa-duotone fa-phone-office"></i> View All Extensions</button> */}
                                            </div>
                                        </div>
                                        <div className="col-xl-3">
                                            <div className="itemWrapper c">
                                                <div className="heading"><i class="fa-duotone fa-phone-missed"></i> Missed Calls</div>
                                                <div className="data-number">5</div>
                                                <div className="label">1 Voicecall Missed</div>
                                                <div className="label">4 Calls Missed</div>
                                                {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
                                            </div>
                                        </div>
                                        <div className="col-xl-3">
                                            <div className="itemWrapper d">
                                                <div className="heading"><i class="fa-duotone fa-phone-xmark"></i> Abandoned Calls</div>
                                                <div className="data-number">5</div>
                                                <div className="label">1 Internal Call</div>
                                                <div className="label">4 External Calls</div>
                                                {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="nav-messages" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0">
                                    <div className="row">
                                        <div className="col-xl-3">
                                            <div className="itemWrapper a">
                                                <div className="heading"><i class="fa-duotone fa-message-arrow-down"></i> Received Messages</div>
                                                <div className="data-number">10</div>
                                                <div className="label">7 UnRead Messages</div>
                                                <div className="label">3 Read Messages</div>
                                                {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/user'" effect="ripple"><i className="fa-duotone fa-users"></i> View All Users</button> */}
                                            </div>
                                        </div>
                                        <div className="col-xl-3">
                                            <div className="itemWrapper b">
                                                <div className="heading"><i class="fa-duotone fa-message-arrow-up"></i> Messages Sent</div>
                                                <div className="data-number">20</div>
                                                <div className="label">17 Internal Messages</div>
                                                <div className="label">3 External Messages</div>
                                                {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/extensions'" effect="ripple"><i className="fa-duotone fa-phone-office"></i> View All Extensions</button> */}
                                            </div>
                                        </div>
                                        <div className="col-xl-3">
                                            <div className="itemWrapper c">
                                                <div className="heading"><i class="fa-duotone fa-inbox"></i> Total Inbox</div>
                                                <div className="data-number">50</div>
                                                <div className="label">1.26 KB Used</div>
                                                <div className="label">100 GB Available</div>
                                                {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
                                            </div>
                                        </div>
                                        <div className="col-xl-3">
                                            <div className="itemWrapper d">
                                                <div className="heading"><i class="fa-duotone fa-envelopes"></i> Emails</div>
                                                <div className="data-number">6</div>
                                                <div className="label">1 Sent Email</div>
                                                <div className="label">5 Unread Email</div>
                                                <div className="label">1 Draft</div>
                                                {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="nav-queue" role="tabpanel" aria-labelledby="nav-contact-tab" tabindex="0">
                                    <div className="row">
                                        <div className="col-xl-3">
                                            <div className="itemWrapper a">
                                                <div className="heading"><i class="fa-duotone fa-phone-volume"></i> Total Queues</div>
                                                <div className="data-number"> 10 </div>
                                                <div className="label">3 Currently Active Queue</div>
                                                <div className="label">7 Inactive Queue</div>
                                                {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/user'" effect="ripple"><i className="fa-duotone fa-users"></i> View All Users</button> */}
                                            </div>
                                        </div>
                                        <div className="col-xl-3">
                                            <div className="itemWrapper b">
                                                <div className="heading"><i class="fa-duotone fa-users"></i> Total Agents</div>
                                                <div className="data-number">25 </div>
                                                <div className="label">15 Agents in Queue</div>
                                                <div className="label">5 Agents Not in Queue</div>
                                                {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/extensions'" effect="ripple"><i className="fa-duotone fa-phone-office"></i> View All Extensions</button> */}
                                            </div>
                                        </div>
                                        <div className="col-xl-3">
                                            <div className="itemWrapper c">
                                                <div className="heading"><i class="fa-duotone fa-circle-pause"></i> Calls Waiting</div>
                                                <div className="data-number">5</div>
                                                <div className="label">1 Waiting in Queue 1</div>
                                                <div className="label">4 Waiting in Queue 2</div>
                                                {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
                                            </div>
                                        </div>
                                        <div className="col-xl-3">
                                            <div className="itemWrapper d">
                                                <div className="heading"><i class="fa-duotone fa-phone-xmark"></i> Calls Overflow</div>
                                                <div className="data-number">6</div>
                                                <div className="label">4 Calls Overflown</div>
                                                <div className="label">2 Calls Abandoned</div>
                                                {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="nav-ring" role="tabpanel" aria-labelledby="nav-contact-tab" tabindex="0">
                                    <div className="row">
                                        <div className="col-xl-3">
                                            <div className="itemWrapper a">
                                                <div className="heading"><i class="fa-duotone fa-phone-rotary"></i> Total Ring Group</div>
                                                <div className="data-number"> 10 </div>
                                                <div className="label">3 Currently Active in Group</div>
                                                <div className="label">7 Inactive in Group</div>
                                                {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/user'" effect="ripple"><i className="fa-duotone fa-users"></i> View All Users</button> */}
                                            </div>
                                        </div>
                                        <div className="col-xl-3">
                                            <div className="itemWrapper b">
                                                <div className="heading"><i class="fa-duotone fa-phone-volume"></i> Active Calls </div>
                                                <div className="data-number">25 </div>
                                                <div className="label">15 Agents in Group</div>
                                                <div className="label">5 Agents Not in Group</div>
                                                {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/extensions'" effect="ripple"><i className="fa-duotone fa-phone-office"></i> View All Extensions</button> */}
                                            </div>
                                        </div>
                                        <div className="col-xl-3">
                                            <div className="itemWrapper c">
                                                <div className="heading"><i class="fa-duotone fa-circle-pause"></i> Calls Waiting</div>
                                                <div className="data-number">5</div>
                                                <div className="label">1 Waiting in Queue 1</div>
                                                <div className="label">4 Waiting in Queue 2</div>
                                                {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
                                            </div>
                                        </div>
                                        <div className="col-xl-3">
                                            <div className="itemWrapper d">
                                                <div className="heading"><i class="fa-duotone fa-phone-xmark"></i> Calls Overflow</div>
                                                <div className="data-number">6</div>
                                                <div className="label">4 Calls Overflown</div>
                                                <div className="label">2 Calls Abandoned</div>
                                                {/* <button className="moreInfo" onclick="window.location.href='http://192.168.1.88/ringerappCI/devices'" effect="ripple"><i className="fa-duotone fa-mobile-retro"></i> View All Devices</button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="col-12 mt-3">
                            <div className="row">
                                <div className="col-xl-4 tabButtonParent">
                                    <button
                                        className={calls ? "tabButton active" : "tabButton"}
                                        onClick={() => setCalls(!calls)}
                                        data-id={1}
                                    >
                                        All Calls
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
                        {calls ? <AllCalls /> : ""}
                        {group ? <RingGroup /> : ""}
                        {queue ? <CallQueueDetails /> : ""} */}

                        <div className="col-12 mt-4 mb-2 chartWrapper">
                            <div className="row">
                                <div className="col-xl-3">
                                    <div className='wrapper'>
                                        <DoughnutChart fields={["Online Extension", "Register Extension","Available Extension"]} percentage={[registerUser.length,extensionList, 69-extensionList]} centerTitle={`${extensionList}/69`} centerDesc="Extensions Details" colors={['#9999','#FF6384', '#36A2EB']} />
                                    </div>
                                </div>
                                <div className="col-xl-3">
                                    <div className='wrapper'>
                                        <DoughnutChart fields={["Online Users", "Registered Users ","Available Users "]} percentage={[loginUser.length,userList, 10-userList]} centerTitle={`${userList}/10`} centerDesc="Total Users Available" colors={['#9999','#FF6384', '#36A2EB']} />
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

export default Dashboard