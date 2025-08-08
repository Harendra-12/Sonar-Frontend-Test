/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

/**
 * Establishes a WebSocket connection to a specified server using account information
 * from Redux state and token from localStorage. Manages connection states and handles
 * incoming WebSocket messages, updating Redux store accordingly. Attempts to reconnect
 * if the connection is lost, unless the user is logged out. Provides a method to send
 * messages over the WebSocket connection.
 */

const DashboardData = () => {
  const dispatch = useDispatch();
  const ip = process.env.REACT_APP_BACKEND_IP;
  const port = process.env.REACT_APP_DASHBOARD_SOCKET_PORT;
  const account = useSelector((state) => state.account);
  const isLogOut = useSelector((state) => state.logout);
  const socketRef = useRef(null);
  const connectingRef = useRef(false);
  const connectedRef = useRef(false);
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

      // Abort if logged out or token missing
      if (isLogOut === 1 || !currentToken) {
        console.warn(
          "WebSocket connection aborted: User is logged out or token is missing."
        );
        return;
      }

      // Prevent duplicate connections
      if (
        socketRef.current &&
        (socketRef.current.readyState === WebSocket.OPEN ||
          socketRef.current.readyState === WebSocket.CONNECTING) &&
        prevTokenRef.current === currentToken
      ) {
        console.log("WebSocket is already open or connecting. Skipping...");
        return;
      }

      if (connectingRef.current) {
        console.log("WebSocket is in the process of connecting. Skipping...");
        return;
      }

      // Close existing connection if any
      if (socketRef.current) {
        socketRef.current.close();
      }

      connectingRef.current = true;

      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const socket = new WebSocket(
        `${protocol}://${ip}:${port}?token=${currentToken}`
      );

      socket.onopen = () => {
        reconnectAttemptsRef.current = 0;
        connectingRef.current = false;
        connectedRef.current = true;
        prevTokenRef.current = currentToken;
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          // console.log(message)
          const { key, result, current_time } = message;
          switch (key) {
            case "total_calls":
              dispatch({
                type: "SET_ONLINEDASHBOARD_DATA",
                realTimePbxDashboardData: result,
              });
              break;
            default:
              break;
          }
        } catch (err) {
          console.error("WebSocket message JSON parse error:", event.data);
        }
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
        connectingRef.current = false;
        connectedRef.current = false;
      };

      socket.onclose = () => {
        console.warn("WebSocket closed.");
        connectingRef.current = false;
        connectedRef.current = false;

        if (reconnectAttemptsRef.current < 5 && isLogOut !== 1) {
          reconnectAttemptsRef.current++;
          setTimeout(connectWebSocket, 5000);
        }
      };

      socketRef.current = socket;
    };

    const currentToken = localStorage.getItem("token");

    // Connect only if account is valid and token exists
    if (account?.account_id && currentToken && isLogOut !== 1) {
      connectWebSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        connectingRef.current = false;
        connectedRef.current = false;
      }
    };
  }, [account?.account_id, ip, port, isLogOut]);

  return { sendMessage };
};

export default DashboardData;
