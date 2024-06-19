import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Socket = () => {
  const dispatch = useDispatch();
  const ip = "192.168.1.88";
  const port = "8093";
  const account = useSelector((state) => state.account);
  const token = localStorage.getItem("token");
  const socketRef = useRef(null);

  useEffect(() => {
    var reconnectValue = 0
    const connectWebSocket = () => {
      const socket = new WebSocket(`ws://${ip}:${port}?token=${token}`);

      socket.onopen = () => {
        console.log('WebSocket connection successful.');
      };
      socket.onmessage = (event) => {
        console.log(JSON.parse(event.data));
        if(typeof(JSON.parse(event.data)) === "string"){
          if(JSON.parse(JSON.parse(event.data))["key"] === "UserRegister"){
            dispatch({
              type: "SET_REGISTERUSER",
              registerUser: JSON.parse(JSON.parse(event.data))["result"]
            });
          }else if(JSON.parse(JSON.parse(event.data))["key"] === "onlineUser"){
            dispatch({
              type: "SET_LOGINUSER",
              loginUser: JSON.parse(JSON.parse(event.data))["result"]
            });
          }else if(JSON.parse(JSON.parse(event.data))["key"] === "CallState"){
            dispatch({
              type: "SET_CALLSTATE",
              callState: JSON.parse(JSON.parse(event.data))["result"]
            });
          }else if(JSON.parse(JSON.parse(event.data))["key"]==="ChannelHangupComplete"){
            dispatch({
              type:"SET_CHANNELHANGUP",
              channelHangupComplete:JSON.parse(JSON.parse(event.data))["result"]
            })
          }
        } else {
          console.log("This is else condition", JSON.parse(event.data));
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      socket.onclose = () => {
        console.log('WebSocket connection closed. Reconnecting...');
        if(reconnectValue<5){
          reconnectValue = reconnectValue+1
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
