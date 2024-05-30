import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { backToTop } from '../../GlobalFunction/globalFunction'

const ExtensionsSettings = () => {
    const navigate = useNavigate()
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-12" id="subPageHeader">
                            <div className="row px-xl-3">
                                <div className="col-xl-6 my-auto">
                                    <h4 className="my-auto">Extension Settings</h4>
                                </div>
                                <div className="col-xl-6 my-2 ps-2">
                                    <div className="d-flex justify-content-end">
                                        <button
                                            effect="ripple"
                                            className="panelButton"
                                            onClick={() => { navigate(-1); backToTop() }}
                                        >
                                            Back
                                        </button>
                                        <Link to="/extension-settings-edit" onClick={backToTop}
                                            effect="ripple"
                                            className="panelButton"
                                           
                                        >
                                            Add
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-12 my-3">
                                    <p className="p-0 m-0">
                                        Assign variables and parameters to this extension.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

    )
}

export default ExtensionsSettings