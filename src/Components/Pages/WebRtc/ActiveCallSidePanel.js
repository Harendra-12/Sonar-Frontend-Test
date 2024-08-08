import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSessionCall} from 'react-sipjs';

function ActiveCallSidePanel({sessionId,chennel,destination}) {
    const dispatch = useDispatch()
    const globalSession = useSelector((state) => state.sessions);    
    const callProgressId = useSelector((state) => state.callProgressId);
    const {
        isHeld,
        session,
        timer,
      } = useSessionCall(sessionId);


        if(session["_state"]==="Terminated"){    
            if(callProgressId===session._id){
                dispatch({
                    type:"SET_CALLPROGRESSID",
                    callProgressId:"",
                  })
                  dispatch({
                    type:"SET_CALLPROGRESSDESTINATION",
                    callProgressDestination:"",
                  })
                  dispatch({
                    type:"SET_CALLPROGRESS",
                    callProgress:false,
                  })
            }        
            const updatedSession = globalSession.filter((item)=>item.id!==session._id)
            dispatch({
                type:"SET_SESSIONS",
                sessions:updatedSession
            })
        }
    
      console.log("Active call",session._state);


      
   function handleActiveCall(id,dest){
    dispatch({
        type:"SET_CALLPROGRESSID",
        callProgressId:id,
      })
      dispatch({
        type:"SET_CALLPROGRESSDESTINATION",
        callProgressDestination:dest,
      })
      dispatch({
        type:"SET_CALLPROGRESS",
        callProgress:true,
      })
   }
    
    return (
       <>
       {isHeld?<div onClick={()=>handleActiveCall(session._id,destination)} className='col-12 callItem hold'>
                        <div className='profilepicHolder'>
                            {chennel+1}
                        </div>
                        <div className='callContent'>
                            <h4>Line {chennel+1}</h4>
                            <h5>{destination}</h5>
                        </div>
                    </div>:session._state==="Initial"?<div onClick={()=>handleActiveCall(session._id,destination)}  className='col-12 callItem ringing'>
                        <div className='profilepicHolder'>
                            {chennel+1}
                        </div>
                        <div className='callContent'>
                            <h4>Line {chennel+1}</h4>
                            <h5>{destination}</h5>
                        </div>
                    </div>:<div onClick={()=>handleActiveCall(session._id,destination)}  className='col-12 callItem active'>
                        <div className='profilepicHolder'>
                            {chennel+1}
                        </div>
                        <div className='callContent'>
                            <h4>Line {chennel+1}</h4>
                            <h5>{destination}
                                {/* <span className='float-end'>02:23
                                    </span> */}
                                    </h5>
                        </div>
                    </div>}
                    
                    {/* <div className='col-12 callItem active'>
                        <div className='profilepicHolder'>
                            2
                        </div>
                        <div className='callContent'>
                            <h4>Line 2</h4>
                            <h5>1003 <span className='float-end'>02:23</span></h5>
                        </div>
                    </div>
                    <div className='col-12 callItem ringing'>
                        <div className='profilepicHolder'>
                            3
                        </div>
                        <div className='callContent'>
                            <h4>Line 3</h4>
                            <h5>1003 <span className='float-end'>02:23</span></h5>
                        </div>
                    </div>
                    <div className='col-12 callItem hold'>
                        <div className='profilepicHolder'>
                            4
                        </div>
                        <div className='callContent'>
                            <h4>Line 4</h4>
                            <h5>1003 <span className='float-end'>02:23</span></h5>
                        </div>
                    </div> */}
              </>
    )
}

export default ActiveCallSidePanel