import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fileUploadFunction } from "../../GlobalFunction/globalFunction";
import CircularLoader from "../../Loader/CircularLoader";

function Document({
  account,
  refreshCallback,
  refresh,
  nextPage,
  companyStatus,
}) {
  const [rejectDocument, setRejectDocument] = useState([]);
  const [reUploadId, setReUploadId] = useState();
  const wrapperRef = useRef(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openNumber, setOpenNumber] = useState(0);
  const [reUploadPopUp, setReUploadPopUp] = useState(false);
  const [uploadDocument, setUploadDocument] = useState([]);
  const [uploadApprove, setUploadApprove] = useState([]);
  const [docId, setDocId] = useState([]);
  useEffect(() => {
    setRejectDocument(account.details.filter((item) => item.status == "2"));
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

    const newApprovedDocument = account.details
      .filter((item) => item.status === "2")
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

  // Logic for re-upload documents
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reg: null,
  });
  const [formDataError, setFormDataError] = useState({
    reg: false,
  });

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
  }
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

  console.log(rejectDocument, "This is rejected doc.", uploadDocument);
  return (
    <div className="d-flex flex-wrap documentPending">
      <div className="col-xl-8">
        {rejectDocument.length !== 0 &&
        rejectDocument.length !== uploadApprove.length ? (
          <>
            <div className="statusMessage">
              <div className="statusWrapper">
                <h5>
                  <i className="fa-solid fa-triangle-exclamation text-danger me-1"></i>{" "}
                  We have faced an issue while validating your document(s)!
                </h5>
              </div>
            </div>

            <div className="profileView">
              <div
                className="profileDetailsHolder position-relative"
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
                          <li className="d-flex justify-content-between">
                            <div className="col-10">
                              <b>
                                <i className="fa-solid fa-triangle-exclamation me-1"></i>{" "}
                                {item.document.name}
                              </b>
                              : {item.description}
                            </div>{" "}
                            {uploadDocument[key] ? (
                              <div className="col-2 clearButton fw-bold float-end">
                                Under Verification{" "}
                                {/* <i className="fa-duotone fa-upload"></i> */}
                              </div>
                            ) : uploadApprove[key] ? (
                              <div
                                onClick={() => {
                                  setReUploadPopUp(true);
                                  setReUploadId(item.document_id);
                                }}
                                style={{ cursor: "pointer" }}
                                className="pe-5 clearButton fw-bold float-end col-auto"
                              >
                                Approved{" "}
                                {/* <i className="fa-duotone fa-upload"></i> */}
                              </div>
                            ) : (
                              <div
                                onClick={() => {
                                  setReUploadPopUp(true);
                                  setReUploadId(item.document_id);
                                }}
                                style={{ cursor: "pointer" }}
                                className="pe-5 clearButton fw-bold float-end col-auto"
                              >
                                Upload <i className="fa-duotone fa-upload"></i>
                              </div>
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

        <div className="profileView">
          <div className="profileDetailsHolder position-relative">
            <div className="header d-flex align-items-center">
              <div className="col-5">Account Details</div>
            </div>
            <div className="row px-2">
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
      </div>
      <div className="col-xl-4">
        <div className="profileView">
          <div className="profileDetailsHolder">
            <div className="header d-flex align-items-center pe-0">
              <div className="col-5">Documents Uploaded</div>
              <div className="col-7">
                <div class="approvalButton float-end">
                  <div
                    onClick={() => {
                      if (Number(companyStatus) >= 4) {
                        nextPage("configure");
                      }
                    }}
                    style={{ opacity: Number(companyStatus) >= 4 ? "" : 0.5 }}
                    class="float-start btn btn-success btn-sm"
                  >
                    Next<i class="fa-solid fa-caret-right ms-2"></i>
                  </div>
                </div>
              </div>
            </div>
            {account.details.length > 0 ? (
              <div className="qLinkContent" ref={wrapperRef}>
                <div
                  class="accordion accordion-flush"
                  id="accordionFlushExample"
                >
                  {docId.map((item2, key) => {
                    return (
                      <div class="accordion-item">
                        <h2 class="accordion-header" id={`flush-heading${key}`}>
                          <button
                            class="accordion-button collapsed"
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
                          class="accordion-collapse collapse"
                          aria-labelledby={`flush-heading${key}`}
                          data-bs-parent="#accordionFlushExample"
                        >
                          {account.details.map((item) => {
                            if (item.document_id === item2.document_id) {
                              return (
                                <div class="accordion-body">
                                  <div className="row position-relative align-items-center">
                                    <div className="col-auto ps-0 pe-2">
                                      <div className="iconWrapper2">
                                        {item.status === "1" ? (
                                          <i className="fa-solid fa-check text-success"></i>
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
                                      <div className="iconWrapper">
                                        <i className="fa-solid fa-ellipsis"></i>
                                      </div>
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
                                            <i className="fa-solid fa-file-arrow-down"></i>{" "}
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
                                              <i className="fa-sharp fa-solid fa-eye"></i>{" "}
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
              <Link to="/upload-document">
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
              </Link>
            )}
          </div>
        </div>
      </div>
      {reUploadPopUp ? (
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
                  Please select the file you want to upload
                  <input
                    name="reg"
                    className="formItem"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  {formDataError.reg ? (
                    <span style={{ color: "red", fontSize: 12 }}>
                      <i class="fa-solid fa-triangle-exclamation"></i> Image
                      should be less than 1 MB
                    </span>
                  ) : (
                    ""
                  )}
                  <div className="mt-2">
                    <button className="panelButton m-0" onClick={handleSubmit}>
                      Confirm
                    </button>
                    <button
                      className="panelButtonWhite m-0 float-end"
                      onClick={() => setReUploadPopUp(false)}
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
  );
}

export default Document;
