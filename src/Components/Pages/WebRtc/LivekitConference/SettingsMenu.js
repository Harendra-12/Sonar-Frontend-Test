/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "@livekit/components-styles"; // Importing LiveKit styles
import { useRoomContext, TrackToggle, MediaDeviceMenu } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useDispatch } from "react-redux";
import { generalGetFunction } from "../../../GlobalFunction/globalFunction";
import axios from "axios";
import { toast } from "react-toastify";
// import { generalGetFunction } from "./GlobalFunction/globalFunction";

const SettingsMenu = () => {
    const room = useRoomContext();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: "SET_PARTICIPANTS", allParticipants: room });
        console.log("hii");

    }, [room])
    // console.log(room);
    const [isRecording, setIsRecording] = useState(false);
    const [isNoiseFilterEnabled, setNoiseFilterEnabled] = useState(false);
    const [processingRecRequest, setProcessingRecRequest] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null); // Store MediaRecorder instance
    const [combinedStream, setCombinedStream] = useState(null); // Store combined stream
    const tabs = ["media", "effects"];
    const [activeTab, setActiveTab] = useState("media");
    const startRecording = async () => {
        try {
            // Capture the screen
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            // Capture the audio
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Combine screen and audio streams
            const combinedStream = new MediaStream([
                ...screenStream.getVideoTracks(),
                ...audioStream.getAudioTracks(),
            ]);
            setCombinedStream(combinedStream); // Save the combined stream

            // Create a MediaRecorder for the combined stream
            const mediaRecorder = new MediaRecorder(combinedStream);
            setMediaRecorder(mediaRecorder); // Save the MediaRecorder instance

            mediaRecorder.ondataavailable = async (event) => {
                if (event.data.size > 0) {
                    // Send the recorded data to the backend
                    await fetch("http://localhost:5000/recording/data", {
                        method: "POST",
                        body: event.data,
                    });
                }
            };

            mediaRecorder.onstop = () => {
                // Stop all tracks when recording stops
                combinedStream.getTracks().forEach((track) => track.stop());
                setCombinedStream(null); // Clear the combined stream
                setMediaRecorder(null); // Clear the MediaRecorder instance
            };

            mediaRecorder.start(1000); // Send data every 1 second
            console.log("Recording started");
        } catch (error) {
            console.error("Error starting recording:", error);
            alert("Failed to start recording: " + error.message);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop(); // Stop the MediaRecorder
        }
        if (combinedStream) {
            combinedStream.getTracks().forEach((track) => track.stop()); // Stop all media tracks
        }
        setMediaRecorder(null); // Clear the MediaRecorder instance
        setCombinedStream(null); // Clear the combined stream
        console.log("Recording stopped");
    };

    // const toggleRoomRecording = async () => {
    //     setProcessingRecRequest(true);
    //     try {
    //         const response = await axios.post(
    //             `http://localhost:5000/recording/${isRecording ? "stop" : "start"}`,
    //             { roomName: room.name }
    //         );

    //         if (response.status === 200) {
    //             if (isRecording) {
    //                 stopRecording(); // Stop recording on the frontend
    //             } else {
    //                 startRecording(); // Start recording on the frontend
    //             }
    //             setIsRecording(!isRecording); // Toggle the recording state
    //         }
    //     } catch (error) {
    //         console.error("Error toggling recording:", error);
    //     } finally {
    //         setProcessingRecRequest(false);
    //     }
    // };

    async function toggleRoomRecording() {
        if (isRecording) {
            // const apiData = await generalGetFunction(`/stop-recording?roomName=${room.name}`);
            const response = await axios.get(`https://meet.webvio.in/backend/stop-recording?roomName=${room.name}`);
            if (response.data.success) {
                toast.success(response.data.message);
                setIsRecording(false);
            } else {
                toast.error(response.data.message);
                setIsRecording(false);
            }

            // if(apiData.status){

            // }
            // stopRecording();
        } else {
            // const apiData = await generalGetFunction(`/start-recording?roomName=${room.name}`);
            const response = await axios.get(`https://meet.webvio.in/backend/stop-recording?roomName=${room.name}`);
            if (response.data.success) {
                toast.success(response.data.message);
                setIsRecording(true);
            } else {
                toast.error(response.data.message);
                setIsRecording(false);
            }
        }
    }

    const handleCloseSettings = () => {
        const btns = document.getElementsByClassName('lk-settings-toggle');
        if (btns.length > 0) {
            btns[0].click();
        }
    }
    return (
        <div className="settings-menu">
            {/* <div className="tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`tab ${tab === activeTab ? "active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div> */}
            <div className="tab-content">
                {activeTab === "media" && (
                    <>
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-3">
                            <h3 className="fs-4 mb-0">Media Settings </h3>
                            <button className="aitable_button bg-transparent" onClick={handleCloseSettings}><i class="fa-solid fa-xmark"></i></button>
                        </div>
                        <section className="wrap mt-3">
                            <h4>Camera</h4>
                            <div className="lk-button-group">
                                <TrackToggle source={Track.Source.Camera}>Toggle Camera</TrackToggle>
                                <MediaDeviceMenu kind="videoinput" style={{ borderRadius: '0 0.5rem 0.5rem 0' }} />
                            </div>
                        </section>
                        <section className="wrap">

                            <h4>Microphone</h4>
                            <div className="lk-button-group">
                                <TrackToggle source={Track.Source.Microphone}>Toggle Microphone</TrackToggle>
                                <MediaDeviceMenu kind="audioinput" style={{ borderRadius: '0 0.5rem 0.5rem 0' }} />
                            </div>
                        </section>
                        <section className="wrap">
                            <h4>Enable Noise Cancellation</h4>
                            <div>
                                <div className="my-auto position-relative mx-1">
                                    <label className="switch">
                                        <input type="checkbox" id="showAllCheck" checked={isNoiseFilterEnabled} onChange={(e) => setNoiseFilterEnabled(e.target.checked)} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                                {/* <input
                                    type="checkbox"
                                    checked={isNoiseFilterEnabled}
                                    onChange={(e) => setNoiseFilterEnabled(e.target.checked)}
                                // disabled={isNoiseFilterPending}
                                /> */}
                            </div>
                        </section>
                        {/* <section>
                <h4>Speaker</h4>
                <MediaDeviceMenu kind="audiooutput" />
              </section> */}
                    </>
                )}
                {activeTab === "effects" && (
                    <>
                        <h3>Audio Effects</h3>
                        <section>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isNoiseFilterEnabled}
                                    onChange={(e) => setNoiseFilterEnabled(e.target.checked)}
                                // disabled={isNoiseFilterPending}
                                />
                                Enable Noise Cancellation
                            </label>
                        </section>
                    </>
                )}
                {activeTab === "recording" && (
                    <>
                        <h3>Recording</h3>
                        <section>
                            <p>
                                {isRecording
                                    ? "Recording is currently active."
                                    : "No active recordings."}
                            </p>
                            <button
                                onClick={toggleRoomRecording}
                                disabled={processingRecRequest}
                            >
                                {isRecording ? "Stop Recording" : "Start Recording"}
                            </button>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};
export default SettingsMenu;