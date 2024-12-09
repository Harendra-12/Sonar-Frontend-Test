import { useEffect, useRef, useState } from "react";
import { useSessionCall, useSIPProvider } from "react-sipjs";
import MediaPermissions from "./MediaPermissions ";
import AutoAnswer from "./AutoAnswer";
import { generalGetFunction, generalPostFunction } from "../../GlobalFunction/globalFunction";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ContentLoader from "../../Loader/ContentLoader";
import ConferenceVideo from "./ConferenceVideo";

export const ConferenceCall = ({ room_id, extension_id, name, setactivePage, activePage, setConferenceToggle ,conferenceToggle}) => {
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
  const [toggleMessages, setToggleMessages] = useState(true);
  const [participantMiniview, setParticipantMiniview] = useState(true);
  const [participantList, setParticipantList] = useState(true);
  const [selectedConferenceUser, setSelectedConferenceUser] = useState(null);
  const [currentUser, setCurrentUser] = useState([])
  const [notification, setNotification] = useState(false)
  const [notificationData, setNotificationData] = useState("")
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const account = useSelector((state) => state.account);
  const sessions = useSelector((state) => state.sessions);
  const memeber_id = useSelector((state) => state.memberId);
  const [numberOfTimeUserVisit, setNumberOfTimeUserVisit] = useState(0)
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenTogglehit, setScreenTogglehit] = useState(0);

  useEffect(() => {
    if (activePage === "conference") {
      setNumberOfTimeUserVisit(numberOfTimeUserVisit + 1)
    }

  }, [activePage])

  const extension = account?.extension?.extension || "";
  const dispatch = useDispatch();


  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 59) {
          setMinutes((prevMinutes) => {
            if (prevMinutes === 59) {
              setHours((prevHours) => prevHours + 1);
              return 0;
            }
            return prevMinutes + 1;
          });
          return 0;
        }
        return prevSeconds + 1;
      });
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

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
        // if(numberOfTimeUserVisit === 0 && activePage === "conference"){
        startConference()
        // }
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
        if (conferenceData["Channel-Presence-ID"] === extension_id) {
          setCurrentUser((prevState) => ({
            ...prevState,
            id: conferenceData["Member-ID"]
          }));
        }


      } else if (conferenceData.Action === "stop-talking") {
        if (!confList.some(item => item.caller_id_number === conferenceData["Channel-Presence-ID"])) {
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

        if (conferenceData["Channel-Presence-ID"] === extension_id) {
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
        if (!confList.some(item => item.caller_id_number === conferenceData["Channel-Presence-ID"])) {
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

        if (conferenceData["Channel-Presence-ID"] === extension_id) {
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
        if (conferenceData["Channel-Presence-ID"] === extension_id) {
          setCurrentUser((prevState) => ({
            ...prevState,
            id: conferenceData["Member-ID"],
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
        if (conferenceData["Channel-Presence-ID"] === extension_id) {
          setCurrentUser((prevState) => ({
            ...prevState,
            id: conferenceData["Member-ID"],
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
        if (conferenceData["Channel-Presence-ID"] === extension_id) {
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
        if (conferenceData["Channel-Presence-ID"] === extension_id) {
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
        localStorage.removeItem("memberId")
        dispatch({
          type: "SET_MEMBERID",
          memberId: null
        })
        dispatch({
          type: "SET_DUMMYSION",
          dummySession: "",
        });
        setConferenceToggle(false);
        setactivePage("call")
      }
    })
    if (action === "deaf") {
      //    update current user state
      setCurrentUser((prevState) => ({
        ...prevState,
        deaf: true
      }));
    } else if (action === "undeaf") {
      setCurrentUser((prevState) => ({
        ...prevState,
        deaf: false
      }));
    } else if (action === "tmute") {
      setCurrentUser((prevState) => ({
        ...prevState,
        mute_detect: !(currentUser.mute_detect)
      }));
    }
  }

  async function logOut() {
    const apiData = await generalGetFunction("/logout");
    localStorage.clear();
    if (apiData?.data) {
      localStorage.clear();
      dispatch({
        action: "SET_ACCOUNT",
        account: null,
      });
      navigate("/");
    }
  }

  // Store memeber ID in local storage so that we can access it later
  useEffect(() => {
    if (currentUser.id !== "" && currentUser.id !== null && currentUser.id !== undefined) {
      localStorage.setItem("memberId", currentUser?.id);
      dispatch({
        type: "SET_MEMBERID",
        memberId: currentUser?.id
      })
    }

  }, [currentUser.id])

  // Check if there is any previous memeber is present if yes then first hangup it
  useEffect(() => {
    if (memeber_id && room_id !== "") {
      const parsedData = {
        action: "hup",
        room_id: room_id,
        member: String(memeber_id)
      }
      generalPostFunction(`conference/action`, parsedData).then(res => {
        localStorage.removeItem("memberId")
        dispatch({
          type: "SET_MEMBERID",
          memberId: null
        })
      })
    }
  }, [])

  return (
    <div className="profileDropdowns" style={{ top: "55px", right: "-40px", display: activePage !== "conference" ? "none" : "" }}>
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
              className="mainContentApp position-absolute"
              style={{
                top: "0",
                left: "0px",
                // width: "calc(100% - 210px)",
                height: "100%",
                marginRight:
                  sessions.length > 0 && Object.keys(sessions).length > 0
                    ? "250px"
                    : "0",
              }}
            >
              <section>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-12 ps-xl-0">
                      <div className="newHeader">
                        <div className="col-auto" style={{ padding: "0 10px" }}>
                          <h3 style={{ fontFamily: "Outfit", marginBottom: "0" }}>
                            <button class="clearButton text-dark">
                              <i class="fa-solid fa-chevron-left fs-4"></i>
                            </button>{" "}
                            Conference{" "}
                          </h3>
                        </div>
                        <div className="d-flex justify-content-end align-items-center">
                          <div className="col-9">
                            <input
                              type="search"
                              name="Search"
                              placeholder="Search users, groups or chat"
                              class="formItem fw-normal"
                              style={{ backgroundColor: "var(--searchBg)" }}
                            />
                          </div>
                          <div className="col-auto mx-2">
                            <button className="clearButton2 xl" effect="ripple">
                              <i className="fa-regular fa-bell" />
                            </button>
                          </div>
                          <div className="col-auto">
                            <div class="dropdown">
                              <div
                                className="myProfileWidget"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <div class="profileHolder" id="profileOnlineNav">
                                  <img
                                    src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg"
                                    alt="profile"
                                  />
                                </div>
                                <div class="profileName">
                                  {account.username}{" "}
                                  <span className="status">Available</span>
                                </div>
                              </div>
                              <ul class="dropdown-menu" onClick={logOut}>
                                <li>
                                  <div
                                    class="dropdown-item"
                                    style={{ cursor: "pointer" }}
                                  >
                                    Logout
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="videoCallWrapper">
                      <div className="row">
                        {toggleMessages && <div className="col-lg-3 col-xl-3 col-12 p-3">
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
                                <div className="col-12 d-flex justify-content-between align-items-center pt-2">
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
                        <div className={`"col-lg-${toggleMessages ? "9" : "12"} col-xl-${toggleMessages ? "9" : "12"} col-12" px-0`}>
                          <div className="videoBody py-0">
                            {notification &&
                              <div className="NotificationBell">
                                <i className="fa-solid fa-bell"></i>
                                <div className="content">
                                  {notificationData}
                                </div>
                              </div>
                            }
                            <div className="participant active ">
                              <div className="heading">
                                <h4>
                                  Conference <span>{hours === 0 ? "" : `${hours}:`}{minutes}:{seconds}</span>
                                </h4>
                                {/* <button className="clearButton">
                                                            <i class="fa-sharp fa-solid fa-circle-plus"></i> Add
                                                            Participant
                                                        </button> */}
                              </div>
                              <div className="participantWrapper pb-2">
                                <div className="videoHolder">
                                  <div className="activeGuyName">{selectedConferenceUser?.name === "" ? selectedConferenceUser?.name : name}</div>
                                  {dummySession !== ""  ?
                                    (
                                      <ConferenceVideo id={dummySession} setIsScreenSharing={setIsScreenSharing} isScreenSharing={isScreenSharing} screenTogglehit={screenTogglehit} />
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
                                  <button className="appPanelButtonCallerRect" onClick={() => setScreenTogglehit(screenTogglehit+1)}>
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
                                  <button className="appPanelButtonCallerRect" onClick={() => setToggleMessages(!toggleMessages)}>
                                    <i class="fa-light fa-messages"></i>
                                  </button>
                                  <button className="appPanelButtonCallerRect" onClick={() => setParticipantList(!participantList)}>
                                    <i class="fa-light fa-users"></i>
                                  </button>
                                  <button className="appPanelButtonCallerRect">
                                    <i class="fa-light fa-hand"></i>
                                  </button>
                                </div>
                                {/* <CallController id={dummySession} memberInfo={confList.filter((item) => item.isYou)} /> */}
                              </div>
                              {/* )} */}
                            </div>
                            <div className={`conferenceParticipantsWrapper ${participantMiniview ? "" : "hidden"}`}>
                              <div className="py-2 px-3 pe-2">
                                <button onClick={() => setParticipantMiniview(!participantMiniview)} className="clearButton2 xl position-absolute" style={{ left: '-20px', top: '50%', transform: 'translateY(-50%)', zIndex: '9' }}>
                                  <i class={`fa-regular fa-chevron-${participantMiniview ? "right" : "left"}`}></i>
                                </button>

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
                            {participantList && <div className="participantMemberList">
                              <div className="mb-3">
                                <button className="clearButton2 xl ms-auto" onClick={() => setParticipantList(false)}><i class={`fa-regular fa-xmark`}></i></button>
                              </div>
                              <div>
                                <div style={{ color: 'rgb(194, 194, 194)', fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>Meeting Participants (3)</div>
                                <button className="panelButton static">
                                  <span className="text"><i class="fa-solid fa-circle-plus"></i> Add Participant</span>
                                </button>
                              </div>
                              <div class="col-12 mt-3">
                                <input type="search" name="Search" id="headerSearch" placeholder="Search" style={{ backgroundColor: 'transparent', color: '#f5f5f5' }} />
                              </div>
                              <ul>
                                <li>
                                  <div className="d-flex align-items-center">
                                    <div className="profileHolder">
                                      {/* {getInitials(item.name)} */}
                                      <i class="fa-light fa-user"></i>
                                    </div>
                                    <span className="ms-2">Test Name</span>
                                  </div>
                                  <div className="d-flex">
                                    <button className="clearButton2 me-2" style={{ width: '30px', height: '30px', fontSize: '16px' }}><i class="fa-light fa-microphone-slash"></i></button>
                                    <button className="clearButton2" style={{ width: '30px', height: '30px', fontSize: '16px' }}><i class="fa-light fa-camera-slash"></i></button>
                                  </div>
                                </li>
                                <li>
                                  <div className="d-flex align-items-center">
                                    <div className="profileHolder">
                                      {/* {getInitials(item.name)} */}
                                      <i class="fa-light fa-user"></i>
                                    </div>
                                    <span className="ms-2">Test Name</span>
                                  </div>
                                  <div className="d-flex">
                                    <button className="clearButton2 me-2" style={{ width: '30px', height: '30px', fontSize: '16px' }}><i class="fa-light fa-microphone-slash"></i></button>
                                    <button className="clearButton2" style={{ width: '30px', height: '30px', fontSize: '16px' }}><i class="fa-light fa-camera-slash"></i></button>
                                  </div>
                                </li>
                                <li>
                                  <div className="d-flex align-items-center">
                                    <div className="profileHolder">
                                      {/* {getInitials(item.name)} */}
                                      <i class="fa-light fa-user"></i>
                                    </div>
                                    <span className="ms-2">Test Name</span>
                                  </div>
                                  <div className="d-flex">
                                    <button className="clearButton2 me-2" style={{ width: '30px', height: '30px', fontSize: '16px' }}><i class="fa-light fa-microphone-slash"></i></button>
                                    <button className="clearButton2" style={{ width: '30px', height: '30px', fontSize: '16px' }}><i class="fa-light fa-camera-slash"></i></button>
                                  </div>
                                </li>
                              </ul>
                              <div className="position-absolute d-flex" style={{ bottom: 20, right: 10 }}>
                                <button className="toggleButton">Mute All</button>
                                <div className="dropdown contactHeader" type="button" data-bs-toggle="dropdown" aria-expanded="true">
                                  <button className="ms-3 toggleButton"><i class="fa-solid fa-ellipsis"></i></button>
                                  <ul className="dropdown-menu" data-popper-placement="top-end">
                                    <li><a className="dropdown-item">Stop everyone's video</a></li>
                                    <li className="d-block">
                                      <p className="my-0" style={{ padding: '5px 10px', fontSize: '13px' }}>Allow attendees to: </p>
                                      <ul className="my-0">
                                        <li className="dropdown-item d-block"><i className="fa-solid fa-check me-2"></i>Unmute themselves</li>
                                        <li className="dropdown-item d-block"><i className="fa-solid fa-check me-2"></i>Start their video</li>
                                      </ul>
                                    </li>
                                    <li><a className="dropdown-item text-danger">Kick User</a></li>
                                  </ul>
                                </div>
                              </div>
                            </div>}
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

