import React, { useState } from 'react'
import Header from '../../../CommonComponents/Header'
import { backToTop } from '../../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';

function CampaignScheduler() {
    const navigate = useNavigate();
    const [strategy, setStrategy] = useState("daily")
    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Campaign Manage" />
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>Campaign Schedule</h4>
                                                    <p>Select a schedule for your campaign</p>
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
                                                    <button
                                                        type="button"
                                                        className="panelButton"
                                                    >
                                                        <span className="text" >Save</span>
                                                        <span className="icon">
                                                            <i className={`fa-solid fa-floppy-disk`}></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12" style={{ padding: '25px 23px' }}>
                                            <div className='row'>
                                                <div className='col-xl-7' style={{ borderRight: '1px solid var(--border-color)' }}>
                                                    <div className="row">
                                                        <div className='col-xl-12'>
                                                            <div className='heading bg-transparent border-bottom-0 pt-0'>
                                                                <div className='content'>
                                                                    <h4>Operational Hours</h4>
                                                                    <p>Choose the hours and days of the week you would like the service to be active in. You can choose a default strategy or customize one yourself.</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-xl-12'>
                                                            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
                                                                <div className='row gy-3'>
                                                                    <div className='col-12'>
                                                                        <div className='heading bg-transparent border-bottom-0 p-0'>
                                                                            <div className='content'>
                                                                                <h4>Strategy</h4>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-xl-4'>
                                                                        <div className={`itemWrapper local-calls ${strategy === "daily" ? "active" : ""}`} style={{ cursor: "pointer" }} onClick={() => setStrategy("daily")}>
                                                                            <div className="heading d-block text-start h-auto">
                                                                                {/* <i className="fa-solid fa-phone-flip" /> */}
                                                                                <h5 className='mb-2'>Daily</h5>
                                                                                <p>Best suited for set and forget operators who want to maximise across all times</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-xl-4'>
                                                                        <div className={`itemWrapper local-calls text-start ${strategy === "date-range" ? "active" : ""}`} style={{ cursor: "pointer" }} onClick={() => setStrategy("date-range")}>
                                                                            <div className="heading d-block text-start h-auto">
                                                                                {/* <i className="fa-solid fa-phone-flip" /> */}
                                                                                <h5 className='mb-2'>Date Range</h5>
                                                                                <p>Use for specific control and optimize for each unique window of date and time</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* <div className='col-xl-12'>
                                                            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
                                                                <div className='row'>
                                                                    <div className='col-12'>
                                                                        <div className='heading bg-transparent border-bottom-0 px-0 pt-0'>
                                                                            <div className='content'>
                                                                                <h4>Eligible Times</h4>
                                                                                <p>Select the days of the week to be active</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-auto'>
                                                                        <div className="itemWrapper local-calls a active h-auto" style={{ cursor: "pointer" }}>
                                                                            <div className="heading d-block text-start h-auto">
                                                                                <h5 className='mb-0'>Mon</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-auto'>
                                                                        <div className="itemWrapper local-calls a active h-auto" style={{ cursor: "pointer" }}>
                                                                            <div className="heading d-block text-start h-auto">
                                                                                <h5 className='mb-0'>Tue</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-auto'>
                                                                        <div className="itemWrapper local-calls a active h-auto" style={{ cursor: "pointer" }}>
                                                                            <div className="heading d-block text-start h-auto">
                                                                                <h5 className='mb-0'>Wed</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-auto'>
                                                                        <div className="itemWrapper local-calls a h-auto" style={{ cursor: "pointer" }}>
                                                                            <div className="heading d-block text-start h-auto">
                                                                                <h5 className='mb-0'>Thu</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-auto'>
                                                                        <div className="itemWrapper local-calls a h-auto" style={{ cursor: "pointer" }}>
                                                                            <div className="heading d-block text-start h-auto">
                                                                                <h5 className='mb-0'>Fri</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-auto'>
                                                                        <div className="itemWrapper local-calls a h-auto" style={{ cursor: "pointer" }}>
                                                                            <div className="heading d-block text-start h-auto">
                                                                                <h5 className='mb-0'>Sat</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-auto'>
                                                                        <div className="itemWrapper local-calls a h-auto" style={{ cursor: "pointer" }}>
                                                                            <div className="heading d-block text-start h-auto">
                                                                                <h5 className='mb-0'>Sun</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </div> */}
                                                        {strategy === "daily" ? <div className='col-xl-12'>
                                                            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
                                                                <div className='row'>
                                                                    <div className='col-12'>
                                                                        <div className='heading bg-transparent border-bottom-0 px-0 pt-0'>
                                                                            <div className='content'>
                                                                                <h4>Hours</h4>
                                                                                <p>Set which hours you want to be active</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-12'>
                                                                        <div className='row align-items-center'>
                                                                            <div style={{ width: 100 }}>
                                                                                <label className='fw-medium'>Monday</label>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <div className='position-relative'>
                                                                                    {/* <label className="switch">
                                                                                        <input type="checkbox" id="showAllCheck" defaultChecked="" />
                                                                                        <span className="slider round" />
                                                                                    </label> */}
                                                                                    <div class="cl-toggle-switch">
                                                                                        <label class="cl-switch">
                                                                                            <input
                                                                                                type="checkbox" id="showAllCheck"
                                                                                                defaultChecked=""
                                                                                            />
                                                                                            <span></span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <input type="time" className='formItem' />
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <label>TO</label>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <input type="time" className='formItem' />
                                                                            </div>
                                                                        </div>
                                                                        <div className='row align-items-center mt-3'>
                                                                            <div style={{ width: 100 }}>
                                                                                <label className='fw-medium'>Tuesday</label>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <div className='position-relative'>
                                                                                    {/* <label className="switch">
                                                                                        <input type="checkbox" id="showAllCheck" defaultChecked="" />
                                                                                        <span className="slider round" />
                                                                                    </label> */}
                                                                                    <div class="cl-toggle-switch">
                                                                                        <label class="cl-switch">
                                                                                            <input
                                                                                                type="checkbox" id="showAllCheck"
                                                                                                defaultChecked=""
                                                                                            />
                                                                                            <span></span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <input type="time" className='formItem' />
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <label>TO</label>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <input type="time" className='formItem' />
                                                                            </div>
                                                                        </div>
                                                                        <div className='row align-items-center mt-3'>
                                                                            <div style={{ width: 100 }}>
                                                                                <label className='fw-medium'>Wednesday</label>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <div className='position-relative'>
                                                                                    {/* <label className="switch">
                                                                                        <input type="checkbox" id="showAllCheck" defaultChecked="" />
                                                                                        <span className="slider round" />
                                                                                    </label> */}
                                                                                    <div class="cl-toggle-switch">
                                                                                        <label class="cl-switch">
                                                                                            <input
                                                                                                type="checkbox" id="showAllCheck"
                                                                                                defaultChecked=""
                                                                                            />
                                                                                            <span></span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <input type="time" className='formItem' />
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <label>TO</label>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <input type="time" className='formItem' />
                                                                            </div>
                                                                        </div>
                                                                        <div className='row align-items-center mt-3'>
                                                                            <div style={{ width: 100 }}>
                                                                                <label className='fw-medium'>Thursday</label>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <div className='position-relative'>
                                                                                    {/* <label className="switch">
                                                                                        <input type="checkbox" id="showAllCheck" defaultChecked="" />
                                                                                        <span className="slider round" />
                                                                                    </label> */}
                                                                                    <div class="cl-toggle-switch">
                                                                                        <label class="cl-switch">
                                                                                            <input
                                                                                                type="checkbox" id="showAllCheck"
                                                                                                defaultChecked=""
                                                                                            />
                                                                                            <span></span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <input type="time" className='formItem' />
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <label>TO</label>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <input type="time" className='formItem' />
                                                                            </div>
                                                                        </div>
                                                                        <div className='row align-items-center mt-3'>
                                                                            <div style={{ width: 100 }}>
                                                                                <label className='fw-medium'>Friday</label>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <div className='position-relative'>
                                                                                    {/* <label className="switch">
                                                                                        <input type="checkbox" id="showAllCheck" defaultChecked="" />
                                                                                        <span className="slider round" />
                                                                                    </label> */}
                                                                                    <div class="cl-toggle-switch">
                                                                                        <label class="cl-switch">
                                                                                            <input
                                                                                                type="checkbox" id="showAllCheck"
                                                                                                defaultChecked=""
                                                                                            />
                                                                                            <span></span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <input type="time" className='formItem' />
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <label>TO</label>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <input type="time" className='formItem' />
                                                                            </div>
                                                                        </div>
                                                                        <div className='row align-items-center mt-3'>
                                                                            <div style={{ width: 100 }}>
                                                                                <label className='fw-medium'>Saturday</label>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <div className='position-relative'>
                                                                                    {/* <label className="switch">
                                                                                        <input type="checkbox" id="showAllCheck" defaultChecked="" />
                                                                                        <span className="slider round" />
                                                                                    </label> */}
                                                                                    <div class="cl-toggle-switch">
                                                                                        <label class="cl-switch">
                                                                                            <input
                                                                                                type="checkbox" id="showAllCheck"
                                                                                                defaultChecked=""
                                                                                            />
                                                                                            <span></span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <input type="time" className='formItem' />
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <label>TO</label>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <input type="time" className='formItem' />
                                                                            </div>
                                                                        </div>
                                                                        <div className='row align-items-center mt-3'>
                                                                            <div style={{ width: 100 }}>
                                                                                <label className='fw-medium'>Sunday</label>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <div className='position-relative'>
                                                                                    {/* <label className="switch">
                                                                                        <input type="checkbox" id="showAllCheck" defaultChecked="" />
                                                                                        <span className="slider round" />
                                                                                    </label> */}
                                                                                    <div class="cl-toggle-switch">
                                                                                        <label class="cl-switch">
                                                                                            <input
                                                                                                type="checkbox" id="showAllCheck"
                                                                                                defaultChecked=""
                                                                                            />
                                                                                            <span></span>
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <input type="time" className='formItem' />
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <label>TO</label>
                                                                            </div>
                                                                            <div className='col-auto'>
                                                                                <input type="time" className='formItem' />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> :

                                                            <div className='col-xl-12'>
                                                                <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
                                                                    <div className='row'>
                                                                        <div className='col-12'>
                                                                            <div className='heading bg-transparent border-bottom-0 px-0 pt-0'>
                                                                                <div className='content'>
                                                                                    <h4>Date Range</h4>
                                                                                    <p>Select the date and time range for your campaign</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className='col-12'>
                                                                            <div className='formRow'>
                                                                                <div className='formLabel'>
                                                                                    <label>Select Start Date</label>
                                                                                    <label className='formItemDesc'>Enter the date and time from when the campaign will start</label>
                                                                                </div>
                                                                                <div className='col-6'>
                                                                                    <input type="datetime-local" className='formItem' />
                                                                                </div>
                                                                            </div>
                                                                            <div className='formRow'>
                                                                                <div className='formLabel'>
                                                                                    <label>Select End Date</label>
                                                                                    <label className='formItemDesc'>Enter the date and time at which the campaign will end</label>
                                                                                </div>
                                                                                <div className='col-6'>
                                                                                    <input type="datetime-local" className='formItem' />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                                <div className='col-xl-5' >
                                                    <div className='formRow'>
                                                        <div className='formLabel'>
                                                            <label>
                                                                Campain Name:
                                                            </label>
                                                            <label className='formItemDesc'>
                                                                Enter the name of the campaign
                                                            </label>
                                                        </div>
                                                        <div className='col'>
                                                            <input type="text" name="name" className="formItem" value="Test Campaign"
                                                                style={{ borderRight: 'none', borderLeft: 'none', borderTop: 'none' }}
                                                            />
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
    )
}

export default CampaignScheduler