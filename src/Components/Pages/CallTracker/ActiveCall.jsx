import React, { useState } from 'react'
import Header from '../../CommonComponents/Header'

const ActiveCall = () => {
    const [refreshState] = useState(false)
    const getRefresh = () => {

    }
    return (
        <main className='mainContent'>
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Active Calls" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4> Active Calls
                                                    <button
                                                        class="clearButton"
                                                        onClick={getRefresh}
                                                        disabled={refreshState}>
                                                        <i class={`fa-regular fa-arrows-rotate fs-5 ${refreshState ? 'fa-spin' : ''}`} /></button>
                                                </h4>
                                                <p>You can see all list of all Active Calls</p>
                                            </div>
                                            <div className="buttonGroup">
                                                <button className="panelButton gray">
                                                    <span className="text">Back</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-12"
                                        style={{ overflow: "auto", padding: "10px 20px 0" }}
                                    >

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default ActiveCall