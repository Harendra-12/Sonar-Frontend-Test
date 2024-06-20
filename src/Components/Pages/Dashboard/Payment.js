import React from 'react'

function Payment({account}) {
  return (
    <div>
      <div className="col-xl-12">
              <div className="profileView">
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
                          value={account.company_name}
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
                          value={account.admin_name}
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
                          value={account.email}
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
                          value={account.contact_no}
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
                          value={account.alternate_contact_no}
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
                          value={account.timezone.name}
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
                          value={account.unit}
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
                          value={account.building}
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
                          value={account.city}
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
                          value={account.zip}
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
                          value={account.state}
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
                          value={account.country}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-wrap">
                <div className="col-xl-6">
                  <div className="profileView">
                    <div className="profileDetailsHolder position-relative">
                      <div className="header d-flex align-items-center">
                        <div className="col-12">Payment & Subscription Details</div>
                      </div>
                      <div class="row" style={{ padding: "5px" }}>
                        <div class="wrapper">
                          <ul>
                            <li>
                              <label>Package Name</label>{" "}
                              <label class="details">
                                {account.package.name}
                              </label>
                            </li>
                            <li>
                              <label>Package Price</label>{" "}
                              <label class="details">
                                ${account.package.offer_price}
                              </label>
                            </li>
                            <li>
                              <label>Package Type</label>{" "}
                              <label class="details">
                                {account.package.subscription_type}
                              </label>
                            </li>
                            <li>
                              <label>Subscription Start</label>{" "}
                              <label class="details">
                                {account?.payments[0].subscription?.start_date}
                              </label>
                            </li>
                            <li>
                              <label>Subscription End</label>{" "}
                              <label class="details">
                                {account?.payments[0].subscription?.end_date}
                              </label>
                            </li>
                            <li>
                              <label>Time of Payment</label>{" "}
                              <label class="details">
                                {
                                  account?.payments[0].transaction_date
                                }
                              </label>
                            </li>
                            <li>
                              <label>Payment Status</label>{" "}
                              <label class="details">
                                {account?.payments[0].payment_status}
                              </label>
                            </li>
                            <li>
                              <label>Transaction Id</label>{" "}
                              <label class="details">
                                {account?.payments[0].transaction_id}
                              </label>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="profileView">
                    <div className="profileDetailsHolder position-relative">
                      <div className="header d-flex align-items-center">
                        <div className="col-12">Billing Details</div>
                      </div>
                      <div class="row" style={{ padding: "5px" }}>
                        <div class="wrapper">
                          <ul>
                            <li>
                              <label>Full Name</label>{" "}
                              <label class="details">{account?.payments[0]?.billing_address?.fullname}</label>
                            </li>
                            <li>
                              <label>Email</label>{" "}
                              <label class="details">{account?.payments[0]?.billing_address?.email}</label>
                            </li>
                            <li>
                              <label>Phone Number</label>{" "}
                              <label class="details">{account?.payments[0]?.billing_address?.contact_no}</label>
                            </li>
                            <li>
                              <label>Address</label>{" "}
                              <label class="details">
                                {account?.payments[0]?.billing_address?.address}
                              </label>
                            </li>
                            <li>
                              <label>Zip Code</label>{" "}
                              <label class="details">{account?.payments[0]?.billing_address?.zip}</label>
                            </li>
                            <li>
                              <label>City</label>{" "}
                              <label class="details">{account?.payments[0]?.billing_address?.city}</label>
                            </li>
                            <li>
                              <label>State</label>{" "}
                              <label class="details">{account?.payments[0]?.billing_address?.state}</label>
                            </li>
                            <li>
                              <label>Country</label>{" "}
                              <label class="details">{account?.payments[0]?.billing_address?.country}</label>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    </div>
  )
}

export default Payment
