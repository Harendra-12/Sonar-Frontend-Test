import React, { useState } from 'react'

function IncomingCallPopup() {
    const [isMinimized, setIsMinimized] = useState(false);
    return (
        <>
            {!isMinimized ? (<div className='incomingCallPopup'>
                <div>
                    <div className="user">
                        <div className="userHolder col-12">
                            <i className="fa-solid fa-user" />
                        </div>
                        <div className="userInfo col-12 text-center">
                            <h4>+991 888 888 9999</h4>
                            <h5>Mr Charles McGill</h5>
                        </div>
                    </div>
                    <div className='controls'>
                        <button class="callButton"><i class="fa-duotone fa-phone"></i></button>
                        <button class="callButton hangup"><i class="fa-duotone fa-phone-hangup"></i></button>
                    </div>
                </div>
                <div className='minimizeBtn'>
                    <button class="whiteCircleBtn" onClick={() => setIsMinimized(true)}><i class="fa-solid fa-dash"></i></button>
                </div>
            </div>)
                : (<div className='incomingCallPopup minimized'>
                    <div className="user">
                        <div className="userHolder">
                            <i className="fa-solid fa-user" />
                        </div>
                        <div className="userInfo text-start my-0 px-2">
                            <h4>+991 888 888 9999</h4>
                            <h5>Mr Charles McGill</h5>
                        </div>
                        <div className='controls m-0'>
                            <button class="callButton"><i class="fa-duotone fa-phone"></i></button>
                            <button class="callButton hangup"><i class="fa-duotone fa-phone-hangup"></i></button>
                        </div>
                    </div>

                </div>)}
        </>
    )
}

export default IncomingCallPopup