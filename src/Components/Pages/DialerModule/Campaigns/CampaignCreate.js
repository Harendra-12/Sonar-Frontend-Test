import React, { useState } from 'react'
import Header from '../../../CommonComponents/Header';
import { useNavigate } from 'react-router-dom';
import { backToTop } from '../../../GlobalFunction/globalFunction';

function CampaignCreate() {
    const navigate = useNavigate();
    const [stepSelector, setStepSelector] = useState(2);
    return (
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
                                                <div className='d-flex align-items-center'>
                                                    <div className="formLabel py-0 me-2">
                                                        <label for="selectFormRow">Enabled</label>
                                                    </div>
                                                    <div className="my-auto position-relative mx-1">
                                                        <label className="switch">
                                                            <input
                                                                type="checkbox"
                                                                id="showAllCheck"
                                                            />
                                                            <span className="slider round" />
                                                        </label>
                                                    </div>
                                                </div>
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
                                                    <span className="text">Save</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-floppy-disk"></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12" style={{ padding: '25px 23px' }}>
                                        <div className="row">
                                            <div className="col-xl-2">
                                                <div className='someTempDialerDesign'>
                                                    <ul>
                                                        <li className={stepSelector === 1 && 'active'} onClick={() => setStepSelector(1)}>
                                                            <div className='numberHolder completed'>
                                                                1
                                                            </div>
                                                            <div className='textHolder'>
                                                                <h3>General Settings</h3>
                                                                {/* <div className='description'>
                                                                    <div>
                                                                        Numbers
                                                                    </div>
                                                                    <div>
                                                                        18081818181
                                                                    </div>
                                                                </div> */}
                                                            </div>
                                                        </li>
                                                        <li className={stepSelector === 2 && 'active'} onClick={() => setStepSelector(2)}>
                                                            <div className='numberHolder'>
                                                                2
                                                            </div>
                                                            <div className='textHolder'>
                                                                <h3>Dialer Settings</h3>
                                                            </div>
                                                        </li>
                                                        <li className={stepSelector === 3 && 'active'} onClick={() => setStepSelector(3)}>
                                                            <div className='numberHolder'>
                                                                3
                                                            </div>
                                                            <div className='textHolder'>
                                                                <h3>Agent List</h3>
                                                            </div>
                                                        </li>
                                                        <li className={stepSelector === 4 && 'active'} onClick={() => setStepSelector(4)}>
                                                            <div className='numberHolder'>
                                                                4
                                                            </div>
                                                            <div className='textHolder'>
                                                                <h3>Record List</h3>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            {stepSelector === 1 && <>
                                                <div className="col-xl-7" style={{ borderLeft: '1px solid var(--border-color)', padding: '0 30px' }}>
                                                    <form className="row mb-0">
                                                        <div className="formRow">
                                                            <div className='formLabel'>
                                                                <label>
                                                                    Campaign Name
                                                                </label>
                                                            </div>
                                                            <div className='col-6'>
                                                                <input
                                                                    type="text"
                                                                    className="formItem" />
                                                            </div>
                                                        </div>
                                                        <div className="formRow align-items-start">
                                                            <div className='formLabel'>
                                                                <label>
                                                                    Campaign Description
                                                                </label>
                                                            </div>
                                                            <div className='col-6'>
                                                                <textarea
                                                                    type="text"
                                                                    className="formItem h-auto"
                                                                    rows={3}
                                                                />
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="col-xl-3" style={{ borderLeft: '1px solid var(--border-color)' }}>
                                                    <div
                                                        className="itemWrapper a py-0"
                                                        style={{ backgroundColor: "transparent", boxShadow: 'none' }}
                                                    >
                                                        <div className="heading">
                                                            <div className="col-10">
                                                                <h5>Available DID</h5>
                                                                <p>Select from the available list of DIDs</p>
                                                            </div>
                                                            <div className="col-2" style={{ cursor: "pointer" }}>
                                                                <i
                                                                    className="fa-solid fa-hashtag"
                                                                    style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 5px" }}
                                                                />
                                                            </div>

                                                        </div>
                                                        <div className='col-12 my-2'>
                                                            <div class="searchBox position-relative">
                                                                <input type="text" name="Search" placeholder="Search" class="formItem" value="" />
                                                            </div>
                                                        </div>
                                                        <ul className="invoiceList">
                                                            <li>
                                                                <div className="col-xxl-7 col-xl-6">
                                                                    <p>18882610479</p>
                                                                    <span>Usage - PBX</span>
                                                                </div>
                                                                <div
                                                                    className="tableButton"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <i className="fa-solid fa-check" />{" "}
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="col-xxl-7 col-xl-6">
                                                                    <p>18882610479</p>
                                                                    <span>Usage - PBX</span>
                                                                </div>
                                                                <div
                                                                    className="tableButton edit"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <i className="fa-solid fa-plus" />{" "}
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="col-xxl-7 col-xl-6">
                                                                    <p>18882610479</p>
                                                                    <span>Usage - PBX</span>
                                                                </div>
                                                                <div
                                                                    className="tableButton edit"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <i className="fa-solid fa-plus" />{" "}
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="col-xxl-7 col-xl-6">
                                                                    <p>18882610479</p>
                                                                    <span>Usage - PBX</span>
                                                                </div>
                                                                <div
                                                                    className="tableButton edit"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <i className="fa-solid fa-plus" />{" "}
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="col-xxl-7 col-xl-6">
                                                                    <p>18882610479</p>
                                                                    <span>Usage - PBX</span>
                                                                </div>
                                                                <div
                                                                    className="tableButton edit"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <i className="fa-solid fa-plus" />{" "}
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="col-xxl-7 col-xl-6">
                                                                    <p>18882610479</p>
                                                                    <span>Usage - PBX</span>
                                                                </div>
                                                                <div
                                                                    className="tableButton edit"
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    <i className="fa-solid fa-plus" />{" "}
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </>}
                                            {stepSelector === 2 && <>
                                                <div className='col-xl-9' style={{ borderLeft: '1px solid var(--border-color)', padding: '0 30px' }}>
                                                    <form className="row mb-0">
                                                        <div className="formRow col-xl-3">
                                                            <div className='formLabel'>
                                                                <label className='fw-bold' style={{ fontSize: 'initial' }}>
                                                                    Dialer Type
                                                                </label>
                                                            </div>
                                                            <div className='col-6'>
                                                                <select className='formItem'>
                                                                    <option>Preview</option>
                                                                    <option>Progressive</option>
                                                                    <option>Predictive</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div></div>
                                                        <div className="formRow col-xl-3">
                                                            <div className='formLabel'>
                                                                <label>
                                                                    Preview Time
                                                                </label>
                                                            </div>
                                                            <div className='col-6'>
                                                                <input type='number' className='formItem' />
                                                            </div>
                                                        </div>
                                                        <div className="formRow col-xl-3">
                                                            <div className='formLabel'>
                                                                <label>
                                                                    Wrap Up Time
                                                                </label>
                                                            </div>
                                                            <div className='col-6'>
                                                                <input type='number' className='formItem' />
                                                            </div>
                                                        </div>
                                                        <div className="formRow col-xl-3">
                                                            <div className='formLabel'>
                                                                <label>
                                                                    Max Ring Time
                                                                </label>
                                                            </div>
                                                            <div className='col-6'>
                                                                <input type='number' className='formItem' />
                                                            </div>
                                                        </div>
                                                        <div className="formRow col-xl-3">
                                                            <div className='formLabel'>
                                                                <label>
                                                                    Default Retry Period
                                                                </label>
                                                            </div>
                                                            <div className='col-6'>
                                                                <input type='number' className='formItem' />
                                                            </div>
                                                        </div>
                                                        <div className="formRow col-xl-3">
                                                            <div className='formLabel'>
                                                                <label>
                                                                    Max Attempt Per Record
                                                                </label>
                                                            </div>
                                                            <div className='col-6'>
                                                                <input type='number' className='formItem' />
                                                            </div>
                                                        </div>
                                                    </form>
                                                    <div className='row mt-2 gx-xxl-5'>
                                                        <div className='col-6'>
                                                            <div className="profileView p-0">
                                                                <div
                                                                    className="profileDetailsHolder position-relative px-0"
                                                                    style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
                                                                >
                                                                    <div className="col-xl-12">
                                                                        <div className="header d-flex align-items-center justify-content-between" style={{ height: '35px' }}>
                                                                            <div className="col-5 fw-bold" style={{ fontFamily: 'Noto Sans' }}>System Disposition</div>
                                                                        </div>
                                                                        <div className="col-xl-12 pt-3">
                                                                            <div className='d-flex align-items-center'>
                                                                                <div className="savedCardWrapper col" style={{ height: '47px' }}>
                                                                                    <div>
                                                                                        <label>Busy</label>
                                                                                    </div>
                                                                                    <div style={{ fontSize: '11px', color: 'var(--color-subtext)' }}>
                                                                                        <div>Retry Period: 30 min</div>
                                                                                        <div>Attempts per rec: 3</div>
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{ width: '40px', borderTop: '1px dashed var(--border-color)' }} />
                                                                                <div className="contactTags"><span data-id="0">Retry</span></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-12 pt-3">
                                                                            <div className='d-flex align-items-center'>
                                                                                <div className="savedCardWrapper col" style={{ height: '47px' }}>
                                                                                    <div>
                                                                                        <label>No Answer</label>
                                                                                    </div>
                                                                                    <div style={{ fontSize: '11px', color: 'var(--color-subtext)' }}>
                                                                                        <div>Retry Period: 30 min</div>
                                                                                        <div>Attempts per rec: 3</div>
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{ width: '40px', borderTop: '1px dashed var(--border-color)' }} />
                                                                                <div className="contactTags"><span data-id="0">Retry</span></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-12 pt-3">
                                                                            <div className='d-flex align-items-center'>
                                                                                <div className="savedCardWrapper col" style={{ height: '47px' }}>
                                                                                    <div>
                                                                                        <label>Agent Abandoned</label>
                                                                                    </div>
                                                                                    <div style={{ fontSize: '11px', color: 'var(--color-subtext)' }}>
                                                                                        <div>Retry Period: 30 min</div>
                                                                                        <div>Attempts per rec: 3</div>
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{ width: '40px', borderTop: '1px dashed var(--border-color)' }} />
                                                                                <div className="contactTags"><span data-id="0">Retry</span></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-12 pt-3">
                                                                            <div className='d-flex align-items-center'>
                                                                                <div className="savedCardWrapper col" style={{ height: '47px' }}>
                                                                                    <div>
                                                                                        <label>Hang Up</label>
                                                                                    </div>
                                                                                    <div style={{ fontSize: '11px', color: 'var(--color-subtext)' }}>
                                                                                        <div>Retry Period: 30 min</div>
                                                                                        <div>Attempts per rec: 3</div>
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{ width: '40px', borderTop: '1px dashed var(--border-color)' }} />
                                                                                <div className="contactTags"><span data-id="0">Retry</span></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-12 pt-3">
                                                                            <div className='d-flex align-items-center'>
                                                                                <div className="savedCardWrapper col" style={{ height: '47px' }}>
                                                                                    <div>
                                                                                        <label>Invalid Number</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{ width: '40px', borderTop: '1px dashed var(--border-color)' }} />
                                                                                <div className="contactTags"><span data-id="1">Final</span></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-6'>
                                                            <div className="profileView p-0">
                                                                <div
                                                                    className="profileDetailsHolder position-relative px-0"
                                                                    style={{ backgroundColor: 'transparent', boxShadow: 'none' }}
                                                                >
                                                                    <div className="col-xl-12">
                                                                        <div className="header d-flex align-items-center justify-content-between">
                                                                            <div className="col-5 fw-bold" style={{ fontFamily: 'Noto Sans' }}>Agent Disposition</div>
                                                                            <div className="col-5 text-end">
                                                                                <button className="panelButton m-0 ms-auto">
                                                                                    <span className="text">Add</span>
                                                                                    <span className="icon">
                                                                                        <i className="fa-solid fa-plus" />
                                                                                    </span>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-12 pt-3">
                                                                            <div className='d-flex align-items-center'>
                                                                                <div className="savedCardWrapper col">
                                                                                    <div>
                                                                                        <label>Interested</label>
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="switch">
                                                                                            <input type="checkbox" id="showAllCheck" />
                                                                                            <span className="slider round" />
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{ width: '40px', borderTop: '1px dashed var(--border-color)' }} />
                                                                                <div className="contactTags"><span data-id="1">Final</span></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-12 pt-3">
                                                                            <div className='d-flex align-items-center'>
                                                                                <div className="savedCardWrapper col">
                                                                                    <div>
                                                                                        <label>Not Interested</label>
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="switch">
                                                                                            <input type="checkbox" id="showAllCheck" />
                                                                                            <span className="slider round" />
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{ width: '40px', borderTop: '1px dashed var(--border-color)' }} />
                                                                                <div className="contactTags"><span data-id="1">Final</span></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-12 pt-3">
                                                                            <div className='d-flex align-items-center'>
                                                                                <div className="savedCardWrapper col">
                                                                                    <div>
                                                                                        <label>Demo Booked</label>
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="switch">
                                                                                            <input type="checkbox" id="showAllCheck" />
                                                                                            <span className="slider round" />
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{ width: '40px', borderTop: '1px dashed var(--border-color)' }} />
                                                                                <div className="contactTags"><span data-id="1">Final</span></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-12 pt-3">
                                                                            <div className='d-flex align-items-center'>
                                                                                <div className="savedCardWrapper col">
                                                                                    <div>
                                                                                        <label>Deal Closed</label>
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="switch">
                                                                                            <input type="checkbox" id="showAllCheck" />
                                                                                            <span className="slider round" />
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{ width: '40px', borderTop: '1px dashed var(--border-color)' }} />
                                                                                <div className="contactTags"><span data-id="1">Final</span></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-12 pt-3">
                                                                            <div className='d-flex align-items-center'>
                                                                                <div className="savedCardWrapper col">
                                                                                    <div>
                                                                                        <label>Requires Follow-up</label>
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="switch">
                                                                                            <input type="checkbox" id="showAllCheck" />
                                                                                            <span className="slider round" />
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{ width: '40px', borderTop: '1px dashed var(--border-color)' }} />
                                                                                <div className="contactTags"><span data-id="1">Final</span></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-12 pt-3">
                                                                            <div className='d-flex align-items-center'>
                                                                                <div className="savedCardWrapper col">
                                                                                    <div>
                                                                                        <label>Incorrect Number</label>
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="switch">
                                                                                            <input type="checkbox" id="showAllCheck" />
                                                                                            <span className="slider round" />
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{ width: '40px', borderTop: '1px dashed var(--border-color)' }} />
                                                                                <div className="contactTags"><span data-id="1">Final</span></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-xl-12 pt-3">
                                                                            <div className='d-flex align-items-center'>
                                                                                <div className="savedCardWrapper col">
                                                                                    <div>
                                                                                        <label>Left Voicemail</label>
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="switch">
                                                                                            <input type="checkbox" id="showAllCheck" />
                                                                                            <span className="slider round" />
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                                <div style={{ width: '40px', borderTop: '1px dashed var(--border-color)' }} />
                                                                                <div className="contactTags"><span data-id="1">Final</span></div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>}
                                            {stepSelector === 3 && <>
                                                <div className='col-xl-9' style={{ borderLeft: '1px solid var(--border-color)', padding: '0 30px' }}>
                                                    <div
                                                        className="itemWrapper a py-0"
                                                        style={{ backgroundColor: "transparent", boxShadow: 'none' }}
                                                    >
                                                        <div className="heading">
                                                            <div className="col-10">
                                                                <h5>Available Agents</h5>
                                                                <p>Select from the available list of agents</p>
                                                            </div>
                                                            <div className="col-2" style={{ cursor: "pointer" }}>
                                                                <i
                                                                    className="fa-solid fa-user"
                                                                    style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 5px" }}
                                                                />
                                                            </div>

                                                        </div>
                                                        <div className='col-12 my-2'>
                                                            <div class="searchBox position-relative">
                                                                <input type="text" name="Search" placeholder="Search" class="formItem" value="" />
                                                            </div>
                                                        </div>
                                                        <div className='mainContentApp m-0 bg-transparent mt-3'>
                                                            <div className="callListItem">
                                                                <div className="row justify-content-between">
                                                                    <div className="col-xl-7 col-xxl-6 d-flex ps-0">
                                                                        <div className="profileHolder">
                                                                            <i className="fa-light fa-user fs-5" />
                                                                        </div>
                                                                        <div className="my-auto ms-2 ms-xl-3 text-start">
                                                                            <h4>agent name</h4>
                                                                            <h5 className="mt-2">1000</h5>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-10 col-xl-4 col-xxl-5">
                                                                        <div className="contactTags">
                                                                            <span data-id={2}>Agent</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-auto text-end d-flex justify-content-center align-items-center">
                                                                        <div class="tableButton edit" ><i class="fa-solid fa-plus"></i> </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="callListItem">
                                                                <div className="row justify-content-between">
                                                                    <div className="col-xl-7 col-xxl-6 d-flex ps-0">
                                                                        <div className="profileHolder">
                                                                            <i className="fa-light fa-user fs-5" />
                                                                        </div>
                                                                        <div className="my-auto ms-2 ms-xl-3 text-start">
                                                                            <h4>agent name</h4>
                                                                            <h5 className="mt-2">1000</h5>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-10 col-xl-4 col-xxl-5">
                                                                        <div className="contactTags">
                                                                            <span data-id={2}>Agent</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-auto text-end d-flex justify-content-center align-items-center">
                                                                        <div class="tableButton edit" ><i class="fa-solid fa-plus"></i> </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="callListItem">
                                                                <div className="row justify-content-between">
                                                                    <div className="col-xl-7 col-xxl-6 d-flex ps-0">
                                                                        <div className="profileHolder">
                                                                            <i className="fa-light fa-user fs-5" />
                                                                        </div>
                                                                        <div className="my-auto ms-2 ms-xl-3 text-start">
                                                                            <h4>agent name</h4>
                                                                            <h5 className="mt-2">1000</h5>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-10 col-xl-4 col-xxl-5">
                                                                        <div className="contactTags">
                                                                            <span data-id={2}>Agent</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-auto text-end d-flex justify-content-center align-items-center">
                                                                        <div class="tableButton edit" ><i class="fa-solid fa-plus"></i> </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="callListItem">
                                                                <div className="row justify-content-between">
                                                                    <div className="col-xl-7 col-xxl-6 d-flex ps-0">
                                                                        <div className="profileHolder">
                                                                            <i className="fa-light fa-user fs-5" />
                                                                        </div>
                                                                        <div className="my-auto ms-2 ms-xl-3 text-start">
                                                                            <h4>agent name</h4>
                                                                            <h5 className="mt-2">1000</h5>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-10 col-xl-4 col-xxl-5">
                                                                        <div className="contactTags">
                                                                            <span data-id={0}>Manager</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-auto text-end d-flex justify-content-center align-items-center">
                                                                        <div class="tableButton edit" ><i class="fa-solid fa-plus"></i> </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>}
                                            {stepSelector === 4 && <>
                                                <div className='col-xl-9' style={{ borderLeft: '1px solid var(--border-color)', padding: '0 30px' }}>
                                                    <div className="popup music position-static bg-transparent w-auto h-auto">
                                                        <div className="container h-100">
                                                            <div className="row h-100 justify-content-center align-items-center">
                                                                <div className="card px-0 col-xl-5 shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                                                                    <div className="header">
                                                                        <h5 className="card-title fs14 border-bootm fw700">
                                                                            Upload Documents
                                                                        </h5>
                                                                    </div>
                                                                    <div className="card-body">
                                                                        <div className="popup-border text-center p-2">
                                                                            <input
                                                                                type="file"
                                                                                className="form-control-file d-none"
                                                                                id="fileInput"
                                                                                accept="audio/mp3"
                                                                            />
                                                                            <label htmlFor="fileInput" className="d-block">
                                                                                <div className="test-user text-center">
                                                                                    <i
                                                                                        className="fa-solid fa-cloud-arrow-up"
                                                                                        style={{ fontSize: 30 }}
                                                                                    />
                                                                                    <p className="mb-0 mt-2 text-center">
                                                                                        Drag and Drop or <span>Click on upload</span>
                                                                                    </p>
                                                                                    <span>Supports formats : MP3, Max Size: 2MB</span>
                                                                                </div>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default CampaignCreate