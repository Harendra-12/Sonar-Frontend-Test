import React, { useEffect, useState } from 'react'
import Header from '../../../../CommonComponents/Header'
import CountryComplianceHeader from './CountryComplianceHeader'
import { useLocation } from 'react-router-dom'
import complianceRawData from './JsonData/CountryComplianceJson.json';

function AlgeriaCompliance() {
    const locationState = useLocation();
    const [countryCompliance, setCountryCompliance] = useState([]);
    useEffect(() => {
        const filteredData = complianceRawData.find((data) => data.country_code === locationState.state.item.country_code);
        setCountryCompliance(filteredData.data);
    }, [])

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
                                    {countryCompliance && Object.keys(countryCompliance)?.length > 0 ?
                                        <>
                                            <div className="col-xxl-8 col-12 mx-auto compliancesBox mt-5">
                                                <div className="basicContent my-0">
                                                    <div className='heading'>Locale Summary</div>
                                                    <ul>
                                                        <li className='row'>
                                                            <div className='col-6'><p><b>Locale name</b></p></div>
                                                            <div className='col-6'><p>{countryCompliance?.locale?.name}</p></div>
                                                        </li>
                                                        <li className='row'>
                                                            <div className='col-6'>
                                                                <p><b>ISO code</b></p>
                                                                <p>The International Organization for Standardization two character representation for the given locale.</p>
                                                            </div>
                                                            <div className='col-6'><p>{countryCompliance?.locale?.iso_code}</p></div>
                                                        </li>
                                                        <li className='row'>
                                                            <div className='col-6'><p><b>Region</b></p></div>
                                                            <div className='col-6'><p>{countryCompliance?.locale?.region}</p></div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col-xxl-8 col-12 mx-auto compliancesBox">
                                                <div className="basicContent my-0">
                                                    <div className='heading'>Numbers Summary</div>
                                                    <ul>
                                                        {Object.keys(countryCompliance.numbers_summary).length > 0 ?
                                                            Object.keys(countryCompliance?.numbers_summary).map((item, index) => (
                                                                <li className='row' key={index}>
                                                                    <div className='col-6'><p style={{ textTransform: "capitalize" }}><b>{item.replace("_", " ")}</b></p></div>
                                                                    <div className='col-6'>
                                                                        <p>{countryCompliance?.numbers_summary[item]}</p>
                                                                    </div>
                                                                </li>
                                                            )) : ""
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col-xxl-8 col-12 mx-auto compliancesBox">
                                                <div className="basicContent my-0">
                                                    <h4>Requirements for Individuals</h4>
                                                    <ul>
                                                        <li className='listingLi row'>
                                                            <div className='col-4 heading'>Information required</div>
                                                            <div className='col-4 heading'>Documentation required</div>
                                                            <div className='col-4 heading'>Acceptable Documentation</div>
                                                        </li>
                                                        {countryCompliance?.requirements?.individuals?.information_required?.map((info, i) => (
                                                            <li key={i} className='row'>
                                                                <div className='col-4'><p><b>{info}</b></p></div>
                                                                <div className='col-4'>
                                                                    <p>{countryCompliance?.requirements?.individuals?.documentation_required[info] || "—"}</p>
                                                                </div>
                                                                {countryCompliance?.requirements?.individuals?.acceptable_documentation &&
                                                                    <div className='col-4'>
                                                                        <p>{countryCompliance?.requirements?.individuals?.acceptable_documentation[info] || "—"}</p>
                                                                    </div>
                                                                }
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col-xxl-8 col-12 mx-auto compliancesBox">
                                                <div className="basicContent my-0">
                                                    <h4>Requirements for Businesses</h4>
                                                    <ul>
                                                        <li className='listingLi row'>
                                                            <div className='col-4 heading'>Information required</div>
                                                            <div className='col-4 heading'>Documentation required</div>
                                                            <div className='col-4 heading'>Acceptable Documentation</div>
                                                        </li>
                                                        {countryCompliance?.requirements?.businesses?.information_required?.map((info, i) => (
                                                            <li key={i} className='row'>
                                                                <div className='col-4'><p><b>{info}</b></p></div>
                                                                <div className='col-4'>
                                                                    <p>{countryCompliance?.requirements?.businesses?.documentation_required[info] || "—"}</p>
                                                                </div>
                                                                {countryCompliance?.requirements?.businesses?.acceptable_documentation &&
                                                                    <div className='col-4'>
                                                                        <p>{countryCompliance?.requirements?.businesses?.acceptable_documentation[info] || "—"}</p>
                                                                    </div>
                                                                }
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="col-xxl-8 col-12 mx-auto compliancesBox">
                                                <div className="basicContent my-0">
                                                    {countryCompliance?.requirements?.notes?.map((note, i) => (
                                                        <p key={i}>{note}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        </> : ""
                                    }
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