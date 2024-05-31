import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function OngoingCall() {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const callState = useSelector((state)=>state.callState)
    console.log("This is callState",callState);
    const [status,setStatus]=useState("dialing...")
    useEffect(()=>{
        if(callState!==null && callState["Answer-State"]){
            setStatus(callState["Answer-State"]==="hangup"?callState["Hangup-Cause"]:callState["Answer-State"])
        }
    },[callState])
    const navigate = useNavigate()
    const toggleFullScreen = () => {
        if (!isFullScreen) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) { /* IE/Edge */
                document.documentElement.msRequestFullscreen();
            }
        } else {
            // Exit full screen mode
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
        }
        setIsFullScreen(!isFullScreen); 
    };

    // Function for display message during reload or cloase of page
    useEffect(() => {
      const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""
        const confirmationMessage = 'Are you sure you want to reload this page.';
        event.returnValue = confirmationMessage;
        return confirmationMessage;
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, []);
  return (
    <>
       <style>
        {`#sidenNav{
        display:none;
      }`}
      </style>
      <main className="mainContentApp m-0 p-0">
        <div className="caller">
          <div className="container-fluid">
            <div className="row header">
              <div className="col-4"></div>
              <div className="col-4 text-center">
                <h5>{status}</h5>
              </div>
              <div className="col-4 d-none d-xl-flex justify-content-end">
                <button className="appPanelButtonColor" effect="ripple">
                  <i className="fa-thin fa-gear" />
                </button>
                <button
                  className="appPanelButtonColor ms-2"
                  effect="ripple"
                  onClick={toggleFullScreen}
                >
                  <i className="fa-thin fa-arrows-maximize" />
                </button>
              </div>
            </div>
            <div className="user">
              <div className="my-auto">
                <div id="userCallerProfile">
                  <div className="userHolder col-12 mx-auto my-5">
                    <i className="fa-solid fa-user" />
                  </div>
                  <div className="col-12 text-center">
                    <h3>1 (999) 999-9999</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="row footer">
              <button className="appPanelButtonCaller" effect="ripple">
                <i className="fa-thin fa-microphone-slash" />
              </button>
              <button
                className="appPanelButtonCaller"
                effect="ripple"
                
              >
                <i className="fa-thin fa-grid" />
              </button>
              <button className="appPanelButtonCaller" effect="ripple">
                <i className="fa-thin fa-user-plus" />
              </button>
              <button className="appPanelButtonCaller" effect="ripple">
                <i className="fa-thin fa-phone-arrow-up-right" />
              </button>
              <button className="appPanelButtonCaller" effect="ripple">
                P
              </button>
              <button className="appPanelButtonCaller" effect="ripple">
                <i className="fa-thin fa-pause" />
              </button>
              <button
                className="appPanelButtonCaller bg-danger"
                effect="ripple"
                onClick={()=>navigate(-1)}
              >
                <i className="fa-thin fa-phone-hangup" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default OngoingCall;
