import React from 'react'
import Header from '../../CommonComponents/Header'
import CircularLoader from '../../Loader/CircularLoader'
import { backToTop } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';
import ConferenceLoader from '../../Loader/ConferenceLoader';

function ClickToCallSetup() {
    const navigate = useNavigate()
    return (
        <>
            <ConferenceLoader />
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid px-0">
                        <Header title="Click to Call" />
                    </div>
                    <div className="col-xl-12" style={{ overflow: "auto" }}>
                        {/* {loading ? (
                            <div colSpan={99}>
                                <CircularLoader />
                            </div>
                        ) : (
                            ""
                        )} */}
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Click to Call Setup</h4>
                                                <p>
                                                    Setup your click to call widget in realtime.
                                                </p>
                                            </div>
                                            <div className="buttonGroup">
                                                <button
                                                    onClick={() => {
                                                        navigate(-1);
                                                        backToTop();
                                                    }}
                                                    type="button"
                                                    effect="ripple"
                                                    className="panelButton gray"
                                                >
                                                    <span className="text">Back</span>
                                                    <span className="icon">
                                                        <i class="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>
                                                <button
                                                    effect="ripple"
                                                    className="panelButton"

                                                >
                                                    <span className="text">Save</span>
                                                    <span className="icon">
                                                        <i class="fa-solid fa-floppy-disk"></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-12"
                                        style={{
                                            padding: "25px 23px",
                                        }}
                                    >
                                        <form>
                                            <div className="formRow col-xl-3">
                                                <div className="formLabel">
                                                    <label htmlFor="">Company Info</label>
                                                    <label htmlFor="data" className="formItemDesc">
                                                        Please enter your company name and logo.
                                                    </label>
                                                </div>
                                                <div className="col-3 pe-2 ms-auto">
                                                    <div className="formLabel"><label>Name</label></div>
                                                    <input
                                                        type="text"
                                                        name="did_id_view"
                                                        className="formItem"
                                                    />

                                                    {/* {errors.did_id && (
                                                        <ErrorMessage text={errors.did_id.message} />
                                                    )} */}
                                                </div>
                                                <div className="col-3">
                                                    <div className="formLabel"><label>Logo</label></div>
                                                    <input
                                                        type="file"
                                                        name="did_id_view"
                                                        className="formItem"
                                                    />

                                                    {/* {errors.did_id && (
                                                        <ErrorMessage text={errors.did_id.message} />
                                                    )} */}
                                                </div>
                                            </div>
                                            <div className="formRow col-xl-3">
                                                <div className="formLabel">
                                                    <label htmlFor="">Company Description</label>
                                                    <label htmlFor="data" className="formItemDesc">
                                                        Please enter your company Description.
                                                    </label>
                                                </div>
                                                <div className="col-6">
                                                    <input
                                                        type="text"
                                                        name="did_id_view"
                                                        className="formItem"
                                                    />

                                                    {/* {errors.did_id && (
                                                        <ErrorMessage text={errors.did_id.message} />
                                                    )} */}
                                                </div>
                                            </div>
                                            <div className="formRow col-xl-3">
                                                <div className="formLabel">
                                                    <label htmlFor="">Color Combination</label>
                                                    <label htmlFor="data" className="formItemDesc">
                                                        Please choose your color combination.
                                                    </label>
                                                </div>
                                                <div className="col-3 pe-2 ms-auto">
                                                    <div className="formLabel"><label>Primary Color</label></div>
                                                    <input
                                                        type="color"
                                                        name="did_id_view"
                                                        className="formItem"
                                                    />

                                                    {/* {errors.did_id && (
                                                        <ErrorMessage text={errors.did_id.message} />
                                                    )} */}
                                                </div>
                                                <div className="col-3">
                                                    <div className="formLabel"><label>Text Color</label></div>
                                                    <input
                                                        type="color"
                                                        name="did_id_view"
                                                        className="formItem"
                                                    />

                                                    {/* {errors.did_id && (
                                                        <ErrorMessage text={errors.did_id.message} />
                                                    )} */}
                                                </div>
                                            </div>
                                            <div className="formRow col-xl-3">
                                                <div className="formLabel">
                                                    <label htmlFor="">Usage</label>
                                                    <label htmlFor="data" className="formItemDesc">
                                                        Please choose the usage.
                                                    </label>
                                                </div>
                                                <div className="col-6">
                                                    <select
                                                        type="text"
                                                        name="did_id_view"
                                                        className="formItem"
                                                    >
                                                        <option>Choose Usage</option>
                                                        <option>Extensions</option>
                                                        <option>Ring Group</option>
                                                        <option>Call Center Queue</option>
                                                    </select>

                                                    {/* {errors.did_id && (
                                                        <ErrorMessage text={errors.did_id.message} />
                                                    )} */}
                                                </div>
                                            </div>
                                            <div className="formRow col-xl-3 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                                                <div className="formLabel">
                                                    <label htmlFor="">Copy embeded code</label>
                                                    <label htmlFor="data" className="formItemDesc">
                                                        Copy this code and drop it in your website (above closing body tag) to install click to call widget.
                                                    </label>
                                                </div>
                                                <div className="col-6">
                                                    <textarea
                                                        type="text"
                                                        name="did_id_view"
                                                        className="formItem h-auto"
                                                        rows={3}
                                                    />

                                                    {/* {errors.did_id && (
                                                        <ErrorMessage text={errors.did_id.message} />
                                                    )} */}
                                                </div>
                                            </div>
                                        </form>
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

export default ClickToCallSetup