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
