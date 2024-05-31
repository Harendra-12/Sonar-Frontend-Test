import React from 'react'

function ContentLoader() {
    return (

        <>
            <div style={{ height: 250 }}>
                <div className='loaderWrapper'>
                    <div className="spinner"></div>
                </div>
                <div className="wordLoader">
                    <p>Loading</p>
                    <div className="words">
                        <span className="word">Account</span>
                        <span className="word">Database</span>
                        <span className="word">Configs</span>
                        <span className="word">Loaders</span>
                        <span className="word">Account</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContentLoader
