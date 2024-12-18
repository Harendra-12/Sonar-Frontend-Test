import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

let sendData = () => {
  console.warn("WebSocket not initialized yet.");
}; // Default placeholder function if called before initialization.

const Socket = () => {
  const dispatch = useDispatch();
  const ip = process.env.REACT_APP_BACKEND_IP;
  const port = process.env.REACT_APP_BACKEND_SOCKET_PORT;
  const account = useSelector((state) => state.account);
  const token = localStorage.getItem("token");
  const socketRef = useRef(null);

  useEffect(() => {
    let reconnectValue = 0;

    const connectWebSocket = () => {
      const socket = new WebSocket(`wss://${ip}:${port}?token=${token}`);

      // Update `sendData` to send messages via the initialized socket.
      sendData = (data) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(data));
          console.warn("WebSocket data send.");
        } else {
          console.warn("WebSocket is not open. Unable to send data.");
        }
      };

      socket.onopen = () => {
        console.log("WebSocket connection successful.");
      };

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (typeof parsedData === "string") {
          const message = JSON.parse(parsedData);
          const { key, result } = message;
          switch (key) {
            case "UserRegister":
              dispatch({
                type: "SET_REGISTERUSER",
                registerUser: result.filter(
                  (item) => item.account_id === account.account_id
                ),
              });
              break;
            case "onlineUser":
              dispatch({ type: "SET_LOGINUSER", loginUser: result });
              break;
            case "CallState":
              dispatch({ type: "SET_CALLSTATE", callState: result });
              break;
            case "ChannelHangupComplete":
              dispatch({
                type: "SET_CHANNELHANGUP",
                channelHangupComplete: result,
              });
              if (Number(result.account_id) === Number(account.account_id)) {
                dispatch({ type: "SET_BALANCE", balance: message.balance });
              }
              break;
            case "activeCalls":
              dispatch({ type: "SET_ACTIVECALL", activeCall: result });
              break;
            case "Conference":
              dispatch({ type: "SET_CONFERENCE", conference: result });
              break;
            case "sharedStatus":
              dispatch({
                type: "SET_CONFERENCESCREENSHARESTATUS",
                conferenceScreenShareStatus: result,
              });
              break;
            default:
              console.log("Unhandled WebSocket message key:", key);
          }
        } else {
          console.log("Received non-string message:", parsedData);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed. Reconnecting...");
        if (reconnectValue < 5) {
          reconnectValue++;
          setTimeout(connectWebSocket, 5000); // Retry after 5 seconds
        }
      };

      socketRef.current = socket;
    };

    if (account && account.account_id) {
      connectWebSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [account, dispatch, token, ip, port]);

  return null;
};

export { sendData };
export default Socket;
