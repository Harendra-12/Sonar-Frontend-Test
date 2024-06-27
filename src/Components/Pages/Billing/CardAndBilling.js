import React, { useState } from "react";
import Header from "../../CommonComponents/Header";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import BillingCardSave from "./BillingCardSave";
import RechargeWalletPopup from "./RechargeWalletPopup";
import { useSelector } from "react-redux";

function CardAndBilling() {
  const [cardPopUp, setCardPopUp] = useState(false);
  const accountDetails = useSelector((state)=>state.accountDetails)
  const [rechargePopUp, setRechargePopUp] = useState(false);
  const handleCardPopup = (value) => {
    setCardPopUp(value);
  };
  const handleRechargePopup = (value) => {
    setRechargePopUp(value);
  };

  const downloadImage = async (imageUrl, fileName) => {
    console.log("This is invoice",imageUrl,fileName);
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Payment Details" />
            <div className="col-xl-12 pt-3">
              <div className="row gy-3">
                <div className="col-xl-8">
                  <div className="row gy-3">
                    <div className="col-xl-4 billinCardWrapper">
                      <Cards
                        className="cardWrapper row align-items-center col-12 mx-auto"
                        number="4242424242424242"
                        expiry="02/26"
                        cvc="585"
                        name="Test card"
                      />
                    </div>
                    <div className="col-xl-4">
                      <div class="itemWrapper b">
                        <div class="heading">
                          <i class="fa-duotone fa-ballot"></i> Upcoming
                          Transaction
                        </div>
                        <div class="data-number">
                          $ 200.<sub style={{ fontSize: 14 }}>00</sub>
                        </div>
                        <div class="label">
                          Date: <span className="float-end">16-01-2024</span>
                        </div>
                        <div class="label">
                          Package:{" "}
                          <span className="float-end">Basic Package</span>
                        </div>
                        <div class="label">
                          Tenure:{" "}
                          <span className="float-end">Yearly Basis</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4">
                      <div class="itemWrapper a">
                        <div class="heading">
                          <i class="fa-duotone fa-ballot-check"></i>Wallet Balance
                        </div>
                        <div class="data-number">
                          $ {accountDetails?.balance?.amount.split(".")[0]}.<sub style={{ fontSize: 14 }}>{accountDetails?.balance?.amount.split(".")[1]}</sub>
                        </div>
                        <div class="label">
                          Active Card:{" "}
                          <span className="float-end">**** **** **** 4444</span>
                        </div>
                        <div class="label">
                          Holder's Name:{" "}
                          <span className="float-end">John Adam Eve Smith</span>
                        </div>
                        <div onClick={()=>setRechargePopUp(true)} class="cartButton mt-1">Recharge Now</div>
                      </div>
                    </div>
                  </div>
                  <div className="row pt-2">
                    <div className="profileView pb-0">
                      <div className="profileDetailsHolder position-relative">
                        <div className="col-xl-12">
                          <div class="header d-flex align-items-center justify-content-between">
                            <div class="col-5">Payment Method</div>
                            <div class="col-5 text-end">
                              <button
                                className="panelButton m-0"
                                onClick={() => setCardPopUp(true)}
                              >
                                <i class="fa-regular fa-plus"></i> Add a Card
                              </button>
                            </div>
                          </div>
                          <div className="row px-2 pt-2 gy-3">
                            <div className="col-xl-6">
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
                                <div className="ms-3">
                                  <button className="clearButton">
                                    <i class="fa-duotone text-danger fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="col-xl-6">
                              <div className="savedCardWrapper">
                                <div className="imgWrapper">
                                  <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Visa_2021.svg/220px-Visa_2021.svg.png"
                                    alt=""
                                  />
                                </div>
                                <div className="ms-4">
                                  <label>**** **** **** 8082</label>
                                </div>
                                <div className="ms-auto">
                                  <label class="switch">
                                    <input
                                      type="checkbox"
                                      id="showAllCheck"
                                      defaultChecked={false}
                                    />
                                    <span class="slider round"></span>
                                  </label>
                                </div>
                                <div className="ms-3">
                                  <button className="clearButton">
                                    <i class="fa-duotone text-danger fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row gy-3 pt-2">
                    <div className="col-xl-12">
                      <div className="profileView px-0">
                        <div className="profileDetailsHolder position-relative">
                          <div className="col-xl-12">
                            <div class="header d-flex align-items-center justify-content-between">
                              <div class="col-5">Billing Information</div>
                            </div>
                            <div
                              class="accordion accordion-flush"
                              id="accordionFlushExample"
                            >
                              <div class="accordion-item">
                                <h2 class="accordion-header">
                                  <button
                                    class="accordion-button collapsed justify-content-between"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#flush-collapseOne"
                                    aria-expanded="false"
                                    aria-controls="flush-collapseOne"
                                  >
                                    <div>
                                      <h5 className="mb-0">John Doe</h5>
                                    </div>
                                    <div className="d-flex me-3">
                                      <div className="me-2">
                                        <button className="clearButton fw-medium">
                                          <i class="fa-duotone fa-pen-to-square me-1"></i>{" "}
                                          Edit
                                        </button>
                                      </div>
                                      <div>
                                        <button className="clearButton fw-medium text-danger">
                                          <i class="fa-duotone fa-trash me-2"></i>
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  </button>
                                </h2>
                                <div
                                  id="flush-collapseOne"
                                  class="accordion-collapse collapse"
                                  data-bs-parent="#accordionFlushExample"
                                >
                                  <div class="accordion-body">
                                    <ul className="billingDetails">
                                      <div
                                        className="pe-3"
                                        style={{ width: "25%" }}
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
                                      <div>
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
                            {/* <div className="row px-2 pt-2 gy-3">
                              <div
                                className="col-10 col-xl-9"
                                style={{ padding: "15px 25px" }}
                              >
                                <h5 className="mb-3">John Doe</h5>
                                <ul className="billingDetails">
                                  <div className="pe-3">
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
                                  <div>
                                  <li>John Doe</li>
                                    <li>XY Co.</li>
                                    <li>john.doe@website.com</li>
                                    <li>**** **** **** 9999</li>
                                    <li>XY Co.</li>
                                    <li>john.doe@website.com</li>
                                    <li>**** **** **** 9999</li>
                                    <li>XY Co.</li>
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="col-3 d-flex justify-content-between"
                                style={{ padding: "15px 25px" }}
                              >
                                <div>
                                  <button className="clearButton fw-medium">
                                    <i class="fa-duotone fa-pen-to-square me-1"></i>{" "}
                                    Edit
                                  </button>
                                </div>
                                <div>
                                  <button className="clearButton fw-medium text-danger">
                                    <i class="fa-duotone fa-trash me-2"></i>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div> */}
                            {/* <div className="row px-2 pt-2 gy-3">
                              <div
                                className="col-10 col-xl-9"
                                style={{ padding: "15px 25px" }}
                              >
                                <h5 className="mb-3">Jane Dane</h5>
                                <ul className="billingDetails">
                                  <div className="pe-3">
                                    <li>
                                      <span>Company Name:</span>
                                    </li>
                                    <li>
                                      <span>Email Address:</span>
                                    </li>
                                    <li>
                                      <span>Card Number:</span>{" "}
                                    </li>
                                  </div>
                                  <div>
                                    <li>XY Co.</li>
                                    <li>john.doe@website.com</li>
                                    <li>**** **** **** 9999</li>
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="col-3 d-flex justify-content-between"
                                style={{ padding: "15px 25px" }}
                              >
                                <div>
                                  <button className="clearButton fw-medium">
                                    <i class="fa-duotone fa-pen-to-square me-1"></i>{" "}
                                    Edit
                                  </button>
                                </div>
                                <div>
                                  <button className="clearButton fw-medium text-danger">
                                    <i class="fa-duotone fa-trash me-2"></i>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="col-xl-12">
                    <div class="itemWrapper c h-100">
                      <div class="heading">
                        <i class="fa-duotone fa-file-invoice"></i> Invoices
                      </div>
                      <ul className="invoiceList">
                        {accountDetails.payments.map((item)=>{
                          return(
                            <li>
                            <div className="col-7">
                              <p>{item.transaction_date}</p>
                              <span>#{item.transaction_id}</span>
                            </div>
                            <div className="me-2" style={{ width: 55 }}>
                              <p>${item.amount_subtotal}</p>
                            </div>
                            <div style={{cursor:"pointer"}} onClick={()=>downloadImage(item.invoice_url,`invoice${item.transaction_date.split(" ")[0]}`)}>
                              
                                <i class="fa-duotone fa-files me-1"></i> PDF
                              
                            </div>
                          </li>
                          )
                          
                        })}
                      </ul>
                    </div>
                  </div>
                  <div className="col-xl-12 mt-3">
                    <div class="itemWrapper a">
                      <div class="heading">
                        <i class="fa-duotone fa-ballot-check"></i> Last
                        Transaction
                      </div>
                      <div class="data-number">
                        $ {accountDetails?.payments[0].amount_subtotal.split(".")[0]}.<sub style={{ fontSize: 14 }}>{accountDetails?.payments[0].amount_subtotal.split(".")[1]}</sub>
                      </div>
                      <div class="label">
                        Date: <span className="float-end">{accountDetails?.payments[0].transaction_date.split(" ")[0]}</span>
                      </div>
                      {/* <div class="label">
                        Package:{" "}
                        <span className="float-end">Basic Package</span>
                      </div>
                      <div class="label">
                        Tenure: <span className="float-end">Yearly Basis</span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {rechargePopUp ? (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <RechargeWalletPopup closePopup={handleRechargePopup} />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {cardPopUp ? (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <BillingCardSave closePopup={handleCardPopup} />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </section>
    </main>
  );
}

export default CardAndBilling;
