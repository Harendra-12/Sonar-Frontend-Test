import React from 'react'
import Header from '../../../CommonComponents/Header'
import { backToTop } from '../../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';

function CampaignScheduler() {
    const navigate = useNavigate();
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
                                                    <h4>Campaign Create</h4>
                                                    <p>Create a new campaign</p>
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
                                                            <i class="fa-solid fa-caret-left"></i>
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
                                            <div className='col-xl-6'>
                                                <div className="row">
                                                    <div className='col-xl-12'>
                                                        <div className='heading bg-transparent border-bottom-0'>
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
                                                                    <h4>Strategy</h4>
                                                                </div>
                                                                <div className='col-xl-4'>
                                                                    <div className="itemWrapper local-calls a active" style={{ cursor: "pointer" }}>
                                                                        <div className="heading d-block text-start h-auto">
                                                                            {/* <i className="fa-solid fa-phone-flip" /> */}
                                                                            <h5 className='mb-2'>Default</h5>
                                                                            <p>Best suited for set and forget operators who want to maximise across all times</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='col-xl-4'>
                                                                    <div className="itemWrapper local-calls a text-start" style={{ cursor: "pointer" }}>
                                                                        <div className="heading d-block text-start h-auto">
                                                                            {/* <i className="fa-solid fa-phone-flip" /> */}
                                                                            <h5 className='mb-2'>Custom</h5>
                                                                            <p>Use for specific control and optimize for each unique window of time</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-xl-12'>
                                                        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
                                                            <div className='row'>
                                                                <div className='col-12'>
                                                                    <h4>Eligible Times</h4>
                                                                    <p>Select the days of the week to be active</p>
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
                                                    </div>
                                                    <div className='col-xl-12'>
                                                        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
                                                            <div className='row'>
                                                                <div className='col-12'>
                                                                    <h4>Hours</h4>
                                                                    <p>Set which hours you want to be active</p>
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
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default CampaignScheduler