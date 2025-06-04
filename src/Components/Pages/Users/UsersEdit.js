/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  backToTop,
  generalGetFunction,
  generalPutFunction,
  fileUploadPutFunction,
  fileUploadFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useForm } from "react-hook-form";
import {
  emailValidator,
  nameValidator,
  noSpecialCharactersValidator,
  requiredValidator,
  restrictToAllowedChars,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import Header from "../../CommonComponents/Header";
import SkeletonFormLoader from "../../Loader/SkeletonFormLoader";
import { PermissionConfigTable } from "../../CommonComponents/PermissionConfigForUser";

const UsersEdit = ({ page, setUsersDetails }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const locationState = location.state;
  const showHeader = location.pathname == "/users-edit";
  const accountDetails = useSelector((state) => state.accountDetails);
  const accountDetailsRefresh = useSelector(
    (state) => state.accountDetailsRefresh
  );
  const permissions = useSelector((state) => state.permissions);
  const [timeZone, setTimeZone] = useState("");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState([]);
  const [selectedRole, setSelectedRole] = useState();
  const [defaultPermission, setDefaultPermission] = useState();
  const [selectedPermission, setSelectedPermission] = useState([]);
  const [userPermissionBridge, setUserPermissionBridge] = useState([]);
  const [editPermission, setEditPermission] = useState(false);

  const [extension, setExtension] = useState();
  const [user, setUser] = useState();
  // const [filterExtensions, setFilterExtensions] = useState();
  const allUser = useSelector((state) => state.allUser);
  const extensionAllRefresh = useSelector((state) => state.extensionAllRefresh);
  const extensionAll = useSelector((state) => state.extensionAll);
  const [password, setPassword] = useState("");
  const [popUp, setPopUp] = useState(false);
  const [parentChecked, setParentChecked] = useState({});
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const account = useSelector((state) => state.account);
  const [searchExtensions, setSearchExtensions] = useState();
  const [selectedSearch, setSelectedSearch] = useState({
    label: "",
    value: "",
  });
  const [profilePicPopup, setProfilePicPopup] = useState(false);
  const [newImage, setNewImage] = useState();
  const [isCustomerAdmin, setIsCustomerAdmin] = useState(
    locationState?.usertype == "Company"
  );
  const [profileImage, setProfileImage] = useState(null);
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();

  // If login then Getting dataa of permission timezone and role and setting fordata using reset function of useForm hook on initial load of page else navigate to login page
  useEffect(() => {
    if (account === null) {
      navigate("/");
    } else {
      async function getDomain() {
        const permissionData = await generalGetFunction("/permission");
        const timeZ = await generalGetFunction(`/timezone/all`);
        const apiRole = await generalGetFunction(`/role/all`);
        if (timeZ?.status) {
          setTimeZone(
            timeZ.data.map((item) => {
              return [item.id, item.name];
            })
          );
        }
        if (apiRole?.status) {
          if (apiRole.data.length > 0) {
            setRole(apiRole.data);
          } else {
            navigate("/roles");
          }
        }
        if (permissionData?.status) {
          setLoading(false);
          setDefaultPermission(permissionData.data);
        } else {
          setLoading(false);
        }
      }
      getDomain();
      if (locationState) {
        async function getData() {
          if (locationState) {
            let data = locationState;
            let firstName = "";
            let lastName = "";
            const {
              name,
              user_role, // Default to an empty object if user_role is null or undefined
              usertype,
            } = data;
            let role_id = "";
            if (user_role) {
              role_id = user_role.role_id;
            } else {
              role_id = "";
            }
            if (usertype == "Company") {
              setIsCustomerAdmin(true);
            }

            const separateName = name.split(" ");
            if (separateName.length == 1) {
              firstName = separateName[0];
            } else if (separateName.length == 2) {
              firstName = separateName[0];
              lastName = separateName[1];
            } else {
              firstName = separateName[0];
              lastName = separateName.slice(1, separateName.length).join(" ");
            }
            const newData = {
              ...data,
              ...{
                firstName: firstName,
                lastName: lastName,
                role_id: `${role_id}`,
              },
            };
            setUsersDetails({ user_id: newData.id, role_id: newData.role_id });
            setSelectedSearch({
              label: newData?.extension?.extension,
              value: newData?.extension_id,
            });
            if (!isCustomerAdmin) {
              setSelectedPermission(newData.permissions);
              if (newData?.user_role) {
                setSelectedRole(newData?.user_role["roles"]?.name);
              }
            }

            setProfileImage(newData?.profile_picture);
            // setNewImage(newData?.profile_picture);
            delete newData.name;
            delete newData.user_role;
            delete newData.permissions;
            reset(newData);
          }
        }
        if (account.id) {
          getData();
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    }
  }, [account, navigate]);

  // Getting user and extension data to check which extension is not assigned
  useEffect(() => {
    if (allUserRefresh > 0) {
      setUser(allUser.data);
    } else {
      dispatch({
        type: "SET_ALLUSERREFRESH",
        allUserRefresh: allUserRefresh + 1,
      });
    }
    if (extensionAllRefresh > 0) {
      setExtension(extensionAll.data);
    } else {
      dispatch({
        type: "SET_EXTENSIONALLREFRESH",
        extensionAllRefresh: extensionAllRefresh + 1,
      });
    }
  }, [allUser, extensionAll]);

  // Filtering unused extension
  useEffect(() => {
    if (extension && user && locationState) {
      const data = extension.filter((item) => {
        return !user.some((userItem) => {
          return (
            userItem.extension_id === item.id &&
            userItem.extension_id !== locationState.extension_id
          );
        });
      });
      // setFilterExtensions(data);
      let filteredData;
      if (data.length > 0) {
        filteredData = data.filter(
          (item) => item?.extension !== account?.extension?.extension
        );
      }
      const options = filteredData?.map((extension) => ({
        value: extension?.id,
        label: extension?.extension,
      }));

      setSearchExtensions([{ value: null, label: "None" }, ...options]);
    }
  }, [accountDetails, user, locationState, extension]);

  // Get the latest data of account
  useEffect(() => {
    dispatch({
      type: "SET_ACCOUNTDETAILSREFRESH",
      accountDetailsRefresh: accountDetailsRefresh + 1,
    });
  }, []);

  //   Handle new music function to add new music
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
          `/user/update-profile-picture/${locationState.id}`,
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

  // Handle edit user form submit
  const handleFormSubmit = handleSubmit(async (data) => {
    if (password !== "" && password.length < 6) {
      toast.error("Password must be at least 5 characters");
      return;
    }
    if (userPermissionBridge?.permissions?.length === 0 || userPermissionBridge?.sectionPermissions?.length === 0 || userPermissionBridge?.tablePermissions?.length === 0) {
      toast.error("Permissions cannot be empty!");
      return;
    }
    const {
      firstName,
      lastName,
      email,
      // domain_id,
      timezone_id,
      status,
      role_id,
    } = data;

    let updatedData = {
      ...data,
      extension_id: selectedSearch.value,
      ...{
        name: `${firstName} ${lastName}`,
      },
    };

    delete updatedData.firstName;
    delete updatedData.lastName;

    const payload = {
      name: `${firstName} ${lastName}`,
      email,
      // domain_id: domainId,
      timezone_id,
      status,
      role_id,
      account_id: account.account_id,
      // permissions: selectedPermission,
      sectionPermissions: userPermissionBridge.sectionPermissions,
      permissions: userPermissionBridge.permissions,
      tablePermissions: userPermissionBridge.tablePermissions,
      extension_id: selectedSearch.value,
      usages: data.usages,
      alias: data.alias,
      ...(password && password.length > 5 && { password }),
    };
    setLoading(true);
    const addUser = await generalPutFunction(
      `user/${locationState.id}`,
      payload
    );
    if (addUser.status) {
      setLoading(false);
      setPopUp(false);
      toast.success(addUser.message);
      dispatch({
        type: "SET_ALLUSERREFRESH",
        allUserRefresh: allUserRefresh + 1,
      });

      // navigate(-1); // Navigate back to the previous page
    } else {
      setLoading(false);
    }
  });

  // Filter out permissions base on the availabe id's inside user section
  const filterPermissionById = (data, idArray) => {
    const result = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const filteredItems = data[key].filter((item) =>
          idArray?.includes(item.id)
        );
        if (filteredItems.length > 0) {
          result[key] = filteredItems;
        }
      }
    }
    return result;
  };

  const filteredPermission = filterPermissionById(
    defaultPermission,
    account?.permissions
  );

  // Initialize parentChecked state
  useEffect(() => {
    const initialParentChecked = {};
    Object.keys(filteredPermission).forEach((item) => {
      initialParentChecked[item] = filteredPermission[item].every((innerItem) =>
        selectedPermission.includes(innerItem.id)
      );
    });
    setParentChecked(initialParentChecked);
  }, [selectedPermission, defaultPermission]);

  // Handle permission check box click
  const handleCheckboxChange = (id) => {
    const newSelectedPermission = selectedPermission.includes(id)
      ? selectedPermission.filter((item) => item !== id)
      : [...selectedPermission, id];

    setSelectedPermission(newSelectedPermission);

    // Update parent checkbox state
    const updatedParentChecked = {};
    Object.keys(filteredPermission).forEach((item) => {
      updatedParentChecked[item] = filteredPermission[item].every((innerItem) =>
        newSelectedPermission.includes(innerItem.id)
      );
    });
    setParentChecked(updatedParentChecked);
  };

  // Handle parent checkbox change
  const handleParentCheckboxChange = (item) => {
    const newParentChecked = !parentChecked[item];
    const newSelectedPermission = [...selectedPermission];

    filteredPermission[item].forEach((innerItem) => {
      const index = newSelectedPermission.indexOf(innerItem.id);
      if (newParentChecked) {
        if (index === -1) newSelectedPermission.push(innerItem.id);
      } else {
        if (index > -1) newSelectedPermission.splice(index, 1);
      }
    });

    setSelectedPermission(newSelectedPermission);
    setParentChecked({ ...parentChecked, [item]: newParentChecked });
  };
  const handleSelectInputChange = (inputValue, { action }) => {
    if (action === "input-change") {
      const numericInput = inputValue.replace(/[^0-9]/g, "");
      // setSelectedExtension(numericInput)
      return numericInput;
    }
    return inputValue;
  };
  return (
    <>
      <style>
        {`
        .permissionListWrapper .formRow .formLabel{
          margin-left: 10px;
        }
      `}
      </style>
      <main
        className={
          page === "marginleftAdjust" ? "mainContentAgents ms-0" : "mainContent"
        }
      >
        <section id="phonePage">
          {showHeader && (
            <div className="container-fluid px-0">
              <Header title="Users" />
            </div>
          )}

          <div className="col-xl-12">
            {loading ? (
              <div colSpan={99}>
                <SkeletonFormLoader />
              </div>
            ) : (
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div
                    className="d-flex flex-wrap"
                    style={{ position: "sticky", top: "0", zIndex: "9" }}
                  >
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>User Edit</h4>
                          <p>Edit user information and group membership.</p>
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
                              <i className="fa-solid fa-caret-left"></i>
                            </span>
                          </button>
                          <button
                            type="button"
                            effect="ripple"
                            className="panelButton"
                            disabled={isCustomerAdmin}
                            onClick={handleFormSubmit}
                          >
                            <span className="text">Save</span>
                            <span className="icon">
                              <i className="fa-solid fa-floppy-disk"></i>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="col-12"
                    style={{
                      padding: "25px 23px",
                    }}
                  >
                    <div className="row gx-5">
                      <div className="col-xl-6">
                        <form action="#" className="row px-2">
                          <div className="formRow col-xl-12">
                            <div className="formLabel">
                              <label htmlFor="">
                                Username <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("username", {
                                  ...requiredValidator,
                                })}
                                disabled
                                onKeyDown={restrictToAllowedChars}
                              />
                              {errors.username && (
                                <ErrorMessage text={errors.username.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-12">
                            <div className="formLabel">
                              <label htmlFor="">
                                Email <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div className="col-6">
                              <input
                                type="email"
                                name="extension"
                                className="formItem"
                                {...register("email", {
                                  ...requiredValidator,
                                  ...emailValidator,
                                })}
                                onKeyDown={restrictToAllowedChars}
                              />
                              {errors.email && (
                                <ErrorMessage text={errors.email.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-12">
                            <div className="formLabel">
                              <label htmlFor="">
                                First Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("firstName", {
                                  ...requiredValidator,
                                  ...nameValidator,
                                  ...noSpecialCharactersValidator,
                                })}
                                onKeyDown={restrictToAllowedChars}
                              />
                              {errors.firstName && (
                                <ErrorMessage text={errors.firstName.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-12">
                            <div className="formLabel">
                              <label htmlFor="">Last Name</label>
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("lastName", {
                                  ...noSpecialCharactersValidator,
                                })}
                                onKeyDown={restrictToAllowedChars}
                              />
                              {errors.lastName && (
                                <ErrorMessage text={errors.lastName.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-12">
                            <div className="formLabel">
                              <label htmlFor="">Alias/Nickname</label>
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                name="extension"
                                className="formItem"
                                {...register("alias", {
                                  ...noSpecialCharactersValidator,
                                })}
                                onKeyDown={restrictToAllowedChars}
                              />
                            </div>
                          </div>
                          <div className="formRow col-xl-12">
                            <div className="formLabel">
                              <label htmlFor="">Profile Picture</label>
                            </div>
                            <div className="col-6">
                              <div className="profileView p-0">
                                <button
                                  style={{
                                    border: "none",
                                    backgroundColor: "transparent",
                                    cursor: "pointer",
                                    padding: '0'
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setProfilePicPopup(!profilePicPopup);
                                  }}
                                >
                                  <div
                                    className="profileHolder"
                                    style={{
                                      height: "50px",
                                      width: "50px",
                                      position: "relative",
                                      cursor: "pointer",
                                      borderRadius: "50%",
                                      border: '2px solid var(--border-color)',
                                    }}
                                  >
                                    {profileImage ? (
                                      <i className="fa-solid fa-pen profilePhotoEditIcon"></i>
                                    ) : (
                                      <i className="fa-solid fa-plus profilePhotoAddIcon"></i>
                                    )}

                                    <img
                                      src={
                                        // profileImage
                                        //   ? URL.createObjectURL(profileImage)
                                        //   : profileImage ||
                                        profileImage
                                          ? profileImage
                                          : require('../../assets/images/placeholder-image.webp')
                                      }
                                      alt="profile"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "50%",
                                      }}
                                      onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                    />
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="formRow col-xl-12">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">
                                Time Zone <span className="text-danger">*</span>
                              </label>
                              <label htmlFor="data" className="formItemDesc">
                                Select the default time zone.
                              </label>
                            </div>
                            <div className="col-6">
                              <select
                                className="formItem"
                                name=""
                                value={watch().timezone_id}
                                {...register("timezone_id", {
                                  ...requiredValidator,
                                })}
                              >
                                <option disabled value="">
                                  Select Time Zone
                                </option>
                                {timeZone &&
                                  timeZone.map((item, key) => {
                                    return (
                                      <option value={item[0]} key={key}>
                                        {item[1]}
                                      </option>
                                    );
                                  })}
                              </select>
                              {errors?.timezone_id && (
                                <ErrorMessage
                                  text={errors?.timezone_id.message}
                                />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-12">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">
                                Status <span className="text-danger">*</span>
                              </label>
                              <label htmlFor="data" className="formItemDesc">
                                Set the user's account status.
                              </label>
                            </div>
                            <div className="col-6">
                              <select
                                className="formItem"
                                name=""
                                {...register("status", {
                                  ...requiredValidator,
                                })}
                              >
                                <option disabled value="">
                                  Choose Status
                                </option>
                                <option value="E">Enable</option>
                                <option value="D">Disable</option>
                              </select>
                              {errors.status && (
                                <ErrorMessage text={errors.status.message} />
                              )}
                            </div>
                          </div>
                          {!isCustomerAdmin && (
                            <div className="formRow col-xl-12">
                              <div className="formLabel">
                                <label htmlFor="selectFormRow">
                                  Role Type{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                <label htmlFor="data" className="formItemDesc">
                                  Select the Role with appropriate permissions
                                  for the User.
                                </label>
                              </div>
                              <div className="col-6">
                                <select
                                  className="formItem"
                                  name=""
                                  value={watch().role_id}
                                  {...register("role_id", {
                                    ...requiredValidator,
                                  })}
                                  onChange={(e) => {
                                    const roleName = role.find(
                                      (item) => item.id == e.target.value
                                    );

                                    setValue("role_id", e.target.value);
                                    setSelectedRole(roleName.name);
                                    setSelectedPermission(
                                      e.target.value === ""
                                        ? ""
                                        : roleName.permissions.map((item) => {
                                          return item.permission_id;
                                        })
                                    );
                                  }}
                                >
                                  <option value="" disabled>
                                    Choose Type
                                  </option>

                                  {role.map((item, key) => {
                                    return (
                                      <option value={item.id} key={key}>
                                        {item.name}
                                      </option>
                                    );
                                  })}
                                </select>
                                {errors.role_id && (
                                  <ErrorMessage text={errors.role_id.message} />
                                )}
                              </div>
                            </div>
                          )}

                          <div className="formRow col-xl-12">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">
                                Select extension
                              </label>
                              <label htmlFor="data" className="formItemDesc">
                                Assign an extension to the newly created user.
                              </label>
                            </div>
                            <div className="col-6">
                              <div className="row">
                                <div
                                  className={
                                    watch().extension_id ? "col-8" : "col-12"
                                  }
                                >
                                  {watch().extension_id ? (
                                    <Select
                                      isDisabled={true}
                                      placeholder="Available Extensions"
                                      isClearable={false}
                                      defaultValue={{
                                        label: selectedSearch.label,
                                        value: selectedSearch.value,
                                      }} // Default selected option
                                      onInputChange={handleSelectInputChange}
                                      onChange={(e) => {
                                        setSelectedSearch({
                                          label: e.label,
                                          value: e.value,
                                        });
                                      }}
                                      // {...register("extension_id")}
                                      styles={{
                                        control: (provided, state) => ({
                                          ...provided,
                                          height: "25px",
                                          fontSize: "12px",
                                        }),
                                        singleValue: (provided) => ({
                                          ...provided,
                                          fontSize: "14px",
                                        }),
                                        option: (provided) => ({
                                          ...provided,
                                          fontSize: "14px",
                                          paddingTop: '2px',
                                          paddingBottom: '2px',
                                          borderBottom: '1px solid var(--border-color)'
                                        }),
                                        placeholder: (provided) => ({
                                          ...provided,
                                          fontSize: "13px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "start",
                                          marginBottom: "15px",
                                        }),
                                      }}
                                    />
                                  ) : (
                                    <Select
                                      options={searchExtensions}
                                      placeholder="No extension assigned"
                                      isClearable={false}
                                      defaultValue={""} // Default selected option
                                      onInputChange={handleSelectInputChange}
                                      onChange={(e) => {
                                        setSelectedSearch({
                                          label: e.label,
                                          value: e.value,
                                        });
                                      }}
                                      // {...register("extension_id")}
                                      styles={{
                                        control: (provided, state) => ({
                                          ...provided,
                                          height: "25px",
                                          fontSize: "12px",
                                        }),
                                        singleValue: (provided) => ({
                                          ...provided,
                                          fontSize: "14px",
                                        }),
                                        option: (provided) => ({
                                          ...provided,
                                          fontSize: "14px",
                                        }),
                                        placeholder: (provided) => ({
                                          ...provided,
                                          fontSize: "13px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "start",
                                          marginBottom: "15px",
                                        }),
                                      }}
                                    />
                                  )}
                                </div>
                                {watch().extension_id && (
                                  <div className="col-4">
                                    <button
                                      effect="ripple"
                                      className="panelButton static ms-auto"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setPopUp(true);
                                      }}
                                    >
                                      <span className="text">Edit</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="formRow col-xl-12">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">
                                Usages
                              </label>
                              <label htmlFor="data" className="formItemDesc">
                                Set usages for the current user
                              </label>
                            </div>
                            <div className="col-6">
                              <select
                                className="formItem"
                                name="extension_id"
                                value={watch().usages}
                                {...register("usages", {
                                  ...requiredValidator,
                                })}
                              >
                                <option value="pbx">PBX</option>
                                <option value="dialer">Dialer</option>
                                <option value="both">Both</option>
                              </select>
                            </div>
                          </div>
                          <div className="formRow col-xl-12">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">
                                New Password
                              </label>
                              <label htmlFor="data" className="formItemDesc">
                                Set new password to user.
                              </label>
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                className="formItem"
                                name=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                            </div>
                          </div>
                        </form>
                      </div>

                      {selectedRole && (
                        <div
                          className="col-xl-6"
                          style={{
                            borderLeft: "1px solid var(--border-color)",
                            // height: "500px",
                            // overflow: 'auto'
                          }}
                        >
                          {/* <div className="profileView p-0">
                            <div className="profileDetailsHolder position-relative p-0 shadow-none border-0">
                              <div className="col-xl-12">
                                <div className="headerCommon d-flex align-items-center">
                                  <div className="col">
                                    Permissions for Role{" "}
                                    <span
                                      style={{
                                        color: "var(--ui-accent)",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {selectedRole}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="accordion permissionListWrapper">
                                {filteredPermission &&
                                  Object.keys(filteredPermission).map(
                                    (item, key) => (
                                      <div className="accordion-item" key={key}>
                                        <h2
                                          className="accordion-header"
                                          id={`collapseHeading${key}`}
                                        >
                                          <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapseRole${key}`}
                                            aria-expanded="true"
                                            aria-controls={`collapse${key}`}
                                          >
                                            <input
                                              type="checkbox"
                                              checked={parentChecked[item]}
                                              onChange={() =>
                                                handleParentCheckboxChange(item)
                                              }
                                            />

                                            <label>{item}</label>
                                          </button>
                                        </h2>
                                        <div
                                          id={`collapseRole${key}`}
                                          className="accordion-collapse collapse"
                                          aria-labelledby={`collapseHeading${key}`}
                                        >
                                          <div className="accordion-body">
                                            {filteredPermission[item].map(
                                              (innerItem, key) => (
                                                <div
                                                  className="col-xxl col-auto col-md-4 col-6"
                                                  key={key}
                                                >
                                                  <input
                                                    type="checkbox"
                                                    id={`permission-${innerItem.id}`}
                                                    checked={selectedPermission.includes(
                                                      innerItem.id
                                                    )}
                                                    onChange={() =>
                                                      handleCheckboxChange(
                                                        innerItem.id
                                                      )
                                                    }
                                                  />
                                                  <label className="formLabel ms-2 text-capitalize">
                                                    {innerItem.action}
                                                  </label>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                              </div>
                            </div>
                          </div> */}
                          <div className="permissionListWrapper">
                            <PermissionConfigTable
                              standalone={false}
                              allRoleList={role}
                              selectedRole={watch().role_id}
                              allPermissions={permissions}
                              loading={loading}
                              setLoading={setLoading}
                              setUserPermissionBridge={setUserPermissionBridge}
                              existingUserData={locationState}
                              isUserBased={true}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
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

        {popUp ? (
          <div className=" popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center popupBox">
                <div className="row content col-xl-7 col-md-9 col-sm-10 px-3">
                  <div className="col-12 px-0">
                    <div className="iconWrapper mb-2">
                      <i className="fa-duotone fa-triangle-exclamation fs-1"></i>
                    </div>
                  </div>
                  <div className="col-12 px-0 text-center">
                    <h4 className="text-center text-orange mb-1">Note</h4>
                    <p className="mb-0">
                      Updating this extension will remove the current extension
                      access from this user.
                    </p>
                    <div>
                      <div className="formRow flex-column px-0 pt-0 pb-3">
                        <div className="formLabel">
                          <label htmlFor="selectFormRow">
                            Select extension
                          </label>
                          <label htmlFor="data" className="formItemDesc">
                            Assign an extension to the newly created user.
                          </label>
                        </div>
                        <div className="col-12">
                          <div className="row">
                            <div
                              className={
                                watch().extension_id ? "col-12" : "col-12"
                              }
                            >
                              <Select
                                options={searchExtensions}
                                placeholder="Available Extensions"
                                isClearable={false}
                                defaultValue={{
                                  label: watch()?.extension?.extension,
                                  value: watch()?.extension?.extension,
                                }} // Default selected option
                                onInputChange={handleSelectInputChange}
                                onChange={(e) => {
                                  setSelectedSearch({
                                    label: e.label,
                                    value: e.value,
                                  });
                                }}
                                // {...register("extension_id")}
                                styles={{
                                  control: (provided, state) => ({
                                    ...provided,
                                    height: "25px",
                                    fontSize: "12px",
                                  }),
                                  valueContainer: (provided) => ({
                                    ...provided,
                                    height: "24px",
                                  }),
                                  input: (provided) => ({
                                    ...provided,
                                    margin: "0px",
                                  }),
                                  singleValue: (provided) => ({
                                    ...provided,
                                    fontSize: "14px",
                                  }),
                                  option: (provided) => ({
                                    ...provided,
                                    fontSize: "14px",
                                  }),
                                  menu: (provided) => ({
                                    ...provided,
                                    maxHeight: "120px",
                                    // overflowY: "auto",
                                  }),
                                  placeholder: (provided) => ({
                                    ...provided,
                                    fontSize: "13px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "start",
                                    marginBottom: "15px",
                                  }),
                                  menuList: (provided) => ({
                                    ...provided,
                                    maxHeight: "120px",
                                  }),
                                }}
                              />
                            </div>
                            {/* <div
                              className={`${watch().extension_id ? "col-5" : "col-5"
                                }`}
                            >
                              <select
                                className="formItem"
                                name="extension_id"
                                value={watch().usages}
                                {...register("usages", {
                                  ...requiredValidator,
                                })}
                              // value={watch().extension_id}
                              // {...register("extension_id")}
                              >
                                <option value="pbx">PBX</option>
                                <option value="dialer">Dialer</option>
                                <option value="both">Both</option>
                              </select>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <button
                        type="button"
                        effect="ripple"
                        className="panelButton ms-0"
                        onClick={() => {
                          if (Object.keys(errors).length === 0) {
                            handleFormSubmit();
                          } else {
                            setPopUp(false);
                          }
                        }}
                      >
                        <span className="text">Save</span>
                        <span className="icon">
                          <i className="fa-solid fa-floppy-disk"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray"
                        onClick={() => setPopUp(false)}
                      >
                        <span className="text">Close</span>
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
    </>
  );
};

export default UsersEdit;
