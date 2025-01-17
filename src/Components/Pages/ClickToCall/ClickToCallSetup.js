import React from 'react'
import Header from '../../CommonComponents/Header'
import CircularLoader from '../../Loader/CircularLoader'
import { backToTop } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';


function ClickToCallSetup() {
    const navigate = useNavigate()
    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className='row'>
                            <Header title="Click to Call" />
                            <div class="tawk-flex tawk-flex-column tawk-flex-middle tawk-padding-medium-vertical"
                                id="tawk-onboarding-wizard-form">
                                <div class=" wizard-form">
                                    <div className="tawk-margin-auto tawk-width-100" style={{ maxWidth: 800 }}>
                                        <div className="tawk-wizard-chat-form">
                                            <div className="tawk-text-left tawk-text-bold-4">
                                                Customize your audio and video chat
                                            </div>
                                            <div className="tawk-text-regular">(you can change this later)</div>
                                            <div className="tawk-flex tawk-flex-wrap tawk-flex-large-gap tawk-margin-xlarge-top">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="">
                                                            <p className="tawk-text-bold-5">Ucaas</p>
                                                        </div>
                                                        <div>
                                                            <label htmlFor="colorPicker" className="tawk-text-bold-5 mt-2 mb-2">
                                                                Color scheme and avatar{" "}
                                                            </label>
                                                            <div className="d-flex align-items-center justify-content-start">
                                                                <div className="tawk-colors-active">
                                                                    <div className="tawk-colors">
                                                                        <span />
                                                                    </div>
                                                                </div>
                                                                <div className="tawk-colors-active ms-3">
                                                                    <div className="tawk-colors-1">
                                                                        <span />
                                                                    </div>
                                                                </div>
                                                                <div className="tawk-colors-active ms-3">
                                                                    <div className="tawk-colors-2">
                                                                        <span />
                                                                    </div>
                                                                </div>
                                                                <div className="tawk-colors-active ms-3">
                                                                    <div className="tawk-colors-3">
                                                                        <span />
                                                                    </div>
                                                                </div>
                                                                <div className="tawk-colors-active2 ms-3">
                                                                    <div className="tawk-colors-active  dropdown">
                                                                        <div className="tawk-colors-4">
                                                                            <div>
                                                                                <div className="dropdown-content">
                                                                                    <div className="palette-container">
                                                                                        <div className="palette-grid">
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#f79999" }}
                                                                                                data-color="#f79999"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#ffd39e" }}
                                                                                                data-color="#ffd39e"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#f9fcaf" }}
                                                                                                data-color="#f9fcaf"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#c5ffb9" }}
                                                                                                data-color="#c5ffb9"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#95f5fd" }}
                                                                                                data-color="#95f5fd"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#9cc2ff" }}
                                                                                                data-color="#9cc2ff"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#b9adff" }}
                                                                                                data-color="#bdb2ff"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#ffc6ff" }}
                                                                                                data-color="#ffc6ff"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#fffffc" }}
                                                                                                data-color="#fffffc"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#f8edeb" }}
                                                                                                data-color="#f8edeb"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#ffccd5" }}
                                                                                                data-color="#ffccd5"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#d4a5a5" }}
                                                                                                data-color="#d4a5a5"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#adb5bd" }}
                                                                                                data-color="#adb5bd"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#f81e1e" }}
                                                                                                data-color="#f81e1e"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#6df74a" }}
                                                                                                data-color="#6df74a"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#31ddfc" }}
                                                                                                data-color="#31ddfc"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#435be7" }}
                                                                                                data-color="#435be7"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#a48fff" }}
                                                                                                data-color="#a48fff"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#bb2ffc" }}
                                                                                                data-color="#bb2ffc"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#fd39b2" }}
                                                                                                data-color="#fd39b2"
                                                                                            />
                                                                                            <div
                                                                                                className="color-circle"
                                                                                                style={{ background: "#f1f500" }}
                                                                                                data-color="#f1f500"
                                                                                            />
                                                                                        </div>
                                                                                        <div className="selected-color">
                                                                                            <div
                                                                                                id="selectedColorPreview"
                                                                                                style={{ background: "#ffffff" }}
                                                                                            ></div>
                                                                                            <span className="icon" id="pickerIcon">
                                                                                                🎨
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="d-flex align-items-center justify-content-start mt-3">
                                                                <div className="input-container ">
                                                                    <input type="text" id="nameInput" placeholder=" " required="" />
                                                                    <label htmlFor="nameInput" className="label">
                                                                        Your Name
                                                                    </label>
                                                                </div>
                                                                <div className=" trans">
                                                                    <i className="fa-solid fa-trash-can" />
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-start mt-3">
                                                                <div className="input-container ">
                                                                    <input type="text" id="nameInput" placeholder=" " required="" />
                                                                    <label htmlFor="nameInput" className="label">
                                                                        Number
                                                                    </label>
                                                                </div>
                                                                <div className=" trans">
                                                                    <i className="fa-solid fa-trash-can" />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div>
                                                                    <p className="tawk-text-bold-5  mt-2 mb-2"> Description</p>
                                                                </div>
                                                                <div className="tawk-textarrea-field">
                                                                    <textarea
                                                                        className="tawk-textarea tawk-flex-1"
                                                                        id="input"
                                                                        name="input"
                                                                        placeholder="Enter Trigger Message"
                                                                        rows={2}
                                                                        style={{ height: 60 }}
                                                                        defaultValue={""}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="addmsg mt-5">
                                                                <p className="m-0 p-0"> Add Message </p>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {false && <div className="col-xl-12" style={{ overflow: "auto" }}>
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
                    </div>}
                </section>
            </main>
        </>
    )
}

export default ClickToCallSetup