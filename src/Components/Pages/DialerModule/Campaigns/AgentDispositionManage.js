import React, { useEffect, useState } from "react";
import Header from "../../../CommonComponents/Header";

import { backToTop, checkViewSidebar, generalDeleteFunction, generalGetFunction, generalPostFunction, generalPutFunction, } from "../../../GlobalFunction/globalFunction";
import Tippy from "@tippyjs/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ContentLoader from "../../../Loader/ContentLoader";
import { useSelector } from "react-redux";

function AgentDispositionManage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [allDisposition, setAllDisposition] = useState([])
    const [selectedDisposition, setSelectedDisposition] = useState("")
    const [deletePopUp, setDeletePopUp] = useState(false)
    const [newDesposition, setNewDisposition] = useState("")
    const [updateDesposition, setUpdateDesposition] = useState(false)
    const [addNew, setAddNew] = useState(false)
    const [refresh, setRefresh] = useState(0);
    const account = useSelector((state) => state.account);
    const slugPermissions = useSelector((state) => state?.permissions);

    useEffect(() => {
        async function getData() {
            // setLoading(true)
            const apiData = await generalGetFunction(`/disposition/all`)
            if (apiData?.status) {
                setAllDisposition(apiData.data)
                setLoading(false)
            } else {
                setLoading(false)
                toast.error(apiData.error)
            }
        }
        getData()
    }, [refresh])

    async function changeDesposition() {
        if (newDesposition === "") {
            toast.error("Please enter disposition name")
            return
        }
        setLoading(true)
        setUpdateDesposition(false)
        setAddNew(false)
        if (addNew) {
            const apiData = await generalPostFunction("/disposition/store", { name: newDesposition })
            if (apiData.status) {
                toast.success(apiData.message)
                setNewDisposition("")
                setLoading(false)
                setRefresh(refresh + 1)
                setSelectedDisposition("")
            } else {
                setLoading(false)
                toast.error(apiData.error)
            }
        } else {
            const apiData = await generalPutFunction(`/disposition/update/${selectedDisposition}`, { name: newDesposition })
            if (apiData.status) {
                toast.success(apiData.message)
                setNewDisposition("")
                setLoading(false)
                setRefresh(refresh + 1)
                setSelectedDisposition("")
            } else {
                setLoading(false)
                toast.error(apiData.error)
            }
        }
    }

    async function handleDelete() {
        setLoading(true)
        setDeletePopUp(false)
        setSelectedDisposition("")
        const apiData = await generalDeleteFunction(`/disposition/destroy/${selectedDisposition}`)
        if (apiData?.status) {
            setLoading(false)
            setRefresh(refresh + 1)
            toast.success(apiData.message)
        } else {
            setLoading(false)
            toast.error(apiData.error)
        }
    }
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Agent Disposition" />
                        {loading ? <ContentLoader /> :
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>Agent Disposition Manage Edit</h4>
                                                    <p>Edit existing Agent Disposition</p>
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
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12" style={{ padding: "25px 23px" }}>
                                            <div className="row justify-content-between">
                                                <div className="col-xl-6 inputcheckbox" style={{ borderRight: '1px solid var(--border-color)' }}>
                                                    <div className="header d-flex align-items-center justify-content-between">
                                                        <div
                                                            className="col fw-bold"
                                                            style={{ fontFamily: "Noto Sans" }}
                                                        >
                                                            Available Agent Disposition Methods
                                                        </div>
                                                        {checkViewSidebar(
                                                            "Disposition",
                                                            slugPermissions,
                                                            account?.sectionPermissions,
                                                            account?.permissions,
                                                            "add"
                                                        ) &&
                                                            <div className="col-auto">
                                                                <button type="button" className="panelButton" onClick={() => { setAddNew(true); setNewDisposition(""); setUpdateDesposition(false) }}>
                                                                    <span className="text">Add</span>
                                                                    <span className="icon">
                                                                        <i className="fa-solid fa-plus"></i>
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="col-xl-12">
                                                        {!checkViewSidebar(
                                                            "Disposition",
                                                            slugPermissions,
                                                            account?.sectionPermissions,
                                                            account?.permissions,
                                                            "read"
                                                        ) ? <p>You dont have any permission</p> :
                                                            allDisposition?.map((item, index) => {
                                                                return (
                                                                    <div className="col-xl-12 pt-3 " key={index}>
                                                                        <div className="d-flex justify-content-center align-items-center">
                                                                            <div className="savedCardWrapper col">
                                                                                <div>
                                                                                    <label>{item.name}</label>
                                                                                </div>
                                                                            </div>
                                                                            {item.is_default === 1 ? "" :
                                                                                <div className="d-flex align-items-center ">
                                                                                    <Tippy content='Edit this disposition'>
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                setSelectedDisposition(item.id);
                                                                                                setNewDisposition(item.name);
                                                                                                setUpdateDesposition(true);
                                                                                                setAddNew(false);
                                                                                            }}
                                                                                            className="tableButton edit m-2" >
                                                                                            <i className="fa-solid fa-pencil"></i>
                                                                                        </button>
                                                                                    </Tippy>
                                                                                    <Tippy content='Delete this disposition'>
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                setSelectedDisposition(item.id);
                                                                                                setAddNew(false);
                                                                                                setUpdateDesposition(false);
                                                                                                setDeletePopUp(true);
                                                                                            }}
                                                                                            className="tableButton delete m-2">
                                                                                            <i className="fa-solid fa-trash" />
                                                                                        </button>
                                                                                    </Tippy>
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                    </div>
                                                </div>
                                                {addNew || updateDesposition ?
                                                    <div className="col-xl-6">
                                                        <div className="header d-flex align-items-center justify-content-between">
                                                            <div
                                                                className="col-12 fw-bold mt-2"
                                                                style={{ fontFamily: "Noto Sans" }}
                                                            >
                                                                {addNew ? "Add" : "Update"} Agent Disposition
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-12 pt-3 ">
                                                            <form className="">
                                                                <div className="formRow col-xl-12">
                                                                    <div className="formLabel">
                                                                        <label htmlFor="">Disposition Name</label>
                                                                        <label htmlFor="data" className="formItemDesc">
                                                                            Enter the name for the disposition method.
                                                                        </label>
                                                                    </div>
                                                                    <div className="col-xl-6 col-12">
                                                                        <input className="formItem" value={newDesposition} onChange={(e) => { setNewDisposition(e.target.value) }} />
                                                                    </div>
                                                                </div>
                                                                <div className="formRow col-xl-12">
                                                                    <button type="button" className="panelButton ms-auto" onClick={() => { changeDesposition() }}>
                                                                        <span className="text">{addNew ? "Save" : "Update"}</span>
                                                                        <span className="icon">
                                                                            <i className="fa-solid fa-floppy-disk"></i>
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div> : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {deletePopUp ? (
                    <div className="popup">
                        <div className="container h-100">
                            <div className="row h-100 justify-content-center align-items-center">
                                <div className="row content col-xl-4 col-md-5">
                                    <div className="col-2 px-0">
                                        <div className="iconWrapper">
                                            <i className="fa-duotone fa-triangle-exclamation"></i>
                                        </div>
                                    </div>
                                    <div className="col-10 ps-0">
                                        <h4>Warning!</h4>
                                        <p>
                                            Are you sure you want to delete this disposition?
                                        </p>
                                        <div className="mt-2 d-flex justify-content-between">
                                            <button
                                                className="panelButton m-0"
                                                onClick={() => handleDelete()}
                                            >
                                                <span className="text">Confirm</span>
                                                <span className="icon">
                                                    <i className="fa-solid fa-check"></i>
                                                </span>
                                            </button>
                                            <button
                                                className="panelButton gray m-0 float-end"
                                                onClick={() => setDeletePopUp(false)}
                                            >
                                                <span className="text">Cancel</span>
                                                <span className="icon">
                                                    <i className="fa-solid fa-xmark"></i>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </section>
        </main>
    )
}

export default AgentDispositionManage