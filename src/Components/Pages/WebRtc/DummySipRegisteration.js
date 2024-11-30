import { useEffect, useState } from "react";
import { useSessionCall, useSIPProvider } from "react-sipjs";
import MediaPermissions from "./MediaPermissions ";
import AutoAnswer from "./AutoAnswer";
import { generalPostFunction } from "../../GlobalFunction/globalFunction";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import CallController from "./CallController";
import { set } from "react-hook-form";

export const DummySipRegisteration = ({ webSocketServer, extension, password, setConferenceToggle }) => {
    const { sessions: sipSessions, connectAndRegister } = useSIPProvider();
    const { connectStatus } = useSIPProvider();
    console.log("connectStatus", connectStatus);
    const dummySession = useSelector((state) => state.dummySession);
    const location = useLocation();
    const locationState = location.state;
    const [callEstablish, setCallEstablish] = useState(false)
    const [sessionId, setSessionId] = useState(null)
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

    const [selectedConferenceUser, setSelectedConferenceUser] = useState(null);
    const globalSession = useSelector((state) => state.sessions);
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
        setSelectedConferenceUser(conferenceArray[0]);
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
            }
        };
        if (extension && password) {
            registerUser();
        } else {
            console.error("Missing extension or password");
        }
    }, [webSocketServer, extension, password, connectAndRegister]);

    useEffect(() => {
        if (connectStatus === "CONNECTED") {
            async function startConference() {
                const response = await generalPostFunction("/conference/start", { id: locationState.extension_id, name: locationState.name })
                if (response.status) {
                    setCallEstablish(true)
                }
            }
            startConference()

        }
    }, [connectStatus])
    // Monitor incoming SIP sessions
    const incomingSessionsArray = Object.keys(sipSessions).filter(
        (id) =>
            sipSessions[id].state === "Initial" &&
            sipSessions[id].logger.category === "sip.Invitation"
    );

   
    return (
        <div className="profileDropdowns" style={{ top: "55px", right: "-40px" }}>
            <MediaPermissions />
            {incomingSessionsArray.map((item, index) => {
                return (

                    <AutoAnswer id={item} />
                )
            })}
            {
                dummySession &&

                <>
                    <main
                        style={{
                            marginRight:
                                globalSession.length > 0 && Object.keys(globalSession).length > 0
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
                                                    <button
                                                        class="clearButton text-dark"
                                                        onClick={() => {
                                                            setConferenceToggle(false);
                                                        }}
                                                    >
                                                        <i class="fa-solid fa-caret-left fs-4"></i>
                                                    </button>{" "}
                                                    Conference{" "}
                                                    <button class="clearButton">
                                                        <i
                                                            class="fa-regular fa-arrows-rotate fs-5"
                                                            style={{ color: "var(--webUtilGray)" }}
                                                        ></i>
                                                    </button>
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
                                                    <div className="myProfileWidget">
                                                        <div class="profileHolder" id="profileOnlineNav">
                                                            <img
                                                                src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg"
                                                                alt="profile"
                                                            />
                                                        </div>
                                                        <div class="profileName">
                                                            test two <span className="status">Available</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="videoCallWrapper">
                                        <div className="row">
                                            <div className="col-lg-4 col-xl-4 col-12 p-3">
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
                                            </div>
                                            <div className="col-lg-8 col-xl-8 col-12">
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
                                                                        <img src="https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/HjH5lgeHeix7kfhup/videoblocks-31_man-successful_4k_rwpcr0ar3_thumbnail-1080_11.png" />
                                                                    )
                                                                    :
                                                                    (
                                                                        <div className="justify-content-center h-100 d-flex align-items-center text-white fs-1">
                                                                            <div className="contactViewProfileHolder">
                                                                                {getInitials(selectedConferenceUser?.name)}
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

                                                            <CallController id={dummySession} />
                                                        </div>
                                                        {/* )} */}
                                                    </div>
                                                    <div className="conferenceParticipantsWrapper">
                                                        {conferenceArray.map((item, index) => {
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
                data-mic={userMuted}
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
