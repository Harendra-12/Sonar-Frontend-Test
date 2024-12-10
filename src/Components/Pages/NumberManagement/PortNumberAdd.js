import React, { useState } from "react";
import {
  backToTop,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  lengthValidator,
  nameNumberValidator,
  nameValidator,
  numberValidator,
  requiredValidator,
  restrictToAllowedChars,
  restrictToNumbers,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import CircularLoader from "../../Loader/CircularLoader";
import Header from "../../CommonComponents/Header";

function PortNumberAdd() {
  const [loading, setLoading] = useState(false);
  const account = useSelector((state) => state.account);
  const accountId = account.account_id || "";
  const navigate = useNavigate();
  const {
    register,

    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const handleFormSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const payload = {
      ...data,
      ...{ account_id: accountId },
    };
    const apiData = await generalPostFunction("/ports/store", payload);
    if (apiData?.status) {
      setLoading(false);
      reset();
      toast.success(apiData.message);
    } else {
      setLoading(false);
      // const errorMessage = Object.keys(apiData.errors);
      // toast.error(apiData.errors[errorMessage[0]][0]);
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
            <Header title="Port Number Add" />
            {/* <div id="subPageHeader">
              <div className="col-xl-9 my-auto">
                <p className="mb-0">Add a port number</p>
              </div>
              <div className="col-xl-3 ps-2">
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
          <div className="col-xl-12">
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Port Number Add</h4>
                        <p>Add a port number</p>
                      </div>
                      <div className="buttonGroup">
                        <button
                          effect="ripple"
                          className="panelButton gray"
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
                  </div>
                  <div className="col-12 formScroller" style={{ padding: '25px 23px' }}>
                    <form action="#" className="row">
                      <div className="formRow col-xl-3">
                        <div className="formLabel">
                          <label className="text-dark">Full Name</label>
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
                        <div className="col-6">
                          <input
                            type="text"
                            name="extension"
                            className="formItem"
                            {...register("fullname", {
                              ...requiredValidator,
                              ...nameValidator,
                            })}
                            onKeyDown={restrictToAllowedChars}
                          />
                          {errors.fullname && (
                            <ErrorMessage text={errors.fullname.message} />
                          )}
                        </div>
                      </div>
                      <div className="formRow col-xl-3">
                        <div className="formLabel">
                          <label className="text-dark">Company Name</label>
                          <label htmlFor="data" className="formItemDesc">
                            The company to whom the number is registered.
                          </label>
                        </div>
                        <div className="col-6">
                          <input
                            type="text"
                            name="extension"
                            className="formItem"
                            {...register("company_name", {
                              ...requiredValidator,
                              ...nameNumberValidator,
                            })}
                            onKeyDown={restrictToAllowedChars}
                          />
                          {errors.company_name && (
                            <ErrorMessage text={errors.company_name.message} />
                          )}
                        </div>
                      </div>
                      <div className="formRow col-xl-3">
                        <div className="formLabel">
                          <label className="text-dark">Billing Address</label>
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
                        <div className="col-6">
                          <input
                            type="text"
                            name="extension"
                            className="formItem"
                            {...register("billing_address", {
                              ...requiredValidator,
                            })}
                            onKeyDown={restrictToAllowedChars}
                          />
                          {errors.billing_address && (
                            <ErrorMessage text={errors.billing_address.message} />
                          )}
                        </div>
                      </div>
                      <div className="formRow col-xl-3">
                        <div className="formLabel">
                          <label className="text-dark">PIN or Password</label>
                          <br />
                          <label htmlFor="data" className="formItemDesc">
                            Some carriers require a PIN for porting.
                          </label>
                        </div>
                        <div className="col-6">
                          <input
                            type="text"
                            name="extension"
                            className="formItem"
                            {...register("pin", {
                              ...requiredValidator,
                            })}
                          />
                          {errors.pin && <ErrorMessage text={errors.pin.message} />}
                        </div>
                      </div>
                      <div className="formRow col-xl-3">
                        <div className="formLabel">
                          <label className="text-dark">Carrier</label>
                          <label htmlFor="data" className="formItemDesc">
                            The current vendor/carrier of the number.
                          </label>
                        </div>
                        <div className="col-6">
                          <input
                            type="text"
                            name="extension"
                            className="formItem"
                            {...register("carrier", {
                              ...requiredValidator,
                              ...nameNumberValidator,
                            })}
                            onKeyDown={restrictToNumbers}
                          />
                          {errors.carrier && (
                            <ErrorMessage text={errors.carrier.message} />
                          )}
                        </div>
                      </div>
                      <div className="formRow col-xl-3">
                        <div className="formLabel">
                          <label className="text-dark">Account Number</label>
                          <label htmlFor="data" className="formItemDesc">
                            Account Number with Current Provider. This can often be
                            found on
                          </label>
                        </div>
                        <div className="col-6">
                          <input
                            type="text"
                            name="extension"
                            className="formItem"
                            {...register("account_number", {
                              ...requiredValidator,
                              ...numberValidator,
                            })}
                            onKeyDown={restrictToNumbers}
                          />
                          {errors.account_number && (
                            <ErrorMessage text={errors.account_number.message} />
                          )}
                        </div>
                      </div>
                      <div className="formRow col-xl-3">
                        <div className="formLabel pe-2 col-2">
                          <label className="text-dark">Phone Number</label>
                          <label htmlFor="data" className="formItemDesc">
                            The number(s) that need to be ported.
                          </label>
                        </div>
                        <div className="col-6">
                          <input
                            type="text"
                            name="extension"
                            className="formItem"
                            {...register("phone_number", {
                              ...requiredValidator,
                              ...numberValidator,
                              ...lengthValidator(10, 13),
                            })}
                            onKeyDown={restrictToNumbers}
                          />
                          {errors.phone_number && (
                            <ErrorMessage text={errors.phone_number.message} />
                          )}
                        </div>
                        {/* <div class="col-xl-2 mt-auto">
                      <button
                        class="panelButton ms-xl-5"
                        effect="ripple"
                        type="button"
                      >
                        <i class="fa-duotone fa-circle-plus me-2"></i>Add More
                      </button>
                    </div> */}
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
  );
}

export default PortNumberAdd;
