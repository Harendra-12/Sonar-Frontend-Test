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
  const extension = account?.extension?.extension || "";
  const password = account?.extension?.password || "";
  useEffect(() => {
    connectAndRegister({
      username: extension,
      password: password,
    });
  }, [connectAndRegister]);

  return (
    <div className="profileDropdowns" style={{ top: "55px", right: "-40px" }}>
      {/* <div>
        <span>
          {" "}
          Freeswitch Status:{" "}
          <span
            style={{ color: connectStatus === "CONNECTED" ? "#00ff00" : "red" }}
          >
            {connectStatus}
          </span>
        </span>
      </div> */}
      <div>
        {/* <span>
          {" "}
          SIP Status:{" "}
          <span
            style={{
              color: registerStatus === "REGISTERED" ? "#00ff00" : "red",
            }}
          >
            {registerStatus}
          </span>
        </span> */}
      </div>
      <MediaPermissions />
    </div>
  );
};
