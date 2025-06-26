import React, { useEffect, useRef } from "react";
import {
  useIsSpeaking,
  useParticipantTracks,
  VideoTrack,
} from "@livekit/components-react";

const getInitials = (name) =>
  name?.split(" ").map((n) => n[0]).join("").toUpperCase();

const ParticipantCard = ({ participant }) => {
  const isSpeaking = useIsSpeaking(participant);
  const tracks = useParticipantTracks(participant);

  const cameraTrack = tracks.find((t) => t.publication.source === "camera");

  return (
    <div className={`participant-card ${isSpeaking ? "speaking" : ""}`}>
      {cameraTrack ? (
        <VideoTrack trackRef={cameraTrack} isLocal={false} />
      ) : (
        <div className="avatar">
          <div className="avatar-circle">
            {getInitials(participant.name || participant.identity)}
          </div>
        </div>
      )}
      <div className="participant-name">
        {participant.name || participant.identity}
      </div>
    </div>
  );
};

export default ParticipantCard;
