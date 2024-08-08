import { useEffect } from "react";
import { useSIPProvider } from "react-sipjs";
// import { SessionState } from "sip.js";
import MediaPermissions from "./MediaPermissions ";
// import { useDispatch } from "react-redux";
// import { CallSessionItem } from "./CallSessionItem";

export const SipRegister = () => {
<<<<<<< HEAD
  const dispatch = useDispatch();
  const { connectAndRegister, registerStatus, sessions, connectStatus } =
    useSIPProvider();
  const username = "1003";
  const password = "886029";
=======
  const {
    connectAndRegister,
    registerStatus,
    connectStatus,
  } = useSIPProvider();
  const username = "1002";
  const password = "1234";
>>>>>>> 278059c2357f1de476b06dbc6ec104f36a3ed8d1
  useEffect(() => {
    connectAndRegister({
      username: username,
      password: password,
    });
  }, [connectAndRegister, username, password]);

<<<<<<< HEAD
  useEffect(() => {
    dispatch({
      type: "SET_SESSIONS",
      sessions: sessions,
    });
  }, [sessions]);

=======
  
  
>>>>>>> 278059c2357f1de476b06dbc6ec104f36a3ed8d1
  return (
    <div className="col-auto">
      <h3 style={{ fontFamily: "Outfit", color: "#444444" }}>
        Freeswitch Status: {connectStatus}
      </h3>
      <h3 style={{ fontFamily: "Outfit", color: "#444444" }}>
        SIP Status: {registerStatus}
      </h3>
      <MediaPermissions />
    </div>
  );
};
