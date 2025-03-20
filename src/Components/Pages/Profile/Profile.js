/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import { useDispatch, useSelector } from "react-redux";
import {
  backToTop,
  featureUnderdevelopment,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import CircularLoader from "../../Loader/CircularLoader";
import { toast } from "react-toastify";

const Profile = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const accountDetails = useSelector((state) => state.accountDetails);
  const timeZoneRefresh = useSelector((state) => state.timeZoneRefresh);
  const allUser = useSelector((state) => state.allUser);
  const [timeZoneVal, setTimeZoneVal] = useState();
  const timeZone = useSelector((state) => state.timeZone);
  const extensionAll = useSelector((state) => state.extensionAll);
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const extensionAllRefresh = useSelector((state) => state.extensionAllRefresh);
  const [selectedExtension, setSelectedExtension] = useState(
    account?.extension?.extension
  );

  const [selectedTimeZone, setSelectedTimeZone] = useState(
    account?.timezone_id
  );

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(false);
  const [preassignedExtension, setPreassignedExtension] = useState(false);
  const acount = useSelector((state) => state.account);
  const isCustomerAdmin = account?.email == accountDetails?.email;

  useEffect(() => {
    if (isCustomerAdmin) {
      if (allUser?.length == 0) {
        dispatch({
          type: "SET_ALLUSERREFRESH",
          allUserRefresh: allUserRefresh + 1,
        });
      } 
    }
  }, [allUser]);

  useEffect(() => {
    if (isCustomerAdmin) {
      if (extensionAll?.length == 0) {
        setLoading(true);
        dispatch({
          type: "SET_EXTENSIONALLREFRESH",
          extensionAllRefresh: extensionAllRefresh + 1,
        });
      } else {
        setLoading(false);
      }
    }
  }, [extensionAll]);

  useEffect(() => {
    const updateAccountDetails = async () => {
      try {
        const profile = await generalGetFunction("/user");
        if (profile?.status) {
          dispatch({
            type: "SET_ACCOUNT",
            account: profile.data,
          });
          const timezoneId = profile?.data?.timezone_id;
          const selectedTimeZone = timeZone.filter((item) => {
            return item.id === timezoneId;
          });
          setTimeZoneVal(selectedTimeZone.name);
          setSelectedTimeZone(profile?.data?.timezone_id);
          setTimeZoneVal(selectedTimeZone);
        }
      } catch (error) {
      }
    };
    updateAccountDetails();
  }, []);

  const userWithExtension = allUser?.data
    ?.filter((user) => user.extension && user?.extension?.extension) // Filter out null or undefined extensions
    .map((user) => ({
      name: user.name,
      extension: user.extension.extension, // Access the nested extension value
      id: user.id,
    }));

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

  const handleUpdateExtension = async () => {
    setLoading(true);
    const extensionId = extensionAll?.data?.filter((item) => {
      return item.extension === selectedExtension;
    })[0]?.id;
    if (!extensionId) {
      toast.error("Extension not found");
      setLoading(false);
      return;
    }

    var parsedData = {
      account_id: acount.account_id,
      user: acount.id,
      ...(preassignedExtension ? { forceUpdate: true } : { forceUpdate: true }),
      forward: account?.extension?account?.extension?.forward:"disabled",
      forward_to: account?.extension?account?.extension?.forward_to:null,
      timezone_id: selectedTimeZone,
    };
    setPopup(false);
    const apiData = await generalPutFunction(
      `/extension/${extensionId}`,
      parsedData
    );
    if (apiData.status) {
      dispatch({
        type: "SET_ALLUSERREFRESH",
        allUserRefresh: allUserRefresh + 1,
      });
      toast.success(apiData.message);
      setPreassignedExtension(false);
      setTimeZoneVal(
        timeZone.filter((item) => {
          return item.id == selectedTimeZone;
        })
      );

      setLoading(false);
    } else {
      setLoading(false);
      setPreassignedExtension(false);
    }
  };

  useEffect(()=>{
    generalGetFunction("/cdr?page=1&row_per_page=20")
  },[])

  return (
    <main className="mainContent">
      {loading && <CircularLoader />}
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="My Profile" />
            {/* <div className="col-12 mt-3">
               <div className="row px-xl-3 py-2" id="detailsHeader">
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
              </div> 
            </div> */}
          </div>
          <div className="row" style={{ padding: "20px 10px" }}>
            <div className="col-xl-5 pe-xl-0">
              <div className="profileView">
                <div className="profileDetailsHolder p-0">
                  <div className="baseDetails">
                    <div className="col-xxl-3 col-xl-4">
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
                    <div className="col-xxl-9 col-xl-8 my-auto">
                      <div>
                        <div className="content profileicons mt-1 d-flex align-items-center justify-content-start">
                          <span>
                            <i className="fa-regular me-3 fa-user"></i>
                          </span>
                          <h5 className="mb-0">
                            {account?.name ? account?.name : "User Name"}
                          </h5>
                        </div>
                        <div className="content profileicons mt-1  d-flex align-items-center justify-content-start">
                          <span>
                            <i className="fa-regular me-3 fa-envelope"></i>
                          </span>
                          <p className="mb-0">
                            {" "}
                            {account?.email ? account?.email : "user@mail.com"}
                          </p>

                          {/* <p >
                        <span>
                          <i className="fa-duotone fa-location-dot"></i>
                        </span>{" "}
                        {accountDetails?.billing_address &&
                          accountDetails?.billing_address[0].address}
                      </p> */}
                        </div>

                        <div className="content profileicons mt-1 d-flex align-items-center justify-content-start">
                          <span>
                            <i className="fa-solid me-3 fa-location-dot"></i>
                          </span>
                          <p className="mb-0">
                            {accountDetails?.billing_address &&
                              accountDetails?.billing_address[0].address}
                          </p>
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

              <div className="row">
                <div className="col-md-12">
                  <div className="profileView">
                    <div className="profileDetailsHolder p-0">
                      <div className="profileView mt-xl-2">
                        <div className="row" style={{ padding: 5 }}>
                          <div className="header">Account Details</div>
                          <div className="formRow col-xl-12">
                            <div className="formLabel">
                              <label htmlFor="data">Profile Name</label>
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                className="formItem"
                                value={
                                  account?.name ? account?.name : "User Name"
                                }
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
                                  account?.email
                                    ? account?.email
                                    : "user@mail.com"
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
                          <hr className="my-3" />
                          {isCustomerAdmin && (
                            <>
                              <div className="formRow col-xl-12">
                                <div className="formLabel">
                                  <label htmlFor="data">Time zone</label>
                                </div>
                                <div className="col-6">
                                  <div className="row">
                                    <div className="col-12">
                                      <select
                                        className="formItem me-0"
                                        style={{ width: "100%" }}
                                        name="delay"
                                        id="selectFormRow"
                                        value={selectedTimeZone}
                                        onChange={(e) => {
                                          setSelectedTimeZone(e.target.value);
                                        }}
                                      >
                                        {timeZone?.map((item, index) => {
                                          return (
                                            <>
                                              <option value={item.id}>
                                                {item.name}
                                              </option>
                                            </>
                                          );
                                        })}
                                      </select>
                                    </div>
                                    {/* <div className="col-4 ps-0">
                                      <button
                                        className="panelButton static ms-0 w-100"
                                        style={{ height: "34px" }}
                                        onClick={() => handleChangeTimeZone()}
                                      >
                                        <span className="text">Change</span>
                                      </button>
                                    </div> */}
                                  </div>
                                </div>
                              </div>
                              <div className="formRow col-xl-12">
                                <div className="formLabel">
                                  <label htmlFor="data">Extension</label>
                                </div>
                                <div className="col-6">
                                  <div className="row">
                                    <div className="col-12">
                                      <select
                                        className="formItem me-0"
                                        style={{ width: "100%" }}
                                        name="delay"
                                        id="selectFormRow"
                                        value={selectedExtension ?? ""}
                                        onChange={(e) => {
                                          setSelectedExtension(e.target.value);
                                        }}
                                      >
                                        {/* Placeholder Option */}
                                        <option value="" disabled>
                                          Please select any value
                                        </option>

                                        {extensionAll?.data?.map(
                                          (item, index) => {
                                            const foundUser =
                                              userWithExtension?.find(
                                                (value) =>
                                                  value.extension ===
                                                  item.extension
                                              );
                                            return (
                                              <>
                                                <option value={item.extension}>
                                                  {item.extension}{" "}
                                                  {foundUser
                                                    ? `(${foundUser.name})`
                                                    : ""}
                                                </option>
                                              </>
                                            );
                                          }
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 mt-2">
                                <button
                                  className="panelButton ms-auto"
                                  style={{ height: "34px" }}
                                  onClick={() => handleUpdateExtension()}
                                  // effect="ripple"
                                >
                                  <span className="text">Save</span>
                                  <span className="icon">
                                    <i className="fa-solid fa-floppy-disk"></i>
                                  </span>
                                </button>
                              </div>
                            </>
                          )}

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
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 pe-xl-0">
              <div className="row">
                <div className="col-md-12">
                  <div className="profileView ">
                    <div className="profileDetailsHolder baseDetails">
                      <div className="content w-100">
                        <h5 className=" me-2">All details</h5>
                        <div className="mt-2">
                          <div
                            className=" d-flex align-items-center justify-content-between "
                            style={{ height: "25px" }}
                          >
                            <p className=" me-2">Country:</p>

                            <p
                              className="imgwidth d-flex ms-2 me-2"
                              style={{ minWidth: "75px" }}
                            >
                              <img
                                alt=""
                                src={`https://flagsapi.com/${accountDetails?.country}/flat/16.png`}
                              ></img>
                              &nbsp;&nbsp;
                              {accountDetails?.country}
                            </p>
                          </div>
                          <div
                            className=" d-flex align-items-center justify-content-between "
                            style={{ height: "25px" }}
                          >
                            <p className=" me-2">Language:</p>
                            <div>
                              <p
                                className="imgwidth d-flex  ms-2 me-2"
                                style={{ minWidth: "75px" }}
                              >
                                <img
                                  alt=""
                                  src={`https://flagsapi.com/GB/flat/16.png`}
                                ></img>
                                &nbsp;&nbsp;
                                {account?.language && account?.language}
                              </p>
                            </div>
                          </div>
                          <div
                            className=" d-flex align-items-center justify-content-between "
                            style={{ height: "25px" }}
                          >
                            <p className=" me-2">TimeZone:</p>

                            <p
                              className=" ms-2 me-2"
                              style={{ minWidth: "75px" }}
                            >
                              {timeZoneVal && timeZoneVal[0]?.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {isCustomerAdmin && (
                <div className="row">
                  <div className="col-md-12">
                    <div className="profileView mt-2">
                      <div className="profileDetailsHolder p-0">
                        {/* <div className="ribbon">Subscription Details</div> */}
                        <div className="row" style={{ padding: "15px" }}>
                          <div className="col-12 header">
                            Subscription Details
                          </div>
                          <div className="wrapper0">
                            <ul>
                              <li className="d-flex justify-content-between border-bottom py-1">
                                <label className="formLabel">
                                  Package Name
                                </label>{" "}
                                <label className="formLabel details">
                                  {accountDetails.package.name}
                                </label>
                              </li>
                              <li className="d-flex justify-content-between border-bottom py-1">
                                <label className="formLabel">
                                  Package Price
                                </label>{" "}
                                <label className="formLabel details">
                                  ${accountDetails.package.offer_price}
                                </label>
                              </li>
                              <li className="d-flex justify-content-between border-bottom py-1">
                                <label className="formLabel">
                                  Package Type
                                </label>{" "}
                                <label className="formLabel details">
                                  {accountDetails.package.subscription_type}
                                </label>
                              </li>
                              <li className="d-flex justify-content-between border-bottom py-1">
                                <label className="formLabel">
                                  Subscription Start
                                </label>{" "}
                                <label className="formLabel details">
                                  {accountDetails?.subscription?.[0].start_date}
                                </label>
                              </li>
                              <li className="d-flex justify-content-between border-bottom py-1">
                                <label className="formLabel">
                                  Subscription End
                                </label>{" "}
                                <label className="formLabel details">
                                  {accountDetails?.subscription?.[0].end_date}
                                </label>
                              </li>
                              <li className="d-flex justify-content-between border-bottom py-1">
                                <label className="formLabel">
                                  Time of Payment
                                </label>{" "}
                                <label className="formLabel details">
                                  {accountDetails?.payments[0].transaction_date}
                                </label>
                              </li>
                              <li className="d-flex justify-content-between border-bottom py-1">
                                <label className="formLabel">
                                  Payment Status
                                </label>{" "}
                                <label className="formLabel details">
                                  {accountDetails?.payments[0].payment_status}
                                </label>
                              </li>
                              <li className="d-flex justify-content-between border-bottom py-2">
                                <label className="formLabel">
                                  Transaction Id
                                </label>{" "}
                                <label className="formLabel details">
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
              )}
            </div>

            <div className="col-xl-3">
              <div className="profileView " style={{ height: "100%" }}>
                <div
                  className="profileDetailsHolder p-0"
                  style={{ position: "sticky", top: 0 }}
                >
                  <div className="qLinkContent">
                    <h5>Quick Links</h5>
                    <p>Store</p>
                    <ul>
                      <li>
                        <Link to="/extensions" onClick={backToTop}>
                          <div className="arrowicon me-1">
                            <i className="fa-solid me-1 fa-arrow-right"></i>
                            Buy Extensions
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link to="/users" onClick={backToTop}>
                          <div className="arrowicon me-1">
                            <i className="fa-solid me-1 fa-arrow-right"></i>
                            Increase Users
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link onClick={() => featureUnderdevelopment()}>
                          <div className="arrowicon me-1">
                            <i className="fa-solid me-1 fa-arrow-right"></i>
                            Explore Modules
                          </div>
                        </Link>
                      </li>
                    </ul>
                    <p>How to AngelPBX</p>
                    <ul>
                      <li>
                        <Link onClick={() => featureUnderdevelopment()}>
                          <div className="arrowicon me-1">
                            <i className="fa-solid me-1 fa-arrow-right"></i>
                            Setup Guide
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link onClick={() => featureUnderdevelopment()}>
                          <div className="arrowicon me-1">
                            <i className="fa-solid me-1 fa-arrow-right"></i>
                            Documentation
                          </div>
                        </Link>
                      </li>
                    </ul>
                    <p>Connect With us</p>
                    <ul>
                      <li>
                        {/* <Link
                          onClick={() => navigate(process.env.NEXT_APP_URL)}
                        >
                          <div className="arrowicon me-1">
                            <i className="fa-solid me-1 fa-arrow-right"></i>
                            Know about us!
                          </div>
                        </Link> */}
                        <a
                          href={`${process.env.NEXT_APP_URL}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="arrowicon me-1">
                            <i className="fa-solid me-1 fa-arrow-right"></i>
                            Know about us!
                          </div>
                        </a>
                      </li>
                      <li>
                        {/* <Link
                          onClick={() =>
                            navigate("https://ucaas.webvio.in:3001/")
                          }
                        >
                          <div className="arrowicon me-1">
                            <i className="fa-solid me-1 fa-arrow-right"></i>
                            Connect with us!
                          </div>
                        </Link> */}
                        <a
                          href={`${process.env.NEXT_APP_URL}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="arrowicon me-1">
                            <i className="fa-solid me-1 fa-arrow-right"></i>
                            Connect with us!
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {popup ? (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="row content col-xl-4">
                <div className="col-2 px-0">
                  <div className="iconWrapper">
                    <i className="fa-duotone fa-triangle-exclamation"></i>
                  </div>
                </div>
                <div className="col-10 ps-0">
                  <h4>Warning!</h4>
                  <p>
                    {preassignedExtension
                      ? selectedExtension != ""
                        ? `By Confirming this, ${selectedExtension} extension will be assigned to you and pre-assigned user will be unassigned of any extension. `
                        : `By Confirming this, Assigned extension will be removed from your account`
                      : `By Confirming this, ${selectedExtension} extension will be assigned to you.`}
                    ?
                  </p>

                  <div className="d-flex justify-content-between">
                    <button
                      className="panelButton m-0"
                      onClick={() => {
                        handleUpdateExtension();
                      }}
                    >
                      <span className="text">Confirm</span>
                      <span className="icon">
                        <i className="fa-solid fa-check"></i>
                      </span>
                    </button>
                    <button
                      className="panelButtonWhite m-0 float-end"
                      onClick={() => {
                        setPopup(false);
                        setPreassignedExtension(false);
                      }}
                    >
                      Cancel
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
    </main>
  );
};

export default Profile;
