import React, { useState } from 'react'
import Header from '../../CommonComponents/Header';
import Select from 'react-select';
import { requiredValidator } from '../../validations/validation';

const AiBatchCall = () => {
    const [refreshState, setRefreshState] = useState(false)
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRtl, setIsRtl] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");


    const handleRefreshBtnClicked = () => {
        setRefreshState(true)
        // const shouldLoad = false
        // getData(shouldLoad);
    }

    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Agents" />
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>Batch Call {" "}
                                                        <button
                                                            className="clearButton"
                                                            onClick={handleRefreshBtnClicked}
                                                            disabled={refreshState}
                                                        >
                                                            <i
                                                                className={
                                                                    refreshState
                                                                        ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                                                        : "fa-regular fa-arrows-rotate fs-5"
                                                                }
                                                            ></i>
                                                        </button>
                                                    </h4>
                                                    <p>You can manage yours agents here</p>
                                                </div>
                                                <div className="buttonGroup">
                                                    <button effect="ripple" className="panelButton xlWidth " data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                        <span className="text">Create a batch call</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-plus"></i>
                                                        </span>
                                                    </button>
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

            <div class="offcanvas offcanvas-end batchCallCanvas" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div class="offcanvas-header">
                    <button type="button" class="aitable_button bg-transparent" data-bs-dismiss="offcanvas" aria-label="Close">
                        <i class="fa-solid fa-angle-left"></i>
                    </button>
                    <div>
                        <h5 class="offcanvas-title" id="offcanvasRightLabel">Create a batch call</h5>
                        <p className='f-s-14 mb-0' style={{ color: 'var(--color-subtext)' }}>Batch call cost $0.005 per dial</p>
                    </div>
                </div>
                <div class="offcanvas-body">
                    <div className='right_body'>
                        SofiaAddSetting
                    </div>
                    <div className='left_body'>
                        <div className="formRow flex-column align-items-start">
                            <div className="formLabel">
                                <label> Batch Call Name</label>
                            </div>
                            <div className="col-12">
                                <input
                                    type="text"
                                    className="formItem"
                                    placeholder='Enter a name for your knowledge base'
                                />
                            </div>
                        </div>
                        <div className="formRow flex-column align-items-start">
                            <div className="formLabel">
                                <label> From number</label>
                            </div>
                            <div className="col-12">
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    // defaultValue={colourOptions[0]}
                                    isDisabled={isDisabled}
                                    isLoading={isLoading}
                                    isClearable={isClearable}
                                    isRtl={isRtl}
                                    isSearchable={isSearchable}
                                    name="color"
                                // options={colourOptions}
                                />
                            </div>
                        </div>
                        <div className="formRow flex-column align-items-start">
                            <div className="formLabel">
                                <label> Upload Recipients</label>
                            </div>
                            <div className="col-12">
                                <button type="button" class="aitable_button bg-transparent py-1 px-2" data-bs-dismiss="offcanvas" aria-label="Close"><i class="fa-regular fa-arrow-down-to-line me-2"></i> Download the template</button>
                            </div>
                        </div>
                        <div className="formRow flex-column align-items-start">
                            <div className="col-12">
                                <div className="popup-border text-center p-2">
                                    <input
                                        type="file"
                                        className="form-control-file d-none"
                                        id="fileInput"
                                        accept=".csv"
                                    />
                                    <label
                                        htmlFor="fileInput"
                                        className="d-block"
                                    >
                                        <div className="test-user text-center">
                                            <i
                                                className="fa-solid fa-cloud-arrow-up"
                                                style={{ fontSize: 30 }}
                                            />
                                            <p className="mb-0 mt-2 text-center">
                                                Choose a csv or drag & drop it here.
                                            </p>
                                            <span className='text2'>
                                                Up to 50 MB
                                            </span>
                                        </div>
                                    </label>

                                </div>
                            </div>
                        </div>
                        <div className="formLabel">
                            <label> When to send the calls</label>
                        </div>
                        <div className='row radio-input'>
                            <div className='col-6'>
                                <label class="label radioLabel">
                                    <p class="text">Send Now</p>
                                    <input type="radio" id="value-2" name="value-radio" value="value-2" />
                                </label>
                            </div>
                            <div className='col-6'>
                                <label class="label radioLabel">
                                    <p class="text">Schedule</p>
                                    <input type="radio" id="value-2" name="value-radio" value="schedule"
                                        onChange={(e) => setSelectedOption(e.target.value)} />
                                </label>
                            </div>
                            {selectedOption === "schedule" && (
                                <div className="row openFormBox">
                                    <div className="col-12">
                                        <div className="formRow p-0">
                                            <input
                                                type="datetime-local"
                                                className="formItem"
                                            // {...register("start_date", { ...requiredValidator })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            isDisabled={false}
                                            isLoading={false}
                                            isClearable={true}
                                            isRtl={false}
                                            isSearchable={true}
                                            name="color"
                                        // options={colourOptions}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AiBatchCall