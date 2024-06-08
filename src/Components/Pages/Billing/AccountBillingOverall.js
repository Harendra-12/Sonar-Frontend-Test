import React from 'react'
import Header from '../../CommonComponents/Header'

function AccountBillingOverall() {
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Billing Overview" />
                        <div className='col-xl-12'>
                            <div className='row'>
                                <div className='col-xl-9'>
                                    <div className='row'>
                                        <div className='col-xl-6'>
                                            <div className='cardWrapper'>

                                            </div>
                                        </div>
                                        <div className='col-xl-3'>
                                            <div class="itemWrapper a">
                                                <div class="heading">
                                                    <i class="fa-duotone fa-phone-office"></i> Last Transaction
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
                                                    <i class="fa-duotone fa-phone-office"></i> Upcoming Transaction
                                                </div>
                                                <div class="data-number">$ 200.<sub style={{ fontSize: 14 }}>00</sub></div>
                                                <div class="label">Date: <span className='float-end'>16-01-2024</span></div>
                                                <div class="label">Package: <span className='float-end'>Basic Package</span></div>
                                                <div class="label">Tenure: <span className='float-end'>Yearly Basis</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-xl-3'>
                                    <div class="itemWrapper c">
                                        <div class="heading">
                                            <i class="fa-duotone fa-phone-office"></i> Invoices
                                        </div>
                                        <ul className='invoiceList'>
                                            <li>
                                                <div className='col-7'>
                                                    <p>March, 01, 2024</p>
                                                    <span>#MS-415646</span>
                                                </div>
                                                <div className='me-2' style={{ width: 55 }}>
                                                    <p>$100</p>
                                                </div>
                                                <div>
                                                    <a><i class="fa-duotone fa-file-pdf me-1"></i> PDF</a>
                                                </div>
                                            </li>
                                        </ul>
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

export default AccountBillingOverall