import React, { useEffect, useRef, useState } from 'react';



// Keep track of the currently playing audio ref and video ref
let currentlyPlayingAudioRef = null;
let currentlyPlayingVideoRef = null;


const DisplayFile = ({ item, index }) => {
  const thisAudioRef = useRef(null);
  const thisVideoRef = useRef(null);
  const [enlargeImage, setEnlargeImage] = useState(false);
  const [showOptions, setShowOptions] = useState(false);


  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

const downloadPdf=async(pdfUrl,filename)=>{
  try {
    const response = await fetch(pdfUrl, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(
      new Blob([blob], { type: "application/pdf" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link)
;
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url)
  }catch (error) {
    console.log(error)
  }
}

 useEffect(() => {
    if (item && thisAudioRef.current) {
      thisAudioRef.current.load();
      thisAudioRef.current.pause();
    }
    if (item && thisVideoRef.current) {
      thisVideoRef.current.load();
      thisVideoRef.current.pause();
    }
  }, [item]);

  const handlePlayVideo = () => {
    if (thisVideoRef.current) {
      // Pause any currently playing video
      if (currentlyPlayingVideoRef && currentlyPlayingVideoRef !== thisVideoRef.current) {
        currentlyPlayingVideoRef.pause();
        currentlyPlayingVideoRef.currentTime = 0; // Reset playhead
      }
      // Pause any currently playing audio
      if (currentlyPlayingAudioRef) {
        currentlyPlayingAudioRef.pause();
        currentlyPlayingAudioRef.currentTime = 0; // Reset playhead (if applicable)
      }
      thisVideoRef.current.play().catch((error) => {
        console.error("Video play error:", error);
      });
      currentlyPlayingVideoRef = thisVideoRef.current;
      currentlyPlayingAudioRef = null;
    }
  };
  const handlePlayAudio = () => {
    if (thisAudioRef.current) {
      // Pause the currently playing audio if there is one and it's not this one
      if (currentlyPlayingAudioRef && currentlyPlayingAudioRef !== thisAudioRef.current) {
        currentlyPlayingAudioRef.pause();
      }
      thisAudioRef.current.play().catch((error) => {
        console.error("Audio play error:", error);
      });
      // Update the currently playing audio ref
      currentlyPlayingAudioRef = thisAudioRef.current;
    }
  };

  const extractFileExtension = (selectedUrl) => {
    if (!selectedUrl) return null;
    const fileUrl = selectedUrl;
    const fileName = fileUrl.split("/").pop();
    if (fileName) {
      const lowerValue = selectedUrl;
      if (lowerValue.includes("png") || lowerValue.includes("Screenshot")) return "png";
      if (lowerValue.includes("jpg") || lowerValue.includes("jpeg") || lowerValue.includes("gif")) return "jpg";
      if (lowerValue.includes("pdf")) return "pdf";
      if (lowerValue.includes("mp3")) return "mp3";
      if (lowerValue.includes("mp4") || lowerValue.includes("Video")) return "mp4";
    }
    return null; // No extension found
  };

  

  if (!item) return null;
  if (item === "loading") return <div style={{ width: "200px", height: "79px", backgroundColor: "var(--dash-listing-bg)", borderRadius: "5px",display:"flex",justifyContent:"space-between",alignItems:"end",padding:'1rem' }}>
    
    <div className="spinner-border  d-flex justify-content-center align-items-center text-primary" role="status">
    <span className="visually-hidden spninner-loader ">Loading...</span>
  </div></div>;
  const fileUrl = item.startsWith('http://') || item.startsWith('https://') ? extractFileExtension(item) : "";
  const ext = fileUrl;

  if (!ext) {
    return <div className="messageDetails">{item}</div>;
  } else {
    if (ext === "jpg" || ext === "png" || ext === "jpeg") {
      return <div>
        <img width="200PX" height="160px" src={item} alt="" onClick={() => setEnlargeImage(true)} />
        {enlargeImage ? (
          <div className="popup" onClick={() => setEnlargeImage(false)}>
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <img
                  src={item}
                  alt="Preview"
                  style={{ maxWidth: "800px", maxHeight: "800px" }}
                />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

    }

    // Handle PDF files
    if (ext === "pdf") {
      function extractFileNameFromUrl(url) {
        if (!url || typeof url !== 'string') {
          return null; // Handle invalid input
        }

        const parts = url.split('/');
        if (parts.length === 0) {
          return null; // Handle cases with no slashes
        }

        const originalFileName = parts[parts.length - 1];
        return originalFileName.substring(originalFileName.length - 10);
      }

      return (

        <div>
          <div className='align-items-center justify-content-start' style={{ width: "200px", height: "79px", backgroundColor: "var(--dash-listing-bg)", borderRadius: "5px",display:"flex",justifyContent:"space-between",alignItems:"end",padding:'1rem'}} >
<div style={{fontSize:"26px", color:"#ff2424"}}>
<i className="fa-solid fa-file-pdf"></i>

</div>
            <h5 className='p-0 m-0 '>{extractFileNameFromUrl(item)}</h5>
          <button
                                          className="clearButton2 xl"
                                          type="button"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="true"
                                           onClick={toggleOptions}
                                        > <i class="fa-solid fa-ellipsis-vertical"  ></i></button>
                                        <ul
                                          className="dropdown-menu light"
                                        >
                                          <li>
                                       <div style={{cursor:"pointer"}} className="dropdown-item" onClick={()=>downloadPdf(item,extractFileNameFromUrl(item))}>
                                              Download
                                            </div>
                                          </li>
                                          {/* <li>
                                            <div className="dropdown-item text-danger" onClick={() =>console.log()}>
                                            
                                            </div>
                                          </li> */}
                                        </ul>
                                     
          </div>
          
        </div>
      );
    }

    // Handle audio files 
    if (ext === "mp3") {
      return (
        <div className="messageDetailss">
          <div className="audio-container mx-2">
            <audio
              controls={true}
              ref={thisAudioRef}
              autoPlay={false}
              onPlay={handlePlayAudio}
            >
              <source
                src={item}
                type="audio/mpeg"
              />

            </audio>
            {/* <a href={item} rel="noopener noreferrer" download>
              <button>Download</button>
            </a> */}
          </div>
        </div>
      );
    }

    if (ext === "mp4") {
      return (
        <div  >
          <video
            controls
            width="200px"
            height="160px"
            ref={thisVideoRef}
            onPlay={handlePlayVideo} 
          >
            <source src={item} type="video/mp4" />
          </video>
          <br />
        </div>
      );
    }
  }

};

export default DisplayFile;