import React, { useEffect, useState } from "react";
import PaginationComponent from "../../../CommonComponents/PaginationComponent";
import { checkViewSidebar } from "../../../GlobalFunction/globalFunction";
import ThreeDotedLoader from "../../../Loader/ThreeDotedLoader";

const EmailList = ({
  // handleShowNewMail,
  // handleListingClick,
  handleMailReplay,
  handleShowMail,
  loading,
  allMails,
  pageNumber,
  setPageNumber,
  lastPage,
  mailType = "inbox",
  handleMailDelete,
  setCheckedMail,
  checkedMail,
  handleUnSeenMail,
  handleStarrClicked,
  setEntriesPerPage,
  setSearchInput,
  account,
  slugPermissions
}) => {
  
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
        <div className="tableHeader">
          <div className="showEntries">
            <label>Show</label>
            <select
              className="formItem"
              onChange={(e) => setEntriesPerPage(e?.target?.value)}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <label>entries</label>
          </div>
          {checkViewSidebar(
            "DidDetail",
            slugPermissions,
            account?.sectionPermissions,
            account?.permissions,
            "search"
          ) &&
            <div className="searchBox position-relative">
              <label>Search:</label>
              <input
                type="search"
                name="Search"
                className="formItem"
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          }
        </div>
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
                  <th>Select</th>
                  <th>{mailType === "sent" ? "To" : "From"}</th>
                  <th>Subject</th>
                  <th>{mailType === "sent" ? "Sent" : "Received"}</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allMails?.emails?.map((item, index) => (
                  <tr key={index} className={item?.status_flags?.seen ? `seen-message` : `unseen-message`}>
                    <td
                      onClick={() => {
                        setCheckedMail((prev) => {
                          const alreadyChecked = prev.some((checked) => checked?.uid === item?.uid);
                          if (alreadyChecked) {
                            return prev.filter((checked) => checked?.uid !== item?.uid);
                          } else {
                            return [...prev, item];
                          }
                        });
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checkedMail?.some((checked) => checked?.uid === item?.uid)}
                      />
                    </td>
                    <td
                      onClick={() => {
                        handleMailReplay(mailType);
                        handleShowMail(item);
                      }}
                    >
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
                    <td
                      onClick={() => {
                        handleMailReplay(mailType);
                        handleShowMail(item);
                      }}
                    >
                      <p className="ellipsisText300 mb-0">
                        <strong>
                          {" "}
                          {item?.subject.length > 15
                            ? item?.subject?.slice(0, 15) + "..."
                            : item?.subject}{" "}
                        </strong>
                        <span className="text_muted">
                          {item?.snippet?.length > 50
                            ? item?.snippet.slice(0, 50) + "..."
                            : item?.snippet}
                        </span>
                      </p>
                    </td>
                    <td
                      onClick={() => {
                        handleMailReplay(mailType);
                        handleShowMail(item);
                      }}
                    >
                      <p className="mb-0 fw-semibold">
                        {formatDateTime(item?.date)}
                      </p>
                    </td>
                    <td>
                      <i
                        class={item?.status_flags?.starred ? `fa fa-star me-2` : `fa-regular fa-star me-2`}
                        onClick={() => handleStarrClicked(item)}
                      ></i>
                      <i class={item?.status_flags?.seen ? `fa-solid fa-envelope-open me-2` : `fa-solid fa-envelope me-2`}
                        onClick={() => handleUnSeenMail(item)}
                      ></i>

                      <i class="fa-solid fa-trash me-4"
                        onClick={() => {
                          handleMailDelete(item)
                        }}
                      ></i>
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
