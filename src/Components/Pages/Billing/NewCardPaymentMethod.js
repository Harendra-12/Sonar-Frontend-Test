import React from 'react'
import Cards from "react-credit-cards-2";
import * as cardValidator from "card-validator";
import "react-credit-cards-2/dist/es/styles-compiled.css";

function NewCardPaymentMethod() {
    return (
        <>
            <style>
                {`
            .form-control.error-border{
                border: 1px solid red;
            }
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
            <div className="col-xl-8">
                <div className="cardDetailsWrapper">
                    <div className='row'>
                        <div className='col-6'>
                            <div className="col-12 border-start border-4 border-success mb-3 px-3">
                                <h5>Billing Information
                                </h5>
                            </div>
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
                                                    data-bs-target="#flush-collapse3"
                                                    aria-expanded="false"
                                                    aria-controls="flush-collapse3"
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
                                        id="flush-collapse3"
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
                            <div className="col-12 mt-2">
                                <div className="text-center">
                                    <label style={{ fontWeight: 500, fontSize: 18, color: 'var(--color-subtext)' }}>OR</label>
                                </div>
                            </div>
                            <div className="col-12">
                                <button className="clearButton w-100">
                                    Choose a new Billing Address <i class="fa-sharp fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                            {false ? <div className="card-details position-relative">
                                <div className="card1 card-body1">
                                    <div className="row">
                                        <div className="col-xl-12">
                                            <div className="form-group">
                                                <label className="review-label">
                                                    Full Name
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input
                                                    placeholder="Enter Full Name"
                                                    className={`form-control travellerdetails`}
                                                    name="cardName"
                                                    id="traveller_name_on_card"
                                                    type="text"
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-12 mt-1 mb-0">
                                            <div className="form-group">
                                                <label className="review-label">
                                                    Phone Number
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input
                                                    placeholder="Enter Phone Number"
                                                    maxLength={16}
                                                    className={`form-control travellerdetails`}
                                                    name="cardNumber"
                                                    id="traveller_card_number"
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-12 mt-1 mb-0">
                                            <div className="form-group">
                                                <label className="review-label">
                                                    Email Address
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input
                                                    placeholder="Enter Email"
                                                    maxLength={16}
                                                    className={`form-control travellerdetails`}
                                                    name="cardNumber"
                                                    id="traveller_card_number"
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-12 mt-1 mb-0">
                                            <div className="form-group">
                                                <label className="review-label">
                                                    Address
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input
                                                    placeholder="Address"
                                                    maxLength={16}
                                                    className={`form-control travellerdetails`}
                                                    name="cardNumber"
                                                    id="traveller_card_number"
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-6 mt-1">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="form-group">
                                                        <label className="review-label text-nowrap">
                                                            City
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <input
                                                            placeholder="YEAR"
                                                            className={`form-control travellerdetails payment_exp_date`}
                                                            name="traveller_card_cvv"
                                                            type="number"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-6 mt-1">
                                            <div className="form-group">
                                                <label className="review-label">
                                                    State
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <div className="position-relative">
                                                    <input
                                                        placeholder="cvv"
                                                        className={`form-control travellerdetails payment_exp_date`}
                                                        name="cvv"
                                                        type="number"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-6 mt-1">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="form-group">
                                                        <label className="review-label text-nowrap">
                                                            Zip Code
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <input
                                                            placeholder="YEAR"
                                                            className={`form-control travellerdetails payment_exp_date`}
                                                            name="traveller_card_cvv"
                                                            type="number"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-6 mt-1">
                                            <div className="form-group">
                                                <label className="review-label">
                                                    Country
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <div className="position-relative">
                                                    <input
                                                        placeholder="cvv"
                                                        className={`form-control travellerdetails payment_exp_date`}
                                                        name="cvv"
                                                        type="number"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> : ""}
                        </div>
                        <div className='col-6'>
                            <div className="col-12 border-start border-4 border-success mb-3 px-3">
                                <h5>Credit Card Information
                                    <span className="float-end clearButton text-danger fs-4" style={{ cursor: 'pointer' }}><i class="fa-sharp fa-solid fa-xmark"></i></span>
                                </h5>
                            </div>
                            <div className="mb-4">
                                <Cards
                                    number={"cardDetails.cardNumber"}
                                    expiry={"cardDetails.expiryDate"}
                                    cvc={"cardDetails.cvv"}
                                    name={"cardDetails.cardName"}
                                    focused={"cardDetails.focused"}
                                />
                            </div>
                            <div className="card-details position-relative">
                                <div className="card1 card-body1">
                                    <div className="row">
                                        <div className="col-xl-12">
                                            <div className="form-group">
                                                <label className="review-label">
                                                    Card Holder's Name
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input
                                                    placeholder="Card Holder's Name"
                                                    className={`form-control travellerdetails`}
                                                    name="cardName"
                                                    id="traveller_name_on_card"
                                                    type="text"
                                                    autoComplete="off"
                                                // onChange={(e) => {
                                                //   handleChange(e);
                                                // }}
                                                // onFocus={() =>
                                                //   setCardDetails((prevData) => ({
                                                //     ...prevData,
                                                //     focused: "",
                                                //   }))
                                                // }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-xl-12 mt-1 mb-0">
                                            <div className="form-group">
                                                <label className="review-label">
                                                    Card Number
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <div className="tvlrFormField make_relative card-reader position-relative">
                                                    <span id="CreditCardImg" className="CreditCardImg" />
                                                    <svg
                                                        className="cardImage position-absolute"
                                                        style={{
                                                            width: 35,
                                                            height: 35,
                                                            top: "-2px",
                                                            right: 2,
                                                        }}
                                                    //   {...getCardImageProps({ images })}
                                                    />
                                                    <input
                                                        placeholder="Card Number"
                                                        maxLength={16}
                                                        className={`form-control travellerdetails`}
                                                        name="cardNumber"
                                                        id="traveller_card_number"
                                                        type="text"
                                                    // value={cardNumber}

                                                    //   {...getCardNumberProps({
                                                    //     onChange: (e) => {
                                                    //       handleChange(e);
                                                    //     },
                                                    //   })}
                                                    //   onFocus={() =>
                                                    //     setCardDetails((prevData) => ({
                                                    //       ...prevData,
                                                    //       focused: "",
                                                    //     }))
                                                    //   }
                                                    />
                                                    <div style={{ clear: "both" }} />

                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-6 mt-1 mb-3">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="form-group">
                                                        <label className="review-label text-nowrap">
                                                            Expiry Date
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <input
                                                            placeholder="YEAR"
                                                            className={`form-control travellerdetails payment_exp_date`}
                                                            name="traveller_card_cvv"
                                                            type="number"
                                                        // {...getExpiryDateProps({
                                                        //   onChange: (e) => {
                                                        //     handleChange(e);
                                                        //   },
                                                        // })}
                                                        // onFocus={() =>
                                                        //   setCardDetails((prevData) => ({
                                                        //     ...prevData,
                                                        //     focused: "",
                                                        //   }))
                                                        // }
                                                        />
                                                        {/* <small className="error">
                        {erroredInputs.expiryDate
                          ? "Enter correct Expiry Date"
                          : ""}
                      </small> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-6 mt-1 mb-3">
                                            <div className="form-group">
                                                <label className="review-label">
                                                    CVV Code
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <div className="position-relative">
                                                    <input
                                                        placeholder="cvv"
                                                        className={`form-control travellerdetails payment_exp_date`}
                                                        name="cvv"
                                                        type="number"
                                                    //   onChange={(e) => {
                                                    //     handleChange(e);
                                                    //   }}
                                                    //   onFocus={() =>
                                                    //     setCardDetails((prevData) => ({
                                                    //       ...prevData,
                                                    //       focused: "cvc",
                                                    //     }))
                                                    //   }
                                                    />
                                                    {/* <small className="error">
                      {errorCard.cvv ? "Enter correct CVV" : ""}
                    </small> */}
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
                                        <div className="col-12">
                                            <button className="payNow">
                                                {" "}
                                                Pay Now <i class="mx-2 fa-duotone fa-credit-card"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewCardPaymentMethod