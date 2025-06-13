import React from 'react'

function CountryComplianceHeader({ item }) {
    return (
        <div className="col-12">
            <div className='hero'>
                <div className="heading">
                    <div className="content mt-5 text">
                        <h3 style={{ fontSize: "48px", color: "white" }} >{item.country} ({item.country_code})</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CountryComplianceHeader