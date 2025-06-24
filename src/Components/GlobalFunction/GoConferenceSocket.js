import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';

function GoConferenceSocket() {
    const dispatch = useDispatch();
    const ip = process.env.REACT_APP_BACKEND_IP;
    const port = process.env.REACT_APP_GOLANG_CONFERENCE_SOCKET_PORT;
    const account = useSelector((state) => state.account);
    const RoomID = useSelector((state) => state.RoomID);
    const isLogOut = useSelector((state) => state.logout);

    const socketRef = useRef(null);
    const connectingRef = useRef(false);
    const prevRoomidRef = useRef(null);
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
            // Abort if user is logged out or roomid is missing
            if (isLogOut === 1 || !RoomID) {
                console.warn("WebSocket connection aborted: User is logged out or room id is missing.");
                return;
            }

            // Don't reconnect if the socket is already open and roomid hasn’t changed
            if (
                socketRef.current &&
                socketRef.current.readyState === WebSocket.OPEN &&
                prevRoomidRef.current === RoomID
            ) {
                return;
            }

            // Prevent multiple parallel connection attempts
            if (connectingRef.current) {
                return;
            }

            // Close existing socket if socket not open
            if (socketRef.current) {
                socketRef.current.close();
            }

            connectingRef.current = true;

            const socket = new WebSocket(`wss://${ip}:${port}/ws?id=${RoomID}`);

            socket.onopen = () => {
                reconnectAttemptsRef.current = 0;
                connectingRef.current = false;
                prevRoomidRef.current = RoomID;
            };

            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                switch (parsedData.action) {
                    case "handRaise":
                        dispatch({ type: "SET_HAND_RAISE", handRaises: parsedData });
                        break;
                    default:
                        console.log("Unknown action:", parsedData);
                        break;
                }
            }

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

        }

        if (account && account.account_id && RoomID) {
            connectWebSocket();
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [account, RoomID, ip, port]);


    return { sendConferenceMessage }
}

export default GoConferenceSocket