import React from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

function RechargeWalletPopup({ closePopup }) {
  return (
    <>
      <style>
        {`
            .wrapper ul{
        padding: 0;
        list-style: none;
        margin-bottom: 0;
      }

      .wrapper ul li{
        padding-bottom: 5px;
        margin-bottom: 7px;
        border-bottom: 1px solid #ddd;
      }

      .wrapper ul label{
        font-size: 14px;
        color: #5e5e5e;
        font-weight: 500;
        font-family: Roboto;
      }

      .wrapper ul .details{
        float: inline-end;
        color: #000;
        font-size: 14px;
        font-weight: 600;
        font-family: Roboto;
      }
        `}
      </style>
      <div className="row">
        <div className="col-xl-4 mx-auto">
          <div className="profileView">
            <div className="profileDetailsHolder position-relative">
              <div className="header d-flex align-items-center">
                <div className="col-12">
                  Please Verify Payment Details
                  <span
                    onClick={() => closePopup(false)}
                    className="float-end clearButton text-danger fs-4"
                    style={{ cursor: "pointer" }}
                  >
                    <i class="fa-sharp fa-solid fa-xmark"></i>
                  </span>
                </div>
              </div>
              <div class="row" style={{ padding: "5px" }}>
                <div className="col-12 mb-3">
                    <Cards
                        number={"4242424242424242"}
                        expiry={"12/26"}
                        cvc={"895"}
                        name={"Test card"}
                        focused={"cardDetails.focused"}
                    />
                </div>
                <div class="wrapper col-12">
                  <ul>
                    <li>
                      <label>Full Name</label>{" "}
                      <label class="details">asdasd</label>
                    </li>
                    <li>
                      <label>Phone Number:</label>{" "}
                      <label class="details">asdasd</label>
                    </li>
                    <li>
                      <label>Email:</label>{" "}
                      <label class="details">asdasd</label>
                    </li>
                    <li>
                      <label>Address:</label>{" "}
                      <label class="details">asdasd</label>
                    </li>
                    <li>
                      <label>Zip Code</label>{" "}
                      <label class="details">asdasd</label>
                    </li>
                    <li>
                      <label>City</label> <label class="details">asdasd</label>
                    </li>
                    <li>
                      <label>State</label> <label class="details">asdasd</label>
                    </li>
                    <li>
                      <label>Country</label>{" "}
                      <label class="details">asdasd</label>
                    </li>
                  </ul>
                </div>
                {/* <div class="wrapper col-6">
                  <ul>
                    <li>
                      <label>Full Name</label>{" "}
                      <label class="details">asdasd</label>
                    </li>
                    <li>
                      <label>Email</label> <label class="details">asdasd</label>
                    </li>
                    <li>
                      <label>Phone Number</label>{" "}
                      <label class="details">asdasd</label>
                    </li>
                    <li>
                      <label>Address</label>{" "}
                      <label class="details">asdasd</label>
                    </li>
                    <li>
                      <label>Zip Code</label>{" "}
                      <label class="details">asdasd</label>
                    </li>
                    <li>
                      <label>City</label> <label class="details">asdasd</label>
                    </li>
                    <li>
                      <label>State</label> <label class="details">asdasd</label>
                    </li>
                    <li>
                      <label>Country</label>{" "}
                      <label class="details">asdasd</label>
                    </li>
                  </ul>
                </div> */}
                <div className="col-6">
                  <div className="form-group">
                    <label className="review-label">
                      Enter Your CVV Code
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        placeholder="cvv"
                        className={`form-control travellerdetails payment_exp_date`}
                        name="cvv"
                        type="number"
                      />
                      <small
                        className="text-muted p-1"
                        style={{
                          position: "absolute",
                          right: 2,
                          top: 2,
                        }}
                      ></small>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <label className="review-label">
                      Enter Your Amount
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        placeholder="cvv"
                        className={`form-control travellerdetails payment_exp_date`}
                        name="cvv"
                        type="number"
                      />
                      <small
                        className="text-muted p-1"
                        style={{
                          position: "absolute",
                          right: 2,
                          top: 2,
                        }}
                      ></small>
                    </div>
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <button className="payNow">
                    Pay Now <i class="mx-2 fa-duotone fa-credit-card"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RechargeWalletPopup;
