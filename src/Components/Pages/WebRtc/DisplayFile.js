import React, { useEffect, useRef } from 'react';

const DisplayFile = ({ item }) => {
  const thisAudioRef = useRef(null);

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
  
    //  Remove query parameters and get the base URL
    const fileUrl = selectedUrl;
    const fileName = fileUrl.split("/").pop();
  
    if (fileName) {
      // Try extracting extension from the filename
      const fileParts = fileName.split(".");
      if (fileParts.length > 1) {
        return fileParts.pop().toLowerCase(); // Standard case: return the extension
      }
  
      // Step 3: Fallback - Check query parameters for extension hints
      const queryParams = selectedUrl.split("?")[1];
      if (queryParams) {
        const params = new URLSearchParams(queryParams);
        // Look for common extension indicators in query params (customize as needed)
        for (const [value] of params) {
          const lowerValue = selectedUrl.toLowerCase();
          if (lowerValue.includes("png")) return "png";
          if (lowerValue.includes("jpg") || lowerValue.includes("jpeg")) return "jpg";
          if (lowerValue.includes("pdf")) return "pdf";
          // Add more extensions as needed
        }
      }
  
      // Step 4: Fallback - Decode URL-encoded filename and retry
      const decodedFileName = decodeURIComponent(fileName);
      const decodedParts = decodedFileName.split(".");
      if (decodedParts.length > 1) {
        return decodedParts.pop().toLowerCase();
      }
    }
  
    return null; // No extension found
  };


  if (!item) return null;
  
  const fileUrl = item.startsWith('http://') || item.startsWith('https://') ? extractFileExtension(item) : "";
  const ext = fileUrl;
  
  if (!ext) {
    return <p className="messageDetails">{item}</p>;
  }
  else {
    if (ext === "jpg" || ext === "png" || ext === "jpeg") {
      return <img width="400PX" height="160px" src={item} alt="" />;
    }
    
    // Handle PDF files
    if (ext === "pdf") {
      return (
        <iframe 
          src={item} 
          width="250PX" 
          height="160px" 
          style={{ border: 'none' }} 
          title={`PDF Document - ${item}`} 
          className="documents-pdf"
        />
      );
    }
    
    // Handle audio files (mp3 and others)
    if (ext === "mp3") { 
      return (
        <div className="messageDetailss">
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
          </div>
        </div>
      );
    }
    
    if (ext === "mp4") {
      return (
        <div>
          <video 
            controls
            width="500px"
            height="auto"
          >
            <source src={item} type="video/mp4" />
            Your browser does not support the video element.
          </video>
        </div>
      );
    }
  }
  
};

export default DisplayFile;