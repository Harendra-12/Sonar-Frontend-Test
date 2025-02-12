/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";
import {toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";


function ActiveCalls({ isWebrtc,filter }) {
  const activeCall = useSelector((state) => state.activeCall);
  console.log(activeCall);
  
  const [filterCalls,setFilterCalls] = useState([]);
  useEffect(()=>{
    if(filter==="all"){
      setFilterCalls(activeCall)
    }else if(filter==="ringgroup"){
      setFilterCalls(activeCall.filter((call) => call.application_state==="ringgroup"))
    }else if(filter==="callcenter"){
      setFilterCalls(activeCall.filter((call) => call.application_state==="callcenter"))
    }
  },[filter,activeCall])
  const [loading, setLoading] = useState(false);
  const [bargeStatus, setBargeStatus] = useState("disable");
  const [id, setId] = useState("");
  const [dest, setDest] = useState("")
  // const [timer,setTimer]=useState(0)
  // useEffect(() => {
  //  setTimer(0)
  // },[activeCall.length])
  // setTimeout(() => {
  //   setTimer(timer + 1);
  // },1000);
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
  const calculateDuration = (createdAt, serverTime) => {
    const createdAtTimestamp = new Date(createdAt).getTime();
    const serverTimestamp = new Date(serverTime).getTime();
    return Math.floor((serverTimestamp - createdAtTimestamp) / 1000); // Duration in seconds
  };
  
  const formatDuration = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };
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
            <th>Duration</th>
            {isWebrtc !== false && <th>Action</th>}
            {isWebrtc !== false && <th className="text-align">Hang Up</th>}
          </tr>
        </thead>
        <tbody>
          {filterCalls &&
            filterCalls
              .filter(
                (call) =>
                  call.callstate === "ACTIVE" || call.b_callee_direction === "ACTIVE" || call.callstate === "HELD"
              ).map
              ((item, key) => {
                return (
                  <tr>
                    <td>{key + 1}</td>
                    <td>{item.created.split(" ")[1]}</td>
                    <td>
                      {item.did_tag}
                    </td>
                    <td>{item.feature_tag}</td>
                    <td>{item.cid_num}</td>
                    <td>{item.dest}</td>
                    <td>{item.duration}</td>
                    {isWebrtc !== false && <td>
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
                      </select>
                    </td>}
                    {isWebrtc !== false && <td onClick={() => killCall(item.uuid)}>
                      <label
                        className="tableButton delete mx-auto"
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <i class=" fa-solid fa-phone-slash"></i>{" "}
                      </label>
                    </td>}
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
