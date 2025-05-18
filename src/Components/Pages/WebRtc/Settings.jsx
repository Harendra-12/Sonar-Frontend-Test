import React, { useEffect, useState } from 'react'
import SoundSettings from './SoundSettings'
import { featureUnderdevelopment, logout } from '../../GlobalFunction/globalFunction';
import { useDispatch, useSelector } from 'react-redux';
import { useSIPProvider } from 'modify-react-sipjs';
import LogOutPopUp from './LogOutPopUp';
import HeaderApp from './HeaderApp';

const Settings = (
    {
        audioRef,
        audioCtxRef,
        gainNodeRef,
        analyserRef,
        volume,
        setVolume,
        allContactLoading,
        setAllContactLoading,
        audio,
        handleVolumeChange
    }) => {
    return (
        <>
            <div className="setting_dropdown">
                <div class="p-2 header">
                    <div class="d-flex align-items-center justify-content-between">
                        <p class="mb-1 fs-17 fw-medium">Media Settings</p>
                    </div>
                </div>
                <div className="mt-3">
                    <div className="mb-2">
                        <label>Speaker:</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            style={{ width: '100%' }}
                            onChange={() => featureUnderdevelopment()}
                        />
                    </div>
                    <div className="mb-2">
                        <label>Ring Device:</label>
                        <SoundSettings
                            audio={audio}
                            setVolume={setVolume}
                            gainNodeRef={gainNodeRef}
                            audioCtxRef={audioCtxRef}
                            analyserRef={analyserRef}
                            audioRef={audioRef}
                            volume={volume}
                            handleVolumeChange={handleVolumeChange}
                        />
                    </div>
                    <div className="mb-2">
                        <label>Microphone:</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            style={{ width: '100%' }}
                            onChange={() => featureUnderdevelopment()}
                        />


                        {/* <h2 className="titleName">Basic Checkboxes</h2> */}
                        <div class="basic-container mt-3">
                            <div>
                                <input type="checkbox" id="basic1" onChange={() => featureUnderdevelopment()} />
                                <label for="basic1">Auto Gain Control</label>
                            </div>
                            <div>
                                <input type="checkbox" id="basic2" onChange={() => featureUnderdevelopment()} />
                                <label for="basic2">Echo Cancellation</label>
                            </div>
                            <div>
                                <input type="checkbox" id="basic3" onChange={() => audioRef.current?.pause()} />
                                <label for="basic3">Stop Ringtone</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Settings