import React, { useEffect, useState } from "react";
import { formatTimeWithAMPM, generalGetFunction } from "../../../GlobalFunction/globalFunction";
import { Link, useNavigate } from "react-router-dom";
import EmptyPrompt from "../../../Loader/EmptyPrompt";
import { toast } from "react-toastify";

const MessageProfileDetails = ({ recipient, messages }) => {
  const navigate = useNavigate();
  // console.log("Messages",messages);
  const [media, setMedia] = useState([]);
  const [allMedia, setAllMedia] = useState([]);

  const [viewAllToggle, setViewAllToggle] = useState(false);

  const [files, setFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([]);

  const [loading, setLoading] = useState('all');

  // Set Media and Files
  useEffect(() => {
    if (viewAllToggle === "files") {
      setFiles(allFiles);
    } else if (viewAllToggle === "media") {
      setMedia(allMedia);
    } else {
      setMedia(messages?.filter((item) => item.message_type === "image" || item.message_type === "video" || item.message_type === "audio").slice(0, 4))
      setFiles(messages?.filter((item) => item.message_type === "file").slice(0, 4));
    }
  }, [messages, viewAllToggle, loading]);

  // Loader for initial state
  useEffect(() => {
    if (media && media.length && files && files.length) {
      setLoading(false);
    }
  }, [media, files]);

  // Download any File / Media Function
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

  // Handle View All Files and Media
  const handleViewAll = async (type) => {
    setViewAllToggle(type);
    setLoading(type);
    if (type === "files") {
      try {
        let apiUrl = "";
        if (recipient[2] == "groupChat") {
          apiUrl = 'group-message/all?group_id='
        } else {
          apiUrl = 'message/all?receiver_id='
        }
        const response = await generalGetFunction(`${apiUrl}${recipient[1]}&message_type=file`);
        if (response.status) {
          setAllFiles(
            response.data.map((file) => ({
              ...file,
              body: file.message_text,
              time: file.created_at
            }))
          );
          toast.success(response.message);
          setLoading(false);
        } else {
          toast.error(response.message);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching files:", err);
        setLoading(false);
      }
    } else if (type === "media") {
      try {
        let apiUrl = "";
        if (recipient[2] == "groupChat") {
          apiUrl = 'group-message/all?group_id='
        } else {
          apiUrl = 'message/all?receiver_id='
        }
        const response = await generalGetFunction(`${apiUrl}${recipient[1]}&media`);
        if (response.status) {
          setAllMedia(
            response.data.map((file) => ({
              ...file,
              body: file.message_text,
            }))
          );
          toast.success(response.message);
          setLoading(false);
        } else {
          toast.error(response.message);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching files:", err);
        setLoading(false);
      }
    }
  }

  return (
    <div className="messageOverlay py-3 h-100" style={{ overflow: "hidden" }}>
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
                <i className="fa-light fa-user fs-5"></i>
              </div>
            )}
            <p className="mb-0 fs-6 fw-semibold">
              {/* {
              contact?.find(
                (contact) => contact.extension == recipient[0]
              )?.name
            }{" "}-
            {" "} */}
              {recipient[3] ? recipient[3] : <div className='skeleton skeleton-text' style={{ width: '150px' }} />}
            </p>
            {recipient[2] === "singleChat" && <h5 className="fw-medium f-s-14 text_muted">{recipient[4] ? recipient[4] : <div className='skeleton skeleton-heading-small' style={{ width: '200px' }} />}</h5>}
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
        <div className="chat_doc px-4 mb-2">
          <div className="d-flex justify-content-between gap-2">
            <p>
              Shared Files
              <span className="badge badge-purple fw-medium rounded-circle ms-2">
                {files?.length || 0}
              </span>
            </p>
            {files && files.length > 0 ? (
              <span>
                <a onClick={() => viewAllToggle === "files" ? setViewAllToggle(false) : handleViewAll('files', recipient[2])}><u>{viewAllToggle === "files" ? 'View Less' : 'View All'}</u></a>
              </span>
            ) : ""}
          </div>
          {
            viewAllToggle === "files" || !viewAllToggle ? (
              loading === "files" || loading === "all" ? (
                <div className="file_list">
                  <div className="">
                    <div className='skeleton skeleton-button' style={{ width: '35px' }} />
                  </div>
                  <div className=" ">
                    <p className="ellipsisText"><div className='skeleton skeleton-text mb-1' /></p>
                    <p className="text_muted"><div className='skeleton skeleton-heading-small' style={{ width: '200px' }} /></p>
                  </div>
                  <div className="download">
                    <div className='skeleton skeleton-button' style={{ width: '35px' }} />
                  </div>
                </div>
              ) :
                files && files?.length > 0 ? (
                  files.map((item, index) => (
                    <div className="file_list" key={index}>
                      <div className="">
                        <span className="shared-file-icon">
                          <i className="fa-regular fa-files"></i>
                        </span>
                      </div>
                      <div className=" ">
                        <p className="ellipsisText">{item.body.split('chats/')[1]}</p>
                        <p className="text_muted">{item.time.split(" ")[0]} - {formatTimeWithAMPM(item.time.split(" ")[1])}</p>
                      </div>
                      <div className="download" onClick={() => downloadImage(item.body, item.body.split('chats/')[1])} >
                        <button>
                          <i className="fa-regular fa-arrow-down-to-line"></i>
                        </button>
                      </div>
                    </div>
                  ))
                ) : <EmptyPrompt generic={true} small={true} nomargin={true} />

            ) : ""}
        </div>
        <div className="chat_doc px-4">
          <div className="d-flex justify-content-between gap-2">
            <p>
              Photos & Media
              <span className="badge badge-purple fw-medium rounded-circle ms-2">
                {media?.length || 0}
              </span>
            </p>
            {media && media.length > 0 ? (
              <span>
                <a onClick={() => viewAllToggle === "media" ? setViewAllToggle(false) : handleViewAll('media', recipient[2])}><u>{viewAllToggle === "media" ? 'View Less' : 'View All'}</u></a>
              </span>
            ) : ""}
          </div>

          {viewAllToggle === "media" || !viewAllToggle ? (
            loading === "media" || loading === "all" ? (
              <div className="file_list">
                <div className="">
                  <div className='skeleton skeleton-button' style={{ width: '35px' }} />
                </div>
                <div className=" ">
                  <p className="ellipsisText"><div className='skeleton skeleton-text mb-1' /></p>
                  <p className="text_muted"><div className='skeleton skeleton-heading-small' style={{ width: '200px' }} /></p>
                </div>
                <div className="download">
                  <div className='skeleton skeleton-button' style={{ width: '35px' }} />
                </div>
              </div>
            ) :
              media && media?.length > 0 ? (
                <div className="imageList">
                  {media.map((item, index) => (
                    <div className="imgBox" key={index}>
                      <img
                        src={item.body}
                        onError={(e) => e.target.src = require('../../../assets/images/placeholder-image2.webp')}
                        alt=""
                      />
                      <div className="extraButtons">
                        <Link className="tableButton me-2" to={item.body} target="_blank">
                          <i className="fa-solid fa-eye text-white" />
                        </Link>
                        <button className="tableButton head ms-2" onClick={() => downloadImage(item.body, item.body.split('chats/')[1])}>
                          <i className="fa-solid fa-download" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <EmptyPrompt generic={true} small={true} nomargin={true} />
          ) : ""}
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
