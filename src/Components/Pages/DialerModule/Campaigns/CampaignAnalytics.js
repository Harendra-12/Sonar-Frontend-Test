import React from 'react'
import Header from '../../../CommonComponents/Header'
import { backToTop } from '../../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';
function CampaignAnalytics() {
    const navigate = useNavigate();
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Campaigns" />

                        <div className="col-xl-3 mb-3 mt-3 mb-xl-0" style={{ cursor: "pointer" }}>
                            <div className="itemWrapper a">
                                <div className="heading">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                                        <div className="col-10">
                                            <h5>Online</h5>

                                        </div>
                                        <div className="col-2">
                                            <i className="fa-solid fa-user-plus"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="data-number2">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                                        <div className="col-10">
                                            <h5>0</h5>

                                        </div>
                                        <div className="col-2">
                                            <div className='online-cls'>
                                                <i className="fa-solid fa-arrow-trend-up"></i>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 mb-3 mt-3  mb-xl-0" style={{ cursor: "pointer" }}>
                            <div className="itemWrapper a">
                                <div className="heading">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                                        <div className="col-10">
                                            <h5>Talking</h5>

                                        </div>
                                        <div className="col-2">
                                            <i className="fa-solid fa-phone-volume"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="data-number2">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                                        <div className="col-10">
                                            <h5>0</h5>

                                        </div>
                                        <div className="col-2">
                                            <div className='online-cls'>
                                                <i className="fa-solid fa-arrow-trend-up"></i>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 mb-3 mt-3  mb-xl-0" style={{ cursor: "pointer" }}>
                            <div className="itemWrapper a">
                                <div className="heading">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                                        <div className="col-10">
                                            <h5>Waiting</h5>

                                        </div>
                                        <div className="col-2">
                                            <i className="fa-solid fa-stopwatch"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="data-number2">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                                        <div className="col-10">
                                            <h5>0</h5>

                                        </div>
                                        <div className="col-2">
                                            <div className='online-cls'>
                                                <i className="fa-solid fa-arrow-trend-up"></i>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 mb-3 mt-3 mb-xl-0" style={{ cursor: "pointer" }}>
                            <div className="itemWrapper a">
                                <div className="heading">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                                        <div className="col-10">
                                            <h5>Paused</h5>

                                        </div>
                                        <div className="col-2">
                                            <i className="fa-solid fa-pause"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="data-number2">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                                        <div className="col-10">
                                            <h5>0</h5>

                                        </div>
                                        <div className="col-2">
                                            <div className='online-cls'>
                                                <i className="fa-solid fa-arrow-trend-up"></i>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="col-sm-2 mt-2 col-md-2" style={{ cursor: "pointer" }}>
                            <div className="itemWrapper a">
                                <div className="heading">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                                        <div className="col-10">
                                            <h5>Online</h5>

                                        </div>
                                        <div className="col-2">
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="data-number2">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                                        <div className="col-10">
                                            <h5>0</h5>

                                        </div>
                                        <div className="col-2">
                                            <div className='online-cls-red'>
                                                <i className="fa-solid fa-arrow-trend-up"></i>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}


                    </div>


                    <div className="row">

                        <div className="overviewTableWrapper p-3">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                            <h4>Campaign Analytics </h4>
                                            </div>
                                            <div className="buttonGroup">
                                                {/* <div className='d-flex align-items-center'>
                                                    <div className="formLabel py-0 me-2">
                                                        <label for="selectFormRow">Enabled</label>
                                                    </div>
                                                    <div className="my-auto position-relative mx-1">
                                                        <label className="switch">
                                                            <input
                                                                type="checkbox"
                                                                id="showAllCheck"
                                                            />
                                                            <span className="slider round" />
                                                        </label>
                                                    </div>
                                                </div> */}
                                                <button
                                                    effect="ripple"
                                                    className="panelButton gray"
                                                    onClick={() => {
                                                        navigate(-1);
                                                        backToTop();
                                                    }}
                                                >
                                                    <span className="text">COPY</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-copy"></i>
                                                    </span>
                                                </button>
                                                <button
                                                    effect="ripple"
                                                    className="panelButton gray"
                                                    onClick={() => {
                                                        navigate(-1);
                                                        backToTop();
                                                    }}
                                                >
                                                    <span className="text">CSV</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-cloud-arrow-down"></i>
                                                    </span>
                                                </button>
                                                <button
                                                    effect="ripple"
                                                    className="panelButton gray"
                                                    onClick={() => {
                                                        navigate(-1);
                                                        backToTop();
                                                    }}
                                                >
                                                    <span className="text">EXCEL</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-sheet-plastic"></i>
                                                    </span>
                                                </button>
                                                <button
                                                    effect="ripple"
                                                    className="panelButton gray"
                                                    onClick={() => {
                                                        navigate(-1);
                                                        backToTop();
                                                    }}
                                                >
                                                    <span className="text">PDF</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-file-pdf"></i>
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="panelButton"
                                                >
                                                    <span className="text">PRINT</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-print"></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12" style={{ padding: '20px 22px' }}>
                                        <div className="content">
                                           
                                        </div>
                                        <div className="row ">
                                            <div className="col-xl-7 "
                                                style={{ borderRight: "1px solid var(--border-color)" }} >
                                                <div className="content">

                                                    {/* <p>Summary Sales Made Today</p> */}
                                                </div>
                                                <div className="buttonGroup">

                                                </div>

                                                <div className="tableContainer">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>Agent Name</th>
                                                                <th>Phone</th>
                                                                <th>Time Sales Made</th>
                                                                <th>Notes</th>
                                                                <th>Start Date</th>

                                                                <th style={{ textAlign: 'center' }}>Edit</th>
                                                                <th style={{ textAlign: 'center' }}>Delete</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>78</td>
                                                                <td>xyz</td>
                                                                <td>56465
                                                                </td>
                                                                <td>
                                                                    hsadfsjhk
                                                                </td>
                                                                <td>
                                                                    24/10/2000
                                                                </td>

                                                                <td>
                                                                    <button
                                                                        className="tableButton edit mx-auto"
                                                                    >
                                                                        <i className="fa-solid fa-pen"></i>
                                                                    </button>
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className="tableButton delete mx-auto"
                                                                    >
                                                                        <i className="fa-solid fa-trash"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="col-xl-5 "
                                                style={{ borderRight: "0px solid var(--border-color)" }} >

                                                <div className="content">
                                                    <h4>Today Statices</h4>

                                                    <p>Summary of your campaign performance</p>
                                                </div>


                                                <div className='mt-3'>
                                                    <label>
                                                        Connect Rate %
                                                    </label>
                                                    <div
                                                        className="progress"
                                                        role="progressbar"
                                                        aria-label="Animated striped example"
                                                        aria-valuenow={75}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    >
                                                        <div
                                                            className="progress-bar progress-bar-striped progress-bar-animated"
                                                            style={{ width: "75%" }}
                                                        />
                                                    </div>

                                                </div>

                                                <div className='mt-3'>
                                                    <label>
                                                        DMC Rate %
                                                    </label>
                                                    <div
                                                        className="progress"
                                                        role="progressbar"
                                                        aria-label="Animated striped example"
                                                        aria-valuenow={75}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    >
                                                        <div
                                                            className="progress-bar progress-bar-striped progress-bar-animated"
                                                            style={{ width: "75%" }}
                                                        />
                                                    </div>

                                                </div>

                                                <div className='mt-3'>
                                                    <label>
                                                        Drop Rate %
                                                    </label>
                                                    <div
                                                        className="progress"
                                                        role="progressbar"
                                                        aria-label="Animated striped example"
                                                        aria-valuenow={75}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    >
                                                        <div
                                                            className="progress-bar progress-bar-striped progress-bar-animated"
                                                            style={{ width: "75%" }}
                                                        />
                                                    </div>

                                                </div>

                                                <div className='mt-3'>
                                                    <label>
                                                        Sales Conversion Rate %
                                                    </label>
                                                    <div
                                                        className="progress"
                                                        role="progressbar"
                                                        aria-label="Animated striped example"
                                                        aria-valuenow={75}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    >
                                                        <div
                                                            className="progress-bar progress-bar-striped progress-bar-animated"
                                                            style={{ width: "75%" }}
                                                        />
                                                    </div>

                                                </div>

                                                <div className='mt-3'>
                                                    <label>
                                                        No Answer %
                                                    </label>
                                                    <div
                                                        className="progress"
                                                        role="progressbar"
                                                        aria-label="Animated striped example"
                                                        aria-valuenow={75}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    >
                                                        <div
                                                            className="progress-bar progress-bar-striped progress-bar-animated"
                                                            style={{ width: "75%" }}
                                                        />
                                                    </div>

                                                </div>

                                                <div className='mt-3'>
                                                    <label>
                                                        Answering Machine %
                                                    </label>
                                                    <div
                                                        className="progress"
                                                        role="progressbar"
                                                        aria-label="Animated striped example"
                                                        aria-valuenow={75}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    >
                                                        <div
                                                            className="progress-bar progress-bar-striped progress-bar-animated"
                                                            style={{ width: "75%" }}
                                                        />
                                                    </div>

                                                </div>

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
    )
}

export default CampaignAnalytics