import React from 'react'
import Header from '../../../CommonComponents/Header'

const Meta = () => {
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0">
            <Header title="Meta" />
          </div>
          <div className="col-xl-12">
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap" style={{ position: "sticky", top: "0", zIndex: "9" }}>
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Meta</h4>
                        <p>
                          An extension is a destinations that can be called.
                        </p>
                      </div>
                      <div className="buttonGroup">
                        <button
                          type="button"
                          effect="ripple"
                          className="panelButton gray"
                        >
                          <span className="text">Back</span>
                          <span className="icon">
                            <i className="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        <button
                          type="button"
                          effect="ripple"
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
                  <div
                    className="col-12 formScroller"
                    style={{
                      padding: "25px 23px",
                    }}
                  >
                    <form action="#" className="tangoNavs">
                      <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                          <button
                            className="nav-link active"
                            id="instagram-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#instagram"
                            type="button"
                            role="tab"
                            aria-controls="instagram"
                            aria-selected="true"
                          >
                            Instagram
                          </button>
                          <button
                            className="nav-link"
                            id="facebook-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#facebook"
                            type="button"
                            role="tab"
                            aria-controls="facebook"
                            aria-selected="false"
                          >
                            Facebook
                          </button>
                        </div>
                      </nav>
                      <div className="tab-content" id="nav-tabContent">
                        <div
                          className="tab-pane fade show active"
                          id="instagram"
                          role="tabpanel"
                          aria-labelledby="instagram-tab"
                          tabindex="0"
                        >
                          <form className="row col-12 mx-auto">
                            
                            <div className="formRow col-xl-3">
                              <div className="formLabel">
                                <label htmlFor="">
                                App Id
                                  <span className="text-danger">*</span>
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <input
                                  type="number"
                                  name="extension"
                                  className="formItem"
                                />
                              </div>
                            </div>
                            <div className="formRow col-xl-3">
                              <div className="formLabel">
                                <label htmlFor="">
                                App Token
                                  <span className="text-danger">*</span>
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <input
                                  type="text"
                                  name="extension"
                                  className="formItem"
                                />
                              </div>
                            </div>
                            <div className="formRow col-xl-3">
                              <div className="formLabel">
                                <label htmlFor="">
                                Page Id
                                  <span className="text-danger">*</span>
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <input
                                  type="number"
                                  name="extension"
                                  className="formItem"
                                />
                              </div>
                            </div>
                            
                          </form>
                        </div>
                        <div
                          className="tab-pane fade "
                          id="facebook"
                          role="tabpanel"
                          aria-labelledby="facebook-tab"
                          tabindex="0"
                        >
                          <form className="row col-12 mx-auto">
                            <div className="formRow col-xl-3">
                              <div className="formLabel">
                                <label htmlFor="">
                                App Id
                                  <span className="text-danger">*</span>
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <input
                                  type="number"
                                  name="extension"
                                  className="formItem"
                                />
                              </div>
                            </div>
                            <div className="formRow col-xl-3">
                              <div className="formLabel">
                                <label htmlFor="">
                                App Token
                                  <span className="text-danger">*</span>
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <input
                                  type="text"
                                  name="extension"
                                  className="formItem"
                                />
                              </div>
                            </div>
                            <div className="formRow col-xl-3">
                              <div className="formLabel">
                                <label htmlFor="">
                                Page Id
                                  <span className="text-danger">*</span>
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain.
                                </label>
                              </div>
                              <div className="col-xl-6 col-12">
                                <input
                                  type="number"
                                  name="extension"
                                  className="formItem"
                                />
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                      <div />
                    </form>
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

export default Meta