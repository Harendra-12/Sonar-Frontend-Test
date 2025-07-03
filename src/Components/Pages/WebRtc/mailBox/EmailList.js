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
  slugPermissions,
  loadingForActions,
  handleMultipleDelete,
  handleMultipleUnStarred,
  handleMultipleStarred,
  handleMultipleSeen,
  handleMultipleUnSeen,
  searchInput
}) => {
  const [isCheckedAll, setIsCheckedAll] = useState(false)
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

  function formatDateString(inputDate) {
    const date = new Date(inputDate);

    const options = {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }
    return date.toLocaleString('en-US', options).replace(',', '');
  }

  const handleAllCheck = () => {
    setCheckedMail((prev) => {
      const allChecked = allMails?.emails?.every(email =>
        prev.some(checked => checked.uid === email.uid)
      );
      const updatedCheckedMail = allChecked
        ? prev.filter(checked =>
          !allMails.emails.some(email => email.uid === checked.uid)
        )
        : [
          ...prev,
          ...allMails.emails.filter(email =>
            !prev.some(checked => checked.uid === email.uid)
          )
        ];

      setIsCheckedAll(!allChecked);

      return updatedCheckedMail;
    });
  };


  return (
    <>
      <div className="overviewTableWrapper p-0">
        <div className="tableHeader">
          <div className="">
            <div className="showEntries mb-2">
              <label>Show</label>
              <select
                className="formItem"
                onChange={(e) => setEntriesPerPage(e?.target?.value)}
              >
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <label>entries</label>
            </div>
          </div>
          <div className="mb-2">
            <div className="d-flex align-items-center justify-content-end gap-2 flex-wrap">
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
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
              }
              <div className="d-flex align-items-center justify-content-end gap-2">
                <button className="clearButton2 sm"
                  style={{
                    opacity: loadingForActions?.length > 1 ? 0.5 : 1
                  }}
                  onClick={() => {
                    if (!loadingForActions?.length > 0)
                      handleMultipleUnStarred()
                  }}
                >
                  <i class="fa-regular fa-star" ></i>
                </button>
                <button className="clearButton2 sm"
                  style={{
                    opacity: loadingForActions?.length > 1 ? 0.5 : 1
                  }}
                  onClick={() => {
                    if (!loadingForActions?.length > 0)
                      handleMultipleStarred()
                  }}
                >
                  <i class="fa fa-star" ></i>
                </button>
                <button className="clearButton2 sm"
                  style={{
                    opacity: loadingForActions?.length > 1 ? 0.5 : 1
                  }}
                  onClick={() => {
                    if (!loadingForActions?.length > 0)
                      handleMultipleDelete()
                  }}
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
                <button
                  className="clearButton2 sm"
                  style={{
                    opacity: loadingForActions?.length > 1 ? 0.5 : 1
                  }}
                  onClick={() => {
                    if (!loadingForActions?.length > 0)
                      handleMultipleSeen()
                  }}>
                  <i class="fa-solid fa-envelope-open" ></i>
                </button>
                <button
                  className="clearButton2 sm"
                  style={{
                    opacity: loadingForActions?.length > 1 ? 0.5 : 1
                  }}
                  onClick={() => {
                    if (!loadingForActions?.length > 0)
                      handleMultipleUnSeen()
                  }}>
                  <i class="fa-solid fa-envelope" ></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="tableContainer e mail_table"
          style={{ height: "calc(100vh - 257px)", overflow: "auto" }}
        >
          {loading ? (
            <ThreeDotedLoader />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="" style={{ display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center" }}>
                      {/* <div> */}
                      <input
                        type="checkbox"
                        checked={isCheckedAll}
                        onClick={() => handleAllCheck()}
                      />
                      {/* </div> */}
                      <div className="ms-2">
                        Select
                      </div>
                    </div>

                  </th>
                  <th>{mailType === "sent" ? "To" : "From"}</th>
                  <th>Subject</th>
                  <th>{mailType === "sent" ? "Sent" : "Received"}</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allMails?.emails?.length > 0 ? allMails?.emails?.map((item, index) => (
                  <tr key={index} className={`
                    ${item?.status_flags?.seen ? 'seen-message' : 'unseen-message'} 
                    ${item?.status_flags?.starred ? 'starred-message' : 'unstarred-message'}
                  `.trim()}
                  >
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
                        handleShowMail(item, false);
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
                        handleShowMail(item, false);
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
                        handleShowMail(item, false);
                      }}
                    >
                      <p className="mb-0 fw-semibold">
                        {formatDateString(item?.date)}
                      </p>
                    </td>
                    <td>
                      <i
                        class={item?.status_flags?.starred ? `fa fa-star me-2` : `fa-regular fa-star me-2`}
                        style={{
                          opacity: loadingForActions?.some(i => i.uid === item.uid) ? 0.5 : 1
                        }}
                        onClick={() => {
                          if (!loadingForActions?.some(i => i.uid === item.uid))
                            handleStarrClicked(item)
                        }}
                      >
                      </i>
                      <i
                        class={item?.status_flags?.seen ? `fa-solid fa-envelope-open me-2` : `fa-solid fa-envelope me-2`}
                        style={{
                          opacity: loadingForActions?.some(i => i.uid === item.uid) ? 0.5 : 1
                        }}
                        onClick={() => {
                          if (!loadingForActions?.some(i => i.uid === item.uid))
                            handleUnSeenMail(item)
                        }}
                      ></i>

                      <i
                        class="fa-solid fa-trash me-4"
                        style={{
                          opacity: loadingForActions?.some(i => i.uid === item.uid) ? 0.5 : 1
                        }}
                        onClick={() => {
                          if (!loadingForActions?.some(i => i.uid === item.uid))
                            handleMailDelete(item, false)
                        }}
                      ></i>
                    </td>
                  </tr>
                )) : <tr style={{ height: "calc(100vh - 385px)", borderBottom: "none" }}>
                  <td colSpan={9} >
                    <div className="d-flex justify-content-center align-items-center gap-2 flex-column">No data found</div>
                  </td>
                </tr>

                }
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
