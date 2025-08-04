import React, { useEffect, useRef, useState } from "react";
import { convertDateToCurrentTimeZone, featureUnderdevelopment, formatTimeWithAMPM, generalGetFunction } from "../../../GlobalFunction/globalFunction";
import { Link, useNavigate } from "react-router-dom";
import EmptyPrompt from "../../../Loader/EmptyPrompt";
import { useDispatch } from "react-redux";
import DisplayFile from "../DisplayFile";

const MessageProfileDetails = ({
  recipient,
  messages,
  selectedChat,
  setMeetingPage,
  setToUser,
  setCalling,
  socketSendMessage,
  account,
  socketSendPeerGroupCallMessage,
  setIsConferenceCall,
  setConferenceInfo,
  setactivePage,
  activePage,
  isVideoOn,
  setConferenceToggle,
  conferenceToggle,
}) => {
  const dispatch = useDispatch()
  const [allFiles, setAllFiles] = useState([]);

  const [loading, setLoading] = useState(false);

  // ============ to manange audio file stuff start here 
  const audioRefs = useRef([]);
  const [playingIndex, setPlayingIndex] = useState(null);

  const handleToggle = (index) => {
    const currentAudio = audioRefs.current[index];

    if (!currentAudio) return;

    // Stop if already playing
    if (playingIndex === index) {
      currentAudio.pause();
      setPlayingIndex(null);
    } else {
      // Pause others
      if (playingIndex !== null && audioRefs.current[playingIndex]) {
        audioRefs.current[playingIndex].pause();
      }
      currentAudio.play();
      setPlayingIndex(index);
    }
  };

  const handleAudioEnded = () => {
    setPlayingIndex(null);
  };

  useEffect(() => {
    // Attach ended handler
    audioRefs.current.forEach((audio) => {
      if (audio) {
        audio.onended = handleAudioEnded;
      }
    });
  }, []);

  // ================ to manage audio stuff end here


  // Set Media and Files
  useEffect(() => {
    if (!messages) return;
    // setMedia(messages?.filter((item) => item.message_type === "image" || item.message_type === "video" || item.message_type === "audio").slice(0, 4))
    // setFiles(messages?.filter((item) => item.message_type === "file").slice(0, 4));
    setAllFiles(messages?.filter((item) => item.message_type !== "text\/plain").map((file) => ({
      ...file,
      message_text: file.body,
      created_at: file.time
    })))
  }, [messages]);

  useEffect(() => {
    if (recipient && recipient.length > 0) {
      handleViewAll();
    }
  }, [selectedChat])

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
  const handleViewAll = async () => {
    // setViewAllToggle(type);
    setLoading(true);
    try {
      let apiUrl = "";
      if (recipient[2] == "groupChat") {
        apiUrl = 'group-message/all?group_id='
      } else {
        apiUrl = 'message/all?receiver_id='
      }
      const response = await generalGetFunction(`${apiUrl}${recipient[1]}`);
      if (response.status) {
        setAllFiles(response.data.data.filter((item) => item.message_type !== "text\/plain"));
        // toast.success(response.message);
        setLoading(false);
      } else {
        // toast.error(response.message);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
      setLoading(false);
    }
  }

  // const handleViewAll = async (type) => {
  //   setViewAllToggle(type);
  //   setLoading(type);
  //   if (type === "files") {
  //     try {
  //       let apiUrl = "";
  //       if (recipient[2] == "groupChat") {
  //         apiUrl = 'group-message/all?group_id='
  //       } else {
  //         apiUrl = 'message/all?receiver_id='
  //       }
  //       const response = await generalGetFunction(`${apiUrl}${recipient[1]}&message_type=file`);
  //       if (response.status) {
  //         setAllFiles(
  //           response.data.map((file) => ({
  //             ...file,
  //             body: file.message_text,
  //             time: file.created_at
  //           }))
  //         );
  //         toast.success(response.message);
  //         setLoading(false);
  //       } else {
  //         toast.error(response.message);
  //         setLoading(false);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching files:", err);
  //       setLoading(false);
  //     }
  //   } else if (type === "media") {
  //     try {
  //       let apiUrl = "";
  //       if (recipient[2] == "groupChat") {
  //         apiUrl = 'group-message/all?group_id='
  //       } else {
  //         apiUrl = 'message/all?receiver_id='
  //       }
  //       const response = await generalGetFunction(`${apiUrl}${recipient[1]}&media`);
  //       if (response.status) {
  //         setAllMedia(
  //           response.data.map((file) => ({
  //             ...file,
  //             body: file.message_text,
  //           }))
  //         );
  //         toast.success(response.message);
  //         setLoading(false);
  //       } else {
  //         toast.error(response.message);
  //         setLoading(false);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching files:", err);
  //       setLoading(false);
  //     }
  //   }
  // }

  const getExtension = (input) => {
    var parts = input?.split(".");
    return parts[parts?.length - 1]?.toLowerCase();
  };

  const handleCallInitiatedFromProfile = () => {
    if (recipient[2] === "singleChat") {
      setMeetingPage("message");
      setToUser(recipient?.[1]);
      setCalling(true);
      dispatch({
        type: "SET_INTERNALCALLACTION",
        internalCallAction: null,
      });
      socketSendMessage({
        action: "peercallInitiate",
        from: account.id,
        to: recipient?.[1],
        room_id: `${account.id}-${recipient?.[1]}`,
        call_type: "audio",
      });
    } else {
      socketSendPeerGroupCallMessage({
        "action": "initiate_peer_group_call",
        "room_id": `${account.id}-${recipient?.[1]}`,
        "call_type": "audio",
        "message_group_id": recipient[1],
        "group_name": recipient[0],
        "user_id": account?.id,
      })
      setToUser(recipient[1])
      setCalling(true)
      setIsConferenceCall(false);
      try {
        dispatch({
          type: "SET_ROOMID",
          RoomID: `${account.id}-${recipient?.[1]}`
        })
      } catch (err) {
        console.log(err)
      } finally {
        setConferenceInfo({
          room_id: `${account.id}-${recipient?.[1]}`,
          extension_id: account?.extension_id,
          name: account?.username,
          setactivePage: setactivePage,
          activePage: activePage,
          setConferenceToggle: setConferenceToggle,
          conferenceToggle: conferenceToggle,
          conferenceId: "",
          pin: "",
          isVideoOn: isVideoOn,
        })
        setTimeout(() => {
          setCalling(true);
        }, 1000)
      }
    }
  }

  return (
    <div className="messageOverlay py-3 h-100" style={{ overflow: "hidden" }}>
      <div className="pt-4">
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
                {
                  selectedChat == "singleChat" ?
                    <i className="fa-light fa-user fs-5" /> :
                    <i className="fa-light fa-users fs-5" />
                }
              </div>
            )}
            <p className="mb-0 fs-6 fw-semibold text-capitalize">
              {/* {
              contact?.find(
                (contact) => contact.extension == recipient[0]
              )?.name
            }{" "}-
            {" "} */}
              {recipient[3] ? recipient[3] : <div className='skeleton skeleton-text' style={{ width: '150px' }} />}
            </p>
            {recipient[2] === "singleChat" && <h5 className="fw-medium f-s-14 ">{recipient[4] ? recipient[4] : <div className='skeleton skeleton-heading-small' style={{ width: '200px' }} />}</h5>}
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center gap-2">
          {/* {!saveEditToggleGroupNameChange ? ( */}
          <button
            className="clearButton2 link f-s-14"
            onClick={() => handleCallInitiatedFromProfile()}
          >
            <i className="fa-regular fa-phone"></i>
          </button>
          {/* <button className="clearButton2 link f-s-14">
            <i className="fa-regular fa-video"></i>
          </button> */}
        </div>
      </div>
      <div className="rightPanel pt-3">
        <div className="tangoNavs px-3">
          <nav className="noScrollBar">
            <div className="nav nav-tabs align-items-center" id="nav-tab" role="tablist">
              <button className="nav-link active" id="nav-all-tab" data-bs-toggle="tab" data-bs-target="#nav-all" type="button" role="tab" aria-controls="nav-all" aria-selected="true">All Files</button>
              <button className="nav-link" id="nav-files-tab" data-bs-toggle="tab" data-bs-target="#nav-files" type="button" role="tab" aria-controls="nav-files7" aria-selected="false">Doc</button>
              <button className="nav-link" id="nav-images-tab" data-bs-toggle="tab" data-bs-target="#nav-images" type="button" role="tab" aria-controls="nav-images" aria-selected="false">Images</button>
              <button className="nav-link" id="nav-audio-tab" data-bs-toggle="tab" data-bs-target="#nav-audio" type="button" role="tab" aria-controls="nav-audio" aria-selected="false">Audio</button>
              <button className="nav-link" id="nav-video-tab" data-bs-toggle="tab" data-bs-target="#nav-video" type="button" role="tab" aria-controls="nav-video" aria-selected="false">Video</button>
              <button className="clearButton2 refresh link f-s-14 ms-auto" onClick={() => handleViewAll()}><i className={`fa-solid fa-refresh ${loading ? 'fa-spin' : ''}`} /></button>
            </div>
          </nav>
          <div className="tab-content mt-3">
            <input type="search" name="Search" id="headerSearch" placeholder="Search" value="" className="mb-2" onChange={() => featureUnderdevelopment()} />

            <div className="tab-pane fade show active" id="nav-all" role="tabpanel" aria-labelledby="nav-all-tab" tabIndex="0">
              <div className="filePanelActive">
                {allFiles && allFiles?.length > 0 ? (
                  allFiles.map((item, index) => (
                    <div className="file_list" key={index}>
                      <div className="">
                        <span className="shared-file-icon">
                          {item.message_text && <i className={`fa-regular fa-file-${getExtension(item.message_text)}`}></i>}
                        </span>
                      </div>
                      <div className=" ">
                        <p className="ellipsisText">{item?.message_text?.split('chats/')[1]}</p>
                        <p className="text_muted">{convertDateToCurrentTimeZone(item?.created_at?.split(" ")[0])} - {formatTimeWithAMPM(item?.created_at?.split(" ")[1])}</p>
                      </div>
                      <div className="download" onClick={() => downloadImage(item?.message_text, item?.message_text?.split('chats/')[1])} >
                        <button>
                          <i className="fa-regular fa-arrow-down-to-line"></i>
                        </button>
                      </div>
                    </div>
                  ))
                ) : <EmptyPrompt generic={true} small={true} nomargin={true} />}
              </div>
            </div>
            <div className="tab-pane fade" id="nav-files" role="tabpanel" aria-labelledby="nav-files-tab" tabIndex="0">
              <div className="filePanelActive">
                {allFiles && allFiles?.length > 0 ? (
                  allFiles.filter((item) => item.message_type === "file").map((item, index) => (
                    <div className="file_list" key={index}>
                      <div className="">
                        <span className="shared-file-icon">
                          <i className="fa-regular fa-files"></i>
                        </span>
                      </div>
                      <div className=" ">
                        <p className="ellipsisText">{item?.message_text?.split('chats/')[1]}</p>
                        <p className="text_muted">{convertDateToCurrentTimeZone(item?.created_at?.split(" ")[0])} - {formatTimeWithAMPM(item?.created_at?.split(" ")[1])}</p>
                      </div>
                      <div className="download" onClick={() => downloadImage(item?.message_text, item?.message_text?.split('chats/')[1])} >
                        <button>
                          <i className="fa-regular fa-arrow-down-to-line"></i>
                        </button>
                      </div>
                    </div>
                  ))
                ) : <EmptyPrompt generic={true} small={true} nomargin={true} />}
              </div>
            </div>
            <div className="tab-pane fade" id="nav-images" role="tabpanel" aria-labelledby="nav-images-tab" tabIndex="0">
              <div className="filePanelActive">
                {allFiles && allFiles?.length > 0 ? (
                  <div className="imageList">
                    {allFiles.filter((item) => item.message_type === "image").map((item, index) => (
                      <div className="imgBox" key={index}>
                        <img
                          src={item?.message_text}
                          onError={(e) => e.target.src = require('../../../assets/images/placeholder-image2.webp')}
                          alt=""
                        />
                        <div className="extraButtons">
                          <Link className="tableButton me-2" to={item?.message_text} target="_blank">
                            <i className="fa-solid fa-eye text-white" />
                          </Link>
                          <button className="tableButton head ms-2" onClick={() => downloadImage(item?.message_text, item?.message_text?.split('chats/')[1])}>
                            <i className="fa-solid fa-download" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <EmptyPrompt generic={true} small={true} nomargin={true} />}
              </div>
            </div>
            <div className="tab-pane fade" id="nav-audio" role="tabpanel" aria-labelledby="nav-audio-tab" tabIndex="0">
              <div className="filePanelActive">
                {allFiles && allFiles?.length > 0 ? (
                  <div className="">
                    {allFiles
                      .filter((item) => item.message_type === "audio")
                      .map((item, index) => {
                        const fileName = item.message_text.split("/").pop();

                        return (
                          <div className="file_list mb-2" key={index}>
                            <div className="file_info">
                              <p className="ellipsisText">{fileName}</p>
                              <p className="text_muted">
                                {convertDateToCurrentTimeZone(item?.created_at?.split(" ")[0])} -{" "}
                                {formatTimeWithAMPM(item?.created_at?.split(" ")[1])}
                              </p>
                            </div>

                            <div className="audio_controls">
                              <audio
                                ref={(el) => (audioRefs.current[index] = el)}
                                src={item.message_text}
                              />
                              <div className="download ">
                                <button onClick={() => handleToggle(index)} style={{ fontSize: "1rem" }}>
                                  {playingIndex === index ? <i class="fa-regular fa-circle-pause"></i> : <i class="fa-regular fa-circle-play"></i>}
                                </button>
                              </div>
                              <div className="download ">
                                <button
                                  className=""
                                  onClick={() => downloadImage(item?.message_text, item?.message_text?.split('chats/')[1])}>
                                  <i className="fa-solid fa-download" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : <EmptyPrompt generic={true} small={true} nomargin={true} />}
              </div>
            </div>
            <div className="tab-pane fade" id="nav-video" role="tabpanel" aria-labelledby="nav-video-tab" tabIndex="0">
              <div className="filePanelActive filePanelActive-video">
                {allFiles && allFiles?.length > 0 ? (
                  <div className="video-list-in-profile-details">
                    {allFiles.filter((item) => item.message_type === "video").map((item, index) => (
                      <div className="imgBox" key={index}>
                        {/* <img
                        src={item?.message_text}
                        onError={(e) => e.target.src = require('../../../assets/images/placeholder-image2.webp')}
                        alt=""
                      /> */}
                        {/* <div className="extraButtons"> */}
                        {/* <Link className="tableButton me-2" to={item?.message_text} target="_blank">
                          <i className="fa-solid fa-eye text-white" />
                        </Link> */}
                        <div className="videoSize">
                          <DisplayFile
                            key={index}
                            item={item?.message_text}
                            index={index}
                          />
                        </div>

                        {/* <button className="tableButton head ms-2" onClick={() => downloadImage(item?.message_text, item?.message_text?.split('chats/')[1])}>
                          <i className="fa-solid fa-download" />
                        </button> */}
                        {/* </div> */}
                      </div>
                    ))}
                  </div>
                ) : <EmptyPrompt generic={true} small={true} nomargin={true} />}
              </div>
            </div>
          </div>
        </div>

        {/* <div className="chat_doc px-4 mb-2">
          <div className="d-flex justify-content-between gap-2">
            <p>
              Shared Files
              <span className="badge badge-purple fw-medium rounded-circle ms-2">
                {files?.length || 0}
              </span>
            </p>
            <span>
              <a onClick={() => viewAllToggle === "files" ? setViewAllToggle(false) : handleViewAll('files', recipient[2])}><u>{viewAllToggle === "files" ? 'View Less' : 'View All'}</u></a>
            </span>
          </div>
          {
            viewAllToggle === "files" || !viewAllToggle ? (
              loading.files ? (
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
            <span>
              <a onClick={() => viewAllToggle === "media" ? setViewAllToggle(false) : handleViewAll('media', recipient[2])}><u>{viewAllToggle === "media" ? 'View Less' : 'View All'}</u></a>
            </span>
          </div>

          {viewAllToggle === "media" || !viewAllToggle ? (
            loading.media ? (
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
        </div> */}
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
