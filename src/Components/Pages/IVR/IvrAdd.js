import React, { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header';
import { backToTop, generalGetFunction } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import {
  emailValidator,
  lengthValidator,
  noSpecialCharactersValidator,
  requiredValidator,
  restrictToAllowedChars,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";

function IvrAdd() {
  const {
    register,
    watch,
    setError,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ivrMusic,setIvrMusic] = useState([])
useEffect(( ) => {
  async function getData() {
    const apiData = await generalGetFunction("/sound/all?type=ivr");
    if (apiData.status) {
      setIvrMusic(apiData.data);
    }
   
  }
  getData()
},[])
console.log("ivr",ivrMusic);

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="IVR Add" />
          <div id="subPageHeader">
            <div className="col-xl-9 my-auto">
              <p className="mb-0">Add an IVR</p>
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
                  Back
                </button>
                <button
                  effect="ripple"
                  className="panelButton"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-12" style={{ overflow: "auto" }}>
          <div className="mx-2" id="detailsContent">
            <form action="#" className="row">
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Name</label>
                  {/* <label htmlFor="mail_driver" className="formItemDesc">
                    Select Mail Driver Type
                  </label> */}
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="mail_host"
                    className="formItem"
                    {...register("ivr_name", {
                      ...requiredValidator,
                      ...noSpecialCharactersValidator,
                    })}
                  />
                    {errors.ivr_name && (
                      <ErrorMessage text={errors.ivr_name.message} />
                    )}
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Type</label>
                  <label htmlFor="mail_host" className="formItemDesc">
                    Select the type of IVR
                  </label>
                </div>
                <div className="col-6">
                  <select className="formItem"  {...register("ivr_type", {
                      ...requiredValidator,
                    })}>
                    <option value="1">Master</option>
                    <option value="0">Child</option>
                  </select>
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Greet Sound </label>
                  <label htmlFor="mail_host" className="formItemDesc">
                    Upload a greet when entering the menu.
                  </label>
                </div>
                <div className="col-6">
                  <select className="formItem"  {...register("greet_long", {
                      ...requiredValidator,
                    })}>
                    <option disabled>Select greet sound</option>
                    {ivrMusic?.map((item) => {
                      return (
                        <option value={item?.id}>{item?.name}</option>
                      )
                    })}
                  </select>
                </div>
              </div>

              {/* <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Greet Sound (Short)</label>
                  <label htmlFor="mail_host" className="formItemDesc">
                    Upload a short greet when entering the menu.
                  </label>
                </div>
                <div className="col-6">
                  <select className="formItem">
                    <option value="">Select</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                  </select>
                </div>
              </div> */}

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Invalid Sound</label>
                  <label htmlFor="mail_host" className="formItemDesc">
                    Upload an invalid sound.
                  </label>
                </div>
                <div className="col-6">
                  <select className="formItem"  {...register("invalid_sound", {
                      ...requiredValidator,
                    })}>
                    <option disabled>Select invalid sound</option>
                    {ivrMusic?.map((item) => {
                      return (
                        <option value={item?.id}>{item?.name}</option>
                      )
                    })}
                  </select>
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Exit Sound</label>
                  <label htmlFor="mail_host" className="formItemDesc">
                    Select the exit action to be performed if the ivr exists.
                  </label>
                </div>
                <div className="col-6">
                  <select className="formItem" {...register("exit_sound", {
                      ...requiredValidator,
                    })}>
                    <option disabled>Select Exit Sound</option>
                    {ivrMusic?.map((item) => {
                      return (
                        <option value={item?.id}>{item?.name}</option>
                      )
                    })}
                  </select>
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Confirm Macro</label>
                  {/* <label htmlFor="mail_port" className="formItemDesc">
                    Enter Mail Port
                  </label> */}
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="mail_host"
                    className="formItem"
                    {...register("confirm_macro", {
                      ...requiredValidator,
                      ...noSpecialCharactersValidator,
                    })}
                  />
                    {errors.confirm_macro && (
                      <ErrorMessage text={errors.confirm_macro.message} />
                    )}
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Confirm Key</label>
                  {/* <label htmlFor="mail_port" className="formItemDesc">
                    Enter Mail Port
                  </label> */}
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="mail_host"
                    className="formItem"
                    {...register("confirm_key", {
                      ...requiredValidator,
                      ...noSpecialCharactersValidator,
                    })}
                  />
                    {errors.confirm_key && (
                      <ErrorMessage text={errors.confirm_key.message} />
                    )}
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">TTS Engine</label>
                  {/* <label htmlFor="mail_port" className="formItemDesc">
                    Enter Mail Port
                  </label> */}
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="mail_host"
                    className="formItem"
                    {...register("confirm_macro", {
                      ...requiredValidator,
                      ...noSpecialCharactersValidator,
                    })}
                  />
                    {errors.confirm_macro && (
                      <ErrorMessage text={errors.confirm_macro.message} />
                    )}
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">TTS Voice</label>
                  {/* <label htmlFor="mail_port" className="formItemDesc">
                    Enter Mail Port
                  </label> */}
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="mail_host"
                    className="formItem"
                    {...register("confirm_macro", {
                      ...requiredValidator,
                      ...noSpecialCharactersValidator,
                    })}
                  />
                    {errors.confirm_macro && (
                      <ErrorMessage text={errors.confirm_macro.message} />
                    )}
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Confirm Attempts</label>
                  <label htmlFor="mail_port" className="formItemDesc">
                    Enter number of confirm attempts
                  </label>
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    name="mail_host"
                    className="formItem"
                    {...register("confirm_macro", {
                      ...requiredValidator,
                      ...noSpecialCharactersValidator,
                    })}
                  />
                    {errors.confirm_macro && (
                      <ErrorMessage text={errors.confirm_macro.message} />
                    )}
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Timeout</label>
                  <label htmlFor="mail_port" className="formItemDesc">
                    Enter the number of miliseconds to wait after playing the greeting or the confirm macro.
                  </label>
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    name="mail_host"
                    className="formItem"
                    {...register("confirm_macro", {
                      ...requiredValidator,
                      ...noSpecialCharactersValidator,
                    })}
                  />
                    {errors.confirm_macro && (
                      <ErrorMessage text={errors.confirm_macro.message} />
                    )}
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Max Failure</label>
                  <label htmlFor="mail_port" className="formItemDesc">
                    Enter max failure
                  </label>
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    name="mail_host"
                    className="formItem"
                    {...register("confirm_macro", {
                      ...requiredValidator,
                      ...noSpecialCharactersValidator,
                    })}
                  />
                    {errors.confirm_macro && (
                      <ErrorMessage text={errors.confirm_macro.message} />
                    )}
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Max Timeout</label>
                  <label htmlFor="mail_port" className="formItemDesc">
                    Enter max timeout in miliseconds
                  </label>
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    name="mail_host"
                    className="formItem"
                    {...register("confirm_macro", {
                      ...requiredValidator,
                      ...noSpecialCharactersValidator,
                    })}
                  />
                    {errors.confirm_macro && (
                      <ErrorMessage text={errors.confirm_macro.message} />
                    )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

export default IvrAdd
