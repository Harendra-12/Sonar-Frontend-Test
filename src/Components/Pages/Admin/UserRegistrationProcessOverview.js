import React from "react";
import Header from "../../CommonComponents/Header";

function UserRegistrationProcessOverview() {
  return (
    <>
      <style>
        {`
      .formRow{
        border: none;
      }
      .formItem{
        margin: 0px 5px 0px 0px;
        color: #000;
      }
      .formLabel{
        padding: 0px 0px 5px;
      }
      .wrapper{
        padding: 10px 10px 0 ;
      }
      .wrapper ul{
        padding: 0;
        list-style: none;
      }

      .wrapper ul li{
        padding-bottom: 5px;
        margin-bottom: 7px;
        border-bottom: 1px solid #ddd;
      }

      .wrapper ul label{
        font-size: 0.875rem;
        color: #5e5e5e;
        font-weight: 500;
        font-family: Roboto;
      }

      .wrapper ul .details{
        float: inline-end;
        color: #000;
        font-size: 0.875rem;
        font-weight: 600;
        font-family: Roboto;
      }

      .qLinkContent .iconWrapper2{
          width: 35px;
          border-radius: 50%;
          height: 35px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--ui-accent);
          color: #fff;
      }
      `}
      </style>
      <div className="mainContent">
        <div className="col-12">
          <Header title="New User Details" />
          <div className="d-flex flex-wrap">
            <div className="col-xl-12">
              <div className="profileView">
                <div className="profileDetailsHolder position-relative">
                  <div
                    className="baseDetails row align-items-center mt-3"
                    style={{ padding: "30px 10px 55px" }}
                  >
                    <div className="col-xl-8 px-0 mx-auto position-relative">
                      <div
                        className="progress"
                        role="progressbar"
                        aria-label="Animated striped example"
                        aria-valuenow="50"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                          style={{ width: "50%" }}
                        ></div>
                      </div>
                      <div className="progressStepWrapper">
                        <div className="stepWrapper col-3 success">
                          <div className="step">
                            <i className="fa-solid fa-thumbs-up"></i>
                          </div>
                          <label>Accounts</label>
                        </div>
                        <div className="stepWrapper col-3 success">
                          <div className="step">
                            <i className="fa-sharp fa-solid fa-credit-card"></i>
                          </div>
                          <label>Payment</label>
                        </div>
                        <div className="stepWrapper col-3">
                          <div className="step ">
                            <i className="fa-sharp fa-solid fa-file"></i>
                          </div>
                          <label>Documents</label>
                        </div>
                        <div className="stepWrapper col-3">
                          <div className="step" style={{ cursor: "pointer" }}>
                            <i className="fa-sharp fa-solid fa-file-invoice"></i>
                          </div>
                          <label>Download Invoice</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-9">
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
                          value="test"
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
                          value="test"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Admin Email</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value="test"
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
                          value="test"
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
                          value="test"
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
                          value="test"
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
                          value="test"
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
                          value="test"
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
                          value="test"
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
                          value="test"
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
                          value="test"
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
                          value="test"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  {/* <div className="header d-flex align-items-center mt-2">
                    <div className="col-5">Billing Details</div>
                  </div>
                  <div className="row px-2 pb-2 border-bottom">
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Full Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value="test"
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
                          value="test"
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
                          value="test"
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
                          value="test"
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
                          value="test"
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
                          value="test"
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
                          value="test"
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
                          value="test"
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
                          value="test"
                          disabled
                        />
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="header d-flex align-items-center mt-2">
                    <div className="col-5">Package Details</div>
                  </div>
                  <div className="row px-2 pb-2 border-bottom">
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Package Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value="test"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Package Price</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value="test"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Package Type</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value="test"
                          disabled
                        />
                      </div>
                    </div>
                  </div> */}
                  {/* <div className="header d-flex align-items-center mt-2">
                    <div className="col-5">Pricing Details</div>
                  </div>
                  <div className="row px-2 pb-2 border-bottom">
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Amount Paid</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value="test"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Time of Payment</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value="test"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Package Chosen</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value="test"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Payment Status</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value="test"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Transaction Id</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value="test"
                          disabled
                        />
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="d-flex flex-wrap">
                <div className="col-xl-4">
                  <div className="profileView">
                    <div className="profileDetailsHolder position-relative">
                      <div className="header d-flex align-items-center">
                        <div className="col-12">Selected Package</div>
                      </div>
                      <div className="row" style={{ padding: "5px" }}>
                        <div className="wrapper">
                          <ul>
                            <li>
                              <label>Package Name</label>{" "}
                              <label className="details">Advanced</label>
                            </li>
                            <li>
                              <label>Package Price</label>{" "}
                              <label className="details">$25000.00</label>
                            </li>
                            <li>
                              <label>Package Type</label>{" "}
                              <label className="details">annually</label>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="profileView">
                    <div className="profileDetailsHolder position-relative">
                      <div className="header d-flex align-items-center">
                        <div className="col-12">Pricing Details</div>
                      </div>
                      <div className="row" style={{ padding: "5px" }}>
                        <div className="wrapper">
                          <ul>
                            <li>
                              <label>Amount Paid</label>{" "}
                              <label className="details">$123.00</label>
                            </li>
                            <li>
                              <label>Time of Payment</label>{" "}
                              <label className="details">16-01-2001</label>
                            </li>
                            <li>
                              <label>Package Chosen</label>{" "}
                              <label className="details">Starter</label>
                            </li>
                            <li>
                              <label>Payment Status</label>{" "}
                              <label className="details">Success</label>
                            </li>
                            <li>
                              <label>Transaction Id</label>{" "}
                              <label className="details">321654987</label>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="profileView">
                    <div className="profileDetailsHolder position-relative">
                      <div className="header d-flex align-items-center">
                        <div className="col-12">Billing Details</div>
                      </div>
                      <div className="row" style={{ padding: "5px" }}>
                        <div className="wrapper">
                          <ul>
                            <li>
                              <label>Full Name</label>{" "}
                              <label className="details">John Doe</label>
                            </li>
                            <li>
                              <label>Email</label>{" "}
                              <label className="details">john.doe@webvio.com</label>
                            </li>
                            <li>
                              <label>Phone Number</label>{" "}
                              <label className="details">6942061942</label>
                            </li>
                            <li>
                              <label>Address</label>{" "}
                              <label className="details">8/1/2 Greenfield Park</label>
                            </li>
                            <li>
                              <label>Zip Code</label>{" "}
                              <label className="details">123456</label>
                            </li>
                            <li>
                              <label>City</label>{" "}
                              <label className="details">Utopia</label>
                            </li>
                            <li>
                              <label>State</label>{" "}
                              <label className="details">Prometheus</label>
                            </li>
                            <li>
                              <label>Country</label>{" "}
                              <label className="details">Interstellar</label>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3">
              <div className="profileView">
                <div className="profileDetailsHolder">
                  <div className="header d-flex align-items-center">
                    <div className="col-12">Documents Uploaded</div>
                  </div>
                  <div className="qLinkContent px-3 mt-2">
                    <div className="row position-relative">
                      <div className="col-auto ps-0 pe-2">
                        <div className="iconWrapper2">
                          <i
                            className="fa-solid fa-image"
                          ></i>
                        </div>
                      </div>
                      <div className="col-8 my-auto ps-1">
                        <p>ID Card</p>
                      </div>
                      <div className="col-auto px-0 my-auto ms-auto">
                        <div className="iconWrapper">
                          <i className="fa-solid fa-ellipsis"></i>
                        </div>
                      </div>
                      <div className="buttonPopup" style={{ display: 'none' }}>
                        <div
                          style={{ cursor: "pointer" }}
                        >
                          <div className="clearButton">
                            <i className="fa-solid fa-file-arrow-down"></i>{" "}
                            Download
                          </div>
                        </div>
                        <div style={{ cursor: "pointer" }}>
                          <div className="clearButton">
                            <div
                              target="_blank"
                              rel="noreferrer"
                            >
                              <i className="fa-sharp fa-solid fa-eye"></i> View
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserRegistrationProcessOverview;
