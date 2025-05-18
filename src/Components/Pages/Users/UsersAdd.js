/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  backToTop,
  fileUploadFunction,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";

import CircularLoader from "../../Loader/CircularLoader";
import { useForm } from "react-hook-form";
import {
  emailValidator,
  lengthValidator,
  noSpecialCharactersValidator,
  requiredValidator,
  restrictToAllowedChars,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import Header from "../../CommonComponents/Header";
import { toast } from "react-toastify";
const UsersAdd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const accountDetails = useSelector((state) => state.accountDetails);
  const [timeZone, setTimeZone] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState([]);
  const [selectedRole, setSelectedRole] = useState();
  const [defaultPermission, setDefaultPermission] = useState();
  const [selectedPermission, setSelectedPermission] = useState([]);
  const [isUserNameAvailable, setIsUserNameAvailable] = useState();
  const [userNameValidationLoader, setuserNameValidationLoader] =
    useState(false);
  const [extension, setExtension] = useState();
  const [user, setUser] = useState();
  const [filterExtensions, setFilterExtensions] = useState();
  const allUser = useSelector((state) => state.allUser);
  const extensionAllRefresh = useSelector((state) => state.extensionAllRefresh);
  const extensionAll = useSelector((state) => state.extensionAll);
  const account = useSelector((state) => state.account);
  const [parentChecked, setParentChecked] = useState({});
  const [selectedExtension, setSelectedExtension] = useState("");
  const [allChecked, setAllChecked] = useState(false);
  const [profilePicPopup, setProfilePicPopup] = useState(false);
  const [newImage, setNewImage] = useState();
  const [profileImage, setProfileImage] = useState(null);

  const {
    register,
    watch,
    setError,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  // getting permssion timezone and roles so that we can validate if no role then we can't create user
  useEffect(() => {
    if (account === null) {
      navigate("/");
    } else {
      async function getDomain() {
        const permissionData = await generalGetFunction("/permission");
        const timeZ = await generalGetFunction(`/timezones`);
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
            toast.error("Please add Role first");
          }
        }
        if (permissionData?.status) {
          setDefaultPermission(permissionData.data);
        }
      }
      getDomain();
    }
  }, []);

  // Getting user and extension so that we can filter out which extension is not assign
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

  //Filtering out which extension is not assign
  useEffect(() => {
    if (extension && user) {
      const data = extension.filter((item) => {
        return !user.some((userItem) => {
          return userItem.extension_id === item.id;
        });
      });
      let filteredData;
      if (data.length > 0) {
        filteredData = data.filter(
          (item) => item?.extension !== account?.extension?.extension
        );
      }
      const options = filteredData?.map((extension) => ({
        value: extension.id,
        label: extension.extension,
      }));
      setFilterExtensions([{ value: null, label: "None" }, ...options]);
    }
  }, [accountDetails, user, extension]);

  //Calling useName api for availability check after user stop typing
  async function checkUserName() {
    if (watch().username.length > 2) {
      setuserNameValidationLoader(true);

      const parsedData = {
        username: watch().username,
      };
      const userName = await generalPostFunction("/check/username", parsedData);
      if (userName?.status) {
        setIsUserNameAvailable(true);
        setuserNameValidationLoader(false);
      } else {
        setIsUserNameAvailable(false);
        setuserNameValidationLoader(false);
      }
    } else {
      setIsUserNameAvailable();
    }
  }

  // Listning for user typing debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkUserName();
    }, 600);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [watch().username]);

  //   Handle new music function to add new music
  async function handleNewImage() {
    if (newImage) {
      const maxSizeInMB = 2;
      const fileSizeInMB = newImage.size / (1024 * 1024);
      if (fileSizeInMB > maxSizeInMB) {
        toast.error(`Please choose a file less than ${maxSizeInMB}MB.`);
      } else {
        setProfilePicPopup(false);
        setProfileImage(newImage);
      }
    } else {
      toast.error("Please choose a file");
    }
  }

  // Creating user
  const handleFormSubmit = handleSubmit(async (data) => {
    if (data.cPassword !== data.password) {
      setError("cPassword", {
        type: "manual",
        message: "Passwords are not matching",
      });

      return;
    }

    const { firstName, lastName } = data;

    let updatedData = {
      ...data,
      extension_id: selectedExtension,
      ...{
        name: `${firstName} ${lastName}`,
        // domain_id: `${domainId}`,
      },
    };

    delete updatedData.firstName;
    delete updatedData.lastName;
    delete updatedData.cPassword;
    const payload = {
      ...updatedData,
      ...{
        account_id: account.account_id,
        permissions: selectedPermission,
      },
      ...{
        profile_picture: profileImage,
      },
    };
    setLoading(true);
    const addUser = await fileUploadFunction("/user/create", payload);
    if (addUser?.status) {
      reset();
      setSelectedPermission([]);
      toast.success(addUser.message);
      setLoading(false);
      dispatch({
        type: "SET_ALLUSERREFRESH",
        allUserRefresh: allUserRefresh + 1,
      });
      dispatch({
        type: "SET_EXTENSIONALLREFRESH",
        extensionAllRefresh: extensionAllRefresh + 1,
      });
      navigate("/users");
    } else {
      setLoading(false);
      // const errorMessage = Object.keys(addUser.errors);
      // toast.error(addUser.errors[errorMessage[0]][0]);
      toast.error(addUser?.errors?.email[0]);
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
    if (Object.values(initialParentChecked).every((value) => value === true)) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
    setParentChecked(initialParentChecked);
  }, [selectedPermission]);

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

  // function to handle select All
  const handleAllParentCheckboxChange = (isChecked) => {
    // Initialize an empty array to store all the ids
    if (isChecked) {
      const allIds = [];
      // Loop through each key in the permissions object
      Object.keys(filteredPermission).forEach((key) => {
        // For each key, loop through its array items
        filteredPermission[key].forEach((item) => {
          // Add the id of each item to the allIds array
          allIds.push(item.id);
        });
      });
      const updatedParentChecked = { ...parentChecked };

      // Set all values to true
      Object.keys(updatedParentChecked).forEach((key) => {
        parentChecked[key] = true;
      });
      setSelectedPermission(allIds);
      setParentChecked(allChecked);
    } else {
      setSelectedPermission([]);
      setParentChecked([]);
    }
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
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0">
            <Header title="Users" />
          </div>
          <div className="col-xl-12">
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div
                  className="d-flex flex-wrap"
                  style={{ position: "sticky", top: "0", zIndex: "9" }}
                >
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>User Add</h4>
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
                    <div
                      className="col-xl-6"
                      style={{ borderRight: "1px solid var(--border-color)" }}
                    >
                      <form className="row mb-0">

                        <div className="formRow col-xl-12">
                          <div className="formLabel">
                            <label htmlFor="" className="me-2">
                              Username <span className="text-danger">*</span>
                            </label>

                            {isUserNameAvailable == true ? (
                              <label className="status success">
                                Username Available
                              </label>
                            ) : isUserNameAvailable == false ? (
                              <label className="status fail">
                                Not Available
                              </label>
                            ) : (
                              ""
                            )}
                            {userNameValidationLoader ? (
                              <img
                                className="loaderSpinner"
                                src={require("../../assets/images/loader-gif.webp")}
                                alt="loading.."
                              />
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              name="extension"
                              className="formItem"
                              {...register("username", {
                                ...requiredValidator,
                                // ...noSpecialCharactersValidator,
                              })}
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
                              Password <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Required: At least 6 character
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="password"
                              name="extension"
                              className="formItem"
                              {...register("password", {
                                ...requiredValidator,
                                ...lengthValidator(3, 20),
                              })}
                            />
                            {errors.password && (
                              <ErrorMessage text={errors.password.message} />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-12">
                          <div className="formLabel">
                            <label htmlFor="">
                              Confirm Password{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Green field borders indicate typed passwords
                              match.
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="password"
                              name="extension"
                              className="formItem"
                              {...register("cPassword", {
                                ...requiredValidator,
                              })}
                            />
                            {errors.cPassword && (
                              <ErrorMessage text={errors.cPassword.message} />
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
                              First Name <span className="text-danger">*</span>{" "}
                            </label>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              name="extension"
                              className="formItem"
                              {...register("firstName", {
                                ...requiredValidator,
                                ...lengthValidator(3, 20),
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
                            {errors.alias && (
                              <ErrorMessage text={errors.alias.message} />
                            )}
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
                                    border: '2px solid var(--border-color)'
                                  }}
                                >
                                  {profileImage ? (
                                    <i className="fa-solid fa-pen profilePhotoEditIcon"></i>
                                  ) : (
                                    <i className="fa-solid fa-plus profilePhotoAddIcon"></i>
                                  )}
                                  <img
                                    src={
                                      profileImage
                                        ? URL.createObjectURL(profileImage)
                                        : profileImage ||
                                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                    }
                                    alt="profile"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                      borderRadius: "50%",
                                    }}
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
                              defaultValue={""}
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
                            {errors.timezone_id && (
                              <ErrorMessage
                                text={errors?.timezone_id?.message}
                              />
                            )}
                          </div>
                        </div>
                        <div className="formRow col-xl-12">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">Status</label>
                            <label htmlFor="data" className="formItemDesc">
                              Set the user's account status.
                            </label>
                          </div>
                          <div className="col-6">
                            <select
                              className="formItem"
                              name=""
                              {...register("status", { ...requiredValidator })}
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
                        <div className="formRow col-xl-12">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">
                              Role Type <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Select the Role with appropriate permissions for
                              the User.
                            </label>
                          </div>
                          <div className="col-6">
                            <select
                              className="formItem"
                              name=""
                              defaultValue=""
                              {...register("role_id", { ...requiredValidator })}
                              onChange={(e) => {
                                const selectedValue = e.target.value;

                                const selectedRole = role.find(
                                  (item) => item.id == selectedValue
                                );

                                if (selectedRole) {
                                  setSelectedRole(selectedRole.name);
                                  setSelectedPermission(
                                    selectedRole.permissions.map(
                                      (item) => item.permission_id
                                    )
                                  );
                                } else {
                                  // Handle the case where no matching role is found
                                  setSelectedRole("");
                                  setSelectedPermission([]);
                                }
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
                            {/* <select
                              className="formItem"
                              name="extension_id"
                              defaultValue=""
                              {...register("extension_id")}
                            >
                              <option value="" disabled>
                                Available Extensions
                              </option>
                              {filterExtensions &&
                                filterExtensions.map((extension, key) => {
                                  return (
                                    <option value={extension.id} key={key}>
                                      {extension.extension}
                                    </option>
                                  );
                                })}
                            </select> */}
                            <Select
                              options={filterExtensions}
                              placeholder="Available Extensions"
                              isClearable={false}
                              className="form-iselect"
                              defaultValue={{
                                value: "0",
                                label: "Select Extension",
                              }} // Default selected option
                              onInputChange={handleSelectInputChange}
                              onChange={(e) => {
                                setSelectedExtension(String(e.value));
                              }}
                              // {...register("extension_id")}
                              styles={{
                                control: (provided, state) => ({
                                  ...provided,
                                  height: "35px",
                                  fontSize: "0.8125rem",
                                  backgroundColor: 'var(--ele-color)',
                                  border: '1px solid var(--color4)',
                                  color: 'var(--form-input-text)'
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
                                  color: 'var(--form-input-text)',
                                  fontSize: "0.8125rem",
                                  fontWeight: '500',
                                }),
                                option: (provided, state) => ({
                                  ...provided,
                                  paddingLeft: "15px",
                                  paddingTop: '2px',
                                  paddingBottom: '2px',
                                  // backgroundColor: state.isSelected
                                  //   ? "#5a9fff"
                                  //   : "transparent",
                                  // "&:hover": {
                                  //   backgroundColor: "#0055cc",
                                  //   color: "#fff",
                                  // },
                                  fontSize: "14px",
                                  borderBottom: '1px solid var(--border-color)'
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
                        </div>
                        <div className="formRow col-xl-12">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">Select Usage</label>
                            <label htmlFor="data" className="formItemDesc">
                              Assign usage to the newly created user.
                            </label>
                          </div>
                          <div className="col-6">
                            <select
                              className="formItem"
                              name="extension_id"
                              defaultValue=""
                              {...register("usages")}
                            >
                              <option value="">None</option>

                              <option value="pbx">PBX</option>
                              <option value="dialer">Dialer</option>
                            </select>
                          </div>
                        </div>
                      </form>
                    </div>

                    {selectedRole && (
                      <div className="col-xl-6">
                        <div className="profileDetailsHolder position-relative p-0 shadow-none">
                          <div className="col-xl-12">
                            <div className="headerCommon d-flex align-items-center">
                              <div className="col-5">
                                Permissions for Role{" "}
                                <span
                                  style={{
                                    color: "var(--ui-accent)",
                                    fontWeight: 600,
                                  }}
                                >
                                  {selectedRole}
                                </span>
                                {/* <span><input type="checkbox" checked={allChecked} onChange={(e)=>{
                                  const isChecked = e.target.checked;
                                  setAllChecked(!allChecked)
                                  handleAllParentCheckboxChange(isChecked)
                                }}/> Select All</span> */}
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
                                        aria-controls={`collapseRole${key}`}
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
                                              className="col-xl-2 col-md-4 col-6"
                                              style={{ paddingLeft: 30 }}
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
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
        {loading ? (
          <div colSpan={99}>
            <CircularLoader />
          </div>
        ) : (
          ""
        )}
      </main>
    </>
  );
};

export default UsersAdd;
