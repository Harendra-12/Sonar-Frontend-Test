import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import CircularLoader from "../../Loader/CircularLoader";
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
const UsersEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const locationState = location.state;

  // const [domains, setDomains] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState([]);
  const [selectedRole, setSelectedRole] = useState();
  const [defaultPermission, setDefaultPermission] = useState();
  const [selectedPermission, setSelectedPermission] = useState([]);
  const queryParams = new URLSearchParams(useLocation().search);
  const value = queryParams.get("id");
  const [extension, setExtension] = useState();
  const [user, setUser] = useState();
  const [filterExtensions, setFilterExtensions] = useState();
  const allUser = useSelector((state) => state.allUser);
  const extensionAllRefresh = useSelector((state) => state.extensionAllRefresh);
  const extensionAll = useSelector((state) => state.extensionAll);
  const [password, setPassword] = useState("");
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const account = useSelector((state) => state.account);
  // const domain = useSelector((state) => state.domain);
  // const { id: domainId = "" } = domain;
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
              user_role: { role_id },
            } = data;

            const separateName = name.split(" ");
            if (separateName.length == 1) {
              firstName = separateName[0];
            } else if (separateName.length == 2) {
              firstName = separateName[0];
              lastName = separateName[1];
            }

            const newData = {
              ...data,
              ...{
                firstName: firstName,
                lastName: lastName,
                role_id: `${role_id}`,
              },
            };

            setSelectedPermission(newData.permissions);
            setSelectedRole(newData.user_role["roles"].name);

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

  // filter only those extension that are not assign with any user
  // useEffect(() => {
  //   if (extension && user) {
  //     setFilterExtensions(
  //       extension.filter((item) => {
  //         return !user.some((userItem) => {
  //           return userItem.extension_id === item.id;
  //         });
  //       })
  //     );
  //   }
  // }, [extension, user]);

  useEffect(() => {
    if (extension && user && locationState) {
      setFilterExtensions(
        extension.filter((item) => {
          return !user.some((userItem) => {
            return (
              userItem.extension_id === item.id &&
              userItem.extension_id !== locationState.extension_id
            );
          });
        })
      );
    }
  }, [extension, user, locationState]);

  const handleFormSubmit = handleSubmit(async (data) => {
    if (password !== "" && password.length < 6) {
      toast.error("Password must be at least 5 characters");
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
      permissions: selectedPermission,
      extension_id: data.extension_id,
      ...(password && password.length > 5 && { password }),
    };
    setLoading(true);
    const addUser = await generalPutFunction(
      `user/${locationState.id}`,
      payload
    );
    if (addUser.status) {
      setLoading(false);
      toast.success(addUser.message);
      dispatch({
        type: "SET_ALLUSERREFRESH",
        allUserRefresh: allUserRefresh + 1,
      });

      navigate("/users"); // Navigate back to the previous page
    } else {
      setLoading(false);
      // const errorMessage = Object.keys(addUser.errors);
      // toast.error(addUser.errors[errorMessage[0]][0]);
      // console.log("error message:", errorMessage[0][0]);
    }
  });
  console.log(watch(), selectedRole, selectedPermission);
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
            {/* <div id="subPageHeader">
              <div className="col-6 my-1">
                <p className="mb-0">
                  Edit user information and group membership.
                </p>
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
                    <span className="text">Back</span>
                    <span className="icon"><i class="fa-solid fa-caret-left"></i></span>
                  </button>
                  <button
                    effect="ripple"
                    className="panelButton"
                    onClick={handleFormSubmit}
                  >
                    <span className="text">Save</span>
                    <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                  </button>
                </div>
              </div>
            </div> */}
          </div>

          <div className="col-xl-12" style={{ overflow: "auto" }}>
            {loading ? (
              <div>
                <SkeletonFormLoader />
              </div>
            ) : (
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
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
                              <i class="fa-solid fa-caret-left"></i>
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
                              <i class="fa-solid fa-floppy-disk"></i>
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
                              <label htmlFor="">Username</label>
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
                              <label htmlFor="">Email</label>
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
                              <label htmlFor="">First Name</label>
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
                              <label htmlFor="selectFormRow">Time Zone</label>
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
                              {errors.timezone_id && (
                                <ErrorMessage text={errors.timezone_id.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-12">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">Status</label>
                              <label htmlFor="data" className="formItemDesc">
                                Set the user's presence.
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
                              <label htmlFor="selectFormRow">Role Type</label>
                              <label htmlFor="data" className="formItemDesc">
                                Select Default to enable login or to disable login
                                select Virtual.
                              </label>
                            </div>
                            <div className="col-6">
                              <select
                                className="formItem"
                                name=""
                                value={watch().role_id}
                                {...register("role_id", { ...requiredValidator })}
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
                                  <select
                                    className="formItem"
                                    name="extension_id"
                                    value={watch().extension_id}
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
                                  </select>
                                </div>
                                {watch().extension_id && (
                                  <div className="col-4">
                                    <button
                                      effect="ripple"
                                      className="panelButton delete ms-auto"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setValue("extension_id", null);
                                      }}
                                    >
                                      <span className="text">Delete</span>
                                      <span className="icon">
                                        <i class="fa-solid fa-xmark"></i>
                                      </span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="formRow col-xl-12">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">New Password</label>
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
                          style={{ borderLeft: "1px solid var(--border-color)" }}
                        >
                          <div className="profileView p-0">
                            <div className="profileDetailsHolder position-relative p-0 shadow-none border-0">
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
                                </div>
                              </div>
                              <div class="accordion permissionListWrapper">
                                {filteredPermission &&
                                  Object.keys(filteredPermission).map(
                                    (item, key) => (
                                      <div className="accordion-item" key={key}>
                                        <h2
                                          class="accordion-header"
                                          id={`collapseHeading${key}`}
                                        >
                                          <button
                                            class="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapseRole"
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
                                        {/* <div className="header d-flex align-items-center">
                                      <div className="col-5">
                                        <input
                                          type="checkbox"
                                          checked={parentChecked[item]}
                                          onChange={() =>
                                            handleParentCheckboxChange(item)
                                          }
                                        />
                                        <label class="ms-2">{item}</label>
                                      </div>
                                    </div> */}
                                        <div
                                          id={`collapseRole${key}`}
                                          class="accordion-collapse collapse"
                                          aria-labelledby={`collapseHeading${key}`}
                                        >
                                          <div class="accordion-body">
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
        {/* {loading ? (
          <div colSpan={99}>
            <CircularLoader />
          </div>
        ) : (
          ""
        )} */}
        {/* <ToastContainer
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
        /> */}
      </main>
    </>
  );
};

export default UsersEdit;
