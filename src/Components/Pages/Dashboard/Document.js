/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  fileUploadFunction,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import CircularLoader from "../../Loader/CircularLoader";

function Document({
  account,
  refreshCallback,
  refresh,
  nextPage,
  companyStatus,
}) {
  const [documentList, setDocumentList] = useState([]);
  const [rejectDocument, setRejectDocument] = useState([]);
  const [reUploadId, setReUploadId] = useState();
  const wrapperRef = useRef(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openNumber, setOpenNumber] = useState(0);
  const [reUploadPopUp, setReUploadPopUp] = useState(false);
  const [uploadDocument, setUploadDocument] = useState([]);
  const [uploadApprove, setUploadApprove] = useState([]);
  const [uploadPopup, setUploadPopup] = useState(false);
  const [uploadId, setuploadId] = useState("");
  const [file, setFile] = useState();
  const [uploadError, setUploadError] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [enlargeImage, setEnlargeImage] = useState(false);
  // const [getDataRefresh, setgetDataRefresh] = useState(0);

  const [docId, setDocId] = useState([]);
  useEffect(() => {
    async function getDocumentList() {
      const apiData = await generalGetFunction("/documents");
      if (apiData?.status) {
        setDocumentList(apiData.data);
      }
    }
    getDocumentList();
    const maxIdItems = account.details.reduce((acc, item) => {
      const name = item.document.name;
      if ((!acc[name] || item.id > acc[name].id) && item.status == "2") {
        acc[name] = item;
      }
      return acc;
    }, {});

    setRejectDocument(Object.values(maxIdItems));
    const newDocItems = [...docId];
    account.details.forEach((item) => {
      if (!newDocItems.some((doc) => doc.document_id === item.document_id)) {
        newDocItems.push(item);
      }
    });

    setDocId(newDocItems);
    const newUploadDocument = account.details
      .filter((item) => item.status === "2")
      .map((item) => {
        return account.details.some(
          (item2) =>
            item2.document_id === item.document_id && item2.status === "3"
        );
      });

    setUploadDocument(newUploadDocument);

    const newApprovedDocument =
      // account.details
      //   .filter((item) => item.status === "2")
      Object.values(maxIdItems)
        .map((item) => {
          const hasMatch = account.details.some(
            (item2) =>
              item2.document_id === item.document_id && item2.status === "1"
          );
          return hasMatch ? true : undefined;
        })
        .filter((item) => item !== undefined);

    setUploadApprove(newApprovedDocument);
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpenPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refresh]);

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

  // Logic for re-upload documents
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reg: null,
  });
  const [formDataError, setFormDataError] = useState({
    reg: false,
  });

  function getNonUploadedDocuments() {
    const allDocuments = documentList;
    const uploadedDocuments = docId;

    const uploadedIds = new Set(
      uploadedDocuments.map((doc) => doc?.document?.id)
    );

    const nonUploadedDocuments = allDocuments?.filter(
      (doc) => !uploadedIds.has(doc.id)
    );

    return nonUploadedDocuments;
  }
  const nonUploadedDocuments = getNonUploadedDocuments();

  const handleUploadDocument = async (documentId) => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const payload = {
      account_id: account.id,
      documents: [
        {
          document_id: documentId,
          path: file,
        },
      ],
    };
    if (!isValidImageFile(file)) {
      toast.error("Only JPEG, JPG and PNG formats are allowed");
      return;
    }

    const apiData = await fileUploadFunction("/account-detail/store", payload);
    if (apiData.status) {
      toast.success(apiData.message);
      setLoading(false);
      setUploadPopup(false);
      setImagePreview(null);
      refreshCallback(refresh + 1);
    } else {
      setImagePreview(null);
      setLoading(false);
      toast.error(apiData.message);
    }
  };

  function isValidImageFile(file) {
    if (!file || !(file instanceof File)) {
      return false;
    }

    const allowedExtensions = ["png", "jpeg", "jpg"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    return allowedExtensions.includes(fileExtension);
  }
  const checkDocumentStatus = (documents) => {
    const documentMap = {};

    // First get the documents with max id for each document_id
    documents.forEach((doc) => {
      const docId = doc.document_id;
      if (!documentMap[docId] || doc.id > documentMap[docId].id) {
        documentMap[docId] = doc;
      }
    });

    // Convert the document map back to an array
    const resultArray = Object.values(documentMap);

    // Check conditions based on status
    const containsStatus1 = resultArray.some((doc) => doc.status === "1"); //Approved
    const containsStatus2 = resultArray.some((doc) => doc.status === "2"); //Rejected
    const containsStatus3 = resultArray.some((doc) => doc.status === "3"); //Uploaded
    const allStatus1 = resultArray.every((doc) => doc.status === "1"); //approved

    if (containsStatus2) {
      return null;
    } else if (allStatus1 && documentList.length == resultArray.length) {
      return "All documents approved";
    } else if (
      (containsStatus1 || containsStatus3) &&
      documentList.length == resultArray.length
    ) {
      return "Document under verification, wait for admin to approve";
    }

    return null;
  };

  function handleChange(e) {
    const { name } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: e.target?.files?.[0],
    }));

    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 1024 * 1024) {
      setFormDataError((prevDat) => ({
        ...prevDat,
        [name]: false,
      }));
    } else {
      setFormDataError((prevDat) => ({
        ...prevDat,
        [name]: true,
      }));
    }
    setImagePreview(URL.createObjectURL(selectedFile)); // Assuming you have a state for the image preview
  }

  const handleUploadDoc = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.size <= 1024 * 1024) {
      setUploadError(false);

      const imagePreviewUrl = URL.createObjectURL(selectedFile);

      setFile(selectedFile);
      setImagePreview(imagePreviewUrl); // Assuming you have a state for the image preview
    } else {
      setUploadError("File size must be less than 1MB.");
    }
  };

  async function handleSubmit() {
    if (formDataError.reg) {
      toast.error("Image size must be less then 1 MB");
    } else if (!formData.reg) {
      toast.error("Please upload reg image");
    } else {
      setLoading(true);
      const parsedData = {
        account_id: account.id,
        documents: [
          {
            document_id: reUploadId,
            path: formData.reg,
          },
        ],
      };
      const apiData = await fileUploadFunction(
        "/account-detail/store",
        parsedData
      );
      if (apiData.status) {
        refreshCallback(refresh + 1);
        toast.success(apiData.message);
        setReUploadPopUp(false);
        setLoading(false);
      } else {
        setLoading(false);
        setReUploadPopUp(false);
        toast.error(apiData.message);
      }
    }
  }
  return (
    <>
      <style>
        {`
          .formRow.col-xl-3:nth-child(odd) {
            margin-right: 10px;
          }
        `}
      </style>
      <div className="d-flex flex-wrap">
        <div className="col-12">
          <div className="heading">
            <div className="content">
              <h4>Document Verification</h4>
              <p>Please upload your documents for verification.</p>
            </div>
            <div className="buttonGroup">
              <button
                type="button"
                effect="ripple"
                className="panelButton gray"
                onClick={() => { nextPage("payment"); }}
              >
                <span className="text">Back</span>
                <span className="icon"><i className="fa-solid fa-caret-left"></i></span>
              </button>
              <button
                type="button"
                effect="ripple"
                className="panelButton"
                onClick={() => {
                  if (Number(companyStatus) >= 4) {
                    nextPage("configure");
                  }
                }}
                disabled={Number(companyStatus) >= 4 ? false : true}
              >
                <span className="text">Next</span>
                <span className="icon"><i className="fa-solid fa-caret-right"></i></span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-wrap">
        <div className="col-12" style={{ padding: '25px 23px', }}>
          <div className="row">
            <div className="col-xl-12 mb-3">
              <div className="documentPending">
                {checkDocumentStatus(account.details) != null && rejectDocument.length === uploadApprove.length && (
                  <div className="statusMessage">
                    <div className={`statusWrapper ${checkDocumentStatus(account.details).includes("approved") ? "success" : "pending"}`}>
                      <div className="mx-2">
                        <h5 className="text-dark">
                          <i className={`text-dark fa-regular fa-${checkDocumentStatus(account.details).includes("approved") ? "check" : "clock"} me-1`}></i>{" "}
                          {checkDocumentStatus(account.details)}
                        </h5>
                      </div>
                    </div>
                  </div>
                )}
                {rejectDocument.length !== 0 &&
                  rejectDocument.length !== uploadApprove.length ? (
                  <>
                    <div className="statusMessage">
                      <div className={uploadDocument.every((value) => value === true) ? "statusWrapper pending" : "statusWrapper"}>
                        <h5 className="text-white">
                          <i className="fa-solid fa-triangle-exclamation me-1"></i>{" "}
                          {uploadDocument.every((value) => value === true)
                            ? "Documents are under review. We will get back to you soon!"
                            : "We have faced an issue while validating your document(s)!"}
                        </h5>
                      </div>
                    </div>

                    <div className="profileView px-0">
                      <div
                        className="profileDetailsHolder position-relative mt-2"
                        style={{ border: "1px solid red" }}
                      >
                        <div className="row px-2">
                          <div className="statusContent">
                            <p className="mb-2">
                              The following document(s) have been rejected for various
                              reasons :-
                            </p>
                            <ul>
                              {rejectDocument.map((item, key) => {
                                return (
                                  <li className="d-flex justify-content-between mt-3">
                                    <div className="col-10">
                                      <b>
                                        <i className="fa-solid fa-triangle-exclamation me-1"></i>{" "}
                                        {item.document.name}
                                      </b>
                                      : <span style={{ color: 'var(--color-subtext)' }}>{item.description}</span>
                                    </div>{" "}
                                    {uploadDocument[key] ? (
                                      <div className="col-2 clearButton fw-bold float-end text-end">
                                        Under Verification{" "}
                                        {/* <i className="fa-duotone fa-upload"></i> */}
                                      </div>
                                    ) : uploadApprove[key] ? (
                                      <div
                                        // onClick={() => {
                                        //   setReUploadPopUp(true);
                                        //   setReUploadId(item.document_id);
                                        // }}
                                        style={{ cursor: "pointer" }}
                                        className="pe-5 clearButton fw-bold float-end col-auto text-end"
                                      >
                                        Approved{" "}
                                        {/* <i className="fa-duotone fa-upload"></i> */}
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setReUploadPopUp(true);
                                          setReUploadId(item.document_id);
                                        }}
                                        style={{ cursor: "pointer" }}
                                        className="tableButton"
                                      >
                                        <i className="fa-solid fa-upload"></i>
                                      </button>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-xl-8" style={{ borderRight: '1px solid #ddd' }}>
              <form action="#" className="row px-2 justify-content-between">
                <div className="col-xl-12 headerCommon">
                  Account Details
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="data">Company Name</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="formItem"
                      value={account.company_name}
                      disabled
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="data">Admin Name</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="formItem"
                      value={account.admin_name}
                      disabled
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="data">Email</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="formItem"
                      value={account.email}
                      disabled
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="data">Phone Number</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="formItem"
                      value={account.contact_no}
                      disabled
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="data">Alternate Number</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="formItem"
                      value={account.alternate_contact_no}
                      disabled
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="data">Timezone</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="formItem"
                      value={account.timezone.name}
                      disabled
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="data">Block/Unit/Place</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="formItem"
                      value={account.unit}
                      disabled
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="data">Building</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="formItem"
                      value={account.building}
                      disabled
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="data">City</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="formItem"
                      value={account.city}
                      disabled
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="data">Zip Code</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="formItem"
                      value={account.zip}
                      disabled
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="data">State</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="formItem"
                      value={account.state}
                      disabled
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="data">Country</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="formItem"
                      value={account.country}
                      disabled
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="col-xl-4">
              {nonUploadedDocuments.length > 0 && (
                <div className="masterList h-auto" style={{ borderBottom: '1px solid #ddd' }}>
                  <div className="masterSegment">
                    <div className="headerCommon">
                      <div className="col-12">Upload Below Documents</div>
                    </div>
                    <ul>
                      {nonUploadedDocuments.map((item, index) => {
                        return (
                          <li
                            key={index}
                          >
                            <div className="">
                              <input type="text" placeholder={item?.name} disabled />
                            </div>
                            <button
                              onClick={() => {
                                setUploadPopup(true);
                                setuploadId(item.id);
                                // setReUploadId(item.document_id);
                              }}
                              style={{ cursor: "pointer" }}
                              className="tableButton"
                            >
                              <i className="fa-solid fa-upload"></i>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}

              {account.details.length > 0 ? (
                <div className="profileView px-0 pt-0">
                  <div className="profileDetailsHolder shadow-none px-0 border-0 pt-0">
                    <div className="headerCommon">
                      <div className="col-12">Uploaded Documents</div>
                    </div>
                    {account.details.length > 0 ? (
                      <div className="qLinkContent temporaryDashAccordionContent" ref={wrapperRef}>
                        <div
                          className="accordion permissionListWrapper"
                          id="accordionFlushExample"
                        >
                          {docId.map((item2, key) => {
                            return (
                              <div className="accordion-item">
                                <h2
                                  className="accordion-header"
                                  id={`flush-heading${key}`}
                                >
                                  <button
                                    className="accordion-button collapsed px-3"
                                    style={{ padding: "15px 5px" }}
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#flush-collapse${key}`}
                                    aria-expanded="false"
                                    aria-controls={`flush-collapse${key}`}
                                  >
                                    {item2?.document?.name}
                                  </button>
                                </h2>
                                <div
                                  id={`flush-collapse${key}`}
                                  className="accordion-collapse collapse"
                                  aria-labelledby={`flush-heading${key}`}
                                  data-bs-parent="#accordionFlushExample"
                                >
                                  {account.details.map((item) => {
                                    if (item.document_id === item2.document_id) {
                                      return (
                                        <div className="accordion-body">
                                          <div className="row position-relative align-items-center w-100">
                                            <div className="col-auto ps-0 pe-2">
                                              <div className="iconWrapper2">
                                                {item.status === "1" ? (
                                                  <i className="fa-solid fa-check "></i>
                                                ) : item.status === "2" ? (
                                                  <i className="fa-solid fa-xmark text-danger"></i>
                                                ) : (
                                                  <i className="fa-solid fa-image"></i>
                                                )}
                                              </div>
                                            </div>
                                            <div className="col-8 my-auto ps-1">
                                              <p>{item?.document?.name}</p>
                                            </div>
                                            <div
                                              className="col-auto px-0 my-auto ms-auto"
                                              onClick={() => {
                                                setOpenPopup(!openPopup);
                                                setOpenNumber(key);
                                              }}
                                            >
                                              <button className="clearButton2">
                                                <i className="fa-solid fa-ellipsis"></i>
                                              </button>
                                            </div>
                                            <div className="col-12">
                                              <p
                                                style={{
                                                  fontSize: 12,
                                                  paddingLeft: 20,
                                                  color: "#ff2e2e",
                                                }}
                                              >
                                                {item.description}
                                              </p>
                                            </div>
                                            {openPopup && openNumber === key ? (
                                              <div className="buttonPopup">
                                                <div style={{ cursor: "pointer" }}>
                                                  <div
                                                    className="clearButton"
                                                    onClick={() =>
                                                      downloadImage(
                                                        item.path,
                                                        "Register file"
                                                      )
                                                    }
                                                  >
                                                    <i className="fa-solid fa-file-arrow-down fs-12 me-2"></i>{" "}
                                                    Download
                                                  </div>
                                                </div>
                                                <div style={{ cursor: "pointer" }}>
                                                  <div className="clearButton">
                                                    <a
                                                      href={item.path}
                                                      target="_blank"
                                                      rel="noreferrer"
                                                    >
                                                      <i className="fa-sharp fa-solid fa-eye fs-12 me-2"></i>{" "}
                                                      View
                                                    </a>
                                                  </div>
                                                </div>
                                              </div>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        </div>
                                      );
                                    }
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      // <Link to="/upload-document">
                      <>
                        <div className="imgWrapper">
                          <img
                            src={require("../../assets/images/upload-file.png")}
                            alt=""
                          />
                        </div>
                        <div className="text-center mt-3">
                          <h5>
                            Please upload the{" "}
                            <span
                              style={{ color: "var(--ui-accent)", cursor: "pointer" }}
                            >
                              <b>required documents</b>
                            </span>
                            .
                          </h5>
                        </div>
                      </>
                      // </Link>
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-wrap documentPending">
        {reUploadPopUp ? (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center text-center">
                <div className="row content col-xl-4">
                  <div className="col-12 px-0">
                    <div className="iconWrapper">
                      <i className="fa-duotone fa-triangle-exclamation"></i>
                    </div>
                  </div>
                  <div className="col-12 ps-0">
                    <h4 className="text-orange">Warning!</h4>
                    Please select the file you want to upload
                    <br />
                    <span style={{ fontSize: 14 }}>
                      Note: File size should be less than 1 MB.
                    </span>
                    <input
                      name="reg"
                      className="formItem"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    <span style={{ fontSize: 10 }}>
                      Only JPEG/JPG/PNG files are accepted.
                    </span>
                    {formDataError.reg ? (
                      <>
                        <br />
                        <span style={{ color: "red", fontSize: 12 }}>
                          <i className="fa-solid fa-triangle-exclamation"></i> Image
                          should be less than 1 MB
                        </span>
                      </>
                    ) : (
                      ""
                    )}
                    {imagePreview && (
                      <div className="position-relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{ width: "100%", maxHeight: "400px" }}
                        />
                        <br />
                        <div
                          className="tableButton"
                          style={{
                            cursor: "pointer",
                            position: "absolute",
                            right: "10px",
                            top: "10px",
                          }}
                          onClick={() => setEnlargeImage(true)}
                        >
                          {/* <span style={{ fontSize: 12 }} className="me-1">
                          View
                        </span> */}
                          <i className="fa-solid fa-expand"></i>
                        </div>
                      </div>
                    )}
                    <div className="mt-2 d-flex justify-content-between">
                      <button className="panelButton m-0" onClick={handleSubmit}>
                        <span className="text">Confirm</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray m-0 float-end"
                        onClick={() => {
                          setReUploadPopUp(false);
                          setImagePreview(null);
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
        {uploadPopup ? (
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
                    <h4>
                      Upload{" "}
                      {documentList.filter((item) => item.id == uploadId)[0].name}
                    </h4>
                    Please select the file you want to upload
                    <br />
                    <span style={{ fontSize: 14 }}>
                      Note: File size should be less than 1 MB.
                    </span>
                    <br />
                    <input
                      name="reg"
                      className="formItem mt-2"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadDoc(e)}
                    // onChange={handleChange}
                    />
                    <span style={{ fontSize: 10 }}>
                      Only JPEG/JPG/PNG files are accepted.
                    </span>
                    {uploadError ? (
                      <>
                        <br />
                        <span style={{ color: "red", fontSize: 12 }}>
                          <i className="fa-solid fa-triangle-exclamation"></i> Image
                          should be less than 1 MB
                        </span>
                      </>
                    ) : (
                      ""
                    )}
                    {imagePreview && (
                      <div className="position-relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          style={{ width: "100%", maxHeight: "400px" }}
                        />
                        <br />
                        <div
                          className="tableButton"
                          style={{
                            cursor: "pointer",
                            position: "absolute",
                            right: "10px",
                            top: "10px",
                          }}
                          onClick={() => setEnlargeImage(true)}
                        >
                          {/* <span style={{ fontSize: 14, fontWeight: 600 }} className="me-1">
                          View
                        </span> */}
                          <i className="fa-solid fa-expand"></i>
                        </div>
                      </div>
                    )}
                    <div className="mt-2 d-flex justify-content-between">
                      <button
                        className="panelButton m-0"
                        // onClick={handleSubmit}
                        onClick={() => handleUploadDocument(uploadId)}
                      >
                        <span className="text">Confirm</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray m-0 float-end"
                        // onClick={() => setReUploadPopUp(false)}
                        onClick={() => {
                          setUploadPopup(false);
                          setUploadError(false);
                          setImagePreview(null);
                          setFile();
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
        {enlargeImage ? (
          <div className="popup" onClick={() => setEnlargeImage(false)}>
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "800px", maxHeight: "800px" }}
                />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {loading ? <CircularLoader /> : ""}
        {/* <ToastContainer
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
      /> */}
      </div>
    </>
  );
}

export default Document;
