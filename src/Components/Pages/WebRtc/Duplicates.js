import React, { useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { generalGetFunction, generalPostFunction, generatePreSignedUrl } from '../../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';
import SkeletonTableLoader from '../../Loader/SkeletonTableLoader';
import AudioPlayer from './AudioWaveForm';
import Comments from './Comments';

export default function Duplicates({ setShowDuplicatePopUp, duplicatePopUpData }) {
  const [selectedId,setSelectedId]=useState(duplicatePopUpData.id)
  const [loading, setLoading] = useState(true);
  const [showComment, setShowComment] = useState(false);
  // const [commentData, setCommentData] = useState([]);
  const [duplicateData, setDuplicateData] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const thisAudioRef = useRef(null);
 

  useEffect(() => {
    return () => {
      // Reset audio state when component unmounts
      setCurrentPlaying("");
      setAudioURL("");
    };
  }, []);
  useEffect(() => {
    async function getData() {
      const callDirection = duplicatePopUpData["Call-Direction"];
      let res;
      try {

        if (callDirection == "inbound") {
          res = await generalGetFunction(`/cdr-comments-user?source=${duplicatePopUpData["variable_sip_from_user"]}`)
        } else {
          res = await generalGetFunction(`/cdr-comments-user?destination=${duplicatePopUpData["variable_sip_to_user"]}`)
        }
        if (res.status) {
          setLoading(false)
          setDuplicateData(res.data);
        } else {
          setLoading(false)
        }

      } catch (error) {

      }
    }
    getData()
  }, [])
  // Get the previous comments data

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${secs}`;
  }


  const handelOpenNotes = () => {
setShowComment(true)
  }
  const handlePlaying = async (audio) => {
    debugger
    try {
      setCurrentPlaying(audio);
      const url = audio?.split(".com/").pop();
      const res = await generatePreSignedUrl(url);

      if (res?.status && res?.url) {
        setAudioURL(res.url); // Update audio URL state

        // Wait for React state update before accessing ref
        setTimeout(() => {
          if (thisAudioRef.current) {
            thisAudioRef.current.load(); // Reload audio source
            thisAudioRef.current.play().catch((error) => {
              console.error("Audio play error:", error);
            });
          }
        }, 100); // Reduced timeout to minimize delay
      }
    } catch (error) {
      console.error("Error in handlePlaying:", error);
    }
  };

  return (

   <>
   {showComment&&  <Comments id={selectedId} setId={setSelectedId} />} <div className="backdropContact " style={{zIndex: "11"}}>
   <div className="addNewContactPopup w-auto">

     {/* <div className="col-12 heading mb-0">
             <i className="fa-light fa-comment-dots" />
             <h5>Agent Note</h5>
         </div>
       */}
     <div className='overviewTableWrapper p-0'>
       <div className='overviewTableChild border-0 shadow-none'>
         <div className="col-xl-12">
           {!loading ?
             <>
               {duplicateData.length > 0 ?
                 <div className='tableContainer m-0 p-0'>
                   <table>
                     <thead>
                       <tr>
                         <th>Call Direction</th>
                         <th>Call Origin</th>
                         <th>Call Destination</th>
                         <th>Recordings</th>
                         <th>Duration</th>
                         <th>Comments</th>
                       </tr>
                     </thead>
                     <tbody  >
                       {duplicateData.map((call, index) => (
                         <React.Fragment key={call["recording_path"]}>
                           <tr
                           >
                             <td>{call["Call-Direction"]}</td>
                             <td>{call["variable_sip_from_user"]}</td>
                             <td>{call["variable_sip_to_user"]}</td>
                             <td>
                               <button
                                 className="tableButton"
                              //  onClick={() =>{
                              //   setCurrentPlaying(call[
                              //     "recording_path"
                              //     ])
                              //      handlePlaying(
                              //        call[
                              //        "recording_path"
                              //        ]
                              //      );
                                 
                              //  }}
                               >
                                 {currentPlaying ===
                                   call[
                                   "recording_path"
                                   ] ? (
                                   <i className="fa-solid fa-stop"></i>
                                 ) : (
                                   <i className="fa-solid fa-play"></i>
                                 )}
                               </button>
                             </td>
                             <td className="px-4 py-3">{formatTime(call["variable_billsec"])}</td>
                             <td className="px-4 py-3">
                               <button
                                 className="tableButton"
                                 onClick={() => handelOpenNotes()}
                               >
                                 <i className="fa-solid fa-comment-dots"></i>
                               </button>
                               {/* {call.comments} */}
                             </td>
                           </tr>
                           {/* Recording Player */}
                          {currentPlaying ===
                                          call["recording_path"] &&
                                        <tr>
                                          <td colspan="18">
                                            <div class="audio-container mx-2">
                                            <AudioPlayer audioUrl={audioURL} />
                                            </div>
                                          </td>
                                        </tr>}
                         </React.Fragment>
                       ))}
                   
                     </tbody>
                   </table>
                 </div>
                 :
                 <div className="startAJob">
                   <div className="text-center mt-3">
                     <img
                       src={require("../../assets/images/empty-box.png")}
                       alt="Empty"
                     ></img>
                     <div>
                       <h5>
                         No Records are Available.
                       </h5>
                       <h5>
                         Please select a different <b>record</b> to see all of its details here.
                       </h5>
                     </div>
                   </div>
                 </div>
               }
             </> :
             <div className='tableContainer m-0 p-0'>
               <table>
                 <thead>
                   <tr>
                     <th>Call Direction</th>
                     <th>Call Origin</th>
                     <th>Call Destination</th>
                     <th>Recordings</th>
                     <th>Duration</th>
                     <th>Comments</th>
                   </tr>
                 </thead>
                 <tbody >
                   <SkeletonTableLoader col={6} row={15} />
                 </tbody>
               </table>
             </div>}
           <div className="col-xl-12 mt-2">
             <div className="d-flex justify-content-between align-items-center">
               <button className="panelButton gray mx-0" onClick={() => setShowDuplicatePopUp(false)}>
                 <span className="text">Close</span>
                 <span className="icon">
                   <i className="fa-solid fa-caret-left" />
                 </span>
               </button>
               {/* {
   comment && comment !== "" && <button className="tableButton delete" onClick={() => handleComments("delete")}>
     <i className="fa-solid fa-trash" />
   </button>
 } */}
               <button className="panelButton mx-0" >
                 <span className="text">ok</span>
                 <span className="icon">
                   <i className="fa-solid fa-floppy-disk" />
                 </span>
               </button>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 </div></>
  )
}

