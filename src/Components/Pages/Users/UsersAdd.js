import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../Misc/CircularLoader";
const UsersAdd = () => {
  const navigate = useNavigate();
  const [domains, setDomains] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState([]);
  const [selectedRole, setSelectedRole] = useState();
  const [defaultPermission, setDefaultPermission] = useState();
  const [selectedPermission, setSelectedPermission] = useState([]);
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
        const timeZ = await generalGetFunction(`/auth/timezones`);
        const apiRole = await generalGetFunction(`/roles`);
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
          if(apiRole.data.length>0){
            setRole(apiRole.data);
          }else{
            toast.error("Please add Role first")
            setTimeout(()=>{
              navigate("/roles")
            },3000)
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
    if (userState.userName.length > 2) {
      setUserState((prevState) => ({
        ...prevState,
        useNameValidation: true,
      }));
      const parsedData = {
        username: userState.userName,
      };
      const userName = await generalPostFunction("/check/username", parsedData);
      if (userName.status) {
        setUserState((prevState) => ({
          ...prevState,
          isUserNameAvailable: true,
        }));
        setUserState((prevState) => ({
          ...prevState,
          useNameValidation: false,
        }));
      } else {
        setUserState((prevState) => ({
          ...prevState,
          isUserNameAvailable: false,
        }));
        setUserState((prevState) => ({
          ...prevState,
          useNameValidation: false,
        }));
      }
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
  }, [userState.userName]);

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
    if (userState.password.length > 3) {
      setUserState((prevState) => ({
        ...prevState,
        passwordMissing: false,
      }));
    } else {
      setUserState((prevState) => ({
        ...prevState,
        passwordMissing: true,
      }));
    }
    if (userState.password === userState.cPassword) {
      setUserState((prevState) => ({
        ...prevState,
        cPasswordMissing: false,
      }));
    } else {
      setUserState((prevState) => ({
        ...prevState,
        cPasswordMissing: true,
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
      userState.password.length > 3 &&
      userState.password === userState.cPassword &&
      userState.email.length > 3 &&
      userState.email.includes("@") &&
      !(
        userState.timeZone === "" || userState.timeZone === "Select Time Zone"
      ) &&
      !(userState.status === "" || userState.status === "Choose Status") &&
      !(userState.type === "" || userState.type === "Choose Type") &&
      !(userState.domain === "" || userState.domain === "Choose Domain") &&
      userState.firstName.length > 3 &&
      userState.firstName.length < 20 &&
      userState.isUserNameAvailable
    ) {
      setLoading(true);
      const parsedData = {
        name: userState.firstName + " " + userState.lastName,
        email: userState.email,
        password: userState.password,
        username: userState.userName,
        // group_id: userState.groups,
        domain_id: userState.domain,
        timezone_id: userState.timeZone,
        status: userState.status,
        // usertype: userState.type,
        account_id: account.account_id,
        permissions: selectedPermission,
        role_id: userState.type,
      };
      const addUser = await generalPostFunction("/user/create", parsedData);
      if (addUser.status) {
        setUserState({
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
        });
        toast.success(addUser.message);
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(addUser.message);
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
  const handleCheckboxChange = (id) => {
    if (selectedPermission.includes(id)) {
      setSelectedPermission(selectedPermission.filter((item) => item !== id));
    } else {
      setSelectedPermission([...selectedPermission, id]);
    }
  };
  const filteredPermission = filterPermissionById(
    defaultPermission,
    account.permissions
  );
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
                    ) : userState.isUserNameAvailable ? (
                      <label className="status success">
                        Username Available
                      </label>
                    ) : (
                      <label className="status fail">Not Available</label>
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
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Password</label>
                    {userState.passwordMissing ? (
                      <label className="status missing">Invalid Password</label>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-12">
                    <input
                      type="password"
                      name="extension"
                      value={userState.password}
                      className="formItem"
                      onChange={(e) => {
                        setUserState((prevState) => ({
                          ...prevState,
                          password: e.target.value,
                        }));
                      }}
                      required="required"
                    />
                    <br />
                    <label htmlFor="data" className="formItemDesc">
                      Required: At least 4 character
                    </label>
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Confirm Password</label>
                    {userState.cPasswordMissing ? (
                      <label className="status missing">
                        Password not matched
                      </label>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-12">
                    <input
                      type="password"
                      name="extension"
                      value={userState.cPassword}
                      className="formItem"
                      onChange={(e) => {
                        setUserState((prevState) => ({
                          ...prevState,
                          cPassword: e.target.value,
                        }));
                      }}
                      required="required"
                    />
                    <br />
                    <label htmlFor="data" className="formItemDesc">
                      Green field borders indicate typed passwords match.
                    </label>
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
                      {/* <option value="avail">Available</option>
                                                <option value="aod">Available(On Demand)</option>
                                                <option value="logout">Logged Out</option>
                                                <option value="break">On Break</option>
                                                <option value="dnd">Do Not Disturn</option> */}
                      <option value="E">Enable</option>
                      <option value="D">Disable</option>
                    </select>
                    <br />
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
                      value={role[userState.type]}
                      onChange={(e) => {
                        setUserState((prevState) => ({
                          ...prevState,
                          type: role[e.target.value].id,
                        }));
                        setSelectedRole(role[e.target.value].name);
                        setSelectedPermission(
                          role[e.target.value].permissions.map((item) => {
                            return item.permission_id;
                          })
                        );
                      }}
                    >
                      <option>Choose Type</option>
                      {role.map((item, key) => {
                        return <option value={key}>{item.name}</option>;
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
                {/* <div className="formRow col-xl-3 d-flex align-items-center">
                <div className="col-12">
                  <button
                    className="panelButton"
                    effect="ripple"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Add User
                  </button>
                  <br />
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
                      Object.keys(filteredPermission).map((item, key) => {
                        return (
                          <div className="permissionListWrapper" key={key}>
                            <div className="header d-flex align-items-center">
                              <div className="col-5">{item}</div>
                            </div>
                            <div className="row px-2 pt-1 border-bottom">
                              {filteredPermission[item].map(
                                (innerItem, key) => {
                                  return (
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
                                  );
                                }
                              )}
                            </div>
                          </div>
                        );
                      })}
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

export default UsersAdd;
