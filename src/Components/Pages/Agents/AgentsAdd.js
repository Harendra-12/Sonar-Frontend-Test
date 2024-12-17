import React from 'react'
import Header from '../../CommonComponents/Header';
import { backToTop } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';

function AgentsAdd() {
    const navigate = useNavigate();
    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid px-0">
                        <Header title="Agents" />
                    </div>
                    <div className="col-xl-12" style={{ overflow: "auto" }}>
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Agent Add</h4>
                                                <p>Edit user information and group membership.</p>
                                            </div>
                                            <div className="buttonGroup">
                                                <button
                                                    onClick={() => { navigate('-1'); backToTop() }}
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
                                                    type="button"
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
                                                <label className="text-dark">Password</label>
                                                <label htmlFor="data" className="formItemDesc">
                                                    Required: At least 4 character
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
                                            <div className="formLabel pe-2 col-2">
                                                <label className="text-dark">Confirm Password</label>
                                                <label htmlFor="data" className="formItemDesc">
                                                    Green field borders indicate typed passwords match.
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
                                                <label className="text-dark">Email</label>
                                                {/* <label htmlFor="data" className="formItemDesc">
                                                    Some carriers require a PIN for porting.
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
                                                <label className="text-dark">First Name</label>

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
                                                <br />
                                                <label htmlFor="data" className="formItemDesc">
                                                    Select the default time zone.
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
                                                <label className="text-dark">Status</label>
                                                <label htmlFor="data" className="formItemDesc">
                                                    Set the user's presence.
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
                                                <label className="text-dark">Role Type</label>
                                                <label htmlFor="data" className="formItemDesc">
                                                    Assign an extension to the newly created user.
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
                                                    Set new password to user.
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
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>
                    {/* {popUp ? (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div className="row content col-xl-4">
                  <div className="col-2 px-0">
                    <div className="iconWrapper">
                      <i className="fa-duotone fa-triangle-exclamation"></i>
                    </div>
                  </div>
                  <div className="col-10 ps-0">
                    <h4>Warning!</h4>
                    <p>
                      No Extension is currently asigned! Please add an
                      extension first!
                    </p>
                    <button
                      className="panelButton m-0"
                      onClick={() => {
                        // setForce(true);
                        setPopUp(false);
                        navigate("/extensions-add");
                      }}
                    >
                      Lets Go!
                    </button>
                    <button
                      className="panelButtonWhite m-0 float-end"
                      onClick={() => setPopUp(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )} */}
                </section>

                {/* <ToastContainer
        position="bottom-right"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      /> */}
            </main>
        </>
    )
}

export default AgentsAdd