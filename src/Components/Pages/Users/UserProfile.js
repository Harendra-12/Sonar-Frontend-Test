/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
// import CircularLoader from '../../Loader/CircularLoader';
import Header from "../../CommonComponents/Header";
import {
  backToTop,
  fileUploadFunction,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CircularLoader from "../../Loader/CircularLoader";
import { toast } from "react-toastify";

function UserProfile() {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(true);
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const timeZoneRefresh = useSelector((state) => state.timeZoneRefresh);
  const allTimeZone = useSelector((state) => state.timeZone);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [inputFirstName, setInputFirstName] = useState("");
  const [inputLastName, setInputLastName] = useState("");
  const [inputAlias, setInputAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [profilePicPopup, setProfilePicPopup] = useState(false);
  const [newImage, setNewImage] = useState();
  const [profileImage, setProfileImage] = useState(null);

  // Setting all the previous value for the user
  useEffect(() => {
    dispatch({
      type: "SET_TIMEZONEREFRESH",
      timeZoneRefresh: timeZoneRefresh + 1,
    });
    setInputAlias(account.alias);
    setProfileImage(account.profile_picture);
    setSelectedTimezone(account?.timezone_id);
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
  }, []);

  async function handleNewImage() {
    if (newImage) {
      const maxSizeInMB = 2;
      const fileSizeInMB = newImage.size / (1024 * 1024);
      if (fileSizeInMB > maxSizeInMB) {
        toast.error(`Please choose a file less than ${maxSizeInMB}MB.`);
      } else {
        // setLoading(true);
        const parsedData = new FormData();
        parsedData.append("profile_picture", newImage);
        setProfilePicPopup(!profilePicPopup);
        const apiData = await fileUploadFunction(
          `/user/update-profile-picture/${account.id}`,
          parsedData
        );
        if (apiData.status) {
          setLoading(false);
          setProfileImage(apiData?.data?.profile_picture);
          setProfilePicPopup(!profilePicPopup);
          // setRefresh(refresh + 1);
          toast.success(apiData.message);
        } else {
          setProfilePicPopup(!profilePicPopup);
          setLoading(false);
          toast.error(apiData.message);
        }
      }
    } else {
      toast.error("Please choose a file");
    }
  }

  // Handle the update logic for user edit
  const handleSave = async () => {
    if (isEdit) {
      const payload = {
        // email: account.email,
        // domain_id: domainId,
        timezone_id: selectedTimezone,
        // status: account.status,
        // role_id: account?.user_role?.role_id,
        // account_id: account.account_id,
        permissions: account.permissions,
        extension_id: account.extension.id,
        // usages: account.usages,
        alias: inputAlias,
        name: `${inputFirstName} ${inputLastName}`,
      };
      setLoading(true);
      try {
        await generalPutFunction(`user/${account.id}`, payload).then((res) => {
          if (res.status) {
            toast.success(res.message);
          }
        }).catch((err) => {
          toast.error(err?.message);
        });
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
          <div className="px-2 pt-2 pb-4">
            <div className="col-12 pt-3" >
              <div className="profileView">
                <div className="profileDetailsHolder p-0 shadow-none">
                  <div className="baseDetails d-block ">
                    <div className="pro_bg">
                      <img
                        src={require('../../assets/images/profile-bg1.webp')} alt="profile-bg" />
                    </div>
                    <div className="card profile_info border-0 ">
                      <div className="card-body ">
                        <div className="row">
                          <div className="col-xl-4 col-lg-5 col-md-5 mb-2">
                            <div className="card mb-0 border-0 shadow_sm rounded-4">
                              <div className="card-body">
                                <div className="row">
                                  <div className="col-12">
                                    <div className="d-flex align-items-center flex-column">
                                      <div className="profilePicHolders position-static mb-4">
                                        <div className="profile_image"
                                          style={{
                                            position: "relative",
                                            cursor: "pointer",
                                            width: "100%",
                                            height: "100%",
                                          }}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setProfilePicPopup(!profilePicPopup);
                                          }}
                                        >
                                          <i
                                            className="fa-solid fa-pen profilePhotoEditIcon"
                                            style={{
                                              height: "26px",
                                              width: "26px",
                                              fontSize: "9px",
                                            }}
                                          ></i>
                                          <img
                                            src={
                                              profileImage
                                                ? profileImage
                                                : require('../../assets/images/placeholder-image.webp')
                                            }
                                            onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                            alt="profile"
                                          />
                                        </div>
                                      </div>
                                      <div className="w-100 ">
                                        <h5 className="mb-0 text-center">{account?.name}</h5>
                                        {account?.usertype && <div className="content mt-1  d-flex align-items-center justify-content-center">
                                          <div className="profileicons">
                                            <i className="fa-regular me-2 fa-id-card"></i>
                                          </div>
                                          <p className="mb-0">{account?.usertype}</p>
                                        </div>}
                                        <div className="content mt-1  d-flex align-items-center justify-content-center">
                                          <div className="profileicons">
                                            <i className="fa-regular me-2 fa-envelope"></i>
                                          </div>
                                          <p className="mb-0"> {account.email}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-xl-8 col-lg-7 col-md-7">
                            <div className="card shadow_sm border-0 rounded-4">
                              <div className="card-body">
                                {loading && <CircularLoader />}
                                <div className="col-12">
                                  <div className="heading bg-transparent border-bottom-0 d-flex justify-content-between align-items-center flex-wrap">
                                    <div className="content">
                                      <h4 className="fs-5">Account Information</h4>
                                    </div>
                                    <div className="d-flex">
                                      <button className="panelButton gray m-0"
                                        onClick={() => {
                                          navigate(-1);
                                          backToTop();
                                        }}
                                      >
                                        <span className="text">Back</span>
                                        <span className="icon"><i className="fa-solid fa-caret-left" /></span>
                                      </button>
                                      <button onClick={handleSave} type="button" class={`ms-2 btn btn-success-light btn-wave new_buttonStyle`}
                                        style={{ maxWidth: 'none' }}
                                      >
                                        <span>Update</span> <i
                                          className={`fa-solid fa-${isEdit ? "floppy-disk" : "pen"
                                            }`}
                                        ></i>
                                      </button>
                                    </div>
                                    {/* <div className="buttonGroup ">
                                        <button
                                          type="button"
                                          className={`panelButton ${isEdit ? "" : "edit"}`}
                                          onClick={handleSave}
                                        >
                                          <span className="text">
                                            {isEdit ? "Save" : "Edit"}
                                          </span>
                                          <span className="icon">
                                            <i
                                              className={`fa-solid fa-${isEdit ? "floppy-disk" : "pen"
                                                }`}
                                            ></i>
                                          </span>
                                        </button>
                                      </div> */}
                                  </div>
                                  <div className=" col-12">
                                    <div className="row">
                                      <div className="formRow col-12">
                                        <div className="formLabel">
                                          <label>First Name</label>
                                          <label className="formItemDesc">
                                            The First Name of the User.
                                          </label>
                                        </div>
                                        <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12">
                                          {isEdit ? (
                                            <input
                                              type="text"
                                              className="formItem"
                                              value={inputFirstName}
                                              onChange={(e) =>
                                                setInputFirstName(e.target.value)
                                              }
                                            />
                                          ) : (
                                            <h5 className="mb-0 pb-2 border-bottom">
                                              {inputFirstName}
                                            </h5>
                                          )}
                                        </div>
                                      </div>
                                      <div className="formRow col-12">
                                        <div className="formLabel">
                                          <label>Last Name</label>
                                          <label className="formItemDesc">
                                            The Last Name of the User.
                                          </label>
                                        </div>
                                        <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12">
                                          {isEdit ? (
                                            <input
                                              type="text"
                                              className="formItem"
                                              value={inputLastName}
                                              onChange={(e) =>
                                                setInputLastName(e.target.value)
                                              }
                                            />
                                          ) : (
                                            <h5 className="mb-0 pb-2 border-bottom">
                                              {inputLastName}
                                            </h5>
                                          )}
                                        </div>
                                      </div>
                                      <div className="formRow col-12">
                                        <div className="formLabel">
                                          <label>Alias</label>
                                          <label className="formItemDesc">
                                            The Alias or Nickname of the User. Can be
                                            editable.
                                          </label>
                                        </div>
                                        <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12">
                                          {isEdit ? (
                                            <input
                                              type="text"
                                              className="formItem"
                                              value={inputAlias}
                                              onChange={(e) => setInputAlias(e.target.value)}
                                            />
                                          ) : (
                                            <h5 className="mb-0 pb-2 border-bottom">
                                              {inputAlias}
                                            </h5>
                                          )}
                                        </div>
                                      </div>
                                      <div className="formRow col-12">
                                        <div className="formLabel">
                                          <label>TimeZone</label>
                                          <label className="formItemDesc">
                                            The set timezone of the User.
                                          </label>
                                        </div>
                                        <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12">
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
                                      <div className="border-bottom" />
                                      <div className="formRow col-12">
                                        <div className="formLabel">
                                          <label>Username</label>
                                          <label className="formItemDesc">
                                            The username assigned to the User. Cannot be
                                            editable.
                                          </label>
                                        </div>
                                        <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12">
                                          <h5 className="mb-0 pb-2">
                                            {account?.username}
                                          </h5>
                                        </div>
                                      </div>
                                      {account.usertype == "Company" ? (
                                        <></>
                                      ) : (
                                        <div className="formRow col-12">
                                          <div className="formLabel">
                                            <label>Role</label>
                                            <label className="formItemDesc">
                                              The role assigned to the User.
                                            </label>
                                          </div>
                                          <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12">
                                            <h5 className="mb-0 pb-2">Agent</h5>
                                          </div>
                                        </div>
                                      )}
                                      <div className="formRow col-12">
                                        <div className="formLabel">
                                          <label>Email</label>
                                          <label className="formItemDesc">
                                            The email assigned to the User which is used at
                                            login.
                                          </label>
                                        </div>
                                        <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12">
                                          <h5 className="mb-0 pb-2">
                                            {account?.email}
                                          </h5>
                                        </div>
                                      </div>
                                      <div className="formRow col-12">
                                        <div className="formLabel">
                                          <label>Extension</label>
                                          <label className="formItemDesc">
                                            The extension assigned to the User which is used
                                            by PBX.
                                          </label>
                                        </div>
                                        <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12">
                                          <h5 className="mb-0 pb-2">
                                            {account?.extension?.extension}
                                          </h5>
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
              </div>
            </div>
          </div>


          {/* <div className="overviewTableWrapper">
            <div className="overviewTableChild">
              <div className="d-flex flex-wrap">
                <div className="col-12">
                  <div className="heading">
                    <div className="content">
                      <h4>My Profile </h4>
                      <p>
                        Here you can view all the necessary information
                        regarding your profile and can edit it.
                      </p>
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
                <div
                  className="col-12"
                  style={{ borderBottom: "1px solid var(--border-color)" }}
                >
                  <div className="profileView">
                    <div className="profileDetailsHolder p-0 shadow-none">
                      <div className="baseDetails d-block">
                        <div className="row">
                          <div className="col-xxl-6 col-xl-7 col-lg-9 col-md-7">
                            <div className="d-flex align-items-center">
                              <div className="profilePicHolders position-static">
                                <div
                                  style={{
                                    position: "relative",
                                    cursor: "pointer",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setProfilePicPopup(!profilePicPopup);
                                  }}
                                >
                                  <i
                                    className="fa-solid fa-pen profilePhotoEditIcon"
                                    style={{
                                      height: "32px",
                                      width: "32px",
                                      fontSize: "16px",
                                    }}
                                  ></i>
                                  <img
                                    src={
                                      profileImage
                                        ? profileImage
                                        : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                    }
                                    alt="profile"
                                  />
                                </div>
                              </div>
                              <div className="ms-5">
                                <div className="content mt-1 d-flex align-items-center justify-content-start">
                                  <div className="profileicons">
                                    <i className="fa-regular me-3 fa-user"></i>
                                  </div>
                                  <h5 className="mb-0">{account?.name}</h5>
                                </div>
                                <div className="content mt-1  d-flex align-items-center justify-content-start">
                                  <div className="profileicons">
                                    <i className="fa-regular me-3 fa-id-card"></i>
                                  </div>
                                  <p className="mb-0">{account?.usertype}</p>
                                </div>
                                <div className="content mt-1  d-flex align-items-center justify-content-start">
                                  <div className="profileicons">
                                    <i className="fa-regular me-3 fa-envelope"></i>
                                  </div>
                                  <p className="mb-0"> {account.email}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3">
                            <div className="content mt-3">
                              <div>
                                <h5>Status</h5>
                                <div className="assigned">
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
                {loading ? (
                  <>
                    <CircularLoader />
                  </>
                ) : (
                  <div className="col-12">
                    <div className="heading bg-transparent border-bottom-0">
                      <div className="content">
                        <h4>Account Information</h4>
                      </div>
                      <div className="buttonGroup">
                        <button
                          type="button"
                          className={`panelButton ${isEdit ? "" : "edit"}`}
                          onClick={handleSave}
                        >
                          <span className="text">
                            {isEdit ? "Save" : "Edit"}
                          </span>
                          <span className="icon">
                            <i
                              className={`fa-solid fa-${isEdit ? "floppy-disk" : "pen"
                                }`}
                            ></i>
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className=" col-12">
                      <div className="row" style={{ padding: "0 25px 15px" }}>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>First Name</label>
                            <label className="formItemDesc">
                              The First Name of the User.
                            </label>
                          </div>
                          <div className="col-6">
                            {isEdit ? (
                              <input
                                type="text"
                                className="formItem"
                                value={inputFirstName}
                                onChange={(e) =>
                                  setInputFirstName(e.target.value)
                                }
                              />
                            ) : (
                              <h5 className="mb-0 pb-2 border-bottom">
                                {inputFirstName}
                              </h5>
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>Last Name</label>
                            <label className="formItemDesc">
                              The Last Name of the User.
                            </label>
                          </div>
                          <div className="col-6">
                            {isEdit ? (
                              <input
                                type="text"
                                className="formItem"
                                value={inputLastName}
                                onChange={(e) =>
                                  setInputLastName(e.target.value)
                                }
                              />
                            ) : (
                              <h5 className="mb-0 pb-2 border-bottom">
                                {inputLastName}
                              </h5>
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>Alias</label>
                            <label className="formItemDesc">
                              The Alias or Nickname of the User. Can be
                              editable.
                            </label>
                          </div>
                          <div className="col-6">
                            {isEdit ? (
                              <input
                                type="text"
                                className="formItem"
                                value={inputAlias}
                                onChange={(e) => setInputAlias(e.target.value)}
                              />
                            ) : (
                              <h5 className="mb-0 pb-2 border-bottom">
                                {inputAlias}
                              </h5>
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>TimeZone</label>
                            <label className="formItemDesc">
                              The set timezone of the User.
                            </label>
                          </div>
                          <div className="col-6">
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
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>Username</label>
                            <label className="formItemDesc">
                              The username assigned to the User. Cannot be
                              editable.
                            </label>
                          </div>
                          <div className="col-6">
                            <h5 className="mb-0 pb-2 border-bottom">
                              {account?.username}
                            </h5>
                          </div>
                        </div>
                        {account.usertype == "Company" ? (
                          <></>
                        ) : (
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label>Role</label>
                              <label className="formItemDesc">
                                The role assigned to the User. Cannot be
                                editable.
                              </label>
                            </div>
                            <div className="col-6">
                              <h5 className="mb-0 pb-2 border-bottom">Agent</h5>
                            </div>
                          </div>
                        )}
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>Email</label>
                            <label className="formItemDesc">
                              The email assigned to the User which is used at
                              login.
                            </label>
                          </div>
                          <div className="col-6">
                            <h5 className="mb-0 pb-2 border-bottom">
                              {account?.email}
                            </h5>
                          </div>
                        </div>
                        <div className="formRow col-xl-3">
                          <div className="formLabel">
                            <label>Extension</label>
                            <label className="formItemDesc">
                              The extension assigned to the User which is used
                              by PBX.
                            </label>
                          </div>
                          <div className="col-6">
                            <h5 className="mb-0 pb-2 border-bottom">
                              {account?.extension?.extension}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div> */}
        </div>
      </section>

      {profilePicPopup ? (
        <div className="popup music">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="card px-0 col-xl-4 col-md-6">
                <div className="header">
                  <h5 className="card-title fs14 border-bootm fw700">
                    Upload Profile Picture
                  </h5>
                </div>
                <div className="card-body">
                  {newImage ? (
                    // Show image preview if a file is uploaded
                    <div className="image-container mx-2 text-center position-relative">
                      <img
                        src={URL.createObjectURL(newImage)}
                        alt="Profile Preview"
                        style={{
                          width: "200px",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          border: "5px solid var(--border-color)",
                        }}
                      />
                      <button
                        className="clearButton2 xl ms-2"
                        style={{ position: "absolute", top: "0px", right: "0px" }}
                        onClick={() => setNewImage(null)}
                      >
                        <i className="fa-sharp fa-solid fa-trash" />
                      </button>
                    </div>
                  ) : (
                    // Show upload options if no file is uploaded
                    <div
                      className="popup-border text-center p-2"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.classList.add("drag-over");
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.classList.remove("drag-over");
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.classList.remove("drag-over");

                        const file = e.dataTransfer.files[0];
                        if (file) {
                          if (
                            ![
                              "image/jpeg",
                              "image/jpg",
                              "image/png",
                              "image/gif",
                            ].includes(file.type)
                          ) {
                            toast.error(
                              "Only JPG, JPEG, PNG & GIF files are allowed."
                            );
                            return;
                          }

                          const fileSizeInMB = file.size / (1024 * 1024);
                          if (fileSizeInMB > 2) {
                            toast.error("File size must be less than 2MB");
                            return;
                          }

                          const fileName = file.name.replace(/ /g, "-");
                          const newFile = new File([file], fileName, {
                            type: file.type,
                          });
                          setNewImage(newFile);
                        }
                      }}
                    >
                      <input
                        type="file"
                        className="form-control-file d-none"
                        id="fileInput"
                        accept=".jpg,.jpeg,.png,.gif"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (
                              ![
                                "image/jpeg",
                                "image/jpg",
                                "image/png",
                                "image/gif",
                              ].includes(file.type)
                            ) {
                              toast.error(
                                "Only JPG, JPEG, PNG & GIF files are allowed."
                              );
                              return;
                            }

                            const fileSizeInMB = file.size / (1024 * 1024);
                            if (fileSizeInMB > 2) {
                              toast.error("File size must be less than 2MB");
                              return;
                            }

                            const fileName = file.name.replace(/ /g, "-");
                            const newFile = new File([file], fileName, {
                              type: file.type,
                            });
                            setNewImage(newFile);
                          }
                        }}
                      />
                      <label htmlFor="fileInput" className="d-block">
                        <div className="test-user text-center">
                          <i
                            style={{ fontSize: 30 }}
                            className="fa-solid fa-cloud-arrow-up"
                          />
                          <p className="mb-0 mt-2 text-center">
                            Drag and Drop or <span>Click on upload</span>
                          </p>
                          <span>
                            Supports formats: JPG, JPEG, PNG, GIF (Max Size:
                            2MB)
                          </span>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
                <div className="card-footer">
                  <div className="d-flex justify-content-between">
                    <button
                      className="panelButton m-0"
                      onClick={handleNewImage}
                      disabled={!newImage}
                    >
                      <span className="text">Confirm</span>
                      <span className="icon">
                        <i className="fa-solid fa-check"></i>
                      </span>
                    </button>
                    <button
                      className="panelButton gray"
                      onClick={() => {
                        setProfilePicPopup(false);
                        setNewImage(null);
                      }}
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
    </main>
  );
}

export default UserProfile;
