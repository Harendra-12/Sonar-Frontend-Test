import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import {
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useLocation } from "react-router-dom";
import CircularLoader from "../Misc/CircularLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserDocumentDetails() {
  const [loading, setLoading] = useState(true);
  const [accountDetails, setAccountDetails] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [propupNumber, setPopupNumber] = useState(0);
  const queryParams = new URLSearchParams(useLocation().search);
  const value = queryParams.get("id");
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/account/${value}`);
      if (apiData.status) {
        setLoading(false);
        setAccountDetails(apiData.data);
      }
    }
    getData();
  }, [value]);

  console.log("This is account Details", accountDetails);
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

  async function handleApprove() {
    setLoading(true);
    const parsedData = {
      account_id: String(accountDetails.id),
      package_id: String(accountDetails.package_id),
      company_status: "applied",
    };
    const apiData = await generalPostFunction("/document-verify", parsedData);
    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message);
    } else {
      setLoading(false);
      toast.error(apiData.message);
    }
  }
  return (
    <>
      <style>
        {`
      .formRow{
        padding: 5px 10px;
      }
      .formLabel {
        padding: 0 0 2px 0;
      }
      .formItem{
        border: none;
        color: #000;
        font-weight: 500;
        padding: 0;
        margin: 0;
        height: auto;
      }
      .qLinkContent .imgWrapper{
        width: 50px;
        height: 50px;
        border: 1px solid #bbb;
        overflow: hidden;
        border-radius: 50%;
      }
      .qLinkContent .imgWrapper img{
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .qLinkContent h5{
        padding-bottom: 0;
      }
      .qLinkContent p{
        font-size: 16px;
      }
      .clearButton{
        color: #fff;
      }
      .clearButton a{
        text-decoration: none;
        color: #fff;
      }
      .wrapper{
        padding: 10px 15px 0 ;
      }
      .wrapper ul{
        padding: 0;
        list-style: none;
      }

      .wrapper ul li{
        margin-bottom: 7px;
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

      .approvalButton{
        position:absolute;
        top: 0;
        right: 0;
      }
      .approvalButton button {
        border-radius: 0;
        border-bottom-left-radius: 7px;
        border-top-right-radius: 7px;
      }

      .qLinkContent .iconWrapper{
        height: 35px;
        width: 35px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.3s;
        cursor: pointer;
      }

      .qLinkContent .iconWrapper:hover{
        background-color: #dbdbdb;
      }

      .qLinkContent .iconWrapper i{
        font-size: 20px;
      }

      .buttonPopup{
        width: 120px;
        border-radius: 10px;
        background-color: #303030;
        padding: 10px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        position: absolute;
        right: 10px;
        bottom: -45px;
      }
     
    `}
      </style>
      <div className="mainContent">
        <div className="col-12">
          <Header title="User Details" />
          <div class="d-flex flex-wrap">
            <div className="col-xl-12">
              <div className="profileView mt-3">
                <div className="profileDetailsHolder position-relative">
                  <div className="header d-flex align-items-center">
                    <div className="col-5">Account Details</div>
                    {accountDetails?.details == null ? (
                      <div className="approvalButton">
                        {" "}
                        <button className="float-end btn btn-danger btn-sm">
                          <i class="fa-light fa-triangle-exclamation"></i> Document Not Uploaded
                        </button>{" "}
                      </div>
                    ) : accountDetails?.company_status === "applied" ? (
                      <div className="approvalButton">
                        {" "}
                        <button className="float-end btn btn-success btn-sm">
                          <i class="fa-duotone fa-check-double"></i> Approved
                        </button>{" "}
                      </div>
                    ) : (
                      <div className="approvalButton">
                        <button
                          className="float-end btn btn-outline-success btn-sm"
                          onClick={handleApprove}
                        >
                          <i class="fa-duotone fa-check"></i> Approve
                        </button>{" "}
                        {/* <button className="float-end btn btn-danger mx-2 btn-sm">
                    <i class="fa-regular fa-xmark"></i> Refuse
                  </button> */}
                      </div>
                    )}
                  </div>
                  <div className="row" style={{ padding: 5 }}>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="data">Company Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={accountDetails?.company_name}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="data">Admin Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="email"
                          className="formItem"
                          value={accountDetails?.admin_name}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="data">Admin Email</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={accountDetails?.email}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="data">Phone Number</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={accountDetails?.contact_no}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="data">Alternate Number</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={accountDetails?.alternate_contact_no}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="data">Timezone</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={accountDetails?.timezone.name}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="data">Block/Unit/Place</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={accountDetails?.unit}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="data">Building</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={accountDetails?.building}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="data">City</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={accountDetails?.city}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="data">Zip Code</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={accountDetails?.zip}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="data">State</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={accountDetails?.state}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="data">Country</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          value={accountDetails?.country}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="profileView" style={{ height: "100%" }}>
                <div
                  className="profileDetailsHolder"
                  style={{ position: "sticky", top: 0 }}
                >
                  <div className="header d-flex align-items-center">
                    <div className="col-12">Uploaded Documents</div>
                  </div>
                  {accountDetails?.details !== null ? (
                    <div className="qLinkContent px-3 mt-2">
                      <div className="row position-relative">
                        <div className="col-auto ps-0">
                          <div className="iconWrapper">
                            <i
                              class="fa-solid fa-image"
                              style={{ color: "var(--ui-accent)" }}
                            ></i>
                            {/* <img
                              src={accountDetails?.details.registration_path}
                              alt="reg"
                            /> */}
                          </div>
                        </div>
                        <div className="col-8 my-auto ps-1">
                          <p>ID Card</p>
                        </div>
                        <div className="col-auto px-0 my-auto">
                          <div
                            className="iconWrapper"
                            onClick={() => {
                              setOpenPopup((prev) => !prev);
                              setPopupNumber(1);
                            }}
                          >
                            <i class="fa-solid fa-ellipsis"></i>
                          </div>
                        </div>
                        {openPopup && propupNumber === 1 ? (
                          <div className="buttonPopup">
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                downloadImage(
                                  accountDetails?.details.registration_path,
                                  accountDetails.company_name + "registration"
                                )
                              }
                            >
                              <div className="clearButton">
                                <i class="fa-solid fa-file-arrow-down"></i>{" "}
                                Download
                              </div>
                            </div>
                            <div style={{ cursor: "pointer" }}>
                              <div className="clearButton">
                                <a
                                  href={
                                    accountDetails?.details.registration_path
                                  }
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
                        <div className="border mt-2 mx-auto col-10"></div>
                      </div>
                      <div className="row position-relative mt-3">
                        <div className="col-auto ps-0">
                          <div className="iconWrapper">
                            <i
                              // class="fa-solid fa-file-pdf"
                              class="fa-solid fa-image"
                              style={{ color: "var(--ui-accent)" }}
                            ></i>
                            {/* <img
                              src={accountDetails?.details.tin_path}
                              alt="reg"
                            /> */}
                          </div>
                        </div>
                        <div className="col-8 my-auto ps-1">
                          <p>Certificate of Incorporation</p>
                        </div>
                        <div className="col-auto px-0 my-auto">
                          <div
                            className="iconWrapper"
                            onClick={() => {
                              setOpenPopup((prev) => !prev);
                              setPopupNumber(2);
                            }}
                          >
                            <i class="fa-solid fa-ellipsis"></i>
                          </div>
                        </div>
                        {openPopup && propupNumber === 2 ? (
                          <div className="buttonPopup">
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                downloadImage(
                                  accountDetails?.details.tin_path,
                                  accountDetails.company_name + "Tin"
                                )
                              }
                            >
                              <div className="clearButton">
                                <i class="fa-solid fa-file-arrow-down"></i>{" "}
                                Download
                              </div>
                            </div>
                            <div style={{ cursor: "pointer" }}>
                              <div className="clearButton">
                                <a
                                  href={accountDetails?.details.tin_path}
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
                        <div className="border mt-2 mx-auto col-10"></div>
                      </div>
                      <div className="row position-relative mt-3">
                        <div className="col-auto ps-0">
                          <div className="iconWrapper">
                            <i
                              // class="fa-solid fa-file-pdf"
                              class="fa-solid fa-image"
                              style={{ color: "var(--ui-accent)" }}
                            ></i>
                            {/* <img
                              src={accountDetails?.details.moa_path}
                              alt="reg"
                            /> */}
                          </div>
                        </div>
                        <div className="col-8 my-auto ps-1">
                          <p>Registration Certificate</p>
                        </div>
                        <div className="col-auto px-0 my-auto">
                          <div
                            className="iconWrapper"
                            onClick={() => {
                              setOpenPopup((prev) => !prev);
                              setPopupNumber(3);
                            }}
                          >
                            <i class="fa-solid fa-ellipsis"></i>
                          </div>
                        </div>
                        {openPopup && propupNumber === 3 ? (
                          <div className="buttonPopup">
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                downloadImage(
                                  accountDetails?.details.moa_path,
                                  accountDetails.company_name + "Moa"
                                )
                              }
                            >
                              <div className="clearButton">
                                <i class="fa-solid fa-file-arrow-down"></i>{" "}
                                Download
                              </div>
                            </div>
                            <div style={{ cursor: "pointer" }}>
                              <div className="clearButton">
                                <a
                                  href={accountDetails?.details.moa_path}
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
                    <div className="qLinkContent">
                      <h5 className="mb-0 danger">Documents Not Uploaded</h5>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="profileView">
                <div className="profileDetailsHolder">
                  <div className="header">
                    <div className="col-12 text-start">Selected Package</div>
                  </div>
                  <div className="row" style={{ padding: 5 }}>
                    <div className="wrapper">
                      <ul>
                        <li>
                          <label>Package Name</label>{" "}
                          <label className="details">
                            {accountDetails?.package.name}
                          </label>
                        </li>
                        <li>
                          <label>Package Price</label>{" "}
                          <label className="details">
                            ${accountDetails?.package.offer_price}
                          </label>
                        </li>
                        <li>
                          <label>Package Type</label>{" "}
                          <label className="details">
                            {accountDetails?.package.subscription_type}
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
        {loading ? (
          <div colSpan={99}>
            <CircularLoader />
          </div>
        ) : (
          ""
        )}
      </div >
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default UserDocumentDetails;
