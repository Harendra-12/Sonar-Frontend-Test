import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fileUploadFunction } from '../../GlobalFunction/globalFunction';
import { useSelector } from 'react-redux';
function FileUpload({ type, setFileUpload, setSelectedUrl, setSelectedFile, selectedFile, sendSingleMessage, sendGroupMessage, recipient, setAllMessage, allMessage, formatDateTime, extension }) {

    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const maxSizeMB = 2;
    const account = useSelector((state) => state.account);

    const handleFileChange = (file) => {
        if (!file) return;
        setLoading(true)
        const fileType = file.type;
        const fileSizeMB = file.size / (1024 * 1024);
        if (type === "image") {
            if (!["image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp", "image/webp"].includes(fileType)) {
                toast.error("Only image(jpeg,jpg,png,gif,bmp,webp) files are allowed.");
                setLoading(false)
                return;
            }
            if (fileSizeMB > maxSizeMB) {
                toast.error(`Image size should not exceed ${maxSizeMB}MB.`);
                setLoading(false)
                return;
            }
        } else {
            if (!["audio/mpeg", "video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/avi", "application/pdf"].includes(fileType)) {
                toast.error("Only media(mp3,mp4,mov,avi,mkv), or PDF files are allowed.");
                setLoading(false)
                return;
            }
            if (fileType.startsWith("video/") && fileSizeMB > maxSizeMB) {
                toast.error(`Video size should not exceed ${maxSizeMB}MB.`);
                setLoading(false)
                return;
            }
        }
        setLoading(false)
        setSelectedFile(file);
    };

    useEffect(() => {
        if (!selectedFile) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        setLoading(false); // Stop loading once preview is ready

        return () => URL.revokeObjectURL(objectUrl); // Cleanup
    }, [selectedFile]);

    async function handleConfirm() {
        const msg = allMessage
        const time = formatDateTime(new Date());
        if (recipient[2] === "groupChat") {
            setAllMessage((prevState) => ({
                ...prevState,
                [recipient[0]]: [
                    ...(prevState[recipient[0]] || []),
                    {
                        from: account.name,
                        body: "loading",
                        time
                    },
                ],
            }));
        } else {
            setAllMessage((prevState) => ({
                ...prevState,
                [recipient[0]]: [
                    ...(prevState[recipient[0]] || []),
                    { from: extension, body: "loading", time },
                ],
            }));
        }
        try {
            setFileUpload(false)
            const formData = new FormData();
            formData.append('sharedMessage', selectedFile);

            const res = await fileUploadFunction("/upload-file", formData);
            // console.log({res})
            if (res?.status) {
                toast.success("File uploaded successfully");
                // console.log({recipient})
                setAllMessage(msg)
                if (recipient[2] === "groupChat") {
                    sendGroupMessage(res?.file_url);
                } else {
                    sendSingleMessage(res?.file_url);
                }
                setSelectedUrl(res?.file_url);
                setSelectedFile(null)
            } else {
                toast.error(res?.errors?.sharedMessage?.[0] || "Upload failed");
                setAllMessage(msg)
                setSelectedFile(null)
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            const errorMessage = error.response?.data?.errors?.sharedMessage?.[0] || "Error uploading file";
            toast.error(errorMessage);
            setSelectedFile(null)
        } finally {
            setFileUpload(false)
        }
    }
    return (
        <div className="popup music">
            <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                    <div className="card px-0 col-xl-4 col-md-6">
                        <div className="header">
                            <h5 className="card-title">Upload File</h5>
                        </div>
                        <div className="card-body">
                            {selectedFile !== null ? (
                                <div className="audio-container mx-auto fileUploadBody">
                                    <>
                                        {selectedFile.type.startsWith("image/") && (
                                            <>
                                                <img src={preview} alt="Preview" className="img-preview" />
                                            </>
                                        )}
                                        {selectedFile.type.startsWith("audio/") && (
                                            <audio controls src={preview} />
                                        )}
                                        {selectedFile.type.startsWith("video/") && (
                                            <video controls src={preview} className="video-preview" />
                                        )}
                                        {selectedFile.type === "application/pdf" && (
                                            <iframe title='pdf' src={preview} className="pdf-preview"></iframe>
                                        )}
                                        <button className="tableButton delete ms-2" onClick={() => setSelectedFile(null)}><i className='fa-solid fa-xmark' /></button>
                                    </>

                                </div>
                            ) : (
                                <>{loading ?
                                    <p>Loading preview...</p>
                                    :
                                    <div className="popup-border text-center p-2"
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.add("drag-over");
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove("drag-over");
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove("drag-over");
                                            handleFileChange(e.dataTransfer.files[0]);
                                        }}
                                    >

                                        <input
                                            type="file"
                                            className="form-control-file d-none"
                                            id="fileInput"
                                            accept={type === "image" ?
                                                "image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp" :
                                                "audio/mp3,video/mp4,video/quicktime,video/avi,video/mkv,video/x-matroska,application/pdf"

                                            }
                                            onChange={(e) => handleFileChange(e.target.files[0])}
                                        />
                                        <label htmlFor="fileInput" className="d-block">
                                            <div className="test-user text-center">
                                                <i style={{ fontSize: 30 }} className="fa-solid fa-cloud-arrow-up" />
                                                <p className="mb-0 mt-2 text-center">Drag and Drop or <span>Click on upload</span></p>
                                                <span>Supports formats : {type === "image" ? "jpeg,jpg,png,gif,bmp,webp (Max 2MB)" : "mp3, mp4, mov, avi, mkv (Max 2MB), PDF"}</span>
                                            </div>
                                        </label>
                                    </div>}</>
                            )}
                        </div>
                        <div className="card-footer">
                            <div className="d-flex justify-content-between">
                                <button className="panelButton m-0" disabled={!selectedFile} onClick={() => handleConfirm()}>
                                    <span className='text'>Confirm</span>
                                    <span className='icon'><i className="fa-solid fa-check" /></span>
                                </button>
                                <button className="panelButton gray" onClick={() => { setSelectedFile(null); setFileUpload(false) }}>
                                    <span className='text'>Cancel</span>
                                    <span className='icon'><i className="fa-solid fa-xmark" /></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FileUpload;
