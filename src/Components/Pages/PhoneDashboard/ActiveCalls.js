/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";
import Tippy from "@tippyjs/react";
import Select from "react-select";


/**
 * ActiveCalls
 * Displays and manages active calls based on the provided filter and WebRTC settings.
 * Filters calls by application state or direction, and provides functionalities
 * for call actions such as barge, intercept, eavesdrop, whisper, and hangup.
 * Updates call durations in real-time and supports user interactions through a UI table.
 *
 * @param {boolean} isWebrtc - Indicates if WebRTC is enabled.
 * @param {string} filter - The filter criteria for displaying calls ("all", "ringgroup", "callcenter", "internal", "inbound", "outbound").
 */

function ActiveCalls({ isWebrtc, filter }) {
  const hangUpButton = useRef();
  const activeCall = useSelector((state) => state.activeCall);
  const [filterCalls, setFilterCalls] = useState([]);
  useEffect(() => {
    if (filter === "all") {
      setFilterCalls(activeCall)
    } else if (filter === "ringgroup") {
      setFilterCalls(activeCall.filter((call) => call.application_state === "ringgroup"))
    } else if (filter === "callcenter") {
      setFilterCalls(activeCall.filter((call) => call.application_state === "callcenter"))
    } else if (filter === "internal") {
      setFilterCalls(activeCall.filter((call) => call.direction === "internal"))
    } else if (filter === "inbound") {
      setFilterCalls(activeCall.filter((call) => call.direction === "inbound"))
    } else if (filter === "outbound") {
      setFilterCalls(activeCall.filter((call) => call.direction === "outbound"))
    }
  }, [filter, activeCall])
  const [loading, setLoading] = useState(false);
  const [bargeStatus, setBargeStatus] = useState("disable");
  const [id, setId] = useState("");
  const [dest, setDest] = useState("")
  async function killCall(id) {
    setLoading(true);
    const apiData = await generalGetFunction(`/freeswitch/call-kill/${id}`);
    if (apiData?.status) {
      setLoading(false);
      toast.success(apiData.message);
    } else {
      setLoading(false);
      toast.error(apiData.message);
    }
  }

  async function bargeCall(id) {
    setLoading(true);
    const apiData = await generalGetFunction(`/freeswitch/call-barge/${id}`);
    if (apiData?.status) {
      setLoading(false);
      toast.success(apiData.message);
    } else {
      setLoading(false);
      toast.error(apiData.message);
    }
  }
  async function eavesdropCall(id, dest) {
    setLoading(true);
    const apiData = await generalGetFunction(
      `/freeswitch/call-eavesdrop/${id}/${dest}`
    );

    if (apiData?.status) {
      setLoading(false);

      toast.success(apiData.message);
    } else {
      setLoading(false);
      toast.error(apiData.message);
    }
  }
  async function interceptCall(id, dest) {
    setLoading(true);
    const apiData = await generalGetFunction(
      `/freeswitch/call-intercept/${id}/${dest}`
    );

    if (apiData?.status) {
      setLoading(false);

      toast.success(apiData.message);
    } else {
      setLoading(false);
      toast.error(apiData.message);
    }
  }

  async function whisper(id, dest, leg) {
    setLoading(true);
    const apiData = await generalGetFunction(
      `/freeswitch/call-whisper/${id}/${dest}/${leg}`
    );

    if (apiData?.status) {
      setLoading(false);

      toast.success(apiData.message);
    } else {
      setLoading(false);
      toast.error(apiData.message);
    }
  }

  useEffect(() => {
    if (bargeStatus === "barge") {
      bargeCall(id);
    } else if (bargeStatus === "intercept") {
      interceptCall(id, dest);
    } else if (bargeStatus === "eavesdrop") {
      eavesdropCall(id, dest);
    } else if (bargeStatus === "whisper-aleg") {
      whisper(id, dest, "eavesdrop_whisper_aleg=true")
    } else if (bargeStatus === "whisper-bleg") {
      whisper(id, dest, "eavesdrop_whisper_bleg=true")
    }
  }, [bargeStatus, id]);

  function extractLastNumber(inputString) {
    const regex = /(\d+)\s*$/; // Regular expression to match the last number after a space

    const match = inputString.match(regex);

    if (match) {
      return match[1]; // Return the matched number
    } else {
      return null;
    }
  }

  const convertDurationToSeconds = (duration) => {
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const [updatedData, setUpdatedData] = useState([]);
  const startTimestampsRef = useRef(new Map()); // Store start timestamps for each UUID
  const initialDurationsRef = useRef(new Map()); // Store initial durations from backend

  useEffect(() => {
    filterCalls.forEach((item) => {
      if (!startTimestampsRef.current.has(item.uuid)) {
        startTimestampsRef.current.set(item.uuid, Date.now());
        initialDurationsRef.current.set(item.uuid, convertDurationToSeconds(item.duration)); // Store initial duration
      }
    });

    const interval = setInterval(() => {
      setUpdatedData((prevData) => {
        return filterCalls.map((item) => {
          const startTimestamp = startTimestampsRef.current.get(item.uuid);
          const elapsedTime = Math.floor((Date.now() - startTimestamp) / 1000);
          const initialDuration = initialDurationsRef.current.get(item.uuid) || 0; // Get initial duration

          // Calculate the correct updated duration without double adding
          const newDuration = initialDuration + elapsedTime;

          // Keep other properties unchanged except realTimeDuration
          return {
            ...item,
            realTimeDuration: formatTime(newDuration),
          };
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [filterCalls]);


  // Custom Select FOR Active Call ACTIONS LIKE BARGE / INTERCEPT / ETC
  const allOptions = [
    {
      value: "disbale",
      label: <option value="disbale">Choose action</option>
    },
    {
      value: "barge",
      label: <div className="d-flex py-2 align-items-center"><button className="tableButton me-2 ms-0" style={{ backgroundColor: 'var(--funky-boy4)' }}><i className="fa-regular fa-phone-plus" /></button>Barge</div>,
    },
    {
      value: "intercept",
      label: <div className="d-flex py-2 align-items-center"><button className="tableButton me-2 ms-0 warning"><i className="fa-regular fa-object-intersect" /></button>Intercept</div>,
    },
    {
      value: "eavesdrop",
      label: <div className="d-flex py-2 align-items-center"><button className="tableButton me-2 ms-0 edit"><i className="fa-regular fa-head-side-headphones" /></button>Eavesdrop</div>,
    },
    {
      value: "whisper-bleg",
      label: <div className="d-flex py-2 align-items-center"><button className="tableButton me-2 ms-0" style={{ backgroundColor: 'var(--funky-boy3)' }}><i className="fa-regular fa-ear-deaf" /></button>Whisper caller</div>,
    },
    {
      value: "whisper-aleg",
      label: <div className="d-flex py-2 align-items-center"><button className="tableButton me-2 ms-0" style={{ backgroundColor: 'var(--funky-boy4)' }}><i className="fa-regular fa-phone-plus" /></button>Whisper callee</div>,
    }, {
      value: "kill-call",
      label: <div className="d-flex py-2 align-items-center"><button className="tableButton delete me-2 ms-0"><i className=" fa-solid fa-phone-slash"></i></button>Hang Up</div>
    }
  ]

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Call Started</th>
            <th>Did Tag</th>
            <th>Feature Tag</th>
            <th>CID Number</th>
            <th>Destination</th>
            {filter === "all" && <th>Direction</th>}
            <th>Duration</th>
            {isWebrtc !== false && <th>Action</th>}
            {/* {isWebrtc !== false && <th className="text-align">Hang Up</th>} */}
          </tr>
        </thead>
        <tbody>
          {filterCalls &&
            updatedData
              .filter(
                (call) =>
                  call.b_callstate === "ACTIVE" || call.b_callstate === "HELD"
              ).map
              ((item, key) => {
                return (
                  <tr style={{ backgroundColor: !isWebrtc && item?.application_state === "ringgroup" ? "#f8d7da" : !isWebrtc && item?.application_state === "callcenter" ? "#d1e7dd" : !isWebrtc && item?.direction === "inbound" ? "#fff3cd" : "" }}>
                    <td>{key + 1}</td>
                    <td>{item.created.split(" ")[1]}</td>
                    <td>
                      {item.did_tag}
                    </td>
                    <td>{item.feature_tag}</td>
                    <td>{item.cid_num}</td>
                    <td>{item.application_type === "inbound" ? item.b_presence_id?.split("@")[0] : item.dest}</td>
                    {filter === "all" && <td style={{ textTransform: "capitalize" }}>{item.direction}</td>}
                    <td>{item.realTimeDuration}</td>
                    {isWebrtc !== false && <td style={{ minWidth: '170px' }}>
                      {/* <select
                        className="formItem"
                        onChange={(e) => {
                          setBargeStatus(e.target.value);
                          setId(item.uuid);
                          setDest(item?.dest.includes("set:valet_ticket")
                            ? extractLastNumber(item?.accountcode)
                            : extractLastNumber(item?.dest))
                        }}
                      >
                        <option value="disbale">Choose action</option>
                        <option
                          value="barge"
                          onClick={() => bargeCall(item.uuid)}
                        >
                          Barge
                        </option>
                        <option
                          value="intercept"
                          onClick={() => interceptCall(item.uuid, item?.dest.includes("set:valet_ticket")
                            ? extractLastNumber(item?.accountcode)
                            : extractLastNumber(item?.dest))}
                        >
                          Intercept
                        </option>
                        <option
                          value="eavesdrop"
                          onClick={() => eavesdropCall(item.uuid, item?.dest.includes("set:valet_ticket")
                            ? extractLastNumber(item?.accountcode)
                            : extractLastNumber(item?.dest))}
                        >
                          Eavesdrop
                        </option>
                        <option
                          value="whisper-bleg"
                          onClick={() => eavesdropCall(item.uuid, item?.dest.includes("set:valet_ticket")
                            ? extractLastNumber(item?.accountcode)
                            : extractLastNumber(item?.dest))}
                        >
                          Whisper caller
                        </option>
                        <option
                          value="whisper-aleg"
                          onClick={() => eavesdropCall(item.uuid, item?.dest.includes("set:valet_ticket")
                            ? extractLastNumber(item?.accountcode)
                            : extractLastNumber(item?.dest))}
                        >
                          Whisper callee
                        </option>
                      </select> */}
                      <Select
                        onChange={(option) => {
                          if (!option) return;

                          if (option.value === "kill-call") {
                            killCall(item.uuid);
                          }

                          setBargeStatus(option.value);
                          setId(item.uuid);
                          setDest(
                            item?.dest?.includes("set:valet_ticket")
                              ? extractLastNumber(item?.accountcode)
                              : extractLastNumber(item?.dest)
                          );
                        }}
                        options={allOptions}
                        isSearchable
                        styles={customStyles}
                      />
                      {/* Separate Buttons instead of Select Box */}
                      {/* <div className="d-flex justify-content-between">
                        <Tippy content="Barge this Call">
                          <button className="tableButton" style={{ backgroundColor: 'var(--funky-boy4)' }}
                            onClick={() => {
                              setBargeStatus("barge");
                              setId(item.uuid);
                              setDest(item?.dest.includes("set:valet_ticket")
                                ? extractLastNumber(item?.accountcode)
                                : extractLastNumber(item?.dest))
                            }}
                          >
                            <i className="fa-regular fa-phone-plus" />
                          </button>
                        </Tippy>
                        <Tippy content="Intercept this Call">
                          <button className="tableButton warning"
                            onClick={() => {
                              setBargeStatus("intercept");
                              setId(item.uuid);
                              setDest(item?.dest.includes("set:valet_ticket")
                                ? extractLastNumber(item?.accountcode)
                                : extractLastNumber(item?.dest))
                            }}
                          >
                            <i className="fa-regular fa-object-intersect" />
                          </button>
                        </Tippy>
                        <Tippy content="Eavesdrop this Call">
                          <button className="tableButton edit"
                            onClick={() => {
                              setBargeStatus("eavesdrop");
                              setId(item.uuid);
                              setDest(item?.dest.includes("set:valet_ticket")
                                ? extractLastNumber(item?.accountcode)
                                : extractLastNumber(item?.dest))
                            }}
                          >
                            <i className="fa-regular fa-head-side-headphones" />
                          </button>
                        </Tippy>
                        <Tippy content="Whisper Caller of this Call">
                          <button className="tableButton"
                            onClick={() => {
                              setBargeStatus("whisper-bleg");
                              setId(item.uuid);
                              setDest(item?.dest.includes("set:valet_ticket")
                                ? extractLastNumber(item?.accountcode)
                                : extractLastNumber(item?.dest))
                            }}
                          >
                            <i className="fa-regular fa-ear-listen" />
                          </button>
                        </Tippy>
                        <Tippy content="Whisper Callee of this Call">
                          <button className="tableButton" style={{ backgroundColor: 'var(--funky-boy3)' }}
                            onClick={() => {
                              setBargeStatus("whisper-aleg");
                              setId(item.uuid);
                              setDest(item?.dest.includes("set:valet_ticket")
                                ? extractLastNumber(item?.accountcode)
                                : extractLastNumber(item?.dest))
                            }}
                          >
                            <i className="fa-regular fa-ear-deaf" />
                          </button>
                        </Tippy>
                        <Tippy content="Hangup / End this Call">
                          <button className="tableButton delete"
                            onClick={() => killCall(item.uuid)}
                          >
                            <i className=" fa-solid fa-phone-slash"></i>
                          </button>
                        </Tippy>
                      </div> */}
                    </td>}
                    {/* {isWebrtc !== false &&
                      <td ref={hangUpButton} onClick={() => killCall(item.uuid)} className="d-none">
                        <label
                          className="tableButton delete mx-auto"
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <i className=" fa-solid fa-phone-slash"></i>{" "}
                        </label>
                      </td>} */}
                  </tr>
                );
              })}
        </tbody>
      </table>
      {loading && <CircularLoader />}
    </>
  );
}

export default ActiveCalls;




// Custom styles for react-select
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    // border: '1px solid var(--color4)',
    border: "1px solid var(--color4);",
    borderRadius: "3px",
    backgroundColor: "var(--ele-color)",
    outline: "none",
    fontSize: "14px",
    width: "100%",
    minHeight: "35px",
    height: "35px",
    boxShadow: state.isFocused ? "none" : provided.boxShadow,
    "&:hover": {
      borderColor: "var(--ui-accent)",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "32px",
    padding: "0 6px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--form-input-text)",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0",
    color: "var(--form-input-text)",
  }),
  indicatorSeparator: (provided) => ({
    display: "none",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "32px",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "var(--form-input-text)",
    "&:hover": {
      color: "var(--ui-accent)",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    paddingLeft: "15px",
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: state.isSelected ? "var(--ui-accent)" : "transparent",
    "&:hover": {
      backgroundColor: "#0055cc",
      color: "#fff",
    },
    fontSize: "14px",
  }),
  menu: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
    backgroundColor: "var(--ele-color)",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    margin: 0,
    maxHeight: "150px",
    overflowY: "auto",
    color: "var(--form-input-text)",
  }),
};
