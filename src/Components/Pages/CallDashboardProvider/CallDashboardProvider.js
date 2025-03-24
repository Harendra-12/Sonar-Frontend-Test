import React from 'react'
import Header from '../../CommonComponents/Header';
import { Navigate } from 'react-router-dom';
import { backToTop } from '../../GlobalFunction/globalFunction';

function CallDashboardProvider() {
    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid px-0">
                        <Header title="Call dashboard " />
                    </div>
                    <div className="col-xl-12" style={{ overflow: "auto" }}>
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Call Dashboard Provider</h4>
                                                <p>Edit user information and group membership.</p>
                                            </div>
                                            <div className="buttonGroup">
                                                <button
                                                    onClick={() => { Navigate('-1'); backToTop() }}
                                                    type="button"
                                                    effect="ripple"
                                                    className="panelButton gray">
                                                    <span className="text">Back</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    effect="ripple"
                                                    className="panelButton" >
                                                    <span className="text">Save</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-floppy-disk"></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 formScroller" style={{ padding: '25px 23px' }}>
                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <form action="#" className="row">
                                                <div className="formRow col-xl-10">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Title</label>
                                                        {/* <label htmlFor="data" className="formItemDesc">
                                                    Full legal name of the current owner.
                                                </label> */}
                                                    </div>
                                                    <div className="col-6">
                                                        <input
                                                            type="text"
                                                            name="extension"
                                                            className="formItem" />

                                                    </div>
                                                </div>
                                                <div className="formRow col-xl-10">
                                                    <div className="formLabel pe-2 col-2">
                                                        <label className="text-dark">Filter</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                          Select filter type 
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <input
                                                            type="text"
                                                            name="extension"
                                                            className="formItem" />

                                                    </div>
                                                </div>
                                                <div className="formRow col-xl-10">
                                                    <div className="formLabel pe-2 col-2">
                                                        <label className="text-dark">Role</label>
                                                        {/* <label htmlFor="data" className="formItemDesc">
                                                    The address associated with the current number.
                                                </label> */}
                                                    </div>
                                                    <div className="col-6">
                                                        <input
                                                            type="text"
                                                            name="extension"
                                                            className="formItem" />

                                                    </div>
                                                </div>
                                                <div className="formRow col-xl-10">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Total call</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            {/* Some carriers require a PIN for porting. */}
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <input
                                                            type="text"
                                                            name="extension"
                                                            className="formItem" />

                                                    </div>
                                                </div>


                                                <div className="formRow col-xl-10">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Role Type</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            Select Default to enable login or to disable login select Virtual.
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <select
                                                            className="formItem"
                                                            name="" >
                                                            <option disabled value="">
                                                                Select Role type
                                                            </option>
                                                        </select>
                                                    </div>

                                                </div>
                                                <div className="formRow col-xl-10">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Select extension</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            Assign an extension to the newly created user.
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <select
                                                            className="formItem"
                                                            name="" >
                                                            <option disabled value="">
                                                                Select Time Zone
                                                            </option>
                                                        </select>

                                                    </div>

                                                </div>


                                            </form>
                                        </div>
                                        <div className='col-md-6'>

                                            <div className='row'>
                                                <div className="col-xl-6 mb-2  mb-xl-2"
                                                    style={{ cursor: "pointer" }}>
                                                    <div className="itemWrapper a">
                                                        <div className="heading d-block">
                                                            <div className="d-flex flex-wrap justify-content-between">
                                                                <div className="col-9">
                                                                    <h5>453</h5>
                                                                    <p>
                                                                        Total count 
                                                                    </p>
                                                                </div>
                                                                <div className="col-3 text-end">
                                                                    <i className="fa-duotone fa-earth-americas"></i>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="data-number2 m-0">
                                                            <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                                <div className="col-9">
                                                                    <h5>{ }</h5>
                                                                    <p>Name </p>
                                                                    {/* <p>TimeZone: </p> */}
                                                                </div>
                                                                {/* <div className="col-3">
                                                                    dfdgsdf
                                                                </div> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-6 mb-2 mb-xl-2"
                                                    style={{ cursor: "pointer" }}>
                                                    <div className="itemWrapper a">
                                                        <div className="heading d-block">
                                                            <div className="d-flex flex-wrap justify-content-between">
                                                                <div className="col-9">
                                                                    <h5>Title</h5>
                                                                    <p>
                                                                        
                                                                    </p>
                                                                </div>
                                                                <div className="col-3 text-end">
                                                                    <i className="fa-duotone fa-earth-americas"></i>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="data-number2 m-0">
                                                            <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                                <div className="col-9">
                                                                    <h5>{ }</h5>
                                                                    <p>Name </p>
                                                                    {/* <p>TimeZone: </p> */}
                                                                </div>
                                                                {/* <div className="col-3">
                                                                    dfdgsdf
                                                                </div> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-6 mb-2 mb-xl-2"
                                                    style={{ cursor: "pointer" }}>
                                                    <div className="itemWrapper a">
                                                        <div className="heading d-block">
                                                            <div className="d-flex flex-wrap justify-content-between">
                                                                <div className="col-9">
                                                                    <h5>453</h5>
                                                                    <p>
                                                                        Total count 
                                                                    </p>
                                                                </div>
                                                                <div className="col-3 text-end">
                                                                    <i className="fa-duotone fa-earth-americas"></i>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="data-number2 m-0">
                                                            <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                                <div className="col-9">
                                                                    <h5>{ }</h5>
                                                                    <p>Name </p>
                                                                    {/* <p>TimeZone: </p> */}
                                                                </div>
                                                                {/* <div className="col-3">
                                                                    dfdgsdf
                                                                </div> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-6 mb-2 mb-xl-2"
                                                    style={{ cursor: "pointer" }}>
                                                    <div className="itemWrapper a">
                                                        <div className="heading d-block">
                                                            <div className="d-flex flex-wrap justify-content-between">
                                                                <div className="col-9">
                                                                    <h5>453</h5>
                                                                    <p>
                                                                        Total count 
                                                                    </p>
                                                                </div>
                                                                <div className="col-3 text-end">
                                                                    <i className="fa-duotone fa-earth-americas"></i>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="data-number2 m-0">
                                                            <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                                <div className="col-9">
                                                                    <h5>{ }</h5>
                                                                    <p>Name </p>
                                                                    {/* <p>TimeZone: </p> */}
                                                                </div>
                                                                {/* <div className="col-3">
                                                                    dfdgsdf
                                                                </div> */}
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

                    </div>
                </section>


            </main>
        </>
    )
}

export default CallDashboardProvider