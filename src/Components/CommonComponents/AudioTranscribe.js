import React, { useEffect, useRef, useState } from 'react'
import { awsGeneralPostFunction, generalPostFunction, generatePreSignedUrl, useDebounce } from '../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';
import axios from 'axios';

function AudioTranscribe({ url, setTranscribeLink }) {
    const [transcript, setTranscript] = useState([])
    const [transcribeLoading, setTranscribeLoading] = useState(false)
    const [isClosedTranscribe, setIsClosedTranscribe] = useState(true)
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchTerm = useDebounce(searchQuery, 1000);
    const transcriptRef = useRef(null);
    async function handleTranscript(url) {
        // axios.post("https://4ofg0goy8h.execute-api.us-east-2.amazonaws.com/dev2/transcribe", { audio_url: url })
        setTranscribeLoading(true)
        const newUrl = url.split(".com/").pop();
        const presignData = await generatePreSignedUrl(newUrl);
        if (presignData?.status && presignData?.url) {
            // axios.post("https://4ofg0goy8h.execute-api.us-east-2.amazonaws.com/dev2/transcribe", { audio_url: presignData?.url }).then((res) => {
            //     setTranscribeLoading(false)
            //     setTranscript(res?.data?.tagged_transcript);
            // }).catch((err) => {
            //     setTranscribeLoading(false)
            //     setTranscript()
            //     // toast.error(trnascriptData?.errors[Object.keys(trnascriptData?.errors)[0]][0])
            // })

            const res = await awsGeneralPostFunction("/dev2/transcribe", { audio_url: presignData?.url })
            if (res?.status) {
                setTranscribeLoading(false)
                setTranscript(res?.data?.tagged_transcript);
            } else {
                setTranscribeLoading(false)
                setTranscript()
                // toast.error(res?.message)
            }

            // if (trnascriptData?.status) {
            //     setTranscribeLoading(false)
            //     setTranscript(trnascriptData?.data);
            // } else {
            //     setTranscribeLoading(false)
            //     setTranscript()
            //     toast.error(trnascriptData?.errors[Object.keys(trnascriptData?.errors)[0]][0])
            // }
        } else {
            setTranscribeLoading(false)
            setTranscript([])
            setTranscribeLink()
        }
    }

    useEffect(() => {
        if (url) {
            handleTranscript(url)
        } else {
            setTranscript()
        }
    }, [url])

    // Handle search and scroll to the first match
    const handleSearch = () => {
        if (!searchQuery.trim()) return;

        const searchTerm = searchQuery.toLowerCase();
        const transcriptElements = transcriptRef.current.querySelectorAll('.textContent');

        let firstMatch = null;

        transcriptElements.forEach((element, index) => {
            const text = element.textContent.toLowerCase();
            if (text.includes(searchTerm) && !firstMatch) {
                firstMatch = element;
            }
        });

        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstMatch.style.backgroundColor = '#ffff9930';
            setTimeout(() => {
                firstMatch.style.backgroundColor = '';
            }, 2000);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [debouncedSearchTerm])

    return (
        <div className="audio-container mb-0">
            <div className="transcriptWrap p-0 col-12">
                <div className='transc_close'>
                    <button onClick={() => setTranscribeLink()}><i className="fa-solid fa-xmark"></i></button>
                </div>
                <div className="d-flex px-3" style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search transcript"
                        className='col bg-transparent'
                        style={{ border: 'none', borderBottom: '1px solid var(--border-color)', color: '#ddd', outline: 'none' }}
                    />
                    {/* <button onClick={handleSearch} className='clearButton2' >
                        <i className='fa-solid fa-magnifying-glass' />
                    </button> */}
                </div>
                <div className="textContent p-3 pt-0 mt-2 col-12" ref={transcriptRef}>
                    {
                        transcribeLoading ?
                            <div className='skeleton skeleton-text' /> :
                            <p>{transcript && transcript.length > 0 ?
                                transcript?.map((item, key) => {
                                    return (
                                        <span key={key} className='textContent d-block'>
                                            {item?.speaker}:-{item?.transcript}
                                        </span>
                                    )
                                }) : "No Transcription Available!"}</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default AudioTranscribe
