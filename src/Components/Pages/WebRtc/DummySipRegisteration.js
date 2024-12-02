import { useEffect, useRef, useState } from "react";
import { useSessionCall, useSIPProvider } from "react-sipjs";
import MediaPermissions from "./MediaPermissions ";
import AutoAnswer from "./AutoAnswer";
import { generalGetFunction, generalPostFunction } from "../../GlobalFunction/globalFunction";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CallController from "./CallController";
import { set } from "react-hook-form";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";
import ContentLoader from "../../Loader/ContentLoader";

export const DummySipRegisteration = ({ webSocketServer, extension, password, setConferenceToggle }) => {
    const navigate = useNavigate();
    const { sessions: sipSessions, connectAndRegister } = useSIPProvider();
    const { connectStatus, registerStatus } = useSIPProvider();
    const [sipRegisterErrror, setSipRegisterError] = useState(false);
    const dummySession = useSelector((state) => state.dummySession);
    const location = useLocation();
    const [conferenceData, setConferenceData] = useState([])
    const locationState = location.state;
    const [sessionId, setSessionId] = useState(null)
    const [loading, setLoading] = useState(true);
    const [confList, setConfList] = useState([])
    const [conferenceArray, setConferenceArray] = useState([
        {
            id: 1,
            name: "John Doe",
        },
        {
            id: 2,
            name: "Ruby Rai",
        },
        {
            id: 3,
            name: "Kumar Swami",
        },
        {
            id: 4,
            name: "Guarav Chattopadhyaye",
        },
        {
            id: 5,
            name: "Simran Agarwal",
        },
        {
            id: 6,
            name: "Mohan Rajput",
        },
    ]);
    const [videoCallToggle, setVideoCallToggle] = useState(false);
    const [toggleMessages, setToggleMessages] = useState(false);

    const [selectedConferenceUser, setSelectedConferenceUser] = useState(null);
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
        setSelectedConferenceUser(confList[0]);
    }, []);
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
                        const confList = await generalGetFunction(`/conference/${locationState.room_id}/details`)
                        console.log("confList", JSON?.parse?.(confList?.data));
                        
                        if (confList.status && confList?.data!==`-ERR Conference ${locationState.room_id} not found\n`) {
                            setConfList(JSON?.parse?.(confList?.data)?.filter((item) => item.conference_name == locationState.room_id)?.[0]?.members.map((item) => {
                                return (
                                    {
                                        id: item.id,
                                        caller_id_number: item.caller_id_number,
                                        name:item.caller_id_name,
                                        uuid: item.uuid,
                                        talking: item.flags.talking,
                                        mute_detect: item.flags.mute_detect,
                                        hold: item.flags.hold,
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
                        setConferenceData(JSON.parse(JSON.parse(event.data))["result"]["Conference-Name"]==locationState.room_id && JSON.parse(JSON.parse(event.data))["result"]);
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

    useEffect(()=>{
        if(conferenceData){
            // Check if conferencedata.calleridname is previously present in conflist
            if (conferenceData.Action==="add-member" && !confList.some(item => item.caller_id_number === conferenceData["Caller-Caller-ID-Number"])){
                setConfList(prevList => [...prevList, {
                    id: conferenceData["Caller-Unique-ID"],
                    name: conferenceData["Caller-Orig-Caller-ID-Name"],
                    caller_id_number: conferenceData["Caller-Caller-ID-Number"],
                    uuid: conferenceData["Core-UUID"],
                    talking: conferenceData["Talking"],
                    mute_detect: conferenceData["Mute-Detect"],
                    hold: conferenceData["Hold"],
                }]);
            }else if(conferenceData.Action==="stop-talking" || conferenceData.Action==="start-talking"){
                // Update the list with the updated values
                setConfList(prevList => prevList.map(item => {
                    if (item.caller_id_number === conferenceData["Caller-Caller-ID-Number"]) {
                        return {
                            ...item,
                            talking: conferenceData["Talking"],
                            mute_detect: conferenceData["Mute-Detect"],
                            hold: conferenceData["Hold"],
                        };
                    }
                    return item;
                }));
            }else if(conferenceData.Action==="del-member"){
                setConfList(prevList => prevList.filter(item => item.caller_id_number !== conferenceData["Caller-Caller-ID-Number"]));
            }
        }
    },[conferenceData])

    console.log("conferenceData", conferenceData);
    console.log("setConfList", confList);



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
                                                        <div className="NotificationBell">
                                                            <i className="fa-solid fa-bell"></i>
                                                            <div className="content">
                                                                XYZ Someone Joined
                                                            </div>
                                                        </div>
                                                        <div className="participant active ">
                                                            {/* {videoCallToggle ? (
                          <div>
                            <img src="https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/HjH5lgeHeix7kfhup/videoblocks-31_man-successful_4k_rwpcr0ar3_thumbnail-1080_11.png" />
                          </div>
                        ) : ( */}
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
                                                                    >
                                                                        <i class="fa-sharp fa-solid fa-volume"></i>
                                                                    </div>
                                                                </div>
                                                                {/* <div>
                              <p className="text-center text-white">
                                {selectedConferenceUser?.name}
                              </p>
                            </div> */}

                                                                {/* <div className="videoControls">
                                                                <button className="appPanelButtonCallerRect">
                                                                    <i class="fa-light fa-microphone"></i>
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
                                                                >
                                                                    Leave Call
                                                                </button>
                                                                <button className="appPanelButtonCallerRect" onClick={() => setToggleMessages(!toggleMessages)}>
                                                                    <i class="fa-light fa-messages"></i>
                                                                </button>
                                                                <button className="appPanelButtonCallerRect">
                                                                    <i class="fa-light fa-chalkboard-user"></i>
                                                                </button>
                                                                <button className="appPanelButtonCallerRect">
                                                                    <i class="fa-light fa-hand"></i>
                                                                </button>
                                                            </div> */}
                                                                <CallController id={dummySession} />
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

                                                        {/* <div className="participant active">
                        <img src="https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/HjH5lgeHeix7kfhup/videoblocks-31_man-successful_4k_rwpcr0ar3_thumbnail-1080_11.png" />
                      </div>
                      <div className="participant" data-mic="true">
                        <img src="https://ogletree.com/app/uploads/people/alexandre-abitbol.jpg" />
                      </div>
                      <div
                        className="participant "
                        data-mic="false"
                        style={{ top: `120px` }}
                      >
                        <img src="https://ogletree.com/app/uploads/people/jerod-a-allen.jpg" />
                      </div>
                      <div
                        className="participant"
                        data-pin="true"
                        style={{ top: `220px` }}
                      >
                        <img src="https://ogletree.com/app/uploads/people/janice-g-dubler.jpg" />
                      </div>
                      <div className="participant" style={{ top: `320px` }}>
                        <img src="https://i.pinimg.com/736x/54/b7/58/54b758f7757dfb67d75a0b6640cb2efa.jpg" />
                      </div> */}
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
