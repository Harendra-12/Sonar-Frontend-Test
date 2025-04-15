/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import BillingCardSave from "./BillingCardSave";
import RechargeWalletPopup from "./RechargeWalletPopup";
import { useDispatch, useSelector } from "react-redux";
import AddNewAddress from "./AddNewAddress";
import {
  backToTop,
  generalDeleteFunction,
  generalGetFunction,
  generalPostFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";

import CircularLoader from "../../Loader/CircularLoader";
import { useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";

function CardAndBilling() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accountBalance = useSelector((state) => state.accountBalance)
  const billingListRefresh = useSelector((state) => state.billingListRefresh);
  const account = useSelector((state) => state.account);
  const cardListRefresh = useSelector((state) => state.cardListRefresh);
  const [cardPopUp, setCardPopUp] = useState(false);
  const [billingPopUp, setBillingPopUp] = useState(false);
  const [cardConfirmationPopUp, setCardConfirmationPopUp] = useState(false);
  const [billingConfirmationPopUp, setBillingConfirmationPopUp] = useState(false);
  const [selectedCardID, setSelectedCardId] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedBillingId, setSelecetedBillingId] = useState();
  const [disableCard, setDisableCard] = useState(false);
  const [disableBilling, setDisableBilling] = useState(false);
  const accountDetails = useSelector((state) => state.accountDetails);
  const cardList = useSelector((state) => state.cardList);
  const billingList = useSelector((state) => state.billingList);
  const [rechargePopUp, setRechargePopUp] = useState(false);
  const [autoPayPopup, setAutoPayPopup] = useState(false);
  const [cardDelPopUp, setCardDelPopUp] = useState(false);
  const [cardDelId, setCardDelId] = useState();
  const [autoPayThreshold, setAutoPayThreshold] = useState(0);
  const [autoPayAmount, setAutoPayAmount] = useState("");
  const [autoPayStatus, setAutoPayStatus] = useState("enable");
  const [autoPaymentFetchData, setAutoPaymentFetchData] = useState(null)
  const handleCardPopup = (value) => {
    setCardPopUp(value);
  };
  const handleBillingPopup = (value) => {
    setBillingPopUp(value);
  };
  const handleRechargePopup = (value) => {
    setRechargePopUp(value);
  };

  useEffect(() => {
    if (billingListRefresh === 0 && cardListRefresh === 0) {
      dispatch({
        type: "SET_BILLINGLISTREFRESH",
        billingListRefresh: billingListRefresh + 1,
      });
      dispatch({
        type: "SET_CARDLISTREFRESH",
        cardListRefresh: cardListRefresh + 1,
      });
    }
    // Getting auto pay details
    async function getAutopayData() {
      setLoading(true);
      const apiData = await generalGetFunction("/auto-balance")
      if (apiData.status && apiData.data) {
        setAutoPayThreshold(apiData.data?.threshold);
        setAutoPayAmount(apiData.data?.amount);
        setAutoPayStatus(apiData.data?.status)
        setLoading(false);
        setAutoPaymentFetchData(apiData.data)
      } else {
        setLoading(false);
      }
    }
    getAutopayData()
  }, [])
  const downloadImage = async (imageUrl, fileName) => {
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

  const selectedCard = cardList?.filter((item) => item.default === 1);

  async function handleConfirmClick() {
    if (selectedCardID) {
      setLoading(true);
      if (disableCard) {
        const parsedData = {
          id: selectedCardID,
          account_id: account.account_id,
          default: 0,
        };
        const apiData = await generalPostFunction(
          "/card/set-default-card",
          parsedData
        );
        if (apiData?.status) {
          setCardConfirmationPopUp(false);
          dispatch({
            type: "SET_CARDLISTREFRESH",
            cardListRefresh: cardListRefresh + 1,
          });
          setTimeout(() => {
            toast.success(apiData.message);
            setLoading(false);
          }, 300);
        } else {
          setCardConfirmationPopUp(false);
          setLoading(false);
          // const errorMessage = Object.keys(apiData.errors);
          // toast.error(apiData.errors[errorMessage[0]][0]);
        }
      } else {
        const parsedData = {
          id: selectedCardID,
          account_id: account.account_id,
          default: 1,
        };
        const apiData = await generalPostFunction(
          "/card/set-default-card",
          parsedData
        );
        if (apiData?.status) {
          setCardConfirmationPopUp(false);
          dispatch({
            type: "SET_CARDLISTREFRESH",
            cardListRefresh: cardListRefresh + 1,
          });
          setTimeout(() => {
            toast.success(apiData.message);
            setLoading(false);
          }, 300);
        } else {
          setCardConfirmationPopUp(false);
          setLoading(false);
          // const errorMessage = Object.keys(apiData.errors);
          // toast.error(apiData.errors[errorMessage[0]][0]);
        }
      }
    } else {
      setLoading(true);
      if (disableBilling) {
        const parsedData = {
          id: selectedBillingId,
          account_id: account.account_id,
          default: 0,
        };
        const apiData = await generalPostFunction(
          "/billing-address/set-default-address",
          parsedData
        );
        if (apiData?.status) {
          setBillingConfirmationPopUp(false);
          dispatch({
            type: "SET_BILLINGLISTREFRESH",
            billingListRefresh: billingListRefresh + 1,
          });
          setTimeout(() => {
            toast.success(apiData.message);
            setLoading(false);
          }, 300);
        } else {
          setBillingConfirmationPopUp(false);
          setLoading(false);
          // const errorMessage = Object.keys(apiData.errors);
          // toast.error(apiData.errors[errorMessage[0]][0]);
        }
      } else {
        const parsedData = {
          id: selectedBillingId,
          account_id: account.account_id,
          default: 1,
        };
        const apiData = await generalPostFunction(
          "/billing-address/set-default-address",
          parsedData
        );
        if (apiData?.status) {
          setBillingConfirmationPopUp(false);
          dispatch({
            type: "SET_BILLINGLISTREFRESH",
            billingListRefresh: billingListRefresh + 1,
          });
          setTimeout(() => {
            toast.success(apiData.message);
            setLoading(false);
          }, 300);
        } else {
          setBillingConfirmationPopUp(false);
          setLoading(false);
          // const errorMessage = Object.keys(apiData.errors);
          // toast.error(apiData.errors[errorMessage[0]][0]);
        }
      }
    }
  }

  // This variable set for edit and delete of billing address
  const [editBillId, setEditBillId] = useState();
  const [delBillId, setDelBillId] = useState();
  const [billDelPopUp, setBillDelPopUp] = useState(false);
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

  // Handling Edit change with validation
  async function handleSubmit() {
    Object.keys(billing).map((item) => {
      if (billing[item] === "") {
        setErrorBilling((prevData) => ({
          ...prevData,
          [item]: true,
        }));
      } else if (item === "phone") {
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
    if (
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
      const parsedData = {
        fullname: billing.name,
        contact_no: billing.phone,
        email: billing.email,
        address: billing.address,
        zip: billing.zip,
        city: billing.city,
        state: billing.state,
        country: billing.country,
      };
      const apiData = await generalPutFunction(
        `/billing-address/update/${editBillId}`,
        parsedData
      );
      if (apiData.status) {
        setEditBillId();
        setLoading(false);
        toast.success(apiData.message);
        dispatch({
          type: "SET_BILLINGLISTREFRESH",
          billingListRefresh: billingListRefresh + 1,
        });
      } else {
        setLoading(false);
        // const errorMessage = Object.keys(apiData.errors);
        // toast.error(apiData.errors[errorMessage[0]][0]);
      }
    }
  }

  // Handle billing address delete
  async function handleDeleteBilling() {
    setLoading(true);
    const apiData = await generalDeleteFunction(
      `/billing-address/destroy/${delBillId}`
    );
    if (apiData?.status) {
      dispatch({
        type: "SET_BILLINGLISTREFRESH",
        billingListRefresh: billingListRefresh + 1,
      });
      setLoading(false);
      setBillDelPopUp(false);
      toast.success(apiData.message);
    } else {
      setBillDelPopUp(false);
      setLoading(false);
      // const errorMessage = Object.keys(apiData.errors);
      // toast.error(apiData.errors[errorMessage[0]][0]);
    }
  }

  // Handle Card Delete
  async function handleCardDelete() {
    setLoading(true);
    const apiData = await generalDeleteFunction(`/card/destroy/${cardDelId}`);
    if (apiData?.status) {
      setLoading(false);
      toast.success(apiData.message);
      dispatch({
        type: "SET_CARDLISTREFRESH",
        cardListRefresh: cardListRefresh + 1,
      });
      setCardDelPopUp(false);
    } else {
      setCardDelPopUp(false);
      setLoading(false);
      // const errorMessage = Object.keys(apiData.errors);
      // toast.error(apiData.errors[errorMessage[0]][0]);
    }
  }

  // Handle auto payment change
  async function handleAutoPaymentChange() {
    if (autoPayAmount === "" || Number(autoPayAmount) < 20) {
      toast.error("Please enter amount greater than 20");
      return;
    }
    setAutoPayPopup(false);
    setLoading(true);
    const apiData = await generalPostFunction("/auto-balance", {
      threshold: autoPayThreshold,
      amount: autoPayAmount,
      status: autoPayStatus
    })
    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message);
      setAutoPaymentFetchData(apiData.data)
    } else {
      setLoading(false);
      toast.error(apiData.message);
    }
  }
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Payment Details" />

            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Billing & Payment Details</h4>
                        <p>Here you can see all the details related to your card and wallet</p>
                      </div>
                      <div className="buttonGroup">
                        <button
                          effect="ripple"
                          className="panelButton gray"
                          onClick={() => {
                            navigate(-1);
                            backToTop();
                          }}
                        >
                          <span className="text">Back</span>
                          <span className="icon">
                            <i className="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12" style={{ padding: '25px 23px' }}>
                  <div className="row gy-3">
                    <div className="col-xxl-8 col-xl-9">
                      <div className="row gy-3">
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12 billinCardWrapper">
                          <Cards
                            className="cardWrapper row align-items-center col-12 mx-auto"
                            number={selectedCard?.[0]?.card_number}
                            expiry={`${selectedCard?.[0]?.exp_month
                              ? selectedCard?.[0]?.exp_month < 10
                                ? `0${selectedCard?.[0]?.exp_month}`
                                : selectedCard?.[0]?.exp_month
                              : ""
                              }/${selectedCard?.[0]?.exp_year
                                ? selectedCard?.[0]?.exp_year
                                : ""
                              }`}
                            cvc={selectedCard?.[0]?.cvc}
                            name={selectedCard?.[0]?.name}
                          />
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                          <div className="itemWrapper a billing_card1">
                            <div className="heading d-flex justify-content-between align-items-center gap-1">
                              <div className="">
                                <h5>Upcoming Transaction</h5>
                                {/* <p>16-01-2024</p> */}
                                <p>On:{" "}
                                  {accountDetails.subscription[0]?.end_date
                                    ? accountDetails.subscription[0]?.end_date.split(" ")[0]
                                    : ""}
                                </p>
                              </div>
                              <div className="">
                                <i
                                  className="fa-duotone fa-ballot"
                                  style={{
                                    boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 5px", cursor: 'default'
                                  }}
                                ></i>
                              </div>
                            </div>
                            <div className="data-number2">
                              <div className="d-flex flex-wrap justify-content-between align-items-center">
                                <div className="col-10">
                                  {/* <h5>
                                $200.<sub style={{ fontSize: "14px" }}>00</sub>
                              </h5> */}
                                  <h5>
                                    ${" "}
                                    {accountDetails.package?.offer_price?.split(
                                      "."
                                    )[0]
                                      ? accountDetails.package?.offer_price?.split(
                                        "."
                                      )[0]
                                      : 0}
                                    .
                                    <sub style={{ fontSize: 14 }}>
                                      {accountDetails.package?.offer_price?.split(
                                        "."
                                      )[1]
                                        ? accountDetails.package?.offer_price?.split(
                                          "."
                                        )[1]
                                        : "00"}
                                    </sub>
                                  </h5>
                                  <p>
                                    Package Name: {accountDetails.package?.name}
                                  </p>
                                  <p>
                                    Type:{" "}
                                    {accountDetails.package?.subscription_type ===
                                      "annually"
                                      ? "Yearly Basis"
                                      : "Monthly Basis"}
                                  </p>
                                </div>
                                <div className="col-2">
                                  {/* <img
                                src={require("../../assets/images/icons/diagram.png")}
                              /> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12">
                          <div className="itemWrapper a billing_card2" >
                            <div className="heading d-flex justify-content-between align-items-center gap-1">
                              <div className="">
                                <h5>Wallet Balance</h5>
                                <p>Created On: {accountDetails?.balance?.created_at?.split("T")[0]}</p>
                              </div>
                              <div className="">
                                <i
                                  className="fa-duotone fa-credit-card"
                                  style={{
                                    boxShadow:
                                      "rgba(0, 0, 0, 0.15) 0px 3px 5px", cursor: 'default'
                                  }}
                                ></i>
                              </div>
                            </div>
                            <div className="data-number2 ">
                              <h5>
                                {accountBalance}
                              </h5>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="col-auto">
                                  <p>
                                    Min Balance: $
                                    {accountDetails?.balance?.min_amount || 0}
                                  </p>
                                  <p>
                                    {!selectedCard?.[0]?.card_number ? (
                                      <span className="text-danger">
                                        Please add a card before recharge!
                                      </span>
                                    ) : (
                                      <span className="text-success">
                                        Active Card: *** *** ***{" "}
                                        {selectedCard?.[0]?.card_number.slice(-4)}
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <div className="col ">
                                  <Tippy content="Click to add balance!">
                                    <button className="tableButton edit ms-auto" style={{ width: 30, height: 30,  }} onClick={() => setRechargePopUp(true)}>
                                      <i className="fa-solid fa-dollar" />
                                    </button>
                                  </Tippy>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row pt-2">
                        <div className="col-xl-6">
                          <div className="profileView pb-0 pe-0">
                            <div className="profileDetailsHolder position-relative" style={{ backgroundColor: 'var(--ele-color2)' }}>
                              <div className="col-xl-12">
                                <div className="header d-flex align-items-center justify-content-between">
                                  <div className="col-5">Payment Method</div>
                                  <div className="col-5 text-end">
                                    <button
                                      className="panelButton m-0 ms-auto"
                                      onClick={() => setCardPopUp(true)}
                                    >
                                      <span className="text">Add</span>
                                      <span className="icon">
                                        <i className="fa-solid fa-plus"></i>
                                      </span>
                                    </button>
                                  </div>
                                </div>
                                {cardList && (
                                  <>
                                    {cardList.map((item, key) => {
                                      return (
                                        <div className="col-xl-12 pt-3" key={key}>
                                          <div
                                            className={`savedCardWrapper ${item.default ? "active" : ""
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
                                                **** **** ****{" "}
                                                {item.card_number.slice(-4)}
                                              </label>
                                            </div>
                                            <div className="ms-auto">
                                              {/* <label className="switch">
                                                <input
                                                  type="checkbox"
                                                  id="showAllCheck"
                                                  checked={item.default}
                                                  onChange={(e) => {
                                                    if (e.target.checked) {
                                                      setSelectedCardId(item.id);
                                                      setCardConfirmationPopUp(true);
                                                      setDisableCard(false);
                                                    } else {
                                                      setSelectedCardId(item.id);
                                                      setCardConfirmationPopUp(true);
                                                      setDisableCard(true);
                                                    }
                                                  }}
                                                />
                                                <span className="slider round"></span>
                                              </label> */}
                                              <div class="cl-toggle-switch">
                                                <label class="cl-switch">
                                                  <input type="checkbox"
                                                   checked={item.default}
                                                   onChange={(e) => {
                                                     if (e.target.checked) {
                                                       setSelectedCardId(item.id);
                                                       setCardConfirmationPopUp(true);
                                                       setDisableCard(false);
                                                     } else {
                                                       setSelectedCardId(item.id);
                                                       setCardConfirmationPopUp(true);
                                                       setDisableCard(true);
                                                     }
                                                   }}
                                                    id="showAllCheck"
                                                  />
                                                  <span></span>
                                                </label>
                                              </div>
                                            </div>
                                            <div className="ms-3">
                                              <button
                                                className="clearButton"
                                                onClick={() => {
                                                  setCardDelId(item.id);
                                                  setCardDelPopUp(true);
                                                }}
                                              >
                                                <i className="fa-duotone text-danger fa-trash"></i>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-6">
                          <div className="profileView px-0">
                            <div className="profileDetailsHolder position-relative" style={{ backgroundColor: 'var(--ele-color2)' }}>
                              <div className="col-xl-12">
                                <div className="header d-flex align-items-center justify-content-between">
                                  <div className="col-5">Billing Information</div>
                                  <button
                                    className="panelButton m-0 ms-auto"
                                    onClick={() => setBillingPopUp(true)}
                                  >
                                    <span className="text">Add</span>
                                    <span className="icon">
                                      <i className="fa-solid fa-plus"></i>
                                    </span>
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
                                          <h2
                                            className={`accordion-header addressDrawer ${item.default ? "active" : ""
                                              }`}
                                          >
                                            <div
                                              className="d-flex flex-wrap align-items-center"
                                              style={{ padding: "0 10px" }}
                                            >
                                              <div className="col">
                                                <button
                                                  className="accordion-button collapsed justify-content-between bg-transparent"
                                                  type="button"
                                                  data-bs-toggle="collapse"
                                                  data-bs-target={`#flush-collapse${key}`}
                                                  aria-expanded="false"
                                                  aria-controls={`flush-collapse${key}`}
                                                >
                                                  <div>
                                                    <h5
                                                      className="mb-0"
                                                      style={{
                                                        maxWidth: 250,
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
                                                {/* <label className="switch">
                                                  <input
                                                    type="checkbox"
                                                    id="showAllCheck"
                                                    checked={item.default}
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        setSelecetedBillingId(
                                                          item.id
                                                        );
                                                        setSelectedCardId();
                                                        setBillingConfirmationPopUp(
                                                          true
                                                        );
                                                        setDisableBilling(false);
                                                      } else {
                                                        setSelecetedBillingId(
                                                          item.id
                                                        );
                                                        setSelectedCardId();
                                                        setBillingConfirmationPopUp(
                                                          true
                                                        );
                                                        setDisableBilling(true);
                                                      }
                                                    }}
                                                  />
                                                  <span className="slider round"></span>
                                                </label> */}

                                                <div class="cl-toggle-switch">
                                                <label class="cl-switch">
                                                  <input type="checkbox"
                                                   checked={item.default}
                                                   onChange={(e) => {
                                                     if (e.target.checked) {
                                                       setSelecetedBillingId(
                                                         item.id
                                                       );
                                                       setSelectedCardId();
                                                       setBillingConfirmationPopUp(
                                                         true
                                                       );
                                                       setDisableBilling(false);
                                                     } else {
                                                       setSelecetedBillingId(
                                                         item.id
                                                       );
                                                       setSelectedCardId();
                                                       setBillingConfirmationPopUp(
                                                         true
                                                       );
                                                       setDisableBilling(true);
                                                     }
                                                   }}
                                                    id="showAllCheck"
                                                  />
                                                  <span></span>
                                                </label>
                                              </div>
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
                                                <div style={{ width: "75%" }}>
                                                  <li>
                                                    <input
                                                      value={
                                                        item.id === editBillId
                                                          ? billing.name
                                                          : item.fullname
                                                      }
                                                      name="name"
                                                      className={`noinputfield ${errorBilling.name
                                                        ? "error-border"
                                                        : editBillId
                                                          ? "edit"
                                                          : ""
                                                        }`}
                                                      onChange={(e) =>
                                                        billingChnage(e)
                                                      }
                                                      type="text"
                                                      disabled={
                                                        item.id === editBillId
                                                          ? false
                                                          : true
                                                      }
                                                    />
                                                  </li>
                                                  <li>
                                                    <input
                                                      value={
                                                        item.id === editBillId
                                                          ? billing.phone
                                                          : item.contact_no
                                                      }
                                                      placeholder="Phone number"
                                                      name="phone"
                                                      className={`noinputfield ${errorBilling.phone
                                                        ? "error-border"
                                                        : editBillId
                                                          ? "edit"
                                                          : ""
                                                        }`}
                                                      onChange={(e) =>
                                                        billingChnage(e)
                                                      }
                                                      type="number"
                                                      disabled={
                                                        item.id === editBillId
                                                          ? false
                                                          : true
                                                      }
                                                    />
                                                  </li>
                                                  <li>
                                                    <input
                                                      value={
                                                        item.id === editBillId
                                                          ? billing.email
                                                          : item.email
                                                      }
                                                      placeholder="Email Address"
                                                      name="email"
                                                      className={`noinputfield ${errorBilling.email
                                                        ? "error-border"
                                                        : editBillId
                                                          ? "edit"
                                                          : ""
                                                        }`}
                                                      onChange={(e) =>
                                                        billingChnage(e)
                                                      }
                                                      type="email"
                                                      disabled={
                                                        item.id === editBillId
                                                          ? false
                                                          : true
                                                      }
                                                    />
                                                  </li>
                                                  <li>
                                                    <input
                                                      value={
                                                        item.id === editBillId
                                                          ? billing.address
                                                          : item.address
                                                      }
                                                      placeholder="Full address"
                                                      name="address"
                                                      className={`noinputfield ${errorBilling.address
                                                        ? "error-border"
                                                        : editBillId
                                                          ? "edit"
                                                          : ""
                                                        }`}
                                                      onChange={(e) =>
                                                        billingChnage(e)
                                                      }
                                                      type="text"
                                                      disabled={
                                                        item.id === editBillId
                                                          ? false
                                                          : true
                                                      }
                                                    />
                                                  </li>
                                                  <li>
                                                    <input
                                                      value={
                                                        item.id === editBillId
                                                          ? billing.city
                                                          : item.city
                                                      }
                                                      placeholder="City"
                                                      name="city"
                                                      className={`noinputfield ${errorBilling.city
                                                        ? "error-border"
                                                        : editBillId
                                                          ? "edit"
                                                          : ""
                                                        }`}
                                                      onChange={(e) =>
                                                        billingChnage(e)
                                                      }
                                                      type="text"
                                                      disabled={
                                                        item.id === editBillId
                                                          ? false
                                                          : true
                                                      }
                                                    />
                                                  </li>
                                                  <li>
                                                    <input
                                                      value={
                                                        item.id === editBillId
                                                          ? billing.state
                                                          : item.state
                                                      }
                                                      placeholder="State"
                                                      name="state"
                                                      className={`noinputfield ${errorBilling.state
                                                        ? "error-border"
                                                        : editBillId
                                                          ? "edit"
                                                          : ""
                                                        }`}
                                                      onChange={(e) =>
                                                        billingChnage(e)
                                                      }
                                                      type="text"
                                                      disabled={
                                                        item.id === editBillId
                                                          ? false
                                                          : true
                                                      }
                                                    />
                                                  </li>
                                                  <li>
                                                    <input
                                                      value={
                                                        item.id === editBillId
                                                          ? billing.zip
                                                          : item.zip
                                                      }
                                                      placeholder="Zip Code"
                                                      name="zip"
                                                      className={`noinputfield ${errorBilling.zip
                                                        ? "error-border"
                                                        : editBillId
                                                          ? "edit"
                                                          : ""
                                                        }`}
                                                      onChange={(e) =>
                                                        billingChnage(e)
                                                      }
                                                      type="number"
                                                      disabled={
                                                        item.id === editBillId
                                                          ? false
                                                          : true
                                                      }
                                                    />
                                                  </li>
                                                  <li>
                                                    <input
                                                      value={
                                                        item.id === editBillId
                                                          ? billing.country
                                                          : item.country
                                                      }
                                                      placeholder="Country"
                                                      name="country"
                                                      className={`noinputfield ${errorBilling.country
                                                        ? "error-border"
                                                        : editBillId
                                                          ? "edit"
                                                          : ""
                                                        }`}
                                                      onChange={(e) =>
                                                        billingChnage(e)
                                                      }
                                                      type="text"
                                                      disabled={
                                                        item.id === editBillId
                                                          ? false
                                                          : true
                                                      }
                                                    />
                                                  </li>
                                                </div>
                                              </ul>
                                              <div className="d-flex mt-2">
                                                {editBillId === item.id ? (
                                                  <div className="me-3">
                                                    <button
                                                      className="tableButton edit"
                                                      onClick={() => {
                                                        handleSubmit();
                                                        // setEditBillId()
                                                      }}
                                                    >
                                                      <i className="fa-solid fa-check"></i>{" "}
                                                    </button>
                                                  </div>
                                                ) : (
                                                  <div className="me-3">
                                                    <button
                                                      className="tableButton"
                                                      onClick={() => {
                                                        setEditBillId(item.id);
                                                        setBilling((prevData) => ({
                                                          ...prevData,
                                                          name: item.fullname,
                                                          email: item.email,
                                                          phone: item.contact_no,
                                                          city: item.city,
                                                          address: item.address,
                                                          country: item.country,
                                                          state: item.state,
                                                          zip: item.zip,
                                                        }));
                                                      }}
                                                    >
                                                      <i className="fa-solid fa-pen-to-square"></i>{" "}
                                                    </button>
                                                  </div>
                                                )}
                                                <div>
                                                  <button
                                                    className="tableButton delete"
                                                    onClick={() => {
                                                      setDelBillId(item.id);
                                                      setBillDelPopUp(true);
                                                    }}
                                                  >
                                                    <i className="fa-solid fa-trash"></i>{" "}
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
                      {/* <div className="row gy-3 pt-2">
                    <div className="col-xl-12 pe-0">

                    </div>
                  </div> */}
                    </div>
                    <div className="col-xxl-4 col-xl-3">
                      <div className="col-xl-12">
                        <div className="itemWrapper a h-100" style={{ backgroundColor: 'var(--ele-color2)' }}>
                          <div className="heading dashboard_headerPart">
                            <div className="col-10">
                              <h5>Invoices</h5>
                              <p>As on:{" "}
                                {new Date().toLocaleString("en-GB", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                }).replace(/\//g, "-")
                                }
                              </p>
                            </div>
                            <div
                              className="col-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => navigate("/card-transaction-list")}
                            >
                              <i
                                className="fa-solid fa-eye"
                                style={{
                                  boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 5px",
                                }}
                              ></i>
                            </div>
                          </div>
                          <ul className="invoiceList">
                            {accountDetails.payments.map((item, key) => {
                              return (
                                <li key={key}>
                                  <div className="col-xxl-7 col-xl-6">
                                    <p>{item.transaction_date}</p>
                                  </div>
                                  <div className="me-2" style={{ width: 55 }}>
                                    <p>${item.amount_subtotal}</p>
                                  </div>
                                  <div
                                    style={{ cursor: "pointer", fontWeight: "500" }}
                                    className="tableButton blue"
                                    onClick={() =>
                                      downloadImage(
                                        item.invoice_url,
                                        `invoice${item.transaction_date?.split(" ")[0]
                                        }`
                                      )
                                    }
                                  >
                                    <i className="fa-solid fa-download"></i>{" "}
                                  </div>
                                  <div className="col-12">
                                    <span>#{item.transaction_id}</span>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                      <div className="col-12">
                          <div className="row">
                      <div className="col-xl-12 col-lg-6 col-md-6 col-sm-6 mt-3">
                        <div className="itemWrapper a" style={{ backgroundColor: 'var(--ele-color2)' }}>
                          <div className="heading d-flex justify-content-between align-items-center gap-1">
                            <div className="">
                              <h5>Last Transaction</h5>
                              <p>On:{" "}
                                {
                                  accountDetails?.payments[0].transaction_date?.split(
                                    " "
                                  )[0]
                                }
                              </p>
                            </div>
                            <div className=""
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                downloadImage(
                                  accountDetails?.payments[0].invoice_url,
                                  `invoice${accountDetails?.payments[0].transaction_date?.split(
                                    " "
                                  )[0]
                                  }`
                                )
                              }
                            >
                              <i
                                className="fa-duotone fa-ballot-check"
                                style={{
                                  boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 5px", cursor: 'default'
                                }}
                              ></i>
                            </div>
                          </div>
                          <div className="data-number2">
                            <div className="d-flex flex-wrap justify-content-between align-items-center">
                              <div className="col-10">
                                <h5>
                                  ${" "}
                                  {
                                    accountDetails?.payments[0].amount_subtotal?.split(
                                      "."
                                    )[0]
                                  }
                                  .
                                  <sub style={{ fontSize: 14 }}>
                                    {
                                      accountDetails?.payments[0].amount_subtotal?.split(
                                        "."
                                      )[1]
                                    }
                                  </sub>
                                </h5>
                                <p>
                                  <b>Transaction ID</b>: #
                                  {accountDetails?.payments[0].transaction_id}
                                </p>
                              </div>
                              <div className="col-2"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-12 col-lg-6 col-md-6 col-sm-6 mt-3">
                        <div
                          className={`itemWrapper a ${(autoPaymentFetchData?.status === "enable") ? "active" : ""}`}
                          style={{ backgroundColor: "var(--ele-color2)" }}
                        >
                          <div className="heading d-flex justify-content-between align-items-center gap-1">

                            <div className="">
                              <h5>Auto Pay Feature</h5>
                              {
                                !autoPaymentFetchData ? "" :
                                  <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>Status: <span className={`text-${autoPaymentFetchData.status === "disable" ? "danger" : "success"}`} style={{ textTransform: 'capitalize' }}><b>{autoPaymentFetchData.status}</b></span></p>
                              }
                            </div>

                            <div className="" style={{ cursor: "pointer" }}>
                              <i
                                className="fa-duotone fa-circle-dollar"
                                style={{
                                  boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 5px",
                                  cursor: "default"
                                }}
                              />
                            </div>
                          </div>
                          <div className="data-number2">
                            <div className="d-flex flex-wrap justify-content-between align-items-center">
                              {
                                !autoPaymentFetchData ?
                                  <div className="col-2" >
                                    <button className="panelButton" onClick={() => setAutoPayPopup(true)}>
                                      <span className="text">Add</span>
                                      <span className="icon"><i className="fa-solid fa-edit" /></span>
                                    </button>
                                  </div> :
                                  <>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                      <h5>
                                        $ {autoPaymentFetchData.amount}
                                      </h5>
                                      <p>
                                        <b>Minimum Threshold</b>: $ {autoPaymentFetchData.threshold}
                                      </p>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12" >
                                      <button className="panelButton edit ms-auto" onClick={() => setAutoPayPopup(true)}>
                                        <span className="text">Edit</span>
                                        <span className="icon"><i className="fa-solid fa-pen" /></span>
                                      </button>
                                    </div>
                                  </>
                              }


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
        </div>
        {rechargePopUp ? (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <RechargeWalletPopup
                  closePopup={handleRechargePopup}
                  rechargeType={"rechargeWallet"}
                />
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
      {cardConfirmationPopUp ? (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="row content col-xl-4 col-md-5">
                <div className="col-2 px-0">
                  <div className="iconWrapper">
                    <i className="fa-duotone fa-triangle-exclamation"></i>
                  </div>
                </div>
                <div className="col-10 ps-0">
                  <h4>{disableCard ? "Warning" : "Confirmation"}!</h4>
                  {disableCard
                    ? "Are you sure you want to disable the selected card ?"
                    : "Are you sure you want to activate the selected card ?"}
                  <div className="mt-2 d-flex justify-content-between">
                    <button
                      className="panelButton m-0"
                      onClick={handleConfirmClick}
                    >
                      <span className="text">Confirm</span>
                      <span className="icon">
                        <i className="fa-solid fa-check"></i>
                      </span>
                    </button>
                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setCardConfirmationPopUp(false);
                        setSelectedCardId();
                      }}
                    >
                      <span className="text">Cancel</span>
                      <span className="icon">
                        <i className="fa-solid fa-xmark"></i>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {billingConfirmationPopUp ? (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="row content col-xl-4 col-md-5">
                <div className="col-2 px-0">
                  <div className="iconWrapper">
                    <i className="fa-duotone fa-triangle-exclamation"></i>
                  </div>
                </div>
                <div className="col-10 ps-0">
                  <h4>{disableBilling ? "Warning" : "Confirmation"}!</h4>
                  {disableBilling
                    ? "Are you sure you want to disable the selected billing address ?"
                    : "Are you sure you want to activate the selected billing address ?"}
                  <div className="mt-2 d-flex justify-content-between">
                    <button
                      className="panelButton m-0"
                      onClick={handleConfirmClick}
                    >
                      <span className="text">Confirm</span>
                      <span className="icon">
                        <i className="fa-solid fa-check"></i>
                      </span>
                    </button>
                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setBillingConfirmationPopUp(false);
                        setSelecetedBillingId();
                      }}
                    >
                      <span className="text">Cancel</span>
                      <span className="icon">
                        <i className="fa-solid fa-xmark"></i>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {billDelPopUp ? (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="row content col-xl-4 col-md-5">
                <div className="col-2 px-0">
                  <div className="iconWrapper">
                    <i className="fa-duotone fa-triangle-exclamation"></i>
                  </div>
                </div>
                <div className="col-10 ps-0">
                  <h4>Warning!</h4>
                  Are you sure you want to delete the selected billing address
                  ?
                  <div className="mt-2 d-flex justify-content-between">
                    <button
                      className="panelButton m-0"
                      onClick={handleDeleteBilling}
                    >
                      <span className="text">Confirm</span>
                      <span className="icon">
                        <i className="fa-solid fa-check"></i>
                      </span>
                    </button>
                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setDelBillId();
                        setBillDelPopUp(false);
                      }}
                    >
                      <span className="text">Cancel</span>
                      <span className="icon">
                        <i className="fa-solid fa-xmark"></i>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {cardDelPopUp ? (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="row content col-xl-4 col-md-5">
                <div className="col-2 px-0">
                  <div className="iconWrapper">
                    <i className="fa-duotone fa-triangle-exclamation"></i>
                  </div>
                </div>
                <div className="col-10 ps-0">
                  <h4>Warning!</h4>
                  Are you sure you want to delete the selected Card ?
                  <div className="mt-2 d-flex justify-content-between">
                    <button
                      className="panelButton m-0"
                      onClick={handleCardDelete}
                    >
                      <span className="text">Confirm</span>
                      <span className="icon">
                        <i className="fa-solid fa-check"></i>
                      </span>
                    </button>
                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setCardDelId();
                        setCardDelPopUp(false);
                      }}
                    >
                      <span className="text">Cancel</span>
                      <span className="icon">
                        <i className="fa-solid fa-xmark"></i>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {autoPayPopup &&
        <>
          <div className="backdropContact">
            <div className="addNewContactPopup">
              <div className="row">
                <div className="col-12 heading mb-0">
                  <i className="fa-regular fa-dollar-sign" />
                  <h5>Edit Autopay options for your account</h5>
                </div>
                <div className="mt-3">
                  <div className="col-12">
                    <div className="formRow">
                      <div className="col-6">
                        <div className="formLabel">
                          <label htmlFor="">Min Threshold</label>
                          <label className="formItemDesc">The minimum threshold that the user will hit before autopay</label>
                        </div>
                      </div>
                      <div className="col-6">
                        <input type="number" className="formItem" value={autoPayThreshold} onChange={(e) => setAutoPayThreshold(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="formRow">
                      <div className="col-6">
                        <div className="formLabel">
                          <label htmlFor="">Amount</label>
                          <label className="formItemDesc">The amount of recharge to be commenced</label>
                        </div>
                      </div>
                      <div className="col-6">
                        <input type="number" className="formItem" value={autoPayAmount} onChange={(e) => setAutoPayAmount(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="formRow">
                      <div className="col-6">
                        <div className="formLabel">
                          <label htmlFor="">Status</label>
                          <label className="formItemDesc">The status of the autopay feature</label>
                        </div>
                      </div>
                      <div className="col-6">
                        <select
                          className="formItem me-0"
                          id="selectFormRow"
                          name="status"
                          style={{ width: "100%" }}
                          value={autoPayStatus}
                          onChange={(e) => setAutoPayStatus(e.target.value)}
                        >
                          <option className="status" value="enable">
                            Enable
                          </option>
                          <option value="disable">Disable</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-12 mt-2">
                  <div className="d-flex justify-content-between">
                    <button className="panelButton gray ms-0" onClick={() => setAutoPayPopup(false)}>
                      <span className="text">Close</span>
                      <span className="icon">
                        <i className="fa-solid fa-caret-left" />
                      </span>
                    </button>
                    <button className="panelButton me-0" onClick={handleAutoPaymentChange}>
                      <span className="text">Save</span>
                      <span className="icon">
                        <i className="fa-solid fa-floppy-disk" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      }
      {loading ? <CircularLoader /> : ""}
    </main>
  );
}

export default CardAndBilling;
