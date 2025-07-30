/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../Redux/reduxActionType";

/**
 * Establishes a WebSocket connection to a specified server using account information
 * from Redux state and token from localStorage. Manages connection states and handles
 * incoming WebSocket messages, updating Redux store accordingly. Attempts to reconnect 
 * if the connection is lost, unless the user is logged out. Provides a method to send 
 * messages over the WebSocket connection.
 */

const GoPeerGroupCallSocket = () => {
    const dispatch = useDispatch();
    const ip = process.env.REACT_APP_BACKEND_IP;
    const port = process.env.REACT_APP_GOLANG_GROUP_PEERCALL_SOCKET_PORT;
    const account = useSelector((state) => state.account);
    const isLogOut = useSelector((state) => state.logout);
    const socketRef = useRef(null);
    const connectingRef = useRef(false);
    const reconnectAttemptsRef = useRef(0);
    const prevTokenRef = useRef(null);
    const sendGroupMessage = (data) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(data));
        } else {
            console.warn("WebSocket is not open. Unable to send message.");
        }
    };

    useEffect(() => {
        const connectWebSocket = () => {
            const currentToken = localStorage.getItem("token");

            // Abort if user is logged out or token is missing
            if (isLogOut === 1 || !currentToken) {
                console.warn("WebSocket connection aborted: User is logged out or token is missing.");
                return;
            }

            // Don't reconnect if the socket is already open and token hasn’t changed
            if (
                socketRef.current &&
                socketRef.current.readyState === WebSocket.OPEN &&
                prevTokenRef.current === currentToken
            ) {
                return;
            }

            // Prevent multiple parallel connection attempts
            if (connectingRef.current) {
                return;
            }

            // Close existing socket if token changed or socket not open
            if (socketRef.current) {
                socketRef.current.close();
            }

            connectingRef.current = true;

            const socket = new WebSocket(`wss://${ip}:${port}/ws?token=${currentToken}`);

            socket.onopen = () => {
                reconnectAttemptsRef.current = 0;
                connectingRef.current = false;
                prevTokenRef.current = currentToken;
            };

            socket.onmessage = (event) => {
                const parsedData = (event.data);
                if (typeof parsedData === "string") {
                    const message = JSON.parse(parsedData);
                    const { key, result, current_time } = message;
                    switch (key) {
                        case "incoming_peer_group_call":
                            dispatch({ type: "SET_INCOMINGCALL", incomingCall: { ...result, source: "incoming_peer_group_call" } });
                            break;
                        case "initiate_peer_group_call":
                            dispatch({ type: ActionType?.SET_GROUP_INTERNALCALLACTION, internalGroupCallAction: result, });
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

    return { sendGroupMessage };
};

export default GoPeerGroupCallSocket;
