import React from 'react'
import Header from '../../../../CommonComponents/Header'
import CountryComplianceHeader from './CountryComplianceHeader'
import { useLocation } from 'react-router-dom'

function AlgeriaCompliance() {
    const locationState = useLocation();

    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Number Management" />
                    </div>
                </div>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className="overviewTableWrapper0 px-0">
                            <div className="overviewTableChild0">
                                <div className="d-flex flex-wrap">
                                    <CountryComplianceHeader item={locationState.state.item} />
                                    <div className="col-xxl-8 col-12 mx-auto compliancesBox mt-5">
                                        <div className="basicContent my-0">
                                            <div className='heading'>
                                                Locale Summary
                                            </div>
                                            <ul>
                                                <li>
                                                    <div className='row'>
                                                        <div className='col-6'>
                                                            <p><b>Locale name</b></p>
                                                        </div>
                                                        <div className='col-6'>
                                                            <p>{locationState.state.item.country}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className='row'>
                                                        <div className='col-6'>
                                                            <p><b>ISO code</b></p>
                                                            <p>The International Organization for Standardization two character representation for the given locale.</p>
                                                        </div>
                                                        <div className='col-6'>
                                                            <p>{locationState.state.item.country_code}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className='row'>
                                                        <div className='col-6'>
                                                            <p><b>Region</b></p>
                                                        </div>
                                                        <div className='col-6'>
                                                            <p>Middle East & Africa</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-xxl-8 col-12 mx-auto compliancesBox">
                                        <div className="basicContent my-0">
                                            <div className='heading'>
                                                Numbers Summary
                                            </div>
                                            <ul>
                                                <li>
                                                    <div className='row'>
                                                        <div className='col-6'>
                                                            <p><b>National Prefixes</b></p>
                                                        </div>
                                                        <div className='col-6'>
                                                            <p>+21398</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-xxl-8 col-12 mx-auto compliancesBox">
                                        <div className="basicContent my-0">
                                            <h4>Requirements for Individuals</h4>
                                            <ul>
                                                <li className='listingLi'>
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <div className='heading'>
                                                                Information required
                                                            </div>
                                                        </div>
                                                        <div className='col-4'>
                                                            <div className='heading'>
                                                                Documentation required
                                                            </div>
                                                        </div>
                                                        <div className='col-4'>
                                                            <div className='heading'>
                                                                Acceptable Documentation
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p><b>End-user Name</b></p>
                                                        </div>
                                                        <div className='col-4'>
                                                            <p>Proof of Identity</p>
                                                        </div>
                                                        <div className='col-4'>
                                                            <p>End-user’s passport or any other form of ID</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p><b>End-user Address</b></p>
                                                        </div>
                                                        <div className='col-4'>
                                                            <p>No documentation required*</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p><b>Service Usage Description</b></p>
                                                        </div>
                                                        <div className='col-4'>
                                                            <p>No documentation required*</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className='compDetails'>
                                                <p>
                                                    Service usage must be in accordance with National and International regulations. In particular, numbers must not be used to display, send or transmit prohibited content.
                                                </p>
                                                <p>
                                                    Numbers cannot be disclosed on the Internet or in any public advertising.
                                                </p>
                                                <p>
                                                    Callback services are not allowed.
                                                </p>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-8 col-12 mx-auto compliancesBox">
                                        <div className="basicContent my-0">
                                            <h4>Requirements for Businesses</h4>
                                            <ul>
                                                <li className='listingLi'>
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <div className='heading'>
                                                                Information required
                                                            </div>
                                                        </div>
                                                        <div className='col-4'>
                                                            <div className='heading'>
                                                                Documentation required
                                                            </div>
                                                        </div>
                                                        <div className='col-4'>
                                                            <div className='heading'>
                                                                Acceptable Documentation
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p><b>End-user Name</b></p>
                                                        </div>
                                                        <div className='col-4'>
                                                            <p>Proof of Identity</p>
                                                        </div>
                                                        <div className='col-4'>
                                                            <p>End-user’s passport or any other form of ID</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p><b>End-user Address</b></p>
                                                        </div>
                                                        <div className='col-4'>
                                                            <p>No documentation required*</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p><b>Business Name and Address</b></p>
                                                        </div>
                                                        <div className='col-4'>
                                                            <p>Proof of Business</p>
                                                        </div>
                                                        <div className='col-4'>
                                                            <p>Business Registration Document</p>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p><b>Service Usage Description</b></p>
                                                        </div>
                                                        <div className='col-4'>
                                                            <p>No documentation required*</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                            <div className='compDetails'>
                                                <p>
                                                    Service usage must be in accordance with National and International regulations. In particular, numbers must not be used to display, send or transmit prohibited content.
                                                </p>
                                                <p>
                                                    Numbers cannot be disclosed on the Internet or in any public advertising.
                                                </p>
                                                <p>
                                                    Callback services are not allowed.
                                                </p>
                                                <p>*Although documentation is not required at this time, to avoid urgent escalation we advise you to verify the accuracy of any supplied information, such as collecting or checking documentary proof of the information you have provided. Additional information may be required in the future.</p>

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
    )
}

export default AlgeriaCompliance