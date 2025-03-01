/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useSIPProvider } from "modify-react-sipjs";
import MediaPermissions from "./MediaPermissions ";
import AutoAnswer from "./AutoAnswer";
import {
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ConferenceVideo from "./ConferenceVideo";
import ConferenceLoader from "../../Loader/ConferenceLoader";
import ConferenceMessages from "./ConferenceMessages";

export const DummySipRegisteration = ({
  webSocketServer,
  extension,
  password,
  isVideoOn,
}) => {
  const navigate = useNavigate();
  const { sessions: sipSessions, connectAndRegister } = useSIPProvider();
  const { connectStatus } = useSIPProvider();
  const [sipRegisterErrror, setSipRegisterError] = useState(false);
  const dummySession = useSelector((state) => state.dummySession);
  const conferenceScreenShareStatus = useSelector(
    (state) => state.conferenceScreenShareStatus
  );
  const location = useLocation();
  const [conferenceData, setConferenceData] = useState([]);
  const locationState = location.state;
  const [loading, setLoading] = useState(true);
  const [confList, setConfList] = useState([]);
  const [toggleMessages, setToggleMessages] = useState(false);
  const [participantMiniview, setParticipantMiniview] = useState(true);
  const [participantList, setParticipantList] = useState(false);
  const [selectedConferenceUser, setSelectedConferenceUser] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const dispatch = useDispatch();
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenTogglehit, setScreenTogglehit] = useState(0);
  const [newMessage, setNewMessage] = useState(false);
  const conferenceMessage = useSelector((state) => state.conferenceMessage);
  useEffect(() => {
    if (toggleMessages) {
      setNewMessage(false);
    } else {
      setNewMessage(true);
    }

  }, [conferenceMessage]);
  const sendMessage = (data) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data)); // Send JSON data
      console.log("Message sent:", data);
    } else {
      console.warn("WebSocket is not open. Unable to send message.");
    }
  };
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
  const [currentUser, setCurrentUser] = useState({
    id: "",
    caller_id_number: `${locationState.state.extension}@${locationState.state.domainName}`,
    name: locationState.state.name,
    uuid: "item.uuid",
    talking: true,
    mute_detect: false,
    hold: false,
    isYou: true,
    deaf: false,
  });
  const [notification, setNotification] = useState(false);
  const [notificationData, setNotificationData] = useState("");

  // Default select the current user
  useEffect(() => {
    setSelectedConferenceUser(currentUser);
  }, [currentUser]);
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
    setSelectedConferenceUser(confList.filter((item) => item.isYou)[0]);
  }, [loading]);

  // SIP Registration for the guest user
  useEffect(() => {
    const wsUrl = webSocketServer;
    const checkWebSocket = () => {
      return new Promise((resolve, reject) => {
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          // console.log("WebSocket connection successful.");
          ws.close();
          resolve(true);
        };
        // ws.onmessage = (event) => {
        //   console.log("Message received:", event);
        //   const data = JSON.parse(event.data); // Assuming server sends a JSON string
        //   // setReceivedMessage(data); // Store the received message in state
        //   // const parsedData = JSON.parse(event.data);
        //   if (typeof data === "string") {
        //     const message = JSON.parse(data);
        //     const { key, result } = message;
        //     console.log(key, result);
        //     // Handle specific message types if necessary
        //     if (key === "screenShare") {
        //       dispatch({
        //         type: "SET_CONFERENCESCREENSHARESTATUS",
        //         conferenceScreenShareStatus: result,
        //       });
        //     }
        //   }
        // };

        ws.onerror = (error) => {
          console.error("WebSocket connection failed:", error);
          reject(false);
        };
      });
    };
    const registerUser = async () => {
      try {
        const isWebSocketWorking = await checkWebSocket();
        if (isWebSocketWorking) {
          connectAndRegister({
            username: extension,
            password: password,
          });
        }
      } catch (error) {
        console.error(
          "Error during WebSocket check or SIP registration:",
          error
        );
        setSipRegisterError(true);
      }
    };
    if (extension && password) {
      registerUser();
    } else {
      console.error("Missing extension or password");
    }
  }, [webSocketServer, extension, password, connectAndRegister]);

  // First check weather user is registered with sip then call start conference and conference listing api
  useEffect(() => {
    setTimeout(() => {
      if (connectStatus === "WAIT_REQUEST_CONNECT") {
        setLoading(true);
      } else if (sipRegisterErrror) {
        toast.error("Not connected with server please try again later.");
        navigate(-1);
      } else if (connectStatus === "CONNECTED") {
        async function startConference() {
          const response = await generalPostFunction("/conference/start", {
            id: locationState.state.extension_id,
            name: locationState.state.name,
            is_guest: 1,
            pin: locationState.pin,
            roomId: locationState.state.room_id,
          });

          if (response.status) {
            setLoading(false);
            const confLists = await generalGetFunction(
              `/conference/${locationState.state.room_id}/details`
            );
            // console.log(locationState, "confListsss", JSON?.parse?.(confLists?.data));

            if (
              confLists.status &&
              confLists?.data !==
              `-ERR Conference ${locationState.state.room_id} not found\n`
            ) {
              setConfList(
                JSON?.parse?.(confLists?.data)
                  ?.filter(
                    (item) =>
                      item.conference_name == locationState.state.room_id
                  )?.[0]
                  ?.members.map((item) => {
                    return {
                      id: item.id,
                      caller_id_number: item.caller_id_number,
                      name: item.caller_id_name,
                      uuid: item.uuid,
                      talking: item.flags.talking,
                      mute_detect: item.flags.mute_detect,
                      hold: item.flags.hold,
                      isModerator: item.flags.is_moderator,
                      isYou:
                        item.caller_id_name === locationState.state.name
                          ? true
                          : false,
                      deaf: false,
                    };
                  })
              );
            }
          }
        }
        startConference();
      } else {
        toast.error("Not connected with server please try again later.");
        navigate(-1);
      }
    }, [3000]);
  }, [connectStatus, sipRegisterErrror]);

  // Monitor incoming SIP sessions
  const incomingSessionsArray = Object.keys(sipSessions).filter(
    (id) =>
      sipSessions[id].state === "Initial" &&
      sipSessions[id].logger.category === "sip.Invitation"
  );

  // Setup websocket for guest user to get real time information about other members
  // const ip = "ucaas.webvio.in";
  // const port = "8443";
  const ip = process.env.REACT_APP_BACKEND_IP;

  const port = process.env.REACT_APP_BACKEND_SOCKET_PORT;
  // const token = localStorage.getItem("token");
  const socketRef = useRef(null);
  useEffect(() => {
    var reconnectValue = 0;
    const connectWebSocket = () => {
      const socket = new WebSocket(`wss://${ip}:${port}?type=admin`);

      socket.onopen = () => {
        // console.log("WebSocket connection successful.");
      };
      socket.onmessage = (event) => {
        // console.log(JSON.parse(event.data));
        if (typeof JSON.parse(event.data) === "string") {
          if (JSON.parse(JSON.parse(event.data))["key"] === "Conference") {
            // console.log("Conference Data", JSON.parse(JSON.parse(event.data))["result"]);

            setConferenceData(
              JSON.parse(JSON.parse(event.data))["result"]["Conference-Name"] ==
              locationState.state.room_id &&
              JSON.parse(JSON.parse(event.data))["result"]
            );
          } else if (
            JSON.parse(JSON.parse(event.data))["key"] === "screenShare"
          ) {
            dispatch({
              type: "SET_CONFERENCESCREENSHARESTATUS",
              conferenceScreenShareStatus: JSON.parse(JSON.parse(event.data))[
                "result"
              ],
            });
          } else if (
            JSON.parse(JSON.parse(event.data))["key"] === "conferenceMessage"
          ) {
            if (
              JSON.parse(JSON.parse(event.data))["result"]["room_id"] == locationState.state.room_id) {
              // Store conference message as an object with previous data
              dispatch({
                type: "SET_CONFERENCEMESSAGE",
                conferenceMessage: JSON.parse(JSON.parse(event.data))["result"]
              })
            }
            console.log("Conference Message", JSON.parse(JSON.parse(event.data))["result"]["room_id"], locationState.state.room_id);

          }
        } else {
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      socket.onclose = () => {
        // console.log("WebSocket connection closed. Reconnecting...");
        if (reconnectValue < 5) {
          reconnectValue = reconnectValue + 1;
          setTimeout(connectWebSocket, 5000); // Retry after 3 seconds
        }
      };

      socketRef.current = socket;
    };

    if (dummySession) {
      connectWebSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [dummySession]);

  // Monitor incoming data from web socket accound to its action type
  useEffect(() => {
    if (conferenceData) {
      // Check if conferencedata.calleridname is previously present in conflist
      if (
        conferenceData.Action === "add-member" &&
        !confList.some(
          (item) =>
            item.caller_id_number === conferenceData["Channel-Presence-ID"]
        )
      ) {
        setNotification(false);
        setNotification(true);
        setNotificationData(
          `${conferenceData["Caller-Caller-ID-Name"]} joined the conference`
        );
        setTimeout(() => {
          setNotification(false);
        }, [3000]);
        console.log("conferenceData", conferenceData);

        setConfList((prevList) => [
          ...prevList,
          {
            id: conferenceData["Member-ID"],
            name: conferenceData["Caller-Caller-ID-Name"],
            caller_id_number: conferenceData["Channel-Presence-ID"],
            uuid: conferenceData["Core-UUID"],
            talking: conferenceData["Talking"],
            mute_detect:
              conferenceData["Mute-Detect"] === "true" ? true : false,
            hold: conferenceData["Hold"],
            isYou:
              conferenceData["Caller-Caller-ID-Name"] ===
                locationState.state.name
                ? true
                : false,
            deaf: false,
            isModerator:
              conferenceData["Member-Type"] === "member" ? false : true,
          },
        ]);

        // Here i want to change the id on current user
        if (
          conferenceData["Channel-Presence-ID"] ===
          `${locationState.state.extension}@${locationState.state.domainName}`
        ) {
          setCurrentUser((prevState) => ({
            ...prevState,
            id: conferenceData["Member-ID"],
            isModerator:
              conferenceData["Member-Type"] === "member" ? false : true,
          }));
        }
      } else if (conferenceData.Action === "stop-talking") {
        if (
          !confList.some(
            (item) =>
              item.caller_id_number === conferenceData["Channel-Presence-ID"]
          )
        ) {
          setConfList((prevList) => [
            ...prevList,
            {
              id: conferenceData["Member-ID"],
              name: conferenceData["Caller-Caller-ID-Name"],
              caller_id_number: conferenceData["Channel-Presence-ID"],
              uuid: conferenceData["Core-UUID"],
              talking: conferenceData["Talking"],
              mute_detect:
                conferenceData["Mute-Detect"] === "true" ? true : false,
              hold: conferenceData["Hold"],
              isYou:
                conferenceData["Caller-Caller-ID-Name"] ===
                  locationState.state.name
                  ? true
                  : false,
              deaf: false,
              isModerator:
                conferenceData["Member-Type"] === "member" ? false : true,
            },
          ]);
        }

        if (
          conferenceData["Channel-Presence-ID"] ===
          `${locationState.state.extension}@${locationState.state.domainName}`
        ) {
          setCurrentUser((prevState) => ({
            ...prevState,
            id: conferenceData["Member-ID"],
            isModerator:
              conferenceData["Member-Type"] === "member" ? false : true,
          }));
        }
        // Update the list with the updated values
        setConfList((prevList) =>
          prevList.map((item) => {
            if (
              item.caller_id_number === conferenceData["Channel-Presence-ID"]
            ) {
              return {
                ...item,
                talking: false,
              };
            }
            return item;
          })
        );
      } else if (conferenceData.Action === "start-talking") {
        if (
          !confList.some(
            (item) =>
              item.caller_id_number === conferenceData["Channel-Presence-ID"]
          )
        ) {
          setConfList((prevList) => [
            ...prevList,
            {
              id: conferenceData["Member-ID"],
              name: conferenceData["Caller-Caller-ID-Name"],
              caller_id_number: conferenceData["Channel-Presence-ID"],
              uuid: conferenceData["Core-UUID"],
              talking: conferenceData["Talking"],
              mute_detect:
                conferenceData["Mute-Detect"] === "true" ? true : false,
              hold: conferenceData["Hold"],
              isYou:
                conferenceData["Caller-Caller-ID-Name"] ===
                  locationState.state.name
                  ? true
                  : false,
              deaf: false,
              isModerator:
                conferenceData["Member-Type"] === "member" ? false : true,
            },
          ]);
        }

        if (
          conferenceData["Channel-Presence-ID"] ===
          `${locationState.state.extension}@${locationState.state.domainName}`
        ) {
          setCurrentUser((prevState) => ({
            ...prevState,
            id: conferenceData["Member-ID"],
            isModerator:
              conferenceData["Member-Type"] === "member" ? false : true,
          }));
        }
        // Update the list with the updated values
        setConfList((prevList) =>
          prevList.map((item) => {
            if (
              item.caller_id_number === conferenceData["Channel-Presence-ID"]
            ) {
              return {
                ...item,
                talking: true,
              };
            }
            return item;
          })
        );
      } else if (conferenceData.Action === "mute-member") {
        // Update the list with the updated values
        setConfList((prevList) =>
          prevList.map((item) => {
            if (
              item.caller_id_number === conferenceData["Channel-Presence-ID"]
            ) {
              return {
                ...item,
                mute_detect: true,
                talking: false,
              };
            }
            return item;
          })
        );
        if (
          conferenceData["Channel-Presence-ID"] ===
          `${locationState.state.extension}@${locationState.state.domainName}`
        ) {
          setCurrentUser((prevState) => ({
            ...prevState,
            id: conferenceData["Member-ID"],
            mute_detect: true,
            isModerator:
              conferenceData["Member-Type"] === "member" ? false : true,
          }));
        }
      } else if (conferenceData.Action === "unmute-member") {
        // Update the list with the updated values
        setConfList((prevList) =>
          prevList.map((item) => {
            if (
              item.caller_id_number === conferenceData["Channel-Presence-ID"]
            ) {
              return {
                ...item,
                mute_detect: false,
              };
            }
            return item;
          })
        );
        if (
          conferenceData["Channel-Presence-ID"] ===
          `${locationState.state.extension}@${locationState.state.domainName}`
        ) {
          setCurrentUser((prevState) => ({
            ...prevState,
            id: conferenceData["Member-ID"],
            mute_detect: false,
            isModerator:
              conferenceData["Member-Type"] === "member" ? false : true,
          }));
        }
      } else if (conferenceData.Action === "deaf-member") {
        // Update the list with the updated values
        setConfList((prevList) =>
          prevList.map((item) => {
            if (
              item.caller_id_number === conferenceData["Channel-Presence-ID"]
            ) {
              return {
                ...item,
                deaf: true,
              };
            }
            return item;
          })
        );
        if (
          conferenceData["Channel-Presence-ID"] ===
          `${locationState.state.extension}@${locationState.state.domainName}`
        ) {
          setCurrentUser((prevState) => ({
            ...prevState,
            id: conferenceData["Member-ID"],
            isModerator:
              conferenceData["Member-Type"] === "member" ? false : true,
          }));
        }
      } else if (conferenceData.Action === "undeaf-member") {
        // Update the list with the updated values
        setConfList((prevList) =>
          prevList.map((item) => {
            if (
              item.caller_id_number === conferenceData["Channel-Presence-ID"]
            ) {
              return {
                ...item,
                deaf: false,
              };
            }
            return item;
          })
        );
        if (
          conferenceData["Channel-Presence-ID"] ===
          `${locationState.state.extension}@${locationState.state.domainName}`
        ) {
          setCurrentUser((prevState) => ({
            ...prevState,
            id: conferenceData["Member-ID"],
            isModerator:
              conferenceData["Member-Type"] === "member" ? false : true,
          }));
        }
      } else if (
        conferenceData.Action === "del-member" ||
        conferenceData.Action === "hup-member"
      ) {
        if (
          currentUser.caller_id_number === conferenceData["Channel-Presence-ID"]
        ) {
          navigate(-1);
        }
        setNotification(false);
        setNotification(true);
        setNotificationData(
          `${conferenceData["Caller-Caller-ID-Name"]} has left the conference`
        );
        setTimeout(() => {
          setNotification(false);
        }, [3000]);
        setConfList((prevList) => {
          const index = prevList.findIndex(
            (item) =>
              item.caller_id_number === conferenceData["Channel-Presence-ID"]
          );
          if (index !== -1) {
            const newList = [...prevList];
            newList.splice(index, 1);
            return newList;
          }
          return prevList; // Return the original list if no match is found
        });
      } else {
        // console.log("conferenceData", conferenceData);
      }
    }
  }, [conferenceData]);

  // Handle calling action for current user
  async function callAction(action) {
    const parsedData = {
      action: action,
      room_id: locationState.state.room_id,
      member: String(currentUser?.id),
    };
    generalPostFunction(`conference/action`, parsedData).then((res) => {
      if (res.status && action === "hup") {
        navigate(-1);
      }
    });
    if (action === "deaf") {
      //    update current user state
      setCurrentUser((prevState) => ({
        ...prevState,
        deaf: true,
      }));
    } else if (action === "undeaf") {
      setCurrentUser((prevState) => ({
        ...prevState,
        deaf: false,
      }));
    } else if (action === "tmute") {
      setCurrentUser((prevState) => ({
        ...prevState,
        mute_detect: !currentUser.mute_detect,
      }));
    }
  }

  // adding logic to update currengt user memeber id to localstorage on page reload
  useEffect(() => {
    if (currentUser) {
      if (currentUser.id !== "") {
        localStorage.setItem("memberId", currentUser.id);
      }
    }
  }, [currentUser, currentUser?.id]);

  // Check for memeber id and hangup the call
  useEffect(() => {
    const parsedData = {
      action: "hup",
      room_id: locationState.state.room_id,
      member: String(localStorage.getItem("memberId")),
    };
    if (localStorage.getItem("memberId")) {
      generalPostFunction(`conference/action`, parsedData);
    }
    // console.log("local data", localStorage.getItem("memberId"));
  }, []);

  // Handle moderator action
  async function moderatorAction(action, id) {
    const parsedData = {
      action: action,
      room_id: locationState.state.room_id,
      member: String(id),
    };
    generalPostFunction(`conference/action`, parsedData);
  }
  // console.log("Current User", currentUser);

  // Set name of current user when he joins the conference
  useEffect(() => {
    if (currentUser.id !== "") {
      const parsedData = {
        action: "vid-banner",
        room_id: locationState.state.room_id,
        member: `${String(currentUser?.id)} '${currentUser?.name}'`,
      };
      generalPostFunction(`conference/action`, parsedData);
    }
  }, [currentUser.id]);
  return (
    <div className="profileDropdowns" style={{ top: "55px", right: "-40px" }}>
      <MediaPermissions />
      {incomingSessionsArray.map((item, index) => {
        return <AutoAnswer id={item} isVideoOn={isVideoOn} />;
      })}
      {loading ? (
        <ConferenceLoader />
      ) : (
        dummySession && (
          <>
            <main className="mainContentApp mx-0">
              <section>
                <div className="container-fluid">
                  <div className="row">
                    <div
                      className="videoCallWrapper"
                      style={{ height: "100vh" }}
                    >
                      <div className="row">
                        {/* {toggleMessages && ( */}
                        <div
                          // className="col-xl-4 col-xxl-3 col-12 my-auto"
                          className="col-auto my-auto position-relative"
                        >
                          {/* {toggleMessages &&
                            <>
                              <button className="clearButton2 xl position-absolute"
                                style={{ right: '-30px', top: '50%', transform: 'translateY(-50%)', zIndex: '9' }}
                                onClick={() => setToggleMessages(false)}
                              >
                                <i className="fa-regular fa-chevron-left"></i>
                              </button>
                            </>
                          } */}
                          <ConferenceMessages
                            sendMessage={sendMessage}
                            conferenceId={locationState.state.room_id}
                            userName={currentUser?.name}
                            toggleMessages={toggleMessages}
                            setToggleMessages={setToggleMessages}
                          />
                        </div>
                        {/* )} */}
                        <div
                          // className={`col-xl-${toggleMessages ? '8' : '12'} col-xxl-${toggleMessages ? '9' : '12'} col-12 px-0`}
                          className="col px-0"
                        >
                          <div
                            className="videoBody py-0"
                            style={{ height: "100vh" }}
                          >
                            {notification && (
                              <div className="NotificationBell">
                                <i className="fa-solid fa-bell"></i>
                                <div className="content">
                                  {notificationData}
                                </div>
                              </div>
                            )}
                            <div className="participant active ">
                              <div className="heading">
                                <h4>
                                  Conference{" "}
                                  <span>
                                    {hours === 0 ? "" : `${hours}:`}
                                    {minutes}:{seconds}
                                  </span>
                                </h4>
                                {/* <button className="clearButton">
                                                            <i class="fa-sharp fa-solid fa-circle-plus"></i> Add
                                                            Participant
                                                        </button> */}
                              </div>
                              <div className="participantWrapper pb-2">
                                <div className="videoHolder">
                                  <div className="activeGuyName">
                                    {conferenceScreenShareStatus?.sharedMessage ==
                                      true
                                      ? conferenceScreenShareStatus.user
                                      : selectedConferenceUser?.name !== ""
                                        ? selectedConferenceUser?.name
                                        : currentUser?.name}
                                    {/* {locationState?.name} */}
                                  </div>
                                  {dummySession !== "" ? (
                                    // &&
                                    // conferenceScreenShareStatus?.shareStatus ==
                                    //   true
                                    //same login as
                                    <ConferenceVideo
                                      currentUser={currentUser}
                                      conferenceId={locationState.state.room_id}
                                      id={dummySession}
                                      setIsScreenSharing={setIsScreenSharing}
                                      isScreenSharing={isScreenSharing}
                                      screenTogglehit={screenTogglehit}
                                      isVideoOn={isVideoOn}
                                      userName={currentUser?.name}
                                      sendMessage={sendMessage}
                                    />
                                  ) : (
                                    <div className="justify-content-center h-100 d-flex align-items-center text-white fs-1">
                                      <div className="contactViewProfileHolder">
                                        {conferenceScreenShareStatus?.sharedMessage ==
                                          true
                                          ? conferenceScreenShareStatus?.user
                                          : selectedConferenceUser?.name !== ""
                                            ? selectedConferenceUser?.name
                                            : currentUser?.name}
                                      </div>
                                    </div>
                                  )}
                                  {/* {videoCallToggle ? (
                                    <img
                                      alt=""
                                      className="videoElement"
                                      src="https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/HjH5lgeHeix7kfhup/videoblocks-31_man-successful_4k_rwpcr0ar3_thumbnail-1080_11.png"
                                    />
                                  ) : (
                                    <div className="justify-content-center h-100 d-flex align-items-center text-white fs-1">
                                      <div className="contactViewProfileHolder">
                                        {selectedConferenceUser?.name === ""
                                          ? selectedConferenceUser?.name
                                          : locationState?.name}
                                      </div>
                                    </div>
                                  )} */}
                                  <div
                                    className="activeGuyName"
                                    style={{
                                      bottom: "20px",
                                      top: "inherit",
                                      width: "45px",
                                    }}
                                    onClick={() => {
                                      callAction(
                                        confList.filter((item) => item.isYou)[0]
                                          ?.deaf
                                          ? "undeaf"
                                          : "deaf"
                                      );
                                    }}
                                  >
                                    {currentUser?.deaf ? (
                                      <i class="fa-sharp fa-solid fa-volume-slash"></i>
                                    ) : (
                                      <i class="fa-sharp fa-solid fa-volume"></i>
                                    )}
                                  </div>
                                </div>
                                <div className="videoControls">
                                  <button
                                    className={
                                      currentUser?.mute_detect
                                        ? "appPanelButtonCallerRect active"
                                        : "appPanelButtonCallerRect"
                                    }
                                    onClick={() => {
                                      callAction("tmute");
                                    }}
                                  >
                                    {currentUser?.mute_detect ? (
                                      <i class="fa-light fa-microphone-slash"></i>
                                    ) : (
                                      <i class="fa-light fa-microphone"></i>
                                    )}
                                  </button>
                                  <button className="appPanelButtonCallerRect">
                                    <i class="fa-light fa-video"></i>
                                  </button>
                                  {/* <button
                                    className="appPanelButtonCallerRect"
                                    onClick={() =>
                                      setScreenTogglehit(screenTogglehit + 1)
                                    }
                                  >
                                    <i class="fa-sharp fa-light fa-screencast"></i>
                                  </button> */}
                                  {isScreenSharing ? (
                                    <button
                                      className="appPanelButtonCallerRect gap-2"
                                      onClick={() =>
                                        setScreenTogglehit(screenTogglehit + 1)
                                      }
                                    >
                                      <i class="fa-sharp fa-light fa-screencast"></i>

                                      <i className="text-danger fas fa-dot-circle"></i>
                                    </button>
                                  ) : (
                                    <button
                                      className="appPanelButtonCallerRect"
                                      onClick={() =>
                                        setScreenTogglehit(screenTogglehit + 1)
                                      }
                                    >
                                      <i class="fa-sharp fa-light fa-screencast"></i>
                                    </button>
                                  )}
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
                                  <button
                                    className={
                                      toggleMessages
                                        ? "appPanelButtonCallerRect active"
                                        : newMessage ? "appPanelButtonCallerRect notif" : "appPanelButtonCallerRect"
                                    }
                                    onClick={() => {
                                      setToggleMessages(!toggleMessages);
                                      setNewMessage(false);
                                    }
                                    }
                                  >
                                    <i class="fa-light fa-messages"></i>
                                  </button>
                                  <button
                                    className={
                                      participantList
                                        ? "appPanelButtonCallerRect active"
                                        : "appPanelButtonCallerRect"
                                    }
                                    onClick={() =>
                                      setParticipantList(!participantList)
                                    }
                                  >
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
                            <div
                              className={`conferenceParticipantsWrapper ${participantMiniview ? "" : "hidden"
                                }`}
                            >
                              <div className="py-2 px-3 pe-2">
                                <button
                                  onClick={() =>
                                    setParticipantMiniview(!participantMiniview)
                                  }
                                  className="clearButton2 xl position-absolute"
                                  style={{
                                    left: "-20px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    zIndex: "9",
                                  }}
                                >
                                  <i
                                    class={`fa-regular fa-chevron-${participantMiniview ? "right" : "left"
                                      }`}
                                  ></i>
                                </button>
                                <div className="noScrollbar" style={{ height: '100vh', overflowY: 'auto', paddingLeft: '10px' }}>
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
                            {participantList && (
                              <div className="participantMemberList">
                                <div className="mb-3">
                                  <button
                                    className="clearButton2 xl ms-auto"
                                    onClick={() => setParticipantList(false)}
                                  >
                                    <i class={`fa-regular fa-xmark`}></i>
                                  </button>
                                </div>
                                <div>
                                  <div
                                    style={{
                                      color: "rgb(194, 194, 194)",
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      marginBottom: "16px",
                                    }}
                                  >
                                    Meeting Participants ({confList.length})
                                  </div>
                                  {/* <button className="panelButton static">
                                    <span className="text">
                                      <i class="fa-solid fa-circle-plus"></i>{" "}
                                      Add Participant
                                    </span>
                                  </button> */}
                                </div>
                                <div class="col-12 mt-3">
                                  <input
                                    type="search"
                                    name="Search"
                                    id="headerSearch"
                                    placeholder="Search"
                                    style={{
                                      backgroundColor: "transparent",
                                      color: "#f5f5f5",
                                    }}
                                  />
                                </div>
                                <ul className="noScrollbar">
                                  {confList.map((item, index) => {
                                    return (
                                      <li>
                                        <div className="d-flex align-items-center">
                                          <div className="profileHolder">
                                            {/* {getInitials(item.name)} */}
                                            <i class="fa-light fa-user"></i>
                                          </div>
                                          <span className="ms-2">
                                            {item.name}
                                          </span>
                                        </div>
                                        <div className="d-flex">
                                          <button
                                            onClick={() => {
                                              if (currentUser.isModerator) {
                                                moderatorAction(
                                                  "tmute",
                                                  item.id
                                                );
                                              }
                                            }}
                                            disabled={!currentUser.isModerator}
                                            className="clearButton2 me-2"
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              fontSize: "16px",
                                            }}
                                          >
                                            <i
                                              class={
                                                !item.mute_detect
                                                  ? "fa-light fa-microphone"
                                                  : "fa-light fa-microphone-slash"
                                              }
                                            ></i>
                                          </button>
                                          <button
                                            onClick={() => {
                                              if (currentUser.isModerator) {
                                                moderatorAction(
                                                  "kick",
                                                  item.id
                                                );
                                              }
                                            }}
                                            disabled={!currentUser.isModerator}
                                            className="clearButton2 danger"
                                            style={{
                                              width: "30px",
                                              height: "30px",
                                              fontSize: "16px",
                                            }}
                                          >
                                            <i class="fa-light fa-user-minus"></i>
                                          </button>
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                                <div
                                  className="position-absolute d-flex"
                                  style={{ bottom: 20, right: 10 }}
                                >
                                  <button className="toggleButton">
                                    Mute All
                                  </button>
                                  <div
                                    className="dropdown contactHeader"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="true"
                                  >
                                    <button className="ms-3 toggleButton">
                                      <i class="fa-solid fa-ellipsis"></i>
                                    </button>
                                    <ul
                                      className="dropdown-menu"
                                      data-popper-placement="top-end"
                                    >
                                      <li>
                                        <div className="dropdown-item">
                                          Stop everyone's video
                                        </div>
                                      </li>
                                      <li className="d-block">
                                        <p
                                          className="my-0"
                                          style={{
                                            padding: "5px 10px",
                                            fontSize: "13px",
                                          }}
                                        >
                                          Allow attendees to:{" "}
                                        </p>
                                        <ul className="my-0">
                                          <li className="dropdown-item d-block">
                                            <i className="fa-solid fa-check me-2"></i>
                                            Unmute themselves
                                          </li>
                                          <li className="dropdown-item d-block">
                                            <i className="fa-solid fa-check me-2"></i>
                                            Start their video
                                          </li>
                                        </ul>
                                      </li>
                                      <li>
                                        <div className="dropdown-item text-danger">
                                          Kick User
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </>
        )
      )}
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
        data-speaker={!item.deaf}
        data-speaking={item.talking}
        style={{ cursor: "pointer" }}
        onClick={() => handleSelectConferenceUser(item)}
      >
        {videoCallToggle ? (
          <div>
            <img
              alt=""
              src="https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/HjH5lgeHeix7kfhup/videoblocks-31_man-successful_4k_rwpcr0ar3_thumbnail-1080_11.png"
            />
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
