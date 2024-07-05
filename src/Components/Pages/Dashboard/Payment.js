import React from 'react'

function Payment({ account }) {
  return (
    <div>
      <div className="col-xl-12">
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
                          {account?.subscription?.[0].start_date}
                        </label>
                      </li>
                      <li>
                        <label>Subscription End</label>{" "}
                        <label class="details">
                          {account?.subscription?.[0].end_date}
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
                        <label class="details">{account?.billing_address?.[0].fullname}</label>
                      </li>
                      <li>
                        <label>Email</label>{" "}
                        <label class="details">{account?.billing_address?.[0].email}</label>
                      </li>
                      <li>
                        <label>Phone Number</label>{" "}
                        <label class="details">{account?.billing_address?.[0].contact_no}</label>
                      </li>
                      <li>
                        <label>Address</label>{" "}
                        <label class="details">
                          {account?.billing_address?.[0].address}
                        </label>
                      </li>
                      <li>
                        <label>Zip Code</label>{" "}
                        <label class="details">{account?.billing_address?.[0].zip}</label>
                      </li>
                      <li>
                        <label>City</label>{" "}
                        <label class="details">{account?.billing_address?.[0].city}</label>
                      </li>
                      <li>
                        <label>State</label>{" "}
                        <label class="details">{account?.billing_address?.[0].state}</label>
                      </li>
                      <li>
                        <label>Country</label>{" "}
                        <label class="details">{account?.billing_address?.[0].country}</label>
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
