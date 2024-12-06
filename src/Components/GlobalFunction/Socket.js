import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const Socket = () => {
  const dispatch = useDispatch();
  const ip = "ucaas.webvio.in";
  const port = "8443";
  const account = useSelector((state) => state.account);
  const token = localStorage.getItem("token");
  const socketRef = useRef(null);

  useEffect(() => {
    var reconnectValue = 0;
    const connectWebSocket = () => {
      const socket = new WebSocket(`wss://${ip}:${port}?token=${token}`);

      socket.onopen = () => {
        console.log("WebSocket connection successful.");
      };
      socket.onmessage = (event) => {
        console.log(JSON.parse(event.data));
        if (typeof JSON.parse(event.data) === "string") {
          if (JSON.parse(JSON.parse(event.data))["key"] === "UserRegister") {
            dispatch({
              type: "SET_REGISTERUSER",
              registerUser: JSON.parse(JSON.parse(event.data))["result"].filter(
                (item) => {
                  return item.account_id === account.account_id;
                }
              ),
            });
          } else if (
            JSON.parse(JSON.parse(event.data))["key"] === "onlineUser"
          ) {
            dispatch({
              type: "SET_LOGINUSER",
              loginUser: JSON.parse(JSON.parse(event.data))["result"],
            });
          } else if (
            JSON.parse(JSON.parse(event.data))["key"] === "CallState"
          ) {
            dispatch({
              type: "SET_CALLSTATE",
              callState: JSON.parse(JSON.parse(event.data))["result"],
            });
          } else if (
            JSON.parse(JSON.parse(event.data))["key"] ===
            "ChannelHangupComplete"
          ) {
            dispatch({
              type: "SET_CHANNELHANGUP",
              channelHangupComplete: JSON.parse(JSON.parse(event.data))[
                "result"
              ],
            });
            if (
              Number(
                JSON.parse(JSON.parse(event.data))["result"]["account_id"]
              ) === Number(account.account_id)
            ) {
              dispatch({
                type: "SET_BALANCE",
                balance: JSON.parse(JSON.parse(event.data))["balance"],
              });
            }
          } else if (
            JSON.parse(JSON.parse(event.data))["key"] === "activeCalls"
          ) {
            // console.log(
            //   "inside activeCalls",
            //   JSON.parse(JSON.parse(event.data))["result"]
            // );
            dispatch({
              type: "SET_ACTIVECALL",
              activeCall: JSON.parse(JSON.parse(event.data))["result"],
            });
          }

          else if (
            JSON.parse(JSON.parse(event.data))["key"] === "Conference"
          ) {
            // console.log(
            //   "inside Conference",
            //   JSON.parse(JSON.parse(event.data))["result"]
            // );
            dispatch({
              type: "SET_CONFERENCE",
              conference: JSON.parse(JSON.parse(event.data))["result"],
            });
          }
        } else {
          // console.log("This is else condition", JSON.parse(event.data));
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      socket.onclose = () => {
        console.log("WebSocket connection closed. Reconnecting...");
        if (reconnectValue < 5) {
          reconnectValue = reconnectValue + 1;
          setTimeout(connectWebSocket, 5000); // Retry after 3 seconds
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
  }, [account, dispatch, token]);

  return null;
};

export default Socket;
