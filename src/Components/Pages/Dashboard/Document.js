import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function Document({ account }) {
  const wrapperRef = useRef(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openNumber, setOpenNumber] = useState(0);
  useEffect(() => {
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
    <div className="d-flex flex-wrap">
      <div className="col-xl-9">
        <div className="statusMessage">
          <div className="statusWrapper">
            <h5><i className="fa-solid fa-triangle-exclamation text-danger me-1"></i> We have faced an issue while validating your document(s)!</h5>
          </div>
        </div>
        <div className="profileView">
          <div className="profileDetailsHolder position-relative">
            <div className="row px-2">
              <div className="statusContent">
                <p className="mb-2">
                  The following document(s) have been rejected for various reasons :-
                </p>
                <ul>
                  <li>
                    <b><i className="fa-solid fa-triangle-exclamation me-1"></i> Registration</b>: The required information is not clear. <div style={{ cursor: "pointer" }} className="pe-5 clearButton fw-bold float-end">Upload <i className="fa-duotone fa-upload"></i></div>
                  </li>
                  <li>
                    <b><i className="fa-solid fa-triangle-exclamation me-1"></i> Registration</b>: The required information is not clear.<div style={{ cursor: "pointer" }} className="pe-5 clearButton fw-bold float-end">Upload <i className="fa-duotone fa-upload"></i></div>
                  </li>
                  <li>
                    <b><i className="fa-solid fa-triangle-exclamation me-1"></i> Registration</b>: The required information is not clear.<div style={{ cursor: "pointer" }} className="pe-5 clearButton fw-bold float-end">Upload <i className="fa-duotone fa-upload"></i></div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="profileView">
          <div className="profileDetailsHolder position-relative">
            <div className="header d-flex align-items-center">
              <div className="col-5">Account Details</div>
            </div>
            <div className="row px-2 border-bottom">
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
      <div className="col-xl-3">
        <div className="profileView">
          <div className="profileDetailsHolder">
            <div className="header d-flex align-items-center">
              <div className="col-12">Documents Uploaded</div>
            </div>
            {account.details.length > 0 ? (
              <div className="qLinkContent px-3 mt-2" ref={wrapperRef}>
                {account.details.map((item, key) => {
                  return (
                    <div className="row position-relative mb-2 align-items-center">
                      <div className="col-auto ps-0 pe-2">
                        <div className="iconWrapper2">
                          <i className="fa-solid fa-image"></i>
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
                      <div className="border mt-2 mx-auto col-10"></div>
                      {openPopup && openNumber === key ? (
                        <div className="buttonPopup">
                          <div style={{ cursor: "pointer" }}>
                            <div
                              className="clearButton"
                              onClick={() =>
                                downloadImage(item.path, "Register file")
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
                                <i className="fa-sharp fa-solid fa-eye"></i> View
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
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
    </div>
  );
}

export default Document;
