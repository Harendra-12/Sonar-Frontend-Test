/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useSessionCall } from "react-sipjs";

// Conference component
function ConferenceTest() {
    const callProgressId = useSelector((state) => state.callProgressId);
    console.log("callProgressId", callProgressId);
    
    const {
        session,
      } = useSessionCall(callProgressId);
      const [participants, setParticipants] = useState([]);
      const [activeSpeaker, setActiveSpeaker] = useState(null);

      useEffect(() => {
        if (!session) return;
    
        // Subscribe to conference notifications
        const subscription = session.subscribe({
          request: {
            method: "SUBSCRIBE",
            headers: {
              Event: "conference-info",
            },
          },
        });
    
        subscription.delegate = {
          onNotify: (notify) => {
            const xmlData = notify.request.body;
    
            // Parse XML data to extract participants and active speaker
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlData, "text/xml");
    
            const newParticipants = Array.from(
              xmlDoc.getElementsByTagName("user")
            ).map((userNode) => ({
              id: userNode.getAttribute("id"),
              isSpeaking: userNode.getElementsByTagName("status")[0].textContent === "speaking",
            }));
    
            const activeSpeakerId = newParticipants.find(
              (user) => user.isSpeaking
            )?.id || null;
    
            setParticipants(newParticipants);
            setActiveSpeaker(activeSpeakerId);
          },
        };
    
        return () => {
          subscription.unsubscribe();
        };
      }, [session]);
      const audioAnalyserRefs = useRef({}); // Track audio analysers by participant
        console.log("participants",participants)
      console.log("activeSpeaker",activeSpeaker)
      useEffect(() => {
        if (session && session.sessionDescriptionHandler) {
          const { peerConnection } = session.sessionDescriptionHandler;
    
          // Check if peerConnection already has remote tracks
          if (peerConnection) {
            initializeParticipants(peerConnection);
          } else {
            // Wait for the session to establish the sessionDescriptionHandler
            session.sessionDescriptionHandler.on("setRemoteDescription", () => {
              initializeParticipants(session.sessionDescriptionHandler.peerConnection);
            });
          }
        }
      }, [session]);
    
      const initializeParticipants = (peerConnection) => {
        const remoteAudioTracks = [];
      
        // Loop through all remote streams to gather participants
        peerConnection.getRemoteStreams().forEach((stream) => {
          const audioTracks = stream.getAudioTracks();
          audioTracks.forEach((track) => {
            const participantId = track.id;
            if (!remoteAudioTracks.find((p) => p.id === participantId)) {
              remoteAudioTracks.push({ id: participantId, stream: new MediaStream([track]) });
      
              // Set up audio analyser for this participant
              const audioContext = new AudioContext();
              const analyser = audioContext.createAnalyser();
              const source = audioContext.createMediaStreamSource(new MediaStream([track]));
              source.connect(analyser);
              audioAnalyserRefs.current[participantId] = analyser;
      
              // Monitor audio level for speaker detection
              monitorAudioLevel(participantId, analyser);
            }
          });
        });
      
        setParticipants(remoteAudioTracks);
      };
      
    
      const monitorAudioLevel = (participantId, analyser) => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const checkVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
    
          // Threshold-based detection
          if (volume > 20) {
            setActiveSpeaker(participantId);
          } else if (activeSpeaker === participantId) {
            setActiveSpeaker(null);
          }
          requestAnimationFrame(checkVolume);
        };
        checkVolume();
      };
    
      return (
        <div>
          <h3>Conference Participants</h3>
          <ul>
            {participants.map((p) => (
              <li key={p.id} style={{ fontWeight: p.id === activeSpeaker ? "bold" : "normal" }}>
                Participant {p.id}
              </li>
            ))}
          </ul>
        </div>
      );
    }
export default ConferenceTest;
