import React from "react";

function Account({ account, nextPage, companyStatus }) {
  return (
    <>
      <div className="d-flex flex-wrap" style={{borderBlockEnd: '1px solid var(--me-border1)'}}>
        <div className="col-12">
          <div className="heading d-flex justify-content-between align-items-center pb-3">
            <div className="content">
              <h4>Account Details</h4>
              <p>View your account details here.</p>
            </div>
            <div className="buttonGroup">
              <button
                type="button"
                effect="ripple"
                className="panelButton"
                onClick={() => { nextPage("payment") }}
              >
                <span className="text">Next</span>
                <span className="icon"><i className="fa-solid fa-caret-right"></i></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="col-12" style={{ padding: '25px 23px', }}>
        <div className="row px-2 pb-2">
          <div className="formRow col-xl-3">
            <div className="formLabel">
              <label htmlFor="data">Company Name</label>
            </div>
            <div className="col-6">
              <input
                type="text"
                className="formItem"
                value={account.company_name}
                disabled
              />
            </div>
          </div>
          <div className="formRow col-xl-3">
            <div className="formLabel">
              <label htmlFor="data">Admin Name</label>
            </div>
            <div className="col-6">
              <input
                type="text"
                className="formItem"
                value={account.admin_name}
                disabled
              />
            </div>
          </div>
          <div className="formRow col-xl-3">
            <div className="formLabel">
              <label htmlFor="data">Email</label>
            </div>
            <div className="col-6">
              <input
                type="text"
                className="formItem"
                value={account.email}
                disabled
              />
            </div>
          </div>
          <div className="formRow col-xl-3">
            <div className="formLabel">
              <label htmlFor="data">Phone Number</label>
            </div>
            <div className="col-6">
              <input
                type="text"
                className="formItem"
                value={account.contact_no}
                disabled
              />
            </div>
          </div>
          <div className="formRow col-xl-3">
            <div className="formLabel">
              <label htmlFor="data">Alternate Number</label>
            </div>
            <div className="col-6">
              <input
                type="text"
                className="formItem"
                value={account.alternate_contact_no}
                disabled
              />
            </div>
          </div>
          <div className="formRow col-xl-3">
            <div className="formLabel">
              <label htmlFor="data">Timezone</label>
            </div>
            <div className="col-6">
              <input
                type="text"
                className="formItem"
                value={account.timezone.name}
                disabled
              />
            </div>
          </div>
          <div className="formRow col-xl-3">
            <div className="formLabel">
              <label htmlFor="data">Block/Unit/Place</label>
            </div>
            <div className="col-6">
              <input
                type="text"
                className="formItem"
                value={account.unit}
                disabled
              />
            </div>
          </div>
          <div className="formRow col-xl-3">
            <div className="formLabel">
              <label htmlFor="data">Building</label>
            </div>
            <div className="col-6">
              <input
                type="text"
                className="formItem"
                value={account.building}
                disabled
              />
            </div>
          </div>
          <div className="formRow col-xl-3">
            <div className="formLabel">
              <label htmlFor="data">City</label>
            </div>
            <div className="col-6">
              <input
                type="text"
                className="formItem"
                value={account.city}
                disabled
              />
            </div>
          </div>
          <div className="formRow col-xl-3">
            <div className="formLabel">
              <label htmlFor="data">Zip Code</label>
            </div>
            <div className="col-6">
              <input
                type="text"
                className="formItem"
                value={account.zip}
                disabled
              />
            </div>
          </div>
          <div className="formRow col-xl-3">
            <div className="formLabel">
              <label htmlFor="data">State</label>
            </div>
            <div className="col-6">
              <input
                type="text"
                className="formItem"
                value={account.state}
                disabled
              />
            </div>
          </div>
          <div className="formRow col-xl-3">
            <div className="formLabel">
              <label htmlFor="data">Country</label>
            </div>
            <div className="col-6">
              <input
                type="text"
                className="formItem"
                value={account.country}
                disabled
              />
            </div>
          </div>
        </div>
      </div> */}
      <div className="col-12 mt-3">
         <div className=" d-flex gap-3 flex-wrap w-100">

        <ul className="listViewProfileInfo">
          <li className="mb-2"><span className="textImmortalBlack">Company Name : </span> <span className="textSubtext">{account.company_name}</span></li>
          <li className="mb-2"><span className="textImmortalBlack">Admin Name : </span> <span className="textSubtext">{account.admin_name}</span></li>
          <li className="mb-2"><span className="textImmortalBlack">Email : </span> <span className="textSubtext">{account.email}</span></li>
          <li className="mb-2"><span className="textImmortalBlack">Phone Number : </span> <span className="textSubtext">{account.contact_no}</span></li>
          <li className="mb-2"><span className="textImmortalBlack">Alternate Number: </span> <span className="textSubtext">{account.alternate_contact_no}</span></li>
          <li className="mb-2"><span className="textImmortalBlack">Timezone : </span> <span className="textSubtext">{account.timezone.name}</span></li>
         
        </ul>

        <ul className="listViewProfileInfo">
          <li className="mb-2"><span className="textImmortalBlack">Block/Unit/Place : </span> <span className="textSubtext">{account.unit}</span></li>
          <li className="mb-2"><span className="textImmortalBlack">Building : </span> <span className="textSubtext">{account.building}</span></li>
          <li className="mb-2"><span className="textImmortalBlack">City : </span> <span className="textSubtext">{account.city}</span></li>
          <li className="mb-2"><span className="textImmortalBlack">Zip Code : </span> <span className="textSubtext">{account.zip}</span></li>
          <li className="mb-2"><span className="textImmortalBlack">State : </span> <span className="textSubtext">{account.state}</span></li>
          <li className="mb-2"><span className="textImmortalBlack">Country : </span> <span className="textSubtext">{account.country}</span></li>
        </ul>
         </div>
      </div>
    </>
  );
}

export default Account;
