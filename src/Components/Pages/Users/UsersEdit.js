import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../../Loader/CircularLoader";
const UsersEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state;
  const [domains, setDomains] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState([]);
  const [selectedRole, setSelectedRole] = useState();
  const [defaultPermission, setDefaultPermission] = useState();
  const [selectedPermission, setSelectedPermission] = useState([]);
  const queryParams = new URLSearchParams(useLocation().search);
  const value = queryParams.get("id");

  const [userState, setUserState] = useState({
    userName: "",
    password: "",
    cPassword: "",
    email: "",
    language: "",
    timeZone: "",
    status: "",
    firstName: "",
    lastName: "",
    organization: "",
    groups: "",
    type: "",
    domain: "",
    useNameValidation: false,
    isUserNameAvailable: false,
    userNameMissing: false,
    passwordMissing: false,
    cPasswordMissing: false,
    emailMissing: false,
    languageMissing: false,
    timeZoneMissing: false,
    statusMissing: false,
    firstNameMissing: false,
    lastNameMissing: false,
    organizationMissing: false,
    groupMissing: false,
    typeMissing: false,
    domainMissing: false,
    roleId: "",
  });

  const account = useSelector((state) => state.account);
  useEffect(() => {
    if (account === null) {
      navigate("/");
    } else {
      async function getDomain() {
        const domain = await generalGetFunction(
          `/domain/search?account=${account.account_id}`
        );
        const permissionData = await generalGetFunction("/permission");
        const timeZ = await generalGetFunction(`/timezone/all`);
        const apiRole = await generalGetFunction(`/role/all`);
        if (domain.status) {
          setDomains(
            domain.data.map((item) => {
              return [item.id, item.domain_name];
            })
          );
        } else {
          navigate("/");
        }
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
            apiRole.data.map((item, key) => {
              if (item.id === locationState.user_role.role_id) {
                setUserState((prevData) => ({
                  ...prevData,
                  roleId: key,
                }));
              }
            });
          } else {
            navigate("/roles");
          }
        }
        if (permissionData.status) {
          setDefaultPermission(permissionData.data);
        }
      }
      getDomain();
      if (locationState) {
        async function getData() {
          // const apiData = await generalGetFunction(`/user/${value}`);
          if (locationState) {
            setLoading(false);
            setUserState((prevState) => ({
              ...prevState,
              userName: locationState.username,
              password: locationState.password,
              // name:apiData.data.name,
              firstName: locationState.name.split(" ")[0],
              lastName: locationState.name.split(" ")[1],
              email: locationState.email,
              groups: locationState.group_id,
              domain: locationState.domain_id,
              timeZone: locationState.timezone_id,
              status: locationState.status,
              type: locationState.user_role.role_id,
              id: locationState.account_id,
            }));
            setSelectedPermission(locationState.permissions);
            setSelectedRole(locationState.user_role["roles"].name);
          }
        }
        if (account.id) {
          getData();
        } else {
          setLoading(false);
          navigate("/");
        }
      } else {
        navigate("/");
      }
    }
  }, [account, navigate, value]);

  //   Validating form and creating new user
  async function handleSubmit() {
    if (userState.userName.length > 3 && userState.userName.length < 20) {
      setUserState((prevState) => ({
        ...prevState,
        userNameMissing: false,
      }));
    } else {
      setUserState((prevState) => ({
        ...prevState,
        userNameMissing: true,
      }));
    }

    if (userState.email.length > 3 && userState.email.includes("@")) {
      setUserState((prevState) => ({
        ...prevState,
        emailMissing: false,
      }));
    } else {
      setUserState((prevState) => ({
        ...prevState,
        emailMissing: true,
      }));
    }
    if (userState.language === "" || userState.language === "Select Language") {
      setUserState((prevState) => ({
        ...prevState,
        languageMissing: true,
      }));
    } else {
      setUserState((prevState) => ({
        ...prevState,
        languageMissing: false,
      }));
    }
    if (
      userState.timeZone === "" ||
      userState.timeZone === "Select Time Zone"
    ) {
      setUserState((prevState) => ({
        ...prevState,
        timeZoneMissing: true,
      }));
    } else {
      setUserState((prevState) => ({
        ...prevState,
        timeZoneMissing: false,
      }));
    }
    if (userState.status === "" || userState.status === "Choose Status") {
      setUserState((prevState) => ({
        ...prevState,
        statusMissing: true,
      }));
    } else {
      setUserState((prevState) => ({
        ...prevState,
        statusMissing: false,
      }));
    }

    if (userState.type === "" || userState.type === "Choose Type") {
      setUserState((prevState) => ({
        ...prevState,
        typeMissing: true,
      }));
    } else {
      setUserState((prevState) => ({
        ...prevState,
        typeMissing: false,
      }));
    }
    if (userState.domain === "" || userState.domain === "Choose Domain") {
      setUserState((prevState) => ({
        ...prevState,
        domainMissing: true,
      }));
    } else {
      setUserState((prevState) => ({
        ...prevState,
        domainMissing: false,
      }));
    }
    if (
      userState.organization.length > 3 &&
      userState.organization.length < 50
    ) {
      setUserState((prevState) => ({
        ...prevState,
        organizationMissing: false,
      }));
    } else {
      setUserState((prevState) => ({
        ...prevState,
        organizationMissing: true,
      }));
    }
    if (userState.firstName.length > 3 && userState.firstName.length < 20) {
      setUserState((prevState) => ({
        ...prevState,
        firstNameMissing: false,
      }));
    } else {
      setUserState((prevState) => ({
        ...prevState,
        firstNameMissing: true,
      }));
    }

    if (selectedPermission.length === 0) {
      toast.error("Permission cannot be empty");
    }

    if (
      selectedPermission.length > 0 &&
      userState.userName.length > 3 &&
      userState.userName.length < 20 &&
      // userState.password.length > 3 &&
      // userState.password === userState.cPassword &&
      userState.email.length > 3 &&
      userState.email.includes("@") &&
      !(
        userState.timeZone === "" || userState.timeZone === "Select Time Zone"
      ) &&
      !(userState.status === "" || userState.status === "Choose Status") &&
      !(userState.type === "" || userState.type === "Choose Type") &&
      !(userState.domain === "" || userState.domain === "Choose Domain") &&
      userState.firstName.length > 3 &&
      userState.firstName.length < 20
    ) {
      setLoading(true);
      const parsedData = {
        name: userState.firstName + " " + userState.lastName,
        email: userState.email,
        // password: userState.password,
        // group_id: userState.groups,
        domain_id: userState.domain,
        timezone_id: userState.timeZone,
        status: userState.status,
        // usertype: userState.type,
        account_id: account.account_id,
        permissions: selectedPermission,
        role_id: userState.type,
      };
      const addUser = await generalPutFunction(
        `user/${locationState.id}`,
        parsedData
      );
      if (addUser.status) {
        toast.success(addUser.message);
        setLoading(false);
      } else {
        setLoading(false);
        const errorMessage = Object.keys(addUser.error);
        toast.error(addUser.error[errorMessage[0]][0]);
      }
    }
  }

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

  // const [selectedPermission, setSelectedPermission] = useState([]);
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
            <div className="row justify-content-center" id="subPageHeader">
              <div className="col-6 my-auto">
                <h4 className="my-auto">User Add</h4>
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
                    onClick={handleSubmit}
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
                    {userState.userName === "" ? (
                      <label className="status missing">Field Missing</label>
                    ) : (
                      ""
                    )}
                    {userState.useNameValidation ? (
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
                      value={userState.userName}
                      onChange={(e) => {
                        setUserState((prevState) => ({
                          ...prevState,
                          userName: e.target.value,
                        }));
                      }}
                      required="required"
                      disabled
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Email</label>
                    {userState.emailMissing ? (
                      <label className="status missing">Invalid Email</label>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-12">
                    <input
                      type="email"
                      name="extension"
                      value={userState.email}
                      className="formItem"
                      onChange={(e) => {
                        setUserState((prevState) => ({
                          ...prevState,
                          email: e.target.value,
                        }));
                      }}
                      required="required"
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">First Name</label>
                    {userState.firstNameMissing ? (
                      <label className="status missing">Invalid Name</label>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      name="extension"
                      value={userState.firstName}
                      className="formItem"
                      onChange={(e) => {
                        setUserState((prevState) => ({
                          ...prevState,
                          firstName: e.target.value,
                        }));
                      }}
                      required="required"
                    />
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
                      value={userState.lastName}
                      className="formItem"
                      onChange={(e) => {
                        setUserState((prevState) => ({
                          ...prevState,
                          lastName: e.target.value,
                        }));
                      }}
                      required="required"
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="selectFormRow">Time Zone</label>
                    {userState.timeZoneMissing ? (
                      <label className="status missing">Select Timezone</label>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-12">
                    <select
                      className="formItem"
                      name=""
                      value={userState.timeZone}
                      onChange={(e) => {
                        setUserState((prevState) => ({
                          ...prevState,
                          timeZone: e.target.value,
                        }));
                      }}
                    >
                      <option>Select Time Zone</option>
                      {timeZone &&
                        timeZone.map((item, key) => {
                          return (
                            <option value={item[0]} key={key}>
                              {item[1]}
                            </option>
                          );
                        })}
                    </select>
                    <br />
                    <label htmlFor="data" className="formItemDesc">
                      Select the default time zone.
                    </label>
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="selectFormRow">Status</label>
                    {userState.statusMissing ? (
                      <label className="status missing">Select Status</label>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-12">
                    <select
                      className="formItem"
                      name=""
                      value={userState.status}
                      onChange={(e) => {
                        setUserState((prevState) => ({
                          ...prevState,
                          status: e.target.value,
                        }));
                      }}
                    >
                      <option>Choose Status</option>
                      <option value="E">Enable</option>
                      <option value="D">Disable</option>
                    </select>
                    <br />
                    <label htmlFor="data" className="formItemDesc">
                      Set the user's presence.
                    </label>
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="selectFormRow">Role Type</label>
                    {userState.typeMissing ? (
                      <label className="status missing">Select role Type</label>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-12">
                    <select
                      className="formItem"
                      name=""
                      value={userState.roleId}
                      onChange={(e) => {
                        setUserState((prevState) => ({
                          ...prevState,
                          type:
                            e.target.value === ""
                              ? ""
                              : role[e.target.value].id,
                          roleId: e.target.value,
                        }));
                        setSelectedRole(
                          e.target.value === "" ? "" : role[e.target.value].name
                        );
                        setSelectedPermission(
                          e.target.value === ""
                            ? ""
                            : role[e.target.value].permissions.map((item) => {
                                return item.permission_id;
                              })
                        );
                      }}
                    >
                      <option value="">Choose Type</option>
                      {role.map((item, key) => {
                        return <option value={key} key={key}>{item.name}</option>;
                      })}
                    </select>
                    <br />
                    <label htmlFor="data" className="formItemDesc">
                      Select Default to enable login or to disable login select
                      Virtual.
                    </label>
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="selectFormRow">Domain</label>
                    {userState.domainMissing ? (
                      <label className="status missing">Select Domain</label>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-12">
                    <select
                      className="formItem"
                      name=""
                      value={userState.domain}
                      onChange={(e) => {
                        setUserState((prevState) => ({
                          ...prevState,
                          domain: e.target.value,
                        }));
                      }}
                    >
                      <option>Choose Domain</option>
                      {domains &&
                        domains.map((item, key) => {
                          return (
                            <option value={item[0]} key={key}>
                              {item[1]}
                            </option>
                          );
                        })}
                    </select>
                    <br />
                    <label htmlFor="data" className="formItemDesc">
                      Select the Domain.
                    </label>
                  </div>
                </div>
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
                              <label>{item}</label>
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
        </section>
        {loading ? (
          <div colSpan={99}>
            <CircularLoader />
          </div>
        ) : (
          ""
        )}
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
    </>
  );
};

export default UsersEdit;
