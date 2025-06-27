import React from "react";
import {
  LiveKitRoom,
  useSortedParticipants,
} from "@livekit/components-react";
import ParticipantCard from "./ParticipantCard";

const Recorder = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const serverUrl = "wss://your.livekit.server"; // Replace with yours

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      audio={true}
      video={true}
      style={{ height: "100vh", width: "100vw" }}
    >
      <RecordingLayout />
    </LiveKitRoom>
  );
};

const RecordingLayout = () => {
  const participants = useSortedParticipants();

  return (
    <div className="recording-grid">
      {participants.map((p) => (
        <ParticipantCard key={p.identity} participant={p} />
      ))}
    </div>
  );
};

export default Recorder;
