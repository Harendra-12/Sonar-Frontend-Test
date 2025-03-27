import React, { useRef } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { generalGetFunction, generalPostFunction, generatePreSignedUrl } from '../../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';

export default function Duplicates({setShowDuplicatePopUp,duplicatePopUpData }) {
     const [loading, setLoading] = useState(true);
     const [comment, setComment] = useState("");
     const [commentData, setCommentData] = useState([]);
     const [duplicateData,setDuplicateData]=useState([]);
      const [currentPlaying, setCurrentPlaying] = useState("");
       const [audioURL, setAudioURL] = useState("");
        const thisAudioRef = useRef(null);
        const [id,setId]=useState("")

     useEffect(()=>{
     async function getData(){
        const callDirection=duplicatePopUpData["Call-Direction"];
           
        let res;
        try {
          if(callDirection== "inbound"){
            res= await generalGetFunction(`/cdr-comments-user?source=${duplicatePopUpData["variable_sip_to_user"]}`)
          }else{
            res= await generalGetFunction(`/cdr-comments-user?destination=${duplicatePopUpData["variable_sip_from_user"]}`)
          }
          if(res.status){
            console.log("000res",res.data)
            setDuplicateData(res.data);
          }
          
        } catch (error) {
          
        }
      }
      getData()
     },[])
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
      //  async function handleComments(type) {
      //   setShowDuplicatePopUp(false)
      //         if (comment === "" || !comment) {
      //             toast.error("Please enter a comment");
      //             return;
      //         }
      //         setLoading(true);
      
      //         if (type === "add") {
      //             const apiData = await generalPostFunction(`/cdr_comment/store`, { comment: comment, channel_hangup_complete_id: id });
      //             if (apiData.status) {
      //                 toast.success(apiData.message);
      //                 setComment("");
      //                 setId("");
      //                 setLoading(false);
      //             } else {
      //                 setLoading(false);
      //                 toast.error(apiData.message);
      //             }
      //         } else if (type === "delete") {
      
      //         }
      //     }

const handelOpenNotes=(id)=>{
  async function getComment(id) {
    setLoading(true);
    const apiData = await generalGetFunction(`/cdr_comment/all?cdr_id=${id}`)
    if (apiData.status) {
        setCommentData(apiData.data)
        setId(id);
        setLoading(false);
    } else {
        setLoading(false);
    }
}
getComment(id)
}
      const handlePlaying = async (audio) => {
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
    <div className="backdropContact ">
    <div className="addNewContactPopup">
        <div className="formRow px-0 pb-0 row">
            {/* <div className="col-12 heading mb-0">
                <i className="fa-light fa-comment-dots" />
                <h5>Agent Note</h5>
            </div>
          */}
            <div className="col-xl-12">
                
            <table className="w-full bg-white">
          <thead className="">
            <tr>
              <th className="px-4 py-3 text-left">Call Direction</th>
              <th className="px-4 py-3 text-left">Call Origin</th>
              <th className="px-4 py-3 text-left">Call Destination</th>
              <th className="px-4 py-3 text-left">Recordings</th>
              <th className="px-4 py-3 text-left">Duration</th>
              <th className="px-4 py-3 text-left">Comments</th>
            </tr>
          </thead>
          <tbody className="">
            {duplicateData.map((call, index) => (
              <tr 
                key={index} 
                className="hover:bg-gray-50 transition-colors"
                onClick={()=>handelOpenNotes(duplicatePopUpData.id)}
              >
                <td className="px-4 py-3">{call["Call-Direction"]}</td>
                <td className="px-4 py-3">{call["variable_sip_from_user"]}</td>
                <td className="px-4 py-3">{call["variable_sip_to_user"]}</td>
                <td className="px-4 py-3">
                <td>
                                                   
                                                        <button
                                                          className="tableButton px-2 mx-0"
                                                          onClick={() => {
                                                            if (
                                                             call[
                                                              "recording_path"
                                                              ] ===
                                                              currentPlaying
                                                            ) {
                                                              setCurrentPlaying(
                                                                ""
                                                              );
                                                              setAudioURL("");
                                                            } else {
                                                              handlePlaying(
                                                                call[
                                                                "recording_path"
                                                                ]
                                                              );
                                                            }
                                                          }}
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
                </td>
                <td className="px-4 py-3">{formatTime(call["variable_billsec"])}</td>
                <td className="px-4 py-3">{call.comments}</td>
              </tr>
           
            ))}
            <tr>{commentData&& <div className=''>
                            {loading ?
                                <div>
                                    <div className=''>
                                        <div className='d-flex align-items-center'>
                                            <span>
                                                <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="img" height={30} width={30} />
                                            </span>
                                            <span className='username-cmt skeleton skeleton-text ms-3' style={{ width: 100 }}></span>
                                        </div>
                                        <div className='name-comment skeleton skeleton-text'></div>
                                        <div className='name-comment skeleton skeleton-text w-75'></div>
                                    </div>
                                </div>
                                :
                                commentData.length > 0 ?
                                    commentData.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <div className='back-comment'>
                                                    <span>
                                                        <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="img" height={30} width={30} />
                                                    </span>
                                                    <span className='username-cmt ms-2'>  {item?.commented?.username}</span>
                                                    <div className='d-flex align-items-end justify-content-between mt-1'>
                                                        <span className='name-comment ms-1'>   {item.comment}</span>
                                                        <span className='date-small' >  {item.created_at.split("T")[0]}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                    : <div className="formLabel">
                                        <label htmlFor="">No comment found</label>
                                    </div>
                            }
                        </div>}</tr>
          </tbody>
        </table>

                <div className="col-xl-12 mt-2">
                    <div className="d-flex justify-content-between align-items-center">
                        <button className="panelButton gray mx-0" onClick={() => setShowDuplicatePopUp(false) }>
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
  )
}
 {/* {commentData["Call-Direction"]}{commentData["variable_sip_from_user"]}{commentData["variable_sip_to_user"]}
            {commentData["recording_path"]&&<audio></audio>}
            {commentData["variable_start_stamp"]}
            {commentData.comments
            } */}
