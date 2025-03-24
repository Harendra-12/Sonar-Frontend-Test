/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
// import CircularLoader from '../../Loader/CircularLoader';
import Header from '../../CommonComponents/Header';
import { backToTop, generalGetFunction, generalPutFunction } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CircularLoader from '../../Loader/CircularLoader';

function UserProfile() {
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);
    const dispatch = useDispatch();
    const account = useSelector((state) => state.account);
    const timeZoneRefresh = useSelector((state) => state.timeZoneRefresh)
    const allTimeZone = useSelector((state) => state.timeZone)
    const [selectedTimezone, setSelectedTimezone] = useState("")
    const [inputFirstName, setInputFirstName] = useState("");
    const [inputLastName, setInputLastName] = useState("");
    const [inputAlias, setInputAlias] = useState("");
    const [loading, setLoading] = useState(false);

// Setting all the previous value for the user 
    useEffect(() => {
        dispatch({
            type: "SET_TIMEZONEREFRESH",
            timeZoneRefresh: timeZoneRefresh + 1,
        });
        setInputAlias(account.alias);
        setSelectedTimezone(account?.timezone_id)
        const separateName = account.name.split(" ");
        if (separateName.length === 1) {
            setInputFirstName(separateName[0]);
        } else if (separateName.length === 2) {
            setInputFirstName(separateName[0]);
            setInputLastName(separateName[1]);
        } else {
            setInputFirstName(separateName[0]);
            setInputLastName(separateName.slice(1, separateName.length).join(" "));
        }
    }, [])

    // Handle the update logic for user edit
    const handleSave = async () => {
        setIsEdit(!isEdit);
        if (isEdit) {
            const payload = {
                // email: account.email,
                // domain_id: domainId,
                timezone_id: selectedTimezone,
                // status: account.status,
                // role_id: account?.user_role?.role_id,
                // account_id: account.account_id,
                permissions: account.permissions,
                // extension_id: account.extension.id,
                // usages: account.usages,
                alias: inputAlias,
                name: `${inputFirstName} ${inputLastName}`,
            };
            setLoading(true);
            try {
                await generalPutFunction(`user/${account.id}`, payload);
                const profile = await generalGetFunction("/user");
                if (profile?.status) {
                    dispatch({
                        type: "SET_ACCOUNT",
                        account: profile.data,
                    });
                    localStorage.setItem("account", JSON.stringify(profile.data));
                }
            } catch (error) {
                // Handle error
                console.error("Error updating user:", error);
                // Optionally, you can display the error to the user or perform other actions
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="User Profile" />
                    </div>
                    <div className="overviewTableWrapper">
                        <div className="overviewTableChild">
                            <div className="d-flex flex-wrap">
                                <div className="col-12">
                                    <div className="heading">
                                        <div className="content">
                                            <h4>
                                                My Profile{" "}
                                            </h4>
                                            <p>Here you can view all the necessary information regarding your profile and can edit it.</p>
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
                                <div className='col-12' style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <div className="profileView">
                                        <div className="profileDetailsHolder p-0 shadow-none">
                                            <div className="baseDetails d-block">
                                                <div className='row'>
                                                    <div className="col-xxl-6 col-xl-7 col-lg-9 col-md-7">
                                                        <div className='d-flex align-items-center'>
                                                            <div className="profilePicHolders position-static">
                                                                <img
                                                                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                                                    alt="img"
                                                                />
                                                            </div>
                                                            <div className='ms-5'>
                                                                <div className="content mt-1 d-flex align-items-center justify-content-start">
                                                                    <div className='profileicons'>
                                                                        <i className="fa-regular me-3 fa-user"></i>
                                                                    </div>
                                                                    <h5 className="mb-0">
                                                                        {account?.name}
                                                                    </h5>
                                                                </div>
                                                                <div className="content mt-1  d-flex align-items-center justify-content-start">
                                                                    <div className='profileicons'>
                                                                        <i className="fa-regular me-3 fa-id-card"></i>
                                                                    </div>
                                                                    <p className="mb-0">
                                                                        {account?.usertype}
                                                                    </p>
                                                                </div>
                                                                <div className="content mt-1  d-flex align-items-center justify-content-start">
                                                                    <div className='profileicons'>
                                                                        <i className="fa-regular me-3 fa-envelope"></i>
                                                                    </div>
                                                                    <p className="mb-0">
                                                                        {" "}
                                                                        {account.email}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3">
                                                        <div className="content mt-3">
                                                            <div>
                                                                <h5>Status</h5>
                                                                <div className='assigned'>
                                                                    <p className="">
                                                                        {account.status == "E" ? "Enabled" : ""}
                                                                    </p>
                                                                    <div>
                                                                        <i className="fa-solid ms-1 fa-check"></i>
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
                                {loading ? <><CircularLoader /></> : <div className='col-12'>
                                    <div className='heading bg-transparent border-bottom-0'>
                                        <div className="content">
                                            <h4>Account Information</h4>
                                        </div>
                                        <div className="buttonGroup">
                                            <button type="button" className={`panelButton ${isEdit ? '' : 'edit'}`} onClick={handleSave}>
                                                <span className="text">{isEdit ? 'Save' : 'Edit'}</span>
                                                <span className="icon">
                                                    <i className={`fa-solid fa-${isEdit ? 'floppy-disk' : 'pen'}`}></i>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className=' col-12'>
                                        <div className='row' style={{ padding: '0 25px 15px' }}>
                                            <div className='formRow col-xl-3'>
                                                <div className='formLabel'>
                                                    <label>First Name</label>
                                                    <label className='formItemDesc'>The First Name of the User. Can be editable.</label>
                                                </div>
                                                <div className='col-6'>
                                                    {isEdit ? <input type="text" className="formItem" value={inputFirstName} onChange={(e) => setInputFirstName(e.target.value)} /> : <h5 className='mb-0 pb-2 border-bottom'>{inputFirstName}</h5>}
                                                </div>
                                            </div>
                                            <div className='formRow col-xl-3'>
                                                <div className='formLabel'>
                                                    <label>Last Name</label>
                                                    <label className='formItemDesc'>The Last Name of the User. Can be editable.</label>
                                                </div>
                                                <div className='col-6'>
                                                    {isEdit ? <input type="text" className="formItem" value={inputLastName} onChange={(e) => setInputLastName(e.target.value)} /> : <h5 className='mb-0 pb-2 border-bottom'>{inputLastName}</h5>}
                                                </div>
                                            </div>
                                            <div className='formRow col-xl-3'>
                                                <div className='formLabel'>
                                                    <label>Alias</label>
                                                    <label className='formItemDesc'>The Alias or Nickname of the User. Can be editable.</label>
                                                </div>
                                                <div className='col-6'>
                                                    {isEdit ? <input type="text" className="formItem" value={inputAlias} onChange={(e) => setInputAlias(e.target.value)} /> : <h5 className='mb-0 pb-2 border-bottom'>{inputAlias}</h5>}
                                                </div>
                                            </div>
                                            <div className='formRow col-xl-3'>
                                                <div className='formLabel'>
                                                    <label>TimeZone</label>
                                                    <label className='formItemDesc'>The set timezone of the User. Can be editable.</label>
                                                </div>
                                                <div className='col-6'>
                                                    <div className="col-6">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <select
                                                                    className="formItem me-0"
                                                                    style={{ width: "100%" }}
                                                                    name="delay"
                                                                    id="selectFormRow"
                                                                    value={selectedTimezone}
                                                                    onChange={(e) => {
                                                                        setSelectedTimezone(e.target.value);
                                                                    }}
                                                                >
                                                                    {allTimeZone?.map((item, index) => {
                                                                        return (
                                                                            <>
                                                                                <option value={item.id}>
                                                                                    {item.name}
                                                                                </option>
                                                                            </>
                                                                        );
                                                                    })}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='formRow col-xl-3'>
                                                <div className='formLabel'>
                                                    <label>Username</label>
                                                    <label className='formItemDesc'>The username assigned to the User. Cannot be editable.</label>
                                                </div>
                                                <div className='col-6'>
                                                    <h5 className='mb-0 pb-2 border-bottom'>{account.username}</h5>
                                                </div>
                                            </div>
                                            {account.usertype == "Company" ? <></> : <div className='formRow col-xl-3'>
                                                <div className='formLabel'>
                                                    <label>Role</label>
                                                    <label className='formItemDesc'>The role assigned to the User. Cannot be editable.</label>
                                                </div>
                                                <div className='col-6'>
                                                    <h5 className='mb-0 pb-2 border-bottom'>Agent</h5>
                                                </div>
                                            </div>}
                                            <div className='formRow col-xl-3'>
                                                <div className='formLabel'>
                                                    <label>Email</label>
                                                    <label className='formItemDesc'>The email assigned to the User which is used at login. Cannot be editable.</label>
                                                </div>
                                                <div className='col-6'>
                                                    <h5 className='mb-0 pb-2 border-bottom'>{account?.email}</h5>
                                                </div>
                                            </div>
                                            <div className='formRow col-xl-3'>
                                                <div className='formLabel'>
                                                    <label>Extension</label>
                                                    <label className='formItemDesc'>The extension assigned to the User which is used by PBX. Cannot be editable.</label>
                                                </div>
                                                <div className='col-6'>
                                                    <h5 className='mb-0 pb-2 border-bottom'>{account?.extension?.extension}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default UserProfile