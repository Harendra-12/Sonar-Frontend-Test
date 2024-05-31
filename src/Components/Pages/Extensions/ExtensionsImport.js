import React from 'react'
import { useNavigate } from 'react-router-dom'
import { backToTop } from '../../GlobalFunction/globalFunction'

const ExtensionsImport = () => {
    const navigate = useNavigate()
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-12" id="subPageHeader">
                            <div className="row px-xl-3">
                                <div className="col-xl-6 my-auto">
                                    <h4 className="my-auto">Extension Import</h4>
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
                                            Continue
                                        </button>
                                    </div>
                                </div>
                                <div className="col-12 my-1">
                                    <p className="p-0 m-0">
                                        Upload delimited data to add multiple records.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-12" style={{ overflow: "auto" }}>
                            <div className="mx-2" id="detailsContent">
                                <form action="#" className="row">
                                    <div className="formRow ">
                                        <div className="formLabel">
                                            <label htmlFor="data">Data</label>
                                        </div>
                                        <div className="col-12">
                                            <textarea
                                                name="data"
                                                id="data"
                                                rows={5}
                                                className="formTextArea"
                                                defaultValue={""}
                                            />
                                            <br />
                                            <label htmlFor="data" className="formItemDesc">
                                                Copy and paste the comma delimitted data into the text area
                                                to begin the import.
                                            </label>
                                        </div>
                                    </div>
                                    <div className="formRow col-xl-3">
                                        <div className="formLabel">
                                            <label htmlFor="selectFormRow">Form Row</label>
                                        </div>
                                        <div className="col-12">
                                            <select className="formItem" name="" id="selectFormRow">
                                                <option >Select Form Row</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                                <option value={4}>4</option>
                                            </select>
                                            <br />
                                            <label htmlFor="data" className="formItemDesc">
                                                Start importing the data from this row.
                                            </label>
                                        </div>
                                    </div>
                                    <div className="formRow col-xl-3">
                                        <div className="formLabel">
                                            <label htmlFor="selectFormRow">Delimiter</label>
                                        </div>
                                        <div className="col-12">
                                            <select className="formItem" name="" id="selectFormRow">
                                                <option >Select Delimiter</option>
                                                <option value=",">,</option>
                                                <option value="|">|</option>
                                            </select>
                                            <br />
                                            <label htmlFor="data" className="formItemDesc">
                                                Select the delimiter (comma or pipe).
                                            </label>
                                        </div>
                                    </div>
                                    <div className="formRow col-xl-3">
                                        <div className="formLabel">
                                            <label htmlFor="selectFormRow">Enclosure</label>
                                        </div>
                                        <div className="col-12">
                                            <select className="formItem" name="" id="selectFormRow">
                                                <option >Select Enclosure</option>
                                                <option value='"'>"</option>
                                                <option value=" "> </option>
                                            </select>
                                            <br />
                                            <label htmlFor="data" className="formItemDesc">
                                                Select the enclosure of text (double-quotes or nothing).
                                            </label>
                                        </div>
                                    </div>
                                    <div className="formRow col-xl-3">
                                        <div className="formLabel">
                                            <label htmlFor="selectFormRow">File to Upload</label>
                                        </div>
                                        <div className="col-12">
                                            <input
                                                type="file"
                                                id="ulfile"
                                                name="filename"
                                                className="fileUpload"
                                            />
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

export default ExtensionsImport