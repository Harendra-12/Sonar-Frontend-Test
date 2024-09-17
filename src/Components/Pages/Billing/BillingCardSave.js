import React, { useEffect, useState } from "react";
import { useCreditCardValidator, images } from "react-creditcard-validator";
import Cards from "react-credit-cards-2";
import * as cardValidator from "card-validator";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { useDispatch, useSelector } from "react-redux";
import { generalPostFunction } from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";

function BillingCardSave({ closePopup }) {
  const dispatch = useDispatch();
  const cardListRefresh = useSelector((state) => state.cardListRefresh);
  const [loading, setLoading] = useState(false);
  const account = useSelector((state) => state.account);
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
  });
  const [errorCard, setErrorCard] = useState({
    cardNumber: false,
    expiryDate: false,
    cvv: false,
    cardName: false,
    focused: false,
  });

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

  async function handleSubmit() {
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
    if (
      !(cardDetails.cardName === "") &&
      !(cardDetails.expiryDate === "") &&
      !(cardDetails.cvv.length < 3 || cardDetails.cvv.length > 6) &&
      cardValidator.number(cardDetails.cardNumber).isValid
    ) {
      setLoading(true);
      const year = new Date().getFullYear();
      const parsedData = {
        card_number: cardDetails.cardNumber.split(" ").join(""),
        exp_month: Number(cardDetails.expiryDate.split("/")[0]),
        exp_year: Number(
          String(year).slice(0, 2) +
            String(cardDetails.expiryDate.split("/")[1])
        ),
        cvc: cardDetails.cvv,
        name: cardDetails.cardName,
        save_card: 1,
        account_id: account.account_id,
      };
      const apiData = await generalPostFunction("/card/add", parsedData);
      if (apiData.status) {
        toast.success(apiData.message);
        setLoading(false);
        dispatch({
          type: "SET_CARDLISTREFRESH",
          cardListRefresh: cardListRefresh + 1,
        });
        setTimeout(() => {
          closePopup(false);
        }, 2000);
      } else {
        setLoading(false);
        const errorMessage = Object.keys(apiData.errors);
        toast.error(apiData.errors[errorMessage[0]][0]);
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
        `}
      </style>
      <div className="col-xl-4">
        <div className="cardDetailsWrapper">
          <div className="col-12 border-start border-4 border-success mb-3 px-3">
            <h5>
              Credit Card Information
              <span
                onClick={() => closePopup(false)}
                className="float-end clearButton text-danger fs-4"
                style={{ cursor: "pointer" }}
              >
                <i className="fa-sharp fa-solid fa-xmark"></i>
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
                      {errorCard.cardNumber ? "Enter valid card number" : ""}
                    </small> */}
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
                <div className="col-12">
                  <button onClick={handleSubmit} className="payNow">
                    {" "}
                    {loading ? (
                      <img
                        width="6%"
                        src={require("../../assets/images/loader-gif.webp")}
                        alt=""
                      />
                    ) : (
                      <>
                        {" "}
                        Add Card
                        <i className="mx-2 fa-duotone fa-credit-card"></i>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {loading ? <CircularLoader /> : ""} */}
    </>
  );
}

export default BillingCardSave;
