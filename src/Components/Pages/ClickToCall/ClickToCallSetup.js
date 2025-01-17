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
                            <Header title="Click to Call Setup" />
                            <div className='overviewTableWrapper'>
                                <div className='overviewTableChild'>
                                    <div className='d-flex flex-wrap'>
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4> Widget Configuration</h4>
                                                    <p>
                                                        Setup your widget by choosing apropriate configurations.
                                                    </p>
                                                </div>
                                                <div className="buttonGroup">
                                                    <button effect="ripple" className="panelButton gray">
                                                        <span className="text">Back</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-caret-left" />
                                                        </span>
                                                    </button>
                                                    <button type="button" className="panelButton">
                                                        <span className="text">Save</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-floppy-disk" />
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="wizard-form">
                                        <div className="tawk-margin-auto tawk-width-100">
                                            <div className="tawk-wizard-chat-form">
                                                <div className="tawk-flex tawk-flex-wrap tawk-flex-large-gap tawk-margin-xlarge-top">
                                                    <form className='tangoNavs'>
                                                        <nav>
                                                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                                <button
                                                                    className="nav-link active"
                                                                    id="nav-gen-tab"
                                                                    data-bs-toggle="tab"
                                                                    data-bs-target="#nav-gen"
                                                                    type="button"
                                                                    role="tab"
                                                                    aria-controls="nav-gen"
                                                                    aria-selected="true"
                                                                >
                                                                    General{" "}
                                                                </button>
                                                                <button
                                                                    className="nav-link"
                                                                    id="nav-options-tab"
                                                                    data-bs-toggle="tab"
                                                                    data-bs-target="#nav-options"
                                                                    type="button"
                                                                    role="tab"
                                                                    aria-controls="nav-options"
                                                                    aria-selected="false"
                                                                >
                                                                    Options
                                                                </button>
                                                            </div>
                                                        </nav>
                                                        <div className='row'>
                                                            <div className='col-8'>
                                                                <div class="tab-content" id="nav-tabContent">
                                                                    <div class="tab-pane fade show active" id="nav-gen" role="tabpanel" aria-labelledby="nav-gen-tab" tabindex="0">

                                                                        <form>
                                                                            <div className="formRow col-xl-12">
                                                                                <div className="formLabel">
                                                                                    <label htmlFor="">Company Logo</label>
                                                                                    <label htmlFor="data" className="formItemDesc">
                                                                                        Please enter your company name and logo.
                                                                                    </label>
                                                                                </div>
                                                                            
                                                                                <div className="col-6">
                                                                                   
                                                                                       
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
                                                                            <div className='formRow col-xl-12'>
                                                                                <div className="formLabel">
                                                                                    <label htmlFor="selectFormRow">Color Scheme</label>
                                                                                    <label htmlFor="data" className="formItemDesc">
                                                                                        Choose your color scheme
                                                                                    </label>
                                                                                </div>
                                                                                <div className="col-4 ms-auto pe-2">
                                                                                    <div className="d-flex align-items-center justify-content-start">
                                                                                        <div className="tawk-colors-active">
                                                                                            <div className="tawk-colors">
                                                                                                <span />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="tawk-colors-active ms-2">
                                                                                            <div className="tawk-colors-1">
                                                                                                <span />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="tawk-colors-active ms-2">
                                                                                            <div className="tawk-colors-2">
                                                                                                <span />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="tawk-colors-active ms-2">
                                                                                            <div className="tawk-colors-3">
                                                                                                <span />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="tawk-colors-active2 ms-2">
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
                                                                                <div className='col-2'>
                                                                                    <input className='formItem' value={`#`} />
                                                                                </div>
                                                                            </div>
                                                                            <div className='formRow col-xl-12'>
                                                                                <div className="formLabel">
                                                                                    <label htmlFor="selectFormRow">Company Name</label>
                                                                                    <label htmlFor="data" className="formItemDesc">
                                                                                        Enter your company name
                                                                                    </label>
                                                                                </div>
                                                                                <div className="col-6">
                                                                                    <input className='formItem' />
                                                                                </div>
                                                                            </div>
                                                                            <div className='formRow col-xl-12'>
                                                                                <div className="formLabel">
                                                                                    <label htmlFor="selectFormRow">Company Description</label>
                                                                                    <label htmlFor="data" className="formItemDesc">
                                                                                        Enter your company description
                                                                                    </label>
                                                                                </div>
                                                                                <div className="col-6">
                                                                                    <input className='formItem' />
                                                                                </div>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                    <div class="tab-pane fade" id="nav-options" role="tabpanel" aria-labelledby="nav-options-tab" tabindex="0">
                                                                        <form>
                                                                            <div className="formRow col-xl-12">
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
                                                                                        <option>Call Center</option>
                                                                                        <option>IVR</option>
                                                                                        <option>PSTN</option>
                                                                                    </select>

                                                                                    {/* {errors.did_id && (
                                                        <ErrorMessage text={errors.did_id.message} />
                                                    )} */}
                                                                                </div>
                                                                            </div>
                                                                            <div className="formRow col-xl-12">
                                                                                <div className="formLabel">
                                                                                    <label htmlFor="">Action</label>
                                                                                    <label htmlFor="data" className="formItemDesc">
                                                                                        Please choose the usage.
                                                                                    </label>
                                                                                </div>
                                                                                <div className="col-6">
                                                                                    <input className='formItem' />
                                                                                </div>
                                                                            </div>
                                                                            <div className="formRow col-xl-12 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
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
                                                            <div className='col-4'>
                                                                <div className="clickToCall clickToCall-preview">

                                                                    <div className="clickToCallModule">
                                                                        <div className="clickToCallHeader">
                                                                            <div className="wrapper">
                                                                                <button>
                                                                                    <i className="fa-solid fa-chevron-left" />
                                                                                </button>
                                                                                <div className="compLogo">
                                                                                    <img
                                                                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMsAAADRCAMAAABVaLb8AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAQ5QTFRFAAAA////////////////////////////////////////////////////////////////gMffg8bfgsfggsjhgsfhgsfggL/fg8jggMXfgsffgsjggcffgsfggsbfg8ffgsjg/zSA/zKA/zSA/zCA/zN//zN//zN//zCA/zWA/zN//zOAj8/0k8/zkc/zks/0k8/0ks/0j8/3j8/vks/0ks/0ks/0ks/0k8/1ks/0/zR/ks/0/zN/ks/z/zKAjcvth8rnkc7zjc3uisvqh8rmhcnkjs3vi8zriMrohsnlj87wg8jhkc/zkM7yjMzthMjjhMjjjMzticvpjc3sicvpkM7xisrojs3v/zN//zN/MlNIogAAAFp0Uk5TAEAwcM//3xCfv4Cv71BgjyAgUL+Pn/8QzzBg74DfcECvQHCAIJ/v/xAw31AwQIBgz78gEN//n+9Qj49wz69gj7/v///////////////////Pz+9g/++/77+vNeuqCwAADVxJREFUeJztnWlzE8kZx6fn0Mhjy7YAl7CLhNqETUwthIArqc3F50g+YfImX2Jra3mRwGZZCCTZDZVUrq2ETQzYsjRHZ+7p4+np7tFoZkTxf2GMENL81M/VT/e0kPH2CPV9AS3qHcsw9VayINznZbSigsXEbw8LMsNer6MNleNiBr1eRxsq/cUJNt7IKhaEFn1eSAsqWUbYuujzQlpQybIVGJsOU7J4vrHpMFWutI1Nh6lqGCf5ga0NDgAVy/Yy+emi171dy6qqWHbn2Z/exaYODVEn7+QMyN/QrEmw7J0Xv42c//VxLauKYNk/K391o3PguUMXORcbE6UyGr/q/FpWFclCDEws+2LT3IaaI+/RlrVpbkOxuA4TjjcrPtO9iwlbw7jzDZpuMn2YLPmTwuHGuA3DwllZLAtviKGx/THOyozNyTZcr28Pum7kbkLFyfctt8CGzCZkG57FFXT9rPHQsw3QTzY9ga8PPdtAvXHTEjzZjcIh04B9/mJaxmvQNPCahRhmyDSC9ZcamOFOB0RrSXUwQx0b4bpYLcwwacRrfPUwQ6SpWa8U5plcroWGlT3r1l5lMEOrBWrXkd1Q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"
                                                                                        alt=""
                                                                                    />
                                                                                </div>
                                                                                <div className="text">
                                                                                    <h5>AnglePBX</h5>
                                                                                    <p>Business Phone System | Cloud Contact Center | Cloud PBX</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="clickToCallBody">
                                                                            <div className="callByAudio">
                                                                                <button>
                                                                                    <i className="fa-solid fa-phone" />
                                                                                </button>
                                                                                <h5>
                                                                                    Arrange an <span>Audio Call</span> with our Agent
                                                                                </h5>
                                                                            </div>
                                                                            <div className="callByVideo">
                                                                                <button>
                                                                                    <i className="fa-solid fa-video" />
                                                                                </button>
                                                                                <h5>
                                                                                    Arrange a <span>Video Call</span> with our Agent
                                                                                </h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </form>
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