import React, { useEffect, useState } from "react";
import PaginationComponent from "../../../CommonComponents/PaginationComponent";
import { generalGetFunction } from "../../../GlobalFunction/globalFunction";
import ThreeDotedLoader from "../../../Loader/ThreeDotedLoader";

const EmailList = ({
  handleShowNewMail,
  handleListingClick,
  handleMailReplay,
  showMailHandler,
  loading,
  allMails,
  pageNumber,
  setPageNumber,
  lastPage,
  mailType = "inbox",
}) => {
  console.log("loading: ", loading);

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
  return (
    <>
      <div className="overviewTableWrapper p-0">
        <div
          className="tableContainer e mail_table mt-0 w-100 border-0 mb-0"
          style={{ height: "calc(100vh - 204px)", overflow: "auto" }}
        >
          {loading ? (
            <ThreeDotedLoader />
          ) : (
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>{mailType === "sent" ? "To" : "From"}</th>
                  <th>Subject</th>
                  <th>{mailType === "sent" ? "Sent" : "Received"}</th>
                </tr>
              </thead>
              <tbody>
                {allMails?.emails?.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => {
                      // Pass the current mail type to preserve context
                      handleMailReplay(mailType);
                      showMailHandler(item);
                    }}
                  >
                    <td>
                      {" "}
                      <input type="checkbox" />
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="tableProfilePicHolder">
                          <img
                            alt="profile"
                            src={require("../../../assets/images/placeholder-image.webp")}
                          />
                        </div>
                        <div className="ms-2">
                          {mailType === "sent"
                            ? item?.to?.split(" ")[0]
                            : item?.from?.split(" ")[0]}
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="ellipsisText300 mb-0">
                        <strong>
                          {" "}
                          {item?.subject.length > 15
                            ? item?.subject.slice(0, 15) + "..."
                            : item?.subject}{" "}
                        </strong>
                        <span className="text_muted">
                          {item?.snippet.length > 50
                            ? item?.snippet.slice(0, 50) + "..."
                            : item?.snippet}
                        </span>
                      </p>
                    </td>
                    <td>
                      <p className="mb-0 fw-semibold">
                        {formatDateTime(item?.date)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="tableHeader mb-3">
          {!loading && allMails && allMails?.emails?.length > 0 ? (
            <PaginationComponent
              pageNumber={(e) => setPageNumber(e)}
              // custom to and last page concept because no data came form api
              totalPage={lastPage}
              from={(pageNumber - 1) * allMails?.emailsPerPage + 1}
              to={
                pageNumber * allMails?.emailsPerPage > allMails?.totalEmails
                  ? allMails?.totalEmails
                  : pageNumber * allMails?.emailsPerPage
              }
              total={allMails?.totalEmails}
              defaultPage={pageNumber}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default EmailList;
