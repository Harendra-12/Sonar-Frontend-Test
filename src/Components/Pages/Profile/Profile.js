import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import { useDispatch, useSelector } from "react-redux";
import {
  backToTop,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";

const Profile = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const accountDetails = useSelector((state) => state.accountDetails);
  const timeZoneRefresh = useSelector((state) => state.timeZoneRefresh);
  const timeZone = useSelector((state) => state.timeZone);
  const [timeZoneVal, setTimeZoneVal] = useState();
  console.log("user:", account);
  console.log("accountDetails:", accountDetails);

  useEffect(() => {
    if (timeZoneRefresh > 0) {
      setTimeZoneVal(
        timeZone.filter((item) => {
          return item.id === account.timezone_id;
        })
      );
    } else {
      dispatch({
        type: "SET_TIMEZONEREFRESH",
        timeZoneRefresh: timeZoneRefresh + 1,
      });
    }
  }, [timeZone]);

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="My Profile" />
            <div className="col-12">
              {/* <div className="row px-xl-3 py-2" id="detailsHeader">
                <div className="col-xl-2 col-4 d-flex align-items-center">
                  <h4 className="my-auto">My Profile</h4>
                </div>
                <div className="col-xl-4 col-4 my-auto">
                  <div className="position-relative searchBox">
                    <input
                      type="search"
                      name="Search"
                      id="headerSearch"
                      placeholder="Search"
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-4 d-flex justify-content-end">
                  <div className="mx-xl-3 my-auto">
                    <button className="getApp" effect="ripple">
                      Get Our App
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
            <div className="col-xl-9">
              <div className="profileView mt-3">
                <div className="profileDetailsHolder">
                  <div className="baseDetails row">
                    <div className="col-auto my-auto">
                      <div className="profilePicHolder">
                        <img
                          src={
                            account?.profile_pic
                              ? account?.profile_pic
                              : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt="img"
                        />
                      </div>
                    </div>
                    <div className="content col-xl-6 col-8 my-auto pe-0">
                      <h5>{account?.name ? account?.name : "User Name"}</h5>
                      <p>
                        <span>
                          <i className="fa-duotone fa-globe"></i>
                        </span>{" "}
                        {account?.email ? account?.email : "user@mail.com"}
                      </p>
                      {/* <p>
                        <span>
                          <i className="fa-duotone fa-server"></i>
                        </span>{" "}
                        {account?.domain?.domain_name
                          ? account?.domain?.domain_name
                          : "https://www.webviotechnologies.com/"}
                      </p> */}
                      <p>
                        <span>
                          <i className="fa-duotone fa-location-dot"></i>
                        </span>{" "}
                        {accountDetails?.billing_address &&
                          accountDetails?.billing_address[0].address}
                      </p>
                    </div>
                    <div className="content ms-xl-auto col-xl-auto my-xl-auto mt-2">
                      <div className="d-flex justify-content-between gap-2">
                        <div>
                          <p className="fw-light">Country:</p>
                          <p className="fw-light">Language:</p>
                          <p className="fw-light">TimeZone:</p>
                        </div>
                        <div className="">
                          <p>
                            <img
                              src={`https://flagsapi.com/${accountDetails?.billing_address[0].country}/flat/16.png`}
                            ></img>
                            &nbsp;&nbsp;
                            {accountDetails?.billing_address[0].country}
                          </p>
                          <p>
                            <img
                              src={`https://flagsapi.com/GB/flat/16.png`}
                            ></img>
                            &nbsp;&nbsp;{account?.language && account?.language}
                          </p>
                          <p>{timeZoneVal && timeZoneVal[0].name}</p>
                        </div>
                      </div>
                    </div>
                    {accountDetails.summery && (
                      <div className="summaryDetails">
                        <div className="content ms-0">
                          <h5>Summary</h5>
                          <p>{accountDetails?.summery}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="profileView mt-2">
                <div className="row">
                  <div className="col-xl-6">
                    <div className="profileDetailsHolder">
                      <div className="header">Account Details</div>
                      <div className="row" style={{ padding: 5 }}>
                        <div className="formRow col-xl-12">
                          <div className="formLabel">
                            <label htmlFor="data">Profile Name</label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              className="formItem"
                              value={account?.name ? account?.name : "User Name"}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="formRow col-xl-12">
                          <div className="formLabel">
                            <label htmlFor="data">Email</label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              className="formItem"
                              value={
                                account?.email ? account?.email : "user@mail.com"
                              }
                              disabled
                            />
                          </div>
                        </div>
                        {/* <div className="formRow col-xl-4">
                      <div className="formLabel">
                        <label htmlFor="data">Password</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={"webvio@password"}
                          disabled
                        />
                      </div>
                    </div> */}
                        {/* <div className="formRow col-xl-4">
                      <div className="formLabel">
                        <label htmlFor="data">Country Code</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={"+91 (IN)"}
                          disabled
                        />
                      </div>
                    </div> */}
                        <div className="formRow col-xl-12">
                          <div className="formLabel">
                            <label htmlFor="data">Phone Number</label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              className="formItem"
                              value={
                                accountDetails?.contact_no &&
                                accountDetails?.contact_no
                              }
                              disabled
                            />
                          </div>
                        </div>
                        {/* <div className="formRow col-xl-4">
                      <div className="formLabel">
                        <label htmlFor="data">Two Factor Authentication</label>
                      </div>
                      <div className="col-12">
                        <select
                          className="formItem"
                          name=""
                          id="selectFormRow"
                          disabled
                          defaultValue={1}
                        >
                          <option value={1}>Enabled</option>
                          <option value={2}>Disabled</option>
                        </select>
                      </div>
                    </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div className="profileDetailsHolder position-relative">
                      <div className="header d-flex align-items-center">
                        <div className="col-12">Subscription Details</div>
                      </div>
                      <div className="row" style={{ padding: "5px" }}>
                        <div className="wrapper">
                          <ul>
                            <li className="d-flex justify-content-between border border-bottom-2 border-top-0 border-start-0 border-end-0 py-2">
                              <label>Package Name</label>{" "}
                              <label className="details">
                                {accountDetails.package.name}
                              </label>
                            </li>
                            <li className="d-flex justify-content-between border border-bottom-2 border-top-0 border-start-0 border-end-0 py-2">
                              <label>Package Price</label>{" "}
                              <label className="details">
                                ${accountDetails.package.offer_price}
                              </label>
                            </li>
                            <li className="d-flex justify-content-between border border-bottom-2 border-top-0 border-start-0 border-end-0 py-2">
                              <label>Package Type</label>{" "}
                              <label className="details">
                                {accountDetails.package.subscription_type}
                              </label>
                            </li>
                            <li className="d-flex justify-content-between border border-bottom-2 border-top-0 border-start-0 border-end-0 py-2">
                              <label>Subscription Start</label>{" "}
                              <label className="details">
                                {accountDetails?.subscription?.[0].start_date}
                              </label>
                            </li>
                            <li className="d-flex justify-content-between border border-bottom-2 border-top-0 border-start-0 border-end-0 py-2">
                              <label>Subscription End</label>{" "}
                              <label className="details">
                                {accountDetails?.subscription?.[0].end_date}
                              </label>
                            </li>
                            <li className="d-flex justify-content-between border border-bottom-2 border-top-0 border-start-0 border-end-0 py-2">
                              <label>Time of Payment</label>{" "}
                              <label className="details">
                                {accountDetails?.payments[0].transaction_date}
                              </label>
                            </li>
                            <li className="d-flex justify-content-between border border-bottom-2 border-top-0 border-start-0 border-end-0 py-2">
                              <label>Payment Status</label>{" "}
                              <label className="details">
                                {accountDetails?.payments[0].payment_status}
                              </label>
                            </li>
                            <li className="d-flex justify-content-between border border-bottom-2 border-top-0 border-start-0 border-end-0 py-2">
                              <label>Transaction Id</label>{" "}
                              <label className="details">
                                {accountDetails?.payments[0].transaction_id}
                              </label>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3">
              <div className="profileView mt-3" style={{ height: "100%" }}>
                <div
                  className="profileDetailsHolder"
                  style={{ position: "sticky", top: 0 }}
                >
                  <div className="qLinkContent">
                    <h5>Quick Links</h5>
                    <p>Store</p>
                    <ul>
                      <li>
                        <Link to="#" onClick={backToTop}>
                          Buy Extensions
                        </Link>
                      </li>
                      <li>
                        <Link to="#" onClick={backToTop}>
                          Increase Users
                        </Link>
                      </li>
                      <li>
                        <Link>Explore Modules</Link>
                      </li>
                    </ul>
                    <p>How to AngelPBX</p>
                    <ul>
                      <li>
                        <Link>Setup Guide</Link>
                      </li>
                      <li>
                        <Link>Documentation</Link>
                      </li>
                    </ul>
                    <p>Connect With us</p>
                    <ul>
                      <li>
                        <Link>Know about us!</Link>
                      </li>
                      <li>
                        <Link>Connect with us!</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
