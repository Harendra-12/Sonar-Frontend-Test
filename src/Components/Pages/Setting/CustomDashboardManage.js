import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { backToTop } from '../../GlobalFunction/globalFunction';
import Header from '../../CommonComponents/Header';

function CustomDashboardManage() {
    const navigate = useNavigate();
    const [selectDashMod, setSelectDashMod] = useState(1);
    const [addNewMod, setAddNewMod] = useState(false);

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
                                                {/* <button effect="ripple" className="panelButton" onClick={() => setSelectDashMod()}>
                                                    <span className="text" >Save</span>
                                                    <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                                                </button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12" style={{ padding: '25px 23px' }}>
                                    <div className='row gx-5'>
                                        <div className='col-xl-6' style={{ borderRight: '1px solid var(--border-color)' }}>
                                            <div className='row gy-4'>
                                                <div className='col-xl-4'>
                                                    <div className={`deviceProvision ${selectDashMod === 1 ? 'active' : ''}`} onClick={() => { setSelectDashMod(1); setAddNewMod(false) }}>
                                                        <div className="itemWrapper a">
                                                            <div className="heading h-auto d-block">
                                                                <h5>Some Dummy Group</h5>
                                                                <p>Ring Group</p>
                                                            </div>
                                                            <div className="data-number2 h-auto">
                                                                <div className="d-flex flex-wrap justify-content-between">
                                                                    <div className="col-4">
                                                                        <p>Active</p>
                                                                        <h4>
                                                                            28{" "}
                                                                            <i
                                                                                className="fa-solid fa-phone-volume ms-1"
                                                                                style={{ color: "var(--funky-boy4)", fontSize: 17 }}
                                                                            />
                                                                        </h4>
                                                                    </div>
                                                                    <div className="col-4 text-center">
                                                                        <p>Ringing</p>
                                                                        <h4>
                                                                            82{" "}
                                                                            <i
                                                                                className="fa-solid fa-phone-office ms-1"
                                                                                style={{ color: "rgb(1, 199, 142)", fontSize: 17 }}
                                                                            />
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-xl-4'>
                                                    <div className={`deviceProvision ${selectDashMod === 2 ? 'active' : ''}`} onClick={() => { setSelectDashMod(2); setAddNewMod(false) }}>
                                                        <div className="itemWrapper a">
                                                            <div className="heading h-auto d-block">
                                                                <h5>Some Dummy Queue</h5>
                                                                <p>Queue Name</p>
                                                            </div>
                                                            <div className="data-number2 h-auto">
                                                                <div className="d-flex flex-wrap justify-content-between">
                                                                    <div className="col-4">
                                                                        <p>Active</p>
                                                                        <h4>
                                                                            28{" "}
                                                                            <i
                                                                                className="fa-solid fa-phone-volume ms-1"
                                                                                style={{ color: "var(--funky-boy4)", fontSize: 17 }}
                                                                            />
                                                                        </h4>
                                                                    </div>
                                                                    <div className="col-4 text-center">
                                                                        <p>Ringing</p>
                                                                        <h4>
                                                                            82{" "}
                                                                            <i
                                                                                className="fa-solid fa-phone-office ms-1"
                                                                                style={{ color: "rgb(1, 199, 142)", fontSize: 17 }}
                                                                            />
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-xl-4'>
                                                    <div className={`deviceProvision ${selectDashMod === 3 ? 'active' : ''}`} onClick={() => { setSelectDashMod(3); setAddNewMod(false) }}>
                                                        <div className="itemWrapper a">
                                                            <div className="heading h-auto d-block">
                                                                <h5>19009009009</h5>
                                                                <p>DID</p>
                                                            </div>
                                                            <div className="data-number2 h-auto">
                                                                <div className="d-flex flex-wrap justify-content-between">
                                                                    <div className="col-4">
                                                                        <p>Active</p>
                                                                        <h4>
                                                                            28{" "}
                                                                            <i
                                                                                className="fa-solid fa-phone-volume ms-1"
                                                                                style={{ color: "var(--funky-boy4)", fontSize: 17 }}
                                                                            />
                                                                        </h4>
                                                                    </div>
                                                                    <div className="col-4 text-center">
                                                                        <p>Ringing</p>
                                                                        <h4>
                                                                            82{" "}
                                                                            <i
                                                                                className="fa-solid fa-phone-office ms-1"
                                                                                style={{ color: "rgb(1, 199, 142)", fontSize: 17 }}
                                                                            />
                                                                        </h4>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-xl-4'>
                                                    <div className={`deviceProvision ${addNewMod ? 'active' : ''}`} onClick={() => { setSelectDashMod(); setAddNewMod(true) }}>
                                                        <div className="itemWrapper a addNew">
                                                            <i className='fa-regular fa-plus'></i>
                                                            <p>Add New Module</p>
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
                                                <div className="formRow">
                                                    <button className="panelButton ms-auto" onClick={() => selectDashMod()}>
                                                        <span className="text" >Save</span>
                                                        <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                                                    </button>
                                                </div>
                                            </form>
                                        </div> : addNewMod ? <div className='col-xl-6'>
                                            <form>
                                                <div className="formRow">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Select Feature to Display</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            Please select the feature you want to display in the module.
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className='row'>
                                                            <div className='col-6 pe-2'>
                                                                <select className='formItem'>
                                                                    <option>Select Feature</option>
                                                                    <option value='ring_group'>Ring Group</option>
                                                                    <option value='call_center'>Call Queue</option>
                                                                    <option value='did'>DID</option>
                                                                </select>
                                                            </div>
                                                            <div className='col-6'>
                                                                <select className='formItem'>
                                                                    <option value='0'>Ring Group Name - Ext.</option>
                                                                    <option value='1'>Ring Group Name - Ext.</option>
                                                                    <option value='2'>Ring Group Name - Ext.</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="formRow">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Select Info</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            Please select the info of the feature you want to display in the module.
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className='row'>
                                                            <div className='col-6'>
                                                                <div className='formLabel'>
                                                                    <label>First Column</label>
                                                                </div>
                                                                <select className="formItem">
                                                                    <option>Active Calls</option>
                                                                    <option>Ringing Calls</option>
                                                                    <option>Missed Calls</option>
                                                                    <option>Total Calls</option>
                                                                </select>
                                                            </div>
                                                            <div className='col-6'>
                                                                <div className='formLabel'>
                                                                    <label>Second Column</label>
                                                                </div>
                                                                <select className="formItem">
                                                                    <option>Active Calls</option>
                                                                    <option>Ringing Calls</option>
                                                                    <option>Missed Calls</option>
                                                                    <option>Total Calls</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="formRow">
                                                    <button className="panelButton ms-auto" onClick={() => setAddNewMod(false)}>
                                                        <span className="text" >Save</span>
                                                        <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                                                    </button>
                                                </div>
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