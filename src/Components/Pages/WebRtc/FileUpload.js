import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fileUploadFunction } from '../../GlobalFunction/globalFunction';
function FileUpload({ type, setFileUpload,setSelectedUrl,setSelectedFile ,selectedFile, setCircularLoading}) {
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const maxSizeMB = 2;

    const handleFileChange = (file) => {
        if (!file) return;

        const fileType = file.type;
        const fileSizeMB = file.size / (1024 * 1024);

        if (type === "image") {
            if (!fileType.startsWith("image/")) {
                toast.error("Only image files are allowed.");
                return;
            }
            if (fileSizeMB > maxSizeMB) {
                toast.error(`Image size should not exceed ${maxSizeMB}MB.`);
                return;
            }
        } else {
            if (!["audio/mpeg", "video/mp4", "application/pdf"].includes(fileType)) {
                toast.error("Only audio, video, or PDF files are allowed.");
                return;
            }
            if (fileType.startsWith("video/") && fileSizeMB > maxSizeMB) {
                toast.error(`Video size should not exceed ${maxSizeMB}MB.`);
                return;
            }
        }

        setLoading(true); // Start loading
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
        setCircularLoading(true)
        try {
            const formData = new FormData();
            formData.append('sharedMessage', selectedFile);
            
            const res = await fileUploadFunction("/upload-file", formData);
            if (res?.status) {
                toast.success("File uploaded successfully");
                setSelectedUrl(res?.data?.file_url);
                setFileUpload(null)
            } else {
                toast.error(res?.data?.errors?.sharedMessage?.[0] || "Upload failed");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            const errorMessage = error.response?.data?.errors?.sharedMessage?.[0] || "Error uploading file";
            toast.error(errorMessage);
        } finally {
          setFileUpload(false)
          setCircularLoading(false)
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
                            {selectedFile ? (
                                <div className="audio-container mx-auto fileUploadBody">

                                    {loading ? (
                                        <p>Loading preview...</p>
                                    ) : (
                                        <>
                                            {selectedFile.type.startsWith("image/") && (
                                                <img src={preview} alt="Preview" className="img-preview" />
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
                                    )}
                                </div>
                            ) : (
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
                                        accept={type === "image" ? "image/*" : "audio/mpeg,video/mp4,application/pdf"}
                                        onChange={(e) => handleFileChange(e.target.files[0])}
                                    />
                                    <label htmlFor="fileInput" className="d-block">
                                        <div className="test-user text-center">
                                            <i style={{ fontSize: 30 }} className="fa-solid fa-cloud-arrow-up" />
                                            <p className="mb-0 mt-2 text-center">Drag and Drop or <span>Click on upload</span></p>
                                            <span>Supports formats : {type === "image" ? "Images (Max 2MB)" : "Audio, Video (Max 2MB), PDF"}</span>
                                        </div>
                                    </label>
                                </div>
                            )}
                        </div>
                        <div className="card-footer">
                            <div className="d-flex justify-content-between">
                                <button className="panelButton m-0" disabled={!selectedFile}  onClick={()=>handleConfirm()}>
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
