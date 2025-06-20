import React from "react";

function Payment({ account, nextPage, companyStatus }) {
  return (
    <>
      <div className="d-flex flex-wrap" style={{ borderBlockEnd: '1px solid var(--me-border1)' }}>
        <div className="col-12">
          <div className="heading d-flex justify-content-between align-items-center pb-3">
            <div className="content">
              <h4>Package Details</h4>
              <p>View your payment & subscription details here.</p>
            </div>
            <div className="buttonGroup d-flex justify-content-start align-items-center gap-2">
              <button
                type="button"
                effect="ripple"
                className="panelButton gray"
                onClick={() => { nextPage("account"); }}
              >
                <span className="text">Back</span>
                <span className="icon"><i className="fa-solid fa-caret-left"></i></span>
              </button>
              <button
                type="button"
                effect="ripple"
                className="panelButton"
                onClick={() => {
                  if (Number(companyStatus) >= 2) {
                    nextPage("document");
                  }
                }}
                disabled={Number(companyStatus) >= 2 ? false : true}
              >
                <span className="text">Next</span>
                <span className="icon"><i className="fa-solid fa-caret-right"></i></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 py-3" >
        <div className="row gx-5">
          <div className="col-xl-6" style={{ borderRight: '1px solid #ddd' }}>
            {/* <div className="row px-2"> */}
              <div className="col-xl-12 headerCommon">
                Payment & Subscription Details
              </div>
              <ul className="listViewProfileInfo">
                <li className="mb-2"><span className="textImmortalBlack">Package Name : </span> <span className="textSubtext">{account.package.name}</span></li>
                <li className="mb-2"><span className="textImmortalBlack">Package Price : </span> <span className="textSubtext">{account.package.offer_price}</span></li>
                <li className="mb-2"><span className="textImmortalBlack">Package Type : </span> <span className="textSubtext">{account.package.subscription_type}</span></li>
                <li className="mb-2"><span className="textImmortalBlack">Subscription Start : </span> <span className="textSubtext">{account?.subscription?.[0].start_date}</span></li>
                <li className="mb-2"><span className="textImmortalBlack">Subscription End: </span> <span className="textSubtext">{account?.subscription?.[0].end_date}</span></li>
                <li className="mb-2"><span className="textImmortalBlack">Time of Payment : </span> <span className="textSubtext">{account?.payments[0].transaction_date}</span></li>
                <li className="mb-2"><span className="textImmortalBlack">Payment Status : </span> <span className="textSubtext">{account?.payments[0].payment_status}</span></li>
                <li className="mb-2"><span className="textImmortalBlack">Transaction Id : </span> <span className="textSubtext">{account?.payments[0].transaction_id}</span></li>
              </ul>

              {/* <div className="formRow col-xl-12">
                <div className="formLabel">
                  <label htmlFor="">Package Name</label>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={account.package.name}
                    disabled
                  />
                </div>
              </div>
              <div className="formRow col-xl-12">
                <div className="formLabel">
                  <label htmlFor="">Package Price</label>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={account.package.offer_price}
                    disabled
                  />
                </div>
              </div>
              <div className="formRow col-xl-12">
                <div className="formLabel">
                  <label htmlFor="">Package Type</label>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={account.package.subscription_type}
                    disabled
                  />
                </div>
              </div>
              <div className="formRow col-xl-12">
                <div className="formLabel">
                  <label htmlFor="">Subscription Start</label>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={account?.subscription?.[0].start_date}
                    disabled
                  />
                </div>
              </div>
              <div className="formRow col-xl-12">
                <div className="formLabel">
                  <label htmlFor="">Subscription End</label>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={account?.subscription?.[0].end_date}
                    disabled
                  />
                </div>
              </div>
              <div className="formRow col-xl-12">
                <div className="formLabel">
                  <label htmlFor="">Time of Payment</label>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={account?.payments[0].transaction_date}
                    disabled
                  />
                </div>
              </div>
              <div className="formRow col-xl-12">
                <div className="formLabel">
                  <label htmlFor="">Payment Status</label>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={account?.payments[0].payment_status}
                    disabled
                  />
                </div>
              </div>
              <div className="formRow col-xl-12">
                <div className="formLabel">
                  <label htmlFor="">Transaction Id</label>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={account?.payments[0].transaction_id}
                    disabled
                  />
                </div>
              </div> */}
            {/* </div> */}
          </div>
          <div className="col-xl-6">
            {/* <form action="#" className="row px-2"> */}
              <div className="col-xl-12 headerCommon">
                Billing Details
              </div>
               <ul className="listViewProfileInfo">
                <li className="mb-2"><span className="textImmortalBlack">Full Name : </span> <span className="textSubtext">{account?.billing_address?.[0]?.fullname}</span></li>
                <li className="mb-2"><span className="textImmortalBlack">Email : </span> <span className="textSubtext">{account?.billing_address?.[0]?.email}</span></li>
                <li className="mb-2"><span className="textImmortalBlack">Phone Number : </span> <span className="textSubtext">{account?.billing_address?.[0]?.contact_no}</span></li>
                <li className="mb-2"><span className="textImmortalBlack">Address : </span> <span className="textSubtext">{account?.billing_address?.[0]?.address}</span></li>
                <li className="mb-2"><span className="textImmortalBlack">Zip Code : </span> <span className="textSubtext">{account?.billing_address?.[0]?.zip}</span></li>
                <li className="mb-2"><span className="textImmortalBlack">City : </span> <span className="textSubtext">{account?.billing_address?.[0]?.city}</span></li>
                <li className="mb-2"><span className="textImmortalBlack">State : </span> <span className="textSubtext">{account?.billing_address?.[0]?.state}</span></li>
                <li className="mb-2"><span className="textImmortalBlack">Country : </span> <span className="textSubtext">{account?.billing_address?.[0]?.country}</span></li>

              </ul>

              {/* <div className="formRow col-xl-12">
                <div className="formLabel">
                  <label htmlFor="">Full Name</label>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={account?.billing_address?.[0]?.fullname}
                    disabled
                  />
                </div>
              </div>
              <div className="formRow col-xl-12">
                <div className="formLabel">
                  <label htmlFor="">Email</label>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={account?.billing_address?.[0]?.email}
                    disabled
                  />
                </div>
              </div>
              <div className="formRow col-xl-12">
                <div className="formLabel">
                  <label htmlFor="">Phone Number</label>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={account?.billing_address?.[0]?.contact_no}
                    disabled
                  />
                </div>
              </div>
              <div className="formRow col-xl-12">
                <div className="formLabel">
                  <label htmlFor="">Address</label>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={account?.billing_address?.[0]?.address}
                    disabled
                  />
                </div>
              </div>
              <div className="formRow col-xl-12">
                <div className="formLabel">
                  <label htmlFor="">Zip Code</label>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={account?.billing_address?.[0]?.zip}
                    disabled
                  />
                </div>
              </div>
              <div className="formRow col-xl-12">
                <div className="formLabel">
                  <label htmlFor="">City</label>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={account?.billing_address?.[0]?.city}
                    disabled
                  />
                </div>
              </div>
              <div className="formRow col-xl-12">
                <div className="formLabel">
                  <label htmlFor="">State</label>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={account?.billing_address?.[0]?.state}
                    disabled
                  />
                </div>
              </div>
              <div className="formRow col-xl-12">
                <div className="formLabel">
                  <label htmlFor="">Country</label>
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={account?.billing_address?.[0]?.country}
                    disabled
                  />
                </div>
              </div> */}
            {/* </form> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Payment;
