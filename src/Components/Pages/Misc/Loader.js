import React from 'react'

function Loader() {
    return (
        <div className='globalLoader'>
            <div className='container h-100 w-100'>
                <div className='row justify-content-center align-items-center h-100 w-100'>
                    <div className='content text-center'>
                        <div className="loader">
                            <div className="loader__bar"></div>
                            <div className="loader__bar"></div>
                            <div className="loader__bar"></div>
                            <div className="loader__bar"></div>
                            <div className="loader__bar"></div>
                            <div className="loader__ball"></div>
                        </div>
                        <div className="wordLoader">
                            <p>Loading</p>
                            <div className="words">
                                <span className="word">Database</span>
                                <span className="word">Config</span>
                                <span className="word">Accounts</span>
                                <span className="word">Extensions</span>
                                <span className="word">Database</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Loader