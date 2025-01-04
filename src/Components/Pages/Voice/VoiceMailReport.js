import React from 'react'
import Header from '../../CommonComponents/Header'
import { backToTop } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';
import PaginationComponent from '../../CommonComponents/PaginationComponent';

function VoiceMailReport() {
    const navigate = useNavigate()
    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid px-0 position-relative">
                        <Header title="Voicemail Reports" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>CDR Reports</h4>
                                                <p>Here are all the CDR Reports</p>
                                            </div>
                                            <div className="buttonGroup">
                                                <button
                                                    effect="ripple"
                                                    className="panelButton gray"
                                                    onClick={() => {
                                                        navigate(-1);
                                                        backToTop();
                                                    }}
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
                                                    <span className="text">Refresh</span>
                                                    <span className="icon">
                                                        <i className={"fa-regular fa-arrows-rotate fs-5"}></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-12"
                                        style={{ overflow: "auto", padding: "25px 20px 0" }}
                                    >
                                        <div className="tableHeader">
                                            <div className="showEntries">
                                                <label>Show</label>
                                                <select
                                                    className="formItem"
                                                >
                                                    <option value={20}>20</option>
                                                    <option value={30}>30</option>
                                                    <option value={40}>40</option>
                                                    <option value={50}>50</option>
                                                    <option value={60}>60</option>
                                                    <option value={70}>70</option>
                                                    <option value={80}>80</option>
                                                </select>
                                                <label>entries</label>
                                            </div>
                                        </div>
                                        <div className="tableContainer">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Source</th>
                                                        <th>Destination</th>
                                                        <th>Recording Path</th>
                                                        <th>Recording</th>
                                                        <th>Duration</th>
                                                        <th>Created At</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <>
                                                        <tr className="cdrTableRow">
                                                            <td>1.</td>
                                                            <td>1000</td>
                                                            <td>1001</td>
                                                            <td>www.voicemailrecordingpath.com</td>
                                                            <td>
                                                                <button
                                                                    className="tableButton px-2 mx-0"
                                                                // onClick={() =>
                                                                //     handlePlaying(
                                                                //         item["recording_path"]
                                                                //     )
                                                                // }
                                                                >
                                                                    <i className="fa-duotone fa-play"></i>
                                                                </button>
                                                            </td>
                                                            <td>00:00:00</td>
                                                            <td>2025-11-10</td>
                                                        </tr>
                                                        {true && (
                                                            <tr>
                                                                <td colSpan={99}>
                                                                    <div className="audio-container mx-2">
                                                                        <audio
                                                                            controls={true}
                                                                            // ref={thisAudioRef}
                                                                            autoPlay={true}
                                                                        // onEnded={() => {
                                                                        //     setCurrentPlaying(null);
                                                                        // }}
                                                                        >
                                                                            <source
                                                                                src={""}
                                                                                type="audio/mpeg"
                                                                            />
                                                                        </audio>

                                                                        <button className="audioCustomButton">
                                                                            <i className="fa-sharp fa-solid fa-download" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </>


                                                    {/* {!loading && cdr && cdr.data.length === 0 ? (
                                                        <td colSpan={99}>
                                                            <EmptyPrompt name="Call" link="dashboard" />
                                                        </td>
                                                    ) : (
                                                        ""
                                                    )} */}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="tableHeader mb-3">
                                            <PaginationComponent
                                            // pageNumber={(e) => setPageNumber(e)}
                                            // totalPage={cdr.last_page}
                                            // from={(pageNumber - 1) * cdr.per_page + 1}
                                            // to={cdr.to}
                                            // total={cdr.total}
                                            // defaultPage={pageNumber}
                                            />

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

export default VoiceMailReport