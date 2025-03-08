import React, { useState } from 'react'
// import CircularLoader from '../../Loader/CircularLoader';
import Header from '../../CommonComponents/Header';
import Tippy from '@tippyjs/react';
import { backToTop } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);

    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="User Profile" />
                    </div>
                    {/* <div className="row" style={{
                        backgroundImage: `url(${require('../../assets/images/images12.jpg')})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    >
                        <div className="col-xl-12 pe-xl-0 mt-5">
                            <div className="profileView mt-2">
                                <div className="profileDetailsHolder p-0">
                                    <div className="baseDetails d-block">
                                        <div className='row'>
                                            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-4">
                                                <div className="profilePicHolders">
                                                    <img
                                                        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                                        alt="img"
                                                    />
                                                    <div className='mt-3'>
                                                        <div className="content profileicons mt-1 d-flex align-items-center justify-content-start">
                                                            <span>
                                                                <i class="fa-regular me-3 fa-user"></i>
                                                            </span>
                                                            <h4 className="mb-0">
                                                                Rishabh Maurya <span className=''>(Rishu ) </span>
                                                            </h4>
                                                        </div>
                                                        <div className="content profileicons mt-1  d-flex align-items-center justify-content-start">
                                                            <span>
                                                                <i class="fa-regular me-3 fa-envelope"></i>
                                                            </span>
                                                            <p className="mb-0">
                                                                {" "}
                                                                rishabhmaurya@gmail.com
                                                            </p>
                                                        </div>
                                                    </div>


                                                </div>
                                            </div>
                                            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-4">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="content w-100">

                                                            <div className="mt-2">
                                                                <div
                                                                    className=" d-flex align-items-center justify-content-start"
                                                                    style={{ height: "25px" }}
                                                                >
                                                                    <h4 className=" me-2">Extension :</h4>
                                                                    <div className='assigned0'>
                                                                        <p className="p-0 m-0 px-2 "                                                                        >
                                                                            1011
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className=" d-flex align-items-center justify-content-start"
                                                                    style={{ height: "25px" }}
                                                                >
                                                                    <h4 className=" me-2">Role Type :</h4>
                                                                    <div>
                                                                        <p className="imgwidth d-flex  ms-2 me-2" style={{ minWidth: "75px" }}>
                                                                            Agents
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className=" d-flex align-items-center justify-content-start "
                                                                    style={{ height: "25px" }}
                                                                >
                                                                    <h4 className=" me-2">TimeZone:</h4>
                                                                    <p className=" ms-2 me-2" style={{ minWidth: "75px" }}>
                                                                        17 February, 2025
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-4">
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="content w-100">
                                                            <div className="mt-2">
                                                                <div className="" style={{ height: "25px" }}>
                                                                    <h4 className="">Status</h4>
                                                                    <div className='assigned'>
                                                                        <p className="">
                                                                            Enabled
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
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="overviewTableWrapper">
                        <div className="overviewTableChild">
                            <div className="d-flex flex-wrap">
                                <div className="col-12">
                                    <div className="heading">
                                        <div className="content d-flex">
                                            <h4>
                                                My Profile{" "}
                                            </h4>
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
                                                    <i class="fa-solid fa-caret-left"></i>
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
                                                    <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-4">
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
                                                                        <i class="fa-regular me-3 fa-user"></i>
                                                                    </div>
                                                                    <h5 className="mb-0">
                                                                        Rishabh Maurya
                                                                    </h5>
                                                                </div>
                                                                <div className="content mt-1  d-flex align-items-center justify-content-start">
                                                                    <div className='profileicons'>
                                                                        <i class="fa-regular me-3 fa-envelope"></i>
                                                                    </div>
                                                                    <p className="mb-0">
                                                                        Agent
                                                                    </p>
                                                                </div>
                                                                <div className="content mt-1  d-flex align-items-center justify-content-start">
                                                                    <div className='profileicons'>
                                                                        <i class="fa-regular me-3 fa-envelope"></i>
                                                                    </div>
                                                                    <p className="mb-0">
                                                                        {" "}
                                                                        rishabhmaurya@gmail.com
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-4">
                                                        <div className="content mt-3">
                                                            <div>
                                                                <h5>Status</h5>
                                                                <div className='assigned'>
                                                                    <p className="">
                                                                        Enabled
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
                                <div className='col-12'>
                                    <div className='heading bg-transparent border-bottom-0'>
                                        <div class="content">
                                            <h4>Account Information</h4>
                                        </div>
                                        <div class="buttonGroup">
                                            <button type="button" class={`panelButton ${isEdit ? '' : 'edit'}`} onClick={() => setIsEdit(!isEdit)}>
                                                <span class="text">{isEdit ? 'Save' : 'Edit'}</span>
                                                <span class="icon">
                                                    <i class={`fa-solid fa-${isEdit ? 'floppy-disk' : 'pen'}`}></i>
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
                                                    {isEdit ? <input type="text" className="formItem" placeholder="Riddhee" /> : <h5 className='mb-0 pb-2 border-bottom'>Riddhee</h5>}
                                                </div>
                                            </div>
                                            <div className='formRow col-xl-3'>
                                                <div className='formLabel'>
                                                    <label>Last Name</label>
                                                    <label className='formItemDesc'>The Last Name of the User. Can be editable.</label>
                                                </div>
                                                <div className='col-6'>
                                                    {isEdit ? <input type="text" className="formItem" placeholder="Gupta" /> : <h5 className='mb-0 pb-2 border-bottom'>Gupta</h5>}
                                                </div>
                                            </div>
                                            <div className='formRow col-xl-3'>
                                                <div className='formLabel'>
                                                    <label>Alias</label>
                                                    <label className='formItemDesc'>The Alias or Nickname of the User. Can be editable.</label>
                                                </div>
                                                <div className='col-6'>
                                                    {isEdit ? <input type="text" className="formItem" placeholder="RiDz" /> : <h5 className='mb-0 pb-2 border-bottom'>RiDz</h5>}
                                                </div>
                                            </div>
                                            <div className='formRow col-xl-3'>
                                                <div className='formLabel'>
                                                    <label>TimeZone</label>
                                                    <label className='formItemDesc'>The set timezone of the User. Can be editable.</label>
                                                </div>
                                                <div className='col-6'>
                                                    {isEdit ? <input type="text" className="formItem" placeholder="Asia/Kolkata" /> : <h5 className='mb-0 pb-2 border-bottom'>Asia / Kolkata</h5>}
                                                </div>
                                            </div>
                                            <div className='formRow col-xl-3'>
                                                <div className='formLabel'>
                                                    <label>Role</label>
                                                    <label className='formItemDesc'>The role assigned to the User. Cannot be editable.</label>
                                                </div>
                                                <div className='col-6'>
                                                    <h5 className='mb-0 pb-2 border-bottom'>Agent</h5>
                                                </div>
                                            </div>
                                            <div className='formRow col-xl-3'>
                                                <div className='formLabel'>
                                                    <label>Email</label>
                                                    <label className='formItemDesc'>The email assigned to the User which is used at login. Cannot be editable.</label>
                                                </div>
                                                <div className='col-6'>
                                                    <h5 className='mb-0 pb-2 border-bottom'>test@email.com</h5>
                                                </div>
                                            </div>
                                            <div className='formRow col-xl-3'>
                                                <div className='formLabel'>
                                                    <label>Extension</label>
                                                    <label className='formItemDesc'>The extension assigned to the User which is used by PBX. Cannot be editable.</label>
                                                </div>
                                                <div className='col-6'>
                                                    <h5 className='mb-0 pb-2 border-bottom'>1069</h5>
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
        </main>
    )
}

export default UserProfile