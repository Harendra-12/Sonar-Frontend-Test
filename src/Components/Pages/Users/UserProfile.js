import React, { useEffect, useState } from 'react'
// import CircularLoader from '../../Loader/CircularLoader';
import Header from '../../CommonComponents/Header';
import Tippy from '@tippyjs/react';
import { backToTop, generalPutFunction } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function UserProfile() {
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);
    const dispatch=useDispatch();
    const account=useSelector((state)=>state.account);
    const timeZoneRefresh=useSelector((state)=>state.timeZoneRefresh)
    const allTimeZone=useSelector((state)=>state.timeZone)
    const [selectedTimezone,setSelectedTimezone]=useState("")
    const [inputFirstName,setInputFirstName]=useState("");
    const [inputLastName,setInputLastName]=useState("");
    const [inputAlias,setInputAlias]=useState("");
    const [loading,setLoading]=useState(false);
    
    
    useEffect(()=>{
        dispatch({
            type: "SET_TIMEZONEREFRESH",
            timeZoneRefresh: timeZoneRefresh + 1,
          });

    },[])
    useEffect(()=>{
        if(timeZoneRefresh>0){
          const timezone=allTimeZone.find((item)=>{
           return item?.id==account?.timezone_id
          }) 
          setSelectedTimezone(account?.timezone_id) 
        }
    },[timeZoneRefresh])

    const handleSave = async () => {
        setIsEdit(!isEdit);
      if(isEdit){
        const payload = {
            name: `${inputFirstName} ${inputLastName}`,
            // email: account.email,
            // domain_id: domainId,
            timezone_id: selectedTimezone,
            status: account.status,
            role_id:account?.user_role?.role_id,
            account_id: account.id,
            permissions: account.permissions,
            extension_id: account.extension.id,
            usages: account.usages,
            alias: inputAlias,
          };
        
          setLoading(true);
          try {
            const addUser = await generalPutFunction(`user/${account.account_id}`, payload);
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
                                                                        {account?.name}
                                                                    </h5>
                                                                </div>
                                                                <div className="content mt-1  d-flex align-items-center justify-content-start">
                                                                    <div className='profileicons'>
                                                                        <i class="fa-regular me-3 fa-envelope"></i>
                                                                    </div>
                                                                    <p className="mb-0">
                                                                       {account?.usertype}
                                                                    </p>
                                                                </div>
                                                                <div className="content mt-1  d-flex align-items-center justify-content-start">
                                                                    <div className='profileicons'>
                                                                        <i class="fa-regular me-3 fa-envelope"></i>
                                                                    </div>
                                                                    <p className="mb-0">
                                                                        {" "}
                                                                        {account.email}
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
                                                                        {account.status=="E"?"Enabled":""}
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
                                            {/* <button type="button" class={`panelButton ${isEdit ? '' : 'edit'}`} onClick={handleSave}>
                                                <span class="text">{isEdit ? 'Save' : 'Edit'}</span>
                                                <span class="icon">
                                                    <i class={`fa-solid fa-${isEdit ? 'floppy-disk' : 'pen'}`}></i>
                                                </span>
                                            </button> */}
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
                                                    {isEdit ? <input type="text" className="formItem" placeholder={account?.name.split(" ")[0]} onChange={(e)=>setInputFirstName(e.target.value)}/> : <h5 className='mb-0 pb-2 border-bottom'>{account?.name.split(" ")[0]}</h5>}
                                                </div>
                                            </div>
                                            <div className='formRow col-xl-3'>
                                                <div className='formLabel'>
                                                    <label>Last Name</label>
                                                    <label className='formItemDesc'>The Last Name of the User. Can be editable.</label>
                                                </div>
                                                <div className='col-6'>
                                                    {isEdit ? <input type="text" className="formItem" placeholder={account?.name.split(" ")[1]} onChange={(e)=>setInputLastName(e.target.value)}/> : <h5 className='mb-0 pb-2 border-bottom'>{account?.name.split(" ")[1]}</h5>}
                                                </div>
                                            </div>
                                            <div className='formRow col-xl-3'>
                                                <div className='formLabel'>
                                                    <label>Alias</label>
                                                    <label className='formItemDesc'>The Alias or Nickname of the User. Can be editable.</label>
                                                </div>
                                                <div className='col-6'>
                                                    {isEdit ? <input type="text" className="formItem" placeholder={account.alias} onChange={(e)=>setInputAlias(e.target.value)}/> : <h5 className='mb-0 pb-2 border-bottom'>{account.alias}</h5>}
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
                                    {/* <div className="col-4 ps-0">
                                      <button
                                        className="panelButton static ms-0 w-100"
                                        style={{ height: "34px" }}
                                        onClick={() => handleChangeTimeZone()}
                                      >
                                        <span className="text">Change</span>
                                      </button>
                                    </div> */}
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
                                                    <h5 className='mb-0 pb-2 border-bottom'>{account.name}</h5>
                                                </div>
                                            </div>
                                          {account.usertype=="Company"?<></>:  <div className='formRow col-xl-3'>
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