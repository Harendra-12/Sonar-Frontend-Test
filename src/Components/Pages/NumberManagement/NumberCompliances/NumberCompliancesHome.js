import React, { useEffect, useState } from 'react'
import Header from '../../../CommonComponents/Header'
import { featureUnderdevelopment, generalGetFunction } from '../../../GlobalFunction/globalFunction';
import CircularLoader from '../../../Loader/CircularLoader';
import { Outlet, useNavigate } from 'react-router-dom';

function NumberCompliancesHome() {
    const [countryCode, setCountryCode] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllCountry();
    }, [])

    // Fetch all countries
    const fetchAllCountry = async () => {
        setLoading(true);
        if (!countryCode) {
            try {
                const apiData = await generalGetFunction("/available-countries");
                if (apiData?.status) {
                    setCountryCode(apiData.data);
                    setLoading(false);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <>
            <main className="mainContent">
                {loading && <CircularLoader />}
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
                                        <div className="col-12">
                                            <div className='hero'>
                                                <div className="heading">
                                                    <div className="content mt-5 text">
                                                        <h3 style={{ fontSize: "48px", color: "white" }} >Phone Number Regulations</h3>
                                                        <div className='mt-1 text-center'><p style={{ fontSize: "16px", color: "white", fontWeight: 600 }}>Phone Number Regulatory Requirements For Customers</p></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xxl-8 col-12 mx-auto">
                                            <div className="basicContent">
                                                <p>Both Twilio and our customers must adhere to local phone number regulations. To help you comply with these regulations and minimize the risk of disruption to your phone numbers, we maintain an up-to-date, country-by-country guide of phone number regulatory requirements.</p>
                                                <p>Local regulations often require providing adequate identity documentation to carriers or a local enforcement agency. To avoid urgent escalations from regulators, we urge you to provide the required information for each country.</p>
                                                <p>Read our Frequently Asked Questions (FAQ) or our Getting Started Guide for additional information. For detailed information about important milestones for your phone numbers and regulatory compliance, please review our regulatory compliance product releases.</p>
                                            </div>
                                        </div>
                                        <div className='col-xxl-8 col-12 mx-auto'>
                                            <div className='country_card_group pt-4'>
                                                {countryCode && countryCode.length > 0 &&
                                                    countryCode.map((item, index) => (
                                                        <div key={index} className='card country_box' onClick={() => navigate(`/number-compliances/${item?.country_code.toLowerCase()}`, { state: { item } })}>
                                                            <div className='card-body'>
                                                                <div className='avatar_img'>
                                                                    <img src={`https://flagsapi.com/${item?.country_code}/flat/64.png`} alt='logout' style={{ width: 'auto' }} />
                                                                </div>
                                                                <div className='card_details'>
                                                                    <p className='country_name'>{item?.country}</p>
                                                                    <div className="text-center badge rounded-pill badge-softLight-primary bg-transparent d-inline-flex justify-content-center align-items-center">
                                                                        <p className="text-center mb-0">{item?.prefix_code}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Outlet />
        </>
    )
}

export default NumberCompliancesHome