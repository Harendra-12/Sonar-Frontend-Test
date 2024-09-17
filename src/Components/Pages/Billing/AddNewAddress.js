/* eslint-disable array-callback-return */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generalPostFunction } from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";

function AddNewAddress({ closePopup }) {
  const account = useSelector((state) => state.account);

  const dispatch = useDispatch();
  const billingListRefresh = useSelector((state) => state.billingListRefresh);
  const [loading, setLoading] = useState(false);
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

  async function handleSubmit() {
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
        account_id: account.account_id,
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
        "/billing-address/store",
        parsedData
      );
      if (apiData.status) {
        setLoading(false);
        toast.success(apiData.message);
        dispatch({
          type: "SET_BILLINGLISTREFRESH",
          billingListRefresh: billingListRefresh + 1,
        });
        setTimeout(() => {
          closePopup(false);
        }, 2000);
      }
    }
  }
  return (
    <div className="col-xl-4">
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
      <div className="cardDetailsWrapper">
        <div className="row">
          <div className="col-12 border-start border-4 border-success mb-3 px-3 d-flex jusitfy-content-between align-items-center">
            <h5 className="mb-0">Billing Information</h5>
            <span
              onClick={() => closePopup(false)}
              className="float-end clearButton text-danger fs-4 d-flex ms-auto"
              style={{ cursor: "pointer" }}
            >
              <i className="fa-sharp fa-solid fa-xmark"></i>
            </span>
          </div>

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
              type="number"
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
          <div className="col-12 mt-2">
            <button className="payNow" onClick={handleSubmit}>
              {" "}
              {loading ? (
                <img
                  width="6%"
                  src={require("../../assets/images/loader-gif.webp")}
                  alt=""
                />
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewAddress;
