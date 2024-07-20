import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../CommonComponents/Header";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../Misc/CircularLoader";

function ActiveCalls() {
  const activeCall = useSelector((state) => state.activeCall);
  const [loading,setLoading]=useState(false)
  async function killCall(id) {
    setLoading(true)
    const apiData = await generalGetFunction(`/freeswitch/call-kill/${id}`);
    if (apiData.status) {
      setLoading(false)
      toast.success(apiData.message);
    }else{
      setLoading(false)
      toast.error(apiData.message);
    }
  }

  async function bargeCall (id) {
    setLoading(true)
    const apiData = await generalGetFunction(`/freeswitch/call-eavesdrop/${id}`);
    if (apiData.status) {
      setLoading(false)
      toast.success(apiData.message);
    }else{
      setLoading(false)
      toast.error(apiData.message);
    }
  }
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Active Calls" />
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
                        <th>Hang Up</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeCall &&
                        activeCall.map((item, key) => {
                          return (
                            <tr>
                              <td>{key + 1}</td>
                              <td>{item.name.split("/")[1]}</td>
                              <td>{item.created}</td>
                              <td>{item.b_cid_name}</td>
                              <td>{item.b_cid_num}</td>
                              <td>{item.dest}</td>
                              <td onClick={() => bargeCall(item.uuid)}>
                                <label className="tableLabel success" style={{width: '85px', padding:'3px 7px',cursor: 'pointer'}}>
                                  <i class="fa-sharp-duotone fa-solid fa-headset me-1"></i> Barge
                                </label>
                              </td>
                              <td onClick={() => killCall(item.uuid)} >
                                <label  className="tableLabel fail" style={{width: '85px', padding:'3px 7px', cursor: 'pointer'}}>
                                  <i class="fa-duotone fa-solid fa-phone-slash me-1"></i> Hang Up
                                </label>
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
        </section>
      </main>
      {loading && <CircularLoader />}
      <ToastContainer
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
      />
    </>
  );
}

export default ActiveCalls;
