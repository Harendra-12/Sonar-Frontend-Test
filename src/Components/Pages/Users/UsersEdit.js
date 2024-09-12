import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../../Loader/CircularLoader";
import { useForm } from "react-hook-form";
import {
  emailValidator,
  nameValidator,
  noSpecialCharactersValidator,
  requiredValidator,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import Header from "../../CommonComponents/Header";
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
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
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
            navigate("/roles");
          }
        }
        if (permissionData.status) {
          setLoading(false);
          setDefaultPermission(permissionData.data);
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
                role_id: role_id,
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
  }, [account, navigate, value]);

  const handleFormSubmit = handleSubmit(async (data) => {
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
      setTimeout(() => {
        navigate(-1); // Navigate back to the previous page
      }, 3000);
    } else {
      setLoading(false);
      const errorMessage = Object.keys(addUser.error);
      toast.error(addUser.error[errorMessage[0]][0]);
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
            <Header title="User Edit" />
            <div id="subPageHeader">
              <div className="col-6 my-1">
                <p className="p-0 m-0">
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
            </div>
          </div>
          <div className="col-xl-12" style={{ overflow: "auto" }}>
            {loading ? (
              <div colSpan={99}>
                <CircularLoader />
              </div>
            ) : (
              ""
            )}
            <div className="mx-2" id="detailsContent">
              <form action="#" className="row">
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Username</label>
                  </div>
                  <div className="col-12">
                    <input
                      type="text"
                      name="extension"
                      className="formItem"
                      {...register("username", { ...requiredValidator })}
                      disabled
                    />
                    {errors.username && (
                      <ErrorMessage text={errors.username.message} />
                    )}
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
                        ...nameValidator,
                        ...noSpecialCharactersValidator,
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
                      {...register("lastName", {
                        ...noSpecialCharactersValidator,
                      })}
                    />
                    {errors.lastName && (
                      <ErrorMessage text={errors.lastName.message} />
                    )}
                  </div>
                </div>
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
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="selectFormRow">Role Type</label>
                  </div>
                  <div className="col-12">
                    <select
                      className="formItem"
                      name=""
                      defaultValue={watch().role_id}
                      {...register("role_id", { ...requiredValidator })}
                      onChange={(e) => {
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
                              <label class="ms-2">{item}</label>
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
