import { useEffect } from "react";
import { useSIPProvider } from "react-sipjs";
import MediaPermissions from "./MediaPermissions ";
// import { CallSessionItem } from "./CallSessionItem";

export const SipRegister = () => {
  const {
    connectAndRegister,
    registerStatus,
    connectStatus,
  } = useSIPProvider();
  const username = "1002";
  const password = "1234";
  useEffect(() => {
    connectAndRegister({
      username: username,
      password: password,
    });
  }, [connectAndRegister,username,password]);
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
