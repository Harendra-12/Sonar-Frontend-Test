import React from "react";

function Payment({ account, nextPage, companyStatus }) {
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
                <div className="row" style={{ padding: "5px" }}>
                  <div className="wrapper">
                    <ul>
                      <li>
                        <label>Package Name</label>{" "}
                        <label className="details">
                          {account.package.name}
                        </label>
                      </li>
                      <li>
                        <label>Package Price</label>{" "}
                        <label className="details">
                          ${account.package.offer_price}
                        </label>
                      </li>
                      <li>
                        <label>Package Type</label>{" "}
                        <label className="details">
                          {account.package.subscription_type}
                        </label>
                      </li>
                      <li>
                        <label>Subscription Start</label>{" "}
                        <label className="details">
                          {account?.subscription?.[0].start_date}
                        </label>
                      </li>
                      <li>
                        <label>Subscription End</label>{" "}
                        <label className="details">
                          {account?.subscription?.[0].end_date}
                        </label>
                      </li>
                      <li>
                        <label>Time of Payment</label>{" "}
                        <label className="details">
                          {account?.payments[0].transaction_date}
                        </label>
                      </li>
                      <li>
                        <label>Payment Status</label>{" "}
                        <label className="details">
                          {account?.payments[0].payment_status}
                        </label>
                      </li>
                      <li>
                        <label>Transaction Id</label>{" "}
                        <label className="details">
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
                <div className="header d-flex align-items-center pe-0">
                  <div className="col-12">Billing Details</div>
                </div>
                <div className="row" style={{ padding: "5px" }}>
                  <div className="wrapper">
                    <ul>
                      <li>
                        <label>Full Name</label>{" "}
                        <label className="details">
                          {account?.billing_address?.[0]?.fullname}
                        </label>
                      </li>
                      <li>
                        <label>Email</label>{" "}
                        <label className="details">
                          {account?.billing_address?.[0]?.email}
                        </label>
                      </li>
                      <li>
                        <label>Phone Number</label>{" "}
                        <label className="details">
                          {account?.billing_address?.[0]?.contact_no}
                        </label>
                      </li>
                      <li>
                        <label>Address</label>{" "}
                        <label className="details">
                          {account?.billing_address?.[0]?.address}
                        </label>
                      </li>
                      <li>
                        <label>Zip Code</label>{" "}
                        <label className="details">
                          {account?.billing_address?.[0]?.zip}
                        </label>
                      </li>
                      <li>
                        <label>City</label>{" "}
                        <label className="details">
                          {account?.billing_address?.[0]?.city}
                        </label>
                      </li>
                      <li>
                        <label>State</label>{" "}
                        <label className="details">
                          {account?.billing_address?.[0]?.state}
                        </label>
                      </li>
                      <li>
                        <label>Country</label>{" "}
                        <label className="details">
                          {account?.billing_address?.[0]?.country}
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-12">
            <div className="col-xl-3 mx-auto">
              <div class={Number(companyStatus) >= 2 ? "approvalButton" : "approvalButton disabled"}
                onClick={() => {
                  if (Number(companyStatus) >= 2) {
                    nextPage("document")
                  }
                }}>
                Next<i class="fa-solid fa-caret-right ms-2"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
