import SoundSettings from './SoundSettings'
import { featureUnderdevelopment } from '../../GlobalFunction/globalFunction';

const Settings = (
    {
        audioRef,
        audioCtxRef,
        gainNodeRef,
        analyserRef,
        volume,
        setVolume,
        audio,
        handleVolumeChange
    }) => {
    return (
        <>
            <div className="setting_dropdown">
                <div className="p-2 header">
                    <div className="d-flex align-items-center justify-content-between">
                        <p className="mb-1 fs-17 fw-medium">Media Settings</p>
                    </div>
                </div>
                <div className="mt-3">
                    <div className="mb-2">
                        <div className='formLabel'>
                            <label>Speaker:</label>
                        </div>
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
                        <div className='formLabel '>
                            <label>Ring Device:</label>
                        </div>
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
                        <div className='formLabel '>
                            <label>Microphone:</label>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            style={{ width: '100%' }}
                            onChange={() => featureUnderdevelopment()}
                        />


                        {/* <h2 className="titleName">Basic Checkboxes</h2> */}
                        <div className="basic-container mt-3">
                            <div>
                                <input type="checkbox" id="basic1" onChange={() => featureUnderdevelopment()} />
                                <label htmlFor="basic1" style={{ color: 'var(--color-subtext)' }}>Auto Gain Control</label>
                            </div>
                            <div>
                                <input type="checkbox" id="basic2" onChange={() => featureUnderdevelopment()} />
                                <label htmlFor="basic2" style={{ color: 'var(--color-subtext)' }}>Echo Cancellation</label>
                            </div>
                            <div>
                                <input type="checkbox" id="basic3" onChange={() => audioRef.current?.pause()} />
                                <label htmlFor="basic3" style={{ color: 'var(--color-subtext)' }}>Stop Ringtone</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Settings