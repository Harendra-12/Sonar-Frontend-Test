import { useEffect } from "react";
import { useSIPProvider } from "react-sipjs";
// import { SessionState } from "sip.js";
import MediaPermissions from "./MediaPermissions ";
import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { CallSessionItem } from "./CallSessionItem";

export const SipRegister = () => {
  const { connectAndRegister, registerStatus, connectStatus } =
    useSIPProvider();
  const account = useSelector((state) => state.account);
  const {
    extension: { extension, password },
  } = account;
  // const username = extension;
  // const password = pswrd;
  useEffect(() => {
    connectAndRegister({
      // username: extension,
      // password: password,
      username: "1003",
      password: "1003",
    });
  }, [
    connectAndRegister,
    // extension, password
  ]);

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
