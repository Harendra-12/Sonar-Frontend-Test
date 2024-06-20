import React, { useEffect, useRef, useState } from "react";
import Header from "../../CommonComponents/Header";
import { useDispatch, useSelector } from "react-redux";
// import CircularLoader from "../Misc/CircularLoader";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";
import { Link, useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";

function TempDashboard() {
  const dispatch = useDispatch();
  const wrapperRef = useRef(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openNumber, setOpenNumber] = useState(0);
  const navigate = useNavigate();
  const [account, setAccount] = useState(
    useSelector((state) => state.tempAccount)
  );
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/account/${account.id}`);
      if (apiData.status) {
        setAccount(apiData.data);
        dispatch({
          type: "SET_TEMPACCOUNT",
          tempAccount: apiData.data,
        });
        localStorage.setItem("tempAccount", JSON.stringify(apiData.data));
        if (Number(apiData.data.company_status) > 4) {
          navigate("/dashboard");
        }
      }
    }
    getData();

    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpenPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
  return (
    <>
      <style>
        {`
      .formRow{
        border: none;
      }
      .formItem{
        margin: 0px 5px 0px 0px;
        color: #000;
      }
      .formLabel{
        padding: 0px 0px 5px;
      }
      .wrapper{
        padding: 10px 10px 0 ;
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

      .qLinkContent .iconWrapper2{
          width: 35px;
          border-radius: 50%;
          height: 35px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--ui-accent);
          color: #fff;
      }

      .profileDetailsHolder .imgWrapper{
        width: 100px;
        height: 130px;
        margin: auto;
        padding-top: 20px;
      }
      .profileDetailsHolder .imgWrapper img{
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .profileDetailsHolder h5 {
        color: var(--color-subtext);
        font-weight: 400;
      }
        .getApp,.clearColorButton{
        display:none;
        }
      .profileDetailsHolder a {text-decoration: none}
      `}
      </style>
      <div className="mainContent">
        <div className="col-12">
          <Header title="New User Details" />
          <div class="d-flex flex-wrap">
            <div className="col-xl-12">
              <div className="profileView">
                <div className="profileDetailsHolder position-relative">
                  <div
                    class="baseDetails row align-items-center mt-3"
                    style={{ padding: "30px 10px 55px" }}
                  >
                    <div className="col-xl-8 px-0 mx-auto position-relative">
                      <div
                        class="progress"
                        role="progressbar"
                        aria-label="Animated striped example"
                        aria-valuenow="50"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          class="progress-bar progress-bar-striped progress-bar-animated bg-success"
                          style={{
                            width: `${
                              Number(account.company_status) === 1
                                ? "40"
                                : Number(account.company_status) === 2
                                ? "55"
                                : Number(account.company_status) === 3
                                ? "65"
                                : "85"
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="progressStepWrapper">
                        <div className="stepWrapper col-3 success">
                          {/* <div className="status">Verified</div> */}
                          <div class="step">
                          <Tippy content="Your Account is verified">
                            <i class="fa-sharp fa-solid fa-check"></i>
                          </Tippy>
                          </div>
                          <label>Accounts</label>
                        </div>
                        <div
                          className={`stepWrapper col-3 ${
                            Number(account.company_status) > 1
                              ? "success"
                              : "pending"
                          }`}
                        >
                          {/* <div className="status">
                            {" "}
                            {Number(account.company_status) === 1
                              ? "Under Process"
                              : "Verified"}
                          </div> */}
                          <div class="step">
                            {Number(account.company_status) > 1 ? (
                              <Tippy content="Your payment is verified">
                              <i class="fa-sharp fa-solid fa-check"></i>
                              </Tippy>
                            ) : (
                              <Tippy content="Your payment is under verification">
                              <i class="fa-sharp fa-solid fa-credit-card"></i>
                              </Tippy>
                            )}
                          </div>
                          <label>Payment</label>
                        </div>
                        <div
                          className={`stepWrapper col-3 ${
                            Number(account.company_status) === 3
                              ? "pending"
                              : Number(account.company_status) > 3
                              ? "success"
                              : ""
                          }`}
                        >
                          {/* {Number(account.company_status) === 3 ? (
                            <div className="status">Under Process</div>
                          ) : Number(account.company_status) > 3 ? (
                            <div className="status">Verified</div>
                          ) : (
                            " "
                          )} */}
                          <div class="step ">
                            {Number(account.company_status) > 3 ? (
                              <Tippy content="Your Document is verified">
                              <i class="fa-sharp fa-solid fa-check"></i>
                              </Tippy>
                            ) : (
                              <Tippy content="Your Document is under verification">
                              <i class="fa-sharp fa-solid fa-credit-card"></i>
                              </Tippy>
                            )}
                          </div>
                          <label>Documents</label>
                        </div>
                        <div
                          className={`stepWrapper col-3 ${
                            Number(account.company_status) === 4
                              ? "pending"
                              : Number(account.company_status) > 4
                              ? "success"
                              : ""
                          }`}
                        >
                          {/* {Number(account.company_status) === 4 ? (
                            <div className="status">Under Process</div>
                          ) : Number(account.company_status) > 3 ? (
                            <div className="status">Verified</div>
                          ) : (
                            " "
                          )} */}
                          <div class="step">
                            {Number(account.company_status) > 4 ? (
                              <Tippy content="Your Account is configured successfully">
                              <i class="fa-sharp fa-solid fa-check"></i>
                              </Tippy>
                            ) : (
                              <Tippy content="Your Account is being configured">
                              <i class="fa-sharp fa-solid fa-credit-card"></i>
                              </Tippy>
                            )}
                          </div>
                          <label>Configure Account</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-9">
              <div className="profileView">
                <div className="profileDetailsHolder position-relative">
                  <div className="header d-flex align-items-center">
                    <div className="col-5">Account Details</div>
                  </div>
                  <div className="row px-2 pb-2 border-bottom">
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Company Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={account.company_name}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Admin Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={account.admin_name}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Email</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={account.email}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Phone Number</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={account.contact_no}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Alternate Number</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={account.alternate_contact_no}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Timezone</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={account.timezone.name}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Block/Unit/Place</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={account.unit}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Building</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={account.building}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">City</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={account.city}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Zip Code</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={account.zip}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">State</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={account.state}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-2 col-md-4 col-6">
                      <div className="formLabel">
                        <label htmlFor="data">Country</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={account.country}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-wrap">
                <div className="col-xl-6">
                  <div className="profileView">
                    <div className="profileDetailsHolder position-relative">
                      <div className="header d-flex align-items-center">
                        <div className="col-12">Payment & Subscription Details</div>
                      </div>
                      <div class="row" style={{ padding: "5px" }}>
                        <div class="wrapper">
                          <ul>
                          <li>
                              <label>Package Name</label>{" "}
                              <label class="details">
                                {account.package.name}
                              </label>
                            </li>
                            <li>
                              <label>Package Price</label>{" "}
                              <label class="details">
                                ${account.package.offer_price}
                              </label>
                            </li>
                            <li>
                              <label>Package Type</label>{" "}
                              <label class="details">
                                {account.package.subscription_type}
                              </label>
                            </li>
                            <li>
                              <label>Subscription Start</label>{" "}
                              <label class="details">
                              {account?.payments[0].subscription?.start_date}
                              </label>
                            </li>
                            <li>
                              <label>Subscription End</label>{" "}
                              <label class="details">
                              {account?.payments[0].subscription?.end_date}
                              </label>
                            </li>
                            <li>
                              <label>Time of Payment</label>{" "}
                              <label class="details">
                                {
                                  account?.payments[0].transaction_date
                                }
                              </label>
                            </li>
                            <li>
                              <label>Payment Status</label>{" "}
                              <label class="details">
                                {account?.payments[0].payment_status}
                              </label>
                            </li>
                            <li>
                              <label>Transaction Id</label>{" "}
                              <label class="details">
                                {account?.payments[0].transaction_id}
                              </label>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="profileView">
                    <div className="profileDetailsHolder position-relative">
                      <div className="header d-flex align-items-center">
                        <div className="col-12">Billing Details</div>
                      </div>
                      <div class="row" style={{ padding: "5px" }}>
                        <div class="wrapper">
                          <ul>
                            <li>
                              <label>Full Name</label>{" "}
                              <label class="details">{account?.payments[0]?.billing_address?.fullname}</label>
                            </li>
                            <li>
                              <label>Email</label>{" "}
                              <label class="details">{account?.payments[0]?.billing_address?.email}</label>
                            </li>
                            <li>
                              <label>Phone Number</label>{" "}
                              <label class="details">{account?.payments[0]?.billing_address?.contact_no}</label>
                            </li>
                            <li>
                              <label>Address</label>{" "}
                              <label class="details">
                              {account?.payments[0]?.billing_address?.address}
                              </label>
                            </li>
                            <li>
                              <label>Zip Code</label>{" "}
                              <label class="details">{account?.payments[0]?.billing_address?.zip}</label>
                            </li>
                            <li>
                              <label>City</label>{" "}
                              <label class="details">{account?.payments[0]?.billing_address?.city}</label>
                            </li>
                            <li>
                              <label>State</label>{" "}
                              <label class="details">{account?.payments[0]?.billing_address?.state}</label>
                            </li>
                            <li>
                              <label>Country</label>{" "}
                              <label class="details">{account?.payments[0]?.billing_address?.country}</label>
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
              <div className="profileView">
                <div className="profileDetailsHolder">
                  <div className="header d-flex align-items-center">
                    <div className="col-12">Documents Uploaded</div>
                  </div>
                  {account.details ? (
                    <div className="qLinkContent px-3 mt-2" ref={wrapperRef}>
                      <div className="row position-relative mb-2 align-items-center">
                        <div className="col-auto ps-0 pe-2">
                          <div className="iconWrapper2">
                            <i class="fa-solid fa-image"></i>
                          </div>
                        </div>
                        <div className="col-8 my-auto ps-1">
                          <p>Registeration</p>
                        </div>
                        <div
                          className="col-auto px-0 my-auto ms-auto"
                          onClick={() => {
                            setOpenPopup(!openPopup);
                            setOpenNumber(1);
                          }}
                        >
                          <div className="iconWrapper">
                            <i class="fa-solid fa-ellipsis"></i>
                          </div>
                        </div>
                        <div class="border mt-2 mx-auto col-10"></div>
                        {openPopup && openNumber === 1 ? (
                          <div className="buttonPopup">
                            <div style={{ cursor: "pointer" }}>
                              <div
                                className="clearButton"
                                onClick={() =>
                                  downloadImage(
                                    account?.details.registration_path,
                                    "Register file"
                                  )
                                }
                              >
                                <i class="fa-solid fa-file-arrow-down"></i>{" "}
                                Download
                              </div>
                            </div>
                            <div style={{ cursor: "pointer" }}>
                              <div className="clearButton">
                                <a
                                  href={account?.details.registration_path}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <i class="fa-sharp fa-solid fa-eye"></i> View
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="row position-relative mb-2 align-items-center">
                        <div className="col-auto ps-0 pe-2">
                          <div className="iconWrapper2">
                            <i class="fa-solid fa-image"></i>
                          </div>
                        </div>
                        <div className="col-8 my-auto ps-1">
                          <p>MOA</p>
                        </div>
                        <div
                          className="col-auto px-0 my-auto ms-auto"
                          onClick={() => {
                            setOpenPopup(!openPopup);
                            setOpenNumber(2);
                          }}
                        >
                          <div className="iconWrapper">
                            <i class="fa-solid fa-ellipsis"></i>
                          </div>
                        </div>
                        <div class="border mt-2 mx-auto col-10"></div>
                        {openPopup && openNumber === 2 ? (
                          <div className="buttonPopup">
                            <div style={{ cursor: "pointer" }}>
                              <div
                                className="clearButton"
                                onClick={() =>
                                  downloadImage(
                                    account?.details.moa_path,
                                    "Register file"
                                  )
                                }
                              >
                                <i class="fa-solid fa-file-arrow-down"></i>{" "}
                                Download
                              </div>
                            </div>
                            <div style={{ cursor: "pointer" }}>
                              <div className="clearButton">
                                <a
                                  href={account?.details.moa_path}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <i class="fa-sharp fa-solid fa-eye"></i> View
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="row position-relative mb-2 align-items-center">
                        <div className="col-auto ps-0 pe-2">
                          <div className="iconWrapper2">
                            <i class="fa-solid fa-image"></i>
                          </div>
                        </div>
                        <div className="col-8 my-auto ps-1">
                          <p>TIN</p>
                        </div>
                        <div
                          className="col-auto px-0 my-auto ms-auto"
                          onClick={() => {
                            setOpenPopup(!openPopup);
                            setOpenNumber(3);
                          }}
                        >
                          <div className="iconWrapper">
                            <i class="fa-solid fa-ellipsis"></i>
                          </div>
                        </div>
                        <div class="border mt-2 mx-auto col-10"></div>
                        {openPopup && openNumber === 3 ? (
                          <div className="buttonPopup">
                            <div style={{ cursor: "pointer" }}>
                              <div
                                className="clearButton"
                                onClick={() =>
                                  downloadImage(
                                    account?.details.tin_path,
                                    "Register file"
                                  )
                                }
                              >
                                <i class="fa-solid fa-file-arrow-down"></i>{" "}
                                Download
                              </div>
                            </div>
                            <div style={{ cursor: "pointer" }}>
                              <div className="clearButton">
                                <a
                                  href={account?.details.tin_path}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <i class="fa-sharp fa-solid fa-eye"></i> View
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to="/upload-document">
                      <div className="imgWrapper">
                      <img src={require('../../assets/images/upload-file.png')} />
                      </div>
                      <div class="text-center mt-3"><h5>Please upload the <span style={{color: 'var(--ui-accent)', cursor: 'pointer'}}><b>required documents</b></span>.</h5></div>
                    </Link>
                  )}
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

export default TempDashboard;
