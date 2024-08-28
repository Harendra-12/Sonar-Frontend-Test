import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../../Loader/CircularLoader";
import { useForm } from "react-hook-form";
import {
  emailValidator,
  lengthValidator,
  requiredValidator,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import Header from "../../CommonComponents/Header";
const UsersAdd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const domain = useSelector((state) => state.domain);
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  // const [domains, setDomains] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState([]);
  const [selectedRole, setSelectedRole] = useState();
  const [defaultPermission, setDefaultPermission] = useState();
  const [selectedPermission, setSelectedPermission] = useState([]);
  const [isUserNameAvailable, setIsUserNameAvailable] = useState();
  const [userNameValidationLoader, setuserNameValidationLoader] =
    useState(false);
  // const { id: domainId = "" } = domain;
  // const [popUp, setPopUp] = useState(true);

  const {
    register,
    watch,
    setError,

    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const account = useSelector((state) => state.account);
  useEffect(() => {
    if (account === null) {
      navigate("/");
    } else {
      async function getDomain() {
        // const domain = await generalGetFunction(
        //   `/domain/search?account=${account.account_id}`
        // );
        const permissionData = await generalGetFunction("/permission");
        const timeZ = await generalGetFunction(`/timezone/all`);
        const apiRole = await generalGetFunction(`/role/all`);
        // if (domain.status) {
        //   setDomains(
        //     domain.data.map((item) => {
        //       return [item.id, item.domain_name];
        //     })
        //   );
        // } else {
        //   navigate("/");
        // }
        if (timeZ.status) {
          setTimeZone(
            timeZ.data.map((item) => {
              return [item.id, item.name];
            })
          );
        }
        if (apiRole.status) {
          if (apiRole.data.length > 0) {
            setRole(apiRole.data);
          } else {
            toast.error("Please add Role first");
          }
        }
        if (permissionData.status) {
          setDefaultPermission(permissionData.data);
        }
      }
      getDomain();
    }
  }, []);

  //Calling useName api for availability check after user stop typing
  async function checkUserName() {
    if (watch().username.length > 2) {
      setuserNameValidationLoader(true);

      const parsedData = {
        username: watch().username,
      };
      const userName = await generalPostFunction("/check/username", parsedData);
      if (userName.status) {
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

  // Listning for user typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkUserName();
    }, 600);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [watch().username]);

  const handleFormSubmit = handleSubmit(async (data) => {
    setLoading(true);
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
    };
    const addUser = await generalPostFunction("/user/create", payload);
    if (addUser.status) {
      reset();
      setSelectedPermission([]);
      toast.success(addUser.message);
      setLoading(false);
      dispatch({
        type: "SET_ALLUSERREFRESH",
        allUserRefresh: allUserRefresh + 1,
      });
    } else {
      setLoading(false);
      const errorMessage = Object.keys(addUser.errors);
      toast.error(addUser.errors[errorMessage[0]][0]);
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

  // Handel permission check box click
  // const handleCheckboxChange = (id) => {
  //   if (selectedPermission.includes(id)) {
  //     setSelectedPermission(selectedPermission.filter((item) => item !== id));
  //   } else {
  //     setSelectedPermission([...selectedPermission, id]);
  //   }
  // };
  const filteredPermission = filterPermissionById(
    defaultPermission,
    account.permissions
  );

  const [parentChecked, setParentChecked] = useState({});

  // Initialize parentChecked state
  useEffect(() => {
    const initialParentChecked = {};
    Object.keys(filteredPermission).forEach((item) => {
      initialParentChecked[item] = filteredPermission[item].every((innerItem) =>
        selectedPermission.includes(innerItem.id)
      );
    });
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

  return (
    <>
      <style>
        {`
        .permissionListWrapper .formRow .formLabel{
          margin-left: 10px;
        }
        .profileView .profileDetailsHolder{
          background-color: none;
          box-shadow: none;
        }
      `}
      </style>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0">
            <Header title="User Add" />
            <div className="row justify-content-center" id="subPageHeader">
              <div className="col-6 my-auto">
                {/* <h4 className="my-auto">User Add</h4> */}
              </div>
              <div className="col-6 ps-2">
                <div className="d-flex justify-content-end">
                  <button
                    effect="ripple"
                    className="panelButton"
                    onClick={() => {
                      navigate(-1);
                      backToTop();
                    }}
                  >
                    Back
                  </button>
                  <button
                    effect="ripple"
                    className="panelButton"
                    onClick={handleFormSubmit}
                  >
                    Save
                  </button>
                </div>
              </div>
              <div className="col-12 my-1">
                <p className="p-0 m-0">
                  Edit user information and group membership.
                </p>
              </div>
            </div>
          </div>
          <div className="col-xl-12" style={{ overflow: "auto" }}>
            <div className="mx-2" id="detailsContent">
              <form action="#" className="row">
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Username</label>

                    {isUserNameAvailable == true ? (
                      <label className="status success">
                        Username Available
                      </label>
                    ) : isUserNameAvailable == false ? (
                      <label className="status fail">Not Available</label>
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
                  <div className="col-12">
                    <input
                      type="text"
                      name="extension"
                      className="formItem"
                      {...register("username", { ...requiredValidator })}
                    />
                    {errors.username && (
                      <ErrorMessage text={errors.username.message} />
                    )}
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Password</label>
                  </div>
                  <div className="col-12">
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
                    <label htmlFor="data" className="formItemDesc">
                      Required: At least 4 character
                    </label>
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Confirm Password</label>
                  </div>
                  <div className="col-12">
                    <input
                      type="password"
                      name="extension"
                      className="formItem"
                      {...register("cPassword", { ...requiredValidator })}
                    />
                    {errors.cPassword && (
                      <ErrorMessage text={errors.cPassword.message} />
                    )}
                    <label htmlFor="data" className="formItemDesc">
                      Green field borders indicate typed passwords match.
                    </label>
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Email</label>
                  </div>
                  <div className="col-12">
                    <input
                      type="email"
                      name="extension"
                      className="formItem"
                      {...register("email", {
                        ...requiredValidator,
                        ...emailValidator,
                      })}
                    />
                    {errors.email && (
                      <ErrorMessage text={errors.email.message} />
                    )}
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">First Name</label>
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      name="extension"
                      className="formItem"
                      {...register("firstName", {
                        ...requiredValidator,
                        ...lengthValidator(3, 20),
                      })}
                    />
                    {errors.firstName && (
                      <ErrorMessage text={errors.firstName.message} />
                    )}
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Last Name</label>
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      name="extension"
                      className="formItem"
                      {...register("lastName")}
                    />
                  </div>
                </div>
                {/* <div className="formRow col-xl-3">
                                        <div className="formLabel">
                                            <label htmlFor="selectFormRow">Language</label>
                                            {userState.languageMissing?<label className='status missing'>Select Language</label>:""}
                                        </div>
                                        <div className="col-12">
                                            <select className="formItem" name="" value={userState.language} onChange={(e) => {
                                                setUserState(prevState => ({
                                                    ...prevState,
                                                    language: e.target.value
                                                }))
                                            }}>
                                                <option>Select Language</option>
                                                <option >Afrikaans</option>
                                                <option >Albanian</option>
                                                <option >Arabic</option>
                                                <option >Armenian</option>
                                                <option >Basque</option>
                                                <option >English</option>
                                                <option >Estonian</option>
                                                <option >Fiji</option>
                                                <option >Finnish</option>
                                                <option >French</option>
                                                <option >Georgian</option>
                                                <option >German</option>
                                                <option >Greek</option>
                                                <option >Punjabi</option>
                                                <option >Quechua</option>
                                                <option >Ukrainian</option>
                                                <option >Urdu</option>
                                                <option >Uzbek</option>
                                                <option >Vietnamese</option>
                                                <option >Welsh</option>
                                                <option >Xhosa</option>
                                            </select>
                                            <br />
                                            <label htmlFor="data" className="formItemDesc">
                                                Select the language.
                                            </label>
                                        </div>
                                    </div> */}
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="selectFormRow">Time Zone</label>
                  </div>
                  <div className="col-12">
                    <select
                      className="formItem"
                      name=""
                      {...register("timezone_id", { ...requiredValidator })}
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
                      <ErrorMessage text={errors.timezone_id.message} />
                    )}
                    <label htmlFor="data" className="formItemDesc">
                      Select the default time zone.
                    </label>
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="selectFormRow">Status</label>
                  </div>
                  <div className="col-12">
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
                    <label htmlFor="data" className="formItemDesc">
                      Set the user's presence.
                    </label>
                  </div>
                </div>

                {/* <div className="formRow col-xl-3">
                                        <div className="formLabel">
                                            <label htmlFor="">Organization</label>
                                            {userState.organizationMissing?<label className='status missing'>Invalid Organization</label>:""}
                                        </div>
                                        <div className="col-12">
                                            <input
                                                type="text"
                                                name="extension"
                                                value={userState.organization}
                                                className="formItem"
                                                onChange={(e) => {
                                                    setUserState(prevState => ({
                                                        ...prevState,
                                                        organization: e.target.value
                                                    }))
                                                }}
                                                required="required"
                                            />
                                        </div>
                                    </div> */}
                {/* <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Groups</label>
                      {userState.groupMissing ? (
                        <label className="status missing">Select Group</label>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-12">
                      <select
                        className="formItem"
                        name=""
                        value={userState.groups}
                        onChange={(e) => {
                          setUserState((prevState) => ({
                            ...prevState,
                            groups: e.target.value,
                          }));
                        }}
                      >
                        <option>Choose Group</option>
                        {group &&
                          group.map((item) => {
                            return <option value={item[0]}>{item[1]}</option>;
                          })}
                      </select>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Set the user's presence.
                      </label>
                    </div>
                  </div> */}
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="selectFormRow">Role Type</label>
                  </div>
                  <div className="col-12">
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
                    <label htmlFor="data" className="formItemDesc">
                      Select Default to enable login or to disable login select
                      Virtual.
                    </label>
                  </div>
                </div>
                {/* <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="selectFormRow">Domain</label>
                  </div>
                  <div className="col-12">
                    <select
                      className="formItem"
                      name=""
                      defaultValue=""
                      {...register("domain_id", { ...requiredValidator })}
                    >
                      <option disabled value="">
                        Choose Domain
                      </option>
                      {domains &&
                        domains.map((item, key) => {
                          return (
                            <option value={item[0]} key={key}>
                              {item[1]}
                            </option>
                          );
                        })}
                    </select>
                    {errors.domain_id && (
                      <ErrorMessage text={errors.domain_id.message} />
                    )}
                    <label htmlFor="data" className="formItemDesc">
                      Select the Domain.
                    </label>
                  </div>
                </div> */}
              </form>
            </div>

            {selectedRole && (
              <div className="col-xl-12 pe-0">
                <div className="profileView">
                  <div className="profileDetailsHolder position-relative">
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
                        </div>
                        {/* <div className="approvalButton">
                          {" "}
                          <button
                            className="float-end btn btn-success btn-sm"
                            // onClick={handlePermissionSave}
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            <i className="fa-duotone fa-check-double"></i> Save
                          </button>{" "}
                        </div> */}
                      </div>
                    </div>
                    {filteredPermission &&
                      Object.keys(filteredPermission).map((item, key) => (
                        <div className="permissionListWrapper" key={key}>
                          <div className="header d-flex align-items-center">
                            <div className="col-5">
                              <input
                                type="checkbox"
                                checked={parentChecked[item]}
                                onChange={() =>
                                  handleParentCheckboxChange(item)
                                }
                              />
                              <label className="ms-2">{item}</label>
                            </div>
                          </div>
                          <div className="row px-2 pt-1 border-bottom">
                            {filteredPermission[item].map((innerItem, key) => (
                              <div
                                className="formRow col-xl-2 col-md-4 col-6"
                                key={key}
                              >
                                <input
                                  type="checkbox"
                                  id={`permission-${innerItem.id}`}
                                  checked={selectedPermission.includes(
                                    innerItem.id
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(innerItem.id)
                                  }
                                />
                                <label className="formLabel">
                                  {innerItem.action}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* {popUp ? (
            <div className="popup">
              <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                  <div className="row content col-xl-4">
                    <div className="col-2 px-0">
                      <div className="iconWrapper">
                        <i className="fa-duotone fa-triangle-exclamation"></i>
                      </div>
                    </div>
                    <div className="col-10 ps-0">
                      <h4>Warning!</h4>
                      <p>
                        No Extension is currently asigned! Please add an
                        extension first!
                      </p>
                      <button
                        className="panelButton m-0"
                        onClick={() => {
                          // setForce(true);
                          setPopUp(false);
                          navigate("/extensions-add");
                        }}
                      >
                        Lets Go!
                      </button>
                      <button
                        className="panelButtonWhite m-0 float-end"
                        onClick={() => setPopUp(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )} */}
        </section>
        {loading ? (
          <div colSpan={99}>
            <CircularLoader />
          </div>
        ) : (
          ""
        )}
        {/* <ToastContainer
          position="bottom-right"
          autoClose={false}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        /> */}
      </main>
    </>
  );
};

export default UsersAdd;
