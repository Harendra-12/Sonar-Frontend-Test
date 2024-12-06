import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSessionCall } from 'react-sipjs';

function AutoAnswer({ id }) {
  const dispatch = useDispatch();
  const { session } = useSessionCall(id);
  const memeber_id = useSelector((state) => state.memberId);
  console.log("Autoanswersession", session);
  
  if (session && session.state === "Initial" && !memeber_id) {
    session.accept({
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: false,
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
