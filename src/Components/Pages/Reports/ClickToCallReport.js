import React, { useState } from 'react'
import CircularLoader from '../../Loader/CircularLoader';
import Header from '../../CommonComponents/Header';
import { Navigate } from 'react-router-dom';
import { backToTop, featureUnderdevelopment } from '../../GlobalFunction/globalFunction';
import ExportPopUp from '../WebRtc/ExportPopUp';
import { useSelector } from 'react-redux';
import Comments from '../WebRtc/Comments';
import Duplicates from '../WebRtc/Duplicates';

const ClickToCallReport = () => {
    const [exportPopup, setExportPopup] = useState(false);
    const [popUp, setPopUp] = useState(false);
    const [selectedNumberToBlock, setSelectedNumberToBlock] = useState();
    const [advanceSearch, setAdvanceSearch] = useState();
    const [filteredKeys, setFilteredKeys] = useState([]);
    const [filteredColumnForTable, setFilteredColumnForTable] = useState([]);
    const [selectedCdr, setSelectedCdr] = useState("");
    const [showComment, setShowComment] = useState(false);
    const [showDuplicatePopUp, setShowDuplicatePopUp] = useState(false);
    const [duplicatePopUpData, setDuplicatePopUpData] = useState({});

    const [circularLoader, setCircularLoader] = useState(true);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [refreshState, setRefreshState] = useState(false);
    const [advanceSearchPopup, setAdvanceSearchPopup] = useState(false)

    const account = useSelector((state) => state.account);
    const slugPermissions = useSelector((state) => state?.permissions);

    const handleBlockNumber = () => {

    }

    const resetAllFilters = () => {

    }

    const handleRefreshBtnClicked = () => {

    }

    const getAdvanceSearch = () => {

    }

    const exportToCSV = () => {

    }

    return (
        <>
            {loading && <CircularLoader />}
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid px-0 position-relative">
                        <Header title={`Click To Call`} />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4> Click To Call
                                                    <button
                                                        className="clearButton"
                                                        onClick={handleRefreshBtnClicked}
                                                        disabled={refreshState}
                                                    >
                                                        <i
                                                            className={
                                                                refreshState
                                                                    ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                                                    : "fa-regular fa-arrows-rotate fs-5"
                                                            }
                                                        ></i>
                                                    </button>
                                                </h4>
                                                <p>
                                                    Here are all the Click To Call List
                                                </p>
                                            </div>
                                            <div className="buttonGroup">
                                                <button
                                                    effect="ripple"
                                                    className="panelButton gray"
                                                    onClick={() => {
                                                        Navigate(-1);
                                                        backToTop();
                                                    }}
                                                >
                                                    <span className="text">Back</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={resetAllFilters}
                                                    className="panelButton delete"
                                                    disabled={loading}
                                                >
                                                    <span className="text">Reset</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-trash" />
                                                    </span>
                                                </button>
                                                <div className="dropdown">
                                                    <button
                                                        effect="ripple"
                                                        className="panelButton"
                                                        disabled={loading}
                                                        onClick={() => setExportPopup(true)}
                                                    >
                                                        <span className="text">Export</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-file-export"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-12"
                                        style={{ overflow: "auto", padding: "10px 20px 0" }}
                                    >
                                        <div className="tableHeader">
                                            <div className="showEntries">
                                                <label>Show</label>
                                                <select
                                                    className="formItem"
                                                    value={itemsPerPage}
                                                    onChange={(e) => setItemsPerPage(e.target.value)}
                                                >
                                                    <option value={20}>20</option>
                                                    <option value={30}>30</option>
                                                    <option value={40}>40</option>
                                                    <option value={50}>50</option>
                                                    <option value={60}>60</option>
                                                    <option value={70}>70</option>
                                                    <option value={80}>80</option>
                                                    <option value={100}>100</option>
                                                </select>
                                                <label>entries</label>
                                            </div>
                                            <div>
                                                <button
                                                    className="ms-2 btn btn-success-light btn-wave new_buttonStyle"
                                                    style={{ maxWidth: "initial" }}
                                                    onClick={() => setAdvanceSearchPopup(true)}
                                                >
                                                    <span>Advanced Search</span>
                                                    <i className="fa-solid fa-magnifying-glass" />
                                                </button>
                                            </div>
                                        </div>
                                        {/* <div className="tableHeader">
                                            <div className="d-flex justify-content-start flex-wrap">
                                                {filteredKeys.includes("variable_start_stamp") && (
                                                    <>
                                                        {" "}
                                                        <div className="formRow border-0">
                                                            <label className="formLabel text-start mb-0 w-100">
                                                                Date Filter
                                                            </label>
                                                            <select
                                                                className="formItem"
                                                                // value={filterBy}
                                                                onChange={(e) => {
                                                                    // setFilterBy(e.target.value);
                                                                    // setStartDateFlag("");
                                                                    // setEndDateFlag("");
                                                                }}
                                                            >
                                                                <option value={"date"}>Single Date</option>
                                                                <option value={"date_range"}>Date Range</option>
                                                                <option value={"7_days"}>Last 7 Days</option>
                                                                <option value={"1_month"}>Last 1 Month</option>
                                                                <option value={"3_month"}>Last 3 Months</option>
                                                            </select>
                                                        </div>
                                                        {filterBy === "date" && (
                                                            <div className="formRow border-0">
                                                                <label className="formLabel text-start mb-0 w-100">
                                                                    Choose Date And / Or Time
                                                                </label>
                                                                <div className="d-flex w-100">
                                                                    <input
                                                                        type="date"
                                                                        className="formItem"
                                                                        max={
                                                                            new Date()?.toISOString()?.split("T")[0]
                                                                        }
                                                                        value={startDateFlag}
                                                                        onChange={(e) => {
                                                                            // setStartDateFlag(e.target.value);
                                                                            // setPageNumber(1);
                                                                        }}
                                                                    />
                                                                    <input
                                                                        type="time"
                                                                        className="formItem ms-2"
                                                                        // value={timeFlag.startTime}
                                                                        // onChange={(e) => {
                                                                        //     setTimeFlag((prev) => ({
                                                                        //         ...prev,
                                                                        //         startTime: `${e.target.value}:00`,
                                                                        //     }));
                                                                        //     setPageNumber(1);
                                                                        // }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                        {filterBy === "date_range" && (
                                                            <>
                                                                <div className="formRow border-0">
                                                                    <label className="formLabel text-start mb-0 w-100">
                                                                        From
                                                                    </label>
                                                                    <div className="d-flex w-100">
                                                                        <input
                                                                            type="date"
                                                                            className="formItem"
                                                                            max={
                                                                                new Date()?.toISOString()?.split("T")[0]
                                                                            }
                                                                            // value={startDateFlag}
                                                                            // onChange={(e) => {
                                                                            //     setStartDateFlag(e.target.value);
                                                                            //     setPageNumber(1);
                                                                            // }}
                                                                        />
                                                                        <input
                                                                            type="time"
                                                                            className="formItem ms-2"
                                                                            // value={timeFlag.startTime}
                                                                            // onChange={(e) => {
                                                                            //     setTimeFlag((prev) => ({
                                                                            //         ...prev,
                                                                            //         startTime: `${e.target.value}:00`,
                                                                            //     }));
                                                                            //     setPageNumber(1);
                                                                            // }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="formRow border-0">
                                                                    <label className="formLabel text-start mb-0 w-100">
                                                                        To
                                                                    </label>
                                                                    <div className="d-flex w-100">
                                                                        <input
                                                                            type="date"
                                                                            className="formItem"
                                                                            max={
                                                                                new Date()?.toISOString()?.split("T")[0]
                                                                            }
                                                                            // value={endDateFlag}
                                                                            // onChange={(e) => {
                                                                            //     setEndDateFlag(e.target.value);
                                                                            //     setPageNumber(1);
                                                                            // }}
                                                                            // min={startDateFlag} // Prevent selecting an end date before the start date
                                                                        />
                                                                        <input
                                                                            type="time"
                                                                            className="formItem ms-2"
                                                                            // value={timeFlag.endTime}
                                                                            // onChange={(e) => {
                                                                            //     setTimeFlag((prev) => ({
                                                                            //         ...prev,
                                                                            //         endTime: `${e.target.value}:00`,
                                                                            //     }));
                                                                            //     setPageNumber(1);
                                                                            // }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                                {filteredKeys?.includes("variable_sip_from_user") && (
                                                    <div className="formRow border-0">
                                                        <label className="formLabel text-start mb-0 w-100">
                                                            Call Origin
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="formItem"
                                                            // value={debounceCallOrigin}
                                                            value={debounceCallOriginFlag}
                                                            // onChange={(e) => {
                                                            //   setDebounceCallOrigin(e.target.value);
                                                            //   setPageNumber(1);
                                                            // }}
                                                            // min={100}
                                                            // max={99999}
                                                            onChange={handleCallOriginChange}
                                                        />
                                                    </div>
                                                )}
                                                {filteredKeys.includes("variable_sip_to_user") && (
                                                    <div className="formRow border-0">
                                                        <label className="formLabel text-start mb-0 w-100">
                                                            Call Destination
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="formItem"
                                                            value={debounceCallDestinationFlag}
                                                            // value={debounceCallDestination}
                                                            // onChange={(e) => {
                                                            //   setDebounceCallDestination(e.target.value);
                                                            //   setPageNumber(1);
                                                            // }}
                                                            onChange={handleCallDestinationChange}
                                                        />
                                                    </div>
                                                )}

                                                {page === "all" &&
                                                    filteredKeys.includes("variable_sip_to_user") ? (
                                                    <>
                                                        <div className="formRow border-0 flex-column">
                                                            <label className="formLabel text-start mb-0 w-100">
                                                                Call Direction
                                                            </label>
                                                            <div className="dropdown">
                                                                <button
                                                                    className="formItem"
                                                                    type="button"
                                                                    data-bs-toggle="dropdown"
                                                                    data-bs-auto-close="outside"
                                                                    style={{ width: "160px" }}
                                                                >
                                                                    Choose Filters
                                                                </button>
                                                                <ul className="dropdown-menu">
                                                                    {callDirectionOptions?.map((option) => (
                                                                        <li key={option.value}>
                                                                            <div className="dropdown-item" href="#">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={callDirection?.includes(option?.value)}
                                                                                    onChange={() => {
                                                                                        setCallDirection((prev) =>
                                                                                            prev.includes(option.value)
                                                                                                ? prev.filter((val) => val !== option.value)
                                                                                                : [...prev, option.value]
                                                                                        );
                                                                                        setPageNumber(1);
                                                                                    }}
                                                                                />
                                                                                <span className="text-dark ms-2">
                                                                                    {option.label}
                                                                                </span>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="formRow border-0 flex-column">
                                                            <label className="formLabel text-start mb-0 w-100">
                                                                Call Type
                                                            </label>
                                                            <div className="dropdown">
                                                                <button
                                                                    className="formItem"
                                                                    type="button"
                                                                    data-bs-toggle="dropdown"
                                                                    data-bs-auto-close="outside"
                                                                    style={{ width: "160px" }}
                                                                >
                                                                    Choose Filters
                                                                </button>
                                                                <ul className="dropdown-menu">
                                                                    {callTypeOptions?.map((option) => (
                                                                        <li key={option.value}>
                                                                            <div className="dropdown-item" href="#">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={callType?.includes(option?.value)}
                                                                                    onChange={() => {
                                                                                        setCallType((prev) =>
                                                                                            prev.includes(option.value)
                                                                                                ? prev.filter((val) => val !== option.value)
                                                                                                : [...prev, option.value]
                                                                                        );
                                                                                        setPageNumber(1);
                                                                                    }}
                                                                                />
                                                                                <span className="text-dark ms-2">
                                                                                    {option.label}
                                                                                </span>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                                {page === "billing" ||
                                                    !filteredKeys.includes("Hangup-Cause") ? (
                                                    ""
                                                ) : (
                                                    <>
                                                        <div className="formRow border-0 flex-column">
                                                            <label className="formLabel text-start mb-0 w-100">
                                                                Hangup Status
                                                            </label>
                                                            <div className="dropdown">
                                                                <button
                                                                    className="formItem"
                                                                    type="button"
                                                                    data-bs-toggle="dropdown"
                                                                    data-bs-auto-close="outside"
                                                                    style={{ width: "160px" }}
                                                                >
                                                                    Choose Filters
                                                                </button>
                                                                <ul className="dropdown-menu">
                                                                    {hangupCauseOptions?.map((option) => (
                                                                        <li key={option.value}>
                                                                            <div className="dropdown-item" href="#">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={hangupCause?.includes(option?.value)}
                                                                                    onChange={() => {
                                                                                        setHagupCause((prev) =>
                                                                                            prev.includes(option.value)
                                                                                                ? prev.filter((val) => val !== option.value)
                                                                                                : [...prev, option.value]
                                                                                        );
                                                                                        setPageNumber(1);
                                                                                    }}
                                                                                />
                                                                                <span className="text-dark ms-2">
                                                                                    {option.label}
                                                                                </span>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        {filteredKeys.includes("Hangup-Cause") && (
                                                            <div className="formRow border-0 flex-column">
                                                                <label className="formLabel text-start mb-0 w-100">
                                                                    Hangup Cause
                                                                </label>
                                                                <div className="dropdown">
                                                                    <button
                                                                        className="formItem"
                                                                        type="button"
                                                                        data-bs-toggle="dropdown"
                                                                        data-bs-auto-close="outside"
                                                                        style={{ width: "160px" }}
                                                                    >
                                                                        Choose Filters
                                                                    </button>
                                                                    <ul className="dropdown-menu">
                                                                        {hangupStatusOptions?.map((option) => (
                                                                            <li key={option.value}>
                                                                                <div className="dropdown-item" href="#">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={hangupStatus?.includes(option?.value)}
                                                                                        onChange={() => {
                                                                                            setHangupStatus((prev) =>
                                                                                                prev.includes(option.value)
                                                                                                    ? prev.filter((val) => val !== option.value)
                                                                                                    : [...prev, option.value]
                                                                                            );
                                                                                            setPageNumber(1);
                                                                                        }}
                                                                                    />
                                                                                    <span className="text-dark ms-2">
                                                                                        {option.label}
                                                                                    </span>
                                                                                </div>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>

                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                                <div className="formRow border-0 ">
                                                    <label className="formLabel text-start mb-0 w-100">
                                                        Show/hide Column
                                                    </label>
                                                    <div className="dropdown">
                                                        <button
                                                            className="formItem"
                                                            type="button"
                                                            data-bs-toggle="dropdown"
                                                            data-bs-auto-close="outside"
                                                            style={{ width: "160px" }}
                                                        >
                                                            Choose Columns
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            {columnsOptions?.map((option) => (
                                                                <li key={option.value}>
                                                                    <div className="dropdown-item" href="#">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedColumn.includes(
                                                                                option.value
                                                                            )}
                                                                            onChange={(event) => {
                                                                                const isChecked = event.target.checked;
                                                                                let updatedValues = [];

                                                                                if (isChecked) {
                                                                                    updatedValues = [
                                                                                        ...selectedColumn,
                                                                                        option.value,
                                                                                    ];
                                                                                } else {
                                                                                    updatedValues = selectedColumn.filter(
                                                                                        (value) => value !== option.value
                                                                                    );
                                                                                }

                                                                                const filteredArrayLocal =
                                                                                    columnOriginalSequence?.filter(
                                                                                        (value) =>
                                                                                            updatedValues.includes(value)
                                                                                    );
                                                                                setSelectedColumn(updatedValues);
                                                                                setFilteredColumns(filteredArrayLocal);

                                                                                const filteredVallocal =
                                                                                    originalColumnSequenceForTable?.filter(
                                                                                        (data) =>
                                                                                            updatedValues.includes(
                                                                                                data?.formattedKey
                                                                                            )
                                                                                    );
                                                                                setFilteredColumnForTable(
                                                                                    filteredVallocal
                                                                                );
                                                                            }}
                                                                        />
                                                                        <span className="text-dark ms-2">
                                                                            {option.label}
                                                                        </span>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="tableContainer">
                                            {loading ? (
                                                // <SkeletonTableLoader
                                                //   col={
                                                //     page === "billing"
                                                //       ? showKeys.length
                                                //       : showKeys.length + 1
                                                //   }
                                                //   row={12}
                                                // />
                                                <ThreeDotedLoader />
                                            ) :
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
                                                                <>
                                                                    {!checkViewSidebar(
                                                                        page == "ringgroup" ? "RingGroup" : page == "callcenter" ? "CallCenterQueue" : "ChannelHangupComplete",
                                                                        slugPermissions,
                                                                        account?.sectionPermissions,
                                                                        account?.permissions,
                                                                        "read"
                                                                    ) || noPermissionToRead ? <tr><td colSpan={99} className="text-center">You dont have any permission</td></tr> :
                                                                        cdr?.data?.map((item, index) => {
                                                                            const isBlocked = callBlock?.some(
                                                                                (block) => {
                                                                                    if (
                                                                                        item["Call-Direction"] === "inbound"
                                                                                    ) {
                                                                                        return (
                                                                                            item["variable_sip_from_user"] ===
                                                                                            block.number
                                                                                        );
                                                                                    } else if (
                                                                                        item["Call-Direction"] === "outbound"
                                                                                    ) {
                                                                                        return (
                                                                                            item["variable_sip_to_user"] ===
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
                                                                                            const key = val?.key;
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
                                                                                                        CANCEL: "fa-solid fa-phone-missed",
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
                                                                                                                statusIcons[item.variable_DIALSTATUS] || "fa-phone-arrow-down-left",
                                                                                                            color:
                                                                                                                item.variable_DIALSTATUS == "Missed" ||
                                                                                                                    item.variable_DIALSTATUS == "Failed" ||
                                                                                                                    item.variable_DIALSTATUS == "CANCEL"
                                                                                                                    ? "var(--funky-boy4)"
                                                                                                                    : "var(--funky-boy3)",
                                                                                                            label: "Inbound",
                                                                                                        },
                                                                                                        outbound: {
                                                                                                            icon:
                                                                                                                statusIcons[item.variable_DIALSTATUS] || "fa-phone-arrow-up-right",
                                                                                                            color:
                                                                                                                item.variable_DIALSTATUS == "Missed" ||
                                                                                                                    item.variable_DIALSTATUS == "Failed" ||
                                                                                                                    item.variable_DIALSTATUS == "CANCEL"
                                                                                                                    ? "var(--funky-boy4)"
                                                                                                                    : "var(--color3)",
                                                                                                            label: "Outbound",
                                                                                                        },
                                                                                                        internal: {
                                                                                                            icon: statusIcons[item.variable_DIALSTATUS] || "fa-headset",
                                                                                                            color:
                                                                                                                item.variable_DIALSTATUS == "Missed" ||
                                                                                                                    item.variable_DIALSTATUS == "Failed" ||
                                                                                                                    item.variable_DIALSTATUS == "CANCEL"
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
                                                                                                        <td key={key} id={key}>{item[key]}</td>
                                                                                                    );
                                                                                                }
                                                                                            }
                                                                                            return null;
                                                                                        })}
                                                                                        {page !== "billing" && (
                                                                                            <>
                                                                                                {filteredColumnForTable?.find(
                                                                                                    (data) => data?.key == "Block"
                                                                                                ) && (
                                                                                                        <td>
                                                                                                            {item["Call-Direction"] ===
                                                                                                                "inbound" ||
                                                                                                                item["Call-Direction"] ===
                                                                                                                "outbound" ? (
                                                                                                                <button
                                                                                                                    disabled={isBlocked}
                                                                                                                    effect="ripple"
                                                                                                                    className={`tableButton delete ${isBlocked
                                                                                                                        ? "bg-danger text-white"
                                                                                                                        : ""
                                                                                                                        } ms-0`}
                                                                                                                    style={{
                                                                                                                        height: "34px",
                                                                                                                        width: "34px",
                                                                                                                    }}
                                                                                                                    onClick={() => {
                                                                                                                        setSelectedNumberToBlock(
                                                                                                                            item[
                                                                                                                                "Call-Direction"
                                                                                                                            ] === "inbound"
                                                                                                                                ? item[
                                                                                                                                "variable_sip_from_user"
                                                                                                                                ]
                                                                                                                                : item[
                                                                                                                                    "Call-Direction"
                                                                                                                                ] === "outbound"
                                                                                                                                    ? item[
                                                                                                                                    "variable_sip_to_user"
                                                                                                                                    ]
                                                                                                                                    : "N/A"
                                                                                                                        );
                                                                                                                        setPopUp(true);
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <Tippy
                                                                                                                        content={
                                                                                                                            isBlocked
                                                                                                                                ? "Blocked"
                                                                                                                                : "Block"
                                                                                                                        }
                                                                                                                    >
                                                                                                                        <i className="fa-solid fa-ban"></i>
                                                                                                                    </Tippy>
                                                                                                                </button>
                                                                                                            ) : (
                                                                                                                ""
                                                                                                            )}
                                                                                                        </td>
                                                                                                    )}
                                                                                                {filteredColumnForTable?.find(
                                                                                                    (data) => data?.key == "Note"
                                                                                                ) && (
                                                                                                        <td>
                                                                                                            <button
                                                                                                                effect="ripple"
                                                                                                                className={`tableButton ms-0`}
                                                                                                                style={{
                                                                                                                    height: "34px",
                                                                                                                    width: "34px",
                                                                                                                }}
                                                                                                                onClick={() => {
                                                                                                                    setSelectedCdr(item.id);
                                                                                                                }}
                                                                                                            >
                                                                                                                <Tippy
                                                                                                                    content={"View Note"}
                                                                                                                >
                                                                                                                    <i className="fa-solid fa-comment-dots"></i>
                                                                                                                </Tippy>
                                                                                                            </button>
                                                                                                        </td>
                                                                                                    )}
                                                                                                {filteredColumnForTable?.find(
                                                                                                    (data) =>
                                                                                                        data?.key == "Duplicate"
                                                                                                ) && (
                                                                                                        <td>
                                                                                                            {item?.duplicated == 1 && (
                                                                                                                <button
                                                                                                                    className={`tableButton edit ms-0`}
                                                                                                                    onClick={() =>
                                                                                                                        duplicateColumn(item)
                                                                                                                    }
                                                                                                                >
                                                                                                                    <Tippy
                                                                                                                        content={
                                                                                                                            "View Duplicate"
                                                                                                                        }
                                                                                                                    >
                                                                                                                        <i className="fa-solid fa-clone"></i>
                                                                                                                    </Tippy>
                                                                                                                </button>
                                                                                                            )}
                                                                                                        </td>
                                                                                                    )}
                                                                                            </>
                                                                                        )}
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
                                                            </tbody>
                                                        </>
                                                    ) : cdr?.data?.length === 0 && !loading ? (
                                                        <div>
                                                            <EmptyPrompt type="generic" />
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                </table>
                                            }
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
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {popUp ? (
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
                )}
                {exportPopup && (
                    <ExportPopUp
                        filteredKeys={filteredKeys}
                        page={{}}
                        setExportPopup={setExportPopup}
                        setLoading={setLoading}
                        exportToCSV={exportToCSV}
                        itemsPerPage={itemsPerPage}
                        account={account}
                        setCircularLoader={setCircularLoader}
                        filteredColumnForTable={filteredColumnForTable}
                    />
                )}
            </main>
            {/* Note Popup */}
            {selectedCdr !== "" && (
                <Comments
                    id={selectedCdr}
                    setId={setSelectedCdr}
                    setShowComment={setShowComment}
                />
            )}
            {showDuplicatePopUp && (
                <Duplicates
                    duplicatePopUpData={duplicatePopUpData}
                    setShowDuplicatePopUp={setShowDuplicatePopUp}
                    id={selectedCdr}
                    setId={setSelectedCdr}
                />
            )}
            {advanceSearchPopup && (
                <div className="backdropContact">
                    <div className="addNewContactPopup">
                        <button
                            className="clearButton2 xl"
                            onClick={() => setAdvanceSearchPopup(false)}
                            style={{ position: "absolute", top: "10px", right: "10px" }}
                        >
                            <i className="fa-light fa-xmark" />
                        </button>
                        <div className="row">
                            <div className="col-12 heading mb-0">
                                <i className="fa-light fa-magnifying-glass"></i>
                                <h5>Advance Search</h5>
                            </div>
                            <div>
                                <div className="searchBoxWrapper">
                                    <input
                                        className="searchBar formItem"
                                        type="text"
                                        value={advanceSearch}
                                        onChange={(e) => setAdvanceSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="row mx-auto">
                                <div className="formRow border-0">
                                    <label className="formLabel text-start mb-0 w-100">From</label>
                                    <div className="d-flex w-100">
                                        <input
                                            type="date"
                                            className="formItem"
                                            max="2025-04-30"
                                            value=""
                                            onChange={() => featureUnderdevelopment()}
                                        />
                                        <input
                                            type="time"
                                            className="formItem ms-2"
                                            value=""
                                            onChange={() => featureUnderdevelopment()}
                                        />
                                    </div>
                                </div>
                                <div className="formRow border-0">
                                    <label className="formLabel text-start mb-0 w-100">To</label>
                                    <div className="d-flex w-100">
                                        <input
                                            type="date"
                                            className="formItem"
                                            max="2025-04-30"
                                            value=""
                                            onChange={() => featureUnderdevelopment()}
                                        />
                                        <input
                                            type="time"
                                            className="formItem ms-2"
                                            value=""
                                            onChange={() => featureUnderdevelopment()}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-12 mt-3">
                                <button
                                    className="panelButton mx-auto"
                                    onClick={() => getAdvanceSearch()}
                                >
                                    <span className="text">Search</span>
                                    <span className="icon">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ClickToCallReport