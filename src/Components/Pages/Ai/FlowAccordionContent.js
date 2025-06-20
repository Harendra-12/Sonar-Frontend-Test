import Tippy from '@tippyjs/react';
import React, { useEffect } from 'react'
import { useState } from 'react';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Link } from 'react-router-dom';
import Select from 'react-select';
import KnowledgeBaseFlow from './KnowledgeBaseFlow';
import SpeechSettings from './SpeechSettings';
import {aiGeneralGetFunction, aiGeneralPostFunction, aiGeneralPutFunction } from '../../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';

const FlowAccordionContent = ({ 
  defaultName,
  setDefaultName,
  newAgent,
  saveClicked,
  agentData,
  llmData,
  setLoading,
  beginMessage,
  generalPrompt,
  setBeginMessage,
  setGeneralPrompt,
  }) => {
  const [agentId, setAgentId] = useState(agentData?.agent_id);
  const [endCallPopup, setEndCallPopup] = useState();
  const [callTransferPopup, setCallTransferPopup] = useState();
  const [checkCalendarAvailabilityPopup, setCheckCalendarAvailabilityPopup] = useState();
  const [bookCalendarPopup, setBookCalendarPopup] = useState();
  const [pressDigitsPopup, setPressDigitsPopup] = useState();
  const [customFunctionPopup, setCustomFunctionPopup] = useState();
  const [editCustomFunctionPopup, setEditCustomFunctionPopup] = useState();
  const [selectedTransfer, setSelectedTransfer] = useState('cold');
  const [value, setValue] = useState();
  const [selectVoice, SetSelectVoice] = useState();
  const [selectVoiceSettings, SetSelectVoiceSettings] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [editPostCallPopup, setEditPostCallPopup] = useState(false);


  // Initializing all the states for agent creation
  const [llm_id, setLlmId] = useState(null);
  const [voice_id, setVoiceId] = useState("11labs-Lily");
  const [voice_model, setVoiceModel] = useState("eleven_turbo_v2"); //The voice model to use for the agent. Default to eleven_turbo_v2.
  const [fallback_voice_ids, setFallbackVoiceIds] = useState(null);
  const [voice_temperature, setVoiceTemperature] = useState(1); //Controls how stable the voice is. Value ranging from [0,2]
  const [voice_speed, setVoiceSpeed] = useState(1); //Controls speed of voice. Value ranging from [0.5,2]
  const [volume, setVolume] = useState(1); //If set, will control the volume of the agent. Value ranging from [0,2]
  const [responsiveness, setResponsiveness] = useState(1); //Controls how responsive is the agent. Value ranging from [0,1]
  const [interruption_sensitivity, setInterruptionSensitivity] = useState(1); //Controls how sensitive the agent is to user interruptions. Value ranging from [0,1]
  const [enable_backchannel, setEnableBackchannel] = useState(false); //Controls whether the agent would backchannel (agent interjects the speaker with phrases like "yeah", "uh-huh" to signify interest and engagement)
  const [backchannel_frequency, setBackchannelFrequency] = useState(0); //Controls how often the agent would backchannel. Value ranging from [0,1]
  const [backchannel_words, setBackchannelWords] = useState(null);
  const [reminder_trigger_ms, setReminderTriggerMs] = useState(10000); //If set (in milliseconds), will trigger a reminder to the agent to speak if the user has been silent for the specified duration after some agent speech
  const [reminder_max_count, setReminderMaxCount] = useState(1); //If set, controls how many times agent would remind user when user is unresponsive
  const [ambient_sound, setAmbientSounds] = useState(null); //If set, will add ambient environment sound to the call to make experience more realistic Currently supports the following options: coffee-shop, convention-hall,summer-outdoor, mountain-outdoor, static-noise, call-center
  const [ambient_sound_volume, setAmbientSoundVolume] = useState(1); //If set, will control the volume of the ambient sound. Value ranging from [0,2]
  const [language, setLanguage] = useState("en-US"); //Specifies what language (and dialect) the speech recognition will operate in
  const [webhook_url, setWebhookUrl] = useState(null); //The webhook for agent to listen to call events.
  const [boosted_keywords, setBoostedKeywords] = useState(null); //Provide a customized list of keywords to bias the transcriber model, so that these words are more likely to get transcribed. Commonly used for names, brands, street, etc.
  const [enable_transcription_formatting, setEnableTranscriptionFormatting] =
    useState(false); //If set to true, will format transcription to number, date, email, etc. If set to false, will return transcripts in raw words
  const [opt_out_sensitive_data_storage, setOptOutSensitiveDataStorage] =
    useState(false); //Whether this agent opts out of sensitive data storage like transcript, recording, logging, inbound/outbound phone numbers, etc.
  const [opt_in_signed_url, setOptInSignedUrl] = useState(false); //Whether this agent opts in for signed URLs for public logs and recordings. When enabled, the generated URLs will include security signatures that restrict access and automatically expire after 24 hours.
  const [pronunciation_dictionary, setPronunciationDictionary] = useState(null); //A list of words / phrases and their pronunciation to be used to guide the audio synthesize for consistent pronunciation. Currently only supported for English & 11labs voices. Set to null to remove pronunciation dictionary from this agent.
  const [normalize_for_speech, setNormalizeForSpeech] = useState(false); //If set to true, will normalize the some part of text (number, currency, date, etc) to spoken to its spoken form for more consistent speech synthesis (sometimes the voice synthesize system itself might read these wrong with the raw text)
  const [end_call_after_silence_ms, setEndCallAfterSilenceMs] =
    useState(600000); //If users stay silent for a period after agent speech, end the call. The minimum value allowed is 10,000 ms (10 s). By default, this is set to 600000 (10 min).
  const [max_call_duration_ms, setMaxCallDurationMs] = useState(7200000); //Maximum allowed length for the call, will force end the call if reached. The minimum value allowed is 60,000 ms (1 min), and maximum value allowed is 7,200,000 (2 hours). By default, this is set to 3,600,000 (1 hour).
  const [enable_voicemail_detection, setEnableVoicemailDetection] =
    useState(false); //If set to true, will detect voicemail and pause the call if detected
  const [voicemail_message, setVoicemailMessage] = useState(""); //The message to be played when the call enters a voicemail. Note that this feature is only available for phone calls. If you want to hangup after hitting voicemail, set this to empty string
  const [voicemail_detection_timeout_ms, setVoicemailDetectionTimeoutMs] =
    useState(30000); //Configures when to stop running voicemail detection, as it becomes unlikely to hit voicemail after a couple minutes, and keep running it will only have negative impact
  const [post_call_analysis_data, setPostCallAnalysisData] = useState([]); //Post call analysis data to extract from the call. This data will augment the pre-defined variables extracted in the call analysis. This will be available after the call ends.
  const [post_call_analysis_model, setPostCallAnalysisModel] =
    useState("gpt-4o-mini"); //The model to use for post call analysis. Currently only supports gpt-4o-mini and gpt-4o. Default to gpt-4o-mini.
  const [begin_message_delay_ms, setBeginMessageDelayMs] = useState(0); //If set, will delay the first message by the specified amount of milliseconds, so that it gives user more time to prepare to take the call
  const [ring_duration_ms, setRingDurationMs] = useState(30000); //If set, the phone ringing will last for the specified amount of milliseconds. This applies for both outbound call ringtime, and call transfer ringtime
  const [stt_mode, setSttModel] = useState("fast"); //If set, determines whether speech to text should focus on latency or accuracy. Default to fast mode.
  const [allow_user_dtmf, setAllowUserDtmf] = useState(true); //If set to true, DTMF input will be accepted and processed. If false, any DTMF input will be ignored. Default to true.
  const [digit_limit, setDigitLimit] = useState(10); //The maximum number of digits allowed in the user's DTMF (Dual-Tone Multi-Frequency) input per turn. Once this limit is reached, the input is considered complete and a response will be generated immediately.
  const [termination_keys, setTerminationKeys] = useState("#"); //A single key that signals the end of DTMF input. Acceptable values include any digit (0–9), the pound/hash symbol (#), or the asterisk (*).
  const [timeout_ms, setTimeoutMs] = useState(15000); //The time (in milliseconds) to wait for user DTMF input before timing out. The timer resets with each digit received.
  const [denoising_mode, setDenoisingMode] = useState("noise-cancellation"); //If set, determines what denoising mode to use. Default to noise-cancellation..
  const [postCallName, setPostCallName] = useState("");
  const [postCallDescription, setPostCallDescription] = useState("");
  const [postCallExample, setPostCallExample] = useState("");
  const [allKnowledgeBases, setAllKnowledgeBases] = useState([]);
  const [allVoices, setAllVoices] = useState([]);
  const [postCallDataEdit, setPostCallDataEdit] = useState(null);
  const [model_high_priority, setModelHighPriority] = useState(false);
  const [model_temperature, setModelTemperature] = useState(0);
  const [model, setModel] = useState("gpt-4o");
  const [llmModels, setLlmModels] = useState([]);
  const [llmKnowlwdgeBaseIds, setLlmKnowlwdgeBaseIds] = useState([]);

  // LLm model Functions payload added to the agent
  const [general_tools, setGeneralTools] = useState([]);
  const [type, setType] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState("");
  const [transfer_destination, setTransferDestination] = useState({});
  const [transferType, setTransferType] = useState("predefined");
  const [transferNumber, setTransferNumber] = useState();
  const [transferPrompt, setTransferPrompt] = useState("");
  const [transfer_options, setTransferOptions] = useState({});
  const [transferOptionType, setTransferOptionType] = useState();
  const [show_transferee_as_caller, setShowTransfereeAsCaller] =
    useState(false);
  const [public_handoff_option, setPublicHandoffOption] = useState({});
  const [publicHandoffType, setPublicHandoffOptionType] = useState("prompt");
  const [publicHandOffPrompt, setPublicHandOffPrompt] = useState("");
  const [publicHandOffMessage, setPublicHandOffMessage] = useState("");
  const [cal_api_key, setCalApiKey] = useState();
  const [event_type_id, setEventTypeId] = useState();
  const [timezone, setTimezone] = useState();
  const [delay_ms, setDelayMs] = useState();
  const [url, setUrl] = useState();
  const [speak_during_execution, setSpeakDuringExecution] = useState(true);
  const [speak_after_execution, setSpeakAfterExecution] = useState(true);
  const [parameters, setParameters] = useState();
  const [execution_message_description, setExecutionMessageDescription] =
    useState();
  const [customTimeoutMs, setCustomTimeoutMs] = useState(120000);
  const [parameterType, setParameterType] = useState();
  const [parameterProperties, setParameterProperties] = useState({});
  const [parameterRequired, setParameterRequired] = useState([]);
  const [propertiesKey, setPropertiesKey] = useState();

  useEffect(() => {
    async function getData() {
      const apiData = await aiGeneralGetFunction("/knowledgebase/all");
      const voicesData = await aiGeneralGetFunction("/voice/all");
      const llmModelsData = await aiGeneralGetFunction("/llm/all");
      if (apiData.status) {
        setAllKnowledgeBases(apiData.knowledgeBaseResponses);
      }
      if (voicesData.status) {
        setAllVoices(
          voicesData.data.filter((item) => item.provider === "elevenlabs")
        );
      }
      if (llmModelsData.status) {
        setLlmModels(llmModelsData.data);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    if (agentData && !newAgent) {
      setLlmId(agentData.response_engine.llm_id);
      setVoiceId(agentData.voice_id);
      setDefaultName(agentData.agent_name);
      setVoiceModel(agentData.voice_model);
      setFallbackVoiceIds(agentData.fallback_voice_ids);
      setVoiceTemperature(agentData.voice_temperature);
      setVoiceSpeed(agentData.voice_speed);
      setVolume(agentData.volume);
      setResponsiveness(agentData.responsiveness);
      setInterruptionSensitivity(agentData.interruption_sensitivity);
      setEnableBackchannel(agentData.enable_backchannel);
      setBackchannelFrequency(agentData.backchannel_frequency);
      setBackchannelWords(agentData.backchannel_words);
      setReminderTriggerMs(agentData.reminder_trigger_ms);
      setEnableVoicemailDetection(agentData.enable_voicemail_detection);
      setVoicemailMessage(agentData.voicemail_message);
      setVoicemailDetectionTimeoutMs(agentData.voicemail_detection_timeout_ms);
      setPostCallAnalysisData(agentData.post_call_analysis_data);
      setPostCallAnalysisModel(agentData.post_call_analysis_model);
      setBeginMessageDelayMs(agentData.begin_message_delay_ms);
      setRingDurationMs(agentData.ring_duration_ms);
      setSttModel(agentData.stt_mode);
      setAllowUserDtmf(agentData.allow_user_dtmf);
      setDigitLimit(agentData.user_dtmf_options?.digit_limit);
      setTerminationKeys(agentData.user_dtmf_options?.termination_keys);
      setTimeoutMs(agentData.user_dtmf_options?.timeout_ms);
      setDenoisingMode(agentData.denoising_mode);
      setLanguage(agentData.language);
      setWebhookUrl(agentData.webhook_url);
      setBoostedKeywords(agentData.boosted_keywords);
      setEnableTranscriptionFormatting(
        agentData.enable_transcription_formatting
      );
      setOptOutSensitiveDataStorage(agentData.opt_out_sensitive_data_storage);
      setOptInSignedUrl(agentData.opt_in_signed_url);
      setPronunciationDictionary(agentData.pronunciation_dictionary);
      setNormalizeForSpeech(agentData.normalize_for_speech);
      setEndCallAfterSilenceMs(agentData.end_call_after_silence_ms);
      setMaxCallDurationMs(agentData.max_call_duration_ms);
      setAmbientSounds(agentData.ambient_sound);
      setAmbientSoundVolume(agentData.ambient_sound_volume);
      // Setting llm data
      setModel(llmData.model);
      setModelTemperature(llmData.model_temperature);
      setModelHighPriority(llmData.model_high_priority);
      setGeneralPrompt(llmData.general_prompt);
      setBeginMessage(llmData.begin_message);
      setLlmKnowlwdgeBaseIds(llmData.knowledge_base_ids || []);
      setGeneralTools(llmData.general_tools || []);
    }
  }, [agentData, newAgent]);

  async function handleSave() {
    setLoading(true);
    if (newAgent) {
      const llmParsedData = {
        model: model,
        model_temperature: model_temperature,
        model_high_priority: model_high_priority,
        general_prompt: generalPrompt,
        begin_message: beginMessage,
        knowledge_base_ids: llmKnowlwdgeBaseIds,
        general_tools: general_tools.length > 0 ? general_tools : null,
      };
      const llmData = await aiGeneralPostFunction("/llm/store", llmParsedData);
      if (llmData.status) {
        console.log(llmData);
        const agentParsedData = {
          response_engine: { type: "retell-llm", llm_id: llmData.llm_id },
          voice_id: voice_id,
          agent_name: defaultName,
          voice_model: voice_model,
          fallback_voice_ids: fallback_voice_ids,
          voice_temperature: voice_temperature,
          voice_speed: voice_speed,
          volume: volume,
          responsiveness: responsiveness,
          interruption_sensitivity: interruption_sensitivity,
          enable_backchannel: enable_backchannel,
          backchannel_frequency: backchannel_frequency,
          backchannel_words: backchannel_words,
          reminder_trigger_ms: reminder_trigger_ms,
          reminder_max_count: reminder_max_count,
          ambient_sound: ambient_sound,
          ambient_sound_volume: ambient_sound_volume,
          language: language,
          webhook_url: webhook_url,
          boosted_keywords: boosted_keywords,
          enable_transcription_formatting: enable_transcription_formatting,
          opt_out_sensitive_data_storage: opt_out_sensitive_data_storage,
          opt_in_signed_url: opt_in_signed_url,
          pronunciation_dictionary: pronunciation_dictionary,
          normalize_for_speech: normalize_for_speech,
          end_call_after_silence_ms: end_call_after_silence_ms,
          max_call_duration_ms: max_call_duration_ms,
          enable_voicemail_detection: enable_voicemail_detection,
          voicemail_message: voicemail_message,
          voicemail_detection_timeout_ms: voicemail_detection_timeout_ms,
          post_call_analysis_data: post_call_analysis_data,
          post_call_analysis_model: post_call_analysis_model,
          begin_message_delay_ms: begin_message_delay_ms,
          ring_duration_ms: ring_duration_ms,
          stt_mode: stt_mode,
          allow_user_dtmf: allow_user_dtmf,
          user_dtmf_options: {
            digit_limit: digit_limit,
            termination_keys: termination_keys,
            timeout_ms: timeout_ms,
          },
          denoising_mode: denoising_mode,
        };
        const apiData = await aiGeneralPostFunction(
          "/agent/store",
          agentParsedData
        );
        if (apiData.status) {
          console.log(apiData);
          setLoading(false);
          setAgentId(apiData.data.agent_id);
          toast.success("Agent created successfully!");
        } else {
          toast.error(apiData.error);
          setLoading(false);
        }
      } else {
        toast.error(llmData.error);
        setLoading(false);
      }
    } else {
      const llmParsedData = {
        model: model,
        model_temperature: model_temperature,
        model_high_priority: model_high_priority,
        general_prompt: generalPrompt,
        begin_message: beginMessage,
        knowledge_base_ids: llmKnowlwdgeBaseIds,
        general_tools: general_tools.length > 0 ? general_tools : null,
      };
      const llmData = await aiGeneralPutFunction(
        `/llm/update-llm/${llm_id}`,
        llmParsedData
      );
      if (llmData.status) {
        // console.log(llmData);
        const agentParsedData = {
          response_engine: { type: "retell-llm", llm_id: llm_id },
          voice_id: voice_id,
          agent_name: defaultName,
          voice_model: voice_model,
          fallback_voice_ids: fallback_voice_ids,
          voice_temperature: voice_temperature,
          voice_speed: voice_speed,
          volume: volume,
          responsiveness: responsiveness,
          interruption_sensitivity: interruption_sensitivity,
          enable_backchannel: enable_backchannel,
          backchannel_frequency: backchannel_frequency,
          backchannel_words: backchannel_words,
          reminder_trigger_ms: reminder_trigger_ms,
          reminder_max_count: reminder_max_count,
          ambient_sound: ambient_sound,
          ambient_sound_volume: ambient_sound_volume,
          language: language,
          webhook_url: webhook_url,
          boosted_keywords: boosted_keywords,
          enable_transcription_formatting: enable_transcription_formatting,
          opt_out_sensitive_data_storage: opt_out_sensitive_data_storage,
          opt_in_signed_url: opt_in_signed_url,
          pronunciation_dictionary: pronunciation_dictionary,
          normalize_for_speech: normalize_for_speech,
          end_call_after_silence_ms: end_call_after_silence_ms,
          max_call_duration_ms: max_call_duration_ms,
          enable_voicemail_detection: enable_voicemail_detection,
          voicemail_message: voicemail_message,
          voicemail_detection_timeout_ms: voicemail_detection_timeout_ms,
          post_call_analysis_data: post_call_analysis_data,
          post_call_analysis_model: post_call_analysis_model,
          begin_message_delay_ms: begin_message_delay_ms,
          ring_duration_ms: ring_duration_ms,
          stt_mode: stt_mode,
          allow_user_dtmf: allow_user_dtmf,
          user_dtmf_options: {
            digit_limit: digit_limit,
            termination_keys: termination_keys,
            timeout_ms: timeout_ms,
          },
          denoising_mode: denoising_mode,
        };
        const apiData = await aiGeneralPutFunction(
          `/agent/update-agent/${agentData.agent_id}`,
          agentParsedData
        );
        if (apiData.status) {
          setLoading(false);
          toast.success("Agent updated successfully!");
        } else {
          toast.error(apiData.error);
          setLoading(false);
        }
      } else {
        toast.error(llmData.error);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (saveClicked > 0) {
      handleSave();
    }
  }, [saveClicked]);
  const [formData, setFormData] = useState({
    // name: dialogType === "end_call" ? "end_call" : "",
    name: "",
    description: "",
  });
  const [callTransfer, setCallTransfer] = useState("cold_transfer");
  const [displayNumber, setDisplayNumber] = useState("retell-agents");
  // const [speakDuringExecution, setSpeakDuringExecution] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [openTrigger, setOpenTrigger] = useState(null);
  const [editableKey, setEditableKey] = useState(null);
  const [jsonError, setJsonError] = useState(null); // just for error feedback

  return (
    <>
      <div class="accordion accordion-flush FlowAccordion_content" id="accordionFlushExample">
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-headingOne">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
              <i class="fa-regular fa-shapes me-3"></i> Functions
            </button>
          </h2>
          <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
              <p className='detailText'>Enable your agent with capabilities such as calendar bookings, call termination, etc.</p>

              <ul>
                <li>
                  <div class="noticeMessageBox justify-content-between">
                    <div className='d-flex align-items-center gap-2'>
                      <i class="fa-regular fa-phone-arrow-up-right iconGray"></i>
                      <p class="mb-0 f-s-14">end_call</p>
                    </div>
                    <div className='d-flex align-items-center gap-1'>
                      <button className="clearButton text-align-start" onClick={setEditCustomFunctionPopup} >
                        <i class="fa-regular fa-pen-to-square"></i>
                      </button>
                      <button className="clearButton text-align-start text-danger" >
                        <i class="fa-regular fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="dropdown">
                <button className="panelButton static mt-3 dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <span class="text"><i class="fa-regular fa-plus me-2"></i> Add</span>
                </button>
                <ul class="dropdown-menu">
                  <li><button class="dropdown-item"  onClick={() => {
                                setType("end_call");
                                setName(null);
                                setDescription("");
                                setEditableKey(null);
                                setEndCallPopup(true);
                              }} ><i class="fa-regular fa-phone-arrow-up-right me-2"></i> End Call</button></li>
                  <li><button class="dropdown-item" onClick={() => {
                                setType("transfer_call");
                                setName(null);
                                setDescription("");
                                setTransferType("predefined");
                                setTransferNumber("");
                                setTransferPrompt("");
                                setCallTransfer("cold_transfer");
                                setShowTransfereeAsCaller(false);
                                setPublicHandoffOptionType(null);
                                setPublicHandOffPrompt("");
                                setPublicHandOffMessage("");
                                setEditableKey(null);
                                setCallTransferPopup(true);
                              }}><i class="fa-regular fa-phone-arrow-right me-2"></i> Call Transfer</button></li>
                  <li><button class="dropdown-item"  onClick={() => {
                                setType("check_availability_cal");
                                setName("");
                                setDescription("");
                                setCalApiKey("");
                                setEventTypeId();
                                setTimezone("");
                                setEditableKey(null);
                                setCheckCalendarAvailabilityPopup(true);
                              }}><i class="fa-regular fa-calendar me-2"></i> Check Calendar Availability (Cal.com)</button></li>
                  <li><button class="dropdown-item"  onClick={() => {
                                setType("book_appointment_cal ");
                                setName("");
                                setDescription("");
                                setCalApiKey("");
                                setEventTypeId();
                                setTimezone("");
                                setEditableKey(null);
                                setBookCalendarPopup(true);
                              }}><i class="fa-regular fa-calendar-plus me-2"></i> Book on the Calendar (Cal.com)</button></li>
                  <li><button class="dropdown-item"  onClick={() => {
                                setType("press_digit");
                                setName("");
                                setDescription("");
                                setDelayMs(1000);
                                setEditableKey(null);
                                setPressDigitsPopup(true);
                              }}><i class="fa-regular fa-calendar-days me-2"></i> Press Digits (IVR Navigation)</button></li>
                  <li><hr class="dropdown-divider" /></li>
                  <li><button class="dropdown-item"  onClick={() => {
                                setType("custom");
                                setName("");
                                setDescription("");
                                setUrl("");
                                setTimeoutMs(1000);
                                setParameters();
                                setEditableKey(null);
                                setCustomFunctionPopup(true);
                              }}><i class="fa-regular fa-gear me-2"></i> Custom Function</button></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-headingTwo">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
              <i class="fa-regular fa-robot me-3"></i> Agent Settings
            </button>
          </h2>
          <div id="flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">

              <div className='row'>
                <div className='col-12'>
                  <div className="formRow flex-column align-items-start px-0">
                    <div className="formLabel mw-100">
                      <label>Voice & Language</label>
                    </div>
                    <div className="col-12">
                      <PhoneInput
                        defaultCountry="IN"
                        placeholder="Enter phone number"
                        value={value}
                        onChange={setValue}
                        className="custom-phone-input formItem"
                      />
                    </div>
                    <div className='col-12 d-flex align-items-center gap-2 mt-2'>
                      <button className='aitable_button static  w-100' onClick={SetSelectVoice}>Dorothy</button>
                      <div className='dropdown'>
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <i class="fa-regular fa-gear"></i>
                        </button>
                        <div class="dropdown-menu w300 settingMenu">
                          <div className="card-body aiAgentTab p-3">
                            <div className=' mb-4'>
                              <div className='formLabel w-100'>
                                <label className='fs-5 mb-2'> Voice Model</label>
                              </div>
                              <ul className='ps-3'>
                                <li className="d-flex flex-column">
                                  <p className='listHeding'>Elevenlabs Turbo V2</p>
                                  <span class="text2">English only, fast, high quality</span>
                                </li>
                                <li className="d-flex flex-column">
                                  <p className='listHeding'>Elevenlabs Turbo V2</p>
                                  <span class="text2">English only, fast, high quality</span>
                                </li>
                                <li className="d-flex flex-column">
                                  <p className='listHeding'>Elevenlabs Turbo V2</p>
                                  <span class="text2">English only, fast, high quality</span>
                                </li>
                              </ul>
                            </div>
                            <div className=''>
                              <div className="mb-2">
                                <div class="formLabel">
                                  <label>Voice Speed:</label>
                                </div>
                                <input type="range" min="0" max="1" step="0.01" style={{ width: '80%' }} /> <span className='textGray'>1</span>
                              </div>
                              <div className="mb-2">
                                <div class="formLabel">
                                  <label>Voice Temperature:</label>
                                </div>
                                <input type="range" min="0" max="1" step="0.01" style={{ width: '60%' }} /> <span className='textGray'>1.1</span>
                              </div>
                              <div className="mb-2">
                                <div class="formLabel">
                                  <label>Voice Volume:</label>
                                </div>
                                <input type="range" min="0" max="1" step="0.01" style={{ width: '30%' }} /> <span className='textGray'>1.2</span>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="formLabel mw-100">
                      <label>LLM Settings</label>
                    </div>
                    <div className='col-12 d-flex align-items-center gap-2 mt-2 '>
                      {/* <button className='aitable_button static  w-100'>Dorothy</button> */}
                      <div class="dropdown">
                        <button class="aitable_button static  w-100 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          gpt-4.1-nano
                        </button>
                        <ul class="dropdown-menu">
                          <li><a class="dropdown-item" href="#">Action</a></li>
                          <li><a class="dropdown-item" href="#">Another action</a></li>
                          <li><a class="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                      </div>
                      <div className='dropdown'>
                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <i class="fa-regular fa-gear"></i>
                        </button>
                        <div class="dropdown-menu w300 settingMenu">
                          <div className="card-body aiAgentTab p-3">

                            <div className=''>
                              <div className='formLabel w-100'>
                                <label>LLM Temperature</label>
                              </div>
                              <div className="mb-2">
                                <div class="formLabel">
                                  <label>Lower value yields better function call results.</label>
                                </div>
                                <input type="range" min="0" max="1" step="0.01" style={{ width: '80%' }} />
                              </div>
                              <div className="mb-2">
                                <div class="formLabel">
                                  <label>High Priority</label>
                                </div>
                                <span className='textGray'>Use more dedicated resource pool to ensure lower and more consistent latency. This feature incurs a higher cost.</span>
                                <div className="cl-toggle-switch">
                                  <label className="cl-switch">
                                    <input type="checkbox" id="showAllCheck" />
                                    <span></span>
                                  </label>
                                </div>
                              </div>

                            </div>

                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-headingThree">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
              <i class="fa-regular fa-book me-3"></i>  Knowledge Base
            </button>
          </h2>
          <div id="flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
              <KnowledgeBaseFlow />
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-heading04">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse04" aria-expanded="false" aria-controls="flush-collapse04">
              <i class="fa-regular fa-microphone me-3"></i> Speech Settings
            </button>
          </h2>
          <div id="flush-collapse04" class="accordion-collapse collapse" aria-labelledby="flush-heading04" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
              <SpeechSettings />
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-heading05">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse05" aria-expanded="false" aria-controls="flush-collapse05">
              <i class="fa-regular fa-headset me-3"></i> Call Settings
            </button>
          </h2>
          <div id="flush-collapse05" class="accordion-collapse collapse" aria-labelledby="flush-heading05" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
              <div className="mb-2">
                <div class="formLabel mw-100">
                  <label>Voicemail Detection</label><br />
                  <span className='iconGray'>Hang up or leave a voicemail if a voicemail is detected.</span>
                </div>
                <div className="cl-toggle-switch">
                  <label className="cl-switch">
                    <input type="checkbox" id="showAllCheck" />
                    <span></span>
                  </label>
                </div>
              </div>
              <div className="mb-2">
                <div class="formLabel mw-100">
                  <label>End Call on Silence</label><br />
                  <span className='iconGray'>Call will automatically terminated if there is silence.</span>
                </div>
                <div class="formRow flex-column align-items-start px-0 ">
                  <div class="row w-100"><div class="col-9"><input type="number" class="formItem" placeholder="1000" /></div><div class="col-3"><span className='textGray'>miliseconds</span></div></div></div>
              </div>
              <div className="mb-2">
                <div class="formLabel mw-100">
                  <label>Max call duration</label><br />
                  <span className='iconGray'>Call will automatically terminated after this duration.</span>
                </div>
                <div class="formRow flex-column align-items-start px-0 ">

                  <div class="row w-100"><div class="col-9"><input type="number" class="formItem" placeholder="3600000" /></div><div class="col-3"><span className='textGray'>miliseconds</span></div></div></div>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-heading06">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse06" aria-expanded="false" aria-controls="flush-collapse06">
              <i class="fa-regular fa-chart-line me-3"></i>  Post-Call Analysis
            </button>
          </h2>
          <div id="flush-collapse06" class="accordion-collapse collapse" aria-labelledby="flush-heading06" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
              <div className="mb-2">
                <div class="formLabel mw-100">
                  <label>Post Call Data Retrieval</label><br />
                  <span className='iconGray'>Define the information that you need to extract from the call.</span>
                </div>
                <ul>
                  <li>
                    <div class="noticeMessageBox justify-content-between">
                      <div className='d-flex align-items-center gap-2'>
                        <i class="fa-solid fa-arrow-up-right iconGray"></i>
                        <p class="mb-0 f-s-14">detailed_call_summary</p>
                      </div>
                      <div className='d-flex align-items-center gap-1'>
                        <button className="clearButton text-align-start" onClick={setEditPostCallPopup}>
                          <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button className="clearButton text-align-start text-danger" >
                          <i class="fa-regular fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="dropdown">
                <button className="panelButton static mt-3 dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <span class="text"><i class="fa-regular fa-plus me-2"></i> Add</span>
                </button>
                <ul class="dropdown-menu">
                  <li><button class="dropdown-item" onClick={setEditPostCallPopup}><i class="fa-solid fa-align-left me-2"></i> Text</button></li>
                  <li><button class="dropdown-item" onClick={setEditPostCallPopup}><i class="fa-solid fa-list-ul me-2"></i> Selector</button></li>
                  <li><button class="dropdown-item" onClick={setEditPostCallPopup}><i class="fa-solid fa-ban me-2"></i> Boolean</button></li>
                  <li><button class="dropdown-item" onClick={setEditPostCallPopup}><i class="fa-solid fa-arrow-up-9-1 me-2"></i> Number</button></li>

                </ul>
              </div>
              <div class="dropdown ms-2">
                <button class="aitable_button static  w-100 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  gpt-4.1-nano
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Action</a></li>
                  <li><a class="dropdown-item" href="#">Another action</a></li>
                  <li><a class="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-heading07">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse07" aria-expanded="false" aria-controls="flush-collapse07">
              <i class="fa-regular fa-shield-check me-3"></i>  Security & Fallback Settings
            </button>
          </h2>
          <div id="flush-collapse07" class="accordion-collapse collapse" aria-labelledby="flush-heading07" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
              <div className="mb-2">
                <div class="formLabel mw-100">
                  <label>Opt Out Sensitive Data Storage</label><br />
                  <span className='iconGray'>Control whether Retell should store sensitive data. (Learn more)</span>
                </div>
                <div className="cl-toggle-switch">
                  <label className="cl-switch">
                    <input type="checkbox" id="showAllCheck" />
                    <span></span>
                  </label>
                </div>
              </div>
              <div className="mb-2">
                <div class="formLabel mw-100">
                  <label>Opt In Secure URLs</label><br />
                  <span className='iconGray'>Add security signatures to URLs. The URLs expire after 24 hours.</span>
                </div>
                <div className="cl-toggle-switch">
                  <label className="cl-switch">
                    <input type="checkbox" id="showAllCheck" />
                    <span></span>
                  </label>
                </div>
              </div>
              <div className="mb-2">
                <div class="formLabel mw-100">
                  <label>Fallback Voice ID</label><br />
                  <span className='iconGray'>If the current voice provider fails, assign a fallback voice to continue the call.</span>
                </div>
                <div className="cl-toggle-switch">
                  <label className="cl-switch">
                    <input type="checkbox" id="showAllCheck" />
                    <span></span>
                  </label>
                </div>
              </div>
              <button className="panelButton static mt-3 " role="button" onClick={SetSelectVoice}>
                <span class="text"><i class="fa-regular fa-plus me-2"></i> Add</span>
              </button>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header" id="flush-heading08">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse08" aria-expanded="false" aria-controls="flush-collapse08">
              <i class="fa-regular fa-webhook me-3"></i>Webhook Settings
            </button>
          </h2>
          <div id="flush-collapse08" class="accordion-collapse collapse" aria-labelledby="flush-heading08" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
              <div className="mb-2">
                <div class="formLabel mw-100">
                  <label>Inbound Call Webhook URL</label><br />
                  <span className='iconGray'>The webhook has been migrated to phone level webhook. (Learn more).</span>
                </div>
                <div className="formRow flex-column align-items-start px-0">

                  <div className="col-12">
                    <input
                      type="text"
                      className="formItem"
                      placeholder=''
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>




      {/* ==================================================== all popup */}
      {/* ==================================================== function start*/}
      {/* ============================= end call */}

      {endCallPopup &&
        <div className="popup ">
          <div className="popup music">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div
                  className="card px-0 col-5 shadow-none w50"
                  style={{
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div className="card-header bg-transparent ">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title fs14 fw700 mb-0">
                          End call
                        </h5>
                      </div>
                      <button className="clearButton2 xl" onClick={() => setEndCallPopup(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body aiAgentTab p-3">
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                           value={name}
                                      onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0 ">
                      <div className="formLabel">
                        <label>Description <span>(Optional)</span></label>
                      </div>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Enter Description'
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" card-footer d-flex justify-content-end">
                    <div className="d-flex justify-content-end">
                      <button className="panelButton  m-0"   onClick={() => {
                                      setOpenTrigger(null);
                                      console.log(editableKey);
                                      if (name) {
                                        setGeneralTools((prev) => {
                                          if (
                                            editableKey !== null &&
                                            editableKey !== undefined
                                          ) {
                                            // Update existing item
                                            return prev.map((tool, index) =>
                                              index === editableKey
                                                ? { ...tool, name, description }
                                                : tool
                                            );
                                          } else {
                                            // Add new item
                                            return [
                                              ...prev,
                                              {
                                                type: "end_call",
                                                name,
                                                description,
                                              },
                                            ];
                                          }
                                        });
                                      }
                                    }} >
                        <span className="text">Confirm</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray"
                        onClick={() => {
                          setEndCallPopup(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* =============================  Call Transfer */}

      {callTransferPopup &&
        <div className="popup ">
          <div className="popup music">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div
                  className="card px-0 col-5 shadow-none w50"
                  style={{
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div className="card-header bg-transparent ">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title fs14 fw700 mb-0">
                          Call Transfer
                        </h5>
                      </div>
                      <button className="clearButton2 xl" onClick={() => setCallTransferPopup(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body aiAgentTab p-3">
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                          value={name}
                                      onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0 ">
                      <div className="formLabel">
                        <label>Description <span>(Optional)</span></label>
                      </div>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Enter Description'
                          value={description}
                                      onChange={(e) =>
                                        setDescription(e.target.value)
                                      }
                        />
                      </div>
                    </div>
                    <div className="formLabel">
                      <label>Transfer to</label>
                    </div>
                    <div class="mt-2 baseNav">
                      <ul class="nav nav-pills" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                          <button onClick={() => setTransferType("predefined")} class="nav-link active" id="webPAge-tab" data-bs-toggle="pill" data-bs-target="#webPAge" type="button" role="tab" aria-controls="webPAge" aria-selected="true">Static Number</button>
                        </li>
                        <li class="nav-item" role="inferred">
                          <button onClick={() => setTransferType("predefined")} class="nav-link" id="upload-tab" data-bs-toggle="pill" data-bs-target="#upload" type="button" role="tab" aria-controls="upload" aria-selected="false">Dynamic Routing</button>
                        </li>

                      </ul>
                      <div class="tab-content" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="webPAge" role="tabpanel" aria-labelledby="webPAge-tab">

                          <form>
                            <div className="formRow flex-column align-items-start">
                              <div className="col-12">
                                <input
                                  type="text"
                                  className="formItem"
                                  placeholder='+1xxxxxxxxxx'
                                />
                                <span>Enter a static phone number or dynamic variable.</span>
                              </div>
                            </div>
                          </form>
                        </div>
                        <div class="tab-pane fade pb-3" id="upload" role="tabpanel" aria-labelledby="upload-tab">
                          <div className="formRow flex-column align-items-start px-0 ">
                            <div className="formLabel">
                              <label>Welcome Message</label>
                            </div>
                            <div className="col-12">
                              <textarea
                                type="text"
                                className="formItem h-auto"
                                rows={3}
                                placeholder='Enter prompt to infer the destinaton number.'
                              />
                              <span>Use a prompt to handle dynamic call transfer routing.</span>
                            </div>
                          </div>

                        </div>



                      </div>
                    </div>
                    <div className="formLabel mb-2">
                      <label>Type</label>
                    </div>
                    <div className="row radio-input px-2">
                      {/* Radio Buttons */}
                      <div className="col-6">
                        <label className="label radioLabel">
                          <p className="text">
                            Cold Transfer <i className="fa-regular fa-circle-exclamation ms-2"></i>
                          </p>
                          <input
                            type="radio"
                            id="cold"
                            name="transferType"
                            value="cold"
                            checked={selectedTransfer === 'cold'}
                            onChange={() => setSelectedTransfer('cold')}
                          />
                        </label>
                      </div>

                      <div className="col-6">
                        <label className="label radioLabel">
                          <p className="text">
                            Warm Transfer <i className="fa-regular fa-circle-exclamation ms-2"></i>
                          </p>
                          <input
                            type="radio"
                            id="warm"
                            name="transferType"
                            value="warm"
                            checked={selectedTransfer === 'warm'}
                            onChange={() => setSelectedTransfer('warm')}
                          />
                        </label>
                      </div>

                      {/* Cold Transfer UI */}
                      {selectedTransfer === 'cold' && (
                        <div className="mt-3">
                          <p className="mb-0 fs-12 formLabel">Displayed Phone Number</p>
                          <p className="mb-0 f-s-14 formLabel">Show transferee's number</p>
                          <div className="cl-toggle-switch">
                            <label className="cl-switch">
                              <input type="checkbox" id="showAllCheck" />
                              <span></span>
                            </label>
                          </div>

                        </div>
                      )}

                      {/* Warm Transfer UI */}
                      {selectedTransfer === 'warm' && (
                        <>
                          <div className="formLabel mt-2">
                            <label>Handoff message</label>
                          </div>
                          <div className="mt-2 baseNav">
                            <ul className="nav nav-pills" id="pills-tab" role="tablist">
                              <li className="nav-item" role="presentation">
                                <button
                                  className="nav-link active"
                                  id="tab01-tab"
                                  data-bs-toggle="pill"
                                  data-bs-target="#tab01"
                                  type="button"
                                  role="tab"
                                  aria-controls="tab01"
                                  aria-selected="true"
                                >
                                  Prompt
                                </button>
                              </li>
                              <li className="nav-item" role="presentation">
                                <button
                                  className="nav-link"
                                  id="tab02-tab"
                                  data-bs-toggle="pill"
                                  data-bs-target="#tab02"
                                  type="button"
                                  role="tab"
                                  aria-controls="tab02"
                                  aria-selected="false"
                                >
                                  Static Sentence
                                </button>
                              </li>
                            </ul>

                            <div className="tab-content" id="pills-tabContent">
                              <div
                                className="tab-pane fade show active"
                                id="tab01"
                                role="tabpanel"
                                aria-labelledby="tab01-tab"
                              >
                                <div className="formRow flex-column align-items-start px-0">
                                  <div className="col-12">
                                    <textarea
                                      className="formItem h-auto"
                                      rows={3}
                                      placeholder="Say hello to the agent and summarize the user problem to him"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div
                                className="tab-pane fade pb-3"
                                id="tab02"
                                role="tabpanel"
                                aria-labelledby="tab02-tab"
                              >
                                <div className="formRow flex-column align-items-start px-0">
                                  <div className="col-12">
                                    <textarea
                                      className="formItem h-auto"
                                      rows={3}
                                      placeholder="Enter static message"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        </>
                      )}
                    </div>
                  </div>

                  <div className=" card-footer d-flex justify-content-end">
                    <div className="d-flex justify-content-end">
                      <button className="panelButton  m-0" >
                        <span className="text">Confirm</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray"
                        onClick={() => {
                          setCallTransferPopup(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* =============================  Check Calendar Availability */}

      {checkCalendarAvailabilityPopup &&
        <div className="popup ">
          <div className="popup music">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div
                  className="card px-0 col-5 shadow-none w50"
                  style={{
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div className="card-header bg-transparent ">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title fs14 fw700 mb-0">
                          Check Calendar Availability (Cal.com)
                        </h5>
                      </div>
                      <button className="clearButton2 xl" onClick={() => setCheckCalendarAvailabilityPopup(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body aiAgentTab p-3">
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0 ">
                      <div className="formLabel">
                        <label>Description <span>(Optional)</span></label>
                      </div>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Enter Description'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>API Key (Cal.com)</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Event Type ID (Cal.com)</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Timezone <span>(Optional)</span></label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" card-footer d-flex justify-content-end">
                    <div className="d-flex justify-content-end">
                      <button className="panelButton  m-0" >
                        <span className="text">Confirm</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray"
                        onClick={() => {
                          setCheckCalendarAvailabilityPopup(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* =============================  Book on the Calendar (Cal.com) */}

      {bookCalendarPopup &&
        <div className="popup ">
          <div className="popup music">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div
                  className="card px-0 col-5 shadow-none w50"
                  style={{
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div className="card-header bg-transparent ">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title fs14 fw700 mb-0">
                          Check Calendar Availability (Cal.com)
                        </h5>
                      </div>
                      <button className="clearButton2 xl" onClick={() => setBookCalendarPopup(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body aiAgentTab p-3">
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0 ">
                      <div className="formLabel">
                        <label>Description <span>(Optional)</span></label>
                      </div>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Enter Description'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>API Key (Cal.com)</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Event Type ID (Cal.com)</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Timezone <span>(Optional)</span></label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" card-footer d-flex justify-content-end">
                    <div className="d-flex justify-content-end">
                      <button className="panelButton  m-0" >
                        <span className="text">Confirm</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray"
                        onClick={() => {
                          setBookCalendarPopup(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* =============================  Press Digits (IVR Navigation) */}

      {pressDigitsPopup &&
        <div className="popup ">
          <div className="popup music">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div
                  className="card px-0 col-5 shadow-none w50"
                  style={{
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div className="card-header bg-transparent ">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title fs14 fw700 mb-0">
                          Check Calendar Availability (Cal.com)
                        </h5>
                      </div>
                      <button className="clearButton2 xl" onClick={() => setPressDigitsPopup(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body aiAgentTab p-3">
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0 ">
                      <div className="formLabel">
                        <label>Description <span>(Optional)</span></label>
                      </div>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Enter Description'
                        />
                      </div>
                    </div>
                    <div className='w-100'>
                      <div className="formRow flex-column align-items-start px-0 ">
                        <div className="formLabel">
                          <label>Description <span>(Optional)</span>
                            <Tippy content="Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make">
                              <button className="clearButton text-align-start" >
                                <i class="fa-regular fa-circle-exclamation "></i>
                              </button>

                            </Tippy>
                          </label>
                        </div>
                        <div className='row w-100'>
                          <div className="col-9">
                            <input
                              type="number"
                              className="formItem"
                              placeholder='1000'
                            />
                          </div>
                          <div className="col-3">
                            <span>miliseconds</span>
                          </div>
                        </div>
                      </div>
                      {/* <div className="formRow flex-column align-items-start px-0 ">
                        <div className="formLabel">
                          <label>miliseconds</label>
                        </div>
                      </div> */}

                    </div>

                  </div>
                  <div className=" card-footer d-flex justify-content-end">
                    <div className="d-flex justify-content-end">
                      <button className="panelButton  m-0" >
                        <span className="text">Confirm</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray"
                        onClick={() => {
                          setPressDigitsPopup(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* ============================= Custom Function */}

      {customFunctionPopup &&
        <div className="popup ">
          <div className="popup music">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div
                  className="card px-0 col-5 shadow-none w50"
                  style={{
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div className="card-header bg-transparent ">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title fs14 fw700 mb-0">
                          Custom Function
                        </h5>
                      </div>
                      <button className="clearButton2 xl" onClick={() => setCustomFunctionPopup(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body aiAgentTab p-3">
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter Name'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0 ">
                      <div className="formLabel">
                        <label>Description </label>
                      </div>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Enter Description'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Your URL</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Enter the url of Custom Function'
                        />
                      </div>
                    </div>
                    <div className='w-100'>
                      <div className="formRow flex-column align-items-start px-0 ">
                        <div className="formLabel">
                          <label>Description <span>(Optional)</span>
                            <Tippy content="Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make">
                              <button className="clearButton text-align-start" >
                                <i class="fa-regular fa-circle-exclamation "></i>
                              </button>

                            </Tippy>
                          </label>
                        </div>
                        <div className='row w-100'>
                          <div className="col-9">
                            <input
                              type="number"
                              className="formItem"
                              placeholder='1000'
                            />
                          </div>
                          <div className="col-3">
                            <span>miliseconds</span>
                          </div>
                        </div>
                      </div>
                      {/* <div className="formRow flex-column align-items-start px-0 ">
                        <div className="formLabel">
                          <label>miliseconds</label>
                        </div>
                      </div> */}

                    </div>

                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Parameters (Optional)</label>
                      </div>
                      <span>JSON schema that defines the format in which the LLM will return. Please refer to the docs.</span>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Enter JSON schema here...'
                        />
                      </div>
                    </div>

                    <div className="py-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="toggleWebhook"
                      />
                      <label className="form-check-label ms-3" htmlFor="toggleWebhook">
                        Speak During Execution<br />
                        <span>text-muted-foreground text-sm</span>
                      </label>

                      <div className="formRow flex-column align-items-start px-0 showUrl">

                        <div className="col-12">
                          <input
                            type="text"
                            className="formItem"
                            placeholder="Enter the execution message description"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="toggleWebhook"
                      />
                      <label className="form-check-label ms-3" htmlFor="toggleWebhook">
                        Speak After Execution <br /> <span>Unselect if you want to run the function silently, such as uploading the call result to the server silently.</span>
                      </label>
                    </div>

                  </div>
                  <div className=" card-footer d-flex justify-content-end">
                    <div className="d-flex justify-content-end">
                      <button className="panelButton  m-0" >
                        <span className="text">Confirm</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray"
                        onClick={() => {
                          setCustomFunctionPopup(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* ============================= edit Custom Function */}

      {editCustomFunctionPopup &&
        <div className="popup ">
          <div className="popup music">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div
                  className="card px-0 col-5 shadow-none w50"
                  style={{
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div className="card-header bg-transparent ">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title fs14 fw700 mb-0">
                          Custom Function
                        </h5>
                      </div>
                      <button className="clearButton2 xl" onClick={() => setEditCustomFunctionPopup(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body aiAgentTab p-3">
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='Check_Flight'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0 ">
                      <div className="formLabel">
                        <label>Description </label>
                      </div>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Use for flight search'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Your URL</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='https://webvio.app.n8n.cloud/webhook-test/a3845445-6f83-4573-94d6-a1ec9fe9511c'
                        />
                      </div>
                    </div>
                    <div className='w-100'>
                      <div className="formRow flex-column align-items-start px-0 ">
                        <div className="formLabel">
                          <label>Description <span>(Optional)</span>
                            <Tippy content="Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make">
                              <button className="clearButton text-align-start" >
                                <i class="fa-regular fa-circle-exclamation "></i>
                              </button>

                            </Tippy>
                          </label>
                        </div>
                        <div className='row w-100'>
                          <div className="col-9">
                            <input
                              type="number"
                              className="formItem"
                              placeholder='1000'
                            />
                          </div>
                          <div className="col-3">
                            <span>miliseconds</span>
                          </div>
                        </div>
                      </div>
                      {/* <div className="formRow flex-column align-items-start px-0 ">
                        <div className="formLabel">
                          <label>miliseconds</label>
                        </div>
                      </div> */}

                    </div>

                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Parameters (Optional)</label>
                      </div>
                      <span>JSON schema that defines the format in which the LLM will return. Please refer to the docs.</span>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Enter JSON schema here...'
                        />
                      </div>
                    </div>

                    <div className="py-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="toggleWebhook"
                      />
                      <label className="form-check-label ms-3" htmlFor="toggleWebhook">
                        Speak During Execution<br />
                        <span>text-muted-foreground text-sm</span>
                      </label>

                      <div className="formRow flex-column align-items-start px-0 showUrl">

                        <div className="col-12">
                          <input
                            type="text"
                            className="formItem"
                            placeholder="Enter the execution message description"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="toggleWebhook"
                      />
                      <label className="form-check-label ms-3" htmlFor="toggleWebhook">
                        Speak After Execution <br /> <span>Unselect if you want to run the function silently, such as uploading the call result to the server silently.</span>
                      </label>
                    </div>

                  </div>
                  <div className=" card-footer d-flex justify-content-end">
                    <div className="d-flex justify-content-end">
                      <button className="panelButton  m-0" >
                        <span className="text">Confirm</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray"
                        onClick={() => {
                          setEditCustomFunctionPopup(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* ==================================================== function end */}

      {/* ==================================================== Agent Settings  */}


      {/* --------------- select voice */}

      {selectVoice &&
        <div className="popup ">
          <div className="popup music">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div
                  className="card px-0 col-5 shadow-none card80"
                  style={{
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div className="card-header bg-transparent ">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title fs14 fw700 mb-0">
                          Custom Function
                        </h5>
                      </div>
                      <button className="clearButton2 xl" onClick={() => SetSelectVoice(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body aiAgentTab p-3">
                    <div className='d-flex align-items-center gap-2 mb-4'>
                      <div className='col-auto'>
                        <button className='panelButton static gray'>Elevenlabs</button>
                      </div>
                      <div className='col-lg-3'>
                        <Select
                          className="basic-single "
                          classNamePrefix="select"
                          // defaultValue={colourOptions[0]}
                          // isDisabled={isDisabled}
                          // isLoading={isLoading}
                          // isClearable={isClearable}
                          // isRtl={isRtl}
                          // isSearchable={isSearchable}
                          name="color"
                        // options={colourOptions}
                        />
                      </div>
                      <div className='col-lg-3'>
                        <Select
                          className="basic-single "
                          classNamePrefix="select"
                          // defaultValue={colourOptions[0]}
                          // isDisabled={isDisabled}
                          // isLoading={isLoading}
                          // isClearable={isClearable}
                          // isRtl={isRtl}
                          // isSearchable={isSearchable}
                          name="color"
                        // options={colourOptions}
                        />
                      </div>
                    </div>
                    <div className="tableContainer">
                      <table>
                        <thead>
                          <tr>
                            <th></th>
                            <th>Voice</th>
                            <th>Accent</th>
                            <th>Age</th>
                            <th>Gender</th>
                            <th>Provider</th>

                          </tr>
                        </thead>
                        <tbody className="">
                          <>
                            <tr>
                              <td>
                                <button className='clearButton text-align-start' onClick={() => setIsPlaying(!isPlaying)}>
                                  {isPlaying ? (
                                    <i className="fa-regular fa-circle-pause fs-5"></i>
                                  ) : (
                                    <i className="fa-regular fa-circle-play fs-5"></i>
                                  )}
                                </button>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="tableProfilePicHolder">
                                    {/* <img
                                                            alt="profile"
                                                            src={item.profile_picture}
                                                           src={require('../../assets/images/placeholder-image.webp')}
                                                          />
                                                        ) : ( */}
                                    <i className="fa-light fa-user" />
                                    {/* )} */}
                                  </div>
                                  <div className="ms-2">ravi raj</div>
                                </div>
                              </td>
                              <td>conversation flow</td>
                              <td>14844731350</td>
                              <td>en-US</td>
                              <td><Link to='' className='urlText text-success'><i class="fa-regular fa-check me-2"></i> Use the Voice</Link></td>
                            </tr>
                          </>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {editPostCallPopup &&
        <div className="popup ">
          <div className="popup music">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div
                  className="card px-0 col-5 shadow-none w50"
                  style={{
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div className="card-header bg-transparent ">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title fs14 fw700 mb-0">
                          Text
                        </h5>
                      </div>
                      <button className="clearButton2 xl" onClick={() => setEditPostCallPopup(false)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body aiAgentTab p-3">
                    <div className="formRow flex-column align-items-start px-0">
                      <div className="formLabel">
                        <label>Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="formItem"
                          placeholder='detailed_call_summary'
                        />
                      </div>
                    </div>
                    <div className="formRow flex-column align-items-start px-0 ">
                      <div className="formLabel">
                        <label>Description </label>
                      </div>
                      <div className="col-12">
                        <textarea
                          type="text"
                          className="formItem h-auto"
                          rows={3}
                          placeholder='Detailed summary of the call before you transfer the call to a human agent so that the human agent can understand the context of the call'
                        />
                      </div>
                    </div>
                    <div className="formLabel">
                      <label>Format Example (Optional)</label>
                    </div>
                    <div className='d-flex align-items-center gap-2 '>
                      <div className="formRow flex-column align-items-start px-0 w-100">
                        <div className="col-12">
                          <div className="col-12">
                            <input
                              type="text"
                              className="formItem"
                              placeholder='detailed_call_summary'
                            />
                          </div>
                        </div>
                      </div>
                      <button class="aitable_button bg-transparent text-danger"><i class="fa-regular fa-trash-can"></i></button>
                    </div>

                  </div>
                  <div className=" card-footer d-flex justify-content-end">
                    <div className="d-flex justify-content-end">
                      <button className="panelButton  m-0" >
                        <span className="text">Confirm</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray"
                        onClick={() => {
                          setEditPostCallPopup(false);
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i className="fa-solid fa-xmark"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      }



    </>
  )
}

export default FlowAccordionContent