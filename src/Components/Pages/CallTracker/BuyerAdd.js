import React from 'react'
import Header from '../../CommonComponents/Header'

const BuyerAdd = () => {
    return (
        <>
           <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Buyers" />
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>Buyer Add</h4>
                                                    <p>Manage the config of the lead</p>
                                                </div>
                                                <div className="buttonGroup">
                                                    <div className='d-flex align-items-center'>
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
                                                    </div>
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
                                                            <i className="fa-solid fa-caret-left"></i>
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="panelButton"
                                                    >
                                                        <span className="text">Save</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-floppy-disk"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12" style={{ padding: '25px 23px' }}>
                                            <form className="row mb-0">
                                                <div className="formRow col-xl-3">
                                                    <div className='formLabel'>
                                                        <label>
                                                            Name <span className="text-danger">*</span>
                                                        </label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            Enter a name.
                                                        </label>
                                                    </div>
                                                    <div className='col-6'>
                                                        <input
                                                            type="text"
                                                            className="formItem" />
                                                    </div>
                                                </div>

                                                <div className="formRow col-xl-3">
                                                    <div className='formLabel'>
                                                        <label>
                                                            Strategy
                                                        </label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                        There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain
                                                        </label>
                                                    </div>
                                                    <div className='col-6'>
                                                        <input
                                                            type="text"
                                                            className="formItem" />
                                                    </div>
                                                </div>
                                                <div className="formRow col-xl-3">
                                                    <div className='formLabel'>
                                                        <label>
                                                            Campaign
                                                        </label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                         who seeks after it and wants to have it, simply because it is pain
                                                        </label>
                                                    </div>
                                                    <div className='col-6'>
                                                        <select
                                                            className="formItem"
                                                            // {...register("strategy")}
                                                            id="selectFormRow"
                                                        >
                                                            <option value="enterprise">Enterprise</option>
                                                            <option value="sequence">Sequence</option>
                                                            <option value="simultaneously">Simultaneous</option>
                                                            <option value="random">Random</option>
                                                            <option value="rollover">Rollover</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="formRow col-xl-3">
                                                    <div className='formLabel'>
                                                        <label>
                                                            Status
                                                        </label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                        There is no one who loves pain itself, 
                                                        </label>
                                                    </div>
                                                    <div className='col-6'>
                                                        <input
                                                            type="text"
                                                            className="formItem" />
                                                    </div>
                                                </div>
                                                <div className="formRow col-xl-3">
                                                    <div className='formLabel'>
                                                        <label>
                                                            DID
                                                        </label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                        There is no one who loves pain itself, simply because it is pain
                                                        </label>
                                                    </div>
                                                    <div className='col-6'>
                                                        <input
                                                            type="text"
                                                            className="formItem" />
                                                    </div>
                                                </div>
                                                <div className="formRow col-xl-3">
                                                    <div className='formLabel'>
                                                        <label>
                                                            Source
                                                        </label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                        There is no one who loves pain itself, who seeks after it and wants to have it,
                                                        </label>
                                                    </div>
                                                    <div className='col-6'>
                                                        <select
                                                            className="formItem"
                                                            // {...register("strategy")}
                                                            id="selectFormRow"
                                                        >
                                                            <option value="enterprise">File</option>
                                                            <option value="sequence">Pdf</option>
                                                            <option value="simultaneously">png</option>
                                                            <option value="random">jpg</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main >
        </>
    )
}

export default BuyerAdd