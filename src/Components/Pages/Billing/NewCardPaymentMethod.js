/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { useCreditCardValidator, images } from "react-creditcard-validator";
import { useDispatch, useSelector } from "react-redux";
import * as cardValidator from "card-validator";
import { generalPostFunction } from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";

function NewCardPaymentMethod({
  closePopUp2,
  mainPopUpClose,
  rechargeType,
  selectedDid,
}) {
  const dispatch = useDispatch();
  const accountDetailsRefresh = useSelector(
    (state) => state.accountDetailsRefresh
  );
  const billingListRefresh = useSelector((state) => state.billingListRefresh);
  const cardListRefresh = useSelector((state) => state.cardListRefresh);
  const account = useSelector((state) => state.account);
  const billingList = useSelector((state) => state.billingList);
  const cardList = useSelector((state) => state.cardList);
  const [newBilling, setNewBilling] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState();
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
  } = useCreditCardValidator();
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    focused: "",
    amount: "",
  });
  const [errorCard, setErrorCard] = useState({
    cardNumber: false,
    expiryDate: false,
    cvv: false,
    cardName: false,
    focused: false,
    amount: false,
  });

  // Filter out the default billing address
  useEffect(() => {
    billingList?.map((item) => {
      if (item.default) {
        setSelectedBillId(item.id);
      }
    });
    if (billingList?.length === 0) {
      setNewBilling(true);
    }
  }, [billingList]);
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
    if (cardDetails.cardNumber?.length > 0) {
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
    if (!cardValidator.number(cardDetails.cardNumber).isValid) {
      setErrorCard((prevData) => ({
        ...prevData,
        cardNumber: true,
      }));
    }
    if (cardDetails.cvv?.length < 3 || cardDetails.cvv?.length > 6) {
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
    if (cardDetails.amount === "") {
      setErrorCard((prevData) => ({
        ...prevData,
        amount: true,
      }));
    }
    if (newBilling) {
      Object.keys(billing)?.map((item) => {
        if (billing[item] === "") {
          setErrorBilling((prevData) => ({
            ...prevData,
            [item]: true,
          }));
        } else if (item === "phone") {
          // console.log(billing[item]?.length,"This is loop",item);
          if (billing[item]?.length > 15 || billing[item]?.length < 8) {
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
      if (
        !(cardDetails.cardName === "") &&
        !(rechargeType !== "buyDid" && cardDetails.amount === "") &&
        !(cardDetails.expiryDate === "") &&
        !(cardDetails.cvv?.length < 3 || cardDetails.cvv?.length > 6) &&
        cardValidator.number(cardDetails.cardNumber).isValid &&
        !Object.keys(billing)?.map((item) => {
          if (billing[item] === "") {
            return true;
          } else if (item === "phone") {
            if (billing[item]?.length > 15 || billing[item]?.length < 8) {
              return true;
            }
          } else if (item === "email") {
            if (
              !(billing[item].includes("@") || billing[item].includes("."))
            ) {
              return true;
            }
          }
        })
          .includes(true)
      ) {
        setLoading(true);
        const year = new Date().getFullYear();
        if (rechargeType === "buyDid") {
          const year = new Date().getFullYear();
          const parsedData = {
            type: "card",
            account_id: account.account_id,
            address_id: selectedBillId,
            // amount: cardDetails.amount,
            card_number: cardDetails.cardNumber.split(" ").join(""),
            name: cardDetails.cardName,
            save_card: saveCard,
            exp_month: cardDetails.expiryDate.split("/")[0],
            exp_year: Number(
              String(year).slice(0, 2) +
              String(cardDetails.expiryDate.split("/")[1])
            ),
            cvc: cardDetails.cvv,
            fullname: billing.name,
            contact_no: billing.phone,
            email: billing.email,
            address: billing.address,
            zip: billing.zip,
            city: billing.city,
            state: billing.state,
            country: billing.country,
            accountId: selectedDid[0].vendorAccountId,
            dids: selectedDid?.map((item) => {
              return {
                dids: item.id,
              };
            }),
            vendorId: selectedDid[0].vendorId,
            didQty: selectedDid?.length,
            companyId: account.account_id,
            didType: "random",
            rate: Number(selectedDid[0].price) * selectedDid?.length,
          };

          const apiData = await generalPostFunction("/purchaseTfn", parsedData);
          if (apiData.status) {
            setLoading(false);
            toast.success(apiData.message);
            setLoading(false);
            setTimeout(() => {
              mainPopUpClose(false);
            }, 2000);
          } else {
            setLoading(false);
            toast.error(apiData.error);
          }
        } else {
          const parsedData = {
            type: "card",
            account_id: account.account_id,
            address_id: selectedBillId,
            amount: cardDetails.amount,
            card_number: cardDetails.cardNumber.split(" ").join(""),
            name: cardDetails.cardName,
            save_card: saveCard,
            exp_month: cardDetails.expiryDate.split("/")[0],
            exp_year: Number(
              String(year).slice(0, 2) +
              String(cardDetails.expiryDate.split("/")[1])
            ),
            cvc: cardDetails.cvv,
            fullname: billing.name,
            contact_no: billing.phone,
            email: billing.email,
            address: billing.address,
            zip: billing.zip,
            city: billing.city,
            state: billing.state,
            country: billing.country,
          };
          const apiData = await generalPostFunction(
            "/wallet-recharge",
            parsedData
          );
          if (apiData.status) {
            toast.success(apiData.message);
            setLoading(false);
            dispatch({
              type: "SET_ACCOUNTDETAILSREFRESH",
              accountDetailsRefresh: accountDetailsRefresh + 1,
            });
            dispatch({
              type: "SET_BILLINGLISTREFRESH",
              billingListRefresh: billingListRefresh + 1,
            });
            dispatch({
              type: "SET_CARDLISTREFRESH",
              cardListRefresh: cardListRefresh + 1,
            });
            setTimeout(() => {
              mainPopUpClose(false);
            }, 2000);
          } else {
            setLoading(false);
            const errorMessage = Object.keys(apiData.errors);
            toast.error(apiData.errors[errorMessage[0]][0]);
            console.log("Old address error", apiData);
          }
        }
      }
    } else {
      if (selectedBillId === undefined && newBilling === false) {
        toast.error("Please select a billing address");
      }
      if (
        !(selectedBillId === undefined && newBilling === false) &&
        !(cardDetails.cardName === "") &&
        !(rechargeType !== "buyDid" && cardDetails.amount === "") &&
        !(cardDetails.expiryDate === "") &&
        !(cardDetails.cvv?.length < 3 || cardDetails.cvv?.length > 6) &&
        cardValidator.number(cardDetails.cardNumber).isValid
      ) {
        console.log("This is card number", cardDetails.cardNumber);
        setLoading(true);
        if (rechargeType === "buyDid") {
          const year = new Date().getFullYear();
          const parsedData = {
            type: "card",
            account_id: account.account_id,
            address_id: selectedBillId,
            amount: cardDetails.amount,
            card_number: cardDetails.cardNumber.split(" ").join(""),
            name: cardDetails.cardName,
            save_card: saveCard,
            exp_month: cardDetails.expiryDate.split("/")[0],
            exp_year: Number(
              String(year).slice(0, 2) +
              String(cardDetails.expiryDate.split("/")[1])
            ),
            cvc: cardDetails.cvv,
            rate: Number(selectedDid[0].price) * selectedDid?.length,
            accountId: selectedDid[0].vendorAccountId,
            dids: selectedDid?.map((item) => {
              return {
                dids: item.id,
              };
            }),
            vendorId: selectedDid[0].vendorId,
            didQty: selectedDid?.length,
            companyId: account.account_id,
            didType: "random",
          };

          const apiData = await generalPostFunction("/purchaseTfn", parsedData);
          if (apiData.status) {
            setLoading(false);
            toast.success(apiData.message);
            setLoading(false);
            setTimeout(() => {
              mainPopUpClose(false);
            }, 2000);
          } else {
            setLoading(false);
            toast.error(apiData.error);
          }
        } else {
          const year = new Date().getFullYear();
          const parsedData = {
            type: "card",
            account_id: account.account_id,
            address_id: selectedBillId,
            amount: cardDetails.amount,
            card_number: cardDetails.cardNumber.split(" ").join(""),
            name: cardDetails.cardName,
            save_card: saveCard,
            exp_month: cardDetails.expiryDate.split("/")[0],
            exp_year: Number(
              String(year).slice(0, 2) +
              String(cardDetails.expiryDate.split("/")[1])
            ),
            cvc: cardDetails.cvv,
          };
          const apiData = await generalPostFunction(
            "/wallet-recharge",
            parsedData
          );
          if (apiData.status) {
            toast.success(apiData.message);
            setLoading(false);
            dispatch({
              type: "SET_ACCOUNTDETAILSREFRESH",
              accountDetailsRefresh: accountDetailsRefresh + 1,
            });
            dispatch({
              type: "SET_CARDLISTREFRESH",
              cardListRefresh: cardListRefresh + 1,
            });
            setTimeout(() => {
              mainPopUpClose(false);
            }, 2000);
          } else {
            setLoading(false);
            const errorMessage = Object.keys(apiData.errors);
            toast.error(apiData.errors[errorMessage[0]][0]);
          }
        }
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
      <div className="col-xl-8 ">
        <div className="cardDetailsWrapper">
          <div className="row">
            <div
              className="col-6"
              style={{ maxHeight: 538, overflowY: "auto" }}
            >
              <div className="col-12 border-start border-4 border-success mb-3 px-3">
                <h5>Billing Information</h5>
              </div>
              {newBilling ? (
                <div className="row">
                  <div className="form-group mb-1">
                    <label className="formLabel">
                      Full Name
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      placeholder="Name"
                      name="name"
                      className={`formItem ${errorBilling.name ? "error-border" : ""
                        }`}
                      onChange={(e) => billingChnage(e)}
                      type="text"
                    />
                  </div>
                  <div className="form-group mb-1">
                    <label className="formLabel">
                      Phone
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      placeholder="Phone number"
                      name="phone"
                      className={`formItem ${errorBilling.phone ? "error-border" : ""
                        }`}
                      onChange={(e) => billingChnage(e)}
                      type="number"
                    />
                  </div>
                  <div className="form-group mb-1">
                    <label className="formLabel">
                      Email
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      placeholder="Email Address"
                      name="email"
                      className={`formItem ${errorBilling.email ? "error-border" : ""
                        }`}
                      onChange={(e) => billingChnage(e)}
                      type="email"
                    />
                  </div>
                  <div className="form-group mb-1">
                    <label className="formLabel">
                      Address
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      placeholder="Full address"
                      name="address"
                      className={`formItem ${errorBilling.address ? "error-border" : ""
                        }`}
                      onChange={(e) => billingChnage(e)}
                      type="text"
                    />
                  </div>
                  <div className="form-group col-xl-6 mb-1">
                    <label className="formLabel">
                      City
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      placeholder="City"
                      name="city"
                      className={`formItem ${errorBilling.city ? "error-border" : ""
                        }`}
                      onChange={(e) => billingChnage(e)}
                      type="text"
                    />
                  </div>
                  <div className="form-group col-xl-6 mb-1">
                    <label className="formLabel">
                      State
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      placeholder="State"
                      name="state"
                      className={`formItem ${errorBilling.state ? "error-border" : ""
                        }`}
                      onChange={(e) => billingChnage(e)}
                      type="text"
                    />
                  </div>
                  <div className="form-group mb-1">
                    <label className="formLabel">
                      Zip Code
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      placeholder="Zip Code"
                      name="zip"
                      className={`formItem ${errorBilling.zip ? "error-border" : ""
                        }`}
                      onChange={(e) => billingChnage(e)}
                      type="text"
                    />
                  </div>
                  <div className="form-group mb-1">
                    <label className="formLabel">
                      Country
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      placeholder="Country"
                      name="country"
                      className={`formItem ${errorBilling.country ? "error-border" : ""
                        }`}
                      onChange={(e) => billingChnage(e)}
                      type="text"
                    />
                  </div>
                </div>
              ) : (
                <>
                  {billingList &&
                    billingList?.map((item, key) => {
                      return (
                        <div
                          key={key}
                          className="accordion accordion-flush pt-3"
                          id={key}
                        >
                          <div className="accordion-item">
                            <h2
                              className={`accordion-header addressDrawer ${selectedBillId === item.id ? "active" : ""
                                }`}
                            >
                              <div
                                className="d-flex flex-wrap align-items-center"
                                style={{ padding: "0 10px" }}
                              >
                                <div className="col-10">
                                  <button
                                    className="accordion-button collapsed justify-content-between"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#flush-collapse${key}newBill`}
                                    aria-expanded="false"
                                    aria-controls={`flush-collapse${key}newBill`}
                                    style={{ boxShadow: "none" }}
                                  >
                                    <div>
                                      <h5
                                        className="mb-0"
                                        style={{
                                          maxWidth: 200,
                                          textOverflow: "ellipsis",
                                          overflow: "hidden",
                                        }}
                                      >
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
                                      checked={
                                        selectedBillId === item.id
                                          ? true
                                          : false
                                      }
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedBillId(item.id);
                                        }
                                      }}
                                    />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                            </h2>
                            <div
                              id={`flush-collapse${key}newBill`}
                              className="accordion-collapse collapse"
                              data-bs-parent={`#${key}`}
                            >
                              <div className="accordion-body">
                                <ul className="billingDetails">
                                  <div
                                    className="pe-3"
                                    style={{ width: "35%" }}
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
                                  <div style={{ width: "65%" }}>
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
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                    onClick={() => {
                      if (billingList?.length === 0 && cardList?.length === 0) {
                        mainPopUpClose(false);
                      } else {
                        closePopUp2(false);
                      }
                    }}
                    className="float-end clearButton text-danger fs-4"
                    style={{ cursor: "pointer" }}
                  >
                    <i class="fa-sharp fa-solid fa-xmark"></i>
                  </span>
                </h5>
              </div>
              <div className="mb-4">
                <Cards
                  number={cardDetails.cardNumber}
                  expiry={cardDetails.expiryDate}
                  cvc={cardDetails.cvv}
                  name={cardDetails.cardName}
                  focused={cardDetails.focused}
                />
              </div>
              <div className="card-details position-relative">
                <div className="card1 card-body1">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="form-group">
                        <label className="formLabel">
                          Card Holder's Name
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          placeholder="Card Holder's Name"
                          className={`formItem ${errorCard.cardName ? "error-border" : ""
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
                        <label className="formLabel">
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
                            className={`formItem ${errorCard.cardNumber ? "error-border" : ""
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
                    <div className="col-xl-3 mt-1 mb-3">
                      <div className="row">
                        <div className="col-12">
                          <div className="form-group">
                            <label className="formLabel text-nowrap">
                              Expiry Date
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              placeholder="YEAR"
                              className={`formItem payment_exp_date ${errorCard.expiryDate ? "error-border" : ""
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
                    <div className="col-xl-3 mt-1 mb-3">
                      <div className="form-group">
                        <label className="formLabel">
                          CVV Code
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="position-relative">
                          <input
                            placeholder="cvv"
                            className={`formItem payment_exp_date ${errorCard.cvv ? "error-border" : ""
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
                    {rechargeType === "buyDid" ? (
                      ""
                    ) : (
                      <div className="col-xl-6 mt-1 mb-3">
                        <div className="form-group">
                          <label className="formLabel">
                            Amount
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <div className="position-relative">
                            <input
                              placeholder="amount"
                              className={`formItem payment_exp_date ${errorCard.amount ? "error-border" : ""
                                }`}
                              name="amount"
                              type="number"
                              onChange={(e) => {
                                handleChange(e);
                              }}
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
                    )}
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
                      <button onClick={handleSubmit} className="panelButton static">
                        <span className="text">Pay Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading ? <CircularLoader widthAdjust={"w-100"} /> : ""}
    </>
  );
}

export default NewCardPaymentMethod;
