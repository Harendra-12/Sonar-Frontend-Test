import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSessionCall } from 'modify-react-sipjs';

function AutoAnswer({ id,isVideoOn }) {
  const dispatch = useDispatch();
  const { session } = useSessionCall(id);
  const memeber_id = useSelector((state) => state.memberId);
  if (session && session.state === "Initial" && !memeber_id) {
    session.accept({
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: isVideoOn,
        },
      },
    });
  }
  dispatch({
    type: "SET_DUMMYSION",
    dummySession: id,
  });
  return (
    <div>

    </div>
  )
}

export default AutoAnswer
