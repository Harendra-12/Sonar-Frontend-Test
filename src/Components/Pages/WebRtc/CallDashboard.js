import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActiveCalls from "../PhoneDashboard/ActiveCalls";
import { featureUnderdevelopment, generalGetFunction, generalPostFunction } from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import DarkModeToggle from "../../CommonComponents/DarkModeToggle";

function CallDashboard() {
  const sessions = useSelector((state) => state.sessions);
  const account = useSelector((state) => state.account);
  const activeCall = useSelector((state) => state.activeCall);
  const [allParkedCall, setAllParkedCall] = useState([]);
  const extension = account?.extension?.extension || null;
  const callState = useSelector((state) => state.callState);
  const navigate = useNavigate();
  const dispatch = useDispatch()
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

  async function logOut() {
    const apiData = await generalGetFunction("/logout");
    localStorage.clear();
    if (apiData?.data) {
      localStorage.clear();
      dispatch({
        action: "SET_ACCOUNT",
        account: null,
      });
      navigate("/");
    }
  }
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
              <div className="col-12 ps-xl-0">
                <div className="newHeader">
                  <div className="col-auto" style={{ padding: "0 10px" }}>
                    <h3 style={{ fontFamily: "Outfit", marginBottom: "0" }}>
                      Call Dashboard{" "}
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
                    <div className="col-auto ms-2">
                      <button className="clearButton2 xl" effect="ripple">
                        <i className="fa-regular fa-bell" />
                      </button>
                    </div>
                    <DarkModeToggle marginLeft={"2"} />
                    <div className="col-auto">
                      <div class="dropdown">
                        <div
                          className="myProfileWidget"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <div class="profileHolder" id="profileOnlineNav">
                            <img
                              src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg"
                              alt="profile"
                            />
                          </div>
                          <div class="profileName">
                            {account.username}{" "}
                            <span className="status">Available</span>
                          </div>
                        </div>
                        <ul class="dropdown-menu">
                          <li onClick={logOut}>
                            <div
                              class="dropdown-item"
                              style={{ cursor: "pointer" }}
                            >
                              Logout
                            </div>
                          </li>
                          <li onClick={() => navigate("/my-profile")}>
                            <div
                              class="dropdown-item"
                              style={{ cursor: "pointer" }}
                            >
                              Profile
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-xl-7 px-0"
                style={{ borderRight: "1px solid var(--border-color)" }}
              >

                <div className="overviewTableWrapper">
                  <div className="overviewTableChild">
                    <div className="d-flex flex-wrap">
                      <div className="col-12">
                        <div className="heading">
                          <div className="content">
                            <h4> Active Calls</h4>
                            <p>You can see all of the active calls here</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12" style={{ padding: '25px 20px 0px' }}>
                        <div className="tableContainer mt-0">
                          <ActiveCalls />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-xl-5 px-0"
                style={{ borderRight: "1px solid var(--border-color)" }}
              >

                <div className="overviewTableWrapper">
                  <div className="overviewTableChild">
                    <div className="d-flex flex-wrap">
                      <div className="col-12">
                        <div className="heading">
                          <div className="content">
                            <h4> Parked Calls</h4>
                            <p>You can see all of the parked calls here</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12" style={{ padding: '25px 20px 0px' }}>
                        <div className="tableContainer mt-0" style={{ height: "auto", maxHeight: '45vh' }}>
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
                  </div>
                </div>

                <div className="overviewTableWrapper pt-2">
                  <div className="overviewTableChild">
                    <div className="d-flex flex-wrap">
                      <div className="col-12">
                        <div className="heading">
                          <div className="content">
                            <h4> Ringinig State</h4>
                            <p>You can see all of the calls in ringing state here</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12" style={{ padding: '25px 20px 0px' }}>
                        <div className="tableContainer mt-0" style={{ height: "auto", maxHeight: '45vh' }}>
                          <table>
                            <thead>
                              <tr>
                                <th>#</th>
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
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default CallDashboard;
