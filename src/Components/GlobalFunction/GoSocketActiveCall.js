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

const GoSocket = () => {
  const dispatch = useDispatch();
  const ip = process.env.REACT_APP_BACKEND_IP;
  const port = process.env.REACT_APP_GOLANG_ACTIVECALL_SOCKET_PORT;
  const account = useSelector((state) => state.account);
  const RoomID = useSelector((state) => state.RoomID);
  const isLogOut = useSelector((state) => state.logout);

  const socketRef = useRef(null);
  const connectingRef = useRef(false);
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

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN &&
        prevTokenRef.current === currentToken
      ) {
        return;
      }

      if (connectingRef.current) return;

      if (socketRef.current) {
        socketRef.current.close();
      }

      connectingRef.current = true;

      const socket = new WebSocket(`wss://${ip}:${port}?token=${currentToken}`);

      socket.onopen = () => {
        reconnectAttemptsRef.current = 0;
        connectingRef.current = false;
        prevTokenRef.current = currentToken;
      };

      socket.onmessage = (event) => {
        const parsedData = event.data;
        if (typeof parsedData === "string") {
          try {
            const message = JSON.parse(parsedData);
            const { key, result, current_time } = message;

            switch (key) {
              case "activeCalls":
                dispatch({
                  type: "SET_ACTIVECALL",
                  activeCall: result
                    .filter((item) => item.application_state !== "conference" && item.account_id == account.account_id)
                    .map((item) => ({ ...item, serverTime: current_time })),
                });
                break;
              default:
                break;
            }
          } catch (e) {
            console.error("Error parsing WebSocket message:", e);
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
          reconnectAttemptsRef.current++;
          setTimeout(connectWebSocket, 5000);
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
  }, [account, ip, port, isLogOut]);

  return { sendMessage };
};

export default GoSocket;
