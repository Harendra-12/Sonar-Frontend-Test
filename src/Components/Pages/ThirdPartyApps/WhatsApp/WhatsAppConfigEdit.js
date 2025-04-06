import React, { useEffect, useState } from 'react'
import Header from '../../../CommonComponents/Header'
import { useForm } from 'react-hook-form';
import { requiredValidator } from '../../../validations/validation';
import { backToTop, generalGetFunction, generalPostFunction, generalPutFunction } from '../../../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';
import CircularLoader from '../../../Loader/CircularLoader';
import ErrorMessage from '../../../CommonComponents/ErrorMessage';
import { useLocation, useNavigate } from 'react-router-dom';

const WhatsAppConfigEdit = () => {
  const [loading, setLoading] = useState(false);
  const { register, formState: { errors }, reset, handleSubmit } = useForm();
  const locationState = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      if (locationState.state.id) {
        setLoading(true);
        try {
          const apiData = await generalGetFunction(`/social-platforms/show/${locationState.state.id}`)
          if (apiData.status) {
            const { app_id, app_token } = apiData?.data;
            reset({ app_id, app_token });
            setLoading(false);
          }
        } catch (err) {
          console.log(err);
          setLoading(true);
        }
      }
    }
    getData()
  }, [])

  // Handle WhatsApp Config Setup
  const handleFormSubmit = handleSubmit(async (data) => {
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
            <Header title="WhatsApp" />
          </div>
          <div className="col-xl-12">
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap" style={{ position: "sticky", top: "0", zIndex: "9" }}>
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>WhatsApp Config Edit</h4>
                        <p>
                          You can edit configure your WhatsApp account to be used with our service
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
                        <button
                          type="button"
                          effect="ripple"
                          className="panelButton"
                          onClick={handleFormSubmit}
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
                            {...register("app_id", { ...requiredValidator, })}
                          />
                          {errors.app_id && (
                            <ErrorMessage text={errors.app_id.message} />
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
                            {...register("app_token", {
                              ...requiredValidator,
                            })}
                          />
                          {errors.app_token && (
                            <ErrorMessage text={errors.app_token.message} />
                          )}
                        </div>
                      </div>
                      <div className="formRow col-xl-3 d-none">
                        <div className="formLabel">
                          <label htmlFor="">
                            Platform
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
                            value={"whatsapp"}
                            {...register("platform")}
                          />
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
    </>
  )
}

export default WhatsAppConfigEdit