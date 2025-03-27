import React from 'react'
import Header from '../../CommonComponents/Header'
import { backToTop } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function SubscriptionManagement() {
    const navigate = useNavigate();
    const accountDetails = useSelector((state) => state.accountDetails);
    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Subscription Management" />
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>
                                                        Subscription Details

                                                    </h4>
                                                    <p>You can check all Subscription Details
                                                    </p>
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
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="profileView px-0">
                                                <div className="profileDetailsHolder p-3 pt-0 shadow-none">
                                                    <div className="header mb-2">Subscription Details</div>
                                                    <div className="row border py-2 rounded-3 management_fomr m-0">
                                                        <div className="formRow col-xl-6">
                                                            <div className="formLabel">
                                                                <label htmlFor="data">Package Name</label>
                                                            </div>
                                                            <div className="col-md-8 col-12">
                                                                <input
                                                                    type="text"
                                                                    className="formItem"
                                                                    value={accountDetails.package.name}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="formRow col-xl-6">
                                                            <div className="formLabel">
                                                                <label htmlFor="data">Package Price</label>
                                                            </div>
                                                            <div className="col-md-8 col-12">
                                                                <input
                                                                    type="text"
                                                                    className="formItem"
                                                                    value={`$${accountDetails.package.offer_price}`}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="formRow col-xl-6">
                                                            <div className="formLabel">
                                                                <label htmlFor="data">Package Type</label>
                                                            </div>
                                                            <div className="col-md-8 col-12">
                                                                <input
                                                                    type="text"
                                                                    className="formItem"
                                                                    value={accountDetails.package.subscription_type}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="formRow col-xl-6">
                                                            <div className="formLabel">
                                                                <label htmlFor="data">Subscription Start</label>
                                                            </div>
                                                            <div className="col-md-8 col-12">
                                                                <input
                                                                    type="text"
                                                                    className="formItem"
                                                                    value={accountDetails?.subscription?.[0].start_date}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="formRow col-xl-6">
                                                            <div className="formLabel">
                                                                <label htmlFor="data">Subscription End</label>
                                                            </div>
                                                            <div className="col-md-8 col-12">
                                                                <input
                                                                    type="text"
                                                                    className="formItem"
                                                                    value={accountDetails?.subscription?.[0].end_date}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="formRow col-xl-6">
                                                            <div className="formLabel">
                                                                <label htmlFor="data">Time of Payment</label>
                                                            </div>
                                                            <div className="col-md-8 col-12">
                                                                <input
                                                                    type="text"
                                                                    className="formItem"
                                                                    value={accountDetails?.payments[0].transaction_date}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-12 my-2">
                                                            <div className='d-flex justify-content-end align-items-center'>
                                                                <button className="panelButton edit" style={{ height: 34 }}>
                                                                    <span className="text">Renew</span>
                                                                    <span className="icon">
                                                                        <i className="fa-solid fa-repeat" />
                                                                    </span>
                                                                </button>
                                                                <button className="panelButton delete me-2" style={{ height: 34 }}>
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
                </section>
            </main>
        </>
    )
}

export default SubscriptionManagement