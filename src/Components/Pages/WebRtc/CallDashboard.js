import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ActiveCalls from "../PhoneDashboard/ActiveCalls";
import { generalGetFunction, generalPostFunction } from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";

function CallDashboard() {
  const sessions = useSelector((state) => state.sessions);
  const account = useSelector((state) => state.account);
  const activeCall = useSelector((state) => state.activeCall);
  const [allParkedCall, setAllParkedCall] = useState([]);
  const extension = account?.extension?.extension || null;
  const callState = useSelector((state) => state.callState);
  console.log("callStatesss", callState);

  useEffect(() => {
    //dest should start with "set:valet_ticket"
    setAllParkedCall(
      activeCall.filter(
        (call) =>
          (call.dest.includes("set:valet_ticket") || call.dest.includes("*")) && call.b_callee_direction !== "ACTIVE"
      )
    );
  }, [activeCall]);

  function extractLastNumber(inputString) {
    const regex = /(\d+)\s*$/; // Regular expression to match the last number after a space

    const match = inputString.match(regex);

    if (match) {
      return match[1]; // Return the matched number
    } else {
      console.log("No number found after the last space.");
      return null;
    }
  }

  const handleUnPark = async (parkedNumber) => {
    if (!parkedNumber) {
      console.log("invalid number");
      return;
    }
    const payload = {
      unpark_slot: parkedNumber,
      user: extension,
    };

    //call a post api
    const unparkResponse = await generalPostFunction(
      "/freeswitch/call-unpark",
      payload
    );

    if (unparkResponse) {
      toast.success(unparkResponse.message);
    }
  };

  // async function logOut() {
  //   const apiData = await generalGetFunction("/logout");
  //   localStorage.clear();
  //   if (apiData?.data) {
  //     localStorage.clear();
  //     dispatch({
  //       action: "SET_ACCOUNT",
  //       account: null,
  //     });
  //     navigate("/");
  //   }
  // }
  return (
    <>
      {/* <SideNavbarApp /> */}
      <main
        className="mainContentApp"
        style={{
          marginRight:
            sessions.length > 0 && Object.keys(sessions).length > 0
              ? "250px"
              : "0",
        }}
      >
        <section>
          <div className="container-fluid callDashboard">
            <div
              className="row justify-content-between"
              style={{ height: "100%" }}
            >
              <div
                className="col-xl-7 pt-2"
                style={{ borderRight: "1px solid var(--border-color)" }}
              >
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div className="col-auto">
                    <h3
                    >
                      Call Dashboard
                    </h3>
                  </div>
                  <div className="col-12">
                    <nav>
                      <div className="nav nav-tabs">
                        <button
                          className="tabLink active"
                          effect="ripple"
                          data-category="all"
                        >
                          All
                        </button>
                        {/* <button
                          className="tabLink"
                          effect="ripple"
                          data-category="new"
                        >
                          New
                        </button> */}
                      </div>
                    </nav>
                    {/* <div className="position-relative searchBox d-flex mt-3">
                      <input
                        type="search"
                        name="Search"
                        id="headerSearch"
                        placeholder="Search"
                      />
                      <button className="ms-2 appPanelButton" effect="ripple">
                        <i className="fa-light fa-calendar-plus" />
                      </button>
                    </div> */}
                  </div>
                </div>
                <div
                  className="col-12 callDashboardPrimTable"
                  style={{ overflow: "auto" }}
                >
                  <ActiveCalls />
                </div>
              </div>
              <div
                className="col-xl-5 pt-2"
                style={{ borderRight: "1px solid var(--border-color)" }}
              >
                <div style={{ height: "calc(100vh - 50%)" }}>
                  <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <div className="col-auto">
                      <h3>
                        Parked Calls
                      </h3>
                    </div>
                    {/* <div className="col-12">
                      <div className="position-relative searchBox d-flex mt-3">
                        <input
                          type="search"
                          name="Search"
                          id="headerSearch"
                          placeholder="Search"
                        />
                        <button className="ms-2 appPanelButton" effect="ripple">
                          <i className="fa-light fa-calendar-plus" />
                        </button>
                      </div>
                    </div> */}
                  </div>
                  <div className="col-12 px-1" style={{ overflow: "auto" }}>
                    <div className="tableContainer">
                      <table>
                        <thead>
                          <tr>
                            <th>Called ID</th>
                            <th>Parked By</th>
                            <th>Parked At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allParkedCall.length > 0 &&
                            allParkedCall.map((call) => {
                              return (
                                <tr>
                                  <td>{call.cid_num}</td>

                                  <td>{extractLastNumber(call?.parked_by)}</td>
                                  <td>
                                    {call?.dest.includes("set:valet_ticket")
                                      ? extractLastNumber(call?.accountcode)
                                      : extractLastNumber(call?.dest)}
                                  </td>
                                  <td>
                                    <button
                                      onClick={() =>
                                        handleUnPark(
                                          call?.dest.includes(
                                            "set:valet_ticket"
                                          )
                                            ? extractLastNumber(
                                              call?.accountcode
                                            )
                                            : extractLastNumber(call?.dest)
                                        )
                                      }
                                    >
                                      Unpark
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div
                  className="mt-3 pt-3"
                  style={{ borderTop: "1px solid var(--border-color)" }}
                >
                  <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <div className="col-auto">
                      <h3>
                        Ringinig State
                      </h3>
                    </div>
                    <div className="col-12">

                    </div>
                  </div>
                  <div className="col-12" style={{ overflow: "auto" }}>
                    <div className="tableContainer">
                      <table>
                        <thead>
                          <tr>
                            <th>Sl no.</th>
                            <th>From </th>
                            <th>To</th>
                            <th>Call at</th>
                          </tr>
                        </thead>

                        <tbody>
                          {
                            activeCall && activeCall.filter((item) => item.callstate === "RINGING").map((item, key) => {
                              return (
                                <tr>
                                  <td>{key + 1}</td>
                                  <td>{item.cid_name}</td>
                                  <td>{item.presence_id.split("@")[0]}</td>
                                  <td>{item.created.split(" ")[1]}</td>
                                </tr>
                              )
                            })
                          }

                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default CallDashboard;
