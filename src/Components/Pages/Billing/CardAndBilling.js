import React, { useState } from "react";
import Header from "../../CommonComponents/Header";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import BillingCardSave from "./BillingCardSave";
import RechargeWalletPopup from "./RechargeWalletPopup";
import { useSelector } from "react-redux";
import AddNewAddress from "./AddNewAddress";

function CardAndBilling() {
  const [cardPopUp, setCardPopUp] = useState(false);
  const [billingPopUp, setBillingPopUp] = useState(false);
  // const cardRefresh = useSelector((state)=>state.cardListRefresh)
  // console.log("This is card refresh",cardRefresh);
  const accountDetails = useSelector((state) => state.accountDetails);
  const cardList = useSelector((state) => state.cardList);
  const billingList = useSelector((state) => state.billingList);
  console.log("Card list", cardList);
  console.log("Billing list", billingList);
  const [rechargePopUp, setRechargePopUp] = useState(false);
  const handleCardPopup = (value) => {
    setCardPopUp(value);
  };
  const handleBillingPopup = (value) => {
    setBillingPopUp(value);
  };
  const handleRechargePopup = (value) => {
    setRechargePopUp(value);
  };

  const downloadImage = async (imageUrl, fileName) => {
    console.log("This is invoice", imageUrl, fileName);
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
                      <div className="itemWrapper b">
                        <div className="heading">
                          <i className="fa-duotone fa-ballot"></i> Upcoming
                          Transaction
                        </div>
                        <div className="data-number">
                          $ 200.<sub style={{ fontSize: 14 }}>00</sub>
                        </div>
                        <div className="label">
                          Date: <span className="float-end">16-01-2024</span>
                        </div>
                        <div className="label">
                          Package:{" "}
                          <span className="float-end">Basic Package</span>
                        </div>
                        <div className="label">
                          Tenure:{" "}
                          <span className="float-end">Yearly Basis</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4">
                      <div className="itemWrapper a">
                        <div className="heading">
                          <i className="fa-duotone fa-credit-card"></i> Wallet
                          Balance
                        </div>
                        <div className="data-number">
                          $ {accountDetails?.balance?.amount.split(".")[0]}.
                          <sub style={{ fontSize: 14 }}>
                            {accountDetails?.balance?.amount.split(".")[1]}
                          </sub>
                        </div>
                        <div className="label">
                          Active Card:{" "}
                          <span className="float-end">**** **** **** 4444</span>
                        </div>
                        <div className="label">
                          Holder's Name:{" "}
                          <span className="float-end">John Adam Eve Smith</span>
                        </div>
                        <div
                          onClick={() => setRechargePopUp(true)}
                          className="cartButton mt-1"
                        >
                          Recharge Now
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row pt-2">
                    <div className="profileView pb-0">
                      <div className="profileDetailsHolder position-relative">
                        <div className="col-xl-12">
                          <div className="header d-flex align-items-center justify-content-between">
                            <div className="col-5">Payment Method</div>
                            <div className="col-5 text-end">
                              <button
                                className="panelButton m-0"
                                onClick={() => setCardPopUp(true)}
                              >
                                <i className="fa-regular fa-plus"></i> Add a
                                Card
                              </button>
                            </div>
                          </div>
                          <div className="row px-2 pt-2 gy-3">
                            {cardList &&
                              cardList.map((item,key) => {
                                return (
                                  <div className="col-xl-6" key={key}>
                                    <div className="savedCardWrapper active">
                                      <div className="imgWrapper">
                                        <div className="card-logo-container">
                                          <Cards
                                            number={item.card_number}
                                            name=""
                                            expiry=""
                                            cvc=""
                                            focused=""
                                          />
                                        </div>
                                      </div>
                                      <div className="ms-4">
                                        <label>
                                          **** **** ****{" "}
                                          {item.card_number.slice(-4)}
                                        </label>
                                      </div>
                                      <div className="ms-auto">
                                        <label className="switch">
                                          <input
                                            type="checkbox"
                                            id="showAllCheck"
                                            defaultChecked={true}
                                          />
                                          <span className="slider round"></span>
                                        </label>
                                      </div>
                                      <div className="ms-3">
                                        <button className="clearButton">
                                          <i className="fa-duotone text-danger fa-trash"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
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
                            <div className="header d-flex align-items-center justify-content-between">
                              <div className="col-5">Billing Information</div>
                              <button
                                className="panelButton m-0"
                                onClick={() => setBillingPopUp(true)}
                              >
                                <i className="fa-regular fa-plus"></i> Add New
                                Address
                              </button>
                            </div>
                            {billingList &&
                              billingList.map((item, key) => {
                                return (
                                  <div
                                  key={key}
                                    className="accordion accordion-flush pt-3"
                                    id={key}
                                  >
                                    <div className="accordion-item">
                                      <h2 className="accordion-header addressDrawer active">
                                        <div
                                          className="d-flex flex-wrap align-items-center"
                                          style={{ padding: "0 10px" }}
                                        >
                                          <div className="col-11">
                                            <button
                                              className="accordion-button collapsed justify-content-between"
                                              type="button"
                                              data-bs-toggle="collapse"
                                              data-bs-target={`#flush-collapse${key}`}
                                              aria-expanded="false"
                                              aria-controls={`flush-collapse${key}`}
                                            >
                                              <div>
                                                <h5 className="mb-0">
                                                  {item.fullname}
                                                </h5>
                                              </div>
                                            </button>
                                          </div>
                                          <div className="ms-auto d-flex">
                                            <label className="switch">
                                              <input
                                                type="checkbox"
                                                id="showAllCheck"
                                                defaultChecked={true}
                                              />
                                              <span className="slider round"></span>
                                            </label>
                                          </div>
                                        </div>
                                      </h2>
                                      <div
                                        id={`flush-collapse${key}`}
                                        className="accordion-collapse collapse"
                                        data-bs-parent={`#${key}`}
                                      >
                                        <div className="accordion-body">
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
                                                  value={item.fullname}
                                                  disabled
                                                />
                                              </li>
                                              <li>
                                                <input
                                                  type="text"
                                                  className="formItem"
                                                  value={item.contact_no}
                                                  disabled
                                                />
                                              </li>
                                              <li>
                                                <input
                                                  type="text"
                                                  className="formItem"
                                                  value={item.email}
                                                  disabled
                                                />
                                              </li>
                                              <li>
                                                <input
                                                  type="text"
                                                  className="formItem"
                                                  value={item.address}
                                                  disabled
                                                />
                                              </li>
                                              <li>
                                                <input
                                                  type="text"
                                                  className="formItem"
                                                  value={item.city}
                                                  disabled
                                                />
                                              </li>
                                              <li>
                                                <input
                                                  type="text"
                                                  className="formItem"
                                                  value={item.state}
                                                  disabled
                                                />
                                              </li>
                                              <li>
                                                <input
                                                  type="text"
                                                  className="formItem"
                                                  value={item.zip}
                                                  disabled
                                                />
                                              </li>
                                              <li>
                                                <input
                                                  type="text"
                                                  className="formItem"
                                                  value={item.country}
                                                  disabled
                                                />
                                              </li>
                                            </div>
                                          </ul>
                                          <div className="d-flex mt-2">
                                            <div className="me-3">
                                              <button className="clearButton fw-medium ps-0">
                                                <i className="fa-duotone fa-pen-to-square me-1"></i>{" "}
                                                Edit
                                              </button>
                                            </div>
                                            <div>
                                              <button className="clearButton fw-medium text-danger">
                                                <i className="fa-duotone fa-trash me-1"></i>{" "}
                                                Delete
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="col-xl-12">
                    <div className="itemWrapper c h-100">
                      <div className="heading">
                        <i className="fa-duotone fa-file-invoice"></i> Invoices
                      </div>
                      <ul className="invoiceList">
                        {accountDetails.payments.map((item, key) => {
                          return (
                            <li key={key}>
                              <div className="col-7">
                                <p>{item.transaction_date}</p>
                                <span>#{item.transaction_id}</span>
                              </div>
                              <div className="me-2" style={{ width: 55 }}>
                                <p>${item.amount_subtotal}</p>
                              </div>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  downloadImage(
                                    item.invoice_url,
                                    `invoice${
                                      item.transaction_date.split(" ")[0]
                                    }`
                                  )
                                }
                              >
                                <i className="fa-duotone fa-files me-1"></i> PDF
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                  <div className="col-xl-12 mt-3">
                    <div className="itemWrapper c">
                      <div className="heading">
                        <i className="fa-duotone fa-ballot-check"></i> Last
                        Transaction
                      </div>
                      <div className="data-number">
                        ${" "}
                        {
                          accountDetails?.payments[0].amount_subtotal.split(
                            "."
                          )[0]
                        }
                        .
                        <sub style={{ fontSize: 14 }}>
                          {
                            accountDetails?.payments[0].amount_subtotal.split(
                              "."
                            )[1]
                          }
                        </sub>
                      </div>
                      <div className="label">
                        Date:{" "}
                        <span className="float-end">
                          {
                            accountDetails?.payments[0].transaction_date.split(
                              " "
                            )[0]
                          }
                        </span>
                      </div>
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

        {billingPopUp ? (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <AddNewAddress closePopup={handleBillingPopup} />
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
