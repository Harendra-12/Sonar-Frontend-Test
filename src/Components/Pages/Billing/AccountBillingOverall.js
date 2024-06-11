import React from 'react'
import Header from '../../CommonComponents/Header'

function AccountBillingOverall() {
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Payment Details" />
                        <div className='col-xl-12 pt-3'>
                            <div className='row gy-3'>
                                <div className='col-xl-9'>
                                    <div className='row gy-3'>
                                        <div className='col-xl-6'>
                                            <div className='cardWrapper row align-items-center col-12 mx-auto'>
                                                <div className='col-12'>
                                                    <h5>9999 9999 9999 9999</h5>
                                                </div>
                                                <div className='col-5'>
                                                    <label>Card Holder Name</label>
                                                    <p>John Doe</p>
                                                </div>
                                                <div className='col-5'>
                                                    <label>Expiry Date</label>
                                                    <p>11/29</p>
                                                </div>
                                                <div className='col-2 text-end'>
                                                    <div className='imgWrapper'>
                                                        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/200px-Mastercard_2019_logo.svg.png' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-3'>
                                            <div class="itemWrapper a">
                                                <div class="heading">
                                                    <i class="fa-duotone fa-ballot-check"></i> Last Transaction
                                                </div>
                                                <div class="data-number">$ 200.<sub style={{ fontSize: 14 }}>00</sub></div>
                                                <div class="label">Date: <span className='float-end'>16-01-2023</span></div>
                                                <div class="label">Package: <span className='float-end'>Basic Package</span></div>
                                                <div class="label">Tenure: <span className='float-end'>Yearly Basis</span></div>
                                            </div>
                                        </div>
                                        <div className='col-xl-3'>
                                            <div class="itemWrapper b">
                                                <div class="heading">
                                                    <i class="fa-duotone fa-ballot"></i> Upcoming Transaction
                                                </div>
                                                <div class="data-number">$ 200.<sub style={{ fontSize: 14 }}>00</sub></div>
                                                <div class="label">Date: <span className='float-end'>16-01-2024</span></div>
                                                <div class="label">Package: <span className='float-end'>Basic Package</span></div>
                                                <div class="label">Tenure: <span className='float-end'>Yearly Basis</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row pt-2'>
                                        <div className='profileView pb-0'>
                                            <div className='profileDetailsHolder position-relative'>
                                                <div className='col-xl-12'>
                                                    <div class="header d-flex align-items-center justify-content-between">
                                                        <div class="col-5">Payment Method</div>
                                                        <div class="col-5 text-end"><button className='panelButton m-0'><i class="fa-regular fa-plus"></i> Add a Card</button></div>
                                                    </div>
                                                    <div className='row px-2 pt-2 gy-3'>
                                                        <div className='col-xl-6'>
                                                            <div className='savedCardWrapper active'>
                                                                <div className='imgWrapper'>
                                                                    <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/200px-Mastercard_2019_logo.svg.png' />
                                                                </div>
                                                                <div className='ms-4'>
                                                                    <label>**** **** **** 9999</label>
                                                                </div>
                                                                <div className='ms-auto'>
                                                                    <label class="switch"><input type="checkbox" id="showAllCheck" defaultChecked={true} /><span class="slider round"></span></label>
                                                                </div>
                                                                <div className='ms-3'>
                                                                    <button className='clearButton'><i class="fa-duotone fa-pen"></i></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-xl-6'>
                                                            <div className='savedCardWrapper'>
                                                                <div className='imgWrapper'>
                                                                    <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Visa_2021.svg/220px-Visa_2021.svg.png' />
                                                                </div>
                                                                <div className='ms-4'>
                                                                    <label>**** **** **** 8082</label>
                                                                </div>
                                                                <div className='ms-auto'>
                                                                    <label class="switch"><input type="checkbox" id="showAllCheck" defaultChecked={false} /><span class="slider round"></span></label>
                                                                </div>
                                                                <div className='ms-3'>
                                                                    <button className='clearButton'><i class="fa-duotone fa-pen"></i></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-xl-3'>
                                    <div class="itemWrapper c h-100">
                                        <div class="heading">
                                            <i class="fa-duotone fa-file-invoice"></i> Invoices
                                        </div>
                                        <ul className='invoiceList'>
                                            <li>
                                                <div className='col-7'>
                                                    <p>March 01, 2024</p>
                                                    <span>#MS-415646</span>
                                                </div>
                                                <div className='me-2' style={{ width: 55 }}>
                                                    <p>$100</p>
                                                </div>
                                                <div>
                                                    <a><i class="fa-duotone fa-files me-1"></i> PDF</a>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='col-7'>
                                                    <p>March 02, 2024</p>
                                                    <span>#MS-415646</span>
                                                </div>
                                                <div className='me-2' style={{ width: 55 }}>
                                                    <p>$100</p>
                                                </div>
                                                <div>
                                                    <a><i class="fa-duotone fa-files me-1"></i> PDF</a>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='col-7'>
                                                    <p>March 03, 2024</p>
                                                    <span>#MS-415646</span>
                                                </div>
                                                <div className='me-2' style={{ width: 55 }}>
                                                    <p>$100</p>
                                                </div>
                                                <div>
                                                    <a><i class="fa-duotone fa-files me-1"></i> PDF</a>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='col-7'>
                                                    <p>March 04, 2024</p>
                                                    <span>#MS-415646</span>
                                                </div>
                                                <div className='me-2' style={{ width: 55 }}>
                                                    <p>$100</p>
                                                </div>
                                                <div>
                                                    <a><i class="fa-duotone fa-files me-1"></i> PDF</a>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='col-7'>
                                                    <p>March 05, 2024</p>
                                                    <span>#MS-415646</span>
                                                </div>
                                                <div className='me-2' style={{ width: 55 }}>
                                                    <p>$100</p>
                                                </div>
                                                <div>
                                                    <a><i class="fa-duotone fa-files me-1"></i> PDF</a>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='col-7'>
                                                    <p>March 06, 2024</p>
                                                    <span>#MS-415646</span>
                                                </div>
                                                <div className='me-2' style={{ width: 55 }}>
                                                    <p>$100</p>
                                                </div>
                                                <div>
                                                    <a><i class="fa-duotone fa-files me-1"></i> PDF</a>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className='row gy-3 pt-2'>
                                <div className='col-xl-6'>
                                    <div className='profileView px-0'>
                                        <div className='profileDetailsHolder position-relative'>
                                            <div className='col-xl-12'>
                                                <div class="header d-flex align-items-center justify-content-between">
                                                    <div class="col-5">Billing Information</div>
                                                </div>
                                                <div className='row px-2 pt-2 gy-3'>
                                                    <div className='col-9'>
                                                        <ul>
                                                            <li>Company Name: </li>
                                                        </ul>
                                                    </div>
                                                    <div className='col-3'>

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
        </main >
    )
}

export default AccountBillingOverall