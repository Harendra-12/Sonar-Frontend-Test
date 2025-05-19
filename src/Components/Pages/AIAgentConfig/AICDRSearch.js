/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Header from "../../CommonComponents/Header";

import {
    backToTop,
    featureUnderdevelopment,
    generalGetFunction,
    generalPostFunction,
    generatePreSignedUrl,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import { toast } from "react-toastify";
import Tippy from "@tippyjs/react";
import CircularLoader from "../../Loader/CircularLoader";
import Comments from "../WebRtc/Comments";
import Duplicates from "../WebRtc/Duplicates";
import ExportPopUp from "../WebRtc/ExportPopUp";
import AudioWaveformCommon from "../../CommonComponents/AudioWaveformCommon";
import axios from "axios";

/**
 * CdrFilterReport is a React component that manages and displays Call Detail Records (CDR)
 * reports based on various filters and parameters. It fetches data from an API and allows
 * users to filter, block numbers, and export data. The component handles different types
 * of reports like billing, call center, ring group, and call recordings and provides
 * pagination, data filtering by date and time, and the ability to view and manage comments
 * and duplicate records.
 *
 * @param {Object} props - The component props.
 * @param {string} props.page - The current page type to determine which keys to display
 * in the report table.
 */

function AICDRSearch({ page }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [circularLoader, setCircularLoader] = useState(false);
    const [cdr, setCdr] = useState();
    const [pageNumber, setPageNumber] = useState(1);
    const navigate = useNavigate();
    const account = useSelector((state) => state.account);
    const selectedCdrFilter = useSelector((state) => state.selectedCdrFilter);
    const [currentPlaying, setCurrentPlaying] = useState(""); // For tracking the currently playing audio
    const [refreshState, setRefreshState] = useState(false)
    const [callBlock, setCallBlock] = useState([]);
    const [callBlockRefresh, setCallBlockRefresh] = useState(0);
    const [selectedNumberToBlock, setSelectedNumberToBlock] = useState(null);
    const [popUp, setPopUp] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [audioURL, setAudioURL] = useState("");
    const [comment, setComment] = useState("");
    const [selectedCdr, setSelectedCdr] = useState("");
    const [exportPopup, setExportPopup] = useState(false);
    const [filteredKeys, setFilteredKeys] = useState([]);
    const [showDuplicatePopUp, setShowDuplicatePopUp] = useState(false);
    const [duplicatePopUpData, setDuplicatePopUpData] = useState({});
    const [error, setError] = useState("");
    const [showAudio, setShowAudio] = useState(false);
    // const [transcribeLink, setTranscribeLink] = useState()
    const [showDropDown, setShowDropdown] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [filteredColumns, setFilteredColumns] = useState([])
    const [filteredColumnForTable, setFilteredColumnForTable] = useState([])
    const [advanceSearch, setAdvanceSearch] = useState();
    const [cdrSearchAI, setCdrSearchAI] = useState([]);
    const [cdrAIRes, setCdrAIRes] = useState([]);
    const [showCustomerFeedback, setShowCustomerFeedback] = useState("");
    const [showKeys, setShowKeys] = useState([
        "Call-Direction",
        // "Caller-Orig-Caller-ID-Name",
        "variable_sip_from_user",
        "tag",
        "variable_sip_to_user",
        // "application_state",
        // "application_state_to_ext",
        "e_name",
        "Date",
        "Time",
        "recording_path",
        "variable_billsec",
        // "variable_sip_to_user",
        "Hangup-Cause",
        "variable_DIALSTATUS",
        "start_date",
        "end_date",
        // "call_cost",
        "id",
    ]);

    const thisAudioRef = useRef(null);

    function formatTimeWithAMPM(timeString) {
        const [hours, minutes, seconds] = timeString.split(":").map(Number);

        if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
            return "Invalid time format";
        }

        let period = "AM";
        let formattedHours = hours;

        if (hours >= 12) {
            period = "PM";
            if (hours > 12) {
                formattedHours -= 12;
            }
        }

        if (formattedHours === 0) {
            formattedHours = 12; // Midnight is 12 AM
        }

        const formattedMinutes = minutes.toString().padStart(2, "0");
        const formattedSeconds = seconds.toString().padStart(2, "0");

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${period}`;
    }

    async function getData() {
        // build a dynamic url which include only the available params to make API call easy
        const queryParams = cdrSearchAI.map(id => `ids[]=${encodeURIComponent(id)}`).join('&');
        const finalUrl = `/cdr?account=${account.account_id}&${queryParams}`;

        // function to filter object
        function filterObjectKeys(obj, keys) {
            let filteredObj = {};

            keys.forEach((key) => {
                if (
                    key === "variable_start_stamp" &&
                    obj.hasOwnProperty("variable_start_stamp")
                ) {
                    filteredObj["Date"] = obj["variable_start_stamp"]?.split(" ")[0];
                    filteredObj["Time"] = formatTimeWithAMPM(
                        obj["variable_start_stamp"]?.split(" ")[1]
                    );
                }
                if (obj.hasOwnProperty(key)) {
                    filteredObj[key] = obj[key];
                }
            });

            return filteredObj;
        }

        if (account && account.account_id) {
            const apiData = await generalGetFunction(finalUrl);
            if (apiData?.response?.status == 403) {
                toast.error("You don't have permission to access this page.");
            } else if (apiData?.status === true) {
                const filteredData = apiData?.data?.data?.map((item) =>
                    filterObjectKeys(item, [...apiData.filteredKeys, "id"])
                );
                setFilteredKeys([...apiData.filteredKeys, "id"]);
                setCdr({
                    ...apiData?.data,
                    data: filteredData,
                });
                if (selectedCdrFilter !== "") {
                    dispatch({
                        type: "SET_SELECTEDCDRFILTER",
                        selectedCdrFilter: "",
                    });
                }
            }
            setLoading(false);
            setCircularLoader(false);
            setRefreshState(false);
            setCircularLoader(false);
        } else {
            setLoading(false);
            setCircularLoader(false);
            navigate("/");
            setRefreshState(false);
        }
    }

    const handlePlaying = async (audio) => {
        // Reseting state before Playing
        setCurrentPlaying("");
        setAudioURL("");

        try {
            setCurrentPlaying(audio);
            const url = audio?.split(".com/").pop();
            // const res = await generatePreSignedUrl(url);

            // if (res?.status && res?.url) {
            // setAudioURL(res.url); // Update audio URL state
            setAudioURL(audio);
            // Wait for React state update before accessing ref
            setTimeout(() => {
                if (thisAudioRef.current) {
                    thisAudioRef.current.load(); // Reload audio source
                    thisAudioRef.current.play().catch((error) => {
                        console.error("Audio play error:", error);
                    });
                }
            }, 100); // Reduced timeout to minimize delay
            // }
        } catch (error) {
            console.error("Error in handlePlaying:", error);
        }
    };

    // const handleBlockNumber = async (blockNumber) => {
    //     if (!blockNumber) {
    //         toast.error("Please enter number");
    //     } else if (
    //         blockNumber < 99999999 ||
    //         blockNumber > 99999999999999 ||
    //         isNaN(blockNumber)
    //     ) {
    //         toast.error("Please enter valid number");
    //     } else {
    //         setPopUp(false);
    //         setLoading(true);
    //         const parsedData = {
    //             type: "DID",
    //             number: blockNumber,
    //         };
    //         const apidata = await generalPostFunction(`/spam/store`, parsedData);
    //         if (apidata.status) {
    //             setLoading(false);

    //             setSelectedNumberToBlock(null);
    //             setCallBlock([...callBlock, apidata?.data]);
    //             toast.success("Number added to block list");
    //         } else {
    //             setLoading(false);
    //         }
    //     }
    // };

    // useEffect(() => {
    //     const getRingGroupDashboardData = async () => {
    //         if (account && account.id) {
    //             const apidata = await generalGetFunction(`/spam/all?all`);
    //             if (apidata?.status) {
    //                 setCallBlock(apidata?.data);
    //                 setLoading(false);
    //             } else {
    //                 navigate("/");
    //             }
    //         } else {
    //             navigate("/");
    //         }
    //     };
    //     getRingGroupDashboardData();
    // }, [callBlockRefresh]);

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

    // const duplicateColumn = async (item) => {
    //     setShowDuplicatePopUp(true);
    //     setDuplicatePopUpData(item);
    // };

    useEffect(() => {
        const columns = []
        const originKeys = []
        {
            showKeys.map((key) => {
                if (
                    cdr?.data[0]?.hasOwnProperty(key) &&
                    key !== "id"
                ) {
                    let formattedKey = "";
                    if (key === "variable_sip_from_user") {
                        formattedKey = "Caller No.";
                    } else if (key === "variable_sip_to_user") {
                        formattedKey = "Destination";
                    } else if (
                        key === "Caller-Orig-Caller-ID-Name"
                    ) {
                        formattedKey = "Caller Name";
                    } else if (key === "recording_path") {
                        formattedKey = "Recording";
                    } else if (key === "variable_billsec") {
                        formattedKey = "Duration";
                    } else if (key === "application_state") {
                        formattedKey = "Via/Route";
                    } else if (
                        key === "application_state_to_ext"
                    ) {
                        formattedKey = "Ext";
                    } else if (key === "e_name") {
                        formattedKey = "User Name";
                    } else if (key === "variable_DIALSTATUS") {
                        formattedKey = "Hangup Status";
                    } else if (key === "Hangup-Cause") {
                        formattedKey = "Hangup Cause";
                    } else if (key === "call_cost") {
                        formattedKey = "Charge";
                    } else {
                        formattedKey = key
                            .replace(/[-_]/g, " ")
                            .toLowerCase()
                            .replace(/\b\w/g, (char) =>
                                char.toUpperCase()
                            );
                    }
                    columns.push(formattedKey)
                    originKeys.push({ key: key, formattedKey: formattedKey })

                }
                return null;
            })
        }

        columns.push("Customer Sentiment")
        columns.push("Call Summary")
        originKeys.push({ key: "customer_sentiment", formattedKey: "Customer Sentiment" })
        originKeys.push({ key: "call_summary", formattedKey: "Call Summary" })

        const indexOfOriginKey = originKeys?.findIndex((data) => data?.key == "recording_path")
        if (indexOfOriginKey !== -1) {
            let removedItem = originKeys?.splice(indexOfOriginKey, 1)[0];
            let insertIndex = originKeys?.length - 3;
            originKeys.splice(insertIndex, 0, removedItem);
        }
        setFilteredColumnForTable(originKeys)
        let columnIndex = columns?.findIndex(val => val === "Recording");
        if (columnIndex !== -1) {
            let removedItem = columns?.splice(columnIndex, 1)[0];
            let insertIndex = columns?.length - 3;
            columns?.splice(insertIndex, 0, removedItem);
        }
        setFilteredColumns(columns)
        const optionsCol = columns?.map((data, index) => ({
            value: data,
            label: data
        }))
        optionsCol.shift()
        const index = optionsCol?.findIndex((data) => data?.value == "Recording")
        if (index !== -1) {
            let removedItem = optionsCol?.splice(index, 1)[0];
            let insertIndex = optionsCol?.length - 3;
            optionsCol?.splice(insertIndex, 0, removedItem);
        }
    }, [showKeys, cdr?.data?.length])

    useEffect(() => {
        if (cdrSearchAI.length > 0) {
            getData();
        }
    }, [cdrSearchAI]);

    function getAdvanceSearch() {
        if (advanceSearch) {
            setLoading(true);
            setCircularLoader(true);
            axios.post("https://4ofg0goy8h.execute-api.us-east-2.amazonaws.com/dev2/ai-search", { query: advanceSearch }).then((res) => {
                const matches = res.data.matches;
                setCdrAIRes(matches);
                if (matches.length > 0) {
                    const cdrIds = matches.map(match => match.cdr_id);
                    setCdrSearchAI(cdrIds);
                }
            })
                .catch((err) => {
                    toast.error(err);
                    setLoading(false);
                    setCircularLoader(false);
                });
        } else {
            toast.error("Please enter some data to search");
            setLoading(false);
            setCircularLoader(false);
        }
    }
    return (
        <>
            {circularLoader && <CircularLoader />}
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid px-0 position-relative">
                        <Header title="AI CDR Search" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>AI CDR Search
                                                </h4>
                                                <p>Search for a specific call detail record with the power of AI</p>
                                            </div>
                                            <div className="buttonGroup">
                                                <button
                                                    effect="ripple"
                                                    className="panelButton gray"
                                                    onClick={() => {
                                                        navigate(-1);
                                                        backToTop();
                                                    }}
                                                >
                                                    <span className="text">Back</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-12"
                                        style={{ overflow: "auto", padding: "10px 20px 0" }}
                                    >
                                        <div className="tableHeader justify-content-start">
                                            <div className="searchBox position-relative">
                                                <label>Search:</label>
                                                <input
                                                    type="search"
                                                    name="Search"
                                                    className="formItem"
                                                    value={advanceSearch}
                                                    onChange={(e) => setAdvanceSearch(e.target.value)}
                                                />
                                            </div>
                                            <button className="panelButton" onClick={getAdvanceSearch}>
                                                <span className="text">Search</span>
                                                <span className="icon">
                                                    <i className="fa-solid fa-magnifying-glass" />
                                                </span>
                                            </button>
                                        </div>
                                        <div className="tableContainer">
                                            <table>
                                                {cdr?.data?.length > 0 ? (
                                                    <>
                                                        <thead>
                                                            <tr style={{ whiteSpace: "nowrap" }}>
                                                                <th>#</th>
                                                                {filteredColumns?.map((column, index) => {
                                                                    return <th key={index}>{column}</th>;
                                                                })}
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {loading ? (
                                                                <SkeletonTableLoader
                                                                    col={showKeys.length}
                                                                    row={12}
                                                                />
                                                            ) : (
                                                                <>
                                                                    {cdr?.data?.map((item, index) => {
                                                                        const isBlocked = callBlock?.some(
                                                                            (block) => {
                                                                                if (
                                                                                    item["Call-Direction"] === "inbound"
                                                                                ) {
                                                                                    return (
                                                                                        item["Caller-Caller-ID-Number"] ===
                                                                                        block.number
                                                                                    );
                                                                                } else if (
                                                                                    item["Call-Direction"] === "outbound"
                                                                                ) {
                                                                                    return (
                                                                                        item["Caller-Callee-ID-Number"] ===
                                                                                        block.number
                                                                                    );
                                                                                }
                                                                            }
                                                                        );

                                                                        return (
                                                                            <React.Fragment key={index}>
                                                                                <tr className="cdrTableRow">
                                                                                    <td>
                                                                                        {(pageNumber - 1) *
                                                                                            Number(itemsPerPage) +
                                                                                            (index + 1)}
                                                                                    </td>

                                                                                    {filteredColumnForTable.map((val) => {
                                                                                        const key = val?.key
                                                                                        if (
                                                                                            item.hasOwnProperty(key) &&
                                                                                            key !== "id"
                                                                                        ) {
                                                                                            if (key === "recording_path") {
                                                                                                return (
                                                                                                    <td key={key}>
                                                                                                        {item["recording_path"] &&
                                                                                                            item["variable_billsec"] >
                                                                                                            0 && (
                                                                                                                <button
                                                                                                                    className="tableButton px-2 mx-0"
                                                                                                                    onClick={() => {
                                                                                                                        if (
                                                                                                                            item[
                                                                                                                            "recording_path"
                                                                                                                            ] ===
                                                                                                                            currentPlaying
                                                                                                                        ) {
                                                                                                                            setCurrentPlaying(
                                                                                                                                ""
                                                                                                                            );
                                                                                                                            setAudioURL("");
                                                                                                                        } else {
                                                                                                                            handlePlaying(
                                                                                                                                item[
                                                                                                                                "recording_path"
                                                                                                                                ]
                                                                                                                            );
                                                                                                                        }
                                                                                                                    }}
                                                                                                                >
                                                                                                                    {currentPlaying ===
                                                                                                                        item[
                                                                                                                        "recording_path"
                                                                                                                        ] ? (
                                                                                                                        <i className="fa-solid fa-chevron-up"></i>
                                                                                                                    ) : (
                                                                                                                        <i className="fa-solid fa-chevron-down"></i>
                                                                                                                    )}
                                                                                                                </button>
                                                                                                            )}
                                                                                                    </td>
                                                                                                );
                                                                                            } else if (
                                                                                                key === "Call-Direction"
                                                                                            ) {
                                                                                                const statusIcons = {
                                                                                                    Missed:
                                                                                                        "fa-solid fa-phone-missed",
                                                                                                    Cancelled:
                                                                                                        "fa-solid fa-phone-xmark",
                                                                                                    Failed:
                                                                                                        "fa-solid fa-phone-slash",
                                                                                                    transfer:
                                                                                                        "fa-solid fa-arrow-right-arrow-left",
                                                                                                };
                                                                                                const callIcons = {
                                                                                                    inbound: {
                                                                                                        icon:
                                                                                                            statusIcons[
                                                                                                            item.variable_DIALSTATUS
                                                                                                            ] ||
                                                                                                            "fa-phone-arrow-down-left",
                                                                                                        color:
                                                                                                            item.variable_DIALSTATUS ==
                                                                                                                "Missed" || item.variable_DIALSTATUS ==
                                                                                                                "Failed"
                                                                                                                ? "var(--funky-boy4)"
                                                                                                                : "var(--funky-boy3)",
                                                                                                        label: "Inbound",
                                                                                                    },
                                                                                                    outbound: {
                                                                                                        icon:
                                                                                                            statusIcons[
                                                                                                            item.variable_DIALSTATUS
                                                                                                            ] ||
                                                                                                            "fa-phone-arrow-up-right",
                                                                                                        color:
                                                                                                            item.variable_DIALSTATUS ==
                                                                                                                "Missed" || item.variable_DIALSTATUS ==
                                                                                                                "Failed"
                                                                                                                ? "var(--funky-boy4)"
                                                                                                                : "var(--color3)",
                                                                                                        label: "Outbound",
                                                                                                    },
                                                                                                    internal: {
                                                                                                        icon:
                                                                                                            statusIcons[
                                                                                                            item.variable_DIALSTATUS
                                                                                                            ] || "fa-headset",
                                                                                                        color:
                                                                                                            item.variable_DIALSTATUS ==
                                                                                                                "Missed" || item.variable_DIALSTATUS ==
                                                                                                                "Failed"
                                                                                                                ? "var(--funky-boy4)"
                                                                                                                : "var(--color2)",
                                                                                                        label: "Internal",
                                                                                                    },
                                                                                                };

                                                                                                const callType =
                                                                                                    callIcons[
                                                                                                    item["Call-Direction"]
                                                                                                    ] || callIcons.internal;

                                                                                                return (
                                                                                                    <td key={key}>
                                                                                                        <i
                                                                                                            className={`fa-solid ${callType.icon} me-1`}
                                                                                                            style={{
                                                                                                                color: callType.color,
                                                                                                            }}
                                                                                                        ></i>
                                                                                                        {callType.label}
                                                                                                    </td>
                                                                                                );
                                                                                            } else if (
                                                                                                key === "application_state"
                                                                                            ) {
                                                                                                return (
                                                                                                    <td key={key}>
                                                                                                        {[
                                                                                                            "intercept",
                                                                                                            "eavesdrop",
                                                                                                            "whisper",
                                                                                                            "barge",
                                                                                                        ].includes(
                                                                                                            item["application_state"]
                                                                                                        )
                                                                                                            ? item[
                                                                                                            "other_leg_destination_number"
                                                                                                            ]
                                                                                                            : item[
                                                                                                            "Caller-Callee-ID-Number"
                                                                                                            ]}{" "}
                                                                                                        {item[
                                                                                                            "application_state_name"
                                                                                                        ] &&
                                                                                                            `(${item["application_state_name"]})`}
                                                                                                    </td>
                                                                                                );
                                                                                            } else if (
                                                                                                key === "variable_billsec"
                                                                                            ) {
                                                                                                return (
                                                                                                    <td key={key}>
                                                                                                        {formatTime(
                                                                                                            item["variable_billsec"]
                                                                                                        )}
                                                                                                    </td>
                                                                                                );
                                                                                            } else if (
                                                                                                key === "call_cost" &&
                                                                                                item[key]
                                                                                            ) {
                                                                                                return <td>${item[key]}</td>;
                                                                                            } else {
                                                                                                return (
                                                                                                    <td key={key}>{item[key]}</td>
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                        return null;
                                                                                    })}

                                                                                    <>
                                                                                        {
                                                                                            filteredColumnForTable?.find((data) => data?.key == "customer_sentiment") &&
                                                                                            <td>
                                                                                                {cdrAIRes ? cdrAIRes?.find((data) => data.cdr_id == item.id)?.customer_sentiment : "N/A"}
                                                                                            </td>
                                                                                        }
                                                                                        {
                                                                                            filteredColumnForTable?.find((data) => data?.key == "call_summary") &&
                                                                                            <td>
                                                                                                {cdrAIRes?.find((data) => data.cdr_id == item.id)?.call_summary ? <button
                                                                                                    effect="ripple"
                                                                                                    className={`tableButton ms-0`}
                                                                                                    style={{
                                                                                                        height: "34px",
                                                                                                        width: "34px",
                                                                                                    }}
                                                                                                    onClick={() => setShowCustomerFeedback(cdrAIRes?.find((data) => data.cdr_id == item.id)?.call_summary)}
                                                                                                >
                                                                                                    <Tippy content={"View Summary"}>
                                                                                                        <i className="fa-solid fa-comment-dots"></i>
                                                                                                    </Tippy>
                                                                                                </button> : "N/A"}
                                                                                            </td>
                                                                                        }
                                                                                    </>

                                                                                </tr>
                                                                                {currentPlaying ===
                                                                                    item["recording_path"] &&
                                                                                    item["recording_path"] && (
                                                                                        <tr>
                                                                                            <td colSpan="17">
                                                                                                <div className="audio-container mx-2">
                                                                                                    <AudioWaveformCommon
                                                                                                        audioUrl={audioURL}
                                                                                                        peaksData={JSON.parse(
                                                                                                            item.peak_json
                                                                                                        )}
                                                                                                    />
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    )}
                                                                            </React.Fragment>
                                                                        );
                                                                    })}
                                                                </>
                                                            )}
                                                        </tbody>
                                                    </>
                                                ) : cdr?.data?.length === 0 && !loading ? (
                                                    <div>
                                                        <EmptyPrompt type="generic" />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className='mt-5'>
                                                            <div className='imgWrapper loader' style={{ width: '150px', height: '150px' }}>
                                                                <img src={require(`../../assets/images/ai.png`)} alt="Empty" className="w-100" />
                                                            </div>
                                                            <div className='text-center mt-3'>
                                                                <h5 style={{ color: 'var(--color-subtext)', fontWeight: 400 }}>Please search for a <b>call detail record</b> to display <span style={{ color: 'var(--ui-accent)' }}><b>results</b></span>.</h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </table>
                                        </div>
                                        <div className="tableHeader mb-3">
                                            {!loading && cdr && cdr?.data?.length > 0 ? (
                                                <PaginationComponent
                                                    pageNumber={(e) => setPageNumber(e)}
                                                    totalPage={cdr?.last_page}
                                                    from={(pageNumber - 1) * cdr?.per_page + 1}
                                                    to={cdr?.to}
                                                    total={cdr?.total}
                                                    defaultPage={pageNumber}
                                                />
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* {popUp ? (
                    <div className="popup">
                        <div className="container h-100">
                            <div className="row h-100 justify-content-center align-items-center">
                                <div className="row content col-xl-4">
                                    <div className="col-12 px-0">
                                        <div className="iconWrapper">
                                            <i className="fa-duotone fa-triangle-exclamation"></i>
                                        </div>
                                    </div>
                                    <div className="col-12 ps-0 pe-0 text-center">
                                        <h4 className="text-orange">Warning!</h4>
                                        <p>
                                            Are you sure, you want to block this number (
                                            {selectedNumberToBlock})?
                                        </p>
                                        <div className="mt-2 d-flex justify-content-center gap-2">
                                            <button
                                                disabled={loading}
                                                className="panelButton m-0"
                                                onClick={() => handleBlockNumber(selectedNumberToBlock)}
                                            >
                                                <span className="text">Confirm</span>
                                                <span className="icon">
                                                    <i className="fa-solid fa-check"></i>
                                                </span>
                                            </button>
                                            <button
                                                className="panelButton gray m-0 float-end"
                                                onClick={() => {
                                                    setPopUp(false);
                                                    setSelectedNumberToBlock(null);
                                                }}
                                            >
                                                <span className="text">Cancel</span>
                                                <span className="icon">
                                                    <i className="fa-solid fa-xmark"></i>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    ""
                )} */}
            </main>
            {
                showCustomerFeedback &&
                <div className="backdropContact" style={{ zIndex: 15 }}>
                    <div className="addNewContactPopup">
                        <div className="formRow px-0 pb-0 row">
                            <div className="col-xl-12">
                                <div className="content-comment">
                                    <div className="formLabel" style={{ maxWidth: '100%' }}>
                                        <label>{showCustomerFeedback}</label>
                                    </div>
                                </div>
                                <div className="col-xl-12 mt-2">
                                    <button className="panelButton gray mx-0" onClick={() => setShowCustomerFeedback()}>
                                        <span className="text">Close</span>
                                        <span className="icon">
                                            <i className="fa-solid fa-caret-left" />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default AICDRSearch;