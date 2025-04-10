import React, { useState } from 'react'
import Header from '../../CommonComponents/Header'

const BillingCardAndWallet = () => {
    const [loading, setLoading] = useState(true);
    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Card Transactions" />

                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>Card Transactions</h4>
                                                    <p>
                                                        You can see list of all transactions made using your
                                                        card
                                                    </p>
                                                </div>
                                                <div className="buttonGroup">
                                                    <button
                                                        effect="ripple"
                                                        className="panelButton gray"
                                                    // onClick={() => {
                                                    //     navigate(-1);
                                                    //     backToTop();
                                                    // }}
                                                    >
                                                        <span className="text">Back</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-caret-left"></i>
                                                        </span>
                                                    </button>
                                                    <button
                                                        effect="ripple"
                                                        className="panelButton"
                                                    // onClick={() => featureUnderdevelopment()}
                                                    // onClick={() => setRefreshState(true)}
                                                    >
                                                        <span className="text">Refresh</span>
                                                        <span className="icon">
                                                            <i
                                                                className={`${loading
                                                                    ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                                                    : "fa-regular fa-arrows-rotate fs-5 "
                                                                    } `}
                                                            ></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="col-12"
                                            style={{ overflow: "auto", padding: "25px 20px 0" }}
                                        >
                                            <div className="tableContainer">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Card Holder's Name</th>
                                                            <th>Card Number</th>
                                                            <th>Payment Date</th>
                                                            <th>Transaction ID</th>
                                                            <th>Transaction Amount</th>
                                                            <th>Description</th>
                                                            <th>Type</th>
                                                            <th>Download</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>developer</td>
                                                            <td>4242424242424242</td>
                                                            <td>
                                                                2025-04-10
                                                            </td>
                                                            <td>pi_3RCHqRP2K5GdGJju1vMau9eb</td>
                                                            <td>
                                                                <label
                                                                // className={
                                                                //     item.transaction_type === "credit"
                                                                //         ? "tableLabel success"
                                                                //         : "tableLabel fail"
                                                                // }
                                                                >
                                                                    {/* ${item.amount_subtotal} */}
                                                                    2558
                                                                </label>
                                                            </td>
                                                            <td>	Wallet balance added</td>
                                                            <td>
                                                                <button class="badge badge-subtle badge-border border-0">
                                                                    <i class="fa-duotone fa-regular fa-circle-dot"></i> <span className='ms-1'>Card</span>
                                                                    <div className='card_info'>
                                                                        <ul>
                                                                            <li className='mb-1 '><span className=' text-muted '>Card Name : </span>developer</li>
                                                                            <li className=''><span className=' text-muted '>Card Number : </span>4242424242424242</li>
                                                                        </ul>
                                                                    </div>
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="tableButton"
                                                                // onClick={() =>
                                                                //     downloadImage(
                                                                //         item.invoice_url,
                                                                //         `${item.description}invoice`
                                                                //     )
                                                                // }
                                                                >

                                                                    <i className="fa-solid fa-download"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            {/* <div className="tableHeader mb-3">
                      {transaction && transaction.data.length > 0 ? (
                        <PaginationComponent
                          pageNumber={(e) => setPageNumber(e)}
                          totalPage={transaction.last_page}
                          from={(pageNumber - 1) * transaction.per_page + 1}
                          to={transaction.to}
                          total={transaction.total}
                        />
                      ) : (
                        ""
                      )}
                    </div> */}
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

export default BillingCardAndWallet