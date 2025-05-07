/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

/**
 * Manages a single WebSocket connection, ensuring no duplicate sessions,
 * and reconnecting safely when needed unless the user is logged out.
 */

const Socket = () => {
  const dispatch = useDispatch();
  const ip = process.env.REACT_APP_BACKEND_IP;
  const port = process.env.REACT_APP_BACKEND_SOCKET_PORT;
  const account = useSelector((state) => state.account);
  const RoomID = useSelector((state) => state.RoomID);
  const isLogOut = useSelector((state) => state.logout);

  const socketRef = useRef(null);
  const connectingRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const prevTokenRef = useRef(null);

  const sendMessage = (data) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not open. Unable to send message.");
    }
  };

  useEffect(() => {
    const connectWebSocket = () => {
      const currentToken = localStorage.getItem("token");

      if (isLogOut === 1 || !currentToken) {
        console.warn("WebSocket connection aborted: User is logged out or token is missing.");
        return;
      }

      if (
        socketRef.current &&
        (socketRef.current.readyState === WebSocket.OPEN ||
          socketRef.current.readyState === WebSocket.CONNECTING) &&
        prevTokenRef.current === currentToken
      ) {
        console.log("WebSocket already connected or connecting.");
        return;
      }

      if (connectingRef.current) return;

      if (socketRef.current) {
        socketRef.current.close();
      }

      connectingRef.current = true;
      console.log("Connecting WebSocket...");

      const socket = new WebSocket(`wss://${ip}:${port}?token=${currentToken}`);

      socket.onopen = () => {
        console.log("WebSocket connected.");
        reconnectAttemptsRef.current = 0;
        connectingRef.current = false;
        prevTokenRef.current = currentToken;
      };

      socket.onmessage = (event) => {
        const parsedData = event.data;
        if (typeof parsedData === "string") {
          const message = JSON.parse(parsedData);
          const { key, result, current_time } = message;

          switch (key) {
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
              dispatch({
                type: "SET_ACTIVECALL",
                activeCall: result
                  .filter(
                    (item) =>
                      item.application_state !== "conference" &&
                      item.account_id == account.account_id
                  )
                  .map((item) => ({ ...item, serverTime: current_time })),
              });
              break;
            case "Conference":
              dispatch({ type: "SET_CONFERENCE", conference: result });
              break;
            case "logout_warning":
              dispatch({ type: "SET_ADMIN_LOGOUT", adminLogout: true });
              break;
            case "screenShare":
              dispatch({
                type: "SET_CONFERENCESCREENSHARESTATUS",
                conferenceScreenShareStatus: result,
              });
              break;
            case "broadcastGroupMessage":
              dispatch({ type: "SET_GROUPMESSAGE", groupMessage: result });
              break;
            case "conferenceMessage":
              if (result["room_id"] == RoomID) {
                dispatch({
                  type: "SET_CONFERENCEMESSAGE",
                  conferenceMessage: result,
                });
              }
              break;
            case "clientMsg":
              dispatch({
                type: "SET_INCOMING_MESSAGE",
                incomingMessage: result,
              });
              break;
            case "progressive":
              dispatch({ type: "SET_PREVIEWDIALER", previewDialer: result });
              break;
            case "clientCall":
              dispatch({ type: "SET_INCOMINGCALL", incomingCall: result });
              break;
            default:
              break;
          }
        }
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
        connectingRef.current = false;
      };

      socket.onclose = () => {
        console.warn("WebSocket closed.");
        connectingRef.current = false;
        if (reconnectAttemptsRef.current < 5 && !isLogOut) {
          if (!reconnectTimeoutRef.current) {
            reconnectAttemptsRef.current++;
            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectTimeoutRef.current = null;
              connectWebSocket();
            }, 5000);
          }
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
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [account, ip, port, isLogOut]);

  return { sendMessage };
};

export default Socket;
