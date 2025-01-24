/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-mixed-operators */
import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  noSpecialCharactersValidator,
  requiredValidator,
  restrictToAllowedChars,
  restrictToNumbersAndStar,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import SkeletonFormLoader from "../../Loader/SkeletonFormLoader";
import AddMusic from "../../CommonComponents/AddMusic";

function IvrAdd() {
  const dispatch = useDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ivrMusic, setIvrMusic] = useState([]);
  const ivrRefresh = useSelector((state) => state.ivrRefresh);
  const [showMusicGreet, setShowMusicGreet] = useState(false);
  const [uploadedMusicGreet, setUploadedMusicGreet] = useState();
  const [musicRefreshGreet, setMusicRefreshGreet] = useState(0);
  const [showMusicInvalid, setShowMusicInvalid] = useState(false);
  const [uploadedMusicInvalid, setUploadedMusicInvalid] = useState();
  const [musicRefreshInvalid, setMusicRefreshInvalid] = useState(0);
  const [showMusicExit, setShowMusicExit] = useState(false);
  const [uploadedMusicExit, setUploadedMusicExit] = useState();
  const [musicRefreshExit, setMusicRefreshExit] = useState(0);
  useEffect(() => {
    async function getData() {
      setLoading(true);
      const apiData = await generalGetFunction("/sound/all?type=ivr");
      if (apiData.status) {
        setIvrMusic(apiData.data);
        if (apiData.data.length > 0 && uploadedMusicGreet) {
          setValue("greet_long", `${uploadedMusicGreet.id}`);
        }
        if (apiData.data.length > 0 && uploadedMusicInvalid) {
          setValue("invalid_sound", `${uploadedMusicInvalid.id}`);
        }
        if (apiData.data.length > 0 && uploadedMusicExit) {
          setValue("exit_sound", `${uploadedMusicExit.id}`);
        }
        setLoading(false);
      }
      setLoading(false);
    }

    // set the predefauls values for selected fields in the form
    reset({
      timeout: 10000,
      inter_digit_timeout: 2000,
      min_digit: "1",
      max_digit: "1",
      max_failures: "3",
      confirm_macro: "#",
    });

    getData();
  }, [musicRefreshExit, musicRefreshGreet, musicRefreshInvalid]);
  console.log(watch());
  const handleFormSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      confirm_macro:
        data.confirm_macro === data.confirm_macro.length < 1
          ? "#"
          : data.confirm_macro,
    };
    setLoading(true);
    // const apiData = await generalPostFunction("/ivr-master/store", data);
    const apiData = await generalPostFunction("/ivr-master/store", payload);
    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message);

      // after succesfully adding data need to recall the global function to update the global state
      dispatch({
        type: "SET_IVRREFRESH",
        ivrRefresh: ivrRefresh + 1,
      });
      reset();
      navigate(-1);
    } else {
      setLoading(false);
    }
  });
  const handleAddMusicGreet = () => {
    setValue("greet_long", "");
    setShowMusicGreet(true);
  };
  const handleAddMusicInvalid = () => {
    setValue("invalid_sound", "");
    setShowMusicInvalid(true);
  };
  const handleAddMusicExit = () => {
    setValue("exit_sound", "");
    setShowMusicExit(true);
  };
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="IVR" />
          {/* <div id="subPageHeader">
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

        <div className="col-xl-12" style={{ overflow: "auto" }}>
          {loading ? (
            <div colSpan={99}>
              <SkeletonFormLoader />
            </div>
          ) : (
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>IVR Add</h4>
                        <p>You can add a new IVR here.</p>
                      </div>
                      <div className="buttonGroup">
                        <button
                          onClick={() => {
                            navigate(-1);
                            backToTop();
                          }}
                          type="button"
                          effect="ripple"
                          className="panelButton gray"
                        >
                          <span className="text">Back</span>
                          <span className="icon">
                            <i class="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        <button
                          effect="ripple"
                          className="panelButton"
                          onClick={handleFormSubmit}
                        >
                          <span className="text">Save</span>
                          <span className="icon">
                            <i class="fa-solid fa-floppy-disk"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="col-12 formScroller"
                  style={{ padding: "25px 23px" }}
                >
                  <form action="#" className="row">
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Name</label>
                        {/* <label htmlFor="mail_driver" className="formItemDesc">
          <div className="overviewTableWrapper">
            <div className="overviewTableChild">
              <div className="d-flex flex-wrap">
                <div className="col-12">
                  <div className="heading">
                    <div className="content">
                      <h4>IVR Add</h4>
                      <p>You can add a new IVR here.</p>
                    </div>
                    <div className="buttonGroup">
                      <button
                        onClick={() => {
                          navigate(-1);
                          backToTop();
                        }}
                        type="button"
                        effect="ripple"
                        className="panelButton gray"
                      >
                        <span className="text">Back</span>
                        <span className="icon">
                          <i class="fa-solid fa-caret-left"></i>
                        </span>
                      </button>
                      <button
                        effect="ripple"
                        className="panelButton"
                        onClick={handleFormSubmit}
                      >
                        <span className="text">Save</span>
                        <span className="icon">
                          <i class="fa-solid fa-floppy-disk"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-12 formScroller"
                style={{ padding: "25px 23px", borderBottom: "1px solid #ddd" }}
              >
                <form action="#" className="row">
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">
                        Name <span className="text-danger">*</span>
                      </label>
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
                          onKeyDown={restrictToAllowedChars}
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
                        <select
                          className="formItem"
                          {...register("ivr_type", {
                            ...requiredValidator,
                          })}
                        >
                          <option value="1">Master</option>
                          <option value="0">Child</option>
                        </select>
                      </div>
                    </div>

                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">
                          Greet Sound <span className="text-danger">*</span>
                        </label>
                        <label htmlFor="mail_host" className="formItemDesc">
                          Upload a greet when entering the menu.
                        </label>
                      </div>
                      <div className="col-6">
                        <select
                          className="formItem"
                          {...register("greet_long", {
                            ...requiredValidator,
                          })}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            if (selectedValue === "add-music") {
                              handleAddMusicGreet(); // Call your function here
                            }
                          }}
                        >
                          <option value="">Select greet sound</option>
                          {ivrMusic?.map((item) => {
                            return (
                              <option value={item?.id}>{item?.name}</option>
                            );
                          })}
                          <option
                            value="add-music"
                            className="bg-primary text-center text-white"
                          >
                            Add Music
                          </option>
                        </select>
                        {errors.greet_long && (
                          <ErrorMessage text={errors.greet_long.message} />
                        )}
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">
                          Invalid Sound <span className="text-danger">*</span>
                        </label>
                        <label htmlFor="mail_host" className="formItemDesc">
                          Upload an invalid sound.
                        </label>
                      </div>
                      <div className="col-6">
                        <select
                          className="formItem"
                          {...register("invalid_sound", {
                            ...requiredValidator,
                          })}
                          defaultValue={""}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            if (selectedValue === "add-music") {
                              handleAddMusicInvalid(); // Call your function here
                            }
                          }}
                        >
                          <option value="" disabled>
                            Select invalid sound
                          </option>
                          {ivrMusic?.map((item) => {
                            return (
                              <option value={item?.id}>{item?.name}</option>
                            );
                          })}
                          <option
                            value="add-music"
                            className="bg-primary text-center text-white"
                          >
                            Add Music
                          </option>
                        </select>
                        {errors.invalid_sound && (
                          <ErrorMessage text={errors.invalid_sound.message} />
                        )}
                      </div>
                    </div>

                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">
                          Exit Sound <span className="text-danger">*</span>
                        </label>
                        <label htmlFor="mail_host" className="formItemDesc">
                          Select the exit action to be performed if the ivr
                          exists.
                        </label>
                      </div>
                      <div className="col-6">
                        <select
                          className="formItem"
                          {...register("exit_sound", {
                            ...requiredValidator,
                          })}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            if (selectedValue === "add-music") {
                              handleAddMusicExit(); // Call your function here
                            }
                          }}
                        >
                          <option value="">Select Exit Sound</option>
                          {ivrMusic?.map((item) => {
                            return (
                              <option value={item?.id}>{item?.name}</option>
                            );
                          })}
                          <option
                            value="add-music"
                            className="bg-primary text-center text-white"
                          >
                            Add Music
                          </option>
                        </select>
                        {errors.exit_sound && (
                          <ErrorMessage text={errors.exit_sound.message} />
                        )}
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
                          // defaultValue="#"
                          className="formItem"
                          {...register("confirm_macro", {
                            ...requiredValidator,
                            // ...noSpecialCharactersValidator,
                            ...restrictToNumbersAndStar,
                          })}
                        />
                        {errors.confirm_macro && (
                          <ErrorMessage text={errors.confirm_macro.message} />
                        )}
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">
                          Confirm Attempts{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <label htmlFor="mail_port" className="formItemDesc">
                          Enter number of confirm attempts
                        </label>
                      </div>
                      <div className="col-6">
                        <select
                          type="number"
                          defaultValue=""
                          name="mail_host"
                          className="formItem"
                          {...register("confirm_attempts", {
                            ...requiredValidator,
                            ...noSpecialCharactersValidator,
                          })}
                        >
                          <option value="" disabled>
                            Select a option
                          </option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                        </select>
                        {errors.confirm_attempts && (
                          <ErrorMessage
                            text={errors.confirm_attempts.message}
                          />
                        )}
                      </div>
                    </div>

                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Timeout</label>
                        <label htmlFor="mail_port" className="formItemDesc">
                          Enter the number of miliseconds to wait after playing
                          the greeting or the confirm macro.
                        </label>
                      </div>
                      <div className="col-6">
                        <input
                          type="number"
                          name="mail_host"
                          // defaultValue="10000"
                          className="formItem"
                          {...register("timeout", {
                            ...requiredValidator,
                            ...noSpecialCharactersValidator,
                          })}
                        />
                        {errors.timeout && (
                          <ErrorMessage text={errors.timeout.message} />
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
                        <select
                          type="number"
                          // defaultValue="3"
                          name="mail_host"
                          className="formItem"
                          {...register("max_failures", {
                            ...requiredValidator,
                            ...noSpecialCharactersValidator,
                          })}
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                        </select>
                        {/* <input
                    type="number"
                    defaultValue="3"
                    name="mail_host"
                    className="formItem"
                    {...register("max_failures", {
                      ...requiredValidator,
                      ...noSpecialCharactersValidator,
                    })}
                  /> */}
                        {errors.max_failures && (
                          <ErrorMessage text={errors.max_failures.message} />
                        )}
                      </div>
                    </div>

                    {/* <div className="formRow col-xl-3">
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
                    {...register("max_timeouts", {
                      ...requiredValidator,
                      ...noSpecialCharactersValidator,
                    })}
                  />
                    {errors.max_timeouts && (
                      <ErrorMessage text={errors.max_timeouts.message} />
                    )}
                </div>
              </div> */}

                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Inter Digit Timeout</label>
                        <label htmlFor="mail_port" className="formItemDesc">
                          This is the time in milliseconds to wait before
                          playing the prompt again if no input is received.
                        </label>
                      </div>
                      <div className="col-6">
                        <input
                          type="number"
                          name="mail_host"
                          // defaultValue="2000"
                          className="formItem"
                          {...register("inter_digit_timeout", {
                            ...requiredValidator,
                            ...noSpecialCharactersValidator,
                          })}
                        />
                        {errors.inter_digit_timeout && (
                          <ErrorMessage text={errors.inter_digit_timeout} />
                        )}
                      </div>
                    </div>

                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Min Digit</label>
                        <label htmlFor="mail_port" className="formItemDesc">
                          Enter minimum number of digit
                        </label>
                      </div>
                      <div className="col-6">
                        <select
                          type="number"
                          name="mail_host"
                          // defaultValue="1"
                          className="formItem"
                          {...register("min_digit", {
                            ...requiredValidator,
                            ...noSpecialCharactersValidator,
                          })}
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                        </select>
                        {/* <input
                    type="number"
                    name="mail_host"
                    defaultValue="1"
                    className="formItem"
                    {...register("min_digit", {
                      ...requiredValidator,
                      ...noSpecialCharactersValidator,
                    })}
                  /> */}
                        {errors.min_digit && (
                          <ErrorMessage text={errors.min_digit} />
                        )}
                      </div>
                    </div>

                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Max Digit</label>
                        <label htmlFor="mail_port" className="formItemDesc">
                          Enter maximum number of digit
                        </label>
                      </div>
                      <div className="col-6">
                        <select
                          // defaultValue="1"
                          type="number"
                          name="mail_host"
                          className="formItem"
                          {...register("max_digit", {
                            ...requiredValidator,
                            ...noSpecialCharactersValidator,
                          })}
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                        </select>
                        {/* <input
                    defaultValue="1"
                    type="number"
                    name="mail_host"
                    className="formItem"
                    {...register("max_digit", {
                      ...requiredValidator,
                      ...noSpecialCharactersValidator,
                    })}
                  /> */}
                        {errors.max_digit && (
                          <ErrorMessage text={errors.max_digit} />
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      {showMusicGreet && (
        <AddMusic
          show={showMusicGreet}
          setShow={setShowMusicGreet}
          setUploadedMusic={setUploadedMusicGreet}
          setMusicRefresh={setMusicRefreshGreet}
          musicRefresh={musicRefreshGreet}
          listArray={["ivr"]}
        />
      )}
      {showMusicInvalid && (
        <AddMusic
          show={showMusicInvalid}
          setShow={setShowMusicInvalid}
          setUploadedMusic={setUploadedMusicInvalid}
          setMusicRefresh={setMusicRefreshInvalid}
          musicRefresh={musicRefreshInvalid}
          listArray={["ivr"]}
        />
      )}
      {showMusicExit && (
        <AddMusic
          show={showMusicExit}
          setShow={setShowMusicExit}
          setUploadedMusic={setUploadedMusicExit}
          setMusicRefresh={setMusicRefreshExit}
          musicRefresh={musicRefreshExit}
          listArray={["ivr"]}
        />
      )}
    </main>
  );
}

export default IvrAdd;
