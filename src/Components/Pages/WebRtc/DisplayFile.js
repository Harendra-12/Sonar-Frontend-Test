import React, { useEffect, useRef, useState } from 'react';

const index=0;
const DisplayFile = ({ item}) => {
  const thisAudioRef = useRef(null);
  const [enlargeImage, setEnlargeImage] = useState(false);

  useEffect(() => {
   if(item){
    if (thisAudioRef.current) {
      thisAudioRef.current.load();
      thisAudioRef.current.play().catch((error) => {
        console.error("Audio play error:", error);
      });
    }
   }
  }, [item]);
  
  const extractFileExtension = (selectedUrl) => {
    if (!selectedUrl) return null;
    const fileUrl = selectedUrl;
    
    const fileName = fileUrl.split("/").pop();
    if (fileName) {
      // Try extracting extension from the filename
        
          const lowerValue = selectedUrl;
          if (lowerValue.includes("png")||lowerValue.includes("Screenshot")) return "png";
          if (lowerValue.includes("jpg") || lowerValue.includes("jpeg")) return "jpg";
          if (lowerValue.includes("pdf")) return "pdf";
          if (lowerValue.includes("mp3")) return "mp3";
          if (lowerValue.includes("mp4") || lowerValue.includes("Video"))  return "mp4";
  
      
      // const decodedFileName = decodeURIComponent(fileName);
      // const decodedParts = decodedFileName.split(".");
      // if (decodedParts.length > 1) {
      //   return decodedParts.pop().toLowerCase();
      // }
    }
  
    return null; // No extension found
  };


  if (!item) return null;
  if(item=="loading") return <div style={{width:"100px",height:"100px",backgroundColor:"grey", display:"flex", justifyContent:"center",alignItems:"center"}}><div class="spinner-border text-primary" role="status">
  <span class="visually-hidden">Loading...</span>
</div></div>;
  const fileUrl = item.startsWith('http://') || item.startsWith('https://') ? extractFileExtension(item) : "";
  const ext = fileUrl;
  // console.log({ext})
  if (!ext) {
    return <div className="messageDetails">{item}</div>;
  }
  else {
    if (ext === "jpg" || ext === "png" || ext === "jpeg") {
      return <div>
        <img width="200PX" height="160px" src={item} alt=""  onClick={() => setEnlargeImage(true)}/>
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
        if (parts.length > 0) {
          return parts[parts.length - 1];
        } else {
          return null; // Handle cases with no slashes
        }
      }
    
      return (
        
        <div>
        <div style={{width:"200px",height:"60px",backgroundColor:"grey",display:"flex",justifyContent:"center",alignItems:"center"}}  onClick={() => setEnlargeImage(true)}><h4>{ extractFileNameFromUrl(item)}</h4></div>
        {enlargeImage ? (
        <div className="popup" onClick={() => setEnlargeImage(false)}>
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
            <iframe
          src={item}
          width="250PX"
          height="160px"
          style={{ border: 'none' }}
          title={`PDF Document - ${extractFileNameFromUrl(item)}`}
        />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
        {/* <iframe
          src={pdfUrl}
          width="250PX"
          height="160px"
          style={{ border: 'none' }}
          title={`PDF Document - ${fileName}`}
        /> */}
        {/* <a href={item} download rel="noopener noreferrer" target='_blank'><button >Download</button></a> */}
      </div>
      );
    }
    
    // Handle audio files (mp3 and others)
    if (ext === "mp3") { 
      return (
        <div className="messageDetailss" key={index+1}>
          <div className="audio-container mx-2">
            <audio
              controls={true}
              // ref={thisAudioRef}
              autoPlay={false}
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
        <div key={index+2} >
          <video
            controls
            width="200px"
            height="160px"
          >
            <source src={item} type="video/mp4" />
          </video>
        <br/>
      </div>
      );
    }
  }
  
};

export default DisplayFile;