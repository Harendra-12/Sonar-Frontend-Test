import axios from 'axios'
import React, { useEffect, useState } from 'react'
import LiveKitConference from './LiveKitConference';

function InitiateCall({from,to,name,setCalling, meetingPage}) {
    const [token, setToken] = useState(null);
    const [serverUrl, setServerUrl] = useState(null);
    const roomName = `${from}-${to}`
    useEffect(()=>{
        async function getToken(){
            axios.get(`https://meet.webvio.in/backend/get-token?room=${roomName}&username=${name}&isAdmin=${true}`).then((res)=>{
                setToken(res.data.token);
                setServerUrl(res.data.serverUrl)
            }).catch((err)=>{
                console.log("This error coming from conference",err);
            })
        }
        getToken()
    },[from,to,name])
    
  return (
    <>
    {token ? <LiveKitConference token={token} serverUrl={serverUrl} roomName={roomName} username={name} isAdmin={true} setCalling={setCalling} meetingPage={meetingPage}/>:""}
    </>
  )
}

export default InitiateCall