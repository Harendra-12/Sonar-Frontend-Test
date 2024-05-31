import React, { useState } from 'react'
import { generalPostFunction } from '../GlobalFunction/globalFunction'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from '../Pages/Misc/CircularLoader';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    const navigate = useNavigate()
    const [oldPassword, setOldPassword] = useState("")
    const [errorOldPassword, setErrorOldPassword] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [errorNewPassword, setErrorNewPassword] = useState(false)
    const [confPassword, setConfPassword] = useState("")
    const [errorConfirm, setErrorConfirm] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit() {
        if (oldPassword === "") {
            setErrorOldPassword(true)
        } else {
            setErrorOldPassword(false)
        }
        if (newPassword.length < 4) {
            setErrorNewPassword(true)
        } else {
            setErrorNewPassword(false)
        }
        if (confPassword !== newPassword) {
            setErrorConfirm(true)
        } else {
            setErrorConfirm(false)
        }

        if (oldPassword !== "" && newPassword !== "" && newPassword.length > 3 && confPassword === newPassword) {
            setLoading(true)
            const parsedData = {
                old_password: oldPassword,
                new_password: newPassword
            }
            const apiData = await generalPostFunction("/change-password", parsedData)
            if (apiData.status) {
                setLoading(false)
                toast.success(apiData.message)
            } else {
                setLoading(false)
                toast.error(apiData.message)
            }

        }
    }

    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-12" id="subPageHeader">
                            <div className="row px-xl-3">
                                <div className="col-xl-9 my-auto">
                                    <h4 className="my-auto">Change Password</h4>
                                    <p className="pt-2 mt-1 mb-0">
                                        Change your account password.
                                    </p>
                                </div>
                                <div className="col-xl-3 ps-2">
                                    <div className="d-flex justify-content-end">
                                        <button

                                            type="button"
                                            effect="ripple"
                                            className="panelButton"
                                            onClick={() => navigate(-1)}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            effect="ripple"
                                            className="panelButton"
                                            onClick={handleSubmit}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mx-2" id="detailsContent">
                            <form className="row">
                                <div className="formRow col-xl-12 px-xl-4">
                                    <div className="col-12 d-flex justify-content-start">
                                        <div className="formLabel pe-2 col-5">
                                            <div>
                                                <label className="text-dark">Current Password</label>
                                                {errorOldPassword ? <label className="status missing">Field Missing</label> : ""}
                                            </div>
                                            <div>
                                                <label htmlFor="data" className="formItemDesc" style={{ fontSize: 12, lineHeight: '18px', marginTop: 5 }}>
                                                    This is your current password.
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-3 pe-2">
                                            <div className="formLabel">
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    name="extension"
                                                    className="formItem"
                                                    value={oldPassword}
                                                    onChange={(e) => setOldPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="formRow col-xl-12 px-xl-4">
                                    <div className="col-12 d-flex justify-content-start">
                                        <div className="formLabel pe-2 col-5">
                                            <div>
                                                <label className="text-dark">New Password</label>
                                                {errorNewPassword ? <label className="status missing">Password must be at least 6 characters</label> : ""}
                                            </div>
                                            <div>
                                                <label htmlFor="data" className="formItemDesc" style={{ fontSize: 12, lineHeight: '18px', marginTop: 5 }}>
                                                    Please input your preferred new password.
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-3 pe-2">
                                            <div className="formLabel">
                                                {/* <label htmlFor="">Destinations</label> */}
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    name="extension"
                                                    className="formItem"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="formRow col-xl-12 px-xl-4">
                                    <div className="col-12 d-flex justify-content-start">
                                        <div className="formLabel pe-2 col-5">
                                            <div>
                                                <label className="text-dark">Confirm Password</label>
                                                {errorConfirm ? <label className="status missing">Password do not matched</label> : ""}
                                            </div>
                                            <div>
                                                <label htmlFor="data" className="formItemDesc" style={{ fontSize: 12, lineHeight: '18px', marginTop: 5 }}>
                                                    Please retype your password.
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-3 pe-2">
                                            <div className="formLabel">
                                                {/* <label htmlFor="">Destinations</label> */}
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    name="extension"
                                                    className="formItem"
                                                    value={confPassword}
                                                    onChange={(e) => setConfPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {loading ? <CircularLoader /> : ""}
                    </div>
                </div>
            </section>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </main>
    )
}

export default ChangePassword