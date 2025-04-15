import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSessionCall } from 'modify-react-sipjs';

/**
 * AutoAnswer is a component that listens for incoming calls and auto answers them if they are in the "Initial" state and the user is not a member of a conference.
 * The component is connected to the redux store and uses the useSessionCall hook to get the session object.
 * It also uses the useSlector hook to get the memeber_id from the store.
 * If the session is in the "Initial" state and the user is not a member of a conference, the component will accept the call with the given constraints.
 * The component also dispatches an action to set the dummySession in the store.
 * @param {string} id - The id of the session.
 * @param {boolean} isVideoOn - Whether the video is on or not.
 * @returns {React.Component} - A React component that renders nothing but auto answers a call if the conditions are met.
 */
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
