import React, { useState } from "react";

const EmailList = ({
  handleShowNewMail,
  handleListingClick,
  handleMailReplay,
}) => {
  //   const [selectedMail, setSelectedMail] = useState(null);
  //   const handleRowClick = () => {
  //     setSelectedMail(true);
  // };
  return (
    <>
      <div className="overviewTableWrapper p-0">
        <div
          className="tableContainer e mail_table mt-0 w-100 border-0 mb-0"
          style={{ height: "calc(100vh - 204px)", overflow: "auto" }}
        >
          <table>
            <thead>
              <tr>
                <th></th>
                <th>From</th>
                <th>Subject</th>
                <th> Received </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 50 }, (_, index) => (
                <tr key={index} onClick={handleMailReplay}>
                  <td>
                    {" "}
                    <input type="checkbox" />
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="tableProfilePicHolder">
                        <img
                          src={require("../../../assets/images/placeholder-image.webp")}
                        />
                      </div>
                      <div className="ms-2">test250</div>
                    </div>
                  </td>
                  <td>
                    <p className="ellipsisText300 mb-0">
                      <strong>Lorem Ipsum is FAKE TEXT! </strong>
                      <span className="text_gray">
                        All of the words in Lorem Ipsum have flirted with me -
                        consciously or unconsciously. That's to be expected. We
                        have so many things that we have to do better
                      </span>
                    </p>
                  </td>
                  <td>
                    <p className="mb-0 fw-semibold">12:06PM</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default EmailList;
