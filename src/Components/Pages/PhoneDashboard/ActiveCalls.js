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
    console.log(apiData);
    if (apiData?.status) {
      setLoading(false);
      console.log(apiData);
      toast.success(apiData.message);
    } else {
      console.log(apiData);
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

  async function whisper(id, dest,leg) {
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
    } else if(bargeStatus === "whisper-aleg"){
      whisper(id,dest,"eavesdrop_whisper_aleg=true")
    }else if(bargeStatus === "whisper-bleg"){
      whisper(id,dest,"eavesdrop_whisper_bleg=true")
    }
  }, [bargeStatus, id]);

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
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Profile</th>
            <th>Created</th>
            {/* <th>CID Name</th> */}
            <th>CID Number</th>
            <th>Destination</th>
            <th>Action</th>
            {/* <th>Intercept</th>
                        <th>Eavesdrop</th> */}
            <th className="text-align">Hang Up</th>
          </tr>
        </thead>
        <tbody>
          {activeCall &&
            activeCall
              .filter(
                (call) =>
                  call.callstate === "ACTIVE" || call.b_callee_direction === "ACTIVE"
              ).map
              ((item, key) => {
                return (
                  <tr>
                    <td>{key + 1}</td>
                    <td>{item.name.split("/")[1]}</td>
                    <td>{item.created.split(" ")[1]}</td>
                    {/* <td>{item.b_cid_name}</td> */}
                    <td>{item.cid_num}</td>
                    <td>
                      {item?.dest.includes("set:valet_ticket")
                        ? extractLastNumber(item?.accountcode)
                        : extractLastNumber(item?.dest)}
                    </td>
                    <td>
                      <select
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
                          Whisper agent
                        </option>
                        <option
                          value="whisper-aleg"
                          onClick={() => eavesdropCall(item.uuid, item?.dest.includes("set:valet_ticket")
                            ? extractLastNumber(item?.accountcode)
                            : extractLastNumber(item?.dest))}
                        >
                          Whisper customer
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
                        className="tableButton delete mx-auto"
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <i class=" fa-solid fa-phone-slash"></i>{" "}
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
