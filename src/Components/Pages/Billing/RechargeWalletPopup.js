import React, { useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import NewCardPaymentMethod from "./NewCardPaymentMethod";


function RechargeWalletPopup({ closePopup }) {
  const [newCardPopUp,setNewCardPopUp]=useState(false)
  function closeNewPopUp (){
    setNewCardPopUp(false)
  }
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
     
     
       {newCardPopUp?  <NewCardPaymentMethod closePopUp2={closeNewPopUp}/>: <div className="row">
        <div className="col-xl-4 mx-auto">
          <div className="profileView">
            <div className="profileDetailsHolder position-relative">
              <div className="header d-flex align-items-center">
                <div className="col-12">
                  Choose Your Card
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
                <div className="col-12">
                  <div className="savedCardWrapper active">
                    <div className="imgWrapper">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/200px-Mastercard_2019_logo.svg.png"
                        alt=""
                      />
                    </div>
                    <div className="ms-4">
                      <label>**** **** **** 9999</label>
                    </div>
                    <div className="ms-auto">
                      <label class="switch">
                        <input
                          type="checkbox"
                          id="showAllCheck"
                          defaultChecked={true}
                        />
                        <span class="slider round"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row" style={{ padding: "5px" }}>
                <div className="col-12">
                  <div className="text-center">
                    <label style={{ fontWeight: 500, fontSize: 18, color: 'var(--color-subtext)' }}>OR</label>
                  </div>
                </div>
                <div className="col-12">
                  <button className="clearButton w-100" onClick={()=>setNewCardPopUp(true)}>
                    Choose a new Payment Method <i class="fa-sharp fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
              <div className="header d-flex align-items-center">
                <div className="col-12">
                  Choose Billing Address
                </div>
              </div>
              <div className="row" style={{ padding: "5px" }}>
                <div class="col-12">
                  <div
                    class="accordion accordion-flush cardPopup"
                    id="accordionFlushExample"
                  >
                    <div class="accordion-item">
                      <h2 class="accordion-header" style={{ border: '1px solid green', boxShadow: '#00ff1554 0px 3px 8px', borderRadius: '10px' }}>
                        <div className="d-flex flex-wrap align-items-center" style={{ padding: '0 10px' }}>
                          <div className="col-10">
                            <button
                              class="accordion-button collapsed justify-content-between px-2"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#flush-collapse2"
                              aria-expanded="false"
                              aria-controls="flush-collapse2"
                              style={{ padding: '15px 0' }}
                            >
                              <h5 className="mb-0">John Doe</h5>
                            </button>
                          </div>
                          <div className="ms-auto d-flex">
                            <label class="switch">
                              <input
                                type="checkbox"
                                id="showAllCheck"
                                defaultChecked={true}
                              />
                              <span class="slider round"></span>
                            </label>
                          </div>
                        </div>
                      </h2>
                      <div
                        id="flush-collapse2"
                        class="accordion-collapse collapse"
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div class="accordion-body">
                          <ul className="billingDetails">
                            <div
                              className="pe-3"
                              style={{ width: '45%' }}
                            >
                              <li>
                                <span>Full Name:</span>
                              </li>
                              <li>
                                <span>Phone:</span>
                              </li>
                              <li>
                                <span>Email Address:</span>
                              </li>
                              <li>
                                <span>Address:</span>{" "}
                              </li>
                              <li>
                                <span>City:</span>{" "}
                              </li>
                              <li>
                                <span>State:</span>{" "}
                              </li>
                              <li>
                                <span>Zip Code:</span>{" "}
                              </li>
                              <li>
                                <span>Country:</span>{" "}
                              </li>
                            </div>
                            <div style={{ width: '55%' }}>
                              <li>
                                <input
                                  type="text"
                                  className="formItem"
                                  value={"John Doe"}
                                  disabled
                                />
                              </li>
                              <li>
                                <input
                                  type="text"
                                  className="formItem"
                                  value={"999 999-9999"}
                                  disabled
                                />
                              </li>
                              <li>
                                <input
                                  type="text"
                                  className="formItem"
                                  value={"john.doe@example.com"}
                                  disabled
                                />
                              </li>
                              <li>
                                <input
                                  type="text"
                                  className="formItem"
                                  value={"Here goes Full Address"}
                                  disabled
                                />
                              </li>
                              <li>
                                <input
                                  type="text"
                                  className="formItem"
                                  value={"City"}
                                  disabled
                                />
                              </li>
                              <li>
                                <input
                                  type="text"
                                  className="formItem"
                                  value={"State"}
                                  disabled
                                />
                              </li>
                              <li>
                                <input
                                  type="text"
                                  className="formItem"
                                  value={"999999"}
                                  disabled
                                />
                              </li>
                              <li>
                                <input
                                  type="text"
                                  className="formItem"
                                  value={"Country"}
                                  disabled
                                />
                              </li>
                            </div>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row" style={{ padding: "5px" }}>
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
                        name="CVV"
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
                        placeholder="Amount"
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
      </div>}      
           
    </>
  );
}

export default RechargeWalletPopup;
