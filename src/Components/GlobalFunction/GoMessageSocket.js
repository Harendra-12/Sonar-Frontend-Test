/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../Redux/reduxActionType";

const GoMessageSocket = () => {
  const dispatch = useDispatch();
  const ip = process.env.REACT_APP_BACKEND_IP;
  const port = process.env.REACT_APP_GOLANG_MESSAGE_SOCKET_PORT;
  const account = useSelector((state) => state.account);
  const RoomID = useSelector((state) => state.RoomID);
  const isLogOut = useSelector((state) => state.logout);

  const socketRef = useRef(null);
  const connectingRef = useRef(false);
  const connectedRef = useRef(false); // ✅ New
  const reconnectAttemptsRef = useRef(0);
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

      // Prevent duplicate connection
      if (
        socketRef.current &&
        (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING) &&
        prevTokenRef.current === currentToken
      ) {
        console.log("WebSocket already open or connecting. Skipping...");
        return;
      }

      if (connectingRef.current) {
        console.log("WebSocket is connecting. Skipping...");
        return;
      }

      if (socketRef.current) {
        socketRef.current.close();
      }

      connectingRef.current = true;

      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const socket = new WebSocket(`${protocol}://${ip}:${port}/chat?token=${currentToken}`);

      socket.onopen = () => {
        reconnectAttemptsRef.current = 0;
        connectingRef.current = false;
        connectedRef.current = true; // ✅ New
        prevTokenRef.current = currentToken;
        console.log("Message WebSocket connected");
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const { key, result, current_time } = message;
          console.log(key, result, current_time);

          switch (key) {
            case "peercallInitiate":
              dispatch({ type: "SET_INCOMINGCALL", incomingCall: result });
              break;
            case "peercallUpdate":
              dispatch({ type: "SET_INTERNALCALLACTION", internalCallAction: result });
              break;
            case "logout_warning":
              dispatch({ type: "SET_ADMIN_LOGOUT", adminLogout: true });
              break;
            case "broadcastGroupMessage":
              dispatch({ type: "SET_GROUPMESSAGE", groupMessage: result });
              break;
            case "typing_status":
            case "group_typing_status":
              dispatch({
                type: ActionType?.IS_TYPING_ACTION,
                typingDetails: { result: result, key: key },
              });
              break;
            case "clientMsg":
              dispatch({
                type: "SET_INCOMING_MESSAGE",
                incomingMessage: result,
              });
              break;
            default:
              break;
          }
        } catch (err) {
          console.error("WebSocket message parse error:", err);
        }
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
        connectingRef.current = false;
        connectedRef.current = false; // ✅ New
      };

      socket.onclose = () => {
        console.warn("WebSocket closed.");
        connectingRef.current = false;
        connectedRef.current = false; // ✅ New

        if (reconnectAttemptsRef.current < 5 && isLogOut !== 1) {
          reconnectAttemptsRef.current++;
          setTimeout(connectWebSocket, 5000);
        }
      };

      socketRef.current = socket;
    };

    if (account?.account_id) {
      connectWebSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        connectingRef.current = false;
        connectedRef.current = false; // ✅ New
      }
    };
  }, [account?.account_id, ip, port, isLogOut]);

  return { sendMessage };
};

export default GoMessageSocket;
