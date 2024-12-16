import React from 'react'
import Header from '../../../CommonComponents/Header'
import PaginationComponent from '../../../CommonComponents/PaginationComponent'
import { useNavigate } from 'react-router-dom';
import { backToTop } from '../../../GlobalFunction/globalFunction';

function LeadEdit() {
    const navigate = useNavigate();
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Lead Manage" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Lead Manage</h4>
                                                <p>Manage the config of the lead</p>
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
                                        <form className="row mb-0">
                                            <div className="formRow col-xl-3">
                                                <div className='formLabel'>
                                                    <label>
                                                        List Name
                                                    </label>
                                                </div>
                                                <div className='col-6'>
                                                    <input
                                                        type="text"
                                                        className="formItem" />
                                                </div>
                                            </div>

                                            <div className="formRow col-xl-3">
                                                <div className='formLabel'>
                                                    <label>
                                                        List Description
                                                    </label>
                                                </div>
                                                <div className='col-6'>
                                                    <input
                                                        type="text"
                                                        className="formItem" />
                                                </div>
                                            </div>

                                            <div className="formRow col-xl-3">
                                                <div className='formLabel'>
                                                    <label>
                                                        Expiration Date
                                                    </label>
                                                </div>
                                                <div className='col-6'>
                                                    <input
                                                        type="date"
                                                        className="formItem" />
                                                </div>
                                            </div>
                                            <div className="formRow col-xl-3">
                                                <div className='formLabel'>
                                                    <label>
                                                        CID Override
                                                    </label>
                                                </div>
                                                <div className='col-6'>
                                                    <input
                                                        type="text"
                                                        className="formItem" />
                                                </div>
                                            </div>
                                            <div className="formRow col-xl-3">
                                                <div className='formLabel'>
                                                    <label>
                                                        Reset Time
                                                    </label>
                                                </div>
                                                <div className='col-6'>
                                                    <input
                                                        type="text"
                                                        className="formItem" />
                                                </div>
                                            </div>
                                            <div className="formRow col-xl-3">
                                                <div className='formLabel'>
                                                    <label>
                                                        Campaign
                                                    </label>
                                                </div>
                                                <div className='col-6'>
                                                    <select
                                                        name=""
                                                        id=""
                                                        className="formItem "
                                                    >
                                                        <option value="">10000-esee</option>
                                                        <option value="">10000-esee</option>
                                                        <option value="">10000-esee</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="formRow col-xl-3">
                                                <div className='formLabel'>
                                                    <label>
                                                        Webform Override
                                                    </label>
                                                </div>
                                                <div className='col-6'>
                                                    <input
                                                        type="text"
                                                        className="formItem" />
                                                </div>
                                            </div>

                                            <div className="formRow col-xl-3">
                                                <div className='formLabel'>
                                                    <label>
                                                        Answering Machine Audio Override
                                                    </label>
                                                </div>
                                                <div className='col-6'>
                                                    <select
                                                        name=""
                                                        id=""
                                                        className="formItem "
                                                    >
                                                        <option value=""></option>

                                                    </select>
                                                </div>
                                            </div>
                                            <div className="formRow col-xl-3">
                                                <div className='formLabel'>
                                                    <label>
                                                        Last Reset Time
                                                    </label>
                                                </div>
                                                <div className='col-6'>
                                                    <input
                                                        type="date"
                                                        className="formItem" />
                                                </div>
                                            </div>
                                            <div className="formRow col-xl-3">
                                                <div className='formLabel'>
                                                    <label>
                                                        Reset List
                                                    </label>
                                                </div>
                                                <div className='col-6'>
                                                    <button className='panelButton ms-0'>
                                                        <span className="text">Reset</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-rotate"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main >
    )
}

export default LeadEdit