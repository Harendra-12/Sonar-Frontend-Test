import React from 'react'
import { useState } from 'react';
import { differenceInDays } from 'date-fns';
import { toast } from 'react-toastify';
import { generalGetFunction } from '../../GlobalFunction/globalFunction';
import { useEffect } from 'react';

export default function ExportPopUp(
  {
    filteredKeys,
    page,
    setExportPopup,
    setLoading,
    exportToCSV,
    itemsPerPage,
    account,
    setCircularLoader,
    filteredColumnForTable
  }) {
  const [filterBy, setFilterBy] = useState("date");
  const [startDateFlag, setStartDateFlag] = useState("");
  const [endDateFlag, setEndDateFlag] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [debounceCallOriginFlag, setDebounceCallOriginFlag] = useState("");
  const [debounceCallOrigin, setDebounceCallOrigin] = useState("");
  const [debounceCallDestination, setDebounceCallDestination] = useState("");
  const [debounceCallDestinationFlag, setDebounceCallDestinationFlag] =
    useState("");
  const [hangupStatus, setHangupStatus] = useState("");
  const [hangupCause, setHagupCause] = useState("");
  const [callType, setCallType] = useState("");
  const [updatedQueryparams, setUpdatedQueryparams] = useState("");
  const [callDirection, setCallDirection] = useState("");
  const [startDate, setStartDate] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exportChecked, setExportChecked] = useState("CSV")
  const [isExcelLoading, setIsExcelLoading] = useState(false)

  useEffect(() => {
    if (filterBy === "date" && startDateFlag !== "") {
      setCreatedAt(startDateFlag);
      setStartDate("");
      setEndDate("");
    } else if (
      filterBy === "date_range" &&
      endDateFlag !== "" &&
      startDateFlag !== ""
    ) {
      setStartDate(startDateFlag);
      setEndDate(endDateFlag);
      setCreatedAt("");
    }
  }, [startDateFlag, endDateFlag, filterBy]);


  useEffect(() => {
    if (
      filterBy === "7_days" ||
      filterBy === "1_month"
    ) {
      // featureUnderdevelopment();
      getDateRange(filterBy);
    }
  }, [filterBy]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getDateRange = (period) => {
    const currentDate = new Date();
    const formattedCurrentDate = formatDate(currentDate);

    let startDate = new Date();

    switch (period) {
      case "7_days":
        startDate.setDate(currentDate.getDate() - 7);
        break;

      case "1_month":
        startDate.setMonth(currentDate.getMonth() - 1);
        break;

      case "3_month":
        startDate.setMonth(currentDate.getMonth() - 3);
        break;

      default:
        throw new Error(
          "Invalid period. Use 'last7days', 'last1month', or 'last3months'."
        );
    }
    const formattedStartDate = formatDate(startDate);
    setStartDate(formattedStartDate);

    setEndDate(formattedCurrentDate);

    // return { currentDate: formattedCurrentDate, startDate: formattedStartDate };
  };





  const filterExportedData = () => {

    const buildUrl = (params) => {
      const queryParams = Object.entries(params)
        .filter(([key, value]) => value.length > 0)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
      console.log({ queryParams })
      //  setUpdatedQueryparams(()=>queryParams);
      return queryParams;
    };

    return buildUrl(
      {
        "Call-Direction": callDirection,
        application_state:
          page === "all"
            ? callType
            : page === "billing"
              ? "pstn"
              : page === "callrecording"
                ? callType
                : page,
        variable_sip_from_user: debounceCallOriginFlag,
        variable_sip_to_user: debounceCallDestinationFlag,
        start_date: startDate,
        end_date: endDate,
        variable_DIALSTATUS: hangupCause,
        "Hangup-Cause": hangupStatus,
        call_cost: page === "billing" ? "give" : "",
        created_at: createdAt,
      }
    );
  };


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

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDateFlag(newStartDate);
    setPageNumber(1);


    if (endDateFlag) {
      const daysDifference = differenceInDays(new Date(endDateFlag), new Date(newStartDate));
      if (daysDifference > 31) {
        setEndDateFlag(''); // Reset end date if range exceeds 31 days
        toast.error('Date range cannot exceed 31 days.');
      }
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDateFlag(newEndDate);
    setPageNumber(1);


    if (startDateFlag) {
      const daysDifference = differenceInDays(new Date(newEndDate), new Date(startDateFlag));
      if (daysDifference > 31) {
        toast.error('Date range cannot exceed 31 days.');
        setEndDateFlag(''); // Reset end date
        return;
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
  const handleExport = async () => {
    const queryParams = filterExportedData()
    // if (filterBy)
    // setLoading(true);

    // const selectedKeysObject = filteredColumnForTable?.reduce((acc, data) => {
    //   acc[data?.key] = true;
    //   return acc;
    // }, {});

    setIsExcelLoading(true)
    if (exportChecked === "mail") {
      try {
        const res = await generalGetFunction(
          `cdr?${queryParams}&export_sent=true`
        );
        if (res.status) {
          const updatedData = res?.data?.map(({ peak_json, ...rest }) => rest);
          exportToCSV(updatedData);
          setLoading(false);
        }
        setExportPopup(false)
        toast.success("Data Successfully Exported.");
      } catch (error) {
        setExportPopup(false)
        toast.error("Error during export:", error?.message);
      }
    } else {
      try {
        const res = await generalGetFunction(
          `cdr?${queryParams}&export=true`
        );
        if (res.status) {

          // const updatedData = res?.data?.map(obj => {
          //   return Object.fromEntries(
          //     Object.entries(obj).filter(([key]) => selectedKeysObject[key])
          //   );
          // });

          const updatedData = res?.data?.map(({ peak_json, ...rest }) => rest);
          exportToCSV(updatedData);
          setLoading(false);
        }
        setExportPopup(false)
        toast.success("Data Successfully Exported.");
      } catch (error) {
        setExportPopup(false)
        toast.error("Error during export:", error?.message);
      }
    }

  };

  return (
    <div className="addNewContactPopup" style={{ width: "500px" }}>
      <div className="row">
        <div className="col-12 heading mb-0">
          <i className="fa-light fa-file-export" />
          <h5>Export Options</h5>
          <p>Choose what and how you want to export the call detail reports</p>
        </div>
        <div style={{ borderBottom: '1px solid var(--border-color)' }} />
        <div className="col-12 my-2">
          <div className="row">
            <h5 className="mb-0 d-flex justify-content-between align-items-center">CDR Filters <button className="tableButton delete"><i className="fa-solid fa-trash" /></button></h5>
            {filteredKeys.includes("variable_start_stamp") && (
              <>
                {" "}
                <div className="formRow border-0 col-4">
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
                    <option value={"date"}>Single Date</option>
                    <option value={"date_range"}>Date Range</option>
                    <option value={"7_days"}>Last 7 Days</option>
                    <option value={"1_month"}>Last 1 Month</option>
                    {/* <option value={"3_month"}>Last 3 Months</option> */}
                  </select>
                </div>
                {filterBy === "date" && (
                  <div className="formRow border-0 col-4">
                    <label className="formLabel text-start mb-0 w-100">
                      Choose Date
                    </label>
                    <input
                      type="date"
                      className="formItem"
                      max={new Date()?.toISOString()?.split("T")[0]}
                      value={startDateFlag}
                      onChange={(e) => {
                        setStartDateFlag(e.target.value);
                        setPageNumber(1);
                      }}
                    />
                    {/* <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />; */}
                  </div>
                )}
                {filterBy === "date_range" && (
                  <>
                    <div className="formRow border-0 col-4">
                      <label className="formLabel text-start mb-0 w-100">
                        From
                      </label>
                      <input
                        type="date"
                        className="formItem"
                        max={new Date().toISOString().split('T')[0]}
                        value={startDateFlag}
                        onChange={handleStartDateChange}
                      />
                    </div>
                    <div className="formRow border-0 col-4">
                      <label className="formLabel text-start mb-0 w-100">
                        To
                      </label>
                      <input
                        type="date"
                        className="formItem"
                        max={new Date().toISOString().split('T')[0]}
                        value={endDateFlag}
                        onChange={handleEndDateChange}
                        min={startDateFlag}
                      />
                    </div>
                  </>
                )}
              </>
            )}
            {filteredKeys.includes("variable_sip_from_user") && (
              <div className="formRow border-0 col-4">
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
              <div className="formRow border-0 col-4">
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
                <div className="formRow border-0 col-4">
                  <label className="formLabel text-start mb-0 w-100">
                    Call Direction
                  </label>
                  <select
                    className="formItem"
                    onChange={(e) => {
                      setCallDirection(e.target.value);
                      setPageNumber(1);
                    }}
                    value={callDirection}
                  // onChange={(e) => setCallDirection(e.target.value), setPageNumber(1)}
                  >
                    <option value={""}>All Calls</option>
                    <option value={"inbound"}>Inbound Calls</option>
                    <option value={"outbound"}>
                      Outbound Calls
                    </option>
                    {/* <option value={"missed"}>Missed Calls</option> */}
                    <option value={"internal"}>
                      Internal Calls
                    </option>
                    {/* <option value={"transfer"}>
                          Transfer Calls
                        </option> */}
                  </select>
                </div>
                <div className="formRow border-0 col-4">
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
                    <option value={"callcenter"}>
                      Call Center
                    </option>
                    <option value={"ringgroup"}>Ring Group</option>
                  </select>
                </div>
              </>
            ) : (
              ""
            )}
            {page === "callrecording" &&
              !filteredKeys.includes("Hangup-Cause") ? (
              ""
            ) : (
              <>
                <div className="formRow border-0 col-4">
                  <label className="formLabel text-start mb-0 w-100">
                    Hangup Status
                  </label>
                  <select
                    className="formItem"
                    onChange={(e) => {
                      setHagupCause(e.target.value);
                      setPageNumber(1);
                    }}
                  >
                    <option value={""}>All</option>
                    <option value={"Answered"}>Answer</option>
                    <option value={"Missed"}>Missed</option>
                    <option value={"Voicemail"}>Voicemail</option>
                    <option value={"Cancelled"}>Cancelled</option>
                    <option value={"Failed"}>Failed</option>
                  </select>
                </div>
                {filteredKeys.includes("Hangup-Cause") && (
                  <div className="formRow border-0 pe-xl-0 col-3">
                    <label className="formLabel text-start mb-0 w-100">
                      Hangup Cause
                    </label>
                    <select
                      className="formItem"
                      onChange={(e) => {
                        setHangupStatus(e.target.value);
                        setPageNumber(1);
                      }}
                    >
                      <option value={""}>All</option>
                      <option value={"NORMAL_CLEARING"}>
                        Normal Clearing
                      </option>
                      <option value={"ORIGINATOR_CANCEL"}>
                        Originator Cancel
                      </option>
                      <option value={"MANAGER_REQUEST"}>
                        Manager Request
                      </option>
                      <option value={"NO_ANSWER"}>No Answer</option>
                      <option value={"INVALID_GATEWAY"}>
                        Invalid Gateway
                      </option>
                      <option value={"SERVICE_UNAVAILABLE"}>
                        Service Unavailable
                      </option>
                      <option value={"INCOMPATIBLE_DESTINATION"}>
                        Incompatible Destination
                      </option>
                      <option value={"NO_USER_RESPONSE"}>
                        No User Response
                      </option>
                      <option value={"MEDIA_TIMEOUT"}>
                        Media Timeout
                      </option>
                      <option value={"LOSE_RACE"}>Lose Race</option>
                      <option value={"NORMAL_UNSPECIFIED"}>
                        Normal Unspecified
                      </option>
                      <option value={"USER_BUSY"}>User Busy</option>
                      <option value={"RECOVERY_ON_TIMER_EXPIRE"}>
                        Recovery On Timer Expire
                      </option>
                      <option value={"USER_NOT_REGISTERED"}>
                        User Not Registered
                      </option>
                      <option value={"CALL_REJECTED"}>
                        Call Rejected
                      </option>
                      <option value={"SUBSCRIBER_ABSENT"}>
                        Subscriber Absent
                      </option>
                      <option value={"CHAN_NOT_IMPLEMENTED"}>
                        Chan Not Implemented
                      </option>
                      <option value={"DESTINATION_OUT_OF_ORDER"}>
                        Destination Out Of Order
                      </option>
                      <option value={"NORMAL_TEMPORARY_FAILURE"}>
                        Normal Temporary Failure
                      </option>
                      <option value={"NO_ROUTE_DESTINATION"}>
                        No Route Destination
                      </option>
                      <option value={"ALLOTTED_TIMEOUT"}>
                        Allotted Timeout
                      </option>
                      <option value={"INVALID_NUMBER_FORMAT"}>
                        Invalid Number Format
                      </option>
                    </select>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div style={{ borderBottom: '1px solid var(--border-color)' }} />
        <div className="col-12 mt-2">
          <h5 className="mb-0 d-flex justify-content-between align-items-center">Format Options</h5>
          <div class="form-check mt-2">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked={exportChecked === "CSV"} />
            <label class="formLabel" for="flexRadioDefault1">
              Export To CSV
            </label>
          </div>
          <div class="form-check mt-2">
            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked={exportChecked === "mail"} onChange={(e) => e.target.checked ? setExportChecked("mail") : setExportChecked("CSV")} />
            <label class="formLabel" for="flexRadioDefault2">
              Send To Mail
            </label>
          </div>
        </div>
        <div className="col-xl-12 mt-2">
          <div className="d-flex justify-content-between">
            <button className="panelButton gray ms-0" onClick={() => setExportPopup(false)}>
              <span className="text">Close</span>
              <span className="icon">
                <i className="fa-solid fa-caret-left" />
              </span>
            </button>
            <button
              className="panelButton me-0"
              onClick={() => { handleExport(); }}
              disabled={isExcelLoading}
            >
              <span className="text">Export</span>
              <span className="icon">
                <i className="fa-solid fa-file-export" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
