import React, { useEffect, useState } from 'react'
import Header from '../../../CommonComponents/Header'
import { backToTop, generalGetFunction, generalPostFunction, generalPutFunction } from '../../../GlobalFunction/globalFunction'
import { useForm } from 'react-hook-form';
import ErrorMessage from '../../../CommonComponents/ErrorMessage';
import { requiredValidator } from '../../../validations/validation';
import CircularLoader from '../../../Loader/CircularLoader';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

const MetaConfigEdit = () => {
  const [loading, setLoading] = useState(false);
  const locationState = useLocation();
  const navigate = useNavigate();

  const instagramConfigForm = useForm();

  const {
    register: instagramRegister,
    formState: { errors: instagramErrors },
    handleSubmit: instagramHandleSubmit,
    reset: instagramReset,
  } = instagramConfigForm;

  const facebookConfigForm = useForm();

  const {
    register: facebookRegister,
    formState: { errors: facebookErrors },
    handleSubmit: facebookHandleSubmit,
    reset: facebookReset,
  } = facebookConfigForm;

  useEffect(() => {
    async function getData() {
      if (locationState.state.id && locationState.state.platform) {
        setLoading(true);
        try {
          const apiData = await generalGetFunction(`/social-platforms/show/${locationState.state.id}`)
          if (apiData.status) {
            const { app_id, app_token } = apiData?.data;
            if (apiData.data.platform.toLowerCase() === "instagram") {
              instagramReset({ app_id, app_token });
            } else if (apiData.data.platform.toLowerCase() === "facebook") {
              facebookReset({ app_id, app_token });
            }
            setLoading(false);
          }
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      }
    }
    getData();
  }, [])

  // Instagram Config Setup
  const handleFormSubmitForInstagram = instagramHandleSubmit(async (data) => {
    setLoading(true);
    const payload = { ...data };
    const apiData = await generalPutFunction(`/social-platforms/${locationState.state.id}`, payload);
    if (apiData?.status) {
      setLoading(false);
      toast.success(apiData.message);
      navigate('/all-third-party-apps');
    } else {
      setLoading(false);
    }
  });

  // Facebook Config Setup
  const handleFormSubmitForFacebook = facebookHandleSubmit(async (data) => {
    setLoading(true);
    const payload = { ...data };
    const apiData = await generalPutFunction(`/social-platforms/${locationState.state.id}`, payload);
    if (apiData?.status) {
      setLoading(false);
      toast.success(apiData.message);
      navigate('/all-third-party-apps');
    } else {
      setLoading(false);
    }
  })

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          {loading ? (
            <div colSpan={99}>
              <CircularLoader />
            </div>
          ) : (
            ""
          )}
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
                        <h4>Meta Config</h4>
                        <p>
                          You can setup and configure your Meta account to be used with our service
                        </p>
                      </div>
                      <div className="buttonGroup">
                        <button
                          type="button"
                          effect="ripple"
                          className="panelButton gray"
                          onClick={() => {
                            navigate(-1);
                            backToTop();
                          }}
                        >
                          <span className="text">Back</span>
                          <span className="icon">
                            <i className="fa-solid fa-caret-left"></i>
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
                    <div className="tangoNavs">
                      <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                          {locationState.state.platform.toLowerCase() === "instagram" && <button
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
                          </button>}
                          {locationState.state.platform.toLowerCase() === "facebook" && <button
                            className={`nav-link ${locationState.state.platform.toLowerCase() === "facebook" && "active"}`}
                            id="facebook-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#facebook"
                            type="button"
                            role="tab"
                            aria-controls="facebook"
                            aria-selected="false"
                          >
                            Facebook
                          </button>}
                        </div>
                      </nav>
                      <div className="tab-content" id="nav-tabContent">
                        {locationState.state.platform.toLowerCase() === "instagram" &&
                          <div
                            className="tab-pane fade show active"
                            id="instagram"
                            role="tabpanel"
                            aria-labelledby="instagram-tab"
                            tabindex="0"
                          >
                            <form className="col-12 mx-auto">
                              <div className="formRow col-xl-3">
                                <div className="formLabel">
                                  <label htmlFor="">
                                    App Id
                                    <span className="text-danger">*</span>
                                  </label>
                                  <label htmlFor="data" className="formItemDesc">
                                    App id of the account that you want to configure
                                  </label>
                                </div>
                                <div className="col-xl-6 col-12">
                                  <input
                                    type="text"
                                    name="extension"
                                    className="formItem"
                                    {...instagramRegister("app_id", {
                                      ...requiredValidator,
                                    })}
                                  />
                                  {instagramErrors.app_id && (
                                    <ErrorMessage text={instagramErrors.app_id.message} />
                                  )}
                                </div>
                              </div>
                              <div className="formRow col-xl-3">
                                <div className="formLabel">
                                  <label htmlFor="">
                                    App Token
                                    <span className="text-danger">*</span>
                                  </label>
                                  <label htmlFor="data" className="formItemDesc">
                                    App token of the account that you want to configure
                                  </label>
                                </div>
                                <div className="col-xl-6 col-12">
                                  <input
                                    type="text"
                                    name="extension"
                                    className="formItem"
                                    {...instagramRegister("app_token", {
                                      ...requiredValidator,
                                    })}
                                  />
                                  {instagramErrors.app_token && (
                                    <ErrorMessage text={instagramErrors.app_token.message} />
                                  )}
                                </div>
                              </div>
                              <div className="formRow col-xl-3 d-none">
                                <div className="formLabel">
                                  <label htmlFor="">
                                    Platform
                                    <span className="text-danger">*</span>
                                  </label>
                                </div>
                                <div className="col-xl-6 col-12">
                                  <input
                                    type="text"
                                    name="extension"
                                    className="formItem"
                                    value={"instagram"}
                                    {...instagramRegister("platform")}
                                  />
                                </div>
                              </div>
                              <div className="formRow col-xl-3">
                                <button
                                  type="button"
                                  effect="ripple"
                                  className="panelButton ms-0"
                                  onClick={handleFormSubmitForInstagram}
                                >
                                  <span className="text">Save</span>
                                  <span className="icon">
                                    <i className="fa-solid fa-floppy-disk"></i>
                                  </span>
                                </button>
                              </div>
                            </form>
                          </div>
                        }
                        {locationState.state.platform.toLowerCase() === "facebook" &&
                          <div
                            className={`tab-pane fade ${locationState.state.platform.toLowerCase() === "facebook" && "show active"}`}
                            id="facebook"
                            role="tabpanel"
                            aria-labelledby="facebook-tab"
                            tabindex="0"
                          >
                            <form className="col-12 mx-auto">
                              <div className="formRow col-xl-3">
                                <div className="formLabel">
                                  <label htmlFor="">
                                    App Id
                                    <span className="text-danger">*</span>
                                  </label>
                                  <label htmlFor="data" className="formItemDesc">
                                    App id of the account that you want to configure
                                  </label>
                                </div>
                                <div className="col-xl-6 col-12">
                                  <input
                                    type="text"
                                    name="extension"
                                    className="formItem"
                                    {...facebookRegister("app_id", {
                                      ...requiredValidator,
                                    })}
                                  />
                                  {facebookErrors.app_id && (
                                    <ErrorMessage text={facebookErrors.app_id.message} />
                                  )}
                                </div>
                              </div>
                              <div className="formRow col-xl-3">
                                <div className="formLabel">
                                  <label htmlFor="">
                                    App Token
                                    <span className="text-danger">*</span>
                                  </label>
                                  <label htmlFor="data" className="formItemDesc">
                                    App token of the account that you want to configure
                                  </label>
                                </div>
                                <div className="col-xl-6 col-12">
                                  <input
                                    type="text"
                                    name="extension"
                                    className="formItem"
                                    {...facebookRegister("app_token", {
                                      ...requiredValidator,
                                    })}
                                  />
                                  {facebookErrors.app_token && (
                                    <ErrorMessage text={facebookErrors.app_token.message} />
                                  )}
                                </div>
                              </div>
                              <div className="formRow col-xl-3 d-none">
                                <div className="formLabel">
                                  <label htmlFor="">
                                    Platform
                                    <span className="text-danger">*</span>
                                  </label>
                                </div>
                                <div className="col-xl-6 col-12">
                                  <input
                                    type="text"
                                    name="extension"
                                    className="formItem"
                                    value={"facebook"}
                                    {...facebookRegister("platform")}
                                  />
                                </div>
                              </div>
                              <div className="formRow col-xl-3">
                                <button
                                  type="button"
                                  effect="ripple"
                                  className="panelButton ms-0"
                                  onClick={handleFormSubmitForFacebook}
                                >
                                  <span className="text">Save</span>
                                  <span className="icon">
                                    <i className="fa-solid fa-floppy-disk"></i>
                                  </span>
                                </button>
                              </div>
                            </form>
                          </div>
                        }
                      </div>
                      <div />
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

export default MetaConfigEdit