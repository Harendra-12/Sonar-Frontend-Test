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
                                        <div className="col-12 formScroller my-2" >
                                            <form className='col-12'>
                                                <div className='row'>
                                                    <div className='col-lg-6 col-sm-12'>
                                                        <div className="formRow col-xl-12">
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
                                                    </div>
                                                    <div className='col-lg-6 col-sm-12'>
                                                        <div className="formRow col-xl-12">
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
                                                    </div>
                                                    <div className='col-lg-6 col-sm-12'>
                                                        <div className="formRow col-xl-12">
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
                                                    </div>
                                                    <div className='col-lg-6 col-sm-12'>
                                                        <div className="formRow col-xl-12">
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
                                                    </div>
                                                    <div className='col-lg-6 col-sm-12'>
                                                        <div className="formRow col-xl-12">
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
                                                    </div>
                                                    <div className='col-lg-6 col-sm-12'>
                                                        <div className="formRow col-xl-12">
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
                                                    </div>
                                                    <div className='col-12'>
                                                        <div className="formRow col-xl-12 ">
                                                            <div className='d-flex justify-content-between align-items-center w-100'>
                                                                <button className="panelButton edit mx-0" style={{ height: 34 }}>
                                                                    <span className="text">Renew</span>
                                                                    <span className="icon">
                                                                        <i className="fa-solid fa-repeat" />
                                                                    </span>
                                                                </button>
                                                                <button className="panelButton delete mx-0 ms-3" style={{ height: 34 }}>
                                                                    <span className="text">Cancel</span>
                                                                    <span className="icon">
                                                                        <i className="fa-solid fa-xmark" />
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </div>
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
        </>
    )
}

export default SubscriptionManagement