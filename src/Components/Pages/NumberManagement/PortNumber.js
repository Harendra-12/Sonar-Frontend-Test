import React from "react";
import { backToTop } from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function PortNumber() {
  const navigate = useNavigate();
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0">
            <div id="subPageHeader">
              <div className="col-xl-6 my-auto">
                <h4 className="my-auto">Port Number</h4>
              </div>
              <div className="col-xl-6 ps-2">
                <div className="d-flex justify-content-end">
                  <button
                    effect="ripple"
                    className="panelButton"
                    onClick={() => {
                      navigate(-1);
                      backToTop();
                    }}
                  >
                    Back
                  </button>
                  <button effect="ripple" className="panelButton">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-12">
            <div className="mx-2" id="detailsContent">
              <form action="#" className="row">
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label className="text-dark">Full Name</label>
                      <br />
                      <label
                        htmlFor="data"
                        className="formItemDesc"
                        style={{
                          fontSize: 12,
                          lineHeight: "18px",
                          marginTop: 5,
                        }}
                      >
                        Full legal name of the current owner.
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <div className="formLabel">
                        <label className="status missing">Field missing</label>
                      </div>
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        required="required"
                      />
                    </div>
                  </div>
                </div>
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label className="text-dark">Company Name</label>
                      <br />
                      <label
                        htmlFor="data"
                        className="formItemDesc"
                        style={{
                          fontSize: 12,
                          lineHeight: "18px",
                          marginTop: 5,
                        }}
                      >
                        The company to whom the number is registered.
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <div className="formLabel">
                        <label className="status missing">Field missing</label>
                      </div>
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        required="required"
                      />
                    </div>
                  </div>
                </div>
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label className="text-dark">Billing Address</label>
                      <br />
                      <label
                        htmlFor="data"
                        className="formItemDesc"
                        style={{
                          fontSize: 12,
                          lineHeight: "18px",
                          marginTop: 5,
                        }}
                      >
                        The address associated with the current number.
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <div className="formLabel">
                        <label className="status missing">Field missing</label>
                      </div>
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        required="required"
                      />
                    </div>
                  </div>
                </div>
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label className="text-dark">PIN or Password</label>
                      <br />
                      <label
                        htmlFor="data"
                        className="formItemDesc"
                        style={{
                          fontSize: 12,
                          lineHeight: "18px",
                          marginTop: 5,
                        }}
                      >
                        Some carriers require a PIN for porting.
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <div className="formLabel">
                        <label className="status missing">Field missing</label>
                      </div>
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        required="required"
                      />
                    </div>
                  </div>
                </div>
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label className="text-dark">Carrier</label>
                      <br />
                      <label
                        htmlFor="data"
                        className="formItemDesc"
                        style={{
                          fontSize: 12,
                          lineHeight: "18px",
                          marginTop: 5,
                        }}
                      >
                        The current vendor/carrier of the number.
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <div className="formLabel">
                        <label className="status missing">Field missing</label>
                      </div>
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        required="required"
                      />
                    </div>
                  </div>
                </div>
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label className="text-dark">Account Number</label>
                      <br />
                      <label
                        htmlFor="data"
                        className="formItemDesc"
                        style={{
                          fontSize: 12,
                          lineHeight: "18px",
                          marginTop: 5,
                        }}
                      >
                        Account Number with Current Provider. This can often be
                        found on
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <div className="formLabel">
                        <label className="status missing">Field missing</label>
                      </div>
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        required="required"
                      />
                    </div>
                  </div>
                </div>
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label className="text-dark">Phone Number</label>
                      <br />
                      <label
                        htmlFor="data"
                        className="formItemDesc"
                        style={{
                          fontSize: 12,
                          lineHeight: "18px",
                          marginTop: 5,
                        }}
                      >
                        The number(s) that need to be ported.
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <div className="formLabel">
                        <label className="status missing">Field missing</label>
                      </div>
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        required="required"
                      />
                    </div>
                    <div class="col-xl-2 mt-auto">
                      <button
                        class="panelButton ms-xl-5"
                        effect="ripple"
                        type="button"
                      >
                        <i class="fa-duotone fa-circle-plus me-2"></i>Add More
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </main>
    </>
  );
}

export default PortNumber;
