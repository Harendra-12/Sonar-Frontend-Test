import React from 'react'
import { useNavigate } from 'react-router-dom'
import { backToTop } from '../../GlobalFunction/globalFunction'

const ExtensionsExport = () => {
    const navigate = useNavigate()
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-12" id="subPageHeader">
                            <div className="row px-xl-3">
                                <div className="col-xl-6 my-auto">
                                    <h4 className="my-auto">Extension Export</h4>
                                </div>
                                <div className="col-xl-6 ps-2">
                                    <div className="d-flex justify-content-end">
                                        <button
                                            effect="ripple"
                                            className="panelButton"
                                            onClick={() => { navigate(-1); backToTop() }}
                                        >
                                            Back
                                        </button>
                                        <button effect="ripple" className="panelButton">
                                            Export
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div />
                        <div className="col-xl-12" style={{ overflow: "auto" }}>
                            <div className="mx-2" id="detailsContent">
                                <form action="#">
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                extension_uuid
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                domain_uuid
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                extension
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                number_alias
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                password
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                accountcode
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                effective_caller_id_name
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                effective_caller_id_number
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                outbound_caller_id_name
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                outbound_caller_id_number
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                emergency_caller_id_name
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                emergency_caller_id_number
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                directory_first_name
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                directory_last_name
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                directory_visible
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                directory_exten_visible
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                limit_max
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                limit_destination
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                missed_call_app
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                missed_call_data
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                user_context
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                toll_allow
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                call_timeout
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                call_group
                                            </label>
                                        </div>
                                    </div>
                                    <div className="listRow">
                                        <div className="listLabel">
                                            <input type="checkbox" name="" id="tableCheckbox" />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="data" className="listItemDesc">
                                                call_screen_enabled
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

    )
}

export default ExtensionsExport