import React, { useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { generalGetFunction, generalPostFunction, generatePreSignedUrl } from '../../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';
import SkeletonTableLoader from '../../Loader/SkeletonTableLoader';
import Comments from './Comments';
import AudioWaveformCommon from '../../CommonComponents/AudioWaveformCommon';

export default function Duplicates({ setShowDuplicatePopUp, duplicatePopUpData }) {
  const [selectedId, setSelectedId] = useState(duplicatePopUpData.id)
  const [loading, setLoading] = useState(true);
  const [showComment, setShowComment] = useState(false);
  // const [commentData, setCommentData] = useState([]);
  const [duplicateData, setDuplicateData] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [showAudio, setShowAudio] = useState(false)
  const thisAudioRef = useRef(null);
  const [showDropDown, setShowDropdown] = useState(false)
  const [pageNumber, setPageNumber] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [showKeys, setShowKeys] = useState([
    "Call-Direction",
    "variable_sip_from_user",
    // "tag",
    // "application_state",
    // "application_state_to_ext",
    "e_name",
    "Date",
    "Time",
    // "recording_path",
    "variable_billsec",
    // "Hangup-Cause",
    // "variable_DIALSTATUS"
  ]);


  useEffect(() => {
    return () => {
      // Reset audio state when component unmounts
      setCurrentPlaying("");
      setAudioURL("");
    };
  }, []);
  useEffect(() => {
    async function getData() {
      const callDirection = duplicatePopUpData["Call-Direction"];
      let res;
      try {

        if (callDirection == "inbound") {
          res = await generalGetFunction(`/cdr-comments-user?source=${duplicatePopUpData["variable_sip_from_user"]}`)
        } else {
          res = await generalGetFunction(`/cdr-comments-user?destination=${duplicatePopUpData["variable_sip_to_user"]}`)
        }
        if (res.status) {
          setLoading(false)
          setDuplicateData(res.data);
        } else {
          setLoading(false)
        }

      } catch (error) {

      }
    }
    getData()
  }, [])
  // Get the previous comments data

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  }


  const handelOpenNotes = () => {
    setShowComment(true)
  }
  const handlePlaying = async (audio) => {
    // Reseting state before Playing
    setCurrentPlaying("");
    setAudioURL("");

    try {
      setCurrentPlaying(audio);
      const url = audio?.split(".com/").pop();
      const res = await generatePreSignedUrl(url);

      if (res?.status && res?.url) {
        setAudioURL(res.url); // Update audio URL state

        // Wait for React state update before accessing ref
        setTimeout(() => {
          if (thisAudioRef.current) {
            thisAudioRef.current.load(); // Reload audio source
            thisAudioRef.current.play().catch((error) => {
              console.error("Audio play error:", error);
            });
          }
        }, 100); // Reduced timeout to minimize delay
      }
    } catch (error) {
      console.error("Error in handlePlaying:", error);
    }
  };
  function getCallIcon(item) {
    const callIcons = {
      inbound: {
        icon:
          item.variable_DIALSTATUS === "Missed"
            ? "fa-solid fa-phone-missed"
            : "fa-phone-arrow-down-left",
        color:
          item.variable_DIALSTATUS === "Missed"
            ? "var(--funky-boy4)"
            : "var(--funky-boy3)",
        label: "Inbound",
      },
      outbound: {
        icon:
          item.variable_DIALSTATUS === "Missed"
            ? "fa-solid fa-phone-missed"
            : "fa-phone-arrow-up-right",
        color:
          item.variable_DIALSTATUS === "Missed"
            ? "var(--funky-boy4)"
            : "var(--color3)",
        label: "Outbound",
      },
      internal: {
        icon:
          item.variable_DIALSTATUS === "Missed"
            ? "fa-solid fa-phone-missed"
            : "fa-headset",
        color:
          item.variable_DIALSTATUS === "Missed"
            ? "var(--funky-boy4)"
            : "var(--color2)",
        label: "Internal",
      },
    };

    return callIcons[item["Call-Direction"]] || callIcons.internal;
  }

  // Example usage:
  // Assuming 'item' is defined somewhere in your code
  // const callType = getCallIcon(item);

  // if you need to use it in place of your previous code:
  // const callType = getCallIcon(item);

  function formatTimeWithAMPM(timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return "Invalid time format";
    }

    let period = 'AM';
    let formattedHours = hours;

    if (hours >= 12) {
      period = 'PM';
      if (hours > 12) {
        formattedHours -= 12;
      }
    }

    if (formattedHours === 0) {
      formattedHours = 12; // Midnight is 12 AM
    }

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${period}`;
  }


  return (

    <>
      {showComment && <Comments id={selectedId} setId={setSelectedId} setShowComment={setShowComment} />} <div className="backdropContact " style={{ zIndex: "11" }}>
        <div className="addNewContactPopup w-auto">

          {/* <div className="col-12 heading mb-0">
             <i className="fa-light fa-comment-dots" />
             <h5>Agent Note</h5>
         </div>
       */}
          <div className='overviewTableWrapper p-0'>
            <div className='overviewTableChild border-0 shadow-none'>
              <div className="col-xl-12">
                {!loading ?
                  <>
                    {duplicateData.length > 0 ?
                      <div className='tableContainer m-0 p-0'>
                        <table>
                          <thead>
                            <tr>
                              <th>#</th>
                              {showKeys.map((key) => {
                                let headerText = key; // Default to the key itself

                                switch (key) {
                                  case "Call-Direction":
                                    headerText = "Call Direction";
                                    break;
                                  case "Caller-Orig-Caller-ID-Name":
                                    headerText = "Caller No.";
                                    break;
                                  case "variable_sip_from_user":
                                    headerText = "Caller No.";
                                    break;
                                  case "tag":
                                    headerText = "Tag";
                                    break;
                                  case "application_state":
                                    headerText = "Via/Route";
                                    break;
                                  case "application_state_to_ext":
                                    headerText = "Ext/Dest";
                                    break;
                                  case "e_name":
                                    headerText = "User Name"; // or whatever mapping is needed
                                    break;
                                  case "Date":
                                    headerText = "Date";
                                    break;
                                  case "Time":
                                    headerText = "Time";
                                    break;
                                  // case "recording_path":
                                  //   headerText = "Recordings";
                                  //   break;
                                  case "variable_billsec":
                                    headerText = "Duration";
                                    break;
                                  case "Hangup-Cause":
                                    headerText = "Hangup Cause";
                                    break;
                                  default:
                                  case "variable_DIALSTATUS":
                                    headerText = "Hangup Status"
                                    break;
                                }

                                return <th key={key}>{headerText}</th>;
                              })}
                              <th>Comments</th>
                            </tr>
                          </thead>
                          <tbody  >
                            {duplicateData.map((call, index) => {
                              const callIcon = getCallIcon(call); // Call the getCallIcon function
                              return <React.Fragment key={index}>
                                <tr
                                >
                                  <td>
                                    {(pageNumber - 1) *
                                      Number(itemsPerPage) +
                                      (index + 1)}
                                  </td>
                                  {showKeys.map((key, keyIndex) => {
                                    if (key === "Call-Direction") {
                                      return (
                                        <td>
                                          <i
                                            className={`fa-solid ${callIcon.icon} me-1`}
                                            style={{ color: callIcon.color }}
                                          ></i>
                                          {callIcon.label}
                                        </td>
                                      );
                                    } else if (key === "e_name") {
                                      return <td >{call["e_name"]}</td>;
                                    } else if (key === "variable_sip_from_user") {
                                      return <td >{call["variable_sip_from_user"]}</td>;
                                    } else if (key === "tag") {
                                      return <td >{call["tag"]}</td>;
                                    } else if (key === "application_state") {
                                      return <td>
                                        {[
                                          "intercept",
                                          "eavesdrop",
                                          "whisper",
                                          "barge",
                                        ].includes(
                                          call["application_state"]
                                        )
                                          ? call[
                                          "other_leg_destination_number"
                                          ]
                                          : call[
                                          "Caller-Callee-ID-Number"
                                          ]}{" "}
                                        {call[
                                          "application_state_name"
                                        ] &&
                                          `(${call["application_state_name"]})`}
                                      </td>
                                    } else if (key === "application_state_to_ext") {
                                      return <td>{call["application_state_to_ext"]}</td>;
                                    } else if (key === "Date") {
                                      return <td >{call["variable_start_stamp"]?.split(" ")[0]}</td>;
                                    } else if (key === "Time") {
                                      const time = formatTimeWithAMPM(call["variable_start_stamp"]?.split(" ")[1])
                                      return <td >{time}</td>;
                                    }
                                    // else if (key === "recording_path") {
                                    //     return (
                                    //         <td >
                                    //             {call["recording_path"] !== null && call["variable_billsec"] > 0 && (
                                    //                 <button
                                    //                     className="tableButton"
                                    //                     onClick={() => {
                                    //                         if (currentPlaying === call["recording_path"]) {
                                    //                             setCurrentPlaying("");
                                    //                             setShowAudio(false);
                                    //                         } else {
                                    //                             setCurrentPlaying(call["recording_path"]);
                                    //                             setShowDropdown(true);
                                    //                             setShowAudio(false);
                                    //                         }
                                    //                     }}
                                    //                 >
                                    //                     {showDropDown && currentPlaying === call["recording_path"] ? (
                                    //                         <ul className="dropdown-menu actionBtnDropdowns" key={index}>
                                    //                             <>
                                    //                                 <li className="dropdown-item">
                                    //                                     <div
                                    //                                         className="clearButton text-align-start"
                                    //                                         onClick={(e) => {
                                    //                                             e.stopPropagation();
                                    //                                             if (call.recording_path === currentPlaying) {
                                    //                                                 setShowDropdown(false);
                                    //                                                 setShowAudio(true);
                                    //                                                 handlePlaying(call.recording_path);
                                    //                                             }
                                    //                                         }}
                                    //                                     >
                                    //                                         <i className={`fa-solid fa-${call?.recording_path !== null ? "play" : "triangle-exclamation"} me-2`}></i>
                                    //                                         Play
                                    //                                     </div>
                                    //                                 </li>
                                    //                                 <li className="dropdown-item">
                                    //                                     <div className="clearButton text-align-start">
                                    //                                         <i className="fa-solid fa-bolt me-2"></i>
                                    //                                         Transcript
                                    //                                     </div>
                                    //                                 </li>
                                    //                             </>
                                    //                             <>
                                    //                                 <li className="dropdown-item">
                                    //                                     <div className="clearButton text-align-start">
                                    //                                         <i className="fa-regular fa-download"></i> Download
                                    //                                     </div>
                                    //                                 </li>
                                    //                             </>
                                    //                             <li className="dropdown-item"></li>
                                    //                         </ul>
                                    //                     ) : (
                                    //                         <></>
                                    //                     )}
                                    //                     {currentPlaying === call["recording_path"] ? (
                                    //                         <i className="fa-solid fa-stop"></i>
                                    //                     ) : (
                                    //                         <i className="fa-solid fa-play"></i>
                                    //                     )}
                                    //                 </button>
                                    //             )}
                                    //         </td>
                                    //     );
                                    // }
                                    else if (key === "variable_billsec") {
                                      return <td>{formatTime(call["variable_billsec"])}</td>;
                                    } else if (key === "Hangup-Cause") {
                                      return <td>{call["Hangup-Cause"]}</td>
                                    }
                                    else {
                                      return <td>{call[key]}</td>
                                    }
                                  })}

                                  <td className="px-4 py-3">
                                    <button
                                      className="tableButton"
                                      onClick={() => handelOpenNotes()}
                                    >
                                      <i className="fa-solid fa-comment-dots"></i>
                                    </button>
                                    {/* {call.comments} */}
                                  </td>
                                </tr>
                                {/* Recording Player */}
                                {currentPlaying ===
                                  call["recording_path"] && showAudio &&
                                  <tr>
                                    <td colspan="18">
                                      <div class="audio-container mx-2">
                                        <AudioWaveformCommon audioUrl={audioURL} />
                                      </div>
                                    </td>
                                  </tr>}
                              </React.Fragment>
                            })}

                          </tbody>
                        </table>
                      </div>
                      :
                      <div className="startAJob">
                        <div className="text-center mt-3">
                          <img
                            src={require("../../assets/images/empty-box.png")}
                            alt="Empty"
                          ></img>
                          <div>
                            <h5>
                              No Records are Available.
                            </h5>
                            <h5>
                              Please select a different <b>record</b> to see all of its details here.
                            </h5>
                          </div>
                        </div>
                      </div>
                    }
                  </> :
                  <div className='tableContainer m-0 p-0'>
                    <table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Call Direction</th>
                          <th>Caller No.</th>
                          <th>Call Destination</th>
                          <th>Tag</th>
                          <th>Via/Route</th>
                          <th>Ext/Dest</th>
                          <th>Date</th>
                          <th>Time</th>
                          {/* <th>Recordings</th> */}
                          <th>Duration</th>
                          <th>Hangup Cause</th>
                          <th>Hangup Status</th>
                          <th>Comments</th>
                        </tr>
                      </thead>
                      <tbody >
                        <SkeletonTableLoader col={13} row={15} />
                      </tbody>
                    </table>
                  </div>}
                <div className="col-xl-12 mt-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <button className="panelButton gray mx-0" onClick={() => setShowDuplicatePopUp(false)}>
                      <span className="text">Close</span>
                      <span className="icon">
                        <i className="fa-solid fa-caret-left" />
                      </span>
                    </button>
                    {/* {
   comment && comment !== "" && <button className="tableButton delete" onClick={() => handleComments("delete")}>
     <i className="fa-solid fa-trash" />
   </button>
 } */}
                    {/* <button className="panelButton mx-0" >
                 <span className="text">ok</span>
                 <span className="icon">
                   <i className="fa-solid fa-floppy-disk" />
                 </span>
               </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div></>
  )
}

