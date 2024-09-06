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
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import CircularLoader from "../../Loader/CircularLoader";

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
    if (apiData.status) {
      setLoading(false);
      reset();
      toast.success(apiData.message);
    } else {
      setLoading(false);
      const errorMessage = Object.keys(apiData.errors);
      toast.error(apiData.errors[errorMessage[0]][0]);
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
            <div className="row justify-content-center" id="subPageHeader">
              <div className="col-xl-6 my-auto">
                <h4 className="my-auto">Port Number Add</h4>
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
                  <button
                    effect="ripple"
                    className="panelButton"
                    onClick={handleFormSubmit}
                  >
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
                    <div className="col-2 pe-2 justify-content-center d-flex flex-column">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        {...register("fullname", {
                          ...requiredValidator,
                          ...nameValidator,
                        })}
                      />
                      {errors.fullname && (
                        <ErrorMessage text={errors.fullname.message} />
                      )}
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
                    <div className="col-2 pe-2  justify-content-center d-flex flex-column">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        {...register("company_name", {
                          ...requiredValidator,
                          ...nameNumberValidator,
                        })}
                      />
                      {errors.company_name && (
                        <ErrorMessage text={errors.company_name.message} />
                      )}
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
                    <div className="col-2 pe-2  justify-content-center d-flex flex-column">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        {...register("billing_address", {
                          ...requiredValidator,
                        })}
                      />
                      {errors.billing_address && (
                        <ErrorMessage text={errors.billing_address.message} />
                      )}
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
                    <div className="col-2 pe-2  justify-content-center d-flex flex-column">
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
                    <div className="col-2 pe-2  justify-content-center d-flex flex-column">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        {...register("carrier", {
                          ...requiredValidator,
                          ...nameNumberValidator,
                        })}
                      />
                      {errors.carrier && (
                        <ErrorMessage text={errors.carrier.message} />
                      )}
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
                    <div className="col-2 pe-2  justify-content-center d-flex flex-column">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        {...register("account_number", {
                          ...requiredValidator,
                          ...numberValidator,
                        })}
                      />
                      {errors.account_number && (
                        <ErrorMessage text={errors.account_number.message} />
                      )}
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
                    <div className="col-2 pe-2  justify-content-center d-flex flex-column">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        {...register("phone_number", {
                          ...requiredValidator,
                          ...numberValidator,
                          ...lengthValidator(10, 13),
                        })}
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
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default PortNumberAdd;
