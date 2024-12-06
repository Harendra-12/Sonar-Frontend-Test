import React from 'react'
import { useDispatch } from 'react-redux';
import { useSessionCall } from 'react-sipjs';

function AutoAnswer({ id }) {
  const dispatch = useDispatch();
  const { session } = useSessionCall(id);
  if (session && session.state === "Initial") {
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
