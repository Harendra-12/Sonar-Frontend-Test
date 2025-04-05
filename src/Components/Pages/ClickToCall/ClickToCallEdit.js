/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { backToTop, fileUploadFunction, generalGetFunction, generalPostFunction } from "../../GlobalFunction/globalFunction";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { requiredValidator } from "../../validations/validation";
import ActionList from "../../CommonComponents/ActionList";
import { toast } from "react-toastify";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import CircularLoader from "../../Loader/CircularLoader";
import { HexColorPicker } from "react-colorful";

function ClickToCallEdit() {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [widgetExpanded, setWidgetExpanded] = useState(true)
    const [callFormVisible, setCallFormVisible] = useState(false)
    const [name, setName] = useState("")
    const [number, setNumber] = useState("")
    const [loading, setLoading] = useState(true)
    const [newFile, setNewFile] = useState(null);
    const queryParams = new URLSearchParams(useLocation().search);
    const value = queryParams.get("id");
    const [logo, setLogo] = useState("")
    const [embadedCode, setEmbededCode] = useState("")
    const {
        register,
        formState: { errors },
        setValue,
        watch,
    } = useForm();

    const textColor = watch("textcolor");
    const buttonColor = watch("buttoncolor");
    const baseColor = watch("color");

    useEffect(() => {
        register("textcolor");
        register("buttoncolor");
        register("color");
    }, [register]);

    useEffect(() => {
        if (value) {
            async function getData() {
                const getClickToCall = await generalGetFunction(`/click-to-call/show/${value}`)
                if (getClickToCall?.status) {
                    setLoading(false);
                    setValue("name", getClickToCall.data.company_name);
                    setValue("description", getClickToCall.data.description);
                    setValue("color", getClickToCall.data.primary_color);
                    setValue("textcolor", getClickToCall.data.textcolor);
                    setValue("buttoncolor", getClickToCall.data.buttoncolor);
                    setValue("action", getClickToCall.data.action);
                    setValue("usages", getClickToCall.data.usages);
                    setLogo(getClickToCall.data.logo)
                    setEmbededCode(getClickToCall.data.embedded_code);
                } else {
                    setLoading(false);
                    navigate(-1)
                }
            }
            getData()
        } else {
            navigate(-1)
        }
    }, [value])

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



    const actionListValue = (value) => {
        setValue("action", value[0]);
    };

    // Handle form submit
    async function handleWidgetSubmit(data) {
        // if (!newFile) {
        //     toast.error("Please upload logo")
        //     return
        // }
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
        // if(watch().embed_code === "" || !watch().embed_code){
        //   toast.error("Please enter embed code")
        //   return
        // }
        setLoading(true);
        const parsedData = new FormData();
        if (newFile) {
            parsedData.append("logo", newFile);
        }
        parsedData.append("company_name", watch().name);
        parsedData.append("description", watch().description);
        parsedData.append("action", watch().action);
        parsedData.append("usages", watch().usages);
        parsedData.append("primary_color", watch().color);
        parsedData.append("textcolor", watch().textcolor);
        parsedData.append("buttoncolor", watch().buttoncolor);
        parsedData.append("id", value)
        // parsedData.append("embed_code", watch().embed_code);
        const apiData = await fileUploadFunction(`/click-to-call/update`, parsedData);
        if (apiData?.status) {
            toast.success(apiData.message);
            setLoading(false);
            navigate(-1);
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
                                                    <button type="button" effect="ripple" className="panelButton gray" onClick={() => {
                                                        navigate(-1);
                                                        backToTop();
                                                    }}>
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
                                                    <div className="tangoNavs">
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
                                                            </div>
                                                        </nav>
                                                        <div className="row">
                                                            <div className="col-xxl-7 col-xl-7 col-lg-6 col-sm-12">
                                                                <div className="tab-content" id="nav-tabContent">
                                                                    <div
                                                                        className="tab-pane fade show active"
                                                                        id="nav-gen"
                                                                        role="tabpanel"
                                                                        aria-labelledby="nav-gen-tab"
                                                                        tabIndex="0"
                                                                    >
                                                                        <form>
                                                                            <div className="formRow col-xl-12">
                                                                                <div className="formLabel">
                                                                                    <label htmlFor="">Company Logo</label>
                                                                                    <label for="data" className="formItemDesc">
                                                                                        Logo should be atleast <span className="text-danger fw-bold">100px x 100px</span> OR <span className="text-danger fw-bold">1:1</span> Dimension
                                                                                    </label>
                                                                                </div>

                                                                                <div className="col-7">
                                                                                    <div className="row">
                                                                                        <div className="col-auto">
                                                                                            <div className="imageHolder" style={{ width: '50px', height: '50px', border: '1px solid var(--border-color)', borderRadius: '5px' }}>
                                                                                                <img src={selectedImage ? selectedImage : logo} style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                                                                                                    onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col">
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
                                                                                </div>
                                                                            </div>
                                                                            <div className="formRow col-xl-12">
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

                                                                                        {/* <div className="d-flex align-items-center justify-content-between">

                                                                                            <div className="tawk-colors-active">
                                                                                                <div className="tawk-colors">
                                                                                                    <span />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="tawk-colors-active ms-2">
                                                                                                <div className="tawk-colors-1">
                                                                                                    <span />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="tawk-colors-active ms-2">
                                                                                                <div className="tawk-colors-2">
                                                                                                    <span />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="tawk-colors-active ms-2">
                                                                                                <div className="tawk-colors-3">
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
                                                                                        </div> */}

                                                                                        <div className="form-widths d-flex">
                                                                                            <div className="me-2">
                                                                                                <input
                                                                                                    className="formItem"
                                                                                                    {...register("color")}
                                                                                                    style={{ width: "100px" }}
                                                                                                />
                                                                                            </div>
                                                                                            <div>
                                                                                                <button className="formItem" type="button" id="buttonColorPicker" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                                                                                                    <div className="d-flex align-items-center">
                                                                                                        <div style={{ width: '20px', height: '20px', backgroundColor: baseColor || '#f42633', borderRadius: '3px' }}></div>
                                                                                                        <label className="ms-2">Choose Color</label>
                                                                                                    </div>
                                                                                                </button>
                                                                                                <div className="dropdown-menu p-0" aria-labelledby="buttonColorPicker">
                                                                                                    <HexColorPicker
                                                                                                        color={baseColor}
                                                                                                        onChange={(newColor) => setValue("color", newColor)} />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                            <div className="formRow col-xl-12   ">
                                                                                <div className="formLabel">
                                                                                    <label htmlFor="selectFormRow">
                                                                                        Text Color Scheme
                                                                                    </label>
                                                                                    <label
                                                                                        htmlFor="data"
                                                                                        className="formItemDesc"
                                                                                    >
                                                                                        Choose your text color scheme
                                                                                    </label>
                                                                                </div>
                                                                                <div className="col-7">
                                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                                        <div className="form-widths d-flex">
                                                                                            <div className="me-2">
                                                                                                <input
                                                                                                    className="formItem"
                                                                                                    // value={textColor}
                                                                                                    // onChange={(newColor) => setValue("textcolor", newColor)}
                                                                                                    {...register("textcolor")}
                                                                                                    style={{ width: "100px" }}
                                                                                                />
                                                                                            </div>
                                                                                            <div>
                                                                                                <button className="formItem" type="button" id="textColorPicker" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                                                                                                    <div className="d-flex align-items-center">
                                                                                                        <div style={{ width: '20px', height: '20px', backgroundColor: textColor || '#17c100', borderRadius: '3px' }}></div>
                                                                                                        <label className="ms-2">Choose Color</label>
                                                                                                    </div>
                                                                                                </button>
                                                                                                <div className="dropdown-menu p-0" aria-labelledby="textColorPicker">
                                                                                                    <HexColorPicker
                                                                                                        color={textColor}
                                                                                                        onChange={(newColor) => setValue("textcolor", newColor)} />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="formRow col-xl-12   ">
                                                                                <div className="formLabel">
                                                                                    <label htmlFor="selectFormRow">
                                                                                        Button Color Scheme
                                                                                    </label>
                                                                                    <label
                                                                                        htmlFor="data"
                                                                                        className="formItemDesc"
                                                                                    >
                                                                                        Choose your button color scheme
                                                                                    </label>
                                                                                </div>
                                                                                <div className="col-7">
                                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                                        <div className="form-widths d-flex">
                                                                                            <div className="me-2">
                                                                                                <input
                                                                                                    className="formItem"
                                                                                                    // value={buttonColor}
                                                                                                    // onChange={(newColor) => setValue("buttoncolor", newColor)}
                                                                                                    {...register("buttoncolor")}
                                                                                                    style={{ width: "100px" }}
                                                                                                />
                                                                                            </div>
                                                                                            <div>
                                                                                                <button className="formItem" type="button" id="buttonColorPicker" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                                                                                                    <div className="d-flex align-items-center">
                                                                                                        <div style={{ width: '20px', height: '20px', backgroundColor: buttonColor || '#17c100', borderRadius: '3px' }}></div>
                                                                                                        <label className="ms-2">Choose Color</label>
                                                                                                    </div>
                                                                                                </button>
                                                                                                <div className="dropdown-menu p-0" aria-labelledby="buttonColorPicker">
                                                                                                    <HexColorPicker
                                                                                                        color={buttonColor}
                                                                                                        onChange={(newColor) => setValue("buttoncolor", newColor)} />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="formRow col-xl-12">
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
                                                                                    <input className="formItem" {...register("name")} />
                                                                                    {errors.did_id && (
                                                                                        <ErrorMessage text={errors.name} />
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="formRow col-xl-12">
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
                                                                                    <input className="formItem"   {...register("description")} />
                                                                                    {errors.did_id && (
                                                                                        <ErrorMessage text={errors.description} />
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="formRow col-xl-12">
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
                                                                            <div className="formRow col-xl-12">
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
                                                                                            value={watch().action}
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
                                                                            <div className="formRow col-xl-12 pt-3"
                                                                                style={{
                                                                                    borderTop:
                                                                                        "1px solid var(--border-color)",
                                                                                }}
                                                                            >
                                                                                <div className="formLabel">
                                                                                    <label htmlFor="">
                                                                                        Copy embeded code
                                                                                    </label>
                                                                                    <label
                                                                                        htmlFor="data"
                                                                                        className="formItemDesc"
                                                                                    >
                                                                                        Copy this code and drop it in your
                                                                                        website (above closing body tag) to
                                                                                        install click to call widget.
                                                                                    </label>
                                                                                </div>
                                                                                <div className="col-7">
                                                                                    <textarea
                                                                                        type="text"
                                                                                        name="did_id_view"
                                                                                        className="formItem h-auto"
                                                                                        defaultValue={embadedCode}
                                                                                        disabled={true}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-4">
                                                                <div className="clickToCall clickToCall-preview" style={{ '--prim-color': watch().color }}>
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
                                                                                        <img src={selectedImage ? selectedImage : logo} alt='' onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}></img>
                                                                                    </div>
                                                                                    <div className="text">
                                                                                        <h5>{watch().name}</h5>
                                                                                        <p>
                                                                                            {watch().description}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="clickToCallBody">
                                                                                {!callFormVisible ?
                                                                                    <>
                                                                                        <div className="callByAudio">
                                                                                            <button type="button" onClick={() => setCallFormVisible(true)}
                                                                                                style={{ backgroundColor: watch().buttoncolor }}
                                                                                            >
                                                                                                <i className="fa-solid fa-phone"></i>
                                                                                            </button>
                                                                                            <h5>Arrange an <span style={{ color: watch().textcolor }}>Audio Call</span> with our Agent</h5>
                                                                                        </div>
                                                                                        <div className="callByVideo">
                                                                                            <button type="button" onClick={() => setCallFormVisible(true)} style={{ backgroundColor: watch().buttoncolor }}>
                                                                                                <i className="fa-solid fa-video"></i>
                                                                                            </button>
                                                                                            <h5>Arrange a <span style={{ color: watch().textcolor }}>Video Call</span> with our Agent</h5>
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
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {loading && <CircularLoader />}
            </main>
        </>
    );
}

export default ClickToCallEdit;
