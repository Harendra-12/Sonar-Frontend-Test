import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../CommonComponents/Header";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";
import { ToastContainer, toast } from "react-toastify";

import CircularLoader from "../../Loader/CircularLoader";
import EmptyPrompt from "../../Loader/EmptyPrompt";

function ActiveCalls() {
  const activeCall = useSelector((state) => state.activeCall);
  const [loading, setLoading] = useState(false);
  const [bargeStatus, setBargeStatus] = useState("disable");
  const [id, setId] = useState("");
  async function killCall(id) {
    setLoading(true);
    const apiData = await generalGetFunction(`/freeswitch/call-kill/${id}`);
    if (apiData.status) {
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
    console.log(apiData);
    if (apiData.status) {
      setLoading(false);
      console.log(apiData);
      toast.success(apiData.message);
    } else {
      console.log(apiData);
      setLoading(false);
      toast.error(apiData.message);
    }
  }
  async function eavesdropCall(id) {
    setLoading(true);
    const apiData = await generalGetFunction(
      `/freeswitch/call-eavesdrop/${id}`
    );

    if (apiData.status) {
      setLoading(false);

      toast.success(apiData.message);
    } else {
      setLoading(false);
      toast.error(apiData.message);
    }
  }
  async function interceptCall(id) {
    setLoading(true);
    const apiData = await generalGetFunction(
      `/freeswitch/call-intercept/${id}`
    );

    if (apiData.status) {
      setLoading(false);

      toast.success(apiData.message);
    } else {
      setLoading(false);
      toast.error(apiData.message);
    }
  }

  useEffect(() => {
    if (bargeStatus === "burge") {
      bargeCall(id);
    } else if (bargeStatus === "intercept") {
      interceptCall(id);
    } else if (bargeStatus === "eavesdrop") {
      eavesdropCall(id);
    }
  }, [bargeStatus, id]);

  return (
    <>
      {/* <main className="mainContent"> */}
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              {/* <Header title="Active Calls" /> */}
              <div className="col-12" style={{ overflow: "auto" }}>
                <div className="tableContainer">
                  <table>
                    <thead>
                      <tr>
                        <th>Serial no.</th>
                        <th>Profile</th>
                        <th>Created</th>
                        <th>CID Name</th>
                        <th>CID Number</th>
                        <th>Destination</th>
                        <th>Burge</th>
                        {/* <th>Intercept</th>
                        <th>Eavesdrop</th> */}
                        <th>Hang Up</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeCall &&
                        activeCall
                          // .filter(
                          //   (call) =>
                          //     call.direction === "inbound" &&
                          //     call.callstate === "ACTIVE"
                          // )
                          .map((item, key) => {
                            return (
                              <tr>
                                <td>{key + 1}</td>
                                <td>{item.name.split("/")[1]}</td>
                                <td>{item.created}</td>
                                <td>{item.b_cid_name}</td>
                                <td>{item.b_cid_num}</td>
                                <td>{item.dest}</td>
                                <td>
                                  <select
                                    onChange={(e) => {
                                      setBargeStatus(e.target.value);
                                      setId(item.uuid);
                                    }}
                                  >
                                    <option value="disbale"></option>
                                    <option
                                      value="burge"
                                      onClick={() => bargeCall(item.uuid)}
                                    >
                                      Burge
                                    </option>
                                    <option
                                      value="intercept"
                                      onClick={() => interceptCall(item.uuid)}
                                    >
                                      Intercept
                                    </option>
                                    <option
                                      value="eavesdrop"
                                      onClick={() => eavesdropCall(item.uuid)}
                                    >
                                      Eavesdrop
                                    </option>
                                  </select>
                                </td>
                                {/* <td onClick={() => bargeCall(item.uuid)}>
                                <label
                                  className="tableLabel success"
                                  style={{
                                    width: "85px",
                                    padding: "3px 7px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <i class="fa-sharp-duotone fa-solid fa-headset me-1"></i>{" "}
                                  Barge
                                </label>
                              </td> */}
                                {/* <td onClick={() => interceptCall(item.uuid)}>
                                <label
                                  className="tableLabel success"
                                  style={{
                                    width: "85px",
                                    padding: "3px 7px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <i class="fa-sharp-duotone fa-solid fa-headset me-1"></i>{" "}
                                  Intercept
                                </label>
                              </td>
                              <td onClick={() => eavesdropCall(item.uuid)}>
                                <label
                                  className="tableLabel success"
                                  style={{
                                    width: "90px",
                                    padding: "3px 7px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <i class="fa-sharp-duotone fa-solid fa-headset me-1"></i>{" "}
                                  Eavesdrop
                                </label>
                              </td> */}
                                <td onClick={() => killCall(item.uuid)}>
                                  <label
                                    className="tableLabel fail"
                                    style={{
                                      width: "85px",
                                      padding: "3px 7px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <i class="fa-duotone fa-solid fa-phone-slash me-1"></i>{" "}
                                    Hang Up
                                  </label>
                                </td>
                              </tr>
                            );
                          })}
                      {/* {activeCall &&
                      Object.values(activeCall).map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name.split("/")[1]}</td>
                            <td>{item.created}</td>
                            <td>{item.b_cid_name}</td>
                            <td>{item.b_cid_num}</td>
                            <td>{item.dest}</td>
                            <td onClick={() => bargeCall(item.uuid)}>
                              <label
                                className="tableLabel success"
                                style={{
                                  width: "85px",
                                  padding: "3px 7px",
                                  cursor: "pointer",
                                }}
                              >
                                <i className="fa-sharp-duotone fa-solid fa-headset me-1"></i>{" "}
                                Barge
                              </label>
                            </td>
                            <td onClick={() => killCall(item.uuid)}>
                              <label
                                className="tableLabel fail"
                                style={{
                                  width: "85px",
                                  padding: "3px 7px",
                                  cursor: "pointer",
                                }}
                              >
                                <i className="fa-duotone fa-solid fa-phone-slash me-1"></i>{" "}
                                Hang Up
                              </label>
                            </td>
                          </tr>
                        );
                      })} */}
                      {/* {activeCall && activeCall.length === 0 ? (
                        <td colSpan={99}>
                          <EmptyPrompt name="Call" link="call" />
                        </td>
                      ) : (
                        ""
                      )} */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      {/* </main> */}
      {loading && <CircularLoader />}
      {/* <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      /> */}
    </>
  );
}

export default ActiveCalls;
