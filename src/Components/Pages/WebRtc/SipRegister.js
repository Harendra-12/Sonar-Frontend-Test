import { useEffect } from "react";
import { useSIPProvider } from "react-sipjs";
// import { SessionState } from "sip.js";
import MediaPermissions from "./MediaPermissions ";
import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { CallSessionItem } from "./CallSessionItem";

export const SipRegister = ({ options }) => {
  const { connectAndRegister, registerStatus, connectStatus } =
    useSIPProvider();
  const account = useSelector((state) => state.account);
  const extension = account?.extension?.extension || "";
  const password = account?.extension?.password || "";
  // useEffect(() => {
  //   connectAndRegister({
  //     username: extension,
  //     password: password,
  //   });
  // }, [connectAndRegister]);
  useEffect(() => {
    const wsUrl = options.webSocketServer;

    const checkWebSocket = () => {
      return new Promise((resolve, reject) => {
        const ws = new WebSocket(wsUrl);

        // When the WebSocket connection is opened successfully
        ws.onopen = () => {
          console.log("WebSocket connection successful.");
          ws.close(); // Close the socket after the check
          resolve(true);
        };

        // If the WebSocket fails to connect
        ws.onerror = (error) => {
          console.error("WebSocket connection failed:", error);
          reject(false);
        };
      });
    };

    const registerUser = async () => {
      console.log("testing1111");
      try {
        console.log("testing11112");
        const isWebSocketWorking = await checkWebSocket(); // Check WebSocket connection
        console.log("testing11113", isWebSocketWorking);
        if (isWebSocketWorking) {
          connectAndRegister({
            username: extension,
            password: password,
          });
        }
      } catch (error) {
        console.error(
          "Error during WebSocket check or SIP registration:",
          error
        );
      }
    };

    if (extension && password) {
      registerUser(); // Call registration only if extension and password are present
    } else {
      console.error("Missing extension or password");
    }
  }, [extension, password]);
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
