import React from 'react'
import Header from '../../../CommonComponents/Header'
import PaginationComponent from '../../../CommonComponents/PaginationComponent'

function LeadEdit() {
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="LeadEdit" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>General Information</h4>
                                            </div>
                                            <div className="buttonGroup">
                                                <button
                                                    effect="ripple"
                                                    className="panelButton ms-0"
                                                // onClick={() => setRefreshState(refreshState + 1)}
                                                >
                                                    <span className="text">Refresh</span>
                                                    <span className="icon">
                                                        <i className="fa-regular fa-arrows-rotate fs-5"></i>
                                                    </span>
                                                </button>
                                                <button
                                                    effect="ripple"
                                                    className="panelButton gray"
                                                // onClick={() => {
                                                //     navigate(-1);
                                                //     backToTop();
                                                // }}
                                                >
                                                    <span className="text">Back</span>
                                                    <span className="icon">
                                                        <i class="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="panelButton"
                                                >
                                                    <span className="text">Add</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-plus"></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <form className="row">
                                    <div className="col-6" style={{ overflow: "auto", padding: "25px 20px 0" }}>
                                        <div className="formRow border-0">
                                            <label className="formLabel text-start mb-0 w-100">
                                                List Name
                                            </label>
                                            <input
                                                type="text"
                                                className="formItem" />
                                        </div>

                                        <div className="formRow border-0">
                                            <label className="formLabel text-start mb-0 w-100">
                                                List Description
                                            </label>
                                            <input
                                                type="text"
                                                className="formItem" />
                                        </div>

                                        <div className="formRow border-0">
                                            <label className="formLabel text-start mb-0 w-100">
                                                Expiration Date
                                            </label>
                                            <input
                                                type="date"
                                                className="formItem" />
                                        </div>
                                        <div className="formRow border-0">
                                            <label className="formLabel text-start mb-0 w-100">
                                                CID Override
                                            </label>
                                            <input
                                                type="text"
                                                className="formItem" />
                                        </div>
                                        <div className="formRow border-0">
                                            <label className="formLabel text-start mb-0 w-100">
                                                Reset Time
                                            </label>
                                            <input
                                                type="text"
                                                className="formItem" />
                                        </div>

                                        <div className="my-auto position-relative  p-2 ">
                                            <p className='m-0'>Active</p>
                                            <label className="switch"> 
                                                <input
                                                    type="checkbox"
                                                    id="showAllCheck"
                                                />
                                                <span className="slider round" />
                                            </label>
                                        </div>
                                    </div>
                                    
                                   
                                  
                                    <div className="col-6" style={{ overflow: "auto", padding: "25px 20px 0" }}>
                                        <div className="formRow border-0">
                                            <label className="formLabel text-start mb-0 w-100">
                                                Campaign
                                            </label>
                                            <select
                                                name=""
                                                id=""
                                                className="formItem "
                                            >
                                                <option value="">10000-esee</option>
                                                <option value="">10000-esee</option>
                                                <option value="">10000-esee</option>
                                            </select>
                                        </div>

                                        <div className="formRow border-0">
                                            <label className="formLabel text-start mb-0 w-100">
                                                Webform Override
                                            </label>
                                            <input
                                                type="text"
                                                className="formItem" />
                                        </div>

                                        <div className="formRow border-0">
                                            <label className="formLabel text-start mb-0 w-100">
                                                Answering Machine Audio Override
                                            </label>
                                            <select
                                                name=""
                                                id=""
                                                className="formItem "
                                            >
                                                <option value=""></option>

                                            </select>
                                        </div>
                                        <div className="formRow border-0">
                                            <label className="formLabel text-start mb-0 w-100">
                                                Last Reset Time
                                            </label>
                                            <input
                                                type="date"
                                                className="formItem" />
                                        </div>


                                        <div className="my-auto position-relative  p-2 ">
                                        <p className='m-0'>Reset List</p>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    id="showAllCheck"
                                                />
                                                <span className="slider round" />
                                            </label>
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
    )
}

export default LeadEdit