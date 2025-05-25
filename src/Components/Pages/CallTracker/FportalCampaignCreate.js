import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { generalGetFunction, generalPostFunction } from "../../GlobalFunction/globalFunction";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import { numberValidator, requiredValidator } from "../../validations/validation";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";

function FportalCampaignCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [stepSelector, setStepSelector] = useState(1);
  const [completedStep, setCompletedStep] = useState(0);

  const [campaignId, setCampaignId] = useState('');
  const [allBuyers, setAllBuyers] = useState([]);


  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    setValue: setValueStep1,
    watch: watchStep1,
    formState: { errors: errorsStep1 },
  } = useForm();

  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    formState: { errors: errorsStep2 },
  } = useForm();

  const handleFormSubmitStepOne = handleSubmitStep1(async (data) => {
    setLoading(true);

    const phoneNumber = parsePhoneNumber(data.pstn_number);
    const parsedNumber = phoneNumber?.nationalNumber;

    const payload = { ...data, country_prefix: phoneNumber?.countryCallingCode, pstn_number: parsedNumber };
    const apiData = await generalPostFunction("/fcampaign/store", payload);
    if (apiData?.status) {

      toast.success(apiData.message);
      setCampaignId(apiData.data.id);
      setCompletedStep(1);
      setStepSelector(2);

    } else {
      setLoading(false);
      toast.error(apiData?.message || apiData?.error);
    }
  })

  const handleFormSubmitStepTwo = handleSubmitStep2(async (data) => {
    setLoading(true);
    const payload = { ...data, fportal_campaign_id: campaignId };
    const apiData = await generalPostFunction("/fportal/store", payload);
    if (apiData?.status) {
      setLoading(false);
      toast.success(apiData.message);
      setCompletedStep(1);
      navigate('/call-forwarding-campaign');
    } else {
      setLoading(false);
      toast.error(apiData?.message || apiData?.error);
    }
  })

  const getAllBuyers = async () => {
    setLoading(true);
    const response = await generalGetFunction('buyer/all');
    if (response.status) {
      setAllBuyers(response.data);
      setLoading(false);
    } else {
      toast.error(response.message);
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    getAllBuyers();
  }, [])

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Forwarding portal" />
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Forwarding portal</h4>
                        <p>You can see all list of Forwarding portal</p>
                      </div>
                      <div className="buttonGroup">
                        <button effect="ripple" className="panelButton gray">
                          <span className="text">Back</span>
                          <span className="icon">
                            <i className="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        <button
                          type="button"
                          className="panelButton"
                          onClick={() => {
                            if (completedStep === 0) {
                              handleFormSubmitStepOne();
                            } else if (completedStep === 1) {
                              handleFormSubmitStepTwo();
                            }
                          }}
                        >
                          <span className="text" >{completedStep === 1 ? 'Save' : 'Next'}</span>
                          <span className="icon">
                            <i className={`fa-solid fa-${completedStep === 1 ? 'floppy-disk' : 'caret-right'}`}></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-12" style={{ padding: '25px 23px' }}>
                    <div className="row">
                      <div className="col-xl-2 col-3">
                        <div className='someTempDialerDesign'>
                          <ul>
                            <li className={stepSelector === 1 && 'active'} onClick={() => setStepSelector(1)}>
                              <div className={completedStep > 0 ? 'numberHolder completed' : "numberHolder"}>
                                1
                              </div>
                              <div className='textHolder'>
                                <h3>General Settings</h3>
                              </div>
                            </li>
                            <li className={stepSelector === 2 && 'active'} onClick={() => {
                              setStepSelector(2)
                            }}>
                              <div className={completedStep > 1 ? 'numberHolder completed' : "numberHolder"}>
                                2
                              </div>
                              <div className='textHolder'>
                                <h3>Dialer Settings</h3>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {stepSelector === 1 && <>
                        <div className="col-xl-8 col-9" style={{ borderLeft: '1px solid var(--border-color)', padding: '0 30px' }}>
                          <form className="row mb-0">
                            <div className="formRow">
                              <div className='formLabel'>
                                <label>
                                  Campaign Name
                                </label>
                              </div>
                              <div className='col-6'>
                                <input
                                  type="text"
                                  className="formItem"
                                  {...registerStep1("campaign_name", {
                                    ...requiredValidator,
                                  })}
                                />
                                {errorsStep1.campaign_name && (
                                  <ErrorMessage text={errorsStep1.campaign_name.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow">
                              <div className='formLabel'>
                                <label>
                                  Buyer
                                </label>
                              </div>
                              <div className='col-6'>
                                <select className="formItem" {...registerStep1("buyer_id", { ...requiredValidator, })}>
                                  <option>Choose Buyer</option>
                                  {
                                    allBuyers && allBuyers.length > 0 ? allBuyers.map((buyer) => (
                                      <option key={buyer.id} value={buyer.id}>{buyer.name}</option>
                                    )) : null
                                  }
                                </select>
                                {errorsStep1.buyer_id && (
                                  <ErrorMessage text={errorsStep1.buyer_id.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow">
                              <div className='formLabel'>
                                <label>
                                  Agent Name
                                </label>
                              </div>
                              <div className='col-6'>
                                <input
                                  type="text"
                                  className="formItem"
                                  {...registerStep1("agent_name", {
                                    ...requiredValidator,
                                  })}
                                />
                                {errorsStep1.agent_name && (
                                  <ErrorMessage text={errorsStep1.agent_name.message} />
                                )}
                              </div>
                            </div>

                            <div className="formRow">
                              <div className="formLabel">
                                <label>
                                  PSTN number{" "}
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                              <div className="col-6">
                                <input type="text"
                                  className="formItem d-none"
                                  {...registerStep1("pstn_number", { ...requiredValidator })}
                                />
                                <PhoneInput
                                  defaultCountry="US"
                                  placeholder="Enter phone number"
                                  limitMaxLength={true}
                                  value={watchStep1("pstn_number")}
                                  onChange={(value) => setValueStep1("pstn_number", value)}
                                />
                                {errorsStep1.pstn_number && (
                                  <ErrorMessage text={errorsStep1.pstn_number.message} />
                                )}
                              </div>
                            </div>

                            <div className="formRow">
                              <div className='formLabel'>
                                <label>
                                  Total Send Call
                                </label>
                              </div>
                              <div className='col-6'>
                                <input
                                  type="text"
                                  className="formItem"
                                  {...registerStep1("total_send_call", {
                                    ...requiredValidator, ...numberValidator,
                                  })}
                                />
                                {errorsStep1.total_send_call && (
                                  <ErrorMessage text={errorsStep1.total_send_call.message} />
                                )}
                              </div>
                            </div>
                          </form>
                        </div>
                      </>}
                      {stepSelector === 2 && <>
                        <div className='col-xl-9 col-9' style={{ borderLeft: '1px solid var(--border-color)', padding: '0 30px' }}>
                          <form className="row mb-0" onSubmit={handleFormSubmitStepTwo}>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label className='fw-bold' style={{ fontSize: 'initial' }}>
                                  Forward Type
                                </label>
                              </div>
                              <div className='col-6'>
                                <select defaultValue={"pstn"} className='formItem'
                                  {...registerStep2("forward_type", {
                                    ...requiredValidator,
                                  })}
                                >
                                  <option value="pstn">PSTN</option>
                                  <option value="trunk">Trunk</option>
                                </select>
                                {errorsStep2.forward_type && (
                                  <ErrorMessage text={errorsStep2.forward_type.message} />
                                )}
                              </div>
                            </div>
                            <div></div>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>Forwarding Portal Name</label>
                              </div>
                              <div className='col-6'>
                                <input type='text' className='formItem'
                                  {...registerStep2("f_name", {
                                    ...requiredValidator,
                                  })} />
                                {errorsStep2.f_name && (
                                  <ErrorMessage text={errorsStep2.f_name.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>
                                  Active Hours
                                </label>
                              </div>
                              <div className='col-6'>
                                <input type='number' className='formItem'
                                  {...registerStep2("active_hours", {
                                    ...requiredValidator,
                                    ...numberValidator,
                                  })} />
                                {errorsStep2.active_hours && (
                                  <ErrorMessage text={errorsStep2.active_hours.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>
                                  Start Day
                                </label>
                              </div>
                              <div className='col-6'>
                                <input type='number' className='formItem'  {...registerStep2("start_day", {
                                  ...requiredValidator,
                                  ...numberValidator,
                                })} />
                                {errorsStep2.start_day && (
                                  <ErrorMessage text={errorsStep2.start_day.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>
                                  End Day
                                </label>
                              </div>
                              <div className='col-6'>
                                <input type='number' className='formItem'  {...registerStep2("end_day", {
                                  ...requiredValidator,
                                  ...numberValidator,
                                })} />
                                {errorsStep2.end_day && (
                                  <ErrorMessage text={errorsStep2.end_day.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>
                                  Monthly Call Limit
                                </label>
                              </div>
                              <div className='col-6'>
                                <input type='number' className='formItem'
                                  {...registerStep2("monthly_call_limit", {
                                    ...requiredValidator,
                                    ...numberValidator,
                                  })} />
                                {errorsStep2.monthly_call_limit && (
                                  <ErrorMessage text={errorsStep2.monthly_call_limit.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>
                                  Daily Call Limit
                                </label>
                              </div>
                              <div className='col-6'>
                                <input type='number' className='formItem'  {...registerStep2("daily_call_limit", {
                                  ...requiredValidator,
                                  ...numberValidator,
                                })} />
                                {errorsStep2.daily_call_limit && (
                                  <ErrorMessage text={errorsStep2.daily_call_limit.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>
                                  Live Call Limit
                                </label>
                              </div>
                              <div className='col-6'>
                                <input type='number' className='formItem'  {...registerStep2("live_call_limit", {
                                  ...requiredValidator,
                                  ...numberValidator,
                                })} />
                                {errorsStep2.live_call_limit && (
                                  <ErrorMessage text={errorsStep2.live_call_limit.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>
                                  Priority
                                </label>
                              </div>
                              <div className='col-6'>
                                <input type='number' className='formItem'  {...registerStep2("priority", {
                                  ...requiredValidator,
                                  ...numberValidator,
                                })} />
                                {errorsStep2.priority && (
                                  <ErrorMessage text={errorsStep2.priority.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>
                                  Total Send Call
                                </label>
                              </div>
                              <div className='col-6'>
                                <input type='number' className='formItem'  {...registerStep2("total_send_call", {
                                  ...requiredValidator,
                                  ...numberValidator,
                                })} />
                                {errorsStep2.total_send_call && (
                                  <ErrorMessage text={errorsStep2.total_send_call.message} />
                                )}
                              </div>
                            </div>
                          </form>
                        </div>
                      </>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default FportalCampaignCreate;
