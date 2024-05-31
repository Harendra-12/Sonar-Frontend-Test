import React from 'react'
import { useNavigate } from 'react-router-dom'
import { backToTop } from '../../GlobalFunction/globalFunction'

const ExtensionSettingsEdit = () => {
    const navigate = useNavigate()
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-12" id="subPageHeader">
                            <div className="row px-xl-3">
                                <div className="col-xl-6 my-auto">
                                    <h4 className="my-auto">Extension Setting Add</h4>
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
                                        <button effect="ripple" className="panelButton">
                                            Save
                                        </button>
                                    </div>
                                </div>
                                <div className="col-12 my-1">
                                    <p className="p-0 m-0">
                                        Assign variables and parameters to this extension.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-12" style={{ overflow: "auto" }}>
                            <div className="mx-0" id="detailsContent">
                                <form action="#" className='row'>
                                    <div className="formRow col-xl-3">
                                        <div className="formLabel">
                                            <label htmlFor="">Name</label>
                                        </div>
                                        <div className="col-12">
                                            <input
                                                type="text"
                                                name="extension"
                                                id=""
                                                className="formItem"
                                                defaultValue=""
                                                required="required"
                                            />
                                            <br />
                                            <label htmlFor="data" className="formItemDesc">
                                                Enter the extension name.
                                            </label>
                                        </div>
                                    </div>
                                    <div className="formRow col-xl-3">
                                        <div className="formLabel">
                                            <label htmlFor="data">Type</label>
                                        </div>
                                        <div className="col-12">
                                            <select className="formItem" name="" id="selectFormRow">
                                                <option >Select Form Row</option>
                                                <option value="param">param</option>
                                                <option value="variable">variable</option>
                                            </select>
                                            <br />
                                            <label htmlFor="data" className="formItemDesc">
                                                Enter the extension subcategory.
                                            </label>
                                        </div>
                                    </div>
                                    <div className="formRow col-xl-3">
                                        <div className="formLabel">
                                            <label htmlFor="">Value</label>
                                        </div>
                                        <div className="col-12">
                                            <input
                                                type="text"
                                                name="extension"
                                                id=""
                                                className="formItem"
                                                defaultValue=""
                                                required="required"
                                            />
                                            <br />
                                            <label htmlFor="data" className="formItemDesc">
                                                Enter the extension value.
                                            </label>
                                        </div>
                                    </div>
                                    <div className="formRow col-xl-3">
                                        <div className="formLabel">
                                            <label htmlFor="">Description</label>
                                        </div>
                                        <div className="col-12">
                                            <input
                                                type="text"
                                                name="extension"
                                                id=""
                                                className="formItem"
                                                defaultValue=""
                                                required="required"
                                            />
                                            <br />
                                            <label htmlFor="data" className="formItemDesc">
                                                Enter the extension description.
                                            </label>
                                        </div>
                                    </div>
                                    <div className="formRow col-xl-3">
                                        <div className="formLabel">
                                            <label htmlFor="selectFormRow">Enabled</label>
                                        </div>
                                        <div className="col-12">
                                            <div className="my-auto position-relative mx-1">
                                                <label className="switch">
                                                    <input type="checkbox" id="showAllCheck" />
                                                    <span className="slider round" />
                                                </label>
                                            </div>
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

export default ExtensionSettingsEdit