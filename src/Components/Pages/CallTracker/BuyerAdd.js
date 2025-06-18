import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { backToTop, generalGetFunction, generalPostFunction } from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";
import { emailValidator, lengthValidator, numberValidator, requiredValidator } from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import PhoneInput, { getCountryCallingCode, parsePhoneNumber } from "react-phone-number-input";

const BuyerAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState();
  const [additionalBuyerPhNumbers, setAdditionalBuyerPhNumbers] = useState([]);
  const [bulkAddPopUp,setBulkAddPopUp] = useState(false)
  const [bulkAddBuyersList, setBulkAddBuyersList] = useState([])


  const { watch, register, formState: { errors }, reset, handleSubmit, setValue } = useForm();

  // Handle Buyer Add
  const handleFormSubmit = handleSubmit(async (data) => {
    setLoading(true);

    const phoneNumber = parsePhoneNumber(data.phone_number);
    const parsedNumber = phoneNumber?.nationalNumber;
    const parsedAltNumber = parsePhoneNumber(data.alt_phone)?.nationalNumber;

    const payload = { ...data, phone_number: parsedNumber || data.phone_number, alt_phone: parsedAltNumber || data.alt_phone, phone_code: phoneNumber?.countryCallingCode };

    const apiData = await generalPostFunction("/buyer/store", payload);
    if (apiData?.status) {
      setLoading(false);
      reset();
      navigate('/buyers');
      toast.success(apiData.message);
    } else {
      setLoading(false);
    }
  });

  // Fetch all countries
  const fetchAllCountry = async () => {
    setLoading(true);
    if (!countryCode) {
      try {
        const apiData = await generalGetFunction("/available-countries");
        if (apiData?.status) {
          setCountryCode(apiData.data);
          setLoading(false);
          setTimeout(() => setValue("country_code", "US"), 100)
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    fetchAllCountry();
  }, [])

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
              <Header title="Add buyer" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>Add Buyer</h4>
                          <p>Add buyers</p>
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
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a alt phone number.
                            </label>
                          </div>
                          <div className="col-6">
                            <input type="text"
                              className="formItem d-none"
                              {...register("alt_phone")}
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
                              Email
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a Email id .
                            </label>
                          </div>
                          <div className="col-6">
                            <input type="text"
                              className="formItem"
                              {...register("email", {
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
                              Address
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a address .
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              className="formItem"
                              {...register("address")}
                            />
                            {errors.address && (
                              <ErrorMessage text={errors.address.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              City
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a City .
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              className="formItem"
                              {...register("city")}
                            />
                            {errors.city && (
                              <ErrorMessage text={errors.city.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              State
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a State .
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              className="formItem"
                              {...register("state")}
                            />
                            {errors.state && (
                              <ErrorMessage text={errors.state.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              Province
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a province.
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              className="formItem"
                              {...register("province")}
                            />
                            {errors.province && (
                              <ErrorMessage text={errors.province.message} />
                            )}
                          </div>
                        </div>

                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              Postal code
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a postal code
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              className="formItem"
                              {...register("postal_code")}
                            />
                            {errors.postal_code && (
                              <ErrorMessage text={errors.postal_code.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>
                              Country Code
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a country code
                            </label>
                          </div>
                          <div className="col-6">
                            <select {...register("country_code")} className="formItem">
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
                        <div className="col-12 mt-3" style={{ borderTop: '1px solid var(--border-color)' }}></div>
                        <div className="heading bg-transparent border-bottom-0 px-0 pb-0">
                          <div className="content">
                            <h4>List of Additional Phone Numbers</h4>
                            <p>You can see the list of additional numbers.</p>
                          </div>
                          <div className="buttonGroup">
                            <button
                              type="button"
                              className="panelButton"
                              onClick={() => {
                                if (additionalBuyerPhNumbers?.data?.length !== bulkAddBuyersList.length)
                                  setBulkAddPopUp(true);
                                else toast.warn("All agent selected");
                              }}
                            >
                              <span className="text">Add</span>
                              <span className="icon">
                                <i className="fa-solid fa-plus"></i>
                              </span>
                            </button>
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
  );
};

export default BuyerAdd;
