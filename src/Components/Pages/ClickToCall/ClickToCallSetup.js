import React, { useState } from "react";
import Header from "../../CommonComponents/Header";
import { fileUploadFunction, generalPostFunction } from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { requiredValidator } from "../../validations/validation";
import ActionList from "../../CommonComponents/ActionList";
import { toast } from "react-toastify";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import CircularLoader from "../../Loader/CircularLoader";

function ClickToCallSetup() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [callFormVisible, setCallFormVisible] = useState(false)
  const [name, setName] = useState("")
  const [number, setNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [newFile, setNewFile] = useState(null);
  const [popUp, setPopUp] = useState(false);
  const [embededCode, setEmbededCode] = useState("")
  const [widgetExpanded,setWidgetExpanded] = useState(true)

  // Handle selected image to display it to the user
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Read the file for display purposes
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result); // Set the base64 data of the image
      };
      reader.readAsDataURL(file);
    }
  };

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const actionListValue = (value) => {
    setValue("action", value[0]);
  };

  // Handle form submit
  async function handleWidgetSubmit() {
    if (!newFile) {
      toast.error("Please upload logo")
      return
    }
    if (watch().name === "") {
      toast.error("Please enter a name")
      return
    }
    if (watch().description === "") {
      toast.error("Please enter a description")
      return
    }
    if (!watch().action) {
      toast.error("Please select an action")
      return
    }
    if (watch().usages === "") {
      toast.error("Please select an usage")
      return
    }
    setLoading(true);
    const parsedData = new FormData();
    parsedData.append("logo", newFile);
    parsedData.append("company_name", watch().name);
    parsedData.append("description", watch().description);
    parsedData.append("action", watch().action);
    parsedData.append("usages", watch().usages);
    parsedData.append("primary_color", watch().color);
    // parsedData.append("embed_code", watch().embed_code);
    const apiData = await fileUploadFunction("/click-to-call/store", parsedData);
    if (apiData?.status) {
      toast.success(apiData.message);
      setLoading(false);
      setPopUp(true);
      setEmbededCode(apiData.data.embedded_code)
    } else {
      setLoading(false);
    }
  }

  // Submit Click to call api for testing 
  async function handleSubmits() {
    if (number === "") {
      toast.error("Please enter number")
    } else if (number < 99999999) {
      toast.error("Please enter valid number")
    } else {
      const parsedData = {
        destination: number
      }
      const apiData = await generalPostFunction("/freeswitch/click-to-call", parsedData)
      if (apiData.status) {
        toast.success(apiData.message)
      }
    }
  }

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Click to Call Setup" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4> Widget Configuration</h4>
                          <p>
                            Setup your widget by choosing appropriate
                            configurations.
                          </p>
                        </div>
                        <div className="buttonGroup">
                          <button type="button" effect="ripple" className="panelButton gray" onClick={() => navigate(-1)}>
                            <span className="text">Back</span>
                            <span className="icon">
                              <i className="fa-solid fa-caret-left" />
                            </span>
                          </button>
                          <button type="button" className="panelButton" onClick={handleWidgetSubmit}>
                            <span className="text">Save</span>
                            <span className="icon">
                              <i className="fa-solid fa-floppy-disk" />
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="wizard-form">
                    <div className="tawk-margin-auto tawk-width-100">
                      <div className="tawk-wizard-chat-form">
                        <div className="tawk-flex tawk-flex-wrap tawk-flex-large-gap tawk-margin-xlarge-top">
                          <form className="tangoNavs">
                            <nav>
                              <div
                                className="nav nav-tabs"
                                id="nav-tab"
                                role="tablist"
                              >
                                <button type="button"
                                  className="nav-link active"
                                  id="nav-gen-tab"
                                  data-bs-toggle="tab"
                                  data-bs-target="#nav-gen"
                                  role="tab"
                                  aria-controls="nav-gen"
                                  aria-selected="true"
                                >
                                  General{" "}
                                </button>
                                {/* <button type="button"
                                  className="nav-link"
                                  id="nav-options-tab"
                                  data-bs-toggle="tab"
                                  data-bs-target="#nav-options"
                                  role="tab"
                                  aria-controls="nav-options"
                                  aria-selected="false"
                                >
                                  Options
                                </button> */}
                              </div>
                            </nav>
                            <div className="row">
                              <div className=" col-xxl-7 col-xl-7 col-lg-6 col-sm-12">
                                <div className="tab-content" id="nav-tabContent">
                                  <div
                                    className="tab-pane fade show active"
                                    id="nav-gen"
                                    role="tabpanel"
                                    aria-labelledby="nav-gen-tab"
                                    tabindex="0"
                                  >
                                    <form>
                                      <div className="formRow col-xl-12  ">
                                        <div className="formLabel">
                                          <label htmlFor="">Company Logo</label>
                                          <label
                                            htmlFor="data"
                                            className="formItemDesc"
                                          >
                                            Please enter your company name and
                                            logo.
                                          </label>
                                        </div>

                                        <div className="col-7">
                                          <input
                                            type="file"
                                            name="did_id_view"
                                            className="formItem"
                                            accept="image/*"
                                            onChange={(e) => {
                                              const file = e.target.files[0];
                                              if (file) {
                                                // Check if the file type is MP3

                                                const fileName = file.name.replace(/ /g, "-");
                                                const newFile = new File([file], fileName, {
                                                  type: file.type,
                                                });
                                                setNewFile(newFile);
                                                handleImageChange(e)
                                              }
                                            }}
                                          />
                                        </div>
                                      </div>
                                      <div className="formRow col-xl-12   ">
                                        <div className="formLabel">
                                          <label htmlFor="selectFormRow">
                                            Color Scheme
                                          </label>
                                          <label
                                            htmlFor="data"
                                            className="formItemDesc"
                                          >
                                            Choose your color scheme
                                          </label>
                                        </div>
                                        <div className="col-7">
                                          <div className="d-flex align-items-center justify-content-between">
                                            <div>
                                              <div className="d-flex align-items-center justify-content-between">
                                                <div className="tawk-colors-active ">
                                                  <div className="tawk-colors"
                                                    onClick={() => {
                                                      setValue("color", "#093579");
                                                    }}>
                                                    <span />
                                                  </div>
                                                </div>
                                                <div className="tawk-colors-active ms-2 ">
                                                  <div className="tawk-colors-1"
                                                    onClick={() => {
                                                      setValue("color", "#50f712");
                                                    }}>
                                                    <span />
                                                  </div>
                                                </div>
                                                <div className="tawk-colors-active ms-2">
                                                  <div className="tawk-colors-2"
                                                    onClick={() => {
                                                      setValue("color", "#f71226");
                                                    }}>
                                                    <span />
                                                  </div>
                                                </div>
                                                <div className="tawk-colors-active ms-2">
                                                  <div className="tawk-colors-3"
                                                    onClick={() => {
                                                      setValue("color", "#f7e912");
                                                    }}>
                                                    <span />
                                                  </div>
                                                </div>
                                                <div className="tawk-colors-active2 ms-2">
                                                  <div className="tawk-colors-active  dropdown">
                                                    <div className="tawk-colors-4">
                                                      <div>
                                                        <div className="dropdown-content">
                                                          <div className="palette-container">
                                                            <div className="palette-grid">
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#f79999",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#f79999");
                                                                }}
                                                                data-color="#f79999"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#ffd39e",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#ffd39e");
                                                                }}
                                                                data-color="#ffd39e"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#f9fcaf",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#f9fcaf");
                                                                }}
                                                                data-color="#f9fcaf"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#c5ffb9",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#c5ffb9");
                                                                }}
                                                                data-color="#c5ffb9"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#95f5fd",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#95f5fd");
                                                                }}
                                                                data-color="#95f5fd"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#9cc2ff",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#9cc2ff");
                                                                }}
                                                                data-color="#9cc2ff"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#b9adff",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#b9adff");
                                                                }}
                                                                data-color="#bdb2ff"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#ffc6ff",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#ffc6ff");
                                                                }}
                                                                data-color="#ffc6ff"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#fffffc",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#fffffc");
                                                                }}
                                                                data-color="#fffffc"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#f8edeb",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#f8edeb");
                                                                }}
                                                                data-color="#f8edeb"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#ffccd5",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#ffccd5");
                                                                }}
                                                                data-color="#ffccd5"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#d4a5a5",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#d4a5a5");
                                                                }}
                                                                data-color="#d4a5a5"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#adb5bd",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#adb5bd");
                                                                }}
                                                                data-color="#adb5bd"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#f81e1e",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#f81e1e");
                                                                }}
                                                                data-color="#f81e1e"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#6df74a",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#6df74a");
                                                                }}
                                                                data-color="#6df74a"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#31ddfc",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#31ddfc");
                                                                }}
                                                                data-color="#31ddfc"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#435be7",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#435be7");
                                                                }}
                                                                data-color="#435be7"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#a48fff",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#a48fff");
                                                                }}
                                                                data-color="#a48fff"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#bb2ffc",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#bb2ffc");
                                                                }}
                                                                data-color="#bb2ffc"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#fd39b2",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#fd39b2");
                                                                }}
                                                                data-color="#fd39b2"
                                                              />
                                                              <div
                                                                className="color-circle"
                                                                style={{
                                                                  background:
                                                                    "#f1f500",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#f1f500");
                                                                }}
                                                                data-color="#f1f500"
                                                              />
                                                            </div>
                                                            <div className="selected-color">
                                                              <div
                                                                id="selectedColorPreview"
                                                                style={{
                                                                  background:
                                                                    "#ffffff",
                                                                }}
                                                                onClick={() => {
                                                                  setValue("color", "#ffffff");
                                                                }}
                                                                data-color="#ffffff"
                                                              ></div>
                                                              <span
                                                                className="icon"
                                                                id="pickerIcon"
                                                              >
                                                                🎨
                                                              </span>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="form-widths">
                                              <input
                                                className="formItem ms-1"
                                                defaultValue={"#f42633"}
                                                {...register("color")}
                                                style={{ width: "100px" }}
                                              />

                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="formRow col-xl-12 ">
                                        <div className="formLabel">
                                          <label htmlFor="selectFormRow">
                                            Company Name
                                          </label>
                                          <label
                                            htmlFor="data"
                                            className="formItemDesc"
                                          >
                                            Enter your company name
                                          </label>
                                        </div>
                                        <div className="col-7">
                                          <input className="formItem" defaultValue="AnglePBX"  {...register("name")} />
                                          {errors.did_id && (
                                            <ErrorMessage text={errors.name} />
                                          )}
                                        </div>
                                      </div>
                                      <div className="formRow col-xl-12 ">
                                        <div className="formLabel">
                                          <label htmlFor="selectFormRow">
                                            Company Description
                                          </label>
                                          <label
                                            htmlFor="data"
                                            className="formItemDesc"
                                          >
                                            Enter your company description
                                          </label>
                                        </div>
                                        <div className="col-7">
                                          <input className="formItem" defaultValue={"Business Phone System | Cloud Contact Center | Cloud PBX"}  {...register("description")} />
                                          {errors.did_id && (
                                            <ErrorMessage text={errors.description} />
                                          )}
                                        </div>
                                      </div>
                                      <div className="formRow col-xl-12 ">
                                        <div className="formLabel">
                                          <label htmlFor="">Usage</label>
                                          <label
                                            htmlFor="data"
                                            className="formItemDesc"
                                          >
                                            Please choose the usage.
                                          </label>
                                        </div>
                                        <div className="col-7">
                                          <select
                                            type="text"
                                            name="did_id_view"
                                            className="formItem"
                                            {...register("usages", {
                                              ...requiredValidator,
                                            })}
                                            defaultValue={""}
                                          >
                                            <option value={""} disabled>
                                              Choose Usage
                                            </option>
                                            <option value="extension">
                                              Extension
                                            </option>
                                            <option value="callcenter">
                                              Call Center
                                            </option>
                                            <option value="ringgroup">
                                              Ring Group
                                            </option>
                                            <option value="ivr">IVR</option>
                                            <option value={"pstn"}>PSTN</option>
                                          </select>

                                          {errors.did_id && (
                                            <ErrorMessage text={errors.usages} />
                                          )}
                                        </div>
                                      </div>
                                      <div className="formRow col-xl-12 ">
                                        <div className="formLabel">
                                          <label htmlFor="">Action</label>
                                          <label
                                            htmlFor="data"
                                            className="formItemDesc"
                                          >
                                            Please choose the usage.
                                          </label>
                                        </div>
                                        <div className="col-7">
                                          {watch().usages !== "pstn" &&
                                            watch().usages !== "" ? (
                                            <ActionList
                                              category={watch().usages === "ringgroup" ? "ring group" : watch().usages === "callcenter" ? "call center" : watch().usages}
                                              title={null}
                                              label={null}
                                              getDropdownValue={actionListValue}
                                              value={watch().action}
                                              {...register(
                                                "action",
                                                requiredValidator
                                              )}
                                            />
                                          ) : (
                                            <input
                                              disabled={watch().usages === ""}
                                              type="number"
                                              placeholder={
                                                watch().usages === ""
                                                  ? "None"
                                                  : "Action"
                                              }
                                              className="formItem"
                                              onChange={(e) => {
                                                setValue(
                                                  "action",
                                                  e.target.value
                                                );
                                              }}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                              <div className="col-xxl-5 col-xl-5 col-lg-6 col-sm-12">
                                <div className="clickToCall clickToCall-preview " style={{ '--prim-color': watch().color }}>
                                  <div className="clickToCallButton">
                                    <button type="button" onClick={() => setWidgetExpanded(!widgetExpanded)}>
                                      <i className={`fa-solid fa-${!widgetExpanded ? "phone" : "chevron-down"}`}></i>
                                    </button>
                                  </div>
                                  {widgetExpanded ?
                                    <div className="clickToCallModule ms-auto">
                                      <div className="clickToCallHeader">
                                        <div className="wrapper">
                                          <button type="button" onClick={() => setCallFormVisible(false)}><i className="fa-solid fa-chevron-left"></i></button>
                                          <div className="compLogo">
                                            <img src={selectedImage ? selectedImage : require("../../assets/images/logo_login.png")} alt=''></img>
                                          </div>
                                          <div className="text">
                                            <h5>{watch().name || "AngelPBX"}</h5>
                                            <p>
                                              {watch().description || "Business Phone System | Cloud Contact Center | Cloud PBX"}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="clickToCallBody">
                                        {!callFormVisible ?
                                          <>
                                            <div className="callByAudio">
                                              <button type="button" onClick={() => setCallFormVisible(true)}>
                                                <i className="fa-solid fa-phone"></i>
                                              </button>
                                              <h5>Arrange an <span>Audio Call</span> with our Agent</h5>
                                            </div>
                                            <div className="callByVideo">
                                              <button type="button" onClick={() => setCallFormVisible(true)}>
                                                <i className="fa-solid fa-video"></i>
                                              </button>
                                              <h5>Arrange a <span>Video Call</span> with our Agent</h5>
                                            </div>
                                          </> : ""}
                                        {callFormVisible ? <div className="callDialogBox">
                                          <div className="formBox">
                                            <label className="formLabel">Name</label>
                                            <input type="text" placeholder="Enter your name" onChange={(e) => setName(e.target.value)} value={name} />
                                          </div>
                                          <div className="formBox">
                                            <label className="formLabel">Number</label>
                                            <input
                                              type="number"
                                              placeholder="Enter your Number"
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                if (value.length <= 15) {
                                                  setNumber(value); // Allow typing up to 15 digits
                                                }
                                              }}
                                              value={number}
                                            />

                                          </div>
                                          <div>
                                            <button type="button" onClick={handleSubmits}>Call Now!</button>
                                          </div>
                                        </div> : ""}
                                      </div>
                                    </div> : ""}
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {popUp &&
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div className="row content col-xl-4">
                  <div className="col-2 px-0">
                    <div className="iconWrapper">
                      <i className="fa-regular fa-circle-check"></i>
                    </div>
                  </div>
                  <div className="col-10 ps-0">
                    <h4>Success</h4>
                    <p>
                      Copy this code and paste it on the site to make it work.
                    </p>
                    <textarea className="formItem" id="copyCode" value={embededCode} readOnly></textarea>
                    <div className="d-flex justify-content-between">
                      <button
                        className="panelButton m-0"
                        onClick={() => navigate(-1)}
                      >
                        <span className="text">
                          Confirm
                        </span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {loading && <CircularLoader />}
      </main>
    </>
  );
}

export default ClickToCallSetup;
