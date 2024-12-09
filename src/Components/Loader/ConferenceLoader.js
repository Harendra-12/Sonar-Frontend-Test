import React from 'react'

function ConferenceLoader() {
    return (
        <>
            <style>
                {`
                .loaderConferenceWrapper {
                    background: var(--background);
                }
                .loaderConferenceWrapper {
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 99;
                }

                .loaderConferenceWrapper small {
                    position: fixed;
                    display: block;
                    right: 24px;
                    bottom: 80px;
                }
            `}
            </style>
            <div className='loaderConferenceWrapper'>
                <div className="loaderConference">
                    <div className="box box0">
                        <div />
                    </div>
                    <div className="box box1">
                        <div />
                    </div>
                    <div className="box box2">
                        <div />
                    </div>
                    <div className="box box3">
                        <div />
                    </div>
                    <div className="box box4">
                        <div />
                    </div>
                    <div className="box box5">
                        <div />
                    </div>
                    <div className="box box6">
                        <div />
                    </div>
                    <div className="box box7">
                        <div />
                    </div>
                    <div className="ground">
                        <div />
                    </div>
                </div>
                <small>
                    Hang tight! We're loading your content. This won't take long, and your experience will be worth the wait!
                </small>
            </div>

        </>
    )
}

export default ConferenceLoader