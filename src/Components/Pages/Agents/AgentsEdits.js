import React from 'react'
import SkeletonFormLoader from '../../Loader/SkeletonFormLoader';
import Header from '../../CommonComponents/Header';

function AgentsEdits() {
    return (
        <>
            <style>
                {`
      .permissionListWrapper .formRow .formLabel{
        margin-left: 10px;
      }
    `}
            </style>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid px-0">
                        <Header title="Agents" />
                        {/* <div id="subPageHeader">
            <div className="col-6 my-1">
              <p className="mb-0">
                Edit user information and group membership.
              </p>
            </div>
            <div className="col-6 ps-2">
              <div className="d-flex justify-content-end">
                <button
                  effect="ripple"
                  className="panelButton"
                  onClick={() => {
                    navigate(-1);
                    backToTop();
                  }}
                >
                  <span className="text">Back</span>
                  <span className="icon"><i class="fa-solid fa-caret-left"></i></span>
                </button>
                <button
                  effect="ripple"
                  className="panelButton"
                  onClick={handleFormSubmit}
                >
                  <span className="text">Save</span>
                  <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                </button>
              </div>
            </div>
          </div> */}
                    </div>

                    <div className="col-xl-12" style={{ overflow: "auto" }}>
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Agents Edit</h4>
                                                <p>Edit user information and group membership.</p>
                                            </div>
                                            <div className="buttonGroup">
                                                <button

                                                    type="button"
                                                    effect="ripple"
                                                    className="panelButton gray">
                                                    <span className="text">Back</span>
                                                    <span className="icon">
                                                        <i class="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    effect="ripple"
                                                    className="panelButton" >
                                                    <span className="text">Save</span>
                                                    <span className="icon">
                                                        <i class="fa-solid fa-floppy-disk"></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 formScroller" style={{ padding: '25px 23px' }}>
                                    <form action="#" className="row">
                                        <div className="formRow col-xl-3">
                                            <div className="formLabel">
                                                <label className="text-dark">Username</label>
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
                                        <div className="formRow col-xl-3">
                                            <div className="formLabel pe-2 col-2">
                                                <label className="text-dark">Email</label>

                                            </div>
                                            <div className="col-6">
                                                <input
                                                    type="text"
                                                    name="extension"
                                                    className="formItem" />

                                            </div>
                                        </div>
                                        <div className="formRow col-xl-3">
                                            <div className="formLabel pe-2 col-2">
                                                <label className="text-dark">First Name</label>
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
                                        <div className="formRow col-xl-3">
                                            <div className="formLabel">
                                                <label className="text-dark">Last Name</label>
                                                <label htmlFor="data" className="formItemDesc">
                                                    Some carriers require a PIN for porting.
                                                </label>
                                            </div>
                                            <div className="col-6">
                                                <input
                                                    type="text"
                                                    name="extension"
                                                    className="formItem" />

                                            </div>
                                        </div>
                                        <div className="formRow col-xl-3">
                                            <div className="formLabel">
                                                <label className="text-dark">Time Zone</label>

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
                                        <div className="formRow col-xl-3">
                                            <div className="formLabel">
                                                <label className="text-dark">Status</label>
                                                <br />
                                                <label htmlFor="data" className="formItemDesc">
                                                    Set the user's presence.
                                                </label>
                                            </div>
                                            <div className="col-6">
                                                <input
                                                    type="text"
                                                    name="extension"
                                                    className="formItem"
                                                />

                                            </div>
                                        </div>
                                        <div className="formRow col-xl-3">
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
                                        <div className="formRow col-xl-3">
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

                                        <div className="formRow col-xl-3">
                                            <div className="formLabel">
                                                <label className="text-dark">New Password</label>
                                                <label htmlFor="data" className="formItemDesc">
                                                    Set new password to user.
                                                </label>
                                            </div>
                                            <div className="col-6">
                                                <input
                                                    type="text"
                                                    name="extension"
                                                    className="formItem"
                                                />
                                            </div>

                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>


            </main>
        </>
    )
}

export default AgentsEdits