import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ContentLoader from "../../Loader/ContentLoader";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import MusicPlayer from "../../CommonComponents/MusicPlayer";

function CdrReport() {
  const [loading, setLoading] = useState(true);
  const [cdr, setCdr] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const [currentPlaying, setCurrentPlaying] = useState(null); // For tracking the currently playing audio
  const [callDirection, setCallDirection] = useState("");
  const [callType, setCallType] = useState("");
  const [callOrigin, setCallOrigin] = useState("");
  const [debounceCallOrigin, setDebounceCallOrigin] = useState("");
  const [debounceCallOriginFlag, setDebounceCallOriginFlag] = useState("");
  const [callDestination, setCallDestination] = useState("");
  const [debounceCallDestination, setDebounceCallDestination] = useState("");
  const [debounceCallDestinationFlag, setDebounceCallDestinationFlag] =
    useState("");
  const [hangupCause, setHagupCause] = useState("");
  const [filterBy, setFilterBy] = useState("date");
  const [startDateFlag, setStartDateFlag] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDateFlag, setEndDateFlag] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (filterBy === "date" && startDateFlag !== "") {
      setStartDate(startDateFlag);
      setEndDate(startDateFlag);
    } else if (
      filterBy === "date_range" &&
      endDateFlag !== "" &&
      startDateFlag !== ""
    ) {
      setStartDate(startDateFlag);
      setEndDate(endDateFlag);
    }
  }, [startDateFlag, endDateFlag, filterBy]);

  useEffect(() => {
    let timer = setTimeout(() => {
      if (debounceCallOrigin.length >= 3) {
        setCallOrigin(debounceCallOrigin);
      } else if (
        debounceCallOrigin.length >= 0 &&
        debounceCallOrigin.length < 3
      ) {
        setCallOrigin("");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [debounceCallOrigin]);

  useEffect(() => {
    let timer = setTimeout(() => {
      if (debounceCallDestination.length >= 3) {
        setCallDestination(debounceCallDestination);
      } else if (
        debounceCallDestination.length >= 0 &&
        debounceCallDestination.length < 3
      ) {
        setCallDestination("");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [debounceCallDestination]);

  const handleCallOriginChange = (e) => {
    const newValue = e.target.value;
    // Allow only digits and validate length
    if (/^\d*$/.test(newValue) && newValue.length <= 5) {
      setDebounceCallOriginFlag(newValue);
      if (newValue.length >= 3) {
        setDebounceCallOrigin(newValue);
        setPageNumber(1);
      } else {
        setDebounceCallOrigin("");
      }
    }
  };
  const handleCallDestinationChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue) && newValue.length <= 5) {
      setDebounceCallDestinationFlag(newValue);
      if (newValue.length >= 3) {
        setDebounceCallDestination(newValue);
        setPageNumber(1);
      } else {
        setDebounceCallDestination("");
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    // build a dynamic url which include only the available params to make API call easy
    const buildUrl = (baseApiUrl, params) => {
      const queryParams = Object.entries(params)
        .filter(([key, value]) => value.length > 0)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");
      return queryParams ? `${baseApiUrl}&${queryParams}` : baseApiUrl;
    };
    const finalUrl = buildUrl(
      `/cdr?account=${account.account_id}&page=${pageNumber}`,
      {
        callDirection,
        application_state: callType,
        origin: callOrigin,
        destination: callDestination,
        start_date: startDate,
        end_date: endDate,
        hangupCause,
      }
    );

    async function getData() {
      if (account && account.account_id) {
        const apiData = await generalGetFunction(finalUrl);
        if (apiData?.status) {
          setLoading(false);
          setCdr(apiData.data);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
        navigate("/");
      }
    }
    getData();
  }, [
    account,
    navigate,
    pageNumber,
    callDirection,
    callType,
    callOrigin,
    callDestination,
    startDate,
    endDate,
    hangupCause,
  ]);

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="CDR Reports" />
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12" style={{ overflow: "auto" }}>
              <div className="tableContainer" style={{ minHeight: "auto" }}>
                <div className="d-flex justify-content-end">
                  <div className="formRow border-0">
                    <label className="formLabel text-start mb-0 w-100">
                      Date Filter
                    </label>
                    <select
                      className="formItem"
                      value={filterBy}
                      onChange={(e) => {
                        setFilterBy(e.target.value);
                        setStartDateFlag("");
                        setEndDateFlag("");
                      }}
                    >
                      <option value={"date"}>Only Date</option>
                      <option value={"date_range"}>Date Range</option>
                    </select>
                  </div>
                  {filterBy === "date" && (
                    <div className="formRow border-0">
                      <label className="formLabel text-start mb-0 w-100">
                        Choose Date
                      </label>
                      <input
                        type="date"
                        className="formItem"
                        max={new Date().toISOString().split("T")[0]}
                        value={startDateFlag}
                        onChange={(e) => {
                          setStartDateFlag(e.target.value);
                          setPageNumber(1);
                        }}
                      />
                    </div>
                  )}
                  {filterBy === "date_range" && (
                    <>
                      <div className="formRow border-0">
                        <label className="formLabel text-start mb-0 w-100">
                          From
                        </label>
                        <input
                          type="date"
                          className="formItem"
                          max={new Date().toISOString().split("T")[0]}
                          value={startDateFlag}
                          onChange={(e) => {
                            setStartDateFlag(e.target.value);
                            setPageNumber(1);
                          }}
                        />
                      </div>
                      <div className="formRow border-0">
                        <label className="formLabel text-start mb-0 w-100">
                          To
                        </label>
                        <input
                          type="date"
                          className="formItem"
                          max={new Date().toISOString().split("T")[0]}
                          value={endDateFlag}
                          onChange={(e) => {
                            setEndDateFlag(e.target.value);
                            setPageNumber(1);
                          }}
                          min={startDateFlag} // Prevent selecting an end date before the start date
                        />
                      </div>
                    </>
                  )}
                  {/* {filterBy === "date_range" && (
                  <div className="formRow border-0  ms-3">
                    <label className="title text-start mb-2 w-100">
                      Date Range Filter
                    </label>
                    <DatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => {
                        setDateRange(update);
                        setPageNumber(1);
                      }}
                      customInput={
                        <ExampleCustomInput className="formItem mb-0" />
                      }
                      isClearable={true}
                      maxDate={new Date()}
                    />
                  </div>
                )} */}
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
                  <div className="formRow border-0">
                    <label className="formLabel text-start mb-0 w-100">
                      Call Direction
                    </label>
                    <select
                      className="formItem"
                      onChange={(e) => {
                        setCallDirection(e.target.value);
                        setPageNumber(1);
                      }}
                      // onChange={(e) => setCallDirection(e.target.value), setPageNumber(1)}
                    >
                      <option value={""}>All Calls</option>
                      <option value={"inbound"}>Inbound Calls</option>
                      <option value={"outbound"}>Outbound Calls</option>
                      <option value={"local"}>Missed Calls</option>
                      <option value={"internal"}>Internal Calls</option>
                    </select>
                  </div>
                  <div className="formRow border-0">
                    <label className="formLabel text-start mb-0 w-100">
                      Call Type
                    </label>
                    <select
                      className="formItem"
                      onChange={(e) => {
                        setCallType(e.target.value);
                        setPageNumber(1);
                      }}
                    >
                      <option value={""}>All Calls</option>
                      <option value={"extension"}>Extension</option>
                      <option value={"voicemail"}>Voice Mail</option>
                      <option value={"callcenter"}>Call Center</option>
                      <option value={"ringgroup"}>Ring Group</option>
                    </select>
                  </div>
                  <div className="formRow border-0">
                    <label className="formLabel text-start mb-0 w-100">
                      Hangup Cause
                    </label>
                    <select
                      className="formItem"
                      onChange={(e) => {
                        setHagupCause(e.target.value);
                        setPageNumber(1);
                      }}
                    >
                      <option value={""}>All</option>
                      <option value={"SUCCESS"}>SUCCESS</option>
                      <option value={"BUSY"}>BUSY</option>
                      <option value={"NOANSWER"}>NOANSWER</option>
                      <option value={"NOT CONNECTED"}>NOT CONNECTED</option>
                      <option value={"USER_NOT_REGISTERED"}>
                        USER NOT REGISTERED
                      </option>
                      <option value={"SUBSCRIBER_ABSENT"}>
                        SUBSCRIBER_ABSENT
                      </option>
                      <option value={"CANCEL"}>CANCEL</option>
                    </select>
                  </div>
                  {/* <Link
                  to="#"
                  onClick={() => {
                    setAll(!all);
                    backToTop();
                  }}
                  effect="ripple"
                  className={all ? "toggleButton active" : "toggleButton"}
                >
                  All
                </Link>
                <Link
                  to="#"
                  onClick={() => {
                    setExtensions(!extensions);
                    backToTop();
                  }}
                  effect="ripple"
                  className={
                    extensions ? "toggleButton active" : "toggleButton"
                  }
                >
                  Extension
                </Link>
                <Link
                  to="#"
                  onClick={() => {
                    setCallCenter(!callCenter);
                    backToTop();
                  }}
                  effect="ripple"
                  className={
                    callCenter ? "toggleButton active" : "toggleButton"
                  }
                >
                  Call Center
                </Link>
                <Link
                  to="#"
                  onClick={() => {
                    setRingGroup(!ringGroup);
                    backToTop();
                  }}
                  effect="ripple"
                  className={ringGroup ? "toggleButton active" : "toggleButton"}
                >
                  Ring Group
                </Link> */}
                </div>
              </div>
              <div className="tableContainer">
                <table>
                  <thead>
                    <tr>
                      <th>Sr. no</th>
                      <th>Call Direction</th>
                      <th>Call Type</th>
                      <th>Origin</th>
                      <th>Destination</th>
                      <th>Destination Extension</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Recording</th>
                      <th>Duration</th>
                      <th>Hangup Cause</th>
                      <th>Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={99}>
                          <ContentLoader />
                        </td>
                      </tr>
                    ) : (
                      <>
                        {cdr.data &&
                          cdr.data.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{(pageNumber - 1) * 20 + (index + 1)}</td>
                                <td>{item["Call-Direction"]}</td>
                                <td>{item["application_state"]}</td>
                                <td>{item["variable_sip_from_user"]}</td>
                                <td>{item["variable_sip_to_user"]}</td>
                                <td>{item["application_state_to_ext"]}</td>
                                <td>
                                  {item["variable_start_stamp"].split(" ")[0]}
                                </td>
                                <td>
                                  {item["variable_start_stamp"].split(" ")[1]}
                                </td>
                                <td>
                                  {item["recording_path"] && (
                                    <MusicPlayer
                                      audioSrc={item["recording_path"]}
                                      isPlaying={
                                        currentPlaying ===
                                        item["recording_path"]
                                      }
                                      onPlay={() =>
                                        setCurrentPlaying(
                                          item["recording_path"]
                                        )
                                      }
                                      onStop={() => setCurrentPlaying(null)}
                                    />
                                  )}
                                </td>
                                <td>{item["variable_billsec"]}</td>
                                <td>
                                  {item["variable_DIALSTATUS"] === null
                                    ? "NOT CONNECTED"
                                    : item["variable_DIALSTATUS"] ===
                                      "NO_USER_RESPONSE"
                                    ? "BUSY"
                                    : item["variable_DIALSTATUS"]}
                                </td>
                                <td>{item["call_cost"]}</td>
                              </tr>
                            );
                          })}
                      </>
                    )}

                    {!loading && cdr && cdr.data.length === 0 ? (
                      <td colSpan={99}>
                        <EmptyPrompt name="Call" link="call" />
                      </td>
                    ) : (
                      ""
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div>
          {!loading && cdr && cdr.data.length > 0 ? (
            <PaginationComponent
              pageNumber={(e) => setPageNumber(e)}
              totalPage={cdr.last_page}
              from={(pageNumber - 1) * cdr.per_page + 1}
              to={cdr.to}
              total={cdr.total}
              defaultPage={pageNumber}
            />
          ) : (
            ""
          )}
        </div>
      </section>
    </main>
  );
}

export default CdrReport;
