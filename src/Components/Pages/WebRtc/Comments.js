/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { generalGetFunction, generalPostFunction } from '../../GlobalFunction/globalFunction';

function Comments({ id, setId, setShowComment, webrtc ,showCdrReport=false}) {
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [commentData, setCommentData] = useState([]);

    // Get the previous comments data
    useEffect(() => {
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

    }, [id])

    // Logic to handle comments for the call
    async function handleComments(type) {
        if (comment === "" || !comment) {
            toast.error("Please enter a comment");
            return;
        }
        setLoading(true);

        if (type === "add") {
            const apiData = await generalPostFunction(`/cdr_comment/store`, { comment: comment, channel_hangup_complete_id: id });
            if (apiData.status) {
                toast.success(apiData.message);
                setComment("");
                setId("");
                setLoading(false);
            } else {
                setLoading(false);
                toast.error(apiData.message);
            }
        } else if (type === "delete") {

        }
    }

    const handlePopupClose = () => {
        setComment("");
        setId("");
        if(!showCdrReport){
            setShowComment(false);
        }
    }
    return (
        <div className={`backdropContact ${webrtc ? 'bg-transparent' : ''}`} style={{ zIndex: 15 }}>
            <div className="addNewContactPopup">
                <div className="formRow px-0 pb-0 row">
                    {/* <div className="col-12 heading mb-0">
                        <i className="fa-light fa-comment-dots" />
                        <h5>Agent Note</h5>
                    </div>
                  */}
                    <div className="col-xl-12">
                        <div className='content-comment'>
                            {loading ?
                                <div>
                                    <div className='back-comment'>
                                        {/* <div className='d-flex align-items-center'>
                                            <span>
                                                <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="img" height={30} width={30} />
                                            </span>
                                            <span className='username-cmt skeleton skeleton-text ms-3' style={{ width: 100 }}></span>
                                        </div> */}
                                        <div className='name-comment skeleton skeleton-text'></div>
                                        {/* <div className='name-comment skeleton skeleton-text w-75'></div> */}
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
                        </div>
                        <div className="col-12 mt-2">
                            <input
                                className="formItem h-auto"
                                placeholder="Add new comment"
                                name="did"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                        <div className="col-xl-12 mt-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <button className="panelButton gray mx-0" onClick={handlePopupClose}>
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
                                <button className="panelButton mx-0" onClick={() => handleComments("add")}>
                                    <span className="text">Send</span>
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

export default Comments
