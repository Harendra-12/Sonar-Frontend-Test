import React from 'react'
import CircularLoader from '../../Loader/CircularLoader'
import { useNavigate } from 'react-router-dom';
import { backToTop } from '../../GlobalFunction/globalFunction';
import Header from '../../CommonComponents/Header';
import PaginationComponent from '../../CommonComponents/PaginationComponent';

function CallBlockingAdd() {
    const navigate = useNavigate();
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid px-0">
                    <Header title="Call Blocking" />
                </div>
                <div className="col-xl-12">
                    {/* {loading && loadings && (
                        <div colSpan={99}>
                            <CircularLoader />
                        </div>
                    )} */}
                    <div className="overviewTableWrapper">
                        <div className="overviewTableChild">
                            <div className="d-flex flex-wrap">
                                <div className="col-12">
                                    <div className="heading">
                                        <div className="content">
                                            <h4>Call Blocking Advance</h4>
                                            <p>Configure call blocking</p>
                                        </div>
                                        <div className="buttonGroup">
                                            <div className="d-flex align-items-center">
                                                <div className="formLabel py-0 me-2">
                                                    <label htmlFor="selectFormRow">Enabled</label>
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
                                            </div>
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
                                                <span className="icon"><i class="fa-solid fa-caret-left"></i></span>
                                            </button>
                                            <button
                                                effect="ripple"
                                                className="panelButton"
                                            >
                                                <span className="text">Save</span>
                                                <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12" style={{ padding: '25px 23px', borderBottom: '1px solid #ddd' }}>
                                <form className="row col-12 mx-auto mb-0">
                                    <div className="formRow col-xl-3">
                                        <div className="formLabel">
                                            <label htmlFor="">Direction</label>
                                            <label htmlFor="data" className="formItemDesc">
                                                Select the direction of the calls to block
                                            </label>
                                        </div>
                                        <div className="col-xl-6 col-12">
                                            <select
                                                type="text"
                                                name="extension"
                                                className="formItem"
                                            >
                                                <option>Inbound</option>
                                            </select>
                                            {/* {errors.queue_name && (
                                                <ErrorMessage text={errors.queue_name.message} />
                                            )} */}
                                        </div>
                                    </div>
                                    <div className="formRow col-xl-3">
                                        <div className="formLabel">
                                            <label htmlFor="">Extension</label>
                                            <label htmlFor="data" className="formItemDesc">
                                                Select the extension to be affected.
                                            </label>
                                        </div>
                                        <div className="col-xl-6 col-12">
                                            <select
                                                type="text"
                                                name="extension"
                                                className="formItem"
                                            >
                                                <option>All</option>
                                            </select>
                                            {/* {errors.queue_name && (
                                                <ErrorMessage text={errors.queue_name.message} />
                                            )} */}
                                        </div>
                                    </div>
                                    <div className="formRow col-xl-3">
                                        <div className="formLabel">
                                            <label htmlFor="">Name</label>
                                            <label htmlFor="data" className="formItemDesc">
                                                Enter the Caller ID name to block
                                            </label>
                                        </div>
                                        <div className="col-xl-6 col-12">
                                            <input
                                                type="text"
                                                name="extension"
                                                className="formItem"
                                            />
                                            {/* {errors.queue_name && (
                                                <ErrorMessage text={errors.queue_name.message} />
                                            )} */}
                                        </div>
                                    </div>
                                    <div className="formRow col-xl-3">
                                        <div className="formLabel">
                                            <label htmlFor="">Action</label>
                                            <label htmlFor="data" className="formItemDesc">
                                                Set an action for calls from this number
                                            </label>
                                        </div>
                                        <div className="col-xl-6 col-12">
                                            <select
                                                type="text"
                                                name="extension"
                                                className="formItem"
                                            >
                                                <option>Reject</option>
                                                <option>Hold</option>
                                                <option>Busy</option>
                                                <option>Voicemail</option>
                                            </select>
                                            {/* {errors.queue_name && (
                                                <ErrorMessage text={errors.queue_name.message} />
                                            )} */}
                                        </div>
                                    </div>
                                    <div className="formRow col-xl-3">
                                        <div className="formLabel">
                                            <label htmlFor="">Description</label>
                                            <label htmlFor="data" className="formItemDesc">
                                                Enter the description
                                            </label>
                                        </div>
                                        <div className="col-xl-6 col-12">
                                            <input
                                                type="text"
                                                name="extension"
                                                className="formItem"
                                            />
                                            {/* {errors.queue_name && (
                                                <ErrorMessage text={errors.queue_name.message} />
                                            )} */}
                                        </div>
                                    </div>
                                    <div className="formRow col-xl-3">
                                        <div className="formLabel">
                                            <label htmlFor="">DID</label>
                                            <label htmlFor="data" className="formItemDesc">
                                                Enter the DID.
                                            </label>
                                        </div>
                                        <div className="col-xl-6 col-12">
                                            <input
                                                type="text"
                                                name="extension"
                                                className="formItem"
                                            />
                                            {/* {errors.queue_name && (
                                                <ErrorMessage text={errors.queue_name.message} />
                                            )} */}
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="col-12" style={{ padding: '20px 23px' }}>
                                <div className="tableHeader">
                                    <div className="showEntries">
                                        <label>Show</label>
                                        <select
                                            className="formItem"
                                            style={{ width: 'max-content' }}
                                        >
                                            <option value={10}>Outbound</option>
                                            <option value={20}>20</option>
                                            <option value={30}>30</option>
                                        </select>
                                    </div>
                                    <div className="showEntries">
                                        <select
                                            className="formItem"
                                            style={{ width: 'max-content' }}
                                        >
                                            <option value={10}>All</option>
                                            <option value={20}>20</option>
                                            <option value={30}>30</option>
                                        </select>
                                        <select
                                            className="formItem"
                                            style={{ width: 'max-content' }}
                                        >
                                            <option value={10}>Reject</option>
                                            <option value={20}>20</option>
                                            <option value={30}>30</option>
                                        </select>
                                        <button
                                            effect="ripple"
                                            className="panelButton delete ms-0"
                                            style={{ height: '34px' }}
                                        >
                                            <span className="text">Block</span>
                                            <span className="icon"><i class="fa-solid fa-ban"></i></span>
                                        </button>
                                    </div>
                                </div>
                                <div className="tableContainer">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Number</th>
                                                <th>Destination</th>
                                                <th>Called</th>
                                                <th>Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Queue Name</td>
                                                <td>Extension</td>
                                                <td>Strategy</td>
                                                <td>Timeout Action</td>
                                                <td>Prefix</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="tableHeader mb-3">
                                    <PaginationComponent
                                    // pageNumber={(e) => setPageNumber(e)}
                                    // totalPage={callCenter.totalPage}
                                    // from={callCenter.from}
                                    // to={callCenter.to}
                                    // total={callCenter.total}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default CallBlockingAdd