import React, { useEffect, useState } from "react";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";
import ContentLoader from "../Misc/ContentLoader";

function SofiaStatus() {
  const [status, setStatus] = useState();
  const [sofiaStatus, setSofiaStatus] = useState();
  const [reg, setReg] = useState();
  const [xml, setXml] = useState();
  const [acl, setAcl] = useState();
  const [shutDown, setShutDown] = useState();
  const [clickValue, setClickValue] = useState("status");
  useEffect(() => {
    async function apiData() {
      const statusData = await generalGetFunction("/freeswitch/status");
      const sofiaData = await generalGetFunction("/freeswitch/sofiaStatus");
      const regData = await generalGetFunction("/freeswitch/showRegistrations");
      if (statusData.status) {
        setStatus([statusData.data, statusData.message]);
      }
      if (sofiaData.status) {
        setSofiaStatus([sofiaData.data, sofiaData.message]);
      }
      if (regData.status) {
        setReg([regData.data, regData.message]);
      }
    }
    apiData();
  }, []);
  async function aclReload() {
    const apiData = await generalGetFunction("/freeswitch/reloadacl");
    if (apiData.data) {
      setAcl(apiData.data);
      alert("Acl Reloaded");
    }
  }
  async function xmlReload() {
    const apiData = await generalGetFunction("/freeswitch/reloadXml");
    if (apiData.data) {
      setXml(apiData.data);
      alert("Xml Reloaded");
    }
  }
  async function sofiaReload() {
    const apiData = await generalGetFunction("/freeswitch/sofiaStatus");
    if (apiData.data) {
      setSofiaStatus([apiData.data, apiData.message]);
    }else{
      setSofiaStatus([0,apiData.error])
    }
  }
  async function statusReload() {
    const apiData = await generalGetFunction("/freeswitch/status");
    if (apiData.data) {
      setStatus([apiData.data, apiData.message]);
    }else{
      setStatus([0,apiData.error])
    }
  }
  async function regReload() {
    const apiData = await generalGetFunction("/freeswitch/showRegistrations");
    if (apiData.data) {
      setReg([apiData.data, apiData.message]);
    }else{
      setReg([0,apiData.error])
    }
  }
  async function shutDownReload() {
    const apiData = await generalGetFunction("/freeswitch/shutDown");
    if (apiData.data) {
      setShutDown(apiData.message);
    }
  }
  return (
    <>
      {status && sofiaStatus && reg ? (
        <>
          <div className="mainContent d-flex justify-content-between">
            <button
              className="panelButton"
              onClick={() => {
                setClickValue("status");
                statusReload();
              }}
            >
              Status
            </button>
            <button
              className="panelButton"
              onClick={() => {
                setClickValue("sofiastatus");
                sofiaReload();
              }}
            >
              Sofia status
            </button>
            <button
              className="panelButton"
              onClick={() => {
                setClickValue("reg");
                regReload();
              }}
            >
              Show Registration
            </button>
            <button
              className="panelButton"
              onClick={() => {
                setClickValue("xml");
                xmlReload();
              }}
            >
              Reload xml
            </button>
            <button
              className="panelButton"
              onClick={() => {
                setClickValue("acl");
                aclReload();
              }}
            >
              Reload Acl
            </button>
            <button
              className="panelButton"
              onClick={() => {
                setClickValue("shutdown");
                shutDownReload();
              }}
            >
              Shut Down
            </button>
          </div>
          <div className="mainContent">
            {clickValue === "status" ? (
               <>
               
           {
            Object.keys(status[0]) && Object.keys(status[0]).map((item,key)=>{
                return(
                    <p key={key}>{item} {status[0][item]}</p>
                )
            })
           }
             </>
            ) : clickValue === "sofiastatus" ? (
              <>
                {sofiaStatus[0].length > 0
                      ?<><table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Type</th>
                          <th>Data</th>
                          <th>State</th>
                        </tr>
                      </thead>
                      {sofiaStatus[0].map((item,key) => {
                          return (
                            <tbody key={key}>
                            <tr>
                              <td>{item.Name}</td>
                              <td>{item.Type}</td>
                              <td>{item.Data}</td>
                              <td>{item.State}</td>
                            </tr>
                            </tbody>
                          )
                        })}
                         
                    </table> </>
                      : sofiaStatus[1]}
              </>
            ) : clickValue === "reg" ? (
                <>
                {reg[0].length > 0
                      ?<><table style={{tableLayout: 'fixed', width: '100%'}}>
                      <thead>
                        <tr>
                          <th style={{ width: 60 }}>User</th>
                          <th>Realm</th>
                          <th style={{ width: 220 }}>Token</th>
                          <th style={{ width: 220 }}>Url</th>
                          <th>Expires</th>
                          <th>IP</th>
                          <th>Port</th>
                          <th>Protocol</th>
                          <th>Host Name</th>
                          <th>Meta Data</th>
                        </tr>
                      </thead>
                      {reg[0].map((item,key) => {
                          return (
                            <tbody key={key}>
                            <tr>
                              <td>{item.reg_user}</td>
                              <td>{item.realm}</td>
                              <td style={{overflowWrap: 'break-word' }}>{item.token}</td>
                              <td style={{overflowWrap: 'break-word' }}>{item.url}</td>
                              <td>{item.expires}</td>
                              <td>{item.network_ip}</td>
                              <td>{item.network_port}</td>
                              <td>{item.network_proto}</td>
                              <td>{item.hostname}</td>
                              <td>{item.metadata}</td>
                            </tr>
                            </tbody>
                          )
                        })}
                         
                    </table> </>
                      : "Total Register User 0"}
              </>
            ) : clickValue === "xml" ? (
              xml
            ) : clickValue === "shutdown" ? (
              shutDown
            ) : (
              acl
            )}
          </div>
        </>
      ) : (
        <ContentLoader />
      )}
    </>
  );
}

export default SofiaStatus;
