import React, { useEffect, useState } from 'react'
import { generalPostFunction, generatePreSignedUrl } from '../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';

function AudioTranscribe({ url }) {
    const [transcript, setTranscript] = useState("")
    const [transcribeLoading, setTranscribeLoading] = useState(false)
    async function handleTranscript(url) {
        setTranscribeLoading(true)
        const newUrl = url.split(".com/").pop();
        const presignData = await generatePreSignedUrl(newUrl);
        if (presignData?.status && presignData?.url) {
            const trnascriptData = await generalPostFunction("/transcribe-audio", { src: presignData?.url });
            if (trnascriptData?.status) {
                setTranscribeLoading(false)
                setTranscript(trnascriptData?.data);
            } else {
                setTranscribeLoading(false)
                setTranscript()
                toast.error(trnascriptData?.errors[Object.keys(trnascriptData?.errors)[0]][0])
            }
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
    return (
        <div className="audio-container mb-0">
            <div className="transcriptWrap col-12">
                <div className="textContent col-12">
                    {
                        transcribeLoading ? <div className='skeleton skeleton-text' /> :
                            <p>{transcript}</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default AudioTranscribe
