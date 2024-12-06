import { useEffect, useRef, useState } from "react";
import { useSIPProvider } from "react-sipjs";
import MediaPermissions from "./MediaPermissions ";
import AutoAnswer from "./AutoAnswer";
import { generalGetFunction, generalPostFunction } from "../../GlobalFunction/globalFunction";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ContentLoader from "../../Loader/ContentLoader";

export const ConferenceCall = ({ room_id, extension_id, name,setactivePage }) => {
  const navigate = useNavigate();
  const { sessions: sipSessions, connectAndRegister } = useSIPProvider();
  const { connectStatus, registerStatus } = useSIPProvider();
  const [sipRegisterErrror, setSipRegisterError] = useState(false);
  const dummySession = useSelector((state) => state.dummySession);
  const conference = useSelector((state) => state.conference);
  const conferenceData = useSelector((state) => state.conference)
  const [loading, setLoading] = useState(true);
  const [confList, setConfList] = useState([])
  const [videoCallToggle, setVideoCallToggle] = useState(false);
  const [toggleMessages, setToggleMessages] = useState(false);
  const [selectedConferenceUser, setSelectedConferenceUser] = useState(null);
  const [currentUser, setCurrentUser] = useState([])
  const [notification, setNotification] = useState(false)
  const [notificationData, setNotificationData] = useState("")
  console.log("cccccccc", room_id, extension_id, name);
  console.log("conferenceDataaaa", conferenceData);
  


  // Default select the current user
  useEffect(() => {
    setSelectedConferenceUser(currentUser[0])
  }, [currentUser])
  const handleSelectConferenceUser = (item) => {
    setSelectedConferenceUser(item);
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ") // Split the name into an array of words
      .filter((word) => word.trim().length > 0) // Remove empty words in case of extra spaces
      .map((word) => word[0].toUpperCase()) // Take the first character and convert it to uppercase
      .join(""); // Join the initials into a single string
  };

  useEffect(() => {
    setSelectedConferenceUser(confList.filter((item) => item.isYou));
  }, [loading]);

  // First check weather user is registered with sip then call start conference and conference listing api
  useEffect(() => {
    setTimeout(() => {
      if (connectStatus === "WAIT_REQUEST_CONNECT") {
        setLoading(true)
      }
      else if (sipRegisterErrror) {
        toast.error("Not connected with server please try again later.");
        navigate(-1)
      } else if (connectStatus === "CONNECTED") {
        async function startConference() {
          const response = await generalPostFunction("/conference/start", { user: `user/${extension_id}`, name: name, roomId: room_id, is_guest: 0 })

          if (response.status) {
            setLoading(false)
            const confLists = await generalGetFunction(`/conference/${room_id}/details`)
            // console.log(locationState, "confListsss", JSON?.parse?.(confLists?.data));

            if (confLists.status && confLists?.data !== `-ERR Conference ${room_id} not found\n`) {
                setConfList(JSON?.parse?.(confLists?.data)?.filter((item) => item.conference_name == room_id)?.[0]?.members.map((item) => {
                    return (
                        {
                            id: item.id,
                            caller_id_number: item.caller_id_number,
                            name: item.caller_id_name,
                            uuid: item.uuid,
                            talking: item.flags.talking,
                            mute_detect: (item.flags.mute_detect),
                            hold: item.flags.hold,
                            isYou: item.caller_id_name === name ? true : false,
                            deaf: false
                        }
                    )
                }))
            }
        }

        }
        startConference()
      } else {
        toast.error("Not connected with server please try again later.");
        navigate(-1)
      }
    }, [3000])

  }, [connectStatus, sipRegisterErrror])

  // Monitor incoming SIP sessions
  const incomingSessionsArray = Object.keys(sipSessions).filter(
    (id) =>
      sipSessions[id].state === "Initial" &&
      sipSessions[id].logger.category === "sip.Invitation"
  );

  
  // Monitor incoming data from web socket accound to its action type
  useEffect(() => {
    if (conferenceData) {
        // Check if conferencedata.calleridname is previously present in conflist
        if (conferenceData.Action === "add-member" && !confList.some(item => item.caller_id_number === conferenceData["Channel-Presence-ID"])) {
            setNotification(false)
            setNotification(true)
            setNotificationData(`${conferenceData["Caller-Caller-ID-Name"]} joined the conference`);
            setTimeout(() => {
                setNotification(false)
            }, [3000])
            setConfList(prevList => [...prevList, {
                id: conferenceData["Member-ID"],
                name: conferenceData["Caller-Caller-ID-Name"],
                caller_id_number: conferenceData["Channel-Presence-ID"],
                uuid: conferenceData["Core-UUID"],
                talking: conferenceData["Talking"],
                mute_detect: conferenceData["Mute-Detect"],
                hold: conferenceData["Hold"],
                isYou: conferenceData["Caller-Caller-ID-Name"] === name ? true : false,
                deaf: false
            }]);
            
            // Here i want to change the id on current user
            if(conferenceData["Channel-Presence-ID"]=== extension_id){
                setCurrentUser((prevState) => ({
                    ...prevState, 
                    id: conferenceData["Member-ID"] 
                }));
            }
           
            
        } else if (conferenceData.Action === "stop-talking") {
            if(!confList.some(item => item.caller_id_number === conferenceData["Channel-Presence-ID"])){
                setConfList(prevList => [...prevList, {
                    id: conferenceData["Member-ID"],
                    name: conferenceData["Caller-Caller-ID-Name"],
                    caller_id_number: conferenceData["Channel-Presence-ID"],
                    uuid: conferenceData["Core-UUID"],
                    talking: conferenceData["Talking"],
                    mute_detect: conferenceData["Mute-Detect"],
                    hold: conferenceData["Hold"],
                    isYou: conferenceData["Caller-Caller-ID-Name"] === name ? true : false,
                    deaf: false
                }]);
            }
           
            if(conferenceData["Channel-Presence-ID"]=== extension_id){
                setCurrentUser((prevState) => ({
                    ...prevState, 
                    id: conferenceData["Member-ID"] 
                }));
            }
            // Update the list with the updated values
            setConfList(prevList => prevList.map(item => {
                if (item.caller_id_number === conferenceData["Channel-Presence-ID"]) {
                    return {
                        ...item,
                        talking: false,
                    };
                }
                return item;
            }));
           
        } else if (conferenceData.Action === "start-talking") {
            if(!confList.some(item => item.caller_id_number === conferenceData["Channel-Presence-ID"])){
                setConfList(prevList => [...prevList, {
                    id: conferenceData["Member-ID"],
                    name: conferenceData["Caller-Caller-ID-Name"],
                    caller_id_number: conferenceData["Channel-Presence-ID"],
                    uuid: conferenceData["Core-UUID"],
                    talking: conferenceData["Talking"],
                    mute_detect: conferenceData["Mute-Detect"],
                    hold: conferenceData["Hold"],
                    isYou: conferenceData["Caller-Caller-ID-Name"] === name ? true : false,
                    deaf: false
                }]);
            }
           
            if(conferenceData["Channel-Presence-ID"]=== extension_id){
                setCurrentUser((prevState) => ({
                    ...prevState, 
                    id: conferenceData["Member-ID"] 
                }));
            }
            // Update the list with the updated values
            setConfList(prevList => prevList.map(item => {
                if (item.caller_id_number === conferenceData["Channel-Presence-ID"]) {
                    return {
                        ...item,
                        talking: true,
                    };
                }
                return item;
            }));
           
        } else if (conferenceData.Action === "mute-member") {
            // Update the list with the updated values
            setConfList(prevList => prevList.map(item => {
                if (item.caller_id_number === conferenceData["Channel-Presence-ID"]) {
                    return {
                        ...item,
                        mute_detect: true,
                        talking: false,
                    };
                }
                return item;
            }));
            if(conferenceData["Channel-Presence-ID"]=== extension_id){
                setCurrentUser((prevState) => ({
                    ...prevState, 
                    id: conferenceData["Member-ID"] ,
                    mute_detect: true
                }));
            }
        } else if (conferenceData.Action === "unmute-member") {
            // Update the list with the updated values
            setConfList(prevList => prevList.map(item => {
                if (item.caller_id_number === conferenceData["Channel-Presence-ID"]) {
                    return {
                        ...item,
                        mute_detect: false
                    };
                }
                return item;
            }));
            if(conferenceData["Channel-Presence-ID"]=== extension_id){
                setCurrentUser((prevState) => ({
                    ...prevState, 
                    id: conferenceData["Member-ID"] ,
                    mute_detect: false
                }));
            }
        } else if (conferenceData.Action === "deaf-member") {
            // Update the list with the updated values
            setConfList(prevList => prevList.map(item => {
                if (item.caller_id_number === conferenceData["Channel-Presence-ID"]) {
                    return {
                        ...item,
                        deaf: true,
                    };
                }
                return item;
            }));
            if(conferenceData["Channel-Presence-ID"]=== extension_id){
                setCurrentUser((prevState) => ({
                    ...prevState, 
                    id: conferenceData["Member-ID"] 
                }));
            }
        } else if (conferenceData.Action === "undeaf-member") {
            // Update the list with the updated values
            setConfList(prevList => prevList.map(item => {
                if (item.caller_id_number === conferenceData["Channel-Presence-ID"]) {
                    return {
                        ...item,
                        deaf: false,
                    };
                }
                return item;
            }));
            if(conferenceData["Channel-Presence-ID"]=== extension_id){
                setCurrentUser((prevState) => ({
                    ...prevState, 
                    id: conferenceData["Member-ID"] 
                }));
            }
        } else if (conferenceData.Action === "del-member" || conferenceData.Action === "hup-member") {
            setNotification(false)
            setNotification(true)
            setNotificationData(`${conferenceData["Caller-Caller-ID-Name"]} has left the conference`);
            setTimeout(() => {
                setNotification(false)
            }, [3000])
            setConfList(prevList => {
                const index = prevList.findIndex(
                    item => item.caller_id_number === conferenceData["Channel-Presence-ID"]
                );
                if (index !== -1) {
                    const newList = [...prevList];
                    newList.splice(index, 1);
                    return newList;
                }
                return prevList; // Return the original list if no match is found
            });
        }
    }
}, [conferenceData])

  // Handle calling action for current user
  async function callAction(action) {
    const parsedData = {
        action: action,
        room_id: room_id,
        member: String(currentUser?.id)
    }
    generalPostFunction(`conference/action`, parsedData).then(res => {
        if (res.status && action === "hup") {
          setactivePage("call")
        }
    })
    if(action === "deaf"){
    //    update current user state
        setCurrentUser((prevState) => ({
            ...prevState, 
            deaf: true
        }));
    }else if(action === "undeaf"){
        setCurrentUser((prevState) => ({
            ...prevState, 
            deaf: false
        }));
    }else if(action === "tmute"){
        setCurrentUser((prevState) => ({
            ...prevState, 
            mute_detect : !(currentUser.mute_detect)
        }));
    }
}

window.addEventListener("beforeunload", (event) => {
  event.preventDefault();
  event.returnValue = ""; // Trigger the confirmation dialog

  // Send your API call reliably
  const data = JSON.stringify({ action: "hup" });
  navigator.sendBeacon("/api/callAction", data);
});

  return (
    <div className="profileDropdowns" style={{ top: "55px", right: "-40px" }}>
      <MediaPermissions />
      {incomingSessionsArray.map((item, index) => {
        return (
          <AutoAnswer id={item} />
        )
      })}
      {
        loading ?
          <ContentLoader /> :
          dummySession && <>
            <main
              className="mainConte"
            >
              <section>
                <div className="container-fluid">
                  <div className="row">

                    <div className="videoCallWrapper">
                      <div className="row">
                        {toggleMessages && <div className="col-lg-4 col-xl-4 col-12 p-3">
                          <div className="messageOverlay">
                            <div className="contactHeader py-3">
                              <div>
                                <h4>Messages</h4>
                              </div>
                            </div>
                            <div className="messageContent">
                              <div className="messageList">
                                <div className="messageItem sender">
                                  <div className="second">
                                    <h6>
                                      1003,<span>3:48</span>
                                    </h6>
                                    <div className="messageDetails">
                                      <p>hi</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="messageInput">
                                <textarea
                                  type="text"
                                  name=""
                                  className="input"
                                  placeholder="Please enter your message"
                                  defaultValue={""}
                                  rows={2}
                                />
                                <div className="col-12 d-flex justify-content-between align-items-center">
                                  <div className="d-flex">
                                    <button className="clearButton2">
                                      <i className="fa-regular fa-image" />
                                    </button>
                                    <button className="clearButton2">
                                      <i className="fa-solid fa-paperclip" />
                                    </button>
                                    <button className="clearButton2">
                                      <i className="fa-regular fa-face-smile" />
                                    </button>
                                  </div>
                                  <div>
                                    <button
                                      effect="ripple"
                                      className="clearColorButton dark"
                                    >
                                      Send Now{" "}
                                      <i className="fa-solid fa-paper-plane-top" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>}
                        <div className={`"col-lg-${toggleMessages ? "8" : "12"} col-xl-${toggleMessages ? "8" : "12"} col-12"`}>
                          <div className="heading">
                            {/* <h4>
                                                            Conference <span>14:20</span>
                                                        </h4> */}
                            {/* <button className="clearButton">
                                                            <i class="fa-sharp fa-solid fa-circle-plus"></i> Add
                                                            Participant
                                                        </button> */}
                          </div>
                          <div className="videoBody">
                            {notification &&
                              <div className="NotificationBell">
                                <i className="fa-solid fa-bell"></i>
                                <div className="content">
                                  {notificationData}
                                </div>
                              </div>
                            }
                            <div className="participant active ">
                              <div className="participantWrapper">
                                <div className="videoHolder">
                                  <div className="activeGuyName">{selectedConferenceUser?.name === "" ? selectedConferenceUser?.name : name}</div>
                                  {videoCallToggle ?
                                    (
                                      <img alt="" className="videoElement" src="https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/HjH5lgeHeix7kfhup/videoblocks-31_man-successful_4k_rwpcr0ar3_thumbnail-1080_11.png" />
                                    )
                                    :
                                    (
                                      <div className="justify-content-center h-100 d-flex align-items-center text-white fs-1">
                                        <div className="contactViewProfileHolder">
                                          {(selectedConferenceUser?.name === "" ? selectedConferenceUser?.name : name)}
                                        </div>
                                      </div>
                                    )}
                                  <div
                                    className="activeGuyName"
                                    style={{
                                      bottom: "20px",
                                      top: "inherit",
                                      width: "45px",
                                    }}
                                    onClick={() => { callAction(confList.filter((item) => item.isYou)[0]?.deaf ? "undeaf" : "deaf") }}
                                  >
                                    {currentUser?.deaf ? <i class="fa-sharp fa-solid fa-volume-slash"></i> : <i class="fa-sharp fa-solid fa-volume"></i>}

                                  </div>
                                </div>
                                <div className="videoControls">
                                  <button className="appPanelButtonCallerRect" onClick={() => { callAction("tmute") }}>
                                    {currentUser?.mute_detect ? <i class="fa-light fa-microphone-slash"></i> : <i class="fa-light fa-microphone"></i>}
                                  </button>
                                  <button className="appPanelButtonCallerRect">
                                    <i class="fa-light fa-video"></i>
                                  </button>
                                  <button className="appPanelButtonCallerRect">
                                    <i class="fa-sharp fa-light fa-record-vinyl"></i>
                                  </button>
                                  <button
                                    className="appPanelButtonCallerRect"
                                    style={{
                                      fontSize: "14px",
                                      padding: "10px 20px",
                                      backgroundColor: "#e45758",
                                    }}
                                    onClick={() => callAction("hup")}
                                  >
                                    Leave Call
                                  </button>
                                  <button className="appPanelButtonCallerRect">
                                    <i class="fa-light fa-screencast"></i>
                                  </button>
                                  <button className="appPanelButtonCallerRect">
                                    <i class="fa-light fa-chalkboard-user"></i>
                                  </button>
                                  <button className="appPanelButtonCallerRect">
                                    <i class="fa-light fa-hand"></i>
                                  </button>
                                </div>
                                {/* <CallController id={dummySession} memberInfo={confList.filter((item) => item.isYou)} /> */}
                              </div>
                              {/* )} */}
                            </div>
                            <div className="conferenceParticipantsWrapper">
                              {confList.map((item, index) => {
                                return (
                                  <ConferenceUserTab
                                    item={item}
                                    key={index}
                                    index={index}
                                    handleSelectConferenceUser={
                                      handleSelectConferenceUser
                                    }
                                    getInitials={getInitials}
                                  />
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </>
      }
    </div>
  );
};

const ConferenceUserTab = ({
  item,
  index,
  handleSelectConferenceUser,
  getInitials,
}) => {
  const [videoCallToggle] = useState(false);

  // console.log("itemaaaa", item);

  const truncateString = (str, threshold) => {
      if (typeof str !== "string" || typeof threshold !== "number") {
          throw new Error(
              "Invalid input: Provide a string and a numeric threshold."
          );
      }
      return str.length > threshold ? `${str.slice(0, threshold)}...` : str;
  };
  return (
      <>
          <div
              className="participant"
              data-mic={!item.mute_detect}
              //   data-pin="true"
              data-speaker={!(item.deaf)}
              data-speaking={item.talking}
              style={{ cursor: "pointer" }}
              onClick={() => handleSelectConferenceUser(item)}
          >
              {videoCallToggle ? (
                  <div>
                      <img alt="" src="https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/HjH5lgeHeix7kfhup/videoblocks-31_man-successful_4k_rwpcr0ar3_thumbnail-1080_11.png" />
                  </div>
              ) : (
                  <div className="participantWrapper">
                      <div className="justify-content-center h-100 d-flex align-items-center text-dark ">
                          <div className="profileHolder">
                              {/* {getInitials(item.name)} */}
                              <i class="fa-light fa-user"></i>
                          </div>
                      </div>
                      <div>
                          <p className="participantName" style={{ fontSize: "10px" }}>
                              {truncateString(item.name, 15)}
                          </p>
                      </div>
                  </div>
              )}
          </div>
      </>
  );
};

