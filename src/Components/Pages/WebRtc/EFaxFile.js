/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { fileUploadFunction } from "../../GlobalFunction/globalFunction";

const EFaxFile = ({ newFileUpload, eFaxFileLoadingState }) => {
  const [uploadPopup, setUploadPopup] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [enlargeImage, setEnlargeImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [uploadedFile, setUploadedFile] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    eFaxFileLoadingState(loading);
  }, [loading]);

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

  function isValidImageFile(file) {
    if (!file || !(file instanceof File)) {
      return false;
    }

    const allowedExtensions = ["png", "jpeg", "jpg"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    return allowedExtensions.includes(fileExtension);
  }

  const downloadImage = async (imageUrl, fileName) => {
    try {
      const response = await fetch(imageUrl);
      console.log("response:", response);
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

  const handleUploadDocument = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (!isValidImageFile(file)) {
      toast.error("Only JPEG, JPG and PNG formats are allowed");
      return;
    }
    setUploadPopup(false);
    setLoading(true);
    const apiData = await fileUploadFunction("/fax/store", { file_path: file });
    if (apiData.status) {
      setUploadedFile(apiData.data);
      toast.success(apiData.message);
      setLoading(false);
      setUploadPopup(false);
      setImagePreview(null);
      newFileUpload(apiData.data);
      //   refreshCallback(refresh + 1);
    } else {
      setImagePreview(null);
      setLoading(false);
      toast.error(apiData.message);
      setLoading(false);
    }
  };

  function handleClickOutside(event) {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setOpenPopup(false);
    }
  }
  document.addEventListener("mousedown", handleClickOutside);

  return (
    <div
      className="col-12 col-xl-6 callDetails eFaxCompose"
      style={{ height: "100%" }}
      id="callDetails"
    >
      <div className="profileView">
        <div className="profileDetailsHolder">
          <div className="header d-flex align-items-center pe-0">
            <div className="col-12">Upload eFax Document</div>
          </div>
          <div className="mt-2">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <div className="">
                <label>Choose a document to upload</label>
              </div>
              <div
                onClick={() => {
                  setUploadPopup(true);
                }}
                style={{ cursor: "pointer" }}
                className=" clearButton fw-bold float-end col-auto"
              >
                Upload <i className="fa-duotone fa-upload"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {uploadedFile && (
        <div className="profileView">
          <div className="profileDetailsHolder">
            <div className="header d-flex align-items-center pe-0">
              <div className="col-12">Uploaded Documents</div>
            </div>
            <div className="qLinkContent" ref={wrapperRef}>
              <div class="accordion-body">
                <div className="row position-relative align-items-center">
                  <div className="col-auto ps-0 pe-2">
                    <div className="iconWrapper2">
                      <i className="fa-solid fa-image"></i>
                    </div>
                  </div>
                  <div className="col-8 my-auto ps-1">
                    <p>{uploadedFile?.file_name}</p>
                  </div>
                  <div
                    className="col-auto px-0 my-auto ms-auto"
                    onClick={() => {
                      setOpenPopup(!openPopup);
                      // setOpenNumber(key);
                    }}
                  >
                    <div className="iconWrapper">
                      <i className="fa-solid fa-ellipsis"></i>
                    </div>
                  </div>
                  {openPopup && (
                    <div className="buttonPopup">
                      <div style={{ cursor: "pointer" }}>
                        <div
                          className="clearButton"
                          onClick={() =>
                            downloadImage(
                              uploadedFile?.file_path,
                              uploadedFile?.file_name
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
                            href={uploadedFile?.file_path}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <i className="fa-sharp fa-solid fa-eye"></i> View
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
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
                  <h4>Upload a document</h4>
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
                  />
                  <span style={{ fontSize: 10 }}>
                    Only JPEG/JPG/PNG files are accepted.
                  </span>
                  {uploadError ? (
                    <>
                      <br />
                      <span style={{ color: "red", fontSize: 12 }}>
                        <i class="fa-solid fa-triangle-exclamation"></i> Image
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
                        <i class="fa-solid fa-expand"></i>
                      </div>
                    </div>
                  )}
                  <div className="mt-2 d-flex justify-content-between">
                    <button
                      className="panelButton m-0"
                      onClick={handleUploadDocument}
                    >
                      <span className="text">Confirm</span>
                      <span className="icon"><i class="fa-solid fa-check"></i></span>
                    </button>
                    <button
                      className="panelButtonWhite m-0 float-end"
                      onClick={() => {
                        setUploadPopup(false);
                        setUploadError(false);
                        setImagePreview(null);
                        setFile();
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
    </div>
  );
};

export default EFaxFile;
