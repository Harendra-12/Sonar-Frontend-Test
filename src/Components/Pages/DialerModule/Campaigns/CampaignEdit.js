import React from 'react'
import Header from '../../../CommonComponents/Header';
import { backToTop } from '../../../GlobalFunction/globalFunction';

function CampaignEdit() {
    const navigate = useNavigate();
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
                                        <form className="row mb-0">
                                            <div className="formRow col-xl-3">
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

                                            <div className="formRow col-xl-3">
                                                <div className='formLabel'>
                                                    <label>
                                                        Dialing Mode
                                                    </label>
                                                </div>
                                                <div className='col-6'>
                                                    <select
                                                        name=""
                                                        id=""
                                                        className="formItem "
                                                    >
                                                        <option value="">Broadcast</option>
                                                        <option value="">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="formRow col-xl-3">
                                                <div className='formLabel'>
                                                    <label>
                                                        Select Callee
                                                    </label>
                                                </div>
                                                <div className='col-3 ms-auto pe-2'>
                                                    <div className="formLabel"><label>Type</label></div>
                                                    <select
                                                        name=""
                                                        id=""
                                                        className="formItem "
                                                    >
                                                        <option value="">Agent</option>
                                                        <option value="">Ringgroup</option>
                                                        <option value="">Queue</option>
                                                    </select>
                                                </div>
                                                <div className='col-3'>
                                                    <div className="formLabel"><label>Extension</label></div>
                                                    <select
                                                        name=""
                                                        id=""
                                                        className="formItem "
                                                    >
                                                        <option value="">1001</option>
                                                        <option value="">1002</option>
                                                        <option value="">1003</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="formRow col-xl-3">
                                                <div className='formLabel'>
                                                    <label>
                                                        Select DID
                                                    </label>
                                                </div>
                                                <div className='col-6'>
                                                    <select
                                                        name=""
                                                        id=""
                                                        className="formItem "
                                                    >
                                                        <option value="">1001</option>
                                                        <option value="">1002</option>
                                                        <option value="">1003</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="formRow col-xl-3">
                                                <div className='formLabel'>
                                                    <label>
                                                        No. of Tries
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
                                                        Schedule Time
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
                                                        Select CSV
                                                    </label>
                                                </div>
                                                <div className='col-6'>
                                                    <input
                                                        type="file"
                                                        className="formItem" />
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
        </main>
    )
}

export default CampaignEdit