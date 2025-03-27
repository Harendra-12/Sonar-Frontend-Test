import React, { useState } from 'react'
import Header from '../../../CommonComponents/Header'
import { useForm } from 'react-hook-form';
import { requiredValidator } from '../../../validations/validation';
import { generalPostFunction } from '../../../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';
import CircularLoader from '../../../Loader/CircularLoader';
import ErrorMessage from '../../../CommonComponents/ErrorMessage';

const WhatsAppConfig = () => {
  const [loading, setLoading] = useState(false);
  const { register, formState: { errors }, reset, handleSubmit } = useForm();

  // Handle WhatsApp Config Setup
  const handleFormSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const payload = { ...data };
    const apiData = await generalPostFunction("/social-platforms/store", payload);
    if (apiData?.status) {
      setLoading(false);
      reset();
      toast.success(apiData.message);
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
                        <h4>WhatsApp Config</h4>
                        <p>
                          You can setup and configure your WhatsApp account to be used with our service
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

export default WhatsAppConfig