import React, { useState } from 'react'
import Header from '../../CommonComponents/Header'
import { useForm } from 'react-hook-form';
import { requiredValidator } from '../../validations/validation';
import { backToTop, generalPostFunction } from '../../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';
import CircularLoader from '../../Loader/CircularLoader';
import ErrorMessage from '../../CommonComponents/ErrorMessage';
import { useNavigate } from 'react-router-dom';

const AIAgentAdd = () => {
  const [loading, setLoading] = useState(false);
  const { register, formState: { errors }, reset, handleSubmit } = useForm();
  const navigate = useNavigate();

  // Handle AI Agent Config Setup
  const handleFormSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const payload = { ...data };
    const apiData = await generalPostFunction("/ainumber/store", payload);
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
            <Header title="AI Agent" />
          </div>
          <div className="col-xl-12">
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap" style={{ position: "sticky", top: "0", zIndex: "9" }}>
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>AI Agent Config</h4>
                        <p>
                          You can setup and configure your AI Agent to be used with our service
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
                            AI Name
                            <span className="text-danger">*</span>
                          </label>
                          <label htmlFor="data" className="formItemDesc">
                            Please enter the name for your AI Agent
                          </label>
                        </div>
                        <div className="col-xl-6 col-12">
                          <input
                            type="text"
                            name="extension"
                            className="formItem"
                            {...register("name", { ...requiredValidator, })}
                          />
                          {errors.name && (
                            <ErrorMessage text={errors.name.message} />
                          )}
                        </div>
                      </div>
                      <div className="formRow col-xl-3">
                        <div className="formLabel">
                          <label htmlFor="">
                            AI Number
                            <span className="text-danger">*</span>
                          </label>
                          <label htmlFor="data" className="formItemDesc">
                            Please enter the number to be used by your ai agwnt
                          </label>
                        </div>
                        <div className="col-xl-6 col-12">
                          <input
                            type="text"
                            name="extension"
                            className="formItem"
                            {...register("ainumber", {
                              ...requiredValidator,
                            })}
                          />
                          {errors.ainumber && (
                            <ErrorMessage text={errors.ainumber.message} />
                          )}
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

export default AIAgentAdd