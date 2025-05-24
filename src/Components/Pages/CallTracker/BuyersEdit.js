import React, { useState, useEffect } from "react";
import Header from "../../CommonComponents/Header";
import { backToTop, generalGetFunction, generalPostFunction, generalPutFunction } from "../../GlobalFunction/globalFunction";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";
import { emailValidator, lengthValidator, numberValidator, requiredValidator } from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import PhoneInput, { parsePhoneNumber, getCountryCallingCode } from "react-phone-number-input";

const BuyersEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState();

  const { watch, setValue, register, formState: { errors }, reset, handleSubmit } = useForm();
  const locationState = useLocation();

  // Initial API Call to get Buyer Info
  useEffect(() => {
    async function getData() {
      if (locationState.state.id) {
        setLoading(true);
        try {
          const apiData = await generalGetFunction(`/buyer/${locationState.state.id}`)
          if (apiData.status) {
            const { name, phone_number, phone_code, alt_phone, email, address, city, state, province, postal_code, country_code } = apiData?.data;

            // Combine phone_code and phone_number for PhoneInput
            const fullPhoneNumber = phone_code && phone_number
              ? `+${phone_code}${phone_number}`
              : undefined;

            const fullAltNumber = phone_code && alt_phone
              ? `+${phone_code}${alt_phone}`
              : undefined;

            reset({ name, phone_number: fullPhoneNumber, phone_code, alt_phone: fullAltNumber, email, address, city, state, province, postal_code, country_code });
            setLoading(false);
          }
        } catch (err) {
          console.log(err);
          setLoading(false);
        }
      }
    }
    fetchAllCountry()
    getData()
  }, [countryCode, locationState.state.id]);

  // Fetch all countries
  const fetchAllCountry = async () => {
    setLoading(true);
    if (!countryCode) {
      try {
        const apiData = await generalGetFunction("/available-countries");
        if (apiData?.status) {
          setCountryCode(apiData.data);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  // Handle Buyer Edit
  const handleFormSubmit = handleSubmit(async (data) => {
    setLoading(true);

    const phoneNumber = parsePhoneNumber(data.phone_number);
    const parsedNumber = phoneNumber?.nationalNumber;
    const parsedAltNumber = parsePhoneNumber(data.alt_phone)?.nationalNumber;

    const payload = { ...data, phone_number: parsedNumber || data.phone_number, alt_phone: parsedAltNumber || data.alt_phone, phone_code: phoneNumber?.countryCallingCode };
    const apiData = await generalPutFunction(`/buyer/${locationState.state.id}`, payload);
    if (apiData?.status) {
      setLoading(false);
      toast.success(apiData.message);
      navigate('/buyers');
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
          <div className="container-fluid">
            <div className="row">
              <Header title="Buyer Edit" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>Buyer Edit</h4>
                          <p>Edit your exiting Buyer</p>
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
                            <span className="icon">
                              <i className="fa-solid fa-caret-left"></i>
                            </span>
                          </button>
                          <button type="button" className="panelButton" onClick={handleFormSubmit}>
                            <span className="text">Save</span>
                            <span className="icon">
                              <i className="fa-solid fa-floppy-disk"></i>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-12" style={{ padding: "25px 23px" }}>
                      <form className="row mb-0">
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              Buyer Name <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a name.
                            </label>
                          </div>
                          <div className="col-6">
                            <input type="text"
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
                            <label>
                              Phone number{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a phone number.
                            </label>
                          </div>
                          <div className="col-6">
                            <input type="text"
                              className="formItem d-none"
                              {...register("phone_number", { ...requiredValidator })}
                            />
                            <PhoneInput
                              defaultCountry="US"
                              placeholder="Enter phone number"
                              limitMaxLength={true}
                              value={watch("phone_number")}
                              onChange={(value) => setValue("phone_number", value)}
                            />
                            {errors.phone_number && (
                              <ErrorMessage text={errors.phone_number.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              Alternate Phone number{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a name phone number.
                            </label>
                          </div>
                          <div className="col-6">
                            <input type="text"
                              className="formItem d-none"
                              {...register("alt_phone", { ...requiredValidator })}
                            />
                            <PhoneInput
                              defaultCountry="US"
                              placeholder="Enter alt phone number"
                              limitMaxLength={true}
                              value={watch("alt_phone")}
                              onChange={(value) => setValue("alt_phone", value)}
                            />
                            {errors.alt_phone && (
                              <ErrorMessage text={errors.alt_phone.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              Email <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a Email id .
                            </label>
                          </div>
                          <div className="col-6">
                            <input type="text"
                              className="formItem"
                              {...register("email", {
                                ...requiredValidator,
                                ...emailValidator,
                              })}
                            />
                            {errors.email && (
                              <ErrorMessage text={errors.email.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              Address <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a address .
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              className="formItem"
                              {...register("address", { ...requiredValidator, })}
                            />
                            {errors.address && (
                              <ErrorMessage text={errors.address.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              City <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a City .
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              className="formItem"
                              {...register("city", { ...requiredValidator, })}
                            />
                            {errors.city && (
                              <ErrorMessage text={errors.city.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              State <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a State .
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              className="formItem"
                              {...register("state", { ...requiredValidator, })}
                            />
                            {errors.state && (
                              <ErrorMessage text={errors.state.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              Province <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a province.
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              className="formItem"
                              {...register("province", { ...requiredValidator, })}
                            />
                            {errors.province && (
                              <ErrorMessage text={errors.province.message} />
                            )}
                          </div>
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              Postal code <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a postal code
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              className="formItem"
                              {...register("postal_code", { ...requiredValidator, })}
                            />
                            {errors.postal_code && (
                              <ErrorMessage text={errors.postal_code.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              Country Code <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a country code
                            </label>
                          </div>
                          <div className="col-6">
                            <select {...register("country_code", { ...requiredValidator, })} className="formItem" >
                              <option value="">Select Country Code</option>
                              {countryCode && countryCode.map((country, index) => (
                                <option key={index} value={country.country_code}>
                                  {country.country} ({country.country_code})
                                </option>
                              ))}
                            </select>
                            {errors.country_code && (
                              <ErrorMessage text={errors.country_code.message} />
                            )}
                          </div>
                        </div>
                      </form>
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

export default BuyersEdit