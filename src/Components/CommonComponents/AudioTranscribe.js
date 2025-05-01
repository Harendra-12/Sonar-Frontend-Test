import React, { useEffect, useState } from 'react'
import { generalPostFunction, generatePreSignedUrl } from '../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';
import axios from 'axios';

function AudioTranscribe({ url }) {
    const [transcript, setTranscript] = useState([])
    const [transcribeLoading, setTranscribeLoading] = useState(false)
    async function handleTranscript(url) {
        axios.post("https://4ofg0goy8h.execute-api.us-east-2.amazonaws.com/dev2/transcribe", { audio_url: url })
        setTranscribeLoading(true)
        const newUrl = url.split(".com/").pop();
        const presignData = await generatePreSignedUrl(newUrl);
        if (presignData?.status && presignData?.url) {
            axios.post("https://4ofg0goy8h.execute-api.us-east-2.amazonaws.com/dev2/transcribe", { audio_url: presignData?.url }).then((res) => {
                setTranscribeLoading(false)
                setTranscript(res?.data?.tagged_transcript);
            }).catch((err) => {
                setTranscribeLoading(false)
                setTranscript()
                // toast.error(trnascriptData?.errors[Object.keys(trnascriptData?.errors)[0]][0])
            })
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
            setTranscript()
        }
    }

    useEffect(() => {
        if (url) {
            handleTranscript(url)
        } else {
            setTranscript()
        }
    }, [url])

    console.log("transcript", transcript);

    return (
        <div className="audio-container mb-0">
            <div className="transcriptWrap col-12">
                <div className="textContent col-12">
                    {
                        transcribeLoading ? <div className='skeleton skeleton-text' /> :
                            <p>{transcript.map((item, key) => {
                                return (
                                    <span key={key} className='textContent d-block'>
                                        {item?.speaker}:-{item?.transcript}
                                    </span>
                                )
                            })}</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default AudioTranscribe
