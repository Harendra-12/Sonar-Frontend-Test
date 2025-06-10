import React, { useState } from 'react'
import Header from '../../CommonComponents/Header';

const AiBatchCall = () => {
    const [refreshState, setRefreshState] = useState(false)
    
    const handleRefreshBtnClicked = () => {
        setRefreshState(true)
        // const shouldLoad = false
        // getData(shouldLoad);
    }

  return (
    <>
         <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Agents" />
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>Batch Call {" "}
                                                        <button
                                                            className="clearButton"
                                                            onClick={handleRefreshBtnClicked}
                                                            disabled={refreshState}
                                                        >
                                                            <i
                                                                className={
                                                                    refreshState
                                                                        ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                                                        : "fa-regular fa-arrows-rotate fs-5"
                                                                }
                                                            ></i>
                                                        </button>
                                                    </h4>
                                                    <p>You can manage yours agents here</p>
                                                </div>
                                                <div className="buttonGroup">
                                                    <button effect="ripple" className="panelButton xlWidth" >
                                                        <span className="text">Create a batch call</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-plus"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                              
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
    </>
  )
}

export default AiBatchCall