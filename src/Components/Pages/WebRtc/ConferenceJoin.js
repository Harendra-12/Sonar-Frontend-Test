import React from 'react'

function ConferenceJoin() {
    return (
        <>
            <style>
                {`#sidenNav{
        display:none;
      }`}
            </style>
            <main className="login">
                <div className="container position-relative h-100">
                    <div className="row h-100">
                        <div className='col-xl-6 mx-auto position-relative'>
                            <div className="loginWrapper2">
                                <div className="col-xl-12 h-100 position-relative d-flex align-items-center">
                                    <div className="content col-xl-7 mx-auto py-5">
                                        <h3>Get Started Now</h3>
                                        <p>Enter your credentials to access your account</p>
                                        <div className="border-bottom my-4"></div>
                                        <form className="loginForm">
                                            <div className="col-xl-12 m-auto">
                                                <label>Username</label>
                                                <div className="position-relative">
                                                    <i className="fa-thin fa-user" />
                                                    <input
                                                        type="text"
                                                        placeholder="Enter your username"
                                                        className="loginFormItem"
                                                    />
                                                </div>
                                                <label>Password</label>
                                                <div className="position-relative">
                                                    <i className="fa-thin fa-lock" />
                                                    <input
                                                        type="password"
                                                        placeholder="Enter your password"
                                                        className="loginFormItem"
                                                    />
                                                </div>
                                                <div>
                                                    <button
                                                        className="formSubmit"
                                                        type="button"
                                                        effect="ripple"
                                                    >
                                                        Join
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="text-center position-absolute w-100" style={{ bottom: 0, left: '50%', transform: 'translate(-50%, -50%)' }}><p style={{ color: 'var(--webUtilGray)', fontSize: 12, marginBottom: 0 }}>2024 AnglePBX. All rights Reserved</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="loginWave">
                    <img src={require('../../assets/images/wave.png')} />
                </div>
            </main>
        </>
    )
}

export default ConferenceJoin