import React, { useEffect, useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { useCreditCardValidator, images } from "react-creditcard-validator";
import { useDispatch } from "react-redux";
import * as cardValidator from "card-validator";
import { generalPostFunction } from "../../GlobalFunction/globalFunction";
// import { generalGetFunction } from '../../GlobalFunction/globalFunction';
// import { useNavigate } from 'react-router-dom';

function NewCardPaymentMethod({ closePopUp2 }) {
  // const navigate = useNavigate()
  const dispatch = useDispatch();
  //   const routerData = router.query;
  const [newBilling, setNewBilling] = useState(false);
  const [packages, setPackages] = useState();
  const [loading, setLoading] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [billing, setBilling] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const [errorBilling, setErrorBilling] = useState({
    name: false,
    phone: false,
    email: false,
    address: false,
    city: false,
    state: false,
    zip: false,
    country: false,
  });

  function billingChnage(e) {
    const name = e.target.name;
    const value = e.target.value;
    setBilling((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorBilling((prevData) => ({
      ...prevData,
      [name]: false,
    }));
  }

  const {
    getCardNumberProps,
    getCardImageProps,
    // getCVCProps,
    getExpiryDateProps,
    meta: { erroredInputs },
  } = useCreditCardValidator();
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    focused: "",
  });
  const [errorCard, setErrorCard] = useState({
    cardNumber: false,
    expiryDate: false,
    cvv: false,
    cardName: false,
    focused: false,
  });

  //   Handle change for getting values from form
  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "expiryDate") {
      setCardDetails((prevState) => ({
        ...prevState,
        [name]: value.trim().replace(/\s+/g, ""),
      }));
    } else {
      setCardDetails((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    setErrorCard((prevState) => ({
      ...prevState,
      [name]: false,
    }));
  }

  // Validate card number
  useEffect(() => {
    if (cardDetails.cardNumber.length > 0) {
      if (cardValidator.number(cardDetails.cardNumber).isValid) {
        setErrorCard((prevData) => ({
          ...prevData,
          cardNumber: false,
        }));
      } else {
        setErrorCard((prevData) => ({
          ...prevData,
          cardNumber: true,
        }));
      }
    }
  }, [cardDetails.cardNumber]);

  async function handleSubmit() {
    // cardValidator.number(cardNumber).isValid;
    Object.keys(billing).map((item) => {
      if (billing[item] === "") {
        setErrorBilling((prevData) => ({
          ...prevData,
          [item]: true,
        }));
      } else if (item === "phone") {
        // console.log(billing[item].length,"This is loop",item);
        if (billing[item].length > 15 || billing[item].length < 8) {
          setErrorBilling((prevData) => ({
            ...prevData,
            phone: true,
          }));
        }
      } else if (item === "email") {
        if (
          !billing["email"].includes("@") &&
          !billing["email"].includes(".")
        ) {
          setErrorBilling((prevData) => ({
            ...prevData,
            email: true,
          }));
        }
      }
    });
    if (!cardValidator.number(cardDetails.cardNumber).isValid) {
      setErrorCard((prevData) => ({
        ...prevData,
        cardNumber: true,
      }));
    }
    if (cardDetails.cvv.length < 3 || cardDetails.cvv.length > 6) {
      setErrorCard((prevData) => ({
        ...prevData,
        cvv: true,
      }));
    }
    if (cardDetails.expiryDate === "") {
      setErrorCard((prevData) => ({
        ...prevData,
        expiryDate: true,
      }));
    }
    if (cardDetails.cardName === "") {
      setErrorCard((prevData) => ({
        ...prevData,
        cardName: true,
      }));
    }
    console.log(
      Object.keys(billing)
        .map((item) => {
          if (billing[item] === "") {
            return true;
          } else if (item === "phone") {
            if (billing[item].length > 15 || billing[item].length < 8) {
              return true;
            }
          } else if (item === "email") {
            if (!(billing[item].includes("@") || billing[item].includes("."))) {
              return true;
            }
          }
        })
        .includes(true)
    );
    if (
      !(cardDetails.cardName === "") &&
      !(cardDetails.expiryDate === "") &&
      !(cardDetails.cvv.length < 3 || cardDetails.cvv.length > 6) &&
      cardValidator.number(cardDetails.cardNumber).isValid &&
      !Object.keys(billing)
        .map((item) => {
          if (billing[item] === "") {
            return true;
          } else if (item === "phone") {
            if (billing[item].length > 15 || billing[item].length < 8) {
              return true;
            }
          } else if (item === "email") {
            if (!(billing[item].includes("@") || billing[item].includes("."))) {
              return true;
            }
          }
        })
        .includes(true)
    ) {
      setLoading(true);
      const year = new Date().getFullYear();
      const parsedData = {
        // account_id: routerData.account_id,
        amount: packages.offer_price,
        type: "card",
        card_number: Number(cardDetails.cardNumber.split(" ").join("")),
        exp_month: cardDetails.expiryDate.split("/")[0],
        exp_year: Number(
          String(year).slice(0, 2) +
            String(cardDetails.expiryDate.split("/")[1])
        ),
        cvc: cardDetails.cvv,
        name: cardDetails.cardName,
        // lead_id: routerData.leadId,
        fullname: billing.name,
        contact_no: billing.phone,
        email: billing.email,
        address: billing.address,
        zip: billing.zip,
        city: billing.city,
        state: billing.state,
        country: billing.country,
        save_card: saveCard,
      };
      const apidata = await generalPostFunction("pay", parsedData);
      if (apidata.status) {
        dispatch({
          type: "SET_INVOICE",
          invoiceLink: apidata.data.invoice_url,
        });
        dispatch({
          type: "SET_THANKYOUMESSAGE",
          thankYouMessage: `Your Payment is successfull with transaction id ${apidata.data.transaction_id} you will get an email soon. You can download invoice now.`,
        });
      } else {
        setLoading(false);
        // toast.error(apidata.message);
      }
    }
  }

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
          <div className="row">
            <div className="col-6">
              <div className="col-12 border-start border-4 border-success mb-3 px-3">
                <h5>Billing Information</h5>
              </div>
              {newBilling ? (
                <div className="row">
                  <div className="form-group mb-1">
                    <label className="review-label">
                      Full Name
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      placeholder="Name"
                      name="name"
                      className={`form-control travellerdetails ${
                        errorBilling.name ? "error-border" : ""
                      }`}
                      onChange={(e) => billingChnage(e)}
                      type="text"
                    />
                  </div>
                  <div className="form-group mb-1">
                    <label className="review-label">
                      Phone
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      placeholder="Phone number"
                      name="phone"
                      className={`form-control travellerdetails ${
                        errorBilling.phone ? "error-border" : ""
                      }`}
                      onChange={(e) => billingChnage(e)}
                      type="number"
                    />
                  </div>
                  <div className="form-group mb-1">
                    <label className="review-label">
                      Email
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      placeholder="Email Address"
                      name="email"
                      className={`form-control travellerdetails ${
                        errorBilling.email ? "error-border" : ""
                      }`}
                      onChange={(e) => billingChnage(e)}
                      type="email"
                    />
                  </div>
                  <div className="form-group mb-1">
                    <label className="review-label">
                      Address
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      placeholder="Full address"
                      name="address"
                      className={`form-control travellerdetails ${
                        errorBilling.address ? "error-border" : ""
                      }`}
                      onChange={(e) => billingChnage(e)}
                      type="text"
                    />
                  </div>
                  <div className="form-group col-xl-6 mb-1">
                    <label className="review-label">
                      City
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      placeholder="City"
                      name="city"
                      className={`form-control travellerdetails ${
                        errorBilling.city ? "error-border" : ""
                      }`}
                      onChange={(e) => billingChnage(e)}
                      type="text"
                    />
                  </div>
                  <div className="form-group col-xl-6 mb-1">
                    <label className="review-label">
                      State
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      placeholder="State"
                      name="state"
                      className={`form-control travellerdetails ${
                        errorBilling.state ? "error-border" : ""
                      }`}
                      onChange={(e) => billingChnage(e)}
                      type="text"
                    />
                  </div>
                  <div className="form-group mb-1">
                    <label className="review-label">
                      Zip Code
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      placeholder="Zip Code"
                      name="zip"
                      className={`form-control travellerdetails ${
                        errorBilling.zip ? "error-border" : ""
                      }`}
                      onChange={(e) => billingChnage(e)}
                      type="text"
                    />
                  </div>
                  <div className="form-group mb-1">
                    <label className="review-label">
                      Country
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      placeholder="Country"
                      name="country"
                      className={`form-control travellerdetails ${
                        errorBilling.country ? "error-border" : ""
                      }`}
                      onChange={(e) => billingChnage(e)}
                      type="text"
                    />
                  </div>
                  <div className="col-12 mb-2">
                    <input
                      type="checkbox"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                    />
                    <label class="formLabel ms-2">
                      Save this card for future use
                    </label>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    class="accordion accordion-flush cardPopup"
                    id="accordionFlushExample"
                  >
                    <div class="accordion-item">
                      <h2
                        class="accordion-header"
                        style={{
                          border: "1px solid green",
                          boxShadow: "#00ff1554 0px 3px 8px",
                          borderRadius: "10px",
                        }}
                      >
                        <div
                          className="d-flex flex-wrap align-items-center"
                          style={{ padding: "0 10px" }}
                        >
                          <div className="col-10">
                            <button
                              class="accordion-button collapsed justify-content-between px-2"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#flush-collapse3"
                              aria-expanded="false"
                              aria-controls="flush-collapse3"
                              style={{ padding: "15px 0" }}
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
                            <div className="pe-3" style={{ width: "45%" }}>
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
                            <div style={{ width: "55%" }}>
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
                      <label
                        style={{
                          fontWeight: 500,
                          fontSize: 18,
                          color: "var(--color-subtext)",
                        }}
                      >
                        OR
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button
                      className="clearButton w-100"
                      onClick={() => setNewBilling(true)}
                    >
                      Choose a new Billing Address{" "}
                      <i class="fa-sharp fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="col-6">
              <div className="col-12 border-start border-4 border-success mb-3 px-3">
                <h5>
                  Credit Card Information
                  <span
                    onClick={() => closePopUp2(false)}
                    className="float-end clearButton text-danger fs-4"
                    style={{ cursor: "pointer" }}
                  >
                    <i class="fa-sharp fa-solid fa-xmark"></i>
                  </span>
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
                          className={`form-control travellerdetails ${
                            errorCard.cardName ? "error-border" : ""
                          }`}
                          name="cardName"
                          id="traveller_name_on_card"
                          type="text"
                          autoComplete="off"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onFocus={() =>
                            setCardDetails((prevData) => ({
                              ...prevData,
                              focused: "",
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="col-xl-12 mt-1">
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
                            {...getCardImageProps({ images })}
                          />
                          <input
                            placeholder="Card Number"
                            maxLength={16}
                            className={`form-control travellerdetails ${
                              errorCard.cardNumber ? "error-border" : ""
                            }`}
                            name="cardNumber"
                            id="traveller_card_number"
                            type="text"
                            // value={cardNumber}

                            {...getCardNumberProps({
                              onChange: (e) => {
                                handleChange(e);
                              },
                            })}
                            onFocus={() =>
                              setCardDetails((prevData) => ({
                                ...prevData,
                                focused: "",
                              }))
                            }
                          />
                          {/* <small className="error">
                              {errorCard.cardNumber
                                ? "Enter valid card number"
                                : ""}
                            </small> */}
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
                              className={`form-control travellerdetails payment_exp_date ${
                                errorCard.expiryDate ? "error-border" : ""
                              }`}
                              name="traveller_card_cvv"
                              type="number"
                              {...getExpiryDateProps({
                                onChange: (e) => {
                                  handleChange(e);
                                },
                              })}
                              onFocus={() =>
                                setCardDetails((prevData) => ({
                                  ...prevData,
                                  focused: "",
                                }))
                              }
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
                            className={`form-control travellerdetails payment_exp_date ${
                              errorCard.cvv ? "error-border" : ""
                            }`}
                            name="cvv"
                            type="number"
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            onFocus={() =>
                              setCardDetails((prevData) => ({
                                ...prevData,
                                focused: "cvc",
                              }))
                            }
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
                    <div className="col-12 mb-2">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                      />
                      <label class="formLabel ms-2">
                        Save this card for future use
                      </label>
                    </div>
                    <div className="col-12">
                      <button onClick={handleSubmit} className="payNow">
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
  );
}

export default NewCardPaymentMethod;
