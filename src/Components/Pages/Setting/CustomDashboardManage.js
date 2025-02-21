import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { backToTop } from '../../GlobalFunction/globalFunction';
import Header from '../../CommonComponents/Header';

function CustomDashboardManage() {
    const navigate = useNavigate();
    const [selectDashMod, setSelectDashMod] = useState(1);

    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid px-0">
                        <Header title="Custom Module Integration" />
                    </div>
                    <div className='col-xl-12'>
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Select Modules</h4>
                                                <p>Select the modules you want to include in your dashboard</p>
                                            </div>
                                            <div className="buttonGroup">
                                                <button
                                                    onClick={() => {
                                                        navigate(-1);
                                                        backToTop();
                                                    }}
                                                    type="button"
                                                    effect="ripple"
                                                    className="panelButton gray"
                                                >
                                                    <span className="text">Back</span>
                                                    <span className="icon"><i class="fa-solid fa-caret-left"></i></span>
                                                </button>
                                                <button effect="ripple" className="panelButton" onClick={() => setSelectDashMod()}>
                                                    <span className="text" >Save</span>
                                                    <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12" style={{ padding: '25px 23px', borderBottom: '1px solid #ddd' }}>
                                    <div className='row gx-5'>
                                        <div className='col-xl-6' style={{ borderRight: '1px solid var(--border-color)' }}>
                                            <div className='row g-4'>
                                                <div className='col-xl-4'>
                                                    <div className={`deviceProvision ${selectDashMod === 1 ? 'active' : ''} row align-items-center w-100`} onClick={() => setSelectDashMod(1)}>
                                                        <div className="itemWrapper a">
                                                            <div className="heading d-block h-auto">
                                                                <div className="d-flex flex-wrap justify-content-between">
                                                                    <div className="col-9">
                                                                        <h3 style={{ fontWeight: 900 }}>56</h3>
                                                                        <p>Agents logged in</p>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <i className="fa-solid fa-square-check" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-xl-4'>
                                                    <div className={`deviceProvision ${selectDashMod === 2 ? 'active' : ''} row align-items-center w-100`} onClick={() => setSelectDashMod(2)}>
                                                        <div className="itemWrapper b">
                                                            <div className="heading  d-block h-auto">
                                                                <div className="d-flex flex-wrap justify-content-between">
                                                                    <div className="col-9">
                                                                        <h3 style={{ fontWeight: 900 }}>50</h3>
                                                                        <p>Available Agents</p>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <i className="fa-solid fa-user-check" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-xl-4'>
                                                    <div className={`deviceProvision ${selectDashMod === 3 ? 'active' : ''} row align-items-center w-100`} onClick={() => setSelectDashMod(3)}>
                                                        <div className="itemWrapper c">
                                                            <div className="heading  d-block h-auto">
                                                                <div className="d-flex flex-wrap justify-content-between">
                                                                    <div className="col-9">
                                                                        <h3 style={{ fontWeight: 900 }}>45</h3>
                                                                        <p>Waiting Calls</p>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <i className="fa-solid fa-phone-arrow-down-left" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-xl-4'>
                                                    <div className={`deviceProvision ${selectDashMod === 4 ? 'active' : ''} row align-items-center w-100`} onClick={() => setSelectDashMod(4)}>
                                                        <div className="itemWrapper d">
                                                            <div className="heading  d-block h-auto">
                                                                <div className="d-flex flex-wrap justify-content-between">
                                                                    <div className="col-9">
                                                                        <h3 style={{ fontWeight: 900 }}>78</h3>
                                                                        <p>Active Calls</p>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <i className="fa-solid fa-phone-volume" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-xl-4'>
                                                    <div className={`deviceProvision ${selectDashMod === 5 ? 'active' : ''} row align-items-center w-100`} onClick={() => setSelectDashMod(5)}>
                                                        <div className="itemWrapper a">
                                                            <div className="heading  d-block h-auto">
                                                                <div className="d-flex flex-wrap justify-content-between">
                                                                    <div className="col-9">
                                                                        <h3 style={{ fontWeight: 900 }}>545</h3>
                                                                        <p>Calls on Queue</p>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <i className="fa-solid fa-clock-rotate-left" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-xl-4'>
                                                    <div className={`deviceProvision ${selectDashMod === 6 ? 'active' : ''} row align-items-center w-100`} onClick={() => setSelectDashMod(3)}>
                                                        <div className="itemWrapper b">
                                                            <div className="heading  d-block h-auto">
                                                                <div className="d-flex flex-wrap justify-content-between">
                                                                    <div className="col-9">
                                                                        <h3 style={{ fontWeight: 900 }}>
                                                                            7 <span style={{ fontSize: 15, fontWeight: 500 }}>seconds</span>
                                                                        </h3>
                                                                        <p>Avg. Response Time</p>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <i className="fa-solid fa-phone-slash" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {selectDashMod != null ? < div className='col-xl-6'>
                                            <form>
                                                <div className="formRow">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Select Page</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            Please select the page where you want to enable the module.
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <select className='formItem'>
                                                            <option>Select Page</option>
                                                            <option disabled style={{ fontWeight: 900 }}><h5>PBX</h5></option>
                                                            <option value='active_call'>Active Calls Page</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="formRow">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Select User</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            Please select the user account which will be able to view
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <select className="formItem">
                                                            <option selected={true}>Testuser</option>
                                                            <option>test test</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                {/* <div className="formRow">
                                                    <button className="panelButton ms-auto" onClick={() => selectDashMod()}>
                                                        <span className="text" >Save</span>
                                                        <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                                                    </button>
                                                </div> */}
                                            </form>
                                        </div> : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main >
        </>
    )
}

export default CustomDashboardManage