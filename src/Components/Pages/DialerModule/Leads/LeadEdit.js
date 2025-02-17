import React from 'react'
import Header from '../../../CommonComponents/Header'
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
                                                <h4>Lead Edit</h4>
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
                                                        First Name
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
                                                        Last Name
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
                                                        Phone Number
                                                    </label>
                                                </div>
                                                <div className='col-6'>
                                                    <input
                                                        type="number"
                                                        className="formItem" />
                                                </div>
                                            </div>

                                            <div className="formRow col-xl-3">
                                                <div className='formLabel'>
                                                    <label>
                                                        Address 1
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
                                                        Address 2
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
                                                        City
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
                                                        State
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
                                                        Country
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
                                                        Zip Code
                                                    </label>
                                                </div>
                                                <div className='col-6'>
                                                    <input
                                                        type="number"
                                                        className="formItem" />
                                                </div>
                                            </div>
                                            <div className="formRow col-xl-3">
                                                <div className='formLabel'>
                                                    <label>
                                                        Gender
                                                    </label>
                                                </div>
                                                <div className='col-6'>
                                                    <select
                                                        name=""
                                                        id=""
                                                        className="formItem "
                                                    >
                                                        <option value="">Male</option>
                                                        <option value="">Female</option>
                                                        <option value="">Other</option>
                                                    </select>
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