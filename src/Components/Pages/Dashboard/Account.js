import React from "react";

function Account({ account, nextPage, companyStatus }) {
  return (
    <div>
      <div className="profileView">
        <div className="profileDetailsHolder position-relative">
          <div className="header d-flex align-items-center">
            <div className="col-12">Account Details</div>
          </div>
          <div className="row px-2 pb-2">
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
      <div className="col-xl-12">
        <div className="col-xl-3 mx-auto">
          <div class="approvalButton"
            onClick={() => {
              nextPage("payment")
            }}>
            Next<i class="fa-solid fa-caret-right ms-2"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
