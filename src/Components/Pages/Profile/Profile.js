import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const accountDetails = useSelector((state) => state.accountDetails);
  const timeZoneRefresh = useSelector((state) => state.timeZoneRefresh);
  const allUser = useSelector((state) => state.allUser);
  const [timeZoneVal, setTimeZoneVal] = useState();
  const timeZone = useSelector((state) => state.timeZone);
  const extensionAll = useSelector((state) => state.extensionAll);
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const extensionAllRefresh = useSelector((state) => state.extensionAllRefresh);
  // const [profileExtensionData, setProfileExtensionData] = useState(null);
  const [selectedExtension, setSelectedExtension] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(false);
  const [preassignedExtension, setPreassignedExtension] = useState(false);
  const profileName = account.name;
  const acount = useSelector((state) => state.account);
  useEffect(() => {
    if (allUser?.length == 0) {
      dispatch({
        type: "SET_ALLUSERREFRESH",
        allUserRefresh: allUserRefresh + 1,
      });
    } else {
      // setProfileExtensionData(
      //   allUser?.data?.filter((item) => {
      //     return item.name == profileName;
      //   })[0]
      // );
      const result = allUser?.data?.find((item) => {
        return item.name == profileName;
      });
      setSelectedExtension(result?.extension?.extension);
    }
  }, [allUser]);

  useEffect(() => {
    if (extensionAll?.length == 0) {
      setLoading(true);
      dispatch({
        type: "SET_EXTENSIONALLREFRESH",
        extensionAllRefresh: extensionAllRefresh + 1,
      });
    } else {
      setLoading(false);
    }
  }, [extensionAll]);
  const userWithExtension = allUser?.data
    ?.filter((user) => user.extension && user.extension.extension) // Filter out null or undefined extensions
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
      return;
    }

    var parsedData = {
      account_id: acount.account_id,
      user: acount.id,
      ...(preassignedExtension ? { forceUpdate: true } : { forceUpdate: true }),
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
      setLoading(false);
    } else {
      setLoading(false);
      setPreassignedExtension(false);
    }
  };

  const handleSetExtension = () => {
    if (selectedExtension === "") {
      return;
    }

    const PreExisting = userWithExtension.some(
      (item) => item.extension == selectedExtension
    );
    if (PreExisting) {
      setPreassignedExtension(true);
    }
    setPopup(true);
  };
  return (
    <main className="mainContent">
      {loading && <CircularLoader />}
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
                      <div className="d-flex justify-content-xl-between gap-2">
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
              <div className="profileView mt-xl-2">
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
                        <div className="formRow col-xl-12">
                          <div className="formLabel">
                            <label htmlFor="data">Extension</label>
                          </div>
                          <div className="col-6">
                            <div className="row">
                              <div className="col-7 pe-0">
                                <select
                                  className="formItem me-0"
                                  style={{ width: "100%" }}
                                  name="delay"
                                  id="selectFormRow"
                                  value={selectedExtension}
                                  onChange={(e) => {
                                    setSelectedExtension(e.target.value);
                                  }}
                                >
                                  {extensionAll?.data?.map((item, index) => {
                                    const foundUser = userWithExtension.find(
                                      (value) =>
                                        value.extension === item.extension
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
                                  })}
                                </select>
                              </div>
                              <div className="col-5">
                                <button
                                  className="panelButton ms-0"
                                  style={{height: '34px'}}
                                  onClick={() => handleSetExtension()}
                                  // effect="ripple"
                                >
                                  <span className="text">Save</span>
                                  <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                                </button>
                              </div>
                            </div>
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
                  <div className="col-xl-6 mt-xl-0 mt-3">
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
              <div className="profileView mt-xl-3" style={{ height: "100%" }}>
                <div
                  className="profileDetailsHolder"
                  style={{ position: "sticky", top: 0 }}
                >
                  <div className="qLinkContent">
                    <h5>Quick Links</h5>
                    <p>Store</p>
                    <ul>
                      <li>
                        <Link to="/extensions" onClick={backToTop}>
                          Buy Extensions
                        </Link>
                      </li>
                      <li>
                        <Link to="/users" onClick={backToTop}>
                          Increase Users
                        </Link>
                      </li>
                      <li>
                        <Link onClick={() => featureUnderdevelopment()}>
                          Explore Modules
                        </Link>
                      </li>
                    </ul>
                    <p>How to AngelPBX</p>
                    <ul>
                      <li>
                        <Link onClick={() => featureUnderdevelopment()}>
                          Setup Guide
                        </Link>
                      </li>
                      <li>
                        <Link onClick={() => featureUnderdevelopment()}>
                          Documentation
                        </Link>
                      </li>
                    </ul>
                    <p>Connect With us</p>
                    <ul>
                      <li>
                        <Link
                          onClick={() =>
                            navigate("https://ucaas.webvio.in:3001/")
                          }
                        >
                          Know about us!
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={() =>
                            navigate("https://ucaas.webvio.in:3001/")
                          }
                        >
                          Connect with us!
                        </Link>
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
                      ? `By Confirming this, ${selectedExtension} extension will be assigned to you and pre-assigned user will be unassigned of any extension. `
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
                        <i class="fa-solid fa-check"></i>
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
