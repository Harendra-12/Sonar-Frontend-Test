import React from 'react'

const BillingHistory = () => {
    return (
        <>
            <div className="tableContainer" >
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Details</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr data-bs-toggle="collapse" data-bs-target="#collapseMonth1" aria-expanded="false" aria-controls="collapseMonth1">
                            <td><i className="fa fa-angle-down rotate-icon me-2"></i> 2025-06</td>
                            <td>$0.00</td>
                            <td>Payment Pending</td>
                            <td>Paid</td>
                        </tr>

                        <tr className="collapse " id="collapseMonth1" data-bs-toggle="collapse" data-bs-target="#collapseSubDetails1" aria-expanded="false" aria-controls="collapseSubDetails1">
                            <td className='first_td_padding'><i className="fa fa-angle-down rotate-icon me-2"></i>Jun 1 - Jun 30</td>
                            <td>$0.00</td>
                            <td>Payment</td>
                            <td>Ongoing</td>
                        </tr>

                        <tr className="collapse " id="collapseSubDetails1">
                            <td className='first_td_padding2'>Voice Engine</td>
                            <td>$0.21</td>
                            <td>3 minutes</td>
                            <td>Pending</td>
                        </tr>

                        <tr data-bs-toggle="collapse" data-bs-target="#collapseMonth2" aria-expanded="false" aria-controls="collapseMonth2">
                            <td><i className="fa fa-angle-down rotate-icon me-2"></i> 2025-06</td>
                            <td>$0.00</td>
                            <td>Payment Pending</td>
                            <td>Paid</td>
                        </tr>

                        <tr className="collapse " id="collapseMonth2" data-bs-toggle="collapse" data-bs-target="#collapseSubDetails2" aria-expanded="false" aria-controls="collapseSubDetails2">
                            <td className='first_td_padding'><i className="fa fa-angle-down rotate-icon me-2"></i>Jun 1 - Jun 30</td>
                            <td>$0.00</td>
                            <td>Payment</td>
                            <td>Ongoing</td>
                        </tr>

                        <tr className="collapse " id="collapseSubDetails2">
                            <td className='first_td_padding2'>Voice Engine</td>
                            <td>$0.21</td>
                            <td>3 minutes</td>
                            <td>Pending</td>
                        </tr>
                    </tbody>
                </table>

            </div>

        </>
    )
}

export default BillingHistory