import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import {
  backToTop,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  noSpecialCharactersValidator,
  requiredValidator,
  restrictToAllowedChars,
  restrictToNumbersAndStar,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";
import { useDispatch, useSelector } from "react-redux";

function IvrEdit() {
  const dispatch = useDispatch();
  const location = useLocation();
  const id = location.state;
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ivrMusic, setIvrMusic] = useState([]);
  const ivrRefresh = useSelector((state) => state.ivrRefresh);

  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction("/sound/all?type=ivr");
      const iverData = await generalGetFunction(`/ivr-master/show/${id}`);
      if (apiData.status) {
        setIvrMusic(apiData.data);
      }
      if (iverData.status) {
        setLoading(false);
        reset(iverData.data);
      }
    }
    if (id) {
      getData();
    } else {
      navigate(-1);
    }
  }, []);

  const handleFormSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const apiData = await generalPutFunction(`/ivr-master/update/${id}`, data);
    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message);

      // after succesfully editing data need to recall the global function to update the global state
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

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="IVR Edit" />
          {/* <div id="subPageHeader">
            <div className="col-xl-9 my-auto">
              <p className="mb-0">Edit this IVR</p>
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
          <div className="overviewTableWrapper">
            <div className="overviewTableChild">
              <div className="d-flex flex-wrap">
                <div className="col-12">
                  <div className="heading">
                    <div className="content">
                      <h4>IVR Edit</h4>
                      <p>You can configure the IVR here.</p>
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
              </div>
              <div className="col-12" style={{ padding: '25px 23px', borderBottom: '1px solid #ddd' }}>
                <form action="#" className="row">
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Name</label>
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
                      <label htmlFor="">Greet Sound </label>
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
                      >
                        <option value="">Select greet sound</option>
                        {ivrMusic?.map((item) => {
                          return <option value={item?.id}>{item?.name}</option>;
                        })}
                      </select>
                      {errors.greet_long && (
                        <ErrorMessage text={errors.greet_long.message} />
                      )}
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Invalid Sound</label>
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
                      >
                        <option value="">Select invalid sound</option>
                        {ivrMusic?.map((item) => {
                          return <option value={item?.id}>{item?.name}</option>;
                        })}
                      </select>
                      {errors.invalid_sound && (
                        <ErrorMessage text={errors.invalid_sound.message} />
                      )}
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
                      <select
                        className="formItem"
                        {...register("exit_sound", {
                          ...requiredValidator,
                        })}
                      >
                        <option value="">Select Exit Sound</option>
                        {ivrMusic?.map((item) => {
                          return <option value={item?.id}>{item?.name}</option>;
                        })}
                      </select>
                      {errors.exit_sound && (
                        <ErrorMessage text={errors.exit_sound.message} />
                      )}
                    </div>
                  </div>

                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Confirm Macro</label>
                    </div>
                    <div className="col-6">
                      <input
                        type="text"
                        name="mail_host"
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
                      <label htmlFor="">Confirm Attempts</label>
                      <label htmlFor="mail_port" className="formItemDesc">
                        Enter number of confirm attempts
                      </label>
                    </div>
                    <div className="col-6">
                      <select
                        type="number"
                        name="mail_host"
                        className="formItem"
                        {...register("confirm_attempts", {
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
                      {errors.confirm_attempts && (
                        <ErrorMessage text={errors.confirm_attempts.message} />
                      )}
                    </div>
                  </div>

                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Timeout</label>
                      <label htmlFor="mail_port" className="formItemDesc">
                        Enter the number of miliseconds to wait after playing the
                        greeting or the confirm macro.
                      </label>
                    </div>
                    <div className="col-6">
                      <input
                        type="number"
                        name="mail_host"
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
                      <input
                        type="number"
                        name="mail_host"
                        className="formItem"
                        {...register("max_failures", {
                          ...requiredValidator,
                          ...noSpecialCharactersValidator,
                        })}
                      />
                      {errors.max_failures && (
                        <ErrorMessage text={errors.max_failures.message} />
                      )}
                    </div>
                  </div>

                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Inter Digit Timeout</label>
                      <label htmlFor="mail_port" className="formItemDesc">
                        This is the time in milliseconds to wait before playing the
                        prompt again if no input is received.
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
                      {errors.min_digit && <ErrorMessage text={errors.min_digit} />}
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
                      {errors.max_digit && <ErrorMessage text={errors.max_digit} />}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>


        </div>
      </section>
      {loading ? (
        <div colSpan={99}>
          <CircularLoader />
        </div>
      ) : (
        ""
      )}
    </main>
  );
}

export default IvrEdit;
