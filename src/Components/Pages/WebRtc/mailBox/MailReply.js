import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ThreeDotedLoader from "../../../Loader/ThreeDotedLoader";

const MailReply = ({
  handleShowNewMail,
  handleListingClick,
  handleMailReplay,
  currentMail,
  activeList,
  activeCategory,
  handleMailDelete,
  loading,
  downloadAllAtachment,
  loadingForDownloadAtachment
}) => {
  const navigate = useNavigate();
  const [showResults, setShowResults] = React.useState(false);
  const onClick = () => setShowResults(true);
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${formattedDate} ${formattedTime}`;
  };

  const formatEmailSnippet = (snippet) => {
    // Remove unwanted escape sequences
    if (snippet) {
      return snippet
        .replace(/\r\n/g, " ") // Remove line breaks
        .replace(/\s+/g, " ") // Collapse extra spaces
        .replace(/[*{}]/g, ""); // Remove stray symbols like '*' and '{}'
    } else {
      return ""
    }

  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes.toFixed(2)} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else if (bytes < 1024 * 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2)} TB`;
    }
  };

  const attachmentType = (file) => {
    return file.split(".").slice(-1)[0];
  };

  const totalFileSize = (allAttachments) => {
    let totalSize = 0;
    for (let i = 0; i < allAttachments.length; i++) {
      totalSize += allAttachments[i].size;
    }
    return formatFileSize(totalSize);
  };

  // Basic HTML sanitization function
  const sanitizeHTML = (html) => {
    if (!html) return "";

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Remove potentially dangerous elements and attributes
    const dangerousElements = ["script", "iframe", "object", "embed", "form"];
    const dangerousAttributes = [
      "onclick",
      "onload",
      "onerror",
      "onmouseover",
      "onmouseout",
      "onkeydown",
      "onkeyup",
    ];

    // Remove dangerous elements
    dangerousElements.forEach((tag) => {
      const elements = tempDiv.getElementsByTagName(tag);
      while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
      }
    });

    // Remove dangerous attributes
    const allElements = tempDiv.getElementsByTagName("*");
    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i];
      dangerousAttributes.forEach((attr) => {
        if (element.hasAttribute(attr)) {
          element.removeAttribute(attr);
        }
      });
    }

    return tempDiv.innerHTML;
  };

  return (
    <>
      {loading ?
        <ThreeDotedLoader /> :
        <div className="read_message h-100">
          <div
            className="card shadow-none rounded-3 h-100"
            style={{ borderColor: "var(--me-border1)" }}
          >
            <div
              className="card-header"
              style={{ borderColor: "var(--me-border1)" }}
            >
              <div className="d-flex align-items-center gap-3">
                <button
                  className="back_pev"
                  onClick={() => handleListingClick(activeCategory)}
                >
                  <i class="fa-solid fa-arrow-left"></i>
                </button>
                <div className="d-flex justify-content-between align-items-center w-100">
                  <div className="d-flex align-items-center">
                    {/* <div className="tableProfilePicHolder">
                                        <img
                                            src={require('../../../assets/images/placeholder-image.webp')}
                                        />
                                    </div> */}
                    <div className="ms-3 ">
                      <p className="text_dark mb-0">{currentMail?.from}</p>
                      <p className="mb-0 text_gray fs-12">To: {currentMail?.to}</p>
                    </div>
                  </div>
                  <div className="dropdown">
                    <button
                      className="clearButton2"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="true"
                    >
                      <i className="fa-solid fa-ellipsis-vertical" />
                    </button>
                    <ul className="dropdown-menu light">
                      {/* {
                                            item.is_admin ? */}
                      {/* <li className="mailList_menu">
                        <button className="dropdown-item">
                          <i class="fa-duotone fa-light fa-star me-2"></i> Starred
                        </button>
                      </li> */}

                      <li className="mailList_menu">
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleMailDelete(currentMail, true)}
                        >
                          <i class="fa-duotone fa-solid fa-trash me-2 "></i>{" "}
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="mailBox_body p-3">
              <div className="mail_header">
                <p class="fs-20 fw-semibold mb-0 text_dark">
                  {currentMail?.subject}
                </p>
                <div class="float-end">
                  {" "}
                  <span class="me-2 fs-12 text_gray">
                    {currentMail?.date ? formatDateTime(currentMail?.date) : ""}
                  </span>{" "}
                </div>
              </div>

              <div class="main-mail-content mb-4 mt-5" style={{ fontSize: "0.9rem " }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(currentMail?.rawData),
                  }}
                  className="email-content"
                />
                <p className="me-2 fs-12 text_gray">{formatEmailSnippet(currentMail?.body)}</p>
                {currentMail?.attachments &&
                  currentMail?.attachments.length > 0 && (
                    <div class="mail-attachments mb-4 mt-5">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="mb-0">
                          {" "}
                          <span class="fs-14 fw-semibold text_dark">
                            <i class="fa-solid fa-paperclip me-3"></i>Attachments{" "}
                            {/* {totalFileSize(currentMail?.attachments)}: */}
                            {currentMail?.size}
                          </span>{" "}
                        </div>
                        <div>
                          {" "}
                          <button
                            type="button"
                            class="btn btn-sm btn-success-light"
                            onClick={() => downloadAllAtachment(currentMail)}
                            disabled={loadingForDownloadAtachment}
                          >
                            Download All
                          </button>{" "}
                        </div>
                      </div>
                      <div class="mt-2 d-flex flex-wrap">
                        {currentMail?.attachments?.map((attachment, index) => (
                          <Link
                            to=""
                            className="mail-attachment border mb-1 me-2 text-decoration-none"
                          >
                            <div class="attachment-icon">
                              {attachmentType(attachment?.filename) === "pdf" ? (
                                <img
                                  alt="file-icon"
                                  src={require("../../../assets/images/file.webp")}
                                />
                              ) : attachmentType(attachment?.filename) ===
                                "jpg" ||
                                attachmentType(attachment?.filename) === "jpeg" ||
                                attachmentType(attachment?.filename) === "png" ||
                                attachmentType(attachment?.filename) ===
                                "webp" ? (
                                <img
                                  alt="file-icon"
                                  src={require("../../../assets/images/jpg.webp")}
                                />
                              ) : (
                                <img
                                  alt="file-icon"
                                  src={require("../../../assets/images/file.webp")}
                                />
                              )}
                            </div>
                            <div class="lh-1">
                              <p class="mb-1 attachment-name text-truncate">
                                {attachment?.filename}
                              </p>
                              <p class="mb-0 fs-11 text_gray">
                                {" "}
                                {attachment?.size}{" "}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
            <div class="mail-info-footer p-2 position-relative">
              {showResults ? (
                <div className="text_message">
                  <textarea
                    type="text"
                    name=""
                    className="mail_input formItem "
                    placeholder="Please enter your message"
                  />
                </div>
              ) : null}
              <div class=" d-flex flex-wrap gap-2 align-items-center justify-content-between p-2 position-relative">
                <div class="custom_fileWrap">
                  <label for="file" class="custom_file">
                    <i class="fa-solid fa-paperclip"></i>
                  </label>
                  <input id="file" type="file" />
                </div>

                <div>
                  <button class="btn btn-info">
                    <i class="fa-regular fa-share me-2"></i>Forward
                  </button>
                  <button class="btn btn-success ms-1" onClick={onClick}>
                    <i class="fa-regular fa-reply-all me-2"></i>Reply All
                  </button>
                  {showResults ? (
                    <button class="btn btn-primary ms-1" onClick={onClick}>
                      <i class="fa-duotone fa-solid fa-paper-plane-top me-2"></i>
                      Send
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>}
    </>
  );
};

export default MailReply;
