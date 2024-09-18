import React, { useEffect, useState, useRef } from "react";
import Header from "../../CommonComponents/Header";
import {
  backToTop,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
  const [all, setAll] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [extensions, setExtensions] = useState(false);
  const [callCenter, setCallCenter] = useState(false);
  const [ringGroup, setRingGroup] = useState(false);
  const [inboundCalls, setInboundCalls] = useState(false);
  const [outboundCalls, setOutboundCalls] = useState(false);
  const [missedCalls, setMissedCalls] = useState(false);
  const [currentPlaying, setCurrentPlaying] = useState(null); // For tracking the currently playing audio

  useEffect(() => {
    setLoading(true);
    async function getData() {
      if (account && account.account_id) {
        const apiData = await generalGetFunction(
          `/cdr?account=${account.account_id}&page=${pageNumber}`
        );
        if (apiData.status) {
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
  }, [account, navigate, pageNumber]);

  useEffect(() => {
    if (cdr) {
      if (all) {
        if (inboundCalls) {
          setFilterData(
            cdr.data.filter((item) => item["Call-Direction"] === "inbound")
          );
        } else if (outboundCalls) {
          setFilterData(
            cdr.data.filter((item) => item["Call-Direction"] === "outbound")
          );
        } else if (missedCalls) {
          setFilterData(
            cdr.data.filter((item) => item["Call-Direction"] === "missed")
          );
        } else {
          setFilterData(cdr.data);
        }
      } else if (extensions && callCenter && ringGroup) {
        if (inboundCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                (item["application_state"] === "extension" ||
                  item["application_state"] === "callcenter" ||
                  item["application_state"] === "ringgroup") &&
                item["Call-Direction"] === "inbound"
            )
          );
        } else if (outboundCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                (item["application_state"] === "extension" ||
                  item["application_state"] === "callcenter" ||
                  item["application_state"] === "ringgroup") &&
                item["Call-Direction"] === "outbound"
            )
          );
        } else if (missedCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                (item["application_state"] === "extension" ||
                  item["application_state"] === "callcenter" ||
                  item["application_state"] === "ringgroup") &&
                item["Call-Direction"] === "missed"
            )
          );
        } else {
          setFilterData(
            cdr.data.filter(
              (item) =>
                item["application_state"] === "extension" ||
                item["application_state"] === "callcenter" ||
                item["application_state"] === "ringgroup"
            )
          );
        }
      } else if (extensions && callCenter) {
        if (inboundCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                (item["application_state"] === "extension" ||
                  item["application_state"] === "callcenter") &&
                item["Call-Direction"] === "inbound"
            )
          );
        } else if (outboundCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                (item["application_state"] === "extension" ||
                  item["application_state"] === "callcenter") &&
                item["Call-Direction"] === "outbound"
            )
          );
        } else if (missedCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                (item["application_state"] === "extension" ||
                  item["application_state"] === "callcenter") &&
                item["Call-Direction"] === "missed"
            )
          );
        } else {
          setFilterData(
            cdr.data.filter(
              (item) =>
                item["application_state"] === "extension" ||
                item["application_state"] === "callcenter"
            )
          );
        }
      } else if (extensions && ringGroup) {
        if (inboundCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                (item["application_state"] === "extension" ||
                  item["application_state"] === "ringgroup") &&
                item["Call-Direction"] === "inbound"
            )
          );
        } else if (outboundCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                (item["application_state"] === "extension" ||
                  item["application_state"] === "ringgroup") &&
                item["Call-Direction"] === "outbound"
            )
          );
        } else if (missedCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                (item["application_state"] === "extension" ||
                  item["application_state"] === "ringgroup") &&
                item["Call-Direction"] === "missed"
            )
          );
        } else {
          setFilterData(
            cdr.data.filter(
              (item) =>
                item["application_state"] === "extension" ||
                item["application_state"] === "ringgroup"
            )
          );
        }
      } else if (callCenter && ringGroup) {
        if (inboundCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                (item["application_state"] === "callcenter" ||
                  item["application_state"] === "ringgroup") &&
                item["Call-Direction"] === "inbound"
            )
          );
        } else if (outboundCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                (item["application_state"] === "callcenter" ||
                  item["application_state"] === "ringgroup") &&
                item["Call-Direction"] === "outbound"
            )
          );
        } else if (missedCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                (item["application_state"] === "callcenter" ||
                  item["application_state"] === "ringgroup") &&
                item["Call-Direction"] === "missed"
            )
          );
        } else {
          setFilterData(
            cdr.data.filter(
              (item) =>
                item["application_state"] === "callcenter" ||
                item["application_state"] === "ringgroup"
            )
          );
        }
      } else if (extensions) {
        if (inboundCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                item["application_state"] === "extension" &&
                item["Call-Direction"] === "inbound"
            )
          );
        } else if (outboundCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                item["application_state"] === "extension" &&
                item["Call-Direction"] === "outbound"
            )
          );
        } else if (missedCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                item["application_state"] === "extension" &&
                item["Call-Direction"] === "missed"
            )
          );
        } else {
          setFilterData(
            cdr.data.filter((item) => item["application_state"] === "extension")
          );
        }
      } else if (callCenter) {
        if (inboundCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                item["application_state"] === "callcenter" &&
                item["Call-Direction"] === "inbound"
            )
          );
        } else if (outboundCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                item["application_state"] === "callcenter" &&
                item["Call-Direction"] === "outbound"
            )
          );
        } else if (missedCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                item["application_state"] === "callcenter" &&
                item["Call-Direction"] === "missed"
            )
          );
        } else {
          setFilterData(
            cdr.data.filter(
              (item) => item["application_state"] === "callcenter"
            )
          );
        }
      } else if (ringGroup) {
        if (inboundCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                item["application_state"] === "ringgroup" &&
                item["Call-Direction"] === "inbound"
            )
          );
        } else if (outboundCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                item["application_state"] === "ringgroup" &&
                item["Call-Direction"] === "outbound"
            )
          );
        } else if (missedCalls) {
          setFilterData(
            cdr.data.filter(
              (item) =>
                item["application_state"] === "ringgroup" &&
                item["Call-Direction"] === "missed"
            )
          );
        } else {
          setFilterData(
            cdr.data.filter((item) => item["application_state"] === "ringgroup")
          );
        }
      }
    }
  }, [
    all,
    extensions,
    callCenter,
    ringGroup,
    cdr,
    inboundCalls,
    outboundCalls,
    missedCalls,
  ]);

  const handleCallDirectionFilter = (e) => {
    const value = e.target.value;
    if (value === "allCalls") {
      setMissedCalls(false);
      setOutboundCalls(false);
      setInboundCalls(false);
    } else if (value === "inboundCalls") {
      setMissedCalls(false);
      setOutboundCalls(false);
      setInboundCalls(true);
    } else if (value === "outboundCalls") {
      setMissedCalls(false);
      setOutboundCalls(true);
      setInboundCalls(false);
    } else if (value === "missedCalls") {
      setMissedCalls(true);
      setOutboundCalls(false);
      setInboundCalls(false);
    }
  };
  console.log("This is cdr report", filterData);

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="CDR Reports" />
          <div className="d-flex flex-wrap px-xl-3 py-2" id="detailsHeader">
            <div className="col-xl-8 pt-3 pt-xl-0 ms-auto">
              <div className="d-flex justify-content-end">
                <div className="d-flex align-items-center">
                  <select
                    className="form-select"
                    onChange={(e) => handleCallDirectionFilter(e)}
                  >
                    <option value={"allCalls"}>All Calls</option>
                    <option value={"inboundCalls"}>Inbound Calls</option>
                    <option value={"outboundCalls"}>Outbound Calls</option>
                    <option value={"missedCalls"}>Missed Calls</option>
                  </select>
                </div>
                <Link
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
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12" style={{ overflow: "auto" }}>
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
                        {cdr &&
                          filterData.map((item, index) => {
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

                    {cdr && cdr.data.length === 0 ? (
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
          {cdr && cdr.data.length > 0 ? (
            <PaginationComponent
              pageNumber={(e) => setPageNumber(e)}
              totalPage={cdr.last_page}
              from={(pageNumber - 1) * cdr.per_page + 1}
              to={cdr.to}
              total={cdr.total}
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
