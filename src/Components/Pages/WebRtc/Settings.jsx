import React, { useEffect, useState } from 'react'
import SoundSettings from './SoundSettings'
import { logout } from '../../GlobalFunction/globalFunction';
import { useDispatch, useSelector } from 'react-redux';
import { useSIPProvider } from 'modify-react-sipjs';
import LogOutPopUp from './LogOutPopUp';
import HeaderApp from './HeaderApp';

const Settings = (
    {
        audioRef,
        audioCtxRef,
        gainNodeRef,
        analyserRef,
        volume,
        setVolume,
        allContactLoading,
        setAllContactLoading,
        audio,
        handleVolumeChange
    }) => {
    const dispatch = useDispatch();
    const [allLogOut, setAllLogOut] = useState(false);
    const [loading, setLoading] = useState(true);
    const state = useSelector((state) => state);

    const allCallCenterIds = state.allCallCenterIds;
    const addContactRefresh = state.addContactRefresh;

    const { sessionManager } = useSIPProvider()
    // Function to handle logout
    const handleLogOut = async () => {
        setLoading(true);
        try {
            const apiResponses = await logout(
                allCallCenterIds,
                dispatch,
                sessionManager
            );
        } catch (error) {
            console.error("Unexpected error in handleLogOut:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleContactRefresh = () => {
        setAllContactLoading(true);
        dispatch({
            type: "SET_ADDCONTACTREFRESH",
            addContactRefresh: addContactRefresh + 1,
        });
    };
    return (
        <>
            {allLogOut && (
                <LogOutPopUp setAllLogOut={setAllLogOut} handleLogOut={handleLogOut} />
            )}
            <main
                className="mainContentApp" style={{ marginRight: 0 }}>
                <section className="callPage">
                    <div className="container-fluid">
                        <div className="row" style={{ height: "100%" }}>
                            <div className="col-12 ps-xl-0">
                                <HeaderApp title={"Settings"} loading={allContactLoading} setLoading={setAllContactLoading} refreshApi={() => handleContactRefresh()} />
                            </div>
                        </div>

                        <SoundSettings
                            audio={audio}
                            setVolume={setVolume}
                            gainNodeRef={gainNodeRef}
                            audioCtxRef={audioCtxRef}
                            analyserRef={analyserRef}
                            audioRef={audioRef}
                            volume={volume}
                            handleVolumeChange={handleVolumeChange}
                        />

                    </div>
                </section>
            </main>
        </>

    )
}

export default Settings