import { useEffect } from "react";
import { useSIPProvider } from "react-sipjs";
import MediaPermissions from "./MediaPermissions ";
// import { CallSessionItem } from "./CallSessionItem";

export const SipRegister = () => {
  const { connectAndRegister, registerStatus, sessions, connectStatus } =
    useSIPProvider();
  const username = "1003";
  const password = "886029";
  useEffect(() => {
    connectAndRegister({
      username: username,
      password: password,
    });
  }, [connectAndRegister, username, password]);
  return (
    <div className="col-auto">
      <h3 style={{ fontFamily: "Outfit", color: "#444444" }}>
        Freeswitch Status: {connectStatus}
      </h3>
      <h3 style={{ fontFamily: "Outfit", color: "#444444" }}>
        SIP Status: {registerStatus}
      </h3>
      <MediaPermissions />
      {Object.keys(sessions).map((sessionId) =>
        console.log("sessions from register", sessionId)
      )}
    </div>
  );
};
