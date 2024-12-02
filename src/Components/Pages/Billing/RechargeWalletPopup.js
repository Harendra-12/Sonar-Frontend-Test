/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import NewCardPaymentMethod from "./NewCardPaymentMethod";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import CircularLoader from "../../Loader/CircularLoader";
import { generalPostFunction } from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";

function RechargeWalletPopup({ closePopup, rechargeType, selectedDid }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accountDetailsRefresh = useSelector(
    (state) => state.accountDetailsRefresh
  );
  const [newCardPopUp, setNewCardPopUp] = useState(false);
  const account = useSelector((state) => state.account);
  const cardList = useSelector((state) => state.cardList);
  const billingList = useSelector((state) => state.billingList);
  const [loading, setLoading] = useState(false);
  const [cvv, setCvv] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCardId, setSelectedCardId] = useState();
  const [selectedBillId, setSelectedBillId] = useState();
  useEffect(() => {
    cardList?.map((item) => {
      if (item.default) {
        setSelectedCardId(item.id);
      }
    });

    billingList?.map((item) => {
      if (item.default) {
        setSelectedBillId(item.id);
      }
    });
    if (cardList?.length === 0 || billingList?.length === 0) {
      setNewCardPopUp(true);
    }
  }, [billingList, cardList]);
  function closeNewPopUp() {
    setNewCardPopUp(false);
  }
  function mainClose() {
    closePopup(false);
  }
  async function handleSubmit() {
    if (selectedCardId === null || selectedCardId === undefined) {
      toast.error("Please select a card");
    } else if (selectedBillId === null || selectedBillId === undefined) {
      toast.error("Please selcet a billing address");
    } else if (cvv === "") {
      toast.error("Please enter CVV");
    } else if (cvv.length < 3 || cvv.length > 4) {
      toast.error("Please enter correct cvv");
    } else if (rechargeType !== "buyDid" && amount === "") {
      toast.error("Please enter amout");
    } else {
      setLoading(true);
      if (rechargeType === "buyDid") {
        const parsedData = {
          address_id: selectedBillId,
          account_id: account.account_id,
          card_id: selectedCardId,
          cvc: cvv,
          // amount: amount,
          companyId: account.account_id,
          vendorId: selectedDid[0].vendorId,
          didQty: selectedDid.length,
          type: "card",
          didType: "random",
          rate: Number(selectedDid[0].price) * selectedDid.length,
          accountId: selectedDid[0].vendorAccountId,
          dids: selectedDid.map((item) => {
            return {
              dids: item.id,
            };
          }),
        };

        const apiData = await generalPostFunction("/purchaseTfn", parsedData);
        if (apiData.status) {
          setLoading(false);
          // dispatch({
          //   type: "SET_ACCOUNTDETAILSREFRESH",
          //   accountDetailsRefresh: accountDetailsRefresh + 1,
          // });

          setTimeout(() => {
            closePopup(false);
          }, 2000);
          toast.success(apiData.message);
        } else {
          setLoading(false);
          // navigate("/card-details");
          // const errorMessage = Object.keys(apiData.errors);
          toast.error(apiData.error);
        }
      } else {
        const parsedData = {
          address_id: selectedBillId,
          account_id: account.account_id,
          card_id: selectedCardId,
          cvc: cvv,
          amount: amount,
        };
        const apiData = await generalPostFunction(
          "/wallet-recharge",
          parsedData
        );
        if (apiData.status) {
          setLoading(false);
          dispatch({
            type: "SET_ACCOUNTDETAILSREFRESH",
            accountDetailsRefresh: accountDetailsRefresh + 1,
          });

          setTimeout(() => {
            closePopup(false);
          }, 2000);
          toast.success(apiData.message);
        } else {
          setLoading(false);
          navigate("/card-details");
          // const errorMessage = Object.keys(apiData.errors);
          toast.error(apiData.error);
        }
      }
    }
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

      {newCardPopUp ? (
        <NewCardPaymentMethod
          closePopUp2={closeNewPopUp}
          mainPopUpClose={mainClose}
          rechargeType={rechargeType}
          selectedDid={selectedDid}
        />
      ) : (
        <div className="row">
          <div className="col-xl-4 mx-auto">
            <div className="profileView">
              <div className="profileDetailsHolder position-relative">
                <div className="header d-flex align-items-center">
                  <div className="col-12">
                    Choose Your Card
                    <span
                      onClick={() => closePopup(false)}
                      className="float-end clearButton text-danger fs-5"
                      style={{ cursor: "pointer", height: "20px" }}
                    >
                      <i className="fa-sharp fa-solid fa-xmark"></i>
                    </span>
                  </div>
                </div>
                <div
                  className="row"
                  style={{ padding: "5px", maxHeight: 191, overflowY: "auto" }}
                >
                  <div className="col-12">
                    {cardList &&
                      cardList?.map((item, key) => {
                        return (
                          <div className="col-xl-12 mb-2" key={key}>
                            <div
                              className={`savedCardWrapper ${item.id === selectedCardId ? "active" : ""
                                }`}
                            >
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
                                  **** **** **** {item.card_number.slice(-4)}
                                </label>
                              </div>
                              <div className="ms-auto">
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    id="showAllCheck"
                                    checked={
                                      item.id === selectedCardId ? true : false
                                    }
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedCardId(item.id);
                                      } else {
                                        setSelectedCardId();
                                      }
                                    }}
                                  />
                                  <span className="slider round"></span>
                                </label>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
                <div className="row" style={{ padding: "5px" }}>
                  <div className="col-12">
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
                      onClick={() => setNewCardPopUp(true)}
                    >
                      Choose a new Payment Method{" "}
                      <i className="fa-sharp fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
                <div className="header d-flex align-items-center">
                  <div className="col-12">Choose Billing Address</div>
                </div>
                <div
                  className="row"
                  style={{ padding: "5px", maxHeight: 189, overflowY: "auto" }}
                >
                  {billingList &&
                    billingList?.map((item, key) => {
                      return (
                        <div
                          key={key}
                          className="accordion accordion-flush mb-2"
                          id={key}
                        >
                          <div className="accordion-item">
                            <h2
                              className={`accordion-header addressDrawer ${item.id === selectedBillId ? "active" : ""
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
                                    data-bs-target={`#flush-collapse${key}recharge`}
                                    aria-expanded="false"
                                    aria-controls={`flush-collapse${key}recharge`}
                                  >
                                    <div>
                                      <h5
                                        className="mb-0"
                                        style={{
                                          maxWidth: 150,
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
                                        item.id === selectedBillId
                                          ? true
                                          : false
                                      }
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedBillId(item.id);
                                        } else {
                                          setSelectedBillId();
                                        }
                                      }}
                                    />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                              </div>
                            </h2>
                            <div
                              id={`flush-collapse${key}recharge`}
                              className="accordion-collapse collapse"
                              data-bs-parent={`#${key}`}
                            >
                              <div className="accordion-body">
                                <ul className="billingDetails">
                                  <div className="pe-3 col-auto">
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
                                  <div style={{ width: "80%" }}>
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
                </div>
                <div className="row" style={{ padding: "5px" }}>
                  <div className="col-6">
                    <div className="form-group">
                      <label className="formLabel">
                        Enter Your CVV Code
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="position-relative">
                        <input
                          placeholder="cvv"
                          className={`formItem`}
                          name="CVV"
                          type="number"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
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
                  {rechargeType === "buyDid" ? (
                    ""
                  ) : (
                    <div className="col-6">
                      <div className="form-group">
                        <label className="formLabel">
                          Enter Your Amount
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="position-relative">
                          <input
                            placeholder="Amount"
                            className={`formItem`}
                            name="cvv"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
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
                  )}
                  <div className="col-12 mt-2">
                    <button className="panelButton static" onClick={handleSubmit}>
                      <span className="text">Pay Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {loading ? <CircularLoader /> : ""}
    </>
  );
}

export default RechargeWalletPopup;
