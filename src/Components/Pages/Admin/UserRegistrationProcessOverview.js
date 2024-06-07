import React from 'react'
import Header from '../../CommonComponents/Header'

function UserRegistrationProcessOverview() {
    return (
        <>
            <style>
                {`
                .formRow{
                    border: none;
                }
                .formItem{
                    margin: 0px 5px 0px 0px;
                    color: #000;
                }
                .formLabel{
                    padding: 0px 0px 5px;
                }
            `}
            </style>
            <div className="mainContent">
                <div className="col-12">
                    <Header title="New User Details" />
                    <div class="d-flex flex-wrap">
                        <div className="col-xl-12">
                            <div className="profileView mt-3">
                                <div className="profileDetailsHolder position-relative">
                                    <div class="baseDetails row align-items-center mt-3" style={{ padding: '30px 10px 55px' }}>
                                        <div className='col-xl-8 px-0 mx-auto position-relative'>
                                            <div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                                                <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" style={{ width: '50%' }}></div>
                                            </div>
                                            <div className='progressStepWrapper'>
                                                <div className='stepWrapper col-3 success'>
                                                    <div class="step">
                                                        <i class="fa-solid fa-thumbs-up"></i>
                                                    </div>
                                                    <label>Accounts</label>
                                                </div>
                                                <div className='stepWrapper col-3 success'>
                                                    <div class="step">
                                                        <i class="fa-sharp fa-solid fa-credit-card"></i>
                                                    </div>
                                                    <label>Payment</label>
                                                </div>
                                                <div className='stepWrapper col-3'>
                                                    <div class="step ">
                                                        <i class="fa-sharp fa-solid fa-file"></i>
                                                    </div>
                                                    <label>Documents</label>
                                                </div>
                                                <div className='stepWrapper col-3'>
                                                    <div class="step" style={{ cursor: 'pointer' }}>
                                                        <i class="fa-sharp fa-solid fa-file-invoice"></i>
                                                    </div>
                                                    <label>Download Invoice</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-12">
                            <div className="profileView mt-3">
                                <div className="profileDetailsHolder position-relative">
                                    <div className="header d-flex align-items-center">
                                        <div className="col-5">Account Details</div>
                                    </div>
                                    <div className="row px-2 pb-2 border-bottom">
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Company Name</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Admin Name</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Admin Email</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Phone Number</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Alternate Number</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Timezone</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Block/Unit/Place</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Building</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">City</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Zip Code</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">State</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Country</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="header d-flex align-items-center mt-2">
                                        <div className="col-5">Billing Details</div>
                                    </div>
                                    <div className="row px-2 pb-2 border-bottom">
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Full Name</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Email</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Phone Number</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Block/Unit/Place</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Building</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">City</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Zip Code</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">State</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Country</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="header d-flex align-items-center mt-2">
                                        <div className="col-5">Package Details</div>
                                    </div>
                                    <div className="row px-2 pb-2 border-bottom">
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Package Name</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Package Price</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Package Type</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="header d-flex align-items-center mt-2">
                                        <div className="col-5">Pricing Details</div>
                                    </div>
                                    <div className="row px-2 pb-2 border-bottom">
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Amount Paid</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Time of Payment</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Package Chosen</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Payment Status</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-2 col-md-4 col-6">
                                            <div className="formLabel">
                                                <label htmlFor="data">Transaction Id</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value="test"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserRegistrationProcessOverview