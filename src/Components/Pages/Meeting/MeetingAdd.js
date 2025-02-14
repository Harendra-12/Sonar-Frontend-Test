import React, { useEffect, useState } from 'react'
import { backToTop, generalGetFunction, generalPostFunction } from '../../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';
import Header from '../../CommonComponents/Header';
import { useNavigate } from 'react-router-dom';
import CircularLoader from '../../Loader/CircularLoader';

function MeetingAdd() {
    const [conferenceName, setConferenceName] = useState("");
    const [conferenceType, setConferenceType] = useState("public");
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState(5);
    const [moderatorPin, setModeratorPin] = useState(555555);
    const [participantPin, setParticipantPin] = useState(1111);
    const [retryCount, setRetryCount] = useState(3);
    const [holdSound, setHoldSound] = useState([]);
    const [moh, setMoh] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        async function getData() {
            const musicData = await generalGetFunction("/sound/all");
            if (musicData?.status) {
                setHoldSound(musicData.data.filter((item) => item.type === "hold"));
            }
        }
        getData();
    }, [])


    async function handleSubmit() {
        if (conferenceName === null || conferenceName === "") {
            toast.error("Please enter conference name");
        } else if (
            conferenceType === "private" &&
            (participantPin < 100000 || participantPin > 999999)
        ) {
            toast.error("Please enter 6 digit participant pin");
        } else if (members === null || members === "") {
            toast.error("Please enter number of members");
        } else if (
            conferenceType === "private" &&
            (moderatorPin < 100000 || moderatorPin > 999999)
        ) {
            toast.error("Please enter 6 digit moderator pin");
        } else if (
            conferenceType === "private" &&
            (retryCount < 1 || retryCount > 5)
        ) {
            toast.error("Please enter  retry count between 1 to 5");
        } else if (moh === "") {
            toast.error("Please select moh");
        } else {
            setLoading(true);
            const parsedData = {
                conf_name: conferenceName,
                conf_max_members: members,
                pin_retries: retryCount,
                moderator_pin: String(moderatorPin),
                nopin: conferenceType !== "private" ? "0" : "1",
                conf_type: conferenceType,
                moh_sound: moh,
                participate_pin: String(participantPin),
            };
            const apiData = await generalPostFunction(
                "/conference/store",
                parsedData
            );
            if (apiData.status) {
                navigate(-1)
                setLoading(false);
                toast.success(apiData.message);
            } else {
                setLoading(false);
            }
        }
    }
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid px-0">
                    <Header title="Meeting Rooms" />
                </div>
                <div className="overviewTableWrapper">
                    <div className="overviewTableChild">
                        <div
                            className="d-flex flex-wrap"
                            style={{ position: "sticky", top: "0", zIndex: "9" }}
                        >
                            <div className="col-12">
                                <div className="heading">
                                    <div className="content">
                                        <h4>Create Meeting Room</h4>
                                        <p>
                                            Create a new conference and configure it.
                                        </p>
                                    </div>
                                    <div className="buttonGroup">
                                        <div className="d-flex align-items-center">
                                            <button
                                                onClick={() => {
                                                    navigate(-1);
                                                    backToTop();
                                                }}
                                                type="button"
                                                effect="ripple"
                                                className="panelButton gray"
                                            >
                                                <span className="text">Back</span>
                                                <span className="icon">
                                                    <i class="fa-solid fa-caret-left"></i>
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                effect="ripple"
                                                className="panelButton"
                                                onClick={handleSubmit}
                                            >
                                                <span className="text">Save</span>
                                                <span className="icon">
                                                    <i class="fa-solid fa-floppy-disk"></i>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="col-12"
                            style={{
                                padding: "25px 23px",
                                borderBottom: "1px solid #ddd",
                            }}
                        >
                            <form className="col-12 mx-auto">
                                <div className="formRow col-xl-3">
                                    <div className="formLabel">
                                        <label htmlFor="">Conference Name</label>
                                        <label
                                            htmlFor="data"
                                            className="formItemDesc"
                                        >
                                            Name of the conference
                                        </label>
                                    </div>
                                    <div className="col-xl-6 col-12">
                                        <input
                                            type="text"
                                            name="extension"
                                            className="formItem"
                                            onChange={(e) =>
                                                setConferenceName(e.target.value)
                                            }
                                            value={conferenceName}
                                        />
                                    </div>
                                </div>
                                <div className="formRow col-xl-3">
                                    <div className="formLabel">
                                        <label htmlFor="">Conference Type</label>
                                        <label
                                            htmlFor="data"
                                            className="formItemDesc"
                                        >
                                            Define type for the conference so that
                                            participants can join accordingly
                                        </label>
                                    </div>
                                    <div className="col-xl-6 col-12">
                                        <select
                                            className="formItem"
                                            onChange={(e) =>
                                                setConferenceType(e.target.value)
                                            }
                                            value={conferenceType}
                                        >
                                            <option value="public">Public</option>
                                            <option value="private">Private</option>
                                            <option value="webiner">webinar</option>
                                        </select>
                                    </div>
                                </div>
                                {conferenceType !== "private" ? (
                                    ""
                                ) : (
                                    <>
                                        <div className="formRow col-xl-3">
                                            <div className="formLabel">
                                                <label htmlFor="">Conference pin</label>
                                                <label
                                                    htmlFor="data"
                                                    className="formItemDesc"
                                                >
                                                    Share this pin with participants
                                                </label>
                                            </div>
                                            <div className="col-xl-6 col-12">
                                                <input
                                                    type="number"
                                                    name="extension"
                                                    className="formItem"
                                                    onChange={(e) =>
                                                        setParticipantPin(e.target.value)
                                                    }
                                                    value={participantPin}
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-3">
                                            <div className="formLabel">
                                                <label htmlFor="">Retry attempts</label>
                                                <label
                                                    htmlFor="data"
                                                    className="formItemDesc"
                                                >
                                                    Number of times participant can retry
                                                    joining
                                                </label>
                                            </div>
                                            <div className="col-xl-6 col-12">
                                                <input
                                                    type="number"
                                                    name="extension"
                                                    className="formItem"
                                                    onChange={(e) =>
                                                        setRetryCount(e.target.value)
                                                    }
                                                    value={retryCount}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="formRow col-xl-3">
                                    <div className="formLabel">
                                        <label htmlFor="">Music on hold</label>
                                        <label
                                            htmlFor="data"
                                            className="formItemDesc"
                                        >
                                            Select music that will be played on hold
                                        </label>
                                    </div>
                                    <div className="col-xl-6 col-12">
                                        <select
                                            type="number"
                                            name="extension"
                                            className="formItem"
                                            onChange={(e) => setMoh(e.target.value)}
                                            value={moh}
                                        >
                                            <option disabled value="" selected>
                                                Select Hold Music
                                            </option>
                                            {holdSound &&
                                                holdSound?.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    );
                                                })}
                                        </select>
                                    </div>
                                </div>
                                <div className="formRow col-xl-3">
                                    <div className="formLabel">
                                        <label htmlFor="">Number of members</label>
                                        <label
                                            htmlFor="data"
                                            className="formItemDesc"
                                        >
                                            Enter maximum number of members that can
                                            join
                                        </label>
                                    </div>
                                    <div className="col-xl-6 col-12">
                                        <input
                                            type="number"
                                            name="extension"
                                            className="formItem"
                                            onChange={(e) =>
                                                setMembers(e.target.value)
                                            }
                                            value={members}
                                        />
                                    </div>
                                </div>
                                <div className="formRow col-xl-3">
                                    <div className="formLabel">
                                        <label htmlFor="">Moderator pin</label>
                                        <label
                                            htmlFor="data"
                                            className="formItemDesc"
                                        >
                                            Set pin for moderators
                                        </label>
                                    </div>
                                    <div className="col-xl-6 col-12">
                                        <input
                                            type="number"
                                            name="extension"
                                            className="formItem"
                                            onChange={(e) =>
                                                setModeratorPin(e.target.value)
                                            }
                                            value={moderatorPin}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <div>
                {loading && <CircularLoader />}
            </div>
        </main>
    )
}

export default MeetingAdd
