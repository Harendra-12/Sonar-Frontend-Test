import React from "react";

function Account({ account, nextPage, companyStatus }) {
  return (
    <>
      <div className="d-flex flex-wrap">
        <div className="col-12">
          <div className="heading">
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
                <span className="icon"><i class="fa-solid fa-caret-right"></i></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12" style={{ padding: '25px 23px', borderBottom: '1px solid #ddd' }}>
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
      </div>
    </>
  );
}

export default Account;
