import React from "react";

const MessageProfileDetails = (props) => {
  const { recipient } = props;
  return (
    <div className="messageOverlay py-3 h-100">
      <div className="p-4">
        <div className="col">
          <div className="d-flex justify-content-start align-items-center gap-2 mb-2 flex-column">
            {recipient[5] != null ? (
              <div className="profileHolder">
                <img
                  src={recipient[5]}
                  alt="profile"
                  onError={(e) =>
                    (e.target.src = require("../../../assets/images/placeholder-image.webp"))
                  }
                />
              </div>
            ) : (
              <div className="profileHolder" id={"profileOfflineNav"}>
                <i className="fa-light fa-users fs-5"></i>
              </div>
            )}
            <p className="mb-0 fs-6 fw-semibold">
              {/* {
              contact?.find(
                (contact) => contact.extension == recipient[0]
              )?.name
            }{" "}-
            {" "} */}
              {recipient[3]}
            </p>
            <h5 className="fw-medium f-s-14 text_muted">{recipient[4]}</h5>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* {!saveEditToggleGroupNameChange ? ( */}
          <button className="clearButton2 link f-s-14">
            <i className="fa-regular fa-phone"></i>
          </button>
          <button className="clearButton2 link f-s-14">
            <i className="fa-regular fa-video"></i>
          </button>
        </div>
      </div>
      <div className="rightPanel">
        <div className="chat_doc px-4 mb-4">
          <div className="d-flex justify-content-between align-items-center gap-2">
            <p>
              Shared Files
              <span className="badge badge-purple fw-medium rounded-circle ms-2">
                4
              </span>
              <span>
                {/* <Link className="" to=""><u>View All</u>
            </Link> */}
              </span>
            </p>
          </div>
          <div className="file_list">
            <div className="">
              <span className="shared-file-icon">
                <i className="fa-regular fa-files"></i>
              </span>
            </div>
            <div className=" ">
              <p className="ellipsisText">Project Details.pdf</p>
              <p className="text_muted">14,April 2025 - 14:24PM</p>
            </div>
            <div className="download ">
              <button>
                <i className="fa-regular fa-arrow-down-to-line"></i>
              </button>
            </div>
          </div>
          <div className="file_list">
            <div className="">
              <span className="shared-file-icon">
                <i class="fa-regular fa-images"></i>
              </span>
            </div>
            <div className=" ">
              <p className="ellipsisText">Img_02.Jpg</p>
              <p className="text_muted">22,April 2025 - 10:19AM</p>
            </div>
            <div className="download ">
              <button>
                <i className="fa-regular fa-arrow-down-to-line"></i>
              </button>
            </div>
          </div>
          <div className="file_list">
            <div className="">
              <span className="shared-file-icon">
                <i class="fa-sharp fa-regular fa-film"></i>
              </span>
            </div>
            <div className=" ">
              <p className="ellipsisText">Video_15_02_2022.MP4</p>
              <p className="text_muted">22,April 2025 - 10:19AM</p>
            </div>
            <div className="download ">
              <button>
                <i className="fa-regular fa-arrow-down-to-line"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="chat_doc px-4">
          <div className="d-flex justify-content-between align-items-center gap-2">
            <p>
              Photos & Media
              <span className="badge badge-purple fw-medium rounded-circle ms-2">
                4
              </span>
              <span>
                {/* <Link className="" to=""><u>View All</u>
            </Link> */}
              </span>
            </p>
          </div>
          <div className="imageList">
            <div className="imgBox">
              <img
                src={require("../../../assets/images/profilepic.png")}
                alt=""
              />
            </div>
            <div className="imgBox">
              <img
                src={require("../../../assets/images/profilepic.png")}
                alt=""
              />
            </div>
            <div className="imgBox">
              <img
                src={require("../../../assets/images/profilepic.png")}
                alt=""
              />
            </div>
            <div className="imgBox">
              <img
                src={require("../../../assets/images/profilepic.png")}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>

      {/* {!addMember && <div className="mb-auto px-4">
      <button
        className="panelButton gray ms-0"
        onClick={() => {
          setManageGroupChat(false);
        }}
      >
        <span className="text">Close</span>
        <span className="icon">
          <i className="fa-solid fa-caret-left" />
        </span>
      </button>
    </div>} */}
    </div>
  );
};

export default MessageProfileDetails;
