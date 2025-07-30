import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

function GoConferenceNotificationSocket() {
  const dispatch = useDispatch();
  const ip = process.env.REACT_APP_BACKEND_IP;
  const port = process.env.REACT_APP_GOLANG_CONFERENCE_NOTIFICATION_SOCKET_PORT;
  const account = useSelector((state) => state.account);
  const isLogOut = useSelector((state) => state.logout);

  const socketRef = useRef(null);
  const connectingRef = useRef(false);
  const connectedRef = useRef(false); // ✅ NEW
  const prevAccidRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  const sendConferenceMessage = (data) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not open. Unable to send message.");
    }
  };

  useEffect(() => {
    const connectWebSocket = () => {
      const accId = account?.id;

      // Abort if user is logged out or account.id is missing
      if (isLogOut === 1 || !accId) {
        console.warn("WebSocket connection aborted: User is logged out or account.id is missing.");
        return;
      }

      // Avoid duplicate connection
      if (
        socketRef.current &&
        (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING) &&
        prevAccidRef.current === accId
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
      const socket = new WebSocket(`${protocol}://${ip}:${port}/ws?id=${accId}`);

      socket.onopen = () => {
        reconnectAttemptsRef.current = 0;
        connectingRef.current = false;
        connectedRef.current = true; // ✅ NEW
        prevAccidRef.current = accId;
        console.log("WebSocket connected");
      };

      socket.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event?.data);

          switch (parsedData?.action) {
            case "notification":
              dispatch({ type: "SET_CONF_NOTIF", confNotif: parsedData });
              break;
            default:
              console.log("Unknown action:", parsedData);
              break;
          }
        } catch (error) {
          console.warn("Invalid JSON from socket message:", event.data);
          console.error(error);
        }
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
        connectingRef.current = false;
        connectedRef.current = false; // ✅ NEW
      };

      socket.onclose = () => {
        console.warn("WebSocket closed.");
        connectingRef.current = false;
        connectedRef.current = false; // ✅ NEW

        if (reconnectAttemptsRef.current < 5 && isLogOut !== 1) {
          reconnectAttemptsRef.current++;
          setTimeout(connectWebSocket, 5000);
        }
      };

      socketRef.current = socket;
    };

    if (account?.account_id && account?.id) {
      connectWebSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        connectingRef.current = false;
        connectedRef.current = false; // ✅ NEW
      }
    };
  }, [account?.account_id, account?.id, ip, port, isLogOut]);

  return { sendConferenceMessage };
}

export default GoConferenceNotificationSocket;
