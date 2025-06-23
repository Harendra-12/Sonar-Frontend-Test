import React from 'react'

const SpeechSettings = ({ambient_sound,setAmbientSounds,ambient_sound_volume,setAmbientSoundVolume, setResponsiveness,responsiveness, setInterruptionSensitivity,interruption_sensitivity, enable_backchannel,setEnableBackchannel,setSttModel,stt_mode, setBoostedKeywords,boosted_keywords, normalize_for_speech,setNormalizeForSpeech,enable_transcription_formatting, setEnableTranscriptionFormatting,reminder_trigger_ms,setReminderTriggerMs}) => {
    return (
        <>
            <div className=' '>
                <div className="formLabel mw-100">
                    <label>Background Sound</label>
                </div>
                <div className="formRow align-items-start px-0 gap-2">
                    <div className='dropdown' style={{ flex: "auto" }}>
                        <button class="btn btn-secondary dropdown-toggle text-start w-100" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {ambient_sound?ambient_sound:"None"}
                        </button>
                        <ui class="dropdown-menu settingMenu">
                            <li><a class="dropdown-item" onClick={()=>setAmbientSounds(null)}>None</a></li>
                            <li><a class="dropdown-item" onClick={()=>setAmbientSounds("coffee-shop")}>Coffee Shop</a></li>
                            <li><a class="dropdown-item" onClick={()=>setAmbientSounds("convention-hall")}>Convention Hall</a></li>
                            <li><a class="dropdown-item" onClick={()=>setAmbientSounds("summer-outdoor")}>Summer Outdoor</a></li>
                            <li><a class="dropdown-item" onClick={()=>setAmbientSounds("mountain-outdoor")}>Mountain Outdoor</a></li>
                            <li><a class="dropdown-item" onClick={()=>setAmbientSounds("static-noise")}>Static Noise</a></li>
                            <li><a class="dropdown-item" onClick={()=>setAmbientSounds("call-center")}>Call Center</a></li>
                        </ui>
                    </div>
                    <div className='dropdown'>
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fa-regular fa-gear"></i>
                        </button>
                        <div class="dropdown-menu settingMenu">
                            <div className=" aiAgentTab p-3">

                                <div className=''>
                                    <div className="mb-2">
                                        <div class="formLabel">
                                            <label>Volume:</label>
                                        </div>
                                        <input type="range"  defaultValue={ambient_sound_volume}
                              max={2}
                              step={0.1} onChange={(e) => setAmbientSoundVolume(e.target.value)} style={{ width: '80%' }} /> <span className='textGray'>{ambient_sound_volume}</span>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=''>
                <div className="mb-2">
                    <div class="formLabel mw-100">
                        <label>Responsiveness: </label><br />
                        <span className='iconGray'>Controls how responsive is the agent.</span>
                    </div>
                    <input type="range" defaultValue={responsiveness}
                      max={1}
                      step={0.1} onChange={(e) => setResponsiveness(e.target.value)} style={{ width: '80%' }} /> <span className='textGray'>{responsiveness}</span>
                </div>
                <div className="mb-2">
                    <div class="formLabel mw-100">
                        <label>Interruption Sensitivity</label><br/>
                        <span className='iconGray'>Controls how sensitive the agent is to user interruptions</span>
                    </div>
                    <input type="range" defaultValue={interruption_sensitivity}
                      max={1}
                      step={0.1} onChange={(e) => setInterruptionSensitivity(e.target.value)} style={{ width: '60%' }} /> <span className='textGray'>{interruption_sensitivity}</span>
                </div>
                <div className="mb-2">
                    <div class="formLabel mw-100">
                        <label>Enable Backchanneling</label> <br/>
                        <span className='iconGray'>Enables the agent to use affirmations like 'yeah' or 'uh-huh' during conversations, indicating active listening and engagement</span>
                    </div>
                    <div className="cl-toggle-switch">
                        <label className="cl-switch">
                            <input type="checkbox" checked={enable_backchannel} onChange={(e) => setEnableBackchannel(e.target.checked)} id="showAllCheck" />
                            <span></span>
                        </label>
                    </div>
                </div>
            </div>
            <div>
                <div className="col-12 mb-2">
                    <label className="label radioLabel d-flex align-items-center gap-2" >
                        <input
                            checked={stt_mode === "fast"}
                            type="radio"
                            id="send-now"
                            name="value-radio"
                            onChange={(e) => setSttModel("fast")}


                        />
                        <p className="textGray mb-0">Optimize for speed</p>
                    </label>
                </div>
                <div className="col-12 mb-2">
                    <label className="label radioLabel d-flex align-items-center gap-2">
                        <input
                            checked={stt_mode === "accurate"}
                            type="radio"
                            id="send-now"
                            name="value-radio"
                            onChange={(e) => setSttModel("accurate")}

                        />
                        <p className="textGray mb-0">Optimize for accuracy</p>
                    </label>
                </div>
                <div class="formLabel mw-100">
                    <label>Boosted Keywords</label> <br/>
                    <span className='iconGray'>Provide a customized list of keywords to expand our models' vocabulary.</span>
                </div>
                <div className="formRow flex-column align-items-start px-0">
                    <div className="formLabel">
                        <label>Name</label>
                    </div>
                    <div className="col-12">
                        <input
                            type="text"
                            className="formItem"
                            placeholder='Enter Name'
                            value={boosted_keywords}
                    onChange={(e) => setBoostedKeywords([e.target.value])}
                        />
                    </div>
                </div>
                <div className="mb-2">
                    <div class="formLabel mw-100">
                        <label>Enable Speech Normalization</label><br/>
                        <span className='iconGray'>It converts text elements like numbers, currency, and dates into human-like spoken forms. (Learn more)</span>
                    </div>
                    <div className="cl-toggle-switch">
                        <label className="cl-switch">
                            <input type="checkbox" checked={normalize_for_speech} onChange={(e) => setNormalizeForSpeech(e.target.checked)}  id="showAllCheck" />
                            <span></span>
                        </label>
                    </div>
                </div>
                <div className="mb-2">
                    <div class="formLabel mw-100">
                        <label>Enable Transcript Formatting</label><br/>
                        <span className='iconGray'>Prevent agent errors like phone numbers being formatted as timestamps.</span>
                    </div>
                    <div className="cl-toggle-switch">
                        <label className="cl-switch">
                            <input type="checkbox" checked={enable_transcription_formatting} onChange={(e) => setEnableTranscriptionFormatting(e.target.checked)} id="showAllCheck" />
                            <span></span>
                        </label>
                    </div>
                </div>
                <div className="mb-2">
                    <div class="formLabel mw-100">
                        <label>Reminder Message Frequency</label><br/>
                        <span className='iconGray'>Control how often AI will send a reminder message.</span>
                    </div>
                   <div class="formRow flex-column align-items-start px-0 "><div class="formLabel"><label>Description <span>(Optional)</span><button class="clearButton text-align-start"><i class="fa-regular fa-circle-exclamation "></i></button></label></div><div class="row w-100"><div class="col-9"><input type="number" value={reminder_trigger_ms}
                      onChange={(e) => setReminderTriggerMs(e.target.value)} class="formItem" placeholder="1000" /></div><div class="col-3"><span className='textGray'>miliseconds</span></div></div></div>
                </div>
            </div>
        </>
    )
}

export default SpeechSettings