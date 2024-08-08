import { useEffect } from "react";
import { useSIPProvider } from "react-sipjs";
import { SessionState } from "sip.js";
import MediaPermissions from "./MediaPermissions ";
import { useDispatch } from "react-redux";
// import { CallSessionItem } from "./CallSessionItem";

export const SipRegister = () => {
  const dispatch = useDispatch();
  const {
    connectAndRegister,
    registerStatus,
    sessions,
    connectStatus,
  } = useSIPProvider();
  const username = "1003";
  const password = "1234";
  useEffect(() => {
    connectAndRegister({
      username: username,
      password: password,
    });
  }, [connectAndRegister,username,password]);

  console.log("This is session state",SessionState);
  useEffect(()=>{
    dispatch({
      type: "SET_SESSIONS",
      sessions: sessions
    })
  },[sessions])
  
  return (
    <div className="col-auto">
      <h3 style={{ fontFamily: "Outfit", color: "#444444" }}>
        Freeswitch Status: {connectStatus}
      </h3>
      <h3 style={{ fontFamily: "Outfit", color: "#444444" }}>
        SIP Status: {registerStatus}
      </h3>
      <MediaPermissions />
      {Object.keys(sessions).map((sessionId) => (
             console.log("sessions from register",sessionId)             
            ))}
    </div>
  );
};
