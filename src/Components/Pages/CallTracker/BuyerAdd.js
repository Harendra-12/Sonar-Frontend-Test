import Tippy from "@tippyjs/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import Header from "../../CommonComponents/Header";
import { backToTop, generalGetFunction, generalPostFunction } from "../../GlobalFunction/globalFunction";
import CircularLoader from "../../Loader/CircularLoader";
import { emailValidator, rangeValidator, requiredValidator } from "../../validations/validation";

const BuyerAdd = () => {
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const account = state?.account;
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState();
  const [holdMusic, setHoldMusic] = useState()
  const [uploadedMusic, setUploadedMusic] = useState();
  const [musicRefresh, setMusicRefresh] = useState(0);
  const [listOfAdditionalPhNumbers, setListOfAdditionalPhNumbers] = useState([{ tag: "", number: "" }])

  const { watch, register, formState: { errors }, reset, handleSubmit, setValue } = useForm();
  // Handle Buyer Add
  const handleFormSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const phoneNumber = parsePhoneNumber(data.phone_number);
    const parsedNumber = phoneNumber?.nationalNumber;
    const parsedAltNumber = parsePhoneNumber(data?.alt_phone)?.nationalNumber;
    const record = data?.record == "true" ? true : false;
    const sticky_agent_enable = data?.sticky_agent_enable == "true" ? true : false;
    const list_of_additional_numbers = listOfAdditionalPhNumbers?.map((item) => {
      const parseNumber = parsePhoneNumber(item?.number)
      return {
        "name": item?.tag,
        "phone_code": parseNumber?.countryCallingCode,
        "phone_number": parseNumber?.nationalNumber
      }
    })

    const payload = {
      ...data,
      phone_number: parsedNumber || data.phone_number,
      alt_phone: parsedAltNumber || data.alt_phone,
      phone_code: phoneNumber?.countryCallingCode,
      record: record,
      phone_numbers: list_of_additional_numbers,
      sticky_agent_enable: sticky_agent_enable
    };

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
          setTimeout(() => setValue("country_code", "+1"), 100)
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  const getAllSounds = async () => {
    if (account && account.id) {
      setLoading(true);
      const holdMusic = await generalGetFunction("/sound/all?type=hold");
      setLoading(false);
      if (holdMusic?.status) {
        setHoldMusic(holdMusic.data);
        if (holdMusic.data.length > 0 && uploadedMusic) {
          setValue("hold_music", uploadedMusic.id);
        }
      } else {
        // navigate("/");
      }
    }
  }

  useEffect(() => {
    fetchAllCountry();
    getAllSounds()
  }, [])

  useEffect(() => {
    if (account && account.id) {
      getAllSounds()
    } else {
      setLoading(false);
      navigate("/");
    }
  }, [account, musicRefresh]);

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
              <Header title="Add buyer" />
          <div className="container-fluid">
            <div className="row">
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
                              Country Code <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a country code
                            </label>
                          </div>
                          <div className="col-6">
                            <select {...register("country_code", { ...requiredValidator })} className="formItem">
                              <option value="">Select Country Code</option>
                              {countryCode && countryCode.map((country, index) => (
                                <option key={index} value={country.prefix_code}>
                                  {country.country} ({country.country_code})
                                </option>
                              ))}
                            </select>
                            {errors.country_code && (
                              <ErrorMessage text={errors.country_code.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">Sticky Agent</label>
                            <label htmlFor="data" className="formItemDesc">
                              Select the status of Sticky Agent
                            </label>
                          </div>
                          <div
                            className={`col-${watch().sticky_agent_enable == "true" ||
                              watch().sticky_agent_enable == 1
                              ? "2 pe-2 ms-auto"
                              : "6"
                              }`}
                          >
                            {watch().sticky_agent_enable === "true" ||
                              watch().sticky_agent_enable === 1 ? (
                              <div className="formLabel">
                                <label className="formItemDesc">Status</label>
                              </div>
                            ) : (
                              ""
                            )}
                            <select
                              className="formItem"
                              name=""
                              defaultValue="false"
                              id="selectFormRow"
                              {...register("sticky_agent_enable")}
                            >
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          </div>

                          {(watch().sticky_agent_enable == true ||
                            watch().sticky_agent_enable == "true") && (
                              <div
                                className="col-2 pe-2"
                                style={{ width: "12%" }}
                              >
                                <div className="formLabel">
                                  <Tippy content="Check the duration of sticky agent">
                                    <label className="formItemDesc">
                                      Duration{" "}
                                    </label>
                                  </Tippy>
                                </div>
                                <input
                                  type="number"
                                  name="forward_to"
                                  className="formItem"
                                  {...register(
                                    "stick_agent_expires",
                                    rangeValidator(1, 99), {
                                    requiredValidator
                                  }
                                  )}
                                />
                                {errors.stick_agent_expires && (
                                  <ErrorMessage
                                    text={errors.stick_agent_expires.message}
                                  />
                                )}
                              </div>
                            )}
                          {(watch().sticky_agent_enable == true ||
                            watch().sticky_agent_enable == "true") && (
                              <div className="col-2" style={{ width: "21.3%" }}>
                                <div className="formLabel">
                                  <label className="formItemDesc">
                                    Agent Type
                                  </label>
                                </div>
                                <select
                                  className="formItem"
                                  name=""
                                  id="selectFormRow"
                                  {...register("stick_agent_type")}
                                >
                                  <option selected="" value="last_spoken">
                                    Last Spoken
                                  </option>
                                  <option value="longest_time">
                                    Longest Time
                                  </option>
                                </select>
                              </div>
                            )}
                          {(watch().sticky_agent_enable == true ||
                            watch().sticky_agent_enable == "true") && (
                              <div
                                className="col-2 pe-2"
                                style={{ width: "12%" }}
                              >
                                <div className="formLabel">
                                  <Tippy content="Timout for the sticky agent and return to normal routing">
                                    <label className="formItemDesc">
                                      Timeout(Sec.){" "}
                                    </label>
                                  </Tippy>
                                </div>
                                <input
                                  type="number"
                                  name="forward_to"
                                  className="formItem"
                                  {...register(
                                    "sticky_agent_timeout",
                                    rangeValidator(1, 99), {
                                    requiredValidator
                                  }
                                  )}
                                />
                                {errors.stick_agent_expires && (
                                  <ErrorMessage
                                    text={errors.stick_agent_expires.message}
                                  />
                                )}
                              </div>
                            )}
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">Spam Filter</label>
                            <label htmlFor="data" className="formItemDesc">
                              Select the type of Spam Filter
                            </label>
                          </div>
                          <div className="col-6">
                            <div className="row">
                              <div
                                className={`col-${watch().spam_filter_type === "3"
                                  ? "4 pe-1 ms-auto"
                                  : "12"
                                  }`}
                              >
                                {watch().spam_filter_type != "1" && (
                                  <div className="formLabel">
                                    <label>Type</label>
                                  </div>
                                )}
                                <select
                                  className="formItem"
                                  name=""
                                  defaultValue="1"
                                  id="selectFormRow"
                                  {...register("spam_filter_type")}
                                >
                                  <option value="1">Disable</option>
                                  <option value="2">Call Screening</option>
                                  <option value="3">DTMF Input</option>
                                </select>
                              </div>
                              {watch().spam_filter_type === "3" && (
                                <>
                                  <div className="col-4 px-1">
                                    <div className="formLabel">
                                      <label htmlFor="selectFormRow">
                                        Retries
                                      </label>
                                    </div>
                                    <select
                                      className="formItem"
                                      name=""
                                      id="selectFormRow"
                                      {...register("dtmf_retries")}
                                    >
                                      <option value={1}>1</option>
                                      <option value={2}>2</option>
                                      <option value={3}>3</option>
                                    </select>
                                  </div>
                                  <div className="col-4 ps-1">
                                    <div className="formLabel">
                                      <Tippy content="Input in Days, Max 5">
                                        <label>
                                          Length{" "}
                                          <span
                                            style={{
                                              color: "var(--color-subtext)",
                                            }}
                                          ></span>
                                        </label>
                                      </Tippy>
                                    </div>
                                    <select
                                      className="formItem"
                                      name=""
                                      defaultValue="false"
                                      id="selectFormRow"
                                      {...register("dtmf_length")}
                                    >
                                      <option value={1}>1</option>
                                      <option value={2}>2</option>
                                      <option value={3}>3</option>
                                      <option value={4}>4</option>
                                      <option value={5}>5</option>
                                    </select>
                                  </div>
                                  <div className="col-6 pe-1">
                                    <div className="formLabel">
                                      <label>
                                        DTMF type{" "}
                                        <span
                                          style={{
                                            color: "var(--color-subtext)",
                                          }}
                                        ></span>
                                      </label>
                                    </div>
                                    <select
                                      className="formItem"
                                      name=""
                                      defaultValue="false"
                                      id="selectFormRow"
                                      {...register("dtmf_type")}
                                    >
                                      <option value="random_digit">
                                        Random Digit
                                      </option>
                                      <option value="last_caller_id_digit">
                                        Caller last digit
                                      </option>
                                    </select>
                                  </div>
                                  <div className="col-6 ps-1">
                                    <div className="formLabel">
                                      <label htmlFor="selectFormRow">
                                        Retry File
                                      </label>
                                    </div>
                                    <select
                                      className="formItem"
                                      name=""
                                      id="selectFormRow"
                                      {...register("dtmf_retry_file_sound")}
                                    >
                                      <option value={""}>None</option>
                                      {holdMusic &&
                                        holdMusic.map((ring) => {
                                          return (
                                            <option
                                              key={ring.id}
                                              value={ring.id}
                                            >
                                              {ring.name}
                                            </option>
                                          );
                                        })}
                                    </select>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">Record</label>
                            <label htmlFor="data" className="formItemDesc">
                              Save the recording.
                            </label>
                          </div>
                          <div className="col-6">
                            <select
                              className="formItem"
                              name=""
                              id="selectFormRow"
                              {...register("record")}
                              defaultValue={false}
                            >
                              <option value={true}>True</option>
                              <option value={false}>False</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-12 mt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                          <div className="heading bg-transparent border-bottom-0 px-0 pb-0">
                            <div className="content">
                              <h4>List of Additional Phone Numbers <span className="text-danger">*</span></h4>
                              <p>You can add the list of additional numbers.</p>
                            </div>
                          </div>
                          {
                            listOfAdditionalPhNumbers?.map((item, index) => {
                              return (
                                <div className=" col-xl-12" key={index}>
                                  <div className="row">
                                    <div className={`col-auto ${index == 0 ? 'mt-auto mb-1' : 'my-auto'}`}>
                                      <div className="formLabel">
                                        <label>{index + 1}.</label>
                                      </div>
                                    </div>
                                    <div className="col-3" >
                                      {
                                        index === 0 &&
                                        <div className="formLabel">
                                          <label className="formItemDesc">
                                            Tag
                                          </label>
                                        </div>
                                      }
                                      <div className="col-12">
                                        <input
                                          type="text"
                                          className="formItem"
                                          value={listOfAdditionalPhNumbers[index]?.tag || ""}
                                          onChange={(event) => {
                                            const newTag = [...listOfAdditionalPhNumbers];
                                            newTag[index].tag = event?.target?.value;
                                            setListOfAdditionalPhNumbers(newTag);
                                          }}
                                        />
                                        {errors.other_number_tag_name && (
                                          <ErrorMessage text={errors.other_number_tag_name.message} />
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-3" >
                                      {
                                        index === 0 &&
                                        <div className="formLabel">
                                          <label className="formItemDesc">
                                            Phone Number
                                          </label>
                                        </div>
                                      }
                                      <div className="col-12">

                                        <PhoneInput
                                          defaultCountry="US"
                                          placeholder="Enter phone number"
                                          limitMaxLength={true}
                                          value={listOfAdditionalPhNumbers[index]?.number || ""}
                                          onChange={(value) => {
                                            const newNumbers = [...listOfAdditionalPhNumbers];
                                            newNumbers[index].number = value;
                                            setListOfAdditionalPhNumbers(newNumbers);
                                          }}
                                        />
                                        {errors.additional_number && (
                                          <ErrorMessage text={errors.additional_number.message} />
                                        )}
                                      </div>
                                    </div>
                                    {
                                      listOfAdditionalPhNumbers?.length > 1 &&
                                      <button
                                        type="button"
                                        className="tableButton delete mx-auto"
                                        onClick={() => { setListOfAdditionalPhNumbers(listOfAdditionalPhNumbers?.filter((_, i) => i !== index)) }} >
                                        <i className="fa-solid fa-trash" />
                                      </button>
                                    }
                                  </div>
                                  {
                                    index === listOfAdditionalPhNumbers?.length - 1 &&
                                    <div className="col-3 mt-4" >
                                      <button type="button"
                                        className="panelButton"
                                        onClick={() => {
                                          if (listOfAdditionalPhNumbers[listOfAdditionalPhNumbers?.length - 1]?.number !== "") {
                                            setListOfAdditionalPhNumbers([...listOfAdditionalPhNumbers, { tag: "", number: "" }])
                                          }
                                        }}>
                                        <span className="text">Add</span>
                                        <span className="icon">
                                          <i className="fa-solid fa-plus"></i>
                                        </span>
                                      </button>
                                    </div>
                                  }
                                </div>
                              )
                            })
                          }
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
