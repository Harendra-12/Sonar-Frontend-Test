import { useEffect, useRef, useState } from "react";
import { useSIPProvider } from "react-sipjs";
import MediaPermissions from "./MediaPermissions ";
import AutoAnswer from "./AutoAnswer";
import { generalGetFunction, generalPostFunction } from "../../GlobalFunction/globalFunction";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ContentLoader from "../../Loader/ContentLoader";

export const DummySipRegisteration = ({ webSocketServer, extension, password }) => {
    const navigate = useNavigate();
    const { sessions: sipSessions, connectAndRegister } = useSIPProvider();
    const { connectStatus, registerStatus } = useSIPProvider();
    const [sipRegisterErrror, setSipRegisterError] = useState(false);
    const dummySession = useSelector((state) => state.dummySession);
    const location = useLocation();
    const [conferenceData, setConferenceData] = useState([])
    const locationState = location.state;
    const [loading, setLoading] = useState(true);
    const [confList, setConfList] = useState([])
    const [videoCallToggle, setVideoCallToggle] = useState(false);
    const [toggleMessages, setToggleMessages] = useState(false);
    const [selectedConferenceUser, setSelectedConferenceUser] = useState(null);
    const [currentUser, setCurrentUser] = useState([])
    const [notification, setNotification] = useState(false)
    const [notificationData, setNotificationData] = useState("")

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

    // SIP Registration for the guest user
    useEffect(() => {
        const wsUrl = webSocketServer;
        const checkWebSocket = () => {
            return new Promise((resolve, reject) => {
                const ws = new WebSocket(wsUrl);

                ws.onopen = () => {
                    console.log("WebSocket connection successful.");
                    ws.close();
                    resolve(true);
                };

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
                setLoading(true)
            }
            else if (sipRegisterErrror) {
                toast.error("Not connected with server please try again later.");
                navigate(-1)
            } else if (connectStatus === "CONNECTED") {
                async function startConference() {
                    const response = await generalPostFunction("/conference/start", { id: locationState.extension_id, name: locationState.name })

                    if (response.status) {
                        setLoading(false)
                        const confLists = await generalGetFunction(`/conference/${locationState.room_id}/details`)
                        // console.log("confList", JSON?.parse?.(confLists?.data));

                        if (confLists.status && confLists?.data !== `-ERR Conference ${locationState.room_id} not found\n`) {
                            setConfList(JSON?.parse?.(confLists?.data)?.filter((item) => item.conference_name == locationState.room_id)?.[0]?.members.map((item) => {
                                return (
                                    {
                                        id: item.id,
                                        caller_id_number: item.caller_id_number,
                                        name: item.caller_id_name,
                                        uuid: item.uuid,
                                        talking: item.flags.talking,
                                        mute_detect: item.flags.mute_detect,
                                        hold: item.flags.hold,
                                        isYou: item.caller_id_name === locationState.name ? true : false,
                                        deaf: false
                                    }
                                )
                            }))
                            if (locationState.name) {
                                setCurrentUser(JSON?.parse?.(confLists?.data)?.filter((item) => item.conference_name == locationState.room_id)?.[0]?.members.map((item) => {
                                    return (
                                        {
                                            id: item.id,
                                            caller_id_number: item.caller_id_number,
                                            name: item.caller_id_name,
                                            uuid: item.uuid,
                                            talking: item.flags.talking,
                                            mute_detect: item.flags.mute_detect,
                                            hold: item.flags.hold,
                                            isYou: item.caller_id_name === locationState.name ? true : false,
                                            deaf: false
                                        }
                                    )
                                }))
                            }
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

    // Setup websocket for guest user to get real time information about other members
    const ip = "ucaas.webvio.in";
    const port = "8443";
    // const token = localStorage.getItem("token");
    const socketRef = useRef(null);
    useEffect(() => {
        var reconnectValue = 0;
        const connectWebSocket = () => {
            const socket = new WebSocket(`wss://${ip}:${port}?type=admin`);

            socket.onopen = () => {
                console.log("WebSocket connection successful.");
            };
            socket.onmessage = (event) => {
                // console.log(JSON.parse(event.data));
                if (typeof JSON.parse(event.data) === "string") {
                    if (
                        JSON.parse(JSON.parse(event.data))["key"] === "Conference"
                    ) {
                        console.log("Conference Data", JSON.parse(JSON.parse(event.data))["result"]);

                        setConferenceData(JSON.parse(JSON.parse(event.data))["result"]["Conference-Name"] == locationState.room_id && JSON.parse(JSON.parse(event.data))["result"]);
                    }
                } else {
                }
            };

            socket.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
            socket.onclose = () => {
                console.log("WebSocket connection closed. Reconnecting...");
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
            if (conferenceData.Action === "add-member" && !confList.some(item => item.caller_id_number === conferenceData["Caller-Caller-ID-Number"])) {
                setNotification(false)
                setNotification(true)
                setNotificationData(`${conferenceData["Caller-Caller-ID-Name"]} joined the conference`);
                setTimeout(() => {
                    setNotification(false)
                }, [3000])
                setConfList(prevList => [...prevList, {
                    id: conferenceData["Member-ID"],
                    name: conferenceData["Caller-Caller-ID-Name"],
                    caller_id_number: conferenceData["Caller-Caller-ID-Number"],
                    uuid: conferenceData["Core-UUID"],
                    talking: conferenceData["Talking"],
                    mute_detect: conferenceData["Mute-Detect"],
                    hold: conferenceData["Hold"],
                    isYou: conferenceData["Caller-Caller-ID-Name"] === locationState.name ? true : false,
                    deaf: false
                }]);
                if (conferenceData["Caller-Caller-ID-Name"] === locationState.name) {
                    setCurrentUser(prevList => [...prevList, {
                        id: conferenceData["Member-ID"],
                        name: conferenceData["Caller-Caller-ID-Name"],
                        caller_id_number: conferenceData["Caller-Caller-ID-Number"],
                        uuid: conferenceData["Core-UUID"],
                        talking: conferenceData["Talking"],
                        mute_detect: conferenceData["Mute-Detect"],
                        hold: conferenceData["Hold"],
                        isYou: conferenceData["Caller-Caller-ID-Name"] === locationState.name ? true : false,
                        deaf: false
                    }])
                }
            } else if (conferenceData.Action === "stop-talking") {
                // Update the list with the updated values
                setConfList(prevList => prevList.map(item => {
                    if (item.caller_id_number === conferenceData["Caller-Caller-ID-Number"]) {
                        return {
                            ...item,
                            talking: false,
                        };
                    }
                    return item;
                }));
                setCurrentUser(prevList => prevList.map(item => {
                    if (item.caller_id_number === conferenceData["Caller-Caller-ID-Number"]) {
                        return {
                            ...item,
                            talking: false,
                        };
                    }
                    return item;
                }));
            } else if (conferenceData.Action === "start-talking") {
                // Update the list with the updated values
                setConfList(prevList => prevList.map(item => {
                    if (item.caller_id_number === conferenceData["Caller-Caller-ID-Number"]) {
                        return {
                            ...item,
                            talking: true,
                        };
                    }
                    return item;
                }));
                setCurrentUser(prevList => prevList.map(item => {
                    if (item.caller_id_number === conferenceData["Caller-Caller-ID-Number"]) {
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
                    if (item.caller_id_number === conferenceData["Caller-Caller-ID-Number"]) {
                        return {
                            ...item,
                            mute_detect: true,
                            talking: false,
                        };
                    }
                    return item;
                }));
                setCurrentUser(prevList => prevList.map(item => {
                    if (item.caller_id_number === conferenceData["Caller-Caller-ID-Number"]) {
                        return {
                            ...item,
                            mute_detect: true,
                            talking: false,
                        };
                    }
                    return item;
                }));
            } else if (conferenceData.Action === "unmute-member") {
                // Update the list with the updated values
                setConfList(prevList => prevList.map(item => {
                    if (item.caller_id_number === conferenceData["Caller-Caller-ID-Number"]) {
                        return {
                            ...item,
                            mute_detect: false
                        };
                    }
                    return item;
                }));
                setCurrentUser(prevList => prevList.map(item => {
                    if (item.caller_id_number === conferenceData["Caller-Caller-ID-Number"]) {
                        return {
                            ...item,
                            mute_detect: false
                        };
                    }
                    return item;
                }));
            } else if (conferenceData.Action === "deaf-member") {
                // Update the list with the updated values
                setConfList(prevList => prevList.map(item => {
                    if (item.caller_id_number === conferenceData["Caller-Caller-ID-Number"]) {
                        return {
                            ...item,
                            deaf: true,
                        };
                    }
                    return item;
                }));
                setCurrentUser(prevList => prevList.map(item => {
                    if (item.caller_id_number === conferenceData["Caller-Caller-ID-Number"]) {
                        return {
                            ...item,
                            deaf: true,
                        };
                    }
                    return item;
                }));
            } else if (conferenceData.Action === "undeaf-member") {
                // Update the list with the updated values
                setConfList(prevList => prevList.map(item => {
                    if (item.caller_id_number === conferenceData["Caller-Caller-ID-Number"]) {
                        return {
                            ...item,
                            deaf: false,
                        };
                    }
                    return item;
                }));
                setCurrentUser(prevList => prevList.map(item => {
                    if (item.caller_id_number === conferenceData["Caller-Caller-ID-Number"]) {
                        return {
                            ...item,
                            deaf: false,
                        };
                    }
                    return item;
                }));
            } else if (conferenceData.Action === "del-member") {
                setNotification(false)
                setNotification(true)
                setNotificationData(`${conferenceData["Caller-Caller-ID-Name"]} has left the conference`);
                setTimeout(() => {
                    setNotification(false)
                }, [3000])
                setConfList(prevList => prevList.filter(item => item.caller_id_number !== conferenceData["Caller-Caller-ID-Number"]));
            }
        }
    }, [conferenceData])

    // Handle calling action for current user
    async function callAction(action) {
        const parsedData = {
            action: action,
            room_id: locationState.room_id,
            member: String(currentUser[0].id)
        }
        generalPostFunction(`conference/action`, parsedData).then(res => {
            if (res.status && action === "hup") {
                navigate(-1)
            }
        })
    }

    console.log("Current User", currentUser);

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
                                                        <h4>
                                                            Conference <span>14:20</span>
                                                        </h4>
                                                        <button className="clearButton">
                                                            <i class="fa-sharp fa-solid fa-circle-plus"></i> Add
                                                            Participant
                                                        </button>
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
                                                                    <div className="activeGuyName">{selectedConferenceUser?.name}</div>
                                                                    {videoCallToggle ?
                                                                        (
                                                                            <img alt="" className="videoElement" src="https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/HjH5lgeHeix7kfhup/videoblocks-31_man-successful_4k_rwpcr0ar3_thumbnail-1080_11.png" />
                                                                        )
                                                                        :
                                                                        (
                                                                            <div className="justify-content-center h-100 d-flex align-items-center text-white fs-1">
                                                                                <div className="contactViewProfileHolder">
                                                                                    {(selectedConferenceUser?.name)}
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
                                                                        onClick={() => { callAction(currentUser?.[0]?.deaf ? "undeaf" : "deaf") }}
                                                                    >
                                                                        {currentUser?.[0]?.deaf ? <i class="fa-sharp fa-solid fa-volume-slash"></i> : <i class="fa-sharp fa-solid fa-volume"></i>}

                                                                    </div>
                                                                </div>
                                                                <div className="videoControls">
                                                                    <button className="appPanelButtonCallerRect" onClick={() => { callAction("tmute") }}>
                                                                        {currentUser?.[0]?.mute_detect ? <i class="fa-light fa-microphone-slash"></i> : <i class="fa-light fa-microphone"></i>}
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
    const [videoCallToggle, setVideoCallToggle] = useState(false);
    const [userMuted, setUserMuted] = useState(false);

    console.log("itemaaaa", item);

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
                data-pin={item.deaf}
                data-speaking={item.talking}
                style={{ cursor: "pointer" }}
                onClick={() => handleSelectConferenceUser(item)}
            >
                {videoCallToggle ? (
                    <div>
                        <img src="https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/HjH5lgeHeix7kfhup/videoblocks-31_man-successful_4k_rwpcr0ar3_thumbnail-1080_11.png" />
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
