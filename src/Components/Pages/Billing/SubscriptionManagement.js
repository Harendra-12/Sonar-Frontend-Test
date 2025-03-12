import React from 'react'
import Header from '../../CommonComponents/Header'
import { backToTop } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';

function SubscriptionManagement() {
    const navigate = useNavigate();
    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Subscription Management" />
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>
                                                        Ring Group List
                                                    </h4>
                                                    <p>You can see all list of ring groups</p>
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
                                                        effect="ripple"
                                                        className="panelButton"
                                                        style={{ cursor: "not-allowed" }}
                                                    >
                                                        <span className="text">Add</span>
                                                        <span className="icon">
                                                            <i class="fa-solid fa-plus"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12" style={{ overflow: "auto", padding: "25px 20px 0" }}>
                                            <div className='row'>
                                                <div className='col-6'>
                                                    <div className="profileView px-0">
                                                        <div className="profileDetailsHolder p-0 shadow-none">
                                                            <div className="row" style={{ padding: 5 }}>
                                                                <div className="header">Subscription Details</div>
                                                                <div className="formRow col-xl-12">
                                                                    <div className="formLabel">
                                                                        <label htmlFor="data">Package Name</label>
                                                                    </div>
                                                                    <div className="col-6">
                                                                        <input
                                                                            type="text"
                                                                            className="formItem"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="formRow col-xl-12">
                                                                    <div className="formLabel">
                                                                        <label htmlFor="data">Package Price</label>
                                                                    </div>
                                                                    <div className="col-6">
                                                                        <input
                                                                            type="text"
                                                                            className="formItem"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="formRow col-xl-12">
                                                                    <div className="formLabel">
                                                                        <label htmlFor="data">Package Type</label>
                                                                    </div>
                                                                    <div className="col-6">
                                                                        <input
                                                                            type="text"
                                                                            className="formItem"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="formRow col-xl-12">
                                                                    <div className="formLabel">
                                                                        <label htmlFor="data">Subscription Start</label>
                                                                    </div>
                                                                    <div className="col-6">
                                                                        <input
                                                                            type="text"
                                                                            className="formItem"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="formRow col-xl-12">
                                                                    <div className="formLabel">
                                                                        <label htmlFor="data">Subscription End</label>
                                                                    </div>
                                                                    <div className="col-6">
                                                                        <input
                                                                            type="text"
                                                                            className="formItem"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="formRow col-xl-12">
                                                                    <div className="formLabel">
                                                                        <label htmlFor="data">Time of Payment</label>
                                                                    </div>
                                                                    <div className="col-6">
                                                                        <input
                                                                            type="text"
                                                                            className="formItem"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 mt-2">
                                                                    <div className='row'>
                                                                        <button className="panelButton edit" style={{ height: 34 }}>
                                                                            <span className="text">Renew</span>
                                                                            <span className="icon">
                                                                                <i className="fa-solid fa-repeat" />
                                                                            </span>
                                                                        </button>
                                                                        <button className="panelButton delete ms-auto me-2" style={{ height: 34 }}>
                                                                            <span className="text">Cancel</span>
                                                                            <span className="icon">
                                                                                <i className="fa-solid fa-xmark" />
                                                                            </span>
                                                                        </button>
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
                    </div>
                </section>
            </main>
        </>
    )
}

export default SubscriptionManagement